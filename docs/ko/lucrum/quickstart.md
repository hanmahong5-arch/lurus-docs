---
title: Lucrum 빠른 시작
description: 5분 만에 Lucrum AI 퀀트 트레이딩 어시스턴트를 시작하세요.
---

<div class="lucrum-page">

# 빠른 시작

5분 만에 Lucrum AI 트레이딩 어시스턴트를 시작하세요 — 가입부터 첫 백테스트까지.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5</span><span class="lurus-stat__label">분 만에 시작</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">11</span><span class="lurus-stat__label">투자 자문</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">A주</span><span class="lurus-stat__label">상하이·선전 양 시장</span></div>
</div>

<ol class="lurus-steps">
<li>

### 가입 및 로그인

[lucrum.lurus.cn](https://lucrum.lurus.cn) 접속 →「가입」에서 Lurus 통합 계정(이메일 / GitHub / Google)으로 → 트레이딩 패널로 진입. 이미 Lurus 제품 계정이 있다면 바로 로그인 가능(동일한 계정 체계를 공유).

</li>
<li>

### AI 트레이딩 어시스턴트 체험

로그인 후 우측 하단의 AI 어시스턴트 진입점에서, 자연어를 이해하며 트레이딩 관련 어떤 질문이든 할 수 있습니다. 예시 질문:

- **시장 분석** — "오늘 상하이종합지수가 왜 하락했나요?"
- **전략 제안** — "10만 자금으로 안정적인 전략을 추천해 주세요"
- **기술 지표** — "CATL의 볼린저 밴드를 계산해 주세요"
- **리스크 평가** — "BYD에 전액 투자하면 리스크가 큰가요?"

</li>
<li>

### 전략 마켓플레이스 둘러보기

상단「**전략 마켓플레이스**」→ 수익률 / 최대낙폭 / 유형으로 필터링 → 전략 카드에 연환산 수익률, 최대낙폭, 샤프 지수(&gt; 1 우수), 운영 기간 표시(지표 상세 설명은 [전략 마켓플레이스](/ko/lucrum/strategies) 참고) →「구독」으로 계정에 배포.

</li>
<li>

### 트레이딩 계좌 설정

실거래는 증권사 연동이 필요합니다:「**설정**」→「**트레이딩 계좌**」→ 증권사 선택 → 안내에 따라 인증.

</li>
<li>

### 첫 전략 만들기(개발자)

「**전략 워크벤치**」에서 작성하고,「**백테스트**」를 클릭해 과거 성과를 확인:

```python
# 示例：简单的双均线策略
from lucrum import Strategy, Signal

class DualMA(Strategy):
    """双均线交叉策略"""

    fast_period = 5    # 快线周期
    slow_period = 20   # 慢线周期

    def on_bar(self, bar):
        fast_ma = self.sma(bar.close, self.fast_period)
        slow_ma = self.sma(bar.close, self.slow_period)

        if fast_ma > slow_ma and self.position <= 0:
            return Signal.BUY
        elif fast_ma < slow_ma and self.position >= 0:
            return Signal.SELL

        return Signal.HOLD
```

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">리스크 안내</p>
    <div class="lurus-callout__body">퀀트 트레이딩에는 손실 리스크가 존재합니다. 먼저 모의 거래로 충분히 검증한 후 실거래에 투입하세요. Lucrum은 어떠한 투자 조언이나 수익 보장도 제공하지 않습니다.</div>
  </div>
</div>

---

## API 연동

완전한 REST API를 자체 트레이딩 시스템에 통합할 수 있습니다:

<ApiEndpoint method="POST" path="/api/v1/advisor/chat" description="AI 분석 가져오기" />

```bash
curl https://lucrum.lurus.cn/api/v1/advisor/chat \
  -H "Authorization: Bearer $LURUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "分析上证指数趋势"}'
```

<ApiEndpoint method="GET" path="/api/v1/strategies" description="전략 목록 가져오기" />

```bash
curl https://lucrum.lurus.cn/api/v1/strategies \
  -H "Authorization: Bearer $LURUS_TOKEN"
```

---

<NextSteps
  :steps="[
    { text: '전략 마켓플레이스', link: '/ko/lucrum/strategies', primary: true },
    { text: '자주 묻는 질문', link: '/ko/lucrum/faq' },
    { text: 'Lurus API', link: '/ko/guide/introduction' },
    { text: 'MemX 메모리 엔진', link: '/memx/' },
  ]"
  title="다음 단계"
/>

</div>
