---
title: Billing Explained
description: How Lurus billing currently works, what happens when your balance runs out, invoices, and refunds.
---

<div class="billing-page">

# Billing Explained

This page describes how billing works; it does not list prices. Prices and quotas are shown in the console and in your contract.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> Methods</span>
  <h2 class="lurus-section-head__title">Billing methods</h2>
</div>

- **Enterprise contract**: private deployments and managed delivery are settled according to the scope agreed in the contract, paid by corporate bank transfer with an invoice issued. For private deployment or a specific data center, contact [business@lurus.cn](mailto:business@lurus.cn).
- **Individual subscription**: see available plans and prices on the subscription page at [identity.lurus.cn](https://identity.lurus.cn); usage beyond your subscription quota is deducted from your [account wallet](/en/platform/#wallet) balance.
- **Tenant quotas**: in [Lurus Hub](/hub/), tenant administrators can manage quotas and view usage separately for each organization, team, or downstream customer.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Quota</span>
  <h2 class="lurus-section-head__title">Insufficient quota or balance</h2>
</div>

Each call is converted into consumption based on the model and token usage. When both quota and balance are insufficient, the request is rejected with an insufficient-quota error. For troubleshooting steps, see [Troubleshooting · Insufficient quota / balance](/en/guide/troubleshooting#insufficient-quota).

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Billing</span>
  <h2 class="lurus-section-head__title">Bills, invoices, and refunds</h2>
</div>

- **View bills**: sign in to [identity.lurus.cn](https://identity.lurus.cn) to see transaction details and usage statistics.
- **Invoices**: enterprise contracts are invoiced per the contract; otherwise contact [support@lurus.cn](mailto:support@lurus.cn).
- **Refunds**: contact [support@lurus.cn](mailto:support@lurus.cn); amounts already consumed are not refunded.

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Platform Overview', link: '/en/platform/', primary: true },
    { text: 'FAQ', link: '/en/platform/faq' },
    { text: 'Get an API Key', link: '/en/guide/get-api-key' },
  ]"
/>

</div>
