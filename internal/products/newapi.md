---
title: Lurus Newapi
id: newapi
group: platform
priority: P0
status: live
owner: marvin (+ AI assist)
lastReviewed: 2026-05-28
sourcePath: 2b-svc-newapi
---

# Lurus Newapi 内部手册

> 🟡 **2026-05-28 状态更新**：仍是当前生产 LLM 网关（prod）；ADR D1 已决定退役 → 整合并入 newhub（hub.lurus.cn 将成唯一网关），PROD 切流（R-4）尚未执行，调用方式与地址暂不变。

> 仅限内部员工查阅。包含运维细节、决策档案、未公开问题。

## 一句话定位

Lurus Newapi 是公司全部 LLM 流量的统一网关，基于 QuantumNous/new-api fork 维护，承担模型路由、密钥池、负载均衡、failover、计费预扣、用量统计等核心职责。原 2b-svc-api（Lurus Hub）于 2026-04-23 下线后，newapi 成为平台组唯一的对外 LLM 中转站，所有产品（Kova、Lucrum、Switch、Tally 等）的 LLM 调用均经此服务路由。

## 速查

| 项 | 值 |
|---|---|
| 仓库 | github.com/hanmahong5-arch/lurus-newapi |
| 上游 | github.com/QuantumNous/new-api |
| 镜像 | ghcr.io/hanmahong5-arch/lurus-newapi:main-\<sha7\> |
| 域名 | newapi.lurus.cn |
| 端口 | pod:3000 / svc:3000 |
| 命名空间 | lurus-system |
| 数据存储 | PG schema `newapi` + Redis DB 0 (redis.lurus-system.svc:6379) |
| 关键依赖 | PostgreSQL lurus-pg-rw.database.svc:5432 / Redis lurus-system |
| 部署目标 | R1 PROD（cloud-ubuntu-1-16c32g，已对外商业交付） |
| 节点选择器 | `lurus.cn/vpn: "true"`（需要代理访问 Gemini 等境外 API）|

## 架构图

```mermaid
flowchart LR
  subgraph 外部客户端
    C1[Kova / Switch / Tally]
    C2[第三方 / 直接 API 用户]
  end

  subgraph ingress["Traefik Ingress (newapi.lurus.cn)"]
    TR[global-ratelimit middleware]
  end

  subgraph lurus-system["K8s Namespace: lurus-system"]
    direction TB
    NA[lurus-newapi Pod :3000]
    RD[Redis DB-0\n渠道缓存 / Session]

    subgraph relay["Relay 层"]
      D[Distributor 中间件\n渠道选择 + Affinity]
      RA[Relay.Relay\n预扣费 → relayHandler → 结算/退款]
      AD[GetAdaptor\n按 apiType 分发适配器]
    end

    subgraph adapters["Provider Adapters（30+）"]
      OA[OpenAI / Azure]
      CL[Claude / Anthropic]
      GM[Gemini / Vertex AI]
      DS[DeepSeek / SiliconFlow]
      OT[Ali / Baidu / Zhipu / ...]
    end
  end

  subgraph storage["持久化"]
    PG[(PostgreSQL\nschema: newapi)]
  end

  C1 -->|Bearer sk-...| TR
  C2 -->|Bearer sk-...| TR
  TR --> NA
  NA --> RD
  NA --> D
  D --> RA
  RA --> AD
  AD --> OA
  AD --> CL
  AD --> GM
  AD --> DS
  AD --> OT
  NA --> PG
```

## 模型调用链 sequenceDiagram

```mermaid
sequenceDiagram
  participant Client as 客户端 (Kova/Switch/...)
  participant Traefik as Traefik Ingress
  participant Auth as TokenAuth 中间件
  participant Dist as Distributor 中间件
  participant Relay as Relay Controller
  participant Billing as BillingSession
  participant Adaptor as Provider Adaptor
  participant Provider as 上游 LLM API

  Client->>Traefik: POST /v1/chat/completions Bearer sk-xxx
  Traefik->>Auth: 转发（经 global-ratelimit）
  Auth->>Auth: 验证 Token，写入 UserId/Group/Quota 至 Context
  Auth->>Dist: Next
  Dist->>Dist: 解析模型名；检查 TokenModelLimit
  Dist->>Dist: GetPreferredChannelByAffinity（亲和性优先）
  alt 亲和命中
    Dist->>Dist: 直接使用已绑定渠道
  else 亲和未命中
    Dist->>Dist: CacheGetRandomSatisfiedChannel（加权随机 + 优先级）
  end
  Dist->>Relay: SetupContextForSelectedChannel → Next
  Relay->>Relay: GenRelayInfo（构建 RelayInfo）
  Relay->>Relay: EstimateRequestToken（估算 prompt tokens）
  Relay->>Relay: ModelPriceHelper（计算预扣额度）
  Relay->>Billing: PreConsumeBilling（钱包 or 订阅预扣）
  Billing-->>Relay: BillingSession 挂载至 RelayInfo
  loop 最多 RetryTimes 次
    Relay->>Adaptor: relayHandler → GetAdaptor(apiType)
    Adaptor->>Adaptor: ConvertOpenAIRequest（格式转换）
    Adaptor->>Provider: HTTP / SSE / WebSocket
    alt 成功
      Provider-->>Adaptor: 流式/非流式响应
      Adaptor-->>Client: 转发响应
      Relay->>Billing: SettleBilling（实际 tokens 结算 delta）
    else 上游错误 / 超时
      Relay->>Relay: processChannelError（禁用/降权）
      Relay->>Dist: shouldRetry？→ 换渠道重试
    end
  end
  alt 全部失败
    Relay->>Billing: Refund（退还预扣）
    Relay-->>Client: 503 + error JSON
  end
```

