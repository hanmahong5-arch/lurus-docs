---
title: MCP 工具链（zitadel-mcp / k8s-mcp / platform-mcp）
id: mcp
group: platform
priority: P2
status: live
owner: marvin (+ AI assist)
lastReviewed: 2026-04-28
sourcePath: 2l-svc-zitadel-mcp, 2l-svc-k8s-mcp, 2l-svc-platform-mcp
---

# MCP 工具链 内部手册

> 仅限内部员工查阅。包含运维细节、决策档案、未公开问题。

## 一句话定位

三个 MCP Server 共同构成 Lurus 的 **AI Agent 运维工具链**：让 Claude Code 等 AI agent 通过 Model Context Protocol (MCP) 直接执行 Zitadel IAM 操作、K3s 集群运维和 Platform 业务查询，取代手工敲 kubectl / psql / curl 的低效运维模式。三者互补，分别对应 IAM 面（zitadel-mcp）、运行时面（k8s-mcp）和业务面（platform-mcp）。

## 速查

| 项 | zitadel-mcp | k8s-mcp | platform-mcp |
|---|---|---|---|
| 仓库 | hanmahong5-arch/lurus-zitadel-mcp | hanmahong5-arch/lurus-k8s-mcp | hanmahong5-arch/lurus-platform-mcp |
| 目录 | `2l-svc-zitadel-mcp` | `2l-svc-k8s-mcp` | `2l-svc-platform-mcp` |
| 传输协议 | stdio（无网络端口） | stdio（无网络端口） | stdio（无网络端口） |
| 鉴权方式 | Service Account JWT-bearer | SSH key（host 继承） | INTERNAL_API_KEY bearer |
| 后端目标 | `https://auth.lurus.cn` | `root@100.98.57.55` (SSH) | `https://identity.lurus.cn` |
| 版本 | v0.1.0 | v0.1.0 | v0.1.0 |
| 语言 | Go 1.23 | Go 1.23 | Go 1.23 |
| 写工具开关 | 无单独开关（默认全开） | `K8S_MCP_READONLY=1` | `PLATFORM_MCP_READONLY=1` |
| 部署目标 | 开发者本机 | 开发者本机 | 开发者本机 |

## 整体架构

```mermaid
flowchart LR
    subgraph host["开发者本机 (Claude Code Host)"]
        CC["MCP Host\n(Claude Code)"]
        subgraph stdio["stdio transport (JSON-RPC / line)"]
            ZM["zitadel-mcp\nbinary"]
            KM["k8s-mcp\nbinary"]
            PM["platform-mcp\nbinary"]
        end
    end

    subgraph backends["后端目标"]
        ZA["Zitadel\nauth.lurus.cn\n(Management + Admin API)"]
        K3S["K3s Master\n100.98.57.55\n(kubectl + psql via SSH)"]
        PL["Platform Internal API\nidentity.lurus.cn\n/internal/v1/*"]
    end

    CC -- "initialize / tools/call\n(JSON-RPC per line)" --> ZM
    CC -- "initialize / tools/call\n(JSON-RPC per line)" --> KM
    CC -- "initialize / tools/call\n(JSON-RPC per line)" --> PM

    ZM -- "JWT bearer\n/management/v1 + /admin/v1\n+ /oidc/v1/userinfo" --> ZA
    ZM -. "kubectl patch secret\nkubectl rollout restart\n(save_pat_to_secret only)" .-> K3S
    KM -- "SSH BatchMode\nkubectl / psql exec -i" --> K3S
    PM -- "Bearer INTERNAL_API_KEY\nHTTP GET/POST" --> PL
```

## 核心数据流

