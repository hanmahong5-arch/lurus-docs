---
title: Lumen Python SDK
description: LumenTracer / LumenCheckpointer / CostTracker 三大核心类的完整使用说明。
---

<div class="lumen-page">

# Lumen Python SDK <StatusBadge status="dev" />

`pip install lumen-ai` 后，SDK 提供三大核心类，覆盖采集、持久化与成本聚合：

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--lumen" href="#lumentracer">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">LumenTracer</div>
    <p class="lurus-card__body">回调形式的 Trace + Cost 采集。</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#lumencheckpointer">
    <span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span>
    <div class="lurus-card__title">LumenCheckpointer</div>
    <p class="lurus-card__body">替代 <code>SqliteSaver</code> 的持久化层。</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#costtracker">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">CostTracker</div>
    <p class="lurus-card__body">跨 Agent 成本聚合查询。</p>
  </a>
</div>

## LumenTracer

```python
from lumen_ai import LumenTracer

tracer = LumenTracer(
    project="my-agent",
    tags={"env": "prod", "team": "core"},
    redact=("api_key", "password"),   # 自动脱敏字段
)

graph = workflow.compile(callbacks=[tracer])
```

**主要参数**：

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `project` | `"default"` | 项目标识，决定数据归属 |
| `tags` | `{}` | 每条 Trace 附加的键值对标签 |
| `redact` | `()` | 自动脱敏的字段名元组 |
| `backend` | `"local"` | `local` / `lurus` / 自定义 URL |

## LumenCheckpointer

替代 LangGraph 的 `SqliteSaver`：

```python
from lumen_ai import LumenCheckpointer

graph = workflow.compile(checkpointer=LumenCheckpointer())
```

相比 SqliteSaver：

| 维度 | SqliteSaver | LumenCheckpointer |
|------|-------------|-------------------|
| 恢复速度 | 毫秒级 | **3μs**（基于 Kova 引擎） |
| 多进程 | 需加锁 | **原生支持** |
| 远程持久化 | 需自实现 | **内置** |
| 成本关联 | 无 | **自动** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">直接替换，API 兼容</p>
    <div class="lurus-callout__body"><code>LumenCheckpointer</code> 兼容 LangGraph 的 <code>BaseCheckpointSaver</code> 接口，把原有 <code>SqliteSaver</code> 一行换掉即可，无需改动图结构。详见 <a href="/lumen/integration">生态集成 · LangGraph</a>。</div>
  </div>
</div>

## CostTracker

跨 Agent 成本聚合查询：

```python
from lumen_ai import CostTracker

# 过去 24h
CostTracker.summary(hours=24)

# 按 Agent 拆分
CostTracker.by_agent(hours=24)

# 按 Graph 节点拆分
CostTracker.by_node(graph_id="research-graph")

# 预算告警
CostTracker.set_budget(daily_rmb=50.0, on_exceed=my_handler)
```

## 自定义 Backend

默认数据写入 `~/.lumen/`。发送远端：`LumenTracer(backend="https://lumen.lurus.cn/ingest")`。或自定义：

```python
from lumen_ai.backend import Backend
class MyBackend(Backend):
    def send(self, event): ...
LumenTracer(backend=MyBackend())
```

## Async 支持

SDK 所有 I/O 异步友好：

```python
import asyncio
from lumen_ai import LumenTracer

async def main():
    tracer = LumenTracer()
    async with tracer:
        await graph.ainvoke({"query": "hi"})

asyncio.run(main())
```

## 下一步

<NextSteps :steps="[
  { text: '回到简介', link: '/lumen/', primary: true },
  { text: 'CLI 手册', link: '/lumen/cli' },
  { text: '生态集成', link: '/lumen/integration' },
]" />

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-cards--compact { margin: 18px 0 8px; }
</style>
