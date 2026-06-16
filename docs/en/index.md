---
layout: page
title: LurusTech Docs — AI Infrastructure & Product Platform
description: LurusTech platform documentation — API Reference · Quickstart · Integration Guide
---

<div class="vp-doc lurus-home">

<Hero />

<nav class="persona-jump" aria-label="Quick jump by role">
  <a href="#newbie" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="rocket" :size="14" /></span>
    <span class="persona-jump__label">Newcomer</span>
    <span class="persona-jump__hint">Up and running in 3 min</span>
  </a>
  <a href="#player" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="gamepad-2" :size="14" /></span>
    <span class="persona-jump__label">Player</span>
    <span class="persona-jump__hint">Ready-made tools</span>
  </a>
  <a href="#decider" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="briefcase" :size="14" /></span>
    <span class="persona-jump__label">Decision-maker</span>
    <span class="persona-jump__hint">Enterprise evaluation</span>
  </a>
  <a href="#dev" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="code" :size="14" /></span>
    <span class="persona-jump__label">Developer</span>
    <span class="persona-jump__hint">Build systems</span>
  </a>
</nav>

<div class="topic-grid-head"><Icon name="compass" :size="16" /> <strong>Browse by topic</strong> —— Know what you're looking for? Jump straight to the right topic.</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/en/guide/introduction"><span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span><div class="lurus-card__title">Gateway Access</div><p class="lurus-card__body">One key for 50+ models, OpenAI SDK compatible.</p></a>
  <a class="lurus-card lurus-card--kova" href="/en/kova/"><span class="lurus-card__icon"><Icon name="bot" :size="20" /></span><div class="lurus-card__title">Agent Execution</div><p class="lurus-card__body">Kova WAL-First engine with automatic crash recovery.</p></a>
  <a class="lurus-card lurus-card--memx" href="/en/memx/"><span class="lurus-card__icon"><Icon name="brain" :size="20" /></span><div class="lurus-card__title">Smart Memory</div><p class="lurus-card__body">MemX adaptive memory with zero-LLM-cost distillation.</p></a>
  <a class="lurus-card lurus-card--lumen" href="/en/lumen/"><span class="lurus-card__icon"><Icon name="zap" :size="20" /></span><div class="lurus-card__title">Observability</div><p class="lurus-card__body">Lumen Replay + crash recovery + cost tracking.</p></a>
  <a class="lurus-card lurus-card--lucrum" href="/en/lucrum/"><span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span><div class="lurus-card__title">Quant Trading</div><p class="lurus-card__body">Lucrum generates vnpy strategies from natural language and backtests them.</p></a>
  <a class="lurus-card lurus-card--switch" href="/en/switch/"><span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span><div class="lurus-card__title">Desktop Tools</div><p class="lurus-card__body">Switch unifies management of multiple AI CLIs, MCP, and cost.</p></a>
  <a class="lurus-card lurus-card--api" href="/integrations/"><span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span><div class="lurus-card__title">Integrations & MCP</div><p class="lurus-card__body">Product MCP, Switch built-in servers, client directory.</p></a>
  <a class="lurus-card lurus-card--api" href="/en/guide/troubleshooting"><span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span><div class="lurus-card__title">Troubleshooting</div><p class="lurus-card__body">Pinpoint common issues like 401 / quota / timeout on one page.</p></a>
</div>

## <Icon name="rocket" :size="22" /> I'm a Newcomer — Make Your First Call in 3 Minutes {#newbie}

Picking the wrong model costs 10x more than writing the wrong code. Run one call through our gateway first, then decide whether to migrate.

<div class="action-grid">
  <ActionCard
    product-id="lurus-api"
    :actions="[
      { label: 'Quickstart', href: '/en/guide/quickstart', primary: true },
      { label: 'Get an API Key', href: '/en/guide/get-api-key' },
      { label: 'Supported Models', href: '/guide/models' },
      { label: 'Console', href: 'https://api.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="platform"
    :actions="[
      { label: 'Platform Overview', href: '/en/platform/', primary: true },
      { label: 'Billing Explained', href: '/en/platform/billing' },
      { label: 'FAQ', href: '/en/platform/faq' },
    ]"
  />
