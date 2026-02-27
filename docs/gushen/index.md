# GuShen — AI 量化交易平台

## 什么是 GuShen？

**GuShen（股神）** 是 Lurus 旗下的 AI 驱动量化交易平台。你用自然语言描述策略逻辑，平台 AI 自动生成可执行的 Python 策略代码，并支持历史回测、实时行情接入与风险控制。

- 平台地址：[gushen.lurus.cn](https://gushen.lurus.cn)
- 支持市场：A 股（沪深）、期货、加密货币

## 核心功能

### 🤖 AI 策略生成

用中文描述你的交易思路，AI 自动生成可执行的量化策略代码：

```
输入："当 RSI 低于 30 时买入，高于 70 时卖出，仓位 50%"

↓ AI 生成 ↓

def strategy(context):
    rsi = context.ta.rsi(period=14)
    pos = context.portfolio.positions.get("000001.SZ")
    if rsi[-1] < 30 and not pos:
        context.order_percent("000001.SZ", 0.5)
    elif rsi[-1] > 70 and pos:
        context.order_percent("000001.SZ", 0)
```

### 📊 历史回测

- 支持任意时间段回测（最早 2010 年）
- 输出收益曲线、最大回撤、夏普比率、胜率等核心指标
- 与沪深 300、中证 500 等基准对比

### 📡 实时行情

- 接入 Level-1 行情数据（1 分钟最小粒度）
- 支持分钟线、日线、周线等多周期数据
- 实时推送到策略 `context` 对象

### 🛡️ 风险控制

- 单笔最大仓位限制
- 单日最大亏损止损
- 持仓集中度告警

## 工作流程

```
1. 注册/登录 → gushen.lurus.cn
2. 创建策略 → 自然语言输入 → AI 生成代码
3. 调整参数 → 历史回测验证
4. 满意后 → 开启模拟盘 / 实盘跟踪
```

## 下一步

- [快速开始](/gushen/quickstart) — 5 分钟创建你的第一个策略
- [策略编写指南](/gushen/strategy) — 深入了解策略 API
- [API 参考](/gushen/api) — 完整的 context 对象文档
