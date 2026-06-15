---
title: 教程 — Lumen × LangGraph × Kova
description: 用 Lumen 替换 LangGraph 默认 SqliteSaver，部署到 Kova Cluster，对比崩溃恢复效果。
---

<div class="lkl-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Lumen × LangGraph × Kova</span>
  <h1 class="lurus-section-head__title">Lumen × LangGraph × Kova</h1>
  <p class="lurus-section-head__lede"><strong>目标</strong>：把一个 LangGraph Agent 的 Checkpointer 从 <code>SqliteSaver</code> 换成 <code>LumenCheckpointer</code>，部署到 Kova，观察崩溃恢复对比。</p>
</div>

## <Icon name="git-branch" :size="20" /> Before / After

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">Before — 纯 LangGraph</div>
    <p class="lurus-card__body">单机、无远程备份 · 跨进程需加锁 · 崩溃恢复毫秒级 · 无成本追踪。</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">After — Lumen + Kova</div>
    <p class="lurus-card__body">微秒级崩溃恢复（Kova WAL 引擎）· 原生多进程安全 · 自动 Trace + Cost · 远程持久化。</p>
  </div>
</div>

### Before

```python
from langgraph.checkpoint.sqlite import SqliteSaver

graph = wf.compile(checkpointer=SqliteSaver.from_conn_string("./state.db"))
```

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

## <Icon name="terminal" :size="20" /> 本地验证

<ol class="lurus-steps">
<li>

**起本地 Kova**

```bash
docker run -d --name kova -p 9999:9999 ghcr.io/hanmahong5-arch/kova:latest
```

</li>
<li>

**跑你的 Agent**

```bash
python my_agent.py
```

</li>
<li>

**模拟崩溃**

```bash
kill -9 $(pgrep -f my_agent)
```

</li>
<li>

**重启 — 从中断点继续**

```bash
python my_agent.py
```

</li>
</ol>

## <Icon name="rocket" :size="20" /> 部署到 Kova

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

## <Icon name="gauge" :size="20" /> 崩溃恢复对比实验

| 指标 | SqliteSaver | Lumen + Kova |
|------|-------------|--------------|
| 恢复延迟 | 8ms（单机） | **微秒级** |
| 多副本 | 需额外加锁 | **原生** |
| 跨机房 | 手动复制 | **异步复制内置** |
| LLM 重调 | 若 SQLite 写失败则重调 | **永不重调** |
| Trace | 无 | **自动关联** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">微秒级恢复从哪来</p>
    <div class="lurus-callout__body"><p>Kova 引擎调度延迟低至 3μs（FIFO 完整管道 Criterion 基准 3.17μs、315K ops/s）。<code>LumenCheckpointer</code> 把 LangGraph 的 checkpoint 写入交给 Kova WAL —— 恢复走引擎级 WAL 重放而非 SQLite 文件级，因此是微秒级，远快于单机 SQLite 的毫秒级。</p></div>
  </div>
</div>

## 下一步

<NextSteps :steps="[
  { text: '从 LangGraph 迁移', link: '/migrations/from-langgraph', primary: true },
  { text: 'Lumen Python SDK', link: '/lumen/python-sdk' },
  { text: 'Kova 概念', link: '/kova/concepts' },
]" />

</div>
