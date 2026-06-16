---
title: Concepts fondamentaux de MemX
description: "Les quatre modules fondamentaux du moteur ACE de MemX : distillation intelligente, déduplication sémantique, oubli par décroissance et recherche hybride."
---

<div class="memx-page">

# Concepts fondamentaux

Le moteur ACE (Adaptive Context Engine) de MemX est composé de quatre modules fondamentaux qui fonctionnent indépendamment tout en collaborant, pour assurer une gestion complète du cycle de vie de la connaissance.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> Moteur ACE</span>
  <h2 class="lurus-section-head__title">Les quatre modules fondamentaux</h2>
  <p class="lurus-section-head__lede">Distillation → déduplication → décroissance → recherche, couvrant l’intégralité du cycle de vie de la connaissance.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: 'Reflector · Distillation de connaissances', body: 'Mode hybride : présélection par règles + raffinement par LLM, 5 règles de détection, réduisant les appels de plus de 90 % par rapport au tout-LLM.', icon: 'filter' },
    { title: 'Curator · Déduplication sémantique', body: 'Déduplication à trois niveaux par similarité cosinus : ≥ 0,8 fusion, 0,5~0,8 marquage de conflit, en dessous de 0,5 écriture indépendante.', icon: 'database-backup' },
    { title: 'Decay · Décroissance temporelle', body: 'Courbe de l\'oubli d\'Ebbinghaus, demi-vie de 30 jours, renforcement par rappel + protection à trois niveaux de la mémoire permanente.', icon: 'timer' },
    { title: 'Generator · Recherche hybride', body: 'Recherche à quatre niveaux L1~L4, fusion mot-clé 0,6 + sémantique 0,4, puis multiplication par les bonus de décroissance/récence/portée.', icon: 'search' },
  ]"
/>

## <Term t="Reflector">Reflector</Term> — Moteur de distillation de connaissances

Reflector est l’innovation la plus centrale de MemX : l’extraction intelligente de connaissances à **coût extrêmement faible**. Les systèmes de mémoire IA traditionnels s’appuient à chaque fois sur un LLM pour extraire les connaissances d’une conversation, consommant 2 à 5 K tokens. Reflector utilise par défaut le mode **hybrid** : présélection par règles + appel du LLM pour raffinement uniquement sur les candidats à valeur ajoutée, réduisant ainsi de plus de 90 % le coût des appels par rapport au tout-LLM.

### Trois modes d’exécution

| Mode | Description | Coût LLM |
|------|------|---------|
| `rules` | Moteur de règles pur, entièrement basé sur la correspondance de motifs | Zéro appel LLM |
| `hybrid` (par défaut) | Présélection par règles + raffinement par LLM, moyenne des scores | Appel uniquement sur les candidats, réduction de plus de 90 % |
| `llm` | S’appuie entièrement sur le LLM pour extraire les connaissances | 2 à 5 K tokens à chaque fois |

**Flux de travail hybrid** : conversation brute → PatternDetector (détection par règles) → éléments de connaissance candidats → évaluation + distillation par LLM (uniquement les candidats) → moyenne du score des règles et du score du LLM → KnowledgeScorer (classification par score) → PrivacySanitizer (anonymisation de la vie privée) → BulletDistiller (compression et raffinement).

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Mode hybride par défaut + dégradation automatique</p>
    <div class="lurus-callout__body"><p>Lorsque le LLM est indisponible, bascule automatiquement en mode règles pur : zéro appel, zéro coût.</p></div>
  </div>
</div>

### Cinq règles de détection

| Règle | Logique de détection | Confiance | Scénario typique |
|------|---------|--------|---------|
| ErrorFixRule | Identifie la structure « erreur → solution » | 0,8 | "TypeError: ... → il fallait en fait ajouter une assertion de type" |
| RetrySuccessRule | Détecte le chemin de réussite après plusieurs tentatives | 0,7 | "J’ai essayé A et B sans succès, finalement la solution C a résolu le problème" |
| ConfigChangeRule | Met en correspondance les modifications de configuration / variables d’environnement | 0,6 | "Passer MAX_POOL_SIZE de 10 à 50" |
| NewToolRule | Identifie un outil / une bibliothèque utilisé pour la première fois | 0,65 | "Première fois que j’utilise pnpm, bien plus rapide que npm" |
| RepetitiveOpRule | Comptabilise les opérations répétées (déclenchement à partir de 3 fois) | 0,5+ | "À chaque déploiement, il faut vider le cache manuellement" |