</div>

---

## <Icon name="gamepad-2" :size="22" /> I'm a Player — I Want Ready-made AI Tools {#player}

The code is already written for you. Download and run — not a single line of config.

<div class="action-grid">
  <ActionCard
    product-id="lucrum"
    :actions="[
      { label: 'Quickstart', href: '/en/lucrum/quickstart', primary: true },
      { label: 'Strategy Marketplace', href: '/en/lucrum/strategies' },
      { label: 'Trading Platform', href: 'https://lucrum.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="switch"
    :actions="[
      { label: 'Install Guide', href: '/en/switch/install', primary: true },
      { label: 'Configuration', href: '/en/switch/configuration' },
    ]"
  />
  <ActionCard
    product-id="creator"
    :actions="[
      { label: 'Install Guide', href: '/creator/install', primary: true },
      { label: 'Use Cases', href: '/creator/use-cases' },
    ]"
  />
  <ActionCard
    name="Lutu — Mobile Client"
    tagline="Lutu app · Mobile AI assistant & bookkeeping"
    icon="smartphone"
    color="var(--lurus-color-creator)"
    status="beta"
    :actions="[
      { label: 'Download Lutu', href: 'https://www.lurus.cn/download#lutu', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="briefcase" :size="22" /> I'm a Decision-maker — Evaluating Enterprise Procurement {#decider}

This isn't a tool purchase — it's an infrastructure replacement. Look at TCO and compliance boundaries first, then features.

<div class="action-grid">
  <ActionCard
    name="Why Choose Lurus"
    tagline="Four core capabilities vs. building it yourself — TCO, performance, compliance in one table"
    icon="award"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: 'Enterprise Solutions', href: '/solutions/', primary: true },
      { label: 'Why Lurus', href: '/solutions/why-lurus' },
    ]"
  />
  <ActionCard
    name="Enterprise Deployment Models"
    tagline="SaaS · On-premise · Hybrid cloud · Compliance boundaries explained at once"
    icon="server"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: 'Deployment Matrix', href: '/solutions/enterprise-deploy', primary: true },
    ]"
  />
  <ActionCard
    product-id="auth"
    :actions="[
      { label: 'Overview & Endpoints', href: '/en/platform/auth/', primary: true },
      { label: 'Enterprise SSO Federation', href: '/en/platform/auth/oidc' },
      { label: 'Auth Console', href: 'https://auth.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    name="Contact Sales"
    tagline="On-premise deployment · Licensing · Customization · Partnership inquiries"
    icon="mail"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'business@lurus.cn', href: 'mailto:business@lurus.cn', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="code" :size="22" /> I'm a Developer — Building AI Systems {#dev}

The four foundational components of an LLM application: execution · memory · gateway · CLI. Each works on its own, stronger together.

<div class="action-grid">
  <ActionCard
    product-id="kova"
    :actions="[
      { label: 'Quickstart', href: '/en/kova/quickstart', primary: true },
      { label: 'Core Concepts', href: '/en/kova/concepts' },
      { label: 'API Reference', href: '/en/kova/api' },
    ]"
  />
  <ActionCard
    product-id="memx"
    :actions="[
      { label: 'Quickstart', href: '/en/memx/quickstart', primary: true },
      { label: 'Core Concepts', href: '/en/memx/concepts' },
      { label: 'Architecture', href: '/en/memx/architecture' },
    ]"
  />
  <ActionCard
    product-id="lumen"
    :actions="[
      { label: 'Quickstart', href: '/en/lumen/quickstart', primary: true },
      { label: 'Python SDK', href: '/en/lumen/python-sdk' },
      { label: 'CLI Manual', href: '/en/lumen/cli' },
    ]"
  />
  <ActionCard
    product-id="api-ref"
    :actions="[
      { label: 'API Overview', href: '/en/api/overview', primary: true },
      { label: 'Authentication', href: '/en/api/authentication' },
      { label: 'Chat Completions', href: '/en/api/chat-completions' },
    ]"
  />
  <ActionCard
    product-id="arch"
    :actions="[
      { label: 'View Architecture', href: '/developer/architecture', primary: true },
    ]"
  />
  <ActionCard
    product-id="forge"
    :actions="[
      { label: 'Product Philosophy', href: '/forge/', primary: true },
      { label: 'Ontology', href: '/forge/ontology' },
    ]"
  />
