---
title: MemX — Moteur de mémoire adaptative pour l’IA
description: Moteur de mémoire pour l’IA construit sur ACE v2.0 — distillation intelligente, oubli bio-inspiré, protection de la confidentialité de bout en bout.
---

<div class="memx-page">

<ProductHero product-id="memx" />

## Qu’est-ce que MemX ?

**MemX** est le moteur de mémoire adaptative pour l’IA proposé par Lurus, construit sur **<Term t="ACE">ACE (Adaptive Context Engine)</Term> v2.0**. Il offre aux agents IA une gestion complète du cycle de vie des connaissances : **<Term t="Knowledge Distillation">distillation intelligente</Term> → <Term t="Semantic Dedup">déduplication sémantique</Term> → oubli par décroissance → recherche hybride**, donnant à l’IA une véritable « mémoire » semblable à celle de l’humain.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="brain" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Trois atouts majeurs</p>
    <div class="lurus-callout__body"><ul><li><strong>Mode hybride par défaut + repli automatique</strong> — lorsque le LLM est indisponible, bascule sur des règles pures : zéro appel, zéro coût.</li><li><strong>Courbe d’oubli bio-inspirée</strong> — décroissance exponentielle d’Ebbinghaus, demi-vie de 30 jours par défaut, les éléments fortement rappelés sont promus en mémoire permanente.</li><li><strong>Protection de la confidentialité de bout en bout</strong> — les informations sensibles n’entrent jamais dans la base de données vectorielle.</li></ul></div>
  </div>
</div>

<MetricStats :items="[
  { label: 'Règles de filtrage PII', value: '12 règles', hint: 'Incontournables' },
  { label: 'Recherche hybride', value: '4 couches', hint: 'Fusion pondérée L1→L4' },
  { label: 'Demi-vie de décroissance', value: '30 jours', hint: 'Configurable par défaut' },
  { label: 'Modes de livraison', value: 'Python · REST · MCP' },
]" />

## Fonctionnalités clés

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Quatre modules</span>
  <h2 class="lurus-section-head__title">De la conversation à une mémoire interrogeable</h2>
  <p class="lurus-section-head__lede">Détail des règles, formules et paramètres dans <a href="/fr/memx/concepts">Concepts fondamentaux</a> et <a href="/fr/memx/architecture">Conception de l’architecture</a>.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: 'Distillation intelligente des connaissances (Reflector)', body: 'Le mode hybride (présélection par règles + raffinement par LLM) identifie 5 motifs de connaissance : correction d’erreur / nouvelle tentative réussie / changement de configuration / utilisation d’un nouvel outil / opération répétée, chacun noté de 0 à 100 pour filtrer le bruit à faible score.', icon: 'filter' },
    { title: 'Déduplication sémantique et détection de conflits (Curator)', body: 'Similarité cosinus ≥0,8 : fusion automatique ; 0,5-0,8 : marquage de conflit potentiel ; inférieure à 0,5 : considérée comme une connaissance indépendante.', icon: 'git-merge' },
    { title: 'Décroissance de mémoire bio-inspirée', body: 'Période de protection de 7 jours + décroissance exponentielle + renforcement par rappel ; un élément récupéré plus de 15 fois est promu en mémoire permanente et ne décroît plus.', icon: 'timer' },
    { title: 'Recherche hybride à quatre couches', body: 'L1 exacte → L2 floue → L3 métadonnées → L4 vectorielle ; après fusion pondérée par ScoreMerger, multiplication par DecayWeight × RecencyBoost × ScopeBoost ; repli automatique si la couche vectorielle est indisponible.', icon: 'search' },
    { title: 'Conception axée sur la confidentialité', body: '12 règles intégrées de filtrage des informations sensibles (clés / Token / chaînes de connexion à la base de données / chemins locaux / expressions régulières personnalisées), interception automatique avant écriture.', icon: 'shield-check' },
  ]"
/>

## Vue d’ensemble de l’architecture

Les connaissances affluent depuis les conversations, passent successivement par la distillation, le filtrage de confidentialité et la déduplication, puis sont stockées dans le stockage vectoriel et de métadonnées ; les requêtes de recherche empruntent le pipeline hybride à quatre couches, tandis que le moteur de décroissance entretient en continu, en arrière-plan, l’activité des mémoires.

