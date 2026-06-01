---
title: MCP 工具链（zitadel-mcp / k8s-mcp / platform-mcp）
id: mcp
group: platform
priority: P2
status: live
owner: marvin (+ AI assist)
lastReviewed: 2026-05-28
sourcePath: 2l-svc-zitadel-mcp, 2l-svc-k8s-mcp, 2l-svc-platform-mcp
---

# MCP 工具链 内部手册

> 🟢 **2026-05-28 状态更新**：zita/k8s/platform MCP 在 prod；tally-mcp 仍 alpha（待首发 tag）。

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

---

## 多视角速览

### 用户视角（员工日常运维）

员工无需登录任何后台控制台，直接在 **Switch 桌面客户端** 或 **Claude Desktop** 的 chat 界面用自然语言操作：

- "把用户 alice@lurus.cn 的 MFA 重置" → zitadel-mcp 调 Zitadel Admin API 完成
- "看一下 lurus-platform 命名空间里的 pod 状态" → k8s-mcp 通过 SSH 执行 kubectl 返回
- "帮我查 account 10086 的钱包余额和最近 5 条流水" → platform-mcp 调 `/internal/v1/*` 返回

整个流程无需记忆 kubectl 命令、API 路径或 JWT 换取步骤。聊天上下文让 agent 可以跨工具组合：先查账户、再生成充值链接、再确认订单状态——一次对话完成。

### 开发者视角（MCP server 实现）

三个服务均为 **Go 1.23 编译的单二进制**，通过 **stdio 传输 JSON-RPC** 与 MCP host 通信：

- 协议：`2024-11-05`，支持 `initialize / tools/list / tools/call / ping`
- 每行一个 JSON-RPC 消息（`bufio.Scanner`，frame 上限 1 MiB）
- `stdout` 严格保留给协议响应；日志、调试信息全部写 `stderr`
- Tool 注册在 `main.go` 启动时完成，运行时不可热更新
- 共享 `internal/mcp/mcp.go` 实现协议层，各子系统只实现 tool handler
- 新增工具：实现 handler → 在 `main.go` 的 `tools` slice 追加 `Tool{Name, Description, InputSchema, Handler}` → 重新编译

源码路径：`2l-svc-zitadel-mcp/` · `2l-svc-k8s-mcp/` · `2l-svc-platform-mcp/`

### 运维视角（进程管理与部署）

三个 MCP server 均以 **stdio 模式**运行（无监听端口），由 MCP host（Claude Code / Switch）在需要时 spawn，不需要 systemd service 或 k8s pod：

- 部署目标：开发者**本机**（Windows/macOS/Linux）
- 网络访问：通过 **Tailscale** 内网（`100.98.57.55` / `auth.lurus.cn` / `identity.lurus.cn`），不暴露公网
- 进程生命周期：host 启动时 spawn，host 关闭时随之终止；异常退出 host 会自动 respawn
- SSE 模式：协议支持但当前三个服务**未启用**；若需多用户共享单实例，可在二进制前加 SSE proxy（如 `mcp-proxy`），但会引入额外鉴权层——暂无此需求
- 日志：`stderr` 输出，Claude Code 转存至 `~/.claude/logs/mcp-<name>.log`
- 更新流程：本地 `go build -o <binary> .` → 替换旧二进制 → 重启 Claude Code

### 决策者视角（战略价值）

| 维度 | 传统方式 | MCP 工具链之后 |
|------|---------|---------------|
| 执行门槛 | 需要熟悉 kubectl / psql / Zitadel Admin UI | 自然语言描述意图，agent 自动选工具 |
| Bus Factor | 运维知识集中在 1-2 人 | chat 历史 + tool 定义即文档，可复现 |
| 审计 | 分散在各系统日志，难关联 | 每次 tool call 有 MCP 层 stderr 日志，可聚合 |
| 误操作风险 | 手工命令无 guardrail | 白名单编译进二进制，写工具需显式参数，可加二次确认 |
| 新人上手 | 需数周熟悉各系统 | 描述需求，chat 引导，工具说明即时可查 |

把内部运维从"记忆密集型"转为"意图驱动型"，同时审计链路随 tool call 日志自然形成。

---

## 决策树：用哪个 MCP server

