---
title: Lucrum — AI 量化交易平台
description: AI 驱动的量化交易平台，支持策略市场、回测验证和智能交易助手。
---

<div class="lucrum-page">

<ProductHero product-id="lucrum" />

<MetricStats :items="[
  { label: '投资顾问', value: '11 个', hint: '多视角 Agent' },
  { label: '回测指标', value: '30+', hint: '夏普 / 回撤 / 胜率…' },
  { label: '测试用例', value: '3157+', hint: 'Vitest 验证' },
  { label: '精度', value: 'Decimal.js', hint: '零浮点误差' },
]" />

## 什么是 Lucrum？

**Lucrum** 是 Lurus 推出的 AI-Native 量化交易决策平台。核心理念：**自然语言是最好的编程语言**——用中文描述策略思路，AI 自动生成代码、执行回测、多维度评估。内置 11 个专业投资顾问 Agent（巴菲特/彼得林奇/利弗莫尔/西蒙斯等视角），全平台 Decimal.js 金融级精度计算（3,157 Vitest 测试用例验证），零浮点误差。

> 名字源自拉丁语 "Lucrum"（收益），寓意精准洞察市场机会。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">当前阶段：公测（beta）</p>
    <div class="lurus-callout__body"><a href="https://lucrum.lurus.cn">lucrum.lurus.cn</a> 已上线，核心功能（策略生成 / 回测 / AI 顾问）可直接体验，定价见 <a href="https://lucrum.lurus.cn/pricing">/pricing</a>。尚未进入正式 GA，部分高级能力（策略市场、实盘券商接入）仍在完善中。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> 核心能力</span>
  <h2 class="lurus-section-head__title">从一句中文到一份评级回测</h2>
  <p class="lurus-section-head__lede">策略生成、多 Agent 投研、策略市场、配额计费、实时执行——一条链路打通。</p>
</div>

### AI 策略生成与回测

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">自然语言 → 代码</div>
    <p class="lurus-card__body">中文描述策略意图，AI 自动生成 vnpy CtaTemplate 策略代码。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="calculator" :size="20" /></span>
    <div class="lurus-card__title">金融级回测</div>
    <p class="lurus-card__body">Decimal.js 全精度、A 股 100 股整数倍约束、T+1 规则、佣金 + 印花税 + 过户费 + 滑点。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bar-chart-3" :size="20" /></span>
    <div class="lurus-card__title">30+ 指标分析</div>
    <p class="lurus-card__body">夏普比率、最大回撤、Sortino、Calmar、胜率、盈亏比……</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="star" :size="20" /></span>
    <div class="lurus-card__title">S/A/B/C/D 五级评分</div>
    <p class="lurus-card__body">4 维度加权：收益 30% + 风控 30% + 稳定性 25% + 效率 15%。</p>
  </div>
</div>

### 11 个 AI 投资顾问

基于 LangGraph 编排的多 Agent 投资分析系统（4 分析师 + 2 研究员 + 4 大师 + 1 辩论主持 = 11）：

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">4 位投资大师视角</div>
    <p class="lurus-card__body">巴菲特（价值）、彼得林奇（成长）、利弗莫尔（技术）、西蒙斯（量化）。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">4 名分析师</div>
    <p class="lurus-card__body">基本面 / 技术面 / 情绪面 / 宏观，分头出具结论。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">2 名研究员 + 1 辩论主持</div>
    <p class="lurus-card__body">Bull vs Bear 多空辩论，避免单一视角偏见。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">记忆引擎集成</div>
    <p class="lurus-card__body">通过 <a href="/memx/">MemX</a> 记住你的交易偏好和历史决策。</p>
  </div>
</div>

### 策略市场

开放的量化策略生态，连接策略开发者和交易者：

| 角色 | 功能 |
|------|------|
| **策略作者** | 上传策略、设定价格、查看收益分成 |
| **策略使用者** | 浏览、订阅策略，一键部署到实盘 |

**收益分成**: 平台 30% / 策略作者 70%。

