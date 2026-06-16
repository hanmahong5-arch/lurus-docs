---
title: MemX コアコンセプト
description: MemX ACE エンジンの 4 大コアモジュール：インテリジェント蒸留、セマンティック重複排除、減衰忘却、ハイブリッド検索。
---

<div class="memx-page">

# コアコンセプト

MemX の ACE（Adaptive Context Engine）エンジンは 4 大コアモジュールで構成され、独立して動作しながら連携し、知識の完全なライフサイクル管理を実現します。

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> ACE エンジン</span>
  <h2 class="lurus-section-head__title">4 大コアモジュール</h2>
  <p class="lurus-section-head__lede">蒸留 → 重複排除 → 減衰 → 検索、知識の完全なライフサイクルをカバー。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: 'Reflector · 知識蒸留', body: 'hybrid モードでルール事前フィルタ + LLM 精製、5 種類の検出ルール、全量 LLM と比べて 90%+ の呼び出しを削減。', icon: 'filter' },
    { title: 'Curator · セマンティック重複排除', body: 'コサイン類似度による 3 段階の重複排除：≥0.8 でマージ、0.5〜0.8 で競合マーク、0.5 未満は独立して書き込み。', icon: 'database-backup' },
    { title: 'Decay · 時間減衰', body: 'エビングハウスの忘却曲線、半減期 30 日、想起ブースト + 永久記憶の 3 層保護。', icon: 'timer' },
    { title: 'Generator · ハイブリッド検索', body: '4 層検索 L1〜L4、キーワード 0.6 + セマンティック 0.4 の融合、さらに減衰/新近/スコープのブーストを乗算。', icon: 'search' },
  ]"
/>

## <Term t="Reflector">Reflector</Term> — 知識蒸留エンジン

Reflector は MemX の最も核心的なイノベーションです：**極めて低コスト**なインテリジェント知識抽出。従来の AI 記憶システムは毎回 LLM に頼って対話から知識を抽出し、2〜5K tokens を消費します。Reflector はデフォルトで **hybrid** モード：ルール事前フィルタ + 価値のある候補に対してのみ LLM で精製し、全量 LLM と比べて 90%+ の呼び出しコストを削減します。

### 3 種類の動作モード

| モード | 説明 | LLM コスト |
|------|------|---------|
| `rules` | 純粋なルールエンジン、完全にパターンマッチングベース | LLM 呼び出しゼロ |
| `hybrid`（デフォルト） | ルール事前フィルタ + LLM 精製、平均スコアを取得 | 候補に対してのみ呼び出し、90%+ 削減 |
| `llm` | 完全に LLM に依存して知識を抽出 | 毎回 2〜5K tokens |

**hybrid ワークフロー**：生の対話 → PatternDetector（ルール検出）→ 候補知識項目 → LLM 評価+蒸留（候補のみ）→ ルールスコアと LLM スコアの平均値を取得 → KnowledgeScorer（スコア分類）→ PrivacySanitizer（プライバシーマスキング）→ BulletDistiller（圧縮・精製）。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">デフォルトのハイブリッドモード + 自動フォールバック</p>
    <div class="lurus-callout__body"><p>LLM が利用できない場合は自動的に純粋なルールモードに切り替わり、呼び出しゼロ・コストゼロ。</p></div>
  </div>
</div>

### 5 種類の検出ルール

| ルール | 検出ロジック | 信頼度 | 典型的なシナリオ |
|------|---------|--------|---------|
| ErrorFixRule | 「エラー → 解決策」構造を識別 | 0.8 | "TypeError: ... → 実は型アサーションを追加する必要があった" |
| RetrySuccessRule | 複数回の試行後の成功パスを検出 | 0.7 | "A、B を試したがダメで、最後に C の方法で解決した" |
| ConfigChangeRule | 設定/環境変数の変更にマッチ | 0.6 | "MAX_POOL_SIZE を 10 から 50 に変更した" |
| NewToolRule | 初めて使用したツール/ライブラリを識別 | 0.65 | "初めて pnpm を使ったが、npm よりずっと速い" |
| RepetitiveOpRule | 繰り返し操作を集計（≥3 回でトリガー） | 0.5+ | "デプロイのたびに手動でキャッシュをクリアしている" |

