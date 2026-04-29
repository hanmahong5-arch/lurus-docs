---
layout: page
title: Lurus — AI 基础设施与产品平台
description: 从执行引擎到量化交易，从智能记忆到内容创作 — 覆盖 AI 全栈的产品矩阵。
---

<div class="vp-doc lurus-home">

<Hero />

## <Icon name="rocket" :size="22" /> 我是新手 — 3 分钟发起第一次 AI 调用

面对 50+ 大模型不知从何选择？跟着下面三步，从注册到跑通第一次调用。

<div class="action-grid">
  <ActionCard
    product-id="lurus-api"
    :actions="[
      { label: '快速开始', href: '/guide/quickstart', primary: true },
      { label: '获取 API Key', href: '/guide/get-api-key' },
      { label: '支持的模型', href: '/guide/models' },
      { label: '控制台', href: 'https://api.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="platform"
    :actions="[
      { label: '平台概述', href: '/platform/', primary: true },
      { label: '计费详解', href: '/platform/billing' },
      { label: '常见问题', href: '/platform/faq' },
    ]"
  />
</div>

---

## <Icon name="gamepad-2" :size="22" /> 我是玩家 — 想要现成的 AI 工具

跳过配置和代码，直接下载开箱即用的桌面工具 / 交易平台 / 移动 App。

<div class="action-grid">
  <ActionCard
    product-id="lucrum"
    :actions="[
      { label: '快速开始', href: '/lucrum/quickstart', primary: true },
      { label: '策略市场', href: '/lucrum/strategies' },
      { label: '交易平台', href: 'https://lucrum.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="switch"
    :actions="[
      { label: '安装指南', href: '/switch/install', primary: true },
      { label: '配置说明', href: '/switch/configuration' },
    ]"
  />
  <ActionCard
    product-id="creator"
    :actions="[
      { label: '安装指南', href: '/creator/install', primary: true },
      { label: '使用案例', href: '/creator/use-cases' },
    ]"
  />
  <ActionCard
    name="Lutu — 移动客户端"
    tagline="路途 APP · 移动端 AI 助理与记账"
    icon="smartphone"
    color="var(--lurus-color-creator)"
    status="beta"
    :actions="[
      { label: '下载 Lutu', href: 'https://www.lurus.cn/download#lutu', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="briefcase" :size="22" /> 我是决策者 — 评估企业采购

一张表看清 TCO、合规、私有化、SLA。支持企业 SSO 联邦与国密 SM4-GCM。

<div class="action-grid">
  <ActionCard
    name="为什么选择 Lurus"
    tagline="四项核心能力 vs 自建 — TCO、性能、合规一张表"
    icon="award"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: '企业方案', href: '/solutions/', primary: true },
      { label: 'Why Lurus', href: '/solutions/why-lurus' },
    ]"
  />
  <ActionCard
    name="企业部署形态"
    tagline="SaaS · 私有化 · 混合云 · 合规边界一次讲清"
    icon="server"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: '部署矩阵', href: '/solutions/enterprise-deploy', primary: true },
    ]"
  />
  <ActionCard
    product-id="auth"
    :actions="[
      { label: '概述与接入点', href: '/platform/auth/', primary: true },
      { label: '企业 SSO 联邦', href: '/platform/auth/oidc' },
      { label: '认证控制台', href: 'https://auth.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    name="联系商务"
    tagline="私有化部署 · 授权 · 定制化 · 合作咨询"
    icon="mail"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'business@lurus.cn', href: 'mailto:business@lurus.cn', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="code" :size="22" /> 我是开发者 — 构建 AI 系统

Agent 持久化、记忆引擎、可观测性、LLM 统一网关 — 自底向上搭你的 AI 栈。

<div class="action-grid">
  <ActionCard
    product-id="kova"
    :actions="[
      { label: '快速开始', href: '/kova/quickstart', primary: true },
      { label: '核心概念', href: '/kova/concepts' },
      { label: 'API 参考', href: '/kova/api' },
    ]"
  />
  <ActionCard
    product-id="memx"
    :actions="[
      { label: '快速开始', href: '/memx/quickstart', primary: true },
      { label: '核心概念', href: '/memx/concepts' },
      { label: '架构设计', href: '/memx/architecture' },
    ]"
  />
  <ActionCard
    product-id="lumen"
    :actions="[
      { label: '快速开始', href: '/lumen/quickstart', primary: true },
      { label: 'Python SDK', href: '/lumen/python-sdk' },
      { label: 'CLI 手册', href: '/lumen/cli' },
    ]"
  />
  <ActionCard
    product-id="api-ref"
    :actions="[
      { label: 'API 概述', href: '/api/overview', primary: true },
      { label: '认证', href: '/api/authentication' },
      { label: 'Chat Completions', href: '/api/chat-completions' },
    ]"
  />
  <ActionCard
    product-id="arch"
    :actions="[
      { label: '查看架构', href: '/developer/architecture', primary: true },
    ]"
  />
  <ActionCard
    product-id="forge"
    :actions="[
      { label: '产品哲学', href: '/forge/', primary: true },
      { label: 'Ontology', href: '/forge/ontology' },
    ]"
  />
