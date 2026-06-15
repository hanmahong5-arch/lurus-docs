---
title: Lurus API 简介
description: 一个 API Key 接入 50+ 主流 AI 模型，完全兼容 OpenAI SDK，两行改动即可接入。
---

<div class="lurus-api-intro">

<ProductHero product-id="lurus-api" />

<MetricStats :items="[
  { label: '接入模型', value: '50+' },
  { label: '网关 p95', value: '<50ms' },
  { label: '兼容性', value: 'OpenAI SDK' },
]" />

**一个 <Term t="API Key">API Key</Term>，接入 50+ 主流 AI 模型。** 完全兼容 OpenAI <Term t="SDK">SDK</Term>，现有代码只需两行改动，无需重写。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 选择路径</span>
  <h2 class="lurus-section-head__title">你是哪种用户？</h2>
  <p class="lurus-section-head__lede">三条入口，按你的背景挑一条直接开始。</p>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/guide/clients/cherry-studio">
    <span class="lurus-card__icon"><Icon name="rocket" :size="22" /></span>
    <div class="lurus-card__title">想快速试用，没有技术背景</div>
    <p class="lurus-card__body">先配一个 AI 客户端（Cherry Studio / Lobe Chat），填入 API Key 即可对话，全程无需写代码。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/guide/quickstart">
    <span class="lurus-card__icon"><Icon name="code" :size="22" /></span>
    <div class="lurus-card__title">是开发者，想接入 AI 能力</div>
    <p class="lurus-card__body">5 分钟完成首次 API 调用，支持 Python / Node.js / Go / cURL。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/migrations/from-openai">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="22" /></span>
    <div class="lurus-card__title">已在用 OpenAI，想切换 / 降成本</div>
    <p class="lurus-card__body">替换两行代码即可迁移，所有 OpenAI SDK 功能完全兼容。</p>
  </a>
</div>

::: info 我已在用 OpenAI，想切换 / 降成本
替换两行代码即可迁移，所有 OpenAI SDK 功能完全兼容：
```python
# 改这两行，其余代码不动
base_url="https://api.lurus.cn/v1"
api_key="sk-your-lurus-key"
```
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> 核心能力</span>
  <h2 class="lurus-section-head__title">一个网关，四件事</h2>
  <p class="lurus-section-head__lede">统一接入、智能路由、成本控制、企业级访问管理。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-lurus-api)"
  :items="[
    { title: '统一 API', body: '一个接口覆盖所有模型，换 model 名即可，无需为每家供应商写适配。', icon: 'plug-zap' },
    { title: '智能路由与自动故障转移', body: '多渠道备援（主渠道失败自动切换）、权重负载均衡（按比例分流平衡成本与速度）、优先级策略（先低成本渠道，超限切高成本备用）。', icon: 'shuffle' },
    { title: '精细化成本控制', body: '每个 API Key 设 Token 配额超量拦截；按天/月查调用次数、Token、费用明细；配额剩余不足 20% 告警。', icon: 'wallet' },
    { title: '企业级访问管理', body: '多 Key 分项目分配、模型白名单、IP 白名单、完整审计日志，每次请求的模型/Token/延迟均有记录。', icon: 'shield-check' },
  ]"
/>

**统一 API 示例** —— 换 `model` 名即可切换供应商：

```python
from openai import OpenAI
client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-api-key")
# model 可填 deepseek-chat / gpt-4o / claude-3-5-sonnet / gemini-3-pro-preview
response = client.chat.completions.create(model="deepseek-chat", messages=[{"role": "user", "content": "你好"}])
```

### <Icon name="shield-check" :size="20" /> 企业级访问管理

| 功能 | 说明 |
|------|------|
| 多 Key 管理 | 给不同项目/团队分配独立 Key |
| 模型白名单 | 限制 Key 只能访问指定模型 |
| IP 白名单 | 只允许指定 IP 段调用 |
| 完整审计日志 | 每次请求的模型、Token、延迟均有记录 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> 适用场景</span>
  <h2 class="lurus-section-head__title">谁在用 Lurus API</h2>
</div>

| 场景 | 你能做什么 |
|------|-----------|
| **AI 应用开发** | 用同一套代码接入所有供应商，快速 A/B 测试不同模型 |
| **成本优化** | 日常任务走 DeepSeek（低成本），复杂任务走 GPT-4o（高质量） |
| **服务稳定性** | 多渠道冗余，单个供应商故障不影响你的服务 |
| **团队管理** | 分配 Key + 配额，统一查看全员 AI 用量和费用 |
| **AI 客户端** | 为 Cherry Studio、Lobe Chat、OpenCat 等工具提供统一后端 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> 架构概览</span>
  <h2 class="lurus-section-head__title">请求是怎么流转的</h2>
</div>

<ArchitectureDiagram
  title="Lurus API 网关数据流"
  chart="graph LR; A[你的应用 / AI 客户端] --> B[Lurus API Gateway]; B --> C[认证]; C --> D[路由]; D --> E[限流]; E --> F[计费]; F --> G[日志]; D --> H[OpenAI]; D --> I[Claude]; D --> J[Gemini]; D --> K[DeepSeek]"
/>

网关按配置的渠道优先级路由，某供应商返回错误时自动重试下一个，代码感知不到切换。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="graduation-cap" :size="14" /> 推荐学习路径</span>
  <h2 class="lurus-section-head__title">20 分钟跑通整个流程</h2>
  <p class="lurus-section-head__lede">第一次使用？按顺序走。</p>
</div>

<ol class="lurus-steps">
<li>

[获取 API Key](/guide/get-api-key) —— 注册并创建你的第一个 Key（3 分钟）

</li>
<li>

[快速开始](/guide/quickstart) —— 发出第一个 API 请求（5 分钟）

</li>
<li>

[支持的模型](/guide/models) —— 了解有哪些模型可用，怎么选

</li>
<li>

[Chat Completions API](/api/chat-completions) —— 掌握最常用的接口

</li>
</ol>

::: details 进阶用户直接跳到…
- [Function Calling](/api/chat-completions#function-calling) — 让 AI 调用你的函数
- [流式响应](/api/chat-completions#流式响应) — 逐字输出，提升体验
- [API 参考总览](/api/overview) — 完整端点列表
:::

<NextSteps
  title="下一步"
  :steps="[
    { text: '快速开始', link: '/guide/quickstart', primary: true },
    { text: '支持的模型', link: '/guide/models' },
    { text: '控制台', link: 'https://api.lurus.cn', external: true },
  ]"
/>

<RelatedProducts product-id="lurus-api" />

</div>
