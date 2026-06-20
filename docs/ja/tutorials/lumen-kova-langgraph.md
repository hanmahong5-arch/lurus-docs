---
title: "チュートリアル — Lumen × LangGraph × Kova"
description: "Lumen で LangGraph デフォルトの SqliteSaver を置き換え、Kova Cluster へデプロイし、クラッシュ復旧の効果を比較します。"
---

<div class="lkl-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Lumen × LangGraph × Kova</span>
  <h1 class="lurus-section-head__title">Lumen × LangGraph × Kova</h1>
  <p class="lurus-section-head__lede"><strong>目標</strong>：ある LangGraph Agent の Checkpointer を <code>SqliteSaver</code> から <code>LumenCheckpointer</code> に置き換え、Kova へデプロイして、クラッシュ復旧を比較します。</p>
</div>

## <Icon name="git-branch" :size="20" /> Before / After

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">Before — 純粋な LangGraph</div>
    <p class="lurus-card__body">単一マシン・リモートバックアップなし · プロセス間ではロックが必要 · クラッシュ復旧はミリ秒級 · コスト追跡なし。</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">After — Lumen + Kova</div>
    <p class="lurus-card__body">マイクロ秒級のクラッシュ復旧（Kova WAL エンジン）· ネイティブなマルチプロセス安全性 · 自動 Trace + Cost · リモート永続化。</p>
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

## <Icon name="terminal" :size="20" /> ローカル検証

<ol class="lurus-steps">
<li>

**ローカルで Kova を起動**

```bash
docker run -d --name kova -p 9999:9999 ghcr.io/hanmahong5-arch/kova:latest
```

</li>
<li>

**あなたの Agent を実行**

```bash
python my_agent.py
```

</li>
<li>

**クラッシュをシミュレート**

```bash
kill -9 $(pgrep -f my_agent)
```

</li>
<li>

**再起動 — 中断点から再開**

```bash
python my_agent.py
```

</li>
</ol>

## <Icon name="rocket" :size="20" /> Kova へのデプロイ

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

## <Icon name="gauge" :size="20" /> クラッシュ復旧の比較実験

| 指標 | SqliteSaver | Lumen + Kova |
|------|-------------|--------------|
| 復旧レイテンシ | 8ms（単一マシン） | **マイクロ秒級** |
| 複数レプリカ | 追加のロックが必要 | **ネイティブ** |
| 複数データセンター間 | 手動コピー | **非同期レプリケーション内蔵** |
| LLM 再呼び出し | SQLite 書き込みが失敗すると再呼び出し | **再呼び出しは決して発生しない** |
| Trace | なし | **自動関連付け** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">マイクロ秒級の復旧はどこから来るのか</p>
    <div class="lurus-callout__body"><p>Kova エンジンのスケジューリングレイテンシは最小 3μs です（FIFO の完全パイプラインの Criterion ベンチマークで 3.17μs、315K ops/s）。<code>LumenCheckpointer</code> は LangGraph の checkpoint 書き込みを Kova WAL に委譲します —— 復旧は SQLite のファイルレベルではなくエンジンレベルの WAL リプレイを経由するため、マイクロ秒級となり、単一マシンの SQLite のミリ秒級よりはるかに高速です。</p></div>
  </div>
</div>

## 次のステップ

<NextSteps :steps="[
  { text: 'LangGraph からの移行', link: '/ja/migrations/from-langgraph', primary: true },
  { text: 'Lumen Python SDK', link: '/ja/lumen/python-sdk' },
  { text: 'Kova のコンセプト', link: '/ja/kova/concepts' },
]" />

</div>
