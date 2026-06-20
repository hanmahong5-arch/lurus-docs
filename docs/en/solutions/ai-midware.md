---
title: "Enterprise AI Middle Platform Solution"
description: "A five-layer closed loop — Auth · API · MemX · Kova · Lumen — to help enterprises build their own AI middle platform."
---

<div class="midware-page">

# Enterprise AI Middle Platform Solution

<MetricStats :items="[
  { label: 'Capability layers', value: '5 layers', hint: 'Usable standalone · Combined into a closed loop' },
  { label: 'Gateway models', value: '50+' },
  { label: 'Kova recovery', value: 'Microsecond-level', hint: 'WAL resume from checkpoint' },
  { label: 'Rollout path', value: '10 weeks', hint: 'Reference' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Architecture</span>
  <h2 class="lurus-section-head__title">Five-Layer Closed Loop</h2>
  <p class="lurus-section-head__lede">Top-down — each layer is usable on its own, and combining them closes the loop for greater value.</p>
</div>

<ArchitectureDiagram title="AI Middle Platform Five-Layer Closed Loop" chart="graph TB; App[Business Application Layer<br/>Customer support · Knowledge base · Reporting · Developer tools] --> Lumen[Lumen Observability<br/>Trace / Replay / Cost]; Lumen --> Kova[Kova Agent Execution Engine<br/>WAL / Checkpoint]; Kova --> MemX[MemX Smart Memory<br/>Distill / Dedup / Decay / Retrieve]; MemX --> API[Lurus API Unified Gateway<br/>50+ models / Metering / Rate limiting]; API --> Auth[Lurus Auth Unified Identity<br/>SSO · MFA · OIDC · Federation]" />

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen — Observability</div>
    <p class="lurus-card__body">Trace / Replay / Cost.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova — Agent Execution Engine</div>
    <p class="lurus-card__body">WAL / Checkpoint, resume from checkpoint after a crash.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">MemX — Smart Memory</div>
    <p class="lurus-card__body">Distill / Dedup / Decay / Retrieve.</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Lurus API — Unified LLM Gateway</div>
    <p class="lurus-card__body">50+ models / Metering / Rate limiting.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Lurus Auth — Unified Identity</div>
    <p class="lurus-card__body">SSO · MFA · OIDC · Federation.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> Value Comparison</span>
  <h2 class="lurus-section-head__title">Standalone Out-of-the-Box vs. Five-Layer Synergy</h2>
</div>

| Dimension | Standalone use | Five-layer synergy |
|------|---------|---------|
| Identity | Implemented per app | **SSO once** |
| Cost tracking | On your own | **Lumen + API auto-correlation** |
| Crash recovery | Added manually | **Kova WAL fallback** |
| Knowledge capture | Scattered | **Unified distillation by MemX** |
| Compliance | Evaluated one by one | **One compliance posture covers all** |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package" :size="14" /> Delivery</span>
  <h2 class="lurus-section-head__title">Typical Delivery</h2>
</div>

| Form | Description | Timeline |
|------|------|------|
| SaaS | Ready to use immediately | 0 |
| On-premise | Image deployed to the enterprise K8s | 2-4 weeks |
| Managed operations | Lurus on call, enterprise intranet | Negotiated |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Roadmap</span>
  <h2 class="lurus-section-head__title">Reference Rollout Path</h2>
  <p class="lurus-section-head__lede">A phased 10-week onboarding, delivering one layer every two weeks, each independently verifiable.</p>
</div>

<ol class="lurus-steps">
  <li><strong>W1-2</strong>: Connect <a href="/en/guide/introduction">Lurus API</a> to replace your existing LLM calls</li>
  <li><strong>W3-4</strong>: Connect <a href="/en/platform/auth/">Auth</a> to implement SSO</li>
  <li><strong>W5-6</strong>: Use <a href="/en/memx/">MemX</a> to capture business knowledge</li>
  <li><strong>W7-8</strong>: Migrate core Agents to <a href="/en/kova/">Kova</a></li>
  <li><strong>W9-10</strong>: Wire up <a href="/en/lumen/">Lumen</a> observability across the full pipeline</li>
</ol>

## Next Steps

<NextSteps :steps="[
  { text: 'Why Lurus', link: '/en/solutions/why-lurus', primary: true },
  { text: 'Enterprise Deployment Forms', link: '/en/solutions/enterprise-deploy' },
  { text: 'Contact Sales', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