## 代码地图

| 路径 | 职责 |
|---|---|
| `main.go` | 程序入口：加载 env / 初始化 DB+Redis / 启动 goroutine / Gin 服务器 |
| `common/` | env 初始化、Redis 客户端、HMAC 加密、JSON 包装、pprof 监控、rate-limit |
| `middleware/auth.go` | Token 鉴权（session / Bearer）、UserId/Group 注入 Context |
| `middleware/distributor.go` | 核心路由选择：亲和缓存 → 加权随机；MJ/Suno/Video 特殊路由 |
| `controller/relay.go` | `Relay()` 主流程：GenRelayInfo → token 估算 → 预扣费 → retry 循环 → 结算/退款 |
| `relay/relay_adaptor.go` | `GetAdaptor(apiType)` — 按渠道类型返回对应 Adaptor 实例 |
| `relay/channel/adapter.go` | `Adaptor` / `TaskAdaptor` 接口定义 |
| `relay/common/relay_info.go` | `RelayInfo` 结构体（请求全生命周期上下文）；`ChannelMeta`、计费字段 |
| `relay/common/billing.go` | `BillingSettler` 接口 |
| `service/billing.go` | `PreConsumeBilling` / `SettleBilling` 入口函数 |
| `service/billing_session.go` | `BillingSession`：预扣 → Settle → Refund，线程安全 |
| `service/funding_source.go` | `WalletFunding` / SubscriptionFunding 实现 |
| `service/channel_select.go` | `CacheGetRandomSatisfiedChannel`：跨分组 auto retry 策略 |
| `service/channel_affinity.go` | 亲和性路由：HybridCache（内存+Redis），基于 request fingerprint |
| `relay/channel/<provider>/` | 各 provider adaptor：格式转换 + DoRequest + DoResponse |
| `model/` | GORM 模型：Channel、Token、User、Log、Subscription 等 |
| `router/relay-router.go` | 路由注册：`/v1/*`、`/v1beta/*`、`/pg/*`（Playground）|
| `deploy/k8s.yaml` | Deployment + Service + IngressRoute + Secret + PVC |

## 部署

- **构建**: `go build -ldflags "-s -w" -o new-api .` + `cd web && bun install && bun run build`
- **CI**: `.github/workflows/docker-main.yml` — push to main → amd64 构建 → GHCR
- **镜像 tag 格式**: `main-<sha7>`（例如 `main-da3cb48`）
- **升级流程**: 修改 `deploy/k8s.yaml` 中镜像 tag → commit + push → ArgoCD auto-sync
- **当前镜像**: `ghcr.io/hanmahong5-arch/lurus-newapi:main-da3cb48`
- **节点**: 必须调度到 `lurus.cn/vpn=true` 节点（否则 Gemini 等境外 API 不可达）
- **外发代理**: `HTTP_PROXY=http://10.42.1.1:10808`（不走代理的内网段已在 `NO_PROXY` 中排除）
- **PVC**: `lurus-newapi-data` 5Gi local-path（日志 + 临时文件）
- **Secret**: `lurus-newapi-secret`（SQL_DSN / REDIS_CONN_STRING / SESSION_SECRET）
- **资源限制**: requests 256Mi/100m，limits 1Gi/1000m

## 运行与运维

```bash
# 查看 pod 状态
ssh root@100.98.57.55 "kubectl get pods -n lurus-system"

# 实时日志（含 SSE 流错误）
ssh root@100.98.57.55 "kubectl logs -n lurus-system deploy/lurus-newapi --tail=200 -f"

# 健康检查
ssh root@100.98.57.55 "kubectl exec -n lurus-system deploy/lurus-newapi -- wget -qO- http://localhost:3000/api/status"

# 重启（滚动）
ssh root@100.98.57.55 "kubectl rollout restart deployment/lurus-newapi -n lurus-system"

# 查看渠道状态（Web Admin 后台 /channel 页面，或直接查 DB）
ssh root@100.98.57.55 "kubectl exec -n database deploy/pg-primary -- psql -U lurus -d newapi -c \"SELECT id,name,type,status FROM channels ORDER BY id;\""
```

**关键指标（目前靠日志 grep，Prometheus 未接入）**：
- SSE 超时：`STREAMING_TIMEOUT=300s`（无数据则断流）
- Relay 超时：`RELAY_TIMEOUT=300s`
- 渠道缓存同步：`MEMORY_CACHE_ENABLED=true`，与 DB 定期同步
- Batch update：`BATCH_UPDATE_ENABLED=true`（日志批量写入，降低 DB 写压力）

## 上游同步策略

### Fork 关系

```
QuantumNous/new-api (upstream)
       │
       │ monthly merge / security patches immediately
       ▼
hanmahong5-arch/lurus-newapi (our fork, branch: main)
```

上游仓库：`https://github.com/QuantumNous/new-api`
同步频率：**每月常规 merge + 安全补丁即时合并**（来自 `lurus.yaml`）

