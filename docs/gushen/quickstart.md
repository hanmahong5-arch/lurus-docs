# 快速开始

5 分钟上手 Lucrum AI 交易助手。

## 第一步：注册与登录

1. 访问 [gushen.lurus.cn](https://gushen.lurus.cn)
2. 点击「注册」，通过 Lurus 统一账号登录（支持邮箱注册或 GitHub/Google 第三方登录）
3. 完成登录后进入交易面板

::: tip 已有 Lurus 账号？
如果你已有 Lurus API 或其他 Lurus 产品账号，直接登录即可——所有 Lurus 产品共享同一个账号体系。
:::

---

## 第二步：体验 AI 交易助手

登录后，右下角可以看到 AI 助手入口。点击打开对话窗口：

```
你: 帮我分析一下最近贵州茅台的走势

AI: 最近 20 个交易日，贵州茅台（600519）呈现震荡偏弱走势：
    - 均线系统：MA5 下穿 MA20，短期偏空
    - MACD：DIF 和 DEA 均在零轴下方，绿柱缩短
    - 成交量：近 5 日缩量，市场观望情绪浓

    综合来看，短期可能继续横盘整理。建议关注 1680 支撑位，
    若放量突破 MA20 可考虑轻仓介入。
```

AI 助手能理解自然语言，你可以问任何交易相关的问题。

### 试试这些提问

| 提问方向 | 示例 |
|---------|------|
| 市场分析 | "上证指数今天为什么跌？" |
| 策略建议 | "我有 10 万资金，偏稳健，推荐一个策略" |
| 技术指标 | "帮我计算宁德时代的布林带" |
| 风险评估 | "我全仓了比亚迪，风险大吗？" |

---

## 第三步：浏览策略市场

1. 点击顶部导航「**策略市场**」
2. 浏览已上架的量化策略，支持按收益率、回撤、类型筛选
3. 每个策略卡片展示关键指标：

| 指标 | 说明 |
|------|------|
| 年化收益率 | 策略过去 12 个月的年化收益 |
| 最大回撤 | 历史最大亏损幅度 |
| 夏普比率 | 风险调整后的收益指标（> 1 优秀） |
| 运行时长 | 策略上线以来的时间 |

4. 点击「订阅」即可将策略部署到你的账户

---

## 第四步：配置交易账户

要进行实盘交易，需要关联你的券商账户：

1. 进入「**设置**」→「**交易账户**」
2. 选择你的券商
3. 按提示完成授权

::: warning 风险提示
量化交易存在亏损风险。建议先使用模拟盘充分验证策略，再投入实盘资金。Lucrum 不提供任何投资建议或收益保证。
:::

---

## 第五步：创建你的第一个策略（开发者）

如果你想自己编写策略，进入「**策略工作台**」：

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

点击「**回测**」按钮即可查看策略在历史数据上的表现。

---

## API 接入

Lucrum 提供完整的 REST API，可以集成到你自己的交易系统：

```bash
# 获取 AI 分析
curl https://gushen.lurus.cn/api/v1/advisor/chat \
  -H "Authorization: Bearer $LURUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "分析上证指数趋势"}'

# 获取策略列表
curl https://gushen.lurus.cn/api/v1/strategies \
  -H "Authorization: Bearer $LURUS_TOKEN"
```

---

## 下一步

- [策略市场](/gushen/strategies) — 深入了解策略生态
- [常见问题](/gushen/faq) — 使用中遇到问题？
- [Lurus API](/guide/introduction) — 了解底层 AI 能力
- [MemX](/memx/) — 了解 AI 记忆引擎如何增强交易助手
