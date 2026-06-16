---
title: Kova — AI エージェント永続実行エンジン
description: Rust で構築された WAL-First アーキテクチャ。クラッシュ自動復旧、マイクロ秒級スケジューリング、外部依存ゼロ。
---

<div class="kova-page">

<ProductHero product-id="kova" />

<MetricStats :items="[
  { label: 'FIFO スケジューリング', value: '3.17μs', hint: 'Criterion 完全パイプライン' },
  { label: 'スループット', value: '315K ops/s' },
  { label: 'コード量', value: '178K LOC', hint: '21 crate workspace' },
  { label: '外部依存', value: 'ゼロ', hint: 'Redis / Postgres 不要' },
]" />

## Kova とは？

**Kova** は Lurus のコア AI エージェント基盤であり、Rust で構築された高性能な永続化実行エンジンです。**エージェントをいかに信頼性高く長時間稼働させ、クラッシュ後に状態を復旧し、複雑なワークフローを協調させるか** という課題を解決します。従来のフレームワーク（LangChain、CrewAI）はメモリ上で動作し、プロセスが終了すると状態を失います。Kova は <Term t="WAL">WAL（Write-Ahead Log）</Term> 優先アーキテクチャを採用し、各ステップの実行を永続的に記録するため、クラッシュしても中断地点まで正確に復旧できます——LLM を再呼び出しせず、進捗を失わず、追加費用も発生しません。

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">コア指標</p>
    <div class="lurus-callout__body"><Term t="FIFO">FIFO</Term> 完全パイプライン遅延 <strong>3.17μs</strong>（Criterion ベンチマーク、<code>docs/benchmark-report.md</code> 参照）、スループット <strong>315K ops/s</strong>、<strong>外部サービス依存ゼロ</strong>。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> コア機能</span>
  <h2 class="lurus-section-head__title">Kova を選ぶ理由</h2>
  <p class="lurus-section-head__lede">WAL-First 永続化、マイクロ秒級スケジューリング、依存ゼロのデプロイ、4 種類の接続方式。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-kova)"
  :items="[
    { title: 'WAL クラッシュ復旧', body: '各ステップ実行前にログを先行書き込み + CRC32 検証。クラッシュ後は中断地点から再生し、LLM を再呼び出ししない', icon: 'database-backup' },
    { title: '3μs スケジューリング遅延', body: 'FIFO 完全パイプラインの Criterion ベンチマークで 3.17μs、315K ops/s スループット', icon: 'gauge' },
    { title: '外部依存ゼロ', body: 'Redis / Postgres は不要。ローカルの WAL ファイルだけで動作', icon: 'package' },
    { title: '4 種類の接続方式', body: 'Rust SDK / gRPC / REST / MCP、21 workspace crate のモジュール構成', icon: 'puzzle' },
  ]"
/>

### WAL-First 永続化

すべての状態変更は実行前にまず WAL へ書き込み、クラッシュ時は WAL から再生します：

<ol class="lurus-steps">
<li>

**エージェントの判断** — エンジンが次のアクションを決定

</li>
<li>

**WAL 書き込み（CRC32）** — 永続的な記録 + チェックサムで破損を防止

</li>
<li>

**実行** — 実際にツール / LLM を呼び出す

</li>
<li>

**完了確認** — 当該ステップが反映済みとマーク。クラッシュ時、未確認のステップは自動的に再生される

</li>
</ol>

CRC32 検証で破損を防止。Power-of-2 リングバッファでストレージを効率的に利用。ロック順序 **Buffer → Queue → Txn** を厳格に保証し、デッドロックを完全に排除します。

### エージェントのオーケストレーション

| モード | 説明 | 適用シーン |
|------|------|---------|
| **単一エージェント** | 単独でタスクを実行 | シンプルな自動化 |
| **ワークフロー** | 複数ステップを順序立てて実行 | データパイプライン、承認フロー |
| **群知能 (Swarm)** | 複数エージェントが自律的に協調 | 複雑なリサーチ、多役割シミュレーション |

### ツールエコシステムとマルチモデル

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span>
    <div class="lurus-card__title">ツールエコシステム</div>
    <p class="lurus-card__body">組み込みツール（ファイル / HTTP / データベース / Shell）、<Term t="MCP">MCP</Term>（MCP 互換のあらゆるツールサービスに接続、<a href="/integrations/">統合カタログ</a>参照）、<Term t="A2A">A2A</Term>（エージェント間の直接通信とタスク委譲）、カスタムツール（Rust または REST API での拡張）。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">マルチモデル対応</div>
    <p class="lurus-card__body"><a href="/ja/guide/introduction">Lurus API</a> 経由で主要な LLM をすべて利用（DeepSeek 日常用 / GPT-4o 推論 / Claude 長文 / Gemini マルチモーダル）、実行時にタスクに応じて動的に切り替え。</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> アーキテクチャ</span>
  <h2 class="lurus-section-head__title">アーキテクチャ概要</h2>
  <p class="lurus-section-head__lede">REST/SDK/gRPC/MCP で接続 · Kova Core でスケジューリング · WAL で永続化と復旧。</p>
