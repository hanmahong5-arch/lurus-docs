---
title: Kova Core Concepts
description: Kova's core architecture components and design philosophy — WAL, Agent Loop, Checkpoint, and more.
---

<div class="kova-concepts">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> Core Concepts</span>
  <h1 class="lurus-section-head__title">Kova Core Concepts</h1>
  <p class="lurus-section-head__lede">From Agent, Workflow, and Swarm to WAL persistence — understand Kova's core architecture components and design philosophy.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3μs</span><span class="lurus-stat__label">scheduling latency</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">315K</span><span class="lurus-stat__label">ops/s throughput</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">21</span><span class="lurus-stat__label">workspace crates</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">&lt;10MB</span><span class="lurus-stat__label">single binary</span></div>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--kova" href="#agent"><span class="lurus-card__icon"><Icon name="bot" :size="22" /></span><div class="lurus-card__title">Agent</div><p class="lurus-card__body">Basic unit of execution: Prompt + Model + Tools + Memory</p></a>
  <a class="lurus-card lurus-card--kova" href="#workflow"><span class="lurus-card__icon"><Icon name="workflow" :size="22" /></span><div class="lurus-card__title">Workflow</div><p class="lurus-card__body">Orchestrate multiple Agents into an ordered execution pipeline</p></a>
  <a class="lurus-card lurus-card--kova" href="#swarm-swarm-intelligence"><span class="lurus-card__icon"><Icon name="network" :size="22" /></span><div class="lurus-card__title">Swarm</div><p class="lurus-card__body">Multiple Agents collaborate autonomously, communicating directly via the A2A protocol</p></a>
  <a class="lurus-card lurus-card--kova" href="#wal-write-ahead-log"><span class="lurus-card__icon"><Icon name="database-backup" :size="22" /></span><div class="lurus-card__title">WAL</div><p class="lurus-card__body">Write-ahead log + CRC32 checksums, automatic crash recovery</p></a>
</div>

---

## Agent

An Agent is the basic unit of execution, composed of the following elements:

| Element | Description |
|------|------|
| **<Term t="System Prompt">System Prompt</Term>** | Defines the Agent's role, capability boundaries, and behavioral norms |
| **Model** | The LLM model in use (switchable at runtime) |
| **Tools** | The set of tools the Agent can invoke |
| **Memory** | The Agent's conversation history and persisted state |

### Agent Lifecycle

<ArchitectureDiagram title="Agent State Machine" chart="graph LR
  Created --> Idle
  Idle --> Running
  Running --> Completed
  Running --> Paused
  Running --> Failed
  Running --> Recovering
  Paused -.resume.-> Running
  Recovering -.replay WAL.-> Running" />

| State | Meaning |
|------|------|
| **Idle** | Agent created, awaiting a task |
| **Running** | Executing a task |
| **Paused** | Manually paused, can be resumed |
| **Completed** | Task finished |
| **Failed** | Execution failed (retry limit exceeded) |
| **Recovering** | Detected an incomplete WAL record, recovering automatically |

### Agent Decision Loop

<ArchitectureDiagram title="Decision Loop" chart="graph LR
  A[Receive task / previous result] --> B[LLM reasoning<br/>analyze + plan]
  B --> C{Tools needed?}
  C -->|Yes| D[Invoke tool] --> E[Tool result] --> B
  C -->|No| F[Generate final answer] --> G[Return result]" />

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Every round is persisted to disk</p>
    <div class="lurus-callout__body">Every decision round is written to the WAL, ensuring that after a crash execution can replay from the breakpoint without re-invoking the LLM.</div>
  </div>
</div>

---

## Workflow

A Workflow orchestrates multiple Agents or steps into an ordered execution pipeline.

### Step Types

| Type | Description |
|------|------|
| **Agent step** | Delegates execution to a specified Agent |
| **Conditional branch** | Chooses a different path based on the previous step's result |
| **Parallel step** | Multiple steps execute simultaneously |
| **Wait step** | Waits for an external event or human approval |
| **Loop step** | Repeats execution until a condition is met |

### Data Passing

Steps pass data between one another via template variables:

```
{{input.topic}}              → 工作流输入参数
{{steps.research.output}}    → "research" 步骤的输出
{{steps.research.metadata}}  → "research" 步骤的元数据
```

### Error Handling

Each step can be configured with its own error strategy:

| Strategy | Behavior |
|------|------|
| `retry` | Retry N times (default 3, exponential backoff) |
| `skip` | Skip the failed step and continue |
| `abort` | Terminate the entire workflow |
| `fallback` | Switch to a backup step |

---

## <Term t="Swarm">Swarm</Term> (Swarm Intelligence)

Swarm mode lets multiple Agents collaborate autonomously, without a predefined fixed process.

### How It Works

