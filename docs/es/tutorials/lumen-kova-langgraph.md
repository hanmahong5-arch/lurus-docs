---
title: "Tutorial — Lumen × LangGraph × Kova"
description: "Reemplaza el SqliteSaver predeterminado de LangGraph por Lumen, despliega en Kova Cluster y compara el efecto de la recuperación tras un fallo."
---

<div class="lkl-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Lumen × LangGraph × Kova</span>
  <h1 class="lurus-section-head__title">Lumen × LangGraph × Kova</h1>
  <p class="lurus-section-head__lede"><strong>Objetivo</strong>: cambiar el Checkpointer de un Agent de LangGraph de <code>SqliteSaver</code> a <code>LumenCheckpointer</code>, desplegarlo en Kova y observar la comparación de la recuperación tras un fallo.</p>
</div>

## <Icon name="git-branch" :size="20" /> Antes / Después

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">Antes — LangGraph puro</div>
    <p class="lurus-card__body">Una sola máquina, sin copia de seguridad remota · Requiere bloqueo entre procesos · Sin seguimiento de costes.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Después — Lumen + Kova</div>
    <p class="lurus-card__body">Recuperación desde el punto de interrupción del WAL tras un fallo (motor Kova) · Seguridad multiproceso nativa · Trace + Cost automáticos · Persistencia remota.</p>
  </div>
</div>

### Antes

```python
from langgraph.checkpoint.sqlite import SqliteSaver

graph = wf.compile(checkpointer=SqliteSaver.from_conn_string("./state.db"))
```

### Después

```python
from lumen_ai import LumenCheckpointer, LumenTracer
from kova import KovaClient

kova = KovaClient("kova://prod-cluster")

graph = wf.compile(
    checkpointer=LumenCheckpointer(kova_client=kova),
    callbacks=[LumenTracer()],
)
```

## <Icon name="terminal" :size="20" /> Validación local

<ol class="lurus-steps">
<li>

**Arrancar Kova en local**

```bash
docker run -d --name kova -p 9999:9999 ghcr.io/hanmahong5-arch/kova:latest
```

</li>
<li>

**Ejecutar tu Agent**

```bash
python my_agent.py
```

</li>
<li>

**Simular un fallo**

```bash
kill -9 $(pgrep -f my_agent)
```

</li>
<li>

**Reiniciar — continuar desde el punto de interrupción**

```bash
python my_agent.py
```

</li>
</ol>

## <Icon name="rocket" :size="20" /> Desplegar en Kova

```yaml
# agent.yaml
name: my-research-agent
entry: python my_agent.py
replicas: 3
checkpointer: lumen
wal:
  retention: 7d
```

```bash
lumen deploy --target kova://prod-cluster
```

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Migrar desde LangGraph', link: '/es/migrations/from-langgraph', primary: true },
  { text: 'SDK de Python de Lumen', link: '/es/lumen/python-sdk' },
  { text: 'Conceptos de Kova', link: '/es/kova/concepts' },
]" />

</div>