</div>

---

## Cross-product Tutorials · Migration Guides

<div class="action-grid action-grid--compact">
  <ActionCard
    name="Tutorial Center"
    tagline="MemX + Kova · Lumen + LangGraph · Lucrum end-to-end"
    icon="graduation-cap"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'Cross-product Tutorials', href: '/tutorials/', primary: true },
    ]"
  />
  <ActionCard
    name="Migration Guide"
    tagline="OpenAI · LangGraph · Self-hosted OIDC → move in 5 minutes"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: 'Migration Center', href: '/migrations/', primary: true },
    ]"
  />
  <ActionCard
    name="Glossary"
    tagline="47+ technical terms grouped by topic, cross-product quick reference"
    icon="book-a"
    color="var(--lurus-color-memx)"
    :actions="[
      { label: 'Full Glossary', href: '/guide/glossary', primary: true },
    ]"
  />
</div>

---

## Why Choose Lurus?

Four decision points — not just another tool, but an infrastructure replacement.

<div class="diff-grid">
  <article class="diff-card diff-card--brand">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="layers" :size="20" /></span>
      <h3 class="diff-card__title">Fully In-house Stack</h3>
    </header>
    <p class="diff-card__lede">From the Rust execution engine to the Flutter mobile client, all built in-house. Accounts / billing / memory / gateway are shared.</p>
    <ul class="diff-card__points">
      <li>No waiting for three vendors to point fingers when something breaks</li>
      <li>It compounds — memory, billing, and models all share one pool</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-kova">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="zap" :size="20" /></span>
      <h3 class="diff-card__title">Engine-grade Performance</h3>
    </header>
    <p class="diff-card__lede">Kova scheduling at <strong>3μs</strong> (Criterion benchmark) · 315K ops/s throughput.</p>
    <ul class="diff-card__points">
      <li>We wrote the execution engine — not another wrapper around Temporal</li>
      <li>MemX distills without calling an LLM · Lucrum runs at full precision with no float drift</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-platform">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="shield-check" :size="20" /></span>
      <h3 class="diff-card__title">Data Sovereignty</h3>
    </header>
    <p class="diff-card__lede">Deploy once, pay no tax to any cloud vendor. End-to-end encryption with SM4-GCM.</p>
    <ul class="diff-card__points">
      <li>One set of SSO / Passkey / MFA, plugs into your existing IdP</li>
      <li>OpenAI SDK compatible · take your data with you anytime you want to leave</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-memx">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="receipt" :size="20" /></span>
      <h3 class="diff-card__title">Transparent TCO</h3>
    </header>
    <p class="diff-card__lede">Unified billing in 鹿贝 units — 50+ models, one statement.</p>
    <ul class="diff-card__points">
      <li>Reconciliation time goes from a day to 5 minutes</li>
      <li>Migrate out anytime, zero exit cost</li>
    </ul>
  </article>
</div>

<details class="diff-table">
  <summary>Expand the full comparison table (8 dimensions × build-it-yourself)</summary>

| Dimension | Lurus Advantage | vs. Building It Yourself |
|------|-------------|---------|
| **Fully In-house Stack** | From the Rust execution engine to the Flutter mobile client, core tech is fully self-controlled | Multi-vendor assembly, version lock-in risk |
| **Engine-grade Performance** | Kova 3μs scheduling latency, 315K ops/s (Criterion benchmark), zero external dependencies | Self-built Temporal/LangGraph are an order of magnitude slower |
| **Data Sovereignty** | On-premise deployment, data never leaves the enterprise boundary, supports SM4-GCM | Public cloud compliance and auditing are difficult |
| **Unified Identity** | All products share SSO, Passkey, MFA, with enterprise IdP federation | Self-operated Keycloak / Auth0 |
| **Ecosystem Synergy** | 12 products share accounts/billing/memory/LLM gateway — it compounds as you use it | Fragmented tool stack |
| **Cost-efficient** | MemX zero-LLM-cost distillation; Lucrum Decimal.js full precision with zero error | Memory / precision issues require extra investment |
| **Transparent TCO** | Unified billing in 鹿贝 units, pay-as-you-go + free quota | Reconciling bills across multiple vendors is complex |
| **Open & Exportable** | OpenAI SDK compatible, PAT/JWT standard authentication, export with no lock-in | High vendor lock-in exit cost |

