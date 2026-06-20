---
title: "왜 Lurus를 선택해야 하는가"
description: "게이트웨이 · Agent · 메모리 · 신원 네 가지 핵심 역량 vs 직접 구축의 TCO 비교."
---

<div class="why-lurus-page">

# 왜 Lurus를 선택해야 하는가

> "직접 구축 vs 도입"을 평가 중이라면, 이 페이지는 네 가지 핵심 역량에 대한 TCO 비교를 제공합니다.

<MetricStats :items="[
  { label: '게이트웨이 연동 모델', value: '50+', hint: '단일 Key' },
  { label: 'Kova 스케줄링', value: '3μs', hint: 'Criterion 벤치마크' },
  { label: '통합 신원', value: 'SSO/MFA', hint: '기업 IdP 연동' },
  { label: 'MemX PII 규칙', value: '12종', hint: '우회 불가' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="award" :size="14" /> 핵심 비교</span>
  <h2 class="lurus-section-head__title">네 가지 핵심 역량 vs 직접 구축</h2>
  <p class="lurus-section-head__lede">게이트웨이 · Agent 실행 · 메모리 · 신원——항목별로 직접 구축 공수를 비교합니다.</p>
</div>

<ComparisonTable
  title="LLM 게이트웨이"
  self-label="Lurus API"
  :competitors="['자체 구축 OneAPI', '자체 구축 LiteLLM']"
  :rows="[
    { dimension: '연동 모델 수', self: '50+（내장）', alt: { '자체 구축 OneAPI': '개별 연동 필요', '자체 구축 LiteLLM': '개별 연동 필요' } },
    { dimension: 'OpenAI SDK 호환', self: '즉시 사용', alt: { '자체 구축 OneAPI': '부분', '자체 구축 LiteLLM': '부분' } },
    { dimension: '과금 + 속도 제한', self: '내장', alt: { '자체 구축 OneAPI': '직접 구축 필요', '자체 구축 LiteLLM': '직접 구축 필요' } },
    { dimension: '엔지니어링 인월', self: '0', alt: { '자체 구축 OneAPI': '2-4 인월', '자체 구축 LiteLLM': '2-3 인월' } },
  ]"
/>

<ComparisonTable
  title="Agent 실행 엔진"
  self-label="Kova"
  :competitors="['자체 구축 Temporal', '자체 구축 LangGraph + Redis']"
  :rows="[
    { dimension: '스케줄링 지연', self: '3μs', alt: { '자체 구축 Temporal': '1-10ms', '자체 구축 LangGraph + Redis': '5-20ms' } },
    { dimension: '크래시 복구', self: 'WAL 자동', alt: { '자체 구축 Temporal': 'Event Sourcing', '자체 구축 LangGraph + Redis': '반자동' } },
    { dimension: '외부 의존성', self: '없음', alt: { '자체 구축 Temporal': 'Cassandra/MySQL', '자체 구축 LangGraph + Redis': 'Redis/PG' } },
    { dimension: '엔지니어링 인월', self: '0', alt: { '자체 구축 Temporal': '3-6 인월', '자체 구축 LangGraph + Redis': '2-4 인월' } },
  ]"
/>

<ComparisonTable
  title="AI 메모리"
  self-label="MemX"
  :competitors="['자체 구축 mem0', '자체 구축 Weaviate + 규칙']"
  :rows="[
    { dimension: 'PII 필터링', self: '12 규칙 내장', alt: { '자체 구축 mem0': '직접 작성 필요', '자체 구축 Weaviate + 규칙': '직접 작성 필요' } },
    { dimension: '감쇠/망각', self: 'Ebbinghaus 곡선', alt: { '자체 구축 mem0': '없음', '자체 구축 Weaviate + 규칙': '직접 작성 필요' } },
    { dimension: 'LLM 증류 비용', self: '0（규칙 폴백）', alt: { '자체 구축 mem0': '매번 LLM 비용', '자체 구축 Weaviate + 규칙': '매번 LLM 비용' } },
    { dimension: '엔지니어링 인월', self: '0', alt: { '자체 구축 mem0': '1-2 인월', '자체 구축 Weaviate + 규칙': '3-5 인월' } },
  ]"
/>

<ComparisonTable
  title="신원 및 컴플라이언스"
  self-label="Lurus Auth"
  :competitors="['자체 구축 Keycloak', 'Auth0 클라우드 서비스']"
  :rows="[
    { dimension: 'SSO 페더레이션', self: '즉시 사용', alt: { '자체 구축 Keycloak': '설정 필요', 'Auth0 클라우드 서비스': '사용량 과금' } },
    { dimension: '국가 암호 SM4-GCM', self: '선택 가능', alt: { '자체 구축 Keycloak': '미지원', 'Auth0 클라우드 서비스': '미지원' } },
    { dimension: 'Passkey / MFA', self: '내장', alt: { '자체 구축 Keycloak': '부분', 'Auth0 클라우드 서비스': '내장' } },
    { dimension: '엔지니어링 인월', self: '0', alt: { '자체 구축 Keycloak': '2-4 인월', 'Auth0 클라우드 서비스': '0, 단 데이터 국외 반출' } },
  ]"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 종합 비용</span>
  <h2 class="lurus-section-head__title">종합 TCO</h2>
  <p class="lurus-section-head__lede">네 가지 세트의 숨은 비용——인월, 인프라, 당직, 컴플라이언스——을 한 번에 정산합니다.</p>
</div>

| 항목 | 직접 구축 4종 세트（연간） | Lurus 방안（연간） |
|------|----------------|------------------|
| 엔지니어링 인월 | **8-18 인월** | 0 |
| 인프라 | ~¥15-30만 | 사용량 과금, 온프레미스 가능 |
| 유지보수 당직 | 연중 24×7 | Lurus SLA |
| 컴플라이언스 감사 | 직접 부담 | 한 세트의 컴플라이언스로 모든 제품 커버 |

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="award" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">한 세트의 컴플라이언스로 모든 제품 커버</p>
    <div class="lurus-callout__body">네 가지 역량이 동일한 신원, 과금, 감사 계층을 공유합니다——각 세트마다 컴플라이언스 평가를 따로 수행할 필요가 없으며, 엔지니어링 인월이 곧바로 0이 됩니다.</div>
  </div>
</div>

## 관련 링크

<NextSteps :steps="[
  { text: '기업 배포 형태', link: '/ko/solutions/enterprise-deploy', primary: true },
  { text: '기업 AI 미들플랫폼', link: '/ko/solutions/ai-midware' },
  { text: '비즈니스 문의', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