### 知識分類体系

各知識は自動的に **Section**（テーマ）と **KnowledgeType**（タイプ）の 2 次元に分類されます：

- **8 種類の Section**：`COMMANDS` · `DEBUGGING` · `ARCHITECTURE` · `WORKFLOW` · `TOOLS` · `PATTERNS` · `PREFERENCES` · `GENERAL`
- **5 種類の KnowledgeType**：`METHOD`（方法論）· `TRICK`（テクニック）· `PITFALL`（落とし穴）· `PREFERENCE`（嗜好）· `KNOWLEDGE`（事実）

### Instructivity Score

各知識は 0〜100 の **教育的価値スコア**を取得し、パターンマッチングの信頼度 + 具体性/実行可能性 + 明確な因果関係を含むかどうかを総合的に計算します。`min_score`（デフォルト 30）未満の候補は破棄されます。

## <Term t="Curator">Curator</Term> — セマンティック重複排除エンジン

Curator は書き込みのたびに重複と矛盾を自動的に処理します。

### 3 段階の重複排除戦略

新しい知識の書き込み → 既存の知識とのコサイン類似度を計算：**≥ 0.8** で自動マージ（keep_best または merge_content）；**0.5〜0.8** で潜在的な競合としてマークし確認待ち；**< 0.5** は独立した知識とみなして通常どおり書き込み。

**マージ戦略**：`keep_best`（デフォルト、instructivity_score がより高いバージョンを保持）/ `merge_content`（2 つの内容をマージし、より完全なバージョンを生成）。

### 競合検出

矛盾する記憶を能動的にスキャン（例：類似度 0.72 だが結論が逆 — "Redis のコネクションプールは 10 で十分" vs "最低 50 でないと安定しない"、ベストプラクティスを確認して古いバージョンを削除することを推奨）。CLI でいつでも検出：`memx conflicts`。

## <Term t="Decay">Decay</Term> — 時間減衰エンジン

人間の記憶の自然な忘却曲線をシミュレートし、知識ベースが常に「新鮮」な状態を保つようにします。

### 減衰の数式

```
base_weight = 2^(-age_days / half_life)
boosted     = base_weight × (1 + boost_factor × recall_count)
final       = clamp(boosted, 0.0, 1.0)
```

**コアパラメータ**:

| パラメータ | デフォルト値 | 説明 |
|------|--------|------|
| `half_life` | 30 日 | 重みが 50% に減衰するまでに要する日数 |
| `boost_factor` | 0.1 | 想起ごとの重みブースト係数 |

**数値例**（half_life=30, boost_factor=0.1）:

| シナリオ | age_days | recall_count | base_weight | final |
|------|----------|-------------|-------------|-------|
| 書き込み直後 | 0 | 0 | 1.0 | **1.0**（保護期間）|
| 30 日未使用 | 30 | 0 | 0.5 | **0.5** |
| 60 日未使用 | 60 | 0 | 0.25 | **0.25** |
| 30 日、5 回検索された | 30 | 5 | 0.5 | **0.75** |
| 90 日、15 回検索された | 90 | 15 | 0.125 | **1.0**（recall>=15 で永久記憶がトリガーされ、数式をスキップ）|

### 3 層保護メカニズム

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">3 層保護</p>
    <div class="lurus-callout__body"><ul><li><code>recall_count ≥ 15</code> → 永久記憶（weight は 1.0 固定）</li><li><code>age ≤ 7 日</code> → 保護期間（weight は 1.0 固定）</li><li><code>weight &lt; 0.02</code> → アーカイブ候補（クリーンアップ可能）</li></ul></div>
  </div>
</div>

直感的には：学んだばかり（7 日以内）はよく覚えている；よく思い出すものはますます定着する；15 回以上使うと「筋肉の記憶」になる；長く使わないと徐々に忘れていく。

