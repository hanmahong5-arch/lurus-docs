---
title: Lurus Platform — アカウントと課金
description: Lurus 統合アカウント体系、サブスクリプションプラン、アカウントウォレット、課金システムの説明。
---

<div class="platform-page">

<ProductHero product-id="platform" />

## 概要

**Lurus Platform** は、すべての Lurus 製品が共有する統合アカウントおよび課金インフラです。Lurus API、Lucrum、Switch、あるいはその他の製品のいずれを利用する場合でも、同一の Lurus アカウントでログインし、同じウォレット残高とサブスクリプションプランを共有します。

<CapabilityGrid
  accent="var(--lurus-color-platform)"
  title="プラットフォームの基本機能"
  :items="[
    { title: '統合アカウント', body: 'すべての Lurus 製品で同一のアイデンティティ・残高・サブスクリプションを共有', icon: 'user-check' },
    { title: 'アカウントウォレット', body: '残高と取引明細を記録し、従量課金に使用', icon: 'coins' },
    { title: 'サブスクリプションプラン', body: '個人向けサブスクリプションと法人契約の 2 通り', icon: 'package-2' },
  ]"
/>

---

## 統合アカウント

任意の Lurus 製品（[hub.lurus.cn](https://hub.lurus.cn)、[lucrum.lurus.cn](https://lucrum.lurus.cn) など）にアクセスすれば、登録・ログインできます。**ログイン方式**：メール+パスワード、GitHub（OAuth）、Google（OAuth）。

登録が完了すると、以下が得られます：

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">統合ユーザーアイデンティティ</div>
    <p class="lurus-card__body">1つのアカウントがすべての製品で共通利用可能</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">@lurus.cn メール</div>
    <p class="lurus-card__body"><code>username@lurus.cn</code> を自動開設（Stalwart ベース）</p>
  </div>
</div>

**アカウント管理**（[identity.lurus.cn](https://identity.lurus.cn) にログイン → アカウント設定）：個人情報、ログイン履歴、サードパーティ連携、セキュリティ設定（パスワード変更、二段階認証）。

**一度のログインで全サイト通行**：OIDC 標準に基づき、任意の製品にログインすればすべての製品間でセッションが確立されます。Passkey/WebAuthn のパスワードレス、TOTP/ハードウェアキーによる MFA、GitHub/Google のソーシャルログインに対応し、企業は Azure AD/飞书/Okta SSO と連携できます。エンドユーザーは1つのアカウントで API/Lucrum/Switch/Creator/Lutu をまとめて利用でき、開発者は OIDC SDK で自社アプリに組み込み、バックエンドは Service User + JWT Profile を使用します。企業の組織管理（メンバー/権限/監査）は [identity.lurus.cn](https://identity.lurus.cn)（Casdoor コンソール）経由、または営業窓口へお問い合わせのうえ開通します。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">アイデンティティ認証を深く知る</p>
    <div class="lurus-callout__body"><a href="/ja/platform/auth/">統合アイデンティティ認証</a> · <a href="/ja/platform/auth/oidc">OIDC / OAuth2 連携</a> · <a href="/ja/platform/auth/api-auth">API 認証</a></div>
  </div>
</div>

---

## 課金体系

Lurus は「サブスクリプション + 従量」のデュアルトラック課金モデルを採用し、さまざまな利用規模に柔軟に対応します。

### サブスクリプションプラン

| プラン | 位置づけ | 適した対象 |
|------|------|------|
| **Free** | 基本枠、無料利用 | 個人のお試し |
| **Basic** | 入門の月額サブスクリプション | 個人開発者 |
| **Pro** | 上位の月額サブスクリプション + 優先モデル | ヘビーユーザー |
| **Pro 年払い** | Pro の年払い割引 | 安定して利用するユーザー |
| **Enterprise** | 企業向けカスタマイズ + SLA | チーム / 企業 |

具体的な価格は [identity.lurus.cn](https://identity.lurus.cn) コンソール（サブスクリプション管理ページ）を基準とします。

### 従量課金

サブスクリプションに含まれる枠を超過した分は、アカウントウォレットの残高から課金されます。モデルごとに単価が異なり、コンソールの表示が基準となります。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">課金方式と返金</p>
    <div class="lurus-callout__body"><a href="/ja/platform/billing">課金の詳細</a>では、現在の課金方式、残高不足時の扱い、請求書と返金について説明しています。</div>
  </div>
</div>

---

## アカウントウォレット {#wallet}

アカウントウォレットは残高と取引明細を記録し、サブスクリプション枠を超えた利用分の支払いに使われます。残高、取引履歴、チャージの入口は [identity.lurus.cn](https://identity.lurus.cn) のアカウントセンターを参照してください。価格・特典・割引のルールはコンソールを基準とし、本ドキュメントでは具体的な数値を記載しません。

---

## 支払い方法

すべての支払いは Webhook で非同期に確認され、ネットワークの変動による重複課金を防ぎます。利用できる支払いチャネルは決済ページの表示を基準とします。法人のお客様は契約と銀行振込をご利用いただけます。

---

## 通知サービス

マルチチャネル通知（アカウント設定で各種通知の受信チャネルをカスタマイズ可能）：

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">サイト内メッセージ</div>
    <p class="lurus-card__body">アカウント変更 / セキュリティ警告 / システム告知</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">メール</div>
    <p class="lurus-card__body">支払い確認 / 枠アラート / サブスクリプション期限切れ</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">WebSocket</div>
    <p class="lurus-card__body">API 異常 / 残高不足のリアルタイムプッシュ</p>
  </div>
</div>

---

## データセキュリティ

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">エンタープライズ級のアイデンティティ認証</div>
    <p class="lurus-card__body"><Term t="OIDC">OIDC</Term> 標準に基づくシステム</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">全サイト HTTPS</div>
    <p class="lurus-card__body">通信全体を TLS 1.3 で暗号化</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">パスワードは平文で保存しない</div>
    <p class="lurus-card__body">bcrypt で暗号化して保存</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="receipt" :size="20" /></span>
    <div class="lurus-card__title">コンプライアンス準拠の決済ゲートウェイ</div>
    <p class="lurus-card__body">支払いは PCI DSS 準拠のサードパーティを経由</p>
  </div>
</div>

ユーザーデータは厳格に分離され、共有されません。

---

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'アイデンティティ認証 (Casdoor)', link: '/ja/platform/auth/', primary: true },
    { text: '課金の詳細', link: '/ja/platform/billing' },
    { text: 'よくある質問', link: '/ja/platform/faq' },
    { text: 'API Key を取得', link: '/ja/guide/get-api-key' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="platform" />

</div>

<style>
.platform-page .lurus-card code {
  font-size: 0.85em;
}
</style>
