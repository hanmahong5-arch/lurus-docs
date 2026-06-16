---
title: Lucrum — AI 퀀트 트레이딩 플랫폼
description: AI 기반 퀀트 트레이딩 플랫폼으로, 전략 마켓·백테스트 검증·지능형 트레이딩 어시스턴트를 지원합니다.
---

<div class="lucrum-page">

<ProductHero product-id="lucrum" />

<MetricStats :items="[
  { label: '투자 자문', value: '11 개', hint: '다각도 Agent' },
  { label: '백테스트 지표', value: '30+', hint: '샤프 / 낙폭 / 승률…' },
  { label: '테스트 케이스', value: '3157+', hint: 'Vitest 검증' },
  { label: '정밀도', value: 'Decimal.js', hint: '부동소수점 오차 제로' },
]" />

## Lucrum이란? {#what-is-lucrum}

**Lucrum**은 Lurus가 선보이는 AI-Native 퀀트 트레이딩 의사결정 플랫폼입니다. 핵심 이념은 **자연어가 최고의 프로그래밍 언어**라는 것으로, 한국어로 전략 아이디어를 설명하면 AI가 자동으로 코드를 생성하고 백테스트를 실행하며 다차원으로 평가합니다. 11명의 전문 투자 자문 Agent(버핏/피터 린치/리버모어/시먼스 등 관점)를 내장하고, 전 플랫폼에서 Decimal.js 금융급 정밀도 계산(3,157개 Vitest 테스트 케이스 검증)으로 부동소수점 오차가 제로입니다.

> 이름은 라틴어 "Lucrum"(이익)에서 유래했으며, 시장 기회를 정밀하게 통찰한다는 의미를 담고 있습니다.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">현재 단계: 공개 베타(beta)</p>
    <div class="lurus-callout__body"><a href="https://lucrum.lurus.cn">lucrum.lurus.cn</a>이 이미 출시되어 핵심 기능(전략 생성 / 백테스트 / AI 자문)을 바로 체험할 수 있으며, 가격은 <a href="https://lucrum.lurus.cn/pricing">/pricing</a>을 참고하세요. 아직 정식 GA에는 진입하지 않았으며, 일부 고급 기능(전략 마켓, 실거래 증권사 연동)은 여전히 보완 중입니다.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> 핵심 기능</span>
  <h2 class="lurus-section-head__title">한 문장의 한국어에서 등급이 매겨진 백테스트까지</h2>
  <p class="lurus-section-head__lede">전략 생성, 멀티 Agent 투자 리서치, 전략 마켓, 쿼터 과금, 실시간 실행——하나의 파이프라인으로 연결됩니다.</p>
</div>

### AI 전략 생성과 백테스트

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">자연어 → 코드</div>
    <p class="lurus-card__body">한국어로 전략 의도를 설명하면 AI가 vnpy CtaTemplate 전략 코드를 자동 생성합니다.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="calculator" :size="20" /></span>
    <div class="lurus-card__title">금융급 백테스트</div>
    <p class="lurus-card__body">Decimal.js 전체 정밀도, A주 100주 정수배 제약, T+1 규칙, 수수료 + 인지세 + 명의개서비 + 슬리피지.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bar-chart-3" :size="20" /></span>
    <div class="lurus-card__title">30+ 지표 분석</div>
    <p class="lurus-card__body">샤프 비율, 최대 낙폭, Sortino, Calmar, 승률, 손익비……</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="star" :size="20" /></span>
    <div class="lurus-card__title">S/A/B/C/D 5단계 평점</div>
    <p class="lurus-card__body">4개 차원 가중: 수익 30% + 리스크 관리 30% + 안정성 25% + 효율 15%.</p>
  </div>
</div>

### 11명의 AI 투자 자문

LangGraph 기반으로 오케스트레이션된 멀티 Agent 투자 분석 시스템(애널리스트 4명 + 리서처 2명 + 거장 4명 + 토론 진행자 1명 = 11):

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">4명의 투자 거장 관점</div>
    <p class="lurus-card__body">버핏(가치), 피터 린치(성장), 리버모어(기술적 분석), 시먼스(퀀트).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">4명의 애널리스트</div>
    <p class="lurus-card__body">펀더멘털 / 기술적 / 심리 / 거시, 각자 결론을 도출합니다.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">리서처 2명 + 토론 진행자 1명</div>
    <p class="lurus-card__body">Bull vs Bear 매수·매도 토론으로 단일 관점 편향을 방지합니다.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">메모리 엔진 통합</div>
    <p class="lurus-card__body"><a href="/ko/memx/">MemX</a>를 통해 당신의 트레이딩 선호와 과거 의사결정을 기억합니다.</p>
  </div>
</div>

### 전략 마켓

전략 개발자와 트레이더를 연결하는 개방형 퀀트 전략 생태계:

