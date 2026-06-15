---
title: Forge — Ontology 本体论
description: 用树状结构管理产品的用户故事、架构、技术栈与设计规范。
---

<div class="forge-ont-page">

# Ontology 本体论 <StatusBadge status="beta" />

Ontology 是 Forge 的第一核心数据模型，用树状结构刻画产品全部"知识"，让 AI Agent 与人类在同一份可视结构上协作。它把散落的用户故事（Jira/飞书/聊天）、分离的架构与实现、无记录的技术栈调整、各执一份的设计规范，合并为一棵**可追溯、可回溯、Agent 可写入**的知识树。

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="network" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">一句话定位</p>
    <div class="lurus-callout__body">Ontology 是<strong>静态</strong>的结构化知识；<a href="/forge/sessions">Session</a> 是<strong>动态</strong>的时间线。Session 中的决策写入 / 修改 Ontology 节点。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 数据模型</span>
  <h2 class="lurus-section-head__title">节点类型</h2>
  <p class="lurus-section-head__lede">六类节点并列描述产品知识的不同维度。</p>
</div>

| 类型 | 含义 | 典型叶子 |
|------|------|---------|
| `UserStory` | 用户故事 | "作为 X 我想 Y 以便 Z" |
| `Architecture` | 架构决策 | "采用事件驱动，原因…" |
| `TechStack` | 技术栈 | "后端 Go + Gin + PG" |
| `DesignSpec` | 设计规范 | "按钮圆角 8px，主色 #C67B5C" |
| `Decision` | 一次性决策 | "淘汰 Redis Streams，改 NATS" |
| `Risk` | 风险项 | "第三方 API 429 限流" |

## 树结构

```
产品: Lurus Forge
├─ UserStory
│  ├─ PM 创建需求
│  ├─ Architect 设计方案
│  └─ Dev 实现并提 PR
├─ Architecture
│  ├─ Ontology + Session 双核心
│  └─ WAL 决策回溯（依赖 Kova）
├─ TechStack
│  ├─ Elixir/Phoenix + LiveView
│  └─ PostgreSQL + ltree
└─ DesignSpec
   └─ Lurus 铜棕视觉系统
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> 协作方式</span>
  <h2 class="lurus-section-head__title">Agent 自动写入 · 可视化 · 导出</h2>
</div>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Agent 自动写入</div>
    <p class="lurus-card__body">PM Agent 在 <a href="/forge/sessions">Session</a> 中生成用户故事时节点自动建入 Ontology；Architect Agent 做架构决策时写入 <code>Architecture</code> 子树并关联对应 Story。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">可视化</div>
    <p class="lurus-card__body">Web 前端用可折叠树 + 节点卡片展示，每节点带：创建者（人 / Agent）、关联 Session、历次修订、状态（草案 / 评审中 / 已定案）。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="import" :size="20" /></span>
    <div class="lurus-card__title">导出</div>
    <p class="lurus-card__body">整棵树导出为 JSON，或 GraphML 导入 yEd / Gephi 做图分析（见下方命令）。</p>
  </div>
</div>

### 导出命令

```bash
forge export --ontology json     # 整棵树 → JSON
forge export --ontology graphml  # 可导入 yEd / Gephi
```

---

## 下一步

<NextSteps :steps="[
  { text: 'Session 工作流', link: '/forge/sessions', primary: true },
  { text: '路线图', link: '/forge/roadmap' },
  { text: '回到 Forge 简介', link: '/forge/' },
]" />

</div>