### 検索時の減衰の影響

減衰の重みは検索ランキングの最終スコアに直接関与します：

```
Final Score = Blended Search Score × DecayWeight × RecencyBoost × ScopeBoost
```

- `RecencyBoost`: 7 日以内に作成された知識は 1.2x のブーストを獲得
- `ScopeBoost`: 現在のスコープにマッチする知識は 1.3x のブーストを獲得

## Generator — ハイブリッド検索エンジン

純粋な<Term t="Vector Search">ベクトル検索</Term>の限界を打破し、4 層検索が完全一致からセマンティック理解までの完全なスペクトルをカバーします。

### 4 層検索アーキテクチャ

| 層 | エンジン | マッチング方式 | 優位なシナリオ |
|------|------|---------|---------|
| L1 | ExactMatcher | 完全な単語マッチング | "pytest -v"、API 名 |
| L2 | FuzzyMatcher | ファジー Token マッチング | スペルのバリエーション、形態の変化 |
| L3 | MetadataMatcher | tools / entities / tags の Jaccard 類似度 | "Redis に関する知識" |
| L4 | VectorSearcher | ベクトル埋め込みによるセマンティック検索 | "テストパフォーマンスを向上させる方法" |

### スコア融合の数式

```
NormKeyword = (L1 + L2 + L3) / 35.0        # 归一化到 [0, 1]
Blended     = NormKeyword × 0.6 + Semantic × 0.4
Final       = Blended × DecayWeight × RecencyBoost × ScopeBoost
```

キーワード検索の重み（0.6）はセマンティック検索（0.4）より高く、完全一致の結果が優先して表示されるようにします。

**数値例**: クエリ "pytest timeout"、ある記憶のスコア計算：
- L1(完全一致)=8, L2(ファジー)=5, L3(メタデータ)=3 → NormKeyword = (8+5+3)/35 = 0.457
- L4(セマンティック) = 0.72
- Blended = 0.457×0.6 + 0.72×0.4 = 0.562
- DecayWeight=0.89, RecencyBoost=1.0, ScopeBoost=1.3
- **Final = 0.562 × 0.89 × 1.0 × 1.3 = 0.650**

### グレースフルデグラデーション

L4 ベクトル検索が利用できない場合（埋め込みモデルの読み込み失敗）、自動的に純粋なキーワードモードにフォールバックします（`keyword_weight=1.0, semantic_weight=0.0`）。いずれか単一の検索層の障害もサービスを中断しません。

## Token 予算管理

検索結果は二重の制約を受けます：`max_results`（最大返却件数、デフォルト 5）+ `token_budget`（最大 Token 予算、デフォルト 2000）。

**CJK 対応**（中国語が誤った Token 推定によって過度に切り詰められないようにする）：CJK 文字は 1.5 文字/token；ラテン文字は 4.0 文字/token。

## 階層スコープ

知識は階層的に組織されアクセス制御を実現します：`global`（すべてのプロジェクトで可視）→ `project:my-backend`（そのプロジェクトのみ）→ `workspace:feat-auth`（そのワークスペースのみ）。現在の scope にマッチする知識は 1.3x のスコアブーストを獲得；上位 scope は下位に対して可視（global はすべてのプロジェクトに対して可視）、下位は上位に対して不可視。

---

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'アーキテクチャ設計 — 完全なパイプラインアーキテクチャとデータフロー', link: '/ja/memx/architecture', primary: true },
    { text: 'クイックスタート — 5 分で MemX のコア機能を体験', link: '/ja/memx/quickstart' },
    { text: 'よくある質問 — 使用中のよくある質問への回答', link: '/ja/memx/faq' },
  ]"
/>

</div>

<style>
.memx-page .lurus-section-head {
  margin-top: 2.5rem;
}
.memx-page .cap-grid {
  margin: 1.5rem 0 2.25rem;
}
.memx-page .lurus-callout {
  margin: 1.25rem 0;
}
</style>
