---
title: "Developer Tools Industry Solution"
description: "Kova + Switch + Lumen — built for developer-tools companies and infrastructure teams."
---

<div class="devtools-page">

# Developer Tools Industry Solution

<MetricStats :items="[
  { label: 'CLIs managed centrally', value: '5', hint: 'Switch' },
  { label: 'Gateway models', value: '50+' },
  { label: 'Agent recovery', value: 'Microsecond', hint: 'WAL checkpoint resume' },
  { label: 'Components', value: '4', hint: 'Kova · MemX · API · Lumen' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Who it's for</span>
  <h2 class="lurus-section-head__title">Who uses it</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">AI coding-tool companies</div>
    <p class="lurus-card__body">Building their own AI coding products.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
    <div class="lurus-card__title">Platform / DevX teams</div>
    <p class="lurus-card__body">Internal developer experience.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="terminal" :size="20" /></span>
    <div class="lurus-card__title">Independent developers / small studios</div>
    <p class="lurus-card__body">Start lightweight, scale on demand.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="graduation-cap" :size="20" /></span>
    <div class="lurus-card__title">Research institutions</div>
    <p class="lurus-card__body">Experimental agent workflows.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Core components</span>
  <h2 class="lurus-section-head__title">Product lineup</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="kova"   :actions="[{label:'Kova',   href:'/en/kova/',   primary:true}]" />
  <ActionCard product-id="switch" :actions="[{label:'Switch', href:'/en/switch/', primary:true}]" />
  <ActionCard product-id="lumen"  :actions="[{label:'Lumen',  href:'/en/lumen/',  primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="puzzle" :size="14" /> Typical combinations</span>
  <h2 class="lurus-section-head__title">Two deployment combinations</h2>
</div>

### Scenario A: Build your own AI coding tool

<ArchitectureDiagram title="Build your own AI coding tool" chart="graph TB; Kova[Kova<br/>Durable execution · crash recovery] --> MemX[MemX<br/>Remembers user preferences / project conventions]; MemX --> API[Lurus API<br/>50+ models, plug and play]; API --> Lumen[Lumen<br/>Post-launch observability + Replay debugging]; Lumen --> Auth[Auth<br/>Org-wide SSO + Passkey]" />

### Scenario B: Optimize internal developer ROI

<ArchitectureDiagram title="Optimize internal developer ROI" chart="graph TB; Switch[Switch<br/>Centrally manage the team's 5 CLIs] --> Lumen[Lumen<br/>Per-person daily token spend in one chart]; Lumen --> ArgoCD[ArgoCD<br/>Git-synced configuration]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="trending-up" :size="14" /> Benefits</span>
  <h2 class="lurus-section-head__title">Typical benefits</h2>
</div>

| Metric | Before | After |
|------|--------|-------|
| AI tool configuration scattered | 5 JSON files | **1 yaml file** |
| Monthly token cost | Invisible | **Dashboard + alerts** |
| Agent crash recovery | Restart from scratch | **Microsecond checkpoint resume** |
| Release cycle | Weeks | **Days** |

## Next steps

<NextSteps :steps="[
  { text: 'Kova quickstart', link: '/en/kova/quickstart', primary: true },
  { text: 'Switch configuration', link: '/en/switch/configuration' },
  { text: 'Lumen quickstart', link: '/en/lumen/quickstart' },
]" />

</div>
