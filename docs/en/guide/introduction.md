---
title: Lurus API Introduction
description: One API Key to access 50+ leading AI models, fully compatible with the OpenAI SDK — integrate with a two-line change.
---

<div class="lurus-api-intro">

<ProductHero product-id="lurus-api" />

<MetricStats :items="[
  { label: 'Models', value: '50+' },
  { label: 'Free Tier', value: '100 calls/day' },
  { label: 'Compatibility', value: 'OpenAI SDK' },
]" />

**One <Term t="API Key">API Key</Term> to access 50+ leading AI models.** Fully compatible with the OpenAI <Term t="SDK">SDK</Term> — your existing code needs only a two-line change, no rewrite required.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Choose Your Path</span>
  <h2 class="lurus-section-head__title">Which kind of user are you?</h2>
  <p class="lurus-section-head__lede">Three entry points — pick the one that matches your background and start right away.</p>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/en/guide/clients/cherry-studio">
    <span class="lurus-card__icon"><Icon name="rocket" :size="22" /></span>
    <div class="lurus-card__title">Want a quick trial, no technical background</div>
    <p class="lurus-card__body">Set up an AI client first (Cherry Studio / Lobe Chat), enter your API Key, and start chatting — no code required at any point.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/en/guide/quickstart">
    <span class="lurus-card__icon"><Icon name="code" :size="22" /></span>
    <div class="lurus-card__title">A developer who wants to integrate AI capabilities</div>
    <p class="lurus-card__body">Make your first API call in 5 minutes — supports Python / Node.js / Go / cURL.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/migrations/from-openai">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="22" /></span>
    <div class="lurus-card__title">Already using OpenAI, want to switch / cut costs</div>
    <p class="lurus-card__body">Migrate by replacing two lines of code — all OpenAI SDK features are fully compatible.</p>
  </a>
</div>

::: info Already using OpenAI, want to switch / cut costs
Migrate by replacing two lines of code — all OpenAI SDK features are fully compatible:
```python
# 改这两行，其余代码不动
base_url="https://api.lurus.cn/v1"
api_key="sk-your-lurus-key"
```
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Core Capabilities</span>
  <h2 class="lurus-section-head__title">One gateway, four jobs</h2>
  <p class="lurus-section-head__lede">Unified access, intelligent routing, cost control, and enterprise-grade access management.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-lurus-api)"
  :items="[
    { title: 'Unified API', body: 'One interface covers every model — just change the model name, no need to write an adapter for each provider.', icon: 'plug-zap' },
    { title: 'Intelligent Routing & Automatic Failover', body: 'Multi-channel backup (automatically switches when the primary channel fails), weighted load balancing (proportional traffic split to balance cost and speed), and priority policies (low-cost channels first, switching to higher-cost backups when limits are exceeded).', icon: 'shuffle' },
    { title: 'Fine-grained Cost Control', body: 'Set a Token quota per API Key with over-limit blocking; review call counts, Tokens, and cost breakdowns by day/month; get alerts when remaining quota drops below 20%.', icon: 'wallet' },
    { title: 'Enterprise-grade Access Management', body: 'Allocate multiple Keys per project, model allowlists, IP allowlists, and complete audit logs — every request records the model, Tokens, and latency.', icon: 'shield-check' },
  ]"
/>

**Unified API example** — switch providers by changing the `model` name:

```python
from openai import OpenAI
client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-api-key")
# model 可填 deepseek-chat / gpt-4o / claude-3-5-sonnet / gemini-3-pro-preview
response = client.chat.completions.create(model="deepseek-chat", messages=[{"role": "user", "content": "你好"}])
```

### <Icon name="shield-check" :size="20" /> Enterprise-grade Access Management

| Feature | Description |
|------|------|
| Multi-Key management | Assign independent Keys to different projects/teams |
| Model allowlist | Restrict a Key to specified models only |
| IP allowlist | Allow calls only from specified IP ranges |
| Complete audit logs | Every request records the model, Tokens, and latency |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> Use Cases</span>
  <h2 class="lurus-section-head__title">Who uses Lurus API</h2>
</div>

| Scenario | What you can do |
|------|-----------|
| **AI application development** | Use the same code to access all providers, and quickly A/B test different models |
| **Cost optimization** | Route everyday tasks to DeepSeek (low cost) and complex tasks to GPT-4o (high quality) |
| **Service reliability** | Multi-channel redundancy — a single provider outage won’t affect your service |
| **Team management** | Allocate Keys + quotas, and review everyone’s AI usage and costs in one place |
| **AI clients** | Provide a unified backend for tools like Cherry Studio, Lobe Chat, and OpenCat |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> Architecture Overview</span>
  <h2 class="lurus-section-head__title">How a request flows</h2>
</div>

<ArchitectureDiagram
  title="Lurus API Gateway Data Flow"
  chart="graph LR; A[Your App / AI Client] --> B[Lurus API Gateway]; B --> C[Auth]; C --> D[Routing]; D --> E[Rate Limiting]; E --> F[Billing]; F --> G[Logging]; D --> H[OpenAI]; D --> I[Claude]; D --> J[Gemini]; D --> K[DeepSeek]"
/>

The gateway routes by the configured channel priority; when a provider returns an error it automatically retries the next one, and your code never sees the switch.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="graduation-cap" :size="14" /> Recommended Learning Path</span>
  <h2 class="lurus-section-head__title">Run through the whole flow in 20 minutes</h2>
  <p class="lurus-section-head__lede">First time here? Follow the order.</p>
</div>

<ol class="lurus-steps">
<li>

[Get an API Key](/en/guide/get-api-key) — sign up and create your first Key (3 minutes)

</li>
<li>

[Quickstart](/en/guide/quickstart) — make your first API request (5 minutes)

</li>
<li>

[Supported Models](/guide/models) — learn which models are available and how to choose

</li>
<li>

[Chat Completions API](/en/api/chat-completions) — master the most commonly used endpoint

</li>
</ol>

::: details Advanced users, jump straight to…
- [Function Calling](/en/api/chat-completions#function-calling) — let the AI call your functions
- [Streaming Responses](/en/api/chat-completions#流式响应) — token-by-token output for a better experience
- [API Reference Overview](/en/api/overview) — the complete endpoint list
:::

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Quickstart', link: '/en/guide/quickstart', primary: true },
    { text: 'Supported Models', link: '/guide/models' },
    { text: 'Console', link: 'https://api.lurus.cn', external: true },
  ]"
/>

<RelatedProducts product-id="lurus-api" />

</div>
