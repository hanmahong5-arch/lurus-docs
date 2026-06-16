---
title: Architecture de MemX
description: Présentation détaillée de l’architecture en pipeline de MemX, incluant le pipeline d’écriture, le pipeline de recherche et la conception de dégradation indépendante par composant.
---

<div class="memx-page">

# Conception de l’architecture

MemX adopte une architecture en pipeline (Pipeline) : l’écriture et la recherche sont orchestrées par des pipelines indépendants, et tous les composants prennent en charge l’échec indépendant et la dégradation gracieuse.

<MetricStats
  :items="[
    { label: 'Memory API', value: '5 méthodes', hint: 'add / search / status / detect_conflicts / export' },
    { label: 'Pipelines cœur', value: '2', hint: 'Ingest écriture + Retrieval recherche' },
    { label: 'Dégradation', value: 'par composant', hint: 'l\'échec d\'un seul composant n\'interrompt pas le service' },
  ]"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> Topologie</span>
  <h2 class="lurus-section-head__title">Vue d’ensemble du système</h2>
  <p class="lurus-section-head__lede">Deux pipelines indépendants convergent vers le Decay Engine et le stockage vectoriel.</p>
</div>

<ArchitectureDiagram title="Architecture en pipeline de MemX" chart="graph TB
  API[Memory API<br/>add / search / status / detect_conflicts / export]
  API --> Ingest[IngestPipeline écriture]
  API --> Retrieval[RetrievalPipeline recherche]
  Ingest --> I1[Privacy Sanitizer] --> I2[Reflector] --> I3[Curator] --> I4[mem0.add]
  Retrieval --> R1[Generator L1-L4] --> R2[ScoreMerger] --> R3[TokenBudgetTrimmer] --> R4[RecallReinforcer]
  I4 --> Decay[Decay Engine<br/>calcul de décroissance asynchrone]
  R4 --> Decay
  Decay --> Store[(Vector Store<br/>mem0 Backend)]" />

## Pipeline d’écriture — IngestPipeline

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">La passerelle de confidentialité est incontournable</p>
    <div class="lurus-callout__body"><p>Privacy Sanitizer est la première étape du pipeline et ne peut être contournée ; 12 règles intégrées de détection d’informations sensibles assurent l’interception avant que les données ne soient écrites dans la base vectorielle, et le sanitizer ne lève jamais d’exception.</p></div>
  </div>
</div>

`Raw Input` traverse successivement :

1. **Privacy Sanitizer** (incontournable) — 12 règles intégrées de détection d’informations sensibles + expressions régulières personnalisées ; le sanitizer ne lève jamais d’exception.
2. **Reflector** — mode hybrid (pré-filtrage par règles + raffinement LLM) : PatternDetector (détection de 5 motifs) → KnowledgeScorer (notation + classification) → PrivacySanitizer (anonymisation des connaissances candidates) → BulletDistiller (compression en entrées affinées). En cas d’échec, repli sur l’add original.
3. **Curator** — déduplication par similarité cosinus : ≥0,8 fusion (merge_content/keep_best), 0,5-0,8 marquage de conflit potentiel, <0,5 passage en connaissance indépendante. En cas d’échec, la déduplication est sautée et l’écriture se fait directement.
4. **BulletFactory** — conversion du format des métadonnées → persistance via `mem0.add()` dans la base de données vectorielle.

### Chemins de dégradation du pipeline d’écriture

Chaque étape dispose de sa propre gestion d’erreur indépendante :

| Étape | Comportement en cas d’échec | Impact sur les données |
|------|---------|---------|
| Privacy Sanitizer | N’échoue jamais (try-catch interne) | Données brutes transmises |
| Reflector | Repli sur le `mem0.add()` original | La connaissance est stockée directement sans raffinement |
| Curator | Déduplication sautée | Risque de doublons |
| mem0.add | Lève une exception | Échec de l’écriture |

## Pipeline de recherche — RetrievalPipeline

`Query` traverse successivement :

1. **Generator Engine** — L1 ExactMatcher (mots exacts) / L2 FuzzyMatcher (token flou) / L3 MetadataMatcher (Jaccard sur métadonnées) / L4 VectorSearcher (sémantique vectorielle). Échec de L4 → mode mots-clés pur.
2. **ScoreMerger** (fusion pondérée) : `NormKW = (L1+L2+L3)/35` ; `Blended = KW×0.6 + S×0.4` ; `Final = Blended×Decay×Recency×Scope`.
3. **TokenBudgetTrimmer** (double contrainte) : `max_results=5` + `token_budget=2000`, estimation de tokens consciente du CJK.
4. Renvoi des résultats à l’appelant, tandis que **RecallReinforcer** incrémente de façon asynchrone le `recall_count` des mémoires touchées (sans bloquer la réponse de recherche).