```mermaid
graph TD
    START([运维需求]) --> Q1{涉及用户身份 / IAM？\n如重置 MFA、分配角色、签发 PAT}
    Q1 -- 是 --> ZITADEL[使用 zitadel-mcp\n2l-svc-zitadel-mcp]
    Q1 -- 否 --> Q2{涉及 K8s 集群 / 数据库？\n如查 pod、重启 deployment、执行 SQL}
    Q2 -- 是 --> Q3{是否只读操作？\n如 logs / describe / SELECT}
    Q3 -- 只读 --> K8S_RO[k8s-mcp\nK8S_MCP_READONLY=1\n2l-svc-k8s-mcp]
    Q3 -- 需要写操作 --> K8S_RW[k8s-mcp\n默认模式\n白名单约束]
    Q2 -- 否 --> Q4{涉及平台业务数据？\n如账户 / 钱包 / 订阅 / 订单}
    Q4 -- 是 --> Q5{是否需要生成支付链接？}
    Q5 -- 是 --> PLAT_RW[platform-mcp\nPLATFORM_MCP_READONLY=0\n2l-svc-platform-mcp]
    Q5 -- 仅查询 --> PLAT_RO[platform-mcp\nPLATFORM_MCP_READONLY=1\n只读模式]
    Q4 -- 否 --> MANUAL[⚠ 手工操作\n当前 MCP 工具链未覆盖]
    Q1 -- 是 --> AUDIT{⚠ 高危操作？\n如 grant_iam_role IAM_OWNER}
    AUDIT -- 是 --> CONFIRM[先 dry-run 预览\n二次确认后执行\n见最佳实践]
    AUDIT -- 否 --> ZITADEL
```

选择要点：
- 三个 server 可同时挂载，agent 根据 tool 名称自动路由，无需手工切换
- 高危操作（IAM 权限授予 / 生产 DB 写入）应在 chat 中明确要求 agent 先输出操作摘要再执行
- 只读场景建议开启 `*_READONLY=1`，防止 agent 误触写工具

---

## 典型时序图

```mermaid
sequenceDiagram
    participant E as 员工
    participant SW as Switch / Claude Desktop\n(MCP Host)
    participant ZM as zitadel-mcp\n(stdio)
    participant KM as k8s-mcp\n(stdio)
    participant PM as platform-mcp\n(stdio)
    participant ZA as Zitadel Admin API\nauth.lurus.cn
    participant K3S as K3s Master\n100.98.57.55 (SSH)
    participant PL as Platform Internal API\nidentity.lurus.cn

    E->>SW: "用户 bob@lurus.cn 充值失败，帮我查一下账户和最近订单"
    SW->>PM: tools/call account_lookup\n{"email":"bob@lurus.cn"}
    PM->>PL: GET /internal/v1/accounts/by-email/bob%40lurus.cn
    PL-->>PM: {account_id, profile, ...}
    PM-->>SW: account_id = "acc_xxx"

    SW->>PM: tools/call wallet_transactions\n{"account_id":"acc_xxx","page_size":5}
    PM->>PL: POST /internal/v1/accounts/acc_xxx/wallet/transactions
    PL-->>PM: [{order_no, status, amount}, ...]
    PM-->>SW: 最近 5 条流水

    SW->>PM: tools/call checkout_status\n{"order_no":"ORD_yyy"}
    PM->>PL: GET /internal/v1/checkout/ORD_yyy/status
    PL-->>PM: {status:"failed", reason:"payment_timeout"}
    PM-->>SW: 订单状态 failed

    SW-->>E: 账户 acc_xxx，最近订单 ORD_yyy 支付超时失败\n建议重新生成充值链接

    E->>SW: "帮他重新生成一个 100 元的充值链接"
    SW->>PM: tools/call checkout_create\n{"account_id":"acc_xxx","amount_cny":100,"payment_method":"alipay_qr"}
    PM->>PL: POST /internal/v1/checkout/create
    PL-->>PM: {order_no:"ORD_zzz", pay_url:"https://..."}
    PM-->>SW: 新充值链接生成
    SW-->>E: 充值链接：https://... （有效期 15 分钟）

    Note over E,SW: 同一对话中若需查 IAM 或重启服务\n直接追加指令，MCP host 路由到对应 server
```

---

## 端到端完整例子

场景：员工发现用户 X 无法登录，怀疑 MFA 绑定异常，需要重置其 MFA 并验证操作成功。

### 第一步：安装 Switch 并挂载 zitadel-mcp

```bash
# 1. 构建 zitadel-mcp（开发机上执行）
cd 2l-svc-zitadel-mcp
go build -o ~/bin/zitadel-mcp .

# 2. 确保 SA JSON 已就绪（一次性 bootstrap）
# 参考 2l-svc-platform/docs/zitadel-bootstrap.md
ls -la /etc/lurus/zitadel-admin-sa.json   # 应输出 -rw------- (600)
```

