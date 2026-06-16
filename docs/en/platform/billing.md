---
title: Billing Explained
description: Detailed guide to Lurus subscription plans, quota management, and the Lubei credit economy.
---

<div class="billing-page">

# Billing Explained <StatusBadge status="live" />

Subscription plans, quota management, and the Lubei credit economy.

<MetricStats
  :items="[
    { label: 'Subscription plans', value: '4 tiers', hint: 'Free → Enterprise' },
    { label: 'Payment methods', value: '3 options', hint: 'Stripe / Creem / Epay' },
    { label: 'Top-up rebate', value: 'Up to 5%', hint: 'First 6 renewals' },
    { label: 'Refund window', value: '7 days', hint: 'Full refund on first subscription' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> Subscriptions</span>
  <h2 class="lurus-section-head__title">Subscription Plan Comparison</h2>
  <p class="lurus-section-head__lede">From free trial to enterprise SLA — choose by your usage scale.</p>
</div>

| Plan | API Calls | Available Models | Lucrum | Support / Other |
|------|---------|---------|--------|------------|
| **Free** | 100/day | Basic (deepseek-chat, gpt-3.5-turbo) | AI assistant 10 conversations/day | Community support |
| **Basic** | Entry-level monthly subscription; see the console for pricing | — | — | For individual developers getting started |
| **Pro** (monthly/annual, annual gets a discount) | 10,000/month | All | Unlimited AI assistant; up to 3 strategy deployments | Email tickets (24h response) |
| **Enterprise** (custom) | On demand | All + private deployment | Unlimited team members | SLA 99.9%; dedicated account manager + instant response; data center of your choice |

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="briefcase" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Enterprise Plan</p>
    <div class="lurus-callout__body">Need private deployment, a specific data center, or SLA 99.9%? Contact <a href="mailto:business@lurus.cn">business@lurus.cn</a>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Quota</span>
  <h2 class="lurus-section-head__title">Quota Management</h2>
  <p class="lurus-section-head__lede">Each call is converted to quota by model and token usage; once the limit is exceeded, billing automatically switches to Lubei.</p>
</div>

### Quota Calculation

The quota consumed by each API call depends on the model and token usage:

| Model Type | Quota Consumption Rule |
|---------|-------------|
| Basic models (deepseek-chat, etc.) | 1 call = 1 quota |
| Advanced models (gpt-4o, etc.) | 1 call = 3 quota |
| Image / video generation | 5–20 quota depending on task complexity |

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
    <div class="lurus-callout__body">When your balance runs low, you get advance warning via email plus an in-app message, so service is never interrupted without your knowledge.</div>
  </div>
</div>

### Quota Alerts

| Alert Threshold | Notification Method |
|---------|---------|
| 30% remaining | In-app message |
| 10% remaining | In-app message + email |
| Quota exhausted | In-app message + email + WebSocket push |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> Lubei</span>
  <h2 class="lurus-section-head__title">The Lubei Economy</h2>
  <p class="lurus-section-head__lede">A unified credit currency, exchangeable for tokens and call counts at a fixed ratio.</p>
</div>

### Lubei Value

The baseline value of 1 Lubei (LB):

| Resource | 1 LB Exchanges For |
|------|------------|
| Tokens (basic models) | ~10,000 tokens |
| Tokens (advanced models) | ~3,000 tokens |
| API calls | ~5–10 calls (depending on the model) |

### Top-up Ratios

| Top-up Amount (CNY) | Lubei Received | Unit Price |
|----------------|---------|------|
| ¥10 | 10 LB | ¥1.00/LB |
| ¥50 | 55 LB | ¥0.91/LB |
| ¥100 | 115 LB | ¥0.87/LB |
| ¥500 | 600 LB | ¥0.83/LB |

The more you top up, the lower the unit price.

### Stacking VIP Discounts

VIP discounts apply automatically when spending Lubei.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="crown" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Example: Gold Card 10% Off</p>
    <div class="lurus-callout__body">A Gold Card user calling gpt-4o (3 LB/call) is actually charged = <code>3 × 0.9 = 2.7 LB/call</code>.</div>
  </div>
</div>

### Lubei Validity

Purchased Lubei never expires; promotional gifts follow the terms of their respective promotions; refunds cover only the cash-paid portion, and gifted Lubei is non-refundable.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Billing</span>
  <h2 class="lurus-section-head__title">Bills & Invoices</h2>
</div>

- **View bills** ([identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)): monthly spending summary, transaction details, Lubei income/expenses, quota usage statistics.
- **Issue invoices** (general and special VAT invoices supported): "Bills" → "Request Invoice" → fill in the invoice details (auto-filled after the first save) → select the amount and month. Electronic invoices are usually emailed within 1 business day.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="repeat" :size="14" /> Refunds</span>
  <h2 class="lurus-section-head__title">Refund Policy</h2>
</div>

| Type | Policy |
|------|------|
| Subscription refund | Full refund within 7 days of the first subscription |
| Lubei top-up refund | Unused Lubei can be refunded (gifted portion deducted) |
| Already-consumed portion | Not refundable |

For refunds, contact [support@lurus.cn](mailto:support@lurus.cn).

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Platform Overview', link: '/platform/', primary: true },
    { text: 'FAQ', link: '/platform/faq' },
    { text: 'Get an API Key', link: '/guide/get-api-key' },
  ]"
/>

</div>