</div>

<ArchitectureDiagram
  title="Kova 実行アーキテクチャ"
  chart="graph LR
  A[Client SDK / gRPC / REST] --> B[Kova Core]
  B --> C[WAL Writer<br/>CRC32]
  B --> D[Scheduler<br/>FIFO]
  B --> E[Tool Runtime<br/>MCP]
  C -.recover.-> B
  D --> F[LLM Provider<br/>via Lurus API]"
/>

```
Kova REST API (Axum: 35+ endpoints, WebSocket)
 → Kova Core: Agent Engine(单/多 Agent) + Workflow(有序编排)
              → WAL + Ring Buffer(持久化状态管理 CRC32)
              子 crate: kova-llm / kova-tools / kova-mcp
```

Kova は **21 個の Rust crate** で構成されるワークスペースで、**178,284 行のコード**、**1,565+ のテスト**（loom 並行性 / proptest / chaos）+ **4 個の fuzz target** を備えます。現在は **v0.2.0 プレリリース**（1.0.0-beta.1 に向けて）で、厳格な lint を全面的に有効化しています（`#[deny(clippy::unwrap_used, clippy::panic, missing_docs)]`）。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> シーン</span>
  <h2 class="lurus-section-head__title">適用シーン</h2>
</div>

| シーン | Kova の強み |
|------|-----------|
| **長時間稼働するエージェント** | WAL 永続化により、クラッシュ後に自動復旧 |
| **複雑なワークフロー** | 複数ステップのオーケストレーション、条件分岐、並列実行 |
| **複数エージェントの協調** | Swarm モード、エージェント間の直接通信 |
| **エンタープライズ級デプロイ** | Rust の性能、低リソース消費、GC 停止なし |
| **MCP ツール統合** | Model Context Protocol をネイティブにサポート |
| **セキュリティ重視のシーン** | オプションの暗号化 (SM4/AES)、WAL HMAC 完全性検証 |

<UserScenarios
  title="役割別に始める"
  :scenarios="[
    { role: '開発者', title: '5 分で永続化エージェントを起動', summary: 'cargo add kova + 3 行のコード', link: '/ja/kova/quickstart' },
    { role: 'アーキテクト', title: 'LangGraph Checkpointer を置き換える', summary: 'LangGraph プロジェクトで Kova を使って checkpoint を保存', link: '/tutorials/lumen-kova-langgraph' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 比較</span>
  <h2 class="lurus-section-head__title">他のエージェントフレームワークとの比較</h2>
</div>

| 能力 | LangChain | CrewAI | AutoGen | **Kova** |
|------|-----------|--------|---------|----------|
| 言語 | Python | Python | Python | **Rust** |
| 状態の永続化 | なし（外部が必要） | なし | なし | **WAL-First** |
| クラッシュ復旧 | なし | なし | なし | **自動復旧** |
| 性能 | 中 | 中 | 中 | **極めて高い** |
| メモリ効率 | 低 | 低 | 低 | **極めて高い** |
| MCP 対応 | サードパーティ | なし | なし | **ネイティブ** |
| A2A プロトコル | なし | なし | なし | **ネイティブ** |
| 暗号化機能 | なし | なし | なし | **SM4-GCM / ChaCha20** |
| マルチプロトコル | なし | なし | なし | **4 種類の接続方式：Rust SDK / gRPC / REST / MCP** |
| デプロイ形態 | Python プロセス | Python プロセス | Python プロセス | **単一バイナリ / コンテナ / 組み込みライブラリ** |

---

## 次のステップ

<NextSteps
  :steps="[
    { text: 'クイックスタート — 最初の Kova エージェントを起動する', link: '/ja/kova/quickstart', primary: true },
    { text: 'コアコンセプト — WAL、エージェント、ワークフローを深く理解する', link: '/ja/kova/concepts' },
    { text: 'API リファレンス — 完全な REST API ドキュメント', link: '/ja/kova/api' },
    { text: '統合と MCP カタログ', link: '/integrations/' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="kova" />

</div>

<style>
.kova-page .lurus-card--kova .lurus-card__body a {
  color: var(--lurus-color-kova);
  font-weight: 600;
}
</style>
