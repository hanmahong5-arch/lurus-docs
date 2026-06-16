---
title: MemX アーキテクチャ設計
description: MemX のパイプラインアーキテクチャの詳細解説。書き込みパイプライン、検索パイプライン、およびコンポーネント独立のグレースフルデグレード設計を含みます。
---

<div class="memx-page">

# アーキテクチャ設計

MemX はパイプライン（Pipeline）アーキテクチャを採用しており、書き込みと検索はそれぞれ独立したパイプラインによってオーケストレーションされ、すべてのコンポーネントが独立した障害とグレースフルデグレードをサポートします。

<MetricStats
  :items="[
    { label: 'Memory API', value: '5 メソッド', hint: 'add / search / status / detect_conflicts / export' },
    { label: 'コアパイプライン', value: '2 本', hint: 'Ingest 書き込み + Retrieval 検索' },
    { label: 'デグレード', value: 'コンポーネント単位', hint: '単一コンポーネントの障害でサービスは中断しない' },
  ]"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> トポロジー</span>
  <h2 class="lurus-section-head__title">システム概観</h2>
  <p class="lurus-section-head__lede">2 本の独立したパイプラインが Decay Engine とベクトルストアへ合流します。</p>
</div>

<ArchitectureDiagram title="MemX パイプラインアーキテクチャ" chart="graph TB
  API[Memory API<br/>add / search / status / detect_conflicts / export]
  API --> Ingest[IngestPipeline 書き込み]
  API --> Retrieval[RetrievalPipeline 検索]
  Ingest --> I1[Privacy Sanitizer] --> I2[Reflector] --> I3[Curator] --> I4[mem0.add]
  Retrieval --> R1[Generator L1-L4] --> R2[ScoreMerger] --> R3[TokenBudgetTrimmer] --> R4[RecallReinforcer]
  I4 --> Decay[Decay Engine<br/>非同期減衰計算]
  R4 --> Decay
  Decay --> Store[(Vector Store<br/>mem0 Backend)]" />

## 書き込みパイプライン — IngestPipeline

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">プライバシーゲートウェイはバイパス不可</p>
    <div class="lurus-callout__body"><p>Privacy Sanitizer はパイプラインの最初のステーションでありスキップできません。12 個の組み込み機微情報ルールがデータをベクトルストアに書き込む前に完了して遮断し、サニタイザーは決して例外をスローしません。</p></div>
  </div>
</div>

`Raw Input` は順に以下を経由します：

1. **Privacy Sanitizer**（バイパス不可）— 12 個の組み込み機微情報ルール + カスタム正規表現。サニタイザーは決して例外をスローしません。
2. **Reflector** — hybrid モード（ルールによる事前フィルタリング + LLM による精錬）：PatternDetector（5 種類のパターン検出）→ KnowledgeScorer（スコアリング + 分類）→ PrivacySanitizer（候補知識のマスキング）→ BulletDistiller（精錬された項目へ圧縮）。失敗時は元の add にフォールバックします。
3. **Curator** — コサイン類似度による重複排除：≥0.8 でマージ（merge_content/keep_best）、0.5-0.8 で潜在的な競合をマーク、<0.5 で独立した知識として通過。失敗時は重複排除をスキップして直接書き込みます。
4. **BulletFactory** — メタデータのフォーマット変換 → `mem0.add()` でベクトルデータベースへ永続化。

### 書き込みパイプラインのデグレード経路

各ステージには独立したエラーハンドリングがあります：

| ステージ | 失敗時の挙動 | データへの影響 |
|------|---------|---------|
| Privacy Sanitizer | 決して失敗しない（内部 try-catch） | 元データが通過 |
| Reflector | 元の `mem0.add()` にフォールバック | 知識は提炼されずそのまま保存 |
| Curator | 重複排除をスキップ | 重複項目が生成される可能性あり |
| mem0.add | 例外をスロー | 書き込み失敗 |

## 検索パイプライン — RetrievalPipeline

`Query` は順に以下を経由します：

1. **Generator Engine** — L1 ExactMatcher（完全一致語）/ L2 FuzzyMatcher（あいまい Token）/ L3 MetadataMatcher（メタデータ Jaccard）/ L4 VectorSearcher（ベクトルセマンティック）。L4 失敗 → 純粋なキーワードモード。
2. **ScoreMerger**（加重融合）：`NormKW = (L1+L2+L3)/35`；`Blended = KW×0.6 + S×0.4`；`Final = Blended×Decay×Recency×Scope`。
3. **TokenBudgetTrimmer**（二重制約）：`max_results=5` + `token_budget=2000`、CJK 対応の Token 推定。
4. 結果を呼び出し元に返すと同時に、非同期で **RecallReinforcer** がヒットしたメモリの `recall_count` をインクリメントします（検索レスポンスをブロックしません）。

