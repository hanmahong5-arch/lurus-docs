---
title: Lucrum 전략 마켓
description: Lucrum의 개방형 전략 생태계로 전략 개발자와 트레이더를 연결합니다.
---

<div class="lucrum-page">

# 전략 마켓

Lucrum 전략 마켓은 전략 개발자와 트레이더를 연결하는 개방형 퀀트 전략 생태계입니다.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">70%</span><span class="lurus-stat__label">작성자 분배율</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6</span><span class="lurus-stat__label">내장 전략 패키지</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2년+</span><span class="lurus-stat__label">백테스트 데이터 요구</span></div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 전략 사용자를 위해</span>
  <h2 class="lurus-section-head__title">탐색, 평가, 원클릭 배포</h2>
</div>

### 탐색과 필터링

전략 마켓에서는 여러 차원으로 전략을 필터링할 수 있습니다:

| 필터 조건 | 설명 |
|---------|------|
| 시장 | A주(상하이·선전 양 시장); 홍콩 주식, 미국 주식, 암호화폐 계획 중 |
| 전략 유형 | 추세 추종, 평균 회귀, 차익거래, 멀티팩터 |
| 위험 등급 | 보수형, 안정형, 공격형 |
| 최소 자금 | 전략이 요구하는 최소 투입 자금 |
| 정렬 | 수익률, 샤프 지수, 최대 낙폭, 구독 수 |

### 전략 평가 지표

상장된 모든 전략은 검증된 퀀트 지표를 표시합니다:

| 지표 | 우수 기준 | 설명 |
|------|---------|------|
| **연환산 수익** | &gt; 15% | 연환산 복리 수익률 |
| **최대 낙폭** | &lt; 20% | 역대 최대 손실(고점-저점 차이) |
| **샤프 지수** | &gt; 1.5 | 위험 단위당 초과 수익 |
| **칼마 지수** | &gt; 1.0 | 연환산 수익 / 최대 낙폭 |
| **승률** | &gt; 50% | 수익 거래 비율 |
| **손익비** | &gt; 1.5 | 평균 수익 / 평균 손실 |
| **운영 일수** | &gt; 90일 | 전략 실거래 운영 기간 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">전략은 어떻게 고를까요?</p>
    <div class="lurus-callout__body">수익률만 보지 마세요. 샤프 지수 2.0, 최대 낙폭 10%인 전략은 보통 연환산 50%이지만 낙폭 40%인 전략보다 대다수 사람에게 더 적합합니다.</div>
  </div>
</div>

### 구독과 배포

<ol class="lurus-steps">
<li>

전략 선택 → 상세 페이지(**전체 백테스트 리포트** 포함).

</li>
<li>

「**구독**」으로 비용 확인.

</li>
<li>

「**내 전략**」에서 거래 계좌 선택, 자금 배분 설정.

</li>
<li>

「**시작**」으로 자동 실행.

</li>
</ol>

