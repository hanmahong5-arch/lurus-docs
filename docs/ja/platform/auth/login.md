---
title: ログインと多要素認証 | Casdoor 身元認証
description: Lurus がサポートするログイン方式（パスワード、Passkey、ソーシャルログイン、エンタープライズ SSO）と多要素認証ポリシー。
---

<div class="auth-login">

# ログインと多要素認証

Lurus のすべての製品は同一の身元認証インフラ（**Casdoor**、外部公開は `identity.lurus.cn`）を共有します。Lurus API、Switch、Lucrum、Forge のいずれを利用する場合でも、ログインは同じ入口を経由し、一度ログインすれば全製品で通用します。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> フロー</span>
  <h2 class="lurus-section-head__title">1. ログインフロー概要</h2>
  <p class="lurus-section-head__lede">OIDC Authorization Code Flow + PKCE。クライアントは一切の秘密鍵を保存しません。</p>
</div>

ユーザーが任意の製品にアクセスした際に有効なセッションがない場合、アプリケーションはブラウザを `identity.lurus.cn` にリダイレクトし、認証後に認可コードを付けて元のページへ戻します。

<ArchitectureDiagram
  title="Authorization Code + PKCE フロー"
  chart="sequenceDiagram; participant B as ユーザーブラウザ; participant P as Lurus 製品; participant A as identity.lurus.cn; B->>P: 製品ページにアクセス; P-->>B: 302 リダイレクト; B->>A: GET /authorize (client_id, code_challenge, scope); A-->>B: ログインページ メール/Passkey/SSO; A-->>B: 302 redirect_uri?code; B->>P: 認可コード; P->>A: POST /token (code + code_verifier); A-->>P: access_token / id_token; P-->>B: ログイン成功、製品へ進入"
/>

**PKCE**：クライアントは認可リクエストを送る前にランダムな `code_verifier` を生成し、その SHA-256 ハッシュである `code_challenge` をリクエストとともに送信します。認可コードを取得した後は元の verifier で token と交換し、サーバーは両者の一致を検証してから発行します。たとえ認可コードが傍受されても token とは交換できません。

::: info セッション有効期間
デフォルトの Access Token は 12 時間、Refresh Token はサイレントに更新できます。具体的な期間は組織ポリシーによって決まり、管理者はコンソールで調整できます。
:::

---

## 2. サポートされるログイン方式

| ログイン方式 | 説明 | 適用シーン |
|---------|------|---------|
| **メール + パスワード** | 標準登録、パスワードは複雑度ポリシーを満たす | すべてのユーザー |
| **電話番号 + 認証コード** | SMS OTP（管理者による有効化が必要） | 組織の設定による |
| **Passkey（WebAuthn）** | パスワードレス、デバイスの生体認証またはハードウェアキー | 一般ユーザーに推奨 |
| **GitHub / Google / Microsoft·Azure AD / Apple** | ソーシャルログイン（OAuth2 / OIDC） | 組織の設定による |
| **エンタープライズ SSO（OIDC/SAML 2.0）** | B2B 顧客が自社 IdP と連携（Okta、飛書、企業微信） | 企業顧客 |
| **LDAP** | 企業ディレクトリサービスとの直接接続 | オンプレミス導入顧客 |

::: tip 推奨優先度
Passkey > ソーシャルログイン > メールパスワード。Passkey はパスワードを記憶する必要がなく、フィッシング耐性があり、セキュリティが最も高いです。
:::

---

## 3. Passkey / WebAuthn

**原理**：**WebAuthn / FIDO2** に基づき、非対称暗号でパスワードを置き換えます。登録時にデバイスが鍵ペアを生成し、**秘密鍵はデバイスに留まり**（生体認証/PIN で保護）、公開鍵を `identity.lurus.cn` にアップロードします。ログイン時にはサーバーがチャレンジを送り、デバイスの秘密鍵で署名した後、サーバーが公開鍵で検証します。全行程で**パスワードの送信はゼロ**であり、データベースが漏洩しても得られるのは公開鍵だけです。

**登録（ユーザー操作）**：

<ol class="lurus-steps">
<li><code>identity.lurus.cn</code> にログインします。</li>
<li><strong>アカウント設定 → セキュリティ → Passkey を追加</strong> に進みます。</li>
<li>Passkey に名前を付けます（例：「MacBook Touch ID」）。</li>
<li>生体認証を完了します（Touch ID / Face ID / PIN / ハードウェアキー）。</li>
<li>次回ログイン時に Passkey を選べばパスワードレスでログインできます。</li>
</ol>

::: tip 複数の Passkey の登録を推奨
メインのスマートフォンとノートパソコンにそれぞれ 1 つずつ登録し、単一デバイスの紛失でログインできなくなるのを防ぎます。
:::

**マルチデバイス同期**：