### 同步步骤

```bash
# 1. 添加 upstream remote（首次）
git remote add upstream https://github.com/QuantumNous/new-api.git

# 2. 查看上游有多少新提交
git fetch upstream
git log HEAD..upstream/main --oneline | wc -l

# 3. 看具体 diff（评估冲突面积）
git log HEAD..upstream/main --oneline | head -30
git diff HEAD..upstream/main --stat | tail -20

# 4. 创建 merge 分支，不直接在 main 上操作
git checkout -b sync/upstream-$(date +%Y%m%d)
git merge upstream/main --no-ff

# 5. 解决冲突（见下方冲突热点）
# 6. 回归测试通过后 PR 合并到 main
```

### 当前状态（2026-04-24 记录）

本地 fork 落后上游约 **5650 commits**，版本号 v0.13.0。这是一个大型 merge 工程（48K 行 diff），需要专项排期：

- 预估冲突：至少 Gemini TTS/image2image 定制、timing-safe auth、pprof 守护、session cookie 名（`lurus-session`）、`NO_PROXY` 环境变量注入
- **建议策略**：不做一次性 merge，改为分批 cherry-pick 安全补丁 + 季度性 merge 功能更新

### Lurus 定制点（不可被上游覆盖）

| 定制点 | 位置 | 说明 |
|---|---|---|
| Session cookie 名 | `main.go:204` | `lurus-session`（避免与历史 cookie 冲突） |
| pprof 守护 | `main.go:139-145` / `common/pprof.go` | CPU 超阈值自动写 pprof 文件 |
| Gemini TTS/image2image | `relay/gemini_handler.go` | 上游可能无此扩展 |
| CI 配置 | `.github/workflows/docker-main.yml` | 自建 GHCR，上游用 Docker Hub |
| 代理环境变量 | `deploy/k8s.yaml:159-170` | HTTP_PROXY / NO_PROXY |
| DB 方言兼容注释 | `model/main.go` | 上游可能修改列名处理逻辑 |
| `BillingSession` | `service/billing_session.go` / `service/funding_source.go` | 钱包+订阅双资金来源——上游无此功能 |

**Rebase 注意**：每次 merge upstream 后，用 `git diff HEAD~1..HEAD -- service/billing*.go service/funding_source.go main.go` 确认计费定制代码未被覆盖。

## 渠道（Channel）与密钥池

### 渠道概念

渠道（Channel）是 newapi 中连接上游 LLM 提供商的配置单元，包含：
- `type`：提供商类型（OpenAI=1、Anthropic=14、Gemini=24、DeepSeek=43 等，共 30+ 种）
- `key`：API 密钥（支持多密钥池，以 `\n` 分隔）
- `models`：该渠道支持的模型列表
- `group`：访问分组（default / vip / auto 等）
- `priority`：同组内负载均衡优先级（越高越优先）
- `weight`：同优先级内加权随机比例
- `status`：enabled=1 / 手动禁用=2 / 自动禁用=3

### 密钥池（Multi-Key）

当 `key` 字段包含多行时，渠道自动启用多密钥轮转模式（`IsMultiKey=true`）：
- 请求时从密钥池中轮询选取（`ChannelMultiKeyIndex`）
- 某个 key 被上游封禁/限速后，系统可单独禁用该 key（`MultiKeyDisabledReason` / `MultiKeyDisabledTime`）而不影响整个渠道
- 密钥禁用信息存储在 `ChannelInfo` JSON 字段中

### 负载均衡与选择策略

`service/channel_select.go` → `CacheGetRandomSatisfiedChannel`：

1. **亲和性优先**（`service/channel_affinity.go`）：基于请求指纹（IP / User-Agent / 自定义字段）绑定渠道，保证 stateful 任务（如视频生成轮询）打到同一渠道
2. **优先级排序**：同分组内按 `priority` 降序，先用高优先级渠道
3. **加权随机**：同优先级内按 `weight` 随机选取
4. **跨分组 auto retry**：`tokenGroup=auto` 时，会依次尝试用户可用的所有分组，耗尽一个分组所有优先级再切换到下一分组

### Failover 机制

`controller/relay.go` Relay 函数中的 retry 循环：

```
for retry := 0; retry <= RetryTimes; retry++ {
  channel = getChannel(c, relayInfo, retryParam)
  err = relayHandler(c, channel)
  if err == nil { return }
  processChannelError(c, channel, err)  // 可能自动禁用渠道
  if !shouldRetry(c, err, remaining) { break }
  // 换渠道重试
}
```

- `shouldRetry` 判断条件：非 4xx 客户端错误 + 剩余重试次数 > 0 + 错误非 SkipRetry
- 自动禁用：连续失败达阈值后，渠道 status 置为 3（AutoDisabled）
- 禁用后：`AutomaticallyTestChannels()` goroutine 定期探活，恢复正常后重新 enable

## 计费 Hook

### 计费流程

```
请求到达 → ModelPriceHelper（查价格表）→ PreConsumeBilling（预扣）
                                                    ↓
                               BillingSession.funding.PreConsume()
                               → WalletFunding or SubscriptionFunding

请求完成 → SettleBilling(actualTokens)
         → delta = actual - preConsumed
         → funding.Settle(delta)     // 补扣或退还差额
         → 更新 Token 额度

请求失败 → BillingSession.Refund()  // 全额退还预扣，幂等
```

