---
title: "Solution pour le secteur financier"
description: "Lucrum + Auth + audit de conformité — une solution combinée pour les courtiers, la gestion d’actifs et la fintech."
---

<div class="finance-page">

# Solution pour le secteur financier

<MetricStats :items="[
  { label: 'Conseillers en investissement IA', value: '11', hint: 'multi-perspective' },
  { label: 'Indicateurs de backtest', value: '30+' },
  { label: 'Cas de test', value: '3157+', hint: 'Vitest' },
  { label: 'Mise en production d’une stratégie', value: '1-3 jours' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Public concerné</span>
  <h2 class="lurus-section-head__title">Qui l’utilise</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title">Compte propre des courtiers</div>
    <p class="lurus-card__body">Quantification d’actions A pour compte propre / clients.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="briefcase" :size="20" /></span>
    <div class="lurus-card__title">Sociétés de gestion d’actifs</div>
    <p class="lurus-card__body">Recherche de stratégies et gestion de portefeuille.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Fintech</div>
    <p class="lurus-card__body">Produits de conseil en investissement IA.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">Family offices / investisseurs professionnels</div>
    <p class="lurus-card__body">Recherche et backtest de stratégies personnelles.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Composants clés</span>
  <h2 class="lurus-section-head__title">Combinaison de produits</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="lucrum" :actions="[{label:'Découvrir Lucrum', href:'/fr/lucrum/', primary:true}]" />
  <ActionCard product-id="auth" :actions="[{label:'Identité unifiée', href:'/fr/platform/auth/', primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> Flux de données</span>
  <h2 class="lurus-section-head__title">Architecture type</h2>
  <p class="lurus-section-head__lede">Du langage naturel à la stratégie en production — l’analyste décrit son idée, l’IA produit le code.</p>
</div>

<ArchitectureDiagram title="Flux de données quantitatif financier" chart="graph TB; A[Analyste / PM] -->|Stratégie décrite en langage naturel| B[Lucrum<br/>11 conseillers en investissement IA]; B -->|Code vnpy + backtest| C[Marché de stratégies]; C -->|Abonnement / partage des revenus| D[Trading en réel]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Conformité</span>
  <h2 class="lurus-section-head__title">Points forts de conformité</h2>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">Données qui ne quittent pas le territoire</div>
    <p class="lurus-card__body">Déploiement on-premise, données de trading stockées localement.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="calculator" :size="20" /></span>
    <div class="lurus-card__title">Précision de niveau financier</div>
    <p class="lurus-card__body">Decimal.js de bout en bout, validé par 3 157 cas de test Vitest.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">Audit intégral</div>
    <p class="lurus-card__body">Chaque modification de stratégie, backtest et transaction est tracé.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Conformité des identités</div>
    <p class="lurus-card__body">MFA obligatoire, rotation périodique des PAT, fédération SSO connectable à l’IdP interne.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Coûts</span>
  <h2 class="lurus-section-head__title">Référence TCO</h2>
</div>

| Poste | En interne | Solution Lucrum |
|------|------|-----------|
| Nombre de chercheurs | 3-5 personnes | 1-2 personnes + conseillers IA |
| Cycle de mise en production d’une stratégie | 2-4 semaines | **1-3 jours** |
| Infrastructure de backtest | À construire | Intégrée |

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Démarrage rapide Lucrum', link: '/fr/lucrum/quickstart', primary: true },
  { text: 'Flux complet d’une stratégie', link: '/fr/tutorials/lucrum-strategy-workflow' },
  { text: 'Contacter le service commercial', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
