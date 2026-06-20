---
title: "Tutorial — Lucrum Strategy from Local to Marketplace"
description: "The complete loop: natural language → vnpy code → backtest → optimization → strategy marketplace listing."
---

<div class="lucrum-tut-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="trending-up" :size="14" /> Lucrum Quant Loop</span>
  <h1 class="lurus-section-head__title">The Complete Lucrum Strategy Flow</h1>
  <p class="lurus-section-head__lede"><strong>Goal</strong>: take the "dual moving average + RSI filter" idea all the way from a natural-language description to a strategy marketplace listing.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 steps</span><span class="lurus-stat__label">description to listing</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">S/A/B/C/D</span><span class="lurus-stat__label">five-tier rating</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">vnpy</span><span class="lurus-stat__label">generated code stack</span></div>
</div>

## <Icon name="network" :size="20" /> Architecture

From natural language to listing, the rating is the routing gate: a rating ≥ A goes straight to listing, while anything below A runs through AI optimization and a re-backtest.

<ArchitectureDiagram title="Lucrum Strategy Loop" chart="graph TB
  NL[自然语言] --> GEN[AI 策略生成]
  GEN --> CODE[vnpy 代码]
  CODE --> BT[历史数据回测]
  BT --> SCORE{评分}
  SCORE -->|未达 A| OPT[AI 优化建议]
  OPT --> BT
  SCORE -->|达 A 级| MKT[策略市场上架]" />

## <Icon name="workflow" :size="20" /> Full Workflow

<ol class="lurus-steps">
<li>

**Natural-language description** — go to [lucrum.lurus.cn](https://lucrum.lurus.cn) → New Strategy → paste the description:

> Dual moving average crossover strategy: buy when the 5-day MA crosses above the 20-day MA, and sell when it crosses below. Add an RSI(14) filter — do not buy when RSI > 70. Stop loss at 5%, take profit at 15%.

</li>
<li>

**AI generates vnpy code**

```python
from vnpy.app.cta_strategy import CtaTemplate
import talib

class MA_RSI_Strategy(CtaTemplate):
    fast_window = 5
    slow_window = 20
    rsi_window = 14
    rsi_upper = 70
    stop_loss_pct = 0.05
    take_profit_pct = 0.15

    def on_bar(self, bar):
        self.am.update_bar(bar)
        if not self.am.inited:
            return
        fast_ma = talib.SMA(self.am.close_array, self.fast_window)[-1]
        slow_ma = talib.SMA(self.am.close_array, self.slow_window)[-1]
        rsi = talib.RSI(self.am.close_array, self.rsi_window)[-1]

        if self.pos == 0 and fast_ma > slow_ma and rsi < self.rsi_upper:
            self.buy(bar.close_price, 1)
        elif self.pos > 0 and (fast_ma < slow_ma):
            self.sell(bar.close_price, self.pos)
```

</li>
<li>

**Backtest** — pick a backtest window (defaults to the last 2 years) and click Run:

```
回测期间: 2024-01-01 ~ 2025-12-31
夏普比率: 1.15
最大回撤: 11.3%
胜率: 56%
年化收益: 18.4%
评级: B (收益良好，风控合格)
```

</li>
<li>

**AI optimization** — Lucrum offers improvement suggestions:

> The current RSI filter threshold (70) is fairly loose — the backtest had 8 false breakouts. Suggestions:
> 1. Tighten the RSI threshold to 65
> 2. Add a 5-day volume moving average filter
> 3. Widen the stop loss from 5% to 7% (to avoid getting shaken out by noise)
>
> Projected Sharpe → 1.42, drawdown → 9.2%

Accept the suggestions and re-run the backtest:

```
夏普比率: 1.44
最大回撤: 9.1%
胜率: 62%
评级: A (收益优秀，风控良好)
```

</li>
<li>

**Strategy marketplace listing** — open the strategy detail page → List button → fill in pricing:

| Field | Example |
|------|------|
| Strategy name | MA_RSI_A股趋势 v2 |
| Revenue split | Author 70% / Platform 30% |
| Trial period | 7 days |
| Suggested subscription price | 99 Lubei/month |

Once it passes compliance review, it can be listed on the [strategy marketplace](/en/lucrum/strategies).

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">The B → A jump comes from the optimization round</p>
    <div class="lurus-callout__body"><p>The first backtest rated B (Sharpe 1.15). After accepting the AI optimization suggestions and re-running the backtest, the Sharpe rose to 1.44 and the drawdown dropped to 9.1%, reaching A grade — and only then passing the listing gate.</p></div>
  </div>
</div>

## <Icon name="book-open" :size="20" /> Key Concepts

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="Sharpe Ratio">Sharpe Ratio</Term></div>
    <p class="lurus-card__body">Excess return per unit of risk.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="Max Drawdown">Max Drawdown</Term></div>
    <p class="lurus-card__body">The decline from the historical peak to the lowest trough.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="CtaTemplate">CtaTemplate</Term></div>
    <p class="lurus-card__body">vnpy's strategy base class.</p>
  </div>
</div>

## Next Steps

<NextSteps :steps="[
  { text: 'Learn about Lucrum', link: '/en/lucrum/', primary: true },
  { text: 'Strategy Marketplace', link: '/en/lucrum/strategies' },
  { text: 'FAQ', link: '/en/lucrum/faq' },
]" />

</div>