</div>

---

## 跨产品教程 · 迁移指南

<div class="action-grid action-grid--compact">
  <ActionCard
    name="教程中心"
    tagline="MemX + Kova · Lumen + LangGraph · Lucrum 端到端"
    icon="graduation-cap"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: '跨产品教程', href: '/tutorials/', primary: true },
    ]"
  />
  <ActionCard
    name="迁移指南"
    tagline="OpenAI · LangGraph · 自建 OIDC → 5 分钟搬家"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: '迁移中心', href: '/migrations/', primary: true },
    ]"
  />
  <ActionCard
    name="术语表"
    tagline="47+ 技术术语按主题分组，跨产品速查"
    icon="book-a"
    color="var(--lurus-color-memx)"
    :actions="[
      { label: '术语全表', href: '/guide/glossary', primary: true },
    ]"
  />
</div>

---

## 为什么选择 Lurus？

| 维度 | Lurus 的优势 | 对照自建 |
|------|-------------|---------|
| **全栈自研** | 从 Rust 执行引擎到 Flutter 移动端，核心技术完全自主可控 | 多供应商拼装，版本锁定风险 |
| **引擎级性能** | Kova 3μs 调度延迟（Criterion 基准），网关 p95 < 50ms | 自建 Temporal/LangGraph 量级较慢 |
| **数据主权** | 私有化部署，数据不出企业边界，支持国密 SM4-GCM | 公有云合规与审计难度高 |
| **统一身份** | 所有产品共享 SSO、Passkey、MFA，接企业 IdP 联邦 | Keycloak / Auth0 自运维 |
| **生态协同** | 12 个产品共享账户/计费/记忆/LLM 网关，越用越值 | 工具栈碎片化 |
| **经济高效** | MemX 零 LLM 成本蒸馏；Lucrum Decimal.js 全精度零误差 | 记忆 / 精度问题需额外投入 |
| **TCO 透明** | 鹿贝单位统一计费，按量扣费 + 免费额度 | 多家账单对账复杂 |
| **开放可迁出** | OpenAI SDK 兼容，PAT/JWT 标准认证，导出无锁定 | 供应商锁定退出成本高 |

---

## 联系我们

- <Icon name="life-buoy" :size="14" /> **技术支持**: support@lurus.cn
- <Icon name="briefcase" :size="14" /> **商务合作**: business@lurus.cn
- <Icon name="github" :size="14" /> **GitHub**: [github.com/hanmahong5-arch](https://github.com/hanmahong5-arch)

</div>

<style>
.lurus-home { max-width: 1152px; margin: 0 auto; padding: 24px; }
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0 28px;
}
.action-grid--compact {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.lurus-home h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--lurus-fs-xl);
  font-weight: 700;
  margin-top: 36px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--vp-c-brand-soft);
}
.lurus-home h2 .lurus-icon { color: var(--vp-c-brand-1); }
.lurus-home hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-brand-soft), transparent);
  margin: 40px 0;
}
@media (max-width: 640px) {
  .lurus-home { padding: 16px; }
}
</style>