```mermaid
sequenceDiagram
    participant U as 工程师
    participant CC as Claude Code (MCP Host)
    participant MCP as MCP Server (stdio)
    participant BE as 后端 (Zitadel / SSH / Platform)

    U->>CC: 自然语言指令\n(e.g. "给 billing-scanner 分配 IAM_LOGIN_USER")
    CC->>MCP: JSON-RPC tools/call\n{"name":"create_machine_user","arguments":{...}}
    Note over CC,MCP: 单行 JSON，\n换行符分隔
    MCP->>BE: 后端 API 调用\n(HTTP / SSH exec)
    BE-->>MCP: 响应数据
    MCP-->>CC: JSON-RPC result\n{"content":[{"type":"text","text":"..."}]}
    CC-->>U: 解释 + 下一步建议
```

## MCP 协议实现细节

三个 server 共享同一套手写 `internal/mcp/mcp.go` 实现，不依赖第三方 MCP SDK。

- **协议版本**: `2024-11-05`
- **传输**: stdio，每行一个 JSON-RPC 消息（`bufio.Scanner`，frame 上限 1 MiB）
- **支持方法**: `initialize` / `tools/list` / `tools/call` / `ping`
- **日志**: 全部写到 `stderr`，`stdout` 严格保留给 JSON-RPC 响应
- **信号处理**: `SIGINT` / `SIGTERM` 触发 context cancel，当前 tool call 超时后退出
- **Tool 结果格式**: 包装为 `{"content":[{"type":"text","text":"<JSON string>"}]}`，错误时附加 `"isError":true`

---

## 子系统一：zitadel-mcp — IAM 面

### 功能定位

把 Zitadel 的 Management API + Admin API 操作（建服务用户、授 IAM 角色、签发 PAT）暴露给 agent。典型用途：新服务上线自动化 bootstrap、PAT 轮换。

### 鉴权机制

```mermaid
sequenceDiagram
    participant BIN as zitadel-mcp binary
    participant FS as 本机文件系统
    participant ZA as auth.lurus.cn /oauth/v2/token
    participant API as Zitadel Management/Admin API

    BIN->>FS: 读取 SA JSON key\n(ZITADEL_SA_JSON 或 /etc/lurus/zitadel-admin-sa.json)
    BIN->>BIN: RSA-SHA256 签名\n自建 JWT assertion\n(iss=userId, aud=issuer, exp=+1h)
    BIN->>ZA: POST /oauth/v2/token\ngrant_type=jwt-bearer\nscope=openid urn:zitadel:iam:...
    ZA-->>BIN: access_token (cached, 30s 余量前刷新)
    BIN->>API: Bearer access_token\nGET/POST /management/v1/* or /admin/v1/*
```

`TokenSource` 线程安全，token 缓存到过期前 30 秒自动 refresh，无需外部控制。

### 工具列表

| 工具 | 类型 | 后端 API | 参数 | 说明 |
|---|---|---|---|---|
| `whoami` | R | `GET /oidc/v1/userinfo` | 无 | 验证 SA JWT 正常 |
| `create_machine_user` | W | `POST /management/v1/users/machine` | `name` (必须), `description` (选) | 返回 `{userId, details}` |
| `grant_iam_role` | W | `POST /admin/v1/members` | `user_id` (必须), `roles[]` (必须) | 常用角色: `IAM_LOGIN_USER`, `IAM_OWNER` |
| `create_pat` | W | `POST /management/v1/users/{id}/pats` | `user_id` (必须), `expiration_days` (1-3650, 默认 365) | 返回 `{tokenId, token}` |
| `save_pat_to_secret` | W | 组合: create_pat + kubectl patch + rollout restart | `user_id`, `secret_key` (必须), `namespace`, `secret_name`, `deployment` | 一键 PAT 轮换；需要 host 上有 kubectl |

`save_pat_to_secret` 内部通过 `exec.Command("kubectl", ...)` 本地执行，不走 SSH，超时 60s。

### 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `ZITADEL_ISSUER` | `https://auth.lurus.cn` | OAuth issuer，同时作为 JWT `aud` 和 token endpoint |
| `ZITADEL_SA_JSON` | `/etc/lurus/zitadel-admin-sa.json` | SA 私钥 JSON 路径 |