<ArchitectureDiagram
  title="Flux de données du moteur ACE"
  chart="graph TB
  Input[Flux de conversation] --> Reflector[Reflector distillation des connaissances]
  Reflector --> PII[Filtrage PII 12 règles]
  PII --> Curator[Curator déduplication sémantique]
  Curator --> Store[(Vectoriel + métadonnées)]
  Store --> Decay[Decay Engine Ebbinghaus]
  Query[Requête de recherche] --> Hybrid[Recherche hybride à quatre couches]
  Hybrid --> Store"
/>

## Cas d’usage

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
    <div class="lurus-card__title">Assistant de programmation</div>
    <p class="lurus-card__body">Se souvient de vos habitudes de code, des pièges rencontrés et des conventions de projet.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span>
    <div class="lurus-card__title">Système de support client</div>
    <p class="lurus-card__body">Accumule les connaissances issues des interactions passées avec les clients pour offrir un service personnalisé.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="book-open" :size="20" /></span>
    <div class="lurus-card__title">Base de connaissances personnelle</div>
    <p class="lurus-card__body">Extrait et organise automatiquement les connaissances à partir des conversations quotidiennes.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">Collaboration d’équipe</div>
    <p class="lurus-card__body">Partage une mémoire au niveau de l’équipe ; les nouveaux membres acquièrent rapidement le contexte.</p>
  </div>
</div>

## Comparaison avec les systèmes de mémoire traditionnels

<ComparisonTable
  self-label="MemX (ACE)"
  :competitors="['Solution traditionnelle (mem0)']"
  title="Pourquoi ce n’est pas une énième base vectorielle"
  :rows="[
    { dimension: 'Extraction des connaissances', self: 'moteur hybride (présélection par règles + raffinement par LLM, réduisant les appels de plus de 90 %)', alt: { 'Solution traditionnelle (mem0)': 'LLM (2-5K tokens à chaque fois)' } },
    { dimension: 'Déduplication', self: 'fusion automatique par similarité cosinus', alt: { 'Solution traditionnelle (mem0)': 'jugement par LLM élément par élément' } },
    { dimension: 'Oubli', self: 'décroissance exponentielle + renforcement par rappel', alt: { 'Solution traditionnelle (mem0)': 'stockage permanent, impossible à éliminer' } },
    { dimension: 'Recherche', self: 'recherche hybride à quatre couches', alt: { 'Solution traditionnelle (mem0)': 'recherche vectorielle uniquement' } },
    { dimension: 'Confidentialité', self: '12 règles intégrées de filtrage des informations sensibles', alt: { 'Solution traditionnelle (mem0)': 'aucune protection intégrée' } },
    { dimension: 'Portée', self: 'hiérarchisée (global / project / workspace)', alt: { 'Solution traditionnelle (mem0)': 'plate (user / agent)' } },
    { dimension: 'Gestion des tokens', self: 'rognage budgétaire intégré (sensible au CJK)', alt: { 'Solution traditionnelle (mem0)': 'à la charge de l’appelant' } },
    { dimension: 'Embedding local', self: 'inférence locale ONNX, entièrement hors ligne', alt: { 'Solution traditionnelle (mem0)': 'nécessite une API' } },
  ]"
/>

## Étapes suivantes

<NextSteps
  :steps="[
    { text: 'Démarrage rapide — découvrez les fonctions clés en 5 minutes', link: '/fr/memx/quickstart', primary: true },
    { text: 'Concepts fondamentaux — au cœur des principes de conception du moteur ACE', link: '/fr/memx/concepts' },
    { text: 'Conception de l’architecture — architecture système complète', link: '/fr/memx/architecture' },
    { text: 'Intégrations et catalogue MCP', link: '/integrations/' },
    { text: 'Questions fréquentes', link: '/fr/memx/faq' },
  ]"
/>

<!-- lurus:related-block -->

## Produits liés et étapes suivantes

<RelatedProducts product-id="memx" />

</div>

<style>
.memx-page .lurus-callout {
  margin: 20px 0;
}
.memx-page .lurus-section-head {
  margin-top: 8px;
}
</style>
