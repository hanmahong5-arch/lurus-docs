---
title: 教程 — Lumen × LangGraph × Kova
description: 用 Lumen 替换 LangGraph 默认 SqliteSaver，部署到 Kova Cluster，对比崩溃恢复效果。
---

# Lumen × LangGraph × Kova

**目标**：把一个 LangGraph Agent 的 Checkpointer 从 `SqliteSaver` 换成 `LumenCheckpointer`，部署到 Kova，观察崩溃恢复对比。

## Before / After

### Before

```python
from langgraph.checkpoint.sqlite import SqliteSaver

graph = wf.compile(checkpointer=SqliteSaver.from_conn_string("./state.db"))
```

问题：

- 单机、无远程备份
- 跨进程需加锁
- 崩溃恢复毫秒级
- 无成本追踪

### After

```python
from lumen_ai import LumenCheckpointer, LumenTracer
from kova import KovaClient

kova = KovaClient("kova://prod-cluster")

graph = wf.compile(
    checkpointer=LumenCheckpointer(kova_client=kova),
    callbacks=[LumenTracer()],
)
```

变化：

- 3μs 崩溃恢复（Kova 引擎）
- 原生多进程安全
- 自动 Trace + Cost
- 远程持久化

## 本地验证

```bash
# 起本地 Kova
docker run -d --name kova -p 9999:9999 ghcr.io/hanmahong5-arch/kova:latest

# 跑你的 Agent
python my_agent.py

# 模拟崩溃
kill -9 $(pgrep -f my_agent)

# 重启 — 从中断点继续
python my_agent.py
```

## 部署到 Kova

```yaml
# agent.yaml
name: my-research-agent
entry: python my_agent.py
replicas: 3
checkpointer: lumen
wal:
  retention: 7d
```

```bash
lumen deploy --target kova://prod-cluster
```

## 崩溃恢复对比实验

| 指标 | SqliteSaver | Lumen + Kova |
|------|-------------|--------------|
| 恢复延迟 | 8ms（单机） | **3μs** |
| 多副本 | 需额外加锁 | **原生** |
| 跨机房 | 手动复制 | **异步复制内置** |
| LLM 重调 | 若 SQLite 写失败则重调 | **永不重调** |
| Trace | 无 | **自动关联** |

## 下一步

<NextSteps :steps="[
  { text: '从 LangGraph 迁移', link: '/migrations/from-langgraph', primary: true },
  { text: 'Lumen Python SDK', link: '/lumen/python-sdk' },
  { text: 'Kova 概念', link: '/kova/concepts' },
]" />
