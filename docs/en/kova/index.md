---
title: Kova — Durable Execution Engine for AI Agents
description: WAL-First architecture built in Rust, with automatic crash recovery, microsecond-scale scheduling, and zero external dependencies.
---

<div class="kova-page">

<ProductHero product-id="kova" />

<MetricStats :items="[
  { label: 'FIFO scheduling', value: '3.17μs', hint: 'Criterion full pipeline' },
  { label: 'Throughput', value: '315K ops/s' },
  { label: 'Codebase', value: '178K LOC', hint: '21-crate workspace' },
  { label: 'External deps', value: 'Zero', hint: 'No Redis / Postgres' },
]" />

## What is Kova?

**Kova** is Lurus's core AI Agent infrastructure — a high-performance, durable execution engine built in Rust. It solves **how agents reliably run for long periods, recover their state after a crash, and coordinate complex workflows**. Traditional frameworks (LangChain, CrewAI) run in memory, so state is lost the moment the process exits. Kova adopts a <Term t="WAL">WAL (Write-Ahead Log)</Term>-first architecture: every execution step is persisted as a record, so even after a crash it can recover precisely to the point of interruption — without re-calling the LLM, losing progress, or incurring extra cost.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Key metrics</p>
    <div class="lurus-callout__body"><Term t="FIFO">FIFO</Term> full-pipeline latency of <strong>3.17μs</strong> (Criterion benchmark, see <code>docs/benchmark-report.md</code>), <strong>315K ops/s</strong> throughput, and <strong>zero external service dependencies</strong>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Core capabilities</span>
  <h2 class="lurus-section-head__title">Why choose Kova</h2>
  <p class="lurus-section-head__lede">WAL-First durability, microsecond-scale scheduling, zero-dependency deployment, and four access methods.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-kova)"
  :items="[
    { title: 'WAL crash recovery', body: 'Write-ahead log + CRC32 checksum per step; replays from the breakpoint after a crash, without re-calling the LLM', icon: 'database-backup' },
    { title: '3μs scheduling latency', body: 'FIFO full-pipeline Criterion benchmark of 3.17μs, 315K ops/s throughput', icon: 'gauge' },
    { title: 'Zero external dependencies', body: 'No Redis / Postgres required; runs with just a local WAL file', icon: 'package' },
    { title: 'Four access methods', body: 'Rust SDK / gRPC / REST / MCP, modularized across a 21-crate workspace', icon: 'puzzle' },
  ]"
/>

### WAL-First durability

All state changes are written to the WAL before they execute; on a crash, state is replayed from the WAL:

<ol class="lurus-steps">
<li>

**Agent decision** — the engine determines the next action

</li>
<li>

**WAL write (CRC32)** — persists a record + checksum to guard against corruption

</li>
<li>

**Execution** — actually invokes the tool / LLM

</li>
<li>

**Completion confirmed** — marks the step as committed; on a crash, unconfirmed steps are automatically replayed

</li>
</ol>

CRC32 checksums guard against corruption; a power-of-2 ring buffer makes efficient use of storage; and a strict **Buffer → Queue → Txn** lock order guarantees freedom from deadlock.

### Agent orchestration

| Mode | Description | Use cases |
|------|------|---------|
| **Single agent** | Executes a task independently | Simple automation |
| **Workflow** | Multi-step ordered execution | Data pipelines, approval flows |
| **Swarm** | Multiple agents collaborating autonomously | Complex research, multi-role simulation |

### Tool ecosystem and multi-model support

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span>
    <div class="lurus-card__title">Tool ecosystem</div>
    <p class="lurus-card__body">Built-in tools (file / HTTP / database / shell), <Term t="MCP">MCP</Term> (connect to any MCP-compatible tool service, see the <a href="/integrations/">integrations directory</a>), <Term t="A2A">A2A</Term> (direct agent-to-agent communication and task delegation), and custom tools (extend via Rust or a REST API).</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">Multi-model support</div>
    <p class="lurus-card__body">Access all mainstream LLMs through the <a href="/en/guide/introduction">Lurus API</a> (DeepSeek for everyday use / GPT-4o for reasoning / Claude for long contexts / Gemini for multimodal), switching dynamically per task at runtime.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> Architecture</span>
  <h2 class="lurus-section-head__title">Architecture overview</h2>
  <p class="lurus-section-head__lede">REST/SDK/gRPC/MCP access · Kova Core scheduling · WAL durability and recovery.</p>
