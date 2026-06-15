---
title: Switch — 团队配置同步
description: 通过 Git 管理共享 CLI / MCP 配置，Vault 桥接敏感凭证。
---

<div class="switch-page">

# 团队配置同步 <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 团队同步</span>
  <h2 class="lurus-section-head__title">共享配置，私有凭证</h2>
  <p class="lurus-section-head__lede">让整个团队共享同一套 AI CLI 与 MCP 配置，但敏感凭证各自独立，永不入 Git。</p>
</div>

## 模式总览

<ArchitectureDiagram
  chart="graph LR; G[Team Git: 非敏感配置] --> S[Switch: 本地 UI]; V[Vault / OS Keyring: 敏感凭证] --> S; S --> G; S --> V"
  title="配置分发模型" />

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="22" /></span>
    <div class="lurus-card__title">Git 仓库</div>
    <p class="lurus-card__body">签入配置骨架：server 列表、tool 定义、预设 Prompt。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="lock" :size="22" /></span>
    <div class="lurus-card__title">Vault / OS Keyring</div>
    <p class="lurus-card__body">存 API Key、GitHub Token 等敏感项，<strong>永远不入 Git</strong>。</p>
  </div>
</div>

## Git 同步

<ol class="lurus-steps">

<li>

首次绑定团队配置仓库：

```bash
lurus-switch team init git@github.com:your-org/ai-config.git
```

</li>

<li>

日常拉取与推送：

```bash
lurus-switch team pull
lurus-switch team push
```

`team pull` 会拉取团队共享的：

- `mcp.yaml`（MCP Server 列表）
- `cli-configs/*.yaml`（5 款 CLI 的可分享部分）
- `prompts/`（Prompt 模板）

</li>

</ol>

## Vault 桥接

```yaml
# ~/.lurus-switch/vault.yaml
provider: hashicorp-vault
address: https://vault.internal.example.com
auth:
  method: token
  token_env: VAULT_TOKEN
```

在 `mcp.yaml` 引用：

```yaml
servers:
  github:
    env:
      GITHUB_TOKEN: vault://secret/ai/github#token
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">明文永不落盘</p>
    <div class="lurus-callout__body">Switch 在启动 MCP Server 时动态从 Vault 取值，凭证明文永不落盘。</div>
  </div>
</div>

支持的 Provider：

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">HashiCorp Vault</div>
    <p class="lurus-card__body">集中式密钥管理服务</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">macOS Keychain</div>
    <p class="lurus-card__body">系统级凭证存储</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Windows Credential Manager</div>
    <p class="lurus-card__body">系统级凭证存储</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Linux Secret Service</div>
    <p class="lurus-card__body">libsecret 后端</p>
  </div>
</div>

## Diff 审计

```bash
lurus-switch team diff
```

显示本地与团队远端的配置差异（不含敏感项）。

## 回滚

```bash
lurus-switch team rollback <commit-sha>
```

本地配置回到 Git 任意历史版本。

## 下一步

<NextSteps :steps="[
  { text: '回到使用手册', link: '/switch/usage', primary: true },
  { text: 'MCP 服务器', link: '/switch/mcp-servers' },
  { text: '成本监控', link: '/switch/cost-monitoring' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
