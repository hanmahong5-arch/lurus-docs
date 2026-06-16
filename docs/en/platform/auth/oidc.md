---
title: OIDC / OAuth2 Integration | Zitadel Identity Authentication
description: Complete guide to connecting your own application to Lurus SSO — endpoints, scopes, claims, PKCE, Device Flow.
---

<div class="auth-oidc-page">

# OIDC / OAuth2 Integration <StatusBadge status="live" />

Lurus unified identity authentication is built on [Zitadel](https://zitadel.com) and exposes standard OIDC / OAuth2 interfaces. Any application that supports standard OIDC can connect to Lurus SSO directly, with no changes to its core authentication logic.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">1</span><span class="lurus-stat__label">Discovery URL auto-discovery</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">9</span><span class="lurus-stat__label">Standard endpoints</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">5</span><span class="lurus-stat__label">Grant Type / Flow</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">S256</span><span class="lurus-stat__label">Enforced PKCE method</span></div>
</div>

## Quick Start

Most OIDC SDKs support **Discovery**, so a single URL is enough to automatically obtain all endpoints, algorithms, and capabilities.

```
Discovery URL: https://auth.lurus.cn/.well-known/openid-configuration
```

Point the SDK directly at this URL during initialization (instead of hardcoding endpoints), so the application needs no changes when server keys are rotated or endpoints change.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Minimum configuration</p>
    <div class="lurus-callout__body"><code>client_id</code> + <code>redirect_uri</code> + Discovery URL — with these three in place you can start the Authorization Code flow.</div>
  </div>
</div>

---

## Standard Endpoints

All endpoints use `https://auth.lurus.cn` as the Base URL.

| Endpoint | Path | HTTP Method | Purpose |
|----------|------|-----------|------|
| **Discovery** | `/.well-known/openid-configuration` | GET | Service metadata; the SDK automatically reads all endpoints and algorithms |
| **Authorization** | `/oauth/v2/authorize` | GET / POST | Start the authorization flow, redirect to the login page |
| **Token** | `/oauth/v2/token` | POST | Exchange for `access_token` / `id_token` / `refresh_token` |
| **UserInfo** | `/oidc/v1/userinfo` | GET | Read the current user's claims with the access token |
| **JWKS** | `/oauth/v2/keys` | GET | Fetch the JWK public key set to verify JWT signatures locally |
| **Introspection** | `/oauth/v2/introspect` | POST | Query token validity and metadata (server-side use) |
| **Revocation** | `/oauth/v2/revoke` | POST | Revoke an access / refresh token |
| **End Session** | `/oidc/v1/end_session` | GET / POST | Logout: terminate the Zitadel session |
| **Device Authorization** | `/oauth/v2/device_authorization` | POST | Starting endpoint for the Device Code Flow |

### Authorization Endpoint Parameters

| Parameter | Required | Description |
|------|------|------|
| `client_id` | ✓ | Obtained after creating an application in the console |
| `redirect_uri` | ✓ | Must exactly match the URI registered in the console |
| `response_type` | ✓ | Fixed as `code` for the Authorization Code flow |
| `scope` | ✓ | Must contain at least `openid`; multiple values are space-separated |
| `state` | Recommended | Prevents CSRF; returned unchanged in the callback |
| `nonce` | Recommended | Prevents replay; written into the `id_token` |
| `code_challenge` | Required for PKCE | Base64URL(SHA-256(code_verifier)) |
| `code_challenge_method` | Required for PKCE | Fixed as `S256` |
| `prompt` | Optional | `login` forces re-login; `consent` forces the consent page to be shown |
| `login_hint` | Optional | Pre-fill the username to speed up login |

---

## Supported Grant Types / Flows

Choose the authorization flow based on the client type; SPA / Native / Web should prefer Authorization Code + PKCE.

| Flow | Use Case | Recommended |
|------|----------|---------|
| **Authorization Code + PKCE** | SPA, Native App, Web App | ✓ Preferred |
| **Client Credentials** | M2M, backend services | ✓ M2M scenarios |
| **Device Code** | CLI, TV, IoT, browserless devices | ✓ Special devices |
| **Refresh Token** | Long-lived sessions, silent renewal | Use with the `offline_access` scope |
| **JWT Bearer (Service User)** | Service accounts, exchange a signed JWT for a token | Service account scenarios |

**Authorization Code + PKCE** in six steps:

<ol class="lurus-steps">
<li>The client generates a <code>code_verifier</code> (random 43–128 characters).</li>
<li>Compute <code>code_challenge = Base64URL(SHA-256(verifier))</code>.</li>
<li>Redirect to <code>/oauth/v2/authorize</code> (with the challenge).</li>
<li>The user logs in and authorizes; the callback carries the <code>code</code>.</li>
<li>POST <code>/oauth/v2/token</code> (with <code>code</code> + <code>code_verifier</code>).</li>
<li>Receive the access / id / refresh token.</li>
</ol>

**Client Credentials**: POST `/oauth/v2/token` with `grant_type=client_credentials` + `client_id` + `client_secret` + `scope=openid urn:zitadel:iam:org:project:id:{projectid}:aud` → obtain an access_token (no id_token, no user identity).

**Refresh Token**: include `offline_access` in the initial authorization scope → store the refresh_token securely → when the access_token expires, POST `grant_type=refresh_token` + `refresh_token=<token>` → obtain new tokens (the refresh_token may rotate).

---

## Complete Authorization Code + PKCE Example

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
  return `https://auth.lurus.cn/oauth/v2/authorize?${params}`;
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
  const resp = await fetch("https://auth.lurus.cn/oauth/v2/token", {
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
echo "https://auth.lurus.cn/oauth/v2/authorize?response_type=code\
&client_id=YOUR_CLIENT_ID&redirect_uri=https://yourapp.example.com/callback\
&scope=openid%20profile%20email%20offline_access&state=random_state_value\
&code_challenge=${CODE_CHALLENGE}&code_challenge_method=S256"

# 用回调中的 code 换 tokens
curl -s -X POST https://auth.lurus.cn/oauth/v2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE_FROM_CALLBACK" \
  -d "redirect_uri=https://yourapp.example.com/callback" \
  -d "client_id=YOUR_CLIENT_ID" -d "code_verifier=${CODE_VERIFIER}" | jq .
# 响应：{ "access_token", "token_type":"Bearer", "expires_in":43199, "id_token", "refresh_token" }
```

---

## Scopes Reference

Standard OIDC scopes determine which claims are returned; Zitadel-specific scopes control audience, roles, and organization constraints.

### Standard Scopes

| Scope | Description | Affected Token |
|-------|------|-------------|
| `openid` | **Required**, declares an OIDC request, returns the `id_token` | id_token |
| `profile` | Get `name`, `given_name`, `family_name`, `preferred_username`, `locale` | id_token, userinfo |
| `email` | Get `email`, `email_verified` | id_token, userinfo |
| `phone` | Get `phone_number`, `phone_number_verified` | id_token, userinfo |
| `address` | Get the user's address information | id_token, userinfo |
| `offline_access` | Request a `refresh_token` (only valid in the Authorization Code flow) | — |

### Zitadel-Specific Scopes

| Scope | Description | Affected Token |
|-------|------|-------------|
| `urn:zitadel:iam:org:project:id:{projectid}:aud` | Add the specified project ID to the access token's `aud`; server-side verification must match | access_token |
| `urn:zitadel:iam:org:project:id:zitadel:aud` | Add Zitadel's own project ID to `aud` (used to access the Zitadel API) | access_token |
| `urn:zitadel:iam:org:projects:roles` | Include the role list of all authorized projects in the token | id_token, access_token, userinfo |
| `urn:zitadel:iam:org:project:role:{rolekey}` | Request only a specific role claim, e.g. `...:role:admin` | id_token, access_token |
| `urn:zitadel:iam:org:id:{orgid}` | Restrict the user to the given organization; enforce isolation for cross-org login | Validation only |
| `urn:zitadel:iam:org:domain:primary:{domain}` | Restrict the user to the primary domain of their organization, e.g. `...:primary:lurus.cn` | Validation only |
| `urn:zitadel:iam:user:metadata` | Include the user's custom metadata in the token (Base64 key-value pairs) | id_token, access_token, userinfo |
| `urn:zitadel:iam:user:resourceowner` | Get the ID, name, and primary domain of the user's organization | id_token, access_token, userinfo |
| `urn:zitadel:iam:org:idp:id:{idp_id}` | Jump directly to the specified IdP (WeCom, Feishu), skipping the IdP selection page | Behavior control |

> **Common combination** (Web App): `openid profile email offline_access urn:zitadel:iam:org:projects:roles urn:zitadel:iam:org:project:id:{projectid}:aud`

---

## Claims Reference

The table below indicates which token each claim appears in, and which scope it depends on.

### Standard Claims

| Claim | Description | id_token | access_token | userinfo | Required Scope |
|-------|------|:--------:|:------------:|:--------:|-----------|
| `sub` | Unique user ID (Zitadel internal ID) | ✓ | ✓ (JWT) | ✓ | Always |
| `iss` | Issuer, fixed as `https://auth.lurus.cn` | ✓ | ✓ | — | Always |
| `aud` | Audience, the application's client_id | ✓ | ✓ | — | Always |
| `exp` / `iat` | Expiry / issued-at time (Unix) | ✓ | ✓ | — | Always |
| `auth_time` | The user's actual login time | ✓ | — | — | Always |
| `nonce` | Anti-replay random value | ✓ | — | — | Always (if present) |
| `amr` | Authentication method, e.g. `["pwd"]`, `["mfa"]` | ✓ | — | — | Always |
| `name` / `given_name` / `family_name` | Full name / given name / family name | ✓* | — | ✓ | `profile` |
| `preferred_username` | Login name (`username@primarydomain`) | ✓ | — | ✓ | `profile` |
| `locale` / `updated_at` | Language preference (e.g. `zh`) / information update time | ✓* | — | ✓ | `profile` |
| `email` / `email_verified` | Email / whether verified (Boolean) | ✓* | — | ✓ | `email` |

> `✓*` = returned only when the response_type includes `id_token` or when explicitly requested.

### Zitadel-Specific Claims

| Claim | Description | id_token | access_token | userinfo |
|-------|------|:--------:|:------------:|:--------:|
| `urn:zitadel:iam:org:project:roles` | The user's project roles, structured as `{ "roleName": { "orgId": "domain" } }` | ✓ | ✓ (JWT) | ✓ |
| `urn:zitadel:iam:org:domain:primary` | The primary domain of the user's organization | ✓ | ✓ (JWT) | ✓ |
| `urn:zitadel:iam:user:metadata` | The user's custom metadata, `{ "key": "base64value" }` | ✓ | ✓ (JWT) | ✓ |
| `urn:zitadel:iam:user:resourceowner:id` / `:name` / `:primary_domain` | The ID / name / primary domain of the user's organization | ✓ | ✓ (JWT) | ✓ |

**Role claim example**:
```json
{ "urn:zitadel:iam:org:project:roles": { "admin": { "178204173316174381": "lurus.cn" }, "viewer": { "178204173316174381": "lurus.cn" } } }
```
**Metadata claim example** (the value is Base64; decode with `atob()` / `base64.StdEncoding.DecodeString()` before use):
```json
{ "urn:zitadel:iam:user:metadata": { "department": "ZW5naW5lZXJpbmc=", "employee_id": "VTEwMDEy" } }
```

---

## Token Verification

After receiving a Bearer token, the server **must not** judge validity by format alone; it must:

```
1. 从 JWKS 拉公钥（建议缓存 TTL 1小时）: GET https://auth.lurus.cn/oauth/v2/keys
2. 用匹配 kid 的公钥验证 JWT 签名
3. 校验标准 claims：iss == "https://auth.lurus.cn"；aud 含本应用 client_id 或 project_id；
   exp > now()；nbf <= now()（如有）
4. 按需校验业务 claims（角色、组织 ID）
```

### Recommended Libraries

| Language | Library | Install |
|------|----|------|
| TS / Node.js | [`oidc-client-ts`](https://github.com/authts/oidc-client-ts) | `bun add oidc-client-ts` |
| TS / Node.js | [`jose`](https://github.com/panva/jose) (lightweight verification) | `bun add jose` |
| Go | [`go-oidc`](https://github.com/coreos/go-oidc) | `go get github.com/coreos/go-oidc/v3` |
| Python | [`python-jose`](https://github.com/mpdavis/python-jose) | `pip install python-jose` |
| Elixir / Phoenix | `lurus-phoenix` (platform internal library) | See `2l-bs-admin` |

### Go Verification Example

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
    provider, err = oidc.NewProvider(ctx, "https://auth.lurus.cn")
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

### Introspection (opaque tokens)

When the access token is in an opaque format (not a JWT), use Introspection to verify it:

```bash
curl -X POST https://auth.lurus.cn/oauth/v2/introspect \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "token=ACCESS_TOKEN_TO_CHECK"
# 响应：{ "active": true, "sub": "...", "exp": 1234567890, ... } 或 { "active": false }
```

---

## Device Authorization Flow

For devices without browser input (CLI, TV, IoT). Lurus CLI products (Lumen, kova-cli) all use this flow.

**Sequence:**

<ol class="lurus-steps">
<li>The device POSTs to <code>/device_authorization</code>.</li>
<li>It receives a <code>device_code</code> + <code>user_code</code> + <code>verification_uri</code>.</li>
<li>Display the <code>user_code</code> and URL to the user.</li>
<li>The user opens <code>verification_uri</code> in a browser, enters the <code>user_code</code>, logs in, and authorizes.</li>
<li>The device polls <code>/token</code> every <code>interval</code> seconds.</li>
<li>After the user authorizes, the next poll returns the access / id token.</li>
</ol>

### Step 1: Request a Device Code

```bash
curl -s -X POST https://auth.lurus.cn/oauth/v2/device_authorization \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" -d "scope=openid profile email"
```
Response:
```json
{
  "device_code": "Ag_EE...zo9OA",
  "user_code": "GQWC-FWFK",
  "verification_uri": "https://auth.lurus.cn/device",
  "verification_uri_complete": "https://auth.lurus.cn/device?user_code=GQWC-FWFK",
  "expires_in": 300,
  "interval": 5
}
```

### Step 2: Show to the User

Display the `verification_uri` (`https://auth.lurus.cn/device`) + `user_code`, or scan the QR code for `verification_uri_complete`. Times out after 5 minutes.

### Step 3: Poll the Token Endpoint

Poll every `interval` seconds until success or timeout. Error handling: `authorization_pending` → keep waiting; `slow_down` → slow down the rate; otherwise → fail and exit.

```bash
while true; do
  RESPONSE=$(curl -s -X POST https://auth.lurus.cn/oauth/v2/token \
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

A TypeScript implementation is isomorphic: `fetch` POST `/device_authorization` to start the flow, then poll `/token` with `setTimeout(interval*1000)` — on `authorization_pending` continue, on `slow_down` increase the interval, and on `resp.ok` return the tokens.

---

## FAQ

The most common integration errors and one-shot fixes.

<details class="lurus-faq-item">
<summary>audience error (<code>aud</code> claim mismatch)</summary>

**Symptom**: verification reports `token audience mismatch` / `invalid audience`. **Cause**: the access token's `aud` contains only `client_id` by default. **Fix**: add `urn:zitadel:iam:org:project:id:{projectid}:aud` to the scope to explicitly write the project ID into `aud`.

</details>

<details class="lurus-faq-item">
<summary><code>roles</code> claim is empty or missing</summary>

**Cause**: the user has no User Grant in that Project, or the role scope was not requested. **Checks**: ① In the console, go to Project → Authorizations and confirm a role Grant exists. ② Include `urn:zitadel:iam:org:projects:roles` in the scope. ③ Enable "Assert Roles on Authentication" in the Project settings.

</details>

<details class="lurus-faq-item">
<summary>no <code>email</code> in the <code>id_token</code></summary>

**Cause**: the `email` scope is missing. **Fix**: add `email` to the scope (e.g. `openid profile email`).

</details>

<details class="lurus-faq-item">
<summary>Refresh token is invalid and re-login is required</summary>

Renewal returns `invalid_grant`. Possible causes: the initial authorization scope did not include `offline_access`; the refresh token expired; the user revoked the session in the console. **Fix**: restart the Authorization Code flow; for long-term renewal, ensure the scope includes `offline_access` and the application type is "Web" or "Native".

</details>

<details class="lurus-faq-item">
<summary>PKCE <code>code_verifier</code> mismatch</summary>

`/token` returns `invalid_grant: code verifier mismatch`. **Cause**: the verifier changed between the two steps, or the Base64URL encoding is inconsistent (includes `=` padding or used `+/`). **Fix**: use `base64url` (no padding, `-_` instead of `+/`); in an SPA, use `sessionStorage` to keep the verifier across pages.

</details>

---

<NextSteps
  :steps="[
    { text: 'API Authentication (Machine-to-Machine)', link: '/en/platform/auth/api-auth', primary: true },
    { text: 'Identity Authentication Overview and Integration Points', link: '/en/platform/auth/' },
    { text: 'Authentication Console', link: 'https://auth.lurus.cn', external: true },
  ]"
  title="Next Steps"
/>

<RelatedProducts product-id="auth" />

## Related Links

- Zitadel official: [Endpoints](https://zitadel.com/docs/apis/openidoauth/endpoints) · [Scopes](https://zitadel.com/docs/apis/openidoauth/scopes) · [Claims](https://zitadel.com/docs/apis/openidoauth/claims)
- [RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636) · [RFC 8628 — Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628)
- Auth console [auth.lurus.cn](https://auth.lurus.cn) · Discovery [/.well-known/openid-configuration](https://auth.lurus.cn/.well-known/openid-configuration)

</div>

<style scoped>
.auth-oidc-page .lurus-stat-strip { margin: 1.5rem 0 0.5rem; }
</style>
