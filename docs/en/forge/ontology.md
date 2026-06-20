---
title: "Forge — Ontology"
description: "Manage a product's user stories, architecture, tech stack, and design specs in a tree structure."
---

<div class="forge-ont-page">

# Ontology <StatusBadge status="beta" />

Ontology is Forge's first core data model. It captures all of a product's "knowledge" in a tree structure, letting AI Agents and humans collaborate on the same visible structure. It merges scattered user stories (Jira/Feishu/chat), disconnected architecture and implementation, undocumented tech-stack changes, and divergent design specs into a single **traceable, reviewable, Agent-writable** knowledge tree.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="network" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">In one sentence</p>
    <div class="lurus-callout__body">Ontology is <strong>static</strong> structured knowledge; a <a href="/en/forge/sessions">Session</a> is a <strong>dynamic</strong> timeline. Decisions made within a Session write to / modify Ontology nodes.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Data model</span>
  <h2 class="lurus-section-head__title">Node types</h2>
  <p class="lurus-section-head__lede">Six node types describe different dimensions of product knowledge in parallel.</p>
</div>

| Type | Meaning | Typical leaf |
|------|------|---------|
| `UserStory` | User story | "As an X, I want Y so that Z" |
| `Architecture` | Architecture decision | "Adopt event-driven, because…" |
| `TechStack` | Tech stack | "Backend Go + Gin + PG" |
| `DesignSpec` | Design spec | "Button radius 8px, primary color #C67B5C" |
| `Decision` | One-off decision | "Drop Redis Streams, switch to NATS" |
| `Risk` | Risk item | "Third-party API 429 rate limiting" |

## Tree structure

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
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> Collaboration</span>
  <h2 class="lurus-section-head__title">Agent auto-write · Visualization · Export</h2>
</div>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Agent auto-write</div>
    <p class="lurus-card__body">When a PM Agent generates a user story in a <a href="/en/forge/sessions">Session</a>, the node is automatically created in Ontology; when an Architect Agent makes an architecture decision, it writes to the <code>Architecture</code> subtree and links the corresponding Story.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Visualization</div>
    <p class="lurus-card__body">The web frontend renders a collapsible tree plus node cards. Each node carries: creator (human / Agent), linked Session, revision history, and status (draft / under review / finalized).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="import" :size="20" /></span>
    <div class="lurus-card__title">Export</div>
    <p class="lurus-card__body">Export the whole tree as JSON, or as GraphML to import into yEd / Gephi for graph analysis (see the commands below).</p>
  </div>
</div>

### Export commands

```bash
forge export --ontology json     # 整棵树 → JSON
forge export --ontology graphml  # 可导入 yEd / Gephi
```

---

## Next steps

<NextSteps :steps="[
  { text: 'Session workflow', link: '/en/forge/sessions', primary: true },
  { text: 'Roadmap', link: '/en/forge/roadmap' },
  { text: 'Back to Forge overview', link: '/en/forge/' },
]" />

</div>
