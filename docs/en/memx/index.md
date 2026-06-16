---
title: MemX — Adaptive Memory Engine for AI
description: An AI memory engine built on ACE v2.0, with intelligent distillation, bio-inspired forgetting, and end-to-end privacy protection.
---

<div class="memx-page">

<ProductHero product-id="memx" />

## What is MemX?

**MemX** is Lurus's adaptive memory engine for AI, built on **<Term t="ACE">ACE (Adaptive Context Engine)</Term> v2.0**. It provides AI agents with full knowledge lifecycle management: **<Term t="Knowledge Distillation">intelligent distillation</Term> → <Term t="Semantic Dedup">semantic deduplication</Term> → decay-based forgetting → hybrid retrieval**, giving AI a truly human-like "memory."

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="brain" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Three core advantages</p>
    <div class="lurus-callout__body"><ul><li><strong>Hybrid mode by default + automatic fallback</strong> — when the LLM is unavailable, it switches to pure rules: zero calls, zero cost.</li><li><strong>Bio-inspired forgetting curve</strong> — Ebbinghaus exponential decay, half-life defaults to 30 days; strongly recalled items are promoted to permanent memory.</li><li><strong>End-to-end privacy protection</strong> — sensitive information never enters the vector database.</li></ul></div>
  </div>
</div>

<MetricStats :items="[
  { label: 'PII filter rules', value: '12', hint: 'non-bypassable' },
  { label: 'Hybrid retrieval', value: '4 layers', hint: 'L1→L4 weighted fusion' },
  { label: 'Decay half-life', value: '30 days', hint: 'default, configurable' },
  { label: 'Delivery forms', value: 'Python · REST · MCP' },
]" />

## Core Features

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Four modules</span>
  <h2 class="lurus-section-head__title">From conversation to retrievable memory</h2>
  <p class="lurus-section-head__lede">For detailed rules, formulas, and parameters, see <a href="/en/memx/concepts">Core Concepts</a> and <a href="/en/memx/architecture">Architecture</a>.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: 'Intelligent knowledge distillation (Reflector)', body: 'Hybrid mode (rule-based prefiltering + LLM refinement) identifies 5 knowledge patterns: error fixes / retry successes / config changes / new tool usage / repeated operations, scoring each 0-100 to filter out low-score noise.', icon: 'filter' },
    { title: 'Semantic deduplication and conflict detection (Curator)', body: 'Cosine similarity ≥0.8 auto-merges, 0.5-0.8 flags potential conflicts, below 0.5 is treated as independent knowledge.', icon: 'git-merge' },
    { title: 'Bio-inspired memory decay', body: '7-day protection period + exponential decay + recall reinforcement; items retrieved more than 15 times are promoted to permanent memory and no longer decay.', icon: 'timer' },
    { title: 'Four-layer hybrid retrieval', body: 'L1 exact → L2 fuzzy → L3 metadata → L4 vector; after ScoreMerger weighted fusion, multiplied by DecayWeight × RecencyBoost × ScopeBoost, with automatic fallback when the vector layer is unavailable.', icon: 'search' },
    { title: 'Privacy-first design', body: '12 built-in sensitive-information filter rules (keys / tokens / database connection strings / local paths / custom regexes), automatically blocked before write.', icon: 'shield-check' },
  ]"
/>

## Architecture Overview

Knowledge flows in from conversations and passes in turn through distillation, privacy filtering, and deduplication before landing in vector and metadata storage; retrieval requests go through the four-layer hybrid pipeline, while the decay engine continuously maintains memory activity in the background.

<ArchitectureDiagram
  title="ACE engine data flow"
  chart="graph TB
  Input[Conversation stream] --> Reflector[Reflector knowledge distillation]
  Reflector --> PII[PII filter 12 rules]
  PII --> Curator[Curator semantic dedup]
  Curator --> Store[(Vector + metadata)]
  Store --> Decay[Decay Engine Ebbinghaus]
  Query[Retrieval request] --> Hybrid[Four-layer hybrid retrieval]
  Hybrid --> Store"
/>

## Use Cases

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
    <div class="lurus-card__title">Coding assistant</div>
    <p class="lurus-card__body">Remembers your coding habits, the pitfalls you've hit, and project conventions.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span>
    <div class="lurus-card__title">Customer support systems</div>
    <p class="lurus-card__body">Accumulates knowledge of customer interaction history to deliver personalized service.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="book-open" :size="20" /></span>
    <div class="lurus-card__title">Personal knowledge base</div>
    <p class="lurus-card__body">Automatically distills and organizes knowledge from everyday conversations.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">Team collaboration</div>
    <p class="lurus-card__body">Shares team-level memory so new members can quickly get up to speed on context.</p>
  </div>
</div>

## Comparison with Traditional Memory Systems

<ComparisonTable
  self-label="MemX (ACE)"
  :competitors="['Traditional approach (mem0)']"
  title="Why this is not just another vector store"
  :rows="[
    { dimension: 'Knowledge extraction', self: 'Hybrid engine (rule-based prefiltering + LLM refinement, reducing calls by 90%+)', alt: { 'Traditional approach (mem0)': 'LLM (2-5K tokens each time)' } },
    { dimension: 'Deduplication', self: 'Cosine-similarity auto-merge', alt: { 'Traditional approach (mem0)': 'LLM judges item by item' } },
    { dimension: 'Forgetting', self: 'Exponential decay + recall reinforcement', alt: { 'Traditional approach (mem0)': 'Permanent storage, no eviction' } },
    { dimension: 'Search', self: 'Four-layer hybrid search', alt: { 'Traditional approach (mem0)': 'Vector search only' } },
    { dimension: 'Privacy', self: '12 built-in sensitive-information filter rules', alt: { 'Traditional approach (mem0)': 'No built-in protection' } },
    { dimension: 'Scope', self: 'Hierarchical (global / project / workspace)', alt: { 'Traditional approach (mem0)': 'Flat (user / agent)' } },
    { dimension: 'Token management', self: 'Built-in budget trimming (CJK-aware)', alt: { 'Traditional approach (mem0)': 'Caller manages it themselves' } },
    { dimension: 'Local embeddings', self: 'ONNX local inference, fully offline', alt: { 'Traditional approach (mem0)': 'Requires an API' } },
  ]"
/>

## Next Steps

<NextSteps
  :steps="[
    { text: 'Quickstart — experience the core features in 5 minutes', link: '/en/memx/quickstart', primary: true },
    { text: 'Core Concepts — dive into the ACE engine design principles', link: '/en/memx/concepts' },
    { text: 'Architecture — the complete system architecture', link: '/en/memx/architecture' },
    { text: 'Integrations and MCP directory', link: '/integrations/' },
    { text: 'FAQ', link: '/en/memx/faq' },
  ]"
/>

<!-- lurus:related-block -->

## Related Products and Next Steps

<RelatedProducts product-id="memx" />

</div>

<style>
.memx-page .lurus-callout {
  margin: 20px 0;
}
.memx-page .lurus-section-head {
  margin-top: 8px;
}
</style>
