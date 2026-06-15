---
title: Lumen 生态集成
description: 与 Kova / LangGraph / Lurus API / OpenTelemetry / Grafana / Datadog 的集成范式。
---

<div class="lumen-page">

# Lumen 生态集成 <StatusBadge status="dev" />

Lumen 作为语义层可观测性工具，向下接 Kova 执行引擎与 Lurus API 网关，向旁兼容 LangGraph，向外导出标准 OTel 链路到 Grafana / Datadog。

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--kova" href="#kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">WAL 持久化底座，微秒级崩溃恢复。</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#langgraph">
    <span class="lurus-card__icon"><Icon name="repeat" :size="20" /></span>
    <div class="lurus-card__title">LangGraph</div>
    <p class="lurus-card__body">一行替换 Saver。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#lurus-api">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Lurus API</div>
    <p class="lurus-card__body">Token 计费自动关联。</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#opentelemetry">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">OTel / Grafana / Datadog</div>
    <p class="lurus-card__body">导出标准链路。</p>
  </a>
</div>

## 与 [Kova](/kova/) {#kova}

Kova 负责底层 WAL 状态持久化与微秒级崩溃恢复，Lumen 负责语义层 Trace 标注与成本统计。

```python
from lumen_ai import LumenCheckpointer
from kova import KovaClient

kova = KovaClient("kova://prod")
graph.compile(checkpointer=LumenCheckpointer(kova_client=kova))
```

## 与 [LangGraph](https://langchain-ai.github.io/langgraph/) {#langgraph}

直接替换 Saver（API 完全兼容 `BaseCheckpointSaver`）：

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen_ai import LumenCheckpointer

- graph = wf.compile(checkpointer=SqliteSaver.from_conn_string(":memory:"))
+ graph = wf.compile(checkpointer=LumenCheckpointer())
```

## 与 [Lurus API](/guide/introduction) {#lurus-api}

经 Lurus API 调 LLM 时，Token 计费和耗时自动关联到 Lumen Trace：

```python
from openai import OpenAI
from lumen_ai import LumenTracer

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-...")
tracer = LumenTracer()

with tracer.span("classify"):
    resp = client.chat.completions.create(...)
    # 调用自动记录，鹿贝消费可追溯
```

## OpenTelemetry {#opentelemetry}

导出为 OTel Trace：`LumenTracer(exporters=[to_otlp("http://otel-collector:4317")])`（`from lumen_ai.otel import to_otlp`）。

## Grafana / Datadog

链路如下，Lumen SDK 以 OTLP 协议把 Trace 推给 OTel Collector，再分发到 Grafana Tempo 或 Datadog APM：

<ArchitectureDiagram
  title="可观测性导出链路"
  chart="graph LR
  A[Lumen SDK] -->|OTLP| B[OTel Collector]
  B --> C[Grafana Tempo]
  B --> D[Datadog APM]"
/>

Grafana 仪表盘模板见 [Lurus 官方模板库](/updates/)（搜 "Lumen Dashboard"）。

## 下一步

<NextSteps
  :steps="[
    { text: 'Python SDK 详解', link: '/lumen/python-sdk', primary: true },
    { text: '跨产品教程', link: '/tutorials/lumen-kova-langgraph' },
    { text: '从 LangGraph 迁移', link: '/migrations/from-langgraph' },
  ]"
  title="下一步"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-cards--compact { margin: 18px 0 8px; }
</style>
