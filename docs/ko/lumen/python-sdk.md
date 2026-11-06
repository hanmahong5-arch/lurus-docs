---
title: Lumen Python SDK
description: lumen package — instrument, LangGraph LumenTracer / LumenCheckpointer, cost, replay, OTLP export.
---

<div class="lumen-page">

# Lumen Python SDK <StatusBadge status="alpha" />

PyPI project name: **`lumen-ai`**. Import name: **`lumen`**.

```bash
pip install "lumen-ai[langgraph]"   # when published
# else: pip install -e "./lumen-sdk[langgraph]" from the git clone
```

## Core imports

```python
from lumen import instrument, trace, CostTracker, ReplayEngine, LumenConfig
from lumen.integrations.langgraph import LumenCheckpointer, LumenTracer
```

There is **no** public `lumen.Agent.run()` runtime. Stubs under `lumen.agent` are intentionally not exported.

## instrument + trace (OpenAI / Anthropic)

```python
from lumen import instrument, trace

instrument()  # patches OpenAI / Anthropic clients when installed
# LangGraph: instrument() only detects the package — you still pass LumenTracer in callbacks

with trace("research-task") as t:
    resp = client.chat.completions.create(model="gpt-4o", messages=[...])
    print(t.trace_id, t.total_cost_usd)
```

## LumenTracer

Writes AgentTrace JSON under `trace_dir` (default `./traces`).

```python
from lumen.integrations.langgraph import LumenTracer

tracer = LumenTracer(trace_dir="./traces")
graph.invoke(inputs, config={"callbacks": [tracer], "configurable": {"thread_id": "t1"}})
```

## LumenCheckpointer

File-backed LangGraph `BaseCheckpointSaver`. Local Core resume story — **not** Kova WAL.

```python
from lumen.integrations.langgraph import LumenCheckpointer

cp = LumenCheckpointer(storage_dir="./checkpoints")
graph = workflow.compile(checkpointer=cp)
print(cp.resume_hint("t1"))
print(cp.latest_config("t1"))
```

Persistence is best-effort on disk errors (writes are swallowed so the agent loop is not crashed by telemetry).

## CostTracker / ReplayEngine

```python
from lumen import CostTracker, ReplayEngine

report = CostTracker(trace_dir="./traces").report(last="24h")
print(report.total_usd, report.total_runs)

replay = ReplayEngine(trace_dir="./traces").replay("abc123")
for step in replay.steps:
    print(step.step, step.decision_type, step.tool_name or step.content)
```

CLI `lumen replay --from-step N` filters in the CLI; the Python `ReplayEngine.replay()` API has no `from_step` argument today.

## Config / OTLP

Hierarchy: defaults → `~/.lumen/config.toml` → `./lumen.toml` → `LUMEN_*` env → builder overrides.

| Variable | Default | Meaning |
|------|--------|------|
| `LUMEN_TRACE_DIR` | `./traces` | Trace JSON directory |
| `LUMEN_BUDGET_USD` | `0` | Ceiling; `0` = unlimited |
| `LUMEN_KILL_ON_BUDGET` | `false` | Raise when budget exceeded |
| `LUMEN_OTLP_ENABLED` | `false` | Fan out completed traces via OTLP/HTTP JSON |
| `LUMEN_OTLP_ENDPOINT` | — | Collector base (appends `/v1/traces` if needed) |

OTLP uses stdlib HTTP JSON only — no OpenTelemetry SDK dependency.

## Next Steps

<NextSteps :steps="[
  { text: 'Overview', link: '/en/lumen/', primary: true },
  { text: 'CLI Manual', link: '/en/lumen/cli' },
  { text: 'Integrations', link: '/en/lumen/integration' },
]" />

</div>
