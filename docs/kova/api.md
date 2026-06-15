---
title: Kova API 参考
description: Kova Agent 执行引擎 REST API，35+ 端点，基于 Axum 构建。
---

<div class="kova-api">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> API 参考</span>
  <h1 class="lurus-section-head__title">Kova API 参考</h1>
  <p class="lurus-section-head__lede">基于 Axum 构建的完整 REST API，35+ 端点，统一 JSON 格式 —— 覆盖 Agent、任务、Workflow、Swarm、WAL 与系统管理。</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">35+</span><span class="lurus-stat__label">REST 端点</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Axum</span><span class="lurus-stat__label">运行时</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">JSON</span><span class="lurus-stat__label">统一格式</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">SSE</span><span class="lurus-stat__label">实时事件流</span></div>
</div>

## <Term t="Base URL">Base URL</Term>

```
http://localhost:3000/api/v1
```

## 认证

所有请求通过 `X-API-Key` header 传递 API key <span class="lurus-tag">必填</span>：

```
X-API-Key: sk-kova-<64位十六进制>
```

key 格式：`^sk-kova-[a-f0-9]{64}$`，由 `create-tester.sh` 生成，存于 `testers/<NAME>/.env`（chmod 600）。

## 速率限制

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="timer" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">幂等窗口</p>
    <div class="lurus-callout__body"><code>POST /agents/:id/run</code> 15s 内重复提交同一 agent 返回 <code>409 Conflict</code>。</div>
  </div>
</div>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="gauge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">背压限制</p>
    <div class="lurus-callout__body">dispatch 队列满 80% 时返回 <code>429 Too Many Requests</code>（含 <code>Retry-After: 5</code>）。</div>
  </div>
</div>

---

## Agent 管理

<ApiEndpoint method="POST" path="/api/v1/agents" description="创建 Agent" />
<ApiEndpoint method="GET" path="/api/v1/agents" description="列出 Agent（支持 status / limit / offset）" />
<ApiEndpoint method="GET" path="/api/v1/agents/:id" description="获取 Agent 详情" />
<ApiEndpoint method="PUT" path="/api/v1/agents/:id" description="更新 Agent" />
<ApiEndpoint method="DELETE" path="/api/v1/agents/:id" description="删除 Agent" />

创建请求体：
```json
{ "name": "researcher", "system_prompt": "你是一个专业的研究员...", "model": "deepseek-chat",
  "tools": ["web_search", "file_write"],
  "config": { "max_tokens": 4096, "temperature": 0.7, "max_iterations": 20 } }
```
响应 (201)：`{ "id": "agt_a1b2c3d4", "name": "researcher", "status": "idle", "created_at": "2026-03-17T10:00:00Z" }`

列出时可用 query 参数 `GET /api/v1/agents?status=idle&limit=20&offset=0`。

::: warning
只能删除 `idle` 或 `completed` 状态的 Agent。运行中的需先停止。
:::

---

## 任务执行

<ApiEndpoint method="POST" path="/api/v1/agents/:id/run" description="触发 Agent 执行任务" />
<ApiEndpoint method="GET" path="/api/v1/events" description="SSE 事件流（实时推送所有 agent 事件）" />
<ApiEndpoint method="POST" path="/api/v1/tasks/:id/stop" description="停止任务" />
<ApiEndpoint method="GET" path="/api/v1/tasks" description="列出任务（支持 agent_id / status / limit）" />

触发执行请求体：
```json
{ "message": "研究 WebAssembly 在服务端的最新发展",
  "context": { "output_format": "markdown", "max_length": 2000 } }
```
响应 (200)：`{ "task_id": "tsk_e5f6g7h8", "status": "running", "agent_id": "agt_a1b2c3d4" }`

::: tip 幂等性
15s 内对同一 agent 重复提交返回 `409 Conflict`；dispatch 队列 ≥80% 时返回 `429 Too Many Requests`（含 `Retry-After: 5`）。
:::

