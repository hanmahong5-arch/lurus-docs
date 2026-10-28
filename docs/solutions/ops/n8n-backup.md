---
title: n8n 自部署备份：能恢复才算备份
description: 国内服务器自部署 n8n（官方 compose + Postgres）时，数据库 dump 与加密密钥卷如何成对备份，以及怎样用逐表对账判断备份能不能恢复。
---

# n8n 自部署备份：能恢复才算备份

很多人手里都有 n8n 的备份文件，但从没验证过它能不能恢复。文件存在、gzip 校验通过、`pg_restore -l` 列出了条目，这些都不能证明数据回得来。下面说明国内服务器上官方 compose 方案的备份怎么做，以及怎样用逐表对账判断它能不能用。

## 国内网络部署要点

**镜像拉取。** `postgres:18` 与 `n8nio/runners` 来自 Docker Hub，可以走 daemon 的 registry-mirrors 加速。n8n 主镜像来自 `docker.n8n.io`，registry-mirrors 对它不生效，国内直拉会卡住（我们实测 `docker compose up` 等了 15 分钟仍没拉完这一个镜像）。2026-10-12 的实测显示，`docker.n8n.io` 的鉴权委托给 Docker Hub 上的同名仓库 `n8nio/n8n`（401 响应的 realm 指向 auth.docker.io）。因此可以从 Docker Hub 拉同一 tag，再打成 compose 期望的名字。版本取自 `N8N_VERSION`，以 2.42.4 为例：

```bash
docker pull n8nio/n8n:2.42.4
docker tag n8nio/n8n:2.42.4 docker.n8n.io/n8nio/n8n:2.42.4
```

打完标签后 compose 原样即可启动。替代镜像与官方镜像的内容是否逐位一致，未核实；我们的依据是实例能按原 compose 跑通。

**出站与对外地址。** 上游 compose 与 .env 中没有版本检查、遥测或对外 URL 相关的配置项。n8n 实际访问哪些外部地址未核实，首次部署时要在宿主机防火墙层面观察出站目标。第三方回调能否到达，取决于你侧的反代与域名，同样未核实。

**端口收口。** 5678 在 compose 中对宿主机所有接口发布，没有指定绑定地址。公网环境必须在前置反代或防火墙处收口。runner 的任务代理端口 5679 没有发布到宿主机，只在 compose 网络内可达，但 broker 监听 0.0.0.0，靠 `N8N_RUNNERS_AUTH_TOKEN` 鉴权。

**.env 口令必须改。** 示例值 `changeUser`（即 `POSTGRES_USER` 的示例值）、`changePassword`、`changeRunnerAuthToken` 都要替换。上线前执行 `grep -c '=change' .env`，结果必须为 0。`.env` 里还有 `RUNNERS_AUTH_TOKEN`，它不在数据库备份范围内，要另行加密保管。

## 最容易漏的东西：加密密钥

n8n 把凭据加密后存进 Postgres，但加密密钥不在数据库里。上游 compose 与 .env 中没有加密密钥的配置项，密钥存放在 `n8n_storage` 卷内：该卷挂载到容器的 `/home/node/.n8n`，卷根下的 `config` 文件保存着 `encryptionKey`。

只备份数据库、丢了这个卷，库里所有已保存的凭据都无法解密，数据库本身能恢复也没有用。反过来，只留卷、没有数据库 dump 也不完整。两者必须成对保存，只留其一等于不可用的备份。

还有一个容易误操作的地方：`docker compose down -v` 会连 `n8n_storage` 一起删除，凭据随之全部不可读。上线后把这条列为禁止操作。

备份时，数据库部分通过 `docker exec` 进入 postgres 容器执行 pg_dump，采用 plain 格式并加上 `--no-owner --no-privileges`，然后 gzip 压缩。导出用户取 `POSTGRES_USER`，因为上游 README 就是用它执行 pg_dumpall 的。数据目录用 rsync 同步到备份目录的 files 子目录。卷的宿主路径由脚本按 n8n 容器的 `/home/node/.n8n` 挂载解析，不要按 `/var/lib/docker` 手拼，因为 docker 数据根可能已经被改过。

## 怎么证明备份能恢复

判据只有一条：把备份真正恢复到一次性、断网的容器里，逐表对账。

对账要满足两点。第一，期望行数取自 dump 文件本身，实际行数取自恢复后的 `count(*)`。如果期望值也取自恢复后的库，对账就成了自己和自己比较。第二，文件存在、gzip 校验、`pg_restore -l` 列表都不算备份可用，它们只能说明文件没坏，不能说明数据能回来。对账之外，还要确认备份里存在 `files/config` 这个密钥文件。

2026-10-12 在实例上验证的结果如下。实例使用上游 compose 原样启动，经首次安装接口建好 owner 后，依次执行备份脚本与恢复演练：148/148 张表、1264/1264 行一致，恢复耗时 6 秒。耗时只代表这个小实例，数据量不同结果不同。

只有通过的结果还不够，判据本身也要验证。我们做了一次负对照：把 dump 截掉后一半，再用同一判据对账，结果是 140/148 张表、175/1264 行，判据报出 FAIL。负对照的意义在这里：如果判据对坏恢复也报 PASS，它就什么都没证明。PASS 与 FAIL 都能被给出，PASS 才有参考价值。

## 需要有人每月替你做这件事？

如果你的团队不想自己维护这套备份与演练，我们提供开源 AI 系统的受托运维服务：在你自己的服务器上，每月做一次真恢复演练，逐表对账并出报告。服务不迁移你的生产数据，异地备份放在你指定的位置。

联系方式：<!-- 联系方式待补 -->