SA JSON 文件格式（Zitadel 下载的 machine key）：
```json
{
  "type": "serviceaccount",
  "keyId": "<keyId>",
  "key": "-----BEGIN RSA PRIVATE KEY-----\n...",
  "userId": "<userId>"
}
```

### 代码地图

| 路径 | 职责 |
|---|---|
| `main.go` | 入口：读 SA JSON、建 TokenSource、注册 5 个工具、ServeStdio |
| `internal/jwtbearer/jwtbearer.go` | RFC 7523 JWT-bearer grant；RSA-SHA256 签名；token cache |
| `internal/mgmtapi/mgmtapi.go` | Zitadel Management + Admin API 最小客户端 |
| `internal/mcp/mcp.go` | 共享 MCP stdio server 实现 |

---

## 子系统二：k8s-mcp — 运行时面

### 功能定位

把 K3s 集群和 Postgres 的日常运维操作暴露给 agent。所有命令通过 SSH 发到 master（`root@100.98.57.55`），继承 host 的 SSH key，不引入新凭证。**读工具始终可用；写工具编译时白名单限制，没有通用逃逸口（无 `run_kubectl` / `run_ssh`）**。

### SSH 执行模型

`sshk8s.Client` 每次工具调用都新起一个 `ssh` 子进程（`BatchMode=yes ConnectTimeout=10`），执行单条远程命令，60s 超时后强制 kill。SQL query 通过 `KubectlStdin` 将 SQL 文本管道进 `kubectl exec -i ... psql`。

### 工具列表

**读工具（始终注册）**

| 工具 | 参数 | 说明 |
|---|---|---|
| `list_namespaces` | 无 | `kubectl get ns -o wide` |
| `list_deployments` | `namespace` | `kubectl get deploy -n <ns> -o wide` |
| `describe_pod` | `namespace`, `pod` | `kubectl describe pod <pod> -n <ns>` |
| `get_events` | `namespace`, `limit`(默 50) | `kubectl get events --sort-by=.lastTimestamp -o wide`，截取最后 N 行 |
| `list_pods` | `namespace`, `selector`(选) | `kubectl get pods -n <ns> [-l <sel>] -o wide` |
| `pod_logs` | `namespace`, `pod`/`deployment`(二选一), `tail`(默 100 max 5000), `since`, `grep` | 支持本地 grep 过滤 |
| `deployment_image` | `namespace`, `deployment` | `jsonpath={.spec.template.spec.containers[*].image}` |
| `rollout_status` | `namespace`, `deployment`, `timeout`(默 300s) | `kubectl rollout status --timeout=...` |
| `pg_list_tables` | `pod`(默 lurus-pg-1), `database`, `schema` | psql 查 pg_stat_user_tables，白名单校验 |
| `pg_describe_table` | `pod`, `database`, `table`(如 `billing.wallets`) | psql `\d+` |
| `pg_query` | `pod`, `database`, `sql`, `allow_write`(默 false) | 默认 SELECT only；写动词过滤；白名单校验 |

**写工具（`K8S_MCP_READONLY=1` 时不注册）**

| 工具 | 参数 | 说明 |
|---|---|---|
| `rollout_restart` | `namespace`, `deployment` | 白名单校验；重启后等待 180s rollout status |
| `crictl_pull` | `image` | 只允许 `ghcr.io/hanmahong5-arch/*`；预拉镜像 |

### 编译时白名单

```go
// rollout_restart 允许目标（namespace/deployment）
"lurus-platform/platform-core"
"lurus-platform/platform-notification"
"lurus-system/api"
"lurus-system/memorus"
"lucrum/lucrum-web"

// pg_query / pg_list_tables / pg_describe_table 允许目标（pod/database）
"lurus-pg-1/identity"
"lurus-pg-1/notification"
"lurus-pg-1/lucrum"
```