</details>

---

## Ready?

<div class="finalcta">
  <div class="finalcta__text">
    <h3>Switch gateways in 5 lines of code, OpenAI SDK compatible</h3>
    <p>Change one base_url and all your existing calls connect. One key for 50+ models, free quota on sign-up.</p>
  </div>
  <div class="finalcta__actions">
    <a href="/en/guide/quickstart" class="finalcta__btn finalcta__btn--primary">Up and running in 3 min →</a>
    <a href="https://api.lurus.cn" target="_blank" rel="noopener noreferrer" class="finalcta__btn finalcta__btn--alt">Go to Console ↗</a>
    <a href="mailto:business@lurus.cn" class="finalcta__btn finalcta__btn--ghost">Enterprise Inquiry</a>
  </div>
</div>

## Contact Us

<div class="contact-grid">
  <a href="mailto:support@lurus.cn" class="contact-card">
    <span class="contact-card__icon"><Icon name="life-buoy" :size="22" /></span>
    <span class="contact-card__name">Technical Support</span>
    <span class="contact-card__addr">support@lurus.cn</span>
  </a>
  <a href="mailto:business@lurus.cn" class="contact-card contact-card--accent">
    <span class="contact-card__icon"><Icon name="briefcase" :size="22" /></span>
    <span class="contact-card__name">Business Partnership</span>
    <span class="contact-card__addr">business@lurus.cn</span>
  </a>
  <a href="https://github.com/hanmahong5-arch" target="_blank" rel="noopener noreferrer" class="contact-card">
    <span class="contact-card__icon"><Icon name="github" :size="22" /></span>
    <span class="contact-card__name">GitHub</span>
    <span class="contact-card__addr">hanmahong5-arch ↗</span>
  </a>
</div>

</div>

<style>
.lurus-home { max-width: 1152px; margin: 0 auto; padding: 24px; }
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0 28px;
}
.action-grid--compact {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.lurus-home h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--lurus-fs-xl);
  font-weight: 700;
  margin-top: 44px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  background:
    linear-gradient(to right,
      var(--vp-c-brand-1),
      color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent) 60%,
      transparent 100%)
    bottom left / 36% 1px no-repeat;
  scroll-margin-top: 88px;
}
.lurus-home h2 .lurus-icon { color: var(--vp-c-brand-1); }
.lurus-home hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-brand-soft), transparent);
  margin: 40px 0;
}
@media (max-width: 640px) {
  .lurus-home { padding: 16px; }
}

/* ============================================================
 * Persona jump chips — sits under Hero, anchors into 4 personas
 * ============================================================ */
.persona-jump {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: -8px 0 4px;
  padding: 6px 4px;
  background: transparent;
  border: none;
  align-items: center;
  justify-content: center;
}
.persona-jump__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--lurus-radius-pill);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2) !important;
  text-decoration: none !important;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  transition: transform var(--lurus-dur-fast) var(--lurus-ease-out),
              border-color var(--lurus-dur-fast),
              color var(--lurus-dur-fast);
}
.persona-jump__chip:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.persona-jump__icon {
  display: inline-flex;
  color: var(--vp-c-brand-1);
}
.persona-jump__hint {
  color: var(--vp-c-text-3);
  font-weight: 400;
  font-size: 0.74rem;
}
.persona-jump__chip:hover .persona-jump__hint { color: inherit; opacity: 0.85; }
@media (max-width: 640px) {
  .persona-jump__hint { display: none; }
}

