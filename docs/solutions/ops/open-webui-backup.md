---
title: Open WebUI 备份：能恢复才算备份
description: 国内服务器自部署 Open WebUI 时，密钥不在数据卷里要单独保管，备份能不能用要靠逐文件、逐表的真恢复对账来判断。
---

# Open WebUI 备份：能恢复才算备份

数据目录里有 SQLite 库、上传文件和嵌入模型缓存，打成 tar 放到别处，看上去就是一份备份。但文件能解开，不代表应用能用这份数据启动。密钥也不在这个目录里，是最容易漏掉的一环。下面按部署顺序讲，最后说怎样证明备份可用。

## 国内网络部署要点

**镜像拉取。** `ghcr.io/open-webui/open-webui` 来自境外仓库。Docker 守护进程的 registry-mirrors 只对 Docker Hub 生效，对 ghcr.io 不起作用。我们在国内实例上实测过两条路：经某国内 ghcr 缓存由守护进程拉取，速度只有几十 KB/s，直连其 blob 地址返回 403；改为直连南京大学镜像站 ghcr.nju.edu.cn，速度约 14 MB/s，用一个不经守护进程、直连镜像站下载各层并校验 sha256 的小脚本拉取，再 docker load，约 2.1 GB 的镜像数分钟内落地，不需要改守护进程的代理配置。

**版本钉死。** 上游 compose 的镜像 tag 默认是分支标签 main，它指向的内容会随上游提交变化。2026-10-12 我们在 ghcr 上核对到 main 与 v0.12.0 的 digest 已经不同。做法是在 .env 中设置 `WEBUI_DOCKER_TAG=v0.12.0`，再用 <code v-pre>docker inspect -f '{{.Config.Image}}' open-webui</code> 确认输出里没有 `:main`。

**启动时的 HuggingFace 等待。** 镜像自带默认嵌入模型，启动时复制到数据目录的 cache/ 下，约 265 MB，其中含 30 个符号链接。但启动阶段仍会访问 HuggingFace。国内 DNS 把该域名解析到不可达地址，连接停在 SYN-SENT，应用因此多等约 2 分 15 秒，之后自行恢复。OFFLINE_MODE 默认为 false，开启后会关闭版本检查（ENABLE_VERSION_UPDATE_CHECK 默认为 true）并设置 HF_HUB_OFFLINE。上游 compose 不会把 OFFLINE_MODE 传进容器，需要在你的 compose environment 中显式加入。它能否消除这段等待，我们未在实例上单独验证。

**端口收口。** compose 把 `${OPEN_WEBUI_PORT-3000}` 映射到容器 8080，没有限定宿主网卡，默认绑定所有地址。若要对公网开放，前面必须有反向代理，并把 `FORWARDED_ALLOW_IPS` 设为代理地址。上游默认值 `*` 会信任所有转发头。

## 最容易漏的东西：密钥不在数据卷里

数据目录 /app/backend/data 对应宿主机的命名卷，默认数据库是其中的 webui.db。但上游启动脚本在未配置密钥时，会把自动生成的密钥写到 /app/backend/.webui_secret_key。这个文件位于容器的可写层，不在数据卷里，所以数据目录的快照不会包含它。

按上游启动脚本的写法，容器重建后这个密钥就丢了，已经加密的内容和会话随之失效（这一点来自读脚本，我们未在实例上做重建验证）。env.py 中 OAuth 加密密钥默认取的正是 `WEBUI_SECRET_KEY`（第 879 至 881 行）。

做法分两步：

1. 显式设置 `WEBUI_SECRET_KEY`。上游 compose 第 25 行已向容器传入这个变量，默认值为空。显式设置后，密钥由你掌握，不再依赖容器内的自动生成文件。已显式设置时，同样要把该值单独加密备份。
2. 如果没有显式设置，就把自动生成的文件取出来，加密后与数据目录备份分开保管，并在工单中记录：

```bash
docker exec open-webui sh -c 'test -s /app/backend/.webui_secret_key && echo present'
docker cp open-webui:/app/backend/.webui_secret_key <加密保管目录>/
```

输出 present 才说明文件存在且非空。

## 怎么证明备份能恢复

备份时，SQLite 通过在线备份 API 取一致副本，不依赖 WAL 文件。整个数据目录打包，同时记录每个文件的 sha256、每张表的行数，以及符号链接的目标。

演练时，把快照解到临时目录，逐文件重算 sha256，多出、缺失、内容不等任何一项都判 FAIL；对 SQLite 做 integrity_check；逐表执行 count(*)，与快照清单比对；核对符号链接目标。注意这只证明快照自洽，不证明应用能用这份数据启动。文件存在或 tar 可读，都不算备份可用。

我们在国内实例上按上游 compose 原样启动（WEBUI_DOCKER_TAG 钉到 v0.12.0，跳过只放模型文件的 ollama），注册首个用户后跑备份与演练，结果为 PASS：85/85 个文件哈希一致，68/68 张 SQLite 表行数一致，30/30 个符号链接目标一致。

PASS 本身不够，判据也要验证。我们把解包后的一个文件改坏，同一判据报 FAIL，结果为 84/85。判据能区分好恢复与坏恢复，PASS 才有参考价值。

数据目录体积方面，cache/ 约 265 MB，webui.db 约 0.7 MB。模型在国内不易重新下载，整目录快照把它一起保住，代价是体积，体积敏感时需另行评估。引擎这边也修过一个问题：符号链接曾被打进快照，演练却拒收，指向目录的链接还会被漏掉。这是「自己打的包自己验不了」，我们的快照工具已修复并补了自测。

## 需要有人每月替你做这件事？

不想自己维护这套备份与演练的团队，可以交给我们做受托运维。我们按清单中的检查项，每月在你的服务器上跑一次真恢复演练，状态文件与命令输出随运维工单留存。

联系方式：<!-- 联系方式待补 -->
