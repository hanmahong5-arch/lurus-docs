---
title: Kova コアコンセプト
description: Kova の WAL、Agent Loop、Checkpoint などのコアアーキテクチャコンポーネントと設計思想。
---

<div class="kova-concepts">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> コアコンセプト</span>
  <h1 class="lurus-section-head__title">Kova コアコンセプト</h1>
  <p class="lurus-section-head__lede">Agent、Workflow、Swarm から WAL 永続化まで —— Kova のコアアーキテクチャコンポーネントと設計思想を理解する。</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3μs</span><span class="lurus-stat__label">スケジューリング遅延</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">315K</span><span class="lurus-stat__label">ops/s スループット</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">21</span><span class="lurus-stat__label">workspace crate</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">&lt;10MB</span><span class="lurus-stat__label">単一バイナリ</span></div>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--kova" href="#agent"><span class="lurus-card__icon"><Icon name="bot" :size="22" /></span><div class="lurus-card__title">Agent</div><p class="lurus-card__body">基本的な実行単位：Prompt + Model + Tools + Memory</p></a>
  <a class="lurus-card lurus-card--kova" href="#workflow"><span class="lurus-card__icon"><Icon name="workflow" :size="22" /></span><div class="lurus-card__title">Workflow</div><p class="lurus-card__body">複数の Agent を順序付き実行パイプラインに編成する</p></a>
  <a class="lurus-card lurus-card--kova" href="#swarm-群体智能"><span class="lurus-card__icon"><Icon name="network" :size="22" /></span><div class="lurus-card__title">Swarm</div><p class="lurus-card__body">複数の Agent が自律的に協調し、A2A プロトコルで直接通信</p></a>
  <a class="lurus-card lurus-card--kova" href="#wal-write-ahead-log"><span class="lurus-card__icon"><Icon name="database-backup" :size="22" /></span><div class="lurus-card__title">WAL</div><p class="lurus-card__body">先行書き込みログ + CRC32 検証、クラッシュ時に自動復旧</p></a>
</div>

---

## Agent

Agent は基本的な実行単位であり、以下の要素から構成されます：

| 要素 | 説明 |
|------|------|
| **<Term t="System Prompt">System Prompt</Term>** | Agent の役割、能力の境界、行動規範を定義する |
| **Model** | 使用する LLM モデル（実行時に切り替え可能） |
| **Tools** | Agent が呼び出せるツールセット |
| **Memory** | Agent のセッション履歴と永続化された状態 |

### Agent ライフサイクル

<ArchitectureDiagram title="Agent ステートマシン" chart="graph LR
  Created --> Idle
  Idle --> Running
  Running --> Completed
  Running --> Paused
  Running --> Failed
  Running --> Recovering
  Paused -.恢复.-> Running
  Recovering -.重放 WAL.-> Running" />

| 状態 | 意味 |
|------|------|
| **Idle** | Agent は作成済みで、タスクを待機している |
| **Running** | タスクを実行中 |
| **Paused** | 手動で一時停止、再開可能 |
| **Completed** | タスク完了 |
| **Failed** | 実行失敗（リトライ回数超過） |
| **Recovering** | 未完了の WAL レコードを検出し、自動復旧する |

### Agent 決定ループ

<ArchitectureDiagram title="決定ループ" chart="graph LR
  A[接收任务 / 上一步结果] --> B[LLM 推理<br/>分析 + 规划]
  B --> C{需要工具？}
  C -->|Yes| D[调用工具] --> E[工具结果] --> B
  C -->|No| F[生成最终回答] --> G[返回结果]" />

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">毎ラウンドごとにディスクへ書き込む</p>
    <div class="lurus-callout__body">各ラウンドの決定はすべて WAL に書き込まれ、クラッシュ後に中断点から再生でき、LLM を再呼び出しする必要がありません。</div>
  </div>
</div>

---

## Workflow

Workflow は複数の Agent またはステップを順序付き実行パイプラインに編成します。

### ステップタイプ

| タイプ | 説明 |
|------|------|
| **Agent ステップ** | 指定した Agent に実行を委譲する |
| **条件分岐** | 前のステップの結果に応じて異なる経路を選択する |
| **並列ステップ** | 複数のステップを同時に実行する |
| **待機ステップ** | 外部イベントまたは人による承認を待つ |
| **ループステップ** | 条件を満たすまで繰り返し実行する |

### データの受け渡し

ステップ間ではテンプレート変数を介してデータを受け渡します：

```
{{input.topic}}              → 工作流输入参数
{{steps.research.output}}    → "research" 步骤的输出
{{steps.research.metadata}}  → "research" 步骤的元数据
```

### エラー処理

各ステップには独立したエラー戦略を設定できます：

| 戦略 | 動作 |
|------|------|
| `retry` | N 回リトライ（デフォルト 3 回、指数バックオフ） |
| `skip` | 失敗したステップをスキップして実行を続ける |
| `abort` | ワークフロー全体を終了する |
| `fallback` | 代替ステップに切り替える |

---

## <Term t="Swarm">Swarm</Term>（群体智能）

Swarm モードでは、複数の Agent が事前定義された固定フローなしに自律的に協調します。

### 動作の仕組み

<ArchitectureDiagram title="Swarm 協調フロー" chart="graph LR
  U[用户任务] --> C[协调者 Agent]
  C --> S[分解子任务]
  S --> R[研究 Agent]
  S --> D[编码 Agent]
  S --> T[测试 Agent]
  R --> M[收集结果]
  D --> M
  T --> M
  M --> O[综合输出]" />

