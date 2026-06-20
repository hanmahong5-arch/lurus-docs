---
title: "엔터프라이즈 배포 형태"
description: "SaaS / 온프레미스 / 하이브리드 클라우드 세 가지 배포 형태와 컴플라이언스 경계 비교."
---

<div class="deploy-page">

# 엔터프라이즈 배포 형태

<MetricStats :items="[
  { label: '배포 형태', value: '3 가지', hint: 'SaaS · 온프레미스 · 하이브리드 클라우드' },
  { label: '온프레미스 구축', value: '2-4 주' },
  { label: '엔터프라이즈 가용성', value: '99.95%', hint: 'SaaS 엔터프라이즈' },
  { label: '국산 암호', value: 'SM4-GCM' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="server" :size="14" /> 형태 비교</span>
  <h2 class="lurus-section-head__title">배포 형태 매트릭스</h2>
  <p class="lurus-section-head__lede">동일한 제품, 세 가지 도입 형태——데이터 주권과 구축 기간에 따라 선택합니다.</p>
</div>

| 기능 | SaaS | 온프레미스 | 하이브리드 클라우드 |
|------|------|-------|--------|
| Lurus API 게이트웨이 | ✅ 즉시 사용 | ✅ 이미지 온프레미스화 | ✅ |
| Kova 실행 엔진 | ✅ | ✅ | ✅ |
| MemX 메모리 엔진 | ✅ | ✅ | ✅ |
| Lucrum 퀀트 | ✅ | 🔜 2026 H2 | ✅ |
| Switch / Creator | ✅ 데스크톱 | ✅ 데스크톱 | ✅ |
| 신원 및 컴플라이언스 | ✅ | ✅ | ✅ |
| 데이터 주권 | AWS / 알리클라우드 | **기업 내부** | 혼합 |
| 국산 암호 SM4-GCM | — | ✅ | ✅ |
| 구축 기간 | 즉시 | 2-4 주 | 1-2 주 |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 컴플라이언스</span>
  <h2 class="lurus-section-head__title">컴플라이언스 역량</h2>
  <p class="lurus-section-head__lede">데이터 주권, 감사 추적, 국산 암호화——심사에 한눈에 들어오도록 정리했습니다.</p>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">데이터 국외 미반출</div>
    <p class="lurus-card__body">온프레미스 배포 시 모든 데이터가 Lurus 퍼블릭 클라우드를 거치지 않습니다.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">감사 로그</div>
    <p class="lurus-card__body">모든 API 호출, 신원 이벤트, 관리 작업이 전부 기록됩니다.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">국산 암호 지원</div>
    <p class="lurus-card__body">대칭 암호 SM4-GCM, 비대칭 SM2（로드맵）.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="award" :size="20" /></span>
    <div class="lurus-card__title">등급보호 / 산업 인증</div>
    <p class="lurus-card__body">최신 목록은 <a href="mailto:business@lurus.cn">business@lurus.cn</a> 으로 문의해 주십시오.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> 신원 페더레이션</span>
  <h2 class="lurus-section-head__title">SSO 페더레이션</h2>
  <p class="lurus-section-head__lede">직원이 회사 계정으로 모든 Lurus 제품에 로그인하며, 새로운 신원을 만들 필요가 없습니다.</p>
</div>

기업의 기존 IdP（Okta / Azure AD / 자체 구축 Keycloak）로 직원이 회사 계정을 사용해 로그인합니다:

<ArchitectureDiagram title="기업 IdP 페더레이션 로그인" chart="graph LR; A[企业 IdP] -->|OIDC| B[Lurus Casdoor]; B --> C[所有 Lurus 产品]" />

지원 프로토콜: OIDC / OAuth 2.0 / SAML 2.0 / SCIM（사용자 라이프사이클）.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="activity" :size="14" /> 서비스 수준</span>
  <h2 class="lurus-section-head__title">SLA</h2>
</div>

| 형태 | 가용성 | 사고 대응 |
|------|--------|---------|
| SaaS 표준 | 99.9% | 업무 시간 |
| SaaS 엔터프라이즈 | 99.95% | 7×24 |
| 온프레미스 | 계약에 따라 약정 | 전담 당직 |

## 다음 단계

<NextSteps :steps="[
  { text: '신원 및 컴플라이언스', link: '/ko/platform/auth/', primary: true },
  { text: '왜 Lurus 를 선택하는가', link: '/ko/solutions/why-lurus' },
  { text: '영업 문의', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
