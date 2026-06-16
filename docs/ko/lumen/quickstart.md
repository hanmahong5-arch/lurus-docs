---
title: Lumen 빠른 시작
description: 세 줄의 코드로 Lumen을 LangGraph / Agent 프로젝트에 연동하고, 첫 Trace와 비용을 확인하세요.
---

<div class="lumen-page">

# Lumen 빠른 시작 <StatusBadge status="dev" />

10분 만에 완료: 설치 → LangGraph 연동 → 첫 Trace 확인 → Replay 실행 → 24시간 비용 집계.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">10분</span><span class="lurus-stat__label">전체 소요</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3줄</span><span class="lurus-stat__label">연동 코드</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">0</span><span class="lurus-stat__label">비즈니스 로직 변경</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">사전 조건</p>
    <div class="lurus-callout__body">Python 3.9+ · Lurus <Term t="API Key">API Key</Term>（<a href="/ko/guide/get-api-key">발급 방법</a>）· 기존 LangGraph/LangChain Agent 프로젝트（없으면 아래 최소 예제 사용）.</div>
  </div>
</div>

<ol class="lurus-steps">

<li>

**설치 및 세 줄로 LangGraph 연동**

```bash
pip install lumen-ai
```
```python
from lumen_ai import LumenTracer, LumenCheckpointer
graph = workflow.compile(
    checkpointer=LumenCheckpointer(),   # 崩溃恢复
    callbacks=[LumenTracer()],           # 执行追踪 + 成本追踪
)
```

비즈니스 로직을 변경할 필요 없이, 모든 LLM 호출, 도구 호출, 상태 변경이 Lumen 백엔드에 기록됩니다.

</li>

<li>

**최소 실행 예제 실행**

```python
from langgraph.graph import StateGraph, END
from lumen_ai import LumenTracer, LumenCheckpointer
from typing import TypedDict

class State(TypedDict):
    query: str
    result: str

def search(state: State) -> State:
    return {**state, "result": f"已处理: {state['query']}"}

wf = StateGraph(State)
wf.add_node("search", search)
wf.set_entry_point("search")
wf.add_edge("search", END)

graph = wf.compile(
    checkpointer=LumenCheckpointer(),
    callbacks=[LumenTracer()],
)

graph.invoke({"query": "什么是 WAL"})
```

</li>

<li>

**Trace 확인**

콘솔（기본 `http://localhost:7070`）또는 Lurus 콘솔의 Lumen 페이지에 접속하세요: 각 graph 실행의 전체 타임라인, 노드별 입력/출력/소요 시간, LLM 호출의 prompt/completion/Token 수.

</li>

<li>

**Replay 실행**

이력 실행 시퀀스에서 한 번 재생하며, **Token을 소비하지 않습니다**（로컬 버그 재현, 수정 검증, Prompt A/B에 사용）：

```python
from lumen_ai import Replay
Replay.from_run_id("run_abc123").play()
```

</li>

<li>

**24시간 비용 집계**

```python
from lumen_ai import CostTracker

print(CostTracker.summary(hours=24))
# { total_tokens: 128_340, cost_rmb: 12.47, by_model: {...} }
```

</li>

</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Replay는 비용이 들지 않음</p>
    <div class="lurus-callout__body">Replay는 기록된 실행 시퀀스에서 재생하며, <strong>LLM을 다시 호출하지 않습니다</strong>. 따라서 버그 재현, 수정 검증, Prompt A/B 모두 Token 비용이 0입니다.</div>
  </div>
</div>

## 다음 단계

<NextSteps
  :steps="[
    { text: 'Python SDK — LumenTracer / LumenCheckpointer / CostTracker 상세', link: '/ko/lumen/python-sdk', primary: true },
    { text: 'CLI 매뉴얼 — 자주 쓰는 명령과 자동화 스캐폴딩', link: '/ko/lumen/cli' },
    { text: '생태계 통합 — Kova / LangGraph / OpenTelemetry와 연동', link: '/ko/lumen/integration' },
  ]"
  title="다음 단계"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-stat-strip { margin: 16px 0 8px; }
</style>
