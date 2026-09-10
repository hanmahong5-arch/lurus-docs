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

<DiagramFigure
  caption="每个产品方块上的成熟度标（已上线 / 开发中 / 内测）取自本站产品数据的同一个字段，也就是各产品页顶部那枚状态标 —— 两处不会各说各话。第四层用强调色标出：它是上面每一个产品共用的账号、计费、身份与通知底座，「12 个产品共享同一套底座」这句话的实体就是它。最下面一层只画能力类别不点名工具，因为本站没有为具体运维工具承诺过可用性。"
  source="成熟度真源 · docs/.vitepress/data/products.ts">
  <PlatformLayers />
</DiagramFigure>

::: details 文本版分层图（无障碍 / 复制用）
```
依赖方向 ↓ —— 上层依赖下层，下层不感知上层

┌──────────────────────────────────────────────────────────────────────┐
│ L1  C 端产品层     面向个人用户的成品应用                             │
│     Lucrum[已上线] · Switch[开发中] · Creator[开发中] · Lutu[内测]    │
├──────────────────────────────────────────────────────────────────────┤
│ L2  B 端产品层     面向企业与开发者的服务                             │
│     Lurus Hub[已上线] · Forge[内测] · Lumen[开发中] · Tally[内测]     │
├──────────────────────────────────────────────────────────────────────┤
│ L3  核心引擎层     可脱离上层单独使用                                 │
│     Kova[开发中, 持久执行] · MemX[开发中, 智能记忆]                   │
├══════════════════════════════════════════════════════════════════════┤
│ L4  基础设施层     上面每一个产品都共用这一层  ← 全平台共用底座        │
│     账号与计费[已上线] · 统一身份[已上线, OIDC] · 通知[platform 内置] │
├──────────────────────────────────────────────────────────────────────┤
│ L5  运维底座       产品不感知的能力，非对外承诺项                     │
│     容器编排 · 入口网关 · 持续交付 · 可观测                           │
└──────────────────────────────────────────────────────────────────────┘
```
方括号里的成熟度与各产品页顶部的状态标同源（`docs/.vitepress/data/products.ts`）。
L5 只列能力类别、不点名具体工具——本站没有为运维工具承诺过可用性。
:::

## 设计原则

<p class="arch-lede"><span class="lurus-tag"><Icon name="sparkles" :size="13" /> 五条原则</span> 入口统一、模型统一、部署自动化、可观测一体化、故障可自愈。</p>

<CapabilityGrid
  accent="var(--lurus-color-arch)"
  title="核心设计"
  :items="[
    { title: '统一网关', body: 'Traefik 入口，TLS 终止，通配符证书自动管理', icon: 'network' },
    { title: '多模型 AI 网关', body: '50+ LLM 渠道统一接入，跨三种上游 API 形态自动互转，per-channel 熔断保护', icon: 'layers' },
    { title: 'GitOps 部署', body: 'GitHub Actions → GHCR 容器镜像 → ArgoCD 自动同步', icon: 'git-merge' },
    { title: '全栈可观测性', body: 'Prometheus 指标 + Grafana 仪表盘 + Loki 日志 + Jaeger 分布式追踪', icon: 'activity' },
    { title: '高可用设计', body: '渠道故障自动转移，优先级 + 权重路由，PodDisruptionBudget 保护', icon: 'shield-check' },
  ]"
/>

## 请求处理流程

<p class="arch-lede"><span class="lurus-tag"><Icon name="workflow" :size="13" /> 数据流</span> 一次模型调用在打到上游之前，要按固定顺序穿过十道中间件；其中四处的**先后关系是有硬性理由的**，排错位就会静默出错。</p>

<DiagramFigure
  caption="十道门按注册顺序执行，顺序不是随手排的 —— 圈出来的四处各有硬性约束，见下方说明。"
  source="2b-svc-newhub · internal/adapter/handler/router/relay-router.go">
  <RelayRequestPath />
</DiagramFigure>

图上圈出的四处顺序约束：

1. **标记响应格式必须是第一个。** 路由框架在挂载中间件时就把整条链快照下来了；晚于此处标记，后面任何一道门的**拒绝响应**都会用默认格式返回，调用方按自己的格式解析就会失败。
2. **租户额度池闸必须夹在鉴权之后、费用尖峰保护之前。** 它要读鉴权阶段才写入的租户上下文；而放在费用保护之前，是为了让额度耗尽能直接短路整条链，不再做后面那些检查。
3. **并发占用上限默认是关的。** 不显式配置每令牌 / 每租户的并发上限，这道门就不生效——它在图上是虚线，不要读成「平台默认给你兜住了并发」。
4. **按模型维度限流只能挂在分发之后。** 请求里的模型名要到选渠道那一步才进入上下文，挂在前面拿不到模型名，限流规则会静默失配。

选渠道阶段按模型名匹配可用渠道，支持优先级排序与权重随机分配；高优先级渠道故障时，per-channel 熔断器隔离故障渠道，流量切到备选。

## 技术栈总览

<p class="arch-lede"><span class="lurus-tag"><Icon name="package" :size="13" /> 技术选型</span> 多语言混合栈，按业务匹配最合适的运行时。<strong>本表只列真正在跑的东西</strong>——写进来的每一项都能在集群里查到实例。</p>

<!--
  2026-09-10 核实后移除了两行，别凭"代码里有"就加回来：

  · 「工作流 | Temporal (订阅续费/定时任务)」
    两台机上都不存在该组件的实例。核验命令（正对照同时确认查询手段可信）：
      R1: kubectl get pods -A | grep -ci temporal  → 0（该机共 63 个 pod）
      R6: kubectl get pods -A | grep -ci temporal  → 0（该机共 87 个 pod）
          docker ps | grep -ci temporal            → 0（该机共 51 个容器）
    代码里有 workflow 定义 ≠ 它在跑。要加回来，先给出实例存在的证据。

  · 「身份认证 | Casdoor (OIDC)」
    lurus.yaml 记的是"IdP 正从 Zitadel 迁往 Casdoor"（provider 值 owner-gated），
    属于声明的目标态；实际在服务的是 Zitadel（R6 上 2 个 pod，全平台 0 个 casdoor pod）。
    与其押注哪一家，不如按平台自己的 ADR 方向写成 vendor-neutral OIDC ——
    产品侧本来就只依赖标准发现端点，换 IdP 不改业务代码，这句话两种状态下都成立。
-->


| 层级 | 技术选型 |
|------|---------|
| 后端服务 | Go (Gin)、Rust、Python (FastAPI) |
| 前端 | React / Next.js / Vue 3 / Flutter |
| 桌面应用 | Wails (Go + Web)，单 exe 零依赖 |
| 数据库 | PostgreSQL (CNPG)，按服务 schema 隔离 |
| 缓存 | Redis，按服务 DB 隔离 |
| 消息 | NATS JetStream (事件广播) |
| 身份认证 | 标准 OIDC —— vendor-neutral，产品侧只依赖 `.well-known/openid-configuration` 发现，换 IdP 不改业务代码 |
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
