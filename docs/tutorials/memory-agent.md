---
title: 教程 — 搭建有记忆的 AI 客服
description: 用 MemX + Kova + Lurus API 搭一个长期记忆的客服 Agent，附完整项目产物。
---

# 搭建有记忆的 AI 客服

**目标**：30 分钟内跑通一个能记住用户历史问题、崩溃自动恢复、按需蒸馏知识的客服 Agent。

## 架构图

<ArchitectureDiagram title="有记忆 AI 客服架构" chart="graph LR
  U[用户] --> W[Web 前端]
  W -->|HTTP| A[Agent App]
  A -->|1. 召回| M[MemX]
  A -->|2. LLM| L[Lurus API]
  A -->|3. 状态| K[Kova WAL]
  A -->|4. 写入| M
  L --> A
  M --> A" />

## 6 步骤

### 1. 准备依赖

```bash
pip install lurus memx-client kova-py lumen-ai openai
```

### 2. 初始化三个服务

```python
from openai import OpenAI
from memx import Memory
from kova import KovaClient

llm = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-...")
mem = Memory(config={"ace_enabled": True})
kova = KovaClient("kova://localhost")
```

### 3. 定义 Agent 状态

```python
from typing import TypedDict, Annotated, Sequence

class State(TypedDict):
    user_id: str
    messages: Annotated[Sequence, "chat history"]
    relevant_memory: list
```

### 4. 召回历史

```python
def retrieve_memory(state: State) -> State:
    last = state["messages"][-1]["content"]
    hits = mem.search(last, user_id=state["user_id"], limit=5)
    return {**state, "relevant_memory": hits}
```

### 5. 调 LLM 并返回

```python
def respond(state: State) -> State:
    context = "\n".join(h["text"] for h in state["relevant_memory"])
    resp = llm.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": f"已知事实:\n{context}"},
            *state["messages"],
        ],
    )
    reply = resp.choices[0].message.content
    return {**state, "messages": [*state["messages"], {"role": "assistant", "content": reply}]}
```

### 6. 蒸馏回写

```python
def distill(state: State) -> State:
    mem.add(
        list(state["messages"][-2:]),
        user_id=state["user_id"],
        scope="support:general",
    )
    return state
```

## 加 Kova 崩溃恢复

```python
from kova.langgraph import KovaCheckpointer

graph = wf.compile(checkpointer=KovaCheckpointer(kova))
```

崩溃后从 WAL 恢复，不重调 LLM。

## 完整项目产物

<https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent>

包含：

- 上述代码完整版
- `docker-compose.yml`（本地起 MemX + Kova）
- Pytest 覆盖三个节点
- `.env.example`

## 下一步

<NextSteps :steps="[
  { text: '加入 Lumen 可观测', link: '/tutorials/lumen-kova-langgraph', primary: true },
  { text: '深入 MemX 概念', link: '/memx/concepts' },
  { text: '部署到 Kova 集群', link: '/kova/quickstart' },
]" />
