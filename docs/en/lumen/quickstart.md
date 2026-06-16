---
title: Lumen Quickstart
description: Wire Lumen into your LangGraph / Agent project in three lines of code, then view your first Trace and costs.
---

<div class="lumen-page">

# Lumen Quickstart <StatusBadge status="dev" />

Get it done in 10 minutes: install → integrate with LangGraph → view your first Trace → trigger a Replay → tally 24h costs.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">10 min</span><span class="lurus-stat__label">end to end</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 lines</span><span class="lurus-stat__label">of integration code</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">0</span><span class="lurus-stat__label">business-logic changes</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prerequisites</p>
    <div class="lurus-callout__body">Python 3.9+ · Lurus <Term t="API Key">API Key</Term> (<a href="/en/guide/get-api-key">how to get one</a>) · an existing LangGraph/LangChain Agent project (or use the minimal example below if you don’t have one).</div>
  </div>
</div>

<ol class="lurus-steps">

<li>

**Install and integrate with LangGraph in three lines**

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

No business-logic changes required — every LLM call, tool call, and state change is recorded to the Lumen backend.

</li>

<li>

**Run a minimal example**

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

**View the Trace**

Open the console (default `http://localhost:7070`) or the Lumen page in the Lurus console: the complete timeline of each graph run, the input/output/duration of every node, and the prompt/completion/token counts for each LLM call.

</li>

<li>

**Trigger a Replay**

Replay a past execution sequence once, **without consuming tokens** (useful for reproducing bugs locally, verifying fixes, and Prompt A/B testing):

```python
from lumen_ai import Replay
Replay.from_run_id("run_abc123").play()
```

</li>

<li>

**Tally 24-hour costs**

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
    <p class="lurus-callout__title">Replay costs nothing</p>
    <div class="lurus-callout__body">Replay plays back from the recorded execution sequence and <strong>does not call the LLM again</strong>, so reproducing bugs, verifying fixes, and running Prompt A/B tests all cost zero tokens.</div>
  </div>
</div>

## Next Steps

<NextSteps
  :steps="[
    { text: 'Python SDK — a deep dive into LumenTracer / LumenCheckpointer / CostTracker', link: '/en/lumen/python-sdk', primary: true },
    { text: 'CLI Handbook — common commands and automation scaffolding', link: '/en/lumen/cli' },
    { text: 'Ecosystem Integration — working with Kova / LangGraph / OpenTelemetry', link: '/en/lumen/integration' },
  ]"
  title="Next Steps"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-stat-strip { margin: 16px 0 8px; }
</style>
