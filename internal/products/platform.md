---
title: Lurus Platform
id: platform
group: platform
priority: P0
status: live
owner: marvin (+ AI assist)
lastReviewed: 2026-04-28
sourcePath: 2l-svc-platform
---

# Lurus Platform 内部手册

## 一句话定位

Lurus Platform 是全公司唯一的账号、钱包、计费、订阅、通知与邮件中台——所有产品的用户身份和资金流转必须经由它，不得绕过。它对资金零损失负责：任何扣款失败都必须回滚，不接受"扣了钱但订阅没开"的状态。技术上它是一个 Go 单体（Gin + gRPC 双协议），加上两个独立部署的子模块（notification / mail）。

## 速查

| 项目 | 值 |
|------|-----|
| 仓库 | `github.com/hanmahong5-arch/lurus-platform` |
| 源码目录 | `2l-svc-platform/` |
| 镜像 | `ghcr.io/hanmahong5-arch/lurus-platform-core:main-<sha7>` |
| 主域名 | `identity.lurus.cn` |
| HTTP 端口 | `18104` (ClusterIP `platform-core.lurus-platform.svc`) |
| gRPC 端口 | `18105` (ClusterIP 同上) |
| 命名空间 | `lurus-platform` |
| Kubernetes Deployment | `platform-core` |
| ArgoCD App | argocd 管理，auto-sync on push main |
| PostgreSQL schemas | `identity`, `billing`, `notification` |
| Redis DB | `3` (host: `redis.lurus-system.svc:6379`) |
| NATS Stream | `IDENTITY_EVENTS` |
| Temporal Workflows | `SubscriptionRenewal`, `PaymentCompletion`, `SubscriptionLifecycle`, `ExpiryScanner` |
| Temporal Namespace | 默认 (同 cluster Temporal server) |
| 关键依赖 | Zitadel (auth.lurus.cn), PostgreSQL (lurus-pg-rw.database.svc:5432), Redis, NATS, Temporal |
| 子模块 Notification | `lurus-notification.lurus-platform.svc:18900` |
| 子模块 Mail | Stalwart SMTP/JMAP + Roundcube webmail |
| 部署目标 | R1 PROD (43.226.46.164) — 已对外商业交付 |
| 前端 Apps | `login.lurus.cn` (Zitadel 自定义登录), `admin.lurus.cn` (管理后台) |

## 架构图

