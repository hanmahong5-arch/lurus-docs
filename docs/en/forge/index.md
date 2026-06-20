---
title: "Forge — AI Product Development Workbench"
description: "A web-based AI product collaboration platform that lets teams build AI applications together."
---

<div class="forge-page">

<ProductHero product-id="forge" />

::: warning Internal R&D Platform (Not a Commercial SaaS)
Forge is currently positioned as a Lurus **internal R&D tool** (ontology-driven requirements management + API Gateway demo) — it is **not a commercial product offered for sale**. Access is invite-only beta, and the API is still evolving. For questions or partnership inquiries, contact [business@lurus.cn](mailto:business@lurus.cn).
:::

## What Is Forge?

**Lurus Forge** is a development workbench for AI product teams, built on the core philosophy that "**everything is a conversation**" — product requirements are discussed through Session conversations, features are implemented by AI Agents (PM/Architect/Code), and knowledge is visualized through a product Ontology.

Under the hood, the [Kova engine](/en/kova/) provides WAL persistence for Agent tasks, so work resumes seamlessly even if execution is interrupted.

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="network" :size="22" /></span>
    <div class="lurus-card__title">Ontology</div>
    <p class="lurus-card__body">A tree structure that organizes a product's user stories, architecture, tech stack, and design specs — static, structured knowledge.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="22" /></span>
    <div class="lurus-card__title">Session-Driven Conversations</div>
    <p class="lurus-card__body">Each product discussion is packed into a Session — a dynamic timeline carrying conversations, decisions, and Agent output.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Core Capabilities</span>
  <h2 class="lurus-section-head__title">From Requirements to PR, All in One Visual Structure</h2>
  <p class="lurus-section-head__lede">Shipped and planned capabilities are shown side by side, with status labels marked honestly.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-forge)"
  :items="[
    { title: 'Product Ontology', body: 'Tree-based management of user stories / architecture / tech stack / design specs, with every dimension visualized side by side; decisions made in conversation automatically update the Ontology.', icon: 'network' },
    { title: 'Conversation-Driven Development', body: 'Ask “What is the user story for this feature?” → the PM Agent analyzes and generates it. Every decision is linked to its conversation context, so you can trace back why it was decided that way.', icon: 'messages-square' },
    { title: 'WAL Decision Replay', body: 'Built on the Kova engine WAL, every conversation step and decision is persisted — traceable, locatable, and ready for replay-based review.', icon: 'history' },
  ]"
/>

### Planned / In-Development Capabilities

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Dependency Guardian <Badge text="Planned" type="warning" /></div>
    <p class="lurus-card__body">Three-tier dependency management that goes beyond Renovate/Dependabot: Patch auto-merges (zero manual work); Minor offers one-click approval cards; Major triggers a conversational review (the AI analyzes the semantic business impact of breaking changes).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="workflow" :size="20" /></span>
    <div class="lurus-card__title">Visual Agent Builder <Badge text="In Development" type="tip" /></div>
    <p class="lurus-card__body">Drag-and-drop three-stage builder: Trigger (Webhook / schedule / API request) → Process (LLM call / RAG retrieval / tool call) → Action (API callback / email notification / database write).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="database-backup" :size="20" /></span>
    <div class="lurus-card__title">Knowledge Base Management <Badge text="In Development" type="tip" /></div>
    <p class="lurus-card__body">RAG knowledge base: document import (PDF/Word/Markdown/web pages), automatic chunking (preserving semantic integrity), vector indexing (automatic embeddings for semantic search), and update sync (automatic re-indexing when documents change).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">Monitoring & Analytics <Badge text="In Development" type="tip" /></div>
    <p class="lurus-card__body">Call statistics (volume / latency / tokens), quality scoring (user feedback + automated evaluation), cost analysis (by feature / time), and alerts (automatic notification on abnormal call volume or quality drops).</p>
  </div>
</div>

### Prompt Engineering Workbench

| Feature | Description |
|------|------|
| **Prompt Editor** | Syntax highlighting, variable insertion, version management |
| **A/B Testing** | Compare output quality of different prompts for the same input |
| **Model Comparison** | Compare how the same prompt performs across different models |
| **Batch Testing** | Import a test set and evaluate in bulk |
| **Version History** | Every edit is saved as a version automatically, with rollback anytime |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Use Cases</span>
  <h2 class="lurus-section-head__title">What Teams Do on Forge</h2>
</div>

<UserScenarios
  :scenarios="[
    { role: 'AI Support', title: 'Visually Build a Support Agent', summary: 'Manage the knowledge base, monitor service quality', link: '/en/forge/sessions' },
    { role: 'Content Moderation', title: 'Drag-and-Drop Moderation Flows', summary: 'Set rules, keep optimizing', link: '/en/forge/sessions' },
    { role: 'Recommendations', title: 'Configure a Recommendation Agent', summary: 'A/B test different strategies', link: '/en/forge/sessions' },
    { role: 'Document QA', title: 'Import Docs to Build a Knowledge Base', summary: 'Deploy a Q&A Agent', link: '/en/forge/ontology' },
  ]"
/>

---

## Tech Stack

| Layer | Technology |
|------|------|
| Frontend | TypeScript + React (Turbo monorepo) |
| AI Engine | [Lurus API](/en/guide/introduction) (multi-model support) |
| Agent Runtime | [Kova](/en/kova/) (persistent execution) |
| Vector Store | Qdrant / Chroma |
| Deployment | Kubernetes (ArgoCD) |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="mail" :size="14" /> Beta Application</span>
  <h2 class="lurus-section-head__title">Invite-Only Beta</h2>
</div>

Forge is currently in invite-only beta. It's a good fit for teams that:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <p class="lurus-card__body">Are integrating, or plan to integrate, AI features into their product</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="pen-tool" :size="20" /></span>
    <p class="lurus-card__body">Need visual prompt management and testing tools</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <p class="lurus-card__body">Want to lower the development and operations cost of AI features</p>
  </div>
</div>

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">Apply for Beta Access</p>
    <p class="lurus-cta__text">Email business@lurus.cn, noting your team size and the pain points you hope to solve.</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="mailto:business@lurus.cn">Send an Email →</a>
  </div>
</div>

## More Resources

- [Lurus API](/en/guide/introduction) — Learn about the underlying AI capabilities
- [Kova](/en/kova/) — The persistent Agent execution engine
- [MemX](/en/memx/) — AI intelligent memory management
- [Unified Authentication](/en/platform/auth/) — Forge login / team permissions / SSO federation are all built on this

<!-- lurus:related-block -->

---

## Related Products & Next Steps

<RelatedProducts product-id="forge" />

</div>
