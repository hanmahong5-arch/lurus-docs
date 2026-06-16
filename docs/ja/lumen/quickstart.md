---
title: Lumen クイックスタート
description: 3 行のコードで Lumen を LangGraph / Agent プロジェクトに組み込み、初回 Trace とコストを確認します。
---

<div class="lumen-page">

# Lumen クイックスタート <StatusBadge status="dev" />

10 分で完了：インストール → LangGraph へ組み込み → 初回 Trace を確認 → Replay を実行 → 24 時間のコストを集計。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">10 分</span><span class="lurus-stat__label">全工程</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 行</span><span class="lurus-stat__label">組み込みコード</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">0</span><span class="lurus-stat__label">ビジネスロジックの変更</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前提条件</p>
    <div class="lurus-callout__body">Python 3.9+ · Lurus <Term t="API Key">API Key</Term>（<a href="/ja/guide/get-api-key">取得方法</a>）· 既存の LangGraph/LangChain Agent プロジェクト（なければ下記の最小サンプルを利用）。</div>
  </div>
</div>

<ol class="lurus-steps">

<li>

**インストールと 3 行での LangGraph 組み込み**

```bash
pip install lumen-ai
```
```python
from lumen_ai import LumenTracer, LumenCheckpointer
graph = workflow.compile(
    checkpointer=LumenCheckpointer(),   # 崩溃恢复
    callbacks=[LumenTracer()],           # 执行追踪 + 成本追踪
)
```

ビジネスロジックを変更する必要はなく、すべての LLM 呼び出し、ツール呼び出し、状態変更が Lumen バックエンドに記録されます。

</li>

<li>

**最小の実行サンプルを動かす**

```python
from langgraph.graph import StateGraph, END
from lumen_ai import LumenTracer, LumenCheckpointer
from typing import TypedDict

class State(TypedDict):
    query: str
    result: str

def search(state: State) -> State:
    return {**state, "result": f"已处理: {state['query']}"}

wf = StateGraph(State)
wf.add_node("search", search)
wf.set_entry_point("search")
wf.add_edge("search", END)

graph = wf.compile(
    checkpointer=LumenCheckpointer(),
    callbacks=[LumenTracer()],
)

graph.invoke({"query": "什么是 WAL"})
```

</li>

<li>

**Trace を確認する**

コンソール（デフォルト `http://localhost:7070`）または Lurus コンソールの Lumen ページにアクセス：graph 実行ごとの完全なタイムライン、各ノードの入力/出力/所要時間、LLM 呼び出しの prompt/completion/Token 数を確認できます。

</li>

<li>

**Replay を実行する**

履歴の実行シーケンスから一度リプレイし、**Token を消費しません**（ローカルでのバグ再現、修正の検証、Prompt A/B に利用）：

```python
from lumen_ai import Replay
Replay.from_run_id("run_abc123").play()
```

</li>

<li>

**24 時間のコストを集計する**

```python
from lumen_ai import CostTracker

print(CostTracker.summary(hours=24))
# { total_tokens: 128_340, cost_rmb: 12.47, by_model: {...} }
```

</li>

</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Replay はコストがかからない</p>
    <div class="lurus-callout__body">Replay は記録された実行シーケンスから再生し、<strong>LLM を再度呼び出すことはありません</strong>。そのためバグ再現、修正の検証、Prompt A/B のいずれもゼロ Token コストです。</div>
  </div>
</div>

## 次のステップ

<NextSteps
  :steps="[
    { text: 'Python SDK — LumenTracer / LumenCheckpointer / CostTracker 詳解', link: '/ja/lumen/python-sdk', primary: true },
    { text: 'CLI ハンドブック — 主要コマンドと自動化スキャフォールド', link: '/ja/lumen/cli' },
    { text: 'エコシステム連携 — Kova / LangGraph / OpenTelemetry との協調', link: '/ja/lumen/integration' },
  ]"
  title="次のステップ"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-stat-strip { margin: 16px 0 8px; }
</style>