添加新目标：编辑 `main.go` 中 `allowedRolloutRestart` / `allowedPGDatabases` map，重新编译，更新本机二进制。

### pg_query 写保护逻辑

`containsDestructiveVerb` 在 SQL 上扫描 `INSERT / UPDATE / DELETE / DROP / TRUNCATE / ALTER / CREATE / GRANT / REVOKE / REINDEX`（先剥离 `--` 注释，大写比对）。这是**安全带而非防线**，真正防线是 Postgres 的用户权限（当前 psql 跑 postgres superuser）。

### 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `K8S_MCP_SSH_HOST` | `root@100.98.57.55` | SSH 目标 |
| `K8S_MCP_READONLY` | `0` | 设为 `1` 禁用所有写工具 |

### 代码地图

| 路径 | 职责 |
|---|---|
| `main.go` | 入口：白名单声明、读/写工具注册、ServeStdio |
| `internal/sshk8s/sshk8s.go` | SSH 执行层；`Run` / `Kubectl` / `KubectlStdin`；shell 转义 |
| `internal/mcp/mcp.go` | 共享 MCP stdio server |

---

## 子系统三：platform-mcp — 业务面

### 功能定位

把 lurus-platform 的 `/internal/v1/*` 业务 admin 面（账户查询、钱包余额、交易流水、订阅/权益、支付方式状态、checkout 创建）暴露给 agent。典型用途：客服排查、账户健康检查、充值链接生成。

### 鉴权机制

`INTERNAL_API_KEY` 通过 `Authorization: Bearer <key>` 头传递，每次 HTTP 请求携带，30s 超时。读取方式：

```bash
ssh root@100.98.57.55 "kubectl get secret platform-core-secrets \
  -n lurus-platform -o jsonpath='{.data.INTERNAL_API_KEY}' | base64 -d"
```

### 工具列表

**读工具（始终注册）**

| 工具 | HTTP | 关键参数 | 说明 |
|---|---|---|---|
| `account_lookup` | GET `/internal/v1/accounts/by-{id,email,phone,zitadel-sub,oauth}/*` | `account_id` / `email` / `phone` / `zitadel_sub` / `oauth` | 七选一，路径参数 percent-encoded |
| `account_overview` | GET `/internal/v1/accounts/{id}/overview` | `account_id`, `product_id`(选) | 聚合：profile + wallet + subs + entitlements |
| `wallet_balance` | GET `/internal/v1/accounts/{id}/wallet/balance` | `account_id` | 当前余额 |
| `wallet_transactions` | POST `/internal/v1/accounts/{id}/wallet/transactions` | `account_id`, `page`(默 1), `page_size`(默 20 max 100) | 分页流水 |
| `subscription_get` | GET `/internal/v1/accounts/{id}/subscription/{product}` | `account_id`, `product_id` | 当前订阅 |
| `entitlements_get` | GET `/internal/v1/accounts/{id}/entitlements/{product}` | `account_id`, `product_id` | 有效权益（plan+sub+bonus 合并） |
| `billing_summary` | GET `/internal/v1/accounts/{id}/billing-summary` | `account_id` | 生命周期总计 |
| `checkout_status` | GET `/internal/v1/checkout/{order_no}/status` | `order_no` | 订单状态：pending/paid/expired/failed/refunded |
| `payment_methods` | GET `/internal/v1/payment-methods` + `/payment/providers` | 无 | 支付方式 + 熔断器状态 |
| `currency_info` | GET `/internal/v1/currency/info` | 无 | LUC↔LUT 汇率 |

**写工具（`PLATFORM_MCP_READONLY=1` 时不注册）**

| 工具 | HTTP | 参数 | 说明 |
|---|---|---|---|
| `checkout_create` | POST `/internal/v1/checkout/create` | `account_id`, `amount_cny`(1-100000), `payment_method`, `product_id`(默 platform) | 生成充值链接，返回 `{order_no, pay_url}` |

