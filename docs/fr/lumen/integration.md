---
title: Intégration de l’écosystème Lumen
description: Modèles d’intégration avec Kova / LangGraph / Lurus API / OpenTelemetry / Grafana / Datadog.
---

<div class="lumen-page">

# Intégration de l’écosystème Lumen <StatusBadge status="dev" />

En tant qu’outil d’observabilité de la couche sémantique, Lumen se connecte en aval au moteur d’exécution Kova et à la passerelle Lurus API, reste compatible latéralement avec LangGraph et exporte vers l’extérieur des traces OTel standard vers Grafana / Datadog.

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--kova" href="#kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">Socle de persistance WAL, reprise après panne à l’échelle de la microseconde.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#langgraph">
    <span class="lurus-card__icon"><Icon name="repeat" :size="20" /></span>
    <div class="lurus-card__title">LangGraph</div>
    <p class="lurus-card__body">Remplacement du Saver en une ligne.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#lurus-api">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Lurus API</div>
    <p class="lurus-card__body">Association automatique de la facturation des tokens.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#opentelemetry">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">OTel / Grafana / Datadog</div>
    <p class="lurus-card__body">Export de traces standard.</p>
  </a>
</div>

## Avec [Kova](/fr/kova/) {#kova}

Kova prend en charge la persistance de l’état WAL de bas niveau et la reprise après panne à l’échelle de la microseconde ; Lumen gère l’annotation des traces de la couche sémantique et le suivi des coûts.

```python
from lumen_ai import LumenCheckpointer
from kova import KovaClient

kova = KovaClient("kova://prod")
graph.compile(checkpointer=LumenCheckpointer(kova_client=kova))
```

## Avec [LangGraph](https://langchain-ai.github.io/langgraph/) {#langgraph}

Remplacez directement le Saver (l’API est entièrement compatible avec `BaseCheckpointSaver`) :

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen_ai import LumenCheckpointer

- graph = wf.compile(checkpointer=SqliteSaver.from_conn_string(":memory:"))
+ graph = wf.compile(checkpointer=LumenCheckpointer())
```

## Avec [Lurus API](/fr/guide/introduction) {#lurus-api}

Lorsque vous appelez un LLM via Lurus API, la facturation des tokens et la latence sont automatiquement associées à la trace Lumen :

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

Exportez sous forme de trace OTel : `LumenTracer(exporters=[to_otlp("http://otel-collector:4317")])` (`from lumen_ai.otel import to_otlp`).

## Grafana / Datadog

Le flux est le suivant : le SDK Lumen pousse les traces vers l’OTel Collector via le protocole OTLP, qui les distribue ensuite à Grafana Tempo ou à Datadog APM :

<ArchitectureDiagram
  title="Flux d’export d’observabilité"
  chart="graph LR
  A[Lumen SDK] -->|OTLP| B[OTel Collector]
  B --> C[Grafana Tempo]
  B --> D[Datadog APM]"
/>

Les modèles de tableaux de bord Grafana sont disponibles dans la [bibliothèque officielle de modèles Lurus](/updates/) (recherchez « Lumen Dashboard »).

## Étapes suivantes

<NextSteps
  :steps="[
    { text: 'Présentation détaillée du SDK Python', link: '/fr/lumen/python-sdk', primary: true },
    { text: 'Tutoriel inter-produits', link: '/tutorials/lumen-kova-langgraph' },
    { text: 'Migration depuis LangGraph', link: '/migrations/from-langgraph' },
  ]"
  title="Étapes suivantes"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-cards--compact { margin: 18px 0 8px; }
</style>
