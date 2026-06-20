---
title: "Tutoriel — Lumen × LangGraph × Kova"
description: "Remplacez le SqliteSaver par défaut de LangGraph par Lumen, déployez sur le Cluster Kova et comparez la récupération après crash."
---

<div class="lkl-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Lumen × LangGraph × Kova</span>
  <h1 class="lurus-section-head__title">Lumen × LangGraph × Kova</h1>
  <p class="lurus-section-head__lede"><strong>Objectif</strong> : faire passer le Checkpointer d’un Agent LangGraph de <code>SqliteSaver</code> à <code>LumenCheckpointer</code>, le déployer sur Kova et observer la comparaison de récupération après crash.</p>
</div>

## <Icon name="git-branch" :size="20" /> Avant / Après

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">Avant — LangGraph seul</div>
    <p class="lurus-card__body">Mono-machine, sans sauvegarde distante · verrouillage requis entre processus · récupération après crash de l’ordre de la milliseconde · aucun suivi des coûts.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Après — Lumen + Kova</div>
    <p class="lurus-card__body">Récupération après crash de l’ordre de la microseconde (moteur WAL de Kova) · sécurité multi-processus native · Trace + Cost automatiques · persistance distante.</p>
  </div>
</div>

### Avant

```python
from langgraph.checkpoint.sqlite import SqliteSaver

graph = wf.compile(checkpointer=SqliteSaver.from_conn_string("./state.db"))
```

### Après

```python
from lumen_ai import LumenCheckpointer, LumenTracer
from kova import KovaClient

kova = KovaClient("kova://prod-cluster")

graph = wf.compile(
    checkpointer=LumenCheckpointer(kova_client=kova),
    callbacks=[LumenTracer()],
)
```

## <Icon name="terminal" :size="20" /> Validation locale

<ol class="lurus-steps">
<li>

**Démarrer Kova en local**

```bash
docker run -d --name kova -p 9999:9999 ghcr.io/hanmahong5-arch/kova:latest
```

</li>
<li>

**Exécuter votre Agent**

```bash
python my_agent.py
```

</li>
<li>

**Simuler un crash**

```bash
kill -9 $(pgrep -f my_agent)
```

</li>
<li>

**Redémarrer — reprise depuis le point d’interruption**

```bash
python my_agent.py
```

</li>
</ol>

## <Icon name="rocket" :size="20" /> Déployer sur Kova

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

## <Icon name="gauge" :size="20" /> Expérience comparative de récupération après crash

| Indicateur | SqliteSaver | Lumen + Kova |
|------|-------------|--------------|
| Latence de récupération | 8 ms (mono-machine) | **niveau microseconde** |
| Multi-réplicas | verrouillage supplémentaire requis | **natif** |
| Multi-datacenter | copie manuelle | **réplication asynchrone intégrée** |
| Réappel LLM | réappel si l’écriture SQLite échoue | **jamais de réappel** |
| Trace | aucune | **corrélation automatique** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">D’où vient la récupération en microsecondes</p>
    <div class="lurus-callout__body"><p>La latence d’ordonnancement du moteur Kova descend jusqu’à 3 μs (pipeline FIFO complet, benchmark Criterion à 3,17 μs, 315 K ops/s). <code>LumenCheckpointer</code> confie l’écriture des checkpoints de LangGraph au WAL de Kova — la récupération passe par un rejeu WAL au niveau du moteur plutôt que par un fichier SQLite, d’où un niveau microseconde, bien plus rapide que la milliseconde d’un SQLite mono-machine.</p></div>
  </div>
</div>

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Migrer depuis LangGraph', link: '/fr/migrations/from-langgraph', primary: true },
  { text: 'SDK Python de Lumen', link: '/fr/lumen/python-sdk' },
  { text: 'Concepts de Kova', link: '/fr/kova/concepts' },
]" />

</div>
