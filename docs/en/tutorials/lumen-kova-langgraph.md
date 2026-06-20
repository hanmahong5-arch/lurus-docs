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
    <p class="lurus-card__body">Single machine, no remote backup · Cross-process requires locking · Millisecond crash recovery · No cost tracking.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">After — Lumen + Kova</div>
    <p class="lurus-card__body">Microsecond crash recovery (Kova WAL engine) · Native multi-process safety · Automatic Trace + Cost · Remote persistence.</p>
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

## <Icon name="gauge" :size="20" /> Crash-Recovery Comparison Experiment

| Metric | SqliteSaver | Lumen + Kova |
|------|-------------|--------------|
| Recovery latency | 8ms (single machine) | **Microsecond** |
| Multiple replicas | Requires extra locking | **Native** |
| Cross-datacenter | Manual replication | **Async replication built in** |
| LLM re-invocation | Re-invokes if SQLite write fails | **Never re-invokes** |
| Trace | None | **Auto-correlated** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Where the microsecond recovery comes from</p>
    <div class="lurus-callout__body"><p>The Kova engine's scheduling latency is as low as 3μs (full FIFO pipeline Criterion benchmark of 3.17μs, 315K ops/s). <code>LumenCheckpointer</code> hands LangGraph's checkpoint writes to the Kova WAL — recovery uses engine-level WAL replay instead of SQLite file-level recovery, so it is microsecond-scale, far faster than single-machine SQLite's millisecond scale.</p></div>
  </div>
</div>

## Next Steps

<NextSteps :steps="[
  { text: 'Migrate from LangGraph', link: '/en/migrations/from-langgraph', primary: true },
  { text: 'Lumen Python SDK', link: '/en/lumen/python-sdk' },
  { text: 'Kova Concepts', link: '/en/kova/concepts' },
]" />

</div>
