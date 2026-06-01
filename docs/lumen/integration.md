---
title: Lumen 生态集成
description: 与 Kova / LangGraph / Lurus API / OpenTelemetry / Grafana / Datadog 的集成范式。
---

# Lumen 生态集成 <StatusBadge status="dev" />

## 与 [Kova](/kova/)

Kova 负责 3μs 底层状态快照（WAL 持久化），Lumen 负责语义层 Trace 标注与成本统计。

```python
from lumen_ai import LumenCheckpointer
from kova import KovaClient

kova = KovaClient("kova://prod")
graph.compile(checkpointer=LumenCheckpointer(kova_client=kova))
```

## 与 [LangGraph](https://langchain-ai.github.io/langgraph/)

直接替换 Saver（API 完全兼容 `BaseCheckpointSaver`）：

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen_ai import LumenCheckpointer

- graph = wf.compile(checkpointer=SqliteSaver.from_conn_string(":memory:"))
+ graph = wf.compile(checkpointer=LumenCheckpointer())
```

## 与 [Lurus API](/guide/introduction)

经 Lurus API 调 LLM 时，Token 计费和耗时自动关联到 Lumen Trace：

```python
from openai import OpenAI
from lumen_ai import LumenTracer

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-...")
tracer = LumenTracer()

with tracer.span("classify"):
    resp = client.chat.completions.create(...)
    # 调用自动记录，鹿贝消费可追溯
```

## OpenTelemetry

导出为 OTel Trace：`LumenTracer(exporters=[to_otlp("http://otel-collector:4317")])`（`from lumen_ai.otel import to_otlp`）。

## Grafana / Datadog

链路 `Lumen SDK ──OTLP──→ OTel Collector → Grafana Tempo / Datadog APM`。Grafana 仪表盘模板见 [Lurus 官方模板库](/updates/)（搜 "Lumen Dashboard"）。

## 下一步

<RelatedProducts product-id="lumen" />

<NextSteps :steps="[
  { text: 'Python SDK 详解', link: '/lumen/python-sdk', primary: true },
  { text: '跨产品教程', link: '/tutorials/lumen-kova-langgraph' },
  { text: '从 LangGraph 迁移', link: '/migrations/from-langgraph' },
]" />
