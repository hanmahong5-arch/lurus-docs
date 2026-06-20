---
title: "Tutorial — Build an AI Support Agent with Memory"
description: "Build a support Agent with long-term memory using MemX + Kova + Lurus API, complete with a full project artifact."
---

<div class="memagent-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> MemX × Kova × Lurus API</span>
  <h1 class="lurus-section-head__title">Build an AI Support Agent with Memory</h1>
  <p class="lurus-section-head__lede"><strong>Goal</strong>: in 30 minutes, get a support Agent running that remembers a user's past questions, recovers automatically from crashes, and distills knowledge on demand.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">30 minutes</span><span class="lurus-stat__label">Time to running</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6 steps</span><span class="lurus-stat__label">From dependencies to write-back</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 services</span><span class="lurus-stat__label">MemX · Kova · API</span></div>
</div>

## <Icon name="network" :size="20" /> Architecture diagram

Three services each play a distinct role: MemX handles long-term memory recall and distillation, the Lurus API handles LLM calls, and the Kova WAL handles state persistence and crash recovery.

<ArchitectureDiagram title="AI support agent with memory architecture" chart="graph LR
  U[User] --> W[Web frontend]
  W -->|HTTP| A[Agent App]
  A -->|1. Recall| M[MemX]
  A -->|2. LLM| L[Lurus API]
  A -->|3. State| K[Kova WAL]
  A -->|4. Write| M
  L --> A
  M --> A" />

## <Icon name="workflow" :size="20" /> 6 steps

<ol class="lurus-steps">
<li>

**Install dependencies**

```bash
pip install lurus memx-client kova-py lumen-ai openai
```

</li>
<li>

**Initialize the three services**

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

**Define the Agent state**

```python
from typing import TypedDict, Annotated, Sequence

class State(TypedDict):
    user_id: str
    messages: Annotated[Sequence, "chat history"]
    relevant_memory: list
```

</li>
<li>

**Recall history** — fetch memories from MemX relevant to the current question

```python
def retrieve_memory(state: State) -> State:
    last = state["messages"][-1]["content"]
    hits = mem.search(last, user_id=state["user_id"], limit=5)
    return {**state, "relevant_memory": hits}
```

</li>
<li>

**Call the LLM and return** — inject the recalled facts into the system prompt

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

**Distill and write back** — write the new conversation back to MemX so it's available on the next recall

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

## <Icon name="life-buoy" :size="20" /> Add Kova crash recovery

Wire Kova in as the LangGraph checkpointer so that after the Agent crashes it recovers from the WAL **without re-calling the LLM**:

```python
from kova.langgraph import KovaCheckpointer

graph = wf.compile(checkpointer=KovaCheckpointer(kova))
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Why no re-call to the LLM</p>
    <div class="lurus-callout__body"><p>Kova writes a write-ahead log (WAL) for every step. After a process crash, the engine replays execution state from the checkpoint, and LLM calls that already completed are not issued again — saving tokens while keeping the answer consistent.</p></div>
  </div>
</div>

## <Icon name="package" :size="20" /> Complete project artifact

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="github" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Example repository</p>
    <div class="lurus-callout__body"><p><a href="https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent">https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent</a> — includes the full code, <code>docker-compose.yml</code> (run MemX + Kova locally), Pytest covering the three nodes, and <code>.env.example</code>.</p></div>
  </div>
</div>

## Next steps

<NextSteps :steps="[
  { text: 'Add Lumen observability', link: '/en/tutorials/lumen-kova-langgraph', primary: true },
  { text: 'Dive into MemX concepts', link: '/en/memx/concepts' },
  { text: 'Deploy to a Kova cluster', link: '/en/kova/quickstart' },
]" />

</div>
