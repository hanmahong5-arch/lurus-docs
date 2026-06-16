---
title: Kova クイックスタート
description: 5 分で最初の Kova Agent を起動。インストールから実行までの完全ガイド。
---

<div class="kova-qs-page">

# クイックスタート <StatusBadge status="dev" />

5 分で最初の Kova Agent を起動。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 分</span><span class="lurus-stat__label">所要時間の目安</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 種類</span><span class="lurus-stat__label">インストール方法</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">ゼロ</span><span class="lurus-stat__label">外部依存</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前提条件</p>
    <div class="lurus-callout__body">Docker または Rust 1.93+（いずれか）· Lurus <Term t="API Key">API Key</Term>（<a href="/ja/guide/get-api-key">取得方法</a>）· 8 GB+ メモリ（推奨）· 基本的なターミナル操作の知識。所要時間の目安は 5 分。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package" :size="14" /> インストール</span>
  <h2 class="lurus-section-head__title">Kova のインストール</h2>
  <p class="lurus-section-head__lede">Docker（推奨）、プリビルドバイナリ、またはソースからのビルド、いずれかを選択。</p>
</div>

<CodeShowcase
  title="インストール方法を 1 つ選択"
  :tabs="[
    { lang: 'bash', label: 'Docker（推奨）', code: 'docker run -d \\\n  --name kova \\\n  -p 8080:8080 \\\n  -v kova-data:/data \\\n  -e LURUS_API_KEY=sk-your-key \\\n  ghcr.io/hanmahong5-arch/kova:latest' },
    { lang: 'bash', label: 'プリビルドバイナリ', code: '# Linux / macOS\nchmod +x kova-linux-amd64\n./kova-linux-amd64 serve --port 8080' },
    { lang: 'bash', label: 'ソースからビルド', code: 'git clone https://github.com/hanmahong5-arch/agentdrq.git\ncd agentdrq\n\n# 使用 pure-rust 特性（无系统依赖）\ncargo build --workspace --no-default-features --features pure-rust --release' },
  ]"
/>