### 第二步：配置 mcp.json

编辑 `~/.claude/mcp.json`（Switch 同路径）：

```json
{
  "mcpServers": {
    "zitadel": {
      "command": "/Users/you/bin/zitadel-mcp",
      "env": {
        "ZITADEL_ISSUER": "https://auth.lurus.cn",
        "ZITADEL_SA_JSON": "/etc/lurus/zitadel-admin-sa.json"
      }
    }
  }
}
```

重启 Switch / Claude Desktop，确认 MCP 连接成功（Switch 状态栏显示 `zitadel ✓`）。

### 第三步：chat 操作

```
员工：把用户 X（user_id: usr_01J9XXXX）的 MFA 重置

Agent：我将调用 zitadel-mcp 的 remove_user_mfa 工具来重置该用户的 MFA。
       操作摘要：
       - 目标：usr_01J9XXXX
       - 操作：删除所有已注册的 MFA 因素（TOTP / WebAuthn）
       - 影响：用户下次登录需重新绑定 MFA
       确认执行？

员工：确认

Agent：[调用 tools/call remove_user_mfa {"user_id":"usr_01J9XXXX"}]
       ✓ 操作成功，userId=usr_01J9XXXX 的 MFA 已清除。
       用户下次登录时会被要求重新设置 MFA。
```

### 底层 Go MCP tool 定义片段

以下是 zitadel-mcp `main.go` 中 tool 注册方式（示意，以实际源码为准）：

```go
// 2l-svc-zitadel-mcp/main.go
tools := []mcp.Tool{
    {
        Name:        "whoami",
        Description: "Verify service account JWT is valid and return identity info",
        InputSchema: mcp.Schema{Type: "object", Properties: map[string]mcp.Property{}},
        Handler:     handleWhoami(ts, client),
    },
    {
        Name:        "create_machine_user",
        Description: "Create a Zitadel machine user (service account)",
        InputSchema: mcp.Schema{
            Type:     "object",
            Required: []string{"name"},
            Properties: map[string]mcp.Property{
                "name":        {Type: "string", Description: "Machine user login name"},
                "description": {Type: "string", Description: "Optional description"},
            },
        },
        Handler: handleCreateMachineUser(ts, client),
    },
    {
        Name:        "grant_iam_role",
        Description: "Grant IAM-level role to a user (Admin API). Common roles: IAM_LOGIN_USER, IAM_OWNER",
        InputSchema: mcp.Schema{
            Type:     "object",
            Required: []string{"user_id", "roles"},
            Properties: map[string]mcp.Property{
                "user_id": {Type: "string"},
                "roles":   {Type: "array", Items: &mcp.Property{Type: "string"}},
            },
        },
        Handler: handleGrantIAMRole(ts, client),
    },
    // ... create_pat, save_pat_to_secret
}
mcp.ServeStdio(tools)
```

`mcp.ServeStdio` 启动 `bufio.Scanner` 读 stdin，每行 dispatch 到对应 handler，结果写 stdout。

---

## 最佳实践

