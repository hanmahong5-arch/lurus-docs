---
title: "Tutorial — Crea un agente de soporte con memoria"
description: "Construye un agente de soporte con memoria a largo plazo usando MemX + Kova + Lurus API, con los artefactos completos del proyecto."
---

<div class="memagent-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> MemX × Kova × Lurus API</span>
  <h1 class="lurus-section-head__title">Crea un agente de soporte con memoria</h1>
  <p class="lurus-section-head__lede"><strong>Objetivo</strong>: poner en marcha en 30 minutos un agente de soporte que recuerde el historial de preguntas del usuario, se recupere automáticamente tras un fallo y destile conocimiento bajo demanda.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">30 minutos</span><span class="lurus-stat__label">Objetivo de puesta en marcha</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6 pasos</span><span class="lurus-stat__label">De las dependencias a la reescritura</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 servicios</span><span class="lurus-stat__label">MemX · Kova · API</span></div>
</div>

## <Icon name="network" :size="20" /> Diagrama de arquitectura

Cada uno de los tres servicios cumple su función: MemX se encarga de la recuperación y destilación de la memoria a largo plazo, Lurus API gestiona las llamadas al LLM y Kova WAL se ocupa de la persistencia del estado y la recuperación ante fallos.

<ArchitectureDiagram title="Arquitectura del agente de soporte con memoria" chart="graph LR
  U[Usuario] --> W[Frontend web]
  W -->|HTTP| A[Agent App]
  A -->|1. Recuperar| M[MemX]
  A -->|2. LLM| L[Lurus API]
  A -->|3. Estado| K[Kova WAL]
  A -->|4. Escribir| M
  L --> A
  M --> A" />

## <Icon name="workflow" :size="20" /> 6 pasos

<ol class="lurus-steps">
<li>

**Preparar las dependencias**

```bash
pip install lurus memx-client kova-py lumen-ai openai
```

</li>
<li>

**Inicializar los tres servicios**

```python
from openai import OpenAI
from memx import Memory
from kova import KovaClient

llm = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-...")
mem = Memory(config={"ace_enabled": True})
kova = KovaClient("kova://localhost")
```

</li>
<li>

**Definir el estado del agente**

```python
from typing import TypedDict, Annotated, Sequence

class State(TypedDict):
    user_id: str
    messages: Annotated[Sequence, "chat history"]
    relevant_memory: list
```

</li>
<li>

**Recuperar el historial** — obtén de MemX los recuerdos relacionados con la pregunta actual

```python
def retrieve_memory(state: State) -> State:
    last = state["messages"][-1]["content"]
    hits = mem.search(last, user_id=state["user_id"], limit=5)
    return {**state, "relevant_memory": hits}
```

</li>
<li>

**Llamar al LLM y responder** — inyecta los hechos recuperados en el system prompt

```python
def respond(state: State) -> State:
    context = "\n".join(h["text"] for h in state["relevant_memory"])
    resp = llm.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": f"已知事实:\n{context}"},
            *state["messages"],
        ],
    )
    reply = resp.choices[0].message.content
    return {**state, "messages": [*state["messages"], {"role": "assistant", "content": reply}]}
```

</li>
<li>

**Destilar y reescribir** — vuelve a escribir la nueva conversación en MemX para que esté disponible en la próxima recuperación

```python
def distill(state: State) -> State:
    mem.add(
        list(state["messages"][-2:]),
        user_id=state["user_id"],
        scope="support:general",
    )
    return state
```

</li>
</ol>

## <Icon name="life-buoy" :size="20" /> Añadir recuperación ante fallos con Kova

Conecta Kova como checkpointer de LangGraph: tras un fallo, el agente se recupera desde el WAL **sin volver a llamar al LLM**:

```python
from kova.langgraph import KovaCheckpointer

graph = wf.compile(checkpointer=KovaCheckpointer(kova))
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Por qué no se vuelve a llamar al LLM</p>
    <div class="lurus-callout__body"><p>Kova escribe un registro de escritura anticipada (WAL) en cada paso. Tras un fallo del proceso, el motor reproduce el estado de ejecución desde el punto de interrupción y las llamadas al LLM ya completadas no se vuelven a emitir: así se ahorran tokens y se garantiza la consistencia de las respuestas.</p></div>
  </div>
</div>

## <Icon name="package" :size="20" /> Artefactos completos del proyecto

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="github" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Repositorio de ejemplo</p>
    <div class="lurus-callout__body"><p><a href="https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent">https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent</a> — incluye la versión completa del código, <code>docker-compose.yml</code> (levanta MemX + Kova en local), Pytest que cubre los tres nodos y <code>.env.example</code>.</p></div>
  </div>
</div>

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Añadir observabilidad con Lumen', link: '/es/tutorials/lumen-kova-langgraph', primary: true },
  { text: 'Profundizar en los conceptos de MemX', link: '/es/memx/concepts' },
  { text: 'Desplegar en un clúster de Kova', link: '/es/kova/quickstart' },
]" />

</div>
