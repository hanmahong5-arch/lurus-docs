---
title: Lurus Platform — Accounts & Billing
description: Lurus unified account system, subscription plans, Lubei wallet, and billing system overview.
---

<div class="platform-page">

<ProductHero product-id="platform" />

## Overview

**Lurus Platform** is the unified account and billing infrastructure shared across all Lurus products. Whether you use Lurus API, Lucrum, Switch, or any other product, you sign in with the same Lurus account and share the same wallet balance and subscription plan.

<CapabilityGrid
  accent="var(--lurus-color-platform)"
  title="The Four Pillars of the Platform"
  :items="[
    { title: 'Unified Account', body: 'One identity, balance, and subscription shared across every Lurus product', icon: 'user-check' },
    { title: 'Lubei Wallet', body: 'Unified billing unit, usage-based deduction, real-time balance lookup', icon: 'coins' },
    { title: 'Subscription Plans', body: 'Free quota + pay-as-you-go + enterprise packages', icon: 'package-2' },
    { title: 'VIP Tiers', body: 'Spend more to unlock exclusive models and support', icon: 'crown' },
  ]"
/>

---

## Unified Account

Visit any Lurus product ([api.lurus.cn](https://api.lurus.cn), [lucrum.lurus.cn](https://lucrum.lurus.cn), etc.) to register or sign in. **Sign-in methods**: email + password, GitHub (OAuth), Google (OAuth).

A successful registration gives you:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">Unified User Identity</div>
    <p class="lurus-card__body">One account works across all products</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">5 Lubei to Start</div>
    <p class="lurus-card__body">Granted on first registration, ready to use immediately</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <div class="lurus-card__title">Free Quota</div>
    <p class="lurus-card__body">Try Lurus API right after registering</p>
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

Once you exceed the quota included in your subscription, charges are automatically deducted from your Lubei wallet. Unit prices vary by model; refer to the console for current rates.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Want full pricing, quota rules, and exchange ratios?</p>
    <div class="lurus-callout__body"><a href="/en/platform/billing">Billing Details</a> breaks down subscription plan comparisons, quota calculation, Lubei exchange ratios, and the refund policy.</div>
  </div>
</div>

---

## Lubei Wallet {#wallet}

**Lubei (LB)** is the universal credit currency of the Lurus platform, used to pay for all overage usage.

### Earning Lubei

| Source | Reward | Notes |
|------|------|------|
| **New user registration** | 5 LB | Granted on first registration |
| **First top-up** | 10 LB bonus | Extra bonus on your first top-up |
| **First subscription** | 30 LB bonus | First subscription to any paid plan |
| **Subscription renewal** | Top-up amount x 5% | Rebate on the first 6 renewals |
| **Daily check-in** | Random LB | Claimed via daily check-in |
| **Refer a friend** | Referral reward | Both parties earn after the friend registers |
| **Strategy income** | Revenue-share settlement | Income from Lucrum strategy subscriptions |
| **Direct purchase** | Exchanged at a set ratio | Buy Lubei directly |

### Spending Lubei

Usable for: paying for API calls beyond your subscription quota, subscribing to paid Lucrum strategies, and purchasing premium features / expansion packs.

### VIP Levels

Accumulated Lubei spending unlocks multiple VIP tiers, with discounts automatically applied to all Lubei spending.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">Standard</span><span class="lurus-stat__label">Entry</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Silver</span><span class="lurus-stat__label">Silver</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Gold</span><span class="lurus-stat__label">Gold</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Platinum</span><span class="lurus-stat__label">Platinum</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Diamond</span><span class="lurus-stat__label">Diamond</span></div>
</div>

Thresholds and discounts are detailed on the VIP page of the [identity.lurus.cn](https://identity.lurus.cn) account center.

---

## Payment Methods

All payments are confirmed asynchronously via secure webhooks to avoid duplicate charges from network fluctuations.

| Method | Use Case | Notes |
|------|----------|------|
| **Stripe** | Subscription + top-up | Credit/debit cards (Visa, Mastercard) |
| **Creem** | Top-up | Cryptocurrency payments |
| **Epay** | Top-up | Alipay / WeChat Pay (third-party) |

---

## Referral Program

Copy your exclusive referral link (including your referral code) at [identity.lurus.cn](https://identity.lurus.cn) and share it with friends. Rewards: when a friend registers via your link, both parties earn Lubei; when a friend makes their first paid subscription, you earn an additional rebate of a set percentage of the subscription amount; there is no limit on invitations.

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
    { text: 'Billing Details', link: '/en/platform/billing' },
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
