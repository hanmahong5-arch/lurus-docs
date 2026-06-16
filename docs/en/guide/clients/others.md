---
title: Other Clients
description: Configure the Lurus API in any other OpenAI-compatible client.
---

<div class="others-page">

# Other Clients

Any client that supports the OpenAI API can use the Lurus API. Below are the common configuration parameters, a list of popular clients, and ready-to-copy configuration examples.

## Common Configuration

Just enter these two values into your client’s OpenAI-compatible settings:

| Setting | Value |
|--------|-----|
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | `sk-your-api-key` |

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">Don’t have a Key yet?</p>
<div class="lurus-callout__body">Go to <a href="/en/guide/get-api-key">Get an API Key</a>. You can look up model names in <a href="/guide/models">Supported Models</a>.</div>
</div>
</div>

## Supported Clients

<div class="lurus-h3">Desktop Apps</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/en/guide/clients/cherry-studio">
<span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
<div class="lurus-card__title">Cherry Studio</div>
<p class="lurus-card__body">Cross-platform, feature-rich</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">ChatBox</div>
<p class="lurus-card__body">Clean and easy to use</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">BetterChatGPT</div>
<p class="lurus-card__body">Open source and free</p>
</div>
</div>

<div class="lurus-h3">Mobile Apps</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/en/guide/clients/opencat">
<span class="lurus-card__icon"><Icon name="smartphone" :size="20" /></span>
<div class="lurus-card__title">OpenCat</div>
<p class="lurus-card__body">iOS / macOS</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="smartphone" :size="20" /></span>
<div class="lurus-card__title">ChatGPT Next Web</div>
<p class="lurus-card__body">PWA</p>
</div>
</div>

<div class="lurus-h3">Web Apps</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/en/guide/clients/lobe-chat">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">Lobe Chat</div>
<p class="lurus-card__body">Modern open-source chat UI</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">ChatGPT Web</div>
<p class="lurus-card__body">Browser-based</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="server" :size="20" /></span>
<div class="lurus-card__title">Open WebUI</div>
<p class="lurus-card__body">Self-hosted</p>
</div>
</div>

<div class="lurus-h3">IDE Plugins</div>

<div class="lurus-cards lurus-cards--compact">
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Continue</div>
<p class="lurus-card__body">VS Code</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Codeium</div>
<p class="lurus-card__body">IDE completion</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Cursor</div>
<p class="lurus-card__body">AI editor</p>
</div>
</div>

<div class="lurus-h3">Command-Line Tools</div>

<div class="lurus-cards lurus-cards--compact">
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">llm-cli</div>
<p class="lurus-card__body">Terminal access</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">aichat</div>
<p class="lurus-card__body">Terminal access</p>
</div>
</div>

## Configuration Examples

### Cursor

<ol class="lurus-steps">
<li>

Open **Settings → OpenAI API**.

</li>
<li>

**API Key**: enter your Lurus Key.

</li>
<li>

**Base URL**: `https://api.lurus.cn/v1`.

</li>
</ol>

### Continue (VS Code)

Edit `~/.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Lurus DeepSeek",
      "provider": "openai",
      "model": "deepseek-chat",
      "apiBase": "https://api.lurus.cn/v1",
      "apiKey": "sk-your-api-key"
    }
  ]
}
```

## Unsupported Features

Some client-specific features may not be fully compatible:

<div class="lurus-callout lurus-callout--warn">
<span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
<div>
<p class="lurus-callout__title">Compatibility Note</p>
<div class="lurus-callout__body"><ul><li>Real-time voice conversation</li><li>Image editing</li><li>Vendor-specific proprietary APIs</li></ul><p>If you run into issues, please contact technical support.</p></div>
</div>
</div>

<NextSteps title="Next Steps" :steps="[
  { text: 'Browse supported models', link: '/guide/models' },
  { text: 'Get an API Key', link: '/en/guide/get-api-key' },
  { text: 'See the API quickstart', link: '/en/guide/quickstart' }
]" />

</div>

<style scoped>
.others-page .lurus-h3 { margin-top: 1.6rem; }
.others-page .lurus-steps { margin-top: 1rem; }
</style>
