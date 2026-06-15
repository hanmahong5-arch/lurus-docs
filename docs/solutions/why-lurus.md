---
title: 为什么选择 Lurus
description: 网关 · Agent · 记忆 · 身份四项核心能力 vs 自建的 TCO 对比。
---

<div class="why-lurus-page">

# 为什么选择 Lurus

> 如果你正在评估"自建 vs 采购"，这页给你四项关键能力的 TCO 对比。

<MetricStats :items="[
  { label: '网关接入模型', value: '50+', hint: '一个 Key' },
  { label: 'Kova 调度', value: '3μs', hint: 'Criterion 基准' },
  { label: '统一身份', value: 'SSO/MFA', hint: '接企业 IdP' },
  { label: 'MemX PII 规则', value: '12 种', hint: '不可绕过' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="award" :size="14" /> 核心对比</span>
  <h2 class="lurus-section-head__title">四项核心能力 vs 自建</h2>
  <p class="lurus-section-head__lede">网关 · Agent 执行 · 记忆 · 身份——逐项对照自建工程量。</p>
</div>

<ComparisonTable
  title="LLM 网关"
  self-label="Lurus API"
  :competitors="['自建 OneAPI', '自建 LiteLLM']"
  :rows="[
    { dimension: '接入模型数', self: '50+（内置）', alt: { '自建 OneAPI': '需逐个接', '自建 LiteLLM': '需逐个接' } },
    { dimension: 'OpenAI SDK 兼容', self: '开箱', alt: { '自建 OneAPI': '部分', '自建 LiteLLM': '部分' } },
    { dimension: '计费 + 限流', self: '内置', alt: { '自建 OneAPI': '需自建', '自建 LiteLLM': '需自建' } },
    { dimension: '工程人月', self: '0', alt: { '自建 OneAPI': '2-4 人月', '自建 LiteLLM': '2-3 人月' } },
  ]"
/>

<ComparisonTable
  title="Agent 执行引擎"
  self-label="Kova"
  :competitors="['自建 Temporal', '自建 LangGraph + Redis']"
  :rows="[
    { dimension: '调度延迟', self: '3μs', alt: { '自建 Temporal': '1-10ms', '自建 LangGraph + Redis': '5-20ms' } },
    { dimension: '崩溃恢复', self: 'WAL 自动', alt: { '自建 Temporal': 'Event Sourcing', '自建 LangGraph + Redis': '半自动' } },
    { dimension: '外部依赖', self: '零', alt: { '自建 Temporal': 'Cassandra/MySQL', '自建 LangGraph + Redis': 'Redis/PG' } },
    { dimension: '工程人月', self: '0', alt: { '自建 Temporal': '3-6 人月', '自建 LangGraph + Redis': '2-4 人月' } },
  ]"
/>

<ComparisonTable
  title="AI 记忆"
  self-label="MemX"
  :competitors="['自建 mem0', '自建 Weaviate + 规则']"
  :rows="[
    { dimension: 'PII 过滤', self: '12 规则内置', alt: { '自建 mem0': '需自写', '自建 Weaviate + 规则': '需自写' } },
    { dimension: '衰退/遗忘', self: 'Ebbinghaus 曲线', alt: { '自建 mem0': '无', '自建 Weaviate + 规则': '需自写' } },
    { dimension: 'LLM 蒸馏成本', self: '0（规则降级）', alt: { '自建 mem0': '每次 LLM 费用', '自建 Weaviate + 规则': '每次 LLM 费用' } },
    { dimension: '工程人月', self: '0', alt: { '自建 mem0': '1-2 人月', '自建 Weaviate + 规则': '3-5 人月' } },
  ]"
/>

<ComparisonTable
  title="身份与合规"
  self-label="Lurus Auth"
  :competitors="['自建 Keycloak', 'Auth0 云服务']"
  :rows="[
    { dimension: 'SSO 联邦', self: '开箱', alt: { '自建 Keycloak': '需配置', 'Auth0 云服务': '按量付费' } },
    { dimension: '国密 SM4-GCM', self: '可选', alt: { '自建 Keycloak': '不支持', 'Auth0 云服务': '不支持' } },
    { dimension: 'Passkey / MFA', self: '内置', alt: { '自建 Keycloak': '部分', 'Auth0 云服务': '内置' } },
    { dimension: '工程人月', self: '0', alt: { '自建 Keycloak': '2-4 人月', 'Auth0 云服务': '0，但数据出境' } },
  ]"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 综合账</span>
  <h2 class="lurus-section-head__title">综合 TCO</h2>
  <p class="lurus-section-head__lede">把四件套的隐性成本——人月、基础设施、值班、合规——一次算清。</p>
</div>

| 项目 | 自建四件套（年） | Lurus 方案（年） |
|------|----------------|------------------|
| 工程人月 | **8-18 人月** | 0 |
| 基础设施 | ~¥15-30 万 | 按量付费，可私有化 |
| 维护值班 | 全年 24×7 | Lurus SLA |
| 合规审计 | 自己扛 | 一套合规覆盖所有产品 |

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="award" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">一套合规覆盖所有产品</p>
    <div class="lurus-callout__body">四项能力共享同一身份、计费与审计层——不必为每件套各做一遍合规评估，工程人月直接归零。</div>
  </div>
</div>

## 相关链接

<NextSteps :steps="[
  { text: '企业部署形态', link: '/solutions/enterprise-deploy', primary: true },
  { text: '企业 AI 中台', link: '/solutions/ai-midware' },
  { text: '联系商务', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
