---
title: Lumen エコシステム連携
description: Kova / LangGraph / Lurus API / OpenTelemetry / Grafana / Datadog との連携パターン。
---

<div class="lumen-page">

# Lumen エコシステム連携 <StatusBadge status="dev" />

Lumen はセマンティックレイヤーの可観測性ツールとして、下位では Kova 実行エンジンと Lurus API ゲートウェイに接続し、横では LangGraph と互換性を持ち、外部へは標準 OTel トレースを Grafana / Datadog にエクスポートします。

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--kova" href="#kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">WAL 永続化基盤、マイクロ秒単位のクラッシュリカバリ。</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#langgraph">
    <span class="lurus-card__icon"><Icon name="repeat" :size="20" /></span>
    <div class="lurus-card__title">LangGraph</div>
    <p class="lurus-card__body">1 行で Saver を置き換え。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#lurus-api">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Lurus API</div>
    <p class="lurus-card__body">Token 課金を自動で関連付け。</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#opentelemetry">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">OTel / Grafana / Datadog</div>
    <p class="lurus-card__body">標準トレースをエクスポート。</p>
  </a>
</div>

## [Kova](/ja/kova/) との連携 {#kova}

Kova は下層の WAL 状態永続化とマイクロ秒単位のクラッシュリカバリを担当し、Lumen はセマンティックレイヤーの Trace アノテーションとコスト集計を担当します。

```python
from lumen_ai import LumenCheckpointer
from kova import KovaClient

kova = KovaClient("kova://prod")
graph.compile(checkpointer=LumenCheckpointer(kova_client=kova))
```

## [LangGraph](https://langchain-ai.github.io/langgraph/) との連携 {#langgraph}

Saver をそのまま置き換えられます（API は `BaseCheckpointSaver` と完全互換）:

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen_ai import LumenCheckpointer

- graph = wf.compile(checkpointer=SqliteSaver.from_conn_string(":memory:"))
+ graph = wf.compile(checkpointer=LumenCheckpointer())
```

## [Lurus API](/ja/guide/introduction) との連携 {#lurus-api}

Lurus API 経由で LLM を呼び出すと、Token 課金と所要時間が自動的に Lumen Trace に関連付けられます:

```python
from openai import OpenAI
from lumen_ai import LumenTracer

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-...")
tracer = LumenTracer()

with tracer.span("classify"):
    resp = client.chat.completions.create(...)
    # 調用自動記録，鹿贝消费可追溯
```

## OpenTelemetry {#opentelemetry}

OTel Trace としてエクスポート: `LumenTracer(exporters=[to_otlp("http://otel-collector:4317")])`（`from lumen_ai.otel import to_otlp`）。

## Grafana / Datadog

リンクは以下のとおりです。Lumen SDK は OTLP プロトコルで Trace を OTel Collector にプッシュし、さらに Grafana Tempo または Datadog APM へ分配します:

<ArchitectureDiagram
  title="可観測性エクスポートリンク"
  chart="graph LR
  A[Lumen SDK] -->|OTLP| B[OTel Collector]
  B --> C[Grafana Tempo]
  B --> D[Datadog APM]"
/>

Grafana ダッシュボードテンプレートは [Lurus 公式テンプレートライブラリ](/updates/) を参照してください（"Lumen Dashboard" で検索）。

## 次のステップ

<NextSteps
  :steps="[
    { text: 'Python SDK 詳解', link: '/ja/lumen/python-sdk', primary: true },
    { text: 'プロダクト横断チュートリアル', link: '/tutorials/lumen-kova-langgraph' },
    { text: 'LangGraph からの移行', link: '/migrations/from-langgraph' },
  ]"
  title="次のステップ"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-cards--compact { margin: 18px 0 8px; }
</style>
