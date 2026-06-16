---
title: Switch — Cost Monitoring
description: Aggregate cost across 5 CLIs, threshold alerts, attribution analysis, and Lumen integration.
---

<div class="switch-page">

# Cost Monitoring <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> Cost dashboard</span>
  <h2 class="lurus-section-head__title">Aggregate token spend from 5 CLIs in one place</h2>
  <p class="lurus-section-head__lede">Switch unifies token spend from tools like Claude Code / Codex / Gemini / PicoClaw / NullClaw, and alerts you before you exceed budget.</p>
</div>

## Cost aggregation

Once the Switch background process is running, requests from every CLI process started by Switch pass through the local proxy (default `127.0.0.1:41234`) and are recorded to a local SQLite database:

```
~/.lurus-switch/costs.db
```

Aggregation dimensions:

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="terminal" :size="20" /></span>
    <div class="lurus-card__title">Tool</div>
    <p class="lurus-card__body">claude-code / codex / gemini / picoclaw / nullclaw</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">Model</div>
    <p class="lurus-card__body">claude-sonnet-4 / gpt-5 / gemini-3-pro, etc.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">Project</div>
    <p class="lurus-card__body">By the git repo root containing the CWD</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="timer" :size="20" /></span>
    <div class="lurus-card__title">Time</div>
    <p class="lurus-card__body">Day / week / month</p>
  </div>
</div>

## Threshold alerts

Configure these on the Switch settings page:

| Alert type | Example |
|---------|------|
| Daily budget | System notification when you exceed ¥50/day |
| Single call | Highlighted in red when a call exceeds ¥2 |
| Model share | Prompt to downshift when Claude Opus > 60% |

Alert channels: <span class="lurus-tag">System notification</span> <span class="lurus-tag">Email</span> <span class="lurus-tag">Webhook</span>

## Attribution analysis

> "Why did spend suddenly jump today?"

Switch provides **flame-graph-style** attribution, drilling down layer by layer to the exact culprit:

```
总消费 ¥38.2 (↑ 250% vs 昨日)
├─ claude-code   ¥28.4 (74%)  ← 主因
│   └─ 项目: 2l-bs-docs       ¥21.3  ← 具体元凶
│       └─ 模型: claude-opus  ¥19.8
├─ codex         ¥6.5
└─ gemini        ¥3.3
```

## Lumen integration

For agent projects that use the Lumen SDK, Switch can merge Lumen's fine-grained trace data:

```
Switch 粗粒度: 项目 / 工具 / 模型
     +
Lumen 细粒度: Graph / Node / LLM Call
     =
完整成本拓扑
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="git-merge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Enable Lumen integration</p>
    <div class="lurus-callout__body">In Switch settings, enable "Lumen integration" and point it at <code>http://localhost:7070</code> to merge Switch's coarse-grained cost with Lumen's Graph / Node / LLM Call level traces into a complete cost topology.</div>
  </div>
</div>

## Export

In the UI:

```
右键 → 导出为 CSV / JSON
```

Or from the command line:

```bash
lurus-switch export --format csv --since 30d > costs.csv
```

## Next steps

<NextSteps :steps="[
  { text: 'MCP server management', link: '/en/switch/mcp-servers', primary: true },
  { text: 'Team sync', link: '/en/switch/team-config' },
  { text: 'Lumen cost tracking', link: '/en/lumen/python-sdk' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
