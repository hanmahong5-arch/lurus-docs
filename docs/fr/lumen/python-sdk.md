---
title: SDK Python Lumen
description: "Guide d’utilisation complet des trois classes essentielles : LumenTracer / LumenCheckpointer / CostTracker."
---

<div class="lumen-page">

# SDK Python Lumen <StatusBadge status="dev" />

Après `pip install lumen-ai`, le SDK fournit trois classes essentielles couvrant la collecte, la persistance et l’agrégation des coûts :

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--lumen" href="#lumentracer">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">LumenTracer</div>
    <p class="lurus-card__body">Collecte de Trace + Cost sous forme de callback.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#lumencheckpointer">
    <span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span>
    <div class="lurus-card__title">LumenCheckpointer</div>
    <p class="lurus-card__body">Couche de persistance remplaçant <code>SqliteSaver</code>.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#costtracker">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">CostTracker</div>
    <p class="lurus-card__body">Requête d’agrégation des coûts entre agents.</p>
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

**Principaux paramètres** :

| Paramètre | Valeur par défaut | Description |
|------|--------|------|
| `project` | `"default"` | Identifiant du projet, détermine l’appartenance des données |
| `tags` | `{}` | Étiquettes clé-valeur ajoutées à chaque Trace |
| `redact` | `()` | Tuple des noms de champs à anonymiser automatiquement |
| `backend` | `"local"` | `local` / `lurus` / URL personnalisée |

## LumenCheckpointer

Remplace le `SqliteSaver` de LangGraph :

```python
from lumen_ai import LumenCheckpointer

graph = workflow.compile(checkpointer=LumenCheckpointer())
```

Comparé à SqliteSaver :

| Dimension | SqliteSaver | LumenCheckpointer |
|------|-------------|-------------------|
| Vitesse de restauration | de l’ordre de la milliseconde | **de l’ordre de la microseconde** (basé sur le moteur WAL de Kova) |
| Multi-processus | nécessite un verrou | **support natif** |
| Persistance distante | à implémenter soi-même | **intégrée** |
| Corrélation des coûts | aucune | **automatique** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Remplacement direct, API compatible</p>
    <div class="lurus-callout__body"><code>LumenCheckpointer</code> est compatible avec l’interface <code>BaseCheckpointSaver</code> de LangGraph : il suffit de remplacer le <code>SqliteSaver</code> existant en une ligne, sans modifier la structure du graphe. Voir <a href="/fr/lumen/integration">Intégration à l’écosystème · LangGraph</a>.</div>
  </div>
</div>

## CostTracker

Requête d’agrégation des coûts entre agents :

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

## Backend personnalisé

Par défaut, les données sont écrites dans `~/.lumen/`. Pour les envoyer à distance : `LumenTracer(backend="https://lumen.lurus.cn/ingest")`. Ou pour personnaliser :

```python
from lumen_ai.backend import Backend
class MyBackend(Backend):
    def send(self, event): ...
LumenTracer(backend=MyBackend())
```

## Support Async

Toutes les I/O du SDK sont compatibles avec l’asynchrone :

```python
import asyncio
from lumen_ai import LumenTracer

async def main():
    tracer = LumenTracer()
    async with tracer:
        await graph.ainvoke({"query": "hi"})

asyncio.run(main())
```

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Retour à l\'introduction', link: '/fr/lumen/', primary: true },
  { text: 'Manuel CLI', link: '/fr/lumen/cli' },
  { text: 'Intégration à l\'écosystème', link: '/fr/lumen/integration' },
]" />

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-cards--compact { margin: 18px 0 8px; }
</style>
