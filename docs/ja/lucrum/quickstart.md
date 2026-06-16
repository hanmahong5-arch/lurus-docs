---
title: Lucrum クイックスタート
description: 5 分で Lucrum AI クオンツ取引アシスタントを使い始める。
---

<div class="lucrum-page">

# クイックスタート

5 分で Lucrum AI 取引アシスタントを使い始める——登録から最初のバックテストまで。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5</span><span class="lurus-stat__label">分で開始</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">11</span><span class="lurus-stat__label">投資アドバイザー</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">A 株</span><span class="lurus-stat__label">上海・深セン両市場</span></div>
</div>

<ol class="lurus-steps">
<li>

### 登録とログイン

[lucrum.lurus.cn](https://lucrum.lurus.cn) にアクセス →「登録」で Lurus 統一アカウント（メール / GitHub / Google）を使用 → 取引パネルに入る。Lurus 製品のアカウントをお持ちであればそのままログイン可能（同一アカウント体系を共有）。

</li>
<li>

### AI 取引アシスタントを体験する

ログイン後、右下に AI アシスタントの入口があります。自然言語を理解し、取引に関するあらゆる質問が可能です。質問例：

- **市場分析** — 「上証指数は今日なぜ下落したの？」
- **戦略提案** — 「10 万元の資金で堅実型のおすすめ戦略は？」
- **テクニカル指標** — 「CATL（寧徳時代）のボリンジャーバンドを計算して」
- **リスク評価** — 「BYD（比亜迪）に全力投資するのはリスクが大きい？」

</li>
<li>

### 戦略マーケットを閲覧する

上部の「**戦略マーケット**」→ 収益率 / ドローダウン / 種類で絞り込み → 戦略カードに年率収益率、最大ドローダウン、シャープレシオ（&gt; 1 が優秀）、稼働期間を表示（指標の詳細は [戦略マーケット](/ja/lucrum/strategies) を参照）→「購読」でアカウントにデプロイ。

</li>
<li>

### 取引アカウントを設定する

実取引には証券会社の連携が必要です：「**設定**」→「**取引アカウント**」→ 証券会社を選択 → 案内に従って認証。

</li>
<li>

### 最初の戦略を作成する（開発者向け）

「**戦略ワークベンチ**」に入って記述し、「**バックテスト**」をクリックして過去のパフォーマンスを確認します：

```python
# 示例：简单的双均线策略
from lucrum import Strategy, Signal

class DualMA(Strategy):
    """双均线交叉策略"""

    fast_period = 5    # 快线周期
    slow_period = 20   # 慢线周期

    def on_bar(self, bar):
        fast_ma = self.sma(bar.close, self.fast_period)
        slow_ma = self.sma(bar.close, self.slow_period)

        if fast_ma > slow_ma and self.position <= 0:
            return Signal.BUY
        elif fast_ma < slow_ma and self.position >= 0:
            return Signal.SELL

        return Signal.HOLD
```

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">リスク警告</p>
    <div class="lurus-callout__body">クオンツ取引には損失リスクがあります。まずデモ取引で十分に検証してから実取引に投入してください。Lucrum はいかなる投資助言や収益保証も提供しません。</div>
  </div>
</div>

---

## API 連携

完全な REST API を自社の取引システムに統合できます：

<ApiEndpoint method="POST" path="/api/v1/advisor/chat" description="AI 分析を取得" />

```bash
curl https://lucrum.lurus.cn/api/v1/advisor/chat \
  -H "Authorization: Bearer $LURUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "分析上证指数趋势"}'
```

<ApiEndpoint method="GET" path="/api/v1/strategies" description="戦略リストを取得" />

```bash
curl https://lucrum.lurus.cn/api/v1/strategies \
  -H "Authorization: Bearer $LURUS_TOKEN"
```

---

<NextSteps
  :steps="[
    { text: '戦略マーケット', link: '/ja/lucrum/strategies', primary: true },
    { text: 'よくある質問', link: '/ja/lucrum/faq' },
    { text: 'Lurus API', link: '/ja/guide/introduction' },
    { text: 'MemX メモリエンジン', link: '/ja/memx/' },
  ]"
  title="次のステップ"
/>

</div>