### 双资金来源

用户计费偏好（`billing_preference`）决定从哪里扣款：

| 偏好值 | 行为 |
|---|---|
| `subscription_first` | 优先订阅计划，耗尽后转钱包 |
| `wallet_first` | 优先钱包余额，不足时转订阅 |
| `subscription_only` | 仅订阅，订阅不足直接拒绝 |
| `wallet_only` | 仅钱包，余额不足直接拒绝 |

异步任务（视频/音乐生成）设置 `ForcePreConsume=true`，在提交时就预扣全额，因为 HTTP 返回后任务仍在运行。

### NATS 集成

当前版本 **未接入 NATS LLM_EVENTS 流**（`grep NATS` 无结果）。计费通知走内部 DB 写入 + `checkAndSendQuotaNotify`（邮件/站内通知）。`lurus.yaml` 中记录的 `LLM_EVENTS` 是规划阶段目标，待实现。

## 如何新增模型

### 新增已有渠道类型的模型（常见操作）

1. 登录 newapi 后台 `newapi.lurus.cn`（管理员账号）
2. 进入「渠道」页 → 找到目标渠道 → 编辑
3. 在「模型」字段添加新模型名称
4. 若需要模型映射（对外暴露名 ≠ 上游实际名），在「模型重定向」字段配置 `外部名:内部名`
5. 保存后渠道缓存会在下次 sync 周期（`SyncFrequency`）自动刷新，或点「测试」强制刷新

### 新增全新渠道类型（需要改代码）

以新增 `MyProvider` 为例：

1. **定义常量** (`constant/channel.go`)：
   ```go
   ChannelTypeMyProvider = 999
   ```
   并在 `ChannelTypeNames` map 中加条目。

2. **定义 API 类型** (`common/api_type.go`)：
   ```go
   const APITypeMyProvider = 999
   ```
   在 `ChannelType2APIType` 中添加映射。

3. **实现 Adaptor** (`relay/channel/myprovider/adaptor.go`)：
   实现 `channel.Adaptor` 接口的全部方法：`Init`, `GetRequestURL`, `SetupRequestHeader`, `ConvertOpenAIRequest`, `DoRequest`, `DoResponse`, `GetModelList`, `GetChannelName` 等。

4. **注册 Adaptor** (`relay/relay_adaptor.go`)：
   在 `GetAdaptor()` switch 中加 case。

5. **（可选）加入流式支持** (`relay/common/relay_info.go`)：
   在 `streamSupportedChannels` map 中添加 `ChannelTypeMyProvider: true`。

6. 本地测试：`go run main.go` → 新增渠道 → 发送测试请求。

> 注意：上游 TODO 注释显示，许多 provider（Ali、Baidu、AWS、Claude 等）的 `ConvertRerankRequest` / `ConvertEmbeddingRequest` 等接口方法是 `//TODO implement me` 占位，实际会 panic 或返回空，新增同类方法时须实现完整。

## 已知坑（内部专属）

1. **上游落后 5650 commits**：大型 merge 是独立工程（48K 行 diff），已知存在 rebase 风险。做 sync 前必须列出所有 Lurus 定制点，逐一比对冲突，不能直接 `git merge upstream/main`。
2. **circuit-breaker 已移除**：`deploy/k8s.yaml` 注释说明，Traefik circuit-breaker 曾导致上游 5xx → 熔断 → 视频下载等正常请求全部 503 级联失败。已移除，目前无熔断保护，依赖 newapi 内部 retry 逻辑。
3. **NATS LLM_EVENTS 未实现**：`lurus.yaml` 中配置了 `LLM_EVENTS` NATS stream，但 newapi 代码中无任何 NATS 客户端或事件发布逻辑。下游如有依赖此事件的服务，目前无数据。
4. **多 key 禁用信息存 JSON**：`MultiKeyDisabledReason` / `MultiKeyDisabledTime` 存储在 Channel 的 `ChannelInfo` JSON 字段，运维排查时无法直接 SQL 查询，需要应用层读取。
5. **SSE 不兼容 gzip**：代码注释 `// This will cause SSE not to work!!!` 已禁用 gzip 中间件，切勿在 router 层开启 gzip，否则 SSE 流式响应失效。
6. **api_version 未统一**：`middleware/distributor.go:377` 有 `// TODO: api_version统一`，Azure 渠道的 api_version 处理逻辑与其他渠道不一致，多渠道并存时可能出现版本漂移。
7. **SQLite 降级时序问题**：本地无 Redis 时回退 cookie session，但 K8s 部署缺 Redis 时仍会 fatal 退出（`common.FatalLog`），不会静默降级。Redis 必须可达。
8. **Redis DB 0 与 memorus 共享**：`lurus-system` 命名空间的 Redis 实例是 newapi 自带的 `redis:7-alpine`（`deploy/k8s.yaml`），不是 platform Redis。但 `lurus.yaml` 标注的 `redis: redis.lurus-system.svc:6379/0` 需确认没有其他服务写入 DB-0 造成键冲突。
9. **pprof 端口仅本地监听**：`ENABLE_PPROF=true` 时 pprof 监听 `127.0.0.1:8005`，需要 `kubectl port-forward` 才能访问，无法从集群外直接抓取 profile。
10. **Gemini 依赖 VPN 节点**：Pod 必须调度到 `lurus.cn/vpn=true` 节点，节点迁移或扩容时务必保留此 nodeSelector，否则 Gemini 系列模型请求全部超时。