```mermaid
flowchart TD
    subgraph entry["入口"]
        EXT["外部用户 / 其他服务"]
    end

    subgraph cmd["cmd/core — 启动层"]
        MAIN["main.go\n配置加载 + 依赖注入 + goroutine 编排"]
    end

    subgraph http["HTTP :18104 (Gin)"]
        ROUTER["router.Build\n路由注册"]
        HANDLERS["Handlers\naccount / wallet / subscription\nproduct / invoice / refund\nqr / registration / checkin\nadmin / webhook / sms-relay"]
        SPA["嵌入 SPA\n(web/dist)"]
    end

    subgraph grpc["gRPC :18105"]
        GRPCSRV["IdentityService\nGetEntitlements / WalletDebit\nWalletPreAuthorize / UpsertAccount..."]
    end

    subgraph app["internal/app — 用例层"]
        WALLETSVC["WalletService\n充值/扣款/预授权/对账"]
        SUBSVC["SubscriptionService\n订阅激活/到期/宽限期"]
        ACCSVC["AccountService\nZitadel sub → account_id 映射"]
        ENTSVC["EntitlementService\n权益快照 (Redis 缓存)"]
        REGSVC["RegistrationService\n注册/SMS/Email验证"]
        RECSVC["ReconciliationWorker\n每5分钟 stale 订单核查"]
    end

    subgraph domain["internal/domain/entity — 领域层"]
        WALLET_E["Wallet / WalletTransaction\nPaymentOrder / PreAuth"]
        SUB_E["Subscription / AccountEntitlement"]
        ACC_E["Account / Organization / VIP"]
    end

    subgraph adapter["internal/adapter — 适配层"]
        REPOPKG["repo/\nWalletRepo / SubscriptionRepo\n(SELECT FOR UPDATE + DECIMAL SQL)"]
        NATSPUB["nats/ Publisher\n+ outbox.DLQPublisher (Redis fallback)"]
        PAYGATE["payment/\nStripe / Alipay / WeChat / Epay / Creem\nWorldFirst — fallback 链路"]
    end

    subgraph temporal["Temporal Worker (内嵌)"]
        RENEW["SubscriptionRenewalWorkflow\nSaga: Debit → Activate → Compensate"]
        LIFECYCLE["SubscriptionLifecycleWorkflow"]
        EXPIRY["ExpiryScanner (hourly)"]
        PAYCOMP["PaymentCompletionWorkflow"]
    end

    subgraph ext["外部基础设施"]
        ZIT["Zitadel\nOIDC / JWKS / Service Account"]
        PG["PostgreSQL\nschema: identity / billing / notification"]
        REDIS["Redis DB=3\n幂等锁 / 权益缓存 / DLQ outbox"]
        NATS["NATS JetStream\nIDENTITY_EVENTS stream"]
        STALWART["Stalwart SMTP\nmail.lurus.cn"]
        NOTIF["Notification Module\n:18900 WS/Email/FCM"]
        TEMPORAL_SRV["Temporal Server"]
    end

    EXT --> ROUTER
    EXT --> GRPCSRV
    ROUTER --> HANDLERS
    HANDLERS --> app
    GRPCSRV --> app
    app --> domain
    app --> adapter
    adapter --> PG
    adapter --> REDIS
    NATSPUB --> NATS
    NATSPUB --> REDIS
    WALLETSVC --> REPOPKG
    temporal --> app
    temporal --> TEMPORAL_SRV
    ACCSVC --> ZIT
    HANDLERS --> NOTIF
    HANDLERS --> STALWART
    MAIN --> http
    MAIN --> grpc
    MAIN --> temporal
```

## 核心数据流

### 1. 钱包扣款幂等流程（HTTP 路径 + DB 原子扣款）

```mermaid
sequenceDiagram
    participant C as 调用方 (kova / lucrum)
    participant H as WalletHandler/gRPC
    participant WS as WalletService
    participant RDB as Redis
    participant PG as PostgreSQL (billing schema)

    C->>H: WalletDebit / POST /internal/v1/wallet/debit<br/>(idempotency_key = "kova:job:uuid")
    H->>RDB: GET idem:{key} — 幂等检查
    alt 已处理
        RDB-->>H: 已有结果
        H-->>C: 200 cached result
    else 首次
        H->>WS: Debit(accountID, amount, ...)
        WS->>PG: BEGIN TX<br/>SELECT ... FOR UPDATE (wallet row)<br/>UPDATE wallets SET balance = balance - ? WHERE (balance - frozen) >= ?<br/>RowsAffected == 0 → return insufficient
        PG-->>WS: rows affected=1, balance_after
        WS->>PG: INSERT wallet_transactions (append-only ledger)
        PG-->>WS: OK
        WS-->>H: WalletTransaction
        H->>RDB: SET idem:{key} result EX 86400
        H-->>C: 200 {balance_after, tx_id}
    end
```

### 2. 订阅续费 Temporal Workflow（Saga 模式）

```mermaid
sequenceDiagram
    participant ES as ExpiryScanner<br/>(hourly Temporal)
    participant TW as SubscriptionRenewalWorkflow
    participant QA as QueryActivities<br/>GetPlanByID
    participant WA as WalletActivities<br/>Debit
    participant SA as SubscriptionActivities<br/>Activate
    participant EA as EventActivities<br/>PublishToNATS
    participant PG as PostgreSQL
    participant NATS as NATS JetStream

    ES->>TW: StartWorkflow(RenewalInput)
    TW->>QA: GetPlanByID(planID)
    QA->>PG: SELECT plan pricing
    PG-->>QA: price_cny
    QA-->>TW: plan{priceCNY, code}

    TW->>WA: Debit(accountID, priceCNY)
    WA->>PG: SELECT FOR UPDATE → UPDATE balance (atomic)
    PG-->>WA: OK / insufficient
    alt 余额不足
        WA-->>TW: error
        TW->>EA: PublishToNATS(subscription.expired)
        EA->>NATS: publish
        TW-->>ES: error (workflow fails, no money moved)
    else 扣款成功
        WA-->>TW: DebitOutput{txID}
        TW->>SA: Activate(accountID, productID, planID)
        SA->>PG: INSERT subscription
        alt 激活失败
            SA-->>TW: error
            Note over TW: SAGA COMPENSATION
            TW->>WA: Credit(priceCNY, "renewal_refund")<br/>DisconnectedContext — 即使 workflow 被取消也执行
            WA->>PG: UPDATE balance + INSERT tx
            TW->>EA: PublishToNATS(subscription.expired)
        else 激活成功
            SA-->>TW: ActivateOutput{subID}
            TW->>SA: ResetRenewalState(subID)
            TW->>EA: PublishToNATS(subscription.activated)
            EA->>NATS: publish
            TW-->>ES: nil (success)
        end
    end
```