### 实时事件流（SSE）

`GET /api/v1/events` 推送所有 agent 事件，可选 query 参数 `?workflow_id=<id>&tenant=<slug>`。请求头：
```
Accept: text/event-stream
X-API-Key: sk-kova-<64位十六进制>
```

SSE 帧示例：
```json
{"type": "thinking", "content": "正在分析搜索结果..."}
{"type": "tool_call", "tool": "web_search", "input": {"query": "WASM server-side 2026"}}
{"type": "tool_result", "tool": "web_search", "output": "..."}
{"type": "output", "content": "根据搜索结果..."}
{"type": "completed", "task_id": "tsk_e5f6g7h8"}
```

列出任务可用 query 参数 `GET /api/v1/tasks?agent_id=agt_a1b2c3d4&status=completed&limit=20`。

---

## 工作流管理

<ApiEndpoint method="POST" path="/api/v1/workflows" description="创建工作流" />
<ApiEndpoint method="POST" path="/api/v1/workflows/:name/run" description="执行工作流" />
<ApiEndpoint method="GET" path="/api/v1/workflows/:name/runs/:run_id" description="查看执行状态" />
<ApiEndpoint method="GET" path="/api/v1/workflows" description="列出工作流" />

创建请求体：
```json
{ "name": "content-pipeline", "description": "内容创作管道",
  "steps": [
    { "name": "research", "agent": "researcher", "prompt": "调研主题：{{input.topic}}" },
    { "name": "write", "agent": "writer", "prompt": "基于研究结果撰写文章：\n{{steps.research.output}}",
      "error_policy": "retry", "max_retries": 2 }
  ] }
```

执行时请求体为 `{ "input": { "topic": "边缘计算趋势" } }`。

---

## Swarm 管理

<ApiEndpoint method="POST" path="/api/v1/swarms" description="创建 Swarm" />
<ApiEndpoint method="POST" path="/api/v1/swarms/:name/tasks" description="向 Swarm 发送任务" />

创建请求体：
```json
{ "name": "dev-team", "coordinator": "project-manager", "agents": ["researcher", "coder", "tester"],
  "config": { "max_rounds": 10, "consensus_required": false } }
```

---

## WAL 管理

<ApiEndpoint method="GET" path="/api/v1/wal/status" description="查询 WAL 状态" />
<ApiEndpoint method="POST" path="/api/v1/wal/compact" description="触发 WAL 压缩" />

状态响应示例：
```json
{ "total_entries": 1024, "pending_entries": 0, "corrupted_entries": 0, "buffer_usage": 0.35, "last_compaction": "2026-03-17T08:00:00Z" }
```

---

## 系统管理

<ApiEndpoint method="GET" path="/api/v1/health" description="健康检查" />
<ApiEndpoint method="GET" path="/api/v1/metrics" description="系统指标（Prometheus 格式）" />

---

## 错误响应

统一格式：`{ "error": { "code": "agent_not_found", "message": "Agent with id 'agt_xxx' not found", "details": null } }`

| HTTP | 错误码 | 说明 |
|------|--------|------|
| 400 | `invalid_request` | 请求参数错误 |
| 401 | `unauthorized` | 缺少或无效的 `X-API-Key` |
| 404 | `agent_not_found` | Agent 不存在 |
| 409 | `agent_busy` | 15s 幂等窗口内重复提交 |
| 422 | `workflow_invalid` | 工作流定义有误 |
| 429 | `queue_full` | dispatch 队列 ≥80%，触发背压限速 |
| 500 | `internal_error` | 内部错误 |
| 503 | `wal_error` | WAL 系统异常 |

---

## 下一步

<NextSteps title="下一步" :steps="[
  { text: '快速开始 — 5 分钟启动第一个 Agent', link: '/kova/quickstart', primary: true },
  { text: '核心概念 — WAL / Workflow / Swarm 设计', link: '/kova/concepts' },
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
