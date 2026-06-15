---
title: 金融行业方案
description: Lucrum + Auth + 合规审计 — 面向券商、资管、金融科技的组合方案。
---

<div class="finance-page">

# 金融行业方案

<MetricStats :items="[
  { label: 'AI 投资顾问', value: '11 个', hint: '多视角' },
  { label: '回测指标', value: '30+' },
  { label: '测试用例', value: '3157+', hint: 'Vitest' },
  { label: '策略上线', value: '1-3 天' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 适用对象</span>
  <h2 class="lurus-section-head__title">谁在用</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title">券商自营</div>
    <p class="lurus-card__body">自营 / 客户 A 股量化。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="briefcase" :size="20" /></span>
    <div class="lurus-card__title">资管公司</div>
    <p class="lurus-card__body">策略研究与组合管理。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">金融科技</div>
    <p class="lurus-card__body">AI 投顾产品。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">家办 / 专业投资者</div>
    <p class="lurus-card__body">个人策略研究与回测。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 核心组件</span>
  <h2 class="lurus-section-head__title">产品组合</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="lucrum" :actions="[{label:'了解 Lucrum', href:'/lucrum/', primary:true}]" />
  <ActionCard product-id="auth" :actions="[{label:'统一身份', href:'/platform/auth/', primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> 数据流</span>
  <h2 class="lurus-section-head__title">典型架构</h2>
  <p class="lurus-section-head__lede">从自然语言策略到实盘——分析师只描述思路，AI 落地代码。</p>
</div>

<ArchitectureDiagram title="金融量化数据流" chart="graph TB; A[分析师 / PM] -->|自然语言描述策略| B[Lucrum<br/>11 个 AI 投资顾问]; B -->|vnpy 代码 + 回测| C[策略市场]; C -->|订阅 / 分成| D[实盘交易]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 合规</span>
  <h2 class="lurus-section-head__title">合规亮点</h2>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">数据不出境</div>
    <p class="lurus-card__body">私有化部署，交易数据本地落盘。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="calculator" :size="20" /></span>
    <div class="lurus-card__title">金融级精度</div>
    <p class="lurus-card__body">Decimal.js 全链路，3,157 Vitest 用例验证。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">全程审计</div>
    <p class="lurus-card__body">每笔策略变更、回测、交易均留痕。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">身份合规</div>
    <p class="lurus-card__body">MFA 强制，PAT 定期轮换，SSO 联邦可接司内 IdP。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 成本</span>
  <h2 class="lurus-section-head__title">TCO 参考</h2>
</div>

| 项目 | 自建 | Lucrum 方案 |
|------|------|-----------|
| 研究员人数 | 3-5 人 | 1-2 人 + AI 顾问 |
| 策略上线周期 | 2-4 周 | **1-3 天** |
| 回测基础设施 | 自建 | 内置 |

## 下一步

<NextSteps :steps="[
  { text: 'Lucrum 快速开始', link: '/lucrum/quickstart', primary: true },
  { text: '策略完整流', link: '/tutorials/lucrum-strategy-workflow' },
  { text: '联系商务', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
