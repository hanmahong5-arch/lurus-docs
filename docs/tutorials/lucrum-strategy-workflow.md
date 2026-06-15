---
title: 教程 — Lucrum 策略从本地到上架
description: 自然语言 → vnpy 代码 → 回测 → 优化 → 策略市场上架的完整闭环。
---

<div class="lucrum-tut-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="trending-up" :size="14" /> Lucrum 量化闭环</span>
  <h1 class="lurus-section-head__title">Lucrum 策略完整流</h1>
  <p class="lurus-section-head__lede"><strong>目标</strong>：把"双均线 + RSI 过滤"这个思路，从自然语言描述一路走到策略市场上架。</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 步</span><span class="lurus-stat__label">描述到上架</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">S/A/B/C/D</span><span class="lurus-stat__label">五级评分</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">vnpy</span><span class="lurus-stat__label">生成代码栈</span></div>
</div>

## <Icon name="network" :size="20" /> 架构

从自然语言到上架，评分是分流闸门：评分 ≥ A 直接上架，低于 A 走 AI 优化再回测。

<ArchitectureDiagram title="Lucrum 策略闭环" chart="graph TB
  NL[自然语言] --> GEN[AI 策略生成]
  GEN --> CODE[vnpy 代码]
  CODE --> BT[历史数据回测]
  BT --> SCORE{评分}
  SCORE -->|未达 A| OPT[AI 优化建议]
  OPT --> BT
  SCORE -->|达 A 级| MKT[策略市场上架]" />

## <Icon name="workflow" :size="20" /> 完整流程

<ol class="lurus-steps">
<li>

**自然语言描述** — 进入 [lucrum.lurus.cn](https://lucrum.lurus.cn) → 新建策略 → 粘贴描述：

> 双均线交叉策略，5 日线上穿 20 日线时买入，下穿时卖出。加 RSI(14) 过滤，RSI > 70 时不买入。止损 5%，止盈 15%。

</li>
<li>

**AI 生成 vnpy 代码**

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

**回测** — 选择回测区间（默认近 2 年），点击运行：

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

**AI 优化** — Lucrum 给出改进建议：

> 当前 RSI 过滤阈值（70）较松，回测中有 8 次假突破。建议：
> 1. RSI 阈值收紧到 65
> 2. 加入 5 日成交量均线过滤
> 3. 止损从 5% 放宽到 7%（避免噪音洗出）
>
> 预计夏普 → 1.42，回撤 → 9.2%

接受建议，重新回测：

```
夏普比率: 1.44
最大回撤: 9.1%
胜率: 62%
评级: A (收益优秀，风控良好)
```

</li>
<li>

**策略市场上架** — 进入策略详情 → 上架按钮 → 填写定价：

| 字段 | 示例 |
|------|------|
| 策略名 | MA_RSI_A股趋势 v2 |
| 分成比例 | 作者 70% / 平台 30% |
| 试用期 | 7 天 |
| 推荐订阅价 | 99 鹿贝/月 |

通过合规审核后即可在[策略市场](/lucrum/strategies)上架。

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">B → A 的提升来自优化回合</p>
    <div class="lurus-callout__body"><p>首轮回测评级 B（夏普 1.15）。接受 AI 优化建议后重新回测，夏普升到 1.44、回撤降到 9.1%，达到 A 级——再进上架闸门。</p></div>
  </div>
</div>

## <Icon name="book-open" :size="20" /> 关键概念

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="Sharpe Ratio">夏普比率</Term></div>
    <p class="lurus-card__body">每单位风险的超额收益。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="Max Drawdown">最大回撤</Term></div>
    <p class="lurus-card__body">历史最高点到最低谷的跌幅。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="CtaTemplate">CtaTemplate</Term></div>
    <p class="lurus-card__body">vnpy 的策略基类。</p>
  </div>
</div>

## 下一步

<NextSteps :steps="[
  { text: '了解 Lucrum', link: '/lucrum/', primary: true },
  { text: '策略市场', link: '/lucrum/strategies' },
  { text: 'FAQ', link: '/lucrum/faq' },
]" />

</div>
