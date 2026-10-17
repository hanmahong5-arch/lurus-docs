---
title: Platform FAQ
description: Common questions and answers about Lurus platform accounts, billing, and services.
---

<div class="faq-page">

# FAQ

Frequently asked questions about platform accounts, subscription billing, Lubei, and security, grouped by topic.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Account</span>
  <h2 class="lurus-section-head__title">Account</h2>
</div>

<details class="lurus-faq-item">
<summary>Does one account work across all products?</summary>

Yes. A unified account system — register once and log in to all products (API, Lucrum, Switch, Creator, etc.), sharing your wallet balance and subscription plan.

</details>

<details class="lurus-faq-item">
<summary>How do I change my password?</summary>

Log in to [identity.lurus.cn](https://identity.lurus.cn) → Account Settings → Security → Change Password.

</details>

<details class="lurus-faq-item">
<summary>What if I forget my password?</summary>

Click "Forgot password" on the login page; a reset link will be sent to your registered email.

</details>

<details class="lurus-faq-item">
<summary>How do I delete my account?</summary>

Contact [support@lurus.cn](mailto:support@lurus.cn) to close your account. All data (API keys / Lubei / transaction records) is permanently deleted and cannot be recovered.

</details>

<details class="lurus-faq-item">
<summary>Which third-party logins are supported?</summary>

GitHub and Google OAuth — link / unlink them in Account Settings.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> Subscription & Billing</span>
  <h2 class="lurus-section-head__title">Subscription & Billing</h2>
</div>

<details class="lurus-faq-item">
<summary>How do I upgrade / downgrade my plan?</summary>

Log in to [identity.lurus.cn](https://identity.lurus.cn) → Subscription Management → "Change Plan": both upgrades and downgrades take effect immediately, and the difference for the remaining days is charged to or refunded to your wallet. You can’t switch directly between monthly and annual billing.

</details>

<details class="lurus-faq-item">
<summary>What happens when my subscription expires?</summary>

After expiry there is a 3-day grace period, after which you return to Free. Your API keys remain valid but are subject to Free-tier quotas; your data is retained and is restored whenever you renew.

</details>

<details class="lurus-faq-item">
<summary>What’s the difference between annual and monthly billing?</summary>

The annual total costs less than 12 months of monthly billing; see the console for exact prices. You can’t switch directly between annual and monthly billing.

</details>

<details class="lurus-faq-item">
<summary>How does the Enterprise plan add team members?</summary>

Admin Console → Team → Invite Member → enter an email and send the invitation → the member accepts and joins → you can assign each member a dedicated API key and quota.

</details>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Want the full quota and pricing rules?</p>
    <div class="lurus-callout__body">See <a href="/en/platform/billing">Billing Details</a>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> Lubei</span>
  <h2 class="lurus-section-head__title">Lubei</h2>
</div>

<details class="lurus-faq-item">
<summary>What is Lubei used for?</summary>

Paying usage-based charges across all products (such as API calls beyond your subscription quota); it can also be used to purchase subscriptions. 1 Lubei = 1 CNY.

</details>

<details class="lurus-faq-item">
<summary>Does Lubei expire?</summary>

Topped-up balance never expires; credit granted in promotions may have an expiration date, subject to the rules of the promotion.

</details>

<details class="lurus-faq-item">
<summary>Can Lubei be withdrawn?</summary>

No, it can’t be withdrawn. A top-up that hasn’t been used can be refunded as a whole order within 7 days of payment.

</details>

<details class="lurus-faq-item">
<summary>How do I check my balance and transaction history?</summary>

Log in to [identity.lurus.cn](https://identity.lurus.cn) → Wallet to view your current balance, income details (top-ups / rewards / strategy income), and spending details (API consumption / strategy subscriptions).

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> Payment</span>
  <h2 class="lurus-section-head__title">Payment</h2>
</div>

Payment methods:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="receipt" :size="20" /></span>
    <div class="lurus-card__title">Stripe</div>
    <p class="lurus-card__body">Credit / debit card, worldwide</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">Creem</div>
    <p class="lurus-card__body">Cryptocurrency</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="wallet" :size="20" /></span>
    <div class="lurus-card__title">Epay</div>
    <p class="lurus-card__body">Alipay / WeChat Pay, mainland China</p>
  </div>
</div>

<details class="lurus-faq-item">
<summary>What if my payment hasn’t arrived?</summary>

It is usually confirmed within 1 minute; if it hasn’t arrived after 5 minutes, check whether the payment platform charged you, look for a confirmation email, and contact [support@lurus.cn](mailto:support@lurus.cn) with your payment order number.

</details>

<details class="lurus-faq-item">
<summary>How do I request an invoice?</summary>

You can request an invoice for each paid order in the console by entering the invoice title and tax ID; it is issued manually and can then be downloaded.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Security</span>
  <h2 class="lurus-section-head__title">Security</h2>
</div>

<details class="lurus-faq-item">
<summary>Is my data secure?</summary>

HTTPS throughout (TLS 1.3); passwords stored with bcrypt encryption; payments handled by PCI DSS-compliant third parties; API call content is not stored (only metadata is recorded for billing).

</details>

<details class="lurus-faq-item">
<summary>What do I do if my API key is stolen?</summary>

Immediately disable the key in the console → create a new key → review the call logs to confirm any unusual usage → contact support to resolve any unexpected charges.

</details>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Didn’t find your answer?</p>
    <div class="lurus-callout__body">Please contact <a href="mailto:support@lurus.cn">support@lurus.cn</a>.</div>
  </div>
</div>

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Platform Overview', link: '/en/platform/', primary: true },
    { text: 'Billing Details', link: '/en/platform/billing' },
    { text: 'Get an API Key', link: '/en/guide/get-api-key' },
  ]"
/>

</div>
