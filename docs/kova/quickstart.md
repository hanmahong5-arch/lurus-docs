---
title: Kova 快速开始
description: 5 分钟启动第一个 Kova Agent，从安装到运行的完整指南。
---

<div class="kova-qs-page">

# 快速开始 <StatusBadge status="dev" />

5 分钟启动第一个 Kova Agent。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 分钟</span><span class="lurus-stat__label">预计耗时</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 种</span><span class="lurus-stat__label">安装方式</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">零</span><span class="lurus-stat__label">外部依赖</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前置条件</p>
    <div class="lurus-callout__body">Docker 或 Rust 1.93+（任选）· Lurus <Term t="API Key">API Key</Term>（<a href="/guide/get-api-key">获取方式</a>）· 8 GB+ 内存（推荐）· 基本终端知识。预计 5 分钟。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package" :size="14" /> 安装</span>
  <h2 class="lurus-section-head__title">安装 Kova</h2>
  <p class="lurus-section-head__lede">Docker（推荐）、预编译二进制、或从源码构建，任选其一。</p>
</div>

<CodeShowcase
  title="选择一种安装方式"
  :tabs="[
    { lang: 'bash', label: 'Docker（推荐）', code: 'docker run -d \\\n  --name kova \\\n  -p 8080:8080 \\\n  -v kova-data:/data \\\n  -e LURUS_API_KEY=sk-your-key \\\n  ghcr.io/hanmahong5-arch/kova:latest' },
    { lang: 'bash', label: '预编译二进制', code: '# Linux / macOS\nchmod +x kova-linux-amd64\n./kova-linux-amd64 serve --port 8080' },
    { lang: 'bash', label: '从源码构建', code: 'git clone https://github.com/hanmahong5-arch/agentdrq.git\ncd agentdrq\n\n# 使用 pure-rust 特性（无系统依赖）\ncargo build --workspace --no-default-features --features pure-rust --release' },
  ]"
/>

预编译二进制从 [GitHub Releases](https://github.com/hanmahong5-arch/agentdrq/releases) 下载：

| 平台 | 文件 |
|------|------|
| Linux x86_64 | `kova-linux-amd64` |
| macOS (Apple Silicon) | `kova-darwin-arm64` |
| macOS (Intel) | `kova-darwin-amd64` |
| Windows | `kova-windows-amd64.exe` |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Rust 版本要求</p>
    <div class="lurus-callout__body">Kova 要求 Rust 1.93+ (Edition 2024)。推荐使用 rustup 管理工具链。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 配置</span>
  <h2 class="lurus-section-head__title">配置</h2>
</div>

创建配置文件 `kova.toml`：

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
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> 上手</span>
  <h2 class="lurus-section-head__title">启动你的第一个 Agent</h2>
  <p class="lurus-section-head__lede">REST / Rust SDK / CLI 任选，创建 Agent、发送任务、流式查看执行。</p>
</div>

启动后，选择你习惯的接入方式创建并运行第一个 Agent（完整端点见 [API 参考](/kova/api)）。

:::tabs
== REST API

1. **创建 Agent** — `POST /api/v1/agents`，响应含 `id="agt_a1b2c3d4"`、`status="idle"`

```bash
curl -X POST http://localhost:8080/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{ "name": "researcher", "system_prompt": "你是一个专业的技术研究员，深入分析主题并给出结构化研究报告。", "model": "deepseek-chat", "tools": ["web_search", "file_write"] }'
```

2. **发送任务** — `POST /api/v1/agents/{id}/tasks`，响应含 `task_id="tsk_e5f6g7h8"`、`status="running"`

```bash
curl -X POST http://localhost:8080/api/v1/agents/agt_a1b2c3d4/tasks \
  -H "Content-Type: application/json" \
  -d '{ "message": "研究 Rust 在 AI 基础设施中的应用趋势，输出一份 500 字的报告" }'
```

3. **查看 / 流式跟踪** — `GET /api/v1/tasks/{id}` 或经 WebSocket 实时查看执行过程

```bash
curl http://localhost:8080/api/v1/tasks/tsk_e5f6g7h8
wscat -c ws://localhost:8080/api/v1/tasks/tsk_e5f6g7h8/stream
```

== Rust SDK

直接在进程内嵌入 Kova 引擎，崩溃后从本地 WAL 自动恢复：

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

Kova 内置 TUI（终端交互界面）与命令行：

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
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 工作流</span>
  <h2 class="lurus-section-head__title">创建工作流</h2>
</div>

工作流将多个步骤串联成有序的执行管道（步骤间通过模板变量传值，示例见下）：

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
  <span class="lurus-section-head__eyebrow"><Icon name="database-backup" :size="14" /> 持久化</span>
  <h2 class="lurus-section-head__title">验证持久化</h2>
  <p class="lurus-section-head__lede">杀掉进程，重启后任务自动从 WAL 中断点恢复。</p>
</div>

测试 Kova 的崩溃恢复能力：

<ol class="lurus-steps">
<li>

**启动一个长任务**

```bash
kova agent run researcher "写一份 5000 字的深度报告"
```

</li>
<li>

**任务执行中，强制终止进程**

```bash
kill -9 $(pgrep kova)
```

</li>
<li>

**重启 Kova**

```bash
./kova serve
```

</li>
<li>

**查看任务状态** — 自动从中断点恢复

```bash
kova task status
```

</li>
</ol>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">为什么能恢复</p>
    <div class="lurus-callout__body">每步执行前先写 <Term t="WAL">WAL</Term>（含 CRC32 校验）。进程崩溃时，未确认完成的步骤会在重启后从断点重放——不重调 LLM、不丢进度。详见<a href="/kova/concepts">核心概念</a>。</div>
  </div>
</div>

---

## 下一步

<NextSteps
  :steps="[
    { text: '核心概念 — 深入理解 Agent、Workflow、WAL 架构', link: '/kova/concepts', primary: true },
    { text: 'API 参考 — 完整的 REST API 端点列表', link: '/kova/api' },
    { text: 'Lurus API — 了解底层 LLM 网关', link: '/guide/introduction' },
  ]"
/>

</div>
