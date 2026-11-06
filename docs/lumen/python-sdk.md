---
title: Lumen Python SDK
description: lumen 包 — instrument、LangGraph tracer/checkpointer、cost、replay、OTLP。
---

<div class="lumen-page">

# Lumen Python SDK <StatusBadge status="alpha" />

PyPI 项目名：**`lumen-ai`**。导入名：**`lumen`**。

```python
from lumen import instrument, trace, CostTracker, ReplayEngine
from lumen.integrations.langgraph import LumenCheckpointer, LumenTracer
```

没有公开的 `lumen.Agent.run()` 运行时。

## instrument + trace

```python
instrument()  # 在已安装时 patch OpenAI / Anthropic
# LangGraph：仍需在 callbacks 里传 LumenTracer

with trace("research-task") as t:
    client.chat.completions.create(...)
```

## LumenCheckpointer / LumenTracer

```python
cp = LumenCheckpointer(storage_dir="./checkpoints")
tracer = LumenTracer(trace_dir="./traces")
graph = workflow.compile(checkpointer=cp)
graph.invoke(inputs, config={"callbacks": [tracer], "configurable": {"thread_id": "t1"}})
print(cp.resume_hint("t1"))
```

本地 Core 续跑故事；**不是** Kova WAL。

## Cost / Replay

```python
CostTracker(trace_dir="./traces").report(last="24h")
ReplayEngine(trace_dir="./traces").replay("abc123")
```

`--from-step` 是 CLI 行为；Python `ReplayEngine.replay()` 暂无该参数。

## OTLP

`LUMEN_OTLP_ENABLED=1` + `LUMEN_OTLP_ENDPOINT=http://localhost:4318` — 仅 OTLP/HTTP JSON，无 OTel SDK 依赖。

## 下一步

<NextSteps :steps="[
  { text: '总览', link: '/lumen/', primary: true },
  { text: 'CLI', link: '/lumen/cli' },
  { text: '集成', link: '/lumen/integration' },
]" />

</div>