| プラットフォーム | 同期方式 |
|------|---------|
| iOS / macOS | Apple Keychain（iCloud Keychain）、Apple デバイス間で同期 |
| Android / Chrome OS | Google Password Manager、Android と Chrome 間で同期 |
| クロスプラットフォーム | 1Password、Dashlane など Passkey 対応のパスワードマネージャー |
| ハードウェアキー | YubiKey、SoloKey など FIDO2 トークン（同期不要） |

**ブラウザ互換性**：Chrome/Chromium 108+（同期を含む）、Safari 16+（macOS Ventura / iOS 16、Apple Keychain）、Edge 108+（Chrome と同じ、Windows Hello 対応）、Firefox 119+（WebAuthn 対応、クラウド同期 Passkey は未対応）。

::: warning 企業デバイスポリシー
一部の企業は GPO / MDM でプラットフォーム生体認証や WebAuthn を無効化しています。「Passkey を作成できません」と表示された場合は IT 管理者に連絡するか、ハードウェアキー（YubiKey）に切り替えてください。
:::

---

## 4. 多要素認証 (MFA)

**利用可能な第二要素**：

| 要素 | 説明 | 推奨ツール |
|------|------|---------|
| **TOTP** | 時間ベースのワンタイムパスワード（30 秒ごとに更新） | Google Authenticator、1Password、Authy、Microsoft Authenticator |
| **U2F / WebAuthn ハードウェアキー** | YubiKey、SoloKey など FIDO2、物理的に押下 | YubiKey 5 シリーズ |
| **WebAuthn プラットフォーム認証器** | デバイス内蔵の生体認証（Face ID、Windows Hello、指紋） | 内蔵 |
| **Email OTP / SMS OTP** | 認証コードをメール送信 / バインドした電話番号へ（SMS は管理者による有効化が必要） | 受信箱 / 携帯 SMS |

::: tip TOTP ベストプラクティス
クラウドバックアップに対応した TOTP アプリ（1Password、Authy）を使い、スマートフォンの紛失でアクセスを失わないようにします。Google Authenticator の旧バージョンは移行に対応していないため、移行前に必ずエクスポートしてください。
:::

**MFA ポリシー**（コンソールの **セキュリティポリシー**）：**強制しない**（ユーザーが任意でバインド）/ **強制（すべてのユーザー）**（初回ログイン後に少なくとも 1 つの第二要素を登録する必要がある）/ **ローカルユーザーのみ強制**（外部 IdP/SSO ログインは免除、ローカルアカウントは必須バインド）。よくある強制シーン：高権限アカウント（管理者、財務）は常に強制；B2B 顧客組織は顧客の管理者が個別に設定；リスクのあるログイン（異なる地域の IP/新規デバイス）はステップアップ検証（Step-up Auth）をトリガーできる。

**リカバリーコード**：MFA をバインドした後に一組のワンタイムリカバリーコードを生成します（**アカウント設定 → セキュリティ → リカバリーコード**）。印刷するかパスワードマネージャーに保存します（**スクリーンショットでクラウドアルバムに保存しないでください**）。MFA デバイスを失った際は任意のリカバリーコードでログインした後、直ちに MFA を再バインドします。各コードは使用後に無効化されるため、使い切ったら直ちに新しい一組を再生成してください。

---

## 5. パスワードポリシー (Password Policy)

以下は Casdoor インスタンスのデフォルト基準であり、管理者はコンソールで調整できます。実際の要件は登録/パスワード変更時にリアルタイムで提示されます。

**複雑度**（デフォルト値）：最小長 8 文字；大文字、小文字、数字、特殊文字（`!@#$%^&*` など）を各々最低 1 つ。

**有効期限と履歴**：最長有効期間（0=無期限）；期限警告（N 日前から、現バージョンではメールを送信せずログイン時にページ提示のみ）；パスワード履歴チェック（直近 N 回の再利用を防止）。

**ログイン失敗ロック (Lockout)**：パスワード最大失敗回数 / OTP 最大失敗回数（0 に設定すると対応するロックを無効化）。ロック後は必ず**管理者がコンソールで手動解除**する必要があり、自動解除されません。

::: warning アカウントロックの対処
パスワードや OTP を連続して誤入力してロックされた場合は、所属組織の管理者に連絡するか、**support@lurus.cn** にメール（アカウントのメールアドレスを記載）してください。業務時間内に解除処理を行います。
:::

---

## 6. 身元代理 / Identity Brokering

Casdoor は中間 IdP として機能し、1 つまたは複数の**上流の外部 IdP**（企業の Azure AD/Okta、またはソーシャルの GitHub/Google）と連携します。ユーザーが「XXX でログイン」をクリック → 上流 IdP へジャンプして認証 → Casdoor が結果を受信 → Lurus 統一 token を発行、という流れです。

<ArchitectureDiagram
  title="Identity Brokering 経路"
  chart="graph LR; P[Lurus 製品] --> Z[identity.lurus.cn · Casdoor]; Z --> U[上流 IdP · Azure AD / Okta / GitHub …]; U -. ユーザー身元アサーション OIDC/SAML .-> Z; Z -. Lurus access_token / id_token を発行 .-> P"
/>