## 决策档案

| 时间 | 决策 | 理由 |
|---|---|---|
| 2026-04-23 | 关闭 2b-svc-api（Lurus Hub），newapi 承接全部 LLM gateway 职责 | Hub 功能与 newapi 重叠，维护两套成本高，newapi 功能更完善 |
| 2026-04 | 移除 Traefik circuit-breaker | 上游 5xx 属正常（多 provider 可用性差异），熔断导致视频下载等正常请求级联失败 |
| 2026-04 | 上游 sync 策略改为 config-only 定制 | 减少 fork 侵入性改动，降低 merge 冲突面积；重量级定制走独立分支 |
| 2026-04-24 | 记录上游落后 5650 commits，暂不做大版本 merge | 时间成本过高（48K diff），安全补丁单独 cherry-pick 应对 |
| 初始 | Session cookie 命名为 `lurus-session` | 避免与历史部署的 `session` cookie（格式不兼容）冲突导致登录失效 |

## TODO / Roadmap

- [ ] 接入 NATS `LLM_EVENTS` 流，发布每次模型调用事件（model/tokens/latency/user） — 高优
- [ ] Prometheus metrics 端点（当前仅靠日志排障，无 QPS / p95 / error_rate 指标）— 高优
- [ ] 上游大版本 sync（v0.13.0 → latest）— 需专项排期，评估 48K diff 冲突
- [ ] Azure 渠道 api_version 统一（消除 `distributor.go:377` TODO）
- [ ] 完善 Ali / Baidu / AWS / Claude adaptor 的 Rerank / Embedding 接口（目前 `//TODO implement me`）
- [ ] HPA 验证：`deploy/hpa.yaml` 已存在，确认 CPU/Memory 阈值配置合理

## 应急 Runbook（10 分钟版）

### 模型挂了（单个模型无法使用）

**症状**：特定模型返回 503 或 "no available channel"

```bash
# 1. 查看哪些渠道支持该模型，当前状态
ssh root@100.98.57.55 "kubectl exec -n database deploy/pg-primary -- psql -U lurus -d newapi -c \"
  SELECT c.id, c.name, c.type, c.status, c.response_time
  FROM channels c
  WHERE c.models LIKE '%gpt-4o%'
  ORDER BY c.status, c.priority DESC;
\""

# 2. 如果渠道被自动禁用（status=3），查看原因
ssh root@100.98.57.55 "kubectl exec -n database deploy/pg-primary -- psql -U lurus -d newapi -c \"
  SELECT id, name, status, last_tested_time
  FROM channels WHERE status = 3;
\""

# 3. 在 Web Admin 后台手动 enable 渠道并测试
# 进入 newapi.lurus.cn → 渠道 → 找到禁用渠道 → 手动启用 → 点击「测试」

# 4. 查看近期错误日志确认是否是上游 API 问题
ssh root@100.98.57.55 "kubectl logs -n lurus-system deploy/lurus-newapi --tail=500 | grep 'relay error'"
```

### 渠道全挂（所有渠道不可用）

**症状**：所有请求返回 503，日志大量 "no available channel"

```bash
# 1. 快速诊断：检查渠道缓存是否正常
ssh root@100.98.57.55 "kubectl logs -n lurus-system deploy/lurus-newapi --tail=100 | grep -E 'cache|channel'"

# 2. 检查 Redis 是否可达
ssh root@100.98.57.55 "kubectl exec -n lurus-system deploy/lurus-newapi -- wget -qO- http://localhost:3000/api/status"

# 3. 强制重建渠道缓存：重启 Pod（触发 InitChannelCache）
ssh root@100.98.57.55 "kubectl rollout restart deployment/lurus-newapi -n lurus-system"

# 4. 等待 Pod 就绪（startupProbe 最多 5min）
ssh root@100.98.57.55 "kubectl rollout status deployment/lurus-newapi -n lurus-system"

# 5. 如果是上游 API 全面故障，在后台批量禁用故障渠道，保留可用渠道
```

### 密钥池耗尽 / API Key 封禁

**症状**：特定渠道大量 429 或 401，多 key 渠道逐一失效

```bash
# 1. 查看多密钥渠道的禁用情况（JSON 字段需应用层读，此处查整个渠道状态）
ssh root@100.98.57.55 "kubectl exec -n database deploy/pg-primary -- psql -U lurus -d newapi -c \"
  SELECT id, name, type, status, other_info
  FROM channels
  WHERE other_info::text LIKE '%MultiKeyDisabled%'
     OR status = 3;
\""

# 2. 在 Web Admin 后台 → 渠道详情 → 查看各个 Key 的禁用状态并手动恢复或替换
# 路径：newapi.lurus.cn → 渠道 → 编辑 → Key 管理

# 3. 添加新 key（追加到 key 字段，换行分隔），保存后立即生效（无需重启）

# 4. 临时应急：新建备用渠道（同类型不同账号），priority 设高，先顶上
```

### 上游 sync 冲突（merge upstream 时）

**症状**：`git merge upstream/main` 产生大量冲突

