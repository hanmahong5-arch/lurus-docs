---
title: MemX — AI 自适应记忆引擎
description: 基于 ACE v2.0 构建的 AI 记忆引擎，智能蒸馏、仿生遗忘、全链路隐私保护。
---

# MemX — AI 自适应记忆引擎 <StatusBadge status="dev" />

## 什么是 MemX？

**MemX** 是 Lurus 推出的 AI 自适应记忆引擎，基于 **<Term t="ACE">ACE（Adaptive Context Engine）</Term>v2.0** 构建。它为 AI Agent 提供完整的知识生命周期管理：**<Term t="Knowledge Distillation">智能蒸馏</Term> → <Term t="Semantic Dedup">语义去重</Term> → 衰退遗忘 → 混合检索**，让 AI 拥有真正像人类一样的"记忆力"。

核心优势：**默认混合模式 + 自动降级**（LLM 不可用切纯规则，零调用零成本）、**仿生遗忘曲线**（Ebbinghaus 指数衰减，半衰期默认 30 天，强召回项升永久记忆）、**全链路隐私保护**（敏感信息永不进向量数据库）。

## 核心特性

四大模块详解（含规则/公式/参数）见 [核心概念](/memx/concepts) 与 [架构设计](/memx/architecture)：

- **智能知识蒸馏（Reflector）**：hybrid 模式（规则预筛 + LLM 精炼）识别 5 种知识模式（错误修复 / 重试成功 / 配置变更 / 新工具使用 / 重复操作），每条 0-100 评分，过滤低分噪音。
- **语义去重与冲突检测（Curator）**：余弦相似度 ≥0.8 自动合并、0.5-0.8 标记潜在冲突、<0.5 独立知识。
- **仿生记忆衰减**：7 天保护期 + 指数衰减 + 召回增强；被检索 15 次以上晋升永久记忆不再衰减。
- **四层混合检索**：L1 精确 → L2 模糊 → L3 元数据 → L4 向量，ScoreMerger 加权融合后 `× DecayWeight × RecencyBoost × ScopeBoost`，向量层不可用自动降级。
- **隐私优先设计**：12 条内置敏感信息过滤规则（OpenAI/Anthropic/AWS/GitHub API Key、数据库连接串、PEM 私钥/JWT、本地用户路径 Win/Unix、自定义正则），写入前自动拦截。

## 适用场景

| 场景 | 说明 |
|------|------|
| **编程助手** | 记住你的代码习惯、踩过的坑、项目约定 |
| **客服系统** | 积累客户历史交互知识，提供个性化服务 |
| **个人知识库** | 从日常对话中自动提炼和组织知识 |
| **团队协作** | 共享团队级记忆，新成员快速获取上下文 |

## 与传统记忆系统的对比

| 能力 | 传统方案 (mem0) | MemX (ACE) |
|------|----------------|------------|
| 知识提取 | LLM（每次 2-5K tokens） | hybrid 混合引擎（规则预筛 + LLM 精炼，减少 90%+ 调用） |
| 去重 | LLM 逐条判断 | 余弦相似度自动合并 |
| 遗忘 | 永久存储，无法淘汰 | 指数衰减 + 召回增强 |
| 搜索 | 仅向量搜索 | 四层混合搜索 |
| 隐私 | 无内置保护 | 12 条内置敏感信息过滤规则（密钥 / Token / 本地路径等） |
| 作用域 | 扁平（user / agent） | 层级化（global / project / workspace） |
| Token 管理 | 调用方自行管理 | 内置预算裁剪（CJK 感知） |
| 本地嵌入 | 需要 API | ONNX 本地推理，完全离线 |

## 下一步

- [快速开始](/memx/quickstart) — 5 分钟体验 MemX 的核心功能
- [核心概念](/memx/concepts) — 深入理解 ACE 引擎的设计原理
- [架构设计](/memx/architecture) — 了解完整的系统架构
- [常见问题](/memx/faq) — 使用中的常见问题解答

---

## 相关产品

- [Kova — Agent 持久执行引擎](/kova/) — 使用 MemX 记忆的 Agent 运行时，原生集成 MemoryProvider
- [Lucrum — AI 量化交易](/lucrum/) — 通过 MemX 记忆用户交易偏好和策略经验

<!-- lurus:related-block -->

---

## 相关产品与下一步

<RelatedProducts product-id="memx" />