## 代码地图

| 路径 | 职责 |
|------|------|
| `cmd/core/main.go` | 启动入口：配置加载、依赖注入（DB/Redis/NATS/Temporal）、goroutine 编排（HTTP + gRPC + Worker + Reconciler） |
| `cmd/sms-test/main.go` | 一次性 CLI，用于线下验证 SMS 发送（不部署到 K8s） |
| `internal/domain/entity/` | 核心实体：Account, Wallet, WalletTransaction, PaymentOrder, PreAuth, Subscription, AccountEntitlement, VIP, Invoice, Refund, QRSession... |
| `internal/app/wallet_service.go` | 钱包用例：Topup / Debit / Credit / PreAuthorize / SettlePreAuth / ReleasePreAuth / CreateCheckoutSession |
| `internal/app/subscription_service.go` | 订阅生命周期：Activate / Expire / Grace / Cancel |
| `internal/app/entitlement_service.go` | 权益快照计算 + Redis 缓存（TTL 5min，ConfigMap 可调） |
| `internal/app/account_service.go` | 账号 CRUD + `UpsertByZitadelSub`（首次登录自动建账） |
| `internal/app/registration_service.go` | 注册 + Email/SMS 验证 + 推荐码奖励钩子 |
| `internal/app/reconciliation_worker.go` | 每5分钟：stale pending orders / 已付但未入账的订单扫描 |
| `internal/app/refund_service.go` | 退款：小额直接审批，大额走 QR-delegate Boss 扫码 |
| `internal/app/sms/usecase.go` | SMS 中继用例：Aliyun/Tencent 短信，最多3次重试，限速检测 |
| `internal/adapter/repo/wallet.go` | `Credit` / `Debit`：`SELECT FOR UPDATE` + SQL DECIMAL 算术，append-only 账本 |
| `internal/adapter/repo/subscription.go` | 订阅 CRUD，`GetActive` 防重复激活 |
| `internal/adapter/grpc/server.go` | gRPC `IdentityService` 实现：GetEntitlements, WalletDebit/Credit/PreAuth, UpsertAccount |
| `internal/adapter/handler/` | Gin handlers（account / wallet / subscription / qr / webhook / sms-relay / admin ...） |
| `internal/adapter/handler/qr_handler.go` | QR 登录 / 加入组织 / QR-delegate 危险操作（删账号、大额退款、OIDC App 删除） |
| `internal/adapter/payment/` | 支付提供商适配：Stripe / Alipay / WeChat / Epay / Creem / WorldFirst；主提供商熔断后自动 fallback 到 Epay |
| `internal/adapter/nats/` | NATS 发布者 + 消费者（VIP 事件） |
| `internal/pkg/auth/` | Zitadel JWKS JWT 验证 + Redis 缓存 sub→account_id（TTL 10min） |
| `internal/pkg/outbox/` | DLQ 包装：NATS 发布失败 → Redis list `outbox:dlq`（7天TTL），Prometheus 计数器 |
| `internal/pkg/idempotency/` | Webhook 幂等去重（Redis SET NX，TTL 24h） |
| `internal/temporal/workflows/subscription_renewal.go` | Saga 工作流：Debit → Activate → 补偿性 Credit（Disconnected Context 保证执行） |
| `internal/temporal/workflows/expiry_scanner.go` | 每小时扫描到期订阅，触发 ExpiryScanner |
| `internal/temporal/workflows/payment_completion.go` | 支付完成后回调处理工作流 |
| `internal/module/` | 可插拔模块注册表：notification / mail 通过 hooks 注入，不影响核心启动 |
| `internal/module/ops/` | 特权操作目录（approve_refund / delete_account / delete_oidc_app / rotate_secret），供审计看板消费 |
| `modules/notification/` | 独立子模块：WS + Email + FCM 三通道分发，NATS 消费 IDENTITY_EVENTS，Digest Worker，模板引擎 |
| `modules/mail/stalwart/` | Stalwart 部署配置（SMTP/IMAP/JMAP） |
| `modules/mail/webmail/` | Roundcube/JMAP 前端 + Worker |
| `apps/login/` | Next.js 15，Zitadel 自定义登录 UI（login.lurus.cn） |
| `apps/admin/` | Next.js 15 + shadcn/ui，管理后台（admin.lurus.cn） |
| `deploy/k8s/base/` | Deployment + Service + IngressRoute + HPA + PDB + ConfigMap + Secrets + RBAC + ServiceMonitor |
| `deploy/k8s/overlays/` | Kustomize overlays：with-notification / with-mail / full |
| `migrations/` | SQL migrations（identity + billing schema，按序号执行） |