```bash
# 1. 终止当前 merge，回到安全状态
git merge --abort

# 2. 列出 Lurus 定制文件（高冲突风险）
git diff main..upstream/main -- \
  main.go \
  service/billing.go service/billing_session.go service/funding_source.go \
  middleware/auth.go \
  deploy/k8s.yaml \
  .github/workflows/docker-main.yml \
  | head -100

# 3. 分批 cherry-pick（推荐：先只摘安全补丁）
git log upstream/main --oneline | grep -i "security\|fix\|cve" | head -10
# 逐个 cherry-pick 安全修复
git cherry-pick <sha>

# 4. 大版本 merge 时：创建专用分支，解决冲突后充分测试再 PR
git checkout -b sync/upstream-$(date +%Y%m%d)
git merge upstream/main
# 解决冲突 → 优先保留 service/billing*.go 中的 BillingSession 实现
# → go test ./... → bun run build → Docker build 验证 → PR

# 5. 合并后必须验证的定制点
grep -n "lurus-session" main.go                    # session cookie 名
grep -n "BillingSession" service/billing_session.go  # 计费会话
grep -n "ENABLE_PPROF" main.go                     # pprof 守护
```

### 服务整体挂了

```bash
# 1. 查 Pod 状态
ssh root@100.98.57.55 "kubectl get pods -n lurus-system"

# 2. 查启动日志（InitChannelCache panic 会在这里出现）
ssh root@100.98.57.55 "kubectl logs -n lurus-system deploy/lurus-newapi --tail=200"

# 3. 查 describe（OOM / 探针失败 / 镜像拉取失败）
ssh root@100.98.57.55 "kubectl describe pod -n lurus-system -l app=lurus-newapi"

# 4. 重启
ssh root@100.98.57.55 "kubectl rollout restart deployment/lurus-newapi -n lurus-system"

# 5. 回滚（改 manifest 镜像 tag 为上一个 sha7）
# 编辑 deploy/k8s.yaml，将 image tag 改回上一版本
# git add deploy/k8s.yaml && git commit -m "rollback: revert to main-<prev-sha>"
# git push → ArgoCD auto-sync

# 6. 检查 PostgreSQL 连通性（newapi 启动时 InitDB 若失败会 fatal）
ssh root@100.98.57.55 "kubectl exec -n database deploy/pg-primary -- psql -U lurus -d newapi -c 'SELECT 1;'"

# 7. 检查 Redis 连通性
ssh root@100.98.57.55 "kubectl exec -n lurus-system deploy/redis -- redis-cli ping"
```

---

## 多视角速览

**终端用户**：无需改代码，只需把 OpenAI SDK 的 `base_url` 换成 `https://newapi.lurus.cn/v1`，`api_key` 换成平台下发的 `sk-...` token，即可透明访问 50+ 模型，用法与官方 OpenAI SDK 完全一致。

**开发者**：50+ 模型统一接口，支持 `model_mapping` 让调用方无感切换上游；内置 Token 级限流（QPM/TPM）、group 分组、多 key 池轮转、streaming SSE；所有渠道均可配置 failover，单渠道故障自动重试切换不影响业务。

**运维**：部署在 R1（43.226.46.164，`lurus-system` 命名空间，pod:3000）；Redis DB 0 用于渠道缓存与 session，Redis DB 2 用于全局限流（`global-ratelimit` middleware）；VPN 节点 `lurus.cn/vpn=true` 是硬依赖，迁移/扩容必须保留该 nodeSelector。

**决策者**：自托管网关不锁定云厂商，可随时切换或增减上游 provider；计费与上游完全解耦，内部自定义倍率和资金来源（钱包 / 订阅双轨）；敏感 API Key 统一在 newapi 管理，下游产品只持有平台 token，泄露面收窄。

---

## 决策树：什么场景用 Newapi

```mermaid
graph TD
    A[需要调用 LLM API] --> B{是否需要混用\n多家模型提供商?}
    B -- 否 --> C{是否需要\n计费聚合/用量统计?}
    C -- 否 --> D{是否需要\nIP 限流/Token 限速?}
    D -- 否 --> E{团队是否能\n安全管理多个\n云厂商 API Key?}
    E -- 能 --> F[✓ 直连云厂商\n成本最低，延迟最小]
    E -- 不能 --> G[✓ 走 Newapi\n统一 Key 管理，降低泄露风险]
    D -- 是 --> G
    C -- 是 --> G
    B -- 是 --> G
    G --> H{是否需要\nfailover 容灾?}
    H -- 是 --> I[✓ 配置多渠道 + 自动重试]
    H -- 否 --> J[✓ 单渠道即可]
    I --> K[newapi.lurus.cn\n统一入口]
    J --> K
```

---

## 典型时序图

