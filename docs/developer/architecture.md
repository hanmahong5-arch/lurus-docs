---
title: 系统架构
description: Lurus 混合云架构总览，基于 Kubernetes + GitOps 的统一服务部署和治理体系。
---

# 系统架构

Lurus 采用混合云架构，基于 Kubernetes + GitOps 构建统一的服务部署和治理体系。

## 架构全景

```
┌─────────────────────────────────────────────────────────────────┐
│                      C 端产品层                                  │
│  Lucrum (量化) · Switch (桌面) · Creator (内容) · Lutu (移动)    │
├─────────────────────────────────────────────────────────────────┤
│                      B 端产品层                                  │
│  Lurus API (LLM 网关) · Forge (工作台) · Lumen (开发者工具)     │
├─────────────────────────────────────────────────────────────────┤
│                      核心引擎层                                  │
│  Kova (持久执行, Rust) · MemX (智能记忆, Python)                │
├─────────────────────────────────────────────────────────────────┤
│                      基础设施层                                  │
│  Platform (账号/计费) · Auth (OIDC) · Notification (多渠道通知)  │
├─────────────────────────────────────────────────────────────────┤
│                      运维层                                      │
│  K8s · Traefik · ArgoCD · Prometheus · Grafana · Jaeger · Loki  │
└─────────────────────────────────────────────────────────────────┘
```

## 设计原则

- **统一网关**: Traefik 入口，TLS 终止，通配符证书自动管理
- **多模型 AI 网关**: 50+ LLM 提供商统一接入，per-channel 熔断保护
- **GitOps 部署**: GitHub Actions → GHCR 容器镜像 → ArgoCD 自动同步
- **全栈可观测性**: Prometheus 指标 + Grafana 仪表盘 + Loki 日志 + Jaeger 分布式追踪
- **高可用设计**: 渠道故障自动转移，优先级 + 权重路由，PodDisruptionBudget 保护

## 请求处理流程

```
Client → Traefik (TLS) → API Gateway → 智能路由 → 上游 AI (50+ 提供商) → 响应
                              │
                   认证 → 限流 → 熔断 → 计费 → 日志
```

API Gateway 根据模型名称自动匹配可用渠道，支持优先级排序和权重随机分配。当高优先级渠道故障时，per-channel 熔断器自动隔离故障渠道，流量切换到备选渠道。

## 技术栈总览

| 层级 | 技术选型 |
|------|---------|
| 后端服务 | Go (Gin)、Rust、Python (FastAPI) |
| 前端 | React / Next.js / Vue 3 / Flutter |
| 桌面应用 | Wails (Go + Web)，单 exe 零依赖 |
| 数据库 | PostgreSQL (CNPG)，按服务 schema 隔离 |
| 缓存 | Redis，按服务 DB 隔离 |
| 消息 | NATS JetStream (事件广播) |
| 工作流 | Temporal (订阅续费/定时任务) |
| 身份认证 | Zitadel (OIDC) |
| 容器 | scratch/alpine 最小镜像，多阶段构建 |
| 安全 | Kyverno 策略引擎 + NetworkPolicy + Trivy 容器扫描 |

## 安全设计

| 层级 | 措施 |
|------|------|
| **传输** | 全站 HTTPS (TLS 1.3)，通配符证书自动续期 |
| **网络** | VPN 组网，NetworkPolicy 命名空间隔离 |
| **认证** | OIDC JWT + API Key 双模式，WebAuthn Passkey |
| **授权** | RBAC 角色权限控制，多租户 GORM 自动隔离 |
| **加密** | ChaCha20-Poly1305 + 国密 SM4-GCM（信创合规） |
| **审计** | 结构化 JSON 日志 + OpenTelemetry 分布式追踪 |
| **容器** | readOnlyRootFilesystem, drop ALL capabilities, runAsUser:65534 |

## 详细架构文档

<script setup>
import InternalContent from '../.vitepress/theme/components/InternalContent.vue'
</script>

<InternalContent slug="architecture-full" />

---

## 下一步

- [Lurus API](/guide/introduction) — LLM 统一网关详细文档
- [Kova 执行引擎](/kova/) — Agent 持久化执行引擎
- [MemX 记忆引擎](/memx/) — AI 自适应记忆引擎
- [Platform 账号计费](/platform/) — 统一账号和计费体系
