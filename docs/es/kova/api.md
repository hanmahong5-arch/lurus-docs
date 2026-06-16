---
title: Referencia de la API de Kova
description: API REST del motor de ejecución Kova Agent, más de 35 endpoints, construida sobre Axum.
---

<div class="kova-api">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> Referencia de la API</span>
  <h1 class="lurus-section-head__title">Referencia de la API de Kova</h1>
  <p class="lurus-section-head__lede">API REST completa construida sobre Axum, más de 35 endpoints, formato JSON unificado —— cubre Agent, tareas, Workflow, Swarm, WAL y administración del sistema.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">35+</span><span class="lurus-stat__label">Endpoints REST</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Axum</span><span class="lurus-stat__label">Runtime</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">JSON</span><span class="lurus-stat__label">Formato unificado</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">SSE</span><span class="lurus-stat__label">Flujo de eventos en tiempo real</span></div>
</div>

## <Term t="Base URL">Base URL</Term>

```
http://localhost:3000/api/v1
```

## Autenticación

Todas las solicitudes pasan la API key mediante el header `X-API-Key` <span class="lurus-tag">obligatorio</span>:

```
X-API-Key: sk-kova-<64位十六进制>
```

Formato de la key: `^sk-kova-[a-f0-9]{64}$`, generada por `create-tester.sh`, almacenada en `testers/<NAME>/.env` (chmod 600).

## Límite de tasa

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="timer" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Ventana de idempotencia</p>
    <div class="lurus-callout__body"><code>POST /agents/:id/run</code> reenviar el mismo agent dentro de 15 s devuelve <code>409 Conflict</code>.</div>
  </div>
</div>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="gauge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Límite de contrapresión</p>
    <div class="lurus-callout__body">Cuando la cola de dispatch alcanza el 80 % devuelve <code>429 Too Many Requests</code> (con <code>Retry-After: 5</code>).</div>
  </div>
</div>

---

## Administración de Agent

<ApiEndpoint method="POST" path="/api/v1/agents" description="Crear Agent" />
<ApiEndpoint method="GET" path="/api/v1/agents" description="Listar Agent (admite status / limit / offset)" />
<ApiEndpoint method="GET" path="/api/v1/agents/:id" description="Obtener detalles del Agent" />
<ApiEndpoint method="PUT" path="/api/v1/agents/:id" description="Actualizar Agent" />
<ApiEndpoint method="DELETE" path="/api/v1/agents/:id" description="Eliminar Agent" />

Cuerpo de la solicitud de creación:
```json
{ "name": "researcher", "system_prompt": "你是一个专业的研究员...", "model": "deepseek-chat",
  "tools": ["web_search", "file_write"],
  "config": { "max_tokens": 4096, "temperature": 0.7, "max_iterations": 20 } }
```
Respuesta (201): `{ "id": "agt_a1b2c3d4", "name": "researcher", "status": "idle", "created_at": "2026-03-17T10:00:00Z" }`

Al listar se pueden usar los parámetros de query `GET /api/v1/agents?status=idle&limit=20&offset=0`.

::: warning
Solo se pueden eliminar Agent en estado `idle` o `completed`. Los que están en ejecución deben detenerse primero.
:::

---

## Ejecución de tareas

<ApiEndpoint method="POST" path="/api/v1/agents/:id/run" description="Disparar la ejecución de una tarea por el Agent" />
<ApiEndpoint method="GET" path="/api/v1/events" description="Flujo de eventos SSE (envía en tiempo real todos los eventos de los agent)" />
<ApiEndpoint method="POST" path="/api/v1/tasks/:id/stop" description="Detener tarea" />
<ApiEndpoint method="GET" path="/api/v1/tasks" description="Listar tareas (admite agent_id / status / limit)" />

Cuerpo de la solicitud para disparar la ejecución:
```json
{ "message": "研究 WebAssembly 在服务端的最新发展",
  "context": { "output_format": "markdown", "max_length": 2000 } }
```
Respuesta (200): `{ "task_id": "tsk_e5f6g7h8", "status": "running", "agent_id": "agt_a1b2c3d4" }`

::: tip Idempotencia
Reenviar al mismo agent dentro de 15 s devuelve `409 Conflict`; cuando la cola de dispatch está ≥80 % devuelve `429 Too Many Requests` (con `Retry-After: 5`).
:::

