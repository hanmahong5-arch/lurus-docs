---
title: 术语表
description: Lurus 平台核心概念与术语速查。
---

# 术语表

Lurus 文档中出现的核心术语速查。每个词条包含定义和详细文档链接。

---

## A2A

**Agent-to-Agent** — Agent 之间直接通信的协议。一个 Agent 可以将子任务委派给另一个 Agent，无需经过人工中转。Kova 中的 [Swarm 模式](/kova/concepts#swarm-群体智能)依赖 A2A 实现多 Agent 自主协作。

## ACE

**Adaptive Context Engine** — MemX 的核心引擎，由四大模块组成：[Reflector](/memx/concepts#reflector-知识蒸馏引擎)（知识蒸馏）、[Curator](/memx/concepts#curator-语义去重引擎)（语义去重）、[Decay](/memx/concepts#decay-时间衰减引擎)（时间衰减）和 [Generator](/memx/concepts#generator-混合检索引擎)（混合检索）。

## Agent

Kova 中具有角色、工具和记忆的自主执行单元。它接收任务后进入决策循环：LLM 推理 → 调用工具 → 观察结果 → 继续推理，直到完成任务。每一轮决策都被写入 [WAL](#wal) 以保证可恢复。详见 [Kova Agent](/kova/concepts#agent)。

## API Key

调用 Lurus API 的身份凭证，格式 `sk-xxxxxxxxxxxxxxxx`。每个 Key 可独立设置配额、模型白名单和 IP 限制。在 [api.lurus.cn](https://api.lurus.cn) 的「令牌管理」中创建。详见 [获取 API Key](/guide/get-api-key)。

---

## Checkpoint

Kova 中对 Agent 完整状态的快照，包含会话历史、工具调用记录和内部变量。用于加速恢复——加载最近 Checkpoint 再重放之后的增量日志，无需从头重放。

## CRC32

循环冗余校验算法。Kova 的 WAL 为每条记录计算 CRC32 校验和，启动时自动检测数据损坏。校验失败的记录被安全跳过。

---

## Decay

MemX 模拟人类遗忘曲线的机制。每条知识有一个随时间递减的权重：30 天后衰减到 50%，但每次被检索会获得加成。使用 15 次以上的知识成为永久记忆。详见 [衰减引擎](/memx/concepts#decay-时间衰减引擎)。

---

## Feature Flags

Kova 通过 Rust feature flags 控制编译范围。`pure-rust` 是最小集，按需添加 `agent`、`workflow`、`encrypt` 等特性。

## Function Calling

LLM 输出结构化的函数调用请求，你的代码执行该函数，将结果返回给模型继续推理。Lurus API 完全支持 OpenAI 格式的 Function Calling。详见 [Chat Completions](/api/chat-completions)。

---

## LB

**鹿贝** — Lurus 平台虚拟货币。1 LB 约等于基础模型 10,000 tokens 或高级模型 3,000 tokens。充值越多单价越低。购买的鹿贝永久有效。VIP 用户自动享受折扣。详见 [计费详解](/platform/billing)。

## LLM

**Large Language Model（大语言模型）** — 如 GPT-4o、Claude、DeepSeek、Gemini 等。接收文本输入并生成文本输出，是 Lurus 所有 AI 产品的推理基础。Lurus API 通过统一接口接入 50+ 个 LLM。

---

## MCP

**Model Context Protocol** — Anthropic 提出的开放协议，让 AI 应用连接外部数据源和工具。Kova Agent 可通过 MCP 连接 GitHub、PostgreSQL 等外部服务。详见 [MCP 工具](/kova/concepts#mcp-工具)。

---

## OpenAI 兼容

Lurus API 的接口格式与 OpenAI 完全一致。任何使用 OpenAI SDK 的代码只需改 `base_url` 和 `api_key` 两个参数即可切换到 Lurus。详见 [快速开始](/guide/quickstart)。

---

## Reflector

MemX 的知识蒸馏引擎。从对话中自动提取有价值的知识（修 bug 方法、配置变更、工具技巧等），无需手动标注。支持纯规则、混合模式、纯 LLM 三种运行模式。详见 [Reflector](/memx/concepts#reflector-知识蒸馏引擎)。

---

## SSE

**Server-Sent Events** — 服务器向客户端单向推送数据的协议。Lurus API 的流式响应使用 SSE，LLM 每生成一个 token 即时推送，实现逐字输出效果。在请求体中设 `"stream": true` 开启。

## Swarm

Kova 的群体智能模式。多个 Agent 在协调者编排下自主协作，无需预定义固定流程。详见 [Swarm](/kova/concepts#swarm-群体智能)。

---

## Token

LLM 处理文本的基本单位。约等于 4 个英文字符或 1.5 个中文字符。API 费用按 prompt tokens（输入）和 completion tokens（输出）的总量计算。

---

## VIP

Lurus 会员等级体系，根据累计消费自动升级（普通 → 银卡 → 金卡 → 钻石）。高等级享受 API 调用折扣和优先客服。详见 [计费详解](/platform/billing)。

---

## WAL

**Write-Ahead Log（预写式日志）** — 数据库领域的经典持久化技术。Kova 的每一步操作先写入 WAL 文件再实际执行。进程崩溃后从 WAL 恢复未完成操作，Agent 从中断点继续，避免重复调用 LLM 的时间和费用浪费。详见 [WAL 机制](/kova/concepts#wal-write-ahead-log)。

## Workflow

Kova 中将多个 Agent 编排成有序执行管道的机制。支持顺序、条件分支、并行、人工审批等。步骤间通过模板变量传递数据。详见 [Workflow](/kova/concepts#workflow)。

---

::: tip 缺少术语？
请在 [GitHub Issues](https://github.com/hanmahong5-arch/lurus-docs/issues) 中提出。
:::
