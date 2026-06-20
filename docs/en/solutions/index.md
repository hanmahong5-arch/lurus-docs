---
title: "Enterprise Solutions Overview"
description: "Lurus enterprise capabilities organized by industry and role-based entry points."
---

<div class="solutions-hub">

# Enterprise Solutions

Entry points built for decision-makers, procurement, architecture review, and compliance readiness.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">50+</span><span class="lurus-stat__label">Models supported</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">Deployment models</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">SM4-GCM</span><span class="lurus-stat__label">SM-cipher encryption</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1</span><span class="lurus-stat__label">Unified invoice</span></div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> By role</span>
  <h2 class="lurus-section-head__title">Find your entry point</h2>
  <p class="lurus-section-head__lede">CTOs look at architecture and TCO, CISOs at compliance boundaries, PMOs at billing and licensing.</p>
</div>

<div class="action-grid">
  <ActionCard
    name="CTO / Architecture Review"
    tagline="Why Lurus · Deployment models · TCO · Performance benchmarks"
    icon="compass"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: 'Why Lurus', href: '/en/solutions/why-lurus', primary: true },
      { label: 'Enterprise Deployment Models', href: '/en/solutions/enterprise-deploy' },
    ]"
  />
  <ActionCard
    name="CISO / Compliance"
    tagline="SSO federation · SM4-GCM · Audit logs · Data sovereignty"
    icon="shield-check"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'Identity & Compliance', href: '/en/platform/auth/', primary: true },
      { label: 'Deployment Model Matrix', href: '/en/solutions/enterprise-deploy' },
    ]"
  />
  <ActionCard
    name="PMO / Procurement"
    tagline="Lubei unit billing · Single invoice · On-premise licensing"
    icon="receipt"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: 'Billing Explained', href: '/en/platform/billing', primary: true },
      { label: 'Contact Sales', href: 'mailto:business@lurus.cn', external: true },
    ]"
  />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> By industry</span>
  <h2 class="lurus-section-head__title">Industry Solution Bundles</h2>
  <p class="lurus-section-head__lede">A proven product bundle for each industry, ready to deploy.</p>
</div>

<div class="action-grid">
  <ActionCard
    name="Finance"
    tagline="Lucrum + Auth + Compliance audit"
    icon="landmark"
    color="var(--lurus-color-lucrum)"
    :actions="[
      { label: 'Finance Industry Solution', href: '/en/solutions/industry-finance', primary: true },
    ]"
  />
  <ActionCard
    name="Content"
    tagline="Creator + API + Bulk copy production"
    icon="pen-tool"
    color="var(--lurus-color-creator)"
    :actions="[
      { label: 'Content Industry Solution', href: '/en/solutions/industry-content', primary: true },
    ]"
  />
  <ActionCard
    name="Developer Tools"
    tagline="Kova + Switch + Lumen developer loop"
    icon="terminal"
    color="var(--lurus-color-switch)"
    :actions="[
      { label: 'Developer Tools Solution', href: '/en/solutions/industry-devtools', primary: true },
    ]"
  />
  <ActionCard
    name="Enterprise AI Platform"
    tagline="Auth + API + MemX + Kova + Lumen five-layer loop"
    icon="layers"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'AI Platform Solution', href: '/en/solutions/ai-midware', primary: true },
    ]"
  />
</div>

## Next Steps

<NextSteps :steps="[
  { text: 'Why Lurus', link: '/en/solutions/why-lurus', primary: true },
  { text: 'Contact Sales', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>

<style scoped>
.solutions-hub .lurus-stat-strip { margin: 20px 0 8px; }
</style>
