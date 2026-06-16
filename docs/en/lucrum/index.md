---
title: Lucrum — AI Quantitative Trading Platform
description: An AI-driven quantitative trading platform with a strategy marketplace, backtest validation, and an intelligent trading assistant.
---

<div class="lucrum-page">

<ProductHero product-id="lucrum" />

<MetricStats :items="[
  { label: 'Investment Advisors', value: '11', hint: 'Multi-perspective Agents' },
  { label: 'Backtest Metrics', value: '30+', hint: 'Sharpe / Drawdown / Win Rate…' },
  { label: 'Test Cases', value: '3157+', hint: 'Verified by Vitest' },
  { label: 'Precision', value: 'Decimal.js', hint: 'Zero floating-point error' },
]" />

## What is Lucrum?

**Lucrum** is the AI-Native quantitative trading decision platform from Lurus. The core idea: **natural language is the best programming language** — describe your strategy in plain English, and the AI automatically generates code, runs backtests, and evaluates across multiple dimensions. It ships with 11 professional investment-advisor Agents (perspectives such as Buffett / Peter Lynch / Livermore / Simons) and platform-wide financial-grade precision computation via Decimal.js (verified by 3,157 Vitest test cases) with zero floating-point error.

> The name comes from the Latin "Lucrum" (profit), evoking precise insight into market opportunities.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Current stage: public beta</p>
    <div class="lurus-callout__body"><a href="https://lucrum.lurus.cn">lucrum.lurus.cn</a> is live, and the core features (strategy generation / backtesting / AI advisors) are ready to try directly; see pricing at <a href="https://lucrum.lurus.cn/pricing">/pricing</a>. It has not yet reached general availability (GA), and some advanced capabilities (strategy marketplace, live brokerage integration) are still being refined.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Core Capabilities</span>
  <h2 class="lurus-section-head__title">From a single English sentence to a rated backtest</h2>
  <p class="lurus-section-head__lede">Strategy generation, multi-agent research, strategy marketplace, quota billing, real-time execution — one end-to-end pipeline.</p>
</div>

### AI Strategy Generation & Backtesting

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">Natural language → code</div>
    <p class="lurus-card__body">Describe your strategy intent in plain language, and the AI automatically generates vnpy CtaTemplate strategy code.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="calculator" :size="20" /></span>
    <div class="lurus-card__title">Financial-grade backtesting</div>
    <p class="lurus-card__body">Full Decimal.js precision, A-share lot constraints (multiples of 100 shares), T+1 rules, commissions + stamp duty + transfer fees + slippage.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bar-chart-3" :size="20" /></span>
    <div class="lurus-card__title">30+ metric analysis</div>
    <p class="lurus-card__body">Sharpe ratio, maximum drawdown, Sortino, Calmar, win rate, profit/loss ratio, and more.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="star" :size="20" /></span>
    <div class="lurus-card__title">S/A/B/C/D five-tier rating</div>
    <p class="lurus-card__body">Weighted across 4 dimensions: returns 30% + risk control 30% + stability 25% + efficiency 15%.</p>
  </div>
</div>

### 11 AI Investment Advisors

A multi-agent investment-analysis system orchestrated with LangGraph (4 analysts + 2 researchers + 4 masters + 1 debate moderator = 11):

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">4 investment-master perspectives</div>
    <p class="lurus-card__body">Buffett (value), Peter Lynch (growth), Livermore (technical), Simons (quant).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">4 analysts</div>
    <p class="lurus-card__body">Fundamentals / technicals / sentiment / macro, each delivering its own conclusion.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">2 researchers + 1 debate moderator</div>
    <p class="lurus-card__body">A Bull vs. Bear debate that avoids single-perspective bias.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">Memory-engine integration</div>
    <p class="lurus-card__body">Remembers your trading preferences and past decisions via <a href="/en/memx/">MemX</a>.</p>
  </div>
</div>

### Strategy Marketplace

An open quantitative-strategy ecosystem that connects strategy developers and traders:

| Role | Features |
|------|------|
| **Strategy author** | Upload strategies, set prices, and view revenue splits |
| **Strategy user** | Browse and subscribe to strategies, deploy to live trading in one click |

**Revenue split**: platform 30% / strategy author 70%.

