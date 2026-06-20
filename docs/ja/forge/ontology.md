---
title: "Forge — Ontology オントロジー"
description: "ツリー構造でプロダクトのユーザーストーリー、アーキテクチャ、技術スタック、デザイン規約を管理します。"
---

<div class="forge-ont-page">

# Ontology オントロジー <StatusBadge status="beta" />

Ontology は Forge の第一の中核データモデルであり、プロダクトのすべての「知識」をツリー構造で表現し、AI Agent と人間が同一の可視化された構造上で協働できるようにします。散在するユーザーストーリー（Jira / Feishu / チャット）、分離したアーキテクチャと実装、記録のない技術スタックの変更、個別に管理されたデザイン規約を、**追跡可能・遡及可能・Agent が書き込み可能**な一本の知識ツリーへと統合します。

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="network" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">一言で言うと</p>
    <div class="lurus-callout__body">Ontology は<strong>静的</strong>な構造化知識であり、<a href="/ja/forge/sessions">Session</a> は<strong>動的</strong>なタイムラインです。Session 内の決定が Ontology ノードへ書き込まれ／修正されます。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> データモデル</span>
  <h2 class="lurus-section-head__title">ノードタイプ</h2>
  <p class="lurus-section-head__lede">6 種類のノードがプロダクト知識の異なる次元を並列に記述します。</p>
</div>

| タイプ | 意味 | 典型的なリーフ |
|------|------|---------|
| `UserStory` | ユーザーストーリー | 「X として、Z のために Y したい」 |
| `Architecture` | アーキテクチャ決定 | 「イベント駆動を採用、理由は…」 |
| `TechStack` | 技術スタック | 「バックエンドは Go + Gin + PG」 |
| `DesignSpec` | デザイン規約 | 「ボタンの角丸は 8px、メインカラーは #C67B5C」 |
| `Decision` | 一回限りの決定 | 「Redis Streams を廃止し NATS へ変更」 |
| `Risk` | リスク項目 | 「サードパーティ API の 429 レート制限」 |

## ツリー構造

```
产品: Lurus Forge
├─ UserStory
│  ├─ PM 创建需求
│  ├─ Architect 设计方案
│  └─ Dev 实现并提 PR
├─ Architecture
│  ├─ Ontology + Session 双核心
│  └─ WAL 决策回溯（依赖 Kova）
├─ TechStack
│  ├─ Elixir/Phoenix + LiveView
│  └─ PostgreSQL + ltree
└─ DesignSpec
   └─ Lurus 铜棕视觉系统
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> 協働方法</span>
  <h2 class="lurus-section-head__title">Agent 自動書き込み · 可視化 · エクスポート</h2>
</div>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Agent 自動書き込み</div>
    <p class="lurus-card__body">PM Agent が <a href="/ja/forge/sessions">Session</a> 内でユーザーストーリーを生成すると、ノードが自動的に Ontology に作成されます。Architect Agent がアーキテクチャ決定を行うと <code>Architecture</code> サブツリーに書き込まれ、対応する Story に関連付けられます。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">可視化</div>
    <p class="lurus-card__body">Web フロントエンドでは折りたたみ可能なツリー + ノードカードで表示し、各ノードには作成者（人 / Agent）、関連 Session、過去の改訂履歴、ステータス（ドラフト / レビュー中 / 確定済み）が付きます。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="import" :size="20" /></span>
    <div class="lurus-card__title">エクスポート</div>
    <p class="lurus-card__body">ツリー全体を JSON としてエクスポートするか、GraphML を yEd / Gephi にインポートしてグラフ分析を行えます（下記のコマンドを参照）。</p>
  </div>
</div>

### エクスポートコマンド

```bash
forge export --ontology json     # 整棵树 → JSON
forge export --ontology graphml  # 可导入 yEd / Gephi
```

---

## 次のステップ

<NextSteps :steps="[
  { text: 'Session ワークフロー', link: '/ja/forge/sessions', primary: true },
  { text: 'ロードマップ', link: '/ja/forge/roadmap' },
  { text: 'Forge 概要に戻る', link: '/ja/forge/' },
]" />

</div>
