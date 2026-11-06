---
title: "Adding Lumen to a LangGraph app"
description: "Swap SqliteSaver for LumenCheckpointer, add LumenTracer, export lifecycle HTML. No lumen deploy."
---

<div class="mig-lg-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-branch" :size="14" /> LangGraph + Lumen</span>
  <h1 class="lurus-section-head__title">Add Lumen beside LangGraph</h1>
  <p class="lurus-section-head__lede">Keep your graph. Add local checkpoints + traces. Share a lifecycle HTML. Durable WAL depth stays on Kova when you use Connected — Lumen is not a deploy target.</p>
</div>

## What you get

| Before (plain LangGraph) | After (+ Lumen Core) |
|---------------------|-------|
| SqliteSaver / MemorySaver | **LumenCheckpointer** on local disk |
| No spend view | **CostTracker** / `lumen cost` |
| Logs only | **LumenTracer** → trace JSON + `lumen export` HTML |
| LangGraph time-travel (re-executes nodes) | **$0 replay** from recorded traces (`lumen replay`) |

## Steps

<ol class="lurus-steps">
<li>

**Install**

```bash
pip install "lumen-ai[langgraph]"   # or: pip install -e "./lumen-sdk[langgraph]"
```

</li>
<li>

**Replace the checkpointer**

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen.integrations.langgraph import LumenCheckpointer

- graph = wf.compile(
-     checkpointer=SqliteSaver.from_conn_string("./state.db")
- )
+ graph = wf.compile(
+     checkpointer=LumenCheckpointer(storage_dir="./checkpoints")
+ )
```

</li>
<li>

**Add the tracer via callbacks** (required — not auto-patched)

```diff
+ from lumen.integrations.langgraph import LumenTracer

  result = graph.invoke(
      inputs,
      config={
          "configurable": {"thread_id": "t1"},
+         "callbacks": [LumenTracer(trace_dir="./traces")],
      },
  )
```

</li>
<li>

**Inspect / share (no deploy step)**

```bash
lumen traces
lumen export <trace-id>
lumen cost --format md
lumen dashboard
```

There is **no** `lumen deploy`. To deepen with durable WAL, run against [Kova](/en/kova/) and use Connected (`--kova-url`).

</li>
</ol>

## Crash → resume ritual

```python
cp = LumenCheckpointer(storage_dir="./checkpoints")
print(cp.resume_hint("t1"))
cfg = cp.latest_config("t1")
graph.invoke(None, config={"configurable": cfg["configurable"], "callbacks": [LumenTracer(trace_dir="./traces")]})
```

## Next

<NextSteps :steps="[
  { text: 'Lumen overview', link: '/en/lumen/', primary: true },
  { text: 'Quick start', link: '/en/lumen/quickstart' },
  { text: 'Kova', link: '/en/kova/' },
]" />

</div>
