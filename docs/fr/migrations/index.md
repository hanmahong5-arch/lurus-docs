---
title: "Centre de migration"
description: "Guide sans douleur pour migrer vers Lurus depuis OpenAI / LangGraph / OIDC auto-hébergé."
---

<div class="mig-hub">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="import" :size="14" /> Centre de migration</span>
  <h1 class="lurus-section-head__title">Centre de migration</h1>
  <p class="lurus-section-head__lede">Basculez de votre pile technique existante vers Lurus en toute transparence : calendrier, méthode de rollback et points de vigilance expliqués en une fois.</p>
</div>

<div class="action-grid">
  <ActionCard
    name="Depuis OpenAI"
    tagline="5 minutes : il suffit de modifier base_url + api_key"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: 'Démarrer la migration', href: '/fr/migrations/from-openai', primary: true },
    ]"
  />
  <ActionCard
    name="Depuis LangGraph"
    tagline="SqliteSaver → LumenCheckpointer + Kova"
    icon="git-branch"
    color="var(--lurus-color-lumen)"
    :actions="[
      { label: 'Démarrer la migration', href: '/fr/migrations/from-langgraph', primary: true },
    ]"
  />
  <ActionCard
    name="Depuis un OIDC auto-hébergé"
    tagline="Keycloak / Auth0 → Lurus Auth + fédération SSO"
    icon="shield-check"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'Démarrer la migration', href: '/fr/migrations/from-self-oidc', primary: true },
    ]"
  />
</div>

## <Icon name="shield-check" :size="20" /> Principes généraux de migration

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Zéro rupture</div>
    <p class="lurus-card__body">Conservez vos endpoints d’origine en déploiement progressif, et laissez Lurus monter en charge aussi loin que possible.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="rewind" :size="20" /></span>
    <div class="lurus-card__title">Réversible</div>
    <p class="lurus-card__body">Chaque changement dispose d’étapes de revert explicites.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Observable</div>
    <p class="lurus-card__body">Exécutez en parallèle pendant la migration et comparez les anciennes et nouvelles chaînes avec Lumen.</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <div class="lurus-card__title">Par lots</div>
    <p class="lurus-card__body">Progressez selon la proportion de trafic 5 % → 20 % → 100 %.</p>
  </div>
</div>

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Migrer depuis OpenAI', link: '/fr/migrations/from-openai', primary: true },
  { text: 'Modes de déploiement entreprise', link: '/fr/solutions/enterprise-deploy' },
]" />

</div>
