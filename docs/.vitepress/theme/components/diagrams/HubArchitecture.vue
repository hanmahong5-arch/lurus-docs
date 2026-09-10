<!--
  自动生成，请勿手改 —— 改图请改产品仓的 docs/diagrams/architecture.svg，
  再跑 `bun run diagrams` 重新生成。手改这里会在下次生成时被覆盖。

  颜色/字体已换成 theme/diagrams.css 的 --lurus-dg-* 与站点字体变量，
  所以这一份 SVG 明暗两色都能用；图形与文案与 README 版逐字一致。
-->
<template>
  <svg viewBox="0 0 1160 624" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="hub-newhub-arch-title hub-newhub-arch-desc">
    <title id="hub-newhub-arch-title">Lurus Hub gateway architecture</title>
    <desc id="hub-newhub-arch-desc">OpenAI-compatible callers reach a relay router that dispatches across 20+ provider adapters and records outcomes into a data hub, while a separate multi-tenant REST API shares Postgres and Redis and can optionally report usage to a companion billing service over gRPC.</desc>
    <defs>
      <marker id="hub-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-muted)"/></marker>
      <marker id="hub-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-accent)"/></marker>
      <marker id="hub-arrow-link" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-link)"/></marker>
    </defs>

    <rect width="100%" height="100%" fill="var(--lurus-dg-paper)"/>

    <!-- ===== Arrows (drawn before nodes) ===== -->

    <!-- A1: API Callers -> Relay Router (primary relay flow) -->
    <path d="M 400,104 V 144 Q 400,152 392,152 H 168 Q 160,152 160,160 V 200"
          fill="none" stroke="var(--lurus-dg-accent)" stroke-width="1.4" marker-end="url(#hub-arrow-accent)"/>
    <!-- A2: API Callers -> Multi-tenant API (management HTTP) -->
    <path d="M 480,104 V 144 Q 480,152 488,152 H 712 Q 720,152 720,160 V 200"
          fill="none" stroke="var(--lurus-dg-link)" stroke-width="1.2" marker-end="url(#hub-arrow-link)"/>
    <!-- A3: Relay Router -> Provider Adapters (primary relay flow, straight) -->
    <line x1="160" y1="264" x2="160" y2="340" stroke="var(--lurus-dg-accent)" stroke-width="1.4" marker-end="url(#hub-arrow-accent)"/>
    <!-- A4: Relay Router -> Data Hub (outcome recording) -->
    <path d="M 260,220 H 432 Q 440,220 440,228 V 340"
          fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#hub-arrow)"/>
    <!-- A5: Relay Router -> Redis (channel cache), hop over A4 at x=440 -->
    <path d="M 260,248 H 432 a 8,8 0 0,1 16,0 H 572 Q 580,248 580,256 V 364 Q 580,372 588,372 H 620"
          fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#hub-arrow)"/>
    <!-- A6: Multi-tenant API -> Redis (session store, straight) -->
    <line x1="720" y1="264" x2="720" y2="340" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#hub-arrow)"/>
    <!-- A7: Data Hub -> PostgreSQL (aggregated usage flush, straight) -->
    <line x1="440" y1="404" x2="440" y2="480" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#hub-arrow)"/>
    <!-- A8: Multi-tenant API -> Billing Service (optional gRPC hook, off by default) -->
    <line x1="820" y1="232" x2="900" y2="232" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#hub-arrow)"/>

    <!-- ===== Arrow labels ===== -->
    <rect x="256" y="132" width="48" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="280" y="141" fill="var(--lurus-dg-accent)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">RELAY</text>

    <rect x="576" y="132" width="48" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="600" y="141" fill="var(--lurus-dg-link)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">REST</text>

    <rect x="172" y="296" width="60" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="202" y="305" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">DISPATCH</text>

    <rect x="318" y="200" width="56" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="346" y="209" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">OUTCOME</text>

    <rect x="392" y="228" width="48" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="416" y="237" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">CACHE</text>

    <rect x="732" y="296" width="52" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="758" y="305" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">SESSION</text>

    <rect x="452" y="436" width="40" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="472" y="445" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">FLUSH</text>

    <rect x="828" y="212" width="48" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="852" y="221" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">USAGE</text>

    <!-- ===== Nodes ===== -->

    <!-- N1: API Callers (input) -->
    <rect x="340" y="40" width="200" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="340" y="40" width="200" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-muted) 10%, transparent)" stroke="var(--lurus-dg-soft)" stroke-width="1"/>
    <rect x="348" y="46" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-soft) 40%, transparent)" stroke-width="0.8"/>
    <text x="362" y="55" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">EXT</text>
    <text x="440" y="74" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">API Callers</text>
    <text x="440" y="90" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">apps · Switch · console</text>

    <!-- N2: Relay Router (focal) -->
    <rect x="60" y="200" width="200" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="60" y="200" width="200" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
    <rect x="68" y="206" width="32" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-accent) 50%, transparent)" stroke-width="0.8"/>
    <text x="84" y="215" fill="var(--lurus-dg-accent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">CORE</text>
    <text x="160" y="234" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Relay Router</text>
    <text x="160" y="250" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">OpenAI-compatible</text>

    <!-- N3: Multi-tenant API (backend) -->
    <rect x="620" y="200" width="200" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="620" y="200" width="200" height="64" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
    <rect x="628" y="206" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
    <text x="642" y="215" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">API</text>
    <text x="720" y="234" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Multi-tenant API</text>
    <text x="720" y="250" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">V1 + V2 · tenant_slug</text>

    <!-- N4: Billing Service (optional / off by default) -->
    <rect x="900" y="200" width="200" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="900" y="200" width="200" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
    <rect x="908" y="206" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="0.8"/>
    <text x="922" y="215" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">OPT</text>
    <text x="1000" y="234" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Billing Service</text>
    <text x="1000" y="250" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">gRPC · off by default</text>

    <!-- N5: Provider Adapters (backend) -->
    <rect x="60" y="340" width="200" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="60" y="340" width="200" height="64" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
    <rect x="68" y="346" width="32" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
    <text x="84" y="355" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">ADPT</text>
    <text x="160" y="374" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Provider Adapters</text>
    <text x="160" y="390" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">20+ vendors · 3 formats</text>

    <!-- N6: Data Hub (backend) -->
    <rect x="340" y="340" width="200" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="340" y="340" width="200" height="64" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
    <rect x="348" y="346" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
    <text x="362" y="355" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">HUB</text>
    <text x="440" y="374" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Data Hub</text>
    <text x="440" y="390" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">scoring + usage agg.</text>

    <!-- N7: Redis (store) -->
    <rect x="620" y="340" width="200" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="620" y="340" width="200" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)" stroke="var(--lurus-dg-muted)" stroke-width="1"/>
    <rect x="628" y="346" width="24" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-muted) 40%, transparent)" stroke-width="0.8"/>
    <text x="640" y="355" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">KV</text>
    <text x="720" y="374" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Redis</text>
    <text x="720" y="390" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">session + channel cache</text>

    <!-- N8: PostgreSQL (store) -->
    <rect x="340" y="480" width="200" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="340" y="480" width="200" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)" stroke="var(--lurus-dg-muted)" stroke-width="1"/>
    <rect x="348" y="486" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-muted) 40%, transparent)" stroke-width="0.8"/>
    <text x="362" y="495" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">SQL</text>
    <text x="440" y="514" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">PostgreSQL</text>
    <text x="440" y="530" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">system of record</text>

    <!-- ===== Legend ===== -->
    <line x1="60" y1="564" x2="1100" y2="564" stroke="color-mix(in srgb, var(--lurus-dg-ink) 12%, transparent)" stroke-width="0.8"/>
    <text x="60" y="580" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.18em">LEGEND</text>

    <rect x="60" y="596" width="14" height="10" rx="2" fill="color-mix(in srgb, var(--lurus-dg-muted) 10%, transparent)" stroke="var(--lurus-dg-soft)" stroke-width="1"/>
    <text x="80" y="604" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Caller</text>

    <rect x="180" y="596" width="14" height="10" rx="2" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
    <text x="200" y="604" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Focal / core</text>

    <rect x="310" y="596" width="14" height="10" rx="2" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
    <text x="330" y="604" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Backend logic</text>

    <rect x="460" y="596" width="14" height="10" rx="2" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)" stroke="var(--lurus-dg-muted)" stroke-width="1"/>
    <text x="480" y="604" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Data store</text>

    <rect x="580" y="596" width="14" height="10" rx="2" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="1" stroke-dasharray="3,2"/>
    <text x="600" y="604" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Optional</text>

    <line x1="740" y1="600" x2="768" y2="600" stroke="var(--lurus-dg-accent)" stroke-width="1.4" marker-end="url(#hub-arrow-accent)"/>
    <text x="776" y="604" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Relay path</text>

    <line x1="900" y1="600" x2="928" y2="600" stroke="var(--lurus-dg-link)" stroke-width="1.2" marker-end="url(#hub-arrow-link)"/>
    <text x="936" y="604" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">REST call</text>
  </svg>
</template>
