---
title: Kova Quickstart
description: Launch your first Kova Agent in 5 minutes — a complete guide from installation to running.
---

<div class="kova-qs-page">

# Quickstart <StatusBadge status="dev" />

Launch your first Kova Agent in 5 minutes.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 min</span><span class="lurus-stat__label">Estimated time</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">Install methods</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Zero</span><span class="lurus-stat__label">External dependencies</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prerequisites</p>
    <div class="lurus-callout__body">Docker or Rust 1.93+ (either) · Lurus <Term t="API Key">API Key</Term> (<a href="/en/guide/get-api-key">how to get one</a>) · 8 GB+ RAM (recommended) · basic terminal knowledge. About 5 minutes.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package" :size="14" /> Install</span>
  <h2 class="lurus-section-head__title">Install Kova</h2>
  <p class="lurus-section-head__lede">Docker (recommended), a prebuilt binary, or build from source — pick whichever you prefer.</p>
</div>

<CodeShowcase
  title="Choose an installation method"
  :tabs="[
    { lang: 'bash', label: 'Docker (recommended)', code: 'docker run -d \\\n  --name kova \\\n  -p 8080:8080 \\\n  -v kova-data:/data \\\n  -e LURUS_API_KEY=sk-your-key \\\n  ghcr.io/hanmahong5-arch/kova:latest' },
    { lang: 'bash', label: 'Prebuilt binary', code: '# Linux / macOS\nchmod +x kova-linux-amd64\n./kova-linux-amd64 serve --port 8080' },
    { lang: 'bash', label: 'Build from source', code: 'git clone https://github.com/hanmahong5-arch/agentdrq.git\ncd agentdrq\n\n# 使用 pure-rust 特性（无系统依赖）\ncargo build --workspace --no-default-features --features pure-rust --release' },
  ]"
/>

