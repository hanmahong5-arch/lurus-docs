---
title: 요금 안내
description: Lurus의 현재 과금 방식, 잔액 부족 시 처리, 세금계산서와 환불.
---

<div class="billing-page">

# 요금 안내

이 페이지는 과금 방식만 설명하며 구체적인 가격은 적지 않습니다. 가격과 한도는 콘솔과 계약을 기준으로 합니다.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> 방식</span>
  <h2 class="lurus-section-head__title">과금 방식</h2>
</div>

- **기업 계약**: 프라이빗 배포와 호스팅 납품은 계약에서 정한 범위에 따라 정산하며, 법인 계좌 이체 후 세금계산서를 발행합니다. 프라이빗 배포나 데이터센터 지정이 필요하면 [business@lurus.cn](mailto:business@lurus.cn)으로 문의하세요.
- **개인 구독**: [identity.lurus.cn](https://identity.lurus.cn)의 구독 관리 페이지에서 이용 가능한 플랜과 가격을 확인하세요. 구독 한도를 초과한 사용량은 [계정 지갑](/ko/platform/#wallet) 잔액에서 차감됩니다.
- **테넌트 한도**: [Lurus Hub](/hub/)에서 테넌트 관리자는 조직, 팀 또는 하위 고객별로 한도를 관리하고 사용량을 확인할 수 있습니다.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> 한도</span>
  <h2 class="lurus-section-head__title">한도 또는 잔액 부족</h2>
</div>

각 호출은 모델과 Token 사용량에 따라 소모량이 환산됩니다. 한도와 잔액이 모두 부족하면 요청이 거부되고 한도 부족 오류가 반환됩니다. 해결 방법은 [문제 해결 · 할당량 / 잔액 부족](/ko/guide/troubleshooting#insufficient-quota)을 참고하세요.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 청구서</span>
  <h2 class="lurus-section-head__title">청구서, 세금계산서, 환불</h2>
</div>

- **청구서 확인**: [identity.lurus.cn](https://identity.lurus.cn)에 로그인하여 거래 내역과 사용량 통계를 확인합니다.
- **세금계산서**: 기업 계약은 계약에 따라 발행합니다. 그 밖의 경우 [support@lurus.cn](mailto:support@lurus.cn)으로 문의하세요.
- **환불**: [support@lurus.cn](mailto:support@lurus.cn)으로 문의하세요. 이미 사용한 부분은 환불되지 않습니다.

<NextSteps
  title="다음 단계"
  :steps="[
    { text: '플랫폼 개요', link: '/ko/platform/', primary: true },
    { text: '자주 묻는 질문', link: '/ko/platform/faq' },
    { text: 'API Key 발급', link: '/ko/guide/get-api-key' },
  ]"
/>

</div>
