---
title: Lumen Ecosystem Integration
description: Integration patterns with Kova / LangGraph / Lurus API / OpenTelemetry / Grafana / Datadog.
---

<div class="lumen-page">

# Lumen Ecosystem Integration <StatusBadge status="dev" />

As a semantic-layer observability tool, Lumen connects downward to the Kova execution engine and the Lurus API gateway, sits alongside LangGraph for compatibility, and exports standard OTel traces outward to Grafana / Datadog.

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--kova" href="#kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">WAL persistence layer with microsecond-level crash recovery.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#langgraph">
    <span class="lurus-card__icon"><Icon name="repeat" :size="20" /></span>
    <div class="lurus-card__title">LangGraph</div>
    <p class="lurus-card__body">One-line Saver replacement.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#lurus-api">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Lurus API</div>
    <p class="lurus-card__body">Automatic token-billing correlation.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#opentelemetry">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">OTel / Grafana / Datadog</div>
    <p class="lurus-card__body">Export standard traces.</p>
  </a>
</div>

## With [Kova](/en/kova/) {#kova}

Kova handles low-level WAL state persistence and microsecond-level crash recovery, while Lumen handles semantic-layer trace annotation and cost accounting.

```python
from lumen_ai import LumenCheckpointer
from kova import KovaClient

kova = KovaClient("kova://prod")
graph.compile(checkpointer=LumenCheckpointer(kova_client=kova))
```

## With [LangGraph](https://langchain-ai.github.io/langgraph/) {#langgraph}

Drop-in Saver replacement (the API is fully compatible with `BaseCheckpointSaver`):

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen_ai import LumenCheckpointer

- graph = wf.compile(checkpointer=SqliteSaver.from_conn_string(":memory:"))
+ graph = wf.compile(checkpointer=LumenCheckpointer())
```

## With [Lurus API](/en/guide/introduction) {#lurus-api}

When calling an LLM through the Lurus API, token billing and latency are automatically correlated to the Lumen trace:

```python
from openai import OpenAI
from lumen_ai import LumenTracer

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-...")
tracer = LumenTracer()

with tracer.span("classify"):
    resp = client.chat.completions.create(...)
    # 调用自动记录，鹿贝消费可追溯
```

## OpenTelemetry {#opentelemetry}

Export as an OTel trace: `LumenTracer(exporters=[to_otlp("http://otel-collector:4317")])` (`from lumen_ai.otel import to_otlp`).

## Grafana / Datadog

The pipeline is as follows: the Lumen SDK pushes traces to the OTel Collector over the OTLP protocol, which then fans them out to Grafana Tempo or Datadog APM:

<ArchitectureDiagram
  title="Observability export pipeline"
  chart="graph LR
  A[Lumen SDK] -->|OTLP| B[OTel Collector]
  B --> C[Grafana Tempo]
  B --> D[Datadog APM]"
/>

For Grafana dashboard templates, see the [Lurus official template library](/updates/) (search for "Lumen Dashboard").

## Next Steps

<NextSteps
  :steps="[
    { text: 'Python SDK guide', link: '/en/lumen/python-sdk', primary: true },
    { text: 'Cross-product tutorial', link: '/tutorials/lumen-kova-langgraph' },
    { text: 'Migrating from LangGraph', link: '/migrations/from-langgraph' },
  ]"
  title="Next Steps"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-cards--compact { margin: 18px 0 8px; }
</style>
