---
title: Lumen — Agent Observability & Reliability Toolkit
description: Python SDK first + Rust engine + optional CLI, delivering observability, debugging, and reliability guarantees for Agent developers.
---

<div class="lumen-page">

<ProductHero product-id="lumen" />

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prerequisites</p>
    <div class="lurus-callout__body"><ul><li>Preferred: Python 3.9+ (<code>pip install lumen-ai</code>)</li><li>Optional CLI: build <code>lumen-cli</code> from source with Rust 1.93+</li><li>A Lurus <Term t="API Key">API Key</Term> (<a href="/en/guide/get-api-key">how to get one</a>)</li></ul></div>
  </div>
</div>

## What is Lumen?

**Lumen** is an **all-in-one reliability toolkit** for AI Agent developers — Replay (zero-cost replays) + Crash Recovery (microsecond-level <Term t="Checkpoint">crash recovery</Term>) + Cost Tracking (real-time cost tracking). **Delivery forms**: Python SDK first (`pip install lumen-ai`, the top choice for LangGraph/Agents) + Rust engine (`lumen-core` performance foundation) + optional CLI (`lumen-cli` v0.1.0). Philosophy: *Illuminate your AI agents. Never lose a run. Never burn tokens blindly.*

```python
pip install lumen-ai

from lumen_ai import LumenTracer, LumenCheckpointer, CostTracker

# 三行代码接入 — LangGraph 原生集成
graph = workflow.compile(
    checkpointer=LumenCheckpointer(),   # 崩溃恢复
    callbacks=[LumenTracer()]            # 执行追踪 + 成本追踪
)
```

Powered by the underlying Rust engine (lumen-core), the Python SDK provides a friendly interface that connects the [Kova Agent engine](/en/kova/) with the Python ecosystem.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3 lines</span><span class="lurus-stat__label">to integrate LangGraph</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Microsecond</span><span class="lurus-stat__label">crash recovery</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">30+</span><span class="lurus-stat__label">model pricing tables</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">v0.1.0</span><span class="lurus-stat__label">lumen-cli</span></div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Core capabilities</span>
  <h2 class="lurus-section-head__title">All-in-one reliability</h2>
  <p class="lurus-section-head__lede">Replay, recovery, cost — all ready with a single integration.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-lumen)"
  :items="[
    { title: 'Replay — zero-cost deterministic replay', icon: 'rewind', body: 'Replay any execution from a trace JSON without calling the LLM and without spending money, and start from a specific step to pinpoint issues precisely. lumen replay TRACE_ID (full) / --from 5 (from step 5).' },
    { title: 'Crash Recovery — microsecond-level crash recovery', icon: 'life-buoy', body: 'A complete implementation of LangGraph CheckpointSaver, a drop-in replacement for the native SQLite/Redis Checkpointer. Two-tier memory + disk, atomic writes, recovery via engine-level WAL replay, with zero external service dependencies.' },
    { title: 'Cost Tracking — real-time cost tracking', icon: 'coins', body: 'Built-in pricing tables for 30+ models (Claude / GPT-4o / Gemini / Llama / DeepSeek), with estimates even when the LLM does not return costs. Automatically alerts when a single call exceeds 2x the average. lumen cost --last 24h / lumen traces.' },
  ]"
/>

### More features

| Feature | Description |
|------|------|
| **Agent management** | Create, start, stop, and delete Agents |
| **Workflow debugging** | Run workflows locally and debug step by step |
| **Log viewing** | View Agent execution logs in real time |
| **Deployment** | Deploy Agents to a Kova cloud instance |
| **MCP management** | Install and configure MCP tool services |
| **Interactive REPL** | Chat with the Agent directly in the terminal |

---

## Installation