**비용**: 일부는 무료, 일부는 월 구독; 구독료는 [鹿贝 지갑](/platform/billing#wallet)에서 차감되며; 거래 수수료는 증권사가 징수하고 Lucrum과는 무관합니다.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> 전략 개발자를 위해</span>
  <h2 class="lurus-section-head__title">개발, 심사, 패시브 인컴 창출</h2>
</div>

### 상장 절차

<ol class="lurus-steps">
<li>

**로컬 개발**로 전략 로직 작성.

</li>
<li>

**백테스트 검증**(최소 2년 과거 데이터).

</li>
<li>

**심사 제출**(설명 / 위험 등급 / 적용 시장).

</li>
<li>

**플랫폼 심사**로 컴플라이언스와 리스크 관리 확인(보통 1-3 영업일).

</li>
<li>

**상장**되어 모든 사용자에게 노출.

</li>
<li>

**수익 획득**, 鹿贝로 지갑에 정산.

</li>
</ol>

### 심사 기준

| 항목 | 요구 |
|------|------|
| 백테스트 데이터량 | 최소 2년 과거 데이터 포함 |
| 최대 낙폭 | 50% 초과 금지(초과 시 위험 별도 표기 필요) |
| 리스크 관리 조치 | 손절 로직 필수 포함 |
| 코드 품질 | 메모리 누수 없음, 무한 루프 위험 없음 |
| 전략 설명 | 전략 로직, 적용 시장, 위험 고지 완전 명시 |

### 수익 분배

전략이 발생시킨 구독 수익은 다음 비율로 분배됩니다:

| 역할 | 분배 비율 |
|------|---------|
| 전략 작성자 | **70%** |
| 플랫폼 | **30%** |

수익은 鹿贝 형태로 지갑에 정산되며 은행 카드로 출금할 수 있습니다.

### 내장 전략 패키지

Lucrum은 6대 전략 패키지를 내장하며 + 사용자 정의 확장을 지원합니다:

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title"><code>VALUE_BLUECHIP</code></div>
    <p class="lurus-card__body">가치 블루칩(저평가, 대형 안정형).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title"><code>GROWTH_MOMENTUM</code></div>
    <p class="lurus-card__body">성장 모멘텀(고성장 + 모멘텀 필터).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="star" :size="20" /></span>
    <div class="lurus-card__title"><code>SECTOR_LEADER</code></div>
    <p class="lurus-card__body">섹터 리더(업종 선도 종목).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title"><code>LOW_VOL_STABLE</code></div>
    <p class="lurus-card__body">저변동 안정형(낮은 변동성 방어형).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="20" /></span>
    <div class="lurus-card__title"><code>MEAN_REVERSION</code></div>
    <p class="lurus-card__body">평균 회귀(과매도 반등).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title"><code>EVENT_DRIVEN</code></div>
    <p class="lurus-card__body">이벤트 드리븐(공시, 실적 발표 등 촉매).</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="filter" :size="14" /> 전략 유형</span>
  <h2 class="lurus-section-head__title">4가지 일반 전략의 원리와 적용 시나리오</h2>
</div>

| 유형 | 원리 | 대표 신호/팩터 | 적합 |
|------|------|------|------|
| **추세 추종** | 추세에 순응하여 추세 형성 시 진입, 종료 시 청산 | 이동평균 교차, 채널 돌파, 모멘텀 지표 | 일방향 장세(상승/하락장), 횡보장에는 부적합 |
| **평균 회귀** | 가격이 평균에서 벗어난 뒤 회귀, 과매도 매수·과매수 매도 | RSI, 볼린저 밴드, Z-Score | 횡보 장세, 일방향 추세에는 부적합 |
| **멀티팩터 종목 선정** | 여러 팩터를 종합해 종목 점수화, 고득점 종목 매수 | PE/PB(밸류에이션), ROE(수익성), 12개월 모멘텀, 변동성 | 중장기 보유, 낮은 리밸런싱 빈도 |
| **페어 트레이딩** | 상관성 높은 두 종목의 가격차가 평균에서 벗어나면 많이 오른 쪽 매도·많이 내린 쪽 매수 | — | 낮은 낙폭, 시장 중립의 안정형 전략 |

---

<div class="lurus-callout lurus-callout--danger">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">투자에는 위험이 따릅니다</p>
    <div class="lurus-callout__body"><ul><li>과거 백테스트 성과는 미래 수익을 의미하지 않습니다</li><li>퀀트 전략은 특정 시장 환경에서 효력을 잃을 수 있습니다</li><li>본인의 위험 감내 능력에 맞춰 자금을 합리적으로 배분하세요</li><li>Lucrum은 어떠한 투자 조언이나 수익 보장도 제공하지 않습니다</li></ul></div>
  </div>
</div>

---

<NextSteps
  :steps="[
    { text: '빠른 시작', link: '/ko/lucrum/quickstart', primary: true },
    { text: '자주 묻는 질문', link: '/ko/lucrum/faq' },
    { text: '제품 개요', link: '/ko/lucrum/' },
    { text: '거래 플랫폼', link: 'https://lucrum.lurus.cn', external: true },
  ]"
  title="다음 단계"
/>

</div>
