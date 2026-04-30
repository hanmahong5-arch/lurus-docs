---
title: Lurus Admin
id: admin
group: platform
priority: P1
status: live
owner: platform team
lastReviewed: 2026-04-28
sourcePath: 2l-bs-admin
---

# Lurus Admin 内部手册

> 仅限内部员工查阅。包含运维细节、决策档案、未公开问题。

## 一句话定位

Lurus Admin 是面向**内部运营人员**的管理控制台，基于 Elixir/Phoenix LiveView 构建，**无数据库**——所有数据通过 Finch HTTP 客户端代理到 platform-core、notification、lucrum 三个后端服务。访问需持有 Zitadel `admin` 角色，通过 confidential OIDC 客户端（client_secret 模式）保障安全。

它是 Platform 产品组（P0）的运营操作面板，对应 `admin.lurus.cn`，让运营人员无需直接调 API 即可完成用户管理、钱包调整、发票查询、通知模板配置等日常操作。

## 速查

| 项 | 值 |
|---|---|
| 仓库 | github.com/hanmahong5-arch/lurus-admin |
| 镜像 | `ghcr.io/hanmahong5-arch/lurus-admin:main-<sha7>` |
| 域名 | admin.lurus.cn |
| 端口 | 4000 (dev: 4001) |
| 命名空间 | lurus-admin |
| 数据存储 | 无 DB / 无 Redis — 纯 API 聚合 |
| 关键依赖 | platform-core `:18104` / notification `:18900` / lucrum-web `:3000` / Zitadel `auth.lurus.cn` |
| 部署目标 | R1 (K3s control-plane node) |
| 资源限制 | requests: 50m CPU / 128Mi MEM；limits: 300m CPU / 256Mi MEM |
| 部署状态 | 待 Zitadel confidential client 注册后方可首次部署 |

## 技术栈

| 层 | 选型 |
|---|---|
| 运行时 | Elixir 1.17 + OTP 27 |
| Web 框架 | Phoenix 1.7 + LiveView 1.0 + Bandit |
| UI | Tailwind CSS 4，深色主题 |
| HTTP 客户端 | Finch 0.18（连接池化，按后端分池） |
| 图表 | ECharts（CDN，JS hook 推数据） |
| 共享库 | `lurus_phoenix`（`../shared/lurus_phoenix/`，path dependency） |
| QR 码生成 | `eqrcode` 0.2（inline SVG） |
| 构建工具 | esbuild + Tailwind CLI，`mix phx.digest` |
| 代码质量 | Credo 严格模式 |

## 架构图

```mermaid
flowchart TB
  subgraph Browser["浏览器"]
    LV["LiveView WebSocket\n(persistent connection)"]
    EC["ECharts JS Hook\n(finance chart)"]
  end

  subgraph AdminApp["2l-bs-admin (lurus-admin namespace)"]
    direction TB
    EP["LurusAdminWeb.Endpoint\n(Bandit, port 4000)"]
    RT["Router\n:browser pipeline\n+ :require_admin pipeline"]
    AUTH["AuthController\n(OIDC callback/logout)"]
    HOOKS["AdminLiveHooks\n(on_mount guard)"]

    subgraph LiveViews["8 LiveView Pages"]
      DL["DashboardLive"]
      UL["UsersLive"]
      UD["UserDetailLive"]
      FL["FinanceLive"]
      SL["SubscriptionsLive"]
      STR["StrategiesLive"]
      NL["NotificationsLive"]
      SYS["SystemLive"]
    end

    AC["LurusAdmin.ApiClient\n(identity / notification / lucrum)"]
    QR["LurusAdmin.QRLogin\n(QR session + long-poll)"]
    FINCH["LurusAdmin.Finch\n(connection pool per backend)"]
  end

  subgraph SharedLib["shared/lurus_phoenix"]
    OIDC["LurusPhoenix.OIDC\n(PKCE + confidential client)"]
    PA["Plugs.Auth\n(session → assigns)"]
    PR["Plugs.RequireRole\n(role enforcement)"]
    HP["HealthPlug\nGET /health"]
  end

  subgraph Backends["下游服务 (K8s internal)"]
    PC["platform-core\nlurus-platform.svc:18104"]
    NT["notification\nlurus-platform.svc:18900"]
    LU["lucrum-web\nlucrum.svc:3000"]
    ZT["Zitadel\nauth.lurus.cn"]
  end

  Browser -->|"wss: LiveView diff"| EP
  EP --> RT --> AUTH
  EP --> RT --> LiveViews
  RT --> HOOKS
  AUTH --> OIDC
  LiveViews --> AC
  AC --> FINCH
  QR --> FINCH
  FINCH -->|"Bearer token"| PC
  FINCH -->|"Bearer token"| NT
  FINCH -->|"Bearer token"| LU
  FINCH -->|"OIDC flows"| ZT
  RT --> PA --> PR
  EP --> HP
```

## 核心数据流

### 管理员查看用户钱包并调整余额

```mermaid
sequenceDiagram
  participant ADM as 管理员浏览器
  participant LV  as UserDetailLive (BEAM process)
  participant AC  as ApiClient
  participant PC  as platform-core :18104

  ADM->>LV: 访问 /users/:id (LiveView mount)
  LV->>LV: connected?(socket) → send(:load_account)
  LV->>AC: identity_get("/admin/v1/accounts/:id", token)
  AC->>PC: GET /admin/v1/accounts/:id\nAuthorization: Bearer <zitadel_token>
  PC-->>AC: 200 {account, wallet, vip, subscriptions}
  AC-->>LV: {:ok, account}
  LV-->>ADM: LiveView diff 推送 DOM 更新（钱包余额渲染）

  ADM->>LV: phx-submit="adjust_wallet" {amount, reason}
  LV->>AC: identity_post("/admin/v1/accounts/:id/wallet/adjust", token, %{amount, reason})
  AC->>PC: POST /admin/v1/accounts/:id/wallet/adjust\nContent-Type: application/json
  PC-->>AC: 200 {}
  AC-->>LV: {:ok, _}
  LV->>LV: send(:load_account)  # 重新加载最新余额
  LV-->>ADM: LiveView diff 刷新余额显示
```

### OIDC 登录流

