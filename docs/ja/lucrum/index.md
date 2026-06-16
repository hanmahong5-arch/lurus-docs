---
title: Lucrum — AI 量子取引プラットフォーム
description: AI 駆動の量子取引プラットフォーム。戦略マーケット、バックテスト検証、インテリジェント取引アシスタントに対応。
---

<div class="lucrum-page">

<ProductHero product-id="lucrum" />

<MetricStats :items="[
  { label: '投資アドバイザー', value: '11 個', hint: 'マルチ視点 Agent' },
  { label: 'バックテスト指標', value: '30+', hint: 'シャープ / ドローダウン / 勝率…' },
  { label: 'テストケース', value: '3157+', hint: 'Vitest 検証' },
  { label: '精度', value: 'Decimal.js', hint: '浮動小数点誤差ゼロ' },
]" />

## Lucrum とは？

**Lucrum** は Lurus が提供する AI-Native 量子取引意思決定プラットフォームです。コアコンセプトは **自然言語こそ最高のプログラミング言語** ——日本語（自然言語）で戦略のアイデアを記述すれば、AI が自動でコードを生成し、バックテストを実行し、多次元で評価します。11 個の専門投資アドバイザー Agent（バフェット／ピーター・リンチ／リバモア／シモンズなどの視点）を内蔵し、プラットフォーム全体で Decimal.js による金融グレードの精度計算（3,157 件の Vitest テストケースで検証）を行い、浮動小数点誤差はゼロです。

> 名前はラテン語の "Lucrum"（収益）に由来し、市場機会を精緻に洞察するという意味が込められています。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">現在のフェーズ：パブリックベータ（beta）</p>
    <div class="lurus-callout__body"><a href="https://lucrum.lurus.cn">lucrum.lurus.cn</a> はすでに公開されており、コア機能（戦略生成 / バックテスト / AI アドバイザー）を直接体験できます。価格は <a href="https://lucrum.lurus.cn/pricing">/pricing</a> をご覧ください。正式な GA にはまだ入っておらず、一部の高度な機能（戦略マーケット、実取引のブローカー接続）は引き続き整備中です。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> コア機能</span>
  <h2 class="lurus-section-head__title">一文の日本語から一通の評価付きバックテストへ</h2>
  <p class="lurus-section-head__lede">戦略生成、マルチ Agent 投資調査、戦略マーケット、クォータ課金、リアルタイム執行——一本のパイプラインでつながります。</p>
</div>

### AI 戦略生成とバックテスト

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">自然言語 → コード</div>
    <p class="lurus-card__body">日本語で戦略の意図を記述すると、AI が vnpy CtaTemplate 戦略コードを自動生成します。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="calculator" :size="20" /></span>
    <div class="lurus-card__title">金融グレードのバックテスト</div>
    <p class="lurus-card__body">Decimal.js による全精度、A 株 100 株単位の整数倍制約、T+1 ルール、手数料 + 印紙税 + 振替手数料 + スリッページ。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bar-chart-3" :size="20" /></span>
    <div class="lurus-card__title">30+ 指標分析</div>
    <p class="lurus-card__body">シャープレシオ、最大ドローダウン、Sortino、Calmar、勝率、損益比……</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="star" :size="20" /></span>
    <div class="lurus-card__title">S/A/B/C/D 五段階評価</div>
    <p class="lurus-card__body">4 次元の加重：収益 30% + リスク管理 30% + 安定性 25% + 効率 15%。</p>
  </div>
</div>

### 11 個の AI 投資アドバイザー

LangGraph によるオーケストレーションを基盤とするマルチ Agent 投資分析システム（4 アナリスト + 2 リサーチャー + 4 マスター + 1 ディベート司会 = 11）：

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">4 名の投資マスター視点</div>
    <p class="lurus-card__body">バフェット（バリュー）、ピーター・リンチ（グロース）、リバモア（テクニカル）、シモンズ（クオンツ）。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">4 名のアナリスト</div>
    <p class="lurus-card__body">ファンダメンタルズ / テクニカル / センチメント / マクロが、それぞれ別々に結論を出します。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">2 名のリサーチャー + 1 名のディベート司会</div>
    <p class="lurus-card__body">Bull vs Bear の強気・弱気ディベートで、単一視点のバイアスを回避します。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">メモリエンジン統合</div>
    <p class="lurus-card__body"><a href="/ja/memx/">MemX</a> を通じて、あなたの取引の好みや過去の意思決定を記憶します。</p>
  </div>
</div>

### 戦略マーケット

オープンな量子戦略エコシステムで、戦略開発者とトレーダーをつなぎます：

| 役割 | 機能 |
|------|------|
| **戦略作成者** | 戦略のアップロード、価格設定、収益分配の確認 |
| **戦略利用者** | 戦略の閲覧・購読、ワンクリックで実取引へデプロイ |

