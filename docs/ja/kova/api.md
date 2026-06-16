---
title: Kova API リファレンス
description: Kova Agent 実行エンジンの REST API。35 以上のエンドポイントを Axum 上に構築。
---

<div class="kova-api">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> API リファレンス</span>
  <h1 class="lurus-section-head__title">Kova API リファレンス</h1>
  <p class="lurus-section-head__lede">Axum 上に構築された完全な REST API。35 以上のエンドポイント、統一された JSON フォーマット —— Agent、タスク、Workflow、Swarm、WAL、システム管理を網羅。</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">35+</span><span class="lurus-stat__label">REST エンドポイント</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Axum</span><span class="lurus-stat__label">ランタイム</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">JSON</span><span class="lurus-stat__label">統一フォーマット</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">SSE</span><span class="lurus-stat__label">リアルタイムイベントストリーム</span></div>
</div>

## <Term t="Base URL">Base URL</Term>

```
http://localhost:3000/api/v1
```

## 認証

すべてのリクエストは `X-API-Key` header で API key を渡します <span class="lurus-tag">必須</span>：

```
X-API-Key: sk-kova-<64桁の16進数>
```

key のフォーマット：`^sk-kova-[a-f0-9]{64}$`。`create-tester.sh` によって生成され、`testers/<NAME>/.env`（chmod 600）に保存されます。

## レート制限

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="timer" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">冪等性ウィンドウ</p>
    <div class="lurus-callout__body"><code>POST /agents/:id/run</code> で 15s 以内に同一 agent を重複送信すると <code>409 Conflict</code> を返します。</div>
  </div>
</div>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="gauge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">バックプレッシャー制限</p>
    <div class="lurus-callout__body">dispatch キューが 80% に達すると <code>429 Too Many Requests</code>（<code>Retry-After: 5</code> を含む）を返します。</div>
  </div>
</div>

---

## Agent 管理

<ApiEndpoint method="POST" path="/api/v1/agents" description="Agent を作成" />
<ApiEndpoint method="GET" path="/api/v1/agents" description="Agent を一覧表示（status / limit / offset をサポート）" />
<ApiEndpoint method="GET" path="/api/v1/agents/:id" description="Agent の詳細を取得" />
<ApiEndpoint method="PUT" path="/api/v1/agents/:id" description="Agent を更新" />
<ApiEndpoint method="DELETE" path="/api/v1/agents/:id" description="Agent を削除" />

作成リクエストボディ：
```json
{ "name": "researcher", "system_prompt": "你是一个专业的研究员...", "model": "deepseek-chat",
  "tools": ["web_search", "file_write"],
  "config": { "max_tokens": 4096, "temperature": 0.7, "max_iterations": 20 } }
```
レスポンス (201)：`{ "id": "agt_a1b2c3d4", "name": "researcher", "status": "idle", "created_at": "2026-03-17T10:00:00Z" }`

一覧表示時に使用できる query パラメータ `GET /api/v1/agents?status=idle&limit=20&offset=0`。

::: warning
削除できるのは `idle` または `completed` ステータスの Agent のみです。実行中のものは先に停止する必要があります。
:::

---

## タスク実行

<ApiEndpoint method="POST" path="/api/v1/agents/:id/run" description="Agent にタスクの実行をトリガー" />
<ApiEndpoint method="GET" path="/api/v1/events" description="SSE イベントストリーム（すべての agent イベントをリアルタイムにプッシュ）" />
<ApiEndpoint method="POST" path="/api/v1/tasks/:id/stop" description="タスクを停止" />
<ApiEndpoint method="GET" path="/api/v1/tasks" description="タスクを一覧表示（agent_id / status / limit をサポート）" />

実行トリガーのリクエストボディ：
```json
{ "message": "研究 WebAssembly 在服务端的最新发展",
  "context": { "output_format": "markdown", "max_length": 2000 } }
```
レスポンス (200)：`{ "task_id": "tsk_e5f6g7h8", "status": "running", "agent_id": "agt_a1b2c3d4" }`

::: tip 冪等性
15s 以内に同一 agent へ重複送信すると `409 Conflict` を返します。dispatch キューが 80% 以上のときは `429 Too Many Requests`（`Retry-After: 5` を含む）を返します。
:::

### リアルタイムイベントストリーム（SSE）

