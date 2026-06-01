---
title: Lumen — Agent 可观测性与可靠性工具
description: Python SDK 优先 + Rust 引擎 + 可选 CLI，为 Agent 开发者提供可观测性、调试和可靠性保障。
---

# Lumen — Agent 可观测性与可靠性工具 <StatusBadge status="dev" />

::: info 前置条件
- 首选：Python 3.9+（`pip install lumen-ai`）
- 可选 CLI：Rust 1.93+ 从源码编译 `lumen-cli`
- 一个 Lurus <Term t="API Key">API Key</Term>（[获取方式](/guide/get-api-key)）
:::

## 什么是 Lumen？

**Lumen** 是面向 AI Agent 开发者的**三合一可靠性工具** — Replay（零成本重放）+ Crash Recovery（3us <Term t="Checkpoint">崩溃恢复</Term>）+ Cost Tracking（实时成本追踪）。**交付形态**：Python SDK 优先（`pip install lumen-ai`，LangGraph/Agent 首选）+ Rust 引擎（`lumen-core` 性能底座）+ 可选 CLI（`lumen-cli` v0.1.0）。理念：*Illuminate your AI agents. Never lose a run. Never burn tokens blindly.*

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

---

## 核心能力

- **Replay — 零成本确定性重放**：从 trace JSON 重放任意执行，**不调 LLM 不花钱**，可从指定步骤开始精确定位问题。`lumen replay <trace-id>`（完整）/ `--from 5`（从第 5 步）。
- **Crash Recovery — 3 us 级崩溃恢复**：**LangGraph CheckpointSaver 完整实现**，直接替换原生 SQLite/Redis Checkpointer。内存+磁盘双层、原子写入，比 SQLite 快 100 倍，零外部服务依赖。
- **Cost Tracking — 实时成本追踪**：内置 30+ 模型定价表（Claude / GPT-4o / Gemini / Llama / DeepSeek），LLM 不返回费用也能估算。单次调用 > 2x 平均值自动告警。`lumen cost --last 24h` / `lumen traces`。

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

**Lumen** = 开发者命令行工具（本地开发、调试、部署）；**Kova** = Agent 运行时引擎（持久化执行、WAL、集群管理）。本地开发用轻量运行时（`lumen run`），部署到 Kova（`lumen deploy`）后获得完整持久化和集群能力。

---

## 相关产品

- [Kova — Agent 持久执行引擎](/kova/) — Lumen 部署 Agent 的目标运行时
- [Lurus API](/guide/introduction) — 底层 LLM 统一网关
- [MCP 协议](https://modelcontextprotocol.io/) — Model Context Protocol 官方文档

<!-- lurus:related-block -->

---

## 相关产品与下一步

<RelatedProducts product-id="lumen" />

