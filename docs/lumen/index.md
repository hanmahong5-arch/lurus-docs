# Lumen — Agent 开发者 CLI

## 什么是 Lumen？

**Lumen** 是 Lurus 为 AI Agent 开发者打造的命令行工具，用 Rust 编写，提供从本地开发到云端部署的完整工作流。

它是连接 [Kova Agent 引擎](/kova/) 和开发者日常工作的桥梁——在终端中管理 Agent、调试工作流、监控执行状态。

---

## 核心功能

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
