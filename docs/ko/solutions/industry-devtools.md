---
title: "개발 도구 산업 솔루션"
description: "Kova + Switch + Lumen — 개발자 도구 기업 및 인프라 팀을 위한 솔루션."
---

<div class="devtools-page">

# 개발 도구 산업 솔루션

<MetricStats :items="[
  { label: '통합 관리 CLI', value: '5종', hint: 'Switch' },
  { label: '게이트웨이 모델', value: '50+' },
  { label: 'Agent 복구', value: '마이크로초급', hint: 'WAL 체크포인트 재개' },
  { label: '연동 컴포넌트', value: '4개', hint: 'Kova · MemX · API · Lumen' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 적용 대상</span>
  <h2 class="lurus-section-head__title">누가 사용하나</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">AI 코딩 도구 기업</div>
    <p class="lurus-card__body">자체 AI 코딩 제품을 구축합니다.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
    <div class="lurus-card__title">Platform / DevX 팀</div>
    <p class="lurus-card__body">사내 개발자 경험을 담당합니다.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="terminal" :size="20" /></span>
    <div class="lurus-card__title">독립 개발자 / 소규모 스튜디오</div>
    <p class="lurus-card__body">가볍게 시작해 필요에 따라 확장합니다.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="graduation-cap" :size="20" /></span>
    <div class="lurus-card__title">연구 기관</div>
    <p class="lurus-card__body">실험적인 Agent 워크플로를 다룹니다.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 핵심 컴포넌트</span>
  <h2 class="lurus-section-head__title">제품 조합</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="kova"   :actions="[{label:'Kova',   href:'/ko/kova/',   primary:true}]" />
  <ActionCard product-id="switch" :actions="[{label:'Switch', href:'/ko/switch/', primary:true}]" />
  <ActionCard product-id="lumen"  :actions="[{label:'Lumen',  href:'/ko/lumen/',  primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="puzzle" :size="14" /> 대표 조합</span>
  <h2 class="lurus-section-head__title">두 가지 적용 조합</h2>
</div>

### 시나리오 A: 자체 AI 코딩 도구 구축

<ArchitectureDiagram title="자체 AI 코딩 도구 구축" chart="graph TB; Kova[Kova<br/>지속 실행 · 크래시 복구] --> MemX[MemX<br/>사용자 선호 / 프로젝트 규칙 기억]; MemX --> API[Lurus API<br/>50+ 모델 플러그 앤 플레이]; API --> Lumen[Lumen<br/>출시 후 관측 + Replay 디버깅]; Lumen --> Auth[Auth<br/>전원 SSO + Passkey]" />

### 시나리오 B: 사내 개발자 ROI 최적화

<ArchitectureDiagram title="사내 개발자 ROI 최적화" chart="graph TB; Switch[Switch<br/>팀의 CLI 5종 통합 관리] --> Lumen[Lumen<br/>1인당 일일 Token 소비를 한눈에]; Lumen --> ArgoCD[ArgoCD<br/>설정 Git 동기화]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="trending-up" :size="14" /> 효과</span>
  <h2 class="lurus-section-head__title">대표 효과</h2>
</div>

| 지표 | Before | After |
|------|--------|-------|
| AI 도구 설정 분산 | JSON 5개 | **yaml 1개** |
| 월간 Token 비용 | 불가시 | **대시보드 + 알림** |
| Agent 크래시 복구 | 처음부터 재시작 | **마이크로초급 체크포인트 재개** |
| 출시 주기 | 주 단위 | **일 단위** |

## 다음 단계

<NextSteps :steps="[
  { text: 'Kova 빠른 시작', link: '/ko/kova/quickstart', primary: true },
  { text: 'Switch 설정', link: '/ko/switch/configuration' },
  { text: 'Lumen 빠른 시작', link: '/ko/lumen/quickstart' },
]" />

</div>
