---
title: Get an API Key
description: Complete steps for registering a Lurus account and obtaining an API Key.
---

<div class="getkey-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> Get an API Key</span>
  <h1 class="lurus-section-head__title">Register an account and create your first Key</h1>
  <p class="lurus-section-head__lede">Get a working API Key in 3 minutes.</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">OIDC / OAuth integration</p>
    <div class="lurus-callout__body">To let end users sign in to your own app with a Lurus account, or to have your backend call with a Service User + JWT Profile, you can switch to unified identity authentication: <a href="/en/platform/auth/oidc">OIDC / OAuth2 integration</a> · <a href="/en/platform/auth/api-auth">API authentication (PAT/JWT)</a>. API Keys and OIDC Tokens coexist — both remain valid.</div>
  </div>
</div>

## Register and create a Key

<ol class="lurus-steps">
<li>

Go to the [Lurus console](https://api.lurus.cn) → "Sign up" → enter your email and password → complete email verification.

</li>
<li>

Sign in → "Token Management" in the left sidebar → "Create New Token" → enter a token name (for easy identification) → confirm.

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Shown only once</p>
    <div class="lurus-callout__body">Copy and save your API Key immediately after creation — it is <strong>shown only once</strong>!</div>
  </div>
</div>

## API Key format

Starts with `sk-`, followed by 48 random characters: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

## Manage API Keys

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="bar-chart-3" :size="22" /></span>
    <div class="lurus-card__title">View usage</div>
    <p class="lurus-card__body">The "Token Management" page shows each Key’s used quota, remaining quota, and most recent call time.</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="lock" :size="22" /></span>
    <div class="lurus-card__title">Disable / delete</div>
    <p class="lurus-card__body">Disable = suspend access (reversible); delete = permanently remove (irreversible).</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="filter" :size="22" /></span>
    <div class="lurus-card__title">Set model permissions</div>
    <p class="lurus-card__body">Click "Edit" next to the Key → "Available Models" to select the allowed models → save.</p>
  </div>
</div>

## Security recommendations

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Treat your Key like a password</p>
    <div class="lurus-callout__body">Never leak it (do not commit it to public repositories); rotate your Key every 90 days; apply least privilege (grant only the models you need); review call logs regularly and act promptly on anomalies.</div>
  </div>
</div>

## FAQ

<details class="lurus-faq-item">
<summary>What if I forgot my Key?</summary>

It cannot be recovered — create a new Key.

</details>

<details class="lurus-faq-item">
<summary>My Key was compromised?</summary>

Disable or delete the Key immediately and create a new one.

</details>

<details class="lurus-faq-item">
<summary>Out of quota?</summary>

Top up or upgrade your plan yourself — first check the tiers (Free / Basic / Pro) in [Billing details](/en/platform/billing), then top up or upgrade in the [console](https://api.lurus.cn).

</details>

<NextSteps
  title="Next steps"
  :steps="[
    { text: 'Quickstart', link: '/en/guide/quickstart', primary: true },
    { text: 'Supported models', link: '/guide/models' },
    { text: 'Billing details', link: '/en/platform/billing' },
  ]"
/>

</div>
