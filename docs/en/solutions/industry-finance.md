---
title: "Finance Industry Solution"
description: "Lucrum + Auth + compliance auditing — a combined solution for brokerages, asset managers, and fintech."
---

<div class="finance-page">

# Finance Industry Solution

<MetricStats :items="[
  { label: 'AI investment advisors', value: '11', hint: 'Multi-perspective' },
  { label: 'Backtest metrics', value: '30+' },
  { label: 'Test cases', value: '3157+', hint: 'Vitest' },
  { label: 'Strategy go-live', value: '1-3 days' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Who it's for</span>
  <h2 class="lurus-section-head__title">Who uses it</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title">Brokerage proprietary trading</div>
    <p class="lurus-card__body">Proprietary / client A-share quant trading.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="briefcase" :size="20" /></span>
    <div class="lurus-card__title">Asset managers</div>
    <p class="lurus-card__body">Strategy research and portfolio management.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Fintech</div>
    <p class="lurus-card__body">AI advisory products.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">Family offices / professional investors</div>
    <p class="lurus-card__body">Personal strategy research and backtesting.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Core components</span>
  <h2 class="lurus-section-head__title">Product stack</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="lucrum" :actions="[{label:'Explore Lucrum', href:'/en/lucrum/', primary:true}]" />
  <ActionCard product-id="auth" :actions="[{label:'Unified identity', href:'/en/platform/auth/', primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> Data flow</span>
  <h2 class="lurus-section-head__title">Reference architecture</h2>
  <p class="lurus-section-head__lede">From natural-language strategies to live trading — analysts describe the idea, the AI implements the code.</p>
</div>

<ArchitectureDiagram title="Finance quant data flow" chart="graph TB; A[Analyst / PM] -->|Describe strategy in natural language| B[Lucrum<br/>11 AI investment advisors]; B -->|vnpy code + backtest| C[Strategy marketplace]; C -->|Subscribe / revenue share| D[Live trading]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Compliance</span>
  <h2 class="lurus-section-head__title">Compliance highlights</h2>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">Data stays onshore</div>
    <p class="lurus-card__body">On-premises deployment; trading data persisted locally.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="calculator" :size="20" /></span>
    <div class="lurus-card__title">Financial-grade precision</div>
    <p class="lurus-card__body">Decimal.js end to end, validated by 3,157 Vitest cases.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">End-to-end auditing</div>
    <p class="lurus-card__body">Every strategy change, backtest, and trade leaves a trail.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Identity compliance</div>
    <p class="lurus-card__body">Enforced MFA, periodic PAT rotation, and SSO federation to your in-house IdP.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Cost</span>
  <h2 class="lurus-section-head__title">TCO reference</h2>
</div>

| Item | In-house build | Lucrum solution |
|------|------|-----------|
| Researchers | 3-5 people | 1-2 people + AI advisors |
| Strategy go-live cycle | 2-4 weeks | **1-3 days** |
| Backtest infrastructure | Build your own | Built in |

## Next steps

<NextSteps :steps="[
  { text: 'Lucrum quickstart', link: '/en/lucrum/quickstart', primary: true },
  { text: 'Full strategy flow', link: '/en/tutorials/lucrum-strategy-workflow' },
  { text: 'Contact sales', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