## 部署

### 构建

```bash
# 生产构建（CGO 关闭，scratch 镜像用）
CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -trimpath -o app ./cmd/core

# Proto 重新生成（需要 buf CLI）
cd proto && buf generate && buf lint

# 本地开发（含 .env 加载）
go run ./cmd/core
```

### CI 流程

- 触发：push `main`，路径 `2l-svc-platform/**`
- GHA → 构建镜像 → push `ghcr.io/hanmahong5-arch/lurus-platform-core:main-<sha7>`
- ArgoCD 检测到镜像 tag 变更 → auto-sync → RollingUpdate（maxUnavailable=0，maxSurge=1）

### 镜像 tag 约定

| 环境 | Tag 格式 |
|------|----------|
| PROD | `main-<sha7>` (e.g. `main-a3f8c12`) |
| STAGE | `latest` |

deployment.yaml 中 `rollout.lurus.cn/revision` annotation 用于强制 ArgoCD 检测 `:main` tag 变更。

### 环境变量注入

- **ConfigMap** `platform-core-config`：PORT/GRPC_PORT/TZ/ENV/REDIS_ADDR/REDIS_DB/NATS_ADDR/GRACE_PERIOD_DAYS/OTEL_*/RATE_LIMIT_*/各支付 URL
- **Secret** `platform-core-secrets`：DATABASE_DSN / INTERNAL_API_KEY / ZITADEL_ISSUER + JWKS_URL + AUDIENCE + SERVICE_ACCOUNT_PAT / REDIS_PASSWORD / 各支付密钥（STRIPE / EPAY / CREEM / ALIPAY / WECHAT / WORLDFIRST）/ SMS 密钥（ALIYUN / TENCENT）/ STALWART_ADMIN_PASSWORD / SESSION_SECRET

### ArgoCD

```bash
# 查看 sync 状态
ssh root@100.98.57.55 "kubectl get applications -n argocd | grep platform"

# 手动触发 sync（auto-sync 关闭时）
ssh root@100.98.57.55 "argocd app sync lurus-platform"
```

## 运行与运维

### 健康检查端点

| 端点 | 用途 |
|------|------|
| `GET /health` | liveness + startup probe（容器内 :18104） |
| `GET /readyz` | readiness probe，主动验证 Redis + PostgreSQL 连通性 |
| `GET /metrics` | Prometheus scrape（unauthenticated，ServiceMonitor 自动发现） |

NATS **不在** readiness set 中——outbox 会降级到 Redis DLQ，NATS 断线不应摘流量。

### 关键日志（JSON structured，Loki 可搜索）

