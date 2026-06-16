---
title: OpenCat Setup
description: Configure the Lurus API in the OpenCat iOS/macOS client.
---

<div class="opencat-page">

# OpenCat Setup

[OpenCat](https://opencat.app) is a native AI chat app for iOS / macOS with a clean interface and support for custom APIs. This page covers both one-click setup via URL Scheme and manual configuration.

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">Before you start</p>
<div class="lurus-callout__body">Have a Lurus <Term t="API Key">API Key</Term> ready (format <code>sk-xxxxxxxxxxxxxxxx</code>). Don't have one yet? Head to <a href="/en/guide/get-api-key">Get an API Key</a>.</div>
</div>
</div>

## Quick Setup (URL Scheme)

Tap the link below in a browser or notes app to jump straight to OpenCat with the configuration filled in automatically:

```
opencat://team/join?domain=https://api.lurus.cn&token=YOUR_API_KEY
```

Replace `YOUR_API_KEY` with your own key (`sk-xxxxxxxxxxxxxxxx`) and open it in Safari.

<div class="lurus-callout lurus-callout--tip">
<span class="lurus-callout__icon"><Icon name="smartphone" :size="18" /></span>
<div>
<p class="lurus-callout__title">iOS Shortcut (recommended)</p>
<div class="lurus-callout__body">In the iOS Shortcuts app, create an "Open URL" action, paste the address above with your key filled in, and save it to your home screen — so you can complete the setup in one tap the next time you switch devices.</div>
</div>
</div>

---

## Manual Configuration

If the URL Scheme doesn't work (older versions of OpenCat don't support it), configure it manually:

<ol class="lurus-steps">
<li>

Open OpenCat → **Settings** (avatar in the top-right corner) → **API Settings**.

</li>
<li>

Choose "**Custom API**" and fill in:

- **API Host**: `https://api.lurus.cn`
- **API Key**: your key (`sk-xxxxxxxxxxxxxxxx`)

</li>
<li>

Tap "**Test Connection**", and once it reports success, save.

</li>
</ol>

---

## Choosing a Model

OpenCat does not automatically fetch the model list — you need to enter the model name manually. Common models:

| Model Name | Strengths |
|---------|------|
| `deepseek-chat` | Great value, best for Chinese |
| `deepseek-reasoner` | Math and code reasoning |
| `gpt-4o` | Strongest all-round capability |
| `claude-3-5-sonnet` | Long text, creative writing |
| `gemini-3-pro-preview` | Multimodal, 1M context |

See the full list at [Supported Models](/guide/models).

---

## FAQ

<details class="lurus-faq-item">
<summary>Connection test fails with "Invalid key"</summary>

- Confirm the API Host has **no trailing slash** (`https://api.lurus.cn`, not `https://api.lurus.cn/`)
- Confirm the API Key format is correct (starts with `sk-`)
- In the [Lurus Console](https://api.lurus.cn), confirm the key's status is "Enabled"

</details>

<details class="lurus-faq-item">
<summary>No response after entering a model name</summary>

- Check the spelling of the model name (case-sensitive, e.g. `gpt-4o` not `GPT-4o`)
- Confirm your key has access to that model

</details>

<details class="lurus-faq-item">
<summary>Where is the configuration on the macOS version?</summary>

macOS entry point: menu bar **OpenCat** → **Preferences** (<span class="lurus-kbd">⌘,</span>) → **API** tab, with the same configuration parameters as the iOS version.

</details>

<NextSteps title="Next Steps" :steps="[
  { text: 'Browse supported models', link: '/guide/models' },
  { text: 'Get an API Key', link: '/en/guide/get-api-key' },
  { text: 'See the API quickstart', link: '/en/guide/quickstart' }
]" />

</div>

<style scoped>
.opencat-page .lurus-steps { margin-top: 1rem; }
</style>
