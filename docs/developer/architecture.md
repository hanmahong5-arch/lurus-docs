---
title: 系统架构
description: Lurus 混合云架构总览，基于 Kubernetes + GitOps 的统一服务部署和治理体系。
---

<ProductHero product-id="arch" />

<div class="arch-page">

Lurus 采用混合云架构，基于 Kubernetes + GitOps 构建统一的服务部署和治理体系。12 个产品共享同一套账号、计费、记忆、LLM 网关与可观测性底座 —— 不是一堆独立服务的拼装，而是一张可以一次讲清的图。

<MetricStats :items="[
  { label: '产品线', value: '12', hint: '共享同一底座' },
  { label: 'LLM 渠道', value: '50+', hint: 'per-channel 熔断' },
  { label: '部署', value: 'GitOps', hint: 'GHA → GHCR → ArgoCD' },
]" />

## 架构全景

<p class="arch-lede"><span class="lurus-tag"><Icon name="layers" :size="13" /> 分层视图</span> 从 C 端产品到运维底座，五层自上而下；下层为上层提供能力，上层不感知下层实现。</p>

<ArchitectureDiagram title="分层架构" chart="graph TB
  subgraph C[C 端产品层]
    Lucrum[Lucrum 量化]
    Switch[Switch 桌面]
    Creator[Creator 内容]
    Lutu[Lutu 移动]
  end
  subgraph B[B 端产品层]
    API[Lurus API LLM 网关]
    Forge[Forge 工作台]
    Lumen[Lumen 开发者工具]
  end
  subgraph E[核心引擎层]
    Kova[Kova 持久执行 Rust]
    MemX[MemX 智能记忆 Python]
  end
  subgraph I[基础设施层]
    Platform[Platform 账号计费]
    Auth[Auth OIDC]
    Notify[Notification 多渠道通知]
  end
  subgraph O[运维层]
    Ops[K8s Traefik ArgoCD Prometheus Grafana Jaeger Loki]
  end
  C --> B
  B --> E
  E --> I
  I --> O" />

::: details 文本版分层图（无障碍 / 复制用）
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
:::

## 设计原则

<p class="arch-lede"><span class="lurus-tag"><Icon name="sparkles" :size="13" /> 五条原则</span> 入口统一、模型统一、部署自动化、可观测一体化、故障可自愈。</p>

<CapabilityGrid
  accent="var(--lurus-color-arch)"
  title="核心设计"
  :items="[
    { title: '统一网关', body: 'Traefik 入口，TLS 终止，通配符证书自动管理', icon: 'network' },
    { title: '多模型 AI 网关', body: '50+ LLM 渠道统一接入（OpenAI / Claude / Gemini / Deepseek / Qwen / Moonshot 等），per-channel 熔断保护', icon: 'layers' },
    { title: 'GitOps 部署', body: 'GitHub Actions → GHCR 容器镜像 → ArgoCD 自动同步', icon: 'git-merge' },
    { title: '全栈可观测性', body: 'Prometheus 指标 + Grafana 仪表盘 + Loki 日志 + Jaeger 分布式追踪', icon: 'activity' },
    { title: '高可用设计', body: '渠道故障自动转移，优先级 + 权重路由，PodDisruptionBudget 保护', icon: 'shield-check' },
  ]"
/>

## 请求处理流程

<p class="arch-lede"><span class="lurus-tag"><Icon name="workflow" :size="13" /> 数据流</span> 一次 LLM 请求从入口到上游，途经认证、限流、熔断、计费、日志五道关卡。</p>

<ArchitectureDiagram title="请求链路" chart="graph LR
  Client[Client] --> Traefik[Traefik TLS]
  Traefik --> GW[API Gateway]
  GW --> Route[智能路由]
  Route --> Up[上游 AI 50+ 提供商]
  Up --> Resp[响应]
  GW -.-> Mid[认证 / 限流 / 熔断 / 计费 / 日志]" />

API Gateway 根据模型名称自动匹配可用渠道，支持优先级排序和权重随机分配。当高优先级渠道故障时，per-channel 熔断器自动隔离故障渠道，流量切换到备选渠道。

## 技术栈总览

<p class="arch-lede"><span class="lurus-tag"><Icon name="package" :size="13" /> 技术选型</span> 多语言混合栈，按业务匹配最合适的运行时。</p>