### Système de classification des connaissances

Chaque connaissance est automatiquement classée selon deux dimensions : **Section** (thème) et **KnowledgeType** (type) :

- **8 Sections** : `COMMANDS` · `DEBUGGING` · `ARCHITECTURE` · `WORKFLOW` · `TOOLS` · `PATTERNS` · `PREFERENCES` · `GENERAL`
- **5 KnowledgeType** : `METHOD` (méthodologie) · `TRICK` (astuce) · `PITFALL` (piège rencontré) · `PREFERENCE` (préférence) · `KNOWLEDGE` (fait)

### Instructivity Score

Chaque connaissance reçoit un **score de valeur pédagogique** de 0 à 100, calculé globalement à partir de la confiance de la correspondance de motifs + la spécificité / l’actionnabilité + la présence ou non d’une relation de cause à effet explicite. Les candidats en dessous de `min_score` (par défaut 30) sont écartés.

## <Term t="Curator">Curator</Term> — Moteur de déduplication sémantique

Curator traite automatiquement les doublons et les contradictions à chaque écriture.

### Stratégie de déduplication à trois niveaux

Écriture d’une nouvelle connaissance → calcul de la similarité cosinus avec les connaissances existantes : **≥ 0,8** fusion automatique (keep_best ou merge_content) ; **0,5~0,8** marquage d’un conflit potentiel en attente de confirmation ; **< 0,5** considérée comme une connaissance indépendante, écriture normale.

**Stratégies de fusion** : `keep_best` (par défaut, conserve la version au instructivity_score le plus élevé) / `merge_content` (fusionne les deux contenus pour générer une version plus complète).

### Détection de conflits

Analyse proactive des mémoires contradictoires (exemple : similarité de 0,72 mais conclusions opposées — "Régler le pool de connexions Redis à 10 suffit" vs "Il faut au moins 50 pour la stabilité", avec une suggestion de confirmer la meilleure pratique et de supprimer la version obsolète). Détection à tout moment via la CLI : `memx conflicts`.

## <Term t="Decay">Decay</Term> — Moteur de décroissance temporelle

Simule la courbe naturelle de l’oubli de la mémoire humaine, garantissant que la base de connaissances reste toujours « fraîche ».

### Formule de décroissance

```
base_weight = 2^(-age_days / half_life)
boosted     = base_weight × (1 + boost_factor × recall_count)
final       = clamp(boosted, 0.0, 1.0)
```

**Paramètres clés** :

| Paramètre | Valeur par défaut | Description |
|------|--------|------|
| `half_life` | 30 jours | Nombre de jours nécessaires pour que le poids décroisse à 50 % |
| `boost_factor` | 0.1 | Coefficient de bonus de poids à chaque rappel |

**Exemple chiffré** (half_life=30, boost_factor=0.1) :

| Scénario | age_days | recall_count | base_weight | final |
|------|----------|-------------|-------------|-------|
| Vient d’être écrite | 0 | 0 | 1.0 | **1.0** (période de protection) |
| 30 jours sans usage | 30 | 0 | 0.5 | **0.5** |
| 60 jours sans usage | 60 | 0 | 0.25 | **0.25** |
| 30 jours, récupérée 5 fois | 30 | 5 | 0.5 | **0.75** |
| 90 jours, récupérée 15 fois | 90 | 15 | 0.125 | **1.0** (recall>=15 déclenche la mémoire permanente, formule contournée) |

### Mécanisme de protection à trois niveaux

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Protection à trois niveaux</p>
    <div class="lurus-callout__body"><ul><li><code>recall_count ≥ 15</code> → mémoire permanente (weight fixé à 1.0)</li><li><code>age ≤ 7 jours</code> → période de protection (weight fixé à 1.0)</li><li><code>weight &lt; 0.02</code> → candidate à l’archivage (peut être nettoyée)</li></ul></div>
  </div>
</div>

Intuition : ce qui vient d’être appris (sous 7 jours) reste clair ; ce qu’on rappelle souvent devient de plus en plus solide ; au-delà de 15 utilisations cela devient une « mémoire musculaire » ; ce qu’on n’utilise plus longtemps s’oublie peu à peu.

