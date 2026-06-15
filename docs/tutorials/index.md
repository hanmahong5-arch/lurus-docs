---
title: 跨产品教程中心
description: 把多个 Lurus 产品串起来的端到端教程，按角色分组。
---

<div class="tut-hub">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="graduation-cap" :size="14" /> 跨产品教程</span>
  <h1 class="lurus-section-head__title">跨产品教程中心</h1>
  <p class="lurus-section-head__lede">单个产品的快速开始在各自文档里。这里是<strong>跨产品组合案例</strong>——把 MemX + Kova + API、Lumen + LangGraph 等组合起来解决真实工程问题。</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">4</span><span class="lurus-stat__label">端到端教程</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">5+</span><span class="lurus-stat__label">联动产品</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2</span><span class="lurus-stat__label">角色路线</span></div>
</div>

## <Icon name="users" :size="20" /> 按角色

<div class="action-grid">
  <ActionCard
    name="Agent 开发者"
    tagline="给 Agent 加记忆 · 崩溃恢复 · Replay 调试"
    icon="bot"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: '记忆 Agent', href: '/tutorials/memory-agent', primary: true },
      { label: 'Lumen × LangGraph × Kova', href: '/tutorials/lumen-kova-langgraph' },
    ]"
  />
  <ActionCard
    name="量化交易"
    tagline="从自然语言策略到策略市场上架的完整闭环"
    icon="trending-up"
    color="var(--lurus-color-lucrum)"
    :actions="[
      { label: 'Lucrum 策略完整流', href: '/tutorials/lucrum-strategy-workflow', primary: true },
    ]"
  />
</div>

## <Icon name="layers" :size="20" /> 按主题

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--memx" href="/tutorials/memory-agent">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">记忆 + Agent</div>
    <p class="lurus-card__body">MemX 长期记忆 + Kova 崩溃恢复 + Lurus API 调用，搭一个能记住用户的客服。</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="/tutorials/lumen-kova-langgraph">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">可观测性</div>
    <p class="lurus-card__body">用 Lumen 替换 LangGraph 默认 Checkpointer，部署到 Kova，对比崩溃恢复效果。</p>
  </a>
  <a class="lurus-card lurus-card--lucrum" href="/tutorials/lucrum-strategy-workflow">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title">量化闭环</div>
    <p class="lurus-card__body">自然语言描述策略 → AI 生成 vnpy 代码 → 回测 → 优化 → 策略市场上架。</p>
  </a>
  <a class="lurus-card lurus-card--switch" href="/tutorials/switch-mcp-team">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">团队工具统一</div>
    <p class="lurus-card__body">Switch 把团队 AI CLI 的 MCP 配置、模型 Key、成本看板收敛成一份中央配置。</p>
  </a>
</div>

## <Icon name="workflow" :size="20" /> 建议路径

<ol class="lurus-steps">
<li>

先看各单产品的快速开始（从 [Lurus API](/guide/quickstart) 起步）

</li>
<li>

再看本板块一个贴近业务的跨产品教程

</li>
<li>

最后按 [迁移指南](/migrations/) 替换你现有的栈

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">组合即复利</p>
    <div class="lurus-callout__body"><p>每个教程都只引用各产品文档里已有的能力。先单产品跑通，再按教程把它们接起来——账号、计费、模型在同一个池里，不必重复接入。</p></div>
  </div>
</div>

## 下一步

<NextSteps :steps="[
  { text: '记忆 Agent', link: '/tutorials/memory-agent', primary: true },
  { text: '迁移指南', link: '/migrations/' },
  { text: '企业方案', link: '/solutions/' },
]" />

</div>