| 层级 | 技术选型 |
|------|---------|
| 后端服务 | Go (Gin)、Rust、Python (FastAPI) |
| 前端 | React / Next.js / Vue 3 / Flutter |
| 桌面应用 | Wails (Go + Web)，单 exe 零依赖 |
| 数据库 | PostgreSQL (CNPG)，按服务 schema 隔离 |
| 缓存 | Redis，按服务 DB 隔离 |
| 消息 | NATS JetStream (事件广播) |
| 工作流 | Temporal (订阅续费/定时任务) |
| 身份认证 | Casdoor (OIDC) |
| 容器 | scratch/alpine 最小镜像，多阶段构建 |
| 安全 | Kyverno 策略引擎 + NetworkPolicy + Trivy 容器扫描 |

## 混合云部署

<p class="arch-lede"><span class="lurus-tag"><Icon name="cloud" :size="13" /> 部署形态</span> 双公网入口 + 混部编排 —— 兼顾国内可达性与运维成本。</p>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="cloud" :size="20" /></span>
    <div class="lurus-card__title">混合云集群</div>
    <p class="lurus-card__body">三丰云 + 阿里云双公网入口，K3s + Docker-Compose 混部，按业务隔离基础设施。</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">GitOps 部署</div>
    <p class="lurus-card__body">GitHub Actions → GHCR → ArgoCD 全流程自动化，镜像 tag 锁定 <code>main-&lt;sha7&gt;</code>。</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">全栈可观测</div>
    <p class="lurus-card__body">Grafana + Prometheus + Jaeger + Loki 统一面板，指标 / 日志 / 链路一体。</p>
  </div>
</div>

## 安全设计

<p class="arch-lede"><span class="lurus-tag"><Icon name="shield-check" :size="13" /> 纵深防御</span> 从传输到容器运行时，七层纵深防御。</p>

| 层级 | 措施 |
|------|------|
| **传输** | 全站 HTTPS (TLS 1.3)，通配符证书自动续期 |
| **网络** | VPN 组网，NetworkPolicy 命名空间隔离 |
| **认证** | [统一身份认证](/platform/auth/)：OIDC JWT + API Key 双模式，WebAuthn Passkey，企业 SSO 联邦 |
| **授权** | RBAC 角色权限控制，多租户 GORM 自动隔离 |
| **加密** | ChaCha20-Poly1305 + 国密 SM4-GCM（信创合规） |
| **审计** | 结构化 JSON 日志 + OpenTelemetry 分布式追踪 |
| **容器** | readOnlyRootFilesystem, drop ALL capabilities, runAsUser:65534 |

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">数据主权</p>
    <div class="lurus-callout__body"><p>国密 SM4-GCM 全程加密、私有化部署、数据不出企业边界。一套 SSO / Passkey / MFA 即可接入企业已有 IdP，兼容 OpenAI SDK，导出零退出成本。</p></div>
  </div>
</div>

## 详细架构文档

<script setup>
import InternalContent from '../.vitepress/theme/components/InternalContent.vue'
</script>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="git-branch" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">单一真源</p>
    <div class="lurus-callout__body"><p>详细架构图位于 governance repo：<a href="https://github.com/hanmahong5-arch/lurus/blob/main/lurus.yaml">lurus.yaml</a> + <a href="https://github.com/hanmahong5-arch/lurus/blob/main/doc/architecture.md">doc/architecture.md</a>。本站不再内嵌全图，避免维护双源真源。</p></div>
  </div>
</div>

</div>

---

<NextSteps
  title="下一步"
  :steps="[
    { text: 'Lurus API — LLM 统一网关', link: '/guide/introduction', primary: true },
    { text: 'Kova 执行引擎', link: '/kova/' },
    { text: 'MemX 记忆引擎', link: '/memx/' },
    { text: 'Platform 账号计费', link: '/platform/' },
    { text: '统一身份认证', link: '/platform/auth/' },
  ]"
/>

<RelatedProducts product-id="arch" />

<style>
.arch-page .lurus-cards { margin: 1rem 0 1.4rem; }
.arch-page .arch-lede {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  margin: 0.4rem 0 1rem;
}
.arch-page .arch-lede .lurus-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
</style>
