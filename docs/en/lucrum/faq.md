---
title: Lucrum FAQ
description: Frequently asked questions and answers about the Lucrum AI quantitative trading platform.
---

<div class="lucrum-page">

# FAQ

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Accounts & Getting Started</span>
  <h2 class="lurus-section-head__title">Registration, Payment & Market Coverage</h2>
</div>

<details class="lurus-faq-item">
<summary>How do I register?</summary>

Sign in at [lucrum.lurus.cn](https://lucrum.lurus.cn) with your Lurus unified account (all products share the same account).

</details>

<details class="lurus-faq-item">
<summary>Is it free or paid?</summary>

There are free and paid tiers; usage beyond the free quota is charged from your [Lubei wallet](/en/platform/billing#wallet).

| Feature | Free | Paid |
|------|------|------|
| AI trading assistant | Limited daily conversations | Unlimited |
| Strategy marketplace browsing / free strategies | All visible / available | All visible / available |
| Paid strategy subscriptions | Not available | Subscribable |
| Strategy development | Basic backtesting | Full features |

</details>

<details class="lurus-faq-item">
<summary>Which markets are supported?</summary>

Currently A-shares (Shanghai and Shenzhen exchanges); Hong Kong stocks / US stocks / crypto are being integrated.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> AI Assistant</span>
  <h2 class="lurus-section-head__title">Accuracy, Memory & Code Generation</h2>
</div>

<details class="lurus-faq-item">
<summary>Is the analysis accurate?</summary>

It provides references based on LLMs + technical analysis and **does not constitute investment advice**. It is good at interpreting technical indicators / candlestick charts, framing market logic, and assisting with strategy ideation and code; it is not good at predicting short-term price moves—use it as a reference for decisions, not a basis.

</details>

<details class="lurus-faq-item">
<summary>Does it remember conversations?</summary>

Yes. It integrates the [MemX memory engine](/en/memx/), remembering your preferences / watched sectors / conversation history, isolated per user and never leaked.

</details>

<details class="lurus-faq-item">
<summary>Can I use AI to write strategy code?</summary>

Yes. Describe your idea and the AI generates a Python code scaffold that you can backtest and validate directly in the strategy workbench.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> Strategies</span>
  <h2 class="lurus-section-head__title">Backtest Credibility, Withdrawals & Code Protection</h2>
</div>

<details class="lurus-faq-item">
<summary>Is the backtest data trustworthy?</summary>

It uses real historical market data, but does not account for market impact or slippage (which differ for large capital), is prone to overfitting from excessive optimization, and past performance does not guarantee future results. We recommend validating in paper trading first after backtesting.

</details>

<details class="lurus-faq-item">
<summary>How do I withdraw strategy income?</summary>

Income enters your wallet as Lubei → sign in at [identity.lurus.cn](https://identity.lurus.cn) → "Wallet" → "Withdraw" → enter the amount and bank card → funds typically arrive within 1-3 business days.

</details>

<details class="lurus-faq-item">
<summary>Will my strategy code be leaked?</summary>

No. It is stored encrypted server-side; users only see the description / indicators / backtest report and cannot view the source code.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> Technical Issues</span>
  <h2 class="lurus-section-head__title">Rate Limiting, Latency & Strategy Languages</h2>
</div>

<details class="lurus-faq-item">
<summary>The API returns 429?</summary>

You exceeded the request rate limit (which varies by plan); lower your request rate or upgrade your plan.

</details>

<details class="lurus-faq-item">
<summary>Strategy execution latency is high?</summary>

Check network stability; for compute-heavy strategies we recommend precomputing and caching; avoid high-concurrency periods around market open / close.

</details>

<details class="lurus-faq-item">
<summary>Which languages are supported for writing strategies?</summary>

Currently Python; the strategy SDK provides a technical indicator library and trade execution interfaces.

</details>

---

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="mail" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Didn’t find your answer?</p>
    <div class="lurus-callout__body">Please contact <a href="mailto:support@lurus.cn">support@lurus.cn</a>.</div>
  </div>
</div>

<NextSteps
  :steps="[
    { text: 'Quickstart', link: '/en/lucrum/quickstart', primary: true },
    { text: 'Strategy Marketplace', link: '/en/lucrum/strategies' },
    { text: 'Product Overview', link: '/en/lucrum/' },
  ]"
  title="Next Steps"
/>

</div>
