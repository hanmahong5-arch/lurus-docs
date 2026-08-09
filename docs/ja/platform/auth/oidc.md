---
title: OIDC / OAuth2 連携 | Casdoor ID認証
description: 自社アプリを Lurus SSO に接続するための完全ガイド — エンドポイント、Scopes、Claims、PKCE、Device Flow。
---

<div class="auth-oidc-page">

# OIDC / OAuth2 連携 <StatusBadge status="live" />

Lurus の統一 ID 認証は [Casdoor](https://casdoor.com) をベースとし、標準的な OIDC / OAuth2 インターフェースを公開しています。アプリが標準 OIDC に対応していれば、コア認証ロジックを変更することなくそのまま Lurus SSO に接続できます。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">1</span><span class="lurus-stat__label">Discovery URL 自動検出</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">9</span><span class="lurus-stat__label">標準エンドポイント</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">5</span><span class="lurus-stat__label">Grant Type / Flow</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">S256</span><span class="lurus-stat__label">PKCE 必須方式</span></div>
</div>

## クイックスタート

ほとんどの OIDC SDK は **Discovery** に対応しており、URL を 1 つ指定するだけで、すべてのエンドポイント、アルゴリズム、機能を自動的に取得できます。

```
Discovery URL: https://identity.lurus.cn/.well-known/openid-configuration
```

SDK の初期化時に（エンドポイントをハードコードするのではなく）この URL を直接指定すれば、サーバー側で鍵がローテーションされたりエンドポイントが変更されたりしても、アプリを修正する必要はありません。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">最小構成</p>
    <div class="lurus-callout__body"><code>client_id</code> + <code>redirect_uri</code> + Discovery URL — この 3 つが揃えば認可コードフローを開始できます。</div>
  </div>
</div>

---

## 標準エンドポイント

すべてのエンドポイントは `https://identity.lurus.cn` を Base URL とします。

| エンドポイント名 | パス | HTTP メソッド | 用途 |
|----------|------|-----------|------|
| **Discovery** | `/.well-known/openid-configuration` | GET | サービスメタデータ。SDK がすべてのエンドポイントとアルゴリズムを自動的に読み取る |
| **Authorization** | `/oauth/v2/authorize` | GET / POST | 認可フローを開始し、ログインページへリダイレクト |
| **Token** | `/oauth/v2/token` | POST | `access_token` / `id_token` / `refresh_token` を取得 |
| **UserInfo** | `/oidc/v1/userinfo` | GET | access token を使って現在のユーザーの claims を読み取る |
| **JWKS** | `/oauth/v2/keys` | GET | JWK 公開鍵セットを取得し、ローカルで JWT を検証 |
| **Introspection** | `/oauth/v2/introspect` | POST | token の有効性とメタ情報を照会（サーバー側で使用） |
| **Revocation** | `/oauth/v2/revoke` | POST | access / refresh token を失効させる |
| **End Session** | `/oidc/v1/end_session` | GET / POST | ログアウト：Casdoor セッションを終了 |
| **Device Authorization** | `/oauth/v2/device_authorization` | POST | Device Code Flow の開始エンドポイント |

### Authorization エンドポイントのパラメータ

| パラメータ | 必須 | 説明 |
|------|------|------|
| `client_id` | ✓ | コンソールでアプリを作成すると取得できる |
| `redirect_uri` | ✓ | コンソールに登録した URI と完全に一致する必要がある |
| `response_type` | ✓ | 認可コードフローでは固定で `code` |
| `scope` | ✓ | 最低限 `openid` を含む。複数はスペース区切り |
| `state` | 推奨 | CSRF 対策。コールバック時に元の値を返す |
| `nonce` | 推奨 | リプレイ対策。`id_token` に書き込まれる |
| `code_challenge` | PKCE 必須 | Base64URL(SHA-256(code_verifier)) |
| `code_challenge_method` | PKCE 必須 | 固定で `S256` |
| `prompt` | 任意 | `login` で強制再ログイン；`consent` で同意ページを強制表示 |
| `login_hint` | 任意 | ユーザー名を事前入力し、ログインを高速化 |

---

## サポートする Grant Type / Flow

クライアントの種類に応じて認可フローを選択します。SPA / Native / Web では Authorization Code + PKCE を推奨します。

| Flow | 適用シーン | 推奨度 |
|------|----------|---------|
| **Authorization Code + PKCE** | SPA、Native App、Web App | ✓ 第一選択 |
| **Client Credentials** | M2M、バックエンドサービス | ✓ M2M シーン |
| **Device Code** | CLI、TV、IoT、ブラウザなしデバイス | ✓ 特殊デバイス |
| **Refresh Token** | 長期セッション、サイレント更新 | `offline_access` scope と併用 |
| **JWT Bearer（Service User）** | サービスアカウント。署名済み JWT で token を取得 | サービスアカウントのシーン |

**Authorization Code + PKCE** の 6 ステップ：

<ol class="lurus-steps">
<li>クライアントが <code>code_verifier</code> を生成（ランダムな 43〜128 文字）。</li>
<li><code>code_challenge = Base64URL(SHA-256(verifier))</code> を計算。</li>
<li><code>/oauth/v2/authorize</code> へリダイレクト（challenge 付き）。</li>
<li>ユーザーがログインして認可し、コールバックに <code>code</code> が付与される。</li>
<li>POST <code>/oauth/v2/token</code>（<code>code</code> + <code>code_verifier</code> 付き）。</li>
<li>access / id / refresh token を取得。</li>
</ol>

**Client Credentials**：POST `/oauth/v2/token` with `grant_type=client_credentials` + `client_id` + `client_secret` + `scope=openid urn:casdoor:iam:org:project:id:{projectid}:aud` → access_token を取得（id_token なし、ユーザー身元なし）。

**Refresh Token**：初回認可時に scope へ `offline_access` を含める → refresh_token を安全に保管 → access_token の失効時に POST `grant_type=refresh_token` + `refresh_token=<token>` → 新しい token を取得（refresh_token はローテーションされる場合あり）。

---

## Authorization Code + PKCE 完全な例

### TypeScript

```typescript
import { createHash, randomBytes } from "crypto";

// Step 1: 生成 PKCE pair
function generatePKCE() {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

// Step 2: 构造 Authorization URL（持久化 verifier + state 到 sessionStorage）
function buildAuthorizeURL(clientId: string, redirectUri: string): string {
  const { verifier, challenge } = generatePKCE();
  sessionStorage.setItem("pkce_verifier", verifier);
  const state = randomBytes(16).toString("base64url");
  sessionStorage.setItem("oauth_state", state);
  const params = new URLSearchParams({
    response_type: "code", client_id: clientId, redirect_uri: redirectUri,
    scope: "openid profile email offline_access", state,
    nonce: randomBytes(16).toString("base64url"),
    code_challenge: challenge, code_challenge_method: "S256",
  });
  return `https://identity.lurus.cn/oauth/v2/authorize?${params}`;
}