プリビルドバイナリは [GitHub Releases](https://github.com/hanmahong5-arch/agentdrq/releases) からダウンロード:

| プラットフォーム | ファイル |
|------|------|
| Linux x86_64 | `kova-linux-amd64` |
| macOS (Apple Silicon) | `kova-darwin-arm64` |
| macOS (Intel) | `kova-darwin-amd64` |
| Windows | `kova-windows-amd64.exe` |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Rust バージョン要件</p>
    <div class="lurus-callout__body">Kova は Rust 1.93+ (Edition 2024) を要求します。ツールチェーンの管理には rustup の使用を推奨します。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 設定</span>
  <h2 class="lurus-section-head__title">設定</h2>
</div>

設定ファイル `kova.toml` を作成:

```toml
[server]
port = 8080
data_dir = "./data"

[llm]
# 通过 Lurus API 接入所有模型
provider = "openai-compatible"
base_url = "https://api.lurus.cn/v1"
api_key = "sk-your-lurus-key"
default_model = "deepseek-chat"

[wal]
# WAL 持久化配置
enabled = true
sync_mode = "normal"  # "normal" | "full" (每次写入 fsync)

[security]
# 可选：启用 WAL 加密
# encrypt = true
# encrypt_algorithm = "aes-256-gcm"
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> 始める</span>
  <h2 class="lurus-section-head__title">最初の Agent を起動する</h2>
  <p class="lurus-section-head__lede">REST / Rust SDK / CLI から選択し、Agent を作成、タスクを送信、実行をストリーミングで確認。</p>
</div>

起動後、使い慣れた接続方法を選んで最初の Agent を作成・実行します（完全なエンドポイントは [API リファレンス](/ja/kova/api) を参照）。

:::tabs
== REST API

1. **Agent の作成** — `POST /api/v1/agents`、レスポンスには `id="agt_a1b2c3d4"`、`status="idle"` が含まれます

```bash
curl -X POST http://localhost:8080/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{ "name": "researcher", "system_prompt": "你是一个专业的技术研究员，深入分析主题并给出结构化研究报告。", "model": "deepseek-chat", "tools": ["web_search", "file_write"] }'
```

2. **タスクの送信** — `POST /api/v1/agents/{id}/tasks`、レスポンスには `task_id="tsk_e5f6g7h8"`、`status="running"` が含まれます

```bash
curl -X POST http://localhost:8080/api/v1/agents/agt_a1b2c3d4/tasks \
  -H "Content-Type: application/json" \
  -d '{ "message": "研究 Rust 在 AI 基础设施中的应用趋势，输出一份 500 字的报告" }'
```

3. **確認 / ストリーミング追跡** — `GET /api/v1/tasks/{id}` または WebSocket 経由で実行過程をリアルタイムに確認

```bash
curl http://localhost:8080/api/v1/tasks/tsk_e5f6g7h8
wscat -c ws://localhost:8080/api/v1/tasks/tsk_e5f6g7h8/stream
```

== Rust SDK

Kova エンジンをプロセス内に直接埋め込み、クラッシュ後はローカル WAL から自動復旧:

```rust
use kova::prelude::*;

let engine = KovaBuilder::new()
    .wal_dir("./agent-state")
    .build()?;

let agent = engine.create_agent("researcher")
    .model("deepseek-chat")
    .tools(&["web_search", "file_read"])
    .build()?;

// Agent 崩溃 → 从 WAL 自动恢复，不重调 LLM
agent.run("帮我调研 WASM Component Model").await?;
```

== CLI

Kova には TUI（ターミナル対話インターフェース）とコマンドラインが内蔵されています:

```bash
# 启动 TUI
kova tui

# 或直接用 CLI 命令
kova agent create --name researcher --model deepseek-chat
kova agent run researcher "分析 Rust 在 AI 领域的应用"
kova agent list
kova agent logs researcher --tail 50
```
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> ワークフロー</span>
  <h2 class="lurus-section-head__title">ワークフローの作成</h2>
</div>

ワークフローは複数のステップを順序付きの実行パイプラインに連結します（ステップ間はテンプレート変数で値を渡します。例は下記を参照）:

```bash
curl -X POST http://localhost:8080/api/v1/workflows \
  -H "Content-Type: application/json" \
  -d '{ "name": "content-pipeline", "steps": [
    { "name": "research", "agent": "researcher", "prompt": "研究主题：{{input.topic}}" },
    { "name": "write", "agent": "writer", "prompt": "基于研究报告撰写博客：\n{{steps.research.output}}" },
    { "name": "review", "agent": "editor", "prompt": "审校并优化：\n{{steps.write.output}}" }
  ] }'

# 触发
curl -X POST http://localhost:8080/api/v1/workflows/content-pipeline/run \
  -H "Content-Type: application/json" -d '{"input": {"topic": "边缘计算与 AI 推理"}}'
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="database-backup" :size="14" /> 永続化</span>
  <h2 class="lurus-section-head__title">永続化の検証</h2>
  <p class="lurus-section-head__lede">プロセスを強制終了し、再起動するとタスクが WAL の中断点から自動復旧します。</p>
</div>

Kova のクラッシュ復旧能力をテスト:

<ol class="lurus-steps">
<li>

**長時間タスクを起動**

```bash
kova agent run researcher "写一份 5000 字的深度报告"
```

</li>
<li>

**タスク実行中にプロセスを強制終了**

```bash
kill -9 $(pgrep kova)
```

</li>
<li>

**Kova を再起動**

```bash
./kova serve
```

</li>
<li>

**タスク状態を確認** — 中断点から自動復旧

```bash
kova task status
```

</li>
</ol>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">なぜ復旧できるのか</p>
    <div class="lurus-callout__body">各ステップの実行前に、まず <Term t="WAL">WAL</Term>（CRC32 チェック付き）を書き込みます。プロセスがクラッシュした際、完了が確認されていないステップは再起動後に中断点から再生されます——LLM を再呼び出しせず、進捗も失いません。詳しくは<a href="/ja/kova/concepts">コア概念</a>を参照。</div>
  </div>
</div>

---

## 次のステップ

<NextSteps
  :steps="[
    { text: 'コア概念 — Agent、Workflow、WAL アーキテクチャを深く理解する', link: '/ja/kova/concepts', primary: true },
    { text: 'API リファレンス — 完全な REST API エンドポイント一覧', link: '/ja/kova/api' },
    { text: 'Lurus API — 基盤となる LLM ゲートウェイを知る', link: '/ja/guide/introduction' },
  ]"
/>

</div>
