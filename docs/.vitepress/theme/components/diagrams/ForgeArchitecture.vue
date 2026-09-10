<!--
  自动生成，请勿手改 —— 改图请改产品仓的 docs/diagrams/architecture.svg，
  再跑 `bun run diagrams` 重新生成。手改这里会在下次生成时被覆盖。

  颜色/字体已换成 theme/diagrams.css 的 --lurus-dg-* 与站点字体变量，
  所以这一份 SVG 明暗两色都能用；图形与文案与 README 版逐字一致。
-->
<template>
  <svg viewBox="0 0 880 580" role="img" aria-labelledby="forge-arch-title forge-arch-desc" xmlns="http://www.w3.org/2000/svg">
  <title id="forge-arch-title">Forge service topology</title>
  <desc id="forge-arch-desc">Architecture diagram: Forge's Canvas and Web frontends call the FastAPI backend, which persists state to Postgres and optionally reaches external MCP tools/clients, the Kova execution engine, an LLM gateway, and platform-core billing, each wired up but off until its environment variables are configured.</desc>
  <defs>
    <marker id="forge-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-muted)"/>
    </marker>
  </defs>

  <rect width="880" height="580" fill="var(--lurus-dg-paper)"/>

  <text x="40" y="28" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" letter-spacing="0.14em">FORGE — SERVICE TOPOLOGY</text>

  <!-- Zones (painted before arrows/nodes) -->
  <rect x="40" y="48" width="392" height="120" rx="8" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 10%, transparent)" stroke-width="0.8"/>
  <rect x="56" y="52" width="100" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="106" y="61" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.14em">FRONTENDS</text>

  <rect x="232" y="376" width="596" height="112" rx="8" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 10%, transparent)" stroke-width="0.8"/>
  <rect x="248" y="380" width="220" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="358" y="389" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.14em">OPTIONAL · ENV UNSET BY DEFAULT</text>

  <rect x="456" y="68" width="232" height="104" rx="8" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 10%, transparent)" stroke-width="0.8"/>
  <rect x="464" y="72" width="200" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="564" y="81" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.14em">OPTIONAL · ENV UNSET BY DEFAULT</text>

  <!-- Arrows -->
  <!-- canvas -> backend -->
  <path d="M136,152 L136,168 Q136,176 144,176 L264,176 Q272,176 272,184 L272,216" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#forge-arrow)"/>
  <rect x="186" y="156" width="36" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="204" y="165" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">REST</text>

  <!-- web -> backend -->
  <path d="M328,152 L328,216" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#forge-arrow)"/>
  <rect x="336" y="178" width="32" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="352" y="187" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">REST</text>

  <!-- backend -> mcp (call out, optional) -->
  <path d="M384,216 L384,186 Q384,178 392,178 L532,178 Q540,178 540,170 L540,152" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#forge-arrow)"/>
  <rect x="444" y="158" width="36" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="462" y="167" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">CALL</text>

  <!-- mcp -> backend (serve, optional) -->
  <path d="M604,152 L604,190 Q604,198 596,198 L448,198 Q440,198 440,206 L440,216" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#forge-arrow)"/>
  <rect x="548" y="178" width="36" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="566" y="187" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">SERVE</text>

  <!-- backend -> postgres -->
  <path d="M272,312 L272,352 Q272,360 264,360 L128,360 Q120,360 120,368 L120,408" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#forge-arrow)"/>
  <rect x="178" y="340" width="36" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="196" y="349" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">SQL</text>

  <!-- backend -> kova (optional) -->
  <path d="M328,312 L328,408" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#forge-arrow)"/>
  <rect x="336" y="354" width="32" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="352" y="363" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">HTTP</text>

  <!-- backend -> llm gateway (optional) -->
  <path d="M384,312 L384,340 Q384,348 392,348 L522,348 Q530,348 530,356 L530,408" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#forge-arrow)"/>
  <rect x="439" y="328" width="36" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="457" y="337" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">HTTP</text>

  <!-- backend -> platform-core (optional) -->
  <path d="M440,312 L440,364 Q440,372 448,372 L724,372 Q732,372 732,380 L732,408" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#forge-arrow)"/>
  <rect x="568" y="352" width="36" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="586" y="361" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">USAGE</text>

  <!-- Nodes -->
  <!-- Canvas -->
  <rect x="56" y="88" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="56" y="88" width="160" height="64" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <rect x="64" y="94" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="78" y="103" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">APP</text>
  <text x="136" y="122" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Canvas</text>
  <text x="136" y="138" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">:3001 · React Flow</text>

  <!-- Web -->
  <rect x="256" y="88" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="256" y="88" width="160" height="64" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <rect x="264" y="94" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="278" y="103" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">APP</text>
  <text x="336" y="122" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Web</text>
  <text x="336" y="138" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">:3000 · Next.js</text>

  <!-- MCP tools & clients -->
  <rect x="472" y="88" width="200" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="472" y="88" width="200" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <rect x="480" y="94" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="494" y="103" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">EXT</text>
  <text x="572" y="122" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">MCP tools &amp; clients</text>
  <text x="572" y="138" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">SSE · external</text>

  <!-- Backend (focal) -->
  <rect x="216" y="216" width="280" height="96" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="216" y="216" width="280" height="96" rx="6" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1.2"/>
  <rect x="224" y="222" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-accent) 60%, transparent)" stroke-width="0.8"/>
  <text x="238" y="231" fill="var(--lurus-dg-accent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">CORE</text>
  <text x="356" y="266" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Backend</text>
  <text x="356" y="282" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">:8000 · FastAPI</text>
  <text x="356" y="298" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">components · orchestrator · budget</text>

  <!-- Postgres -->
  <rect x="40" y="408" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="40" y="408" width="160" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)" stroke="var(--lurus-dg-muted)" stroke-width="1"/>
  <rect x="48" y="414" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="62" y="423" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">DB</text>
  <text x="120" y="442" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Postgres</text>
  <text x="120" y="458" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">flows · ledger · docs</text>

  <!-- Kova (optional) -->
  <rect x="248" y="408" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="248" y="408" width="160" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <rect x="256" y="414" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="270" y="423" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">EXT</text>
  <text x="328" y="442" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Kova</text>
  <text x="328" y="458" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">:3002 · Rust WAL</text>

  <!-- LLM Gateway (optional) -->
  <rect x="440" y="408" width="180" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="440" y="408" width="180" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <rect x="448" y="414" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="462" y="423" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">EXT</text>
  <text x="530" y="442" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">LLM Gateway</text>
  <text x="530" y="458" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">newapi.lurus.cn</text>

  <!-- platform-core (optional) -->
  <rect x="652" y="408" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="652" y="408" width="160" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <rect x="660" y="414" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="674" y="423" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">EXT</text>
  <text x="732" y="442" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">platform-core</text>
  <text x="732" y="458" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">usage / billing</text>

  <!-- Legend -->
  <line x1="40" y1="512" x2="840" y2="512" stroke="color-mix(in srgb, var(--lurus-dg-ink) 12%, transparent)" stroke-width="0.8"/>
  <text x="40" y="536" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" letter-spacing="0.14em">LEGEND</text>

  <line x1="132" y1="530" x2="156" y2="530" stroke="var(--lurus-dg-muted)" stroke-width="1.2"/>
  <text x="164" y="536" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)">ACTIVE BY DEFAULT</text>

  <line x1="288" y1="530" x2="312" y2="530" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="320" y="536" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)">OPTIONAL · ENV UNSET BY DEFAULT</text>

  <rect x="514" y="524" width="20" height="12" rx="2" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
  <text x="542" y="536" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)">ORCHESTRATION HUB</text>

  </svg>
</template>
