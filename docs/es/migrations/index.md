---
title: "Centro de migración"
description: "Guía sin fricciones para migrar a Lurus desde OpenAI / LangGraph / OIDC autoalojado."
---

<div class="mig-hub">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="import" :size="14" /> Centro de migración</span>
  <h1 class="lurus-section-head__title">Centro de migración</h1>
  <p class="lurus-section-head__lede">Cambia a Lurus desde tu stack actual sin fricciones: cronograma, método de reversión y aspectos a tener en cuenta, todo explicado de una vez.</p>
</div>

<div class="action-grid">
  <ActionCard
    name="Desde OpenAI"
    tagline="5 minutos: basta con cambiar base_url + api_key"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: 'Comenzar migración', href: '/es/migrations/from-openai', primary: true },
    ]"
  />
  <ActionCard
    name="Desde LangGraph"
    tagline="SqliteSaver → LumenCheckpointer + Kova"
    icon="git-branch"
    color="var(--lurus-color-lumen)"
    :actions="[
      { label: 'Comenzar migración', href: '/es/migrations/from-langgraph', primary: true },
    ]"
  />
  <ActionCard
    name="Desde OIDC autoalojado"
    tagline="Keycloak / Auth0 → Lurus Auth + federación SSO"
    icon="shield-check"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'Comenzar migración', href: '/es/migrations/from-self-oidc', primary: true },
    ]"
  />
</div>

## <Icon name="shield-check" :size="20" /> Principios generales de migración

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Sin disrupción</div>
    <p class="lurus-card__body">Mantén el endpoint original en despliegue gradual; usa Lurus tanto como puedas.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="rewind" :size="20" /></span>
    <div class="lurus-card__title">Reversible</div>
    <p class="lurus-card__body">Cada cambio tiene pasos de revert claros.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Observable</div>
    <p class="lurus-card__body">Ejecuta en paralelo durante la migración y compara la ruta nueva y la antigua con Lumen.</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <div class="lurus-card__title">Por lotes</div>
    <p class="lurus-card__body">Avanza según la proporción de tráfico: 5% → 20% → 100%.</p>
  </div>
</div>

## Próximos pasos

<NextSteps :steps="[
  { text: 'Migrar desde OpenAI', link: '/es/migrations/from-openai', primary: true },
  { text: 'Modalidades de despliegue empresarial', link: '/es/solutions/enterprise-deploy' },
]" />

</div>