支持的 payment_method 枚举：`alipay_qr` / `alipay` / `wechat_native` / `wechat_h5` / `stripe` / `creem` / `epay_alipay` / `epay_wxpay` / `worldfirst`

**v0.1 刻意不暴露**（需要独立 admin-JWT + 审计链路）：
- wallet 人工调账 / 订阅取消退款 / 对账 issue 处理 / 组织 suspend

### 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `PLATFORM_BASE_URL` | `https://identity.lurus.cn` | Platform internal API base |
| `INTERNAL_API_KEY` | **必须** | platform 级信任凭据 |
| `PLATFORM_MCP_READONLY` | `0` | 设为 `1` 禁用写工具 |

### 代码地图

| 路径 | 职责 |
|---|---|
| `main.go` | 入口：读 env、注册工具、ServeStdio |
| `internal/client/client.go` | HTTP client；Bearer 注入；`EscapePath` 路径编码 |
| `internal/mcp/mcp.go` | 共享 MCP stdio server |

---

## 统一安装与配置

### 构建

```bash
cd 2l-svc-zitadel-mcp && go build -o zitadel-mcp .
cd 2l-svc-k8s-mcp     && go build -o k8s-mcp .
cd 2l-svc-platform-mcp && go build -o platform-mcp .
```

产物分别约 10 MB，无 cgo 依赖（标准 Go net/http + os/exec）。

### Claude Code mcp.json（三合一）

编辑 `~/.claude/mcp.json`（或项目 `.claude/mcp.json`）：

```json
{
  "mcpServers": {
    "zitadel": {
      "command": "/path/to/zitadel-mcp",
      "env": {
        "ZITADEL_ISSUER": "https://auth.lurus.cn",
        "ZITADEL_SA_JSON": "/etc/lurus/zitadel-admin-sa.json"
      }
    },
    "k8s": {
      "command": "/path/to/k8s-mcp",
      "env": {
        "K8S_MCP_SSH_HOST": "root@100.98.57.55",
        "K8S_MCP_READONLY": "0"
      }
    },
    "platform": {
      "command": "/path/to/platform-mcp",
      "env": {
        "PLATFORM_BASE_URL": "https://identity.lurus.cn",
        "INTERNAL_API_KEY": "<secret>",
        "PLATFORM_MCP_READONLY": "0"
      }
    }
  }
}
```

### SA JSON Bootstrap（zitadel-mcp 一次性）

见 `2l-svc-platform/docs/zitadel-bootstrap.md`。产物：`/etc/lurus/zitadel-admin-sa.json`，文件权限 `chmod 600`。

---

## 写工具安全模型对比

```mermaid
flowchart TD
    subgraph Z["zitadel-mcp"]
        ZW["write tools\n(grant_iam_role / save_pat_to_secret)"]
        ZSA["SA JWT (IAM admin)"]
        ZW --> ZSA
        ZSA -- "无 allowlist\n但需 SA 有足够权限" --> ZAPI["Zitadel API"]
    end

    subgraph K["k8s-mcp"]
        KW["rollout_restart\ncrictl_pull"]
        KAL["编译时 allowlist\n白名单 map[string]bool"]
        KW --> KAL
        KAL -- "reject if not whitelisted" --> KAL
        KAL -- "pass → SSH exec" --> KSSH["K3s Master SSH"]
    end

    subgraph P["platform-mcp"]
        PW["checkout_create"]
        PRO["PLATFORM_MCP_READONLY\n环境变量开关"]
        PW --> PRO
        PRO -- "=1 → tool not registered\n=0 → /internal/v1/checkout/create" --> PAPI["Platform API"]
    end
```

关键差异：
- **zitadel-mcp**：无 allowlist，安全边界在 SA 本身的 Zitadel 权限；误用 `grant_iam_role` 可能提权。
- **k8s-mcp**：allowlist 编译进二进制，写目标有限，但 `pg_query allow_write=true` 仍是 superuser 执行。
- **platform-mcp**：v0.1 写工具只有 checkout_create（生成支付链接），不改数据状态。

