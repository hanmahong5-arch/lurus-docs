---
title: Kova — AI Agent 持久执行引擎
description: Rust 构建的 WAL-First 架构，崩溃自动恢复，微秒级调度，零外部依赖。
---

# Kova — AI Agent 持久化执行引擎 <StatusBadge status="dev" />

## 什么是 Kova？

**Kova** 是 Lurus 核心 AI Agent 基础设施，Rust 构建的高性能持久化执行引擎，解决 **Agent 如何可靠长时间运行、崩溃后恢复状态、复杂工作流协同**。传统框架（LangChain、CrewAI）在内存运行，进程退出即丢状态；Kova 采用 <Term t="WAL">WAL（Write-Ahead Log）</Term> 优先架构，每步执行持久化记录，崩溃也能精确恢复到中断点——不重调 LLM、不丢进度、不产生额外费用。

核心指标：**<Term t="FIFO">FIFO</Term> 完整管道延迟 3.17μs（Criterion 基准，见 `docs/benchmark-report.md`）、吞吐 315K ops/s、零外部服务依赖**。

---

## 核心特性

**WAL-First 持久化**：所有状态变更执行前先写 WAL（`Agent 决策 → WAL 写入(CRC32) → 执行 → 确认完成`，崩溃时从 WAL 重放）。CRC32 校验防损坏；Power-of-2 环形缓冲高效利用存储；锁顺序 Buffer → Queue → Txn 严格保证杜绝死锁。

**Agent 编排**：

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| **单 Agent** | 独立执行任务 | 简单自动化 |
| **工作流** | 多步骤有序执行 | 数据管道、审批流程 |
| **群体智能 (Swarm)** | 多 Agent 自主协作 | 复杂研究、多角色模拟 |

**工具生态**：内置工具（文件/HTTP/数据库/Shell）、<Term t="MCP">MCP</Term>（连接任何兼容 MCP 的工具服务）、<Term t="A2A">A2A</Term>（Agent 间直接通信和任务委派）、自定义工具（Rust 或 REST API 扩展）。

**多模型支持**：经 [Lurus API](/guide/introduction) 接入所有主流 LLM（DeepSeek 日常 / GPT-4o 推理 / Claude 长文本 / Gemini 多模态），运行时按任务动态切换。

---

## 架构概览

```
Kova REST API (Axum: 35+ endpoints, WebSocket)
 → Kova Core: Agent Engine(单/多 Agent) + Workflow(有序编排)
              → WAL + Ring Buffer(持久化状态管理 CRC32)
              子 crate: kova-llm / kova-tools / kova-mcp
```

Kova 是 21 个 Rust crate 的工作空间，178,284 行代码，1,565+ 测试（loom 并发 / proptest / chaos）+ 4 个 fuzz target。当前 v0.2.0 预发布（朝向 1.0.0-beta.1），全面启用严格 lint（`#[deny(clippy::unwrap_used, clippy::panic, missing_docs)]`）。

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
| 多协议 | 无 | 无 | 无 | **四种接入方式：Rust SDK / gRPC / REST / MCP** |
| 部署形态 | Python 进程 | Python 进程 | Python 进程 | **单二进制 / 容器 / 嵌入式库** |

---

## 下一步

- [快速开始](/kova/quickstart) — 启动你的第一个 Kova Agent
- [核心概念](/kova/concepts) — 深入理解 WAL、Agent、Workflow
- [API 参考](/kova/api) — 完整的 REST API 文档

---

## 相关产品

- [MemX — AI 自适应记忆引擎](/memx/) — 为 Kova Agent 提供持久化记忆能力，让 Agent 跨会话记住上下文
- [Lumen — Agent 开发者工具](/lumen/) — Kova Agent 的命令行伴侣，本地开发、调试和部署

<!-- lurus:related-block -->

---

## 相关产品与下一步

<RelatedProducts product-id="kova" />