### Effet de la décroissance lors de la recherche

Le poids de décroissance intervient directement dans le score final du classement de recherche :

```
Final Score = Blended Search Score × DecayWeight × RecencyBoost × ScopeBoost
```

- `RecencyBoost` : les connaissances créées dans les 7 derniers jours obtiennent un bonus de 1,2x
- `ScopeBoost` : les connaissances correspondant à la portée actuelle obtiennent un bonus de 1,3x

## Generator — Moteur de recherche hybride

Dépasse les limites de la <Term t="Vector Search">recherche vectorielle</Term> pure : une recherche à quatre niveaux couvrant tout le spectre, de la correspondance exacte à la compréhension sémantique.

### Architecture de recherche à quatre niveaux

| Niveau | Moteur | Mode de correspondance | Scénario avantageux |
|------|------|---------|---------|
| L1 | ExactMatcher | Correspondance exacte de mots | "pytest -v", noms d’API |
| L2 | FuzzyMatcher | Correspondance floue de tokens | Variantes orthographiques, variations morphologiques |
| L3 | MetadataMatcher | Similarité de Jaccard sur tools / entities / tags | "Connaissances à propos de Redis" |
| L4 | VectorSearcher | Recherche sémantique par plongement vectoriel | "Comment améliorer les performances des tests" |

### Formule de fusion des scores

```
NormKeyword = (L1 + L2 + L3) / 35.0        # 归一化到 [0, 1]
Blended     = NormKeyword × 0.6 + Semantic × 0.4
Final       = Blended × DecayWeight × RecencyBoost × ScopeBoost
```

Le poids de la recherche par mots-clés (0,6) est supérieur à celui de la recherche sémantique (0,4), garantissant que les résultats en correspondance exacte sont affichés en priorité.

**Exemple chiffré** : pour la requête "pytest timeout", calcul du score d’une mémoire :
- L1 (exact)=8, L2 (flou)=5, L3 (métadonnées)=3 → NormKeyword = (8+5+3)/35 = 0,457
- L4 (sémantique) = 0,72
- Blended = 0,457×0,6 + 0,72×0,4 = 0,562
- DecayWeight=0,89, RecencyBoost=1,0, ScopeBoost=1,3
- **Final = 0,562 × 0,89 × 1,0 × 1,3 = 0,650**

### Dégradation gracieuse

Lorsque la recherche vectorielle L4 est indisponible (échec du chargement du modèle de plongement), bascule automatiquement en mode mots-clés pur (`keyword_weight=1.0, semantic_weight=0.0`). La défaillance d’une seule couche de recherche n’interrompt jamais le service.

## Gestion du budget de tokens

Les résultats de recherche sont soumis à une double contrainte : `max_results` (nombre maximal de résultats renvoyés, par défaut 5) + `token_budget` (budget maximal de tokens, par défaut 2000).

**Conscience CJK** (garantit que le chinois n’est pas excessivement tronqué à cause d’une estimation erronée du nombre de tokens) : caractères CJK 1,5 caractère/token ; caractères latins 4,0 caractères/token.

## Portées hiérarchiques

Les connaissances sont organisées hiérarchiquement pour le contrôle d’accès : `global` (visible par tous les projets) → `project:my-backend` (uniquement ce projet) → `workspace:feat-auth` (uniquement cet espace de travail). Les connaissances correspondant à la portée actuelle obtiennent un bonus de score de 1,3x ; une portée supérieure est visible par les portées inférieures (global pour tous les projets), mais l’inverse n’est pas vrai.

---

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Conception de l\'architecture — architecture complète du pipeline et flux de données', link: '/fr/memx/architecture', primary: true },
    { text: 'Démarrage rapide — découvrez les fonctionnalités clés de MemX en 5 minutes', link: '/fr/memx/quickstart' },
    { text: 'Questions fréquentes — réponses aux questions courantes lors de l\'utilisation', link: '/fr/memx/faq' },
  ]"
/>

</div>

<style>
.memx-page .lurus-section-head {
  margin-top: 2.5rem;
}
.memx-page .cap-grid {
  margin: 1.5rem 0 2.25rem;
}
.memx-page .lurus-callout {
  margin: 1.25rem 0;
}
</style>
