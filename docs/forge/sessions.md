---
title: Forge — Session 工作流
description: PM / Architect / Code Agent 在 Session 中从需求到 PR 的全流程。
---

# Session 工作流 <StatusBadge status="beta" />

Session 是 Forge 的第二核心数据模型。每一次产品讨论都装进一个 Session，承载对话、决策、Agent 产出的完整时间线。

## Session 模型

```
Session {
  id            // sess_...
  title         // "添加成本告警"
  participants  // [人类, PM Agent, Architect Agent, Code Agent]
  ontology      // 关联的 Ontology 节点列表
  turns         // 对话轮次
  artifacts     // 产出物：PRD、ADR、PR 链接
  status        // active / paused / shipped
}
```

## 三类 Agent

| Agent | 职责 |
|-------|------|
| **PM Agent** | 把模糊需求拆解为用户故事、验收标准、优先级 |
| **Architect Agent** | 架构建模、技术选型、风险识别；写入 Ontology `Architecture` 子树 |
| **Code Agent** | 基于前两者产物写代码、跑测试、开 PR |

## 从 0 到 PR 的完整流

```
人类: "想做一个成本超 50 元每日告警"
  │
  ▼
PM Agent: 拆为 3 个 UserStory
  ├─ US-1 实时聚合每日成本
  ├─ US-2 超阈值触发通知
  └─ US-3 通知模板配置
  │
  ▼
Architect Agent: 决定技术方案
  ├─ 数据源: Lumen CostTracker API
  ├─ 调度: 每 1 分钟 cron
  ├─ 通知渠道: Webhook + 邮件（复用 Lurus Platform）
  └─ 写入 Ontology: Architecture/cost-alert.md
  │
  ▼
Code Agent: 代码实现
  ├─ 生成 Go handler + test
  ├─ 生成 DB migration
  ├─ 开 PR: feat(cost-alert): add daily threshold
  └─ 等待人类 review & merge
```

## WAL 决策回溯

基于 [Kova](/kova/) 引擎的 WAL，每一步对话和决策都被持久化。任何时候可以：

- 回溯"为什么选了 NATS 而不是 Redis Streams"
- 定位"哪次 Session 最后写入了 `Architecture/auth.md`"
- Replay 重放一整个 Session，用于复盘

## 与 Ontology 的关系

Session 是**动态**的时间线；Ontology 是**静态**的结构化知识。
Session 中的决策 → 写入 / 修改 Ontology 节点。

## 下一步

<NextSteps :steps="[
  { text: 'Ontology 深入', link: '/forge/ontology', primary: true },
  { text: '路线图', link: '/forge/roadmap' },
  { text: 'Kova 引擎', link: '/kova/' },
]" />
