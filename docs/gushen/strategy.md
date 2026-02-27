# 策略编写指南

## 策略结构

一个完整的 GuShen 策略由以下函数组成：

```python
def initialize(context):
    """初始化函数，策略启动时执行一次"""
    context.symbol = "000001.SZ"   # 标的代码
    context.max_position = 0.8     # 最大仓位

def before_market_open(context):
    """每日开盘前执行（可选）"""
    pass

def strategy(context):
    """策略主函数，每个 bar（K 线周期）执行一次"""
    # 在此编写买卖逻辑
    pass

def after_market_close(context):
    """每日收盘后执行（可选）"""
    pass
```

## context 对象

`context` 是贯穿整个策略的核心对象，包含行情、账户、技术指标等所有数据。

### 账户信息

```python
# 总资产（现金 + 持仓市值）
total = context.portfolio.total_value

# 可用现金
cash = context.portfolio.cash

# 当前持仓
positions = context.portfolio.positions
# positions 是一个字典：{symbol: Position}

# 查询单个标的持仓
pos = context.portfolio.positions.get("000001.SZ")
if pos:
    print(pos.amount)       # 持仓数量（股）
    print(pos.cost_basis)   # 持仓成本价
    print(pos.last_price)   # 最新价格
    print(pos.pnl)          # 浮动盈亏（元）
    print(pos.pnl_pct)      # 浮动盈亏（%）
```

### 行情数据

```python
# 当前 bar 的 OHLCV 数据
bar = context.bar("000001.SZ")
bar.open   # 开盘价
bar.high   # 最高价
bar.low    # 最低价
bar.close  # 收盘价
bar.volume # 成交量

# 获取历史 K 线（返回 pandas DataFrame）
history = context.history("000001.SZ", periods=60, frequency="1d")
# columns: open, high, low, close, volume
# index: DatetimeIndex

# 简写：最近 N 根收盘价（返回 numpy array）
closes = context.close("000001.SZ", periods=30)
```

### 技术指标

所有指标返回 `numpy.ndarray`，最后一个元素（`[-1]`）为当前值，`[-2]` 为上一个 bar 值。

```python
ta = context.ta

# 移动平均线
ma5  = ta.sma("000001.SZ", period=5)   # 简单移动平均
ema20 = ta.ema("000001.SZ", period=20)  # 指数移动平均

# RSI 相对强弱指数
rsi = ta.rsi("000001.SZ", period=14)

# MACD
macd, signal, hist = ta.macd("000001.SZ", fast=12, slow=26, signal=9)

# 布林带
upper, middle, lower = ta.bbands("000001.SZ", period=20, std=2)

# ATR 真实波动幅度
atr = ta.atr("000001.SZ", period=14)

# 成交量移动平均
vol_ma = ta.volume_ma("000001.SZ", period=20)

# 使用示例：金叉信号
if ma5[-1] > ema20[-1] and ma5[-2] <= ema20[-2]:
    print("金叉，考虑买入")
```

### 下单函数

```python
# 按目标仓位比例下单（推荐）
# ratio: 0.0 = 清仓，1.0 = 满仓
context.order_percent("000001.SZ", 0.5)   # 买入到 50% 仓位
context.order_percent("000001.SZ", 0)      # 清仓

# 按金额下单
context.order_value("000001.SZ", 100000)   # 买入 10 万元
context.order_value("000001.SZ", -100000)  # 卖出 10 万元（负数）

# 按股数下单
context.order("000001.SZ", 1000)    # 买入 1000 股
context.order("000001.SZ", -1000)   # 卖出 1000 股

# 限价单
context.order_limit("000001.SZ", 1000, price=15.50)
```

### 日志输出

```python
context.log.info("策略日志：当前收盘价 {}".format(bar.close))
context.log.warn("仓位过高，触发风控")
context.log.error("数据异常")
```

## 完整策略示例

### 示例 1：双均线策略

```python
def initialize(context):
    context.symbol = "000001.SZ"

def strategy(context):
    ma5  = context.ta.sma(context.symbol, period=5)
    ma20 = context.ta.sma(context.symbol, period=20)

    pos = context.portfolio.positions.get(context.symbol)

    # 金叉买入
    if ma5[-1] > ma20[-1] and ma5[-2] <= ma20[-2]:
        if not pos:
            context.order_percent(context.symbol, 0.5)
            context.log.info("金叉买入，MA5={:.2f}, MA20={:.2f}".format(
                ma5[-1], ma20[-1]
            ))

    # 死叉卖出
    elif ma5[-1] < ma20[-1] and ma5[-2] >= ma20[-2]:
        if pos:
            context.order_percent(context.symbol, 0)
            context.log.info("死叉卖出")
```

### 示例 2：RSI 超买超卖策略

```python
def initialize(context):
    context.symbol = "600036.SH"  # 招商银行
    context.rsi_low  = 30         # 超卖阈值
    context.rsi_high = 70         # 超买阈值

def strategy(context):
    rsi = context.ta.rsi(context.symbol, period=14)
    pos = context.portfolio.positions.get(context.symbol)

    # 超卖买入
    if rsi[-1] < context.rsi_low and not pos:
        context.order_percent(context.symbol, 0.6)
        context.log.info("RSI 超卖({:.1f})，买入".format(rsi[-1]))

    # 超买卖出
    elif rsi[-1] > context.rsi_high and pos:
        context.order_percent(context.symbol, 0)
        context.log.info("RSI 超买({:.1f})，卖出".format(rsi[-1]))
```

### 示例 3：布林带 + 止损策略

```python
def initialize(context):
    context.symbol     = "510300.SH"   # 沪深300 ETF
    context.stop_loss  = 0.05           # 5% 止损

def strategy(context):
    upper, middle, lower = context.ta.bbands(context.symbol, period=20, std=2)
    bar = context.bar(context.symbol)
    pos = context.portfolio.positions.get(context.symbol)

    # 价格触及下轨买入
    if bar.close <= lower[-1] and not pos:
        context.order_percent(context.symbol, 0.8)

    elif pos:
        # 价格触及上轨获利了结
        if bar.close >= upper[-1]:
            context.order_percent(context.symbol, 0)

        # 止损：跌破成本 5% 离场
        elif bar.close < pos.cost_basis * (1 - context.stop_loss):
            context.order_percent(context.symbol, 0)
            context.log.warn("触发止损，成本={:.2f}，现价={:.2f}".format(
                pos.cost_basis, bar.close
            ))
```

## 多标的策略

```python
def initialize(context):
    context.symbols = ["000001.SZ", "600036.SH", "601318.SH"]

def strategy(context):
    for symbol in context.symbols:
        rsi = context.ta.rsi(symbol, period=14)
        pos = context.portfolio.positions.get(symbol)

        if rsi[-1] < 30 and not pos:
            # 均等仓位分配
            context.order_percent(symbol, 1.0 / len(context.symbols))

        elif rsi[-1] > 70 and pos:
            context.order_percent(symbol, 0)
```

## 注意事项

1. **未来函数（Look-ahead bias）**: 禁止使用当日收盘价决策后再以当日价格成交。默认以**下一个 bar 开盘价**成交。
2. **A 股最小交易单位**: 买入最小 100 股，系统自动向下取整。
3. **涨跌停**: 涨停不能买入，跌停不能卖出，框架自动处理。
4. **复权**: 行情数据默认使用**前复权**价格，避免除权日信号失真。
