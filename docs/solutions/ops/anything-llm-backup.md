---
title: AnythingLLM 自部署：能恢复
description: 国内服务器上用官方 docker compose 自部署 AnythingLLM，怎样让它起得来，以及怎样做出经过真恢复验证的备份。
---

# AnythingLLM 自部署：能恢复

AnythingLLM 的加密密钥不在数据目录里，而在宿主机的 `docker/.env` 中（`SIG_KEY` 与 `SIG_SALT`）。只备份 storage 目录的部署，恢复出来的数据可能解不开。下面依次说明怎样让它起得来、备份该覆盖什么，以及怎样用逐文件哈希和逐表行数证明备份能恢复。

## 先让它起得来

上游 compose 第 8 至 15 行是 `build` 而不是 `image`，默认要在本机构建。也可以改用上游发布的同版本镜像 `mintplexlabs/anythingllm:1.17.0`（Docker Hub），实例验证用的就是它。该镜像与本 tag 的 Dockerfile 构建结果是否逐层一致，未核实。

源码构建时，构建期要访问 deb.nodesource.com、github.com、astral.sh（`docker/Dockerfile` 第 24、29、33 行），webassets.anythingllm.com（第 64 行，arm64 分支），storage.googleapis.com（第 160 行）。这些地址的国内可达性未核实。基础镜像 `ubuntu:noble-20251013`（第 2 行）与 `node:18-slim`（第 141 行）的拉取加速也未核实。

上游文档有准备步骤，但有几处要补：

- `docker/HOW_TO_USE_DOCKER.md` 第 153 行要求先 touch `server/storage/anythingllm.db`；第 148 行说明容器以 UID/GID 1000 运行。
- `collector/outputs` 不在上游仓库里。不先建出来，docker 会以 root 自动创建，容器就写不进去。`collector/hotdir` 一并建出。
- `docker/.env` 必须对 1000 可写。应用启动时要把自动生成的密钥写回这个文件，写不进去就 EACCES 崩溃。

准备命令在 `docker/` 目录下执行，假定 `docker/.env` 已经存在：

```bash
mkdir -p ../collector/hotdir ../collector/outputs && touch ../server/storage/anythingllm.db && chown -R 1000:1000 ../server/storage ../collector/hotdir ../collector/outputs .env
```

## 最容易漏的东西：密钥写在 .env 里

应用首次启动时会自动生成 `SIG_KEY` 与 `SIG_SALT`（键名见 `server/utils/EncryptionManager/index.js` 第 7、8 行，第 42 行经 dumpENV 写文件），写回容器内的 `/app/server/.env`。这个文件由 compose 第 19 行 bind 挂载，宿主侧就是 `docker/.env`，**不在 storage 目录里**。`docker/.env` 里还有 `AUTH_TOKEN`（env 第 411 行）、`JWT_SECRET`（env 第 7 行）和各供应商凭据。

只备份 storage 的部署，恢复后用这对密钥加密的数据解不开（具体覆盖哪些数据未逐项核实）。storage 下另有一个 `comkey` 目录，它是否也参与加密，未核实。

所以要做两件事：

- `docker/.env` 与快照分开存放，并且加密备份。
- 检查这对密钥确实已写入，两条都应输出 1：

```bash
grep -c '^SIG_KEY=' docker/.env
grep -c '^SIG_SALT=' docker/.env
```

恢复后 `AUTH_TOKEN` 等值是否须与备份时一致，未核实。

## 备份覆盖面

快照覆盖的内容：

- 整个 `server/storage` 目录。compose 第 20 行把它挂载到 `/app/server/storage`，与 env 第 2 行 `STORAGE_DIR` 一致。
- SQLite 库 `server/storage/anythingllm.db`（`server/prisma/schema.prisma` 第 13 至 15 行声明 provider sqlite）。快照走 SQLite 在线备份 API，WAL 中未 checkpoint 的数据也会进入副本，`-wal` 与 `-shm` 不单独打包。
- storage 下的其余子目录（上传文档、向量数据等）同样随整目录打包，但上游未列出其子路径，清单不写死。

一致性有边界。快照工具逐文件顺序读取，不对整目录加锁。备份期间如果服务还在写其他文件，各文件之间可能不一致。内置向量库跨文件的一致性未核实。

不覆盖的项：

- `docker/.env`：含 `AUTH_TOKEN`、`JWT_SECRET`、`SIG_KEY`、`SIG_SALT` 与供应商凭据，不在 storage 内，须另行备份。
- 外部向量库的数据：仅启用外部库时存在，不在快照内。默认 VECTOR_DB 是否为内置 LanceDB，未核实。
- collector 的 hotdir 与 outputs（compose 第 21、22 行）：不在 storage 之下，内容性质与可丢失性未核实。
- 嵌入模型缓存：位置未核实。若在 storage 内，整目录快照会把它一并打包，体积影响未核实。
- 镜像与构建期下载（Dockerfile 第 24、29、33、64、160 行）：镜像内容不属于数据。

## 怎么证明备份能恢复

判据只有一条：把快照解到临时目录，逐文件重算 sha256，SQLite 逐表 `count(*)` 对账。输出 PASS，且 files 与 sqlite_tables 的前后两值都相等，才算备份可用。快照文件存在、tar 列表正常，都不算。

实例验证在一台国内服务器上做的。按钉死的 1.17.0 tag 取上游 compose 原样启动，只去掉了端口发布。结果如下：

- 演练 PASS：13/13 个文件哈希一致，34/34 张 SQLite 表行数一致；应用状态 running (healthy)。
- 负对照：解包后改坏一个文件，判据报 FAIL，12/13。判据能区分好恢复和坏恢复。

这组数字有边界：实例没有建工作区和文档，行数只来自初始化，证明的是文件与库层面，不是业务数据。

判据本身踩过一个坑。第一次运行时应用已经崩溃退出，但数据目录（上游自带文件加一个空库）照样演练 PASS。这是假阳性，结果已作废。此后我们的验证流程新增一道闸：应用必须在运行。只看数据目录，判据对应用是否能用毫无感知，所以两者必须同时成立。

应用侧的检查：`docker inspect anythingllm` 的 State.Health.Status 应为 healthy；宿主机请求 `http://127.0.0.1:3001/api/ping` 应返回 200（端口默认值见 env 第 1 行 `SERVER_PORT`）。但 /api/ping 为 200 只说明 HTTP 服务在线，向量库与嵌入引擎是否可用，这两项未探测。每次演练的结果行必须为 PASS 才算数。

## 需要有人每月替你做这件事？

如果你不想自己维护这套备份和演练，可以交给我们：每月在你的服务器上做一次真恢复演练、逐表对账、出报告。

联系方式：<!-- 联系方式待补 -->