## Modèle de données

Les métadonnées complètes portées par chaque mémoire (Bullet) :

```python
{
    "id": "mem_a1b2c3d4",
    "content": "pytest 超时问题：使用 -x --timeout=30 逐个运行",
    "section": "DEBUGGING",
    "knowledge_type": "TRICK",
    "instructivity_score": 78,
    "source_type": "INTERACTION",

    # Decay tracking
    "recall_count": 3,
    "decay_weight": 0.89,
    "created_at": "2026-02-20T10:30:00Z",
    "last_recalled_at": "2026-02-27T15:00:00Z",

    # Taxonomy
    "related_tools": ["pytest"],
    "key_entities": ["timeout", "test-isolation"],
    "tags": ["python", "testing"],
    "scope": "project:my-backend"
}
```

## Embeddings locaux

MemX exécute le modèle d’embeddings localement via ONNX Runtime, sans API externe, entièrement hors ligne et sans fuite de confidentialité : modèle all-MiniLM-L6-v2, dimension 384, stockage `~/.memx/models/`, premier téléchargement d’environ 90 Mo, inférence < 5 ms/entrée.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">all-MiniLM-L6-v2</span><span class="lurus-stat__label">Modèle d’embeddings</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">384</span><span class="lurus-stat__label">Dimension vectorielle</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">~90MB</span><span class="lurus-stat__label">Premier téléchargement</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">&lt;5ms</span><span class="lurus-stat__label">Inférence par entrée</span></div>
</div>

## Mode démon

Démon en arrière-plan optionnel : plusieurs agents/processus (Agent A/B/C) partagent le même Vector Store via le **MemX Daemon (IPC Socket)**. La communication par IPC Socket évite la contention sur les connexions à la base de données ; arrêt automatique après expiration du délai d’inactivité (300 secondes par défaut) ; adapté aux plugins d’IDE, aux fenêtres multiples, etc.

<ArchitectureDiagram title="Topologie de partage en mode démon" chart="graph LR
  A[Agent A] --> D[MemX Daemon<br/>IPC Socket]
  B[Agent B] --> D
  C[Agent C] --> D
  D --> S[(Vector Store partagé)]" />

## Référence de configuration

```python
from memx import Memory

m = Memory(config={
    # ACE Engine
    "ace_enabled": True,

    # Reflector — hybrid mode: rule pre-filter + LLM refinement
    "reflector": {
        "mode": "hybrid",       # "rules" | "hybrid"(default) | "llm"
        "min_score": 30.0,      # minimum knowledge score threshold
        "llm_model": "openai/gpt-4o-mini",
    },

    # Curator — semantic deduplication
    "curator": {
        "similarity_threshold": 0.8,    # auto-merge threshold
        "merge_strategy": "keep_best",  # "keep_best" or "merge_content"
    },

    # Decay — bionic forgetting curve
    "decay": {
        "half_life_days": 30.0,         # days to decay to 50%
        "boost_factor": 0.1,            # recall reinforcement coefficient
        "permanent_threshold": 15,      # min recalls for permanent memory
    },

    # Retrieval — hybrid 4-layer search
    "retrieval": {
        "keyword_weight": 0.6,
        "semantic_weight": 0.4,
        "max_results": 5,
        "token_budget": 2000,
    },

    # Privacy — sensitive data filtering (secrets / tokens / local paths)
    "privacy": {
        "custom_patterns": [
            r"INTERNAL_KEY_\w+"
        ],
    },
})
```

---

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Concepts fondamentaux — comprendre en profondeur les quatre modules cœur du moteur ACE', link: '/fr/memx/concepts', primary: true },
    { text: 'Démarrage rapide — découvrir les fonctionnalités cœur de MemX en 5 minutes', link: '/fr/memx/quickstart' },
    { text: 'Questions fréquentes — réponses aux questions courantes d\'utilisation', link: '/fr/memx/faq' },
  ]"
/>

</div>

<style>
.memx-page .lurus-section-head {
  margin-top: 2.5rem;
}
.memx-page .metric-stats,
.memx-page .lurus-stat-strip {
  margin: 1.5rem 0 2rem;
}
.memx-page .lurus-callout {
  margin: 1.25rem 0;
}
</style>