**収益分配**: プラットフォーム 30% / 戦略作成者 70%。

### クォータと課金

<ol class="lurus-steps">
<li>

**プラン上限** — 購読プランに含まれる月間 AI 呼び出し回数。

</li>
<li>

**Redis による月間カウント** — 当月の使用量をリアルタイムで追跡。

</li>
<li>

**鹿贝残高による補填** — クォータを使い切った後、[鹿贝ウォレット](/ja/platform/billing#wallet) から自動で課金されます。1 鹿贝 = 10,000 tokens。

</li>
</ol>

### リアルタイムデータと執行

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">市場カバレッジ</div>
    <p class="lurus-card__body">A 株（上海・深圳両市場、約 5000+ 銘柄、データソース adata + 東方財富）；香港株 / 米国株 / 暗号資産は計画中。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">シミュレーション取引</div>
    <p class="lurus-card__body">Mock Broker を内蔵し、T+1 ルール、100 株単位、手数料と印紙税を完全にシミュレートします。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">リスク管理エンジン</div>
    <p class="lurus-card__body">ポジション制限、損切り・利確、最大ドローダウン保護。</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 対象ユーザー</span>
  <h2 class="lurus-section-head__title">コードを書かなくても量子取引が動く</h2>
</div>

| ユーザータイプ | Lucrum がどう役立つか |
|---------|-----------------|
| **量子取引の初心者** | AI アシスタントが入門をガイド。自然言語で戦略のアイデアを記述するだけでコードのフレームワークを生成 |
| **個人投資家** | 戦略マーケットから検証済みの戦略を選び、ワンクリックでデプロイ。プログラミング不要 |
| **戦略開発者** | 開発・バックテスト・公開までの完全なツールチェーン。戦略を出品して受動的収入を獲得 |
| **プロの取引チーム** | API インターフェースで、既存の取引システムへ統合 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> ベンチマーク比較</span>
  <h2 class="lurus-section-head__title">従来の量子取引プラットフォームとの違い</h2>
</div>

<ComparisonTable
  self-label="Lucrum"
  :competitors="['vnpy', '掘金', '米筐', '聚宽']"
  :rows="[
    { dimension: '戦略の記述', self: '自然言語で生成', alt: { vnpy: 'Python 手書き', '掘金': 'Python 手書き', '米筐': 'Python 手書き', '聚宽': 'Python 手書き' } },
    { dimension: 'AI 投資アドバイザー', self: '11 個のマルチ視点', alt: { vnpy: 'なし', '掘金': 'なし', '米筐': 'なし', '聚宽': 'なし' } },
    { dimension: '精度', self: 'Decimal.js 全精度', alt: { vnpy: 'float', '掘金': 'float', '米筐': 'float', '聚宽': 'float' } },
    { dimension: '戦略マーケット', self: '内蔵 + 評価', alt: { vnpy: 'なし', '掘金': 'あり', '米筐': 'あり', '聚宽': 'あり' } },
  ]"
  title="従来の量子取引プラットフォームとの比較"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 技術アーキテクチャ</span>
  <h2 class="lurus-section-head__title">ブラウザから決済エンジンまで</h2>
</div>

<ArchitectureDiagram
  title="Lucrum 階層アーキテクチャ"
  chart="graph TD;
    A[ブラウザ / モバイル] --> B[Lucrum Web<br/>Next.js 14 + TS<br/>取引パネル·戦略編集·AI 対話];
    B --> C[Lucrum Backend<br/>Python 3.11 + FastAPI<br/>vnpy 4.x + LangGraph<br/>戦略エンジン·相場ゲートウェイ·リスク管理·決済];
    C --> D[AI アシスタント<br/>Lurus API];
    C --> E[メモリエンジン<br/>MemX];
    C --> F[(PostgreSQL<br/>戦略 / 取引)];
    C --> G[(Redis<br/>相場 / クォータ)];
    C --> H[NATS<br/>イベント]"
/>

---

<NextSteps
  :steps="[
    { text: 'クイックスタート', link: '/ja/lucrum/quickstart', primary: true },
    { text: '戦略マーケット', link: '/ja/lucrum/strategies' },
    { text: 'よくある質問', link: '/ja/lucrum/faq' },
    { text: '取引プラットフォーム', link: 'https://lucrum.lurus.cn', external: true },
  ]"
  title="次のステップ"
/>

<!-- lurus:related-block -->

## 関連プロダクト

<RelatedProducts product-id="lucrum" />

</div>

<style>
.lucrum-page .lurus-card--lucrum .lurus-card__body a { color: var(--lurus-color-lucrum, var(--vp-c-brand-1)); }
</style>
