---
title: 統合 ID 認証
description: Lurus 全製品ラインで共有される ID 基盤。一度のログインで全サイトを横断利用でき、SSO、Passkey、多要素認証、API 認証、エンタープライズ SSO フェデレーションに対応します。
---

<div class="auth-page">

<ProductHero product-id="auth" />

**一度ログインすれば、全サイトを横断利用。** Lurus API、Lucrum、Switch、Creator、Lutu、Admin、Forge などすべての製品が同一の ID 基盤を共有します。ユーザーがいずれかの製品でログインすると、残りの製品も自動的に認識します。権限とクォータはアカウント単位で一元的に精算され、エンタープライズ顧客は自社の SSO を接続して従業員のオンボーディングを完了できます。

この基盤は `auth.lurus.cn` がサービスを提供し、オープンソースの ID インフラ [Casdoor](https://casdoor.com) をベースに自社構築・デプロイされています。OIDC / OAuth2 / SAML の標準プロトコルを完全実装し、ユーザーデータは終始 Lurus 自社の K8s クラスター内に保持されます。

::: tip クイック入口
- ユーザーセルフサービス管理：[auth.lurus.cn](https://auth.lurus.cn) — パスワード変更、Passkey 管理、MFA バインド、ログイン履歴の確認
- 組織 / プロジェクト管理：[auth.lurus.cn](https://auth.lurus.cn)（Casdoor 組織コンソール）— エンタープライズ顧客のメンバー招待、権限割り当て、監査。または商談窓口へ連絡してエンタープライズ組織管理を開設
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug-zap" :size="14" /> 接続</span>
  <h2 class="lurus-section-head__title">接続ポイント</h2>
  <p class="lurus-section-head__lede">5 つの標準エンドポイントが、ディスカバリー、認可、トークン取得、ユーザー情報の読み取りをカバーします。</p>
</div>

| エンドポイント | URL | 説明 |
|------|-----|------|
| コンソール | `https://auth.lurus.cn` | ユーザーがアカウント、セキュリティデバイス、セッションをセルフサービスで管理 |
| OIDC Discovery | `https://auth.lurus.cn/.well-known/openid-configuration` | SDK の自動ディスカバリー。すべてのエンドポイントとサポート機能を含む |
| OAuth2 認可 | `https://auth.lurus.cn/oauth/v2/authorize` | 標準の認可コード / PKCE フローの入口 |
| Token エンドポイント | `https://auth.lurus.cn/oauth/v2/token` | access token / refresh token の取得 |
| ユーザー情報 | `https://auth.lurus.cn/oidc/v1/userinfo` | 現在のユーザーの claims を読み取り |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 機能</span>
  <h2 class="lurus-section-head__title">コア機能</h2>
  <p class="lurus-section-head__lede">シングルサインオンからエンタープライズ SSO フェデレーションまで、一つの基盤で個人と B2B の全シーンをカバーします。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-auth)"
  :items="[
    { title: 'SSO シングルサインオン', body: '一度ログインすればすべての Lurus 製品にアクセスでき、認証情報を繰り返し入力する必要がありません。標準 OIDC session をベースに、アプリ間のサイレントリフレッシュに対応します。', icon: 'key-round' },
    { title: '多要素認証 / Passkey', body: 'TOTP（Authenticator App）、U2F ハードウェアキー、および Passkey（WebAuthn パスワードレスログイン）に対応します。MFA ポリシーは組織またはプロジェクトレベルで強制的に有効化できます。', icon: 'shield' },
    { title: 'ソーシャルログイン', body: 'GitHub、Google、WeChat などのサードパーティ ID プロバイダーを接続でき、ユーザーは外部アカウントでバインドを完了した後に Lurus アカウントと連携します。', icon: 'users' },
    { title: 'RBAC と組織の階層化', body: 'ロール・権限モデル（Role-Based Access Control）。権限は Grant を通じて特定のユーザーまたはサービスアカウントに付与され、プロジェクトおよびアプリケーションの粒度まで精密に指定できます。', icon: 'user-check' },
    { title: 'B2B マルチテナント', body: 'Instance の下に複数の Organization を作成でき、エンタープライズ顧客の分離を自然にサポートします。各組織はブランド、ログインポリシー、IdP フェデレーションを個別に設定できます。', icon: 'building-2' },
    { title: 'OIDC / OAuth2 / SAML', body: '三大標準プロトコルを完全実装し、市場の主要な SDK やフレームワークと互換性があり、Go、Rust、TypeScript、Flutter アプリにシームレスに統合できます。', icon: 'link' },
    { title: '監査ログ', body: 'ログイン、MFA 変更、権限付与、パスワードリセットなどの重要操作はすべて、照会可能な不変ログとして記録され、コンプライアンス要件を満たします。', icon: 'history' },
    { title: 'Actions 拡張', body: '認証フローの重要なノードにカスタムロジックを注入できます（ユーザー属性の同期、ログイン条件の制限など）。Casdoor 本体を fork する必要はありません。', icon: 'workflow' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> モデル</span>
  <h2 class="lurus-section-head__title">主要概念の概観</h2>
  <p class="lurus-section-head__lede">ID 基盤は以下の階層で構成されています。開発者と管理者は、これらの層のオブジェクトが Lurus 製品にどのようにマッピングされるかを理解しておく必要があります。</p>
</div>

<ArchitectureDiagram
  title="オブジェクトモデルの階層"
  chart="graph TD; Instance[Instance · lurus-prod] --> Org[Organization · lurus.cn]; Org --> User[User · Human / Service]; Org --> Project[Project · 製品ごとに 1 つ]; Project --> App[Application · client_id]; Project --> Role[Role]; User -. User Grant .-> Role"
/>

| 概念 | 意味 | Lurus におけるマッピング |
|------|------|-----------------|
| **Instance** | 最上位のデプロイ単位。独立したデータベースと設定を持つ | Lurus は単一の Instance を運用し、`auth.lurus.cn` でホスティング |
| **Organization** | テナント分離単位。独立したユーザーストアとログインポリシーを持つ | 個人ユーザーは `lurus.cn` メイン組織に所属。エンタープライズ顧客は独立した Organization を申請でき、自社ドメインと IdP を設定可能 |
| **Project** | Organization 配下のアプリケーション集合。roles と grants を一元管理 | 各製品ライン（Lurus API、Lucrum、Switch、Forge…）が一つの Project に対応 |
| **Application** | Project 内の具体的なクライアント。`client_id` / `client_secret` を保持 | 各フロントエンド、デスクトップ、サーバーサイドがそれぞれ一つの Application を登録 |
| **User** | ログイン可能なアカウント。Human（実在の人）と Service User（マシン）に分かれる | エンドユーザーは Human。バックエンドサービス間の呼び出しには Service User + JWT Profile を使用 |
| **Grant** | Project Role を特定の User に付与するバインド関係 | ユーザーの具体的な製品内での権限レベルを制御。[auth.lurus.cn](https://auth.lurus.cn)（Casdoor）の組織設定を正とする |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-open" :size="14" /> ナビゲーション</span>
  <h2 class="lurus-section-head__title">本セクションの目次</h2>
  <p class="lurus-section-head__lede">概念から統合まで、必要に応じて各層を深掘りできます。</p>
</div>

<div class="lurus-cards lurus-cards--2">
  <a class="lurus-card lurus-card--auth" href="/ja/platform/auth/concepts">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">コア概念</div>
    <p class="lurus-card__body">Instance / Organization / Project / User / Application / Grant の詳解。</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/ja/platform/auth/login">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">ログインと多要素認証</div>
    <p class="lurus-card__body">パスワードログイン、Passkey、ソーシャルログイン、MFA 設定。</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/ja/platform/auth/oidc">
    <span class="lurus-card__icon"><Icon name="link" :size="20" /></span>
    <div class="lurus-card__title">OIDC / OAuth2 統合</div>
    <p class="lurus-card__body">Discovery、scopes、claims、認可コードフロー、PKCE。</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/ja/platform/auth/api-auth">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">API 認証</div>
    <p class="lurus-card__body">Personal Access Token、Service User、JWT Profile、token 検証。</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/ja/platform/auth/console">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">コンソール管理</div>
    <p class="lurus-card__body">組織 / プロジェクト / アプリケーション / ユーザーの日常的な管理操作。</p>
  </a>
</div>

---

## 他の Lurus 製品との連携

| シーン | パス |
|------|------|
| API Key 取得後、OAuth token で Lurus API を呼び出したい | [OIDC 統合](/ja/platform/auth/oidc) → [Chat Completions](/ja/api/chat-completions) |
| Switch でログインして Lurus アカウント設定を同期する | [ログインと MFA](/ja/platform/auth/login) → [Switch 設定説明](/ja/switch/configuration) |
| Forge 管理者がチーム権限を設定する | [コンソール管理](/ja/platform/auth/console) → [Forge](/forge/) |
| 開発者がバックエンドサービスを書いて Platform 内部 API を呼び出す | [API 認証 (PAT/JWT)](/ja/platform/auth/api-auth) |
| エンタープライズ顧客が自社の Azure AD / Feishu でログインしたい | [ログインと MFA — Identity Brokering](/ja/platform/auth/login) |

---

## 関連資料

オープンソースの ID インフラ Casdoor をベースに構築されています。基盤の仕組みや SDK の詳細を深く知りたい場合は、上流のドキュメントを参照してください。

- [Casdoor ドキュメントホーム](https://casdoor.com/docs) — クイックスタート、デプロイモード、SDK 統合ガイド
- [コア概念](https://casdoor.com/docs/concepts) — Instance、Organization、Project、User、Grant の原理説明
- [API リファレンス](https://casdoor.com/docs/apis) — Management API、Auth API、Admin API の REST / gRPC エンドポイントドキュメント

<RelatedProducts product-id="auth" />

</div>

<style scoped>
.auth-page .lurus-section-head {
  margin-top: 8px;
}
</style>
