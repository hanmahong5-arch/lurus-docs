# 系统架构

Lurus 采用混合云架构，基于 K3s + GitOps 构建统一的服务部署和治理体系。

## 架构概览

- **统一网关**: Traefik 入口，TLS 终止，自动证书管理
- **多模型 AI 网关**: 50+ LLM 提供商统一接入
- **GitOps 部署**: GitHub Actions + GHCR + ArgoCD 自动同步
- **全栈可观测性**: Prometheus + Grafana + Loki + Jaeger
- **高可用设计**: 渠道故障自动转移，优先级 + 权重路由

## 请求处理流程

```
Client → Traefik (TLS) → API Gateway → 渠道路由 → 上游 AI (50+ 提供商) → 响应
```

### 渠道路由

API Gateway 根据模型名称自动匹配可用渠道，支持优先级排序和权重随机分配。当高优先级渠道故障时，自动降级到备选渠道。

### 健康检查

- **Liveness / Readiness Probe**: 定期探测服务健康状态
- **渠道探测**: 定时测试各上游渠道可用性

## 安全设计

1. **传输安全**: 全站 HTTPS (Let's Encrypt 自动续期)
2. **网络隔离**: VPN 组网，节点间安全通信
3. **认证**: API Key 机制，支持多 Key 管理
4. **授权**: 基于角色的权限控制 (RBAC)
5. **日志审计**: 完整请求日志，支持追溯

## 详细架构文档

<script setup>
import InternalContent from '../.vitepress/theme/components/InternalContent.vue'
</script>

<InternalContent slug="architecture-full" />
