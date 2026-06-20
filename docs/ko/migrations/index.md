---
title: "마이그레이션 센터"
description: "OpenAI / LangGraph / 자체 구축 OIDC에서 Lurus로 무중단 이전하는 가이드입니다."
---

<div class="mig-hub">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="import" :size="14" /> 마이그레이션 센터</span>
  <h1 class="lurus-section-head__title">마이그레이션 센터</h1>
  <p class="lurus-section-head__lede">기존 기술 스택에서 Lurus로 매끄럽게 전환하는 방법을 타임라인, 롤백 방식, 주의사항까지 한 번에 설명합니다.</p>
</div>

<div class="action-grid">
  <ActionCard
    name="OpenAI에서"
    tagline="5분: base_url + api_key만 바꾸면 됩니다"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: '마이그레이션 시작', href: '/ko/migrations/from-openai', primary: true },
    ]"
  />
  <ActionCard
    name="LangGraph에서"
    tagline="SqliteSaver → LumenCheckpointer + Kova"
    icon="git-branch"
    color="var(--lurus-color-lumen)"
    :actions="[
      { label: '마이그레이션 시작', href: '/ko/migrations/from-langgraph', primary: true },
    ]"
  />
  <ActionCard
    name="자체 구축 OIDC에서"
    tagline="Keycloak / Auth0 → Lurus Auth + SSO 페더레이션"
    icon="shield-check"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: '마이그레이션 시작', href: '/ko/migrations/from-self-oidc', primary: true },
    ]"
  />
</div>

## <Icon name="shield-check" :size="20" /> 공통 마이그레이션 원칙

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">무중단</div>
    <p class="lurus-card__body">기존 엔드포인트를 카나리로 유지하고, Lurus를 갈 수 있는 만큼 진행합니다.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="rewind" :size="20" /></span>
    <div class="lurus-card__title">롤백 가능</div>
    <p class="lurus-card__body">모든 변경에는 명확한 revert 절차가 있습니다.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">관찰 가능</div>
    <p class="lurus-card__body">마이그레이션 기간에는 병렬로 실행하며, Lumen으로 신규 경로와 기존 경로를 비교합니다.</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <div class="lurus-card__title">단계적 전환</div>
    <p class="lurus-card__body">트래픽 비율에 따라 5% → 20% → 100%로 진행합니다.</p>
  </div>
</div>

## 다음 단계

<NextSteps :steps="[
  { text: 'OpenAI에서 마이그레이션', link: '/ko/migrations/from-openai', primary: true },
  { text: '엔터프라이즈 배포 형태', link: '/ko/solutions/enterprise-deploy' },
]" />

</div>
