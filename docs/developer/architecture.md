# 系统架构

本文档面向开发者和运维人员，详细介绍 Lurus 混合云集群的系统架构设计。

> 最后更新: 2026-01-15

## 整体架构

```
                           ┌──────────────────────────────────────┐
                           │            Internet                   │
                           └──────────────────────────────────────┘
                                            │
                                            ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                              Traefik Ingress                                   │
│                         (TLS 终止, 负载均衡, 路由)                             │
│                              *.lurus.cn:443                                    │
│                         cloud-ubuntu-1-16c32g (Master)                         │
└───────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                           Lurus API Gateway                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Auth       │  │   Router    │  │   Relay     │  │   Logger    │          │
│  │  认证鉴权   │  │   路由调度   │  │   请求转发   │  │   日志计费   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                                │
│  Go + Gin Framework | 运行于 cloud-ubuntu-3-2c2g (VPN 出口节点)               │
└───────────────────────────────────────────────────────────────────────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
            ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
            │ PostgreSQL  │         │    NATS     │         │   MinIO     │
            │ (CNPG)      │         │  JetStream  │         │  对象存储   │
            │ cloud-      │         │ office-     │         │ office-     │
            │ ubuntu-2    │         │ debian-2    │         │ win-1       │
            └─────────────┘         └─────────────┘         └─────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
            ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
            │   OpenAI    │         │   Claude    │         │   Gemini    │
            └─────────────┘         └─────────────┘         └─────────────┘
```

## 混合云集群架构

Lurus 采用基于 **K3s + Tailscale VPN** 的混合云架构，将云服务器与本地服务器统一组网。

```
                        ┌─────────────────────────────────────────┐
                       │           Tailscale VPN (100.x.x.x)     │
                       └─────────────────────────────────────────┘
                                           │
        ┌──────────────────┬───────────────┼───────────────┬──────────────────┐
        │                  │               │               │                  │
   ┌────▼─────────┐  ┌────▼─────────┐ ┌───▼─────────┐ ┌───▼─────────┐  ┌─────▼─────┐
   │cloud-ubuntu-1│  │cloud-ubuntu-2│ │cloud-ubuntu-3│ │office-debian│  │office-win │
   │   -16c32g    │  │   -4c8g      │ │   -2c2g     │ │    -2       │  │   -1      │
   │   16C32G     │  │    4C8G      │ │    2C2G     │ │   4C8G      │  │   32GB    │
   │    50M       │  │     5M       │ │     4M      │ │   本地       │  │  Win10    │
   │  Traefik     │  │     PG       │ │ lurus-api   │ │   NATS      │  │  MinIO    │
   │  网关入口    │  │   数据库     │ │  VPN出口    │ │  消息队列   │  │ 对象存储   │
   └──────────────┘  └──────────────┘ └─────────────┘ └─────────────┘  └───────────┘
```

### 节点详细信息

| 角色 | Tailscale 名称 | 配置 | Tailscale IP | K8s 角色 | 主要职责 |
|------|---------------|------|--------------|---------|---------|
| master | cloud-ubuntu-1-16c32g | 16C32G / 50M | 100.98.57.55 | control-plane | Traefik 网关、ArgoCD、监控栈、Cert-Manager |
| database | cloud-ubuntu-2-4c8g | 4C8G / 5M | 100.94.177.10 | worker | PostgreSQL 主库 (CNPG) |
| worker | cloud-ubuntu-3-2c2g | 2C2G / 4M | 100.113.79.77 | worker | lurus-api (VPN 出口) |
| messaging | office-debian-2 | 4C8G / 本地 | 100.120.110.73 | worker | NATS JetStream、CNPG Operator |
| storage | office-win-1 | 32GB / Win10 | 100.79.24.40 | **非K8s** | MinIO 对象存储 |

## 业务端口规范 (8850-8899)

**规则**: 所有 Lurus 业务服务端口范围 8850-8899，越基础的服务端口越低，十位数区分业务类型。