<ArchitectureDiagram title="Swarm Collaboration Flow" chart="graph LR
  U[User task] --> C[Coordinator Agent]
  C --> S[Decompose subtasks]
  S --> R[Research Agent]
  S --> D[Coding Agent]
  S --> T[Testing Agent]
  R --> M[Collect results]
  D --> M
  T --> M
  M --> O[Synthesize output]" />

Agents communicate directly via the <Term t="A2A">A2A (Agent-to-Agent)</Term> protocol:

```json
{
  "from": "coordinator",
  "to": "researcher",
  "type": "task_delegate",
  "payload": {
    "task": "调研 WebAssembly 在服务端的性能基准",
    "constraints": {
      "max_tokens": 2000,
      "deadline": "5min"
    }
  }
}
```

---

## <Term t="WAL">WAL</Term> (Write-Ahead Log)

The WAL is the core mechanism of Kova's persistence, drawing on database system design.

### Write Flow

<ArchitectureDiagram title="WAL Write Flow" chart="graph LR
  A[Agent state change] --> B[Serialize + CRC32<br/>compute checksum]
  B --> C[Write to WAL file<br/>log first]
  C --> D[Perform the actual operation]
  D --> E[Mark WAL complete<br/>confirm commit]" />

### Recovery Flow

On startup, the WAL is scanned automatically to recover incomplete operations:

<ol class="lurus-steps">
<li>Completed records — <strong>skip</strong>.</li>
<li>CRC32 check failure — <strong>mark as corrupted and skip</strong>.</li>
<li>Incomplete records — <strong>re-execute</strong>.</li>
</ol>

### <Term t="Ring Buffer">Ring Buffer</Term>

The WAL uses a power-of-2-sized ring buffer:

- The write pointer wraps around automatically when it reaches the end
- Confirmed old records are overwritten by new ones
- Compaction is triggered when the buffer is full

### Sync Modes

| Mode | Description | Performance | Durability |
|------|------|------|--------|
| `normal` | The operating system decides when to fsync | High | May lose a few seconds of data |
| `full` | fsync on every write | Low | Zero data loss |

### Encryption Options

WAL encryption can be enabled for sensitive scenarios:

| Algorithm | Description |
|------|------|
| `aes-256-gcm` | Standard AES-256 encryption |
| `sm4` | Chinese national SM4 algorithm |

HMAC integrity verification can also be enabled to prevent tampering with WAL files.

---

## Lock Ordering

Kova internally uses a strict lock-acquisition order to fundamentally eliminate deadlocks:

<ArchitectureDiagram title="Lock Acquisition Order" chart="graph LR
  A[Buffer Lock] --> B[Queue Lock] --> C[Transaction Lock]" />

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Compile-time deadlock prevention</p>
    <div class="lurus-callout__body">All code paths must observe this order. Attempting to acquire locks in violation of the order triggers a compile-time check (guaranteed by Rust's type system).</div>
  </div>
</div>

---

## Tool System

### Built-in Tools

| Tool | Function |
|------|------|
| `web_search` | Search the internet |
| `file_read` | Read a file |
| `file_write` | Write a file |
| `http_request` | Send an HTTP request |
| `shell_exec` | Execute a shell command (sandboxed environment) |
| `db_query` | Query a database |

### MCP Tools

Connect to external tool services via the [Model Context Protocol](https://modelcontextprotocol.io/):

```toml
# kova.toml
[[mcp.servers]]
name = "github"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
env = { GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_xxx" }

[[mcp.servers]]
name = "postgres"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-postgres"]
env = { DATABASE_URL = "postgres://..." }
```

Agents can invoke MCP tools exactly as they would built-in tools.

### A2A Protocol

The Agent-to-Agent communication protocol supports:

- **Task delegation**: One Agent hands a subtask to another
- **Information query**: Agents exchange information directly
- **Result notification**: Notify the initiator once a task completes
- **Capability discovery**: Query what other Agents can do

---

## Feature Tiers

Kova uses Rust feature flags to control compilation scope. A minimal build needs only `pure-rust`, with layers added as needed: `serde` (serialization), `workflow` (workflow orchestration) → `agent` (Agent engine) → `swarm` (swarm intelligence), `encrypt` (encryption) → `sm4` (Chinese national cryptography) / `wal-hmac` (integrity verification), and so on.

---

## Next Steps

<NextSteps title="Next Steps" :steps="[
  { text: 'Quickstart — launch your first Agent in 5 minutes', link: '/en/kova/quickstart', primary: true },
  { text: 'API Reference — complete REST endpoint documentation', link: '/en/kova/api' },
  { text: 'MemX Memory Engine — add persistent memory to your Agents', link: '/en/memx/' },
]" />

<RelatedProducts product-id="kova" />

</div>

<style scoped>
.kova-concepts .lurus-stat-strip {
  margin: 1.5rem 0 2rem;
}
.kova-concepts .lurus-cards--compact {
  margin-bottom: 0.5rem;
}
</style>
