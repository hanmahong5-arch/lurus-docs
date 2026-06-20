---
title: "튜토리얼 — 기억을 갖춘 AI 고객 지원 봇 만들기"
description: "MemX + Kova + Lurus API로 장기 기억을 갖춘 고객 지원 Agent를 만듭니다. 완성된 프로젝트 산출물 포함."
---

<div class="memagent-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> MemX × Kova × Lurus API</span>
  <h1 class="lurus-section-head__title">기억을 갖춘 AI 고객 지원 봇 만들기</h1>
  <p class="lurus-section-head__lede"><strong>목표</strong>: 30분 안에 사용자의 과거 질문을 기억하고, 충돌 시 자동 복구하며, 필요에 따라 지식을 증류하는 고객 지원 Agent를 완성합니다.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">30분</span><span class="lurus-stat__label">완성 목표</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6단계</span><span class="lurus-stat__label">의존성부터 기록까지</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3개 서비스</span><span class="lurus-stat__label">MemX · Kova · API</span></div>
</div>

## <Icon name="network" :size="20" /> 아키텍처 다이어그램

세 서비스가 각자의 역할을 맡습니다. MemX는 장기 기억의 회수와 증류를 담당하고, Lurus API는 LLM 호출을 담당하며, Kova WAL은 상태 영속화와 충돌 복구를 담당합니다.

<ArchitectureDiagram title="기억을 갖춘 AI 고객 지원 봇 아키텍처" chart="graph LR
  U[사용자] --> W[Web 프론트엔드]
  W -->|HTTP| A[Agent App]
  A -->|1. 회수| M[MemX]
  A -->|2. LLM| L[Lurus API]
  A -->|3. 상태| K[Kova WAL]
  A -->|4. 기록| M
  L --> A
  M --> A" />

## <Icon name="workflow" :size="20" /> 6단계

<ol class="lurus-steps">
<li>

**의존성 준비**

```bash
pip install lurus memx-client kova-py lumen-ai openai
```

</li>
<li>

**세 서비스 초기화**

```python
from openai import OpenAI
from memx import Memory
from kova import KovaClient

llm = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-...")
mem = Memory(config={"ace_enabled": True})
kova = KovaClient("kova://localhost")
```

</li>
<li>

**Agent 상태 정의**

```python
from typing import TypedDict, Annotated, Sequence

class State(TypedDict):
    user_id: str
    messages: Annotated[Sequence, "chat history"]
    relevant_memory: list
```

</li>
<li>

**과거 기억 회수** — MemX에서 현재 질문과 관련된 기억을 가져옵니다

```python
def retrieve_memory(state: State) -> State:
    last = state["messages"][-1]["content"]
    hits = mem.search(last, user_id=state["user_id"], limit=5)
    return {**state, "relevant_memory": hits}
```

</li>
<li>

**LLM 호출 및 응답 반환** — 회수한 사실을 system prompt에 주입합니다

```python
def respond(state: State) -> State:
    context = "\n".join(h["text"] for h in state["relevant_memory"])
    resp = llm.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": f"已知事实:\n{context}"},
            *state["messages"],
        ],
    )
    reply = resp.choices[0].message.content
    return {**state, "messages": [*state["messages"], {"role": "assistant", "content": reply}]}
```

</li>
<li>

**증류 후 기록** — 새 대화를 MemX에 다시 기록하면 다음 회수 시 바로 사용할 수 있습니다

```python
def distill(state: State) -> State:
    mem.add(
        list(state["messages"][-2:]),
        user_id=state["user_id"],
        scope="support:general",
    )
    return state
```

</li>
</ol>

## <Icon name="life-buoy" :size="20" /> Kova 충돌 복구 추가

Kova를 LangGraph의 checkpointer로 연결하면, Agent가 충돌한 뒤 WAL에서 복구하며 **LLM을 다시 호출하지 않습니다**.

```python
from kova.langgraph import KovaCheckpointer

graph = wf.compile(checkpointer=KovaCheckpointer(kova))
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">왜 LLM을 다시 호출하지 않는가</p>
    <div class="lurus-callout__body"><p>Kova는 각 단계마다 사전 기록 로그(WAL)를 남깁니다. 프로세스가 충돌한 뒤 엔진은 중단 지점부터 실행 상태를 재생하며, 이미 완료된 LLM 호출은 다시 발생하지 않습니다. 덕분에 토큰을 절약하면서도 응답의 일관성을 보장합니다.</p></div>
  </div>
</div>

## <Icon name="package" :size="20" /> 완성된 프로젝트 산출물

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="github" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">예제 저장소</p>
    <div class="lurus-callout__body"><p><a href="https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent">https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent</a> — 코드 완성본, <code>docker-compose.yml</code>(로컬에서 MemX + Kova 기동), 세 노드를 커버하는 Pytest, <code>.env.example</code>을 포함합니다.</p></div>
  </div>
</div>

## 다음 단계

<NextSteps :steps="[
  { text: 'Lumen 가관측성 추가', link: '/ko/tutorials/lumen-kova-langgraph', primary: true },
  { text: 'MemX 개념 깊이 파기', link: '/ko/memx/concepts' },
  { text: 'Kova 클러스터에 배포', link: '/ko/kova/quickstart' },
]" />

</div>
