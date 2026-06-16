---
title: Troubleshooting
description: One page to pinpoint high-frequency issues across all Lurus products — 401 / no channel for model / 429 / insufficient quota / context length exceeded / timeouts, with error codes and resolution paths.
---

<div class="troubleshooting-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Troubleshooting</span>
  <h1 class="lurus-section-head__title">Hit a problem? Start here</h1>
  <p class="lurus-section-head__lede">First locate where to go by symptom, then expand the high-frequency issues below to check them off. No duplicated content — this only points you to the authoritative page.</p>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/en/api/errors">
    <span class="lurus-card__icon"><Icon name="alert-circle" :size="22" /></span>
    <div class="lurus-card__title">API errors (4xx / 5xx)</div>
    <p class="lurus-card__body">Complete error codes, response structure, and retry strategy — 401 / 402 / 404 / 429 / 5xx at a glance.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/en/guide/faq">
    <span class="lurus-card__icon"><Icon name="key-round" :size="22" /></span>
    <div class="lurus-card__title">Account, Key & authentication</div>
    <p class="lurus-card__body">Sign-up, lost API Key, troubleshooting an invalid Key, and common issues with models and streaming calls.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/en/platform/billing">
    <span class="lurus-card__icon"><Icon name="wallet" :size="22" /></span>
    <div class="lurus-card__title">Billing & quota</div>
    <p class="lurus-card__body">Free allowance, subscription plans, 鹿贝 deduction rules, and what to do after quota runs out.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/en/guide/clients/others">
    <span class="lurus-card__icon"><Icon name="plug" :size="22" /></span>
    <div class="lurus-card__title">Client can’t connect</div>
    <p class="lurus-card__body">Integration and troubleshooting for third-party clients such as Cherry Studio / Lobe Chat / OpenCat.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/en/platform/faq">
    <span class="lurus-card__icon"><Icon name="layers" :size="22" /></span>
    <div class="lurus-card__title">Product-specific issues</div>
    <p class="lurus-card__body">Platform, MemX, Lucrum, and other products each have their own FAQ — check the FAQ page in the corresponding product docs first.</p>
  </a>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> Common symptoms</span>
  <h2 class="lurus-section-head__title">Troubleshoot by error</h2>
  <p class="lurus-section-head__lede">Expand the error you ran into and follow the checklist. For detailed error codes, see <a href="/en/api/errors">Error handling</a>.</p>
</div>

<details class="lurus-faq-item" id="invalid-api-key">
<summary>Returns <code>401 Unauthorized</code> / <code>invalid_api_key</code></summary>

```json
{ "error": { "code": "invalid_api_key", "type": "authentication_error" } }
```

`authentication_error` means the Key is invalid or missing. Check each item:

- The Key is complete, starts with `sk-`, and has no extra spaces or line breaks (copy it again)
- Request header format `Authorization: Bearer sk-xxxx` (one space after `Bearer`)
- The Key status is "Enabled" (Console → Token management)
- The environment variable name is spelled correctly and has been loaded

**Do not retry** a 401 — fix the Key first, then send again. See [Authentication](/en/api/authentication) and [FAQ: How to troubleshoot an invalid Key](/en/guide/faq).

</details>

<details class="lurus-faq-item">
<summary>Returns <code>"no available server"</code> / <code>model_not_found</code> (HTTP 404)</summary>

```json
{ "error": { "code": "model_not_found", "message": "模型 xxx 无可用渠道", "type": "new_api_error" } }
```

- Check the spelling of the `model` name (case-sensitive)
- Confirm this Key has permission to access the model
- This model may currently have no available channel
- If you just created the Key, wait about 10 seconds and try again

For the list of available models, see [Supported models](/guide/models).

</details>

<details class="lurus-faq-item">
<summary>Returns <code>429 Too Many Requests</code> / <code>rate_limit_exceeded</code></summary>

```json
{ "error": { "code": "rate_limit_exceeded", "type": "rate_limit_error" } }
```

Rate limit exceeded. How to handle it:

- Lower the request rate and retry with **exponential backoff** of `2 ** attempt` seconds
- Free defaults to 60 RPM; upgrade to Pro / Team to raise the limit
- If you still hit it frequently after paying, contact <a href="mailto:support@lurus.cn">support@lurus.cn</a>

For retry code examples, see [Error handling · Best practices](/en/api/errors#error-handling-best-practices).

</details>

<details class="lurus-faq-item" id="insufficient-quota">
<summary>Returns <code>402</code> / <code>insufficient_quota</code> (quota / balance insufficient)</summary>

```json
{ "error": { "code": "insufficient_quota", "type": "billing_error" } }
```

- First confirm whether you’ve used up today’s free quota (Free plan: 100 calls/day)
- Check your 鹿贝 balance: [identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)
- Top up yourself or upgrade your plan; for the rules, see [Billing](/en/platform/billing)

</details>

<details class="lurus-faq-item">
<summary><code>context_length_exceeded</code> (context length exceeded)</summary>

```json
{ "error": { "code": "context_length_exceeded", "type": "invalid_request_error" } }
```

For example `deepseek-chat` is 64K and `gemini-3-pro-preview` is 1M; when you exceed the model’s limit:

- Reduce the input and trim history messages
- Use a sliding window (keep system + the most recent N turns)
- Switch to a model with a longer context

</details>

<details class="lurus-faq-item">
<summary>Request times out / no response for a long time</summary>

1. Check network connectivity: `curl https://api.lurus.cn/v1/models`
2. Reduce `max_tokens`
3. Reasoning models (`deepseek-reasoner`) take a long time to think, which is normal
4. The SDK’s default timeout is about 60 seconds; you can increase `timeout`
5. Persistent timeouts may be an upstream failure — try another model

</details>

---

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Didn’t find it? Contact support@lurus.cn</p>
    <div class="lurus-callout__body">Please include: the full error message, the request ID (response header <code>X-Request-ID</code>), the time it occurred, and reproduction steps, so we can locate it quickly.</div>
  </div>
</div>

<NextSteps
  title="Related docs"
  :steps="[
    { text: 'Error handling (complete error codes)', link: '/en/api/errors', primary: true },
    { text: 'FAQ', link: '/en/guide/faq' },
    { text: 'Billing', link: '/en/platform/billing' },
  ]"
/>

</div>
