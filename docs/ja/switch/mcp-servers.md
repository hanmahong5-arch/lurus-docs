---
title: Switch — MCP サーバー管理
description: MCP サーバーをビジュアルに設定・デバッグし、AI CLI 間で同期。
---

<div class="switch-page">

# MCP サーバー管理 <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug" :size="14" /> 統一管理</span>
  <h2 class="lurus-section-head__title">1 つの中央設定で、CLI 間を同期</h2>
  <p class="lurus-section-head__lede">Switch は Claude Code / Codex / Gemini それぞれの <code>mcp_servers.json</code> に分散した設定を統一的に管理し、ビジュアルなデバッグを提供します。</p>
</div>

## MCP マネージャー

Switch を開く → 左側の「MCP サーバー」では、次の情報を確認できます：

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">登録状態</div>
    <p class="lurus-card__body">現在登録されているすべての MCP Server。状態 <span class="lurus-tag">running</span> <span class="lurus-tag">stopped</span> <span class="lurus-tag">errored</span> を含む</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="share-2" :size="20" /></span>
    <div class="lurus-card__title">参照関係</div>
    <p class="lurus-card__body">各 Server がどの CLI から参照されているか</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">呼び出し履歴</div>
    <p class="lurus-card__body">直近 N 回のツール呼び出し履歴</p>
  </div>
</div>

## 設定フォーマット

Switch は 1 つの中央 `~/.lurus-switch/mcp.yaml` を使用します：

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
    <p class="lurus-callout__title">visible_to がオンデマンド配信を駆動</p>
    <div class="lurus-callout__body">いずれかの CLI に切り替えると、Switch は <code>visible_to</code> に従ってその CLI の <code>mcp_servers.json</code> を動的に生成し、各ツールは自身に割り当てられた Server のみを参照します。</div>
  </div>
</div>

## デバッグ

ある Server を選択すると、右側にデバッグパネルが表示されます：

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span>
    <div class="lurus-card__title">Tools 一覧</div>
    <p class="lurus-card__body">Server が公開するすべてのツール（入力パラメータの schema を含む）</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">手動呼び出し</div>
    <p class="lurus-card__body">パラメータを入力して直接テスト</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">Request Log</div>
    <p class="lurus-card__body">直近の request/response の完全な JSON</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="rewind" :size="20" /></span>
    <div class="lurus-card__title">再起動</div>
    <p class="lurus-card__body">プロセスレベルの再起動</p>
  </div>
</div>

## よく使う Server のクイック接続

Switch にはワンクリックインストールボタンが組み込まれており、設定を手書きする必要はありません：

| Server | 用途 |
|--------|------|
| `github` | issues / PR / file の読み書き |
| `postgres` | データベースの照会 |
| `filesystem` | ローカルファイルの読み書き |
| `slack` | メッセージ送信 / チャンネル読み取り |
| `kova` | Kova Agent をツールとして利用 |
| `lumen` | Lumen Trace / Replay |

## チームへ同期

[チーム同期](/ja/switch/team-config) を参照してください。

## 次のステップ

<NextSteps :steps="[
  { text: 'コスト監視', link: '/switch/cost-monitoring', primary: true },
  { text: 'チーム同期', link: '/switch/team-config' },
  { text: '利用マニュアルに戻る', link: '/switch/usage' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
