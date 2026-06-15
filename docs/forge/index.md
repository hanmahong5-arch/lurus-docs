---
title: Forge — AI 产品开发工作台
description: Web 端 AI 产品协作开发平台，支持团队协同构建 AI 应用。
---

<div class="forge-page">

<ProductHero product-id="forge" />

::: warning 内部研发平台（非商业 SaaS）
Forge 当前定位为 Lurus **内部 R&D 工具**（ontology 驱动的需求管理 + API Gateway demo），**不是对外售卖的商业产品**。仅受邀内测，API 仍在演进中。如需了解或合作，请联系 [business@lurus.cn](mailto:business@lurus.cn)。
:::

## 什么是 Forge？

**Lurus Forge** 是面向 AI 产品团队的开发工作台，核心哲学是"**一切皆对话**"——产品需求通过 Session 对话讨论，功能通过 AI Agent (PM/Architect/Code) 实现，知识通过产品本体论 (Ontology) 可视化。

底层通过 [Kova 引擎](/kova/) 实现 Agent 任务的 WAL 持久化，即使执行中断也能无缝恢复。

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="network" :size="22" /></span>
    <div class="lurus-card__title">Ontology 本体论</div>
    <p class="lurus-card__body">树状结构管理产品的用户故事、架构、技术栈、设计规范——静态的结构化知识。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="22" /></span>
    <div class="lurus-card__title">Session 对话驱动</div>
    <p class="lurus-card__body">每次产品讨论装进一个 Session——动态的时间线，承载对话、决策、Agent 产出。</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> 核心能力</span>
  <h2 class="lurus-section-head__title">从需求到 PR，都在一份可视结构里</h2>
  <p class="lurus-section-head__lede">已上线能力与规划中能力并列展示，状态标签如实标注。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-forge)"
  :items="[
    { title: '产品本体论 (Ontology)', body: '树状管理用户故事 / 架构 / 技术栈 / 设计规范，所有维度并列可视化；对话中的决策自动更新到 Ontology。', icon: 'network' },
    { title: '对话驱动开发', body: '问 “这个功能的用户故事是什么？” → PM Agent 分析生成。每个决策关联对话上下文，可回溯当初为何这么定。', icon: 'messages-square' },
    { title: 'WAL 决策回溯', body: '基于 Kova 引擎的 WAL，每一步对话与决策持久化，可回溯、可定位、可 Replay 复盘。', icon: 'history' },
  ]"
/>

### 规划中 / 开发中能力

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Dependency Guardian <Badge text="计划中" type="warning" /></div>
    <p class="lurus-card__body">超越 Renovate/Dependabot 的三层依赖管理：Patch 自动合并（零人工）；Minor 审批卡片一键决策；Major 对话式评审（AI 分析 breaking change 对业务的语义影响）。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="workflow" :size="20" /></span>
    <div class="lurus-card__title">Agent 可视化构建 <Badge text="开发中" type="tip" /></div>
    <p class="lurus-card__body">拖拽式三段构建：触发条件 Trigger（Webhook / 定时 / API 请求）→ AI 处理 Process（LLM 调用 / RAG 检索 / 工具调用）→ 输出动作 Action（API 回调 / 邮件通知 / 数据库写入）。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="database-backup" :size="20" /></span>
    <div class="lurus-card__title">知识库管理 <Badge text="开发中" type="tip" /></div>
    <p class="lurus-card__body">RAG 知识库：文档导入（PDF/Word/Markdown/网页）、自动分块（保持语义完整）、向量索引（自动嵌入支持语义搜索）、更新同步（文档更新自动重新索引）。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">监控与分析 <Badge text="开发中" type="tip" /></div>
    <p class="lurus-card__body">调用统计（量 / 延迟 / Token）、质量评分（用户反馈 + 自动评估）、成本分析（按功能 / 时间）、告警（异常调用量或质量下降自动通知）。</p>
  </div>
</div>

### Prompt 工程工作台

| 功能 | 说明 |
|------|------|
| **Prompt 编辑器** | 语法高亮、变量插入、版本管理 |
| **A/B 测试** | 同一输入对比不同 Prompt 输出质量 |
| **模型对比** | 同一 Prompt 在不同模型上的效果对比 |
| **批量测试** | 导入测试集批量评估 |
| **版本历史** | 每次修改自动保存版本，随时回滚 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 适用场景</span>
  <h2 class="lurus-section-head__title">团队在 Forge 上做什么</h2>
</div>

<UserScenarios
  :scenarios="[
    { role: 'AI 客服', title: '可视化构建客服 Agent', summary: '管理知识库，监控服务质量', link: '/forge/sessions' },
    { role: '内容审核', title: '拖拽搭建审核流程', summary: '设定规则，持续优化', link: '/forge/sessions' },
    { role: '智能推荐', title: '配置推荐 Agent', summary: 'A/B 测试不同策略', link: '/forge/sessions' },
    { role: '文档 QA', title: '导入文档建立知识库', summary: '部署问答 Agent', link: '/forge/ontology' },
  ]"
/>

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | TypeScript + React (Turbo monorepo) |
| AI 引擎 | [Lurus API](/guide/introduction)（多模型支持）|
| Agent 运行 | [Kova](/kova/)（持久化执行）|
| 向量存储 | Qdrant / Chroma |
| 部署 | Kubernetes (ArgoCD) |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="mail" :size="14" /> 内测申请</span>
  <h2 class="lurus-section-head__title">受邀内测中</h2>
</div>

Forge 目前处于受邀内测阶段。适合以下团队：

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <p class="lurus-card__body">正在或计划在产品中集成 AI 功能</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="pen-tool" :size="20" /></span>
    <p class="lurus-card__body">需要可视化的 Prompt 管理和测试工具</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <p class="lurus-card__body">希望降低 AI 功能的开发和运维成本</p>
  </div>
</div>

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">申请内测资格</p>
    <p class="lurus-cta__text">请联系 business@lurus.cn，注明团队规模与期望解决的痛点。</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="mailto:business@lurus.cn">发邮件申请 →</a>
  </div>
</div>

## 更多资源

- [Lurus API](/guide/introduction) — 了解底层 AI 能力
- [Kova](/kova/) — Agent 持久化执行引擎
- [MemX](/memx/) — AI 智能记忆管理
- [统一身份认证](/platform/auth/) — Forge 登录 / 团队权限 / SSO 联邦均基于此

<!-- lurus:related-block -->

---

## 相关产品与下一步

<RelatedProducts product-id="forge" />

</div>