| 端口范围 | 业务类型 | 说明 |
|---------|---------|------|
| **8850-8859** | 核心基础设施 | API网关、认证、计费等基础服务 |
| **8860-8869** | 论文润色服务 | 论文润色相关业务 |
| **8870-8879** | AI服务 | AI模型、推理服务 |
| **8880-8889** | 工具服务 | 各类工具、辅助服务 |
| **8890-8899** | 预留 | 未来业务扩展 |

### 当前端口分配

| 端口 | 服务名 | 说明 | 状态 |
|------|--------|------|------|
| 8850 | lurus-api | LLM 统一接口网关 | ✅ 运行中 |
| 8880 | stalwart-webmail | 邮件 Webmail | ✅ 运行中 |
| 8881 | stalwart-admin | 邮件管理界面 | ✅ 运行中 |

## 核心组件

### 1. API Gateway (lurus-api)

主服务进程，负责处理所有 LLM API 请求。**部署于 cloud-ubuntu-3-2c2g 节点**，该节点具有 VPN 出口能力，可访问国外 AI 服务。

**技术栈**:
- 语言: Go 1.23
- 框架: Gin
- 数据库: PostgreSQL (GORM)
- 端口: 8850

**核心模块**:

| 模块 | 职责 |
|------|------|
| `router/` | HTTP 路由定义 |
| `controller/` | 请求处理逻辑 |
| `relay/` | 上游请求转发 |
| `model/` | 数据模型和数据库操作 |
| `middleware/` | 认证、限流、日志中间件 |

### 2. 数据存储

**PostgreSQL (CNPG)**
- 部署: cloud-ubuntu-2-4c8g 节点
- 管理: CloudNative PostgreSQL Operator
- 备份: 每日 02:00 UTC 自动备份到 MinIO
- 连接: `lurus-pg-rw.database.svc:5432`

**主要数据表**:

```sql
-- 用户表
users (id, username, password, role, status, quota, ...)

-- API 令牌
tokens (id, user_id, key, name, status, quota, models, ...)

-- 渠道配置
channels (id, name, type, key, base_url, models, priority, weight, ...)

-- 调用日志
logs (id, user_id, token_id, channel_id, model, tokens, quota, ...)
```

### 3. 消息队列 (NATS JetStream)

- 部署: office-debian-2 节点
- 资源限制: 1C/2Gi
- 连接: `nats.messaging.svc:4222`

用于异步任务处理：
- 日志写入
- 配额更新
- 渠道状态检测
- 任务调度

### 4. 对象存储 (MinIO)

- 部署: office-win-1 (本地 Windows 主机，**非 K8s 节点**)
- API: http://100.79.24.40:9000
- 控制台: http://100.79.24.40:9001
- 用途: PostgreSQL 备份、大文件存储

> **注意**: 本机可能断线，仅用于存储。业务写入 MinIO 失败时应返回错误而非 fallback。

## K8s 集群详情

**集群版本**: K3s v1.34.3+k3s1

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              K3s Cluster (4 节点)                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐           │
│  │ cloud-ubuntu-1     │  │ cloud-ubuntu-2     │  │ cloud-ubuntu-3     │           │
│  │ -16c32g (master)   │  │ -4c8g (database)   │  │ -2c2g (worker)     │           │
│  │                    │  │                    │  │                    │           │
│  │ • Traefik          │  │ • PostgreSQL       │  │ • lurus-api        │           │
│  │ • ArgoCD           │  │   (CNPG)           │  │   (VPN 出口)       │           │
│  │ • Cert-Manager     │  │                    │  │ • svclb            │           │
│  │ • Prometheus       │  │                    │  │                    │           │
│  │ • Grafana          │  │                    │  │                    │           │
│  │ • Loki             │  │                    │  │                    │           │
│  │ • Jaeger           │  │                    │  │                    │           │
│  │ • Stalwart Mail    │  │                    │  │                    │           │
│  │ • lurus-docs       │  │                    │  │                    │           │
│  └────────────────────┘  └────────────────────┘  └────────────────────┘           │
│                                                                                     │
│  ┌────────────────────┐                                                            │
│  │ office-debian-2    │  节点标签:                                                 │
│  │ (messaging)        │  • lurus.cn/vpn=true (cloud-ubuntu-3) - VPN 出口           │
│  │                    │  • lurus/role=database (cloud-ubuntu-2) - 数据库专用       │
│  │ • NATS JetStream   │                                                            │
│  │ • CNPG Operator    │                                                            │
│  └────────────────────┘                                                            │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 运行中的服务

