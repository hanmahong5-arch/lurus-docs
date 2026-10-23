---
title: "Tutorial — Lumen × LangGraph × Kova"
description: "Replace LangGraph's default SqliteSaver with Lumen, deploy to a Kova Cluster, and compare crash recovery."
---

<div class="lkl-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Lumen × LangGraph × Kova</span>
  <h1 class="lurus-section-head__title">Lumen × LangGraph × Kova</h1>
  <p class="lurus-section-head__lede"><strong>Goal</strong>: swap a LangGraph Agent's Checkpointer from <code>SqliteSaver</code> to <code>LumenCheckpointer</code>, deploy to Kova, and observe the crash-recovery comparison.</p>
</div>

## <Icon name="git-branch" :size="20" /> Before / After

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">Before — Plain LangGraph</div>
    <p class="lurus-card__body">Single machine, no remote backup · Cross-process requires locking · No cost tracking.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">After — Lumen + Kova</div>
    <p class="lurus-card__body">Resumes from the WAL breakpoint after a crash (Kova engine) · Native multi-process safety · Automatic Trace + Cost · Remote persistence.</p>
  </div>
</div>

### Before

```python
from langgraph.checkpoint.sqlite import SqliteSaver

graph = wf.compile(checkpointer=SqliteSaver.from_conn_string("./state.db"))
```

### After

```python
from lumen_ai import LumenCheckpointer, LumenTracer
from kova import KovaClient

kova = KovaClient("kova://prod-cluster")

graph = wf.compile(
    checkpointer=LumenCheckpointer(kova_client=kova),
    callbacks=[LumenTracer()],
)
```

## <Icon name="terminal" :size="20" /> Local Verification

<ol class="lurus-steps">
<li>

**Start a local Kova**

```bash
docker run -d --name kova -p 9999:9999 ghcr.io/hanmahong5-arch/kova:latest
```

</li>
<li>

**Run your Agent**

```bash
python my_agent.py
```

</li>
<li>

**Simulate a crash**

```bash
kill -9 $(pgrep -f my_agent)
```

</li>
<li>

**Restart — resume from the breakpoint**

```bash
python my_agent.py
```

</li>
</ol>

## <Icon name="rocket" :size="20" /> Deploy to Kova

```yaml
# agent.yaml
name: my-research-agent
entry: python my_agent.py
replicas: 3
checkpointer: lumen
wal:
  retention: 7d
```

```bash
lumen deploy --target kova://prod-cluster
```

## Next Steps

<NextSteps :steps="[
  { text: 'Migrate from LangGraph', link: '/en/migrations/from-langgraph', primary: true },
  { text: 'Lumen Python SDK', link: '/en/lumen/python-sdk' },
  { text: 'Kova Concepts', link: '/en/kova/concepts' },
]" />

</div>
