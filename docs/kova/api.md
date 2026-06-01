---
title: Kova API 参考
description: Kova Agent 执行引擎 REST API，35+ 端点，基于 Axum 构建。
---

# API 参考

Kova 提供完整 REST API（基于 Axum），35+ 端点，JSON 格式。

## <Term t="Base URL">Base URL</Term>

```
http://localhost:3000/api/v1
```

## 认证

所有请求通过 `X-API-Key` header 传递 API key：

```
X-API-Key: sk-kova-<64位十六进制>
```

key 格式：`^sk-kova-[a-f0-9]{64}$`，由 `create-tester.sh` 生成，存于 `testers/<NAME>/.env`（chmod 600）。

## 速率限制

- **幂等窗口**：`POST /agents/:id/run` 15s 内重复提交同一 agent 返回 `409 Conflict`。
- **背压限制**：dispatch 队列满 80% 时返回 `429 Too Many Requests`（含 `Retry-After: 5`）。

---

## Agent 管理

`POST /api/v1/agents` 创建：
```json
{ "name": "researcher", "system_prompt": "你是一个专业的研究员...", "model": "deepseek-chat",
  "tools": ["web_search", "file_write"],
  "config": { "max_tokens": 4096, "temperature": 0.7, "max_iterations": 20 } }
```
响应 (201)：`{ "id": "agt_a1b2c3d4", "name": "researcher", "status": "idle", "created_at": "2026-03-17T10:00:00Z" }`

- `GET /api/v1/agents?status=idle&limit=20&offset=0` 列出
- `GET /api/v1/agents/:id` 详情 · `PUT /api/v1/agents/:id` 更新 · `DELETE /api/v1/agents/:id` 删除

::: warning
只能删除 `idle` 或 `completed` 状态的 Agent。运行中的需先停止。
:::

---

## 任务执行

`POST /api/v1/agents/:id/run` 触发 agent 执行：
```json
{ "message": "研究 WebAssembly 在服务端的最新发展",
  "context": { "output_format": "markdown", "max_length": 2000 } }
```
响应 (200)：`{ "task_id": "tsk_e5f6g7h8", "status": "running", "agent_id": "agt_a1b2c3d4" }`

::: tip 幂等性
15s 内对同一 agent 重复提交返回 `409 Conflict`；dispatch 队列 ≥80% 时返回 `429 Too Many Requests`（含 `Retry-After: 5`）。
:::

`GET /api/v1/events` SSE 事件流（实时推送所有 agent 事件）：
```
Accept: text/event-stream
X-API-Key: sk-kova-<64位十六进制>

# 可选 query 参数：?workflow_id=<id>&tenant=<slug>
```

SSE 帧示例：
```json
{"type": "thinking", "content": "正在分析搜索结果..."}
{"type": "tool_call", "tool": "web_search", "input": {"query": "WASM server-side 2026"}}
{"type": "tool_result", "tool": "web_search", "output": "..."}
{"type": "output", "content": "根据搜索结果..."}
{"type": "completed", "task_id": "tsk_e5f6g7h8"}
```

- `POST /api/v1/tasks/:id/stop` 停止
- `GET /api/v1/tasks?agent_id=agt_a1b2c3d4&status=completed&limit=20` 列出

---

## 工作流管理

`POST /api/v1/workflows` 创建：
```json
{ "name": "content-pipeline", "description": "内容创作管道",
  "steps": [
    { "name": "research", "agent": "researcher", "prompt": "调研主题：{{input.topic}}" },
    { "name": "write", "agent": "writer", "prompt": "基于研究结果撰写文章：\n{{steps.research.output}}",
      "error_policy": "retry", "max_retries": 2 }
  ] }
```

- `POST /api/v1/workflows/:name/run` 执行，请求体 `{ "input": { "topic": "边缘计算趋势" } }`
- `GET /api/v1/workflows/:name/runs/:run_id` 查看执行状态 · `GET /api/v1/workflows` 列出

---

## Swarm 管理

`POST /api/v1/swarms` 创建：
```json
{ "name": "dev-team", "coordinator": "project-manager", "agents": ["researcher", "coder", "tester"],
  "config": { "max_rounds": 10, "consensus_required": false } }
```
`POST /api/v1/swarms/:name/tasks` 向 Swarm 发送任务。

---

## WAL 管理

`GET /api/v1/wal/status`：
```json
{ "total_entries": 1024, "pending_entries": 0, "corrupted_entries": 0, "buffer_usage": 0.35, "last_compaction": "2026-03-17T08:00:00Z" }
```
`POST /api/v1/wal/compact` 触发压缩。

---

## 系统管理

`GET /api/v1/health` 健康检查 · `GET /api/v1/metrics` 系统指标（Prometheus 格式）。

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
