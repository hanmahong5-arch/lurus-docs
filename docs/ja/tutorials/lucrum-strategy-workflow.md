---
title: "チュートリアル — Lucrum 戦略をローカルから公開まで"
description: "自然言語 → vnpy コード → バックテスト → 最適化 → 戦略マーケット公開までの完全なクローズドループ。"
---

<div class="lucrum-tut-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="trending-up" :size="14" /> Lucrum クオンツのクローズドループ</span>
  <h1 class="lurus-section-head__title">Lucrum 戦略の完全フロー</h1>
  <p class="lurus-section-head__lede"><strong>目標</strong>：「デュアル移動平均線 + RSI フィルター」というアイデアを、自然言語の記述から戦略マーケットへの公開まで一気通貫で進めます。</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 ステップ</span><span class="lurus-stat__label">記述から公開まで</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">S/A/B/C/D</span><span class="lurus-stat__label">5 段階評価</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">vnpy</span><span class="lurus-stat__label">生成コードスタック</span></div>
</div>

## <Icon name="network" :size="20" /> アーキテクチャ

自然言語から公開まで、評価は分岐ゲートになります。評価が A 以上なら直接公開、A 未満なら AI 最適化を経て再びバックテストへ進みます。

<ArchitectureDiagram title="Lucrum 戦略クローズドループ" chart="graph TB
  NL[自然言語] --> GEN[AI 策略生成]
  GEN --> CODE[vnpy 代码]
  CODE --> BT[历史数据回测]
  BT --> SCORE{评分}
  SCORE -->|未达 A| OPT[AI 优化建议]
  OPT --> BT
  SCORE -->|达 A 级| MKT[策略市场上架]" />

## <Icon name="workflow" :size="20" /> 完全なフロー

<ol class="lurus-steps">
<li>

**自然言語での記述** — [lucrum.lurus.cn](https://lucrum.lurus.cn) にアクセス → 新規戦略を作成 → 記述を貼り付け：

> デュアル移動平均線クロス戦略。5 日線が 20 日線を上抜けたら買い、下抜けたら売り。RSI(14) フィルターを追加し、RSI > 70 のときは買わない。ストップロス 5%、利益確定 15%。

</li>
<li>

**AI が vnpy コードを生成**

```python
from vnpy.app.cta_strategy import CtaTemplate
import talib

class MA_RSI_Strategy(CtaTemplate):
    fast_window = 5
    slow_window = 20
    rsi_window = 14
    rsi_upper = 70
    stop_loss_pct = 0.05
    take_profit_pct = 0.15

    def on_bar(self, bar):
        self.am.update_bar(bar)
        if not self.am.inited:
            return
        fast_ma = talib.SMA(self.am.close_array, self.fast_window)[-1]
        slow_ma = talib.SMA(self.am.close_array, self.slow_window)[-1]
        rsi = talib.RSI(self.am.close_array, self.rsi_window)[-1]

        if self.pos == 0 and fast_ma > slow_ma and rsi < self.rsi_upper:
            self.buy(bar.close_price, 1)
        elif self.pos > 0 and (fast_ma < slow_ma):
            self.sell(bar.close_price, self.pos)
```

</li>
<li>

**バックテスト** — バックテスト期間（デフォルトは直近 2 年）を選択し、実行をクリック：

```
回测期间: 2024-01-01 ~ 2025-12-31
夏普比率: 1.15
最大回撤: 11.3%
胜率: 56%
年化收益: 18.4%
评级: B (收益良好，风控合格)
```

</li>
<li>

**AI 最適化** — Lucrum が改善案を提示します：

> 現在の RSI フィルター閾値（70）はやや緩く、バックテストでは 8 回のだましのブレイクアウトがありました。提案：
> 1. RSI 閾値を 65 に引き締める
> 2. 5 日出来高移動平均線によるフィルターを追加
> 3. ストップロスを 5% から 7% に緩和（ノイズによる振り落としを回避）
>
> 予想シャープ → 1.42、ドローダウン → 9.2%

提案を受け入れて再びバックテスト：

```
夏普比率: 1.44
最大回撤: 9.1%
胜率: 62%
评级: A (收益优秀，风控良好)
```

</li>
<li>

**戦略マーケットへ公開** — 戦略詳細に入る → 公開ボタン → 価格を入力：

| フィールド | 例 |
|------|------|
| 戦略名 | MA_RSI_A股趋势 v2 |
| 分配比率 | 作者 70% / プラットフォーム 30% |
| 試用期間 | 7 日 |
| 推奨サブスク価格 | 99 鹿貝/月 |

コンプライアンス審査を通過すれば、[戦略マーケット](/ja/lucrum/strategies)に公開できます。

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">B → A への向上は最適化ラウンドによるもの</p>
    <div class="lurus-callout__body"><p>初回バックテストの評価は B（シャープ 1.15）。AI の最適化提案を受け入れて再びバックテストすると、シャープは 1.44 に上昇、ドローダウンは 9.1% に低下し、A 級に到達——そして公開ゲートへ進みます。</p></div>
  </div>
</div>

## <Icon name="book-open" :size="20" /> 主要な概念

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="Sharpe Ratio">シャープレシオ</Term></div>
    <p class="lurus-card__body">リスク 1 単位あたりの超過収益。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="Max Drawdown">最大ドローダウン</Term></div>
    <p class="lurus-card__body">過去最高値から最安値までの下落幅。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="CtaTemplate">CtaTemplate</Term></div>
    <p class="lurus-card__body">vnpy の戦略基底クラス。</p>
  </div>
</div>

## 次のステップ

<NextSteps :steps="[
  { text: 'Lucrum を知る', link: '/ja/lucrum/', primary: true },
  { text: '戦略マーケット', link: '/ja/lucrum/strategies' },
  { text: 'FAQ', link: '/ja/lucrum/faq' },
]" />

</div>
