---
title: "엔터프라이즈 AI 미드웨어 솔루션"
description: "5계층 폐회로 — Auth · API · MemX · Kova · Lumen, 기업이 자체 AI 미드웨어를 구축하도록 지원합니다."
---

<div class="midware-page">

# 엔터프라이즈 AI 미드웨어 솔루션

<MetricStats :items="[
  { label: '능력 계층', value: '5 계층', hint: '독립 사용 가능 · 조합 폐회로' },
  { label: '게이트웨이 모델', value: '50+' },
  { label: 'Kova 복구', value: '마이크로초급', hint: 'WAL 체크포인트 재개' },
  { label: '도입 경로', value: '10주', hint: '참고' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 아키텍처</span>
  <h2 class="lurus-section-head__title">5계층 폐회로</h2>
  <p class="lurus-section-head__lede">위에서 아래로 — 각 계층은 독립적으로 사용 가능하며, 조합하면 폐회로 가치가 더 높아집니다.</p>
</div>

<ArchitectureDiagram title="AI 미드웨어 5계층 폐회로" chart="graph TB; App[비즈니스 애플리케이션 계층<br/>고객 응대 · 지식 베이스 · 리포트 · 개발자 도구] --> Lumen[Lumen 가관측성<br/>Trace / Replay / Cost]; Lumen --> Kova[Kova Agent 실행 엔진<br/>WAL / Checkpoint]; Kova --> MemX[MemX 지능형 메모리<br/>증류 / 중복 제거 / 감쇠 / 검색]; MemX --> API[Lurus API 통합 게이트웨이<br/>50+ 모델 / 계량 / 속도 제한]; API --> Auth[Lurus Auth 통합 신원<br/>SSO · MFA · OIDC · 페더레이션]" />

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen — 가관측성</div>
    <p class="lurus-card__body">Trace / Replay / Cost.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova — Agent 실행 엔진</div>
    <p class="lurus-card__body">WAL / Checkpoint, 크래시 후 체크포인트 재개.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">MemX — 지능형 메모리</div>
    <p class="lurus-card__body">증류 / 중복 제거 / 감쇠 / 검색.</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Lurus API — LLM 통합 게이트웨이</div>
    <p class="lurus-card__body">50+ 모델 / 계량 / 속도 제한.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Lurus Auth — 통합 신원</div>
    <p class="lurus-card__body">SSO · MFA · OIDC · 페더레이션.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> 가치 비교</span>
  <h2 class="lurus-section-head__title">단독 도입 vs 5계층 협업</h2>
</div>

| 항목 | 단독 사용 | 5계층 협업 |
|------|---------|---------|
| 신원 | 각자 구현 | **SSO 한 번** |
| 비용 집계 | 직접 부담 | **Lumen + API 자동 연동** |
| 크래시 복구 | 수동 추가 | **Kova WAL 백업** |
| 지식 축적 | 분산 | **MemX 통합 증류** |
| 컴플라이언스 | 개별 평가 | **단일 컴플라이언스 커버** |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package" :size="14" /> 제공</span>
  <h2 class="lurus-section-head__title">대표 제공 형태</h2>
</div>

| 형태 | 설명 | 기간 |
|------|------|------|
| SaaS | 즉시 사용 가능 | 0 |
| 온프레미스 | 기업 K8s에 이미지 배포 | 2-4주 |
| 매니지드 운영 | Lurus 당직 운영, 기업 내부망 | 협의 |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 로드맵</span>
  <h2 class="lurus-section-head__title">참고 도입 경로</h2>
  <p class="lurus-section-head__lede">10주 단계별 연동, 2주마다 한 계층씩 제공하며 독립적으로 검증 가능합니다.</p>
</div>

<ol class="lurus-steps">
  <li><strong>W1-2</strong>: <a href="/ko/guide/introduction">Lurus API</a>를 연결해 기존 LLM 호출 대체</li>
  <li><strong>W3-4</strong>: <a href="/ko/platform/auth/">Auth</a>를 연결해 SSO 구현</li>
  <li><strong>W5-6</strong>: <a href="/ko/memx/">MemX</a>로 비즈니스 지식 축적</li>
  <li><strong>W7-8</strong>: 핵심 Agent를 <a href="/ko/kova/">Kova</a>로 이전</li>
  <li><strong>W9-10</strong>: 전체 체인에 <a href="/ko/lumen/">Lumen</a> 가관측성 연동</li>
</ol>

## 다음 단계

<NextSteps :steps="[
  { text: 'Lurus를 선택하는 이유', link: '/ko/solutions/why-lurus', primary: true },
  { text: '엔터프라이즈 배포 형태', link: '/ko/solutions/enterprise-deploy' },
  { text: '비즈니스 문의', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
