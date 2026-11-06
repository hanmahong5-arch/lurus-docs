---
title: Lumen Ecosystem Integration
description: LangGraph checkpointer/tracer, optional Kova Connected path, OTLP/HTTP JSON export.
---

<div class="lumen-page">

# Lumen Ecosystem Integration <StatusBadge status="alpha" />

Lumen sits **beside** your agent: your code still calls the LLM provider; the SDK writes local traces; the CLI renders replay / cost / lifecycle. Connected mode optionally deepens against Kova and Netdata.

## LangGraph {#langgraph}

```python
from lumen.integrations.langgraph import LumenCheckpointer, LumenTracer

checkpointer = LumenCheckpointer(storage_dir="./checkpoints")
tracer = LumenTracer(trace_dir="./traces")
graph = workflow.compile(checkpointer=checkpointer)
graph.invoke(
    inputs,
    config={
        "configurable": {"thread_id": "t1"},
        "callbacks": [tracer],
    },
)
```

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen.integrations.langgraph import LumenCheckpointer

- graph = wf.compile(checkpointer=SqliteSaver.from_conn_string(":memory:"))
+ graph = wf.compile(checkpointer=LumenCheckpointer(storage_dir="./checkpoints"))
```

`instrument()` does **not** auto-patch LangGraph call sites — always pass `LumenTracer` via callbacks.

## Kova (Connected) {#kova}

Kova owns durable WAL execution. Lumen Core does not require Kova. With a live `kova-rest`:

```bash
export LUMEN_KOVA_URL=http://127.0.0.1:3010
export LUMEN_KOVA_API_KEY=sk-kova-…
lumen dashboard --kova-url "$LUMEN_KOVA_URL" --api-key "$LUMEN_KOVA_API_KEY"
lumen pull --kova-url "$LUMEN_KOVA_URL" --watch
lumen export <run-id>
```

Do not re-aggregate Flow / Governor in Lumen — proxy Kova as the source of truth.

Forge Demo Day: set `FORGE_LUMEN_BIN` (or rely on sibling monorepo discovery) so `/demo` can auto-open lifecycle HTML when `lifecycle_ready`.

## OpenAI / Anthropic clients

```python
from lumen import instrument, trace

instrument()
with trace("task"):
    client.chat.completions.create(...)
```

## OpenTelemetry {#opentelemetry}

Optional fan-out of completed traces as OTLP/HTTP JSON (stdlib only):

```bash
export LUMEN_OTLP_ENABLED=1
export LUMEN_OTLP_ENDPOINT=http://localhost:4318
```

Or `export.otlp` in `lumen.toml`. Point a collector at Grafana Tempo / Datadog / etc. There is no `lumen_ai.otel.to_otlp` helper and no gRPC/protobuf exporter in-tree.

## What Lumen does not integrate as

- A second agent runtime (`lumen run` / deploy)
- MCP server hosting
- Temporal-style workflow engine
- General APM replacing Langfuse / LangSmith

## Next Steps

<NextSteps
  :steps="[
    { text: 'Python SDK', link: '/en/lumen/python-sdk', primary: true },
    { text: 'Migrating from LangGraph checkpointer', link: '/en/migrations/from-langgraph' },
    { text: 'CLI', link: '/en/lumen/cli' },
  ]"
  title="Next Steps"
/>

</div>
