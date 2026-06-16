---
title: Inicio rápido de Lumen
description: Integra Lumen en tu proyecto LangGraph / Agent con tres líneas de código y consulta tu primer Trace y costo.
---

<div class="lumen-page">

# Inicio rápido de Lumen <StatusBadge status="dev" />

Completa en 10 minutos: instalar → integrar LangGraph → ver el primer Trace → activar Replay → calcular el costo de 24 h.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">10 minutos</span><span class="lurus-stat__label">en total</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 líneas</span><span class="lurus-stat__label">código de integración</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">0</span><span class="lurus-stat__label">cambios en la lógica de negocio</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Requisitos previos</p>
    <div class="lurus-callout__body">Python 3.9+ · Lurus <Term t="API Key">API Key</Term>（<a href="/es/guide/get-api-key">cómo obtenerla</a>）· un proyecto Agent de LangGraph/LangChain existente (si no tienes uno, usa el ejemplo mínimo de abajo).</div>
  </div>
</div>

<ol class="lurus-steps">

<li>

**Instalación e integración de LangGraph en tres líneas**

```bash
pip install lumen-ai
```
```python
from lumen_ai import LumenTracer, LumenCheckpointer
graph = workflow.compile(
    checkpointer=LumenCheckpointer(),   # 崩溃恢复
    callbacks=[LumenTracer()],           # 执行追踪 + 成本追踪
)
```

Sin necesidad de modificar la lógica de negocio, todas las llamadas a LLM, llamadas a herramientas y cambios de estado se registran en el backend de Lumen.

</li>

<li>

**Ejecuta un ejemplo mínimo**

```python
from langgraph.graph import StateGraph, END
from lumen_ai import LumenTracer, LumenCheckpointer
from typing import TypedDict

class State(TypedDict):
    query: str
    result: str

def search(state: State) -> State:
    return {**state, "result": f"已处理: {state['query']}"}

wf = StateGraph(State)
wf.add_node("search", search)
wf.set_entry_point("search")
wf.add_edge("search", END)

graph = wf.compile(
    checkpointer=LumenCheckpointer(),
    callbacks=[LumenTracer()],
)

graph.invoke({"query": "什么是 WAL"})
```

</li>

<li>

**Ver el Trace**

Accede a la consola (por defecto `http://localhost:7070`) o a la página de Lumen en la consola de Lurus: la línea de tiempo completa de cada ejecución de graph, las entradas/salidas/tiempos de cada nodo, y el prompt/completion/número de Token de las llamadas a LLM.

</li>

<li>

**Activar Replay**

Reproduce una vez a partir de la secuencia de ejecución histórica, **sin consumir Token** (útil para reproducir bugs localmente, validar correcciones y hacer A/B de Prompt):

```python
from lumen_ai import Replay
Replay.from_run_id("run_abc123").play()
```

</li>

<li>

**Calcular el costo de 24 horas**

```python
from lumen_ai import CostTracker

print(CostTracker.summary(hours=24))
# { total_tokens: 128_340, cost_rmb: 12.47, by_model: {...} }
```

</li>

</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Replay no cuesta dinero</p>
    <div class="lurus-callout__body">Replay reproduce a partir de la secuencia de ejecución registrada, <strong>no vuelve a invocar al LLM</strong>, por lo que reproducir bugs, validar correcciones y hacer A/B de Prompt tienen un costo de cero Token.</div>
  </div>
</div>

## Siguiente paso

<NextSteps
  :steps="[
    { text: 'Python SDK — LumenTracer / LumenCheckpointer / CostTracker en detalle', link: '/lumen/python-sdk', primary: true },
    { text: 'Manual de la CLI — comandos habituales y andamiaje de automatización', link: '/lumen/cli' },
    { text: 'Integraciones del ecosistema — colaboración con Kova / LangGraph / OpenTelemetry', link: '/lumen/integration' },
  ]"
  title="Siguiente paso"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-stat-strip { margin: 16px 0 8px; }
</style>
