---
title: "Tutoriel — Créer un agent SAV IA avec mémoire"
description: "Construire un agent SAV à mémoire longue durée avec MemX + Kova + Lurus API, avec un projet complet livré."
---

<div class="memagent-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> MemX × Kova × Lurus API</span>
  <h1 class="lurus-section-head__title">Créer un agent SAV IA avec mémoire</h1>
  <p class="lurus-section-head__lede"><strong>Objectif</strong> : en 30 minutes, faire tourner un agent SAV capable de se souvenir des questions passées de l’utilisateur, de récupérer automatiquement après un crash et de distiller les connaissances à la demande.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">30 minutes</span><span class="lurus-stat__label">Objectif de mise en route</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6 étapes</span><span class="lurus-stat__label">Des dépendances à la réécriture</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 services</span><span class="lurus-stat__label">MemX · Kova · API</span></div>
</div>

## <Icon name="network" :size="20" /> Schéma d’architecture

Chacun des trois services a son rôle : MemX gère le rappel et la distillation de la mémoire longue durée, Lurus API gère les appels au LLM, et Kova WAL gère la persistance de l’état et la récupération après crash.

<ArchitectureDiagram title="Architecture d’un agent SAV IA avec mémoire" chart="graph LR
  U[Utilisateur] --> W[Frontend Web]
  W -->|HTTP| A[Agent App]
  A -->|1. Rappel| M[MemX]
  A -->|2. LLM| L[Lurus API]
  A -->|3. État| K[Kova WAL]
  A -->|4. Écriture| M
  L --> A
  M --> A" />

## <Icon name="workflow" :size="20" /> Les 6 étapes

<ol class="lurus-steps">
<li>

**Préparer les dépendances**

```bash
pip install lurus memx-client kova-py lumen-ai openai
```

</li>
<li>

**Initialiser les trois services**

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

**Définir l’état de l’agent**

```python
from typing import TypedDict, Annotated, Sequence

class State(TypedDict):
    user_id: str
    messages: Annotated[Sequence, "chat history"]
    relevant_memory: list
```

</li>
<li>

**Rappeler l’historique** — récupérer depuis MemX les souvenirs liés à la question courante

```python
def retrieve_memory(state: State) -> State:
    last = state["messages"][-1]["content"]
    hits = mem.search(last, user_id=state["user_id"], limit=5)
    return {**state, "relevant_memory": hits}
```

</li>
<li>

**Appeler le LLM et répondre** — injecter les faits rappelés dans le system prompt

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

**Distiller et réécrire** — réécrire le nouveau dialogue dans MemX, prêt pour le prochain rappel

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

## <Icon name="life-buoy" :size="20" /> Ajouter la récupération après crash avec Kova

Branchez Kova comme checkpointer de LangGraph : après un crash, l’agent reprend depuis le WAL **sans rappeler le LLM** :

```python
from kova.langgraph import KovaCheckpointer

graph = wf.compile(checkpointer=KovaCheckpointer(kova))
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Pourquoi ne pas rappeler le LLM</p>
    <div class="lurus-callout__body"><p>Kova écrit un journal en écriture anticipée (WAL) à chaque étape. Après un crash du processus, le moteur rejoue l’état d’exécution depuis le point d’arrêt : les appels LLM déjà effectués ne sont pas réémis — cela économise des tokens et garantit la cohérence des réponses.</p></div>
  </div>
</div>

## <Icon name="package" :size="20" /> Projet complet livré

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="github" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Dépôt d’exemple</p>
    <div class="lurus-callout__body"><p><a href="https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent">https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent</a> — code complet, <code>docker-compose.yml</code> (MemX + Kova en local), tests Pytest couvrant les trois nœuds, <code>.env.example</code>.</p></div>
  </div>
</div>

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Ajouter l’observabilité avec Lumen', link: '/fr/tutorials/lumen-kova-langgraph', primary: true },
  { text: 'Approfondir les concepts de MemX', link: '/fr/memx/concepts' },
  { text: 'Déployer sur un cluster Kova', link: '/fr/kova/quickstart' },
]" />

</div>
