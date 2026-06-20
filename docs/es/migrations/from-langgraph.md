---
title: "Migrar de LangGraph a Lumen + Kova"
description: "SqliteSaver → LumenCheckpointer + LumenTracer, despliega tu Agent en el clúster Kova."
---

<div class="mig-lg-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-branch" :size="14" /> Migrar de LangGraph</span>
  <h1 class="lurus-section-head__title">Migrar de LangGraph a Lumen + Kova</h1>
  <p class="lurus-section-head__lede"><code>SqliteSaver</code> → <code>LumenCheckpointer + LumenTracer</code>, despliega tu Agent en el clúster Kova: sin tocar el código de negocio.</p>
</div>

## <Icon name="sparkles" :size="20" /> Lo que obtienes

| Before (LangGraph puro) | After |
|---------------------|-------|
| Persistencia local con SqliteSaver | **LumenCheckpointer + Kova** recuperación WAL a nivel de microsegundos |
| Sin Trace | **LumenTracer** captura automática |
| Sin estadísticas de coste | **CostTracker** agregado por Node |
| Replay manual | **Replay.from_run_id()** en una línea |

## <Icon name="workflow" :size="20" /> Pasos de migración

<ol class="lurus-steps">
<li>

**Reemplazar el Checkpointer** — `LumenCheckpointer` implementa al 100 % `BaseCheckpointSaver`, sin necesidad de cambiar ningún código de negocio.

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen_ai import LumenCheckpointer

- graph = wf.compile(
-     checkpointer=SqliteSaver.from_conn_string("./state.db")
- )
+ graph = wf.compile(
+     checkpointer=LumenCheckpointer()
+ )
```

</li>
<li>

**Añadir el Tracer** — tras arrancar en local, accede a `http://localhost:7070` para ver la línea de tiempo del Trace.

```diff
+ from lumen_ai import LumenTracer

  graph = wf.compile(
      checkpointer=LumenCheckpointer(),
+     callbacks=[LumenTracer()],
  )
```

</li>
<li>

**Desplegar en Kova**

```yaml
# agent.yaml
name: research-agent
entry: python my_agent.py
checkpointer: lumen
replicas: 3
```

```bash
lumen deploy --target kova://prod-cluster
```

</li>
</ol>

## <Icon name="terminal" :size="20" /> Verificación en local

```bash
python my_agent.py           # 正常跑
kill -9 $(pgrep -f my_agent) # 模拟崩溃
python my_agent.py           # 从中断点继续，不重调 LLM
```

## <Icon name="gauge" :size="20" /> Comparativa de rendimiento

| Métrica | Before | After |
|------|--------|-------|
| Latencia de recuperación | 8ms | **nivel de microsegundos** |
| Multiproceso | requiere bloqueos | **nativo** |
| Entre centros de datos | manual | **replicación asíncrona** |
| Rellamada al LLM | a veces | **nunca** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Rollback</p>
    <div class="lurus-callout__body"><p>Conserva el código antiguo de SqliteSaver como comentario; en cualquier momento puedes revertir el diff para volver al estado original. Los datos no son intercambiables, pero pueden ejecutarse en paralelo.</p></div>
  </div>
</div>

## Próximos pasos

<NextSteps :steps="[
  { text: 'Lumen Python SDK', link: '/es/lumen/python-sdk', primary: true },
  { text: 'Desplegar Kova', link: '/es/kova/quickstart' },
  { text: 'Tutorial completo', link: '/es/tutorials/lumen-kova-langgraph' },
]" />

</div>