```bash
pip install lumen-ai                          # Python SDK（推荐）
curl -fsSL https://get.lurus.cn/lumen | sh    # CLI macOS/Linux
# Windows (PowerShell): irm https://get.lurus.cn/lumen.ps1 | iex
# 从源码（Rust 1.93+，首次编译约 2-3 分钟）：
git clone https://github.com/hanmahong5-arch/lumen.git && cd lumen && cargo build --release
# 二进制在 target/release/lumen
```

Verify: `lumen --version` (→ `lumen 0.1.0`); `lumen doctor` (checks Lurus API connected / Kova optional).

---

## Quick start

```bash
# 初始化项目（结构: agent.toml / prompts/system.md / tools/search.yaml / workflows/main.yaml）
lumen init my-agent && cd my-agent

# 配置 API Key
lumen auth login                              # 浏览器登录授权自动配置
lumen config set api_key sk-your-lurus-key    # 或直接设置

# 本地运行 Agent
lumen run --interactive                       # 交互模式
lumen run "分析这段代码的性能问题" --file ./main.py
lumen run "翻译这段文本" --model gpt-4o        # 指定模型

# 工作流调试
lumen workflow run main --input topic="AI trends"
lumen workflow run main --step-by-step        # 逐步调试（每步暂停）
lumen workflow history main --last            # 上次运行结果
```

---

## Common commands

```bash
# Agent 管理
lumen agent list / create researcher / info researcher / logs researcher / delete researcher
# MCP 工具
lumen mcp list / install github / test github / remove github
# 部署
lumen deploy --target kova        # 或 --target docker
lumen deploy status
# 配置
lumen config list / set api_key xxx / get api_key
```

---

## Configuration file

`agent.toml` is the core configuration of an Agent project:

```toml
[agent]
name = "my-researcher"
model = "deepseek-chat"
max_iterations = 20

[agent.llm]
base_url = "https://api.lurus.cn/v1"
temperature = 0.7
max_tokens = 4096

[tools]
builtin = ["web_search", "file_read", "file_write"]

[[tools.mcp]]
name = "github"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]

[deploy]
target = "kova"
```

---

## Relationship with Kova

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen</div>
    <p class="lurus-card__body">Developer command-line tool — local development, debugging, and deployment. A lightweight runtime that runs out of the box with <code>lumen run</code>.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">Agent runtime engine — durable execution, WAL, and cluster management. After <code>lumen deploy</code>, you gain full durability and cluster capabilities.</p>
  </div>
</div>

For local development, use the lightweight runtime (`lumen run`); after deploying to Kova (`lumen deploy`), you gain full durability and cluster capabilities.

---

## Comparison with other solutions

<ComparisonTable
  self-label="Lumen"
  :competitors="['Temporal', 'LangGraph Checkpointer', 'Conductor']"
  :rows="[
    { dimension: 'Replay', self: 'Zero-cost LLM replay', alt: { Temporal: 'Event replay', 'LangGraph Checkpointer': 'Partial', Conductor: 'Workflow replay' } },
    { dimension: 'Integration cost', self: '3 lines of code', alt: { Temporal: 'Worker + SDK', 'LangGraph Checkpointer': 'Configuration', Conductor: 'Worker' } },
    { dimension: 'Cost tracking', self: 'Built-in', alt: { Temporal: 'None', 'LangGraph Checkpointer': 'None', Conductor: 'None' } },
  ]"
  title="Comparison"
/>

---

## Related products & next steps

<NextSteps
  :steps="[
    { text: 'Quick start', link: '/en/lumen/quickstart', primary: true },
    { text: 'Python SDK', link: '/en/lumen/python-sdk' },
    { text: 'CLI manual', link: '/en/lumen/cli' },
    { text: 'Integrations & MCP directory', link: '/integrations/' },
    { text: 'MCP protocol official docs', link: 'https://modelcontextprotocol.io/', external: true },
  ]"
  title="Next steps"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 20px 0 8px; }
.lumen-page .lurus-stat-strip { margin: 18px 0 4px; }
</style>
