---
title: 跨产品教程中心
description: 把多个 Lurus 产品串起来的端到端教程，按角色分组。
---

# 跨产品教程中心

单个产品的快速开始在各自文档里。**这里是跨产品组合案例**——把 MemX + Kova + API、Lumen + LangGraph 等组合起来解决真实工程问题。

## 按角色

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

## 按主题

- **记忆 + Agent**：[记忆 Agent](/tutorials/memory-agent) — MemX + Kova + API
- **可观测性**：[Lumen × LangGraph × Kova](/tutorials/lumen-kova-langgraph)
- **量化闭环**：[Lucrum 策略完整流](/tutorials/lucrum-strategy-workflow)

## 建议路径

1. 先看各单产品的快速开始（从 [Lurus API](/guide/quickstart) 起步）
2. 再看本板块一个贴近业务的跨产品教程
3. 最后按 [迁移指南](/migrations/) 替换你现有的栈

## 下一步

<NextSteps :steps="[
  { text: '记忆 Agent', link: '/tutorials/memory-agent', primary: true },
  { text: '迁移指南', link: '/migrations/' },
  { text: '企业方案', link: '/solutions/' },
]" />
