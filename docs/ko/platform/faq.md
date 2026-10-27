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

[identity.lurus.cn](https://identity.lurus.cn) 로그인 → 구독 관리 → 「요금제 변경」: 업그레이드와 다운그레이드 모두 즉시 적용되며, 차액은 남은 일수에 따라 지갑에서 추가 차감되거나 환불됩니다. 월간 결제와 연간 결제 간에는 직접 전환할 수 없습니다.

</details>

<details class="lurus-faq-item">
<summary>구독이 만료되면 어떻게 되나요?</summary>

만료 후 3일의 유예 기간이 있으며, 그 뒤 Free로 돌아갑니다. API Key는 계속 유효하지만 Free 할당량 제한을 받습니다. 데이터는 보존되어 언제든 재결제로 복원할 수 있습니다.

</details>

<details class="lurus-faq-item">
<summary>연간 결제와 월간 결제의 차이는 무엇인가요?</summary>

연간 결제 총액은 12개월 월간 결제보다 저렴하며, 구체적인 가격은 콘솔을 기준으로 합니다. 연간 결제와 월간 결제 간에는 직접 전환할 수 없습니다.

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

구독 할당량을 초과한 API 호출 등 모든 제품의 사용량 기반 요금 결제에 사용하며, 구독 구매에도 쓸 수 있습니다. 1 鹿贝 = 1위안입니다.

</details>

<details class="lurus-faq-item">
<summary>鹿贝는 만료되나요?</summary>

충전으로 받은 잔액은 만료되지 않습니다. 이벤트로 증정된 한도는 유효 기간이 있을 수 있으며, 이벤트 규칙을 따릅니다.

</details>

<details class="lurus-faq-item">
<summary>鹿贝를 출금할 수 있나요?</summary>

출금할 수 없습니다. 결제 후 7일 이내이고 사용하지 않은 충전분은 주문 단위로 환불을 신청할 수 있습니다.

</details>

<details class="lurus-faq-item">
<summary>잔액과 입출금 내역은 어떻게 확인하나요?</summary>

[identity.lurus.cn](https://identity.lurus.cn) 로그인 → 지갑에서 현재 잔액, 수입 내역(충전 / 보상 / 환불), 지출 내역(API 사용 / 구독)을 확인할 수 있습니다.

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

결제 완료된 주문마다 콘솔에서 세금계산서를 신청할 수 있습니다. 상호와 납세자 번호를 입력하면 담당자가 발행하며, 발행 후 다운로드할 수 있습니다.

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
