---
title: Lucrum 快速开始
description: 5 分钟上手 Lucrum AI 量化交易助手。
---

# 快速开始

5 分钟上手 Lucrum AI 交易助手。

## 第一步：注册与登录

访问 [lucrum.lurus.cn](https://lucrum.lurus.cn) →「注册」用 Lurus 统一账号（邮箱 / GitHub / Google）→ 进入交易面板。已有任意 Lurus 产品账号可直接登录（共享同一账号体系）。

---

## 第二步：体验 AI 交易助手

登录后右下角 AI 助手入口，理解自然语言，可问任何交易相关问题。示例提问：市场分析（"上证指数今天为什么跌？"）、策略建议（"10 万资金偏稳健推荐策略"）、技术指标（"算宁德时代的布林带"）、风险评估（"全仓比亚迪风险大吗？"）。

---

## 第三步：浏览策略市场

顶部「**策略市场**」→ 按收益率/回撤/类型筛选 → 策略卡片展示年化收益率、最大回撤、夏普比率（>1 优秀）、运行时长（指标详解见 [策略市场](/lucrum/strategies)）→「订阅」部署到账户。

---

## 第四步：配置交易账户

实盘交易需关联券商：「**设置**」→「**交易账户**」→ 选券商 → 按提示授权。

::: warning 风险提示
量化交易存在亏损风险。先用模拟盘充分验证再投实盘。Lucrum 不提供任何投资建议或收益保证。
:::

---

## 第五步：创建你的第一个策略（开发者）

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

---

## API 接入

完整 REST API 可集成到自有交易系统：

```bash
# 获取 AI 分析
curl https://lucrum.lurus.cn/api/v1/advisor/chat \
  -H "Authorization: Bearer $LURUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "分析上证指数趋势"}'

# 获取策略列表
curl https://lucrum.lurus.cn/api/v1/strategies \
  -H "Authorization: Bearer $LURUS_TOKEN"
```

---

## 下一步

- [策略市场](/lucrum/strategies) — 深入了解策略生态
- [常见问题](/lucrum/faq) — 使用中遇到问题？
- [Lurus API](/guide/introduction) — 了解底层 AI 能力
- [MemX](/memx/) — 了解 AI 记忆引擎如何增强交易助手
