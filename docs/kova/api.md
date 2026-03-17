# API 参考

Kova 提供完整的 REST API（基于 Axum 构建），包含 35+ 个端点。所有请求和响应均使用 JSON 格式。

## Base URL

```
http://localhost:8080/api/v1
```

---

## Agent 管理

### 创建 Agent

```http
POST /api/v1/agents
```

**请求体**:
```json
{
  "name": "researcher",
  "system_prompt": "你是一个专业的研究员...",
  "model": "deepseek-chat",
  "tools": ["web_search", "file_write"],
  "config": {
    "max_tokens": 4096,
    "temperature": 0.7,
    "max_iterations": 20
  }
}
```

**响应** (201):
```json
{
  "id": "agt_a1b2c3d4",
  "name": "researcher",
  "status": "idle",
  "created_at": "2026-03-17T10:00:00Z"
}
```

### 列出 Agent

```http
GET /api/v1/agents?status=idle&limit=20&offset=0
```

### 获取 Agent 详情

```http
GET /api/v1/agents/:id
```

### 更新 Agent

```http
PUT /api/v1/agents/:id
```

### 删除 Agent

```http
DELETE /api/v1/agents/:id
```

::: warning
只能删除 `idle` 或 `completed` 状态的 Agent。正在运行的 Agent 需先停止。
:::

---

## 任务执行

### 发送任务

```http
POST /api/v1/agents/:id/tasks
```

**请求体**:
```json
{
  "message": "研究 WebAssembly 在服务端的最新发展",
  "context": {
    "output_format": "markdown",
    "max_length": 2000
  }
}
```

**响应** (202):
```json
{
  "task_id": "tsk_e5f6g7h8",
  "status": "running",
  "agent_id": "agt_a1b2c3d4"
}
```

### 查看任务状态

```http
GET /api/v1/tasks/:id
```

**响应**:
```json
{
  "task_id": "tsk_e5f6g7h8",
  "status": "completed",
  "agent_id": "agt_a1b2c3d4",
  "output": "# WebAssembly 服务端发展报告\n\n...",
  "usage": {
    "total_tokens": 3842,
    "iterations": 5,
    "tools_called": 3,
    "duration_ms": 12500
  }
}
```

### 流式监控（WebSocket）

```
WS /api/v1/tasks/:id/stream
```

实时推送任务执行事件：

```json
{"type": "thinking", "content": "正在分析搜索结果..."}
{"type": "tool_call", "tool": "web_search", "input": {"query": "WASM server-side 2026"}}
{"type": "tool_result", "tool": "web_search", "output": "..."}
{"type": "output", "content": "根据搜索结果..."}
{"type": "completed", "task_id": "tsk_e5f6g7h8"}
```

### 停止任务

```http
POST /api/v1/tasks/:id/stop
```

### 列出任务

```http
GET /api/v1/tasks?agent_id=agt_a1b2c3d4&status=completed&limit=20
```

---

## 工作流管理

### 创建工作流

```http
POST /api/v1/workflows
```

**请求体**:
```json
{
  "name": "content-pipeline",
  "description": "内容创作管道",
  "steps": [
    {
      "name": "research",
      "agent": "researcher",
      "prompt": "调研主题：{{input.topic}}"
    },
    {
      "name": "write",
      "agent": "writer",
      "prompt": "基于研究结果撰写文章：\n{{steps.research.output}}",
      "error_policy": "retry",
      "max_retries": 2
    }
  ]
}
```

### 执行工作流

```http
POST /api/v1/workflows/:name/run
```

**请求体**:
```json
{
  "input": {
    "topic": "边缘计算趋势"
  }
}
```

### 查看工作流执行状态

```http
GET /api/v1/workflows/:name/runs/:run_id
```

### 列出工作流

```http
GET /api/v1/workflows
```

---

## Swarm 管理

### 创建 Swarm

```http
POST /api/v1/swarms
```

**请求体**:
```json
{
  "name": "dev-team",
  "coordinator": "project-manager",
  "agents": ["researcher", "coder", "tester"],
  "config": {
    "max_rounds": 10,
    "consensus_required": false
  }
}
```

### 向 Swarm 发送任务

```http
POST /api/v1/swarms/:name/tasks
```

---

## WAL 管理

### 查看 WAL 状态

```http
GET /api/v1/wal/status
```

**响应**:
```json
{
  "total_entries": 1024,
  "pending_entries": 0,
  "corrupted_entries": 0,
  "buffer_usage": 0.35,
  "last_compaction": "2026-03-17T08:00:00Z"
}
```

### 触发 WAL 压缩

```http
POST /api/v1/wal/compact
```

---

## 系统管理

### 健康检查

```http
GET /api/v1/health
```

### 系统指标

```http
GET /api/v1/metrics
```

返回 Prometheus 格式的指标数据。

---

## 错误响应

所有错误遵循统一格式：

```json
{
  "error": {
    "code": "agent_not_found",
    "message": "Agent with id 'agt_xxx' not found",
    "details": null
  }
}
```

| HTTP 状态码 | 常见错误码 | 说明 |
|-------------|----------|------|
| 400 | `invalid_request` | 请求参数错误 |
| 404 | `agent_not_found` | Agent 不存在 |
| 409 | `agent_busy` | Agent 正在执行任务 |
| 422 | `workflow_invalid` | 工作流定义有误 |
| 500 | `internal_error` | 内部错误 |
| 503 | `wal_error` | WAL 系统异常 |
