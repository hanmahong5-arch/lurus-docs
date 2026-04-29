---
title: 从 LangGraph 迁移到 Lumen + Kova
description: SqliteSaver → LumenCheckpointer + LumenTracer，Agent 部署到 Kova 集群。
---

# 从 LangGraph 迁移到 Lumen + Kova

## 你会得到

| Before（纯 LangGraph） | After |
|---------------------|-------|
| SqliteSaver 单机持久化 | **LumenCheckpointer + Kova** 3μs 恢复 |
| 无 Trace | **LumenTracer** 自动采集 |
| 无 Cost 统计 | **CostTracker** 按 Node 聚合 |
| 手动 Replay | **Replay.from_run_id()** 一行 |

## 步骤一：替换 Checkpointer

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen_ai import LumenCheckpointer

- graph = wf.compile(
-     checkpointer=SqliteSaver.from_conn_string("./state.db")
- )
+ graph = wf.compile(
+     checkpointer=LumenCheckpointer()
+ )
```

`LumenCheckpointer` 100% 实现 `BaseCheckpointSaver`，无需改任何业务代码。

## 步骤二：加 Tracer

```diff
+ from lumen_ai import LumenTracer

  graph = wf.compile(
      checkpointer=LumenCheckpointer(),
+     callbacks=[LumenTracer()],
  )
```

本地启动后，访问 `http://localhost:7070` 即可看到 Trace 时间线。

## 步骤三：部署到 Kova

```yaml
# agent.yaml
name: research-agent
entry: python my_agent.py
checkpointer: lumen
replicas: 3
```

```bash
lumen deploy --target kova://prod-cluster
```

## 本地验证

```bash
python my_agent.py           # 正常跑
kill -9 $(pgrep -f my_agent) # 模拟崩溃
python my_agent.py           # 从中断点继续，不重调 LLM
```

## 性能对比

| 指标 | Before | After |
|------|--------|-------|
| 恢复延迟 | 8ms | **3μs** |
| 多进程 | 需加锁 | **原生** |
| 跨机房 | 手动 | **异步复制** |
| LLM 重调 | 有时 | **永不** |

## 回滚

保留旧 SqliteSaver 代码注释；任何时候还原 diff 即回到原状。数据不互通，但可并行跑。

## 下一步

<NextSteps :steps="[
  { text: 'Lumen Python SDK', link: '/lumen/python-sdk', primary: true },
  { text: '部署 Kova', link: '/kova/quickstart' },
  { text: '完整教程', link: '/tutorials/lumen-kova-langgraph' },
]" />
