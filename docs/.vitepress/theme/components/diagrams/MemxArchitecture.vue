<!--
  自动生成，请勿手改 —— 改图请改产品仓的 docs/diagrams/architecture.svg，
  再跑 `bun run diagrams` 重新生成。手改这里会在下次生成时被覆盖。

  颜色/字体已换成 theme/diagrams.css 的 --lurus-dg-* 与站点字体变量，
  所以这一份 SVG 明暗两色都能用；图形与文案与 README 版逐字一致。
-->
<template>
  <svg viewBox="0 0 880 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="memx-memorus-arch-title memx-memorus-arch-desc">
  <title id="memx-memorus-arch-title">Memorus-r memory engine architecture</title>
  <desc id="memx-memorus-arch-desc">CLI, language bindings, and a REST/MCP/daemon server both call a core Memory API wired to the ACE reflect-curate-decay-generate pipeline; the core reaches pluggable vector-store and embedder backends by default, an opt-in reranker and LLM backend, and a graph-store backend that is implemented but never called by the engine.</desc>
  <defs>
  <marker id="memx-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
    <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-muted)"/>
  </marker>
  <marker id="memx-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
    <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-accent)"/>
  </marker>
  <marker id="memx-arrow-accent-rev" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
    <polygon points="8 0, 0 3, 8 6" fill="var(--lurus-dg-accent)"/>
  </marker>
  <marker id="memx-arrow-link" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
    <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-link)"/>
  </marker>
  </defs>

  <!-- background -->
  <rect width="880" height="600" fill="var(--lurus-dg-paper)"/>

  <!-- zone 1: entry points -->
  <rect x="24" y="24" width="832" height="120" rx="8" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 10%, transparent)" stroke-width="0.8"/>
  <rect x="40" y="28" width="104" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="92" y="37" fill="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.14em">ENTRY POINTS</text>

  <!-- zone 2: provider adapters -->
  <rect x="24" y="368" width="832" height="120" rx="8" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 10%, transparent)" stroke-width="0.8"/>
  <rect x="306" y="372" width="104" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="358" y="381" fill="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.14em">PROVIDER ADAPTERS</text>

  <!-- ============ CONNECTORS (drawn before nodes) ============ -->

  <!-- entry -> core (straight verticals, shared x) -->
  <line x1="230" y1="128" x2="230" y2="200" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#memx-arrow)"/>
  <line x1="650" y1="128" x2="650" y2="200" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#memx-arrow)"/>

  <!-- core <-> core (bidirectional, shared y) -->
  <line x1="420" y1="244" x2="460" y2="244" stroke="var(--lurus-dg-accent)" stroke-width="1.4" marker-start="url(#memx-arrow-accent-rev)" marker-end="url(#memx-arrow-accent)"/>

  <!-- Memory API -> Vector (straight vertical) -->
  <line x1="112" y1="288" x2="112" y2="400" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#memx-arrow)"/>

  <!-- Memory API -> Embedder (straight vertical) -->
  <line x1="276" y1="288" x2="276" y2="400" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#memx-arrow)"/>

  <!-- Memory API -> Reranker (dogleg elbow, dashed = opt-in, config.memory.rerank.enabled defaults false) -->
  <path d="M384,288 V336 Q384,344 392,344 H432 Q440,344 440,352 V400"
        fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#memx-arrow)"/>
  <rect x="432" y="328" width="48" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="456" y="337" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">OPT-IN</text>

  <!-- Memory API -> Graph Store (dogleg elbow, dashed = implemented, no caller) -->
  <path d="M408,288 V348 Q408,356 416,356 H596 Q604,356 604,364 V400"
        fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#memx-arrow)"/>
  <rect x="482" y="336" width="48" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="506" y="345" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">UNWIRED</text>

  <!-- ACE Pipeline -> LLM (straight vertical, dashed = opt-in) -->
  <line x1="768" y1="288" x2="768" y2="400" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#memx-arrow)"/>
  <rect x="712" y="338" width="48" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="736" y="347" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">OPT-IN</text>

  <!-- ============ NODES ============ -->

  <!-- Client Bindings -->
  <rect x="40" y="56" width="380" height="72" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="40" y="56" width="380" height="72" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <rect x="48" y="62" width="32" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="64" y="71" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">LOCAL</text>
  <text x="230" y="98" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Client Bindings</text>
  <text x="230" y="116" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">CLI · Python · Node.js · C FFI · Obsidian</text>

  <!-- Server Interfaces -->
  <rect x="460" y="56" width="380" height="72" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="460" y="56" width="380" height="72" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <rect x="468" y="62" width="44" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="490" y="71" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">NETWORK</text>
  <text x="650" y="98" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Server Interfaces</text>
  <text x="650" y="116" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">memorus-server · :8080 · stdio MCP</text>

  <!-- Memory API (focal) -->
  <rect x="40" y="200" width="380" height="88" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="40" y="200" width="380" height="88" rx="6" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1.2"/>
  <rect x="48" y="206" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-accent) 50%, transparent)" stroke-width="0.8"/>
  <text x="62" y="215" fill="var(--lurus-dg-accent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">CORE</text>
  <text x="230" y="244" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Memory API</text>
  <text x="230" y="262" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">.add() / .search()</text>
  <text x="230" y="276" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">config · traits · tenancy · history</text>

  <!-- ACE Pipeline (focal) -->
  <rect x="460" y="200" width="380" height="88" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="460" y="200" width="380" height="88" rx="6" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1.2"/>
  <rect x="468" y="206" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-accent) 50%, transparent)" stroke-width="0.8"/>
  <text x="482" y="215" fill="var(--lurus-dg-accent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">CORE</text>
  <text x="650" y="244" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">ACE Pipeline</text>
  <text x="650" y="262" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">Reflector → Curator → Decay → Generator</text>
  <text x="650" y="276" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">memorus-ace</text>

  <!-- Vector Store adapter -->
  <rect x="40" y="400" width="144" height="72" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="40" y="400" width="144" height="72" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <text x="112" y="438" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Vector Store</text>
  <text x="112" y="454" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">24 backends · sqlite</text>

  <!-- Embedder adapter -->
  <rect x="204" y="400" width="144" height="72" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="204" y="400" width="144" height="72" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <text x="276" y="438" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Embedder</text>
  <text x="276" y="454" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">8 backends · mock</text>

  <!-- Reranker adapter -->
  <rect x="368" y="400" width="144" height="72" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="368" y="400" width="144" height="72" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <text x="440" y="438" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Reranker</text>
  <text x="440" y="454" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">5 backends · 2 wired</text>

  <!-- Graph Store adapter (optional treatment: implemented, no caller) -->
  <rect x="532" y="400" width="144" height="72" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="532" y="400" width="144" height="72" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="604" y="438" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Graph Store</text>
  <text x="604" y="454" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">4 backends · no caller</text>

  <!-- LLM adapter (opt-in) -->
  <rect x="696" y="400" width="144" height="72" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="696" y="400" width="144" height="72" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <text x="768" y="438" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">LLM</text>
  <text x="768" y="454" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">4 + OpenAI-compat</text>

  <!-- ============ LEGEND ============ -->
  <line x1="24" y1="536" x2="856" y2="536" stroke="color-mix(in srgb, var(--lurus-dg-ink) 12%, transparent)" stroke-width="0.8"/>
  <text x="24" y="552" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.14em">LEGEND</text>

  <rect x="140" y="544" width="16" height="10" rx="2" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
  <text x="162" y="552" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.06em">CORE ENGINE</text>

  <line x1="420" y1="549" x2="444" y2="549" stroke="var(--lurus-dg-muted)" stroke-width="1.2"/>
  <text x="452" y="552" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.06em">WIRED BY DEFAULT</text>

  <line x1="680" y1="549" x2="704" y2="549" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="712" y="552" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.06em">OPT-IN OR UNWIRED</text>
  </svg>
</template>
