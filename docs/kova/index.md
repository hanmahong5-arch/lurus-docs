# Kova — AI Agent 持久化执行引擎 <StatusBadge status="dev" />

## 什么是 Kova？

**Kova** 是 Lurus 的核心 AI Agent 基础设施，一个用 Rust 构建的高性能 Agent 持久化执行引擎。它解决了 AI Agent 开发中最棘手的问题：**如何让 Agent 可靠地长时间运行，在崩溃后恢复状态，并在复杂工作流中协同工作。**

传统 Agent 框架（如 LangChain、CrewAI）在内存中运行，进程退出即丢失所有状态。Kova 采用 WAL（Write-Ahead Log）优先的架构，确保每一步执行都被持久化记录，即使系统崩溃也能精确恢复到中断点——不重新调用 LLM，不丢失任何进度，不产生额外费用。

核心技术指标：**FIFO 调度延迟 3.17 us（p50）、吞吐量 315K ops/s、零外部服务依赖**。

---

## 核心特性

### WAL-First 持久化

所有 Agent 状态变更在执行前先写入 WAL，确保零数据丢失：

```
Agent 决策 → WAL 写入 (CRC32 校验) → 执行操作 → 确认完成
                │
                └── 崩溃恢复时从 WAL 重放
```

- **CRC32 校验**: 每条 WAL 记录包含校验和，防止数据损坏
- **环形缓冲**: Power-of-2 大小的环形缓冲区，高效利用存储
- **锁顺序保证**: Buffer → Queue → Txn 严格顺序，杜绝死锁

### Agent 编排

支持从单 Agent 到多 Agent 协同的全场景：

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| **单 Agent** | 独立执行任务 | 简单的自动化任务 |
| **工作流** | 多步骤有序执行 | 数据处理管道、审批流程 |
| **群体智能 (Swarm)** | 多 Agent 自主协作 | 复杂研究、多角色模拟 |

### 工具生态

Agent 通过工具与外部世界交互：

- **内置工具**: 文件操作、HTTP 请求、数据库查询、Shell 命令
- **MCP (Model Context Protocol)**: 连接任何兼容 MCP 的工具服务
- **A2A (Agent-to-Agent)**: Agent 之间直接通信和任务委派
- **自定义工具**: 用 Rust 或通过 REST API 扩展

### 多模型支持

通过 [Lurus API](/guide/introduction) 接入所有主流大语言模型：

```
Kova Agent
    │
    ▼
Lurus API Gateway
    │
    ├── DeepSeek (高性价比日常任务)
    ├── GPT-4o (复杂推理)
    ├── Claude (长文本分析)
    └── Gemini (多模态)
```

Agent 可以在运行时根据任务类型动态切换模型。

---

## 架构概览

```
┌──────────────────────────────────────────────┐
│              Kova REST API (Axum)             │
│           35+ endpoints, WebSocket            │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│                Kova Core                      │
│  ┌─────────────┐  ┌──────────────┐          │
│  │ Agent Engine │  │ Workflow     │          │
│  │ 单/多 Agent  │  │ 有序编排     │          │
│  └──────┬──────┘  └──────┬───────┘          │
│         │                │                   │
│  ┌──────▼────────────────▼──────┐           │
│  │        WAL + Ring Buffer      │           │
│  │     持久化状态管理 (CRC32)     │           │
│  └───────────────────────────────┘           │
│                                              │
│  ┌────────┐  ┌────────┐  ┌────────┐        │
│  │ kova-  │  │ kova-  │  │ kova-  │        │
│  │ llm    │  │ tools  │  │ mcp    │        │
│  └────────┘  └────────┘  └────────┘        │
└──────────────────────────────────────────────┘
```

Kova 由 19 个 Rust crate 组成的工作空间，代码量超过 152,000 行，1,565+ 测试用例 + 4 个 fuzz target。全面启用严格 lint（`#[deny(clippy::unwrap_used, clippy::panic, missing_docs)]`），工业级代码质量。

---

## 适用场景

| 场景 | Kova 的优势 |
|------|-----------|
| **长时间运行的 Agent** | WAL 持久化，崩溃后自动恢复 |
| **复杂工作流** | 多步骤编排，条件分支，并行执行 |
| **多 Agent 协作** | Swarm 模式，Agent 间直接通信 |
| **企业级部署** | Rust 性能，低资源占用，无 GC 停顿 |
| **MCP 工具集成** | 原生支持 Model Context Protocol |
| **安全敏感场景** | 可选加密 (SM4/AES)，WAL HMAC 完整性校验 |

---

## 与其他 Agent 框架对比

| 能力 | LangChain | CrewAI | AutoGen | **Kova** |
|------|-----------|--------|---------|----------|
| 语言 | Python | Python | Python | **Rust** |
| 状态持久化 | 无（需外部） | 无 | 无 | **WAL-First** |
| 崩溃恢复 | 无 | 无 | 无 | **自动恢复** |
| 性能 | 中 | 中 | 中 | **极高** |
| 内存效率 | 低 | 低 | 低 | **极高** |
| MCP 支持 | 第三方 | 无 | 无 | **原生** |
| A2A 协议 | 无 | 无 | 无 | **原生** |
| 加密能力 | 无 | 无 | 无 | **SM4-GCM / ChaCha20** |
| 多协议 | 无 | 无 | 无 | **REST/gRPC/MCP/A2A/PyO3** |
| 部署形态 | Python 进程 | Python 进程 | Python 进程 | **单二进制 / 容器 / 嵌入式库** |

---

## 下一步

- [快速开始](/kova/quickstart) — 启动你的第一个 Kova Agent
- [核心概念](/kova/concepts) — 深入理解 WAL、Agent、Workflow
- [API 参考](/kova/api) — 完整的 REST API 文档
