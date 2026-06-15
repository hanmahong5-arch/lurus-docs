---
title: Lucrum 策略市场
description: Lucrum 开放策略生态，连接策略开发者和交易者。
---

<div class="lucrum-page">

# 策略市场

Lucrum 策略市场是一个开放的量化策略生态，连接策略开发者和交易者。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">70%</span><span class="lurus-stat__label">作者分成</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6</span><span class="lurus-stat__label">内置策略包</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2 年+</span><span class="lurus-stat__label">回测数据要求</span></div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 对策略使用者</span>
  <h2 class="lurus-section-head__title">浏览、评估、一键部署</h2>
</div>

### 浏览与筛选

在策略市场中，你可以按多个维度筛选策略：

| 筛选条件 | 说明 |
|---------|------|
| 市场 | A 股（沪深两市）；港股、美股、加密规划中 |
| 策略类型 | 趋势跟踪、均值回归、套利、多因子 |
| 风险等级 | 保守、稳健、激进 |
| 最低资金 | 策略要求的最低投入资金 |
| 排序 | 收益率、夏普比率、最大回撤、订阅数 |

### 策略评估指标

每个上架策略都展示经过验证的量化指标：

| 指标 | 优秀标准 | 说明 |
|------|---------|------|
| **年化收益** | &gt; 15% | 年化复合收益率 |
| **最大回撤** | &lt; 20% | 历史最大亏损（峰谷差） |
| **夏普比率** | &gt; 1.5 | 每单位风险对应的超额收益 |
| **Calmar 比率** | &gt; 1.0 | 年化收益 / 最大回撤 |
| **胜率** | &gt; 50% | 盈利交易占比 |
| **盈亏比** | &gt; 1.5 | 平均盈利 / 平均亏损 |
| **运行天数** | &gt; 90 天 | 策略实盘运行时长 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">如何选策略？</p>
    <div class="lurus-callout__body">不要只看收益率。一个夏普比率 2.0、最大回撤 10% 的策略，通常比年化 50% 但回撤 40% 的策略更适合大多数人。</div>
  </div>
</div>

### 订阅与部署

<ol class="lurus-steps">
<li>

选策略 → 详情页（含**完整回测报告**）。

</li>
<li>

「**订阅**」确认费用。

</li>
<li>

「**我的策略**」选交易账户、设资金分配。

</li>
<li>

「**启动**」自动执行。

</li>
</ol>

**费用**：部分免费、部分按月订阅；订阅费从 [鹿贝钱包](/platform/billing#wallet) 扣除；交易手续费由券商收取，与 Lucrum 无关。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> 对策略开发者</span>
  <h2 class="lurus-section-head__title">开发、审核、赚取被动收入</h2>
</div>

### 上架流程

<ol class="lurus-steps">
<li>

**本地开发** 策略逻辑。

</li>
<li>

**回测验证**（至少 2 年历史数据）。

</li>
<li>

**提交审核**（描述 / 风险等级 / 适用市场）。

</li>
<li>

**平台审核** 合规与风控（通常 1-3 个工作日）。

</li>
<li>

**上架** 对所有用户可见。

</li>
<li>

**获取收入**，以鹿贝结算到钱包。

</li>
</ol>

### 审核标准

| 项目 | 要求 |
|------|------|
| 回测数据量 | 至少覆盖 2 年历史数据 |
| 最大回撤 | 不超过 50%（超过需特别标注风险） |
| 风控措施 | 必须包含止损逻辑 |
| 代码质量 | 无内存泄漏、无无限循环风险 |
| 策略描述 | 完整说明策略逻辑、适用市场、风险提示 |

### 收益分成

策略产生的订阅收入按以下比例分配：

| 角色 | 分成比例 |
|------|---------|
| 策略作者 | **70%** |
| 平台 | **30%** |

收入以鹿贝形式结算到你的钱包，可提现到银行卡。

### 内置策略包

Lucrum 内置 6 大策略包 + 支持自定义扩展：

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title"><code>VALUE_BLUECHIP</code></div>
    <p class="lurus-card__body">价值蓝筹（低估值、大盘稳健）。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title"><code>GROWTH_MOMENTUM</code></div>
    <p class="lurus-card__body">成长动量（高增长 + 动量筛选）。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="star" :size="20" /></span>
    <div class="lurus-card__title"><code>SECTOR_LEADER</code></div>
    <p class="lurus-card__body">板块龙头（行业领涨标的）。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title"><code>LOW_VOL_STABLE</code></div>
    <p class="lurus-card__body">低波稳健（低波动率防御型）。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="20" /></span>
    <div class="lurus-card__title"><code>MEAN_REVERSION</code></div>
    <p class="lurus-card__body">均值回归（超跌反弹）。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title"><code>EVENT_DRIVEN</code></div>
    <p class="lurus-card__body">事件驱动（公告、财报等催化）。</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="filter" :size="14" /> 策略类型</span>
  <h2 class="lurus-section-head__title">四类常见策略的原理与适用场景</h2>
</div>

| 类型 | 原理 | 典型信号/因子 | 适合 |
|------|------|------|------|
| **趋势跟踪** | 顺势而为，趋势形成入场、结束离场 | 均线交叉、通道突破、动量指标 | 单边行情（牛/熊市），不适合震荡市 |
| **均值回归** | 价格偏离均值后回归，超跌买入超涨卖出 | RSI、布林带、Z-Score | 震荡行情，不适合单边趋势 |
| **多因子选股** | 综合多因子对股票打分，买入高分股 | PE/PB（估值）、ROE（盈利）、12 月动量、波动率 | 中长期持有，换仓频率低 |
| **配对交易** | 高相关两股价差偏离均值时做空涨多的、做多跌多的 | — | 低回撤、市场中性的稳健策略 |

---

<div class="lurus-callout lurus-callout--danger">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">投资有风险</p>
    <div class="lurus-callout__body"><ul><li>历史回测表现不代表未来收益</li><li>量化策略可能在特定市场环境下失效</li><li>请根据自身风险承受能力合理配置资金</li><li>Lucrum 不提供任何投资建议或收益保证</li></ul></div>
  </div>
</div>

---

<NextSteps
  :steps="[
    { text: '快速开始', link: '/lucrum/quickstart', primary: true },
    { text: '常见问题', link: '/lucrum/faq' },
    { text: '产品概览', link: '/lucrum/' },
    { text: '交易平台', link: 'https://lucrum.lurus.cn', external: true },
  ]"
  title="下一步"
/>

</div>
