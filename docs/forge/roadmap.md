---
title: Forge — 路线图与内测申请
description: 当前 beta 能力、计划中的 Dependency Guardian / Agent 可视化 / 知识库，以及内测申请方式。
---

# Forge 路线图 <StatusBadge status="beta" />

## 当前 Beta 能力

| 能力 | 状态 | 简述 |
|------|------|------|
| Ontology 可视化树 | <StatusBadge status="beta" /> | 可折叠树 + 节点卡片 |
| PM/Architect/Code Session | <StatusBadge status="beta" /> | 三类 Agent 对话协作 |
| WAL 决策回溯 | <StatusBadge status="beta" /> | 依赖 Kova 引擎 |
| PR 自动化 | <StatusBadge status="dev" /> | Code Agent 直接开 PR |

## 规划中

### Dependency Guardian <StatusBadge status="plan" />

跨 Epic / Story 的接口变更检测：一个 API 契约修改时，自动定位所有受影响的 Session 与 PR。

### Agent 可视化 <StatusBadge status="plan" />

Session 里 Agent 的思考过程、工具调用、中间结果以**可视化时间线**展示，而非纯文本 log。

### 知识库 <StatusBadge status="plan" />

将 [MemX](/memx/) 接入 Forge，作为 Agent 在 Session 中检索历史决策 / 规范 / 踩坑记录的长期记忆层。

## 内测申请

Forge 当前定位为 Lurus **内部 R&D 工具**，**不是对外售卖的商业产品**。受邀内测通道：

- <Icon name="mail" :size="14" /> 邮件：`business@lurus.cn`（主题注明"Forge 内测申请"）
- 说明团队规模、当前需求管理工具、期望解决的痛点

## 近期里程碑

```
2026 Q2  ─── PR 自动化 GA
2026 Q3  ─── Dependency Guardian beta
2026 Q4  ─── Agent 可视化 beta
2027 Q1  ─── 知识库 beta（MemX 深度集成）
```

## 相关产品

<RelatedProducts product-id="forge" />