```mermaid
sequenceDiagram
  participant B  as 浏览器
  participant AC as AuthController
  participant ZT as Zitadel (auth.lurus.cn)

  B->>AC: GET /auth/login
  AC->>AC: generate_state(secret_key_base)\ngenerate_code_verifier + challenge\nstore in session
  AC-->>B: 302 → Zitadel /oauth/v2/authorize\n?scope=openid+profile+email+urn:zitadel:iam:org:project:roles
  B->>ZT: 用户输入凭据
  ZT-->>B: 302 → /auth/callback?code=...&state=...
  B->>AC: GET /auth/callback?code&state
  AC->>AC: verify_state (HMAC + 时效 600s)
  AC->>ZT: POST /oauth/v2/token (code + verifier + client_secret)
  ZT-->>AC: {access_token, refresh_token, id_token}
  AC->>ZT: GET /oidc/v1/userinfo (Bearer access_token)
  ZT-->>AC: {sub, email, name, "urn:zitadel:iam:org:project:roles": {"admin": {...}}}
  AC->>AC: extract_roles → ["admin"]\ncheck "admin" in roles
  alt admin 角色确认
    AC-->>B: put_session + 302 → /
  else 无 admin 角色
    AC-->>B: clear_session + flash error + 302 → /login
  end
```

## 代码地图

| 路径 | 职责 |
|---|---|
| `lib/lurus_admin/application.ex` | OTP Application，启动 Finch 连接池（按后端分池，identity×2 pool）、TaskSupervisor、PubSub |
| `lib/lurus_admin/api_client.ex` | 统一 HTTP 客户端，封装 identity/notification/lucrum 三个后端，Bearer token 认证，30s 超时 |
| `lib/lurus_admin/qr_login.ex` | QR 登录客户端，创建 Platform QR session + 长轮询状态，`eqrcode` 生成 inline SVG |
| `lib/lurus_admin_web/router.ex` | 路由：`/health`（无鉴权）/ `/auth/*`（OIDC）/ admin live_session（`:browser + :require_admin`） |
| `lib/lurus_admin_web/live/admin_live_hooks.ex` | `on_mount :default`：从 session 提取 `current_user` / `access_token`，校验 `"admin"` role，否则 redirect `/login` |
| `lib/lurus_admin_web/live/dashboard_live.ex` | 首页：stats 卡片（total_users / active_users / total_revenue / pending_invoices）+ 快速操作 + 服务状态 |
| `lib/lurus_admin_web/live/users_live.ex` | 用户列表：分页（20/页）+ 搜索（push_patch URL 参数化）→ `/admin/v1/accounts` |
| `lib/lurus_admin_web/live/user_detail_live.ex` | 用户详情：Account Info / VIP / Wallet（余额调整表单）/ 订阅列表 |
| `lib/lurus_admin_web/live/finance_live.ex` | 财务报表：日期区间 + group_by 筛选，ECharts 图表（`phx-hook="EChart"`），明细表格 |
| `lib/lurus_admin_web/live/subscriptions_live.ex` | 发票列表：分页 + account_id 过滤 → `/admin/v1/invoices` |
| `lib/lurus_admin_web/live/strategies_live.ex` | 策略市场审核：状态过滤 + 搜索 + Approve/Suspend 操作 → Lucrum API |
| `lib/lurus_admin_web/live/notifications_live.ex` | 通知模板 CRUD：列表 + 内联编辑表单（event_type / channel / priority / title / body） |
| `lib/lurus_admin_web/live/system_live.ex` | 系统监控：监控工具链接（Grafana / Prometheus / Jaeger / Loki / ArgoCD / Temporal）+ 嵌入 Grafana iframe |
| `lib/lurus_admin_web/live/login_live.ex` | 登录页：双 Tab（Zitadel OIDC + QR 扫码），QR 长轮询通过 `Task.Supervisor.async_nolink` 异步进行 |
| `lib/lurus_admin_web/controllers/auth_controller.ex` | OIDC callback 处理，confidential client 模式，提取 Zitadel role claims |
| `lib/lurus_admin_web/controllers/health_controller.ex` | `GET /health` → 200，供 K8s probe 使用 |
| `shared/lurus_phoenix/lib/lurus_phoenix/oidc.ex` | OIDC 通用库：PKCE、state HMAC 签名 + 时效校验、token exchange、userinfo fetch、end_session URL |
| `shared/lurus_phoenix/lib/lurus_phoenix/plugs/auth.ex` | 从 encrypted session cookie 加载 `current_user` / `access_token` 到 conn.assigns |
| `shared/lurus_phoenix/lib/lurus_phoenix/plugs/require_role.ex` | 角色守卫 Plug，支持单 role 或 role 列表，无 session → 401，缺角色 → 403 |
| `deploy/Dockerfile` | 二阶段构建：`elixir:1.17-otp-27-slim` 编译 + `debian:bookworm-slim` 运行时，user 65534，readonly rootfs |
| `deploy/k8s/deployment.yaml` | replicas:1，RollingUpdate（maxUnavailable:0），secretKeyRef 注入 SECRET_KEY_BASE / ZITADEL_CLIENT_ID / ZITADEL_CLIENT_SECRET |

## 部署

### 构建与 CI

```bash
# 本地开发
mix deps.get
mix phx.server                   # http://localhost:4001

# 生产构建（在 Dockerfile builder stage 执行）
MIX_ENV=prod mix assets.deploy   # tailwind --minify + esbuild --minify + phx.digest
MIX_ENV=prod mix compile --warnings-as-errors
MIX_ENV=prod mix release

# 本地构建镜像（从 lurus/ 根目录执行，因 Dockerfile COPY shared/）
docker build -f 2l-bs-admin/deploy/Dockerfile -t lurus-admin:local .
```

CI 触发：`push main` → GitHub Actions → `ghcr.io/hanmahong5-arch/lurus-admin:main-<sha7>` → ArgoCD auto-sync。

### K8s Secret 准备（首次部署必做）

```bash
kubectl create secret generic lurus-admin-secret \
  -n lurus-admin \
  --from-literal=secret-key-base="$(mix phx.gen.secret)" \
  --from-literal=zitadel-client-id="&lt;从 Zitadel 控制台复制&gt;" \
  --from-literal=zitadel-client-secret="&lt;从 Zitadel 控制台复制&gt;"
```

Zitadel 配置要点：
- Application 类型：**Web（confidential）**
- Grant types：Authorization Code
- Redirect URIs：`https://admin.lurus.cn/auth/callback`
- Post-logout URIs：`https://admin.lurus.cn/login`
- 勾选 "Roles" scope（使 userinfo 含 `urn:zitadel:iam:org:project:roles`）
- 在 Project roles 中创建 `admin` 角色，并授予运营人员账号

