---
title: "Migrer de LangGraph vers Lumen + Kova"
description: "SqliteSaver → LumenCheckpointer + LumenTracer, déploiement des Agents sur le cluster Kova."
---

<div class="mig-lg-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-branch" :size="14" /> Migration depuis LangGraph</span>
  <h1 class="lurus-section-head__title">Migrer de LangGraph vers Lumen + Kova</h1>
  <p class="lurus-section-head__lede"><code>SqliteSaver</code> → <code>LumenCheckpointer + LumenTracer</code>, déploiement des Agents sur le cluster Kova — sans modifier le code métier.</p>
</div>

## <Icon name="sparkles" :size="20" /> Ce que vous obtenez

| Avant (LangGraph pur) | Après |
|---------------------|-------|
| Persistance SqliteSaver mono-machine | **LumenCheckpointer + Kova** récupération WAL à la microseconde |
| Aucun Trace | **LumenTracer** collecte automatique |
| Aucun suivi de coût | **CostTracker** agrégation par Node |
| Replay manuel | **Replay.from_run_id()** en une ligne |

## <Icon name="workflow" :size="20" /> Étapes de migration

<ol class="lurus-steps">
<li>

**Remplacer le Checkpointer** — `LumenCheckpointer` implémente `BaseCheckpointSaver` à 100 %, sans aucune modification du code métier.

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

**Ajouter le Tracer** — après le démarrage local, accédez à `http://localhost:7070` pour visualiser la chronologie des Traces.

```diff
+ from lumen_ai import LumenTracer

  graph = wf.compile(
      checkpointer=LumenCheckpointer(),
+     callbacks=[LumenTracer()],
  )
```

</li>
<li>

**Déployer sur Kova**

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

## <Icon name="terminal" :size="20" /> Vérification locale

```bash
python my_agent.py           # 正常跑
kill -9 $(pgrep -f my_agent) # 模拟崩溃
python my_agent.py           # 从中断点继续，不重调 LLM
```

## <Icon name="gauge" :size="20" /> Comparaison de performances

| Indicateur | Avant | Après |
|------|--------|-------|
| Latence de récupération | 8ms | **Microseconde** |
| Multi-processus | Verrouillage requis | **Natif** |
| Inter-datacenter | Manuel | **Réplication asynchrone** |
| Réappel LLM | Parfois | **Jamais** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Rollback</p>
    <div class="lurus-callout__body"><p>Conservez l’ancien code SqliteSaver en commentaire ; restaurez le diff à tout moment pour revenir à l’état initial. Les données ne sont pas partagées, mais les deux peuvent tourner en parallèle.</p></div>
  </div>
</div>

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Lumen Python SDK', link: '/fr/lumen/python-sdk', primary: true },
  { text: 'Déployer Kova', link: '/fr/kova/quickstart' },
  { text: 'Tutoriel complet', link: '/fr/tutorials/lumen-kova-langgraph' },
]" />

</div>
