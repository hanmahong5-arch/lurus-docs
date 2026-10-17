---
title: 요금 안내
description: Lurus 구독 플랜, 할당량 관리 및 鹿贝 경제 시스템 상세 설명.
---

<div class="billing-page">

# 요금 안내 <StatusBadge status="live" />

구독 플랜, 할당량 관리 및 鹿贝 경제 시스템.

<MetricStats
  :items="[
    { label: '구독 플랜', value: '5 단계', hint: 'Free → Enterprise, 별도 Claude Code 플랜' },
    { label: '결제 수단', value: '3 종', hint: 'Stripe / Creem / Epay' },
    { label: '鹿贝', value: '1위안 = 1 LB', hint: '충전한 만큼 그대로 입금' },
    { label: '환불 기간', value: '7 일', hint: '결제 후 7일 이내 주문 단위 신청' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> 구독</span>
  <h2 class="lurus-section-head__title">구독 플랜 비교</h2>
  <p class="lurus-section-head__lede">무료 체험부터 기업용 SLA까지, 사용량 규모에 맞춰 선택하세요.</p>
</div>

| 플랜 | 포지션 | 설명 |
|------|------|------|
| **Free** | 무료 체험 | 매일 무료 한도 제공, 사용 가능 모델은 적은 편 |
| **Basic** | 입문용 월 구독 | 개인 개발자 |
| **Pro** | 상위 구독, 월 결제 또는 연 결제 | 연 결제 총액이 12개월 월 결제보다 저렴 |
| **Enterprise** | 팀 / 기업 | 프라이빗 배포, SLA 등은 별도 계약에 따름 |

각 플랜의 가격, 일일 한도, 사용 가능 모델은 [identity.lurus.cn](https://identity.lurus.cn) 콘솔(구독 관리 페이지)을 기준으로 합니다. 관리자가 조정하면 즉시 반영되므로 이 페이지에는 수치를 따로 옮겨 적지 않습니다. 이 밖에 Claude Code 전용 독립 플랜도 있으며, 마찬가지로 콘솔을 기준으로 합니다.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="briefcase" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">기업용 플랜</p>
    <div class="lurus-callout__body">프라이빗 배포, 데이터센터 지정 또는 SLA가 필요하신가요? <a href="mailto:business@lurus.cn">business@lurus.cn</a> 으로 문의하세요.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> 할당량</span>
  <h2 class="lurus-section-head__title">할당량 관리</h2>
  <p class="lurus-section-head__lede">구독 한도를 먼저 사용하고, 소진되면 모델 단가에 따라 鹿贝 지갑에서 차감합니다.</p>
</div>

### 할당량 계산

호출마다 모델 단가와 Token 사용량에 따라 과금됩니다. 대화형 모델은 입력과 출력을 따로 계산하고, 이미지 등은 회당 과금합니다. 각 모델 단가는 콘솔에 표시된 금액을 기준으로 합니다.

### 할당량 초과 처리

<ol class="lurus-steps">
<li>요청이 들어오면 먼저 구독 할당량을 확인합니다.</li>
<li>할당량이 <strong>충분</strong> → 정상 처리.</li>
<li>할당량이 <strong>부족</strong> → 鹿贝 잔액 확인: 잔액이 충분하면 자동 차감 후 정상 처리.</li>
<li>잔액이 <strong>부족</strong> → <code>402</code> 오류 반환.</li>
</ol>

`402` / `insufficient_quota` 를 받으셨나요? 진단 절차는 [문제 해결 · 할당량 / 잔액 부족](/ko/guide/troubleshooting#insufficient-quota)을 참고하세요.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">조용히 실패하지 않습니다</p>
    <div class="lurus-callout__body">지갑 잔액이 설정한 임계값보다 낮아지면 알림을 보냅니다. 잔액이 부족하면 요청은 바로 402를 반환하며, 먼저 미납이 생긴 뒤 나중에 청구하는 일은 없습니다.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿贝</span>
  <h2 class="lurus-section-head__title">鹿贝 경제</h2>
  <p class="lurus-section-head__lede">지갑의 회계 단위로, 1 鹿贝 = 1위안(CNY)입니다.</p>
</div>

### 충전

1위안을 충전하면 1 鹿贝가 입금되며, 구간별 추가 증정은 없습니다. 관리자가 충전 혜택을 설정한 경우 충전 페이지에 표시된 실결제 금액을 기준으로 합니다.

### VIP 할인

누적 충전 금액(또는 연간 구독)에 따라 VIP 등급이 정해지며, 할인은 구독 구매 및 갱신 시 자동 적용됩니다. 충전과 사용량 기반 차감에는 할인이 적용되지 않습니다.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="crown" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">예시: 골드카드 5% 할인</p>
    <div class="lurus-callout__body">기본 기준에서는 누적 충전 ¥2,000 이상이면 골드카드입니다. ¥99 월 구독을 갱신하면 실결제액은 <code>99 × 0.95 = ¥94.05</code>입니다. 기준과 할인율은 콘솔을 기준으로 합니다.</div>
  </div>
</div>

### 鹿贝 유효기간

충전으로 받은 잔액은 만료되지 않습니다. 이벤트로 증정된 한도는 유효 기간이 있을 수 있으며, 이벤트 안내를 따릅니다.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 청구</span>
  <h2 class="lurus-section-head__title">청구서 및 인보이스</h2>
</div>

- **청구서 조회**([identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)): 월별 소비 요약, 거래 내역, 鹿贝 수입·지출, 할당량 사용 통계.
- **인보이스 발행**: 결제 완료된 주문마다 인보이스를 신청할 수 있습니다. 상호와 납세자 번호를 입력하면 담당자가 발행하며, 발행 후 콘솔에서 다운로드할 수 있습니다.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="repeat" :size="14" /> 환불</span>
  <h2 class="lurus-section-head__title">환불 정책</h2>
</div>

| 유형 | 정책 |
|------|------|
| 구독 | 결제 후 7일 이내 콘솔에서 신청, 심사 통과 후 주문 전액 환불 |
| 충전 | 결제 후 7일 이내이고 해당 충전분을 사용하지 않았다면 주문 단위로 환불 신청 가능 |
| 이미 소비한 부분 | 환불 불가 |

Alipay, WeChat Pay, Stripe 결제는 원래 결제 수단으로 환불되며, 그 밖의 방식은 지갑으로 환불됩니다.

<NextSteps
  title="다음 단계"
  :steps="[
    { text: '플랫폼 개요', link: '/ko/platform/', primary: true },
    { text: '자주 묻는 질문', link: '/ko/platform/faq' },
    { text: 'API Key 발급', link: '/ko/guide/get-api-key' },
  ]"
/>

</div>
