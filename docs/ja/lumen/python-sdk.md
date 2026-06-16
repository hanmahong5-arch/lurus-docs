---
title: Lumen Python SDK
description: LumenTracer / LumenCheckpointer / CostTracker という3つのコアクラスの完全な利用ガイド。
---

<div class="lumen-page">

# Lumen Python SDK <StatusBadge status="dev" />

`pip install lumen-ai` の後、SDK は3つのコアクラスを提供し、収集・永続化・コスト集計をカバーします：

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--lumen" href="#lumentracer">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">LumenTracer</div>
    <p class="lurus-card__body">コールバック形式の Trace + Cost 収集。</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#lumencheckpointer">
    <span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span>
    <div class="lurus-card__title">LumenCheckpointer</div>
    <p class="lurus-card__body"><code>SqliteSaver</code> を置き換える永続化レイヤー。</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#costtracker">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">CostTracker</div>
    <p class="lurus-card__body">エージェント横断のコスト集計クエリ。</p>
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

**主なパラメータ**：

| パラメータ | デフォルト値 | 説明 |
|------|--------|------|
| `project` | `"default"` | プロジェクト識別子。データの帰属を決定します |
| `tags` | `{}` | 各 Trace に付与するキー・バリューのタグ |
| `redact` | `()` | 自動マスキングするフィールド名のタプル |
| `backend` | `"local"` | `local` / `lurus` / カスタム URL |

## LumenCheckpointer

LangGraph の `SqliteSaver` を置き換えます：

```python
from lumen_ai import LumenCheckpointer

graph = workflow.compile(checkpointer=LumenCheckpointer())
```

SqliteSaver との比較：

| 観点 | SqliteSaver | LumenCheckpointer |
|------|-------------|-------------------|
| 復元速度 | ミリ秒級 | **マイクロ秒級**（Kova WAL エンジンベース） |
| マルチプロセス | ロックが必要 | **ネイティブ対応** |
| リモート永続化 | 自前実装が必要 | **組み込み** |
| コスト関連付け | なし | **自動** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">そのまま置き換え可能、API 互換</p>
    <div class="lurus-callout__body"><code>LumenCheckpointer</code> は LangGraph の <code>BaseCheckpointSaver</code> インターフェースと互換性があり、既存の <code>SqliteSaver</code> を1行差し替えるだけで済み、グラフ構造を変更する必要はありません。詳細は <a href="/ja/lumen/integration">エコシステム統合 · LangGraph</a> を参照してください。</div>
  </div>
</div>

## CostTracker

エージェント横断のコスト集計クエリ：

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

## カスタム Backend

デフォルトではデータは `~/.lumen/` に書き込まれます。リモートへ送信する場合：`LumenTracer(backend="https://lumen.lurus.cn/ingest")`。あるいはカスタマイズ：

```python
from lumen_ai.backend import Backend
class MyBackend(Backend):
    def send(self, event): ...
LumenTracer(backend=MyBackend())
```

## Async サポート

SDK のすべての I/O は非同期フレンドリーです：

```python
import asyncio
from lumen_ai import LumenTracer

async def main():
    tracer = LumenTracer()
    async with tracer:
        await graph.ainvoke({"query": "hi"})

asyncio.run(main())
```

## 次のステップ

<NextSteps :steps="[
  { text: '概要に戻る', link: '/ja/lumen/', primary: true },
  { text: 'CLI ガイド', link: '/ja/lumen/cli' },
  { text: 'エコシステム統合', link: '/ja/lumen/integration' },
]" />

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-cards--compact { margin: 18px 0 8px; }
</style>
