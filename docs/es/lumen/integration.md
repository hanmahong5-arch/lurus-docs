---
title: Integración del ecosistema Lumen
description: Patrones de integración con Kova / LangGraph / Lurus API / OpenTelemetry / Grafana / Datadog.
---

<div class="lumen-page">

# Integración del ecosistema Lumen <StatusBadge status="dev" />

Como herramienta de observabilidad de la capa semántica, Lumen se conecta hacia abajo con el motor de ejecución Kova y la pasarela Lurus API, es compatible lateralmente con LangGraph, y exporta hacia afuera trazas OTel estándar a Grafana / Datadog.

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--kova" href="#kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">Base de persistencia WAL, recuperación ante fallos en microsegundos.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#langgraph">
    <span class="lurus-card__icon"><Icon name="repeat" :size="20" /></span>
    <div class="lurus-card__title">LangGraph</div>
    <p class="lurus-card__body">Reemplazo del Saver en una línea.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#lurus-api">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Lurus API</div>
    <p class="lurus-card__body">Asociación automática de la facturación de tokens.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#opentelemetry">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">OTel / Grafana / Datadog</div>
    <p class="lurus-card__body">Exporta trazas estándar.</p>
  </a>
</div>

## Con [Kova](/es/kova/) {#kova}

Kova se encarga de la persistencia del estado WAL de bajo nivel y de la recuperación ante fallos en microsegundos; Lumen se encarga del etiquetado de trazas de la capa semántica y de las estadísticas de coste.

```python
from lumen_ai import LumenCheckpointer
from kova import KovaClient

kova = KovaClient("kova://prod")
graph.compile(checkpointer=LumenCheckpointer(kova_client=kova))
```

## Con [LangGraph](https://langchain-ai.github.io/langgraph/) {#langgraph}

Reemplazo directo del Saver (la API es totalmente compatible con `BaseCheckpointSaver`):

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen_ai import LumenCheckpointer

- graph = wf.compile(checkpointer=SqliteSaver.from_conn_string(":memory:"))
+ graph = wf.compile(checkpointer=LumenCheckpointer())
```

## Con [Lurus API](/es/guide/introduction) {#lurus-api}

Al invocar el LLM a través de Lurus API, la facturación de tokens y el tiempo de ejecución se asocian automáticamente a la traza de Lumen:

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

Exportar como traza OTel: `LumenTracer(exporters=[to_otlp("http://otel-collector:4317")])` (`from lumen_ai.otel import to_otlp`).

## Grafana / Datadog

El flujo es el siguiente: el SDK de Lumen empuja las trazas al OTel Collector mediante el protocolo OTLP, que luego las distribuye a Grafana Tempo o a Datadog APM:

<ArchitectureDiagram
  title="Flujo de exportación de observabilidad"
  chart="graph LR
  A[Lumen SDK] -->|OTLP| B[OTel Collector]
  B --> C[Grafana Tempo]
  B --> D[Datadog APM]"
/>

Las plantillas de paneles de Grafana están en la [biblioteca de plantillas oficial de Lurus](/updates/) (busca "Lumen Dashboard").

## Próximos pasos

<NextSteps
  :steps="[
    { text: 'Guía detallada del Python SDK', link: '/es/lumen/python-sdk', primary: true },
    { text: 'Tutorial multiproducto', link: '/tutorials/lumen-kova-langgraph' },
    { text: 'Migrar desde LangGraph', link: '/migrations/from-langgraph' },
  ]"
  title="Próximos pasos"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-cards--compact { margin: 18px 0 8px; }
</style>