| 关键词 | 含义 |
|--------|------|
| `wallet/topup` | 充值成功，含 balance_after |
| `wallet/debit` | 扣款成功 |
| `wallet/mark-order-paid` | 支付订单翻转为 paid，did_transition=true 时才实际入账 |
| `CRITICAL: saga compensation ... failed` | Temporal 补偿失败，**立即人工介入** |
| `nats publisher init failed` | NATS 断线，事件进 Redis DLQ |
| `outbox_dlq_total` 上涨 | DLQ 有积压，需排查 NATS |
| `lurus-platform build sha=...` | 启动第一行，核对镜像版本 |

### 关键 Prometheus 指标

| 指标 | 含义 |
|------|------|
| `wallet_operations_total{type,result}` | 各类钱包操作成功/失败计数 |
| `wallet_amount_total{type}` | 各类金额累计（topup/debit/credit...） |
| `payment_order_transitions_total{from,to,order_type,method}` | 订单状态机转换 |
| `qr_delegate_confirms_total{op,result}` | 特权操作 QR 扫码确认统计 |
| `outbox_published_total` / `outbox_dlq_total` | NATS 发布健康度 |
| `http_requests_total` / `http_request_duration_seconds` | Gin 路由 HTTP 指标 |

### 重启 / 滚动更新命令

```bash
# 查看 pod 状态
ssh root@100.98.57.55 "kubectl get pods -n lurus-platform"

# 强制滚动重启（不改镜像）
ssh root@100.98.57.55 "kubectl rollout restart deployment/platform-core -n lurus-platform"

# 查看最近100行日志
ssh root@100.98.57.55 "kubectl logs -n lurus-platform deploy/platform-core --tail=100"

# 跟踪实时日志
ssh root@100.98.57.55 "kubectl logs -n lurus-platform deploy/platform-core -f"

# 查看 rollout 状态
ssh root@100.98.57.55 "kubectl rollout status deployment/platform-core -n lurus-platform"
```

## 数据契约

### gRPC 服务（:18105）— 下游消费者

`IdentityService` proto: `proto/proto/identity/v1/identity.proto`
认证：所有 RPC 需 `Authorization: Bearer <INTERNAL_API_KEY>` metadata。

| RPC | 消费者 |
|-----|--------|
| `GetEntitlements` | kova, lucrum, newapi — 查权益 |
| `WalletDebit` / `WalletCredit` | kova（LLM 调用计费）, lucrum |
| `WalletPreAuthorize` / `WalletSettlePreAuth` / `WalletReleasePreAuth` | kova streaming（预授权流控） |
| `UpsertAccount` / `GetAccountByZitadelSub` | 所有需要身份解析的服务 |
| `GetAccountOverview` | admin 后台 |

### HTTP Internal API（:18104）— 下游消费者

认证：`Authorization: Bearer <INTERNAL_API_KEY>`

| 路由 | 说明 |
|------|------|
| `POST /internal/v1/subscriptions/checkout` | 外部服务发起订阅购买（Wallet 扣款 or 外部支付） |
| `POST /internal/v1/accounts/:id/wallet/topup` | 管理员给账户充值 |
| `GET /internal/v1/accounts/:id/wallet/transactions` | 交易流水 |
| `POST /internal/v1/sms/relay` | Zitadel webhook → Aliyun/Tencent SMS 中继 |

### NATS 事件（IDENTITY_EVENTS stream）

| Subject | 发布方 | 消费方 |
|---------|--------|--------|
| `identity.subscription.activated` | Platform | notification 模块、lucrum |
| `identity.subscription.expired` | Platform | notification 模块 |
| `identity.org.member_joined` | Platform (QR confirm) | notification 模块 |
| `identity.referral.signup` | Platform | notification 模块 |
| `identity.usage.reported` | 外部服务 → Platform NATS consumer | VIPService 累计消费 |

### 核心 DB 表（按 schema）

**identity schema**

| 表 | 说明 |
|----|------|
| `identity.accounts` | 主账号表，`zitadel_sub` unique，`lurus_id` UUID |
| `identity.subscriptions` | 订阅状态机（pending/trial/active/grace/expired/cancelled/suspended） |
| `identity.account_entitlements` | 权益快照，source: subscription/admin_grant/promo |
| `identity.vip_records` | VIP 等级记录 |
| `identity.organizations` | 组织/团队 |

**billing schema**