### 滚动更新

```bash
# 触发部署（推代码即可）
git push origin main

# 手动强制 sync（ArgoCD 通常自动）
ssh root@100.98.57.55 "argocd app sync lurus-admin"

# 检查状态
ssh root@100.98.57.55 "kubectl get pods -n lurus-admin"
ssh root@100.98.57.55 "kubectl rollout status deployment/lurus-admin -n lurus-admin"
```

### 环境变量完整列表

| 变量 | 来源 | 默认 / 必填 |
|---|---|---|
| `PHX_SERVER` | K8s env | `true`（固定） |
| `PHX_HOST` | K8s env | `admin.lurus.cn` |
| `PORT` | K8s env | `4000` |
| `SECRET_KEY_BASE` | Secret | **必填**，`mix phx.gen.secret` 生成 |
| `ZITADEL_ISSUER` | K8s env | `https://auth.lurus.cn` |
| `ZITADEL_CLIENT_ID` | Secret | **必填** |
| `ZITADEL_CLIENT_SECRET` | Secret | **必填** |
| `IDENTITY_URL` | K8s env | `http://platform-core.lurus-platform.svc:18104` |
| `NOTIFICATION_URL` | K8s env | `http://notification.lurus-platform.svc:18900` |
| `LUCRUM_URL` | K8s env | `http://lucrum-web.lucrum.svc:3000` |
| `PLATFORM_API_URL` | K8s env | `https://identity.lurus.cn`（QR login 用，需公网可达） |
| `DNS_CLUSTER_QUERY` | K8s env | 可选，BEAM 集群发现（单 replica 可不配） |
| `RELEASE_TMP` | K8s env | `/tmp`（readonly rootfs 下必须指定） |

## 运行与运维

### 健康检查

```bash
# 探针端点（无鉴权）
curl http://admin.lurus.cn/health  # → 200

# K8s 状态
ssh root@100.98.57.55 "kubectl get pods -n lurus-admin -o wide"
```

### 日志

```bash
# 实时日志
ssh root@100.98.57.55 "kubectl logs -n lurus-admin deploy/lurus-admin --tail=100 -f"

# 按时间段（Loki）
# 访问 https://loki.lurus.cn，query: {namespace="lurus-admin"}
```

BEAM 应用日志格式为结构化文本（`Logger` 默认），关键事件（OIDC callback、钱包调整失败）会出现在日志中。

### Finch 连接池配置

```
:default         → size: 10
identity_url     → size: 15, count: 2  (双池，平台核心流量大)
notification_url → size: 5
auth_url         → size: 5
```

### 重启与扩缩容

```bash
# 重启
ssh root@100.98.57.55 "kubectl rollout restart deployment/lurus-admin -n lurus-admin"

# 临时扩容（通常 1 replica 足够，LiveView session 无状态迁移）
ssh root@100.98.57.55 "kubectl scale deployment/lurus-admin --replicas=2 -n lurus-admin"
# 注意：扩容后 LiveView session affinity 问题，见"已知坑"

# 查看资源用量
ssh root@100.98.57.55 "kubectl top pod -n lurus-admin"
```

## 功能模块详解

### 1. Dashboard (`/`)

调用 `GET /admin/v1/stats`（platform-core），展示 total_users / active_users / total_revenue / pending_invoices 四张 KPI 卡片。后端 endpoint 暂未实现时优雅降级显示 `-`。

### 2. 用户管理 (`/users`, `/users/:id`)

- 列表：`GET /admin/v1/accounts`，分页 20 条/页，支持 `?q=<keyword>` 搜索（name/email/ID）
- 详情：`GET /admin/v1/accounts/:id` 返回账户信息 + wallet + vip + subscriptions
- 钱包调整：`POST /admin/v1/accounts/:id/wallet/adjust`，body `{amount: float, reason: string}`，amount 正数充值、负数扣减

### 3. 财务报表 (`/finance`)

调用 `GET /admin/v1/finance?from=&to=&group_by=day|month`，返回 total_revenue / total_refunds / net_revenue / transaction_count 汇总 + rows 明细。图表通过 `push_event("chart-data", series_data)` 向 ECharts JS hook 推送数据。

### 4. 发票管理 (`/subscriptions`)

调用 `GET /admin/v1/invoices`，支持 `?account_id=` 过滤，分页 20 条/页。模块名 SubscriptionsLive 但实际展示发票（invoice_number / amount / payment_method / status）。

### 5. 策略市场审核 (`/strategies`)

调用 Lucrum API：`GET /api/lurus/marketplace/strategies`，状态过滤（all / active / pending / suspended / rejected）。审核操作：`PATCH /api/lurus/marketplace/strategies/:id/status` body `{status: "active"|"suspended"}`。

### 6. 通知模板 (`/notifications`)

调用 notification 服务：`GET /admin/v1/templates`，支持新建/编辑（`POST`）/删除（`DELETE /admin/v1/templates/:id`）。字段：event_type（如 `user.created`）/ channel（in_app / email / fcm）/ priority（low/normal/high/urgent）/ title / body / enabled。

### 7. 系统监控 (`/system`)

纯静态链接 + 嵌入 Grafana iframe（`/d/slo-lurus-api/slo-lurus-api?theme=dark&kiosk`）。监控工具：Grafana / Prometheus / Jaeger / Loki / ArgoCD / Temporal，均为 `lurus.cn` 子域名外链。

### 8. QR 扫码登录（演示功能）

登录页 QR Tab：调 `POST /api/v2/qr/session`（identity.lurus.cn，无鉴权）创建 session，`eqrcode` 生成 inline SVG。通过 `Task.Supervisor.async_nolink` 长轮询 `GET /api/v2/qr/:id/status?timeout=25`，轮询结果：

| 状态码 | 含义 | 处理 |
|---|---|---|
| 200 `{status:"pending"}` | 未扫 | 继续轮询 |
| 200 `{status:"confirmed", token}` | 已扫确认 | redirect `/qr-demo#<token>`（fragment 不到日志）|
| 404 | 已过期 | 自动刷新 QR |
| 410 | 已消费 | 自动刷新 QR |

**当前限制**：QR 流程产生的是 Platform JWT，非 Zitadel session，无法建立 admin 会话，仅作演示用途（Track F2）。

## 数据契约

### 上游依赖