### Quota & Billing

<ol class="lurus-steps">
<li>

**Plan limit** — the monthly AI call allowance included in your subscription plan.

</li>
<li>

**Redis monthly counter** — tracks this month’s usage in real time.

</li>
<li>

**Lubei balance fallback** — once the quota is exhausted, charges are automatically deducted from your [Lubei wallet](/platform/billing#wallet); 1 Lubei = 10,000 tokens.

</li>
</ol>

### Real-Time Data & Execution

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">Market coverage</div>
    <p class="lurus-card__body">A-shares (Shanghai & Shenzhen exchanges, ~5,000+ stocks, data sources adata + Eastmoney); Hong Kong / US / crypto planned.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Simulated trading</div>
    <p class="lurus-card__body">A built-in Mock Broker that fully simulates T+1 rules, 100-share lots, commissions, and stamp duty.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">Risk-control engine</div>
    <p class="lurus-card__body">Position limits, stop-loss / take-profit, and maximum-drawdown protection.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Who It’s For</span>
  <h2 class="lurus-section-head__title">Run quant without writing code</h2>
</div>

| User type | How Lucrum helps you |
|---------|-----------------|
| **Quant beginners** | The AI assistant guides you through onboarding — just describe your strategy in plain language to generate a code skeleton |
| **Individual investors** | Pick validated strategies from the marketplace and deploy them in one click, no coding required |
| **Strategy developers** | A complete develop-backtest-launch toolchain; list your strategies and earn passive income |
| **Professional trading teams** | API endpoints to integrate with your existing trading systems |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> Comparison</span>
  <h2 class="lurus-section-head__title">How it differs from traditional quant platforms</h2>
</div>

<ComparisonTable
  self-label="Lucrum"
  :competitors="['vnpy', '掘金', '米筐', '聚宽']"
  :rows="[
    { dimension: 'Strategy authoring', self: 'Natural-language generation', alt: { vnpy: 'Hand-written Python', '掘金': 'Hand-written Python', '米筐': 'Hand-written Python', '聚宽': 'Hand-written Python' } },
    { dimension: 'AI investment advisors', self: '11 multi-perspective', alt: { vnpy: 'None', '掘金': 'None', '米筐': 'None', '聚宽': 'None' } },
    { dimension: 'Precision', self: 'Full Decimal.js precision', alt: { vnpy: 'float', '掘金': 'float', '米筐': 'float', '聚宽': 'float' } },
    { dimension: 'Strategy marketplace', self: 'Built-in + rated', alt: { vnpy: 'None', '掘金': 'Yes', '米筐': 'Yes', '聚宽': 'Yes' } },
  ]"
  title="Compared to traditional quant platforms"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Technical Architecture</span>
  <h2 class="lurus-section-head__title">From browser to settlement engine</h2>
</div>

<ArchitectureDiagram
  title="Lucrum layered architecture"
  chart="graph TD;
    A[Browser / Mobile] --> B[Lucrum Web<br/>Next.js 14 + TS<br/>Trading panel · Strategy editor · AI chat];
    B --> C[Lucrum Backend<br/>Python 3.11 + FastAPI<br/>vnpy 4.x + LangGraph<br/>Strategy engine · Market gateway · Risk control · Settlement];
    C --> D[AI assistant<br/>Lurus API];
    C --> E[Memory engine<br/>MemX];
    C --> F[(PostgreSQL<br/>Strategies / Trades)];
    C --> G[(Redis<br/>Market data / Quota)];
    C --> H[NATS<br/>Events]"
/>

---

<NextSteps
  :steps="[
    { text: 'Quickstart', link: '/en/lucrum/quickstart', primary: true },
    { text: 'Strategy marketplace', link: '/en/lucrum/strategies' },
    { text: 'FAQ', link: '/en/lucrum/faq' },
    { text: 'Trading platform', link: 'https://lucrum.lurus.cn', external: true },
  ]"
  title="Next steps"
/>

<!-- lurus:related-block -->

## Related Products

<RelatedProducts product-id="lucrum" />

</div>

<style>
.lucrum-page .lurus-card--lucrum .lurus-card__body a { color: var(--lurus-color-lucrum, var(--vp-c-brand-1)); }
</style>
