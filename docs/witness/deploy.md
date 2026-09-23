---
title: 见证 · 部署
description: 采集器与汇聚服务怎么装、怎么配；出站推送与整机内网部署两种形态。
---

# 部署 <Badge type="warning" text="早期试点" />

两个二进制，一份配置各一个 JSON 文件。采集器装在被观测的主机上，汇聚服务放在你决定的地方。

::: warning 发布状态
预编译安装包与容器镜像**尚未发布，暂无时间表**。本页的命令是试点期间实际使用的做法。
:::

## 两种形态

| 形态 | `mode` | 数据走向 |
|---|---|---|
| **出站推送** | `relay` | 采集器主动向外连汇聚服务，推送快照。被观测主机不需要开放任何入站端口。 |
| **整机内网** | `onprem` | 汇聚服务整体搬进客户自己的网络。同一个二进制，只换配置和网络位置。**观测数据不出网。** |

内网形态下，大屏在每个部署的标题旁显示「数据不出网」徽章。

::: tip 先看再同意
采集器的 `-dry-run` 会打印**将要上网的完整载荷**而不发送。你的安全评审可以在同意任何数据出网之前先看一眼。
:::

## 构建

```bash
scripts/build.sh              # 本机架构的两个二进制 + 版本自检
scripts/build.sh linux amd64  # 只出指定目标
scripts/build.sh --cross      # 采集器的三个目标架构：linux amd64 / arm64 / loong64
```

按本机架构构建时，脚本会在构建后读取二进制自报的版本；读到 `dev` 或空串即以非零退出。交叉构建的产物本机跑不了，这一步跳过，需在目标机上执行 `-version` 自查。

::: details 关于国产 CPU 架构
`loong64` 产物可以交叉编译出来，但**尚未在真机上跑过**。能编译不等于验证过，交付前需在目标环境实测。
:::

## 令牌

服务端只保存令牌的 SHA-256 摘要，明文只交给持有方。

```bash
TOK=$(openssl rand -base64 32 | tr -d '=' | tr '+/' '-_')
printf %s "$TOK" | sha256sum    # 填进汇聚服务配置的 credentials[].sha256
```

三种角色：

- `agent`：采集器用，只能提交绑定部署的快照。
- `console`：只读查看，大屏用它。
- `admin`：签发一次性绑定券，本身不授予任何读权限。

## 启动

```bash
fleet       -config fleet.json
FLEET_AGENT_TOKEN=$TOK fleet-agent -config agent.json -once   # 跑一轮就退出，用于冒烟
```

两边的配置文件都是**严格解码**：出现未知的键即报错退出。写错一个键等于「我们没在看那个东西」，对观测来说这是最坏的失败方式。

## 汇聚服务配置

| 键 | 说明 |
|---|---|
| `listen` | 监听地址；可用 `-listen` 覆盖 |
| `public_base_url` | 对外地址 |
| `deployments[]` | 部署注册表：`id`、`display_name`、`contract_tier`、`report_interval_seconds`（默认 60，判定窗口由它算） |
| `credentials[]` | 令牌：`sha256`、`role`、`deployments`、`label` |
| `state_file` | 可选。状态文件，原子写入；重启后显示诚实的「陈旧」卡片，而不是一块空白大屏。文件读不回来就拒绝启动 |
| `notify.url` | 可选。状态转移时一行文本 POST 的目标 |
| `notify.log_path` | 可选。每条已派发的通知落一行留档，包括没送到的 |
| `notify.title_prefix` | 可选。通知标题前缀 |

通知令牌只从环境变量 `FLEET_NOTIFY_TOKEN` 读取，不写进配置文件。

## 采集器配置

| 键 | 说明 |
|---|---|
| `fleet_base_url` | 汇聚服务地址 |
| `deployment_id` | 必须与令牌绑定的部署一致 |
| `token_file` | 令牌文件；或用环境变量 `FLEET_AGENT_TOKEN`。不建议把令牌和目标清单写在同一个文件里 |
| `mode` | `relay` 或 `onprem` |
| `report_interval_seconds` | 上报间隔 |
| `probe_timeout_seconds` | 单次探测超时 |
| `audit_log_path` | 本地审计日志：每一次出站请求都记在客户自己的磁盘上 |
| `targets[]` | 要看的东西，见下表 |

每个 target 都有 `id`、`kind`、`display_name`、`probe`，其余键按探针类型填写：

| `probe` | 看什么 | 相关键 | 证据强度 |
|---|---|---|---|
| `introspect` | 组件自己的健康接口，可选再取版本 | `url` `expect_status` `version_url` `version_path` | 自省实证 |
| `http` | 一次 GET 的状态码 | `url` `expect_status` | 黑盒推断 |
| `tls` | 客户端实际拿到的证书 | `host` `warn_days` | 黑盒推断 |
| `tcp` | 端口是否接受连接 | `host` | 黑盒推断 |
| `compose` | 一个 compose 项目里每个服务的容器状态 | `project` | 宿主证据 |
| `systemd` | 服务单元状态 | `unit` | 宿主证据 |
| `disk` | 磁盘用量 | `path` `warn_percent` `crit_percent` | 宿主证据 |
| `backup` | 最新备份文件够不够新 | `glob` `max_age_seconds` | 宿主证据 |
| `k8s` | 一个命名空间里每个工作负载的副本状态 | `namespace` | 宿主证据 |

::: details 几个容易踩的细节
- `http` 探针的 `expect_status` 留空表示「仅可达性」：任何 500 以下的响应都算正常，卡片会明写这一点。`introspect` 探针留空则默认期望 200。
- 版本接口的形状各不相同，所以 `version_path` 是点分 JSON 路径（例如 `data.version`）。支持一种新形状 = 加一行配置，不用发版。
- 没有版本接口的组件就不填 `version_url`，卡片诚实显示 `?`。
- `k8s` 只接受显式列出的命名空间，不提供「全部命名空间」。它使用的凭据应当是一个只读、按权限收窄的服务账号，而不是集群管理员凭据。
:::

## 装成系统服务

常规安装：一个静态二进制 + 一个 JSON 配置，放在被观测主机上，以 systemd 单元运行。仓库自带的单元文件：

- 以专用的非特权用户运行，无监听端口；
- 文件系统只读，只有审计日志目录可写；
- 限制内存 128M、CPU 10%——采集器不应成为客户主机资源耗尽的原因。

容器形态的 compose 示例也在仓库里，对应镜像**尚未发布，暂无时间表**。

## 采集器的三条硬约束

有测试守着，不是口头承诺：

1. **只读。** 只放行 GET / HEAD，唯一例外是向汇聚服务提交自己的快照。
2. **出站白名单。** HTTP / TLS / TCP 类探针只能连汇聚服务和配置里列出的目标（`k8s` 探针经 kubectl 连集群的 API server）；重定向也重新校验。启动日志打印完整白名单。
3. **载荷白名单。** 快照只包含契约字段；唯一的自由文本 `detail` 限长 200 字节且禁止换行和控制字符，被观测系统的响应体进不了快照。
