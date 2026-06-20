---
title: "Unified AI CLI Access for Teams (Switch + MCP + Gateway)"
description: "Use Switch to centrally manage your team's AI CLI tools, MCP servers, and model costs — one central config, synced across Claude Code / Codex / Gemini."
---

<div class="tut-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="monitor" :size="14" /> Cross-product tutorial</span>
  <h1 class="lurus-section-head__title">Unified AI CLI Access for Teams</h1>
  <p class="lurus-section-head__lede">Consolidate the AI CLI configs, MCP servers, and model keys scattered across every engineer's machine into <strong>one central config</strong>: Switch handles MCP and sync, Lurus API handles models and billing.</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Products involved</p>
    <div class="lurus-callout__body">Switch (desktop tool management) · Lurus API (unified gateway) · MCP servers (Kova / GitHub / PostgreSQL, etc.). This tutorial only references capabilities already documented for each product.</div>
  </div>
</div>

## <Icon name="package" :size="20" /> What you'll get

| Before (every person on their own) | After (unified with Switch) |
|---|---|
| Everyone hand-writes `mcp_servers.json`, with inconsistent tool versions | One central `mcp.yaml`, with `visible_to` delivering on demand |
| Each CLI gets its own set of Provider keys | All traffic goes through Lurus API — one key, one bill |
| Model costs are invisible | Switch cost dashboard aggregates by tool / model |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> Step 1</span>
  <h2 class="lurus-section-head__title">Install Switch and connect the gateway</h2>
</div>

<ol class="lurus-steps">
<li>

Install Switch following the [installation guide](/en/switch/install) (macOS / Windows / Linux).

</li>
<li>

In Settings, enter your Lurus <Term t="API Key">API Key</Term> ([how to get one](/en/guide/get-api-key)) so every CLI calls models uniformly through `https://api.lurus.cn/v1` — one key, one bill.

</li>
<li>

Verify the local proxy is running (default port 19090):

```bash
curl http://localhost:19090/v1/models
```

</li>
</ol>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug" :size="14" /> Step 2</span>
  <h2 class="lurus-section-head__title">Write one central MCP config</h2>
  <p class="lurus-section-head__lede">Switch manages all MCP servers from a single <code>~/.lurus-switch/mcp.yaml</code>, and <code>visible_to</code> decides which ones each CLI sees.</p>
</div>

```yaml
servers:
  github:
    command: npx
    args: [-y, '@modelcontextprotocol/server-github']
    env:
      GITHUB_TOKEN: ${GITHUB_TOKEN}
    visible_to: [claude-code, codex]

  postgres:
    command: docker
    args: [run, -i, --rm, mcp/postgres, 'postgres://localhost/dev']
    visible_to: [claude-code]

  kova:                       # Kova Agent 作为工具暴露
    url: http://localhost:3333
    type: http
    visible_to: [claude-code, codex, gemini]
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shuffle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">visible_to drives on-demand delivery</p>
    <div class="lurus-callout__body">When you switch to any CLI, Switch dynamically generates that CLI's <code>mcp_servers.json</code> based on <code>visible_to</code>, so each tool only sees the servers assigned to it. See the <a href="/en/integrations/">integration catalog</a> for the list of connectable servers, and <a href="/en/switch/mcp-servers">MCP Servers</a> for management details.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Step 3</span>
  <h2 class="lurus-section-head__title">See the costs, then sync to the team</h2>
</div>

<ol class="lurus-steps">
<li>

Open Switch's <a href="/en/switch/cost-monitoring">cost monitoring</a> to view token consumption by tool / model — since all calls go through the same Lurus API Key, the bill is unified.

</li>
<li>

Once the config is confirmed correct, use <a href="/en/switch/team-config">team sync</a> to distribute this `mcp.yaml` to the team, so new members are ready out of the box with a consistent version.

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">What you can add next</p>
    <div class="lurus-callout__body"><p>Connect <a href="/en/memx/quickstart">MemX memory</a> to your CLI (the <code>memory_search</code> / <code>memory_add</code> tools) so the agent remembers project conventions; or connect <a href="/en/lumen/">Lumen</a> for call tracing and cost alerts.</p></div>
  </div>
</div>

<NextSteps
  title="Next steps"
  :steps="[
    { text: 'Switch MCP Servers', link: '/en/switch/mcp-servers', primary: true },
    { text: 'Integrations & MCP catalog', link: '/en/integrations/' },
    { text: 'Memory Agent tutorial', link: '/en/tutorials/memory-agent' },
  ]"
/>

</div>