---

## 已知坑（内部专属）

1. **stdio 阻塞风险**：MCP server 的 `bufio.Scanner` 读 stdin，若 host 进程关闭 stdin 但不发 EOF（pipe 半关），server 会永久阻塞不退出。通常 Claude Code 正确关闭，但异常崩溃时需手工 kill。
2. **SSH 长连断**：k8s-mcp 每次工具调用建一条新 SSH 连接，不复用。K3s master 网络抖动会导致单次工具调用挂起 60s（ConnectTimeout=10 + exec 超时）。密集操作时延迟累加明显。
3. **Zitadel JWT 过期**：`TokenSource` 会在过期前 30s 刷新，正常情况透明。但若 host 机器时钟偏差 > 5min，Zitadel 会拒绝 JWT（`clock skew`）。本机 NTP 对齐是前置条件。
4. **白名单维护开销**：k8s-mcp 的写工具白名单硬编码在 `main.go`，每新增一个部署目标需要 rebuild + 重新分发二进制。现有白名单未包含 `lurus-docs` / `lurus-tally` / `lucrum` 等命名空间下的所有 deployment。
5. **`save_pat_to_secret` 双向依赖**：该工具在 zitadel-mcp 进程内执行 `kubectl`，需要本机安装 kubectl 且 `~/.kube/config` 指向生产集群。在没有 kubeconfig 的机器上调用会静默失败（`kubectl not found` 或权限拒绝）。
6. **pg_query 写动词过滤误判**：`containsDestructiveVerb` 是大写字符串扫描，注释剥除不完整（只处理 `--` 单行注释，不处理 `/* */` 块注释）。构造型注入如 `SELECT 1; /* UPDATE ... */` 可绕过检测，真正防线依赖 Postgres 用户权限。
7. **kubectl 跨集群上下文**：`save_pat_to_secret` 的 kubectl 使用 host 默认 kubeconfig，若 host 有多个 context（R1 + R6）且当前 context 不是 R1，会把 PAT 写进错误集群的 secret。操作前检查 `kubectl config current-context`。
8. **INTERNAL_API_KEY 不可轮换**：platform-mcp 每次启动读取 env 变量，key 轮换需要重启进程（杀掉 server 进程，Claude Code 会自动重启）。

---

## 决策档案

| 时间 | 决策 | 理由 |
|---|---|---|
| 2026-04 | stdio-only，不开网络端口 | MCP 协议的标准 host-local transport；无端口管理、无 TLS、无额外鉴权层 |
| 2026-04 | 写工具白名单编译进二进制 | policy change 必须走 code review + rebuild，防止运行时 hotpatch 绕过 |
| 2026-04 | k8s-mcp 不复用 SSH 连接 | 保持 stateless，避免长连接断后 tool call 挂起；每次新连开销可接受 |
| 2026-04 | 三个独立 binary 而非单体 | 最小权限原则：不需要 IAM 权限的场景只装 k8s-mcp；不同 binary 隔离爆炸半径 |
| 2026-04 | platform-mcp v0.1 仅 checkout_create 为写工具 | 其余 admin 操作（退款/调账）需要独立 admin-JWT + 审计链路，等 platform 完善后再暴露 |

---

## TODO / Roadmap

- [ ] k8s-mcp：支持 `lurus-docs` / `lurus-tally` rollout restart — 当前白名单未覆盖
- [ ] k8s-mcp：支持 `crictl_pull` 的 registry mirror 地址（GHCR 国内慢）
- [ ] k8s-mcp：SSH 连接池或 ControlMaster，减少密集操作延迟
- [ ] zitadel-mcp：`grant_iam_role` 加操作确认机制（返回 dry-run 预览，需二次 confirm tool 才执行）
- [ ] platform-mcp：wallet 人工调账 / 订阅取消退款工具（需独立 admin-JWT + 审计日志）
- [ ] 统一 `~/.claude/mcp.json` 模板写入 onboarding 文档
- [ ] CI：build + `go vet ./...` 检查；当前三个 repo 均无 GitHub Actions

