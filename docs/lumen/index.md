---
title: Lumen — Agent 可观测性与可靠性工具
description: Python SDK 优先 + Rust 引擎 + 可选 CLI，为 Agent 开发者提供可观测性、调试和可靠性保障。
---

<div class="lumen-page">

<ProductHero product-id="lumen" />

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前置条件</p>
    <div class="lurus-callout__body"><ul><li>首选：Python 3.9+（<code>pip install lumen-ai</code>）</li><li>可选 CLI：Rust 1.93+ 从源码编译 <code>lumen-cli</code></li><li>一个 Lurus <Term t="API Key">API Key</Term>（<a href="/guide/get-api-key">获取方式</a>）</li></ul></div>
  </div>
</div>

## 什么是 Lumen？

**Lumen** 是面向 AI Agent 开发者的**三合一可靠性工具** — Replay（零成本重放）+ Crash Recovery（微秒级 <Term t="Checkpoint">崩溃恢复</Term>）+ Cost Tracking（实时成本追踪）。**交付形态**：Python SDK 优先（`pip install lumen-ai`，LangGraph/Agent 首选）+ Rust 引擎（`lumen-core` 性能底座）+ 可选 CLI（`lumen-cli` v0.1.0）。理念：*Illuminate your AI agents. Never lose a run. Never burn tokens blindly.*

```python
pip install lumen-ai

from lumen_ai import LumenTracer, LumenCheckpointer, CostTracker

# 三行代码接入 — LangGraph 原生集成
graph = workflow.compile(
    checkpointer=LumenCheckpointer(),   # 崩溃恢复
    callbacks=[LumenTracer()]            # 执行追踪 + 成本追踪
)
```

底层 Rust 引擎（lumen-core）驱动，Python SDK 提供友好接口，连接 [Kova Agent 引擎](/kova/) 和 Python 生态。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3 行</span><span class="lurus-stat__label">接入 LangGraph</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">微秒级</span><span class="lurus-stat__label">崩溃恢复</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">30+</span><span class="lurus-stat__label">模型定价表</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">v0.1.0</span><span class="lurus-stat__label">lumen-cli</span></div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> 核心能力</span>
  <h2 class="lurus-section-head__title">三合一可靠性</h2>
  <p class="lurus-section-head__lede">重放、恢复、成本 — 一次接入全部就绪。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-lumen)"
  :items="[
    { title: 'Replay — 零成本确定性重放', icon: 'rewind', body: '从 trace JSON 重放任意执行，不调 LLM 不花钱，可从指定步骤开始精确定位问题。lumen replay TRACE_ID（完整）/ --from 5（从第 5 步）。' },
    { title: 'Crash Recovery — 微秒级崩溃恢复', icon: 'life-buoy', body: 'LangGraph CheckpointSaver 完整实现，直接替换原生 SQLite/Redis Checkpointer。内存+磁盘双层、原子写入，恢复走引擎级 WAL 重放，零外部服务依赖。' },
    { title: 'Cost Tracking — 实时成本追踪', icon: 'coins', body: '内置 30+ 模型定价表（Claude / GPT-4o / Gemini / Llama / DeepSeek），LLM 不返回费用也能估算。单次调用 > 2x 平均值自动告警。lumen cost --last 24h / lumen traces。' },
  ]"
/>

### 更多功能

| 功能 | 说明 |
|------|------|
| **Agent 管理** | 创建、启动、停止、删除 Agent |
| **工作流调试** | 本地运行工作流，逐步调试 |
| **日志查看** | 实时查看 Agent 执行日志 |
| **部署** | 将 Agent 部署到 Kova 云端实例 |
| **MCP 管理** | 安装和配置 MCP 工具服务 |
| **交互式 REPL** | 直接在终端与 Agent 对话 |

---

## 安装

```bash
pip install lumen-ai                          # Python SDK（推荐）
curl -fsSL https://get.lurus.cn/lumen | sh    # CLI macOS/Linux
# Windows (PowerShell): irm https://get.lurus.cn/lumen.ps1 | iex
# 从源码（Rust 1.93+，首次编译约 2-3 分钟）：
git clone https://github.com/hanmahong5-arch/lumen.git && cd lumen && cargo build --release
# 二进制在 target/release/lumen
```

验证：`lumen --version`（→ `lumen 0.1.0`）；`lumen doctor`（检查 Lurus API connected / Kova optional）。

---

## 快速上手

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

## 常用命令

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

## 配置文件

`agent.toml` 是 Agent 项目的核心配置：

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

## 与 Kova 的关系

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen</div>
    <p class="lurus-card__body">开发者命令行工具 — 本地开发、调试、部署。轻量运行时 <code>lumen run</code> 即起即用。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">Agent 运行时引擎 — 持久化执行、WAL、集群管理。<code>lumen deploy</code> 后获得完整持久化与集群能力。</p>
  </div>
</div>

本地开发用轻量运行时（`lumen run`），部署到 Kova（`lumen deploy`）后获得完整持久化和集群能力。

---

## 与其他方案对比

<ComparisonTable
  self-label="Lumen"
  :competitors="['Temporal', 'LangGraph Checkpointer', 'Conductor']"
  :rows="[
    { dimension: 'Replay', self: '零成本 LLM 重放', alt: { Temporal: 'Event replay', 'LangGraph Checkpointer': '部分', Conductor: 'Workflow replay' } },
    { dimension: '接入成本', self: '3 行代码', alt: { Temporal: 'Worker + SDK', 'LangGraph Checkpointer': '配置', Conductor: 'Worker' } },
    { dimension: 'Cost 追踪', self: '内置', alt: { Temporal: '无', 'LangGraph Checkpointer': '无', Conductor: '无' } },
  ]"
  title="对标"
/>

---

## 相关产品与下一步

<NextSteps
  :steps="[
    { text: '快速开始', link: '/lumen/quickstart', primary: true },
    { text: 'Python SDK', link: '/lumen/python-sdk' },
    { text: 'CLI 手册', link: '/lumen/cli' },
    { text: 'MCP 协议官方文档', link: 'https://modelcontextprotocol.io/', external: true },
  ]"
  title="下一步"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 20px 0 8px; }
.lumen-page .lurus-stat-strip { margin: 18px 0 4px; }
</style>