/* anchored personas: leave room for VitePress sticky nav (~64px) + breathing space */
#newbie, #player, #decider, #dev { scroll-margin-top: 88px; }

/* ============================================================
 * Differentiators — 4 cards replacing the 8-row why-Lurus table
 * ============================================================ */
.diff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin: 18px 0 14px;
}
.diff-card {
  --accent: var(--vp-c-brand-1);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-lg);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: transform var(--lurus-dur-base) var(--lurus-ease-out),
              border-color var(--lurus-dur-base),
              box-shadow var(--lurus-dur-base);
}
.diff-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
}
.diff-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--accent);
  box-shadow: var(--lurus-shadow-3);
}
.diff-card--brand            { --accent: var(--vp-c-brand-1); }
.diff-card--accent-kova      { --accent: var(--lurus-color-kova); }
.diff-card--accent-platform  { --accent: var(--lurus-color-platform); }
.diff-card--accent-memx      { --accent: var(--lurus-color-memx); }
.diff-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.diff-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent);
  flex-shrink: 0;
}
.diff-card__title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.diff-card__lede {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
.diff-card__lede strong {
  color: var(--accent);
  font-feature-settings: 'tnum';
}
.diff-card__points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.diff-card__points li {
  position: relative;
  padding-left: 16px;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.diff-card__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.65;
}

.diff-table {
  margin: 12px 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-md);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.diff-table > summary {
  cursor: pointer;
  padding: 12px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  user-select: none;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background var(--lurus-dur-fast);
}
.diff-table > summary::-webkit-details-marker { display: none; }
.diff-table > summary::before {
  content: '▸';
  display: inline-block;
  transition: transform var(--lurus-dur-fast);
  color: var(--vp-c-brand-1);
}
.diff-table[open] > summary::before { transform: rotate(90deg); }
.diff-table > summary:hover { background: var(--vp-c-bg-mute); }
.diff-table table { margin: 0 18px 18px; }

/* ============================================================
 * Final CTA — bottom strip "ready?"
 * ============================================================ */
.finalcta {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  align-items: center;
  margin: 24px 0 16px;
  padding: 28px 32px;
  border-radius: var(--lurus-radius-xl);
  background:
    radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent), transparent 60%),
    radial-gradient(120% 140% at 100% 100%, color-mix(in srgb, var(--lurus-color-kova) 12%, transparent), transparent 55%),
    var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
.finalcta__text h3 {
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.finalcta__text p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.finalcta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}
.finalcta__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: var(--lurus-radius-pill);
  text-decoration: none !important;
  transition: transform var(--lurus-dur-fast),
              filter var(--lurus-dur-fast),
              border-color var(--lurus-dur-fast),
              color var(--lurus-dur-fast);
}
.finalcta__btn:hover { transform: var(--lurus-hover-rise); }
.finalcta__btn--primary {
  background: var(--vp-c-brand-1);
  color: #fff !important;
}
.finalcta__btn--primary:hover { filter: brightness(1.08); }
.finalcta__btn--alt {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-divider);
}
.finalcta__btn--alt:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.finalcta__btn--ghost {
  color: var(--vp-c-text-2) !important;
}
.finalcta__btn--ghost:hover { color: var(--vp-c-brand-1) !important; }

@media (max-width: 720px) {
  .finalcta {
    grid-template-columns: 1fr;
    padding: 22px 20px;
  }
  .finalcta__actions { justify-content: flex-start; }
}

/* ============================================================
 * Contact card grid
 * ============================================================ */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0 8px;
}
.contact-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 18px 20px;
  border-radius: var(--lurus-radius-lg);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: transform var(--lurus-dur-base),
              border-color var(--lurus-dur-base),
              box-shadow var(--lurus-dur-base);
}
.contact-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--lurus-shadow-2);
}
.contact-card--accent { border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, var(--vp-c-divider)); }
.contact-card__icon {
  color: var(--vp-c-brand-1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}
.contact-card__name {
  font-weight: 700;
  font-size: 0.95rem;
}
.contact-card__addr {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  font-family: var(--lurus-font-mono);
}
</style>
