---
title: Lurus Platform — Accounts & Billing
description: Lurus unified account system, subscription plans, account wallet, and billing system overview.
---

<div class="platform-page">

<ProductHero product-id="platform" />

## Overview

**Lurus Platform** is the unified account and billing infrastructure shared across all Lurus products. Whether you use Lurus API, Lucrum, Switch, or any other product, you sign in with the same Lurus account and share the same wallet balance and subscription plan.

<CapabilityGrid
  accent="var(--lurus-color-platform)"
  title="Platform Foundations"
  :items="[
    { title: 'Unified Account', body: 'One identity, balance, and subscription shared across every Lurus product', icon: 'user-check' },
    { title: 'Account Wallet', body: 'Records balance and transactions for usage-based deduction', icon: 'coins' },
    { title: 'Subscription Plans', body: 'Individual subscriptions or enterprise contracts', icon: 'package-2' },
  ]"
/>

---

## Unified Account

Visit any Lurus product ([hub.lurus.cn](https://hub.lurus.cn), [lucrum.lurus.cn](https://lucrum.lurus.cn), etc.) to register or sign in. **Sign-in methods**: email + password, GitHub (OAuth), Google (OAuth).

A successful registration gives you:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">Unified User Identity</div>
    <p class="lurus-card__body">One account works across all products</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">@lurus.cn Mailbox</div>
    <p class="lurus-card__body">Automatically provisions <code>username@lurus.cn</code> (powered by Stalwart)</p>
  </div>
</div>

**Account management** (sign in to [identity.lurus.cn](https://identity.lurus.cn) → Account Settings): personal info, sign-in history, third-party bindings, security settings (change password, two-factor authentication).

**Sign in once, access everything**: built on the OIDC standard, signing in to any product establishes a session across all products; supports Passkey/WebAuthn passwordless login, TOTP/hardware-key MFA, and GitHub/Google social login, while enterprises can integrate Azure AD / Feishu / Okta SSO. End users use a single account across API/Lucrum/Switch/Creator/Lutu; developers integrate their own apps with the OIDC SDK, and backends use a Service User + JWT Profile; enterprise organization management (members/permissions/audit) is handled via [identity.lurus.cn](https://identity.lurus.cn) (Casdoor console) or by contacting our sales team.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Dive Deeper into Identity & Authentication</p>
    <div class="lurus-callout__body"><a href="/en/platform/auth/">Unified Identity & Authentication</a> · <a href="/en/platform/auth/oidc">OIDC / OAuth2 Integration</a> · <a href="/en/platform/auth/api-auth">API Authentication</a></div>
  </div>
</div>

---

## Billing System

Lurus uses a dual-track "subscription + usage" billing model that flexibly adapts to different usage levels.

### Subscription Plans

| Plan | Positioning | Best For |
|------|------|------|
| **Free** | Basic quota, free to use | Personal trial |
| **Basic** | Entry-level monthly subscription | Individual developers |
| **Pro** | Advanced monthly subscription + priority models | Power users |
| **Pro Annual** | Pro annual discount | Stable users |
| **Enterprise** | Enterprise customization + SLA | Teams / enterprises |

Exact pricing is determined by the [identity.lurus.cn](https://identity.lurus.cn) console (Subscription Management page).

### Usage-Based Billing

Once you exceed the quota included in your subscription, charges are deducted from your account wallet balance. Unit prices vary by model; refer to the console for current rates.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Billing methods and refunds</p>
    <div class="lurus-callout__body"><a href="/en/platform/billing">Billing Explained</a> covers the current billing methods, what happens when your balance runs out, invoices, and refunds.</div>
  </div>
</div>

---

## Account Wallet {#wallet}

The account wallet records your balance and transactions and is used to pay for usage beyond your subscription quota. Balance, transaction history, and top-up are available in the [identity.lurus.cn](https://identity.lurus.cn) account center. Prices, bonuses, and discount rules are shown in the console; this documentation does not list specific figures.

---

## Payment Methods

All payments are confirmed asynchronously via webhooks to avoid duplicate charges from network fluctuations. Available payment channels are shown on the checkout page; enterprise customers can pay by contract and corporate bank transfer.

---

## Notification Service

Multi-channel notifications (you can customize the delivery channel for each notification type in Account Settings):

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">In-App Messages</div>
    <p class="lurus-card__body">Account changes / security alerts / system announcements</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">Email</div>
    <p class="lurus-card__body">Payment confirmations / quota alerts / subscription expiry</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">WebSocket</div>
    <p class="lurus-card__body">Real-time push for API errors / insufficient balance</p>
  </div>
</div>

---

## Data Security

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Enterprise-Grade Authentication</div>
    <p class="lurus-card__body">Built on the <Term t="OIDC">OIDC</Term> standard system</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">Site-Wide HTTPS</div>
    <p class="lurus-card__body">TLS 1.3 encryption end to end</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">No Plaintext Passwords</div>
    <p class="lurus-card__body">Stored with bcrypt encryption</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="receipt" :size="20" /></span>
    <div class="lurus-card__title">Compliant Payment Gateway</div>
    <p class="lurus-card__body">Payments processed by PCI DSS-compliant third parties</p>
  </div>
</div>

User data is strictly isolated and never shared.

---

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Identity & Authentication (Casdoor)', link: '/en/platform/auth/', primary: true },
    { text: 'Billing Explained', link: '/en/platform/billing' },
    { text: 'FAQ', link: '/en/platform/faq' },
    { text: 'Get an API Key', link: '/en/guide/get-api-key' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="platform" />

</div>

<style>
.platform-page .lurus-card code {
  font-size: 0.85em;
}
</style>
