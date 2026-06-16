---
title: Switch — Team Config Sync
description: Manage shared CLI / MCP configs through Git, with Vault bridging sensitive credentials.
---

<div class="switch-page">

# Team Config Sync <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Team Sync</span>
  <h2 class="lurus-section-head__title">Shared config, private credentials</h2>
  <p class="lurus-section-head__lede">Let your whole team share one set of AI CLI and MCP configs, while sensitive credentials stay separate per person and never enter Git.</p>
</div>

## Mode Overview

<ArchitectureDiagram
  chart="graph LR; G[Team Git: non-sensitive config] --> S[Switch: local UI]; V[Vault / OS Keyring: sensitive credentials] --> S; S --> G; S --> V"
  title="Config Distribution Model" />

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="22" /></span>
    <div class="lurus-card__title">Git Repository</div>
    <p class="lurus-card__body">Check in the config skeleton: server lists, tool definitions, preset prompts.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="lock" :size="22" /></span>
    <div class="lurus-card__title">Vault / OS Keyring</div>
    <p class="lurus-card__body">Stores sensitive items like API keys and GitHub tokens — <strong>never enters Git</strong>.</p>
  </div>
</div>

## Git Sync

<ol class="lurus-steps">

<li>

Bind the team config repository for the first time:

```bash
lurus-switch team init git@github.com:your-org/ai-config.git
```

</li>

<li>

Day-to-day pull and push:

```bash
lurus-switch team pull
lurus-switch team push
```

`team pull` fetches what the team shares:

- `mcp.yaml` (MCP Server list)
- `cli-configs/*.yaml` (the shareable parts of the 5 CLIs)
- `prompts/` (prompt templates)

</li>

</ol>

## Vault Bridging

```yaml
# ~/.lurus-switch/vault.yaml
provider: hashicorp-vault
address: https://vault.internal.example.com
auth:
  method: token
  token_env: VAULT_TOKEN
```

Reference it in `mcp.yaml`:

```yaml
servers:
  github:
    env:
      GITHUB_TOKEN: vault://secret/ai/github#token
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Plaintext never hits disk</p>
    <div class="lurus-callout__body">When Switch starts an MCP Server, it pulls values from Vault dynamically, so plaintext credentials never hit disk.</div>
  </div>
</div>

Supported providers:

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">HashiCorp Vault</div>
    <p class="lurus-card__body">Centralized secret management service</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">macOS Keychain</div>
    <p class="lurus-card__body">System-level credential store</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Windows Credential Manager</div>
    <p class="lurus-card__body">System-level credential store</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Linux Secret Service</div>
    <p class="lurus-card__body">libsecret backend</p>
  </div>
</div>

## Diff Audit

```bash
lurus-switch team diff
```

Shows the config differences between your local setup and the team remote (excluding sensitive items).

## Rollback

```bash
lurus-switch team rollback <commit-sha>
```

Roll local config back to any historical version in Git.

## Next Steps

<NextSteps :steps="[
  { text: 'Back to the user guide', link: '/en/switch/usage', primary: true },
  { text: 'MCP Servers', link: '/en/switch/mcp-servers' },
  { text: 'Cost Monitoring', link: '/en/switch/cost-monitoring' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
