---
title: Lumen 快速开始
description: 三行代码把 Lumen 接入 LangGraph / Agent 项目，查看首次 Trace 与成本。
---

# Lumen 快速开始 <StatusBadge status="dev" />

10 分钟完成：安装 → 接入 LangGraph → 查看首次 Trace → 触发 Replay → 统计 24h 成本。

## 前置条件

Python 3.9+ · Lurus <Term t="API Key">API Key</Term>（[获取方式](/guide/get-api-key)）· 已有 LangGraph/LangChain Agent 项目（无则用下方最小示例）。

## 安装与三行接入 LangGraph

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

## 最小运行示例

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

## 查看 Trace

访问控制台（默认 `http://localhost:7070`）或 Lurus 控制台 Lumen 页：每次 graph 执行完整时间线、每节点输入/输出/耗时、LLM 调用的 prompt/completion/Token 数。

## 触发 Replay

从历史执行序列重放一次，**不消耗 Token**（用于本地复现 bug、验证修复、Prompt A/B）：

```python
from lumen_ai import Replay
Replay.from_run_id("run_abc123").play()
```

## 24 小时成本

```python
from lumen_ai import CostTracker

print(CostTracker.summary(hours=24))
# { total_tokens: 128_340, cost_rmb: 12.47, by_model: {...} }
```

## 下一步

- <Icon name="arrow-right" :size="14" /> 深入 [Python SDK](/lumen/python-sdk) — `LumenTracer` / `LumenCheckpointer` / `CostTracker` 详解
- <Icon name="arrow-right" :size="14" /> 查看 [CLI 手册](/lumen/cli) — 常用命令与自动化脚手架
- <Icon name="arrow-right" :size="14" /> 阅读 [生态集成](/lumen/integration) — 与 Kova / LangGraph / OpenTelemetry 协同

<RelatedProducts product-id="lumen" />