#### 基础设施

| Namespace | 服务 | 用途 | 所在节点 | 资源限制 |
|-----------|------|------|---------|---------|
| kube-system | Traefik | 入口网关 | cloud-ubuntu-1-16c32g | 500m/512Mi |
| kube-system | CoreDNS | 集群 DNS | cloud-ubuntu-1-16c32g | - |
| cert-manager | Cert-Manager | TLS 证书自动管理 | cloud-ubuntu-1-16c32g | - |
| database | PostgreSQL (CNPG) | 主数据库 | cloud-ubuntu-2-4c8g | CNPG 管理 |
| cnpg-system | CNPG Operator | PostgreSQL 管理 | cloud-ubuntu-1-16c32g | - |
| messaging | NATS JetStream | 消息队列 | office-debian-2 | 1C/2Gi |

#### 业务服务

| Namespace | 服务 | 端口 | 域名 | 所在节点 | 资源限制 |
|-----------|------|------|------|---------|---------|
| lurus-system | lurus-api | 8850 | api.lurus.cn | cloud-ubuntu-3-2c2g | 500m/1Gi |
| lurus-docs | lurus-docs | 80 | docs.lurus.cn | cloud-ubuntu-1-16c32g | 100m/64Mi |
| mail | Stalwart | 8880/8881 | mail.lurus.cn | cloud-ubuntu-1-16c32g | 1C/1Gi |
| argocd | ArgoCD | - | argocd.lurus.cn | cloud-ubuntu-1-16c32g | 500m/1Gi |

#### 可观测性

| Namespace | 服务 | 域名 | 所在节点 | 资源限制 |
|-----------|------|------|---------|---------|
| monitoring | Prometheus | prometheus.lurus.cn | cloud-ubuntu-1-16c32g | 1C/2Gi |
| monitoring | Grafana | grafana.lurus.cn | cloud-ubuntu-1-16c32g | 500m/1Gi |
| observability | Loki | loki.lurus.cn | cloud-ubuntu-1-16c32g | 500m/1Gi |
| observability | Jaeger | jaeger.lurus.cn | cloud-ubuntu-1-16c32g | 500m/1Gi |

## 请求处理流程

```
1. 请求到达
   Client → Traefik (TLS) → lurus-api (cloud-ubuntu-3-2c2g)

2. 认证鉴权
   解析 Authorization Header → 查询 Token → 验证权限

3. 路由选择
   解析 model 参数 → 匹配可用渠道 → 负载均衡选择

4. 请求转发 (VPN 出口)
   构造上游请求 → 通过 VPN 发送到 OpenAI/Claude/Gemini → 接收响应

5. 响应处理
   解析响应 → 统计 Token → 计费 → 记录日志 → 返回客户端
```

## 渠道路由算法

```go
// 渠道选择逻辑 (简化)
func selectChannel(model string, group string) *Channel {
    // 1. 筛选支持该模型的渠道
    channels := filterByModel(model)
    
    // 2. 筛选状态正常的渠道
    channels = filterByStatus(channels, StatusEnabled)
    
    // 3. 按优先级排序
    sort.Slice(channels, func(i, j int) bool {
        return channels[i].Priority > channels[j].Priority
    })
    
    // 4. 同优先级按权重随机
    return weightedRandom(channels)
}
```

## 高可用设计

### 故障转移

```
渠道 A (priority=10, weight=80)  ─┐
                                  ├─→ 请求优先发往 A
渠道 B (priority=10, weight=20)  ─┘
                                       │
                                       ▼ (A 失败)
渠道 C (priority=5)              ─────→ 自动切换到 C
```

