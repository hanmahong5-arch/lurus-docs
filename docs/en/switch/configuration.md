---
title: Switch Configuration
description: Switch’s AI tool configuration, MCP server management, and cost-monitoring settings.
---

<div class="switch-page">

# Switch Configuration

## Opening the configuration interface

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Menu bar icon</div>
    <p class="lurus-card__body">macOS / Linux: click the menu bar icon → "Configuration".</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">System tray</div>
    <p class="lurus-card__body">Windows: right-click the tray icon → "Open Configuration".</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Keyboard shortcut</div>
    <p class="lurus-card__body"><span class="lurus-kbd">Ctrl+Shift+S</span> (Win/Linux) / <span class="lurus-kbd">Cmd+Shift+S</span> (macOS).</p>
  </div>
</div>

---

## Adding a model provider

In the "**<Term t="Provider">Provider</Term>**" tab → "**Add Provider**", enter the provider name + API Base URL + API Key:

| Provider | API Base URL | API Key |
|------|------|------|
| **Lurus API** <span class="lurus-tag">Recommended</span> | `https://api.lurus.cn/v1` | Lurus Key (starts with `sk-`); for models, click "Auto-detect" |
| **OpenAI** | `https://api.openai.com/v1` | `sk-...` (official) |
| **Anthropic** | `https://api.anthropic.com/v1` | `sk-ant-...` |
| **Ollama** (local) | `http://localhost:11434/v1` | (leave empty) |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> Routing</span>
  <h2 class="lurus-section-head__title">Configuring routing rules</h2>
  <p class="lurus-section-head__lede">Define which request goes to which provider; unmatched requests go to the default provider (default → Lurus API).</p>
</div>

**Route by model name**: `gpt-*` → OpenAI; `claude-*` → Anthropic; `deepseek-*` / `*` (others) → Lurus API; `llama*` → Ollama. JSON:

```json
{ "rules": [
    { "pattern": "gpt-*", "provider": "OpenAI" },
    { "pattern": "claude-*", "provider": "Anthropic" },
    { "pattern": "llama*", "provider": "Ollama" },
    { "pattern": "*", "provider": "Lurus API" }
  ] }
```

**Route by application (advanced)**: set different routes for different local applications:

```json
{
  "app_rules": [
    {
      "app": "cursor",
      "default_provider": "Lurus API",
      "model_override": "deepseek-reasoner"
    },
    {
      "app": "continue",
      "default_provider": "Ollama"
    }
  ]
}
```

---

## Proxy port configuration

"**General**" → "**Listen Port**", default `11434`. If there is a port conflict (e.g. with Ollama), change it to another port (such as `11435`), and update the application side accordingly with `base_url=http://localhost:11435/v1` (`api_key` can be anything; Switch uses the configured provider key).

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Port conflict</p>
    <div class="lurus-callout__body">The default port <code>11434</code> is the same as Ollama’s default port. When both run on the same machine, change Switch to another port (such as <code>11435</code>), and update the application-side <code>base_url</code> accordingly.</div>
  </div>
</div>

---

## Full configuration file

Switch configuration is saved at:

| Platform | Path |
|------|------|
| Windows | `%APPDATA%\LurusSwitch\config.json` |
| macOS | `~/Library/Application Support/LurusSwitch/config.json` |
| Linux | `~/.config/LurusSwitch/config.json` |

Full `config.json` example:

```json
{
  "listen_port": 11434,
  "log_requests": true,
  "start_on_login": true,
  "providers": [
    {
      "name": "Lurus API",
      "base_url": "https://api.lurus.cn/v1",
      "api_key": "sk-your-lurus-key",
      "enabled": true
    },
    {
      "name": "Ollama",
      "base_url": "http://localhost:11434/v1",
      "api_key": "",
      "enabled": true
    }
  ],
  "routing": {
    "default_provider": "Lurus API",
    "rules": [
      { "pattern": "llama*",  "provider": "Ollama" },
      { "pattern": "qwen*",   "provider": "Ollama" },
      { "pattern": "*",       "provider": "Lurus API" }
    ]
  }
}
```

---

## Verifying the configuration

The "**Status**" tab displays: the connection status of each provider (green = OK, red = failed), the currently active routing rules, and recent request logs. Command-line verification (a normal JSON response means success):

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"ping"}]}'
```

---

## Next steps

<NextSteps :steps="[
  { text: 'Cost monitoring', link: '/en/switch/cost-monitoring', primary: true },
  { text: 'MCP servers', link: '/en/switch/mcp-servers' },
  { text: 'Team configuration', link: '/en/switch/team-config' },
]" title="" />

</div>

<style>
.switch-page .lurus-section-head { margin-top: 8px; }
</style>