```mermaid
sequenceDiagram
    participant Client as 客户端（Switch/Lucrum/Kova）
    participant NA as Newapi :3000
    participant Redis as Redis DB-0\n渠道缓存/Session
    participant RLRedis as Redis DB-2\n全局限流
    participant UP as 上游 Provider\n(OpenAI/Claude/通义)
    participant PG as PostgreSQL\nschema:newapi
    participant NATS as NATS LLM_EVENTS\n（规划中，未实现）

    Client->>NA: POST /v1/chat/completions\nAuthorization: Bearer sk-xxx
    NA->>RLRedis: 检查全局限流（Traefik middleware）
    RLRedis-->>NA: 通过
    NA->>NA: TokenAuth 验证 sk-xxx\n注入 UserId/Group/Quota
    NA->>Redis: 读取渠道缓存\nCacheGetRandomSatisfiedChannel
    Redis-->>NA: 返回可用渠道列表
    NA->>NA: 预扣费 PreConsumeBilling\n(WalletFunding / SubscriptionFunding)
    NA->>PG: 写预扣记录
    NA->>UP: 转发请求（流式 SSE 或 JSON）
    UP-->>NA: 响应（streaming chunks）
    NA-->>Client: 实时转发 SSE chunks
    NA->>PG: SettleBilling（实际 tokens 结算 delta）
    NA->>PG: 写请求日志（model/tokens/latency/channel）
    NA->>Redis: 更新渠道健康状态（response_time）
    Note over NA,NATS: ⚠ LLM_EVENTS 发布待实现\n当前仅 DB 写入 + 邮件通知
```

---

## 端到端完整例子

### 前置：设置环境变量

```bash
export NEWAPI_TOKEN="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export NEWAPI_BASE="https://newapi.lurus.cn/v1"
```

### Step 1：管理员配置渠道（后台操作，一次性）

登录 `https://newapi.lurus.cn`（管理员账号）→ 渠道 → 新建渠道：
- 类型：OpenAI（或 Anthropic / 通义千问）
- 模型：填入该渠道支持的模型名
- 模型重定向（可选）：`claude-sonnet-4:claude-sonnet-4-20251101`

### Step 2：管理员生成 Token

后台 → 令牌 → 新建令牌：设置名称、分组（default/vip）、额度上限、模型限制，保存后复制 `sk-...`。

### Step 3：调用 chat completion（curl）

```bash
# 使用 gpt-4o-mini
curl -s https://newapi.lurus.cn/v1/chat/completions \
  -H "Authorization: Bearer $NEWAPI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "用一句话解释量子纠缠"}],
    "stream": false
  }' | python3 -m json.tool
```

**真实响应 JSON 示例**：

```json
{
  "id": "chatcmpl-a1b2c3d4e5f6",
  "object": "chat.completion",
  "created": 1745900000,
  "model": "gpt-4o-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "量子纠缠是指两个粒子无论相距多远，对其中一个的测量会瞬时影响另一个的量子态。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 18,
    "completion_tokens": 38,
    "total_tokens": 56
  }
}
```

### Step 4：切换模型（无需改任何其他配置）

```bash
# 切换到 Claude Sonnet 4
curl -s https://newapi.lurus.cn/v1/chat/completions \
  -H "Authorization: Bearer $NEWAPI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model": "claude-sonnet-4", "messages": [{"role": "user", "content": "用一句话解释量子纠缠"}]}'

# 切换到通义千问 Max
curl -s https://newapi.lurus.cn/v1/chat/completions \
  -H "Authorization: Bearer $NEWAPI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model": "qwen-max", "messages": [{"role": "user", "content": "用一句话解释量子纠缠"}]}'
```

### Step 5：Python SDK 调用（流式）

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    base_url="https://newapi.lurus.cn/v1",
)

