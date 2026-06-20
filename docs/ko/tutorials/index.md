---
title: "크로스 프로덕트 튜토리얼 센터"
description: "여러 Lurus 제품을 엮는 엔드투엔드 튜토리얼을 역할별로 분류했습니다."
---

<div class="tut-hub">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="graduation-cap" :size="14" /> 크로스 프로덕트 튜토리얼</span>
  <h1 class="lurus-section-head__title">크로스 프로덕트 튜토리얼 센터</h1>
  <p class="lurus-section-head__lede">개별 제품의 빠른 시작은 각자의 문서에 있습니다. 여기서는 <strong>여러 제품을 조합한 사례</strong>를 다룹니다——MemX + Kova + API, Lumen + LangGraph 등을 조합해 실제 엔지니어링 문제를 해결합니다.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">4</span><span class="lurus-stat__label">엔드투엔드 튜토리얼</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">5+</span><span class="lurus-stat__label">연동 제품</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2</span><span class="lurus-stat__label">역할 경로</span></div>
</div>

## <Icon name="users" :size="20" /> 역할별

<div class="action-grid">
  <ActionCard
    name="Agent 개발자"
    tagline="Agent에 기억 추가 · 크래시 복구 · Replay 디버깅"
    icon="bot"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: '기억하는 Agent', href: '/ko/tutorials/memory-agent', primary: true },
      { label: 'Lumen × LangGraph × Kova', href: '/ko/tutorials/lumen-kova-langgraph' },
    ]"
  />
  <ActionCard
    name="퀀트 트레이딩"
    tagline="자연어 전략부터 전략 마켓 등록까지의 완전한 루프"
    icon="trending-up"
    color="var(--lurus-color-lucrum)"
    :actions="[
      { label: 'Lucrum 전략 전체 흐름', href: '/ko/tutorials/lucrum-strategy-workflow', primary: true },
    ]"
  />
</div>

## <Icon name="layers" :size="20" /> 주제별

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--memx" href="/ko/tutorials/memory-agent">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">기억 + Agent</div>
    <p class="lurus-card__body">MemX 장기 기억 + Kova 크래시 복구 + Lurus API 호출로, 사용자를 기억하는 고객 상담 봇을 구축합니다.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="/ko/tutorials/lumen-kova-langgraph">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">관측 가능성</div>
    <p class="lurus-card__body">Lumen으로 LangGraph 기본 Checkpointer를 교체하고 Kova에 배포해 크래시 복구 효과를 비교합니다.</p>
  </a>
  <a class="lurus-card lurus-card--lucrum" href="/ko/tutorials/lucrum-strategy-workflow">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title">퀀트 루프</div>
    <p class="lurus-card__body">자연어로 전략 기술 → AI가 vnpy 코드 생성 → 백테스트 → 최적화 → 전략 마켓 등록.</p>
  </a>
  <a class="lurus-card lurus-card--switch" href="/ko/tutorials/switch-mcp-team">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">팀 도구 통합</div>
    <p class="lurus-card__body">Switch로 팀의 AI CLI MCP 설정, 모델 Key, 비용 대시보드를 하나의 중앙 설정으로 수렴합니다.</p>
  </a>
</div>

## <Icon name="workflow" :size="20" /> 권장 경로

<ol class="lurus-steps">
<li>

먼저 각 단일 제품의 빠른 시작을 봅니다（[Lurus API](/ko/guide/quickstart)부터 시작）

</li>
<li>

다음으로 이 섹션에서 업무에 가까운 크로스 프로덕트 튜토리얼 하나를 봅니다

</li>
<li>

마지막으로 [마이그레이션 가이드](/ko/migrations/)를 따라 기존 스택을 교체합니다

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">조합은 곧 복리입니다</p>
    <div class="lurus-callout__body"><p>모든 튜토리얼은 각 제품 문서에 이미 있는 기능만 인용합니다. 먼저 단일 제품을 작동시킨 다음, 튜토리얼을 따라 연결하면 됩니다——계정, 결제, 모델이 같은 풀에 있으므로 중복 연동이 필요 없습니다.</p></div>
  </div>
</div>

## 다음 단계

<NextSteps :steps="[
  { text: '기억하는 Agent', link: '/ko/tutorials/memory-agent', primary: true },
  { text: '마이그레이션 가이드', link: '/ko/migrations/' },
  { text: '엔터프라이즈 솔루션', link: '/ko/solutions/' },
]" />

</div>
