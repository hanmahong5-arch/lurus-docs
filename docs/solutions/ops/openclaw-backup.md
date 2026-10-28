---
title: OpenClaw 自部署：能恢复
description: 国内服务器上用上游 docker compose 自部署 OpenClaw，怎样无人值守地让它起得来，以及怎样做出经过真恢复验证的备份。
---

# OpenClaw 自部署：能恢复

OpenClaw 的状态是一整棵文件树，核心配置 openclaw.json 与模型供应商密钥都在里面。只拷一下目录的备份，恢复出来能不能启动、密钥能不能用，都是未知数。下面依次说明怎样让它起得来、备份该覆盖什么、哪些东西必须另外备份，以及怎样用逐文件哈希和逐表行数证明备份真能恢复。

## 先让它起得来

上游 compose 默认从源码构建，镜像名是 `openclaw:local`（compose 第 3 行）。也就是说，第一次部署要在本机完整构建一遍。若不想构建，用 `OPENCLAW_IMAGE` 指向上游发布的预构建镜像，例如 `ghcr.io/openclaw/openclaw:2026.10.2`，也可以用 Docker Hub 上的 `openclaw/openclaw`。

上游文档（docs/install/docker.md 的「Headless bootstrap」，第 172 至 195 行）给出了无人值守路径。照着做，需要补齐的步骤大致是：

- 建状态目录及其子目录（identity、agents/main/agent、agents/main/sessions、workspace），并把 auth profile 密钥目录一起建出来，然后 chown 给容器内 node 用户（uid 1000）。不做这一步，容器写不进去。
- 生成网关令牌，写进 .env 的 `OPENCLAW_GATEWAY_TOKEN`。
- 执行 `onboard --non-interactive`，写入模型供应商配置。
- 用 `config set` 固定 gateway.mode 与 gateway.bind。
- 只启动 openclaw-gateway。openclaw-cli 是一次性的交互式命令行工具，无参数启动会直接退出；上游的 setup.sh 也只起网关。

还有一个坑：`OPENCLAW_CONFIG_DIR` 未设时，宿主机数据目录默认取 HOME 下的 .openclaw。HOME 未设时会落到 `/tmp/.openclaw`，这个目录会被系统清理，数据可能无声消失。部署前先确认 HOME 有值，或者显式设置 `OPENCLAW_CONFIG_DIR`。

### 起来之后怎么看

容器健康检查：上游镜像内置的 HEALTHCHECK 间隔为 3 分钟（Dockerfile 第 461 至 462 行），compose 第 84 至 94 行把它改成 30 秒，执行 `node dist/docker-healthcheck.js`。网关提供 /healthz（存活）、/readyz（渠道就绪）、/startupz 三个端点。宿主机端口默认 18789，由 `OPENCLAW_GATEWAY_PORT` 决定。探针是否与对外端口同口、期望的状态码，未核实。

## 国内网络部署要点

- 镜像拉取：在一台国内服务器上实测，经南京大学 ghcr 镜像站直连拉取 2026.10.2 预构建镜像约 10 分钟。Docker Hub 与其他加速方式的可达性未核实。
- 源码构建依赖：基础镜像取自 docker.io 并按 digest 钉死；apt 依赖 Debian 源；pnpm 依赖 npm 源。compose 与 Dockerfile 中没有镜像源或代理配置项。这几处在国内的可达性未核实，这也是优先改用预构建镜像的理由。
- Docker CLI 是可选的沙箱依赖：`OPENCLAW_INSTALL_DOCKER_CLI` 置位时，会从 download.docker.com 取 GPG 公钥，需要外网。默认不启用。
- 模型服务与渠道：各模型服务密钥、渠道令牌、搜索与抓取服务密钥，对应的都是境外服务，国内可达性未核实。上游 env 没有提供模型服务的自定义接入地址变量，能否在 openclaw.json 里配置接入地址，未核实。
- 出站遥测：OTLP 端点变量默认为空。空值时是否仍产生外发请求，未核实，建议用出口防火墙实测确认。
- 时区：`OPENCLAW_TZ` 默认 UTC。对账时要比对时间戳，建议覆盖为本地时区。

