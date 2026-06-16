---
title: Lucrum 戦略マーケット
description: Lucrum はオープンな戦略エコシステムであり、戦略開発者とトレーダーをつなぎます。
---

<div class="lucrum-page">

# 戦略マーケット

Lucrum 戦略マーケットは、戦略開発者とトレーダーをつなぐオープンなクオンツ戦略エコシステムです。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">70%</span><span class="lurus-stat__label">作者の取り分</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6</span><span class="lurus-stat__label">組み込み戦略パック</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2 年以上</span><span class="lurus-stat__label">バックテストデータ要件</span></div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 戦略利用者向け</span>
  <h2 class="lurus-section-head__title">閲覧・評価・ワンクリックデプロイ</h2>
</div>

### 閲覧と絞り込み

戦略マーケットでは、複数の軸で戦略を絞り込めます：

| 絞り込み条件 | 説明 |
|---------|------|
| 市場 | A 株（上海・深圳両市場）；香港株・米国株・暗号資産は計画中 |
| 戦略タイプ | トレンドフォロー、平均回帰、裁定取引、マルチファクター |
| リスクレベル | 保守的、安定型、積極的 |
| 最低資金 | 戦略が要求する最低投入資金 |
| 並び替え | 収益率、シャープレシオ、最大ドローダウン、購読数 |

### 戦略評価指標

上場している各戦略は、検証済みのクオンツ指標を表示します：

| 指標 | 優良基準 | 説明 |
|------|---------|------|
| **年率収益** | &gt; 15% | 年率複利収益率 |
| **最大ドローダウン** | &lt; 20% | 過去の最大損失（ピークと谷の差） |
| **シャープレシオ** | &gt; 1.5 | リスク 1 単位あたりの超過収益 |
| **Calmar レシオ** | &gt; 1.0 | 年率収益 / 最大ドローダウン |
| **勝率** | &gt; 50% | 利益確定取引の割合 |
| **損益比** | &gt; 1.5 | 平均利益 / 平均損失 |
| **稼働日数** | &gt; 90 日 | 戦略の実運用稼働期間 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">戦略の選び方は？</p>
    <div class="lurus-callout__body">収益率だけを見てはいけません。シャープレシオ 2.0、最大ドローダウン 10% の戦略は、年率 50% でもドローダウン 40% の戦略より、たいていの人にとってより適しています。</div>
  </div>
</div>

### 購読とデプロイ

<ol class="lurus-steps">
<li>

戦略を選ぶ → 詳細ページ（**完全なバックテストレポート**を含む）。

</li>
<li>

「**購読**」で費用を確認。

</li>
<li>

「**マイ戦略**」で取引口座を選び、資金配分を設定。

</li>
<li>

「**起動**」で自動実行。

</li>
</ol>

**費用**：一部は無料、一部は月額購読制；購読料は [鹿貝ウォレット](/platform/billing#wallet) から差し引かれます；取引手数料は証券会社が徴収し、Lucrum とは無関係です。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> 戦略開発者向け</span>
  <h2 class="lurus-section-head__title">開発・審査・パッシブ収入の獲得</h2>
</div>

### 出品フロー

<ol class="lurus-steps">
<li>

**ローカル開発** で戦略ロジックを実装。

</li>
<li>

**バックテスト検証**（少なくとも 2 年分の過去データ）。

</li>
<li>

**審査の提出**（説明 / リスクレベル / 適用市場）。

</li>
<li>

**プラットフォーム審査** によるコンプライアンスとリスク管理（通常 1〜3 営業日）。

</li>
<li>

**出品** で全ユーザーに公開。

</li>
<li>

**収入の獲得**、鹿貝でウォレットに決済。

</li>
</ol>

### 審査基準

| 項目 | 要件 |
|------|------|
| バックテストデータ量 | 少なくとも 2 年分の過去データを網羅 |
| 最大ドローダウン | 50% を超えないこと（超える場合はリスクの特別表示が必要） |
| リスク管理措置 | 必ず損切りロジックを含むこと |
| コード品質 | メモリリークなし、無限ループのリスクなし |
| 戦略説明 | 戦略ロジック・適用市場・リスク注意事項を完全に説明 |

### 収益分配

戦略が生み出す購読収入は、以下の比率で配分されます：

| 役割 | 分配比率 |
|------|---------|
| 戦略作者 | **70%** |
| プラットフォーム | **30%** |

収入は鹿貝の形であなたのウォレットに決済され、銀行カードへ出金できます。

### 組み込み戦略パック

Lucrum には 6 つの戦略パックが組み込まれており、カスタム拡張にも対応します：

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title"><code>VALUE_BLUECHIP</code></div>
    <p class="lurus-card__body">バリュー優良株（割安・大型で安定）。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title"><code>GROWTH_MOMENTUM</code></div>
    <p class="lurus-card__body">グロースモメンタム（高成長 + モメンタムによる選別）。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="star" :size="20" /></span>
    <div class="lurus-card__title"><code>SECTOR_LEADER</code></div>
    <p class="lurus-card__body">セクターリーダー（業界の主導銘柄）。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title"><code>LOW_VOL_STABLE</code></div>
    <p class="lurus-card__body">低ボラ安定（低ボラティリティのディフェンシブ型）。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="20" /></span>
    <div class="lurus-card__title"><code>MEAN_REVERSION</code></div>
    <p class="lurus-card__body">平均回帰（売られすぎからの反発）。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title"><code>EVENT_DRIVEN</code></div>
    <p class="lurus-card__body">イベントドリブン（公告・決算などを触媒とする）。</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="filter" :size="14" /> 戦略タイプ</span>
  <h2 class="lurus-section-head__title">代表的な 4 種類の戦略の原理と適用シーン</h2>
</div>

| タイプ | 原理 | 代表的なシグナル/ファクター | 適している局面 |
|------|------|------|------|
| **トレンドフォロー** | 流れに乗り、トレンド形成で入場、終了で離脱 | 移動平均クロス、チャネルブレイク、モメンタム指標 | 一方向相場（強気/弱気相場）、レンジ相場には不向き |
| **平均回帰** | 価格が平均から乖離した後に回帰し、売られすぎで買い・買われすぎで売り | RSI、ボリンジャーバンド、Z-Score | レンジ相場、一方向トレンドには不向き |
| **マルチファクター銘柄選定** | 複数ファクターを総合して銘柄をスコア付けし、高スコア銘柄を買う | PE/PB（バリュエーション）、ROE（収益性）、12 ヶ月モメンタム、ボラティリティ | 中長期保有、リバランス頻度は低い |
| **ペアトレード** | 高相関の 2 銘柄の価格差が平均から乖離したとき、上がった方を空売り・下がった方を買う | — | 低ドローダウンでマーケットニュートラルな安定型戦略 |

---

<div class="lurus-callout lurus-callout--danger">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">投資にはリスクがあります</p>
    <div class="lurus-callout__body"><ul><li>過去のバックテスト結果は将来の収益を保証しません</li><li>クオンツ戦略は特定の市場環境下で機能しなくなる可能性があります</li><li>ご自身のリスク許容度に応じて資金を適切に配分してください</li><li>Lucrum はいかなる投資助言や収益保証も提供しません</li></ul></div>
  </div>
</div>

---

<NextSteps
  :steps="[
    { text: 'クイックスタート', link: '/ja/lucrum/quickstart', primary: true },
    { text: 'よくある質問', link: '/ja/lucrum/faq' },
    { text: '製品概要', link: '/ja/lucrum/' },
    { text: '取引プラットフォーム', link: 'https://lucrum.lurus.cn', external: true },
  ]"
  title="次のステップ"
/>

</div>
