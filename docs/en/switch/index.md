---
title: Switch — Unified Management Hub for AI Coding CLIs
description: A desktop app that manages the configuration, MCP servers, and costs of 5 mainstream AI coding CLIs from a single interface.
---

<div class="switch-page">

<ProductHero product-id="switch" />

<MetricStats :items="[
  { label: 'CLIs Managed', value: '5', hint: 'Claude Code / Codex / Gemini / PicoClaw / NullClaw' },
  { label: 'Package Size', value: '<15MB', hint: 'Single exe, zero dependencies' },
  { label: 'Startup', value: '<2s', hint: 'Wails + Go 1.25 + React 18' },
]" />

## What is Lurus Switch?

**Lurus Switch** is a desktop app (a single exe with zero dependencies, &lt; 15MB) that lets you manage the configuration, MCP servers, and costs of **5 mainstream AI coding CLIs: Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw** from one interface. Built on **Wails** (Go 1.25 + React 18), it starts in &lt; 2 seconds and supports Windows / macOS / Linux across all platforms.

Today’s developers use multiple AI CLIs at once — Claude Code, Codex, Gemini CLI, and more — with configs scattered everywhere and costs tracked in isolation. Switch brings it all under centralized management.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">One interface — no more hunting for configs</p>
    <div class="lurus-callout__body">Visual config editing, cross-tool MCP sync, and cost aggregation by tool/model — no need to open each CLI’s dotfile separately.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Core Capabilities</span>
  <h2 class="lurus-section-head__title">Manage all your AI CLIs in one place</h2>
  <p class="lurus-section-head__lede">Configuration, MCP, costs, keys, proxies — your everyday operational tasks all happen in the same window.</p>
</div>

<CapabilityGrid accent="var(--lurus-color-switch)" :items="[
  { title: 'Multi-CLI Config Management', body: 'Visually edit Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw configs, with live preview in Monaco Editor.', icon: 'layers' },
  { title: 'CLAUDE.md Smart Assistant', body: 'Scans your project to auto-generate CLAUDE.md, scores its quality, and offers optimization suggestions.', icon: 'sparkles' },
  { title: 'Visual MCP Server Setup', body: 'No more hand-writing JSON — configure MCP servers visually and sync them across tools.', icon: 'plug' },
  { title: 'Cost Monitoring Dashboard', body: 'Real-time token consumption trends, broken down by tool/model, with budget alerts.', icon: 'bar-chart-3' },
  { title: 'Unified API Key Management', body: 'Store and use keys consistently across tools, with secure encryption.', icon: 'key' },
  { title: 'Proxy & Network', body: 'Auto-detect system proxy, one-click Clash / V2Ray setup, and custom API endpoints.', icon: 'shuffle' },
  { title: 'Config Snapshots', body: 'Save / restore / compare diffs — experiment at zero cost.', icon: 'history' },
  { title: 'Prompt Template Library', body: 'Built-in high-quality templates + custom management + import/export.', icon: 'package' },
  { title: 'Process Management', body: 'Monitor CLI processes: list / terminate / start / view output.', icon: 'monitor' },
  { title: 'Auto-Update', body: 'Self-update via GitHub Releases + tool version checks.', icon: 'package-plus' },
]" title="" />

---

## How It Works

Switch exposes an OpenAI-compatible API endpoint locally (default `http://localhost:11434/v1`). Your app simply changes its `base_url` to this local address, and Switch takes over all routing from there.

<ArchitectureDiagram
  title="Local proxy + multi-provider routing"
  chart="graph TD
    App[Your App<br/>OpenAI SDK] --> SW[Lurus Switch<br/>localhost:11434]
    SW --> L[Lurus API]
    SW --> O[OpenAI Direct]
    SW --> OL[Ollama<br/>Local Models]"
/>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="plug-zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Zero-intrusion integration</p>
    <div class="lurus-callout__body">Change just one <code>base_url</code> and all your existing OpenAI SDK calls work; routing rules are maintained centrally in Switch, with no awareness required from your application code.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Use Cases</span>
  <h2 class="lurus-section-head__title">Who’s using Switch</h2>
</div>

<UserScenarios title="" :scenarios="[
  { role: 'Multi-CLI Users', title: 'Multi-CLI Management', summary: 'Use several of Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw at once and need unified config management.', link: '/en/switch/configuration' },
  { role: 'Cost Owners', title: 'Cost Control', summary: 'Run multiple CLIs in parallel and need a unified spending view and budget controls.', link: '/en/switch/cost-monitoring' },
  { role: 'Technical Teams', title: 'Team Standardization', summary: 'Distribute unified configs to ensure team members use consistent AI CLI settings.', link: '/en/switch/team-config' },
  { role: 'Chinese Developers', title: 'Domestic Network', summary: 'Need VPN configuration, a Chinese interface, and one-click switching between domestic and overseas models.', link: '/en/switch/configuration' },
]" />

---

## Comparison with Other Solutions

<ComparisonTable
  self-label="Switch"
  :competitors="['Aider', 'Cursor', 'Manual Management']"
  :rows="[
    { dimension: 'CLI Coverage', self: '5 unified', alt: { Aider: '1', Cursor: 'Built-in IDE', 'Manual Management': 'N/A' } },
    { dimension: 'MCP Management', self: 'Visual + sync', alt: { Aider: 'None', Cursor: 'Configured separately', 'Manual Management': 'Hand-written JSON' } },
    { dimension: 'Cost Monitoring', self: 'Aggregated dashboard', alt: { Aider: 'None', Cursor: 'None', 'Manual Management': 'None' } },
    { dimension: 'Team Sync', self: 'Git + Vault', alt: { Aider: 'None', Cursor: 'None', 'Manual Management': 'None' } },
  ]"
  title=""
/>

---

## Supported Platforms

| Platform | Version Requirement |
|------|---------|
| Windows | Windows 10 64-bit and above |
| macOS | macOS 12 (Monterey) and above |
| Linux | Ubuntu 20.04 / Debian 11 and above |

---

## Next Steps

<NextSteps :steps="[
  { text: 'Installation Guide', link: '/en/switch/install', primary: true },
  { text: 'Configuration', link: '/en/switch/configuration' },
  { text: 'User Manual', link: '/en/switch/usage' },
]" title="" />

<RelatedProducts product-id="switch" />

</div>

<style>
.switch-page .lurus-section-head { margin-top: 8px; }
.switch-page .cap-grid__heading { display: none; }
</style>
