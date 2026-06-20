---
title: "Migrating from LangGraph to Lumen + Kova"
description: "SqliteSaver → LumenCheckpointer + LumenTracer, deploy your Agent to a Kova cluster."
---

<div class="mig-lg-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-branch" :size="14" /> Migrating from LangGraph</span>
  <h1 class="lurus-section-head__title">Migrating from LangGraph to Lumen + Kova</h1>
  <p class="lurus-section-head__lede"><code>SqliteSaver</code> → <code>LumenCheckpointer + LumenTracer</code>, deploy your Agent to a Kova cluster—no changes to your business code.</p>
</div>

## <Icon name="sparkles" :size="20" /> What you get

| Before (plain LangGraph) | After |
|---------------------|-------|
| SqliteSaver single-node persistence | **LumenCheckpointer + Kova** microsecond-level WAL recovery |
| No tracing | **LumenTracer** automatic capture |
| No cost tracking | **CostTracker** aggregated per node |
| Manual replay | **Replay.from_run_id()** in one line |

## <Icon name="workflow" :size="20" /> Migration steps

<ol class="lurus-steps">
<li>

**Replace the Checkpointer** — `LumenCheckpointer` implements `BaseCheckpointSaver` 100%, with no changes to your business code.

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen_ai import LumenCheckpointer

- graph = wf.compile(
-     checkpointer=SqliteSaver.from_conn_string("./state.db")
- )
+ graph = wf.compile(
+     checkpointer=LumenCheckpointer()
+ )
```

</li>
<li>

**Add the Tracer** — once running locally, visit `http://localhost:7070` to see the trace timeline.

```diff
+ from lumen_ai import LumenTracer

  graph = wf.compile(
      checkpointer=LumenCheckpointer(),
+     callbacks=[LumenTracer()],
  )
```

</li>
<li>

**Deploy to Kova**

```yaml
# agent.yaml
name: research-agent
entry: python my_agent.py
checkpointer: lumen
replicas: 3
```

```bash
lumen deploy --target kova://prod-cluster
```

</li>
</ol>

## <Icon name="terminal" :size="20" /> Local verification

```bash
python my_agent.py           # runs normally
kill -9 $(pgrep -f my_agent) # simulate a crash
python my_agent.py           # resumes from the interruption point, no LLM re-call
```

## <Icon name="gauge" :size="20" /> Performance comparison

| Metric | Before | After |
|------|--------|-------|
| Recovery latency | 8ms | **microsecond-level** |
| Multi-process | needs locking | **native** |
| Cross-datacenter | manual | **async replication** |
| LLM re-call | sometimes | **never** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Rollback</p>
    <div class="lurus-callout__body"><p>Keep the old SqliteSaver code commented out; revert the diff at any time to return to the original state. The data is not shared, but they can run in parallel.</p></div>
  </div>
</div>

## Next steps

<NextSteps :steps="[
  { text: 'Lumen Python SDK', link: '/en/lumen/python-sdk', primary: true },
  { text: 'Deploy Kova', link: '/en/kova/quickstart' },
  { text: 'Full tutorial', link: '/en/tutorials/lumen-kova-langgraph' },
]" />

</div>
