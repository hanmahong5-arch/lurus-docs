---
title: Lumen 快速开始
description: 安装 CLI/SDK，跑 lumen demo，接入 LangGraph，导出可转发 lifecycle HTML。
---

<div class="lumen-page">

# Lumen 快速开始 <StatusBadge status="alpha" />

目标：安装 → 离线 aha（`lumen demo`）→ 接入 LangGraph → 分享 lifecycle HTML。

<ol class="lurus-steps">

<li>

**安装 CLI 并看样例**

```bash
curl -fsSL https://raw.githubusercontent.com/hanmahong5-arch/lumen/main/docs/install-cli.sh | bash
export PATH="$HOME/.local/bin:$PATH"
lumen demo
```

</li>

<li>

**安装 Python SDK**

```bash
pip install "lumen-ai[langgraph]"   # PyPI 已通时
# 或：git clone … && pip install -e "./lumen-sdk[langgraph]"
```

导入名是 **`lumen`**，不是 `lumen_ai`。

</li>

<li>

**接入 LangGraph（需手动 callbacks — `instrument()` 不会 monkey-patch LangGraph）**

```python
from lumen.integrations.langgraph import LumenCheckpointer, LumenTracer
from langgraph.prebuilt import create_react_agent

checkpointer = LumenCheckpointer(storage_dir="./checkpoints")
tracer = LumenTracer(trace_dir="./traces")
graph = create_react_agent(model, tools, checkpointer=checkpointer)

graph.invoke(
    {"messages": [("user", "…")]},
    config={"configurable": {"thread_id": "research-1"}, "callbacks": [tracer]},
)
```

</li>

<li>

**查看与分享**

```bash
lumen traces
lumen cost --last 24h --format md
lumen export <trace-id>
lumen replay <trace-id>
```

</li>

</ol>

## 下一步

<NextSteps
  :steps="[
    { text: 'Python SDK', link: '/lumen/python-sdk', primary: true },
    { text: 'CLI 手册', link: '/lumen/cli' },
    { text: '集成', link: '/lumen/integration' },
  ]"
/>

</div>