### Flujo de eventos en tiempo real (SSE)

`GET /api/v1/events` envía todos los eventos de los agent, con los parámetros de query opcionales `?workflow_id=<id>&tenant=<slug>`. Headers de la solicitud:
```
Accept: text/event-stream
X-API-Key: sk-kova-<64位十六进制>
```

Ejemplo de frame SSE:
```json
{"type": "thinking", "content": "正在分析搜索结果..."}
{"type": "tool_call", "tool": "web_search", "input": {"query": "WASM server-side 2026"}}
{"type": "tool_result", "tool": "web_search", "output": "..."}
{"type": "output", "content": "根据搜索结果..."}
{"type": "completed", "task_id": "tsk_e5f6g7h8"}
```

Al listar tareas se pueden usar los parámetros de query `GET /api/v1/tasks?agent_id=agt_a1b2c3d4&status=completed&limit=20`.

---

## Administración de workflows

<ApiEndpoint method="POST" path="/api/v1/workflows" description="Crear workflow" />
<ApiEndpoint method="POST" path="/api/v1/workflows/:name/run" description="Ejecutar workflow" />
<ApiEndpoint method="GET" path="/api/v1/workflows/:name/runs/:run_id" description="Consultar el estado de ejecución" />
<ApiEndpoint method="GET" path="/api/v1/workflows" description="Listar workflows" />

Cuerpo de la solicitud de creación:
```json
{ "name": "content-pipeline", "description": "内容创作管道",
  "steps": [
    { "name": "research", "agent": "researcher", "prompt": "调研主题：{{input.topic}}" },
    { "name": "write", "agent": "writer", "prompt": "基于研究结果撰写文章：\n{{steps.research.output}}",
      "error_policy": "retry", "max_retries": 2 }
  ] }
```

El cuerpo de la solicitud al ejecutar es `{ "input": { "topic": "边缘计算趋势" } }`.

---

## Administración de Swarm

<ApiEndpoint method="POST" path="/api/v1/swarms" description="Crear Swarm" />
<ApiEndpoint method="POST" path="/api/v1/swarms/:name/tasks" description="Enviar una tarea al Swarm" />

Cuerpo de la solicitud de creación:
```json
{ "name": "dev-team", "coordinator": "project-manager", "agents": ["researcher", "coder", "tester"],
  "config": { "max_rounds": 10, "consensus_required": false } }
```

---

## Administración de WAL

<ApiEndpoint method="GET" path="/api/v1/wal/status" description="Consultar el estado del WAL" />
<ApiEndpoint method="POST" path="/api/v1/wal/compact" description="Disparar la compactación del WAL" />

Ejemplo de respuesta de estado:
```json
{ "total_entries": 1024, "pending_entries": 0, "corrupted_entries": 0, "buffer_usage": 0.35, "last_compaction": "2026-03-17T08:00:00Z" }
```

---

## Administración del sistema

<ApiEndpoint method="GET" path="/api/v1/health" description="Comprobación de salud" />
<ApiEndpoint method="GET" path="/api/v1/metrics" description="Métricas del sistema (formato Prometheus)" />

---

## Respuestas de error

Formato unificado: `{ "error": { "code": "agent_not_found", "message": "Agent with id 'agt_xxx' not found", "details": null } }`

| HTTP | Código de error | Descripción |
|------|--------|------|
| 400 | `invalid_request` | Parámetros de la solicitud incorrectos |
| 401 | `unauthorized` | `X-API-Key` ausente o inválida |
| 404 | `agent_not_found` | El Agent no existe |
| 409 | `agent_busy` | Reenvío dentro de la ventana de idempotencia de 15 s |
| 422 | `workflow_invalid` | Definición del workflow errónea |
| 429 | `queue_full` | Cola de dispatch ≥80 %, dispara el límite por contrapresión |
| 500 | `internal_error` | Error interno |
| 503 | `wal_error` | Anomalía del sistema WAL |

---

## Siguientes pasos

<NextSteps title="Siguientes pasos" :steps="[
  { text: 'Inicio rápido — Lanza tu primer Agent en 5 minutos', link: '/es/kova/quickstart', primary: true },
  { text: 'Conceptos básicos — Diseño de WAL / Workflow / Swarm', link: '/es/kova/concepts' },
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
