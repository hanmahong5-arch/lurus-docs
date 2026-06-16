---
title: Lurus API FAQ
description: Common questions and answers for using the Lurus API, including billing, compatibility, and troubleshooting.
---

<div class="faq-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> FAQ</span>
  <h1 class="lurus-section-head__title">Frequently Asked Questions</h1>
  <p class="lurus-section-head__lede">Accounts, models, billing, troubleshooting — expand by topic.</p>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Accounts & Authentication</span>
  <h2 class="lurus-section-head__title">Accounts & Authentication</h2>
</div>

<details class="lurus-faq-item">
<summary>How do I sign up?</summary>

At [api.lurus.cn](https://api.lurus.cn), enter your email and password (or sign in with GitHub/Google) to automatically receive 5 Lubei + a free quota. All products share the same account.

</details>

<details class="lurus-faq-item">
<summary>Lost your API Key?</summary>

It is shown only once and cannot be recovered. In the console, delete the old one and create a new one. Store it in a password manager or environment variable — never hardcode it. Each account can create multiple Keys; assigning a separate Key per project is more secure.

</details>

<details class="lurus-faq-item">
<summary>How do I troubleshoot an invalid Key?</summary>

- Key is complete (starts with `sk-` and has no missing characters)
- Status is "enabled" (console → Token Management)
- Request header is `Authorization: Bearer sk-xxxx` (one space after Bearer)
- No extra spaces or line breaks (copy it again)
- Environment variable name is spelled correctly and is loaded

Still getting `401`? Work through the checklist item by item — see [Troubleshooting · invalid_api_key](/en/guide/troubleshooting#invalid-api-key).

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Models & Requests</span>
  <h2 class="lurus-section-head__title">Models & Requests</h2>
</div>

<details class="lurus-faq-item">
<summary>Which models are supported?</summary>

OpenAI, Claude, Gemini, DeepSeek, and more — see the [model list](/guide/models).

</details>

<details class="lurus-faq-item">
<summary>Returns <code>"no available server"</code></summary>

Check the model name; confirm the Key has permission for that model; the model may currently have no available channel — contact an administrator.

</details>

<details class="lurus-faq-item">
<summary>How do I switch models?</summary>

Just change the `model` parameter; leave everything else unchanged.

</details>

<details class="lurus-faq-item">
<summary>How do I enable streaming responses?</summary>

Set `"stream": true`, and the response is returned chunk by chunk over SSE.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> Billing & Quota</span>
  <h2 class="lurus-section-head__title">Billing & Quota</h2>
</div>

<details class="lurus-faq-item">
<summary>How do I check my usage?</summary>

In the console, see "Dashboard" or "Usage Logs".

</details>

<details class="lurus-faq-item">
<summary>Out of quota?</summary>

Contact an administrator to top up or upgrade your plan.

</details>

<details class="lurus-faq-item">
<summary>Where can I see model pricing?</summary>

See the pricing in the [model list](/guide/models).

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="alert-circle" :size="14" /> Technical Issues</span>
  <h2 class="lurus-section-head__title">Technical Issues</h2>
</div>

<details class="lurus-faq-item">
<summary>What should I do about request timeouts?</summary>

1. Check the network (`curl https://api.lurus.cn/v1/models`)
2. Reduce `max_tokens`
3. Reasoning models (`deepseek-reasoner`) take longer to think — this is normal
4. The SDK default timeout is about 60 seconds; you can increase `timeout`
5. Persistent timeouts may indicate an upstream failure — switch models

</details>

<details class="lurus-faq-item">
<summary>429 error (<Term t="Rate Limit">Rate Limit</Term> exceeded)</summary>

Lower the request rate + retry with exponential backoff (see [Error Handling](/en/api/errors)); Free defaults to 60 RPM, upgrade to Pro/Team to raise the limit; if you still hit it frequently on a paid plan, contact support@lurus.cn.

</details>

<details class="lurus-faq-item">
<summary>Context limit exceeded (e.g. <code>deepseek-chat</code> 64K, <code>gemini-3-pro-preview</code> 1M)</summary>

- Reduce input by trimming history
- Sliding window (keep the system message + the most recent N turns)
- Switch to a longer-context model
- Summarize very long documents before passing them in

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Other Questions</span>
  <h2 class="lurus-section-head__title">Other Questions</h2>
</div>

<details class="lurus-faq-item">
<summary>Is my data secure?</summary>

HTTPS end to end; conversation content is not stored; only call metadata is recorded for billing.

</details>

<details class="lurus-faq-item">
<summary>Is there an SLA guarantee?</summary>

Enterprise customers can sign an SLA — contact sales.

</details>

<details class="lurus-faq-item">
<summary>What are the technical support channels?</summary>

support@lurus.cn / GitHub Issues.

</details>

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">Didn't find your answer?</p>
    <p class="lurus-cta__text">Send us your question and we'll reply within a business day.</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="mailto:support@lurus.cn">Contact us →</a>
  </div>
</div>

</div>
