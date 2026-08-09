---
title: Lurus Platform — アカウントと課金
description: Lurus 統合アカウント体系、サブスクリプションプラン、鹿贝ウォレット、課金システムの説明。
---

<div class="platform-page">

<ProductHero product-id="platform" />

## 概要

**Lurus Platform** は、すべての Lurus 製品が共有する統合アカウントおよび課金インフラです。Lurus API、Lucrum、Switch、あるいはその他の製品のいずれを利用する場合でも、同一の Lurus アカウントでログインし、同じウォレット残高とサブスクリプションプランを共有します。

<CapabilityGrid
  accent="var(--lurus-color-platform)"
  title="プラットフォームの4本柱"
  :items="[
    { title: '統合アカウント', body: 'すべての Lurus 製品で同一のアイデンティティ・残高・サブスクリプションを共有', icon: 'user-check' },
    { title: '鹿贝ウォレット', body: '統一課金単位、従量課金、残高のリアルタイム照会', icon: 'coins' },
    { title: 'サブスクリプションプラン', body: '無料枠 + 従量課金 + エンタープライズプラン', icon: 'package-2' },
    { title: 'VIP 体系', body: '利用額に応じてアップグレードし、専用モデルと専属サポートを解放', icon: 'crown' },
  ]"
/>

---

## 統合アカウント

任意の Lurus 製品（[api.lurus.cn](https://api.lurus.cn)、[lucrum.lurus.cn](https://lucrum.lurus.cn) など）にアクセスすれば、登録・ログインできます。**ログイン方式**：メール+パスワード、GitHub（OAuth）、Google（OAuth）。

登録が完了すると、以下が得られます：

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">統合ユーザーアイデンティティ</div>
    <p class="lurus-card__body">1つのアカウントがすべての製品で共通利用可能</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">初期 5 鹿贝</div>
    <p class="lurus-card__body">初回登録時に付与され、すぐにお試し可能</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <div class="lurus-card__title">無料枠</div>
    <p class="lurus-card__body">登録後すぐに Lurus API をお試し可能</p>
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

サブスクリプションに含まれる枠を超過した分は、自動的に鹿贝ウォレットから課金されます。モデルごとに単価が異なり、コンソールの表示が基準となります。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">完全な価格、枠のルール、チャージ比率を確認したいですか？</p>
    <div class="lurus-callout__body"><a href="/ja/platform/billing">課金の詳細</a>では、サブスクリプションプランの比較、枠の計算、鹿贝の換算比率、返金ポリシーを分解して解説しています。</div>
  </div>
</div>

---

## 鹿贝ウォレット {#wallet}

**鹿贝（LB）** は Lurus プラットフォームの汎用ポイント通貨で、すべての超過利用料金の支払いに使われます。

### 鹿贝の取得

| 経路 | 報酬 | 説明 |
|------|------|------|
| **新規ユーザー登録** | 5 LB | 初回登録時に付与 |
| **初回チャージ** | 10 LB の追加ボーナス | 初回チャージ時に追加進呈 |
| **初回サブスクリプション** | 30 LB の追加ボーナス | 任意の有料プランへの初回サブスクリプション |
| **サブスクリプション更新** | チャージ金額 x 5% | 最初の6回の更新でキャッシュバックを享受 |
| **毎日のチェックイン** | ランダム LB | 毎日のチェックインで受け取り |
| **友達紹介** | 招待報酬 | 友達が登録すると双方が報酬を獲得 |
| **戦略収入** | 配分精算 | Lucrum 戦略サブスクリプションの収入 |
| **チャージ購入** | 比率に応じて換算 | 鹿贝を直接購入 |

### 鹿贝の使用

利用先：サブスクリプション枠を超過した API 呼び出し料金の支払い、Lucrum の有料戦略のサブスクリプション、高度な機能/拡張パックの購入。

### VIP レベル

累計で鹿贝を消費すると複数段階の VIP を解放し、割引はすべての鹿贝消費に自動適用されます。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">Standard</span><span class="lurus-stat__label">入門</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Silver</span><span class="lurus-stat__label">シルバー</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Gold</span><span class="lurus-stat__label">ゴールド</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Platinum</span><span class="lurus-stat__label">プラチナ</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Diamond</span><span class="lurus-stat__label">ダイヤモンド</span></div>
</div>

しきい値と割引の詳細は [identity.lurus.cn](https://identity.lurus.cn) アカウントセンターの VIP ページをご覧ください。

---

## 支払い方法

すべての支払いは安全な Webhook で非同期に確認され、ネットワークの変動による重複課金を防ぎます。

| 方式 | シーン | 説明 |
|------|----------|------|
| **Stripe** | サブスクリプション + チャージ | クレジットカード/デビットカード（Visa、Mastercard） |
| **Creem** | チャージ | 暗号通貨での支払い |
| **Epay** | チャージ | 支付宝/微信支付（サードパーティ） |

---

## 紹介プログラム

[identity.lurus.cn](https://identity.lurus.cn) で専用の紹介リンク（紹介コードを含む）をコピーして友達にシェアできます。報酬：友達がリンク経由で登録すると双方が鹿贝を獲得し、友達が初めて有料サブスクリプションを行うとサブスクリプション金額の一定比率のキャッシュバックを追加で獲得できます。招待数の上限はありません。

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
