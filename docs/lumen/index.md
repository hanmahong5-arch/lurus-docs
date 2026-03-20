# Lumen — Agent 可观测性与可靠性工具 <StatusBadge status="dev" />

## 什么是 Lumen？

**Lumen** 是面向 AI Agent 开发者的**三合一可靠性工具** — Replay（零成本重放）+ Crash Recovery（3us 崩溃恢复）+ Cost Tracking（实时成本追踪）。

核心理念：**Illuminate your AI agents. Never lose a run. Never burn tokens blindly.**

```python
pip install lumen-ai

from lumen_ai import LumenTracer, LumenCheckpointer, CostTracker

# 三行代码接入 — LangGraph 原生集成
graph = workflow.compile(
    checkpointer=LumenCheckpointer(),   # 崩溃恢复
    callbacks=[LumenTracer()]            # 执行追踪 + 成本追踪
)
```

Lumen 底层由 Rust 引擎驱动（lumen-core），Python SDK 提供开发者友好接口，是连接 [Kova Agent 引擎](/kova/) 和 Python 生态的桥梁。

---

## 核心能力

### Replay — 零成本确定性重放

从 trace JSON 重放任意 Agent 执行过程，**不调用 LLM，不花一分钱**。支持从指定步骤开始重放，精确定位问题。

```bash
lumen replay <trace-id>              # 重放完整执行
lumen replay <trace-id> --from 5     # 从第 5 步开始
```

### Crash Recovery — 3 us 级崩溃恢复

**LangGraph CheckpointSaver 完整实现**，直接替换原生 SQLite/Redis Checkpointer。内存+磁盘双层存储，原子写入，比 SQLite 快 100 倍，零外部服务依赖。

### Cost Tracking — 实时成本追踪

内置 30+ 模型定价表（Claude / GPT-4o / Gemini / Llama / DeepSeek），即使 LLM 不返回费用也能估算。单次调用 > 2x 平均值时自动告警。

```bash
lumen cost --last 24h                # 最近 24 小时费用
lumen traces                         # 查看所有执行追踪
```

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

### macOS / Linux

```bash
curl -fsSL https://get.lurus.cn/lumen | sh
```

### Windows (PowerShell)

```powershell
irm https://get.lurus.cn/lumen.ps1 | iex
```

### 从源码编译

```bash
git clone https://github.com/hanmahong5-arch/lumen.git
cd lumen
cargo build --release
# 二进制在 target/release/lumen
```

::: tip
Lumen 要求 Rust 1.93+。首次编译约 2-3 分钟。
:::

### 验证安装

```bash
lumen --version
# lumen 0.1.0

lumen doctor
# Checking dependencies...
# Lurus API: connected
# Kova: not configured (optional)
# All checks passed.
```

---

## 快速上手

### 初始化项目

```bash
# 创建新的 Agent 项目
lumen init my-agent
cd my-agent

# 项目结构
# my-agent/
# ├── agent.toml        # Agent 配置
# ├── prompts/
# │   └── system.md     # System Prompt
# ├── tools/
# │   └── search.yaml   # 自定义工具定义
# └── workflows/
#     └── main.yaml     # 工作流定义
```

### 配置 API Key

```bash
lumen auth login
# 浏览器打开登录页面，授权后自动配置
# 或直接设置:
lumen config set api_key sk-your-lurus-key
```

### 本地运行 Agent

```bash
# 交互模式 — 在终端与 Agent 对话
lumen run --interactive

# 单次任务
lumen run "分析这段代码的性能问题" --file ./main.py

# 指定模型
lumen run "翻译这段文本" --model gpt-4o
```

### 工作流调试

```bash
# 运行工作流
lumen workflow run main --input topic="AI trends"

# 逐步调试（在每个步骤暂停）
lumen workflow run main --step-by-step

# 查看上次运行结果
lumen workflow history main --last
```

---

## 常用命令

### Agent 管理

```bash
lumen agent list                  # 列出所有 Agent
lumen agent create researcher     # 创建 Agent
lumen agent info researcher       # 查看 Agent 详情
lumen agent logs researcher       # 查看执行日志
lumen agent delete researcher     # 删除 Agent
```

### MCP 工具

```bash
lumen mcp list                    # 列出已安装的 MCP 工具
lumen mcp install github          # 安装 MCP 工具
lumen mcp test github             # 测试工具连接
lumen mcp remove github           # 卸载工具
```

### 部署

```bash
# 部署到 Kova 云端
lumen deploy --target kova

# 部署到 Docker
lumen deploy --target docker

# 查看部署状态
lumen deploy status
```

### 配置

```bash
lumen config list                 # 查看所有配置
lumen config set api_key xxx      # 设置配置项
lumen config get api_key          # 读取配置项
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

| 工具 | 角色 |
|------|------|
| **Lumen** | 开发者的命令行工具（本地开发、调试、部署） |
| **Kova** | Agent 运行时引擎（持久化执行、WAL、集群管理） |

Lumen 在本地开发时使用轻量级运行时，部署到 Kova 后获得完整的持久化和集群能力。

```
开发阶段: lumen run → 本地轻量执行
部署阶段: lumen deploy → Kova 持久化运行
```

---

## 更多资源

- [Kova 文档](/kova/) — 了解 Agent 运行时引擎
- [Lurus API](/guide/introduction) — 了解底层 LLM 网关
- [MCP 协议](https://modelcontextprotocol.io/) — Model Context Protocol 官方文档
