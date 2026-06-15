---
title: Forge — 路线图与内测申请
description: 当前 beta 能力、计划中的 Dependency Guardian / Agent 可视化 / 知识库，以及内测申请方式。
---

<div class="forge-rm-page">

# Forge 路线图 <StatusBadge status="beta" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="check-circle" :size="14" /> 已上线</span>
  <h2 class="lurus-section-head__title">当前 Beta 能力</h2>
</div>

| 能力 | 状态 | 简述 |
|------|------|------|
| Ontology 可视化树 | <StatusBadge status="beta" /> | 可折叠树 + 节点卡片 |
| PM/Architect/Code Session | <StatusBadge status="beta" /> | 三类 Agent 对话协作 |
| WAL 决策回溯 | <StatusBadge status="beta" /> | 依赖 Kova 引擎 |
| PR 自动化 | <StatusBadge status="dev" /> | Code Agent 直接开 PR |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="compass" :size="14" /> 规划中</span>
  <h2 class="lurus-section-head__title">接下来要做的事</h2>
</div>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Dependency Guardian <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">跨 Epic / Story 的接口变更检测：一个 API 契约修改时，自动定位所有受影响的 Session 与 PR。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="workflow" :size="20" /></span>
    <div class="lurus-card__title">Agent 可视化 <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">Session 里 Agent 的思考过程、工具调用、中间结果以<strong>可视化时间线</strong>展示，而非纯文本 log。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">知识库 <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">将 <a href="/memx/">MemX</a> 接入 Forge，作为 Agent 在 Session 中检索历史决策 / 规范 / 踩坑记录的长期记忆层。</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="history" :size="14" /> 时间线</span>
  <h2 class="lurus-section-head__title">近期里程碑</h2>
</div>

<ol class="lurus-steps">
<li>

**2026 Q2** — PR 自动化 GA

</li>
<li>

**2026 Q3** — Dependency Guardian beta

</li>
<li>

**2026 Q4** — Agent 可视化 beta

</li>
<li>

**2027 Q1** — 知识库 beta（MemX 深度集成）

</li>
</ol>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="mail" :size="14" /> 内测申请</span>
  <h2 class="lurus-section-head__title">受邀内测通道</h2>
</div>

Forge 当前定位为 Lurus **内部 R&D 工具**，**不是对外售卖的商业产品**。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="mail" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">如何申请</p>
    <div class="lurus-callout__body">邮件 <code>business@lurus.cn</code>（主题注明"Forge 内测申请"），说明团队规模、当前需求管理工具、期望解决的痛点。</div>
  </div>
</div>

---

## 相关产品

<RelatedProducts product-id="forge" />

</div>