| # | 实践 | 说明 |
|---|------|------|
| 1 | ✓ 高危操作走二次确认 | `grant_iam_role` / `rollout_restart` 执行前 agent 应输出操作摘要，员工明确"确认"后再调 tool。当前 zitadel-mcp Roadmap 中有 dry-run 确认机制，v0.1 需在 chat prompt 中手工约束。 |
| 2 | ✗ 不要直接执行无摘要的写操作 | agent 直接无提示执行写工具，员工无法在 chat 记录中还原"谁批准了什么操作"，审计链路断裂。 |
| 3 | ✓ 每个 tool call 写审计日志 | 三个 server 均将 tool 名称、参数摘要、执行结果输出到 `stderr`。运维机器上收集 `~/.claude/logs/mcp-*.log` 即可形成操作日志。建议定期归档。 |
| 4 | ✗ 不要静默吞掉 tool call 结果 | agent 收到 `"isError":true` 的响应应立即停止后续关联操作并告知员工，不要继续用错误数据执行下一步。 |
| 5 | ✓ MCP server 只暴露给受信内网（Tailscale） | zitadel-mcp / k8s-mcp 的目标均为 Tailscale 内网地址（`100.98.57.55` / `auth.lurus.cn`）；二进制本身不开端口。确保 Tailscale 在线，不要把 MCP server 的 SA 凭证或 INTERNAL_API_KEY 暴露在公网可达位置。 |
| 6 | ✗ 不要在公网或共享环境中运行 MCP server | stdio 模式天然绑定本机进程，但若误用 SSE 模式并暴露端口到公网，任何可连接该端口的客户端均可执行所有 tool，包括写操作。 |
| 7 | ✓ 只读场景启用 READONLY 开关 | 客服查询场景、新员工上手阶段，设置 `K8S_MCP_READONLY=1` 和 `PLATFORM_MCP_READONLY=1`，彻底排除误触写工具的可能。 |
| 8 | ✗ 不要一个 server 开放全权限 | 写工具与读工具混在一起且无 READONLY 开关时，agent 的任何误判都可能触发写操作。只读 vs 写操作应当在配置层面分离。 |
| 9 | ✓ tool schema 严格校验参数 | 每个 tool 的 `InputSchema` 应声明 `required` 字段并限定类型（string / number / array），避免 agent 传入 null 或类型错误的参数导致后端 500。 |
| 10 | ✗ 不要接受自由格式参数 | `{"sql": "<任意内容>"}` 这类 schema 把所有校验压到后端，MCP 层完全无法 guardrail，且对 pg_query 这类工具会放大误用风险。 |
| 11 | ✓ chat 历史不存敏感 token | `INTERNAL_API_KEY` / SA JSON 私钥 / PAT token 不应出现在 chat 消息中。MCP server 从 env 变量读取，tool 返回结果中的 token 值应在 chat 中 mask 或仅显示前几位。 |
| 12 | ✗ 不要在 chat 中粘贴完整 token | chat 历史可能被上传到 AI 服务商（取决于 host 配置），敏感凭证一旦进入 chat 即难以追回。 |

---

## 跨产品集成场景

### 场景一：Switch + 三个 MCP server——运维全栈 chat

Switch 桌面客户端同时挂载 `zitadel` / `k8s` / `platform` 三个 MCP server，形成**单一入口运维工作台**：

```
运维工程师 chat："部署 platform-core v2.3 镜像，完成后验证 billing 接口正常"

Agent 自动编排：
① k8s-mcp: deployment_image(lurus-platform/platform-core) → 确认当前镜像 tag
② k8s-mcp: rollout_restart(namespace=lurus-platform, deployment=platform-core)
③ k8s-mcp: rollout_status(namespace=lurus-platform, deployment=platform-core)
④ platform-mcp: payment_methods() → 验证 /internal/v1/payment-methods 可达
⑤ platform-mcp: currency_info() → 验证 LUC↔LUT 汇率接口正常
→ 输出：部署完成，服务响应正常，所有支付方式熔断器状态 OK
```

整个流程跨越 IAM / K8s / 业务三个层面，无需切换工具，agent 根据 tool 名称自动路由到对应 server。

依赖前提：
- `~/.claude/mcp.json` 中三个 server 均已配置
- 本机 Tailscale 在线，可达 `100.98.57.55` 和 `identity.lurus.cn`
- k8s-mcp 白名单包含 `lurus-platform/platform-core`（当前已包含）

### 场景二：Lutu APP / admin 后台——紧急用户操作 fallback

当 `2l-bs-admin`（Elixir/Phoenix 管理后台）因版本问题无法处理某类 IAM 操作，或 Lutu APP 客服需要紧急处理用户 MFA 锁定时，**zitadel-mcp 作为 fallback 通道**：

```
客服 chat（通过 Claude Desktop）："用户手机丢失，TOTP 无法使用，需要临时关闭 MFA 让他重新登录"

Agent：
① zitadel-mcp: whoami() → 验证 SA 凭证有效
② zitadel-mcp: create_pat(user_id=usr_xxx, expiration_days=1) → 生成临时 1 天 PAT
   (若 admin 后台有 disable_mfa 工具则优先使用)
③ 告知客服：已为用户生成临时登录令牌，有效期 24h，请通过安全渠道发送给用户
```

⚠ 此场景绕过了 admin 后台的审批流程，仅在紧急情况（admin 后台不可用 / 正式工单 pending）下使用，操作后需在 Slack #ops-incidents 频道补记操作记录。

---

## 运维常见问题

