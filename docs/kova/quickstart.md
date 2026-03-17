# 快速开始

本指南帮助你在 5 分钟内启动第一个 Kova Agent。

## 安装

### 使用 Docker（推荐）

```bash
docker run -d \
  --name kova \
  -p 8080:8080 \
  -v kova-data:/data \
  -e LURUS_API_KEY=sk-your-key \
  ghcr.io/hanmahong5-arch/kova:latest
```

### 使用预编译二进制

从 [GitHub Releases](https://github.com/hanmahong5-arch/agentdrq/releases) 下载：

| 平台 | 文件 |
|------|------|
| Linux x86_64 | `kova-linux-amd64` |
| macOS (Apple Silicon) | `kova-darwin-arm64` |
| macOS (Intel) | `kova-darwin-amd64` |
| Windows | `kova-windows-amd64.exe` |

```bash
# Linux / macOS
chmod +x kova-linux-amd64
./kova-linux-amd64 serve --port 8080
```

### 从源码构建

```bash
git clone https://github.com/hanmahong5-arch/agentdrq.git
cd agentdrq

# 使用 pure-rust 特性（无系统依赖）
cargo build --workspace --no-default-features --features pure-rust --release
```

::: tip Rust 版本要求
Kova 要求 Rust 1.93+ (Edition 2024)。推荐使用 rustup 管理工具链。
:::

---

## 配置

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

## 启动你的第一个 Agent

### 通过 REST API

Kova 启动后，通过 REST API 创建和管理 Agent：

```bash
# 创建一个简单的 Agent
curl -X POST http://localhost:8080/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "researcher",
    "system_prompt": "你是一个专业的技术研究员。用户给你一个主题，你需要深入分析并给出结构化的研究报告。",
    "model": "deepseek-chat",
    "tools": ["web_search", "file_write"]
  }'
```

**响应**：
```json
{
  "id": "agt_a1b2c3d4",
  "name": "researcher",
  "status": "idle",
  "created_at": "2026-03-17T10:00:00Z"
}
```

### 发送任务

```bash
# 给 Agent 发送任务
curl -X POST http://localhost:8080/api/v1/agents/agt_a1b2c3d4/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "message": "研究 Rust 在 AI 基础设施中的应用趋势，输出一份 500 字的报告"
  }'
```

**响应**：
```json
{
  "task_id": "tsk_e5f6g7h8",
  "status": "running",
  "agent_id": "agt_a1b2c3d4"
}
```

### 查看执行状态

```bash
# 查看任务状态
curl http://localhost:8080/api/v1/tasks/tsk_e5f6g7h8

# 流式查看执行过程（WebSocket）
wscat -c ws://localhost:8080/api/v1/tasks/tsk_e5f6g7h8/stream
```

---

## 通过 CLI 使用

Kova 内置 TUI（终端用户界面），提供交互式的 Agent 管理体验：

```bash
# 启动 TUI
kova tui

# 或直接通过 CLI 命令
kova agent create --name researcher --model deepseek-chat
kova agent run researcher "分析 Rust 在 AI 领域的应用"
kova agent list
kova agent logs researcher --tail 50
```

---

## 创建工作流

工作流将多个步骤串联成有序的执行管道：

```bash
curl -X POST http://localhost:8080/api/v1/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "content-pipeline",
    "steps": [
      {
        "name": "research",
        "agent": "researcher",
        "prompt": "研究主题：{{input.topic}}"
      },
      {
        "name": "write",
        "agent": "writer",
        "prompt": "基于以下研究报告，撰写一篇博客文章：\n{{steps.research.output}}"
      },
      {
        "name": "review",
        "agent": "editor",
        "prompt": "审校以下文章，修正错误并优化表达：\n{{steps.write.output}}"
      }
    ]
  }'
```

触发工作流：

```bash
curl -X POST http://localhost:8080/api/v1/workflows/content-pipeline/run \
  -H "Content-Type: application/json" \
  -d '{"input": {"topic": "边缘计算与 AI 推理"}}'
```

---

## 验证持久化

测试 Kova 的崩溃恢复能力：

```bash
# 1. 启动一个长任务
kova agent run researcher "写一份 5000 字的深度报告"

# 2. 任务执行中，强制终止进程
kill -9 $(pgrep kova)

# 3. 重启 Kova
./kova serve

# 4. 查看任务状态 — 自动从中断点恢复
kova task status
```

---

## 下一步

- [核心概念](/kova/concepts) — 深入理解 Agent、Workflow、WAL 架构
- [API 参考](/kova/api) — 完整的 REST API 端点列表
- [Lurus API](/guide/introduction) — 了解底层 LLM 网关
