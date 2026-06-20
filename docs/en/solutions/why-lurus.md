---
title: "Why Lurus"
description: "Gateway, Agent, Memory, Identity — a TCO comparison of the four core capabilities vs. building your own."
---

<div class="why-lurus-page">

# Why Lurus

> If you are weighing "build vs. buy", this page gives you a TCO comparison across four key capabilities.

<MetricStats :items="[
  { label: 'Models via gateway', value: '50+', hint: 'One key' },
  { label: 'Kova scheduling', value: '3μs', hint: 'Criterion benchmark' },
  { label: 'Unified identity', value: 'SSO/MFA', hint: 'Connects to enterprise IdP' },
  { label: 'MemX PII rules', value: '12', hint: 'Non-bypassable' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="award" :size="14" /> Core comparison</span>
  <h2 class="lurus-section-head__title">Four core capabilities vs. building your own</h2>
  <p class="lurus-section-head__lede">Gateway, Agent execution, Memory, Identity — each weighed against the engineering effort of building it yourself.</p>
</div>

<ComparisonTable
  title="LLM gateway"
  self-label="Lurus API"
  :competitors="['Self-built OneAPI', 'Self-built LiteLLM']"
  :rows="[
    { dimension: 'Models supported', self: '50+ (built-in)', alt: { 'Self-built OneAPI': 'Integrate one by one', 'Self-built LiteLLM': 'Integrate one by one' } },
    { dimension: 'OpenAI SDK compatibility', self: 'Out of the box', alt: { 'Self-built OneAPI': 'Partial', 'Self-built LiteLLM': 'Partial' } },
    { dimension: 'Billing + rate limiting', self: 'Built-in', alt: { 'Self-built OneAPI': 'Build yourself', 'Self-built LiteLLM': 'Build yourself' } },
    { dimension: 'Engineering person-months', self: '0', alt: { 'Self-built OneAPI': '2-4 person-months', 'Self-built LiteLLM': '2-3 person-months' } },
  ]"
/>

<ComparisonTable
  title="Agent execution engine"
  self-label="Kova"
  :competitors="['Self-built Temporal', 'Self-built LangGraph + Redis']"
  :rows="[
    { dimension: 'Scheduling latency', self: '3μs', alt: { 'Self-built Temporal': '1-10ms', 'Self-built LangGraph + Redis': '5-20ms' } },
    { dimension: 'Crash recovery', self: 'WAL automatic', alt: { 'Self-built Temporal': 'Event Sourcing', 'Self-built LangGraph + Redis': 'Semi-automatic' } },
    { dimension: 'External dependencies', self: 'None', alt: { 'Self-built Temporal': 'Cassandra/MySQL', 'Self-built LangGraph + Redis': 'Redis/PG' } },
    { dimension: 'Engineering person-months', self: '0', alt: { 'Self-built Temporal': '3-6 person-months', 'Self-built LangGraph + Redis': '2-4 person-months' } },
  ]"
/>

<ComparisonTable
  title="AI memory"
  self-label="MemX"
  :competitors="['Self-built mem0', 'Self-built Weaviate + rules']"
  :rows="[
    { dimension: 'PII filtering', self: '12 rules built-in', alt: { 'Self-built mem0': 'Write yourself', 'Self-built Weaviate + rules': 'Write yourself' } },
    { dimension: 'Decay / forgetting', self: 'Ebbinghaus curve', alt: { 'Self-built mem0': 'None', 'Self-built Weaviate + rules': 'Write yourself' } },
    { dimension: 'LLM distillation cost', self: '0 (rule-based fallback)', alt: { 'Self-built mem0': 'LLM cost per call', 'Self-built Weaviate + rules': 'LLM cost per call' } },
    { dimension: 'Engineering person-months', self: '0', alt: { 'Self-built mem0': '1-2 person-months', 'Self-built Weaviate + rules': '3-5 person-months' } },
  ]"
/>

<ComparisonTable
  title="Identity and compliance"
  self-label="Lurus Auth"
  :competitors="['Self-built Keycloak', 'Auth0 cloud service']"
  :rows="[
    { dimension: 'SSO federation', self: 'Out of the box', alt: { 'Self-built Keycloak': 'Needs configuration', 'Auth0 cloud service': 'Pay as you go' } },
    { dimension: 'SM4-GCM (Chinese crypto)', self: 'Optional', alt: { 'Self-built Keycloak': 'Not supported', 'Auth0 cloud service': 'Not supported' } },
    { dimension: 'Passkey / MFA', self: 'Built-in', alt: { 'Self-built Keycloak': 'Partial', 'Auth0 cloud service': 'Built-in' } },
    { dimension: 'Engineering person-months', self: '0', alt: { 'Self-built Keycloak': '2-4 person-months', 'Auth0 cloud service': '0, but data leaves the country' } },
  ]"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> The full bill</span>
  <h2 class="lurus-section-head__title">Total TCO</h2>
  <p class="lurus-section-head__lede">Tally up the hidden costs of the full four-piece suite — person-months, infrastructure, on-call, compliance — all in one go.</p>
</div>

| Item | Self-built four-piece suite (per year) | Lurus solution (per year) |
|------|----------------|------------------|
| Engineering person-months | **8-18 person-months** | 0 |
| Infrastructure | ~¥150K-300K | Pay as you go, self-hostable |
| Maintenance on-call | 24×7 year-round | Lurus SLA |
| Compliance audit | On your own | One compliance package covers all products |

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="award" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">One compliance package covers all products</p>
    <div class="lurus-callout__body">All four capabilities share the same identity, billing, and audit layer — no need to run a separate compliance assessment for each piece, and engineering person-months drop straight to zero.</div>
  </div>
</div>

## Related links

<NextSteps :steps="[
  { text: 'Enterprise deployment models', link: '/en/solutions/enterprise-deploy', primary: true },
  { text: 'Enterprise AI middle platform', link: '/en/solutions/ai-midware' },
  { text: 'Contact sales', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
