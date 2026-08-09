---
title: OIDC / OAuth2 통합 | Casdoor 신원 인증
description: 자체 애플리케이션을 Lurus SSO에 연동하기 위한 완전 가이드 — 엔드포인트, Scopes, Claims, PKCE, Device Flow.
---

<div class="auth-oidc-page">

# OIDC / OAuth2 통합 <StatusBadge status="live" />

Lurus 통합 신원 인증은 [Casdoor](https://casdoor.com) 기반이며, 표준 OIDC / OAuth2 인터페이스를 외부에 노출합니다. 애플리케이션이 표준 OIDC를 지원하면 핵심 인증 로직을 수정하지 않고도 Lurus SSO에 바로 연동할 수 있습니다.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">1</span><span class="lurus-stat__label">Discovery URL 자동 발견</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">9</span><span class="lurus-stat__label">표준 엔드포인트</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">5</span><span class="lurus-stat__label">Grant Type / Flow</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">S256</span><span class="lurus-stat__label">PKCE 강제 방식</span></div>
</div>

## 빠른 시작

대다수의 OIDC SDK는 **Discovery**를 지원하므로, URL 하나만으로 모든 엔드포인트, 알고리즘, 기능을 자동으로 가져올 수 있습니다.

```
Discovery URL: https://identity.lurus.cn/.well-known/openid-configuration
```

SDK를 초기화할 때 엔드포인트를 하드코딩하는 대신 이 URL을 직접 가리키면, 서버 측 키 회전이나 엔드포인트 변경 시에도 애플리케이션을 수정할 필요가 없습니다.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">최소 구성</p>
    <div class="lurus-callout__body"><code>client_id</code> + <code>redirect_uri</code> + Discovery URL — 이 세 가지만 갖추면 인가 코드 플로우를 시작할 수 있습니다.</div>
  </div>
</div>

---

## 표준 엔드포인트

모든 엔드포인트는 `https://identity.lurus.cn`을 Base URL로 사용합니다.

| 엔드포인트 이름 | 경로 | HTTP 메서드 | 용도 |
|----------|------|-----------|------|
| **Discovery** | `/.well-known/openid-configuration` | GET | 서비스 메타데이터, SDK가 모든 엔드포인트와 알고리즘을 자동으로 읽음 |
| **Authorization** | `/oauth/v2/authorize` | GET / POST | 인가 플로우 시작, 로그인 페이지로 리다이렉트 |
| **Token** | `/oauth/v2/token` | POST | `access_token` / `id_token` / `refresh_token` 교환 |
| **UserInfo** | `/oidc/v1/userinfo` | GET | access token으로 현재 사용자 claims 조회 |
| **JWKS** | `/oauth/v2/keys` | GET | JWK 공개 키 집합을 가져와 JWT를 로컬에서 검증 |
| **Introspection** | `/oauth/v2/introspect` | POST | token 유효성과 메타 정보 조회(서버 측에서 사용) |
| **Revocation** | `/oauth/v2/revoke` | POST | access / refresh token 취소 |
| **End Session** | `/oidc/v1/end_session` | GET / POST | 로그아웃: Casdoor 세션 종료 |
| **Device Authorization** | `/oauth/v2/device_authorization` | POST | Device Code Flow 시작 엔드포인트 |

### Authorization 엔드포인트 파라미터

| 파라미터 | 필수 | 설명 |
|------|------|------|
| `client_id` | ✓ | 콘솔에서 애플리케이션 생성 후 획득 |
| `redirect_uri` | ✓ | 콘솔에 등록한 URI와 완전히 일치해야 함 |
| `response_type` | ✓ | 인가 코드 플로우에서는 고정값 `code` |
| `scope` | ✓ | 최소 `openid` 포함, 여러 개는 공백으로 구분 |
| `state` | 권장 | CSRF 방지, 콜백 시 원래 값 그대로 반환 |
| `nonce` | 권장 | 재전송 방지, `id_token`에 기록 |
| `code_challenge` | PKCE 필수 | Base64URL(SHA-256(code_verifier)) |
| `code_challenge_method` | PKCE 필수 | 고정값 `S256` |
| `prompt` | 선택 | `login` 강제 재로그인; `consent` 동의 페이지 강제 표시 |
| `login_hint` | 선택 | 사용자 이름 미리 채우기, 로그인 가속 |

---

## 지원하는 Grant Type / Flow

클라이언트 유형에 따라 인가 플로우를 선택합니다. SPA / Native / Web은 Authorization Code + PKCE를 우선 선택합니다.

| Flow | 적용 시나리오 | 권장 여부 |
|------|----------|---------|
| **Authorization Code + PKCE** | SPA, Native App, Web App | ✓ 우선 선택 |
| **Client Credentials** | M2M, 백엔드 서비스 | ✓ M2M 시나리오 |
| **Device Code** | CLI, TV, IoT, 브라우저 없는 기기 | ✓ 특수 기기 |
| **Refresh Token** | 장기 세션, 무음 갱신 | `offline_access` scope와 함께 사용 |
| **JWT Bearer(Service User)** | 서비스 계정, 서명된 JWT로 token 교환 | 서비스 계정 시나리오 |

**Authorization Code + PKCE** 6단계:

<ol class="lurus-steps">
<li>클라이언트가 <code>code_verifier</code>(랜덤 43-128자)를 생성합니다.</li>
<li><code>code_challenge = Base64URL(SHA-256(verifier))</code>를 계산합니다.</li>
<li><code>/oauth/v2/authorize</code>로 리다이렉트합니다(challenge 포함).</li>
<li>사용자가 로그인하여 인가하면 콜백에 <code>code</code>가 포함됩니다.</li>
<li><code>/oauth/v2/token</code>에 POST합니다(<code>code</code> + <code>code_verifier</code> 포함).</li>
<li>access / id / refresh token을 획득합니다.</li>
</ol>

**Client Credentials**: POST `/oauth/v2/token` with `grant_type=client_credentials` + `client_id` + `client_secret` + `scope=openid urn:casdoor:iam:org:project:id:{projectid}:aud` → access_token 획득(id_token 없음, 사용자 신원 없음).

**Refresh Token**: 최초 인가 scope에 `offline_access` 포함 → refresh_token을 안전하게 저장 → access_token 만료 시 POST `grant_type=refresh_token` + `refresh_token=<token>` → 새 token 획득(refresh_token이 회전될 수 있음).

---

## Authorization Code + PKCE 전체 예제

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

## Scopes 목록

표준 OIDC scopes는 어떤 claim이 반환될지 결정하며, Casdoor 고유 scopes는 audience, 역할, 조직 제약을 제어합니다.

### 표준 Scopes

| Scope | 설명 | 영향받는 Token |
|-------|------|-------------|
| `openid` | **필수**, OIDC 요청을 선언하고 `id_token`을 반환 | id_token |
| `profile` | `name`, `given_name`, `family_name`, `preferred_username`, `locale` 획득 | id_token, userinfo |
| `email` | `email`, `email_verified` 획득 | id_token, userinfo |
| `phone` | `phone_number`, `phone_number_verified` 획득 | id_token, userinfo |
| `address` | 사용자 주소 정보 획득 | id_token, userinfo |
| `offline_access` | `refresh_token` 요청(Authorization Code 플로우에서만 유효) | — |

### Casdoor 고유 Scopes

| Scope | 설명 | 영향받는 Token |
|-------|------|-------------|
| `urn:casdoor:iam:org:project:id:{projectid}:aud` | 지정한 project ID를 access token의 `aud`에 추가; 서버 측 검증 시 반드시 일치해야 함 | access_token |
| `urn:casdoor:iam:org:project:id:casdoor:aud` | Casdoor 자체 project ID를 `aud`에 추가(Casdoor API 접근용) | access_token |
| `urn:casdoor:iam:org:projects:roles` | token에 인가된 모든 프로젝트의 역할 목록을 포함 | id_token, access_token, userinfo |
| `urn:casdoor:iam:org:project:role:{rolekey}` | 특정 역할 claim만 요청, 예: `...:role:admin` | id_token, access_token |
| `urn:casdoor:iam:org:id:{orgid}` | 사용자가 해당 조직에 속하도록 제한; 조직 간 로그인 강제 격리 | 검증용 |
| `urn:casdoor:iam:org:domain:primary:{domain}` | 사용자가 속한 조직의 기본 도메인 제한, 예: `...:primary:lurus.cn` | 검증용 |
| `urn:casdoor:iam:user:metadata` | token에 사용자 정의 metadata 포함(Base64 키-값 쌍) | id_token, access_token, userinfo |
| `urn:casdoor:iam:user:resourceowner` | 사용자가 속한 조직의 ID, 이름, 기본 도메인 획득 | id_token, access_token, userinfo |
| `urn:casdoor:iam:org:idp:id:{idp_id}` | 지정한 IdP(WeCom, Feishu)로 바로 이동, IDP 선택 페이지 건너뜀 | 동작 제어 |

> **자주 쓰는 조합**(Web App): `openid profile email offline_access urn:casdoor:iam:org:projects:roles urn:casdoor:iam:org:project:id:{projectid}:aud`

---

## Claims 목록

아래 표는 각 claim이 어떤 token에 나타나는지, 그리고 어떤 scope에 의존하는지 표시합니다.

### 표준 Claims

| Claim | 설명 | id_token | access_token | userinfo | 의존 Scope |
|-------|------|:--------:|:------------:|:--------:|-----------|
| `sub` | 사용자 고유 ID(Casdoor 내부 ID) | ✓ | ✓ (JWT) | ✓ | 항상 |
| `iss` | Issuer, 고정값 `https://identity.lurus.cn` | ✓ | ✓ | — | 항상 |
| `aud` | Audience, 애플리케이션 client_id | ✓ | ✓ | — | 항상 |
| `exp` / `iat` | 만료 / 발급 시간(Unix) | ✓ | ✓ | — | 항상 |
| `auth_time` | 사용자 실제 로그인 시간 | ✓ | — | — | 항상 |
| `nonce` | 재전송 방지 랜덤 값 | ✓ | — | — | 항상(있는 경우) |
| `amr` | 인증 방식, 예: `["pwd"]`, `["mfa"]` | ✓ | — | — | 항상 |
| `name` / `given_name` / `family_name` | 전체 이름 / 이름 / 성 | ✓* | — | ✓ | `profile` |
| `preferred_username` | 로그인 이름(`username@primarydomain`) | ✓ | — | ✓ | `profile` |
| `locale` / `updated_at` | 언어 설정(예: `zh`) / 정보 갱신 시간 | ✓* | — | ✓ | `profile` |
| `email` / `email_verified` | 이메일 / 검증 여부(Boolean) | ✓* | — | ✓ | `email` |

> `✓*` = response_type에 `id_token`이 포함되거나 명시적으로 요청한 경우에만 반환.

### Casdoor 고유 Claims

| Claim | 설명 | id_token | access_token | userinfo |
|-------|------|:--------:|:------------:|:--------:|
| `urn:casdoor:iam:org:project:roles` | 사용자 프로젝트 역할, 구조 `{ "roleName": { "orgId": "domain" } }` | ✓ | ✓ (JWT) | ✓ |
| `urn:casdoor:iam:org:domain:primary` | 사용자가 속한 조직의 기본 도메인 | ✓ | ✓ (JWT) | ✓ |
| `urn:casdoor:iam:user:metadata` | 사용자 정의 metadata, `{ "key": "base64value" }` | ✓ | ✓ (JWT) | ✓ |
| `urn:casdoor:iam:user:resourceowner:id` / `:name` / `:primary_domain` | 사용자가 속한 조직 ID / 이름 / 기본 도메인 | ✓ | ✓ (JWT) | ✓ |

**역할 claim 예시**:
```json
{ "urn:casdoor:iam:org:project:roles": { "admin": { "178204173316174381": "lurus.cn" }, "viewer": { "178204173316174381": "lurus.cn" } } }
```
**Metadata claim 예시**(value는 Base64이며 사용 시 `atob()` / `base64.StdEncoding.DecodeString()`으로 디코딩 필요):
```json
{ "urn:casdoor:iam:user:metadata": { "department": "ZW5naW5lZXJpbmc=", "employee_id": "VTEwMDEy" } }
```

---

## Token 검증

서버는 Bearer token을 받은 후 형식만으로 유효성을 판단해서는 **안 되며**, 반드시 다음을 수행해야 합니다:

```
1. 从 JWKS 拉公钥（建议缓存 TTL 1小时）: GET https://identity.lurus.cn/oauth/v2/keys
2. 用匹配 kid 的公钥验证 JWT 签名
3. 校验标准 claims：iss == "https://identity.lurus.cn"；aud 含本应用 client_id 或 project_id；
   exp > now()；nbf <= now()（如有）
4. 按需校验业务 claims（角色、组织 ID）
```

### 권장 라이브러리

| 언어 | 라이브러리 | 설치 |
|------|----|------|
| TS / Node.js | [`oidc-client-ts`](https://github.com/authts/oidc-client-ts) | `bun add oidc-client-ts` |
| TS / Node.js | [`jose`](https://github.com/panva/jose)(경량 검증) | `bun add jose` |
| Go | [`go-oidc`](https://github.com/coreos/go-oidc) | `go get github.com/coreos/go-oidc/v3` |
| Python | [`python-jose`](https://github.com/mpdavis/python-jose) | `pip install python-jose` |
| Elixir / Phoenix | `lurus-phoenix`(플랫폼 내부 라이브러리) | `2l-bs-admin` 참조 |

### Go 검증 예제

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

### Introspection(불투명 token)

access token이 불투명 형식(JWT가 아님)인 경우 Introspection으로 검증합니다:

```bash
curl -X POST https://identity.lurus.cn/oauth/v2/introspect \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "token=ACCESS_TOKEN_TO_CHECK"
# 响应：{ "active": true, "sub": "...", "exp": 1234567890, ... } 或 { "active": false }
```

---

## Device Authorization Flow

브라우저 입력이 없는 기기(CLI, TV, IoT)에 적합합니다. Lurus CLI 제품(Lumen, kova-cli)은 모두 이 플로우를 사용합니다.

**시퀀스:**

<ol class="lurus-steps">
<li>기기가 <code>/device_authorization</code>에 POST합니다.</li>
<li><code>device_code</code> + <code>user_code</code> + <code>verification_uri</code>를 수신합니다.</li>
<li><code>user_code</code>와 URL을 사용자에게 표시합니다.</li>
<li>사용자가 브라우저에서 <code>verification_uri</code>를 열고 <code>user_code</code>를 입력하여 로그인 및 인가합니다.</li>
<li>기기는 <code>interval</code>초마다 <code>/token</code>을 폴링합니다.</li>
<li>사용자가 인가한 후 다음 폴링에서 access / id token이 반환됩니다.</li>
</ol>

### Step 1: Device Code 요청

```bash
curl -s -X POST https://identity.lurus.cn/oauth/v2/device_authorization \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" -d "scope=openid profile email"
```
응답:
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

### Step 2: 사용자에게 표시

`verification_uri`(`https://identity.lurus.cn/device`) + `user_code`를 표시하거나, `verification_uri_complete`를 QR 코드로 스캔하게 합니다. 타임아웃은 5분입니다.

### Step 3: Token 엔드포인트 폴링

`interval`초마다 성공하거나 타임아웃될 때까지 폴링합니다. 오류 처리: `authorization_pending` → 계속 대기; `slow_down` → 빈도 낮추기; 그 외 → 실패 종료.

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

TypeScript 구현도 동형입니다: `fetch`로 `/device_authorization`에 POST하여 flow를 시작하고, `setTimeout(interval*1000)`으로 `/token`을 폴링하며, `authorization_pending`이면 계속하고, `slow_down`이면 interval을 키우고, `resp.ok`이면 tokens를 반환합니다.

---

## 자주 묻는 질문

가장 흔한 연동 오류와 한 번에 해결하는 방법입니다.

<details class="lurus-faq-item">
<summary>audience 오류(<code>aud</code> claim 불일치)</summary>

**증상**: 검증 시 `token audience mismatch` / `invalid audience` 보고. **원인**: access token의 `aud`에는 기본적으로 `client_id`만 포함됩니다. **해결**: scope에 `urn:casdoor:iam:org:project:id:{projectid}:aud`를 추가하여 project ID를 `aud`에 명시적으로 기록합니다.

</details>

<details class="lurus-faq-item">
<summary><code>roles</code> claim이 비어 있거나 누락됨</summary>

**원인**: 사용자가 해당 Project에 User Grant가 없거나 역할 scope를 요청하지 않았습니다. **점검**: ① 콘솔 Project → Authorizations에서 역할 Grant가 있는지 확인 ② scope에 `urn:casdoor:iam:org:projects:roles` 포함 ③ Project 설정에서 「Assert Roles on Authentication」 활성화.

</details>

<details class="lurus-faq-item">
<summary><code>id_token</code>에 <code>email</code>이 없음</summary>

**원인**: scope에서 `email`이 누락되었습니다. **해결**: scope에 `email`을 추가합니다(예: `openid profile email`).

</details>

<details class="lurus-faq-item">
<summary>Refresh token이 만료되어 재로그인 필요</summary>

갱신 시 `invalid_grant` 반환. 가능한 원인: 최초 인가 scope에 `offline_access`가 없음; refresh token 만료; 사용자가 콘솔에서 세션을 취소함. **해결**: Authorization Code 플로우를 다시 시작합니다; 장기 갱신이 필요하면 scope에 `offline_access`가 포함되고 애플리케이션 유형이 「Web」 또는 「Native」인지 확인합니다.

</details>

<details class="lurus-faq-item">
<summary>PKCE <code>code_verifier</code> 불일치</summary>

`/token`이 `invalid_grant: code verifier mismatch`를 반환. **원인**: 두 단계 사이에 verifier가 변경되었거나 Base64URL 인코딩이 일치하지 않습니다(`=` padding 포함 또는 `+/` 사용). **해결**: `base64url`을 사용합니다(padding 없음, `+/` 대신 `-_`); SPA에서는 `sessionStorage`로 페이지 간 verifier를 유지합니다.

</details>

---

<NextSteps
  :steps="[
    { text: 'API 인증(머신 대 머신)', link: '/ko/platform/auth/api-auth', primary: true },
    { text: '신원 인증 개요와 접근점', link: '/ko/platform/auth/' },
    { text: '인증 콘솔', link: 'https://identity.lurus.cn', external: true },
  ]"
  title="다음 단계"
/>

<RelatedProducts product-id="auth" />

## 관련 링크

- Casdoor 공식: [Endpoints](https://casdoor.com/docs/apis/openidoauth/endpoints) · [Scopes](https://casdoor.com/docs/apis/openidoauth/scopes) · [Claims](https://casdoor.com/docs/apis/openidoauth/claims)
- [RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636) · [RFC 8628 — Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628)
- Auth 콘솔 [identity.lurus.cn](https://identity.lurus.cn) · Discovery [/.well-known/openid-configuration](https://identity.lurus.cn/.well-known/openid-configuration)

</div>

<style scoped>
.auth-oidc-page .lurus-stat-strip { margin: 1.5rem 0 0.5rem; }
</style>