// Step 3: 回调处理 — 验证 state，提取 code
function handleCallback(callbackURL: string) {
  const url = new URL(callbackURL);
  const code = url.searchParams.get("code")!;
  const state = url.searchParams.get("state")!;
  if (state !== sessionStorage.getItem("oauth_state")) {
    throw new Error("State mismatch — possible CSRF attack");
  }
  return code;
}

// Step 4: 用 code 换 tokens
async function exchangeCode(code: string, clientId: string, redirectUri: string) {
  const verifier = sessionStorage.getItem("pkce_verifier")!;
  const resp = await fetch("https://identity.lurus.cn/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code", code, redirect_uri: redirectUri,
      client_id: clientId, code_verifier: verifier,
    }),
  });
  if (!resp.ok) throw new Error(`Token exchange failed: ${await resp.text()}`);
  // 获得 { access_token, id_token, refresh_token, expires_in }
  return await resp.json();
}
```

### curl

```bash
# code_challenge = Base64URL(SHA-256(code_verifier))
CODE_VERIFIER="dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
CODE_CHALLENGE=$(echo -n "$CODE_VERIFIER" | sha256sum | cut -d' ' -f1 | xxd -r -p | base64 | tr '+/' '-_' | tr -d '=')

# 引导用户访问登录 URL
echo "https://identity.lurus.cn/oauth/v2/authorize?response_type=code\
&client_id=YOUR_CLIENT_ID&redirect_uri=https://yourapp.example.com/callback\
&scope=openid%20profile%20email%20offline_access&state=random_state_value\
&code_challenge=${CODE_CHALLENGE}&code_challenge_method=S256"

