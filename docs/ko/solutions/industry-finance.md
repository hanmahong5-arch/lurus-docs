---
title: "금융 산업 솔루션"
description: "Lucrum + Auth + 컴플라이언스 감사 — 증권사, 자산운용사, 핀테크를 위한 통합 솔루션."
---

<div class="finance-page">

# 금융 산업 솔루션

<MetricStats :items="[
  { label: 'AI 투자 자문', value: '11 개', hint: '다각도' },
  { label: '백테스트 지표', value: '30+' },
  { label: '테스트 케이스', value: '3157+', hint: 'Vitest' },
  { label: '전략 배포', value: '1-3 일' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 적용 대상</span>
  <h2 class="lurus-section-head__title">누가 사용하나</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title">증권사 자기매매</div>
    <p class="lurus-card__body">자기매매 / 고객 A주 퀀트.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="briefcase" :size="20" /></span>
    <div class="lurus-card__title">자산운용사</div>
    <p class="lurus-card__body">전략 리서치 및 포트폴리오 관리.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">핀테크</div>
    <p class="lurus-card__body">AI 투자 자문 제품.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">패밀리 오피스 / 전문 투자자</div>
    <p class="lurus-card__body">개인 전략 리서치 및 백테스트.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 핵심 구성요소</span>
  <h2 class="lurus-section-head__title">제품 조합</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="lucrum" :actions="[{label:'Lucrum 알아보기', href:'/ko/lucrum/', primary:true}]" />
  <ActionCard product-id="auth" :actions="[{label:'통합 인증', href:'/ko/platform/auth/', primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> 데이터 흐름</span>
  <h2 class="lurus-section-head__title">대표 아키텍처</h2>
  <p class="lurus-section-head__lede">자연어 전략에서 실거래까지 — 애널리스트는 아이디어만 설명하고, AI가 코드로 구현합니다.</p>
</div>

<ArchitectureDiagram title="금융 퀀트 데이터 흐름" chart="graph TB; A[애널리스트 / PM] -->|자연어로 전략 설명| B[Lucrum<br/>11 개 AI 투자 자문]; B -->|vnpy 코드 + 백테스트| C[전략 마켓]; C -->|구독 / 수익 배분| D[실거래]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 컴플라이언스</span>
  <h2 class="lurus-section-head__title">컴플라이언스 핵심</h2>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">데이터 역외 반출 없음</div>
    <p class="lurus-card__body">온프레미스 배포, 거래 데이터 로컬 저장.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="calculator" :size="20" /></span>
    <div class="lurus-card__title">금융급 정밀도</div>
    <p class="lurus-card__body">Decimal.js 전 구간 적용, 3,157 개 Vitest 케이스로 검증.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">전 과정 감사</div>
    <p class="lurus-card__body">모든 전략 변경, 백테스트, 거래가 기록으로 남습니다.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">인증 컴플라이언스</div>
    <p class="lurus-card__body">MFA 필수, PAT 정기 교체, SSO 페더레이션으로 사내 IdP 연동 가능.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 비용</span>
  <h2 class="lurus-section-head__title">TCO 참고</h2>
</div>

| 항목 | 자체 구축 | Lucrum 솔루션 |
|------|------|-----------|
| 리서처 인원 | 3-5 명 | 1-2 명 + AI 자문 |
| 전략 배포 주기 | 2-4 주 | **1-3 일** |
| 백테스트 인프라 | 자체 구축 | 내장 |

## 다음 단계

<NextSteps :steps="[
  { text: 'Lucrum 빠른 시작', link: '/ko/lucrum/quickstart', primary: true },
  { text: '전략 전체 흐름', link: '/ko/tutorials/lucrum-strategy-workflow' },
  { text: '영업 문의', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
