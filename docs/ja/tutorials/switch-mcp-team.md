---
title: "チームの AI CLI 統合接続（Switch + MCP + ゲートウェイ）"
description: "Switch でチームの AI CLI ツール、MCP サーバー、モデルコストを一元管理 —— 1 つの中央設定を Claude Code / Codex / Gemini 間で同期。"
---

<div class="tut-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="monitor" :size="14" /> 製品横断チュートリアル</span>
  <h1 class="lurus-section-head__title">チームの AI CLI 統合接続</h1>
  <p class="lurus-section-head__lede">各エンジニアのマシンに散らばった AI CLI 設定、MCP サーバー、モデル Key を<strong>1 つの中央設定</strong>に集約します。Switch が MCP と同期を管理し、Lurus API がモデルと課金を管理します。</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">連携製品</p>
    <div class="lurus-callout__body">Switch（デスクトップツール管理）· Lurus API（統合ゲートウェイ）· MCP サーバー（Kova / GitHub / PostgreSQL など）。本チュートリアルは各製品ドキュメントに既存の機能のみを参照します。</div>
  </div>
</div>

## <Icon name="package" :size="20" /> 得られるもの

| Before（バラバラ運用） | After（Switch で統一） |
|---|---|
| 各自が手書きの `mcp_servers.json`、ツールバージョンが不一致 | 1 つの中央 `mcp.yaml`、`visible_to` で必要に応じて配信 |
| 各 CLI ごとに Provider Key を設定 | すべて Lurus API 経由、1 つの Key、1 つの請求書 |
| モデルコストが不可視 | Switch のコストダッシュボードでツール / モデル別に集計 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> ステップ 1</span>
  <h2 class="lurus-section-head__title">Switch をインストールし、ゲートウェイに接続</h2>
</div>

<ol class="lurus-steps">
<li>

[インストールガイド](/ja/switch/install) に従って Switch をインストールします（macOS / Windows / Linux）。

</li>
<li>

設定画面で Lurus <Term t="API Key">API Key</Term>（[取得方法](/ja/guide/get-api-key)）を入力し、すべての CLI が `https://api.lurus.cn/v1` 経由で統一的にモデルを呼び出すようにします —— 1 つの Key、1 つの請求書。

</li>
<li>

ローカルプロキシが起動していることを確認します（デフォルトポート 19090）:

```bash
curl http://localhost:19090/v1/models
```

</li>
</ol>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug" :size="14" /> ステップ 2</span>
  <h2 class="lurus-section-head__title">1 つの中央 MCP 設定を書く</h2>
  <p class="lurus-section-head__lede">Switch は 1 つの <code>~/.lurus-switch/mcp.yaml</code> ですべての MCP サーバーを管理し、<code>visible_to</code> で各 CLI がどれを見えるかを決定します。</p>
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

  kova:                       # Kova Agent をツールとして公開
    url: http://localhost:3333
    type: http
    visible_to: [claude-code, codex, gemini]
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shuffle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">visible_to で必要に応じた配信を駆動</p>
    <div class="lurus-callout__body">いずれかの CLI に切り替えると、Switch は <code>visible_to</code> に従ってその CLI の <code>mcp_servers.json</code> を動的に生成し、各ツールには割り当てられた Server のみが見えます。接続可能なサーバー一覧は<a href="/ja/integrations/">統合カタログ</a>を、管理の詳細は <a href="/ja/switch/mcp-servers">MCP サーバー</a>を参照してください。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> ステップ 3</span>
  <h2 class="lurus-section-head__title">コストを可視化し、チームに同期する</h2>
</div>

<ol class="lurus-steps">
<li>

Switch の<a href="/ja/switch/cost-monitoring">コスト監視</a>を開き、ツール / モデル別に Token 消費を確認します —— すべての呼び出しが同一の Lurus API Key を経由するため、請求は統一されています。

</li>
<li>

設定に問題がないことを確認したら、<a href="/ja/switch/team-config">チーム同期</a>でこの `mcp.yaml` をチームに配布します。新メンバーはすぐに使え、バージョンも統一されます。

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">次に追加できること</p>
    <div class="lurus-callout__body"><p>CLI に <a href="/ja/memx/quickstart">MemX メモリ</a>（<code>memory_search</code> / <code>memory_add</code> ツール）を接続して Agent にプロジェクト規約を覚えさせる、あるいは <a href="/ja/lumen/">Lumen</a> を接続して呼び出しトレースとコストアラートを行えます。</p></div>
  </div>
</div>

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'Switch MCP サーバー', link: '/ja/switch/mcp-servers', primary: true },
    { text: '統合と MCP カタログ', link: '/ja/integrations/' },
    { text: 'メモリ Agent チュートリアル', link: '/ja/tutorials/memory-agent' },
  ]"
/>

</div>
