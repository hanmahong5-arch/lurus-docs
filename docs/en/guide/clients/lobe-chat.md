---
title: Lobe Chat Setup
description: Configure the Lurus API as a model provider in Lobe Chat.
---

<div class="lobe-page">

# Lobe Chat Setup

[Lobe Chat](https://lobehub.com) is a modern open-source AI chat application. This page covers two approaches: one-click online setup and manual setup.

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">Before you begin</p>
<div class="lurus-callout__body">Have a Lurus <Term t="API Key">API Key</Term> ready. Don't have one yet? Head to <a href="/en/guide/get-api-key">Get an API Key</a>.</div>
</div>
</div>

## Online Setup

Click the link below to configure it directly:

```
https://chat-preview.lobehub.com/?settings={"keyVaults":{"openai":{"apiKey":"YOUR_API_KEY","baseURL":"https://api.lurus.cn/v1"}}}
```

Replace `YOUR_API_KEY` with your API Key.

## Manual Setup

<ol class="lurus-steps">
<li>

Open Lobe Chat **Settings**.

</li>
<li>

Select **Language Model**.

</li>
<li>

In the OpenAI configuration, fill in:

- **API Key**: Enter your Lurus API Key
- **API Proxy**: `https://api.lurus.cn/v1`

</li>
<li>

**Save** the settings.

</li>
</ol>

## Usage Tips

<div class="lurus-callout lurus-callout--tip">
<span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
<div>
<p class="lurus-callout__title">Tip</p>
<div class="lurus-callout__body"><ul><li>Lobe Chat uses OpenAI model names by default, so you'll need to switch manually in the conversation</li><li>We recommend <code>deepseek-chat</code> for the best value for money</li></ul></div>
</div>
</div>

<NextSteps title="Next Steps" :steps="[
  { text: 'Browse supported models', link: '/guide/models' },
  { text: 'Get an API Key', link: '/en/guide/get-api-key' },
  { text: 'See the API quickstart', link: '/en/guide/quickstart' }
]" />

</div>

<style scoped>
.lobe-page .lurus-steps { margin-top: 1rem; }
</style>
