---
title: Démarrage rapide de Lumen
description: Intégrez Lumen à vos projets LangGraph / Agent en trois lignes de code, et consultez votre première Trace et vos coûts.
---

<div class="lumen-page">

# Démarrage rapide de Lumen <StatusBadge status="dev" />

À réaliser en 10 minutes : installation → intégration à LangGraph → consultation de la première Trace → déclenchement d’un Replay → calcul des coûts sur 24 h.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">10 minutes</span><span class="lurus-stat__label">au total</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 lignes</span><span class="lurus-stat__label">de code d’intégration</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">0</span><span class="lurus-stat__label">modification de la logique métier</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prérequis</p>
    <div class="lurus-callout__body">Python 3.9+ · Une <Term t="API Key">API Key</Term> Lurus (<a href="/fr/guide/get-api-key">comment l’obtenir</a>) · Un projet Agent LangGraph/LangChain existant (sinon, utilisez l’exemple minimal ci-dessous).</div>
  </div>
</div>

<ol class="lurus-steps">

<li>

**Installation et intégration de LangGraph en trois lignes**

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

Aucune modification de la logique métier n’est nécessaire : tous les appels LLM, appels d’outils et changements d’état sont enregistrés dans le backend Lumen.

</li>

<li>

**Exécuter un exemple minimal**

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

**Consulter la Trace**

Accédez à la console (par défaut `http://localhost:7070`) ou à la page Lumen de la console Lurus : chronologie complète de chaque exécution du graphe, entrées/sorties/durées de chaque nœud, et prompt/completion/nombre de Tokens de chaque appel LLM.

</li>

<li>

**Déclencher un Replay**

Rejouez une exécution à partir d’une séquence d’exécution historique, **sans consommer de Token** (pour reproduire un bug en local, valider une correction ou faire de l’A/B sur les prompts) :

```python
from lumen_ai import Replay
Replay.from_run_id("run_abc123").play()
```

</li>

<li>

**Calculer les coûts sur 24 heures**

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
    <p class="lurus-callout__title">Le Replay est gratuit</p>
    <div class="lurus-callout__body">Le Replay rejoue à partir de la séquence d’exécution enregistrée, <strong>sans rappeler le LLM</strong> : reproduire un bug, valider une correction ou faire de l’A/B sur les prompts ne coûte donc aucun Token.</div>
  </div>
</div>

## Étapes suivantes

<NextSteps
  :steps="[
    { text: 'SDK Python — LumenTracer / LumenCheckpointer / CostTracker en détail', link: '/fr/lumen/python-sdk', primary: true },
    { text: 'Manuel CLI — commandes courantes et échafaudage d\'automatisation', link: '/fr/lumen/cli' },
    { text: 'Intégrations de l\'écosystème — coopération avec Kova / LangGraph / OpenTelemetry', link: '/fr/lumen/integration' },
  ]"
  title="Étapes suivantes"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-stat-strip { margin: 16px 0 8px; }
</style>