Agent 同士は <Term t="A2A">A2A（Agent-to-Agent）</Term>プロトコルを介して直接通信します：

```json
{
  "from": "coordinator",
  "to": "researcher",
  "type": "task_delegate",
  "payload": {
    "task": "调研 WebAssembly 在服务端的性能基准",
    "constraints": {
      "max_tokens": 2000,
      "deadline": "5min"
    }
  }
}
```

---

## <Term t="WAL">WAL</Term>（Write-Ahead Log）

WAL は Kova の永続化の中核となる仕組みで、データベースシステムの設計を参考にしています。

### 書き込みフロー

<ArchitectureDiagram title="WAL 書き込みフロー" chart="graph LR
  A[Agent 状态变更] --> B[序列化 + CRC32<br/>算校验和]
  B --> C[写入 WAL 文件<br/>先写日志]
  C --> D[执行实际操作]
  D --> E[标记 WAL 已完成<br/>确认提交]" />

### 復旧フロー

起動時に自動的に WAL をスキャンし、未完了の操作を復旧します：

<ol class="lurus-steps">
<li>完了済みのレコード —— <strong>スキップ</strong>。</li>
<li>CRC32 検証に失敗 —— <strong>破損とマークしてスキップ</strong>。</li>
<li>未完了のレコード —— <strong>再実行</strong>。</li>
</ol>

### <Term t="Ring Buffer">リングバッファ</Term>

WAL は power-of-2 サイズのリングバッファを使用します：

- 書き込みポインタが末尾に達すると自動的にラップアラウンドする
- 確認済みの古いレコードは新しいレコードで上書きされる
- バッファが満杯になると compaction がトリガーされる

### 同期モード

| モード | 説明 | パフォーマンス | 永続性 |
|------|------|------|--------|
| `normal` | オペレーティングシステムが fsync のタイミングを決定する | 高 | 数秒分のデータを失う可能性がある |
| `full` | 書き込みのたびに fsync する | 低 | データ損失ゼロ |

### 暗号化オプション

機密性の高いシーンでは WAL の暗号化を有効にできます：

| アルゴリズム | 説明 |
|------|------|
| `aes-256-gcm` | 標準的な AES-256 暗号化 |
| `sm4` | 国家暗号 SM4 アルゴリズム |

同時に HMAC 完全性検証を有効にして、WAL ファイルの改ざんを防止できます。

---

## ロック順序

Kova は内部で厳格なロック取得順序を使用し、デッドロックを根本的に排除します：

<ArchitectureDiagram title="ロック取得順序" chart="graph LR
  A[Buffer Lock] --> B[Queue Lock] --> C[Transaction Lock]" />

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">コンパイル時のデッドロック防止</p>
    <div class="lurus-callout__body">すべてのコードパスはこの順序に従う必要があります。順序に反してロックを取得しようとするとコンパイル時チェックがトリガーされます（Rust の型システムによって保証されます）。</div>
  </div>
</div>

---

## ツールシステム

### 組み込みツール

| ツール | 機能 |
|------|------|
| `web_search` | インターネットを検索する |
| `file_read` | ファイルを読み取る |
| `file_write` | ファイルに書き込む |
| `http_request` | HTTP リクエストを送信する |
| `shell_exec` | Shell コマンドを実行する（サンドボックス環境） |
| `db_query` | データベースクエリ |

### MCP ツール

[Model Context Protocol](https://modelcontextprotocol.io/) を介して外部ツールサービスに接続します：

```toml
# kova.toml
[[mcp.servers]]
name = "github"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
env = { GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_xxx" }

[[mcp.servers]]
name = "postgres"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-postgres"]
env = { DATABASE_URL = "postgres://..." }
```

Agent は組み込みツールと同じように MCP ツールを呼び出せます。

### A2A プロトコル

Agent-to-Agent 通信プロトコルで、以下をサポートします：

- **タスク委譲**: ある Agent がサブタスクを別の Agent に渡す
- **情報照会**: Agent 同士が直接情報を交換する
- **結果通知**: タスク完了後に発起元へ通知する
- **能力発見**: 他の Agent が何をできるかを照会する

---

## 機能レイヤー

Kova は Rust feature flags でコンパイル範囲を制御します。最小コンパイルには `pure-rust` だけで済み、必要に応じて積み重ねます：`serde`（シリアライズ）、`workflow`（ワークフロー編成）→ `agent`（Agent エンジン）→ `swarm`（群体智能）、`encrypt`（暗号化）→ `sm4`（国家暗号）/ `wal-hmac`（完全性検証）など。

---

## 次のステップ

<NextSteps title="次のステップ" :steps="[
  { text: 'クイックスタート — 5 分で最初の Agent を起動', link: '/ja/kova/quickstart', primary: true },
  { text: 'API リファレンス — 完全な REST エンドポイントドキュメント', link: '/ja/kova/api' },
  { text: 'MemX メモリエンジン — Agent に永続化メモリを追加', link: '/ja/memx/' },
]" />

<RelatedProducts product-id="kova" />

</div>

<style scoped>
.kova-concepts .lurus-stat-strip {
  margin: 1.5rem 0 2rem;
}
.kova-concepts .lurus-cards--compact {
  margin-bottom: 0.5rem;
}
</style>
