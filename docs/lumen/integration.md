---
title: Lumen 生态集成
description: LangGraph checkpointer/tracer、可选 Kova Connected、OTLP/HTTP JSON 导出。
---

<div class="lumen-page">

# Lumen 生态集成 <StatusBadge status="alpha" />

Lumen 旁路挂接：你的代码仍直调 LLM；SDK 写本地 trace；CLI 做 replay / cost / lifecycle。Connected 可选加深 Kova / Netdata。

## LangGraph

```python
from lumen.integrations.langgraph import LumenCheckpointer, LumenTracer

graph = workflow.compile(checkpointer=LumenCheckpointer(storage_dir="./checkpoints"))
graph.invoke(inputs, config={
    "configurable": {"thread_id": "t1"},
    "callbacks": [LumenTracer(trace_dir="./traces")],
})
```

`instrument()` **不会**自动 patch LangGraph。

## Kova（Connected）

```bash
export LUMEN_KOVA_URL=http://127.0.0.1:3010
export LUMEN_KOVA_API_KEY=sk-kova-…
lumen dashboard --kova-url "$LUMEN_KOVA_URL" --api-key "$LUMEN_KOVA_API_KEY"
lumen pull --kova-url "$LUMEN_KOVA_URL" --watch
```

没有 `lumen deploy`。WAL 持久执行归 Kova。

## OpenTelemetry

```bash
export LUMEN_OTLP_ENABLED=1
export LUMEN_OTLP_ENDPOINT=http://localhost:4318
```

无 `lumen_ai.otel` 辅助模块；无 gRPC/protobuf。

## 明确不做

第二个 runtime、MCP 宿主、Temporal 式引擎、替代 Langfuse 的通用 APM。

## 下一步

<NextSteps :steps="[
  { text: 'Python SDK', link: '/lumen/python-sdk', primary: true },
  { text: '从 LangGraph 接入', link: '/migrations/from-langgraph' },
  { text: 'CLI', link: '/lumen/cli' },
]" />

</div>