| 역할 | 기능 |
|------|------|
| **전략 작성자** | 전략 업로드, 가격 설정, 수익 분배 확인 |
| **전략 사용자** | 전략 탐색·구독, 원클릭 실거래 배포 |

**수익 분배**: 플랫폼 30% / 전략 작성자 70%.

### 쿼터와 과금

<ol class="lurus-steps">
<li>

**플랜 한도** — 구독 패키지에 포함된 월간 AI 호출 횟수.

</li>
<li>

**Redis 월간 카운트** — 당월 사용량을 실시간으로 추적.

</li>
<li>

**鹿贝 잔액 백업** — 쿼터 소진 후 [鹿贝 지갑](/ko/platform/billing#wallet)에서 자동 차감, 1 鹿贝 = 10,000 tokens.

</li>
</ol>

### 실시간 데이터와 실행

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">시장 커버리지</div>
    <p class="lurus-card__body">A주(상하이·선전 양 시장, ~5000+ 종목, 데이터 소스 adata + 东方财富); 홍콩 주식 / 미국 주식 / 암호화폐는 계획 중.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">모의 거래</div>
    <p class="lurus-card__body">Mock Broker 내장, T+1 규칙·100주 단위·수수료와 인지세를 완전하게 시뮬레이션.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">리스크 관리 엔진</div>
    <p class="lurus-card__body">포지션 제한, 손절·익절, 최대 낙폭 보호.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 대상 사용자</span>
  <h2 class="lurus-section-head__title">코드를 쓰지 않아도 퀀트를 돌릴 수 있습니다</h2>
</div>

| 사용자 유형 | Lucrum이 당신을 돕는 방법 |
|---------|-----------------|
| **퀀트 입문자** | AI 어시스턴트가 입문을 안내하며, 자연어로 전략 아이디어를 설명하면 코드 골격을 생성합니다 |
| **개인 투자자** | 전략 마켓에서 검증된 전략을 선택해 원클릭으로 배포, 프로그래밍 불필요 |
| **전략 개발자** | 완전한 개발-백테스트-출시 툴체인, 전략을 등록해 패시브 수입을 얻습니다 |
| **전문 트레이딩 팀** | API 인터페이스로 기존 트레이딩 시스템에 통합 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> 벤치마킹</span>
  <h2 class="lurus-section-head__title">기존 퀀트 플랫폼과 무엇이 다른가</h2>
</div>

<ComparisonTable
  self-label="Lucrum"
  :competitors="['vnpy', '掘金', '米筐', '聚宽']"
  :rows="[
    { dimension: '전략 작성', self: '자연어 생성', alt: { vnpy: 'Python 수작업', '掘金': 'Python 수작업', '米筐': 'Python 수작업', '聚宽': 'Python 수작업' } },
    { dimension: 'AI 투자 자문', self: '11개 다각도', alt: { vnpy: '없음', '掘金': '없음', '米筐': '없음', '聚宽': '없음' } },
    { dimension: '정밀도', self: 'Decimal.js 전체 정밀도', alt: { vnpy: 'float', '掘金': 'float', '米筐': 'float', '聚宽': 'float' } },
    { dimension: '전략 마켓', self: '내장 + 등급', alt: { vnpy: '없음', '掘金': '있음', '米筐': '있음', '聚宽': '있음' } },
  ]"
  title="기존 퀀트 플랫폼과의 비교"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 기술 아키텍처</span>
  <h2 class="lurus-section-head__title">브라우저에서 결제 정산 엔진까지</h2>
</div>

<ArchitectureDiagram
  title="Lucrum 계층형 아키텍처"
  chart="graph TD;
    A[브라우저 / 모바일] --> B[Lucrum Web<br/>Next.js 14 + TS<br/>트레이딩 패널·전략 편집·AI 대화];
    B --> C[Lucrum Backend<br/>Python 3.11 + FastAPI<br/>vnpy 4.x + LangGraph<br/>전략 엔진·시세 게이트웨이·리스크 관리·정산];
    C --> D[AI 어시스턴트<br/>Lurus API];
    C --> E[메모리 엔진<br/>MemX];
    C --> F[(PostgreSQL<br/>전략 / 거래)];
    C --> G[(Redis<br/>시세 / 쿼터)];
    C --> H[NATS<br/>이벤트]"
/>

---

<NextSteps
  :steps="[
    { text: '빠른 시작', link: '/ko/lucrum/quickstart', primary: true },
    { text: '전략 마켓', link: '/ko/lucrum/strategies' },
    { text: '자주 묻는 질문', link: '/ko/lucrum/faq' },
    { text: '트레이딩 플랫폼', link: 'https://lucrum.lurus.cn', external: true },
  ]"
  title="다음 단계"
/>

<!-- lurus:related-block -->

## 관련 제품

<RelatedProducts product-id="lucrum" />

</div>

<style>
.lucrum-page .lurus-card--lucrum .lurus-card__body a { color: var(--lurus-color-lucrum, var(--vp-c-brand-1)); }
</style>
