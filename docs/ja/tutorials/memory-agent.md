---
title: "チュートリアル — 記憶を持つ AI カスタマーサポートの構築"
description: "MemX + Kova + Lurus API で長期記憶を備えたサポート Agent を構築します。完全なプロジェクト成果物付き。"
---

<div class="memagent-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> MemX × Kova × Lurus API</span>
  <h1 class="lurus-section-head__title">記憶を持つ AI カスタマーサポートの構築</h1>
  <p class="lurus-section-head__lede"><strong>目標</strong>：30 分以内に、ユーザーの過去の質問を記憶し、クラッシュから自動復旧し、必要に応じて知識を蒸留するサポート Agent を動かします。</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">30 分</span><span class="lurus-stat__label">動作目標</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6 ステップ</span><span class="lurus-stat__label">依存関係から書き戻しまで</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 サービス</span><span class="lurus-stat__label">MemX · Kova · API</span></div>
</div>

## <Icon name="network" :size="20" /> アーキテクチャ図

3 つのサービスがそれぞれ役割を担います。MemX は長期記憶の想起と蒸留を、Lurus API は LLM 呼び出しを、Kova WAL は状態の永続化とクラッシュ復旧を担当します。

<ArchitectureDiagram title="記憶を持つ AI サポートのアーキテクチャ" chart="graph LR
  U[ユーザー] --> W[Web フロントエンド]
  W -->|HTTP| A[Agent App]
  A -->|1. 想起| M[MemX]
  A -->|2. LLM| L[Lurus API]
  A -->|3. 状態| K[Kova WAL]
  A -->|4. 書き込み| M
  L --> A
  M --> A" />

## <Icon name="workflow" :size="20" /> 6 ステップ

<ol class="lurus-steps">
<li>

**依存関係の準備**

```bash
pip install lurus memx-client kova-py lumen-ai openai
```

</li>
<li>

**3 つのサービスの初期化**

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

**Agent 状態の定義**

```python
from typing import TypedDict, Annotated, Sequence

class State(TypedDict):
    user_id: str
    messages: Annotated[Sequence, "chat history"]
    relevant_memory: list
```

</li>
<li>

**履歴の想起** — MemX から現在の質問に関連する記憶を取得します

```python
def retrieve_memory(state: State) -> State:
    last = state["messages"][-1]["content"]
    hits = mem.search(last, user_id=state["user_id"], limit=5)
    return {**state, "relevant_memory": hits}
```

</li>
<li>

**LLM の呼び出しと応答** — 想起した事実を system prompt に注入します

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

**蒸留と書き戻し** — 新しい会話を MemX に書き戻し、次回の想起で利用できるようにします

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

## <Icon name="life-buoy" :size="20" /> Kova クラッシュ復旧を追加する

Kova を LangGraph の checkpointer として接続すると、Agent はクラッシュ後に WAL から復旧し、**LLM を再呼び出ししません**。

```python
from kova.langgraph import KovaCheckpointer

graph = wf.compile(checkpointer=KovaCheckpointer(kova))
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">なぜ LLM を再呼び出ししないのか</p>
    <div class="lurus-callout__body"><p>Kova は各ステップの実行を先行書き込みログ（WAL）に記録します。プロセスのクラッシュ後、エンジンはブレークポイントから実行状態を再生し、完了済みの LLM 呼び出しは再び発行されません。これにより Token を節約しつつ、回答の一貫性も保証されます。</p></div>
  </div>
</div>

## <Icon name="package" :size="20" /> 完全なプロジェクト成果物

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="github" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">サンプルリポジトリ</p>
    <div class="lurus-callout__body"><p><a href="https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent">https://github.com/hanmahong5-arch/lurus-examples/tree/main/memory-agent</a> — コードの完全版、<code>docker-compose.yml</code>（ローカルで MemX + Kova を起動）、3 ノードをカバーする Pytest、<code>.env.example</code> を含みます。</p></div>
  </div>
</div>

## 次のステップ

<NextSteps :steps="[
  { text: 'Lumen 可観測性を追加', link: '/ja/tutorials/lumen-kova-langgraph', primary: true },
  { text: 'MemX のコンセプトを深く理解', link: '/ja/memx/concepts' },
  { text: 'Kova クラスタへデプロイ', link: '/ja/kova/quickstart' },
]" />

</div>