---

## 应急 Runbook

### MCP Server 卡死 / stdio 死锁

现象：Claude Code 的 tool call 长时间无响应（> 30s）。

```bash
# 找到 MCP server 进程
ps aux | grep -E "zitadel-mcp|k8s-mcp|platform-mcp"

# 强制终止，Claude Code 会自动重启
kill -9 <PID>

# 或者重启 Claude Code 本身（会重新 spawn 所有 MCP server）
```

排查步骤：
1. 查看 Claude Code 的 MCP 日志（stderr 输出，通常在 `~/.claude/logs/mcp-<name>.log`）
2. 确认 stderr 中是否有 `serve: EOF` 或 `serve: broken pipe`
3. 若是 k8s-mcp，检查 SSH 是否挂起：`ssh -o ConnectTimeout=5 root@100.98.57.55 "echo ok"`

### SSH 连接失败（k8s-mcp）

现象：k8s-mcp tool call 返回 `ssh root@100.98.57.55: exit status 255`。

```bash
# 验证 SSH 可达性（仅 Tailscale）
ssh root@100.98.57.55 "echo ok"

# 若 Tailscale 不通
tailscale status | grep 100.98.57.55

# 查看 K3s master 状态
ssh root@100.98.57.55 "systemctl status k3s"
```

常见原因：Tailscale 断连（重连 Tailscale）；SSH 密钥未添加到 ssh-agent（`ssh-add ~/.ssh/id_rsa`）。

### Zitadel JWT 过期 / 拒绝（zitadel-mcp）

现象：tool call 返回 `token endpoint HTTP 401` 或 `clock skew`。

```bash
# 检查本机时钟偏差
date && curl -s https://auth.lurus.cn/.well-known/openid-configuration | python3 -c "import sys,json; print('ok')"

# 若时钟偏差，同步
w32tm /resync  # Windows
# 或 ntpdate pool.ntp.org（Linux）

# 验证 SA JSON 有效性
cat /etc/lurus/zitadel-admin-sa.json | python3 -c "import sys,json; d=json.load(sys.stdin); print('userId:', d.get('userId','MISSING'))"

# 测试 JWT 换 token
./zitadel-mcp  # 启动时会打印 "ready (issuer=... user=...)"，失败则 fatal
```

### 误操作写工具（通用）

若 `rollout_restart` 重启了错误服务，或 `checkout_create` 生成了错误订单：

```bash
# 检查 rollout 状态
ssh root@100.98.57.55 "kubectl rollout status deployment/<name> -n <ns>"

# 若需回滚
ssh root@100.98.57.55 "kubectl rollout undo deployment/<name> -n <ns>"

# checkout 订单查看（platform-mcp checkout_status，或直接查 DB）
ssh root@100.98.57.55 "kubectl exec -i -n database lurus-pg-1 -- \
  psql -U postgres -d identity -c \"SELECT order_no, status, created_at FROM billing.checkout_orders ORDER BY created_at DESC LIMIT 5;\""
```

### 误删 K8s 资源（防范）

k8s-mcp **没有** `kubectl delete` 工具，现有 write tools 只有 `rollout_restart` 和 `crictl_pull`，无法通过 MCP 删除任何 K8s 资源。若需要删除操作，只能手工 SSH。

### K8s pg_query 写操作误执行

若 `pg_query allow_write=true` 执行了 UPDATE/DELETE：

```bash
# 立即检查影响行数（若已提交）
ssh root@100.98.57.55 "kubectl exec -i -n database lurus-pg-1 -- \
  psql -U postgres -d <db> -c \"SELECT * FROM pg_stat_activity WHERE state='active';\""

# 数据恢复：MinIO pg-backups-v2 中的 WAL 备份
# 联系 marvin 处理 PITR
```