## データモデル

各メモリ（Bullet）が保持する完全なメタデータ：

```python
{
    "id": "mem_a1b2c3d4",
    "content": "pytest 超时问题：使用 -x --timeout=30 逐个运行",
    "section": "DEBUGGING",
    "knowledge_type": "TRICK",
    "instructivity_score": 78,
    "source_type": "INTERACTION",

    # Decay tracking
    "recall_count": 3,
    "decay_weight": 0.89,
    "created_at": "2026-02-20T10:30:00Z",
    "last_recalled_at": "2026-02-27T15:00:00Z",

    # Taxonomy
    "related_tools": ["pytest"],
    "key_entities": ["timeout", "test-isolation"],
    "tags": ["python", "testing"],
    "scope": "project:my-backend"
}
```

## ローカル埋め込み

MemX は ONNX Runtime を使ってローカルで埋め込みモデルを実行します。外部 API は不要で、完全にオフラインでありプライバシー漏洩がありません：モデル all-MiniLM-L6-v2、次元 384、保存先 `~/.memx/models/`、初回ダウンロード約 90MB、推論 < 5ms/件。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">all-MiniLM-L6-v2</span><span class="lurus-stat__label">埋め込みモデル</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">384</span><span class="lurus-stat__label">ベクトル次元</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">~90MB</span><span class="lurus-stat__label">初回ダウンロード</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">&lt;5ms</span><span class="lurus-stat__label">1 件あたりの推論</span></div>
</div>

## デーモンモード

オプションのバックグラウンドデーモンにより、マルチ Agent / マルチプロセス（Agent A/B/C）が **MemX Daemon（IPC Socket）** を経由して同一の Vector Store を共有します。IPC Socket 通信はデータベース接続の競合を回避します。アイドルタイムアウトで自動終了します（デフォルト 300 秒）。IDE プラグインやマルチウィンドウなどに適しています。

<ArchitectureDiagram title="デーモン共有トポロジー" chart="graph LR
  A[Agent A] --> D[MemX Daemon<br/>IPC Socket]
  B[Agent B] --> D
  C[Agent C] --> D
  D --> S[(共有 Vector Store)]" />

## 設定リファレンス

```python
from memx import Memory

m = Memory(config={
    # ACE Engine
    "ace_enabled": True,

    # Reflector — hybrid mode: rule pre-filter + LLM refinement
    "reflector": {
        "mode": "hybrid",       # "rules" | "hybrid"(default) | "llm"
        "min_score": 30.0,      # minimum knowledge score threshold
        "llm_model": "openai/gpt-4o-mini",
    },

    # Curator — semantic deduplication
    "curator": {
        "similarity_threshold": 0.8,    # auto-merge threshold
        "merge_strategy": "keep_best",  # "keep_best" or "merge_content"
    },

    # Decay — bionic forgetting curve
    "decay": {
        "half_life_days": 30.0,         # days to decay to 50%
        "boost_factor": 0.1,            # recall reinforcement coefficient
        "permanent_threshold": 15,      # min recalls for permanent memory
    },

    # Retrieval — hybrid 4-layer search
    "retrieval": {
        "keyword_weight": 0.6,
        "semantic_weight": 0.4,
        "max_results": 5,
        "token_budget": 2000,
    },

    # Privacy — sensitive data filtering (secrets / tokens / local paths)
    "privacy": {
        "custom_patterns": [
            r"INTERNAL_KEY_\w+"
        ],
    },
})
```

---

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'コアコンセプト — ACE エンジンの 4 つのコアモジュールを深く理解する', link: '/ja/memx/concepts', primary: true },
    { text: 'クイックスタート — 5 分で MemX のコア機能を体験する', link: '/ja/memx/quickstart' },
    { text: 'よくある質問 — 利用中によくある質問への回答', link: '/ja/memx/faq' },
  ]"
/>

</div>

<style>
.memx-page .lurus-section-head {
  margin-top: 2.5rem;
}
.memx-page .metric-stats,
.memx-page .lurus-stat-strip {
  margin: 1.5rem 0 2rem;
}
.memx-page .lurus-callout {
  margin: 1.25rem 0;
}
</style>
