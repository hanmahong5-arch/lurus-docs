---
title: Switch — チーム構成の同期
description: Git で共有 CLI / MCP 構成を管理し、Vault で機密クレデンシャルを橋渡しします。
---

<div class="switch-page">

# チーム構成の同期 <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> チーム同期</span>
  <h2 class="lurus-section-head__title">構成は共有、クレデンシャルは非公開</h2>
  <p class="lurus-section-head__lede">チーム全体で同一の AI CLI と MCP 構成を共有しつつ、機密クレデンシャルは各自で独立管理し、決して Git に入れません。</p>
</div>

## モード概要

<ArchitectureDiagram
  chart="graph LR; G[Team Git: 非機密構成] --> S[Switch: ローカル UI]; V[Vault / OS Keyring: 機密クレデンシャル] --> S; S --> G; S --> V"
  title="構成配布モデル" />

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="22" /></span>
    <div class="lurus-card__title">Git リポジトリ</div>
    <p class="lurus-card__body">構成のスケルトンをチェックイン：server 一覧、tool 定義、プリセット Prompt。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="lock" :size="22" /></span>
    <div class="lurus-card__title">Vault / OS Keyring</div>
    <p class="lurus-card__body">API Key、GitHub Token などの機密項目を保存し、<strong>決して Git に入れません</strong>。</p>
  </div>
</div>

## Git 同期

<ol class="lurus-steps">

<li>

初回にチーム構成リポジトリをバインドします：

```bash
lurus-switch team init git@github.com:your-org/ai-config.git
```

</li>

<li>

日常的なプルとプッシュ：

```bash
lurus-switch team pull
lurus-switch team push
```

`team pull` はチームで共有される以下を取得します：

- `mcp.yaml`（MCP Server 一覧）
- `cli-configs/*.yaml`（5 種類の CLI の共有可能な部分）
- `prompts/`（Prompt テンプレート）

</li>

</ol>

## Vault 橋渡し

```yaml
# ~/.lurus-switch/vault.yaml
provider: hashicorp-vault
address: https://vault.internal.example.com
auth:
  method: token
  token_env: VAULT_TOKEN
```

`mcp.yaml` で参照します：

```yaml
servers:
  github:
    env:
      GITHUB_TOKEN: vault://secret/ai/github#token
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">平文は決してディスクに残さない</p>
    <div class="lurus-callout__body">Switch は MCP Server の起動時に Vault から動的に値を取得するため、クレデンシャルの平文は決してディスクに残りません。</div>
  </div>
</div>

サポートされる Provider：

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">HashiCorp Vault</div>
    <p class="lurus-card__body">集中型のシークレット管理サービス</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">macOS Keychain</div>
    <p class="lurus-card__body">システムレベルのクレデンシャルストレージ</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Windows Credential Manager</div>
    <p class="lurus-card__body">システムレベルのクレデンシャルストレージ</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Linux Secret Service</div>
    <p class="lurus-card__body">libsecret バックエンド</p>
  </div>
</div>

## Diff 監査

```bash
lurus-switch team diff
```

ローカルとチームのリモートとの構成差分を表示します（機密項目は含みません）。

## ロールバック

```bash
lurus-switch team rollback <commit-sha>
```

ローカル構成を Git の任意の履歴バージョンに戻します。

## 次のステップ

<NextSteps :steps="[
  { text: '使用マニュアルに戻る', link: '/ja/switch/usage', primary: true },
  { text: 'MCP サーバー', link: '/ja/switch/mcp-servers' },
  { text: 'コスト監視', link: '/ja/switch/cost-monitoring' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
