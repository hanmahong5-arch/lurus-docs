---
title: "在 LangGraph 应用旁接入 Lumen"
description: "SqliteSaver → LumenCheckpointer，加 LumenTracer，导出 lifecycle HTML。没有 lumen deploy。"
---

<div class="mig-lg-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-branch" :size="14" /> LangGraph + Lumen</span>
  <h1 class="lurus-section-head__title">在 LangGraph 旁接入 Lumen</h1>
  <p class="lurus-section-head__lede">保留你的图。加上本地 checkpoint + traces。分享 lifecycle HTML。WAL 深度在 Connected 时交给 Kova — Lumen 不是部署目标。</p>
</div>

## 你得到什么

| 之前 | 之后（Lumen Core） |
|------|------|
| SqliteSaver / MemorySaver | **LumenCheckpointer** 本地盘 |
| 无花费视图 | **CostTracker** / `lumen cost` |
| 只有日志 | **LumenTracer** → `lumen export` HTML |
| LangGraph time-travel（会重跑节点） | 从记录 trace **零花费 replay** |

## 步骤

1. `pip install "lumen-ai[langgraph]"`（或源码 editable）
2. `from lumen.integrations.langgraph import LumenCheckpointer, LumenTracer`
3. `compile(checkpointer=LumenCheckpointer(...))`，invoke 时 `callbacks=[LumenTracer(...)]`
4. `lumen traces` / `lumen export <id>` — **没有** `lumen deploy`

崩溃后续跑：同一 `storage_dir` + `thread_id`，用 `resume_hint` / `latest_config`，`invoke(None, …)`。

## 下一步

<NextSteps :steps="[
  { text: 'Lumen 总览', link: '/lumen/', primary: true },
  { text: '快速开始', link: '/lumen/quickstart' },
  { text: 'Kova', link: '/kova/' },
]" />

</div>
