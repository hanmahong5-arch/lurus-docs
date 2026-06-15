---
title: 教程 — 搭建有记忆的 AI 客服
description: 用 MemX + Kova + Lurus API 搭一个长期记忆的客服 Agent，附完整项目产物。
---

<div class="memagent-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> MemX × Kova × Lurus API</span>
  <h1 class="lurus-section-head__title">搭建有记忆的 AI 客服</h1>
  <p class="lurus-section-head__lede"><strong>目标</strong>：30 分钟内跑通一个能记住用户历史问题、崩溃自动恢复、按需蒸馏知识的客服 Agent。</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">30 分钟</span><span class="lurus-stat__label">跑通目标</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6 步</span><span class="lurus-stat__label">从依赖到回写</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 服务</span><span class="lurus-stat__label">MemX · Kova · API</span></div>
</div>

## <Icon name="network" :size="20" /> 架构图

三个服务各司其职：MemX 负责长期记忆的召回与蒸馏，Lurus API 负责 LLM 调用，Kova WAL 负责状态持久化与崩溃恢复。

<ArchitectureDiagram title="有记忆 AI 客服架构" chart="graph LR
  U[用户] --> W[Web 前端]
  W -->|HTTP| A[Agent App]
  A -->|1. 召回| M[MemX]
  A -->|2. LLM| L[Lurus API]
  A -->|3. 状态| K[Kova WAL]
  A -->|4. 写入| M
  L --> A
  M --> A" />

## <Icon name="workflow" :size="20" /> 6 步骤

<ol class="lurus-steps">
<li>

**准备依赖**

```bash
pip install lurus memx-client kova-py lumen-ai openai
```

</li>
<li>

**初始化三个服务**

```python
from openai import OpenAI
from memx import Memory
from kova import KovaClient

llm = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-...")
mem = Memory(config={"ace_enabled": True})
kova = KovaClient("kova://localhost")
```

</li>
<li>

**定义 Agent 状态**

```python
from typing import TypedDict, Annotated, Sequence

class State(TypedDict):
    user_id: str
    messages: Annotated[Sequence, "chat history"]
    relevant_memory: list
```

</li>
<li>

**召回历史** — 从 MemX 取回与当前问题相关的记忆

```python
def retrieve_memory(state: State) -> State:
    last = state["messages"][-1]["content"]
    hits = mem.search(last, user_id=state["user_id"], limit=5)
    return {**state, "relevant_memory": hits}
```

</li>
<li>

**调 LLM 并返回** — 把召回的事实注入 system prompt

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

</li>
<li>

**蒸馏回写** — 把新对话写回 MemX，下次召回即可用

```python
def distill(state: State) -> State:
    mem.add(
        list(state["messages"][-2:]),
        user_id=state["user_id"],
        scope="support:general",
    )
    return state
```

</li>
</ol>

## <Icon name="life-buoy" :size="20" /> 加 Kova 崩溃恢复

把 Kova 作为 LangGraph 的 checkpointer 接上，Agent 崩溃后从 WAL 恢复，**不重调 LLM**：

```python
from kova.langgraph import KovaCheckpointer

graph = wf.compile(checkpointer=KovaCheckpointer(kova))
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">为什么不重调 LLM</p>
    <div class="lurus-callout__body"><p>Kova 每步执行预写日志（WAL）。进程崩溃后，引擎从断点重放执行状态，已完成的 LLM 调用不会再次发出——既省 Token，又保证回答一致。</p></div>
  </div>
</div>

## <Icon name="package" :size="20" /> 完整项目产物

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="github" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">示例仓库</p>
    <div class="lurus-callout__body"><p><a href="https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent">https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent</a> — 含代码完整版、<code>docker-compose.yml</code>（本地起 MemX + Kova）、Pytest 覆盖三节点、<code>.env.example</code>。</p></div>
  </div>
</div>

## 下一步

<NextSteps :steps="[
  { text: '加入 Lumen 可观测', link: '/tutorials/lumen-kova-langgraph', primary: true },
  { text: '深入 MemX 概念', link: '/memx/concepts' },
  { text: '部署到 Kova 集群', link: '/kova/quickstart' },
]" />

</div>