### 配额与计费

<ol class="lurus-steps">
<li>

**计划限额** — 订阅套餐含的月度 AI 调用次数。

</li>
<li>

**Redis 月度计数** — 实时追踪当月已用量。

</li>
<li>

**鹿贝余额兜底** — 配额用尽后自动从 [鹿贝钱包](/platform/billing#wallet) 扣费，1 鹿贝 = 10,000 tokens。

</li>
</ol>

### 实时数据与执行

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">市场覆盖</div>
    <p class="lurus-card__body">A 股（沪深两市，~5000+ 股票，数据源 adata + 东方财富）；港股 / 美股 / 加密规划中。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">模拟交易</div>
    <p class="lurus-card__body">内置 Mock Broker，完整模拟 T+1 规则、100 股手数、佣金与印花税。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">风控引擎</div>
    <p class="lurus-card__body">仓位限制、止损止盈、最大回撤保护。</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 适用人群</span>
  <h2 class="lurus-section-head__title">不写代码也能跑量化</h2>
</div>

| 用户类型 | Lucrum 如何帮助你 |
|---------|-----------------|
| **量化新手** | AI 助手引导入门，自然语言描述策略思路即可生成代码框架 |
| **个人投资者** | 从策略市场选择已验证策略，一键部署，无需编程 |
| **策略开发者** | 完整的开发-回测-上线工具链，策略上架赚取被动收入 |
| **专业交易团队** | API 接口，集成到现有交易系统 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> 对标</span>
  <h2 class="lurus-section-head__title">和传统量化平台有什么不同</h2>
</div>

<ComparisonTable
  self-label="Lucrum"
  :competitors="['vnpy', '掘金', '米筐', '聚宽']"
  :rows="[
    { dimension: '策略编写', self: '自然语言生成', alt: { vnpy: 'Python 手写', '掘金': 'Python 手写', '米筐': 'Python 手写', '聚宽': 'Python 手写' } },
    { dimension: 'AI 投资顾问', self: '11 个多视角', alt: { vnpy: '无', '掘金': '无', '米筐': '无', '聚宽': '无' } },
    { dimension: '精度', self: 'Decimal.js 全精度', alt: { vnpy: 'float', '掘金': 'float', '米筐': 'float', '聚宽': 'float' } },
    { dimension: '策略市场', self: '内置 + 评级', alt: { vnpy: '无', '掘金': '有', '米筐': '有', '聚宽': '有' } },
  ]"
  title="对标传统量化平台"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 技术架构</span>
  <h2 class="lurus-section-head__title">从浏览器到结算引擎</h2>
</div>

<ArchitectureDiagram
  title="Lucrum 分层架构"
  chart="graph TD;
    A[浏览器 / 移动端] --> B[Lucrum Web<br/>Next.js 14 + TS<br/>交易面板·策略编辑·AI 对话];
    B --> C[Lucrum Backend<br/>Python 3.11 + FastAPI<br/>vnpy 4.x + LangGraph<br/>策略引擎·行情网关·风控·结算];
    C --> D[AI 助手<br/>Lurus API];
    C --> E[记忆引擎<br/>MemX];
    C --> F[(PostgreSQL<br/>策略 / 交易)];
    C --> G[(Redis<br/>行情 / 配额)];
    C --> H[NATS<br/>事件]"
/>

---

<NextSteps
  :steps="[
    { text: '快速开始', link: '/lucrum/quickstart', primary: true },
    { text: '策略市场', link: '/lucrum/strategies' },
    { text: '常见问题', link: '/lucrum/faq' },
    { text: '交易平台', link: 'https://lucrum.lurus.cn', external: true },
  ]"
  title="下一步"
/>

<!-- lurus:related-block -->

## 相关产品

<RelatedProducts product-id="lucrum" />

</div>

<style>
.lucrum-page .lurus-card--lucrum .lurus-card__body a { color: var(--lurus-color-lucrum, var(--vp-c-brand-1)); }
</style>
