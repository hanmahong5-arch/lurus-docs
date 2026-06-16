---
title: Lumen — Agent の可観測性と信頼性ツール
description: Python SDK 優先 + Rust エンジン + オプションの CLI で、Agent 開発者に可観測性、デバッグ、信頼性を提供します。
---

<div class="lumen-page">

<ProductHero product-id="lumen" />

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前提条件</p>
    <div class="lurus-callout__body"><ul><li>第一選択：Python 3.9+（<code>pip install lumen-ai</code>）</li><li>オプションの CLI：Rust 1.93+ でソースから <code>lumen-cli</code> をコンパイル</li><li>Lurus <Term t="API Key">API Key</Term> 一つ（<a href="/ja/guide/get-api-key">取得方法</a>）</li></ul></div>
  </div>
</div>

## Lumen とは？

**Lumen** は AI Agent 開発者向けの**三位一体の信頼性ツール** — Replay（ゼロコストのリプレイ）+ Crash Recovery（マイクロ秒級の<Term t="Checkpoint">クラッシュリカバリ</Term>）+ Cost Tracking（リアルタイムのコスト追跡）です。**提供形態**：Python SDK 優先（`pip install lumen-ai`、LangGraph/Agent の第一選択）+ Rust エンジン（`lumen-core` パフォーマンスの土台）+ オプションの CLI（`lumen-cli` v0.1.0）。理念：*Illuminate your AI agents. Never lose a run. Never burn tokens blindly.*

```python
pip install lumen-ai

from lumen_ai import LumenTracer, LumenCheckpointer, CostTracker

# 三行代码接入 — LangGraph 原生集成
graph = workflow.compile(
    checkpointer=LumenCheckpointer(),   # 崩溃恢复
    callbacks=[LumenTracer()]            # 执行追踪 + 成本追踪
)
```

低レイヤーは Rust エンジン（lumen-core）が駆動し、Python SDK がフレンドリーなインターフェースを提供して、[Kova Agent エンジン](/ja/kova/) と Python エコシステムを接続します。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3 行</span><span class="lurus-stat__label">LangGraph への接続</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">マイクロ秒級</span><span class="lurus-stat__label">クラッシュリカバリ</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">30+</span><span class="lurus-stat__label">モデル価格表</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">v0.1.0</span><span class="lurus-stat__label">lumen-cli</span></div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> コア機能</span>
  <h2 class="lurus-section-head__title">三位一体の信頼性</h2>
  <p class="lurus-section-head__lede">リプレイ、リカバリ、コスト — 一度の接続ですべて準備完了。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-lumen)"
  :items="[
    { title: 'Replay — ゼロコストの決定論的リプレイ', icon: 'rewind', body: 'trace JSON から任意の実行をリプレイし、LLM を呼ばずコストをかけずに、指定したステップから問題を精密に特定できます。lumen replay TRACE_ID（完全）/ --from 5（第 5 ステップから）。' },
    { title: 'Crash Recovery — マイクロ秒級のクラッシュリカバリ', icon: 'life-buoy', body: 'LangGraph CheckpointSaver を完全実装し、ネイティブの SQLite/Redis Checkpointer をそのまま置き換えます。メモリ+ディスクの二層、アトミック書き込み、リカバリはエンジン級の WAL リプレイで実現し、外部サービスへの依存はゼロです。' },
    { title: 'Cost Tracking — リアルタイムのコスト追跡', icon: 'coins', body: '30+ のモデル価格表（Claude / GPT-4o / Gemini / Llama / DeepSeek）を内蔵し、LLM が料金を返さなくても見積もり可能です。単一呼び出しが平均値の 2 倍を超えると自動でアラート。lumen cost --last 24h / lumen traces。' },
  ]"
/>

### その他の機能

| 機能 | 説明 |
|------|------|
| **Agent 管理** | Agent の作成、起動、停止、削除 |
| **ワークフローのデバッグ** | ワークフローをローカルで実行し、ステップ単位でデバッグ |
| **ログ閲覧** | Agent の実行ログをリアルタイムで閲覧 |
| **デプロイ** | Agent を Kova クラウドインスタンスにデプロイ |
| **MCP 管理** | MCP ツールサービスのインストールと設定 |
| **インタラクティブ REPL** | ターミナルで直接 Agent と対話 |