| 服务 | 端点前缀 | 认证方式 | 主要接口 |
|---|---|---|---|
| platform-core | `http://platform-core.lurus-platform.svc:18104` | Bearer Zitadel token | `/admin/v1/stats` / `/admin/v1/accounts` / `/admin/v1/accounts/:id` / `/admin/v1/accounts/:id/wallet/adjust` / `/admin/v1/finance` / `/admin/v1/invoices` |
| notification | `http://notification.lurus-platform.svc:18900` | Bearer Zitadel token | `/admin/v1/templates` (GET/POST/DELETE) |
| lucrum-web | `http://lucrum-web.lucrum.svc:3000` | Bearer Zitadel token | `/api/lurus/marketplace/strategies` (GET/PATCH) |
| Zitadel | `https://auth.lurus.cn` | confidential client | `/oauth/v2/authorize` / `/oauth/v2/token` / `/oidc/v1/userinfo` / `/oidc/v1/end_session` |
| identity.lurus.cn | `https://identity.lurus.cn` | 无鉴权 | `/api/v2/qr/session` / `/api/v2/qr/:id/status` |

### 下游消费者

Admin 本身不对外暴露 API，无下游消费者。Traefik IngressRoute 将 `admin.lurus.cn` 443 流量路由到 Service 80 口（内部 Service → Pod 4000）。

## 已知坑（内部专属）

1. **Zitadel confidential client 未注册**：`ZITADEL_CLIENT_SECRET` 缺失时 `runtime.exs` 在启动阶段抛出 `raise`，Pod 直接 CrashLoopBackOff。首次部署前必须先在 Zitadel 控制台创建 Web Application 并拿到 client_secret。

2. **LiveView 多副本 session 漂移**：LiveView WebSocket session 存储在 Phoenix encrypted cookie，理论上多副本无状态。但 `SECRET_KEY_BASE` 必须所有副本一致（已通过 Secret 保证）；`PHX_HOST` 不一致会导致 SameSite cookie 校验失败。扩到 >1 replica 前确认 K8s Service 无 sticky session，否则 WebSocket 重连可能被路由到不同 Pod 而状态丢失。

3. **access_token 不刷新**：session 中存储的是登录时的 access_token，Zitadel token 默认 1h 过期。当前无 token 刷新逻辑（`refresh_token` 存 session 但未使用）。管理员长时间（>1h）操作后 API 调用会返回 401，LiveView 页面会显示 "Failed to load..." 的错误卡片，需重新登录。

4. **ECharts 图表数据推送时序**：`FinanceLive` mount 返回后立即 `connected?` 触发 `:load_report`，数据就绪时通过 `push_event("chart-data", ...)` 推送。若用户在数据未到达前关闭页面，`push_event` 会被 LiveView 框架静默丢弃（无报错），但若 JS hook `mounted` 晚于 `push_event`，图表不会渲染。此为 Phoenix LiveView JS hook 时序问题，需在 hook `mounted` 里处理 `handleEvent` 并主动请求一次数据。

5. **readonly rootfs 下 Release tmp 目录**：生产容器 `readOnlyRootFilesystem: true`，Elixir Release 需要写 `/tmp`，通过 `RELEASE_TMP=/tmp` + emptyDir volume mount 解决。如果 manifest 中 tmp volume 被误删，Release 启动时会报 `eacces` 并 crash。

6. **shared/lurus_phoenix path dependency**：`mix.exs` 中 `{:lurus_phoenix, path: "../shared/lurus_phoenix"}`。Dockerfile 通过 `COPY shared/lurus_phoenix/ /shared/lurus_phoenix/` 在 builder stage 注入（build context 必须是 lurus/ 根目录）。本地如果在 `2l-bs-admin/` 目录内执行 `mix deps.get`，需确保 `../shared/lurus_phoenix/` 路径存在，否则会提示 dependency missing。

7. **Credo strict 模式**：`precommit` alias 包含 `compile --warnings-as-errors`，任何编译警告均阻断提交。修改 `lurus_phoenix` 共享库后必须同步更新 admin，否则类型不匹配导致 CI 失败。

## 决策档案

| 时间 | 决策 | 理由 |
|---|---|---|
| 2026-03 | 选 Phoenix LiveView 而非 React SPA | 服务端状态管理更简单，Admin 页面都是表格/表单型 UI，LiveView diff 推送足够，无需独立前端部署 |
| 2026-03 | 无数据库设计 | Admin 操作全部透传到下游权威服务，避免数据副本一致性问题，Admin 崩溃不影响数据 |
| 2026-03 | confidential OIDC 客户端（含 client_secret） | Admin 是内部后台，服务器端可安全存储 client_secret，比 public PKCE-only 更安全；同时 defense-in-depth 保留 PKCE |
| 2026-03 | Finch 替代 HTTPoison/Tesla | 连接池化、显式超时配置，适合聚合多个后端的场景；`LurusAdmin.Finch` 与 OIDC 共用，减少 HTTP 客户端数量 |
| 2026-03 | admin 仓库独立（分离自 www） | 2026-04 Phoenix 转型：www 改回 Next.js，admin 保留 Elixir/Phoenix；两者不同实例避免互相影响 |
| 2026-04 | QR 扫码登录为演示功能（非完整） | Platform QR token ≠ Zitadel session，短期内不打通；token 通过 URL fragment 传递避免服务端日志泄露，Track F2 跟踪后续完整实现 |

## TODO / Roadmap

- [ ] **Zitadel confidential client 注册** — 阻塞首次部署，优先级 P0
- [ ] **access_token 自动刷新** — 使用 session 中的 `refresh_token` 在 API 返回 401 时静默刷新，避免管理员被踢出
- [ ] **QR 扫码登录完整实现** — Track F2：QR 确认后走 Zitadel token exchange，建立真实 admin session
- [ ] **ECharts hook 时序修复** — `mounted` 里主动请求一次 chart-data，避免 push_event 丢失
- [ ] **API 分页统一** — 当前各 LiveView 对 pagination 响应结构兼容性处理有重复代码，提取到 ApiClient
- [ ] **Audit log 页面** — 显示管理员操作记录（钱包调整 / 策略审核），需 platform-core 提供 `/admin/v1/audit` 端点
- [ ] **通知模板 PUT 区分新建/编辑** — `NotificationsLive` 当前编辑和新建都走 `POST`，需接入 `PUT /admin/v1/templates/:id`

## 应急 Runbook

### Pod 挂了 / CrashLoopBackOff

