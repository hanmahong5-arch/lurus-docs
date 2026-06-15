---
title: Kova — AI Agent 持久执行引擎
description: Rust 构建的 WAL-First 架构，崩溃自动恢复，微秒级调度，零外部依赖。
---

<div class="kova-page">

<ProductHero product-id="kova" />

<MetricStats :items="[
  { label: 'FIFO 调度', value: '3.17μs', hint: 'Criterion 完整管道' },
  { label: '吞吐', value: '315K ops/s' },
  { label: '代码量', value: '178K LOC', hint: '21 crate workspace' },
  { label: '外部依赖', value: '零', hint: '无 Redis / Postgres' },
]" />

## 什么是 Kova？

**Kova** 是 Lurus 核心 AI Agent 基础设施，Rust 构建的高性能持久化执行引擎，解决 **Agent 如何可靠长时间运行、崩溃后恢复状态、复杂工作流协同**。传统框架（LangChain、CrewAI）在内存运行，进程退出即丢状态；Kova 采用 <Term t="WAL">WAL（Write-Ahead Log）</Term> 优先架构，每步执行持久化记录，崩溃也能精确恢复到中断点——不重调 LLM、不丢进度、不产生额外费用。

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">核心指标</p>
    <div class="lurus-callout__body"><Term t="FIFO">FIFO</Term> 完整管道延迟 <strong>3.17μs</strong>（Criterion 基准，见 <code>docs/benchmark-report.md</code>）、吞吐 <strong>315K ops/s</strong>、<strong>零外部服务依赖</strong>。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> 核心能力</span>
  <h2 class="lurus-section-head__title">为什么选择 Kova</h2>
  <p class="lurus-section-head__lede">WAL-First 持久化、微秒级调度、零依赖部署、四种接入方式。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-kova)"
  :items="[
    { title: 'WAL 崩溃恢复', body: '每步执行预写日志 + CRC32 校验，崩溃后从断点重放，不重调 LLM', icon: 'database-backup' },
    { title: '3μs 调度延迟', body: 'FIFO 完整管道 Criterion 基准 3.17μs，315K ops/s 吞吐', icon: 'gauge' },
    { title: '零外部依赖', body: '无需 Redis / Postgres，本地 WAL 文件即可运行', icon: 'package' },
    { title: '四种接入方式', body: 'Rust SDK / gRPC / REST / MCP，21 workspace crate 模块化', icon: 'puzzle' },
  ]"
/>

### WAL-First 持久化

所有状态变更执行前先写 WAL，崩溃时从 WAL 重放：

<ol class="lurus-steps">
<li>

**Agent 决策** — 引擎确定下一步动作

</li>
<li>

**WAL 写入（CRC32）** — 持久化记录 + 校验和防损坏

</li>
<li>

**执行** — 真正调用工具 / LLM

</li>
<li>

**确认完成** — 标记该步已落地；崩溃时未确认步骤自动重放

</li>
</ol>

CRC32 校验防损坏；Power-of-2 环形缓冲高效利用存储；锁顺序 **Buffer → Queue → Txn** 严格保证杜绝死锁。

### Agent 编排

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| **单 Agent** | 独立执行任务 | 简单自动化 |
| **工作流** | 多步骤有序执行 | 数据管道、审批流程 |
| **群体智能 (Swarm)** | 多 Agent 自主协作 | 复杂研究、多角色模拟 |

### 工具生态与多模型

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span>
    <div class="lurus-card__title">工具生态</div>
    <p class="lurus-card__body">内置工具（文件 / HTTP / 数据库 / Shell）、<Term t="MCP">MCP</Term>（连接任何兼容 MCP 的工具服务）、<Term t="A2A">A2A</Term>（Agent 间直接通信与任务委派）、自定义工具（Rust 或 REST API 扩展）。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">多模型支持</div>
    <p class="lurus-card__body">经 <a href="/guide/introduction">Lurus API</a> 接入所有主流 LLM（DeepSeek 日常 / GPT-4o 推理 / Claude 长文本 / Gemini 多模态），运行时按任务动态切换。</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> 架构</span>
  <h2 class="lurus-section-head__title">架构概览</h2>
  <p class="lurus-section-head__lede">REST/SDK/gRPC/MCP 接入 · Kova Core 调度 · WAL 持久化恢复。</p>
</div>

<ArchitectureDiagram
  title="Kova 执行架构"
  chart="graph LR
  A[Client SDK / gRPC / REST] --> B[Kova Core]
  B --> C[WAL Writer<br/>CRC32]
  B --> D[Scheduler<br/>FIFO]
  B --> E[Tool Runtime<br/>MCP]
  C -.recover.-> B
  D --> F[LLM Provider<br/>via Lurus API]"
/>

```
Kova REST API (Axum: 35+ endpoints, WebSocket)
 → Kova Core: Agent Engine(单/多 Agent) + Workflow(有序编排)
              → WAL + Ring Buffer(持久化状态管理 CRC32)
              子 crate: kova-llm / kova-tools / kova-mcp
```

Kova 是 **21 个 Rust crate** 的工作空间，**178,284 行代码**，**1,565+ 测试**（loom 并发 / proptest / chaos）+ **4 个 fuzz target**。当前 **v0.2.0 预发布**（朝向 1.0.0-beta.1），全面启用严格 lint（`#[deny(clippy::unwrap_used, clippy::panic, missing_docs)]`）。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> 场景</span>
  <h2 class="lurus-section-head__title">适用场景</h2>
</div>

| 场景 | Kova 的优势 |
|------|-----------|
| **长时间运行的 Agent** | WAL 持久化，崩溃后自动恢复 |
| **复杂工作流** | 多步骤编排，条件分支，并行执行 |
| **多 Agent 协作** | Swarm 模式，Agent 间直接通信 |
| **企业级部署** | Rust 性能，低资源占用，无 GC 停顿 |
| **MCP 工具集成** | 原生支持 Model Context Protocol |
| **安全敏感场景** | 可选加密 (SM4/AES)，WAL HMAC 完整性校验 |

<UserScenarios
  title="按角色上手"
  :scenarios="[
    { role: '开发者', title: '5 分钟起一个持久化 Agent', summary: 'cargo add kova + 3 行代码', link: '/kova/quickstart' },
    { role: '架构师', title: '替换 LangGraph Checkpointer', summary: '在 LangGraph 项目里用 Kova 存 checkpoint', link: '/tutorials/lumen-kova-langgraph' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 对标</span>
  <h2 class="lurus-section-head__title">与其他 Agent 框架对比</h2>
</div>

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

<NextSteps
  :steps="[
    { text: '快速开始 — 启动你的第一个 Kova Agent', link: '/kova/quickstart', primary: true },
    { text: '核心概念 — 深入理解 WAL、Agent、Workflow', link: '/kova/concepts' },
    { text: 'API 参考 — 完整的 REST API 文档', link: '/kova/api' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="kova" />

</div>

<style>
.kova-page .lurus-card--kova .lurus-card__body a {
  color: var(--lurus-color-kova);
  font-weight: 600;
}
</style>
