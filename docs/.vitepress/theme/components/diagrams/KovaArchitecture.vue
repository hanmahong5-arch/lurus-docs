<!--
  自动生成，请勿手改 —— 改图请改产品仓的 docs/diagrams/architecture.svg，
  再跑 `bun run diagrams` 重新生成。手改这里会在下次生成时被覆盖。

  颜色/字体已换成 theme/diagrams.css 的 --lurus-dg-* 与站点字体变量，
  所以这一份 SVG 明暗两色都能用；图形与文案与 README 版逐字一致。
-->
<template>
  <svg viewBox="0 0 960 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="kova-architecture-title kova-architecture-desc">
  <title id="kova-architecture-title">Kova runtime architecture</title>
  <desc id="kova-architecture-desc">Requests enter Kova through a REST front end into a durable agent loop, or through gRPC and MCP/A2A front ends directly into the same queue engine; every directive, result, and task is appended to a write-ahead log before being considered done, and on restart the log is replayed back into the agent loop, skipping already-completed LLM calls.</desc>
  <defs>
    <marker id="kova-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-muted)"/>
    </marker>
    <marker id="kova-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-accent)"/>
    </marker>
    <marker id="kova-arrow-link" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-link)"/>
    </marker>
  </defs>

  <rect width="960" height="600" fill="var(--lurus-dg-paper)"/>

  <!-- ===== ARROWS (drawn before nodes) ===== -->

  <!-- A1: Forge -> REST API (straight vertical, HTTP) -->
  <path d="M480,104 V136" fill="none" stroke="var(--lurus-dg-link)" stroke-width="1.2" marker-end="url(#kova-arrow-link)"/>
  <rect x="488" y="114" width="72" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="524" y="123" fill="var(--lurus-dg-link)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">HTTP</text>

  <!-- A2: REST API -> Agent Loop (straight vertical, DISPATCH) -->
  <path d="M480,200 V232" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#kova-arrow)"/>
  <rect x="488" y="210" width="72" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="524" y="219" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">DISPATCH</text>

  <!-- A3: Agent Loop -> Queue Engine (straight vertical, SCHEDULE) -->
  <path d="M480,296 V328" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#kova-arrow)"/>
  <rect x="488" y="306" width="72" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="524" y="315" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">SCHEDULE</text>

  <!-- A4: Queue Engine -> WAL (straight vertical, APPEND) -->
  <path d="M480,392 V424" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#kova-arrow)"/>
  <rect x="488" y="402" width="72" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="524" y="411" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">APPEND</text>

  <!-- A5: gRPC server -> Queue Engine (dashed, experimental transport talks to the queue directly; hops over the accent replay line at x=336) -->
  <path d="M272,200 V300 Q272,308 280,308 H328 a8,8 0 0,1 16,0 H432 Q440,308 440,316 V328"
        fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="5,4" marker-end="url(#kova-arrow)"/>

  <!-- A6: MCP / A2A -> Queue Engine (solid elbow; kova-mcp/kova-a2a lib.rs+main.rs only import kova::queue::completion::CompletionHandle + QueueEngineConfig/QueueMode/QueueSystem, same shape as gRPC's A5 -- neither touches kova::agent) -->
  <path d="M688,200 V300 Q688,308 680,308 H568 Q560,308 560,316 V328"
        fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#kova-arrow)"/>

  <!-- A7: Queue Engine -> Event Store (dashed, optional flush; kova/src/event/flush.rs's own architecture comment draws Worker/Queue -> FlushSender -> EventFlushEngine -> PgEventStore, "completely decoupled from the enqueue/dequeue hot path" -- the WAL module has no calls into event::/PgEventStore) -->
  <path d="M600,372 H680 Q688,372 688,380 V424" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="5,4" marker-end="url(#kova-arrow)"/>
  <rect x="620" y="352" width="40" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="640" y="361" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.06em">FLUSH</text>

  <!-- A8: WAL -> Agent Loop (accent dashed, crash-recovery replay; routed left of Queue Engine / Agent Loop, clear of both boxes) -->
  <path d="M400,456 H344 Q336,456 336,448 V272 Q336,264 344,264 H360"
        fill="none" stroke="var(--lurus-dg-accent)" stroke-width="1.2" stroke-dasharray="5,4" marker-end="url(#kova-arrow-accent)"/>
  <rect x="288" y="354" width="40" height="12" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="324" y="363" fill="var(--lurus-dg-accent)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="end" letter-spacing="0.06em">REPLAY</text>

  <!-- ===== NODES ===== -->

  <!-- Forge workbench (external) -->
  <rect x="380" y="40" width="200" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="380" y="40" width="200" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 3%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="1"/>
  <rect x="388" y="48" width="24" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="400" y="57" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">UI</text>
  <text x="480" y="76" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Forge workbench</text>
  <text x="480" y="90" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">HITL · runs · eval</text>

  <!-- gRPC server (optional / experimental) -->
  <rect x="184" y="136" width="176" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="184" y="136" width="176" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <rect x="192" y="144" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="206" y="153" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">RPC</text>
  <text x="272" y="172" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">gRPC (exp.)</text>
  <text x="272" y="186" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">kova-server · tonic</text>

  <!-- REST API (backend) -->
  <rect x="392" y="136" width="176" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="392" y="136" width="176" height="64" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <rect x="400" y="144" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="414" y="153" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">API</text>
  <text x="480" y="172" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">REST API</text>
  <text x="480" y="186" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">kova-rest · Axum</text>

  <!-- MCP / A2A (backend) -->
  <rect x="600" y="136" width="176" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="600" y="136" width="176" height="64" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <rect x="608" y="144" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="622" y="153" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">MCP</text>
  <text x="688" y="172" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">MCP · A2A</text>
  <text x="688" y="186" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">kova-mcp · kova-a2a</text>

  <!-- Agent Loop (backend, core engine) -->
  <rect x="360" y="232" width="240" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="360" y="232" width="240" height="64" rx="6" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <rect x="368" y="240" width="32" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="384" y="249" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">CORE</text>
  <text x="480" y="268" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Agent Loop</text>
  <text x="480" y="282" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">Worker · Workflow · Swarm</text>

  <!-- Queue Engine (store) -->
  <rect x="360" y="328" width="240" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="360" y="328" width="240" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)" stroke="var(--lurus-dg-muted)" stroke-width="1"/>
  <rect x="368" y="336" width="36" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="386" y="345" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">QUEUE</text>
  <text x="480" y="364" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Queue Engine</text>
  <text x="480" y="378" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">skip-list · ring buffer</text>

  <!-- WAL (focal / accent) -->
  <rect x="400" y="424" width="160" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="400" y="424" width="160" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1.2"/>
  <rect x="408" y="432" width="28" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-accent) 50%, transparent)" stroke-width="0.8"/>
  <text x="422" y="441" fill="var(--lurus-dg-accent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">WAL</text>
  <text x="480" y="460" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Write-Ahead Log</text>
  <text x="480" y="474" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">CRC32 · crash-safe</text>

  <!-- Event Store (optional) -->
  <rect x="600" y="424" width="176" height="64" rx="6" fill="var(--lurus-dg-paper)"/>
  <rect x="600" y="424" width="176" height="64" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <rect x="608" y="432" width="24" height="12" rx="2" fill="transparent" stroke="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)" stroke-width="0.8"/>
  <text x="620" y="441" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="7" font-family="var(--vp-font-family-mono)" text-anchor="middle" letter-spacing="0.08em">DB</text>
  <text x="688" y="460" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Event Store</text>
  <text x="688" y="474" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">PostgreSQL · optional</text>

  <!-- ===== LEGEND ===== -->
  <line x1="40" y1="508" x2="920" y2="508" stroke="color-mix(in srgb, var(--lurus-dg-ink) 12%, transparent)" stroke-width="0.8"/>
  <text x="40" y="528" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.14em">LEGEND</text>

  <line x1="140" y1="524" x2="156" y2="524" stroke="var(--lurus-dg-muted)" stroke-width="1.2"/>
  <text x="164" y="528" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.04em">SOLID = RUNTIME CALL</text>

  <line x1="360" y1="524" x2="376" y2="524" stroke="var(--lurus-dg-link)" stroke-width="1.2"/>
  <text x="384" y="528" fill="var(--lurus-dg-link)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.04em">BLUE = HTTP CALL</text>

  <line x1="540" y1="524" x2="556" y2="524" stroke="var(--lurus-dg-muted)" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="564" y="528" fill="var(--lurus-dg-muted)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.04em">DASHED = OPTIONAL / EXPERIMENTAL</text>

  <line x1="800" y1="524" x2="816" y2="524" stroke="var(--lurus-dg-accent)" stroke-width="1.2" stroke-dasharray="4,3"/>
  <text x="824" y="528" fill="var(--lurus-dg-accent)" font-size="8" font-family="var(--vp-font-family-mono)" letter-spacing="0.04em">ACCENT = REPLAY</text>

  </svg>
</template>
