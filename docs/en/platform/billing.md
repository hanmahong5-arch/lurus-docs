---
title: Billing Explained
description: Detailed guide to Lurus subscription plans, quota management, and the Lubei credit economy.
---

<div class="billing-page">

# Billing Explained <StatusBadge status="live" />

Subscription plans, quota management, and the Lubei credit economy.

<MetricStats
  :items="[
    { label: 'Subscription plans', value: '5 tiers', hint: 'Free → Enterprise, plus a Claude Code plan' },
    { label: 'Payment methods', value: '3 options', hint: 'Stripe / Creem / Epay' },
    { label: 'Lubei', value: '1 CNY = 1 LB', hint: 'You get exactly what you top up' },
    { label: 'Refund window', value: '7 days', hint: 'Request the whole order within 7 days of payment' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> Subscriptions</span>
  <h2 class="lurus-section-head__title">Subscription Plan Comparison</h2>
  <p class="lurus-section-head__lede">From free trial to enterprise SLA — choose by your usage scale.</p>
</div>

| Plan | Positioning | Notes |
|------|------|------|
| **Free** | Free trial | Daily free quota, fewer models available |
| **Basic** | Entry-level monthly subscription | Individual developers |
| **Pro** | Advanced subscription, monthly or annual | Annual total costs less than 12 months of monthly billing |
| **Enterprise** | Teams / enterprises | Private deployment, SLA, etc. per business agreement |

Prices, daily quotas, and available models for each tier are determined by the [identity.lurus.cn](https://identity.lurus.cn) console (Subscription Management page); administrator changes take effect immediately, so this page does not keep a separate copy of the numbers. There is also a separate plan for Claude Code, likewise per the console.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="briefcase" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Enterprise Plan</p>
    <div class="lurus-callout__body">Need private deployment, a specific data center, or an SLA? Contact <a href="mailto:business@lurus.cn">business@lurus.cn</a>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Quota</span>
  <h2 class="lurus-section-head__title">Quota Management</h2>
  <p class="lurus-section-head__lede">Your subscription quota is used first; after that, calls are charged from your Lubei wallet at each model’s unit price.</p>
</div>

### Quota Calculation

Each call is billed by the model’s unit price and token usage: chat models price input and output separately, while image generation and similar tasks are priced per call. Unit prices for each model are shown in the console.

### Handling Quota Overruns

<ol class="lurus-steps">
<li>A request comes in; the subscription quota is checked first.</li>
<li>Quota is <strong>sufficient</strong> → processed normally.</li>
<li>Quota is <strong>insufficient</strong> → check the Lubei balance: if the balance is sufficient, it is automatically charged and processed normally.</li>
<li>Balance is <strong>insufficient</strong> → returns a <code>402</code> error.</li>
</ol>

Getting a `402` / `insufficient_quota`? See the troubleshooting steps at [Troubleshooting · Insufficient Quota / Balance](/en/guide/troubleshooting#insufficient-quota).

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">It Won’t Fail Silently</p>
    <div class="lurus-callout__body">You get a reminder when your wallet balance drops below the threshold you set; when the balance is insufficient, requests return 402 right away — you never run into debt first and get chased for payment later.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> Lubei</span>
  <h2 class="lurus-section-head__title">The Lubei Economy</h2>
  <p class="lurus-section-head__lede">The wallet’s accounting unit: 1 Lubei = 1 CNY.</p>
</div>

### Top-up

Topping up 1 CNY credits 1 Lubei, with no tiered bonuses. If an administrator has set up a top-up promotion, the amount payable shown on the top-up page applies.

### VIP Discounts

VIP level is based on your cumulative top-up amount (or an annual subscription), and the discount applies automatically when you purchase or renew a subscription; top-ups and usage-based charges are not discounted.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="crown" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Example: Gold Card 5% Off</p>
    <div class="lurus-callout__body">With the default thresholds, a cumulative top-up of ¥2,000 makes you Gold; renewing a ¥99 monthly subscription then costs <code>99 × 0.95 = ¥94.05</code>. Thresholds and discounts are per the console.</div>
  </div>
</div>

### Lubei Validity

Topped-up balance never expires; credit granted in promotions may have an expiration date, subject to the terms of the promotion.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Billing</span>
  <h2 class="lurus-section-head__title">Bills & Invoices</h2>
</div>

- **View bills** ([identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)): monthly spending summary, transaction details, Lubei income/expenses, quota usage statistics.
- **Issue invoices**: you can request an invoice for each paid order by entering the invoice title and tax ID; it is issued manually and can then be downloaded from the console.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="repeat" :size="14" /> Refunds</span>
  <h2 class="lurus-section-head__title">Refund Policy</h2>
</div>

| Type | Policy |
|------|------|
| Subscription | Request in the console within 7 days of payment; once approved, the whole order is refunded |
| Top-up | Within 7 days of payment, a top-up that hasn’t been used can be refunded as a whole order |
| Already-consumed portion | Not refundable |

Alipay, WeChat Pay, and Stripe payments are refunded to the original payment method; other methods are refunded to your wallet.

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Platform Overview', link: '/platform/', primary: true },
    { text: 'FAQ', link: '/platform/faq' },
    { text: 'Get an API Key', link: '/guide/get-api-key' },
  ]"
/>

</div>