```bash
# 查看 Pod 状态
ssh root@100.98.57.55 "kubectl get pods -n lurus-admin"
ssh root@100.98.57.55 "kubectl describe pod -n lurus-admin <pod-name>"

# 查看日志（启动失败通常在这里）
ssh root@100.98.57.55 "kubectl logs -n lurus-admin <pod-name> --previous"

# 常见原因：
# 1. SECRET_KEY_BASE / ZITADEL_CLIENT_ID / ZITADEL_CLIENT_SECRET 缺失 → 检查 secret
ssh root@100.98.57.55 "kubectl get secret lurus-admin-secret -n lurus-admin"

# 2. RELEASE_TMP volume 缺失 → 检查 deployment
ssh root@100.98.57.55 "kubectl get deployment lurus-admin -n lurus-admin -o yaml | grep -A5 volumes"

# 重启
ssh root@100.98.57.55 "kubectl rollout restart deployment/lurus-admin -n lurus-admin"
ssh root@100.98.57.55 "kubectl rollout status deployment/lurus-admin -n lurus-admin"
```

### LiveView WebSocket 断连（浏览器转圈 / 操作无响应）

症状：页面加载成功但数据不更新，浏览器控制台出现 WebSocket 断线重连日志。

```bash
# 1. 检查 Pod 是否正常
ssh root@100.98.57.55 "kubectl get pods -n lurus-admin"

# 2. 检查 Phoenix endpoint 是否接受 WebSocket
curl -I https://admin.lurus.cn/health

# 3. 检查 Traefik ingress
ssh root@100.98.57.55 "kubectl get ingressroute -n lurus-admin"

# 4. 检查 SECRET_KEY_BASE 一致性（多副本时）
# LiveView WebSocket 握手需要 secret 一致，否则 token 校验失败导致断线

# 5. 查看 Phoenix 连接日志
ssh root@100.98.57.55 "kubectl logs -n lurus-admin deploy/lurus-admin --tail=50 | grep -i 'websocket\|transport\|disconnect'"
```

浏览器端临时修复：强制刷新（Ctrl+F5）重建 WebSocket 连接。

### OIDC 跳转死循环（/auth/login → Zitadel → /auth/callback → /login 反复）

症状：登录后一直跳转，不能进入管理后台。

**排查步骤：**

1. **state 验证失败**：callback 日志出现 `{:error, :invalid_state}` 或 `{:error, :malformed_state}`
   - 原因：浏览器 session cookie 丢失（SameSite=Strict 被跨域丢弃）或 state 超时（>600s）
   - 修复：检查 `PHX_HOST` 与实际访问域名是否一致；确保通过 `https://admin.lurus.cn` 访问而非 IP

2. **admin 角色缺失**：callback 日志出现 `"Access denied: admin role required"`
   - 原因：Zitadel 用户未被授予 `admin` 角色
   - 修复：登录 `auth.lurus.cn` Zitadel 控制台 → Project → Roles → 给用户授 `admin` role

3. **client_secret 错误**：token exchange 返回 `401 unauthorized_client`
   - 原因：K8s secret 中的 `zitadel-client-secret` 与 Zitadel 不匹配
   - 修复：重新从 Zitadel 获取 secret，更新 K8s secret 后重启 Pod

```bash
# 查看 callback 详细错误
ssh root@100.98.57.55 "kubectl logs -n lurus-admin deploy/lurus-admin --tail=100 | grep -i 'oidc\|callback\|login\|role'"

# 更新 secret 后重启
kubectl patch secret lurus-admin-secret -n lurus-admin \
  --patch='{"stringData":{"zitadel-client-secret":"<new-secret>"}}'
kubectl rollout restart deployment/lurus-admin -n lurus-admin
```

### 回滚

```bash
# ArgoCD 回滚（界面操作或命令行）
ssh root@100.98.57.55 "argocd app rollback lurus-admin <revision>"

# 或：改 manifest tag 为上一个已知可用 sha7
# 1. 编辑 deploy/k8s/deployment.yaml 中 image tag
# 2. git commit && git push → ArgoCD auto-sync
```

### 平台 API 全部超时（admin 页面大量 "Failed to load"）

```bash
# 检查 platform-core
ssh root@100.98.57.55 "kubectl get pods -n lurus-platform | grep platform-core"
ssh root@100.98.57.55 "kubectl logs -n lurus-platform deploy/platform-core --tail=50"

# 检查 notification
ssh root@100.98.57.55 "kubectl get pods -n lurus-platform | grep notification"

# 检查 lucrum
ssh root@100.98.57.55 "kubectl get pods -n lucrum | grep lucrum-web"

# admin 本身无数据库，下游服务恢复后页面刷新即可正常，无需重启 admin
```

## 多视角速览

### 用户视角（运营/员工）

Admin 是运营人员日常处理后台事务的唯一入口。主要使用场景：

- **用户管理**：按 email / ID 搜索账户、查看 VIP 状态、手动调整钱包余额（充值或扣减）、冻结/解冻账号
- **订单与发票**：按账户过滤查询发票列表、核对支付状态、触发人工退款流程
- **退款与提现审核**：接收来自 Ticket 系统的退款请求，核查订单详情后调用 platform 退款接口，结果写入审计日志
- **策略市场审核**：审阅量化策略上架申请，Approve（上线）或 Suspend（下架）
- **通知模板配置**：维护系统通知的文案与路由规则（channel / priority），无需改代码即可上线新通知类型

登录方式：浏览器访问 `https://admin.lurus.cn`，跳转 Zitadel SSO，需持有 `admin` 角色。

### 开发者视角

Admin 是一个**无数据库、纯聚合**的 Phoenix LiveView 应用，所有业务数据通过 Finch HTTP 客户端透传到下游权威服务：

- **框架**：Elixir 1.17 + OTP 27 + Phoenix 1.7 + LiveView 1.0 + Bandit HTTP 服务器
- **状态管理**：全部在 LiveView 进程（BEAM Actor）中，页面切换通过 `push_patch` 保持 URL 参数化
- **认证**：OAuth 2.0 confidential OIDC 客户端（PKCE + client_secret），由 `shared/lurus_phoenix` 提供 `LurusPhoenix.OIDC` 通用库
- **Postgres 直查**：Admin 自身不直连 Postgres，所有数据经 platform-core `/admin/v1/*` 接口返回；若需临时 DBA 操作，通过 `kubectl exec` 进 platform-core 数据库 Pod 执行 SQL
- **Zitadel 集成**：userinfo 返回的 `urn:zitadel:iam:org:project:roles` claim 决定角色；`on_mount :default` hook 在每个 LiveView 挂载时校验 `"admin"` role，缺失则 redirect `/login`
- **扩展点**：新增页面只需实现新的 `Phoenix.LiveView`，注册到 `router.ex` 的 `live_session`，`ApiClient` 添加对应接口封装即可

