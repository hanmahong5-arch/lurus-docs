---
title: Kova 核心概念
description: Kova 的 WAL、Agent Loop、Checkpoint 等核心架构组件和设计哲学。
---

# 核心概念

深入理解 Kova 的核心架构组件和设计哲学。

---

## Agent

Agent 是 Kova 的基本执行单元，由以下要素组成：

| 要素 | 说明 |
|------|------|
| **<Term t="System Prompt">System Prompt</Term>** | 定义 Agent 的角色、能力边界和行为规范 |
| **Model** | 使用的 LLM 模型（可运行时切换） |
| **Tools** | Agent 可调用的工具集 |
| **Memory** | Agent 的会话历史和持久化状态 |

### Agent 生命周期

```
Created → Idle → Running → Completed
                   │
                   ├── Paused (手动暂停)
                   ├── Failed (异常退出)
                   └── Recovering (崩溃恢复)
```

- **Idle**: Agent 已创建，等待任务
- **Running**: 正在执行任务
- **Paused**: 手动暂停，可恢复
- **Completed**: 任务完成
- **Failed**: 执行失败（超过重试次数）
- **Recovering**: 检测到未完成的 WAL 记录，自动恢复

### Agent 决策循环

```
接收任务 / 上一步结果
         │
         ▼
    LLM 推理
    (分析 + 规划)
         │
         ▼
   ┌─────┴─────┐
   │ 需要工具？ │
   └─────┬─────┘
    Yes   │   No
     │    │    │
     ▼    │    ▼
  调用工具 │  生成最终回答
     │    │    │
     ▼    │    ▼
  工具结果 │  返回结果
     │    │
     └────┘
  (继续下一轮推理)
```

每一轮决策都会被写入 WAL，确保可恢复。

---

## Workflow

Workflow 将多个 Agent 或步骤编排成有序的执行管道。

### 步骤类型

| 类型 | 说明 |
|------|------|
| **Agent 步骤** | 委派给指定 Agent 执行 |
| **条件分支** | 根据上一步结果选择不同路径 |
| **并行步骤** | 多个步骤同时执行 |
| **等待步骤** | 等待外部事件或人工审批 |
| **循环步骤** | 重复执行直到满足条件 |

### 数据传递

步骤之间通过模板变量传递数据：

```
{{input.topic}}              → 工作流输入参数
{{steps.research.output}}    → "research" 步骤的输出
{{steps.research.metadata}}  → "research" 步骤的元数据
```

### 错误处理

每个步骤可配置独立的错误策略：

| 策略 | 行为 |
|------|------|
| `retry` | 重试 N 次（默认 3 次，指数退避） |
| `skip` | 跳过失败步骤，继续执行 |
| `abort` | 终止整个工作流 |
| `fallback` | 切换到备用步骤 |

---

## <Term t="Swarm">Swarm</Term>（群体智能）

Swarm 模式让多个 Agent 自主协作，无需预定义固定流程。

### 工作方式

```
用户任务
   │
   ▼
协调者 Agent
   │
   ├── 分解子任务
   │
   ├── 分配给专家 Agent
   │     ├── 研究 Agent
   │     ├── 编码 Agent
   │     └── 测试 Agent
   │
   ├── 收集结果
   │
   └── 综合输出
```

Agent 之间通过 <Term t="A2A">A2A（Agent-to-Agent）</Term>协议直接通信：

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

## <Term t="WAL">WAL</Term>（Write-Ahead Log）

WAL 是 Kova 持久化的核心机制，借鉴了数据库系统的设计。

### 写入流程

```
Agent 状态变更
       │
       ▼
┌──────────────────┐
│  序列化 + CRC32  │   ← 计算校验和
└──────┬───────────┘
       ▼
┌──────────────────┐
│  写入 WAL 文件   │   ← 先写日志
└──────┬───────────┘
       ▼
┌──────────────────┐
│  执行实际操作    │   ← 再执行
└──────┬───────────┘
       ▼
┌──────────────────┐
│  标记 WAL 已完成 │   ← 确认提交
└──────────────────┘
```

### 恢复流程

启动时自动扫描 WAL，恢复未完成的操作：

```
启动 Kova
    │
    ▼
扫描 WAL 文件
    │
    ├── 已完成的记录 → 跳过
    ├── CRC32 校验失败 → 标记损坏，跳过
    └── 未完成的记录 → 重新执行
```

### <Term t="Ring Buffer">环形缓冲</Term>

WAL 使用 power-of-2 大小的环形缓冲区：

- 写指针到达末尾时自动回绕
- 已确认的旧记录被新记录覆盖
- 缓冲区满时触发 compaction

### 同步模式

| 模式 | 说明 | 性能 | 持久性 |
|------|------|------|--------|
| `normal` | 操作系统决定何时 fsync | 高 | 可能丢失数秒数据 |
| `full` | 每次写入都 fsync | 低 | 零数据丢失 |

### 加密选项

敏感场景可启用 WAL 加密：

| 算法 | 说明 |
|------|------|
| `aes-256-gcm` | 标准 AES-256 加密 |
| `sm4` | 国密 SM4 算法 |

同时可启用 HMAC 完整性校验，防止 WAL 文件被篡改。

---

## 锁顺序

Kova 内部使用严格的锁获取顺序，从根本上杜绝死锁：

```
Buffer Lock → Queue Lock → Transaction Lock
```

所有代码路径必须遵守此顺序。尝试违反顺序获取锁会触发编译时检查（通过 Rust 类型系统保证）。

---

## 工具系统

### 内置工具

| 工具 | 功能 |
|------|------|
| `web_search` | 搜索互联网 |
| `file_read` | 读取文件 |
| `file_write` | 写入文件 |
| `http_request` | 发送 HTTP 请求 |
| `shell_exec` | 执行 Shell 命令（沙箱环境） |
| `db_query` | 数据库查询 |

### MCP 工具

通过 [Model Context Protocol](https://modelcontextprotocol.io/) 连接外部工具服务：

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

Agent 可以像使用内置工具一样调用 MCP 工具。

### A2A 协议

Agent-to-Agent 通信协议，支持：

- **任务委派**: 一个 Agent 把子任务交给另一个
- **信息查询**: Agent 之间直接交换信息
- **结果通知**: 任务完成后通知发起方
- **能力发现**: 查询其他 Agent 能做什么

---

## 特性层级

Kova 使用 Rust feature flags 控制编译范围：

```
pure-rust (默认)
    │
    ├── serde (序列化)
    │
    ├── workflow (工作流编排)
    │    │
    │    └── agent (Agent 引擎)
    │         │
    │         └── swarm (群体智能)
    │
    ├── encrypt (加密)
    │    ├── sm4 (国密)
    │    └── wal-hmac (完整性校验)
    │
    └── ... 其他可选特性
```

最小化编译只需 `pure-rust`，按需叠加其他特性。

---

## 下一步

- [快速开始](/kova/quickstart) — 5 分钟启动你的第一个 Kova Agent
- [API 参考](/kova/api) — 完整的 REST API 端点文档
- [MemX 记忆引擎](/memx/) — 为 Agent 添加持久化记忆能力
