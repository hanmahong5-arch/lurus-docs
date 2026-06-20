---
title: "Forge — Roadmap & Beta Application"
description: "Current beta capabilities, the planned Dependency Guardian / Agent visualization / knowledge base, and how to apply for the beta."
---

<div class="forge-rm-page">

# Forge Roadmap <StatusBadge status="beta" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="check-circle" :size="14" /> Shipped</span>
  <h2 class="lurus-section-head__title">Current Beta Capabilities</h2>
</div>

| Capability | Status | Summary |
|------|------|------|
| Ontology visualization tree | <StatusBadge status="beta" /> | Collapsible tree + node cards |
| PM/Architect/Code Session | <StatusBadge status="beta" /> | Three types of Agent conversational collaboration |
| WAL decision replay | <StatusBadge status="beta" /> | Powered by the Kova engine |
| PR automation | <StatusBadge status="dev" /> | Code Agent opens PRs directly |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="compass" :size="14" /> Planned</span>
  <h2 class="lurus-section-head__title">What's Coming Next</h2>
</div>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Dependency Guardian <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">Interface change detection across Epics / Stories: when an API contract is modified, automatically locate every affected Session and PR.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="workflow" :size="20" /></span>
    <div class="lurus-card__title">Agent visualization <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">An Agent's reasoning process, tool calls, and intermediate results within a Session are displayed as a <strong>visual timeline</strong> rather than plain-text logs.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">Knowledge base <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">Integrate <a href="/en/memx/">MemX</a> into Forge as a long-term memory layer for Agents to retrieve historical decisions / specifications / lessons learned during a Session.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="history" :size="14" /> Timeline</span>
  <h2 class="lurus-section-head__title">Recent Milestones</h2>
</div>

<ol class="lurus-steps">
<li>

**2026 Q2** — PR automation GA

</li>
<li>

**2026 Q3** — Dependency Guardian beta

</li>
<li>

**2026 Q4** — Agent visualization beta

</li>
<li>

**2027 Q1** — Knowledge base beta (deep MemX integration)

</li>
</ol>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="mail" :size="14" /> Beta Application</span>
  <h2 class="lurus-section-head__title">Invite-Only Beta Channel</h2>
</div>

Forge is currently positioned as an **internal R&D tool** for Lurus, **not a commercial product sold to the public**.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="mail" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">How to apply</p>
    <div class="lurus-callout__body">Email <code>business@lurus.cn</code> (subject line: "Forge Beta Application"), describing your team size, your current requirements-management tooling, and the pain points you hope to solve.</div>
  </div>
</div>

---

## Related Products

<RelatedProducts product-id="forge" />

</div>