### 运维视角

| 项 | 值 |
|---|---|
| 集群 | R1 `43.226.46.164`，K3s，命名空间 `lurus-admin` |
| Pod 端口 | 4000（内部），Service 80 口通过 Traefik IngressRoute 映射到 `admin.lurus.cn:443`|
| 健康探针 | `GET /health` → 200，无鉴权 |
| 核心依赖 | Zitadel `auth.lurus.cn`（SSO）+ platform-core `:18104`（业务数据）+ Postgres（经 platform-core 间接） |
| 关键 Secret | `lurus-admin-secret`：`secret-key-base` / `zitadel-client-id` / `zitadel-client-secret` |
| 资源规格 | requests: 50m CPU / 128Mi；limits: 300m CPU / 256Mi |
| 常用操作 | `kubectl rollout restart deployment/lurus-admin -n lurus-admin` |
| 日志入口 | `kubectl logs -n lurus-admin deploy/lurus-admin --tail=100 -f` 或 Loki `{namespace="lurus-admin"}` |

⚠ Admin 无本地状态，下游依赖恢复后页面刷新即可，通常无需重启 Pod。

### 决策者视角

**自建 vs Retool / Forest Admin / Appsmith**

| 维度 | 自建（当前方案） | Retool/Forest |
|---|---|---|
| 定制深度 | 完全自由，可实现 QR 扫码、LiveView 实时推送等 | 低代码受限于平台组件 |
| 数据私有 | 全部数据留在自有集群，符合内部合规要求 | 数据需经第三方 SaaS 转发 |
| 审计追踪 | 与 platform-core 审计日志深度集成 | 需额外 webhook 桥接 |
| 运维成本 | 需维护 Elixir 服务 | SaaS 零运维 |
| 快速迭代 | 改 LiveView 代码即可，无平台限制 | 拖拽低代码更快上线简单 CRUD |

**结论**：选择自建的核心理由是**金融数据不出内网**和**审计合规深度集成**。若未来 Admin 功能稳定、需求变化少，可评估局部迁移到低代码平台降低维护成本。

---

## 决策树：什么操作该走 Admin

```mermaid
graph TD
    A[需要执行一个后台操作] --> B{涉及资金或个人数据？}
    B -- 是 --> C{是否日常高频操作？}
    B -- 否 --> D{是否需要审计追踪？}

    C -- 是 --> E{是否需要批量处理？}
    C -- 否 --> F[⚠ 评估是否需要 4-eye 审批\n走 Admin 审核流]

    D -- 是 --> G[走 Admin\n审计日志自动记录]
    D -- 否 --> H[可考虑直接 API 调用\n或 CLI 工具]

    E -- 是 --> I[Admin 批量操作界面\n或导出后离线处理]
    E -- 否 --> J[Admin 单条操作界面\n标准 CRUD 流程]

    F --> K{操作不可逆？\n如退款 / 冻结 / 删除}
    K -- 是 --> L[✓ 必须走 Admin\n+ 二次确认弹窗\n+ 审计日志]
    K -- 否 --> M[Admin 或内部 API 均可\n优先 Admin 保留记录]

    L --> N{金额 > 阈值 / 批量影响 > N 人？}
    N -- 是 --> O[✓ 需 4-eye 审批\n第二人在 Admin 确认]
    N -- 否 --> P[单人操作可行\n但必须留 reason 字段]
```

**判断规则摘要**：
- 资金操作（退款/钱包调整/充值）→ 必须走 Admin，必须有 reason，金额超阈值需双人确认
- 个人数据操作（冻结账号/导出用户数据）→ 必须走 Admin，写审计日志
- 批量操作（批量发通知/批量审核策略）→ Admin 批量界面，先 dry-run 预览再提交
- 纯查询（排查 bug 时看某用户状态）→ Admin 查看界面或 Grafana/Loki，不需要写操作

---

## 典型时序图

### 员工 SSO 登录 → 冻结用户 → 审计日志 → NATS 通知

```mermaid
sequenceDiagram
    participant E  as 员工浏览器
    participant AD as admin.lurus.cn\n(AdminWeb LiveView)
    participant ZT as Zitadel\nauth.lurus.cn
    participant PC as platform-core\n:18104
    participant NT as notification\n:18900
    participant NS as NATS\nLLM_EVENTS / IDENTITY_EVENTS

    E->>AD: GET https://admin.lurus.cn/users/123
    AD->>AD: on_mount :default\n→ session 无 current_user
    AD-->>E: redirect /login
    E->>AD: GET /auth/login
    AD->>AD: generate PKCE verifier+challenge\ngenerate state (HMAC signed)
    AD-->>E: 302 → Zitadel /oauth/v2/authorize
    E->>ZT: 员工输入账号密码
    ZT-->>E: 302 → /auth/callback?code=...&state=...
    E->>AD: GET /auth/callback
    AD->>ZT: POST /oauth/v2/token (code + verifier + client_secret)
    ZT-->>AD: {access_token, refresh_token, id_token}
    AD->>ZT: GET /oidc/v1/userinfo
    ZT-->>AD: {sub, email, roles: {"admin": {}}}
    AD->>AD: extract_roles → ["admin"] ✓\nput_session current_user + access_token
    AD-->>E: 302 → /users/123

    E->>AD: LiveView mount /users/123
    AD->>PC: GET /admin/v1/accounts/123\nAuthorization: Bearer <zitadel_access_token>
    PC-->>AD: {account, wallet, status:"active", ...}
    AD-->>E: 渲染用户详情页

    E->>AD: phx-click="freeze_account"\n二次确认弹窗 → confirm
    AD->>PC: POST /internal/v1/users/freeze\n{user_id: "123", actor: "employee@lurus.cn", reason: "违规申诉"}
    PC->>PC: 更新 users.status = "frozen"\n写 audit_logs {actor, action, before, after, ts}
    PC->>NS: publish IDENTITY_EVENTS\n{event: "user.frozen", user_id: "123"}
    NS->>NT: consume IDENTITY_EVENTS
    NT->>NT: 匹配通知模板 user.frozen/email
    NT-->>E: 邮件通知发送至用户
    PC-->>AD: 200 {status: "frozen"}
    AD->>AD: send(:load_account) → 重新拉取账户状态
    AD-->>E: LiveView diff 更新状态标签 → "已冻结"
```

