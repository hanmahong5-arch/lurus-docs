---
title: プラットフォームよくある質問
description: Lurus プラットフォームのアカウント、課金、サービスに関するよくある質問と回答。
---

<div class="faq-page">

# よくある質問

プラットフォームのアカウント、サブスクリプション課金、鹿贝、セキュリティに関する頻出の質問を、テーマ別にまとめています。

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> アカウント</span>
  <h2 class="lurus-section-head__title">アカウント</h2>
</div>

<details class="lurus-faq-item">
<summary>1 つのアカウントですべての製品を利用できますか？</summary>

はい。統一アカウント体系により、一度登録すればすべての製品（API、Lucrum、Switch、Creator など）にログインでき、ウォレット残高とサブスクリプションプランを共有します。

</details>

<details class="lurus-faq-item">
<summary>パスワードはどう変更しますか？</summary>

[identity.lurus.cn](https://identity.lurus.cn) にログイン → アカウント設定 → セキュリティ → パスワード変更。

</details>

<details class="lurus-faq-item">
<summary>パスワードを忘れた場合は？</summary>

ログインページで「パスワードを忘れた」をクリックすると、登録メールアドレスにリセットリンクが届きます。

</details>

<details class="lurus-faq-item">
<summary>アカウントを削除するには？</summary>

[support@lurus.cn](mailto:support@lurus.cn) に連絡して解約してください。すべてのデータ（API Key / 鹿贝 / 取引記録）は永久に削除され、復元できません。

</details>

<details class="lurus-faq-item">
<summary>どのサードパーティログインに対応していますか？</summary>

GitHub、Google OAuth に対応しており、アカウント設定で連携 / 解除できます。

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> サブスクリプションと課金</span>
  <h2 class="lurus-section-head__title">サブスクリプションと課金</h2>
</div>

<details class="lurus-faq-item">
<summary>プランのアップグレード / ダウングレードはどうしますか？</summary>

[identity.lurus.cn](https://identity.lurus.cn) にログイン → サブスクリプション管理 →「プラン変更」：アップグレードは即時反映され差額を日割りで精算、ダウングレードは次回課金サイクルから反映されます。

</details>

<details class="lurus-faq-item">
<summary>サブスクリプションが期限切れになるとどうなりますか？</summary>

自動的に Free にダウングレードされ、API Key は引き続き有効ですが Free の割り当て制限を受けます。データは保持され、いつでも更新すれば復元できます。

</details>

<details class="lurus-faq-item">
<summary>年払いと月払いの違いは何ですか？</summary>

年払いは 20% オフ（約 2.4 か月分が無料）です。年払い期間中はダウングレードできませんが、アップグレードは可能です。

</details>

<details class="lurus-faq-item">
<summary>エンタープライズ版でチームにメンバーを追加するには？</summary>

管理コンソール → チーム → メンバー招待 → メールアドレスを入力して招待を送信 → メンバーが承諾して参加 → 各メンバーに独立した API Key と割り当てを付与できます。

</details>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">割り当てと料金ルールの全体を確認したいですか？</p>
    <div class="lurus-callout__body">詳しくは <a href="/ja/platform/billing">課金の詳細</a> をご覧ください。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿贝</span>
  <h2 class="lurus-section-head__title">鹿贝</h2>
</div>

<details class="lurus-faq-item">
<summary>鹿贝にはどんな用途がありますか？</summary>

サブスクリプションの割り当てを超えた API 呼び出しの支払い、Lucrum 有料ストラテジーの購読、VIP 割引の利用に使えます。

</details>

<details class="lurus-faq-item">
<summary>鹿贝に有効期限はありますか？</summary>

購入したものは永久に有効です。キャンペーンで付与されたものには有効期限がある場合があり、キャンペーンのルールに従います。

</details>

<details class="lurus-faq-item">
<summary>鹿贝は出金できますか？</summary>

チャージ購入した未使用分は返金可能です。Lucrum ストラテジー収益から精算された鹿贝は銀行口座に出金できます。

</details>

<details class="lurus-faq-item">
<summary>残高や収支記録はどう確認しますか？</summary>

[identity.lurus.cn](https://identity.lurus.cn) にログイン → ウォレットで、現在の残高、収入明細（チャージ / 報酬 / ストラテジー収益）、支出明細（API 消費 / ストラテジー購読）を確認できます。

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> 支払い</span>
  <h2 class="lurus-section-head__title">支払い</h2>
</div>

支払い方法：

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="receipt" :size="20" /></span>
    <div class="lurus-card__title">Stripe</div>
    <p class="lurus-card__body">クレジットカード / デビットカード、グローバル</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">Creem</div>
    <p class="lurus-card__body">暗号通貨</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="wallet" :size="20" /></span>
    <div class="lurus-card__title">Epay</div>
    <p class="lurus-card__body">Alipay / WeChat、中国本土</p>
  </div>
</div>

<details class="lurus-faq-item">
<summary>支払いが反映されない場合は？</summary>

通常 1 分以内に確認されます。5 分以上経っても反映されない場合は、決済プラットフォームで引き落としが行われたか確認し、メールで確認メールを確認のうえ、[support@lurus.cn](mailto:support@lurus.cn) に支払い注文番号を添えて連絡してください。

</details>

<details class="lurus-faq-item">
<summary>請求書を申請するには？</summary>

管理コンソール → 請求 → 請求書申請（増値税普通 / 専用）。通常 1 営業日以内にメールで送付されます。

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> セキュリティ</span>
  <h2 class="lurus-section-head__title">セキュリティ</h2>
</div>

<details class="lurus-faq-item">
<summary>私のデータは安全ですか？</summary>

全通信が HTTPS（TLS 1.3）です。パスワードは bcrypt で暗号化して保存します。支払いは PCI DSS 準拠のサードパーティを経由します。API 呼び出しの内容は保存しません（課金用にメタデータのみ記録します）。

</details>

<details class="lurus-faq-item">
<summary>API Key が盗用された場合はどう対処しますか？</summary>

ただちにコンソールで該当する Key を無効化 → 新しい Key を作成 → 呼び出しログを確認して異常な消費を特定 → カスタマーサポートに連絡して異常な引き落としを処理してもらってください。

</details>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">答えが見つかりませんか？</p>
    <div class="lurus-callout__body"><a href="mailto:support@lurus.cn">support@lurus.cn</a> までご連絡ください。</div>
  </div>
</div>

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'プラットフォーム概要', link: '/ja/platform/', primary: true },
    { text: '課金の詳細', link: '/ja/platform/billing' },
    { text: 'API Key を取得', link: '/ja/guide/get-api-key' },
  ]"
/>

</div>
