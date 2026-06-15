---
title: Lucrum 快速开始
description: 5 分钟上手 Lucrum AI 量化交易助手。
---

<div class="lucrum-page">

# 快速开始

5 分钟上手 Lucrum AI 交易助手——从注册到第一份回测。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5</span><span class="lurus-stat__label">分钟上手</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">11</span><span class="lurus-stat__label">投资顾问</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">A 股</span><span class="lurus-stat__label">沪深两市</span></div>
</div>

<ol class="lurus-steps">
<li>

### 注册与登录

访问 [lucrum.lurus.cn](https://lucrum.lurus.cn) →「注册」用 Lurus 统一账号（邮箱 / GitHub / Google）→ 进入交易面板。已有任意 Lurus 产品账号可直接登录（共享同一账号体系）。

</li>
<li>

### 体验 AI 交易助手

登录后右下角 AI 助手入口，理解自然语言，可问任何交易相关问题。示例提问：

- **市场分析** — "上证指数今天为什么跌？"
- **策略建议** — "10 万资金偏稳健推荐策略"
- **技术指标** — "算宁德时代的布林带"
- **风险评估** — "全仓比亚迪风险大吗？"

</li>
<li>

### 浏览策略市场

顶部「**策略市场**」→ 按收益率 / 回撤 / 类型筛选 → 策略卡片展示年化收益率、最大回撤、夏普比率（&gt; 1 优秀）、运行时长（指标详解见 [策略市场](/lucrum/strategies)）→「订阅」部署到账户。

</li>
<li>

### 配置交易账户

实盘交易需关联券商：「**设置**」→「**交易账户**」→ 选券商 → 按提示授权。

</li>
<li>

### 创建你的第一个策略（开发者）

进入「**策略工作台**」编写，点「**回测**」查看历史表现：

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
    <p class="lurus-callout__title">风险提示</p>
    <div class="lurus-callout__body">量化交易存在亏损风险。先用模拟盘充分验证再投实盘。Lucrum 不提供任何投资建议或收益保证。</div>
  </div>
</div>

---

## API 接入

完整 REST API 可集成到自有交易系统：

<ApiEndpoint method="POST" path="/api/v1/advisor/chat" description="获取 AI 分析" />

```bash
curl https://lucrum.lurus.cn/api/v1/advisor/chat \
  -H "Authorization: Bearer $LURUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "分析上证指数趋势"}'
```

<ApiEndpoint method="GET" path="/api/v1/strategies" description="获取策略列表" />

```bash
curl https://lucrum.lurus.cn/api/v1/strategies \
  -H "Authorization: Bearer $LURUS_TOKEN"
```

---

<NextSteps
  :steps="[
    { text: '策略市场', link: '/lucrum/strategies', primary: true },
    { text: '常见问题', link: '/lucrum/faq' },
    { text: 'Lurus API', link: '/guide/introduction' },
    { text: 'MemX 记忆引擎', link: '/memx/' },
  ]"
  title="下一步"
/>

</div>