| 表 | 说明 |
|----|------|
| `billing.wallets` | 余额 DECIMAL(14,4)，`frozen` 字段用于预授权 |
| `billing.wallet_transactions` | append-only 账本，Amount 为带符号 DECIMAL(14,4) |
| `billing.payment_orders` | 外部支付订单，`idempotency_key` unique index |
| `billing.wallet_pre_authorizations` | 预授权记录，status: active/settled/released/expired |
| `billing.redemption_codes` | 兑换码，`used_count` + `max_uses` 原子控制 |
| `billing.refunds` | 退款记录，大额走 QR boss 审批 |
| `billing.reconciliation_issues` | 对账异常记录 |

**幂等 key 设计**

| 场景 | Key |
|------|-----|
| Webhook 去重 | Redis SET NX `webhook:dedup:{provider}:{order_no}` TTL 24h |
| 支付订单 | `billing.payment_orders.idempotency_key` DB unique index |
| 通知去重 | `notif:{event_id}:{channel}` DB unique index（notification schema） |
| NATS DLQ | Redis list `outbox:dlq`，JSON 序列化 IdentityEvent，TTL 7天 |
| Zitadel sub → account_id | Redis `sub:id:{sub}` TTL 10min |

## 已知坑

1. **钱包精度 float64 参数传递**：`Wallet.Balance` 在 Go 层是 `float64`，DB 层是 `DECIMAL(14,4)`。所有余额计算在 SQL 里做（`balance - ?`），不在 Go 层做，但函数签名仍接受 `float64`。调用方传入 `0.1 + 0.2` 这类浮点值理论上有漂移风险，目前靠"SQL 算，Go 只传参数"规避，但没有显式的精度转换层。

2. **Temporal 必须先于 Platform 启动**：`lurustemporal.NewClient` 失败直接 `return error`，导致整个进程退出。Temporal server 不可用时 Platform 无法启动，连带影响所有服务的身份验证。应改为软降级但目前没有。

3. **QR Handler 双路径到 2026-06-01 才清**：`qr_handler.go:1065` 有 TODO，`T` 字段有新旧两种格式兼容路径，legacy 代码计划 6 月删但还没删，现在每次读代码需要同时理解两条路径。

4. **Ops Registry `MustRegister` 在 main 里 panic**：`ops/registry.go:65` 重复注册 op type 会 panic，是有意为之（deployer 错误，非 runtime 条件），但因为注册调用散落在 main.go 多处，重构时很容易踩。

5. **apps.yaml App Registry 对 K8s ServiceAccount 有强依赖**：`buildAppRegistryReconciler` 不在 K8s pod 里运行时静默 disable，本地开发会看到 "not in a K8s pod, reconciler disabled" 日志，容易误以为部署有问题。实际上这是正常降级。

6. **Notification 和 Mail 模块 ConfigMap 默认 disabled**：`MODULES_MAIL_ENABLED: "false"` 和 `MODULES_NOTIFICATION_ENABLED: "false"` 是 base ConfigMap 默认值，需要 overlay 覆盖才能启用。忘记换 overlay 部署就会导致账号创建后邮箱没开、通知不推送，且启动日志不会有明显错误。

7. **SMS 短信功能待 E2E 验证**：CLAUDE.md 原文 `Status: code complete — needs E2E SMS verification with a real test phone number`，代码写好了但没有真实手机号做过 E2E 测试。上线前必须验证。

8. **Subscription 表在 identity schema，Wallet 表在 billing schema**：跨 schema join 在 PostgreSQL 里可以但 GORM 需要显式声明 `TableName()`，目前 `Subscription.TableName()` 返回 `identity.subscriptions` 而 `Wallet.TableName()` 返回 `billing.wallets`。新增实体时容易忘记声明，会落到 `public` schema 造成数据分区混乱。

## 决策档案

### 为何选 Temporal 而非 cron

2025 年底前使用 cron job 驱动订阅续费，出现过"扣款成功但订阅激活失败"的资金丢失问题（cron 没有 Saga 补偿机制，数据库事务跨进程无法保证）。迁移到 Temporal 后，`SubscriptionRenewalWorkflow` 的 Step 3 失败时通过 `DisconnectedContext` 执行 Credit 补偿，Temporal Server 保证 compensation activity 最终执行。这是 P0 级别的架构变更，解决了零资金损失的核心约束。

