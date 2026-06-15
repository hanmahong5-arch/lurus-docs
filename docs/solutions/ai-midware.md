---
title: 企业 AI 中台方案
description: 五层闭环 — Auth · API · MemX · Kova · Lumen，给企业构建自己的 AI 中台。
---

<div class="midware-page">

# 企业 AI 中台方案

<MetricStats :items="[
  { label: '能力层', value: '5 层', hint: '独立可用 · 组合闭环' },
  { label: '网关模型', value: '50+' },
  { label: 'Kova 恢复', value: '微秒级', hint: 'WAL 断点续跑' },
  { label: '落地路径', value: '10 周', hint: '参考' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 架构</span>
  <h2 class="lurus-section-head__title">五层闭环</h2>
  <p class="lurus-section-head__lede">自顶向下——每层独立可用，组合起来闭环价值更高。</p>
</div>

<ArchitectureDiagram title="AI 中台五层闭环" chart="graph TB; App[业务应用层<br/>客服 · 知识库 · 报表 · 开发者工具] --> Lumen[Lumen 可观测性<br/>Trace / Replay / Cost]; Lumen --> Kova[Kova Agent 执行引擎<br/>WAL / Checkpoint]; Kova --> MemX[MemX 智能记忆<br/>蒸馏 / 去重 / 衰退 / 检索]; MemX --> API[Lurus API 统一网关<br/>50+ 模型 / 计量 / 限流]; API --> Auth[Lurus Auth 统一身份<br/>SSO · MFA · OIDC · 联邦]" />

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen — 可观测性</div>
    <p class="lurus-card__body">Trace / Replay / Cost。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova — Agent 执行引擎</div>
    <p class="lurus-card__body">WAL / Checkpoint，崩溃断点续跑。</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">MemX — 智能记忆</div>
    <p class="lurus-card__body">蒸馏 / 去重 / 衰退 / 检索。</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Lurus API — LLM 统一网关</div>
    <p class="lurus-card__body">50+ 模型 / 计量 / 限流。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Lurus Auth — 统一身份</div>
    <p class="lurus-card__body">SSO · MFA · OIDC · 联邦。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> 价值对比</span>
  <h2 class="lurus-section-head__title">独立开箱 vs 五层协同</h2>
</div>

| 维度 | 独立使用 | 五层协同 |
|------|---------|---------|
| 身份 | 各自实现 | **SSO 一次** |
| 成本统计 | 自己扛 | **Lumen + API 自动关联** |
| 崩溃恢复 | 手动加 | **Kova WAL 兜底** |
| 知识沉淀 | 分散 | **MemX 统一蒸馏** |
| 合规 | 逐个评估 | **一套合规覆盖** |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package" :size="14" /> 交付</span>
  <h2 class="lurus-section-head__title">典型交付</h2>
</div>

| 形态 | 说明 | 周期 |
|------|------|------|
| SaaS | 立即可用 | 0 |
| 私有化 | 镜像部署到企业 K8s | 2-4 周 |
| 托管运维 | Lurus 值班，企业内网 | 议定 |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 路线图</span>
  <h2 class="lurus-section-head__title">参考落地路径</h2>
  <p class="lurus-section-head__lede">10 周分阶段接入，每两周交付一层，可独立验证。</p>
</div>

<ol class="lurus-steps">
  <li><strong>W1-2</strong>：接 <a href="/guide/introduction">Lurus API</a> 替换现有 LLM 调用</li>
  <li><strong>W3-4</strong>：接 <a href="/platform/auth/">Auth</a> 实现 SSO</li>
  <li><strong>W5-6</strong>：用 <a href="/memx/">MemX</a> 沉淀业务知识</li>
  <li><strong>W7-8</strong>：把核心 Agent 迁到 <a href="/kova/">Kova</a></li>
  <li><strong>W9-10</strong>：全链路接入 <a href="/lumen/">Lumen</a> 可观测</li>
</ol>

## 下一步

<NextSteps :steps="[
  { text: '为什么选择 Lurus', link: '/solutions/why-lurus', primary: true },
  { text: '企业部署形态', link: '/solutions/enterprise-deploy' },
  { text: '联系商务', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