# 用回调中的 code 换 tokens
curl -s -X POST https://identity.lurus.cn/oauth/v2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE_FROM_CALLBACK" \
  -d "redirect_uri=https://yourapp.example.com/callback" \
  -d "client_id=YOUR_CLIENT_ID" -d "code_verifier=${CODE_VERIFIER}" | jq .
# 响应：{ "access_token", "token_type":"Bearer", "expires_in":43199, "id_token", "refresh_token" }
```

---

## Scopes 一覧

標準 OIDC scopes は返却される claim を決定し、Casdoor 固有の scopes は audience、ロール、組織制約を制御します。

### 標準 Scopes

| Scope | 説明 | 影響する Token |
|-------|------|-------------|
| `openid` | **必須**。OIDC リクエストを宣言し、`id_token` を返す | id_token |
| `profile` | `name`、`given_name`、`family_name`、`preferred_username`、`locale` を取得 | id_token, userinfo |
| `email` | `email`、`email_verified` を取得 | id_token, userinfo |
| `phone` | `phone_number`、`phone_number_verified` を取得 | id_token, userinfo |
| `address` | ユーザーの住所情報を取得 | id_token, userinfo |
| `offline_access` | `refresh_token` を要求（Authorization Code フローでのみ有効） | — |

### Casdoor 固有 Scopes

| Scope | 説明 | 影響する Token |
|-------|------|-------------|
| `urn:casdoor:iam:org:project:id:{projectid}:aud` | 指定した project ID を access token の `aud` に追加。サーバー側の検証で一致が必須 | access_token |
| `urn:casdoor:iam:org:project:id:casdoor:aud` | Casdoor 自身の project ID を `aud` に追加（Casdoor API へのアクセス用） | access_token |
| `urn:casdoor:iam:org:projects:roles` | token に、認可されたすべてのプロジェクトのロール一覧を含める | id_token, access_token, userinfo |
| `urn:casdoor:iam:org:project:role:{rolekey}` | 特定のロール claim のみを要求（例：`...:role:admin`） | id_token, access_token |
| `urn:casdoor:iam:org:id:{orgid}` | ユーザーが当該組織に所属していることを必須とする。組織をまたぐログインを強制的に分離 | 検証用 |
| `urn:casdoor:iam:org:domain:primary:{domain}` | ユーザーが所属する組織のプライマリドメインを限定（例：`...:primary:lurus.cn`） | 検証用 |
| `urn:casdoor:iam:user:metadata` | token にユーザー独自の metadata を含める（Base64 のキー・バリュー） | id_token, access_token, userinfo |
| `urn:casdoor:iam:user:resourceowner` | ユーザーが所属する組織の ID、名前、プライマリドメインを取得 | id_token, access_token, userinfo |
| `urn:casdoor:iam:org:idp:id:{idp_id}` | 指定した IdP（企業微信、飛書）へ直接遷移し、IDP 選択ページをスキップ | 挙動制御 |

> **よく使う組み合わせ**（Web App）：`openid profile email offline_access urn:casdoor:iam:org:projects:roles urn:casdoor:iam:org:project:id:{projectid}:aud`

---

## Claims 一覧

下表は、各 claim がどの token に現れるか、およびどの scope に依存するかを示しています。

### 標準 Claims

| Claim | 説明 | id_token | access_token | userinfo | 依存する Scope |
|-------|------|:--------:|:------------:|:--------:|-----------|
| `sub` | ユーザー一意 ID（Casdoor 内部 ID） | ✓ | ✓ (JWT) | ✓ | 常時 |
| `iss` | Issuer。固定で `https://identity.lurus.cn` | ✓ | ✓ | — | 常時 |
| `aud` | Audience。アプリの client_id | ✓ | ✓ | — | 常時 |
| `exp` / `iat` | 失効 / 発行時刻（Unix） | ✓ | ✓ | — | 常時 |
| `auth_time` | ユーザーが実際にログインした時刻 | ✓ | — | — | 常時 |
| `nonce` | リプレイ対策のランダム値 | ✓ | — | — | 常時（指定時） |
| `amr` | 認証方式。例：`["pwd"]`、`["mfa"]` | ✓ | — | — | 常時 |
| `name` / `given_name` / `family_name` | フルネーム / 名 / 姓 | ✓* | — | ✓ | `profile` |
| `preferred_username` | ログイン名（`username@primarydomain`） | ✓ | — | ✓ | `profile` |
| `locale` / `updated_at` | 言語設定（例：`zh`）/ 情報の更新時刻 | ✓* | — | ✓ | `profile` |
| `email` / `email_verified` | メールアドレス / 検証済みか（Boolean） | ✓* | — | ✓ | `email` |

