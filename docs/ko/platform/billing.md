---
title: 요금 안내
description: Lurus 구독 플랜, 할당량 관리 및 鹿贝 경제 시스템 상세 설명.
---

<div class="billing-page">

# 요금 안내 <StatusBadge status="live" />

구독 플랜, 할당량 관리 및 鹿贝 경제 시스템.

<MetricStats
  :items="[
    { label: '구독 플랜', value: '4 단계', hint: 'Free → Enterprise' },
    { label: '결제 수단', value: '3 종', hint: 'Stripe / Creem / Epay' },
    { label: '충전 리베이트', value: '최대 5%', hint: '첫 6회 갱신' },
    { label: '환불 기간', value: '7 일', hint: '첫 구독 전액 환불' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> 구독</span>
  <h2 class="lurus-section-head__title">구독 플랜 비교</h2>
  <p class="lurus-section-head__lede">무료 체험부터 기업용 SLA까지, 사용량 규모에 맞춰 선택하세요.</p>
</div>

| 플랜 | API 호출 | 사용 가능 모델 | Lucrum | 지원 / 기타 |
|------|---------|---------|--------|------------|
| **Free** | 100 회/일 | 기본(deepseek-chat、gpt-3.5-turbo) | AI 어시스턴트 대화 10 회/일 | 커뮤니티 지원 |
| **Basic** | 입문용 월 구독, 가격은 콘솔 기준 | — | — | 개인 개발자 체험용 |
| **Pro**(월/연 결제, 연 결제 시 할인) | 10,000 회/월 | 전체 | AI 어시스턴트 무제한; 전략 배포 최대 3 개 | 이메일 티켓(24h 응답) |
| **Enterprise**(맞춤형) | 필요량에 따라 | 전체 + 프라이빗 배포 | 팀 멤버 무제한 | SLA 99.9%; 전담 고객 매니저 + 즉시 응답; 데이터센터 지정 가능 |

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="briefcase" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">기업용 플랜</p>
    <div class="lurus-callout__body">프라이빗 배포, 데이터센터 지정 또는 SLA 99.9%가 필요하신가요? <a href="mailto:business@lurus.cn">business@lurus.cn</a> 으로 문의하세요.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> 할당량</span>
  <h2 class="lurus-section-head__title">할당량 관리</h2>
  <p class="lurus-section-head__lede">호출마다 모델과 Token 사용량에 따라 할당량으로 환산하며, 한도 초과 시 자동으로 鹿贝로 차감합니다.</p>
</div>

### 할당량 계산

API 호출마다 소모되는 할당량은 모델과 Token 사용량에 따라 달라집니다:

| 모델 유형 | 할당량 소모 규칙 |
|---------|-------------|
| 기본 모델(deepseek-chat 등) | 1 회 호출 = 1 할당량 |
| 고급 모델(gpt-4o 등) | 1 회 호출 = 3 할당량 |
| 이미지/비디오 생성 | 작업 복잡도에 따라 = 5-20 할당량 |

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
    <div class="lurus-callout__body">잔액이 부족하면 이메일 + 사이트 내 메시지로 미리 경고하며, 모르는 사이에 서비스가 중단되지 않습니다.</div>
  </div>
</div>

### 할당량 경고

| 경고 임계값 | 알림 방식 |
|---------|---------|
| 잔여 30% | 사이트 내 메시지 |
| 잔여 10% | 사이트 내 메시지 + 이메일 |
| 할당량 소진 | 사이트 내 메시지 + 이메일 + WebSocket 푸시 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿贝</span>
  <h2 class="lurus-section-head__title">鹿贝 경제</h2>
  <p class="lurus-section-head__lede">통합 포인트 화폐로, 비율에 따라 Token 및 호출 횟수로 교환합니다.</p>
</div>

### 鹿贝 가치

1 鹿贝(LB)의 기준 가치:

| 리소스 | 1 LB 로 교환 가능 |
|------|------------|
| Token(기본 모델) | 약 10,000 tokens |
| Token(고급 모델) | 약 3,000 tokens |
| API 호출 | 약 5-10 회(모델에 따라 다름) |

### 충전 비율

| 충전 금액(CNY) | 획득 鹿贝 | 단가 |
|----------------|---------|------|
| ¥10 | 10 LB | ¥1.00/LB |
| ¥50 | 55 LB | ¥0.91/LB |
| ¥100 | 115 LB | ¥0.87/LB |
| ¥500 | 600 LB | ¥0.83/LB |

많이 충전할수록 단가가 낮아집니다.

### VIP 할인 중첩

VIP 할인은 鹿贝 소비 시 자동으로 적용됩니다.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="crown" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">예시: 골드카드 10% 할인</p>
    <div class="lurus-callout__body">골드카드 사용자가 gpt-4o(3 LB/회)를 호출할 때 실제 차감 = <code>3 × 0.9 = 2.7 LB/次</code>.</div>
  </div>
</div>

### 鹿贝 유효기간

구매한 鹿贝는 영구 유효합니다; 이벤트 증정분은 이벤트 안내를 따릅니다; 환불은 현금 결제 부분만 환불되며 증정 鹿贝는 환불되지 않습니다.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 청구</span>
  <h2 class="lurus-section-head__title">청구서 및 인보이스</h2>
</div>

- **청구서 조회**([identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)): 월별 소비 요약, 거래 내역, 鹿贝 수입·지출, 할당량 사용 통계.
- **인보이스 발행**(부가가치세 일반/전용 인보이스 지원): 「청구서」→「인보이스 신청」→ 인보이스 정보 입력(최초 저장 후 자동 입력)→ 금액과 월 선택. 전자 인보이스는 일반적으로 영업일 1일 이내에 이메일로 발송됩니다.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="repeat" :size="14" /> 환불</span>
  <h2 class="lurus-section-head__title">환불 정책</h2>
</div>

| 유형 | 정책 |
|------|------|
| 구독 환불 | 첫 구독 7일 이내 전액 환불 가능 |
| 鹿贝 충전 환불 | 미사용 鹿贝는 환불 신청 가능(증정 부분 차감) |
| 이미 소비한 부분 | 환불 불가 |

환불은 [support@lurus.cn](mailto:support@lurus.cn) 으로 문의하세요.

<NextSteps
  title="다음 단계"
  :steps="[
    { text: '플랫폼 개요', link: '/ko/platform/', primary: true },
    { text: '자주 묻는 질문', link: '/ko/platform/faq' },
    { text: 'API Key 발급', link: '/ko/guide/get-api-key' },
  ]"
/>

</div>
