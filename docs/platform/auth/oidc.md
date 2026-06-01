---
title: OIDC / OAuth2 集成 | Zitadel 身份认证
description: 将自有应用接入 Lurus SSO 的完整指南 — 端点、Scopes、Claims、PKCE、Device Flow。
---

# OIDC / OAuth2 集成

Lurus 统一身份认证基于 [Zitadel](https://zitadel.com)，对外暴露标准 OIDC / OAuth2 接口。应用支持标准 OIDC 即可直接接入 Lurus SSO，无需修改核心认证逻辑。

## 快速开始

绝大多数 OIDC SDK 支持 **Discovery**，只需一个 URL 即可自动获取所有端点、算法和能力：

```
Discovery URL: https://auth.lurus.cn/.well-known/openid-configuration
```

初始化 SDK 直接指向该 URL（而非硬编码端点），服务端密钥轮换或端点变更时应用无需修改。**最低配置**：`client_id` + `redirect_uri` + Discovery URL。

---

## 标准端点

所有端点以 `https://auth.lurus.cn` 为 Base URL。

| 端点名称 | 路径 | HTTP 方法 | 用途 |
|----------|------|-----------|------|
| **Discovery** | `/.well-known/openid-configuration` | GET | 服务元数据，SDK 自动读取所有端点与算法 |
| **Authorization** | `/oauth/v2/authorize` | GET / POST | 开启授权流，重定向到登录页 |
| **Token** | `/oauth/v2/token` | POST | 换取 `access_token` / `id_token` / `refresh_token` |
| **UserInfo** | `/oidc/v1/userinfo` | GET | 用 access token 读取当前用户 claims |
| **JWKS** | `/oauth/v2/keys` | GET | 获取 JWK 公钥集合，本地验签 JWT |
| **Introspection** | `/oauth/v2/introspect` | POST | 查询 token 有效性与元信息（服务端用） |
| **Revocation** | `/oauth/v2/revoke` | POST | 撤销 access / refresh token |
| **End Session** | `/oidc/v1/end_session` | GET / POST | 登出：终止 Zitadel 会话 |
| **Device Authorization** | `/oauth/v2/device_authorization` | POST | Device Code Flow 起始端点 |

### Authorization 端点参数

| 参数 | 必填 | 说明 |
|------|------|------|
| `client_id` | ✓ | 控制台创建应用后获取 |
| `redirect_uri` | ✓ | 必须与控制台注册的 URI 完全一致 |
| `response_type` | ✓ | 授权码流程固定 `code` |
| `scope` | ✓ | 至少含 `openid`，多个空格分隔 |
| `state` | 推荐 | 防 CSRF，回调时原值返回 |
| `nonce` | 推荐 | 防重放，写入 `id_token` |
| `code_challenge` | PKCE 必填 | Base64URL(SHA-256(code_verifier)) |
| `code_challenge_method` | PKCE 必填 | 固定 `S256` |
| `prompt` | 可选 | `login` 强制重登；`consent` 强制展示同意页 |
| `login_hint` | 可选 | 预填用户名，加速登录 |

---

## 支持的 Grant Type / Flow

| Flow | 适用场景 | 是否推荐 |
|------|----------|---------|
| **Authorization Code + PKCE** | SPA、Native App、Web App | ✓ 首选 |
| **Client Credentials** | M2M、后端服务 | ✓ M2M 场景 |
| **Device Code** | CLI、TV、IoT、无浏览器设备 | ✓ 特殊设备 |
| **Refresh Token** | 长期会话，静默续期 | 配合 `offline_access` scope |
| **JWT Bearer（Service User）** | 服务账号，签名 JWT 换 token | 服务账号场景 |

**Authorization Code + PKCE**：① 客户端生成 `code_verifier`（随机 43-128 字符）② 算 `code_challenge = Base64URL(SHA-256(verifier))` ③ 重定向到 `/oauth/v2/authorize`（带 challenge）④ 用户登录授权，回调带 `code` ⑤ POST `/oauth/v2/token`（带 `code` + `code_verifier`）⑥ 获得 access/id/refresh token。

**Client Credentials**：POST `/oauth/v2/token` with `grant_type=client_credentials` + `client_id` + `client_secret` + `scope=openid urn:zitadel:iam:org:project:id:{projectid}:aud` → 获得 access_token（无 id_token，无用户身份）。

**Refresh Token**：初次授权 scope 含 `offline_access` → 安全存储 refresh_token → access_token 过期时 POST `grant_type=refresh_token` + `refresh_token=<token>` → 获新 token（refresh_token 可能轮换）。

---

## Authorization Code + PKCE 完整示例

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

## Scopes 清单

### 标准 Scopes

| Scope | 说明 | 影响的 Token |
|-------|------|-------------|
| `openid` | **必填**，声明 OIDC 请求，返回 `id_token` | id_token |
| `profile` | 获取 `name`、`given_name`、`family_name`、`preferred_username`、`locale` | id_token, userinfo |
| `email` | 获取 `email`、`email_verified` | id_token, userinfo |
| `phone` | 获取 `phone_number`、`phone_number_verified` | id_token, userinfo |
| `address` | 获取用户地址信息 | id_token, userinfo |
| `offline_access` | 请求 `refresh_token`（仅 Authorization Code 流有效） | — |

### Zitadel 特有 Scopes

| Scope | 说明 | 影响的 Token |
|-------|------|-------------|
| `urn:zitadel:iam:org:project:id:{projectid}:aud` | 将指定 project ID 加入 access token 的 `aud`；服务端验签必须匹配 | access_token |
| `urn:zitadel:iam:org:project:id:zitadel:aud` | 将 Zitadel 自身 project ID 加入 `aud`（访问 Zitadel API 用） | access_token |
| `urn:zitadel:iam:org:projects:roles` | token 中包含所有已授权项目的角色列表 | id_token, access_token, userinfo |
| `urn:zitadel:iam:org:project:role:{rolekey}` | 仅请求特定角色 claim，如 `...:role:admin` | id_token, access_token |
| `urn:zitadel:iam:org:id:{orgid}` | 限定用户必须属于该组织；跨组织登录强制隔离 | 校验用 |
| `urn:zitadel:iam:org:domain:primary:{domain}` | 限定用户所在组织主域名，如 `...:primary:lurus.cn` | 校验用 |
| `urn:zitadel:iam:user:metadata` | token 中包含用户自定义 metadata（Base64 键值对） | id_token, access_token, userinfo |
| `urn:zitadel:iam:user:resourceowner` | 获取用户所属组织的 ID、名称和主域名 | id_token, access_token, userinfo |
| `urn:zitadel:iam:org:idp:id:{idp_id}` | 直接跳转到指定 IdP（企业微信、飞书），跳过 IDP 选择页 | 行为控制 |

> **常用组合**（Web App）：`openid profile email offline_access urn:zitadel:iam:org:projects:roles urn:zitadel:iam:org:project:id:{projectid}:aud`

---

## Claims 清单

### 标准 Claims

| Claim | 说明 | id_token | access_token | userinfo | 依赖 Scope |
|-------|------|:--------:|:------------:|:--------:|-----------|
| `sub` | 用户唯一 ID（Zitadel 内部 ID） | ✓ | ✓ (JWT) | ✓ | 始终 |
| `iss` | Issuer，固定 `https://auth.lurus.cn` | ✓ | ✓ | — | 始终 |
| `aud` | Audience，应用 client_id | ✓ | ✓ | — | 始终 |
| `exp` / `iat` | 过期 / 签发时间（Unix） | ✓ | ✓ | — | 始终 |
| `auth_time` | 用户实际登录时间 | ✓ | — | — | 始终 |
| `nonce` | 防重放随机值 | ✓ | — | — | 始终（如有） |
| `amr` | 认证方式，如 `["pwd"]`、`["mfa"]` | ✓ | — | — | 始终 |
| `name` / `given_name` / `family_name` | 全名 / 名 / 姓 | ✓* | — | ✓ | `profile` |
| `preferred_username` | 登录名（`username@primarydomain`） | ✓ | — | ✓ | `profile` |
| `locale` / `updated_at` | 语言偏好（如 `zh`）/ 信息更新时间 | ✓* | — | ✓ | `profile` |
| `email` / `email_verified` | 邮箱 / 是否已验证（Boolean） | ✓* | — | ✓ | `email` |

> `✓*` = 仅在 response_type 含 `id_token` 或显式请求时返回。

### Zitadel 特有 Claims

| Claim | 说明 | id_token | access_token | userinfo |
|-------|------|:--------:|:------------:|:--------:|
| `urn:zitadel:iam:org:project:roles` | 用户项目角色，结构 `{ "roleName": { "orgId": "domain" } }` | ✓ | ✓ (JWT) | ✓ |
| `urn:zitadel:iam:org:domain:primary` | 用户所属组织主域名 | ✓ | ✓ (JWT) | ✓ |
| `urn:zitadel:iam:user:metadata` | 用户自定义 metadata，`{ "key": "base64value" }` | ✓ | ✓ (JWT) | ✓ |
| `urn:zitadel:iam:user:resourceowner:id` / `:name` / `:primary_domain` | 用户所属组织 ID / 名称 / 主域名 | ✓ | ✓ (JWT) | ✓ |

**角色 claim 示例**：
```json
{ "urn:zitadel:iam:org:project:roles": { "admin": { "178204173316174381": "lurus.cn" }, "viewer": { "178204173316174381": "lurus.cn" } } }
```
**Metadata claim 示例**（value 为 Base64，使用时需 `atob()` / `base64.StdEncoding.DecodeString()` 解码）：
```json
{ "urn:zitadel:iam:user:metadata": { "department": "ZW5naW5lZXJpbmc=", "employee_id": "VTEwMDEy" } }
```

---

## Token 校验

服务端收到 Bearer token 后**不要**仅凭格式判断有效性，必须：

```
1. 从 JWKS 拉公钥（建议缓存 TTL 1小时）: GET https://auth.lurus.cn/oauth/v2/keys
2. 用匹配 kid 的公钥验证 JWT 签名
3. 校验标准 claims：iss == "https://auth.lurus.cn"；aud 含本应用 client_id 或 project_id；
   exp > now()；nbf <= now()（如有）
4. 按需校验业务 claims（角色、组织 ID）
```

### 推荐库

| 语言 | 库 | 安装 |
|------|----|------|
| TS / Node.js | [`oidc-client-ts`](https://github.com/authts/oidc-client-ts) | `bun add oidc-client-ts` |
| TS / Node.js | [`jose`](https://github.com/panva/jose)（轻量验签） | `bun add jose` |
| Go | [`go-oidc`](https://github.com/coreos/go-oidc) | `go get github.com/coreos/go-oidc/v3` |
| Python | [`python-jose`](https://github.com/mpdavis/python-jose) | `pip install python-jose` |
| Elixir / Phoenix | `lurus-phoenix`（平台内部库） | 见 `2l-bs-admin` |

### Go 验签示例

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

### Introspection（不透明 token）

access token 为不透明格式（非 JWT）时用 Introspection 验证：

```bash
curl -X POST https://auth.lurus.cn/oauth/v2/introspect \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "token=ACCESS_TOKEN_TO_CHECK"
# 响应：{ "active": true, "sub": "...", "exp": 1234567890, ... } 或 { "active": false }
```

---

## Device Authorization Flow

适用无浏览器输入设备（CLI、TV、IoT）。Lurus CLI 产品（Lumen、kova-cli）均用此流程。

**时序**：设备 POST `/device_authorization` → 收到 `device_code` + `user_code` + `verification_uri` → 展示 user_code 和 URL 给用户 → 用户在浏览器打开 verification_uri、输 user_code、登录授权 → 设备每 `interval` 秒轮询 `/token` → 用户授权后下一次轮询返回 access/id token。

### Step 1: 请求 Device Code

```bash
curl -s -X POST https://auth.lurus.cn/oauth/v2/device_authorization \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" -d "scope=openid profile email"
```
响应：
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

### Step 2: 展示给用户

展示 `verification_uri`（`https://auth.lurus.cn/device`）+ `user_code`，或扫码 `verification_uri_complete`。超时 5 分钟。

### Step 3: 轮询 Token 端点

每 `interval` 秒轮询，直到成功或超时。错误处理：`authorization_pending` → 继续等；`slow_down` → 放慢频率；其他 → 失败退出。

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

TypeScript 实现同构：`fetch` POST `/device_authorization` 起 flow，再以 `setTimeout(interval*1000)` 轮询 `/token`，命中 `authorization_pending` 继续、`slow_down` 加大 interval、`resp.ok` 返回 tokens。

---

## 常见问题

::: tip audience 错误（`aud` claim 不匹配）
**现象**：验签报 `token audience mismatch` / `invalid audience`。**原因**：access token 的 `aud` 默认只含 `client_id`。**解决**：scope 加 `urn:zitadel:iam:org:project:id:{projectid}:aud`，将 project ID 显式写入 `aud`。
:::

::: tip `roles` claim 为空或缺失
**原因**：用户在该 Project 无 User Grant，或未请求角色 scope。**检查**：① 控制台 Project → Authorizations 确认有角色 Grant ② scope 含 `urn:zitadel:iam:org:projects:roles` ③ Project 设置开启「Assert Roles on Authentication」。
:::

::: tip `id_token` 中没有 `email`
**原因**：scope 遗漏 `email`。**解决**：scope 加 `email`（如 `openid profile email`）。
:::

::: tip Refresh token 失效需重新登录
续期返回 `invalid_grant`。可能：初次授权 scope 未含 `offline_access`；refresh token 过期；用户在控制台撤销了会话。**解决**：重新发起 Authorization Code 流程；需长期续期则确保 scope 含 `offline_access` 且应用类型为「Web」或「Native」。
:::

::: tip PKCE `code_verifier` 不匹配
`/token` 返回 `invalid_grant: code verifier mismatch`。**原因**：verifier 在两步间变化，或 Base64URL 编码不一致（含 `=` padding 或用了 `+/`）。**解决**：用 `base64url`（无 padding，`-_` 替代 `+/`）；SPA 中用 `sessionStorage` 跨页面保持 verifier。
:::

---

## 相关链接

- Zitadel 官方：[Endpoints](https://zitadel.com/docs/apis/openidoauth/endpoints) · [Scopes](https://zitadel.com/docs/apis/openidoauth/scopes) · [Claims](https://zitadel.com/docs/apis/openidoauth/claims)
- [RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636) · [RFC 8628 — Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628)
- Auth 控制台 [auth.lurus.cn](https://auth.lurus.cn) · Discovery [/.well-known/openid-configuration](https://auth.lurus.cn/.well-known/openid-configuration)