> `✓*` = response_type に `id_token` を含む場合、または明示的に要求した場合にのみ返却。

### Casdoor 固有 Claims

| Claim | 説明 | id_token | access_token | userinfo |
|-------|------|:--------:|:------------:|:--------:|
| `urn:casdoor:iam:org:project:roles` | ユーザーのプロジェクトロール。構造は `{ "roleName": { "orgId": "domain" } }` | ✓ | ✓ (JWT) | ✓ |
| `urn:casdoor:iam:org:domain:primary` | ユーザーが所属する組織のプライマリドメイン | ✓ | ✓ (JWT) | ✓ |
| `urn:casdoor:iam:user:metadata` | ユーザー独自の metadata。`{ "key": "base64value" }` | ✓ | ✓ (JWT) | ✓ |
| `urn:casdoor:iam:user:resourceowner:id` / `:name` / `:primary_domain` | ユーザーが所属する組織の ID / 名前 / プライマリドメイン | ✓ | ✓ (JWT) | ✓ |

**ロール claim の例**：
```json
{ "urn:casdoor:iam:org:project:roles": { "admin": { "178204173316174381": "lurus.cn" }, "viewer": { "178204173316174381": "lurus.cn" } } }
```
**Metadata claim の例**（value は Base64 で、使用時には `atob()` / `base64.StdEncoding.DecodeString()` でデコードが必要）：
```json
{ "urn:casdoor:iam:user:metadata": { "department": "ZW5naW5lZXJpbmc=", "employee_id": "VTEwMDEy" } }
```

---

## Token の検証

サーバー側で Bearer token を受け取った際、形式だけで有効性を判断しては**いけません**。必ず以下を実施してください：

```
1. 从 JWKS 拉公钥（建议缓存 TTL 1小时）: GET https://identity.lurus.cn/oauth/v2/keys
2. 用匹配 kid 的公钥验证 JWT 签名
3. 校验标准 claims：iss == "https://identity.lurus.cn"；aud 含本应用 client_id 或 project_id；
   exp > now()；nbf <= now()（如有）
4. 按需校验业务 claims（角色、组织 ID）
```

### 推奨ライブラリ

