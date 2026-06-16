---
title: Lucrum Quickstart
description: Get started with the Lucrum AI quant trading assistant in 5 minutes.
---

<div class="lucrum-page">

# Quickstart

Get started with the Lucrum AI trading assistant in 5 minutes — from sign-up to your first backtest.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5</span><span class="lurus-stat__label">Minutes to start</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">11</span><span class="lurus-stat__label">Advisors</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">A-shares</span><span class="lurus-stat__label">Shanghai &amp; Shenzhen</span></div>
</div>

<ol class="lurus-steps">
<li>

### Sign up and log in

Visit [lucrum.lurus.cn](https://lucrum.lurus.cn) → click "Sign up" using your unified Lurus account (email / GitHub / Google) → enter the trading dashboard. If you already have an account for any Lurus product, you can log in directly (they share the same account system).

</li>
<li>

### Try the AI trading assistant

After logging in, open the AI assistant from the bottom-right corner. It understands natural language and can answer any trading-related question. Example questions:

- **Market analysis** — "Why did the Shanghai Composite Index fall today?"
- **Strategy advice** — "Recommend a conservative strategy for 100,000 in capital"
- **Technical indicators** — "Compute the Bollinger Bands for CATL"
- **Risk assessment** — "Is going all-in on BYD too risky?"

</li>
<li>

### Browse the strategy marketplace

Open "**Strategy Marketplace**" at the top → filter by return / drawdown / type → strategy cards show annualized return, max drawdown, Sharpe ratio (&gt; 1 is excellent), and run duration (see [Strategy Marketplace](/en/lucrum/strategies) for a detailed metrics explanation) → click "Subscribe" to deploy it to your account.

</li>
<li>

### Configure a trading account

Live trading requires linking a brokerage: "**Settings**" → "**Trading Accounts**" → choose a broker → follow the prompts to authorize.

</li>
<li>

### Create your first strategy (developers)

Go to "**Strategy Workbench**" to write your code, then click "**Backtest**" to view historical performance:

```python
# 示例：简单的双均线策略
from lucrum import Strategy, Signal

class DualMA(Strategy):
    """双均线交叉策略"""

    fast_period = 5    # 快线周期
    slow_period = 20   # 慢线周期

    def on_bar(self, bar):
        fast_ma = self.sma(bar.close, self.fast_period)
        slow_ma = self.sma(bar.close, self.slow_period)

        if fast_ma > slow_ma and self.position <= 0:
            return Signal.BUY
        elif fast_ma < slow_ma and self.position >= 0:
            return Signal.SELL

        return Signal.HOLD
```

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Risk warning</p>
    <div class="lurus-callout__body">Quant trading carries the risk of loss. Validate thoroughly on a paper-trading account before going live. Lucrum provides no investment advice or guaranteed returns.</div>
  </div>
</div>

---

## API access

The full REST API can be integrated into your own trading system:

<ApiEndpoint method="POST" path="/api/v1/advisor/chat" description="Get AI analysis" />

```bash
curl https://lucrum.lurus.cn/api/v1/advisor/chat \
  -H "Authorization: Bearer $LURUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "分析上证指数趋势"}'
```

<ApiEndpoint method="GET" path="/api/v1/strategies" description="Get the strategy list" />

```bash
curl https://lucrum.lurus.cn/api/v1/strategies \
  -H "Authorization: Bearer $LURUS_TOKEN"
```

---

<NextSteps
  :steps="[
    { text: 'Strategy Marketplace', link: '/lucrum/strategies', primary: true },
    { text: 'FAQ', link: '/lucrum/faq' },
    { text: 'Lurus API', link: '/guide/introduction' },
    { text: 'MemX Memory Engine', link: '/memx/' },
  ]"
  title="Next steps"
/>

</div>
