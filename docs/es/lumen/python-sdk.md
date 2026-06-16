---
title: SDK de Python de Lumen
description: "Explicación completa del uso de las tres clases principales: LumenTracer / LumenCheckpointer / CostTracker."
---

<div class="lumen-page">

# SDK de Python de Lumen <StatusBadge status="dev" />

Tras ejecutar `pip install lumen-ai`, el SDK proporciona tres clases principales que cubren la recolección, la persistencia y la agregación de costes:

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--lumen" href="#lumentracer">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">LumenTracer</div>
    <p class="lurus-card__body">Recolección de Trace + Cost en forma de callback.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#lumencheckpointer">
    <span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span>
    <div class="lurus-card__title">LumenCheckpointer</div>
    <p class="lurus-card__body">Capa de persistencia que reemplaza a <code>SqliteSaver</code>.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#costtracker">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">CostTracker</div>
    <p class="lurus-card__body">Consulta de agregación de costes entre agentes.</p>
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

**Parámetros principales**:

| Parámetro | Valor por defecto | Descripción |
|------|--------|------|
| `project` | `"default"` | Identificador del proyecto; determina la pertenencia de los datos |
| `tags` | `{}` | Etiquetas clave-valor añadidas a cada Trace |
| `redact` | `()` | Tupla de nombres de campos a ofuscar automáticamente |
| `backend` | `"local"` | `local` / `lurus` / URL personalizada |

## LumenCheckpointer

Reemplaza al `SqliteSaver` de LangGraph:

```python
from lumen_ai import LumenCheckpointer

graph = workflow.compile(checkpointer=LumenCheckpointer())
```

En comparación con SqliteSaver:

| Dimensión | SqliteSaver | LumenCheckpointer |
|------|-------------|-------------------|
| Velocidad de recuperación | Nivel de milisegundos | **Nivel de microsegundos** (basado en el motor WAL de Kova) |
| Multiproceso | Requiere bloqueo | **Soporte nativo** |
| Persistencia remota | Requiere implementación propia | **Integrada** |
| Asociación de costes | Ninguna | **Automática** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Reemplazo directo, compatible con la API</p>
    <div class="lurus-callout__body"><code>LumenCheckpointer</code> es compatible con la interfaz <code>BaseCheckpointSaver</code> de LangGraph; basta con sustituir el <code>SqliteSaver</code> existente en una sola línea, sin necesidad de modificar la estructura del grafo. Consulta <a href="/es/lumen/integration">Integración del ecosistema · LangGraph</a>.</div>
  </div>
</div>

## CostTracker

Consulta de agregación de costes entre agentes:

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

## Backend personalizado

Por defecto, los datos se escriben en `~/.lumen/`. Para enviarlos a un destino remoto: `LumenTracer(backend="https://lumen.lurus.cn/ingest")`. O bien personaliza:

```python
from lumen_ai.backend import Backend
class MyBackend(Backend):
    def send(self, event): ...
LumenTracer(backend=MyBackend())
```

## Soporte para Async

Todas las operaciones de E/S del SDK son compatibles con asincronía:

```python
import asyncio
from lumen_ai import LumenTracer

async def main():
    tracer = LumenTracer()
    async with tracer:
        await graph.ainvoke({"query": "hi"})

asyncio.run(main())
```

## Siguiente paso

<NextSteps :steps="[
  { text: 'Volver a la introducción', link: '/es/lumen/', primary: true },
  { text: 'Manual de la CLI', link: '/es/lumen/cli' },
  { text: 'Integración del ecosistema', link: '/es/lumen/integration' },
]" />

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-cards--compact { margin: 18px 0 8px; }
</style>
