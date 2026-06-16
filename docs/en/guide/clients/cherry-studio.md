---
title: Cherry Studio Setup
description: Configure Lurus API in Cherry Studio and connect to 50+ AI models in one step.
---

<div class="cherry-page">

# Cherry Studio Setup

[Cherry Studio](https://cherry-ai.com) is an excellent cross-platform AI client that supports multiple model providers. This page walks you through connecting Lurus API in just a few minutes.

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">Before you start</p>
<div class="lurus-callout__body">Have a Lurus <Term t="API Key">API Key</Term> ready (format <code>sk-xxx</code>). Don't have one yet? Head to <a href="/en/guide/get-api-key">Get an API Key</a>.</div>
</div>
</div>

## Setup Steps

<ol class="lurus-steps">
<li>

Open Cherry Studio **Settings**.

</li>
<li>

Select **API Providers**.

</li>
<li>

Click **Add Custom Provider**.

</li>
<li>

Fill in the following:

| Field | Value |
|------|-----|
| Name | Lurus API |
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | Your API Key (`sk-xxx`) |

</li>
<li>

**Save** the configuration.

</li>
</ol>

## Quick Setup Link

Click the link below to quickly import the configuration:

```
cherrystudio://providers/api-keys?v=1&data={cherryConfig}
```

Replace `{cherryConfig}` with your configuration data.

## Choosing a Model

Once configured, select **Lurus API** as the provider in Cherry Studio to use all supported models. See the full list at [Supported Models](/guide/models).

## FAQ

<details class="lurus-faq-item">
<summary>Connection failed?</summary>

- Check that the API Key is correct
- Confirm your network connection is working
- Check that the Base URL is correct (`https://api.lurus.cn/v1`)

</details>

<details class="lurus-faq-item">
<summary>Model list is empty?</summary>

Try manually refreshing the model list in Settings, or manually enter a model name such as `deepseek-chat`.

</details>

<NextSteps title="Next Steps" :steps="[
  { text: 'Browse supported models', link: '/guide/models' },
  { text: 'Get an API Key', link: '/en/guide/get-api-key' },
  { text: 'See the API Quickstart', link: '/en/guide/quickstart' }
]" />

</div>

<style scoped>
.cherry-page .lurus-steps { margin-top: 1rem; }
</style>
