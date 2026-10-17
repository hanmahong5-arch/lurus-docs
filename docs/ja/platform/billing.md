---
title: 課金の詳細
description: Lurus のサブスクリプションプラン、クォータ管理、鹿貝エコノミーシステムの詳細な説明。
---

<div class="billing-page">

# 課金の詳細 <StatusBadge status="live" />

サブスクリプションプラン、クォータ管理、鹿貝エコノミーシステム。

<MetricStats
  :items="[
    { label: 'サブスクリプションプラン', value: '5 段階', hint: 'Free → Enterprise、別途 Claude Code プラン' },
    { label: '支払い方法', value: '3 種類', hint: 'Stripe / Creem / Epay' },
    { label: '鹿貝', value: '1 元 = 1 LB', hint: 'チャージした分がそのまま入金' },
    { label: '返金期間', value: '7 日間', hint: '支払いから 7 日以内に注文単位で申請' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> サブスクリプション</span>
  <h2 class="lurus-section-head__title">サブスクリプションプラン比較</h2>
  <p class="lurus-section-head__lede">無料トライアルから企業向け SLA まで、利用規模に応じて選択。</p>
</div>

| プラン | 位置づけ | 説明 |
|------|------|------|
| **Free** | 無料トライアル | 毎日の無料枠あり、利用可能モデルは少なめ |
| **Basic** | 入門向け月額サブスクリプション | 個人開発者 |
| **Pro** | 上位サブスクリプション、月払い・年払いを選択可 | 年払いの総額は月払い 12 か月分より安価 |
| **Enterprise** | チーム / 企業 | プライベートデプロイ、SLA などは個別の商談で取り決め |

各プランの価格・1 日あたりの枠・利用可能モデルは [identity.lurus.cn](https://identity.lurus.cn) コンソール（サブスクリプション管理ページ）を基準とします。管理者が変更すると即時に反映されるため、本ページでは数値を転記していません。このほか Claude Code 向けの独立したプランもあり、同じくコンソールを基準とします。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="briefcase" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">エンタープライズプラン</p>
    <div class="lurus-callout__body">プライベートデプロイ、データセンター指定、または SLA が必要ですか？<a href="mailto:business@lurus.cn">business@lurus.cn</a> までご連絡ください。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> クォータ</span>
  <h2 class="lurus-section-head__title">クォータ管理</h2>
  <p class="lurus-section-head__lede">まずサブスクリプション枠を使い、使い切った後はモデル単価に応じて鹿貝ウォレットから引き落とされます。</p>
</div>

### クォータ計算

各呼び出しはモデル単価と Token 使用量に応じて課金されます。チャット系モデルは入力と出力を別々に計算し、画像などは 1 回ごとに課金されます。各モデルの単価はコンソールの表示を基準とします。

### クォータ超過時の処理

<ol class="lurus-steps">
<li>リクエストが到着すると、まずサブスクリプションのクォータを確認します。</li>
<li>クォータが<strong>十分</strong> → 通常処理。</li>
<li>クォータが<strong>不足</strong> → 鹿貝残高を確認：残高が十分であれば自動的に課金して通常処理。</li>
<li>残高が<strong>不足</strong> → <code>402</code> エラーを返します。</li>
</ol>

`402` / `insufficient_quota` を受け取りましたか？トラブルシューティング手順は [トラブルシューティング · クォータ / 残高不足](/ja/guide/troubleshooting#insufficient-quota) を参照してください。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">こっそり失敗することはありません</p>
    <div class="lurus-callout__body">ウォレット残高が設定したしきい値を下回るとリマインダーが届きます。残高が不足するとリクエストはそのまま 402 を返し、先に未払いが発生して後から請求されることはありません。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿貝</span>
  <h2 class="lurus-section-head__title">鹿貝エコノミー</h2>
  <p class="lurus-section-head__lede">ウォレットの計上単位で、1 鹿貝 = 1 人民元です。</p>
</div>

### チャージ

1 元のチャージで 1 鹿貝が入金され、段階的なボーナスはありません。管理者がチャージ特典を設定している場合は、チャージページに表示される支払金額に準じます。

### VIP 割引

累計チャージ金額（または年払いサブスクリプション）に応じて VIP ランクが決まり、割引はサブスクリプションの購入・更新時に自動適用されます。チャージと従量課金は割引対象外です。

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="crown" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">例：ゴールドカード 5% オフ</p>
    <div class="lurus-callout__body">デフォルトのしきい値では、累計チャージ ¥2,000 でゴールドカードになります。¥99 の月額サブスクリプションを更新すると実際の支払いは <code>99 × 0.95 = ¥94.05</code>。しきい値と割引はコンソールの表示を基準とします。</div>
  </div>
</div>

### 鹿貝の有効期限

チャージで得た残高に有効期限はありません。キャンペーンで付与された分には有効期限がある場合があり、キャンペーンの説明に準じます。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 請求書</span>
  <h2 class="lurus-section-head__title">請求書とインボイス</h2>
</div>

- **請求書の確認**（[identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)）：月次消費サマリー、取引明細、鹿貝の収支、クォータ使用統計。
- **インボイスの発行**：支払い済みの注文ごとにインボイスを申請できます。宛名と税番号を入力すると担当者が発行し、コンソールからダウンロードできます。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="repeat" :size="14" /> 返金</span>
  <h2 class="lurus-section-head__title">返金ポリシー</h2>
</div>

| タイプ | ポリシー |
|------|------|
| サブスクリプション | 支払いから 7 日以内にコンソールで申請、審査通過後に注文全額を返金 |
| チャージ | 支払いから 7 日以内で、そのチャージ分が未使用であれば注文単位で返金申請可能 |
| 消費済み部分 | 返金不可 |

Alipay、WeChat Pay、Stripe での支払いは元の支払い方法に返金され、その他の方法はウォレットに返金されます。

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'プラットフォーム概要', link: '/ja/platform/', primary: true },
    { text: 'よくある質問', link: '/ja/platform/faq' },
    { text: 'API Key の取得', link: '/ja/guide/get-api-key' },
  ]"
/>

</div>
