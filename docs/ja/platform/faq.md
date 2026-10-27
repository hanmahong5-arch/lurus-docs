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

[identity.lurus.cn](https://identity.lurus.cn) にログイン → サブスクリプション管理 →「プラン変更」：アップグレード・ダウングレードともに即時反映され、差額は残り日数に応じてウォレットから追加で引き落とし、または返金されます。月払いと年払いの間で直接切り替えることはできません。

</details>

<details class="lurus-faq-item">
<summary>サブスクリプションが期限切れになるとどうなりますか？</summary>

期限切れ後は 3 日間の猶予期間があり、その後 Free に戻ります。API Key は引き続き有効ですが Free の割り当て制限を受けます。データは保持され、いつでも更新すれば復元できます。

</details>

<details class="lurus-faq-item">
<summary>年払いと月払いの違いは何ですか？</summary>

年払いの総額は月払い 12 か月分より安く、具体的な価格はコンソールの表示を基準とします。年払いと月払いの間で直接切り替えることはできません。

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

すべての製品の従量料金（サブスクリプションの割り当てを超えた API 呼び出しなど）の支払いに使え、サブスクリプションの購入にも使えます。1 鹿贝 = 1 元です。

</details>

<details class="lurus-faq-item">
<summary>鹿贝に有効期限はありますか？</summary>

チャージで得た残高に有効期限はありません。キャンペーンで付与された分には有効期限がある場合があり、キャンペーンのルールに従います。

</details>

<details class="lurus-faq-item">
<summary>鹿贝は出金できますか？</summary>

出金はできません。支払いから 7 日以内で未使用のチャージであれば、注文単位で返金を申請できます。

</details>

<details class="lurus-faq-item">
<summary>残高や収支記録はどう確認しますか？</summary>

[identity.lurus.cn](https://identity.lurus.cn) にログイン → ウォレットで、現在の残高、収入明細（チャージ / 報酬 / 返金）、支出明細（API 消費 / サブスクリプション）を確認できます。

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

支払い済みの注文ごとにコンソールから請求書を申請できます。宛名と税番号を入力すると担当者が発行し、発行後にダウンロードできます。

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
