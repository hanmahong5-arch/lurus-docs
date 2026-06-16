---
title: Switch — MCP Server Management
description: Visually configure / debug MCP servers and sync them across AI CLIs.
---

<div class="switch-page">

# MCP Server Management <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug" :size="14" /> Unified management</span>
  <h2 class="lurus-section-head__title">One central config, synced across CLIs</h2>
  <p class="lurus-section-head__lede">Switch unifies the configs scattered across each tool's own <code>mcp_servers.json</code> — Claude Code / Codex / Gemini — and provides visual debugging.</p>
</div>

## MCP Manager

Open Switch → "MCP Servers" in the left sidebar to see:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">Registration status</div>
    <p class="lurus-card__body">All currently registered MCP servers, with status <span class="lurus-tag">running</span> <span class="lurus-tag">stopped</span> <span class="lurus-tag">errored</span></p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="share-2" :size="20" /></span>
    <div class="lurus-card__title">References</div>
    <p class="lurus-card__body">Which CLIs reference each server</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">Call history</div>
    <p class="lurus-card__body">The last N tool-call records</p>
  </div>
</div>

## Config Format

Switch uses a single central `~/.lurus-switch/mcp.yaml`:

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

  kova:
    url: http://localhost:3333
    type: http
    visible_to: [claude-code, codex, gemini]
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shuffle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">visible_to drives on-demand delivery</p>
    <div class="lurus-callout__body">When you switch to any CLI, Switch dynamically generates that CLI's <code>mcp_servers.json</code> based on <code>visible_to</code>, so each tool only sees the servers assigned to it.</div>
  </div>
</div>

## Debugging

Select a server to open the debug panel on the right:

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span>
    <div class="lurus-card__title">Tools list</div>
    <p class="lurus-card__body">All tools exposed by the server, including their input-parameter schema</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Manual invocation</div>
    <p class="lurus-card__body">Fill in parameters and test directly</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">Request Log</div>
    <p class="lurus-card__body">The complete request/response JSON for recent calls</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="rewind" :size="20" /></span>
    <div class="lurus-card__title">Restart</div>
    <p class="lurus-card__body">Process-level restart</p>
  </div>
</div>

## Quick Setup for Common Servers

Switch ships with one-click install buttons — no need to write configs by hand:

| Server | Purpose |
|--------|------|
| `github` | Read/write issues / PRs / files |
| `postgres` | Query the database |
| `filesystem` | Read/write local files |
| `slack` | Send messages / read channels |
| `kova` | Kova Agent as a tool |
| `lumen` | Lumen Trace / Replay |

## Sync to Your Team

See [Team Sync](/en/switch/team-config).

## Next Steps

<NextSteps :steps="[
  { text: 'Cost Monitoring', link: '/en/switch/cost-monitoring', primary: true },
  { text: 'Team Sync', link: '/en/switch/team-config' },
  { text: 'Back to User Guide', link: '/en/switch/usage' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
