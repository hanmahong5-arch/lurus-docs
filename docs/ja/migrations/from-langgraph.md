---
title: "LangGraph から Lumen + Kova への移行"
description: "SqliteSaver → LumenCheckpointer + LumenTracer、Agent を Kova クラスタへデプロイ。"
---

<div class="mig-lg-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-branch" :size="14" /> LangGraph からの移行</span>
  <h1 class="lurus-section-head__title">LangGraph から Lumen + Kova への移行</h1>
  <p class="lurus-section-head__lede"><code>SqliteSaver</code> → <code>LumenCheckpointer + LumenTracer</code>、Agent を Kova クラスタへデプロイ——業務コードの変更は不要です。</p>
</div>

## <Icon name="sparkles" :size="20" /> 得られるもの

| Before（純粋な LangGraph） | After |
|---------------------|-------|
| SqliteSaver による単一マシン永続化 | **LumenCheckpointer + Kova** によるマイクロ秒級 WAL 復旧 |
| Trace なし | **LumenTracer** による自動収集 |
| Cost 集計なし | **CostTracker** による Node 単位の集計 |
| 手動 Replay | **Replay.from_run_id()** の一行 |

## <Icon name="workflow" :size="20" /> 移行手順

<ol class="lurus-steps">
<li>

**Checkpointer を置き換える** — `LumenCheckpointer` は `BaseCheckpointSaver` を 100% 実装しており、業務コードを一切変更する必要はありません。

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen_ai import LumenCheckpointer

- graph = wf.compile(
-     checkpointer=SqliteSaver.from_conn_string("./state.db")
- )
+ graph = wf.compile(
+     checkpointer=LumenCheckpointer()
+ )
```

</li>
<li>

**Tracer を追加する** — ローカルで起動した後、`http://localhost:7070` にアクセスすると Trace のタイムラインを確認できます。

```diff
+ from lumen_ai import LumenTracer

  graph = wf.compile(
      checkpointer=LumenCheckpointer(),
+     callbacks=[LumenTracer()],
  )
```

</li>
<li>

**Kova へデプロイする**

```yaml
# agent.yaml
name: research-agent
entry: python my_agent.py
checkpointer: lumen
replicas: 3
```

```bash
lumen deploy --target kova://prod-cluster
```

</li>
</ol>

## <Icon name="terminal" :size="20" /> ローカル検証

```bash
python my_agent.py           # 正常稼働
kill -9 $(pgrep -f my_agent) # クラッシュをシミュレート
python my_agent.py           # 中断点から再開し、LLM を再呼び出ししない
```

## <Icon name="gauge" :size="20" /> 性能比較

| 指標 | Before | After |
|------|--------|-------|
| 復旧レイテンシ | 8ms | **マイクロ秒級** |
| マルチプロセス | ロックが必要 | **ネイティブ** |
| データセンター間 | 手動 | **非同期レプリケーション** |
| LLM 再呼び出し | 時々あり | **決してなし** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">ロールバック</p>
    <div class="lurus-callout__body"><p>旧来の SqliteSaver コードをコメントとして残しておけば、いつでも diff を元に戻すだけで元の状態に復帰できます。データは相互に連携しませんが、並行して稼働させることは可能です。</p></div>
  </div>
</div>

## 次のステップ

<NextSteps :steps="[
  { text: 'Lumen Python SDK', link: '/ja/lumen/python-sdk', primary: true },
  { text: 'Kova をデプロイ', link: '/ja/kova/quickstart' },
  { text: '完全なチュートリアル', link: '/ja/tutorials/lumen-kova-langgraph' },
]" />

</div>