```mermaid
flowchart TD
    START([MCP 工具链故障]) --> S1{哪个 server 报错？}

    S1 -- zitadel-mcp --> Z1{错误类型}
    Z1 -- "HTTP 401 / clock skew" --> Z2[检查本机时钟\nw32tm /resync\n或 ntpdate pool.ntp.org]
    Z2 --> Z3{SA JSON 有效？\ncat /etc/lurus/zitadel-admin-sa.json\n检查 userId / key 字段}
    Z3 -- 无效 --> Z4[重新从 Zitadel 下载 SA JSON\n见 zitadel-bootstrap.md\nchmod 600]
    Z3 -- 有效 --> Z5[重启 Claude Desktop\nMCP server 自动 respawn\nToken cache 重置]

    Z1 -- "binary not found / spawn 失败" --> Z6[检查 mcp.json command 路径\n确认 zitadel-mcp 二进制存在且可执行\nls -la ~/bin/zitadel-mcp]

    S1 -- k8s-mcp --> K1{错误类型}
    K1 -- "exit status 255 / SSH 超时" --> K2[测试 Tailscale 连通性\ntailscale status\nssh root@100.98.57.55 echo ok]
    K2 -- 不通 --> K3[重连 Tailscale\n或检查 100.98.57.55 K3s master 状态]
    K2 -- 通 --> K4[检查 SSH key\nssh-add -l\n若无私钥: ssh-add ~/.ssh/id_rsa]

    K1 -- "tool not whitelisted" --> K5[目标 namespace/deployment\n未在 main.go allowlist 中\n需 rebuild: go build -o k8s-mcp .\n更新白名单后重新分发二进制]

    K1 -- "tool call 超时 60s 卡住" --> K6[强制终止卡住进程\nps aux grep k8s-mcp\nkill -9 PID\nClaude Desktop 会自动 respawn]

    S1 -- platform-mcp --> P1{错误类型}
    P1 -- "HTTP 401 / 403" --> P2[检查 INTERNAL_API_KEY 是否正确\nssh root@100.98.57.55\nkubectl get secret platform-core-secrets -n lurus-platform\n-o jsonpath={.data.INTERNAL_API_KEY} | base64 -d]
    P2 --> P3[更新 mcp.json 中的 INTERNAL_API_KEY\n重启 Claude Desktop]

    P1 -- "tool 不存在 / readonly 模式" --> P4[检查 PLATFORM_MCP_READONLY 设置\nREADONLY=1 时写工具不注册]

    S1 -- 所有 server --> ALL1{stdio 死锁\nchat 无响应 > 30s}
    ALL1 --> ALL2[ps aux grep -E zitadel-mcp k8s-mcp platform-mcp\nkill -9 对应 PID\nClaude Desktop 重启后自动 respawn]

    ALL1 --> ALL3{误操作写工具已执行}
    ALL3 -- rollout_restart 错误目标 --> ALL4[ssh root@100.98.57.55\nkubectl rollout undo deployment/<name> -n <ns>]
    ALL3 -- checkout_create 错误订单 --> ALL5[platform-mcp checkout_status 查订单\n若 pending 可联系支付方取消\n若已支付走退款流程联系 marvin]
    ALL3 -- pg_query 写误操作 --> ALL6[立即检查影响行数\n数据恢复依赖 MinIO WAL 备份\n联系 marvin 处理 PITR]
```

---

appended 253 lines, 4 mermaid charts to mcp.md

---

## Cross-channel write conflict (legacy admin reference)

> Originally from internal/products/admin.md before sunset 2026-05-10.

### ② Admin + zitadel-mcp：Chat 界面改用户的 Fallback 通道

当运营人员通过 AI Chat 工具（接入 `2l-svc-zitadel-mcp`）执行用户管理操作时，如果 MCP tool 调用失败（Zitadel API 超时、权限不足等），fallback 策略是：

```
AI Chat 工具
  → zitadel-mcp (MCP server, 调 Zitadel Admin API)
  → [失败] → fallback 提示员工
  → 员工经 identity.lurus.cn 或 zita CLI 操作（admin.lurus.cn 已 SUNSET 2026-05-10）
  → Zitadel 控制台 / platform-core /admin SPA 执行相同操作
  → 写审计日志
```

**适用场景**：
- 批量角色授予（zitadel-mcp 支持批量，Admin 只能单条）
- 紧急改密/锁号（zitadel-mcp 直接操作 Zitadel，Admin 经 platform-core 中转）
- Chat MCP 失败的降级路径（保证任何情况下都有 Web 界面兜底）

**⚠ 两个通道写同一数据**：zitadel-mcp 直接操作 Zitadel 用户数据，Admin 经 platform-core 操作 platform DB。确保两者操作的是同一 `user_id`（Zitadel sub），避免数据不一致。
