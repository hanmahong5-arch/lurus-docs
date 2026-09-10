<!--
  自动生成，请勿手改 —— 改图请改产品仓的 docs/diagrams/architecture.svg，
  再跑 `bun run diagrams` 重新生成。手改这里会在下次生成时被覆盖。

  颜色/字体已换成 theme/diagrams.css 的 --lurus-dg-* 与站点字体变量，
  所以这一份 SVG 明暗两色都能用；图形与文案与 README 版逐字一致。
-->
<template>
  <svg viewBox="0 0 960 448" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="tally-arch-title tally-arch-desc">
    <title id="tally-arch-title">Tally backend layering and tenant isolation</title>
    <desc id="tally-arch-desc">Layer stack of Tally's Go backend showing the adapter, app, and domain layers primarily depending inward toward a zero-dependency domain core, with a documented exception where some app-layer use cases import adapter packages directly, plus a shared pkg utility used by adapter and app only, and PostgreSQL row-level security enforcing tenant isolation through a tenant-pinned connection opened by the adapter layer.</desc>
    <defs>
      <marker id="tally-ta-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-muted)"/>
      </marker>
      <marker id="tally-ta-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-accent)"/>
      </marker>
    </defs>

    <!-- background -->
    <rect width="100%" height="100%" fill="var(--lurus-dg-paper)"/>

    <!-- header -->
    <text x="40" y="24" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.16em">TALLY · 2B-SVC-TALLY</text>
    <text x="40" y="52" fill="var(--lurus-dg-ink)" font-size="20" font-weight="600" font-family="var(--lurus-dg-serif)">Backend layering &amp; tenant isolation</text>

    <!-- direction column (left margin) -->
    <text x="40" y="80" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.16em">DEPENDS ON</text>
    <line x1="64" y1="88" x2="64" y2="280" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="1"/>
    <polygon points="60,280 68,280 64,288" fill="var(--lurus-dg-muted)"/>
    <text x="40" y="300" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.16em">ZERO DEPS</text>

    <!-- arrows (drawn before nodes) -->
    <!-- Adapter -> pkg -->
    <line x1="620" y1="112" x2="680" y2="112" stroke="var(--lurus-dg-muted)" stroke-width="1" marker-end="url(#tally-ta-arrow)"/>

    <!-- App -> pkg, hopped over the accent crossing at x=650 -->
    <path d="M 620,184 H 642 a 8,8 0 0,1 16,0 H 680" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1" marker-end="url(#tally-ta-arrow)"/>

    <!-- Adapter -> PostgreSQL RLS (focal) -->
    <path d="M 620,136 H 642 Q 650,136 650,144 V 272 Q 650,280 658,280 H 680" fill="none" stroke="var(--lurus-dg-accent)" stroke-width="1.2" marker-end="url(#tally-ta-arrow-accent)"/>
    <rect x="658" y="220" width="112" height="16" fill="var(--lurus-dg-paper)"/>
    <text x="714" y="232" fill="var(--lurus-dg-accent)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">TENANT_ID PINNED</text>

    <!-- App -> Adapter (reverse dependency; documented exception — see README) -->
    <path d="M 100,200 H 92 Q 84,200 84,192 V 112 Q 84,104 92,104 H 100" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="5,4" marker-end="url(#tally-ta-arrow)"/>

    <!-- stack silhouette -->
    <line x1="100" y1="88" x2="620" y2="88" stroke="var(--lurus-dg-rule-solid)" stroke-width="1"/>
    <line x1="100" y1="280" x2="620" y2="280" stroke="var(--lurus-dg-rule-solid)" stroke-width="1"/>

    <!-- Row 1: Adapter -->
    <rect x="100" y="88" width="520" height="64" fill="var(--lurus-dg-paper-2)"/>
    <line x1="100" y1="152" x2="620" y2="152" stroke="color-mix(in srgb, var(--lurus-dg-ink) 12%, transparent)" stroke-width="1"/>
    <text x="120" y="116" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.14em">01</text>
    <text x="240" y="118" fill="var(--lurus-dg-ink)" font-size="16" font-weight="600" font-family="var(--vp-font-family-base)">Adapter</text>
    <text x="600" y="112" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">gin handlers · pgx/v5 repos</text>
    <text x="600" y="128" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">middleware · nats · platform client</text>

    <!-- Row 2: App -->
    <rect x="100" y="152" width="520" height="64" fill="var(--lurus-dg-paper)"/>
    <line x1="100" y1="216" x2="620" y2="216" stroke="color-mix(in srgb, var(--lurus-dg-ink) 12%, transparent)" stroke-width="1"/>
    <text x="120" y="180" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.14em">02</text>
    <text x="240" y="182" fill="var(--lurus-dg-ink)" font-size="16" font-weight="600" font-family="var(--vp-font-family-base)">App</text>
    <text x="600" y="188" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">use cases + repository interfaces</text>

    <!-- Row 3: Domain -->
    <rect x="100" y="216" width="520" height="64" fill="var(--lurus-dg-paper-2)"/>
    <text x="120" y="244" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.14em">03</text>
    <text x="240" y="246" fill="var(--lurus-dg-ink)" font-size="16" font-weight="600" font-family="var(--vp-font-family-base)">Domain</text>
    <text x="600" y="252" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">entities · validation · zero deps</text>

    <!-- pkg (shared utility, side rail) -->
    <rect x="680" y="88" width="160" height="128" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="680" y="88" width="160" height="128" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)" stroke="var(--lurus-dg-muted)" stroke-width="1"/>
    <rect x="692" y="96" width="56" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-muted) 40%, transparent)" stroke-width="0.8"/>
    <text x="720" y="105" fill="var(--lurus-dg-muted)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">SHARED</text>
    <text x="760" y="148" fill="var(--lurus-dg-ink)" font-size="16" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">pkg</text>
    <text x="760" y="168" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">config · logger · version</text>
    <text x="760" y="182" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">llmclient · memorusclient</text>

    <!-- PostgreSQL / RLS (focal, security boundary) -->
    <rect x="680" y="248" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="680" y="248" width="160" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1" stroke-dasharray="4,4"/>
    <rect x="692" y="256" width="40" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-accent) 40%, transparent)" stroke-width="0.8"/>
    <text x="712" y="265" fill="var(--lurus-dg-accent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">RLS</text>
    <text x="760" y="288" fill="var(--lurus-dg-ink)" font-size="14" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">PostgreSQL</text>
    <text x="760" y="302" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">tenant_id GUC per request</text>

    <!-- legend -->
    <line x1="40" y1="344" x2="920" y2="344" stroke="color-mix(in srgb, var(--lurus-dg-ink) 12%, transparent)" stroke-width="0.8"/>
    <text x="40" y="360" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.14em">LEGEND</text>

    <line x1="140" y1="360" x2="164" y2="360" stroke="var(--lurus-dg-muted)" stroke-width="1" marker-end="url(#tally-ta-arrow)"/>
    <text x="172" y="363" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-base)">depends on / shared use</text>

    <line x1="420" y1="360" x2="444" y2="360" stroke="var(--lurus-dg-accent)" stroke-width="1.2" marker-end="url(#tally-ta-arrow-accent)"/>
    <text x="452" y="363" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-base)">tenant-scoped DB connection</text>

    <rect x="700" y="352" width="20" height="16" rx="3" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="728" y="363" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-base)">PostgreSQL RLS boundary</text>

    <line x1="140" y1="384" x2="164" y2="384" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="5,4" marker-end="url(#tally-ta-arrow)"/>
    <text x="172" y="387" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-base)">reverse dependency (documented exception — some app-layer use cases import adapter directly)</text>

    <!-- caption -->
    <text x="40" y="424" fill="var(--lurus-dg-soft)" font-size="12" font-family="var(--lurus-dg-serif)" font-style="italic">pkg is shared infrastructure reachable from adapter and app only — domain keeps zero external dependencies.</text>
  </svg>
</template>