| 言語 | ライブラリ | インストール |
|------|----|------|
| TS / Node.js | [`oidc-client-ts`](https://github.com/authts/oidc-client-ts) | `bun add oidc-client-ts` |
| TS / Node.js | [`jose`](https://github.com/panva/jose)（軽量な署名検証） | `bun add jose` |
| Go | [`go-oidc`](https://github.com/coreos/go-oidc) | `go get github.com/coreos/go-oidc/v3` |
| Python | [`python-jose`](https://github.com/mpdavis/python-jose) | `pip install python-jose` |
| Elixir / Phoenix | `lurus-phoenix`（プラットフォーム内部ライブラリ） | `2l-bs-admin` を参照 |

### Go 署名検証の例

```go
package auth

import (
    "context"
    "fmt"
    "github.com/coreos/go-oidc/v3/oidc"
)

var provider *oidc.Provider

func Init(ctx context.Context) error {
    var err error
    // SDK 自动从 Discovery URL 加载配置和 JWKS
    provider, err = oidc.NewProvider(ctx, "https://identity.lurus.cn")
    return err
}

func VerifyAccessToken(ctx context.Context, rawToken, clientID string) (*oidc.IDToken, error) {
    verifier := provider.Verifier(&oidc.Config{ClientID: clientID})
    token, err := verifier.Verify(ctx, rawToken)
    if err != nil {
        return nil, fmt.Errorf("token verification failed: %w", err)
    }
    return token, nil
}
```

### Introspection（不透明な token）

access token が不透明な形式（JWT ではない）の場合は Introspection で検証します：

```bash
curl -X POST https://identity.lurus.cn/oauth/v2/introspect \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "token=ACCESS_TOKEN_TO_CHECK"
# 响应：{ "active": true, "sub": "...", "exp": 1234567890, ... } 或 { "active": false }
```

---

## Device Authorization Flow

ブラウザ入力のないデバイス（CLI、TV、IoT）に適しています。Lurus の CLI 製品（Lumen、kova-cli）はいずれもこのフローを使用します。

**シーケンス：**

<ol class="lurus-steps">
<li>デバイスが POST <code>/device_authorization</code>。</li>
<li><code>device_code</code> + <code>user_code</code> + <code>verification_uri</code> を受け取る。</li>
<li><code>user_code</code> と URL をユーザーに表示。</li>
<li>ユーザーがブラウザで <code>verification_uri</code> を開き、<code>user_code</code> を入力し、ログインして認可。</li>
<li>デバイスが <code>interval</code> 秒ごとに <code>/token</code> をポーリング。</li>
<li>ユーザーの認可後、次回のポーリングで access / id token が返る。</li>
</ol>

### Step 1: Device Code を要求

```bash
curl -s -X POST https://identity.lurus.cn/oauth/v2/device_authorization \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" -d "scope=openid profile email"
```
レスポンス：
```json
{
  "device_code": "Ag_EE...zo9OA",
  "user_code": "GQWC-FWFK",
  "verification_uri": "https://identity.lurus.cn/device",
  "verification_uri_complete": "https://identity.lurus.cn/device?user_code=GQWC-FWFK",
  "expires_in": 300,
  "interval": 5
}
```

### Step 2: ユーザーに表示

`verification_uri`（`https://identity.lurus.cn/device`）+ `user_code` を表示するか、`verification_uri_complete` を QR コードで読み取らせます。タイムアウトは 5 分。

### Step 3: Token エンドポイントをポーリング

`interval` 秒ごとに、成功またはタイムアウトまでポーリングします。エラー処理：`authorization_pending` → 待機を継続；`slow_down` → 頻度を落とす；その他 → 失敗として終了。

```bash
while true; do
  RESPONSE=$(curl -s -X POST https://identity.lurus.cn/oauth/v2/token \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=urn:ietf:params:oauth:grant-type:device_code" \
    -d "device_code=Ag_EE...zo9OA" -d "client_id=YOUR_CLIENT_ID")
  ERROR=$(echo "$RESPONSE" | jq -r '.error // empty')
  if [ -z "$ERROR" ]; then echo "授权成功！"; echo "$RESPONSE" | jq .; break
  elif [ "$ERROR" = "authorization_pending" ]; then sleep 5
  elif [ "$ERROR" = "slow_down" ]; then sleep 10
  else echo "授权失败：$ERROR"; break; fi
done
```

TypeScript での実装も同様です：`fetch` で POST `/device_authorization` してフローを開始し、続いて `setTimeout(interval*1000)` で `/token` をポーリングし、`authorization_pending` なら継続、`slow_down` なら interval を大きくし、`resp.ok` なら tokens を返します。

---

## よくある質問

最もよくある接続エラーと、一発で直す方法。

<details class="lurus-faq-item">
<summary>audience エラー（<code>aud</code> claim が一致しない）</summary>

**症状**：署名検証で `token audience mismatch` / `invalid audience` が出る。**原因**：access token の `aud` はデフォルトで `client_id` しか含まない。**解決**：scope に `urn:casdoor:iam:org:project:id:{projectid}:aud` を追加し、project ID を明示的に `aud` へ書き込む。

</details>

<details class="lurus-faq-item">
<summary><code>roles</code> claim が空または欠落</summary>

**原因**：ユーザーが当該 Project の User Grant を持っていない、またはロール scope を要求していない。**確認**：① コンソールの Project → Authorizations でロール Grant があることを確認 ② scope に `urn:casdoor:iam:org:projects:roles` を含む ③ Project 設定で「Assert Roles on Authentication」を有効化。

</details>

<details class="lurus-faq-item">
<summary><code>id_token</code> に <code>email</code> が含まれない</summary>

**原因**：scope で `email` が抜けている。**解決**：scope に `email` を追加（例：`openid profile email`）。

</details>

<details class="lurus-faq-item">
<summary>Refresh token が失効し再ログインが必要</summary>

更新時に `invalid_grant` が返る。考えられる原因：初回認可の scope に `offline_access` が含まれていない；refresh token の期限切れ；ユーザーがコンソールでセッションを失効させた。**解決**：Authorization Code フローを再度開始する；長期の更新が必要な場合は scope に `offline_access` を含め、アプリ種別を「Web」または「Native」にする。

</details>

<details class="lurus-faq-item">
<summary>PKCE <code>code_verifier</code> が一致しない</summary>

`/token` が `invalid_grant: code verifier mismatch` を返す。**原因**：verifier が 2 つのステップの間で変化した、または Base64URL エンコードが一致しない（`=` padding を含む、または `+/` を使用）。**解決**：`base64url`（padding なし、`-_` で `+/` を置換）を使う；SPA ではページ間で verifier を保持するために `sessionStorage` を使う。

</details>

---

<NextSteps
  :steps="[
    { text: 'API 認証（マシン対マシン）', link: '/ja/platform/auth/api-auth', primary: true },
    { text: 'ID 認証の概要と接続ポイント', link: '/ja/platform/auth/' },
    { text: '認証コンソール', link: 'https://identity.lurus.cn', external: true },
  ]"
  title="次のステップ"
/>

<RelatedProducts product-id="auth" />

## 関連リンク

- Casdoor 公式：[Endpoints](https://casdoor.com/docs/apis/openidoauth/endpoints) · [Scopes](https://casdoor.com/docs/apis/openidoauth/scopes) · [Claims](https://casdoor.com/docs/apis/openidoauth/claims)
- [RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636) · [RFC 8628 — Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628)
- Auth コンソール [identity.lurus.cn](https://identity.lurus.cn) · Discovery [/.well-known/openid-configuration](https://identity.lurus.cn/.well-known/openid-configuration)

</div>

<style scoped>
.auth-oidc-page .lurus-stat-strip { margin: 1.5rem 0 0.5rem; }
</style>
