---
title: 开发工具行业方案
description: Kova + Switch + Lumen — 面向开发者工具公司和基础设施团队。
---

<div class="devtools-page">

# 开发工具行业方案

<MetricStats :items="[
  { label: '统一管理 CLI', value: '5 款', hint: 'Switch' },
  { label: '网关模型', value: '50+' },
  { label: 'Agent 恢复', value: '3μs', hint: '断点续跑' },
  { label: '接入组件', value: '4 个', hint: 'Kova · MemX · API · Lumen' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 适用对象</span>
  <h2 class="lurus-section-head__title">谁在用</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">AI 编程工具公司</div>
    <p class="lurus-card__body">构建自家 AI 编程产品。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
    <div class="lurus-card__title">Platform / DevX 团队</div>
    <p class="lurus-card__body">企业内部开发者体验。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="terminal" :size="20" /></span>
    <div class="lurus-card__title">独立开发者 / 小工作室</div>
    <p class="lurus-card__body">轻量起步，按需扩展。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="graduation-cap" :size="20" /></span>
    <div class="lurus-card__title">科研机构</div>
    <p class="lurus-card__body">实验性 Agent 工作流。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 核心组件</span>
  <h2 class="lurus-section-head__title">产品组合</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="kova"   :actions="[{label:'Kova',   href:'/kova/',   primary:true}]" />
  <ActionCard product-id="switch" :actions="[{label:'Switch', href:'/switch/', primary:true}]" />
  <ActionCard product-id="lumen"  :actions="[{label:'Lumen',  href:'/lumen/',  primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="puzzle" :size="14" /> 典型组合</span>
  <h2 class="lurus-section-head__title">两套落地组合</h2>
</div>

### 场景 A：构建自家 AI 编程工具

<ArchitectureDiagram title="构建自家 AI 编程工具" chart="graph TB; Kova[Kova<br/>持久执行 · 崩溃恢复] --> MemX[MemX<br/>记住用户偏好 / 项目规范]; MemX --> API[Lurus API<br/>50+ 模型即插即用]; API --> Lumen[Lumen<br/>发布后观测 + Replay 调试]; Lumen --> Auth[Auth<br/>全员 SSO + Passkey]" />

### 场景 B：优化内部开发者 ROI

<ArchitectureDiagram title="优化内部开发者 ROI" chart="graph TB; Switch[Switch<br/>统一管理团队 5 款 CLI] --> Lumen[Lumen<br/>每人每天 Token 消费一图说清]; Lumen --> ArgoCD[ArgoCD<br/>配置 Git 同步]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="trending-up" :size="14" /> 收益</span>
  <h2 class="lurus-section-head__title">典型收益</h2>
</div>

| 指标 | Before | After |
|------|--------|-------|
| AI 工具配置分散 | 5 份 JSON | **1 份 yaml** |
| 每月 Token 成本 | 不可见 | **仪表盘 + 告警** |
| Agent 崩溃恢复 | 重启从头 | **3μs 断点续跑** |
| 上线周期 | 周级 | **天级** |

## 下一步

<NextSteps :steps="[
  { text: 'Kova 快速开始', link: '/kova/quickstart', primary: true },
  { text: 'Switch 配置', link: '/switch/configuration' },
  { text: 'Lumen 快速开始', link: '/lumen/quickstart' },
]" />

</div>