Download prebuilt binaries from [GitHub Releases](https://github.com/hanmahong5-arch/agentdrq/releases):

| Platform | File |
|------|------|
| Linux x86_64 | `kova-linux-amd64` |
| macOS (Apple Silicon) | `kova-darwin-arm64` |
| macOS (Intel) | `kova-darwin-amd64` |
| Windows | `kova-windows-amd64.exe` |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Rust version requirement</p>
    <div class="lurus-callout__body">Kova requires Rust 1.93+ (Edition 2024). We recommend managing your toolchain with rustup.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Configure</span>
  <h2 class="lurus-section-head__title">Configuration</h2>
</div>

Create a configuration file `kova.toml`:

```toml
[server]
port = 8080
data_dir = "./data"

[llm]
# 通过 Lurus API 接入所有模型
provider = "openai-compatible"
base_url = "https://api.lurus.cn/v1"
api_key = "sk-your-lurus-key"
default_model = "deepseek-chat"

[wal]
# WAL 持久化配置
enabled = true
sync_mode = "normal"  # "normal" | "full" (每次写入 fsync)

[security]
# 可选：启用 WAL 加密
# encrypt = true
# encrypt_algorithm = "aes-256-gcm"
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> Get started</span>
  <h2 class="lurus-section-head__title">Launch your first Agent</h2>
  <p class="lurus-section-head__lede">Use REST, the Rust SDK, or the CLI to create an Agent, send a task, and stream its execution.</p>
</div>

Once it's running, pick the integration method you're comfortable with to create and run your first Agent (see the [API Reference](/en/kova/api) for the full endpoint list).

:::tabs
== REST API

1. **Create an Agent** — `POST /api/v1/agents`, the response contains `id="agt_a1b2c3d4"` and `status="idle"`

```bash
curl -X POST http://localhost:8080/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{ "name": "researcher", "system_prompt": "你是一个专业的技术研究员，深入分析主题并给出结构化研究报告。", "model": "deepseek-chat", "tools": ["web_search", "file_write"] }'
```

2. **Send a task** — `POST /api/v1/agents/{id}/tasks`, the response contains `task_id="tsk_e5f6g7h8"` and `status="running"`

```bash
curl -X POST http://localhost:8080/api/v1/agents/agt_a1b2c3d4/tasks \
  -H "Content-Type: application/json" \
  -d '{ "message": "研究 Rust 在 AI 基础设施中的应用趋势，输出一份 500 字的报告" }'
```

3. **View / stream** — `GET /api/v1/tasks/{id}` or watch the execution live over WebSocket

```bash
curl http://localhost:8080/api/v1/tasks/tsk_e5f6g7h8
wscat -c ws://localhost:8080/api/v1/tasks/tsk_e5f6g7h8/stream
```

== Rust SDK

Embed the Kova engine directly in your process and recover automatically from the local WAL after a crash:

```rust
use kova::prelude::*;

let engine = KovaBuilder::new()
    .wal_dir("./agent-state")
    .build()?;

let agent = engine.create_agent("researcher")
    .model("deepseek-chat")
    .tools(&["web_search", "file_read"])
    .build()?;

// Agent 崩溃 → 从 WAL 自动恢复，不重调 LLM
agent.run("帮我调研 WASM Component Model").await?;
```

== CLI

Kova ships with a built-in TUI (terminal user interface) and a command line:

```bash
# 启动 TUI
kova tui

# 或直接用 CLI 命令
kova agent create --name researcher --model deepseek-chat
kova agent run researcher "分析 Rust 在 AI 领域的应用"
kova agent list
kova agent logs researcher --tail 50
```
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Workflow</span>
  <h2 class="lurus-section-head__title">Create a workflow</h2>
</div>

A workflow chains multiple steps into an ordered execution pipeline (steps pass values to each other via template variables — see the example below):

```bash
curl -X POST http://localhost:8080/api/v1/workflows \
  -H "Content-Type: application/json" \
  -d '{ "name": "content-pipeline", "steps": [
    { "name": "research", "agent": "researcher", "prompt": "研究主题：{{input.topic}}" },
    { "name": "write", "agent": "writer", "prompt": "基于研究报告撰写博客：\n{{steps.research.output}}" },
    { "name": "review", "agent": "editor", "prompt": "审校并优化：\n{{steps.write.output}}" }
  ] }'

# 触发
curl -X POST http://localhost:8080/api/v1/workflows/content-pipeline/run \
  -H "Content-Type: application/json" -d '{"input": {"topic": "边缘计算与 AI 推理"}}'
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="database-backup" :size="14" /> Persistence</span>
  <h2 class="lurus-section-head__title">Verify persistence</h2>
  <p class="lurus-section-head__lede">Kill the process, and after a restart the task automatically resumes from the WAL checkpoint.</p>
</div>

Test Kova's crash-recovery capability:

<ol class="lurus-steps">
<li>

**Start a long-running task**

```bash
kova agent run researcher "写一份 5000 字的深度报告"
```

</li>
<li>

**While the task is running, forcibly terminate the process**

```bash
kill -9 $(pgrep kova)
```

</li>
<li>

**Restart Kova**

```bash
./kova serve
```

</li>
<li>

**Check the task status** — it resumes automatically from the checkpoint

```bash
kova task status
```

</li>
</ol>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Why recovery works</p>
    <div class="lurus-callout__body">Every step writes to the <Term t="WAL">WAL</Term> (with a CRC32 checksum) before it executes. When the process crashes, any step that wasn't confirmed complete is replayed from the checkpoint after restart — no re-calling the LLM, no lost progress. See <a href="/en/kova/concepts">Core Concepts</a> for details.</div>
  </div>
</div>

---

## Next steps

<NextSteps
  :steps="[
    { text: 'Core Concepts — a deep dive into the Agent, Workflow, and WAL architecture', link: '/en/kova/concepts', primary: true },
    { text: 'API Reference — the complete list of REST API endpoints', link: '/en/kova/api' },
    { text: 'Lurus API — learn about the underlying LLM gateway', link: '/en/guide/introduction' },
  ]"
/>

</div>
