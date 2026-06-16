---
title: Kova API 레퍼런스
description: Kova Agent 실행 엔진 REST API, 35+ 엔드포인트, Axum 기반.
---

<div class="kova-api">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> API 레퍼런스</span>
  <h1 class="lurus-section-head__title">Kova API 레퍼런스</h1>
  <p class="lurus-section-head__lede">Axum 기반의 완전한 REST API, 35+ 엔드포인트, 통일된 JSON 형식 —— Agent, 태스크, Workflow, Swarm, WAL 및 시스템 관리를 포괄합니다.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">35+</span><span class="lurus-stat__label">REST 엔드포인트</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Axum</span><span class="lurus-stat__label">런타임</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">JSON</span><span class="lurus-stat__label">통일 형식</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">SSE</span><span class="lurus-stat__label">실시간 이벤트 스트림</span></div>
</div>

## <Term t="Base URL">Base URL</Term>

```
http://localhost:3000/api/v1
```

## 인증

모든 요청은 `X-API-Key` header를 통해 API key를 전달합니다 <span class="lurus-tag">필수</span>:

```
X-API-Key: sk-kova-<64자리 16진수>
```

key 형식: `^sk-kova-[a-f0-9]{64}$`, `create-tester.sh`로 생성되며 `testers/<NAME>/.env`에 저장됩니다(chmod 600).

## 속도 제한

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="timer" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">멱등 윈도우</p>
    <div class="lurus-callout__body"><code>POST /agents/:id/run</code> 15s 이내에 동일한 agent를 중복 제출하면 <code>409 Conflict</code>를 반환합니다.</div>
  </div>
</div>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="gauge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">백프레셔 제한</p>
    <div class="lurus-callout__body">dispatch 큐가 80% 차면 <code>429 Too Many Requests</code>를 반환합니다(<code>Retry-After: 5</code> 포함).</div>
  </div>
</div>

---

## Agent 관리

<ApiEndpoint method="POST" path="/api/v1/agents" description="Agent 생성" />
<ApiEndpoint method="GET" path="/api/v1/agents" description="Agent 목록 조회(status / limit / offset 지원)" />
<ApiEndpoint method="GET" path="/api/v1/agents/:id" description="Agent 상세 조회" />
<ApiEndpoint method="PUT" path="/api/v1/agents/:id" description="Agent 업데이트" />
<ApiEndpoint method="DELETE" path="/api/v1/agents/:id" description="Agent 삭제" />

생성 요청 본문:
```json
{ "name": "researcher", "system_prompt": "你是一个专业的研究员...", "model": "deepseek-chat",
  "tools": ["web_search", "file_write"],
  "config": { "max_tokens": 4096, "temperature": 0.7, "max_iterations": 20 } }
```
응답 (201): `{ "id": "agt_a1b2c3d4", "name": "researcher", "status": "idle", "created_at": "2026-03-17T10:00:00Z" }`

목록 조회 시 query 파라미터를 사용할 수 있습니다 `GET /api/v1/agents?status=idle&limit=20&offset=0`.

::: warning
`idle` 또는 `completed` 상태의 Agent만 삭제할 수 있습니다. 실행 중인 Agent는 먼저 중지해야 합니다.
:::

---

## 태스크 실행

<ApiEndpoint method="POST" path="/api/v1/agents/:id/run" description="Agent 태스크 실행 트리거" />
<ApiEndpoint method="GET" path="/api/v1/events" description="SSE 이벤트 스트림(모든 agent 이벤트 실시간 푸시)" />
<ApiEndpoint method="POST" path="/api/v1/tasks/:id/stop" description="태스크 중지" />
<ApiEndpoint method="GET" path="/api/v1/tasks" description="태스크 목록 조회(agent_id / status / limit 지원)" />

실행 트리거 요청 본문:
```json
{ "message": "研究 WebAssembly 在服务端的最新发展",
  "context": { "output_format": "markdown", "max_length": 2000 } }
```
응답 (200): `{ "task_id": "tsk_e5f6g7h8", "status": "running", "agent_id": "agt_a1b2c3d4" }`

::: tip 멱등성
15s 이내에 동일한 agent에 중복 제출하면 `409 Conflict`를 반환합니다. dispatch 큐가 ≥80%일 때 `429 Too Many Requests`를 반환합니다(`Retry-After: 5` 포함).
:::

