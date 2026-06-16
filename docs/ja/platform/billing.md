---
title: 課金の詳細
description: Lurus のサブスクリプションプラン、クォータ管理、鹿貝エコノミーシステムの詳細な説明。
---

<div class="billing-page">

# 課金の詳細 <StatusBadge status="live" />

サブスクリプションプラン、クォータ管理、鹿貝エコノミーシステム。

<MetricStats
  :items="[
    { label: 'サブスクリプションプラン', value: '4 段階', hint: 'Free → Enterprise' },
    { label: '支払い方法', value: '3 種類', hint: 'Stripe / Creem / Epay' },
    { label: 'チャージリベート', value: '最大 5%', hint: '最初の 6 回の更新' },
    { label: '返金期間', value: '7 日間', hint: '初回サブスクリプションは全額返金' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> サブスクリプション</span>
  <h2 class="lurus-section-head__title">サブスクリプションプラン比較</h2>
  <p class="lurus-section-head__lede">無料トライアルから企業向け SLA まで、利用規模に応じて選択。</p>
</div>

| プラン | API 呼び出し | 利用可能モデル | Lucrum | サポート / その他 |
|------|---------|---------|--------|------------|
| **Free** | 100 回/日 | 基本（deepseek-chat、gpt-3.5-turbo） | AI アシスタント 10 回会話/日 | コミュニティサポート |
| **Basic** | 入門向け月額サブスクリプション、価格はコンソール基準 | — | — | 個人開発者のお試し |
| **Pro**（月払い/年払い、年払いは割引あり） | 10,000 回/月 | すべて | AI アシスタント無制限；戦略デプロイ最大 3 件 | メールチケット（24h 応答） |
| **Enterprise**（カスタム） | オンデマンド | すべて + プライベートデプロイ | チームメンバー無制限 | SLA 99.9%；専任カスタマーマネージャー + 即時応答；データセンター指定可 |

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="briefcase" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">エンタープライズプラン</p>
    <div class="lurus-callout__body">プライベートデプロイ、データセンター指定、または SLA 99.9% が必要ですか？<a href="mailto:business@lurus.cn">business@lurus.cn</a> までご連絡ください。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> クォータ</span>
  <h2 class="lurus-section-head__title">クォータ管理</h2>
  <p class="lurus-section-head__lede">各呼び出しはモデルと Token 使用量に応じてクォータに換算され、上限を超えると自動的に鹿貝で課金されます。</p>
</div>

### クォータ計算

各 API 呼び出しが消費するクォータはモデルと Token 使用量に関係します：

| モデルタイプ | クォータ消費ルール |
|---------|-------------|
| 基本モデル（deepseek-chat など） | 1 回の呼び出し = 1 クォータ |
| 高度なモデル（gpt-4o など） | 1 回の呼び出し = 3 クォータ |
| 画像/動画生成 | タスクの複雑さに応じて = 5〜20 クォータ |

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
    <div class="lurus-callout__body">残高不足の際はメール + サイト内メッセージで事前に警告し、あなたが気づかないうちにサービスを中断することはありません。</div>
  </div>
</div>

### クォータアラート

| アラート閾値 | 通知方法 |
|---------|---------|
| 残り 30% | サイト内メッセージ |
| 残り 10% | サイト内メッセージ + メール |
| クォータ枯渇 | サイト内メッセージ + メール + WebSocket プッシュ |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿貝</span>
  <h2 class="lurus-section-head__title">鹿貝エコノミー</h2>
  <p class="lurus-section-head__lede">統一されたポイント通貨で、Token と呼び出し回数を比率に応じて交換します。</p>
</div>

### 鹿貝の価値

1 鹿貝（LB）の基準価値：

| リソース | 1 LB で交換可能 |
|------|------------|
| Token（基本モデル） | 約 10,000 tokens |
| Token（高度なモデル） | 約 3,000 tokens |
| API 呼び出し | 約 5〜10 回（モデルによる） |

### チャージ比率

| チャージ金額（CNY） | 獲得鹿貝 | 単価 |
|----------------|---------|------|
| ¥10 | 10 LB | ¥1.00/LB |
| ¥50 | 55 LB | ¥0.91/LB |
| ¥100 | 115 LB | ¥0.87/LB |
| ¥500 | 600 LB | ¥0.83/LB |

チャージ金額が多いほど単価は低くなります。

### VIP 割引の重ね適用

VIP 割引は鹿貝消費時に自動的に適用されます。

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="crown" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">例：ゴールドカード 10% オフ</p>
    <div class="lurus-callout__body">ゴールドカードユーザーが gpt-4o（3 LB/回）を呼び出した場合の実際の課金 = <code>3 × 0.9 = 2.7 LB/回</code>。</div>
  </div>
</div>

### 鹿貝の有効期限

購入した鹿貝は永久に有効；キャンペーンで贈呈された鹿貝はキャンペーンの説明に準じます；返金は現金支払い分のみで、贈呈された鹿貝は返金されません。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 請求書</span>
  <h2 class="lurus-section-head__title">請求書とインボイス</h2>
</div>

- **請求書の確認**（[identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)）：月次消費サマリー、取引明細、鹿貝の収支、クォータ使用統計。
- **インボイスの発行**（増値税普通/専用インボイスに対応）：「請求書」→「インボイス申請」→ インボイス情報を入力（初回保存後は自動入力）→ 金額と月を選択。電子インボイスは通常 1 営業日以内にメールで送付されます。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="repeat" :size="14" /> 返金</span>
  <h2 class="lurus-section-head__title">返金ポリシー</h2>
</div>

| タイプ | ポリシー |
|------|------|
| サブスクリプション返金 | 初回サブスクリプションは 7 日以内に全額返金可能 |
| 鹿貝チャージ返金 | 未使用の鹿貝は返金申請可能（贈呈分を差し引く） |
| 消費済み部分 | 返金不可 |

返金については [support@lurus.cn](mailto:support@lurus.cn) までご連絡ください。

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'プラットフォーム概要', link: '/ja/platform/', primary: true },
    { text: 'よくある質問', link: '/ja/platform/faq' },
    { text: 'API Key の取得', link: '/ja/guide/get-api-key' },
  ]"
/>

</div>
