---
title: "Migration Center"
description: "A zero-friction guide for migrating to Lurus from OpenAI / LangGraph / self-hosted OIDC."
---

<div class="mig-hub">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="import" :size="14" /> Migration Center</span>
  <h1 class="lurus-section-head__title">Migration Center</h1>
  <p class="lurus-section-head__lede">Switch seamlessly to Lurus from your existing stack — timelines, rollback paths, and gotchas explained all at once.</p>
</div>

<div class="action-grid">
  <ActionCard
    name="From OpenAI"
    tagline="5 minutes: just change base_url + api_key"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: 'Start migrating', href: '/en/migrations/from-openai', primary: true },
    ]"
  />
  <ActionCard
    name="From LangGraph"
    tagline="SqliteSaver → LumenCheckpointer + Kova"
    icon="git-branch"
    color="var(--lurus-color-lumen)"
    :actions="[
      { label: 'Start migrating', href: '/en/migrations/from-langgraph', primary: true },
    ]"
  />
  <ActionCard
    name="From self-hosted OIDC"
    tagline="Keycloak / Auth0 → Lurus Auth + SSO federation"
    icon="shield-check"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'Start migrating', href: '/en/migrations/from-self-oidc', primary: true },
    ]"
  />
</div>

## <Icon name="shield-check" :size="20" /> General Migration Principles

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Zero breakage</div>
    <p class="lurus-card__body">Keep your original endpoint on a canary rollout, and let Lurus take over as far as it can.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="rewind" :size="20" /></span>
    <div class="lurus-card__title">Reversible</div>
    <p class="lurus-card__body">Every change comes with explicit revert steps.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Observable</div>
    <p class="lurus-card__body">Run both in parallel during migration and use Lumen to compare the old and new pipelines.</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <div class="lurus-card__title">Phased</div>
    <p class="lurus-card__body">Roll out by traffic share: 5% → 20% → 100%.</p>
  </div>
</div>

## Next Steps

<NextSteps :steps="[
  { text: 'Migrate from OpenAI', link: '/en/migrations/from-openai', primary: true },
  { text: 'Enterprise deployment models', link: '/en/solutions/enterprise-deploy' },
]" />

</div>
