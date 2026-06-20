---
title: "엔터프라이즈 솔루션 개요"
description: "산업 및 역할별 진입점으로 분류한 Lurus 엔터프라이즈 역량."
---

<div class="solutions-hub">

# 엔터프라이즈 솔루션

의사결정자 / 구매 / 아키텍처 심사 / 컴플라이언스 준비를 위한 진입점입니다.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">50+</span><span class="lurus-stat__label">연동 모델</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">배포 형태</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">SM4-GCM</span><span class="lurus-stat__label">국산 암호화</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1 장</span><span class="lurus-stat__label">통합 청구서</span></div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> 역할별</span>
  <h2 class="lurus-section-head__title">나에게 맞는 진입점 찾기</h2>
  <p class="lurus-section-head__lede">CTO는 아키텍처와 TCO를, CISO는 컴플라이언스 경계를, PMO는 청구와 라이선스를 봅니다.</p>
</div>

<div class="action-grid">
  <ActionCard
    name="CTO / 아키텍처 심사"
    tagline="Why Lurus · 배포 형태 · TCO · 성능 벤치마크"
    icon="compass"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: 'Lurus를 선택하는 이유', href: '/ko/solutions/why-lurus', primary: true },
      { label: '엔터프라이즈 배포 형태', href: '/ko/solutions/enterprise-deploy' },
    ]"
  />
  <ActionCard
    name="CISO / 컴플라이언스"
    tagline="SSO 페더레이션 · 국산 SM4-GCM · 감사 로그 · 데이터 주권"
    icon="shield-check"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: '아이덴티티 및 컴플라이언스', href: '/ko/platform/auth/', primary: true },
      { label: '배포 형태 매트릭스', href: '/ko/solutions/enterprise-deploy' },
    ]"
  />
  <ActionCard
    name="PMO / 구매"
    tagline="루베이 단위 청구 · 한 장의 청구서 · 온프레미스 라이선스"
    icon="receipt"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: '청구 상세 설명', href: '/ko/platform/billing', primary: true },
      { label: '영업 문의', href: 'mailto:business@lurus.cn', external: true },
    ]"
  />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> 산업별</span>
  <h2 class="lurus-section-head__title">산업 조합 솔루션</h2>
  <p class="lurus-section-head__lede">각 산업마다 검증된 제품 조합 한 세트로 즉시 구축할 수 있습니다.</p>
</div>

<div class="action-grid">
  <ActionCard
    name="금융"
    tagline="Lucrum + Auth + 컴플라이언스 감사"
    icon="landmark"
    color="var(--lurus-color-lucrum)"
    :actions="[
      { label: '금융 산업 솔루션', href: '/ko/solutions/industry-finance', primary: true },
    ]"
  />
  <ActionCard
    name="콘텐츠"
    tagline="Creator + API + 대량 카피 생산"
    icon="pen-tool"
    color="var(--lurus-color-creator)"
    :actions="[
      { label: '콘텐츠 산업 솔루션', href: '/ko/solutions/industry-content', primary: true },
    ]"
  />
  <ActionCard
    name="개발 도구"
    tagline="Kova + Switch + Lumen 개발자 클로즈드 루프"
    icon="terminal"
    color="var(--lurus-color-switch)"
    :actions="[
      { label: '개발 도구 솔루션', href: '/ko/solutions/industry-devtools', primary: true },
    ]"
  />
  <ActionCard
    name="엔터프라이즈 AI 미들 플랫폼"
    tagline="Auth + API + MemX + Kova + Lumen 5계층 클로즈드 루프"
    icon="layers"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'AI 미들 플랫폼 솔루션', href: '/ko/solutions/ai-midware', primary: true },
    ]"
  />
</div>

## 다음 단계

<NextSteps :steps="[
  { text: 'Lurus를 선택하는 이유', link: '/ko/solutions/why-lurus', primary: true },
  { text: '영업 문의', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>

<style scoped>
.solutions-hub .lurus-stat-strip { margin: 20px 0 8px; }
</style>