**いつ使うか**：企業顧客の B2B SSO（従業員が自社の Azure AD/Okta で直接ログインでき、登録不要）；ドメイン自動ルーティング（企業メールを入力するとドメインに応じて対応する IdP へジャンプ、Domain Discovery）；アカウント関連付け（既存の Lurus アカウントに GitHub/Google を関連付け）；Just-in-Time 作成（初回の外部 IdP ログイン時に自動でアカウントを作成しデフォルトロールを割り当て）。

**設定手順（管理者）**：コンソール → **インスタンス設定 / 組織設定 → 身元プロバイダー → 追加** → テンプレートを選択（EntraID / Okta / GitHub / Google / SAML 汎用など）→ 上流の Client ID/Secret（OIDC）または EntityID/Metadata URL（SAML）を入力 → **ログインポリシー** で有効化しアカウントの自動作成を許可するか設定 → テストログインを行い、ロール/権限のマッピングを確認。

::: info サポートされるプロトコル
**OIDC**：Google、GitHub、飛書、企業微信、Okta など。**SAML 2.0**：Azure AD（EntraID）、ADFS、エンタープライズ SSO。**LDAP**：企業内部の Active Directory または OpenLDAP。
:::

---

## 7. ログイン画面のカスタマイズ (Branding)

**インスタンス**または**組織**の粒度でカスタマイズ：ロゴ（ライト/ダーク、SVG/PNG）、テーマカラー、フォント、背景、カスタムドメイン（`auth.yourcompany.com`、DNS が必要）。Lurus はデフォルトでメインサイトの統一配色を使用します。B2B 顧客は**組織設定 → 外観**で設定でき、他の組織には影響しません。

::: tip カスタムドメインと Passkey
B2B 組織にカスタムログインドメイン（`auth.client.com`）を設定する場合は**最初の Passkey を登録する前に必ず完了**してください。Passkey は登録時のドメイン（RP ID）にバインドされ、後から変更すると既存の Passkey が無効になります。
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> トラブルシューティング</span>
  <h2 class="lurus-section-head__title">8. よくある問題とトラブルシューティング</h2>
  <p class="lurus-section-head__lede">4 種類の頻出するログイン / 権限問題の原因と対処手順。</p>
</div>

<details class="lurus-faq-item">
<summary>サブドメイン間の Cookie 失効 — ログイン後に他のサブドメインにアクセスすると再ログインを求められる？</summary>

`app.lurus.cn` でログインした後に `docs.lurus.cn` にアクセスすると再ログインを求められる。**原因**：OIDC セッション Cookie の `Domain` が正しくない、またはサブドメイン間の CORS 制限。**トラブルシューティング**：すべてのサブドメインが同じトップレベルドメインであることを確認し、Cookie に `Domain=.lurus.cn` を設定する。iframe でログインページを埋め込む場合は `SameSite=None; Secure` かつ HTTPS が必要。

</details>

<details class="lurus-faq-item">
<summary>MFA バインドデバイスの紛失 — TOTP の認証コードを生成できない？</summary>

対処手順：① MFA 検証画面で **リカバリーコードでログイン** をクリック ② 任意のリカバリーコードを入力 ③ ログイン後すぐに **アカウント設定 → セキュリティ** で旧 MFA を解除し新しいデバイスを再バインド ④ リカバリーコードも紛失した場合は組織の管理者に連絡し MFA を強制リセット。

</details>

<details class="lurus-faq-item">
<summary>エンタープライズ SSO ログイン後にリソースが見えない — SSO は成功したが権限がない、またはリソースが空？</summary>

**原因**：① User Grant が未設定（ユーザーを対応する Project に認可していない）② Project Role の欠如（認可済みだが `viewer`/`editor` を割り当てていない）③ JIT 作成アカウントがグループに未所属。**トラブルシューティング**：コンソール → **ユーザー** → 該当アカウント → **認可 (Grants)** タブで、プロジェクトとロールを確認。

</details>

<details class="lurus-faq-item">
<summary>Passkey が会社のパソコンで使えない — 「資格情報を作成できません」と表示される？</summary>

**原因**：企業の MDM/GPO がプラットフォーム認証器または WebAuthn を無効化している。**解決**：IT に連絡して制限を解除する / YubiKey などクロスプラットフォームのハードウェアキーを使う / TOTP + パスワードにフォールバックする。

</details>

---

## 関連ドキュメント

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'OIDC / OAuth2 連携', link: '/ja/platform/auth/oidc', primary: true },
    { text: 'API 認証 (PAT / JWT)', link: '/ja/platform/auth/api-auth' },
    { text: '認証コンソール', link: 'https://identity.lurus.cn', external: true },
  ]"
/>

- [請求とサブスクリプション](../billing.md) · [プラットフォームよくある質問](../faq.md) · [Lurus API 接続ガイド](/ja/api/overview) · [Casdoor 公式ドキュメント](https://casdoor.com/docs)（英語）

</div>

<style scoped>
.auth-login .lurus-section-head { margin-top: 8px; }
</style>
