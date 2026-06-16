---
title: Lumen 생태계 통합
description: Kova / LangGraph / Lurus API / OpenTelemetry / Grafana / Datadog와의 통합 패러다임.
---

<div class="lumen-page">

# Lumen 생태계 통합 <StatusBadge status="dev" />

Lumen은 시맨틱 계층 관측 도구로서, 아래로는 Kova 실행 엔진과 Lurus API 게이트웨이에 연결되고, 옆으로는 LangGraph와 호환되며, 밖으로는 표준 OTel 트레이스를 Grafana / Datadog으로 내보냅니다.

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--kova" href="#kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">WAL 영속화 기반, 마이크로초 단위 크래시 복구.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#langgraph">
    <span class="lurus-card__icon"><Icon name="repeat" :size="20" /></span>
    <div class="lurus-card__title">LangGraph</div>
    <p class="lurus-card__body">한 줄로 Saver 교체.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#lurus-api">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Lurus API</div>
    <p class="lurus-card__body">Token 과금 자동 연동.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#opentelemetry">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">OTel / Grafana / Datadog</div>
    <p class="lurus-card__body">표준 트레이스 내보내기.</p>
  </a>
</div>

## [Kova](/ko/kova/)와 통합 {#kova}

Kova는 하위 계층의 WAL 상태 영속화와 마이크로초 단위 크래시 복구를 담당하고, Lumen은 시맨틱 계층의 트레이스 어노테이션과 비용 집계를 담당합니다.

```python
from lumen_ai import LumenCheckpointer
from kova import KovaClient

kova = KovaClient("kova://prod")
graph.compile(checkpointer=LumenCheckpointer(kova_client=kova))
```

## [LangGraph](https://langchain-ai.github.io/langgraph/)와 통합 {#langgraph}

Saver를 직접 교체하면 됩니다(API가 `BaseCheckpointSaver`와 완전히 호환):

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen_ai import LumenCheckpointer

- graph = wf.compile(checkpointer=SqliteSaver.from_conn_string(":memory:"))
+ graph = wf.compile(checkpointer=LumenCheckpointer())
```

## [Lurus API](/ko/guide/introduction)와 통합 {#lurus-api}

Lurus API를 통해 LLM을 호출하면 Token 과금과 소요 시간이 자동으로 Lumen 트레이스에 연동됩니다:

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

OTel 트레이스로 내보내기: `LumenTracer(exporters=[to_otlp("http://otel-collector:4317")])`(`from lumen_ai.otel import to_otlp`).

## Grafana / Datadog

링크 구조는 다음과 같으며, Lumen SDK가 OTLP 프로토콜로 트레이스를 OTel Collector에 푸시한 뒤, 다시 Grafana Tempo 또는 Datadog APM으로 분배합니다:

<ArchitectureDiagram
  title="관측성 내보내기 링크"
  chart="graph LR
  A[Lumen SDK] -->|OTLP| B[OTel Collector]
  B --> C[Grafana Tempo]
  B --> D[Datadog APM]"
/>

Grafana 대시보드 템플릿은 [Lurus 공식 템플릿 라이브러리](/updates/)에서 확인하세요("Lumen Dashboard" 검색).

## 다음 단계

<NextSteps
  :steps="[
    { text: 'Python SDK 상세', link: '/ko/lumen/python-sdk', primary: true },
    { text: '제품 간 튜토리얼', link: '/tutorials/lumen-kova-langgraph' },
    { text: 'LangGraph에서 마이그레이션', link: '/migrations/from-langgraph' },
  ]"
  title="다음 단계"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-cards--compact { margin: 18px 0 8px; }
</style>
