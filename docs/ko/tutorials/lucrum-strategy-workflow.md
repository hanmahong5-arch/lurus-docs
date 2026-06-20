---
title: "튜토리얼 — Lucrum 전략, 로컬에서 마켓 등록까지"
description: "자연어 → vnpy 코드 → 백테스트 → 최적화 → 전략 마켓 등록까지의 완전한 폐루프."
---

<div class="lucrum-tut-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="trending-up" :size="14" /> Lucrum 퀀트 폐루프</span>
  <h1 class="lurus-section-head__title">Lucrum 전략 전체 흐름</h1>
  <p class="lurus-section-head__lede"><strong>목표</strong>: "이중 이동평균 + RSI 필터"라는 아이디어를 자연어 설명에서 시작해 전략 마켓 등록까지 끌고 갑니다.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 단계</span><span class="lurus-stat__label">설명에서 등록까지</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">S/A/B/C/D</span><span class="lurus-stat__label">5등급 평가</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">vnpy</span><span class="lurus-stat__label">생성 코드 스택</span></div>
</div>

## <Icon name="network" :size="20" /> 아키텍처

자연어에서 등록까지, 평가가 분기 게이트 역할을 합니다. 평가 ≥ A이면 바로 등록하고, A 미만이면 AI 최적화 후 다시 백테스트합니다.

<ArchitectureDiagram title="Lucrum 전략 폐루프" chart="graph TB
  NL[자연어] --> GEN[AI 전략 생성]
  GEN --> CODE[vnpy 코드]
  CODE --> BT[과거 데이터 백테스트]
  BT --> SCORE{평가}
  SCORE -->|A 미달| OPT[AI 최적화 제안]
  OPT --> BT
  SCORE -->|A 등급 도달| MKT[전략 마켓 등록]" />

## <Icon name="workflow" :size="20" /> 전체 흐름

<ol class="lurus-steps">
<li>

**자연어 설명** — [lucrum.lurus.cn](https://lucrum.lurus.cn) 접속 → 새 전략 → 설명 붙여넣기:

> 이중 이동평균 교차 전략, 5일선이 20일선을 상향 돌파하면 매수, 하향 돌파하면 매도. RSI(14) 필터 추가, RSI > 70이면 매수 안 함. 손절 5%, 익절 15%.

</li>
<li>

**AI가 vnpy 코드 생성**

```python
from vnpy.app.cta_strategy import CtaTemplate
import talib

class MA_RSI_Strategy(CtaTemplate):
    fast_window = 5
    slow_window = 20
    rsi_window = 14
    rsi_upper = 70
    stop_loss_pct = 0.05
    take_profit_pct = 0.15

    def on_bar(self, bar):
        self.am.update_bar(bar)
        if not self.am.inited:
            return
        fast_ma = talib.SMA(self.am.close_array, self.fast_window)[-1]
        slow_ma = talib.SMA(self.am.close_array, self.slow_window)[-1]
        rsi = talib.RSI(self.am.close_array, self.rsi_window)[-1]

        if self.pos == 0 and fast_ma > slow_ma and rsi < self.rsi_upper:
            self.buy(bar.close_price, 1)
        elif self.pos > 0 and (fast_ma < slow_ma):
            self.sell(bar.close_price, self.pos)
```

</li>
<li>

**백테스트** — 백테스트 구간 선택(기본값 최근 2년) 후 실행 클릭:

```
回测期间: 2024-01-01 ~ 2025-12-31
夏普比率: 1.15
最大回撤: 11.3%
胜率: 56%
年化收益: 18.4%
评级: B (收益良好，风控合格)
```

</li>
<li>

**AI 최적화** — Lucrum이 개선 제안을 제시합니다:

> 현재 RSI 필터 임계값(70)이 다소 느슨하여 백테스트에서 가짜 돌파가 8회 발생했습니다. 제안:
> 1. RSI 임계값을 65로 강화
> 2. 5일 거래량 이동평균 필터 추가
> 3. 손절을 5%에서 7%로 완화(노이즈에 의한 청산 방지)
>
> 예상 샤프 → 1.42, 회수 → 9.2%

제안을 수락하고 다시 백테스트:

```
夏普比率: 1.44
最大回撤: 9.1%
胜率: 62%
评级: A (收益优秀，风控良好)
```

</li>
<li>

**전략 마켓 등록** — 전략 상세 페이지 진입 → 등록 버튼 → 가격 입력:

| 필드 | 예시 |
|------|------|
| 전략명 | MA_RSI_A주 추세 v2 |
| 분배 비율 | 작성자 70% / 플랫폼 30% |
| 체험 기간 | 7일 |
| 추천 구독가 | 99 루베이/월 |

규정 준수 심사를 통과하면 [전략 마켓](/ko/lucrum/strategies)에 등록할 수 있습니다.

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">B → A 향상은 최적화 라운드에서 나옵니다</p>
    <div class="lurus-callout__body"><p>1차 백테스트 등급은 B(샤프 1.15)였습니다. AI 최적화 제안을 수락해 다시 백테스트하니 샤프가 1.44로 오르고 회수가 9.1%로 낮아져 A 등급에 도달했습니다 — 그제서야 등록 게이트로 들어갑니다.</p></div>
  </div>
</div>

## <Icon name="book-open" :size="20" /> 핵심 개념

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="Sharpe Ratio">샤프 비율</Term></div>
    <p class="lurus-card__body">위험 한 단위당 초과 수익.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="Max Drawdown">최대 회수</Term></div>
    <p class="lurus-card__body">역사적 최고점에서 최저점까지의 하락폭.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="CtaTemplate">CtaTemplate</Term></div>
    <p class="lurus-card__body">vnpy의 전략 베이스 클래스.</p>
  </div>
</div>

## 다음 단계

<NextSteps :steps="[
  { text: 'Lucrum 알아보기', link: '/ko/lucrum/', primary: true },
  { text: '전략 마켓', link: '/ko/lucrum/strategies' },
  { text: 'FAQ', link: '/ko/lucrum/faq' },
]" />

</div>
