---
title: Flowise 自部署：起得来，能恢复
description: 国内服务器上用官方 docker compose 自部署 Flowise，怎样让它起得来，以及怎样做出经过真恢复验证的备份。
---

# Flowise 自部署：起得来，能恢复

按官方 `.env.example` 原样部署，Flowise 3.1.4 会起不来，容器进入崩溃循环。原因是上游要求的四个路径变量在模板里只是注释，没有设置。

起来之后，备份文件存在也不代表能用。下面先说怎样让它起得来，再说备份应该包含什么，最后用逐文件哈希和逐表行数判断备份能不能恢复。

## 先让它起得来

上游 `docker/README.md` 第 14 至 19 行要求在 `.env` 里设置 `DATABASE_PATH`、`LOG_PATH`、`SECRETKEY_PATH`、`BLOB_STORAGE_PATH` 四个变量。不设时的崩溃链条如下：

1. 上游 compose 第 32 行写的是 `LOG_PATH=${LOG_PATH}`，变量未设时容器里拿到的是空串。
2. `packages/server/src/utils/config.ts` 第 10 行用 `??` 取默认值。`??` 只对 null 和 undefined 生效，空串会原样通过。
3. `logger.ts` 第 21 至 22 行对这个空路径创建目录，抛出 ENOENT。
4. 进程退出，容器反复重启，形成崩溃循环。

所以 `.env` 里要加这四行，路径指向容器内的数据目录：

```
DATABASE_PATH=/home/node/.flowise
LOG_PATH=/home/node/.flowise/logs
SECRETKEY_PATH=/home/node/.flowise
BLOB_STORAGE_PATH=/home/node/.flowise/storage
```

容器以 node 用户（UID 1000）运行，上游 compose 第 163 至 164 行注释要求宿主目录可由 1000 写入。部署前先把宿主目录交给它：

```bash
mkdir -p "$HOME/.flowise"
chown 1000:1000 "$HOME/.flowise"
```

## 国内网络部署要点

compose 第 5 行用的是 `flowiseai/flowise:latest`，这是浮动标签。2026-10-12 实测，Docker Hub 上 `latest` 与 `3.1.4` 的 digest 已经不同，标签指向的内容变了。应把镜像改成固定版本，并在改动前后各执行一次下面的命令，第二次把标签换成固定版本：

```bash
docker compose config --images
docker image inspect --format '{{index .RepoDigests 0}}' flowiseai/flowise:latest
```

镜像拉取也慢。daemon 经 registry-mirrors 拉取时只有几十 KB/s，且多次停住。直连国内镜像站 `docker.1ms.run` 能到 MB 级，但同一个镜像站在同一天里也降到过几十 KB/s，所以这种情况下需要断点续传。

## 备份什么、密钥在哪

备份对象是整个数据目录。compose 第 165 行把宿主的 `~/.flowise` 挂载到容器内的 `/home/node/.flowise`，目录里有：

- `database.sqlite`：`DATABASE_TYPE` 未设时走默认分支，即 SQLite（DataSource.ts 第 90 至 94 行）。
- `encryption.key`：凭据加密密钥。`SECRETKEY_PATH` 未设时位于数据目录（utils/index.ts 第 1584 至 1586 行）。丢了它，恢复出的凭据全部无法解密，所以它必须在快照里。
- 三个认证密钥文件 `jwt_auth_token_secret.key`、`jwt_refresh_token_secret.key`、`token_hash_secret.key`，启动时生成。`TOKEN_HASH_SECRET` 等未由环境变量设置时，也落在这个目录（utils/index.ts 第 1670 行，env.example 第 31 行）。
- `storage`：上传文件，`STORAGE_TYPE` 为 local 时在这里（storageUtils.ts 第 53 行，compose 第 43 行）。

以下几项不在快照内，需要另行处理：

- 外部数据库：`DATABASE_TYPE` 设为 postgres、mysql 或 mariadb 时，本方案不适用。
- Redis 与队列模式（MODE、REDIS_URL 等）：数据不在快照里。
- 对象存储上的上传文件：`STORAGE_TYPE` 为 s3、gcs 或 azure 时，文件不在数据目录里。
- 指向数据目录之外的路径：`SECRETKEY_PATH`、`DATABASE_PATH`、`BLOB_STORAGE_PATH` 若设到 `~/.flowise` 之外，这些目录不在快照里（compose 第 23、11、44 行），须另行备份。
- 日志：按本文的设置，日志目录在数据目录里，随快照一起备份；若把 `LOG_PATH` 指到别处，需另行处理。
- 宿主机部署目录的 `.env` 和 compose 文件。其中可能有 `FLOWISE_SECRETKEY_OVERWRITE` 与各服务口令（compose 第 24 行，env.example 第 25 行）。密钥若由该变量提供，`.env` 必须单独备份。

## 怎么证明备份能恢复

判据只有一条：把快照解包到临时目录，逐文件比对 sha256，对 SQLite 做 integrity_check，再逐表对账行数。文件存在、解包成功、库能打开，都不算备份可用。这个演练不启动 Flowise 进程，不做功能验证。库文件由 SQLite 在线备份 API 导出，不直接拷贝正在写入的文件。

我们在一次性实例上做过验证：按钉死的 3.1.4 tag 取上游 docker 目录原样启动，按上游 README 设好四个路径，只去掉了端口发布，然后依次跑备份和演练。结果如下：

- 演练 PASS：9/9 个文件哈希一致，29/29 张 SQLite 表行数一致。
- 负对照：解包后故意改坏一个文件，判据报 FAIL，8/9。判据能区分好恢复和坏恢复，PASS 才有参考价值。

这组数字有局限。实例上没有建任何凭据和工作流，表里的行数只来自初始化。凭据的加解密路径没有在实例上走过。所以它证明的是文件和数据库层面能恢复，并不证明业务数据能恢复。

判据本身也踩过坑。最初只看文件数是否稳定，60 秒时数据目录里只有日志，判据过早放行。密钥断言报 missing，拦下了这次没有意义的 PASS，之后改为等 `database.sqlite` 出现再判。

为什么要断言密钥文件？对账只比较数据库和普通文件。如果快照里缺了 `encryption.key`，哈希和行数照样一致，演练照样 PASS，但恢复出来的凭据无法解密。所以判据要显式确认密钥文件确实在快照里。

## 需要有人每月替你做这件事？

如果你不想自己维护这套备份和演练，可以请我们代为每月执行一次：在你的服务器上做真实恢复，逐表对账，出一份报告。我们不搬迁你的生产数据，异地副本放在你指定的位置。

联系方式：<!-- 联系方式待补 -->
