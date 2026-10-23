---
title: Platform FAQ
description: Common questions and answers about Lurus platform accounts, billing, and services.
---

<div class="faq-page">

# FAQ

Frequently asked questions about platform accounts, subscription billing, wallet, and security, grouped by topic.

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

Contact [support@lurus.cn](mailto:support@lurus.cn) to close your account. All data (API keys / wallet balance / transaction records) is permanently deleted and cannot be recovered.

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

Log in to [identity.lurus.cn](https://identity.lurus.cn) → Subscription Management → "Change Plan": upgrades take effect immediately with a prorated charge for the difference; downgrades take effect in the next billing cycle.

</details>

<details class="lurus-faq-item">
<summary>What happens when my subscription expires?</summary>

It is automatically downgraded to Free. Your API keys remain valid but are subject to Free-tier quotas; your data is retained and is restored when you renew.

</details>

<details class="lurus-faq-item">
<summary>How does the Enterprise plan add team members?</summary>

Admin Console → Team → Invite Member → enter an email and send the invitation → the member accepts and joins → you can assign each member a dedicated API key and quota.

</details>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Want the full quota and pricing rules?</p>
    <div class="lurus-callout__body">See <a href="/en/platform/billing">Billing Explained</a>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> Wallet</span>
  <h2 class="lurus-section-head__title">Wallet</h2>
</div>

<details class="lurus-faq-item">
<summary>How do I check my balance and transaction history?</summary>

Log in to [identity.lurus.cn](https://identity.lurus.cn) → Wallet to view your current balance and transaction history.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> Payment</span>
  <h2 class="lurus-section-head__title">Payment</h2>
</div>

Available payment channels are shown on the checkout page; enterprise customers can pay by contract and corporate bank transfer.

<details class="lurus-faq-item">
<summary>What if my payment hasn’t arrived?</summary>

It is usually confirmed within 1 minute; if it hasn’t arrived after 5 minutes, check whether the payment platform charged you, look for a confirmation email, and contact [support@lurus.cn](mailto:support@lurus.cn) with your payment order number.

</details>

<details class="lurus-faq-item">
<summary>How do I request an invoice?</summary>

Admin Console → Billing → Request Invoice (standard / special VAT invoice); it is usually emailed within one business day.

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
    { text: 'Billing Explained', link: '/en/platform/billing' },
    { text: 'Get an API Key', link: '/en/guide/get-api-key' },
  ]"
/>

</div>
