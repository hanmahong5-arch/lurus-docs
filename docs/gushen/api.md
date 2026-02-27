# GuShen API 参考

## context 对象完整 API

### context.portfolio

| 属性 | 类型 | 描述 |
|------|------|------|
| `total_value` | float | 总资产（现金 + 持仓市值） |
| `cash` | float | 可用现金 |
| `positions` | dict | 持仓字典 `{symbol: Position}` |
| `returns` | float | 今日浮动盈亏率 |

### Position 对象

| 属性 | 类型 | 描述 |
|------|------|------|
| `symbol` | str | 标的代码 |
| `amount` | int | 持仓数量（股） |
| `cost_basis` | float | 持仓均价 |
| `last_price` | float | 最新价格 |
| `market_value` | float | 持仓市值 |
| `pnl` | float | 浮动盈亏（元） |
| `pnl_pct` | float | 浮动盈亏（%） |

### context.bar(symbol)

返回当前 bar 数据：

| 属性 | 类型 | 描述 |
|------|------|------|
| `open` | float | 开盘价 |
| `high` | float | 最高价 |
| `low` | float | 最低价 |
| `close` | float | 收盘价 |
| `volume` | int | 成交量（股） |
| `amount` | float | 成交金额（元） |
| `datetime` | datetime | 当前 bar 时间 |

### context.history(symbol, periods, frequency)

返回历史 K 线 DataFrame：

```python
df = context.history("000001.SZ", periods=60, frequency="1d")
# df.columns: ['open', 'high', 'low', 'close', 'volume', 'amount']
# df.index: DatetimeIndex (由近到远倒序)

# 示例
close_yesterday = df['close'].iloc[0]  # 昨收
close_5days_ago = df['close'].iloc[4]  # 5 日前收盘
```

**frequency 可选值**:

| 值 | 说明 |
|----|------|
| `"1m"` | 1 分钟线 |
| `"5m"` | 5 分钟线 |
| `"15m"` | 15 分钟线 |
| `"30m"` | 30 分钟线 |
| `"60m"` | 60 分钟线 |
| `"1d"` | 日线（默认） |
| `"1w"` | 周线 |

### context.ta — 技术指标

所有指标返回 `numpy.ndarray`，最新值为 `arr[-1]`：

#### 趋势类

| 方法 | 参数 | 描述 |
|------|------|------|
| `ta.sma(symbol, period)` | period: int | 简单移动平均 |
| `ta.ema(symbol, period)` | period: int | 指数移动平均 |
| `ta.wma(symbol, period)` | period: int | 加权移动平均 |
| `ta.macd(symbol, fast, slow, signal)` | 默认 12/26/9 | 返回 (macd, signal, hist) |

#### 震荡类

| 方法 | 参数 | 描述 |
|------|------|------|
| `ta.rsi(symbol, period)` | period: int（默认 14）| 相对强弱指数 0-100 |
| `ta.stoch(symbol, k, d, smooth)` | 默认 14/3/3 | 返回 (K, D) |
| `ta.cci(symbol, period)` | period: int（默认 14）| 顺势指标 |

#### 波动类

| 方法 | 参数 | 描述 |
|------|------|------|
| `ta.bbands(symbol, period, std)` | 默认 20/2.0 | 返回 (upper, middle, lower) |
| `ta.atr(symbol, period)` | period: int（默认 14）| 真实波动幅度 |
| `ta.keltner(symbol, period, atr_mult)` | 默认 20/2.0 | 返回 (upper, middle, lower) |

#### 成交量类

| 方法 | 参数 | 描述 |
|------|------|------|
| `ta.volume_ma(symbol, period)` | period: int | 成交量移动平均 |
| `ta.obv(symbol)` | — | 能量潮 |
| `ta.vwap(symbol)` | — | 成交量加权均价 |

### 下单函数

#### order_percent(symbol, ratio)

按目标仓位比例调仓（最常用）：

```python
context.order_percent("000001.SZ", 0.5)  # 调到 50%
context.order_percent("000001.SZ", 0)    # 清仓
context.order_percent("000001.SZ", 1.0)  # 满仓
```

| 参数 | 类型 | 描述 |
|------|------|------|
| `symbol` | str | 标的代码 |
| `ratio` | float | 目标仓位比例 0.0~1.0 |

#### order_value(symbol, value)

按金额下单：

```python
context.order_value("000001.SZ", 50000)   # 买入 5 万
context.order_value("000001.SZ", -50000)  # 卖出 5 万（负数）
```

#### order(symbol, amount)

按股数下单（A 股须为 100 的整数倍）：

```python
context.order("000001.SZ", 1000)   # 买入 1000 股
context.order("000001.SZ", -500)   # 卖出 500 股
```

#### order_limit(symbol, amount, price)

限价单：

```python
context.order_limit("000001.SZ", 1000, price=14.80)
```

### context.log

| 方法 | 描述 |
|------|------|
| `context.log.info(msg)` | 信息日志 |
| `context.log.warn(msg)` | 警告日志 |
| `context.log.error(msg)` | 错误日志 |

## 标的代码格式

| 市场 | 格式 | 示例 |
|------|------|------|
| 上交所 A 股 | `{6位代码}.SH` | `600036.SH`（招商银行） |
| 深交所 A 股 | `{6位代码}.SZ` | `000001.SZ`（平安银行） |
| 上交所 ETF | `{6位代码}.SH` | `510300.SH`（沪深300 ETF）|
| 期货主力 | `{品种}0.CF` | `IF0.CF`（沪深300期货）|
| 加密货币 | `{BASE}/{QUOTE}` | `BTC/USDT` |

## 错误码

| 错误 | 原因 | 处理 |
|------|------|------|
| `InsufficientCash` | 可用资金不足 | 检查 `context.portfolio.cash` |
| `InvalidSymbol` | 标的代码不存在 | 确认代码格式是否正确 |
| `MarketClosed` | 非交易时段 | 仅在交易时间内下单 |
| `PositionNotFound` | 卖出时无持仓 | 先检查 `positions.get()` 是否为 None |
| `AmountTooSmall` | 买入金额不足最小单位 | A 股买入至少 100 股（约 ≥ 500 元）|