---

## 端到端完整例子

### 处理客户退款：从 Ticket 到审计归档

**场景**：用户 user_id=`u-8891` 通过客服 Ticket 申请退款，订单 `inv-20260428-0042`，金额 ¥299，理由：误购。

#### 第一步：接单查订单

员工登录 `https://admin.lurus.cn`，导航到 **发票管理** (`/subscriptions?account_id=u-8891`)。

```elixir
# SubscriptionsLive.handle_params/3 — URL 参数驱动搜索
def handle_params(%{"account_id" => account_id} = params, _uri, socket) do
  socket =
    socket
    |> assign(:account_id, account_id)
    |> assign(:loading, true)
  {:noreply, push_patch(socket, to: ~p"/subscriptions?#{params}")}
end

def handle_info(:load_invoices, socket) do
  case ApiClient.identity_get(
    "/admin/v1/invoices?account_id=#{socket.assigns.account_id}&page=1&per_page=20",
    socket.assigns.access_token
  ) do
    {:ok, %{"invoices" => invoices, "total" => total}} ->
      {:noreply, assign(socket, invoices: invoices, total: total, loading: false)}
    {:error, reason} ->
      {:noreply, assign(socket, error: reason, loading: false)}
  end
end
```

找到目标发票，确认状态为 `paid`，金额 299.00，支付方式 `alipay`。

#### 第二步：调 platform 退款接口

员工点击发票行 → **申请退款** 按钮，填写退款原因。Admin 调用：

```elixir
# UserDetailLive.handle_event/3 — 退款提交
def handle_event("submit_refund", %{"invoice_id" => inv_id, "reason" => reason}, socket) do
  # 二次确认已在前端弹窗完成，此处直接调用
  case ApiClient.identity_post(
    "/admin/v1/invoices/#{inv_id}/refund",
    socket.assigns.access_token,
    %{reason: reason, actor: socket.assigns.current_user.email}
  ) do
    {:ok, _resp} ->
      socket =
        socket
        |> put_flash(:info, "退款已提交，platform-core 正在处理")
        |> assign(:show_refund_modal, false)
      send(self(), :reload_invoice)
      {:noreply, socket}

    {:error, %{status: 422, body: body}} ->
      {:noreply, put_flash(socket, :error, "退款失败：#{body["message"]}")}

    {:error, _} ->
      {:noreply, put_flash(socket, :error, "网络错误，请稍后重试")}
  end
end
```

#### 第三步：platform-core 写审计日志

platform-core 收到退款请求后（内部逻辑，供参考）：

```go
// platform-core internal — app/refund_usecase.go (伪代码示意)
func (u *RefundUseCase) Execute(ctx context.Context, req RefundRequest) error {
    invoice, err := u.invoiceRepo.GetByID(ctx, req.InvoiceID)
    if err != nil { return fmt.Errorf("get invoice: %w", err) }

    if invoice.Status != "paid" {
        return ErrInvoiceNotRefundable
    }

    // 执行退款（调支付渠道 / 调整钱包）
    if err := u.paymentProvider.Refund(ctx, invoice.PaymentRef, invoice.Amount); err != nil {
        return fmt.Errorf("payment refund: %w", err)
    }

    // 写审计日志（actor + before/after 完整记录）
    u.auditRepo.Write(ctx, AuditLog{
        Actor:     req.Actor,           // "employee@lurus.cn"
        Action:    "invoice.refund",
        TargetID:  req.InvoiceID,
        Before:    map[string]any{"status": "paid"},
        After:     map[string]any{"status": "refunded"},
        Reason:    req.Reason,
        Timestamp: time.Now().UTC(),
    })

    // 发布 NATS 事件 → notification 服务发邮件给用户
    u.nats.Publish("IDENTITY_EVENTS", RefundEvent{
        UserID:    invoice.AccountID,
        InvoiceID: invoice.ID,
        Amount:    invoice.Amount,
    })

    return nil
}
```

#### 第四步：通知用户

notification 服务消费 `IDENTITY_EVENTS`，匹配模板 `invoice.refunded/email`，发送退款到账通知邮件。

#### 第五步：验证归档

员工刷新发票列表，状态由 `paid` 变为 `refunded`。如需核查审计记录（目前 TODO，待 platform-core 提供 `/admin/v1/audit` 端点），将在 **审计日志** 页面可查询 actor / before / after 完整记录。

---

## 最佳实践 ✓/✗

| 场景 | ✓ 正确做法 | ✗ 错误做法 |
|---|---|---|
| 写操作鉴权 | ✓ 所有写操作（退款/冻结/钱包调整）必须经 SSO 登录 + 界面二次确认弹窗 | ✗ 直接调内部 API 绕过 Admin 界面，无二次确认 |
| 审计日志 | ✓ 每条审计记录必须含 `actor`（操作人 email）+ `before`（操作前状态）+ `after`（操作后状态）+ `reason` | ✗ 只记录 op type（如 `"refund"`）而不记录前后状态变化 |
| 高危操作审批 | ✓ 退款金额超阈值 / 批量冻结 > 5 人，需第二名有 admin 角色的员工在 Admin 界面确认（4-eye） | ✗ 单人决策直接提交，无复核 |
| 角色权限管理 | ✓ 角色（admin / auditor / ops）在 Zitadel Project Roles 中配置，`require_role` plug 从 userinfo claims 读取 | ✗ 角色逻辑写死在代码 if/else 判断中 |
| 高危操作预演 | ✓ 批量操作（批量退款/批量通知）先走 `dry_run=true` 模式，预览影响范围再确认提交 | ✗ 直接 commit 批量操作，出错无法完整回滚 |
| 数据导出 | ✓ 导出用户数据时脱敏处理（手机号中间 4 位替换 `****`，身份证仅留首尾各 2 位） | ✗ 原始数据直接 CSV 下载，含完整个人敏感信息 |
| API 错误处理 | ✓ LiveView 捕获下游 `{:error, _}` 后通过 `put_flash(:error, msg)` 在界面展示友好提示，继续保持 socket 可用 | ✗ 让下游报错冒泡导致 LiveView 进程 crash，用户看到白屏 |
| Token 有效期 | ✓ 监控 access_token 剩余有效期，在 API 返回 401 时尝试用 refresh_token 静默刷新后重试 | ✗ Token 过期后仍继续调用 API，用户所有操作返回"Failed to load"直到手动重新登录 |