---

## インストール

```bash
pip install lumen-ai                          # Python SDK（推荐）
curl -fsSL https://get.lurus.cn/lumen | sh    # CLI macOS/Linux
# Windows (PowerShell): irm https://get.lurus.cn/lumen.ps1 | iex
# 从源码（Rust 1.93+，首次编译约 2-3 分钟）：
git clone https://github.com/hanmahong5-arch/lumen.git && cd lumen && cargo build --release
# 二进制在 target/release/lumen
```

検証：`lumen --version`（→ `lumen 0.1.0`）；`lumen doctor`（Lurus API connected / Kova optional をチェック）。

---

## クイックスタート

```bash
# 初始化项目（结构: agent.toml / prompts/system.md / tools/search.yaml / workflows/main.yaml）
lumen init my-agent && cd my-agent

# 配置 API Key
lumen auth login                              # 浏览器登录授权自动配置
lumen config set api_key sk-your-lurus-key    # 或直接设置

# 本地运行 Agent
lumen run --interactive                       # 交互模式
lumen run "分析这段代码的性能问题" --file ./main.py
lumen run "翻译这段文本" --model gpt-4o        # 指定模型

# 工作流调试
lumen workflow run main --input topic="AI trends"
lumen workflow run main --step-by-step        # 逐步调试（每步暂停）
lumen workflow history main --last            # 上次运行结果
```

---

## よく使うコマンド

```bash
# Agent 管理
lumen agent list / create researcher / info researcher / logs researcher / delete researcher
# MCP 工具
lumen mcp list / install github / test github / remove github
# 部署
lumen deploy --target kova        # 或 --target docker
lumen deploy status
# 配置
lumen config list / set api_key xxx / get api_key
```

---

## 設定ファイル

`agent.toml` は Agent プロジェクトのコア設定です：

```toml
[agent]
name = "my-researcher"
model = "deepseek-chat"
max_iterations = 20

[agent.llm]
base_url = "https://api.lurus.cn/v1"
temperature = 0.7
max_tokens = 4096

[tools]
builtin = ["web_search", "file_read", "file_write"]

[[tools.mcp]]
name = "github"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]

[deploy]
target = "kova"
```

---

## Kova との関係

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen</div>
    <p class="lurus-card__body">開発者向けコマンドラインツール — ローカル開発、デバッグ、デプロイ。軽量ランタイム <code>lumen run</code> ですぐに使えます。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">Agent ランタイムエンジン — 永続化実行、WAL、クラスタ管理。<code>lumen deploy</code> 後に完全な永続化とクラスタ機能を獲得します。</p>
  </div>
</div>

ローカル開発では軽量ランタイム（`lumen run`）を使い、Kova にデプロイ（`lumen deploy`）すると完全な永続化とクラスタ機能を獲得できます。

---

## 他のソリューションとの比較

<ComparisonTable
  self-label="Lumen"
  :competitors="['Temporal', 'LangGraph Checkpointer', 'Conductor']"
  :rows="[
    { dimension: 'Replay', self: 'ゼロコストの LLM リプレイ', alt: { Temporal: 'Event replay', 'LangGraph Checkpointer': '部分対応', Conductor: 'Workflow replay' } },
    { dimension: '接続コスト', self: '3 行のコード', alt: { Temporal: 'Worker + SDK', 'LangGraph Checkpointer': '設定', Conductor: 'Worker' } },
    { dimension: 'Cost 追跡', self: '内蔵', alt: { Temporal: 'なし', 'LangGraph Checkpointer': 'なし', Conductor: 'なし' } },
  ]"
  title="比較"
/>

---

## 関連製品と次のステップ

<NextSteps
  :steps="[
    { text: 'クイックスタート', link: '/ja/lumen/quickstart', primary: true },
    { text: 'Python SDK', link: '/ja/lumen/python-sdk' },
    { text: 'CLI ハンドブック', link: '/ja/lumen/cli' },
    { text: '統合と MCP ディレクトリ', link: '/integrations/' },
    { text: 'MCP プロトコル公式ドキュメント', link: 'https://modelcontextprotocol.io/', external: true },
  ]"
  title="次のステップ"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 20px 0 8px; }
.lumen-page .lurus-stat-strip { margin: 18px 0 4px; }
</style>
