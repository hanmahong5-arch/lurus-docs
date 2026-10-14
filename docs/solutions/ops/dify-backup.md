---
title: Dify 自部署备份：能恢复才算备份
description: 国内服务器自部署 Dify（官方 docker compose）时，数据库 dump 与 storage 目录如何成对备份，以及怎样用逐表对账判断备份能不能恢复。
---

# Dify 自部署备份：能恢复才算备份

很多人手里都有 Dify 的数据库备份文件，却从没验证过它能不能恢复。文件存在、gzip 校验通过，都不能证明数据回得来。下面说明国内服务器上官方 compose 方案的备份怎么做，以及怎样用逐表对账判断它能不能用。

## 国内网络部署要点

Dify 的大多数镜像在 Docker Hub，可以走 daemon 的 registry-mirrors 加速。weaviate 镜像例外，它来自 cr.weaviate.io，registry-mirrors 对它不生效。

该源的鉴权委托给 Docker Hub 上的同名仓库 `semitechnologies/weaviate`（401 响应的 realm 指向 auth.docker.io），因此可以从 Docker Hub 拉同一 tag，再打成 compose 期望的名字。下面以 1.39.2 为例，实际 tag 必须与你 compose 里 weaviate 服务的镜像 tag 一致：

```bash
docker pull semitechnologies/weaviate:1.39.2
docker tag semitechnologies/weaviate:1.39.2 cr.weaviate.io/semitechnologies/weaviate:1.39.2
```

打完标签后 compose 原样即可启动。替代镜像与官方镜像内容是否逐位一致，未核实；依据是实例能按原 compose 跑通。

镜像加速未命中时，守护进程会回落到 registry-1.docker.io。在出网受限的主机上，这一步表现为 TLS handshake timeout。实测中重试数轮后镜像才全部拉齐，第一次超时不代表方案失败。

其余要点多数未核实，照实记录：

- 沙箱 pip 源 `PIP_MIRROR_URL`，上游默认为空，生效方式未核实。
- 插件市场 `MARKETPLACE_ENABLED` 与 `MARKETPLACE_API_URL` 默认指向上游官方地址，国内可达性未核实。
- 版本检查 `CHECK_UPDATE_URL` 默认指向上游官方地址，能否关闭未核实。
- 出站经内置 ssrf_proxy，由 `SSRF_PROXY_HTTP_URL` 与 `SSRF_PROXY_HTTPS_URL` 指定；内网地址放行由 `SSRF_PROXY_ALLOW_PRIVATE_IPS` 控制。
- 模型供应商接入点上游没有对应配置项，需在产品内逐项配置，具体方式未核实。

## 最容易漏的东西：密钥在文件目录里，不在数据库里

数据库里加密存放的凭据，解密密钥并不在数据库里。备份时最容易漏的是两样东西，它们都在 api 容器挂载的 `./volumes/app/storage` 目录下。

第一样是 `.dify_secret_key`。上游注释写明，`SECRET_KEY` 留空时自动生成，并持久化在 storage 目录（env.example 第 33 至 34 行）。如果你在 `.env` 里显式设置了 `SECRET_KEY`，密钥就在 `.env` 里，必须另行备份 `.env`。

第二样更容易被忽略：每个租户一把 RSA 私钥，路径是 `privkeys/<租户ID>/private.pem`。建租户时生成并存入 storage（api/libs/rsa.py 第 30 至 39 行），解密时从 storage 读取（同文件第 66 至 73 行）。core/helper/encrypter.py 第 24 行的 decrypt_token 用它解密租户凭据，模型供应商密钥等都经由此路径解开。

只备份数据库、丢了 storage，库里加密存放的凭据就全部解不开，数据库恢复得再完整也没有用。只留 storage 而没有数据库 dump，同样谈不上恢复。数据库 dump 与 storage 目录必须成对保存，只留其一的备份不可用。

## 备份覆盖面要说清楚

当前方案覆盖两部分：数据库 `dify`（服务 `db_postgres`，镜像 postgres:15-alpine，经 docker exec 执行 plain 格式的 pg_dump 后 gzip），以及 storage 目录（rsync 到备份目录的 files 子目录）。下面这些组件不在覆盖范围内，需要你自己评估：

- 库 `dify_plugin`：plugin_daemon 使用，与 dify 同实例，但本清单未覆盖。
- redis：队列与缓存，非关系型数据，不在 pg_dump 内。
- weaviate 向量库：索引重建成本未核实。
- 插件卷 `./volumes/plugin_daemon`：插件包与工作目录，备份只覆盖 api 存储。
- agent 沙箱卷与沙箱依赖卷：沙箱运行环境，本清单未覆盖。
- TLS 证书卷 `./volumes/certbot`：本清单未覆盖。
- 宿主机 `docker/.env` 与 `docker/envs/`：可能含显式设置的 `SECRET_KEY` 与各服务口令。

另外，若改用 MySQL，本方案整体不适用。

## 怎么证明备份能恢复

判据只有一条：把备份真正恢复到一次性容器，逐表对账。期望行数取自 dump 文件本身，实际行数取自恢复后的 `count(*)`。如果期望值也取自恢复后的库，对账就成了自己和自己比较。文件存在、gzip 校验通过都不算备份可用，它们只能说明文件没坏，不能说明数据能回来。对账之外，还要确认备份里两个密钥文件都在。

我们在一台国内服务器的实例上做过验证：实例按上游 compose 原样启动，经首次安装接口建好管理员后，依次执行备份脚本与恢复演练，结果是 144/144 张表、12/12 行一致，恢复耗时 9 秒。这个实例是新装的，只有管理员、租户等少量业务行，行数对账在真实数据上才有分量；9 秒也只代表这个小实例。

只有 PASS 还不够，判据本身也要验证。我们把 dump 截掉后一半，再用同一判据对账，结果是 140/144 张表、3/12 行，判据报出 FAIL。如果判据对坏恢复也报 PASS，它就什么都没证明。PASS 与 FAIL 都能被给出，PASS 才有参考价值。

同一次验证中，`.dify_secret_key` 与 `privkeys/<租户ID>/private.pem` 都在备份的 files 子目录内。

## 需要有人每月替你做这件事？

如果团队不想自己维护这套备份与演练，可以外包给我们：每月在你自己的服务器上做一次真恢复演练，逐表对账并出报告。生产数据不迁出你的环境，异地备份放在你指定的位置。

联系方式：<!-- 联系方式待补 -->
