<!--
  自动生成，请勿手改 —— 改图请改产品仓的 docs/diagrams/architecture.svg，
  再跑 `bun run diagrams` 重新生成。手改这里会在下次生成时被覆盖。

  颜色/字体已换成 theme/diagrams.css 的 --lurus-dg-* 与站点字体变量，
  所以这一份 SVG 明暗两色都能用；图形与文案与 README 版逐字一致。
-->
<template>
  <svg viewBox="0 0 1188 576" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="lumen-architecture-title lumen-architecture-desc">
    <title id="lumen-architecture-title">Lumen's two-stage SDK-to-CLI trace pipeline</title>
    <desc id="lumen-architecture-desc">Diagram showing Lumen's two-stage architecture: your code calls its own LLM provider while the Python SDK writes trace JSON to disk for the embedded Rust core and CLI to read for replay, cost, and dashboard rendering, with Lumen never calling the LLM provider itself.</desc>
    <defs>
      <marker id="lumen-arr-muted" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-muted)"/></marker>
      <marker id="lumen-arr-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-accent)"/></marker>
      <marker id="lumen-arr-link" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-link)"/></marker>
    </defs>

    <rect width="100%" height="100%" fill="var(--lurus-dg-paper)"/>

    <!-- ===================== ANNOTATION CALLOUT ===================== -->
    <path d="M 376,46 Q 280,58 170,64" fill="none" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
    <circle cx="170" cy="64" r="2" fill="var(--lurus-dg-ink)"/>
    <text x="380" y="40" fill="var(--lurus-dg-ink)" font-size="14" font-style="italic" font-family="var(--lurus-dg-serif)" text-anchor="end">never called by Lumen</text>

    <!-- ===================== ARROWS (drawn before nodes) ===================== -->
    <!-- Arrow 1: Your Agent Code -> LLM Provider (vertical, link/external call) -->
    <line x1="120" y1="232" x2="120" y2="128" stroke="var(--lurus-dg-link)" stroke-width="1.2" marker-end="url(#lumen-arr-link)"/>
    <rect x="126" y="174" width="68" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="160" y="183" fill="var(--lurus-dg-link)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">API CALLS</text>

    <!-- Arrow 2: Your Agent Code -> Lumen SDK (instrument patch) -->
    <line x1="200" y1="264" x2="280" y2="264" stroke="var(--lurus-dg-muted)" stroke-width="1" marker-end="url(#lumen-arr-muted)"/>
    <rect x="216" y="244" width="48" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="240" y="253" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">PATCHES</text>

    <!-- Arrow 3: Lumen SDK -> Trace JSON (FOCAL write) -->
    <line x1="440" y1="264" x2="520" y2="264" stroke="var(--lurus-dg-accent)" stroke-width="1.4" marker-end="url(#lumen-arr-accent)"/>
    <rect x="450" y="244" width="60" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="480" y="253" fill="var(--lurus-dg-accent)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">WRITE JSON</text>

    <!-- Arrow 4: Trace JSON -> Lumen Core (read) -->
    <line x1="680" y1="264" x2="760" y2="264" stroke="var(--lurus-dg-muted)" stroke-width="1" marker-end="url(#lumen-arr-muted)"/>
    <rect x="692" y="244" width="56" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="720" y="253" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">READ JSON</text>

    <!-- Arrow 5: Lumen Core -> Lumen CLI (same binary, no HTTP) -->
    <line x1="920" y1="264" x2="1000" y2="264" stroke="var(--lurus-dg-muted)" stroke-width="1" marker-end="url(#lumen-arr-muted)"/>
    <rect x="936" y="244" width="48" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="960" y="253" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">NO HTTP</text>

    <!-- Arrow 6: Lumen CLI -> Kova + Netdata (optional, dashed) -->
    <line x1="1080" y1="296" x2="1080" y2="400" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#lumen-arr-muted)"/>
    <rect x="1086" y="342" width="56" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
    <text x="1114" y="351" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">OPTIONAL</text>

    <!-- ===================== NODES ===================== -->

    <!-- LLM Provider (external) -->
    <rect x="40" y="64" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="40" y="64" width="160" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 3%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="1"/>
    <rect x="48" y="72" width="32" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="0.8"/>
    <text x="64" y="81" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">EXT</text>
    <text x="120" y="100" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">LLM Provider</text>
    <text x="120" y="116" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">OpenAI · Anthropic APIs</text>

    <!-- Your Agent Code (input / user) -->
    <rect x="40" y="232" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="40" y="232" width="160" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-muted) 10%, transparent)" stroke="var(--lurus-dg-soft)" stroke-width="1"/>
    <rect x="48" y="240" width="32" height="12" rx="2" fill="transparent" stroke="var(--lurus-dg-soft)" stroke-width="0.8"/>
    <text x="64" y="249" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">USER</text>
    <text x="120" y="268" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Your Agent Code</text>
    <text x="120" y="284" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">OpenAI · Anthropic SDKs</text>

    <!-- Lumen SDK (backend, Python) -->
    <rect x="280" y="232" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="280" y="232" width="160" height="64" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
    <rect x="288" y="240" width="32" height="12" rx="2" fill="transparent" stroke="var(--lurus-dg-ink)" stroke-width="0.8"/>
    <text x="304" y="249" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">SDK</text>
    <text x="360" y="268" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Lumen SDK</text>
    <text x="360" y="284" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">instrument() · Python SDK</text>

    <!-- Trace JSON (store, FOCAL) -->
    <rect x="520" y="232" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="520" y="232" width="160" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
    <rect x="528" y="240" width="32" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-accent) 50%, transparent)" stroke-width="0.8"/>
    <text x="544" y="249" fill="var(--lurus-dg-accent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">STORE</text>
    <text x="600" y="268" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Trace JSON</text>
    <text x="600" y="284" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">on disk · LUMEN_TRACE_DIR</text>

    <!-- Lumen Core (backend, Rust engine) -->
    <rect x="760" y="232" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="760" y="232" width="160" height="64" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
    <rect x="768" y="240" width="32" height="12" rx="2" fill="transparent" stroke="var(--lurus-dg-ink)" stroke-width="0.8"/>
    <text x="784" y="249" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">CORE</text>
    <text x="840" y="268" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Lumen Core</text>
    <text x="840" y="284" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">embedded in CLI · no HTTP</text>

    <!-- Lumen CLI (backend, Rust CLI + dashboard) -->
    <rect x="1000" y="232" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="1000" y="232" width="160" height="64" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
    <rect x="1008" y="240" width="32" height="12" rx="2" fill="transparent" stroke="var(--lurus-dg-ink)" stroke-width="0.8"/>
    <text x="1024" y="249" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">CLI</text>
    <text x="1080" y="268" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Lumen CLI</text>
    <text x="1080" y="284" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">replay · cost · dashboard</text>

    <!-- Kova + Netdata (optional external) -->
    <rect x="1000" y="400" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
    <rect x="1000" y="400" width="160" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
    <rect x="1008" y="408" width="32" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="0.8"/>
    <text x="1024" y="417" fill="var(--lurus-dg-soft)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">OPT</text>
    <text x="1080" y="436" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Kova + Netdata</text>
    <text x="1080" y="452" fill="var(--lurus-dg-muted)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">metrics · terminal tab</text>

    <!-- ===================== LEGEND ===================== -->
    <line x1="40" y1="496" x2="1148" y2="496" stroke="color-mix(in srgb, var(--lurus-dg-ink) 12%, transparent)" stroke-width="0.8"/>
    <text x="40" y="512" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.16em">LEGEND</text>

    <rect x="40" y="520" width="14" height="10" rx="2" fill="color-mix(in srgb, var(--lurus-dg-muted) 10%, transparent)" stroke="var(--lurus-dg-soft)" stroke-width="1"/>
    <text x="60" y="529" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Your code</text>

    <rect x="200" y="520" width="14" height="10" rx="2" fill="color-mix(in srgb, var(--lurus-dg-ink) 3%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="1"/>
    <text x="220" y="529" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">External API</text>

    <rect x="360" y="520" width="14" height="10" rx="2" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
    <text x="380" y="529" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Lumen component</text>

    <rect x="560" y="520" width="14" height="10" rx="2" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
    <text x="580" y="529" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Focal · trace file</text>

    <rect x="760" y="520" width="14" height="10" rx="2" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="3,2"/>
    <text x="780" y="529" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Optional</text>

    <line x1="40" y1="552" x2="68" y2="552" stroke="var(--lurus-dg-muted)" stroke-width="1" marker-end="url(#lumen-arr-muted)"/>
    <text x="76" y="555" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Internal call</text>

    <line x1="300" y1="552" x2="328" y2="552" stroke="var(--lurus-dg-link)" stroke-width="1.2" marker-end="url(#lumen-arr-link)"/>
    <text x="336" y="555" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">LLM API call</text>

    <line x1="580" y1="552" x2="608" y2="552" stroke="var(--lurus-dg-accent)" stroke-width="1.4" marker-end="url(#lumen-arr-accent)"/>
    <text x="616" y="555" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Writes trace (focal)</text>

    <line x1="900" y1="552" x2="928" y2="552" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#lumen-arr-muted)"/>
    <text x="936" y="555" fill="var(--lurus-dg-muted)" font-size="8.5" font-family="var(--vp-font-family-base)">Optional path</text>
  </svg>
</template>