### 为何剥离 lurus-hub（2b-svc-api）

lurus-hub 原本是 LLM 中转站，2026-04-23 从产品线移除。原因：功能与 new-api (2b-svc-newapi) 重叠，维护两套中转站成本高；所有消费者已迁移到 new-api。备份在 `D:/_backup/2b-svc-api-2026-04-23.tar.gz`。Platform 仍通过 `NewAPIProxyHandler` 为 admin 界面代理 new-api 管理 API。

### 为何双协议（HTTP + gRPC）

- HTTP :18104：面向前端、管理后台、第三方 webhook，语义清晰，Traefik IngressRoute 直接暴露
- gRPC :18105：面向内部服务（kova/lucrum），强类型契约（.proto），自动带 OTel tracing（otelgrpc），减少内部调用的序列化开销
- 两个协议共享同一套 `app/` 层，没有业务逻辑重复

### 为何支付做 fallback 链路

直接接 Alipay/WeChat 比通过 Epay 网关便宜（手续费差约 0.5%），但直连有熔断风险。`payment.Registry.SetFallback` 在主提供商 circuit open 时自动降级到 Epay，用户无感知，避免了深夜支付通道断开无法充值的问题。

### QR-delegate 模式（Phase 4）

大额退款（approve_refund）、删账号（delete_account）、删 OIDC App（delete_oidc_app）等危险操作需要"Boss 用手机扫码确认"。这解决了单管理员账号被盗后一键删数据的安全问题。每个 executor 实现 `QRDelegateExecutor` + `ops.DelegateOp` 两个接口，catalog endpoint 自动暴露到 Lutu APP 确认界面。

## TODO / Roadmap

- [ ] SMS E2E 验证（需真实手机号，CLAUDE.md 标注待验证）
- [ ] QR Handler legacy 路径清理（截止 2026-06-01）
- [ ] Temporal 软降级：Temporal 不可用时允许 Platform 启动，Subscription 续费暂停（非整体挂）
- [ ] 钱包精度：函数签名从 `float64` 改为 `string` 或 `decimal.Decimal` 类型，彻底杜绝浮点传播
- [ ] Notification + Mail overlay 自动化测试（当前 ConfigMap disabled 容易漏测）
- [ ] Reconciliation Worker 从 5 分钟改为可配置（当前硬编码）
- [ ] gRPC 服务增加 `ListSubscriptions` RPC（现在各服务要通过 HTTP 查，不优雅）
- [ ] Admin 后台支持多管理员角色（当前所有 admin 等价，无细粒度权限）

## 应急 Runbook（10 分钟版）

### 场景一：钱包扣款挂了（用户充值后余额未更新）

```bash
# 1. 查 pod 日志，搜索 wallet/mark-order-paid 和 CRITICAL
ssh root@100.98.57.55 "kubectl logs -n lurus-platform deploy/platform-core --tail=200 | grep -E 'mark-order-paid|CRITICAL|wallet'"

# 2. 查 Prometheus：payment_order_transitions_total 中 to=paid 最近是否有计数
# Grafana: https://grafana.lurus.cn

# 3. 如怀疑 webhook 幂等 key 问题（同一订单多次回调），查 Redis DLQ
ssh root@100.98.57.55 "kubectl exec -n lurus-platform deploy/platform-core -- /bin/sh -c 'redis-cli -h redis.lurus-system.svc -n 3 LLEN outbox:dlq'"

# 4. 检查 billing.payment_orders 状态
ssh root@100.98.57.55 "kubectl exec -n database deploy/postgres -- psql -U postgres -c \"SELECT order_no, status, paid_at, amount_cny FROM billing.payment_orders WHERE status='pending' ORDER BY created_at DESC LIMIT 20;\""

# 5. 如确认订单已 paid 但钱包未入账，人工触发 topup（需 INTERNAL_API_KEY）
curl -s -X POST https://identity.lurus.cn/internal/v1/accounts/{id}/wallet/topup \
  -H "Authorization: Bearer $INTERNAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100.0, "order_no": "manual-fix-LO...", "description": "manual reconciliation"}'
```