### 健康检查

- **Liveness Probe**: `/api/status` 每 15 秒检查
- **Readiness Probe**: `/api/status` 每 5 秒检查
- **渠道探测**: 定时测试各渠道可用性

## 域名与 TLS

所有服务均通过 HTTPS 访问，TLS 证书由 Let's Encrypt 自动签发。

| 服务 | 域名 | 状态 |
|------|------|------|
| LLM API 网关 | https://api.lurus.cn | ✅ |
| API 文档 | https://docs.lurus.cn | ✅ |
| ArgoCD | https://argocd.lurus.cn | ✅ |
| Grafana | https://grafana.lurus.cn | ✅ |
| Prometheus | https://prometheus.lurus.cn | ✅ |
| NATS Monitor | https://nats.lurus.cn | ✅ |
| Jaeger | https://jaeger.lurus.cn | ✅ |
| Loki | https://loki.lurus.cn | ✅ |
| Webmail | https://mail.lurus.cn | ✅ |
| Mail Admin | https://admin-mail.lurus.cn | ✅ |

## 监控与可观测性

| 组件 | 用途 | 地址 |
|------|------|------|
| Prometheus | 指标采集 | https://prometheus.lurus.cn |
| Grafana | 可视化 | https://grafana.lurus.cn |
| Loki | 日志聚合 | https://loki.lurus.cn |
| Jaeger | 链路追踪 | https://jaeger.lurus.cn |

### 关键指标

```prometheus
# 请求量
lurus_api_requests_total{model, status}

# 请求延迟
lurus_api_request_duration_seconds{model}

# Token 用量
lurus_api_tokens_total{model, type}

# 渠道状态
lurus_api_channel_status{channel}
```

## 存储架构

### PVC 列表

| Namespace | 名称 | 容量 | 用途 |
|-----------|------|------|------|
| database | lurus-pg-1 | 20Gi | PostgreSQL 数据 |
| messaging | nats-data | 10Gi | NATS JetStream |
| mail | stalwart-data | 10Gi | 邮件数据 |

### 备份策略

| 数据 | 目标 | 调度 | 保留 |
|------|------|------|------|
| PostgreSQL | MinIO s3://pg-backups-v2/ | 每天 02:00 UTC | 7 天 |

## GitOps 工作流

### ArgoCD 流程

```
代码推送 → GitHub Actions 构建镜像 → GHCR → ArgoCD 自动同步 → K8s 部署
```

### 代码仓库

| 仓库 | 用途 | 地址 |
|------|------|------|
| lurus-api | LLM 统一网关 | https://github.com/hanmahong5-arch/lurus-api |
| lurus-switch | 微服务平台 | https://github.com/hanmahong5-arch/lurus-switch |

## 安全设计

1. **传输安全**: 全站 HTTPS (Let's Encrypt 自动续期)
2. **网络隔离**: Tailscale VPN 组网，节点间安全通信
3. **认证**: API Key 机制，支持多 Key 管理
4. **授权**: 基于角色的权限控制 (RBAC)
5. **日志审计**: 完整请求日志，支持追溯
6. **VPN 出口**: 国外 AI 服务请求通过 VPN 节点访问

## 容灾策略

### 本机 (MinIO) 断线处理
- PG 备份优先到 MinIO，但云端保留最近一份
- 大文件写入 MinIO 失败时返回错误，不做 fallback
- Prometheus 监控 MinIO 可用性

### 节点故障
- **Master 故障**: 所有服务不可用，需人工恢复
- **DB 节点故障**: PostgreSQL 有 PDB 保护，数据持久化
- **Messaging 节点故障**: NATS 消息丢失，需业务重试

## 扩展性

- **水平扩展**: 增加 lurus-api 副本数
- **渠道扩展**: 动态添加上游供应商
- **存储扩展**: PostgreSQL 读写分离 (规划中)
- **HPA**: 自动扩缩容 (规划中)
