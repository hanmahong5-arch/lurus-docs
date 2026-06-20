---
title: "Cross-Product Tutorial Hub"
description: "End-to-end tutorials that wire multiple Lurus products together, grouped by role."
---

<div class="tut-hub">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="graduation-cap" :size="14" /> Cross-Product Tutorials</span>
  <h1 class="lurus-section-head__title">Cross-Product Tutorial Hub</h1>
  <p class="lurus-section-head__lede">Quickstarts for individual products live in their own docs. This is where you find <strong>cross-product combination cases</strong>—wiring together MemX + Kova + API, Lumen + LangGraph, and more to solve real engineering problems.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">4</span><span class="lurus-stat__label">End-to-end tutorials</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">5+</span><span class="lurus-stat__label">Products combined</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2</span><span class="lurus-stat__label">Role tracks</span></div>
</div>

## <Icon name="users" :size="20" /> By Role

<div class="action-grid">
  <ActionCard
    name="Agent Developer"
    tagline="Add memory to your agent · crash recovery · replay debugging"
    icon="bot"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'Memory Agent', href: '/en/tutorials/memory-agent', primary: true },
      { label: 'Lumen × LangGraph × Kova', href: '/en/tutorials/lumen-kova-langgraph' },
    ]"
  />
  <ActionCard
    name="Quant Trading"
    tagline="A full loop from natural-language strategy to listing on the strategy marketplace"
    icon="trending-up"
    color="var(--lurus-color-lucrum)"
    :actions="[
      { label: 'Lucrum Strategy Full Flow', href: '/en/tutorials/lucrum-strategy-workflow', primary: true },
    ]"
  />
</div>

## <Icon name="layers" :size="20" /> By Topic

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--memx" href="/en/tutorials/memory-agent">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">Memory + Agent</div>
    <p class="lurus-card__body">MemX long-term memory + Kova crash recovery + Lurus API calls to build a support agent that remembers users.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="/en/tutorials/lumen-kova-langgraph">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Observability</div>
    <p class="lurus-card__body">Replace the default LangGraph Checkpointer with Lumen, deploy to Kova, and compare crash-recovery behavior.</p>
  </a>
  <a class="lurus-card lurus-card--lucrum" href="/en/tutorials/lucrum-strategy-workflow">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title">Quant Loop</div>
    <p class="lurus-card__body">Describe a strategy in natural language → AI generates vnpy code → backtest → optimize → list on the strategy marketplace.</p>
  </a>
  <a class="lurus-card lurus-card--switch" href="/en/tutorials/switch-mcp-team">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Unified Team Tooling</div>
    <p class="lurus-card__body">Switch consolidates your team's AI CLI MCP configs, model keys, and cost dashboard into a single central config.</p>
  </a>
</div>

## <Icon name="workflow" :size="20" /> Suggested Path

<ol class="lurus-steps">
<li>

Start with each product's own quickstart (begin with [Lurus API](/en/guide/quickstart))

</li>
<li>

Then pick a cross-product tutorial here that's close to your use case

</li>
<li>

Finally, follow the [Migration Guides](/en/migrations/) to replace your existing stack

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Combination Compounds</p>
    <div class="lurus-callout__body"><p>Every tutorial only references capabilities that already exist in each product's docs. Get a single product working first, then follow the tutorial to connect them—accounts, billing, and models share one pool, so there's no need to integrate twice.</p></div>
  </div>
</div>

## Next Steps

<NextSteps :steps="[
  { text: 'Memory Agent', link: '/en/tutorials/memory-agent', primary: true },
  { text: 'Migration Guides', link: '/en/migrations/' },
  { text: 'Enterprise Solutions', link: '/en/solutions/' },
]" />

</div>