### 场景二：订阅没续上（用户反馈 Pro 权益消失）

```bash
# 1. 查订阅状态
ssh root@100.98.57.55 "kubectl exec -n database deploy/postgres -- psql -U postgres -c \"SELECT id, account_id, product_id, status, expires_at, grace_until, renewal_attempts FROM identity.subscriptions WHERE account_id={account_id} ORDER BY id DESC LIMIT 5;\""

# 2. 查 Temporal workflow 历史（用 Temporal UI 或 CLI）
ssh root@100.98.57.55 "kubectl exec -n temporal deploy/temporal-frontend -- tctl workflow list --query 'WorkflowType=\"SubscriptionRenewalWorkflow\"' --pagesize 10"

# 3. 查钱包余额是否不足
ssh root@100.98.57.55 "kubectl exec -n database deploy/postgres -- psql -U postgres -c \"SELECT balance, frozen, balance-frozen AS available FROM billing.wallets WHERE account_id={account_id};\""

# 4. 余额足够但续费失败 → 查 Temporal workflow 失败原因
# 登录 Temporal UI: temporal.lurus.cn（如有）或通过 kubectl port-forward

# 5. 紧急人工续期（admin API）
curl -s -X POST https://admin.lurus.cn/admin/v1/subscriptions/{sub_id}/renew \
  -H "Authorization: Bearer <admin_jwt>"
```

### 场景三：Zitadel 挂了（全站无法登录）

```bash
# 1. 确认 Zitadel pod 状态
ssh root@100.98.57.55 "kubectl get pods -n lurus-platform | grep zitadel"
ssh root@100.98.57.55 "kubectl logs -n lurus-platform deploy/zitadel --tail=50"

# 2. Platform 本身不依赖 Zitadel 处理已登录请求（JWT 验证用 JWKS，有 Redis 缓存 1小时）
# → 已登录用户短时间内 (1h) 不受影响，新登录和 token 刷新失败

# 3. JWKS 缓存 TTL = 1h（ValidatorConfig.JWKSTTL），到期前平台功能正常
# 如需延长，临时调高 CACHE_ENTITLEMENT_TTL 并重启 pod（仅为应急，不是长期措施）

# 4. Zitadel 重启
ssh root@100.98.57.55 "kubectl rollout restart deployment/zitadel -n lurus-platform"
ssh root@100.98.57.55 "kubectl rollout status deployment/zitadel -n lurus-platform"

# 5. 确认 Platform 日志中 JWKS 刷新成功
ssh root@100.98.57.55 "kubectl logs -n lurus-platform deploy/platform-core --tail=50 | grep -i jwks"
```

### 场景四：邮件发不出（注册验证邮件 / 通知邮件失效）

```bash
# 1. 确认 Stalwart 状态
ssh root@100.98.57.55 "kubectl get pods -n mail | grep stalwart"

# 2. 检查 Platform ConfigMap 中 STALWART_ADMIN_URL 是否设置
ssh root@100.98.57.55 "kubectl get configmap platform-core-config -n lurus-platform -o yaml | grep -i stalwart"

# 3. 检查 Secret 中 STALWART_ADMIN_PASSWORD
ssh root@100.98.57.55 "kubectl get secret platform-core-secrets -n lurus-platform -o jsonpath='{.data.STALWART_ADMIN_PASSWORD}' | base64 -d"

# 4. 手动测试 Stalwart API 连通性（从 Platform pod 内）
ssh root@100.98.57.55 "kubectl exec -n lurus-platform deploy/platform-core -- wget -qO- http://stalwart.mail.svc:8080/api/health"

# 5. 查 notification 模块日志（邮件通道）
ssh root@100.98.57.55 "kubectl logs -n lurus-platform deploy/lurus-notification --tail=100 | grep -i 'email\|smtp\|send'"

# 6. 检查 NATS DLQ 中是否有积压的 notification 事件
ssh root@100.98.57.55 "kubectl exec -n lurus-platform deploy/platform-core -- /bin/sh -c 'redis-cli -h redis.lurus-system.svc -n 3 LLEN outbox:dlq'"
```