# 流式输出
stream = client.chat.completions.create(
    model="gpt-4o-mini",   # 改成 "claude-sonnet-4" 或 "qwen-max" 即可切换
    messages=[{"role": "user", "content": "写一首关于 AI 的五言绝句"}],
    stream=True,
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()
```

### Step 6：查看用量

后台 → 日志 → 按日期/用户/模型/渠道筛选，可导出 CSV。

或直接查 DB：

```bash
ssh root@100.98.57.55 "kubectl exec -n database deploy/pg-primary -- psql -U lurus -d newapi -c \"
  SELECT model_name, COUNT(*) AS calls,
         SUM(prompt_tokens) AS prompt_tk,
         SUM(completion_tokens) AS comp_tk,
         SUM(quota) AS total_quota
  FROM logs
  WHERE created_at > NOW() - INTERVAL '7 days'
  GROUP BY model_name ORDER BY total_quota DESC LIMIT 20;
\""
```

---

## 最佳实践 ✓/✗

| # | ✓ 推荐 | ✗ 避免 |
|---|--------|--------|
| 1 | ✓ 用 `model_mapping` 在渠道层做别名（如 `claude-sonnet-4:claude-sonnet-4-20251101`），客户端无感切换上游版本 | ✗ 在代码里硬编码上游 model 全名（如 `claude-sonnet-4-20251101`），上游改名时所有调用方都要改 |
| 2 | ✓ Token 按 group 分配（产品线/团队维度），搭配 QPM/TPM 限流，独立审计用量 | ✗ 一个 root token 给所有产品线共享，额度耗尽影响全平台，且无法溯源哪个产品超量 |
| 3 | ✓ 配置多渠道 failover（同模型绑定多个渠道，priority 梯度拉开），上游故障自动重试切换 | ✗ 只配单渠道，上游挂机时直接 5xx 影响终端用户 |
| 4 | ✓ 开启渠道 `health_check`（自动探活），配合 Prometheus alert（待接入）做主动告警 | ✗ 只看 Prometheus 不设报警规则，渠道静默失败直到用户投诉才发现 |
| 5 | ✓ 长文本/大模型响应走 streaming（`"stream": true`），避免前端长时间等待 loading | ✗ 所有请求 sync 模式，单次大输出阻塞 30s+ 导致 Traefik 超时或客户端 504 |
| 6 | ✓ 关注不同上游同名模型的单价差异（`ModelPriceHelper` 按渠道计价），定期审查渠道成本效比，低价高质渠道优先 | ✗ 不算账，所有渠道同等对待；可能把流量压到贵 3-5 倍的渠道上而不自知 |
| 7 | ✓ 密钥池（多行 key）分散单 key 的 RPM 上限风险，单 key 封禁不影响整个渠道 | ✗ 每个渠道只填一个 key，key 被限速时整个渠道瘫痪 |
| 8 | ✓ 异步任务（视频/音乐生成）设 `ForcePreConsume=true` 在提交时预扣全额，避免任务跑完无钱结算 | ✗ 异步任务走普通预扣逻辑，任务运行期间用户钱包归零导致无法结算、事后退款逻辑复杂 |

---

## 跨产品集成场景

### 配方一：Switch 桌面端 → Newapi → 多模型透传

Switch（`2c-gui-switch`）是桌面 AI 网关，用户在桌面端发起对话后，Switch 作为本地代理将请求转发至 newapi：

```
用户桌面 → Switch (localhost:port)
         → POST https://newapi.lurus.cn/v1/chat/completions
           Authorization: Bearer <switch-platform-token>
           model: "gpt-4o" | "claude-sonnet-4" | "qwen-max"
         → Newapi Distributor 选渠道 → 上游 Provider
         → 流式响应回 Switch → 桌面 UI 实时渲染
```

关键点：
- Switch 持有一个专属平台 token（group: switch），独立限流与用量审计
- 用户在 Switch UI 切换模型时，只改 `model` 字段，其余不变
- ✓ Switch 侧不存储任何上游 API Key，泄露面为零

### 配方二：Lucrum 量化策略 → Newapi 行情解读 → MemX 长期记忆

Lucrum（`2c-svc-lucrum`）策略引擎在行情分析阶段调用 newapi 对市场数据做自然语言解读，并将重要结论写入 MemX（`2b-svc-memorus`）形成长期记忆：

```
Lucrum 策略引擎
  → POST https://newapi.lurus.cn/v1/chat/completions
    model: "qwen-max"（低延迟，适合高频触发）
    messages: [{role: "user", content: "分析以下 K 线数据...${kline_data}"}]
  → 获取解读结论
  → POST https://memorus.lurus-system.svc/v1/memory/add
    {"user_id": "lucrum-strategy-001", "data": "解读结论", "metadata": {"source": "newapi"}}
  → 下次策略触发时 GET /v1/memory/search?query=... 拉取历史判断做上下文
```

关键点：
- Lucrum 使用独立 group token，QPM 限流与交易系统隔离，互不影响
- 行情解读属于高频小请求，选低延迟低成本模型（`qwen-max` / `gpt-4o-mini`）
- MemX 存储使结论可跨策略轮次复用，避免重复推理

---

## 运维常见问题

```mermaid
flowchart TD
    START([收到告警 / 用户反馈]) --> Q1{所有模型\n都不可用?}

    Q1 -- 否 --> Q2{特定模型\n503 / no channel?}
    Q2 -- 是 --> A1[查渠道状态\nSELECT status FROM channels\nWHERE models LIKE '%model%']
    A1 --> A2{status=3\n自动禁用?}
    A2 -- 是 --> A3[后台手动 enable\n点击「测试」验证]
    A2 -- 否 --> A4{status=2\n手动禁用?}
    A4 -- 是 --> A5[确认上游恢复后\n手动 enable]
    A4 -- 否 --> A6[查上游 API 状态页\n检查 key 是否有效]

    Q1 -- 是 --> B1{返回 429\n限流错误?}
    B1 -- 是 --> B2[检查 Redis DB-2\n全局限流 key 占用\n或 Token QPM 超限]
    B2 --> B3[临时提高限流阈值\n或切换更大 group]
    B1 -- 否 --> C1{日志有\n余额耗尽?}
    C1 -- 是 --> C2[后台 → 用户管理\n充值钱包或提升订阅计划]
    C1 -- 否 --> D1{上游 CF challenge\n/ 407 Proxy Auth?}
    D1 -- 是 --> D2[⚠ 检查 VPN 节点状态\nHTTP_PROXY=http://10.42.1.1:10808\n确认代理进程正常]
    D1 -- 否 --> E1{Streaming\n中断 / 空响应?}
    E1 -- 是 --> E2[检查 STREAMING_TIMEOUT=300s\n检查 Traefik IngressRoute timeout\n确认 gzip 未被误开]
    E2 --> E3[⚠ gzip 与 SSE 不兼容\n严禁在 router 层开启 gzip]
    E1 -- 否 --> F1{Redis 慢查\n/ 高延迟?}
    F1 -- 是 --> F2[redis-cli SLOWLOG GET 10\n检查 MEMORY_CACHE_ENABLED\n是否渠道缓存刷新频繁]
    F2 --> F3[临时增大 SyncFrequency\n或重启 pod 重建缓存]
    F1 -- 否 --> G1[kubectl logs --tail=500\ngrep 'relay error'\n查看具体错误码]
```
