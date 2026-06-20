---
title: "Enterprise Deployment Models"
description: "Comparison of three deployment models — SaaS, on-premises, and hybrid cloud — and their compliance boundaries."
---

<div class="deploy-page">

# Enterprise Deployment Models

<MetricStats :items="[
  { label: 'Deployment Models', value: '3', hint: 'SaaS · On-Premises · Hybrid Cloud' },
  { label: 'On-Premises Startup', value: '2-4 weeks' },
  { label: 'Enterprise Availability', value: '99.95%', hint: 'SaaS Enterprise' },
  { label: 'SM Cryptography', value: 'SM4-GCM' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="server" :size="14" /> Model Comparison</span>
  <h2 class="lurus-section-head__title">Deployment Model Matrix</h2>
  <p class="lurus-section-head__lede">One product, three deployment models — choose by data sovereignty and startup timeline.</p>
</div>

| Capability | SaaS | On-Premises | Hybrid Cloud |
|------|------|-------|--------|
| Lurus API Gateway | ✅ Out of the box | ✅ Private image | ✅ |
| Kova Execution Engine | ✅ | ✅ | ✅ |
| MemX Memory Engine | ✅ | ✅ | ✅ |
| Lucrum Quant | ✅ | 🔜 2026 H2 | ✅ |
| Switch / Creator | ✅ Desktop | ✅ Desktop | ✅ |
| Identity & Compliance | ✅ | ✅ | ✅ |
| Data Sovereignty | AWS / Alibaba Cloud | **Enterprise internal** | Hybrid |
| SM Cryptography SM4-GCM | — | ✅ | ✅ |
| Startup Timeline | Immediate | 2-4 weeks | 1-2 weeks |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Compliance</span>
  <h2 class="lurus-section-head__title">Compliance Capabilities</h2>
  <p class="lurus-section-head__lede">Data sovereignty, audit trails, SM cryptography — a clear picture for your reviewers at a glance.</p>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">Data Stays In-Country</div>
    <p class="lurus-card__body">With on-premises deployment, no data passes through the Lurus public cloud.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">Audit Logs</div>
    <p class="lurus-card__body">All API calls, identity events, and administrative operations are persisted to disk.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">SM Cryptography Support</div>
    <p class="lurus-card__body">Symmetric encryption with SM4-GCM, asymmetric SM2 (on the roadmap).</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="award" :size="20" /></span>
    <div class="lurus-card__title">MLPS / Industry Certifications</div>
    <p class="lurus-card__body">Please contact <a href="mailto:business@lurus.cn">business@lurus.cn</a> for the latest list.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> Identity Federation</span>
  <h2 class="lurus-section-head__title">SSO Federation</h2>
  <p class="lurus-section-head__lede">Employees sign in to every Lurus product with their company account — no new identities required.</p>
</div>

Employees use their existing enterprise IdP (Okta / Azure AD / self-hosted Keycloak) to sign in with their company account:

<ArchitectureDiagram title="Enterprise IdP Federated Login" chart="graph LR; A[Enterprise IdP] -->|OIDC| B[Lurus Casdoor]; B --> C[All Lurus Products]" />

Supported protocols: OIDC / OAuth 2.0 / SAML 2.0 / SCIM (user lifecycle).

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="activity" :size="14" /> Service Level</span>
  <h2 class="lurus-section-head__title">SLA</h2>
</div>

| Model | Availability | Incident Response |
|------|--------|---------|
| SaaS Standard | 99.9% | Business hours |
| SaaS Enterprise | 99.95% | 7×24 |
| On-Premises | Per contract | Dedicated on-call |

## Next Steps

<NextSteps :steps="[
  { text: 'Identity & Compliance', link: '/en/platform/auth/', primary: true },
  { text: 'Why Lurus', link: '/en/solutions/why-lurus' },
  { text: 'Contact Sales', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
