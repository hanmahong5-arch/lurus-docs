---
title: "Pourquoi choisir Lurus"
description: "Passerelle · Agent · Mémoire · Identité : comparatif TCO des quatre capacités clés face au développement interne."
---

<div class="why-lurus-page">

# Pourquoi choisir Lurus

> Si vous évaluez « développer en interne vs acheter », cette page vous offre un comparatif TCO sur quatre capacités clés.

<MetricStats :items="[
  { label: 'Modèles accessibles via la passerelle', value: '50+', hint: 'Une seule Key' },
  { label: 'Ordonnancement Kova', value: '3μs', hint: 'Benchmark Criterion' },
  { label: 'Identité unifiée', value: 'SSO/MFA', hint: 'IdP d’entreprise' },
  { label: 'Règles PII MemX', value: '12 types', hint: 'Incontournables' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="award" :size="14" /> Comparatif clé</span>
  <h2 class="lurus-section-head__title">Quatre capacités clés vs développement interne</h2>
  <p class="lurus-section-head__lede">Passerelle · Exécution d’Agent · Mémoire · Identité — chaque point confronté à la charge d’ingénierie interne.</p>
</div>

<ComparisonTable
  title="Passerelle LLM"
  self-label="Lurus API"
  :competitors="['OneAPI interne', 'LiteLLM interne']"
  :rows="[
    { dimension: 'Nombre de modèles intégrés', self: '50+ (intégrés)', alt: { 'OneAPI interne': 'À intégrer un par un', 'LiteLLM interne': 'À intégrer un par un' } },
    { dimension: 'Compatibilité OpenAI SDK', self: 'Clé en main', alt: { 'OneAPI interne': 'Partielle', 'LiteLLM interne': 'Partielle' } },
    { dimension: 'Facturation + limitation de débit', self: 'Intégrée', alt: { 'OneAPI interne': 'À développer', 'LiteLLM interne': 'À développer' } },
    { dimension: 'Mois-homme d’ingénierie', self: '0', alt: { 'OneAPI interne': '2-4 mois-homme', 'LiteLLM interne': '2-3 mois-homme' } },
  ]"
/>

<ComparisonTable
  title="Moteur d’exécution d’Agent"
  self-label="Kova"
  :competitors="['Temporal interne', 'LangGraph + Redis interne']"
  :rows="[
    { dimension: 'Latence d’ordonnancement', self: '3μs', alt: { 'Temporal interne': '1-10ms', 'LangGraph + Redis interne': '5-20ms' } },
    { dimension: 'Reprise après crash', self: 'WAL automatique', alt: { 'Temporal interne': 'Event Sourcing', 'LangGraph + Redis interne': 'Semi-automatique' } },
    { dimension: 'Dépendances externes', self: 'Aucune', alt: { 'Temporal interne': 'Cassandra/MySQL', 'LangGraph + Redis interne': 'Redis/PG' } },
    { dimension: 'Mois-homme d’ingénierie', self: '0', alt: { 'Temporal interne': '3-6 mois-homme', 'LangGraph + Redis interne': '2-4 mois-homme' } },
  ]"
/>

<ComparisonTable
  title="Mémoire IA"
  self-label="MemX"
  :competitors="['mem0 interne', 'Weaviate + règles interne']"
  :rows="[
    { dimension: 'Filtrage PII', self: '12 règles intégrées', alt: { 'mem0 interne': 'À écrire soi-même', 'Weaviate + règles interne': 'À écrire soi-même' } },
    { dimension: 'Décroissance / oubli', self: 'Courbe d’Ebbinghaus', alt: { 'mem0 interne': 'Aucune', 'Weaviate + règles interne': 'À écrire soi-même' } },
    { dimension: 'Coût de distillation LLM', self: '0 (dégradation par règles)', alt: { 'mem0 interne': 'Coût LLM à chaque fois', 'Weaviate + règles interne': 'Coût LLM à chaque fois' } },
    { dimension: 'Mois-homme d’ingénierie', self: '0', alt: { 'mem0 interne': '1-2 mois-homme', 'Weaviate + règles interne': '3-5 mois-homme' } },
  ]"
/>

<ComparisonTable
  title="Identité et conformité"
  self-label="Lurus Auth"
  :competitors="['Keycloak interne', 'Service cloud Auth0']"
  :rows="[
    { dimension: 'Fédération SSO', self: 'Clé en main', alt: { 'Keycloak interne': 'À configurer', 'Service cloud Auth0': 'Paiement à l’usage' } },
    { dimension: 'Chiffrement national SM4-GCM', self: 'Optionnel', alt: { 'Keycloak interne': 'Non pris en charge', 'Service cloud Auth0': 'Non pris en charge' } },
    { dimension: 'Passkey / MFA', self: 'Intégré', alt: { 'Keycloak interne': 'Partiel', 'Service cloud Auth0': 'Intégré' } },
    { dimension: 'Mois-homme d’ingénierie', self: '0', alt: { 'Keycloak interne': '2-4 mois-homme', 'Service cloud Auth0': '0, mais données transfrontalières' } },
  ]"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Bilan global</span>
  <h2 class="lurus-section-head__title">TCO global</h2>
  <p class="lurus-section-head__lede">Tous les coûts cachés de la suite des quatre capacités — mois-homme, infrastructure, astreinte, conformité — calculés en une seule fois.</p>
</div>

| Poste | Suite développée en interne (par an) | Solution Lurus (par an) |
|------|----------------|------------------|
| Mois-homme d’ingénierie | **8-18 mois-homme** | 0 |
| Infrastructure | ~¥15-30 万 | Paiement à l’usage, déploiement privé possible |
| Maintenance et astreinte | 24×7 toute l’année | SLA Lurus |
| Audit de conformité | À votre charge | Une seule conformité couvre tous les produits |

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="award" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Une seule conformité couvre tous les produits</p>
    <div class="lurus-callout__body">Les quatre capacités partagent la même couche d’identité, de facturation et d’audit — inutile de refaire une évaluation de conformité pour chaque composant, les mois-homme d’ingénierie tombent directement à zéro.</div>
  </div>
</div>

## Liens connexes

<NextSteps :steps="[
  { text: 'Modes de déploiement en entreprise', link: '/fr/solutions/enterprise-deploy', primary: true },
  { text: 'Plateforme IA d’entreprise', link: '/fr/solutions/ai-midware' },
  { text: 'Contacter le service commercial', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
