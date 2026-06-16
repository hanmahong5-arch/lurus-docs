---
title: Lucrum 자주 묻는 질문
description: Lucrum AI 퀀트 트레이딩 플랫폼의 자주 묻는 질문과 답변.
---

<div class="lucrum-page">

# 자주 묻는 질문

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> 계정 및 시작하기</span>
  <h2 class="lurus-section-head__title">가입, 결제 및 시장 커버리지</h2>
</div>

<details class="lurus-faq-item">
<summary>어떻게 가입하나요?</summary>

[lucrum.lurus.cn](https://lucrum.lurus.cn)에서 Lurus 통합 계정으로 로그인하세요(모든 제품이 동일한 계정을 공유합니다).

</details>

<details class="lurus-faq-item">
<summary>유료인가요?</summary>

무료 / 유료 두 가지가 있으며, 무료 한도를 초과하면 [鹿贝 지갑](/ko/platform/billing#wallet)에서 차감됩니다.

| 기능 | 무료 | 유료 |
|------|------|------|
| AI 트레이딩 어시스턴트 | 매일 제한된 대화 | 무제한 |
| 전략 마켓 둘러보기 / 무료 전략 | 전체 노출 / 사용 가능 | 전체 노출 / 사용 가능 |
| 유료 전략 구독 | 사용 불가 | 구독 가능 |
| 전략 개발 | 기본 백테스트 | 전체 기능 |

</details>

<details class="lurus-faq-item">
<summary>어떤 시장을 지원하나요?</summary>

현재는 A주(상하이·선전 양 시장)를 지원하며, 홍콩 주식 / 미국 주식 / 암호화폐는 연동 진행 중입니다.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> AI 어시스턴트</span>
  <h2 class="lurus-section-head__title">정확성, 기억 및 코드 생성</h2>
</div>

<details class="lurus-faq-item">
<summary>분석이 정확한가요?</summary>

LLM + 기술적 분석을 기반으로 참고 자료를 제공하며, **투자 권유에 해당하지 않습니다**. 기술 지표 / 캔들 차트 해석, 시장 논리 정리, 전략 구상 및 코드 작성 보조에 강점이 있습니다. 단기 등락 예측에는 약하므로, 의사결정의 참고 자료로 활용하되 근거로 삼지 마세요.

</details>

<details class="lurus-faq-item">
<summary>대화를 기억하나요?</summary>

기억합니다. [MemX 메모리 엔진](/ko/memx/)을 통합하여 선호도 / 관심 섹터 / 과거 대화를 기억하며, 사용자별로 격리되어 유출되지 않습니다.

</details>

<details class="lurus-faq-item">
<summary>AI로 전략 코드를 작성할 수 있나요?</summary>

가능합니다. 아이디어를 설명하면 AI가 Python 코드 프레임워크를 생성하며, 전략 워크벤치에서 바로 백테스트로 검증할 수 있습니다.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> 전략 관련</span>
  <h2 class="lurus-section-head__title">백테스트 신뢰도, 출금 및 코드 보호</h2>
</div>

<details class="lurus-faq-item">
<summary>백테스트 데이터를 신뢰할 수 있나요?</summary>

실제 과거 시세를 사용하지만, 충격 비용과 슬리피지는 고려하지 않으며(대규모 자금에서는 차이가 발생) 과도한 최적화는 과적합되기 쉽고, 과거가 미래를 보장하지 않습니다. 백테스트 후 먼저 모의 투자로 검증하는 것을 권장합니다.

</details>

<details class="lurus-faq-item">
<summary>전략 수익은 어떻게 출금하나요?</summary>

수익은 鹿贝로 지갑에 들어옵니다 → [identity.lurus.cn](https://identity.lurus.cn) 로그인 →「지갑」→「출금」→ 금액과 은행 카드 입력 → 보통 1~3 영업일 내 입금됩니다.

</details>

<details class="lurus-faq-item">
<summary>전략 코드가 유출되나요?</summary>

유출되지 않습니다. 서버 측에 암호화 저장되며, 이용자는 설명 / 지표 / 백테스트 리포트만 볼 수 있고 소스 코드는 확인할 수 없습니다.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> 기술 문제</span>
  <h2 class="lurus-section-head__title">속도 제한, 지연 및 전략 언어</h2>
</div>

<details class="lurus-faq-item">
<summary>API가 429를 반환하나요?</summary>

요청 빈도 제한을 초과했습니다(요금제에 따라 다름). 빈도를 낮추거나 요금제를 업그레이드하세요.

</details>

<details class="lurus-faq-item">
<summary>전략 실행 지연이 높나요?</summary>

네트워크 안정성을 점검하세요. 복잡한 계산이 필요한 전략은 사전 계산 후 캐싱을 권장하며, 개장 / 마감 시 고동시성 시간대를 피하세요.

</details>

<details class="lurus-faq-item">
<summary>어떤 언어로 전략을 작성할 수 있나요?</summary>

현재는 Python이며, 전략 SDK가 기술 지표 라이브러리와 거래 실행 인터페이스를 제공합니다.

</details>

---

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="mail" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">답을 찾지 못하셨나요?</p>
    <div class="lurus-callout__body"><a href="mailto:support@lurus.cn">support@lurus.cn</a>으로 문의해 주세요.</div>
  </div>
</div>

<NextSteps
  :steps="[
    { text: '빠른 시작', link: '/ko/lucrum/quickstart', primary: true },
    { text: '전략 마켓', link: '/ko/lucrum/strategies' },
    { text: '제품 개요', link: '/ko/lucrum/' },
  ]"
  title="다음 단계"
/>

</div>
