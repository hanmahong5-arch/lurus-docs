---
title: Lumen 快速开始
description: 三行代码把 Lumen 接入 LangGraph / Agent 项目，查看首次 Trace 与成本。
---

<div class="lumen-page">

# Lumen 快速开始 <StatusBadge status="dev" />

10 分钟完成：安装 → 接入 LangGraph → 查看首次 Trace → 触发 Replay → 统计 24h 成本。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">10 分钟</span><span class="lurus-stat__label">全程</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 行</span><span class="lurus-stat__label">接入代码</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">0</span><span class="lurus-stat__label">业务逻辑改动</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前置条件</p>
    <div class="lurus-callout__body">Python 3.9+ · Lurus <Term t="API Key">API Key</Term>（<a href="/guide/get-api-key">获取方式</a>）· 已有 LangGraph/LangChain Agent 项目（无则用下方最小示例）。</div>
  </div>
</div>

<ol class="lurus-steps">

<li>

**安装与三行接入 LangGraph**

```bash
pip install lumen-ai
```
```python
from lumen_ai import LumenTracer, LumenCheckpointer
graph = workflow.compile(
    checkpointer=LumenCheckpointer(),   # 崩溃恢复
    callbacks=[LumenTracer()],           # 执行追踪 + 成本追踪
)
```

无需改业务逻辑，所有 LLM 调用、工具调用、状态变更都记录到 Lumen 后端。

</li>

<li>

**跑一个最小运行示例**

```python
from langgraph.graph import StateGraph, END
from lumen_ai import LumenTracer, LumenCheckpointer
from typing import TypedDict

class State(TypedDict):
    query: str
    result: str

def search(state: State) -> State:
    return {**state, "result": f"已处理: {state['query']}"}

wf = StateGraph(State)
wf.add_node("search", search)
wf.set_entry_point("search")
wf.add_edge("search", END)

graph = wf.compile(
    checkpointer=LumenCheckpointer(),
    callbacks=[LumenTracer()],
)

graph.invoke({"query": "什么是 WAL"})
```

</li>

<li>

**查看 Trace**

访问控制台（默认 `http://localhost:7070`）或 Lurus 控制台 Lumen 页：每次 graph 执行完整时间线、每节点输入/输出/耗时、LLM 调用的 prompt/completion/Token 数。

</li>

<li>

**触发 Replay**

从历史执行序列重放一次，**不消耗 Token**（用于本地复现 bug、验证修复、Prompt A/B）：

```python
from lumen_ai import Replay
Replay.from_run_id("run_abc123").play()
```

</li>

<li>

**统计 24 小时成本**

```python
from lumen_ai import CostTracker

print(CostTracker.summary(hours=24))
# { total_tokens: 128_340, cost_rmb: 12.47, by_model: {...} }
```

</li>

</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Replay 不花钱</p>
    <div class="lurus-callout__body">Replay 从记录的执行序列回放，<strong>不会重新调用 LLM</strong>，因此复现 bug、验证修复、做 Prompt A/B 都是零 Token 成本。</div>
  </div>
</div>

## 下一步

<NextSteps
  :steps="[
    { text: 'Python SDK — LumenTracer / LumenCheckpointer / CostTracker 详解', link: '/lumen/python-sdk', primary: true },
    { text: 'CLI 手册 — 常用命令与自动化脚手架', link: '/lumen/cli' },
    { text: '生态集成 — 与 Kova / LangGraph / OpenTelemetry 协同', link: '/lumen/integration' },
  ]"
  title="下一步"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-stat-strip { margin: 16px 0 8px; }
</style>
