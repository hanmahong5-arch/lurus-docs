---
title: Switch — コスト監視
description: 5 種類の CLI のコストを集約し、しきい値アラート、要因分析、Lumen との連携を実現。
---

<div class="switch-page">

# コスト監視 <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> コストダッシュボード</span>
  <h2 class="lurus-section-head__title">5 種類の CLI の Token 消費を一箇所に集約</h2>
  <p class="lurus-section-head__lede">Switch は Claude Code / Codex / Gemini / PicoClaw / NullClaw などのツールの Token 消費を統一的に集約し、予算を超過する前にアラートを発します。</p>
</div>

## コスト集約

Switch のバックグラウンドプロセスを起動すると、Switch によって起動されたすべての CLI プロセスのリクエストはローカルプロキシ（デフォルト `127.0.0.1:41234`）を経由し、ローカルの SQLite に記録されます：

```
~/.lurus-switch/costs.db
```

集約の軸：

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="terminal" :size="20" /></span>
    <div class="lurus-card__title">ツール</div>
    <p class="lurus-card__body">claude-code / codex / gemini / picoclaw / nullclaw</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">モデル</div>
    <p class="lurus-card__body">claude-sonnet-4 / gpt-5 / gemini-3-pro など</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">プロジェクト</div>
    <p class="lurus-card__body">CWD が属する git リポジトリの root 単位</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="timer" :size="20" /></span>
    <div class="lurus-card__title">時間</div>
    <p class="lurus-card__body">日 / 週 / 月</p>
  </div>
</div>

## しきい値アラート

Switch の設定ページで構成します：

| アラート種別 | 例 |
|---------|------|
| 日次予算 | ¥50/日 を超過した場合にシステム通知 |
| 単一呼び出し | ¥2/回 を超過した場合に赤字表示 |
| モデル比率 | Claude Opus > 60% の場合に切り替えを提案 |

アラートチャネル：<span class="lurus-tag">システム通知</span> <span class="lurus-tag">メール</span> <span class="lurus-tag">Webhook</span>

## 要因分析

> 「今日はなぜ急にこんなに使ったのか？」

Switch は**フレームグラフ式**の要因分析を提供し、具体的な原因まで階層的にドリルダウンできます：

```
总消费 ¥38.2 (↑ 250% vs 昨日)
├─ claude-code   ¥28.4 (74%)  ← 主因
│   └─ 项目: 2l-bs-docs       ¥21.3  ← 具体元凶
│       └─ 模型: claude-opus  ¥19.8
├─ codex         ¥6.5
└─ gemini        ¥3.3
```

## Lumen との連携

Lumen SDK を使用する Agent プロジェクトでは、Switch は Lumen の細粒度の Trace データを統合できます：

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
    <p class="lurus-callout__title">Lumen 連携を有効化</p>
    <div class="lurus-callout__body">Switch の設定で「Lumen 連携」を有効にし <code>http://localhost:7070</code> を指定すると、Switch の粗粒度コストと Lumen の Graph / Node / LLM Call レベルの Trace を統合し、完全なコストトポロジーを構築できます。</div>
  </div>
</div>

## エクスポート

UI 操作：

```
右键 → 导出为 CSV / JSON
```

またはコマンドライン：

```bash
lurus-switch export --format csv --since 30d > costs.csv
```

## 次のステップ

<NextSteps :steps="[
  { text: 'MCP サーバー管理', link: '/ja/switch/mcp-servers', primary: true },
  { text: 'チーム同期', link: '/ja/switch/team-config' },
  { text: 'Lumen コスト追跡', link: '/ja/lumen/python-sdk' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
