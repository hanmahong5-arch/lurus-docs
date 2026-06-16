---
title: コンソール管理 | Zitadel ID 認証
description: auth.lurus.cn コンソールを使って組織・ユーザー・プロジェクト・アプリケーション・ID ポリシーを管理する完全操作マニュアル。
---

<div class="console-page">

# コンソール管理

Lurus は [Zitadel](https://zitadel.com) を統一 ID 認証プラットフォームとして採用しており、コンソールの入口は [auth.lurus.cn](https://auth.lurus.cn) です。本記事は**組織管理者 / IT 運用担当**を対象とし、日常操作の完全なフローを網羅します。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">この記事を読むべき人</p>
    <div class="lurus-callout__body">組織・ユーザー・プロジェクト・アプリケーションと ID ポリシーを管理する必要がある <strong>Org Owner / IT 運用担当</strong>。ログイン連携だけを行いたい開発者は <a href="/ja/platform/auth/oidc">OIDC / OAuth2</a> と <a href="/ja/platform/auth/api-auth">API 認証</a> を参照してください。</div>
  </div>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--auth" href="#_2-組織管理-organization">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">組織管理</div>
    <p class="lurus-card__body">作成 / 切り替え、ドメイン検証、メンバーロール、メタデータ</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_3-ユーザー管理-users">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">ユーザー管理</div>
    <p class="lurus-card__body">Human / Service User、PAT、状態遷移、監査</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_4-プロジェクト管理-projects">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">プロジェクトとアプリケーション</div>
    <p class="lurus-card__body">Roles、Grant、Redirect URI、Token 設定</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_7-ポリシー管理-policies">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">ID ポリシー</div>
    <p class="lurus-card__body">ログイン / パスワード / ロックアウト / ブランディング / 通知ポリシー</p>
  </a>
</div>

---

## 1. コンソールナビゲーション

ログイン後は Management Console に入り、3 つのエリアに分かれます。

- **上部 Breadcrumb**：現在の階層を表示します（**Instance レベル**のグローバル / **Organization レベル**の単一テナント）。組織名のドロップダウンをクリックすると切り替えや新規作成（**New organization**）ができます。Instance レベルの操作には Instance Manager 権限が必要で、一般的な Org Owner は自分の Organization のみが見えます。
- **左側メニュー**：

| メニュー項目 | 機能 |
|--------|------|
| **Users** | Human User / Service User 管理 |
| **Projects** | プロジェクト、アプリケーション、Role 管理 |
| **Actions** | カスタムイベントトリガースクリプト |
| **Settings** | Login / Password Policy / Branding などのポリシー |
| **IDP** | 外部 ID プロバイダー（Google / GitHub / SAML など） |

- **右側パネル**：リソースをリストでクリックすると詳細パネルが展開され、フィールドを直接編集して保存できます。

---

## 2. 組織管理（Organization）

### 2.1 組織の作成と切り替え

**作成**：上部ドロップダウン → **New organization** → 名称を入力 → 初期管理者の身元を選択（**Current User** で現在のアカウントを Org Owner に設定 / **New Account** で管理アカウントを個別に作成）→ 確認。

**切り替え**：上部 Breadcrumb のドロップダウン → 対象の組織名をクリック。

**セルフサービス登録入口（B2B）**：顧客は `https://auth.lurus.cn/ui/login/register/org` にアクセスして自分で組織を登録できます。

### 2.2 デフォルト Organization の設定

左側 **Organizations**（Instance レベル）→ 対象組織の行の **「...」** → **Set as default organization**（行に **Default** ラベルが表示されます）。

> ユーザーログイン時に組織コンテキストを伴っていない場合（`urn:zitadel:iam:org:id:{id}` scope がない場合）、デフォルト Organization のポリシーとブランディング設定が適用されます。

### 2.3 ドメイン検証

会社のメールドメインを Organization に紐付けると、ドメインによるログインルーティングとシングルサインオン直行を有効化できます。

対象 Organization → **Settings → Organization Domains → Add Domain** → ドメインを入力（例 `lurus.cn`）→ 検証方式を選択（**DNS Challenge**：DNS に TXT レコードを追加、値は Zitadel が生成 / **HTTP Challenge**：Web の指定パスに検証ファイルを配置）→ **Verify** → 通過後に **Set as primary** でプライマリドメインに設定できます。

::: warning
DNS TXT レコードは検証後**削除しないでください**。Zitadel が定期的に再検証します。削除するとドメインの状態が無効になります。
:::

### 2.4 メンバー管理（Organization Members）

**追加**：Organization → **Members → Add Member** → ユーザーを検索（email / ユーザー名）→ ロールを割り当て → **Save**。**削除**：Members リストの該当行の右側にある削除アイコン。

| ロール | 権限範囲 |
|------|---------|
| **Org Owner** | 組織内のすべての権限、メンバー管理を含む |
| **Org User Manager** | Human / Service User の管理 |
| **Org User Viewer** | ユーザーの読み取り専用閲覧 |
| **Org Project Creator** | 新しい Project の作成 |
| **Org Project Permission Editor** | Project Grant とロール付与の管理 |

### 2.5 メタデータ（Metadata）

Organization → **Metadata → Add Metadata** → Key / Value を入力 → 保存。任意の key-value で、API 経由で読み取ってビジネス拡張フィールドに利用できます。

---

## 3. ユーザー管理（Users）

### 3.1 Human User：作成

**Users → New** → First/Last Name、Email（**Email verified** にチェックすると検証をスキップ可能）、Username（デフォルトは Email と同じ）、Phone（任意）を入力 → 初期パスワードポリシーを選択（**Setup authentication later** で初回ログイン時に本人設定 / **Send an invitation E-Mail** で招待メール送信 / **Set an initial password** で管理者が直接設定）→ **Create**。

### 3.2 Human User：日常操作

- **パスワードリセット**：ユーザー詳細 → **Security → Send Password Reset Email**、または **Set New Password** で直接設定。
- **ロック/ロック解除**：詳細ページ右上の **Lock** / **Unlock**（ロック後はログイン不可、既存の Session は次回認証時に失効します）。
- **初期パスワードメール送信**：詳細ページ → **Resend Initialization Email**。
- **MFA リセット**：詳細 → **Security → Authenticators** → 対象の MFA デバイス（TOTP / Passkey / U2F）を削除 → ユーザーは次回ログイン時に再登録が必要です。

### 3.3 ユーザー状態遷移

<ArchitectureDiagram title="ユーザー状態機械" chart="stateDiagram-v2
  [*] --> Initial: 作成
  Initial --> Active: 初期化完了
  Active --> Locked: Lock / ポリシー発動
  Locked --> Active: Unlock
  Active --> Inactive: 無効化
  Active --> Deleted: 削除
  Deleted --> [*]" />

::: details テキスト版状態図
```
[Initial] →(完成初始化)→ [Active]
[Active]  →(Lock / 策略触发)→ [Locked] →(Unlock)→ [Active]
[Active]  →(停用)→ [Inactive]    [Active]→(删除)→[Deleted]
```
:::

| 状態 | 説明 |
|------|------|
| **Initial** | 作成後、初期パスワード設定またはメール検証が未完了 |
| **Active** | 正常にログイン可能 |
| **Inactive** | 管理者により無効化され、ログイン不可 |
| **Locked** | パスワード誤入力が上限を超過、または手動でロック |
| **Deleted** | 削除済み、データは監査用に保持 |

### 3.4 Service User：作成と設定

マシン間通信（CI/CD、バックエンド呼び出し）に使用し、パスワードログインは行いません。

- **作成**：**Users → Service Users → New** → Username と Display Name を入力（Description は任意）→ **Create**。
- **PAT 生成**：詳細 → **Personal Access Tokens → New** → 有効期限を任意で設定 → 作成後**すぐにコピー**（一度だけ）→ 呼び出し側は環境変数 `Authorization: Bearer <token>` を設定。
- **JWT 公開鍵（Key File）のアップロード**：詳細 → **Keys → Add Key** → タイプ **JSON** + 有効期限 → **Add** → JSON Key ファイルをダウンロード（秘密鍵を含み、一度だけ）→ サーバー側は秘密鍵で JWT に署名し token endpoint で Access Token と交換します。

### 3.5 監査とログイン履歴

- **ログイン履歴**：詳細 → **Login History**（時刻、IP、User Agent、成功/失敗）。
- **リソース変更履歴**：任意のリソース詳細ページ下部の **Changes**（Which User / Timestamp / Field / Old → New Value）。

---

## 4. プロジェクト管理（Projects）

### 4.1 プロジェクトの作成

**Projects → Create New Project** → 名称を入力（例 `lurus-api`、`lucrum`、`switch`）→ **Continue**。

### 4.2 プロジェクト設定（Settings タブ）

| 設定項目 | 説明 |
|--------|------|
| **Assert Roles on Authentication** | ログイン時に Roles を Token と Userinfo に注入。有効化を推奨 |
| **Check Role Assignment on Authentication** | ユーザーがその Project に少なくとも 1 つの Role Grant を持つことを要求、なければログイン拒否 |
| **Check for Project on Authentication** | ユーザーの所属 Organization がその Project の Grant を取得済みか検証 |

**Branding ポリシー**：**Unspecified**（システムデフォルト）/ **Enforce project’s policy**（一貫してプロジェクト所属 Org のブランドを使用）/ **Allow login user policy**（初期はプロジェクトのブランド、ユーザー識別後にユーザー自身の Org ブランドへ切り替え）。

### 4.3 ロール定義（Project Roles）

ロールは単なる文字列識別子であり、意味はビジネス側で定義します。詳細 → **Roles → New Role** → **Key**（コード識別子、Project 内で一意、例 `admin`/`viewer`/`trader`）、**Display Name**（コンソール表示名）、**Group**（任意、グループ表示）を入力 → **Save**。

### 4.4 User Grant（ユーザーへのロール付与）

詳細 → **Authorizations → New** → 対象ユーザーを検索（Human / Service）→ Role にチェック（複数選択可）→ **Save**。

### 4.5 Project Grant（組織横断の付与、B2B）

プロジェクト全体を別の Organization に付与し、その組織が本組織のユーザーのそのプロジェクトでのロールを管理できるようにします。詳細 → **Project Grants → New** → 提携先 Organization のドメインを検索して選択 → 許可する Role にチェック（サブセットに限定可）→ **Save**。

> 付与された Organization の管理者は **Granted Projects** の下でそのプロジェクトを確認でき、自組織のユーザーに Role を割り当てられます。

---

## 5. アプリケーション管理（Applications）

### 5.1 アプリケーションタイプの選択

詳細 → **Applications → New Application** → タイプを選択：

| タイプ | 適用シーン | 認証フロー |
|------|---------|---------|
| **Web** | サーバーサイドレンダリング（Spring / PHP / Django） | Authorization Code（PKCE 推奨）+ Client Secret |
| **SPA（User Agent）** | フロントエンドシングルページ（React / Vue） | Authorization Code + PKCE（Client Secret なし） |
| **Native** | デスクトップ/モバイル（Electron / iOS） | Authorization Code + PKCE |
| **API** | マシン間通信（マイクロサービス/スクリプト） | Client Credentials / JWT Profile |
| **SAML** | エンタープライズ統合（OIDC 非対応システム） | SAML 2.0、Metadata XML のアップロードまたは URL 入力 |

### 5.2 Redirect URI 設定

- **完全一致**、大文字小文字を区別。複数追加可能（本番/プレリリース/ローカルを個別に設定）。
- Native App はカスタムプロトコル（`myapp://callback`）に対応。IPv6 は角括弧をエスケープする必要があります `http://\[::1\]:8080/callback`。
- 典型的な Web 設定：`https://app.lurus.cn/auth/callback`、`https://staging.lurus.cn/auth/callback`、`http://localhost:3000/auth/callback`（Development Mode を有効化する必要あり）。
- **Post-Logout Redirect URI**：ログアウト時のリダイレクト先。同様に完全一致で、複数指定可能。

### 5.3 Token 設定（Token Settings）

| フィールド | 説明 | 推奨値 |
|------|------|--------|
| **Token Type** | `JWT`（クライアント側で署名検証）または `Opaque`（Userinfo へのコールバックが必要） | JWT |
| **Access Token Lifetime** | Access Token の有効期間 | 15 min |
| **Refresh Token Lifetime** | Refresh Token の最大有効期間 | 7 days |
| **Refresh Token Idle Lifetime** | Refresh Token の無活動による失効 | 24 h |
| **ID Token Lifetime** | ID Token の有効期間 | 1 h |
| **Add User Roles to Token** | Project Roles を Token claims に書き込む | 必要に応じて |
| **Add User Info to ID Token** | ユーザー情報を ID Token に統合（Userinfo リクエストを削減） | 任意 |
| **Clock Skew** | 許容するサーバー時計のズレの許容値 | デフォルト |

### 5.4 Development Mode

詳細 → **Redirect Settings** → **Development Mode** にチェック：`http://` の Redirect URI、Glob パターンマッチング（`*`、`/**`、`?`）を許可します。

::: warning
ローカル開発専用です。**本番環境では有効化を禁止**します。
:::

### 5.5 Client Secret

Web アプリ作成後に自動生成されます：作成時にポップアップで一度だけ表示されるので、**すぐにコピー**してください。再生成：詳細 → **Generate New Client Secret**（旧 Secret は即座に失効）。

---

## 6. ID プロバイダー（Identity Providers, IdP）

### 6.1 組み込み IdP タイプ

Organization → **Settings → IDP → Add IDP**：

| タイプ | 説明 |
|------|------|
| **Google** | OAuth2、Google Cloud Console の Client ID/Secret が必要 |
| **GitHub** | OAuth2、GitHub OAuth App の認証情報が必要 |
| **GitLab** | OAuth2、GitLab.com またはセルフホストに対応 |
| **Microsoft** | Azure AD / Entra ID、単一/マルチテナント |
| **Apple** | Sign in with Apple、Apple Developer アカウントが必要 |
| **Generic OIDC** | 任意の標準 OIDC Provider、Discovery URL を入力 |
| **Generic SAML** | 任意の SAML 2.0 IdP、Metadata をアップロード |
| **LDAP** | エンタープライズ AD / OpenLDAP |
| **JWT IDP** | カスタム JWT トークン発行者 |

### 6.2 Generic OIDC IdP の追加（例）

**Add IDP → Generic OIDC** → **Name**（ログインページのボタン文言）、**Client ID / Secret**（IdP 側で登録）、**Issuer / Discovery URL**（例 `https://accounts.google.com`）を入力 → フィールドマッピングを設定（**ID Attribute** は通常 `sub`；First/Last Name / Email / Display Name を IdP claims にマッピング）→ **Auto Linking** を設定（**None** は関連付けず毎回新規作成 / **By Email** は同一メールで統合 / **By Username** はユーザー名で統合）→ **Save**。有効化後はログインページに対応するボタンが表示されます。

### 6.3 Login Policy での IdP 有効化

**Settings → Login Behavior and Security → External IDPs** → 追加したばかりの IdP にチェック → 保存。

---

## 7. ポリシー管理（Policies）

Organization は Instance のデフォルトポリシーを上書きできます（Organization → **Settings** の各サブメニュー）。

### 7.1 Login Policy（**Login Behavior and Security**）

| スイッチ | 説明 |
|------|------|
| **Username / Password** | ユーザー名パスワードログインを許可 |
| **Registration** | セルフサービス登録を許可 |
| **External IDP** | サードパーティ IdP ログインを許可 |
| **Hide Password Reset** | 「パスワードを忘れた」リンクを非表示 |
| **Email / Phone as Login Name** | メール/電話番号をユーザー名として使用可能にする |
| **Domain Discovery** | メールドメインに応じて対応する Organization へ自動ルーティング |
| **Passkey / WebAuthn** | パスワードレスログインを有効化 |
| **Force MFA** | すべてのユーザーに MFA 有効化を強制 |

**セッション期間**：Password Check Lifetime（パスワード検証周期）/ External IDP Check Lifetime / MFA Init Skip Lifetime（MFA 設定をスキップできる猶予期間）/ Second Factor Check Lifetime。

### 7.2 Password Complexity（**Password Complexity**）

設定可能：最小長（Min Length）、大文字/小文字/数字/特殊記号の要求有無。

### 7.3 Lockout（**Lockout**）

**Max Password Attempts** / **Max OTP / TOTP Attempts**（0 は無制限を意味します）。ロック後は管理者による手動解除が必須です（詳細 → **Unlock**）。

### 7.4 Password Age（**Password Age**）

**Max Age in Days**（期限切れ後はログイン時に強制リセット）/ **Expiry Warning in Days**（N 日前からログインページで警告）。

### 7.5 Branding（**Branding**）

Logo/Icon（ライト/ダーク各 1 セット）、Primary Color、Background Color、Warning Color、Font、**Hide Watermark**（"Powered by ZITADEL" を非表示）、**Login Name Suffix**（ログイン名サフィックスの表示有無）。

### 7.6 Privacy Policy（**Privacy Policy**）

登録/ログインページのコンプライアンスリンク欄に表示する URL を設定：Terms of Service、Privacy Policy、Help、Support Email（<code v-pre>{{.Lang}}</code> 言語変数に対応）。

### 7.7 Domain Policy（**Domain Policy**）

| スイッチ | 説明 |
|------|------|
| **Username must contain org domain** | ユーザー名が `{user}@{org}.{instance-domain}` になる |
| **Validate Organization Domains** | DNS/HTTP 検証を通過しないとドメインを使用できないことを要求 |
| **SMTP sender address must match domain** | 通知メールの送信元ドメインが組織ドメインと一致する必要がある |
| **Email as username** | Email を直接ログインユーザー名として使用可能にする |

### 7.8 Notification（**Notifications**）

トリガーイベント：ドメインの権利主張、ユーザー初期化（招待/初期パスワード）、Passkey 登録確認、パスワードリセット、Email 検証、パスワード変更成功。チャネルは **Settings → SMTP** / **SMS Providers**（Twilio）で認証情報を設定します。

---

## 8. Actions（カスタムコード拡張）

::: info
Actions はログイン/登録/ユーザー作成などの重要イベントのトリガーポイントで **JavaScript**（Zitadel サーバー側サンドボックス）を実行し、実行結果はフローの継続または中断に影響を与えられます。
:::

左側 **Actions → New Action** → 名称を入力、トリガーする Flow と Trigger Type を選択 → JS 処理関数を記述 → 有効化して Flow にバインド。

**よくある用途**：ユーザー登録時にビジネス Webhook を呼び出して CRM/データウェアハウスに同期；Token にカスタム Claim（`tenant_id`、`plan_tier`）を注入；登録時にメールドメインのホワイトリストを検証。

**Flow タイプ（よく使うもの）**：

| Flow | トリガーシーン |
|------|---------|
| **Complement Token** | Access/ID Token 生成時に追加 claims を注入 |
| **Internal Authentication** | パスワード/Passkey 認証成功後 |
| **External Authentication** | 外部 IdP 認証成功後 |
| **Save success login** | ログイン成功の記録時 |
| **User Creation** | 新規ユーザー作成完了後 |

---

## 9. 監査とログ

- **Events ストリーム**：Instance レベルでは上部 **Events** / Organization レベルでは入った後の **Events**。タイムラインにすべての変更を列挙します（Event Type / Aggregate / Editor / タイムスタンプ）。
- **リソースレベル変更履歴**：各リソース詳細ページ下部の **Changes**（Who / When / Field + Old → New Value）。
- **SIEM 連携**：**Events API**（`/v2/events`）でイベントタイプ/時刻/リソース ID で絞り込み、Elasticsearch / Loki / Splunk にプッシュしてコンプライアンス監査を行います。

---

## 10. Lurus のよくある操作シーン

<p class="console-scenario-lede"><span class="lurus-tag"><Icon name="life-buoy" :size="13" /> クイックリファレンス</span> 4 つの高頻度運用プレイブック —— 展開してそのまま実行できます。</p>

<details class="lurus-faq-item">
<summary><Icon name="user-check" :size="16" /> 新入社員のオンボーディング</summary>

<ol class="lurus-steps">
<li><strong>Users → Human Users → New</strong>、氏名と業務メールを入力し、<strong>Send Invitation Email</strong> を選択。</li>
<li><code>lurus-api</code> プロジェクト → <strong>Authorizations → New</strong> → そのユーザーを検索 → ロールを割り当て。</li>
<li><code>lucrum</code>、<code>switch</code> などのプロジェクトに対して（職位に応じて）Grant の割り当てを繰り返す。</li>
<li>従業員に初期化メールの確認を通知し、パスワード設定と MFA 登録を完了させる。</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="bot" :size="16" /> CI / マシンアカウント</summary>

<ol class="lurus-steps">
<li><strong>Users → Service Users → New</strong>、Username は <code>ci-&lt;service-name&gt;</code> を推奨。</li>
<li>詳細 → <strong>Personal Access Tokens → New</strong> で有効期限を設定し Token をコピー；または <strong>Keys → Add Key</strong> で JSON Key ファイルをダウンロードし CI に秘密鍵を設定。</li>
<li>対応する Project → <strong>Authorizations</strong> で必要な Role を割り当て。</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="lock" :size="16" /> 従業員の退職</summary>

<ol class="lurus-steps">
<li>詳細ページ右上の <strong>Lock</strong>（即座にログインを阻止し、アカウントと監査を保持）。</li>
<li>関連する各 Project → <strong>Authorizations</strong> → そのユーザーを見つける → 削除アイコンですべての Grant を取り消す。</li>
<li>監査データがもう不要だと確認できれば（通常は推奨しません）、さらに <strong>Delete User</strong> を実行できます。</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="building-2" :size="16" /> 企業顧客の連携（B2B）</summary>

<ol class="lurus-steps">
<li>Instance レベル → <strong>Organizations → New Organization</strong>、名称は顧客の会社名を使用。</li>
<li>Org Owner（顧客の IT 管理者アカウント）を追加。</li>
<li>Organization → <strong>Settings → Organization Domains</strong> で顧客のドメインを検証。</li>
<li>顧客が自社 IdP（Azure AD）を持つ場合：Organization → <strong>Settings → IDP</strong> で SAML/OIDC IdP を追加。</li>
<li><code>lurus-api</code> プロジェクト → <strong>Project Grants → New</strong> → その顧客 Organization を選択 → 許可する Role を割り当て。</li>
<li>顧客の Org Owner はログイン後、<strong>Granted Projects</strong> の下で従業員にロールを割り当てる。</li>
</ol>

</details>

---

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="link" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">関連ドキュメント</p>
    <div class="lurus-callout__body"><a href="/ja/platform/auth/">認証の概要と接続ポイント</a> · <a href="/ja/platform/auth/oidc">OIDC / OAuth2</a> · <a href="/ja/platform/auth/api-auth">API 認証</a> · <a href="https://auth.lurus.cn">認証コンソール ↗</a></div>
  </div>
</div>

*Zitadel セルフホストインスタンス（`auth.lurus.cn`）に基づきます。インターフェースの詳細は実際のバージョンを基準としてください。ポリシー変更時は本ドキュメントを同期してください。*

</div>

<style>
.console-page .lurus-cards { margin: 1.1rem 0 1.4rem; }
.console-page .console-scenario-lede {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}
.console-page .console-scenario-lede .lurus-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.console-page .lurus-faq-item { margin: 0.6rem 0; }
.console-page .lurus-faq-item summary {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
