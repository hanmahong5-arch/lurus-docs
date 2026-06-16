---
title: 플랫폼 자주 묻는 질문
description: Lurus 플랫폼 계정, 청구 및 서비스 관련 자주 묻는 질문과 답변.
---

<div class="faq-page">

# 자주 묻는 질문

플랫폼 계정, 구독 청구, 鹿贝 및 보안에 관한 자주 묻는 질문을 주제별로 정리했습니다.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> 계정</span>
  <h2 class="lurus-section-head__title">계정</h2>
</div>

<details class="lurus-faq-item">
<summary>하나의 계정으로 모든 제품을 사용할 수 있나요?</summary>

네. 통합 계정 체계로, 한 번 가입하면 모든 제품(API, Lucrum, Switch, Creator 등)에 로그인할 수 있으며, 지갑 잔액과 구독 플랜을 공유합니다.

</details>

<details class="lurus-faq-item">
<summary>비밀번호는 어떻게 변경하나요?</summary>

[identity.lurus.cn](https://identity.lurus.cn) 로그인 → 계정 설정 → 보안 → 비밀번호 변경.

</details>

<details class="lurus-faq-item">
<summary>비밀번호를 잊어버렸을 때는 어떻게 하나요?</summary>

로그인 페이지에서 「비밀번호 찾기」를 클릭하면 가입 이메일로 재설정 링크가 발송됩니다.

</details>

<details class="lurus-faq-item">
<summary>계정은 어떻게 삭제하나요?</summary>

[support@lurus.cn](mailto:support@lurus.cn) 으로 탈퇴를 요청하세요. 모든 데이터(API Key / 鹿贝 / 거래 내역)는 영구 삭제되며 복구할 수 없습니다.

</details>

<details class="lurus-faq-item">
<summary>어떤 소셜 로그인을 지원하나요?</summary>

GitHub, Google OAuth를 지원하며, 계정 설정에서 연동 / 연동 해제할 수 있습니다.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> 구독과 청구</span>
  <h2 class="lurus-section-head__title">구독과 청구</h2>
</div>

<details class="lurus-faq-item">
<summary>요금제를 업그레이드 / 다운그레이드하려면 어떻게 하나요?</summary>

[identity.lurus.cn](https://identity.lurus.cn) 로그인 → 구독 관리 → 「요금제 변경」: 업그레이드는 즉시 적용되며 차액을 비례 정산하고, 다운그레이드는 다음 청구 주기부터 적용됩니다.

</details>

<details class="lurus-faq-item">
<summary>구독이 만료되면 어떻게 되나요?</summary>

자동으로 Free로 다운그레이드되며, API Key는 계속 유효하지만 Free 할당량 제한을 받습니다. 데이터는 보존되어 언제든 재결제로 복원할 수 있습니다.

</details>

<details class="lurus-faq-item">
<summary>연간 결제와 월간 결제의 차이는 무엇인가요?</summary>

연간 결제는 20% 할인(약 2.4개월 무료 사용)입니다. 연간 결제 기간에는 다운그레이드는 불가능하지만 업그레이드는 가능합니다.

</details>

<details class="lurus-faq-item">
<summary>기업판에서 팀에 멤버를 추가하려면 어떻게 하나요?</summary>

관리자 콘솔 → 팀 → 멤버 초대 → 이메일 입력 후 초대 발송 → 멤버 수락 후 합류 → 멤버별로 독립적인 API Key와 할당량을 배정할 수 있습니다.

</details>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">전체 할당량 및 가격 규칙이 궁금하신가요?</p>
    <div class="lurus-callout__body">자세한 내용은 <a href="/ko/platform/billing">청구 상세</a>를 참고하세요.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿贝</span>
  <h2 class="lurus-section-head__title">鹿贝</h2>
</div>

<details class="lurus-faq-item">
<summary>鹿贝는 어디에 쓰나요?</summary>

구독 할당량을 초과한 API 호출 결제, Lucrum 유료 전략 구독, VIP 할인 혜택 등에 사용합니다.

</details>

<details class="lurus-faq-item">
<summary>鹿贝는 만료되나요?</summary>

구매한 鹿贝는 영구 유효합니다. 이벤트로 증정된 鹿贝는 유효 기간이 있을 수 있으며, 이벤트 규칙을 따릅니다.

</details>

<details class="lurus-faq-item">
<summary>鹿贝를 출금할 수 있나요?</summary>

충전·구매한 鹿贝 중 미사용분은 환불 가능합니다. Lucrum 전략 수익으로 정산된 鹿贝는 은행 계좌로 출금할 수 있습니다.

</details>

<details class="lurus-faq-item">
<summary>잔액과 입출금 내역은 어떻게 확인하나요?</summary>

[identity.lurus.cn](https://identity.lurus.cn) 로그인 → 지갑에서 현재 잔액, 수입 내역(충전 / 보상 / 전략 수익), 지출 내역(API 사용 / 전략 구독)을 확인할 수 있습니다.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> 결제</span>
  <h2 class="lurus-section-head__title">결제</h2>
</div>

결제 수단:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="receipt" :size="20" /></span>
    <div class="lurus-card__title">Stripe</div>
    <p class="lurus-card__body">신용카드 / 직불카드, 전 세계</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">Creem</div>
    <p class="lurus-card__body">암호화폐</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="wallet" :size="20" /></span>
    <div class="lurus-card__title">Epay</div>
    <p class="lurus-card__body">Alipay / WeChat Pay, 중국 본토</p>
  </div>
</div>

<details class="lurus-faq-item">
<summary>결제했는데 입금이 확인되지 않을 때는 어떻게 하나요?</summary>

보통 1분 이내에 확인됩니다. 5분이 지나도 입금되지 않으면 결제 플랫폼에서 출금이 이루어졌는지 확인하고, 이메일의 확인 메일을 확인한 뒤 [support@lurus.cn](mailto:support@lurus.cn) 으로 결제 주문 번호를 제공해 문의하세요.

</details>

<details class="lurus-faq-item">
<summary>세금계산서는 어떻게 신청하나요?</summary>

관리자 콘솔 → 청구 → 세금계산서 신청(부가세 일반 / 전용)을 하면 보통 영업일 1일 이내에 이메일로 발송됩니다.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 보안</span>
  <h2 class="lurus-section-head__title">보안</h2>
</div>

<details class="lurus-faq-item">
<summary>제 데이터는 안전한가요?</summary>

전 구간 HTTPS(TLS 1.3)를 사용하며, 비밀번호는 bcrypt로 암호화 저장합니다. 결제는 PCI DSS를 준수하는 제3자를 통해 처리되고, API 호출 내용은 저장하지 않습니다(청구를 위한 메타데이터만 기록).

</details>

<details class="lurus-faq-item">
<summary>API Key가 도용되었을 때는 어떻게 처리하나요?</summary>

즉시 콘솔에서 해당 Key를 비활성화 → 새 Key 생성 → 호출 로그를 확인해 비정상 사용을 점검 → 고객센터에 비정상 과금 처리를 문의하세요.

</details>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">답을 찾지 못하셨나요?</p>
    <div class="lurus-callout__body"><a href="mailto:support@lurus.cn">support@lurus.cn</a> 으로 문의해 주세요.</div>
  </div>
</div>

<NextSteps
  title="다음 단계"
  :steps="[
    { text: '플랫폼 개요', link: '/ko/platform/', primary: true },
    { text: '청구 상세', link: '/ko/platform/billing' },
    { text: 'API Key 발급', link: '/ko/guide/get-api-key' },
  ]"
/>

</div>