</div>

<ArchitectureDiagram
  title="Kova execution architecture"
  chart="graph LR
  A[Client SDK / gRPC / REST] --> B[Kova Core]
  B --> C[WAL Writer<br/>CRC32]
  B --> D[Scheduler<br/>FIFO]
  B --> E[Tool Runtime<br/>MCP]
  C -.recover.-> B
  D --> F[LLM Provider<br/>via Lurus API]"
/>

```
Kova REST API (Axum: 35+ endpoints, WebSocket)
 → Kova Core: Agent Engine(单/多 Agent) + Workflow(有序编排)
              → WAL + Ring Buffer(持久化状态管理 CRC32)
              子 crate: kova-llm / kova-tools / kova-mcp
```

Kova is a workspace of **21 Rust crates**, **178,284 lines of code**, and **1,565+ tests** (loom concurrency / proptest / chaos) plus **4 fuzz targets**. It is currently a **v0.2.0 pre-release** (heading toward 1.0.0-beta.1), with strict lints fully enabled (`#[deny(clippy::unwrap_used, clippy::panic, missing_docs)]`).

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> Scenarios</span>
  <h2 class="lurus-section-head__title">Where Kova fits</h2>
</div>

| Scenario | Kova's advantage |
|------|-----------|
| **Long-running agents** | WAL durability with automatic recovery after a crash |
| **Complex workflows** | Multi-step orchestration, conditional branches, parallel execution |
| **Multi-agent collaboration** | Swarm mode with direct agent-to-agent communication |
| **Enterprise deployment** | Rust performance, low resource footprint, no GC pauses |
| **MCP tool integration** | Native support for the Model Context Protocol |
| **Security-sensitive scenarios** | Optional encryption (SM4/AES), WAL HMAC integrity verification |

<UserScenarios
  title="Get started by role"
  :scenarios="[
    { role: 'Developer', title: 'Spin up a durable agent in 5 minutes', summary: 'cargo add kova + 3 lines of code', link: '/en/kova/quickstart' },
    { role: 'Architect', title: 'Replace the LangGraph Checkpointer', summary: 'Use Kova to store checkpoints in a LangGraph project', link: '/tutorials/lumen-kova-langgraph' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Comparison</span>
  <h2 class="lurus-section-head__title">Compared with other agent frameworks</h2>
</div>

| Capability | LangChain | CrewAI | AutoGen | **Kova** |
|------|-----------|--------|---------|----------|
| Language | Python | Python | Python | **Rust** |
| State persistence | None (needs external) | None | None | **WAL-First** |
| Crash recovery | None | None | None | **Automatic recovery** |
| Performance | Medium | Medium | Medium | **Very high** |
| Memory efficiency | Low | Low | Low | **Very high** |
| MCP support | Third-party | None | None | **Native** |
| A2A protocol | None | None | None | **Native** |
| Encryption | None | None | None | **SM4-GCM / ChaCha20** |
| Multi-protocol | None | None | None | **Four access methods: Rust SDK / gRPC / REST / MCP** |
| Deployment form | Python process | Python process | Python process | **Single binary / container / embedded library** |

---

## Next steps

<NextSteps
  :steps="[
    { text: 'Quickstart — launch your first Kova agent', link: '/en/kova/quickstart', primary: true },
    { text: 'Core concepts — go deep on WAL, agents, and workflows', link: '/en/kova/concepts' },
    { text: 'API reference — the complete REST API documentation', link: '/en/kova/api' },
    { text: 'Integrations and MCP directory', link: '/integrations/' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="kova" />

</div>

<style>
.kova-page .lurus-card--kova .lurus-card__body a {
  color: var(--lurus-color-kova);
  font-weight: 600;
}
</style>