### 실시간 이벤트 스트림(SSE)

`GET /api/v1/events`는 모든 agent 이벤트를 푸시하며, 선택적 query 파라미터 `?workflow_id=<id>&tenant=<slug>`를 사용할 수 있습니다. 요청 헤더:
```
Accept: text/event-stream
X-API-Key: sk-kova-<64자리 16진수>
```

SSE 프레임 예시:
```json
{"type": "thinking", "content": "正在分析搜索结果..."}
{"type": "tool_call", "tool": "web_search", "input": {"query": "WASM server-side 2026"}}
{"type": "tool_result", "tool": "web_search", "output": "..."}
{"type": "output", "content": "根据搜索结果..."}
{"type": "completed", "task_id": "tsk_e5f6g7h8"}
```

태스크 목록 조회 시 query 파라미터를 사용할 수 있습니다 `GET /api/v1/tasks?agent_id=agt_a1b2c3d4&status=completed&limit=20`.

---

## 워크플로 관리

<ApiEndpoint method="POST" path="/api/v1/workflows" description="워크플로 생성" />
<ApiEndpoint method="POST" path="/api/v1/workflows/:name/run" description="워크플로 실행" />
<ApiEndpoint method="GET" path="/api/v1/workflows/:name/runs/:run_id" description="실행 상태 조회" />
<ApiEndpoint method="GET" path="/api/v1/workflows" description="워크플로 목록 조회" />

생성 요청 본문:
```json
{ "name": "content-pipeline", "description": "内容创作管道",
  "steps": [
    { "name": "research", "agent": "researcher", "prompt": "调研主题：{{input.topic}}" },
    { "name": "write", "agent": "writer", "prompt": "基于研究结果撰写文章：\n{{steps.research.output}}",
      "error_policy": "retry", "max_retries": 2 }
  ] }
```

실행 시 요청 본문은 `{ "input": { "topic": "边缘计算趋势" } }`입니다.

---

## Swarm 관리

<ApiEndpoint method="POST" path="/api/v1/swarms" description="Swarm 생성" />
<ApiEndpoint method="POST" path="/api/v1/swarms/:name/tasks" description="Swarm에 태스크 전송" />

생성 요청 본문:
```json
{ "name": "dev-team", "coordinator": "project-manager", "agents": ["researcher", "coder", "tester"],
  "config": { "max_rounds": 10, "consensus_required": false } }
```

---

## WAL 관리

<ApiEndpoint method="GET" path="/api/v1/wal/status" description="WAL 상태 조회" />
<ApiEndpoint method="POST" path="/api/v1/wal/compact" description="WAL 압축 트리거" />

상태 응답 예시:
```json
{ "total_entries": 1024, "pending_entries": 0, "corrupted_entries": 0, "buffer_usage": 0.35, "last_compaction": "2026-03-17T08:00:00Z" }
```

---

## 시스템 관리

<ApiEndpoint method="GET" path="/api/v1/health" description="헬스 체크" />
<ApiEndpoint method="GET" path="/api/v1/metrics" description="시스템 지표(Prometheus 형식)" />

---

## 에러 응답

통일 형식: `{ "error": { "code": "agent_not_found", "message": "Agent with id 'agt_xxx' not found", "details": null } }`

| HTTP | 에러 코드 | 설명 |
|------|--------|------|
| 400 | `invalid_request` | 요청 파라미터 오류 |
| 401 | `unauthorized` | `X-API-Key` 누락 또는 무효 |
| 404 | `agent_not_found` | Agent가 존재하지 않음 |
| 409 | `agent_busy` | 15s 멱등 윈도우 내 중복 제출 |
| 422 | `workflow_invalid` | 워크플로 정의 오류 |
| 429 | `queue_full` | dispatch 큐 ≥80%, 백프레셔 속도 제한 발동 |
| 500 | `internal_error` | 내부 오류 |
| 503 | `wal_error` | WAL 시스템 이상 |

---

## 다음 단계

<NextSteps title="다음 단계" :steps="[
  { text: '빠른 시작 — 5분 만에 첫 Agent 실행', link: '/ko/kova/quickstart', primary: true },
  { text: '핵심 개념 — WAL / Workflow / Swarm 설계', link: '/ko/kova/concepts' },
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