`GET /api/v1/events` はすべての agent イベントをプッシュします。オプションの query パラメータ `?workflow_id=<id>&tenant=<slug>` を使用できます。リクエストヘッダー：
```
Accept: text/event-stream
X-API-Key: sk-kova-<64桁の16進数>
```

SSE フレームの例：
```json
{"type": "thinking", "content": "正在分析搜索结果..."}
{"type": "tool_call", "tool": "web_search", "input": {"query": "WASM server-side 2026"}}
{"type": "tool_result", "tool": "web_search", "output": "..."}
{"type": "output", "content": "根据搜索结果..."}
{"type": "completed", "task_id": "tsk_e5f6g7h8"}
```

タスク一覧で使用できる query パラメータ `GET /api/v1/tasks?agent_id=agt_a1b2c3d4&status=completed&limit=20`。

---

## ワークフロー管理

<ApiEndpoint method="POST" path="/api/v1/workflows" description="ワークフローを作成" />
<ApiEndpoint method="POST" path="/api/v1/workflows/:name/run" description="ワークフローを実行" />
<ApiEndpoint method="GET" path="/api/v1/workflows/:name/runs/:run_id" description="実行ステータスを確認" />
<ApiEndpoint method="GET" path="/api/v1/workflows" description="ワークフローを一覧表示" />

作成リクエストボディ：
```json
{ "name": "content-pipeline", "description": "内容创作管道",
  "steps": [
    { "name": "research", "agent": "researcher", "prompt": "调研主题：{{input.topic}}" },
    { "name": "write", "agent": "writer", "prompt": "基于研究结果撰写文章：\n{{steps.research.output}}",
      "error_policy": "retry", "max_retries": 2 }
  ] }
```

実行時のリクエストボディは `{ "input": { "topic": "边缘计算趋势" } }` です。

---

## Swarm 管理

<ApiEndpoint method="POST" path="/api/v1/swarms" description="Swarm を作成" />
<ApiEndpoint method="POST" path="/api/v1/swarms/:name/tasks" description="Swarm にタスクを送信" />

作成リクエストボディ：
```json
{ "name": "dev-team", "coordinator": "project-manager", "agents": ["researcher", "coder", "tester"],
  "config": { "max_rounds": 10, "consensus_required": false } }
```

---

## WAL 管理

<ApiEndpoint method="GET" path="/api/v1/wal/status" description="WAL ステータスを照会" />
<ApiEndpoint method="POST" path="/api/v1/wal/compact" description="WAL のコンパクションをトリガー" />

ステータスレスポンスの例：
```json
{ "total_entries": 1024, "pending_entries": 0, "corrupted_entries": 0, "buffer_usage": 0.35, "last_compaction": "2026-03-17T08:00:00Z" }
```

---

## システム管理

<ApiEndpoint method="GET" path="/api/v1/health" description="ヘルスチェック" />
<ApiEndpoint method="GET" path="/api/v1/metrics" description="システムメトリクス（Prometheus フォーマット）" />

---

## エラーレスポンス

統一フォーマット：`{ "error": { "code": "agent_not_found", "message": "Agent with id 'agt_xxx' not found", "details": null } }`

| HTTP | エラーコード | 説明 |
|------|--------|------|
| 400 | `invalid_request` | リクエストパラメータが不正 |
| 401 | `unauthorized` | `X-API-Key` が欠落しているか無効 |
| 404 | `agent_not_found` | Agent が存在しない |
| 409 | `agent_busy` | 15s の冪等性ウィンドウ内での重複送信 |
| 422 | `workflow_invalid` | ワークフロー定義に誤りがある |
| 429 | `queue_full` | dispatch キューが 80% 以上、バックプレッシャーによるレート制限を発動 |
| 500 | `internal_error` | 内部エラー |
| 503 | `wal_error` | WAL システムの異常 |

---

## 次のステップ

<NextSteps title="次のステップ" :steps="[
  { text: 'クイックスタート — 5 分で最初の Agent を起動', link: '/ja/kova/quickstart', primary: true },
  { text: 'コアコンセプト — WAL / Workflow / Swarm の設計', link: '/ja/kova/concepts' },
]" />

<RelatedProducts product-id="kova" />

</div>

<style scoped>
.kova-api .lurus-stat-strip {
  margin: 1.5rem 0 2rem;
}
.kova-api .lurus-callout + .lurus-callout {
  margin-top: 0.75rem;
}
</style>
