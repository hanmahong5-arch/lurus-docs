---
title: Switch User Guide
description: Day-to-day usage guide for the Switch desktop app, covering quick integration and advanced features.
---

<div class="switch-page">

# Switch User Guide <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> Getting started</span>
  <h2 class="lurus-section-head__title">Connect any OpenAI client to Switch</h2>
  <p class="lurus-section-head__lede">Once Switch starts, it exposes an OpenAI-compatible API endpoint locally. Change a single line of <code>base_url</code> and all requests are automatically routed by Switch.</p>
</div>

## Quick integration

Once Switch starts, it exposes an OpenAI-compatible API endpoint locally at `http://localhost:19090/v1` (the Switch gateway’s default port is 19090). Change your app’s/SDK’s `base_url` to this address and all requests are automatically routed by Switch. Set `api_key` to any value (such as `switch`); Switch uses the provider key from its configuration.

<ol class="lurus-steps">

<li>

Point the client’s `base_url` at the local Switch endpoint, set `api_key` to any value (such as `switch`), and make requests as usual:

::: code-group

```bash [cURL]
curl http://localhost:19090/v1/chat/completions \
  -H "Content-Type: application/json" -H "Authorization: Bearer switch" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}]}'
```

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:19090/v1",
    api_key="switch",
)
resp = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)
print(resp.choices[0].message.content)
```

```javascript [Node.js]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:19090/v1",
  apiKey: "switch",
});
const resp = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }],
});
console.log(resp.choices[0].message.content);
```

:::

</li>

<li>

With the OpenAI SDK (Python / Node.js), change only `base_url`/`baseURL` and `api_key`; the rest of your calls stay the same — Switch uses the provider key from its configuration to perform the actual routing, and the client never needs to know about the downstream provider.

</li>

</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Why api_key can be any value</p>
    <div class="lurus-callout__body">Acting as a local proxy, Switch uses the real provider key stored in its configuration to call downstream services. The <code>api_key</code> on the client side is only a placeholder — just set it to <code>switch</code>.</div>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> Integrations</span>
  <h2 class="lurus-section-head__title">Use it in AI coding tools</h2>
  <p class="lurus-section-head__lede">For every tool, set the API Base / endpoint address to <code>http://localhost:19090/v1</code> and the API Key to <code>switch</code>.</p>
</div>

## Use it in AI coding tools

For every tool, set the API Base / endpoint address to `http://localhost:19090/v1` and the API Key to `switch`:

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="code" :size="22" /></span>
    <div class="lurus-card__title">Cursor</div>
    <p class="lurus-card__body">Settings (<code>Ctrl+,</code>) → search "AI" → change "OpenAI API Base" to this address → save, and completions and chat automatically go through Switch.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="terminal" :size="22" /></span>
    <div class="lurus-card__title">Continue (VS Code)</div>
    <p class="lurus-card__body">Edit <code>~/.continue/config.json</code>, and for each model entry set <code>"provider": "openai"</code>, <code>"apiBase": "http://localhost:19090/v1"</code>, <code>"apiKey": "switch"</code>, and <code>"model"</code> to <code>deepseek-chat</code> / <code>gpt-4o</code>, etc.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="22" /></span>
    <div class="lurus-card__title">Cherry Studio</div>
    <p class="lurus-card__body">Settings → API configuration → choose "Custom OpenAI-compatible" → enter the address and key → "Test connection".</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="bot" :size="22" /></span>
    <div class="lurus-card__title">Lobe Chat</div>
    <p class="lurus-card__body">Settings → Language model → OpenAI → enter the API Key and the endpoint address.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Runtime</span>
  <h2 class="lurus-section-head__title">Monitoring, switching, and streaming</h2>
</div>

## Request monitoring

The "**Logs**" tab shows real-time request logs with the following fields: time (timestamp), model, provider (the actual routing target), latency (ms), tokens (prompt/completion), and status (200 / 4xx-5xx). "Export CSV" lets you export the last 7 days of records for cost analysis.

## One-click provider switching

Click the menu bar icon (macOS) / system tray (Windows) to: switch the "current active provider", temporarily disable a provider (for debugging), or view today’s usage overview.

## Streaming responses

SSE streaming responses are fully supported and passed through from downstream: after `chat.completions.create(..., stream=True)`, iterate over `chunk.choices[0].delta.content`.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> Advanced</span>
  <h2 class="lurus-section-head__title">Load balancing</h2>
  <p class="lurus-section-head__lede">When a model is configured with multiple providers, you can round-robin or distribute by weight.</p>
</div>

## Advanced: load balancing

When a model is configured with multiple providers, you can round-robin or distribute by weight:

```json
{
  "routing": {
    "rules": [
      {
        "pattern": "deepseek-chat",
        "providers": [
          { "name": "Lurus API", "weight": 70 },
          { "name": "DeepSeek Official", "weight": 30 }
        ],
        "strategy": "weighted_random"
      }
    ]
  }
}
```

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Troubleshooting</span>
  <h2 class="lurus-section-head__title">Troubleshooting</h2>
  <p class="lurus-section-head__lede">Expand the matching symptom to see the steps to resolve it.</p>
</div>

## Troubleshooting

<details class="lurus-faq-item">
<summary>"connection refused" — the connection was refused</summary>

Switch isn’t running or the port is wrong. Check the process and port:

- Process: Windows `tasklist | findstr LurusSwitch` / macOS·Linux `ps aux | grep lurus-switch`
- Port: `curl http://localhost:19090/v1/models`

</details>

<details class="lurus-faq-item">
<summary>401 / 403 — authentication failed</summary>

The provider API Key is misconfigured. Re-enter it in the configuration screen and click "Test" to verify connectivity.

</details>

<details class="lurus-faq-item">
<summary>Unusually high latency</summary>

1. Check the logs to confirm routing hit the correct provider.
2. High latency from overseas providers (OpenAI / Anthropic) is normal (300-1500ms).
3. Switch to a Lurus API domestic node (typically &lt; 200ms).

</details>

<details class="lurus-faq-item">
<summary>The macOS app is unresponsive</summary>

Right-click "Quit" in the menu bar and restart, or run in the terminal:

```bash
pkill -f LurusSwitch && open -a "Lurus Switch"
```

</details>

## Next steps

<NextSteps :steps="[
  { text: 'MCP server management', link: '/en/switch/mcp-servers', primary: true },
  { text: 'Cost monitoring', link: '/en/switch/cost-monitoring' },
  { text: 'Team config sync', link: '/en/switch/team-config' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