---

## 跨产品集成场景

### ① Admin + Platform：用户与钱包后台管理

Admin 是 platform-core `/admin/v1/*` 接口的**唯一 Web 消费者**。典型集成路径：

```
员工浏览器
  → admin.lurus.cn (Phoenix LiveView)
  → Bearer Zitadel token
  → platform-core.lurus-platform.svc:18104
      /admin/v1/accounts         — 用户列表与搜索
      /admin/v1/accounts/:id     — 账户详情（含 wallet / vip / subscriptions）
      /admin/v1/accounts/:id/wallet/adjust  — 余额调整
      /internal/v1/users/freeze  — 账号冻结/解冻
      /admin/v1/invoices         — 发票查询
      /admin/v1/invoices/:id/refund  — 退款触发
      /admin/v1/finance          — 财务报表
```

**注意**：Admin 传递的是员工的 Zitadel access_token，platform-core 在 admin 路由上校验 token 含 `admin` claim。内部服务调用（如 notification 触发）使用 `INTERNAL_API_KEY`，不经过 Admin 层。

### ② Admin + zitadel-mcp：Chat 界面改用户的 Fallback 通道

当运营人员通过 AI Chat 工具（接入 `2l-svc-zitadel-mcp`）执行用户管理操作时，如果 MCP tool 调用失败（Zitadel API 超时、权限不足等），fallback 策略是：

```
AI Chat 工具
  → zitadel-mcp (MCP server, 调 Zitadel Admin API)
  → [失败] → fallback 提示员工
  → 员工手动登录 admin.lurus.cn
  → Admin LiveView 界面执行相同操作
  → 写审计日志
```

**适用场景**：
- 批量角色授予（zitadel-mcp 支持批量，Admin 只能单条）
- 紧急改密/锁号（zitadel-mcp 直接操作 Zitadel，Admin 经 platform-core 中转）
- Chat MCP 失败的降级路径（保证任何情况下都有 Web 界面兜底）

**⚠ 两个通道写同一数据**：zitadel-mcp 直接操作 Zitadel 用户数据，Admin 经 platform-core 操作 platform DB。确保两者操作的是同一 `user_id`（Zitadel sub），避免数据不一致。

---

## 运维常见问题

```mermaid
flowchart TD
    START([运维告警 / 员工反馈]) --> Q1{问题类型}

    Q1 -- SSO 登录失败 --> S1{具体表现}
    S1 -- 死循环跳转 --> S1A[查 callback 日志\ngrep oidc|state|role]
    S1A --> S1B{日志关键词}
    S1B -- invalid_state --> S1C[⚠ PHX_HOST 与访问域名不一致\n或 session cookie 跨域丢失\n→ 确认 https://admin.lurus.cn 访问]
    S1B -- admin role required --> S1D[⚠ Zitadel 未授 admin 角色\n→ auth.lurus.cn 控制台授权]
    S1B -- unauthorized_client --> S1E[⚠ client_secret 不匹配\n→ 更新 lurus-admin-secret 重启 Pod]

    Q1 -- LiveView 断流 / 转圈 --> L1[GET /health 检查 Pod 存活]
    L1 --> L2{/health 返回}
    L2 -- 200 --> L3[检查 Traefik IngressRoute\nWebSocket upgrade 是否透传]
    L2 -- 非200 / 超时 --> L4[kubectl describe pod\n查 CrashLoopBackOff 原因]
    L3 --> L5[多副本？\n检查 SECRET_KEY_BASE 是否所有 Pod 一致]
    L4 --> L6{日志关键词}
    L6 -- SECRET_KEY_BASE missing --> L7[kubectl get secret lurus-admin-secret\n补充缺失 key]
    L6 -- RELEASE_TMP eacces --> L8[检查 emptyDir volume mount /tmp\n补回 manifest 后 redeploy]

    Q1 -- Postgres 慢查 / 页面超时 --> P1[admin 无直连 PG\n→ 实为 platform-core 慢]
    P1 --> P2[kubectl top pod -n lurus-platform\nkubectl logs deploy/platform-core --tail=100]
    P2 --> P3{原因}
    P3 -- 全表扫描 --> P4[⚠ 通知 platform 团队加索引\n临时：减少 admin 查询频率]
    P3 -- 连接池耗尽 --> P5[检查 platform-core DB 连接池配置\n临时重启 platform-core]

    Q1 -- 审计日志未写 --> A1[确认 platform-core 返回 200]
    A1 --> A2{platform 日志}
    A2 -- auditRepo.Write 报错 --> A3[⚠ audit_logs 表结构不匹配或 PG 写失败\n→ 查 PG 磁盘空间 / 表权限]
    A2 -- 无相关日志 --> A4[⚠ Admin 未传 actor 字段\n→ 检查 ApiClient 调用是否含 actor]

    Q1 -- 误操作需回滚 --> R1{操作类型}
    R1 -- 钱包调整 --> R2[Admin 界面反向调整\namount 取负值，reason 注明"撤销操作"]
    R1 -- 发票退款 --> R3[⚠ 退款不可逆\n联系支付渠道人工处理\n在审计日志记录补救操作]
    R1 -- 账号冻结 --> R4[Admin 界面执行 unfreeze\nplatform-core 自动发 NATS 解冻通知]
    R1 -- 策略误审 --> R5[Admin /strategies 界面\n重新 PATCH status 为正确状态]
```

**快速索引**：

| 症状 | 入口命令 |
|---|---|
| SSO 死循环 | `kubectl logs -n lurus-admin deploy/lurus-admin --tail=100 \| grep -i 'oidc\|role\|state'` |
| LiveView 断流 | `curl -I https://admin.lurus.cn/health` + `kubectl get pods -n lurus-admin` |
| Postgres 慢查 | `kubectl top pod -n lurus-platform` + `kubectl logs deploy/platform-core --tail=100` |
| 审计未写 | `kubectl logs deploy/platform-core -n lurus-platform --tail=100 \| grep -i audit` |
| 误操作回滚 | 依操作类型见上方流程图，原则：可逆操作界面反向操作；不可逆（退款）联系渠道人工处理 |

---

appended 263 lines, 4 mermaid charts to admin.md