## 最容易漏的东西：密钥在 openclaw.json 里

自定义供应商的密钥，按上游文档写在 openclaw.json 的 `models.providers.<id>.apiKey` 下。它随数据目录进入快照，所以快照本身就含凭据。异地副本必须加密存放，并限制访问范围。

另一个容易误判的地方是 auth profile 密钥目录，即 `OPENCLAW_AUTH_PROFILE_SECRET_DIR`。它位于状态目录之外，上游说明称其存放加密密钥材料。但新装实例上这个目录是空的：2026 年 10 月 13 日实测，明文存入一个供应商密钥之后，它依然为空。从旧版本升级来的部署，这个目录可能非空。非空时须另行备份，并同样加密。本文的快照工具不覆盖它。

最后，宿主机的 .env 含有 `OPENCLAW_GATEWAY_TOKEN`，它位于检出目录，不在状态目录之内。只有你把 .env 另存到状态目录下，它才会随数据目录一起备份；否则要单独备份。

## 备份覆盖面

覆盖的内容：

- 状态与配置目录。它挂载到容器内的 /home/node/.openclaw，openclaw.json、状态库 state/openclaw.sqlite、配置变更日志的指纹文件等都在其中。
- 工作区目录 `OPENCLAW_WORKSPACE_DIR`。默认位于状态目录之内，随之覆盖；若改到外部，则不覆盖。
- SQLite 数据库 state/openclaw.sqlite（WAL 模式，106 张表）走在线备份 API，WAL 中的内容一并进入快照。其余文件原样打包。
- 指向数据目录外的符号链接，按链接本身记录，演练时核对登记、不创建。实例上有 2 个这样的链接，指向镜像内的插件技能路径。

不覆盖的内容：

- auth profile 加密密钥目录 `OPENCLAW_AUTH_PROFILE_SECRET_DIR`，见上一节。
- 宿主机的 .env，见上一节。
- 可选的 docker.sock 挂载。默认未启用；启用后，宿主 Docker 的状态不在备份范围内。
- 镜像 `openclaw:local`。它由源码构建，可以重建，无需备份。

判据的边界：快照验证的是自洽性，不证明与备份时刻的运行状态一致，运行中写入的非 SQLite 文件之间可能有不一致。它也不证明网关能用恢复出的目录重新启动。上游没有恢复启动的说明，这一点未核实。

## 怎么证明备份能恢复

判据只有一条：把快照解到临时目录，逐文件重算 sha256 并与清单比对，且无多余文件；SQLite 通过 integrity_check，并逐表执行 count(*) 对账。输出 PASS，且 files 与 sqlite_tables 的前后两值都相等，才算备份可用。快照文件存在、tar 列表正常，都不算。

实例验证在一台国内服务器上做的（2026 年 10 月 13 日）。按钉死的 v2026.10.2 tag 取上游 compose，照 Headless bootstrap 路径部署了一个实例，只启动网关，去掉端口发布后跑备份与演练：

- 演练 PASS：516/516 个文件哈希一致，106/106 张 SQLite 表行数一致，2/2 个链接与登记一致。
- 负对照：解包后改坏一个文件，判据报 FAIL，515/516。判据能区分好的恢复与坏的恢复。

这组数字有边界。实例上未发过消息，也未接入渠道，会话与渠道凭据的路径没有在实例上走过。网关能否用恢复出的目录重新启动，未验证。

首轮演练其实是 FAIL。原因是引擎把插件技能目录里指向镜像内路径的链接一律当作逃逸拒收，属于判据误判。现已改为：链接若已登记，则核对后不创建；未登记或有成员挂在其下，仍然拒收。这一修正由快照工具的自测覆盖。

## 需要有人每月替你做这件事？

如果你不想自己维护这套备份和演练，可以交给我们：每月在你的服务器上做一次真恢复演练、逐表对账、出报告。

联系方式：<!-- 联系方式待补 -->
