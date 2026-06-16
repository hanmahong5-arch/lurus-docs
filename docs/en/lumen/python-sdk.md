---
title: Lumen Python SDK
description: Complete usage guide for the three core classes — LumenTracer / LumenCheckpointer / CostTracker.
---

<div class="lumen-page">

# Lumen Python SDK <StatusBadge status="dev" />

After `pip install lumen-ai`, the SDK provides three core classes covering collection, persistence, and cost aggregation:

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--lumen" href="#lumentracer">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">LumenTracer</div>
    <p class="lurus-card__body">Callback-based Trace + Cost collection.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#lumencheckpointer">
    <span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span>
    <div class="lurus-card__title">LumenCheckpointer</div>
    <p class="lurus-card__body">A persistence layer that replaces <code>SqliteSaver</code>.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#costtracker">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">CostTracker</div>
    <p class="lurus-card__body">Cross-agent cost aggregation queries.</p>
  </a>
</div>

## LumenTracer

```python
from lumen_ai import LumenTracer

tracer = LumenTracer(
    project="my-agent",
    tags={"env": "prod", "team": "core"},
    redact=("api_key", "password"),   # 自动脱敏字段
)

graph = workflow.compile(callbacks=[tracer])
```

**Key parameters**:

| Parameter | Default | Description |
|------|--------|------|
| `project` | `"default"` | Project identifier; determines data ownership |
| `tags` | `{}` | Key-value tags attached to every Trace |
| `redact` | `()` | Tuple of field names to redact automatically |
| `backend` | `"local"` | `local` / `lurus` / custom URL |

## LumenCheckpointer

Replaces LangGraph's `SqliteSaver`:

```python
from lumen_ai import LumenCheckpointer

graph = workflow.compile(checkpointer=LumenCheckpointer())
```

Compared to SqliteSaver:

| Dimension | SqliteSaver | LumenCheckpointer |
|------|-------------|-------------------|
| Recovery speed | Millisecond | **Microsecond** (powered by the Kova WAL engine) |
| Multi-process | Requires locking | **Native support** |
| Remote persistence | Self-implemented | **Built-in** |
| Cost correlation | None | **Automatic** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Drop-in replacement, API-compatible</p>
    <div class="lurus-callout__body"><code>LumenCheckpointer</code> is compatible with LangGraph's <code>BaseCheckpointSaver</code> interface — just swap your existing <code>SqliteSaver</code> in a single line, with no changes to the graph structure. See <a href="/en/lumen/integration">Ecosystem Integration · LangGraph</a>.</div>
  </div>
</div>

## CostTracker

Cross-agent cost aggregation queries:

```python
from lumen_ai import CostTracker

# 过去 24h
CostTracker.summary(hours=24)

# 按 Agent 拆分
CostTracker.by_agent(hours=24)

# 按 Graph 节点拆分
CostTracker.by_node(graph_id="research-graph")

# 预算告警
CostTracker.set_budget(daily_rmb=50.0, on_exceed=my_handler)
```

## Custom Backend

By default, data is written to `~/.lumen/`. To send to a remote endpoint: `LumenTracer(backend="https://lumen.lurus.cn/ingest")`. Or customize:

```python
from lumen_ai.backend import Backend
class MyBackend(Backend):
    def send(self, event): ...
LumenTracer(backend=MyBackend())
```

## Async Support

All SDK I/O is async-friendly:

```python
import asyncio
from lumen_ai import LumenTracer

async def main():
    tracer = LumenTracer()
    async with tracer:
        await graph.ainvoke({"query": "hi"})

asyncio.run(main())
```

## Next Steps

<NextSteps :steps="[
  { text: 'Back to Overview', link: '/en/lumen/', primary: true },
  { text: 'CLI Manual', link: '/en/lumen/cli' },
  { text: 'Ecosystem Integration', link: '/en/lumen/integration' },
]" />

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-cards--compact { margin: 18px 0 8px; }
</style>
