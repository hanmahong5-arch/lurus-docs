---
title: 企业方案总览
description: 按行业和角色入口分类 Lurus 企业级能力。
---

# 企业方案

专为决策者 / 采购 / 架构评审 / 合规准备的入口。

## 按角色

<div class="action-grid">
  <ActionCard
    name="CTO / 架构评审"
    tagline="Why Lurus · 部署形态 · TCO · 性能基准"
    icon="compass"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: '为什么选择 Lurus', href: '/solutions/why-lurus', primary: true },
      { label: '企业部署形态', href: '/solutions/enterprise-deploy' },
    ]"
  />
  <ActionCard
    name="CISO / 合规"
    tagline="SSO 联邦 · 国密 SM4-GCM · 审计日志 · 数据主权"
    icon="shield-check"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: '身份与合规', href: '/platform/auth/', primary: true },
      { label: '部署形态矩阵', href: '/solutions/enterprise-deploy' },
    ]"
  />
  <ActionCard
    name="PMO / 采购"
    tagline="鹿贝单位计费 · 一张发票 · 私有化授权"
    icon="receipt"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: '计费详解', href: '/platform/billing', primary: true },
      { label: '联系商务', href: 'mailto:business@lurus.cn', external: true },
    ]"
  />
</div>

## 按行业

<div class="action-grid">
  <ActionCard
    name="金融"
    tagline="Lucrum + Auth + 合规审计"
    icon="landmark"
    color="var(--lurus-color-lucrum)"
    :actions="[
      { label: '金融行业方案', href: '/solutions/industry-finance', primary: true },
    ]"
  />
  <ActionCard
    name="内容"
    tagline="Creator + API + 批量文案生产"
    icon="pen-tool"
    color="var(--lurus-color-creator)"
    :actions="[
      { label: '内容行业方案', href: '/solutions/industry-content', primary: true },
    ]"
  />
  <ActionCard
    name="开发工具"
    tagline="Kova + Switch + Lumen 开发者闭环"
    icon="terminal"
    color="var(--lurus-color-switch)"
    :actions="[
      { label: '开发工具方案', href: '/solutions/industry-devtools', primary: true },
    ]"
  />
  <ActionCard
    name="企业 AI 中台"
    tagline="Auth + API + MemX + Kova + Lumen 五层闭环"
    icon="layers"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'AI 中台方案', href: '/solutions/ai-midware', primary: true },
    ]"
  />
</div>

## 下一步

<NextSteps :steps="[
  { text: '为什么选择 Lurus', link: '/solutions/why-lurus', primary: true },
  { text: '联系商务', link: 'mailto:business@lurus.cn', external: true },
]" />
