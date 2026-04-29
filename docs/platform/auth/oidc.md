---
title: OIDC / OAuth2 集成 | Zitadel 身份认证
description: 将自有应用接入 Lurus SSO 的完整指南 — 端点、Scopes、Claims、PKCE、Device Flow。
---

# OIDC / OAuth2 集成

Lurus 统一身份认证基于 [Zitadel](https://zitadel.com)，对外暴露标准 OIDC / OAuth2 接口。只要你的应用支持标准 OIDC，即可直接接入 Lurus SSO，无需修改核心认证逻辑。

## 快速开始

绝大多数 OIDC SDK 支持 **Discovery**，只需提供一个 URL 即可自动获取所有端点、支持的算法和能力：

```
Discovery URL: https://auth.lurus.cn/.well-known/openid-configuration
```

建议初始化 SDK 时直接指向该 URL，而不是硬编码各个端点地址，这样在服务端密钥轮换或端点变更时应用无需任何修改。

> **最低配置**：`client_id` + `redirect_uri` + Discovery URL，即可完成授权码流程接入。

---

## 标准端点

所有端点均以 `https://auth.lurus.cn` 为 Base URL。

| 端点名称 | 路径 | HTTP 方法 | 用途 |
|----------|------|-----------|------|
| **Discovery** | `/.well-known/openid-configuration` | GET | 服务元数据，SDK 自动读取所有端点与算法 |
| **Authorization** | `/oauth/v2/authorize` | GET / POST | 开启授权流，将用户重定向到登录页 |
| **Token** | `/oauth/v2/token` | POST | 换取 `access_token` / `id_token` / `refresh_token` |
| **UserInfo** | `/oidc/v1/userinfo` | GET | 用 access token 读取当前用户的 claims |
| **JWKS** | `/oauth/v2/keys` | GET | 获取 JWK 公钥集合，用于本地验签 JWT |
| **Introspection** | `/oauth/v2/introspect` | POST | 查询 token 的有效性与元信息（服务端用） |
| **Revocation** | `/oauth/v2/revoke` | POST | 撤销 access token 或 refresh token |
| **End Session** | `/oidc/v1/end_session` | GET / POST | 登出：终止用户在 Zitadel 的会话 |
| **Device Authorization** | `/oauth/v2/device_authorization` | POST | Device Code Flow 的起始端点 |

### Authorization 端点参数

| 参数 | 必填 | 说明 |
|------|------|------|
| `client_id` | ✓ | 在 Zitadel 控制台创建应用后获取 |
| `redirect_uri` | ✓ | 必须与控制台注册的 URI 完全一致 |
| `response_type` | ✓ | 授权码流程固定填 `code` |
| `scope` | ✓ | 至少包含 `openid`，多个 scope 空格分隔 |
| `state` | 推荐 | 防 CSRF，回调时原值返回 |
| `nonce` | 推荐 | 防重放，写入 `id_token` |
| `code_challenge` | PKCE 必填 | Base64URL(SHA-256(code_verifier)) |
| `code_challenge_method` | PKCE 必填 | 固定填 `S256` |
| `prompt` | 可选 | `login` 强制重新登录；`consent` 强制展示同意页 |
| `login_hint` | 可选 | 预填用户名，加速登录 |

---

## 支持的 Grant Type / Flow

| Flow | 适用场景 | 是否推荐 |
|------|----------|---------|
| **Authorization Code + PKCE** | SPA、Native App、Web App | ✓ 首选 |
| **Client Credentials** | 机器对机器（M2M）、后端服务 | ✓ M2M 场景 |
| **Device Code** | CLI、TV、IoT、无浏览器设备 | ✓ 特殊设备 |
| **Refresh Token** | 长期会话，静默续期 | 配合 `offline_access` scope |
| **JWT Bearer（Service User）** | 服务账号，签名 JWT 换 token | 服务账号场景 |

### Authorization Code + PKCE（推荐）

```
1. 客户端生成 code_verifier（随机 43-128 字符）
2. 计算 code_challenge = Base64URL(SHA-256(code_verifier))
3. 重定向用户到 /oauth/v2/authorize（携带 code_challenge）
4. 用户登录、授权，Zitadel 回调带 code 参数
5. 客户端 POST /oauth/v2/token（携带 code + code_verifier）
6. 获得 access_token + id_token + refresh_token
```

### Client Credentials

```
1. POST /oauth/v2/token
   grant_type=client_credentials
   client_id=<id>
   client_secret=<secret>
   scope=openid urn:zitadel:iam:org:project:id:{projectid}:aud
2. 获得 access_token（不含 id_token，无用户身份）
```

### Refresh Token

```
1. 初次授权时 scope 包含 offline_access
2. 收到 refresh_token 并安全存储
3. access_token 过期时，POST /oauth/v2/token
   grant_type=refresh_token
   refresh_token=<token>
4. 获得新 access_token（refresh_token 可能轮换）
```

---

## Authorization Code + PKCE 完整示例

### TypeScript

```typescript
import { createHash, randomBytes } from "crypto";

// Step 1: 生成 PKCE pair
function generatePKCE() {
  const verifier = randomBytes(32).toString("base64url"); // code_verifier
  const challenge = createHash("sha256")
    .update(verifier)
    .digest("base64url"); // code_challenge
  return { verifier, challenge };
}

// Step 2: 构造 Authorization URL
function buildAuthorizeURL(clientId: string, redirectUri: string): string {
  const { verifier, challenge } = generatePKCE();

  // 持久化 verifier，用于后续 token 交换（sessionStorage / cookie）
  sessionStorage.setItem("pkce_verifier", verifier);

  const state = randomBytes(16).toString("base64url");
  sessionStorage.setItem("oauth_state", state);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid profile email offline_access",
    state,
    nonce: randomBytes(16).toString("base64url"),
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  return `https://auth.lurus.cn/oauth/v2/authorize?${params}`;
}

// Step 3: 回调页面处理 — 验证 state，提取 code
function handleCallback(callbackURL: string) {
  const url = new URL(callbackURL);
  const code = url.searchParams.get("code")!;
  const state = url.searchParams.get("state")!;

  if (state !== sessionStorage.getItem("oauth_state")) {
    throw new Error("State mismatch — possible CSRF attack");
  }
  return code;
}

// Step 4: 用 code 换取 tokens
async function exchangeCode(
  code: string,
  clientId: string,
  redirectUri: string
) {
  const verifier = sessionStorage.getItem("pkce_verifier")!;

  const resp = await fetch("https://auth.lurus.cn/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: verifier,
    }),
  });

  if (!resp.ok) throw new Error(`Token exchange failed: ${await resp.text()}`);

  // Step 5: 获得 tokens
  const { access_token, id_token, refresh_token, expires_in } =
    await resp.json();

  return { access_token, id_token, refresh_token, expires_in };
}
```

### curl 示例

```bash
# Step 1: 获取 Authorization URL（手动构造，实际由 SDK 完成）
# 假设 code_verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
# code_challenge = Base64URL(SHA-256(code_verifier))

CODE_VERIFIER="dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
CODE_CHALLENGE=$(echo -n "$CODE_VERIFIER" | sha256sum | cut -d' ' -f1 | xxd -r -p | base64 | tr '+/' '-_' | tr -d '=')

echo "访问以下 URL 登录："
echo "https://auth.lurus.cn/oauth/v2/authorize?\
response_type=code\
&client_id=YOUR_CLIENT_ID\
&redirect_uri=https://yourapp.example.com/callback\
&scope=openid%20profile%20email%20offline_access\
&state=random_state_value\
&code_challenge=${CODE_CHALLENGE}\
&code_challenge_method=S256"

# Step 4: 用回调中的 code 换 tokens
curl -s -X POST https://auth.lurus.cn/oauth/v2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE_FROM_CALLBACK" \
  -d "redirect_uri=https://yourapp.example.com/callback" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "code_verifier=${CODE_VERIFIER}" | jq .

# 响应示例：
# {
#   "access_token": "eyJhbGciOi...",
#   "token_type": "Bearer",
#   "expires_in": 43199,
#   "id_token": "eyJhbGciOi...",
#   "refresh_token": "3g5Cxl..."
# }
```

---

## Scopes 清单

### 标准 Scopes

| Scope | 说明 | 影响的 Token |
|-------|------|-------------|
| `openid` | **必填**，声明这是 OIDC 请求，返回 `id_token` | id_token |
| `profile` | 获取 `name`、`given_name`、`family_name`、`preferred_username`、`locale` | id_token, userinfo |
| `email` | 获取 `email`、`email_verified` | id_token, userinfo |
| `phone` | 获取 `phone_number`、`phone_number_verified` | id_token, userinfo |
| `address` | 获取用户地址信息 | id_token, userinfo |
| `offline_access` | 请求 `refresh_token`（仅 Authorization Code 流有效） | — |

### Zitadel 特有 Scopes

| Scope | 说明 | 影响的 Token |
|-------|------|-------------|
| `urn:zitadel:iam:org:project:id:{projectid}:aud` | 将指定 project ID 加入 access token 的 `aud` 字段；服务端验签时必须匹配 | access_token |
| `urn:zitadel:iam:org:project:id:zitadel:aud` | 将 Zitadel 自身的 project ID 加入 `aud`（访问 Zitadel API 时使用） | access_token |
| `urn:zitadel:iam:org:projects:roles` | 在 token 中包含所有已授权项目的角色列表 | id_token, access_token, userinfo |
| `urn:zitadel:iam:org:project:role:{rolekey}` | 仅请求特定角色的 claim，如 `urn:zitadel:iam:org:project:role:admin` | id_token, access_token |
| `urn:zitadel:iam:org:id:{orgid}` | 限定用户必须属于该组织；跨组织登录时强制隔离 | 校验用，不直接写入 claim |
| `urn:zitadel:iam:org:domain:primary:{domain}` | 限定用户所在组织的主域名，如 `urn:zitadel:iam:org:domain:primary:lurus.cn` | 校验用 |
| `urn:zitadel:iam:user:metadata` | 在 token 中包含用户自定义 metadata（Base64 编码的键值对） | id_token, access_token, userinfo |
| `urn:zitadel:iam:user:resourceowner` | 获取用户所属组织的 ID、名称和主域名 | id_token, access_token, userinfo |
| `urn:zitadel:iam:org:idp:id:{idp_id}` | 直接跳转到指定 Identity Provider（如企业微信、飞书），跳过 IDP 选择页 | 行为控制 |

> **常用组合**：Web App 典型 scope 为 `openid profile email offline_access urn:zitadel:iam:org:projects:roles urn:zitadel:iam:org:project:id:{projectid}:aud`

---

## Claims 清单

### 标准 Claims

| Claim | 说明 | id_token | access_token | userinfo | 依赖 Scope |
|-------|------|:--------:|:------------:|:--------:|-----------|
| `sub` | 用户唯一 ID（Zitadel 内部 ID） | ✓ | ✓ (JWT) | ✓ | 始终包含 |
| `iss` | Issuer，固定为 `https://auth.lurus.cn` | ✓ | ✓ | — | 始终包含 |
| `aud` | Audience，应用 client_id | ✓ | ✓ | — | 始终包含 |
| `exp` | Token 过期时间（Unix 时间戳） | ✓ | ✓ | — | 始终包含 |
| `iat` | Token 签发时间 | ✓ | ✓ | — | 始终包含 |
| `auth_time` | 用户实际登录时间 | ✓ | — | — | 始终包含 |
| `nonce` | 防重放随机值（authorize 时传入） | ✓ | — | — | 始终包含（如有） |
| `amr` | 认证方式，如 `["pwd"]`、`["mfa"]` | ✓ | — | — | 始终包含 |
| `name` | 全名 | ✓* | — | ✓ | `profile` |
| `given_name` | 名 | ✓* | — | ✓ | `profile` |
| `family_name` | 姓 | ✓* | — | ✓ | `profile` |
| `preferred_username` | Zitadel 登录名（格式：`username@primarydomain`） | ✓ | — | ✓ | `profile` |
| `locale` | 用户语言偏好，如 `zh` | ✓* | — | ✓ | `profile` |
| `email` | 邮箱地址 | ✓* | — | ✓ | `email` |
| `email_verified` | 邮箱是否已验证（Boolean） | ✓* | — | ✓ | `email` |
| `updated_at` | 用户信息最后更新时间 | ✓* | — | ✓ | `profile` |

> `✓*` 表示仅在 response_type 包含 `id_token` 或显式请求时返回。

### Zitadel 特有 Claims

| Claim | 说明 | id_token | access_token | userinfo |
|-------|------|:--------:|:------------:|:--------:|
| `urn:zitadel:iam:org:project:roles` | 用户在项目中的角色，结构为 `{ "roleName": { "orgId": "domain" } }` | ✓ | ✓ (JWT) | ✓ |
| `urn:zitadel:iam:org:domain:primary` | 用户所属组织的主域名 | ✓ | ✓ (JWT) | ✓ |
| `urn:zitadel:iam:user:metadata` | 用户自定义 metadata，格式为 `{ "key": "base64value" }` | ✓ | ✓ (JWT) | ✓ |
| `urn:zitadel:iam:user:resourceowner:id` | 用户所属组织的 ID | ✓ | ✓ (JWT) | ✓ |
| `urn:zitadel:iam:user:resourceowner:name` | 用户所属组织的名称 | ✓ | ✓ (JWT) | ✓ |
| `urn:zitadel:iam:user:resourceowner:primary_domain` | 用户所属组织的主域名 | ✓ | ✓ (JWT) | ✓ |

**角色 claim 示例**：
```json
{
  "urn:zitadel:iam:org:project:roles": {
    "admin": {
      "178204173316174381": "lurus.cn"
    },
    "viewer": {
      "178204173316174381": "lurus.cn"
    }
  }
}
```

**Metadata claim 示例**：
```json
{
  "urn:zitadel:iam:user:metadata": {
    "department": "ZW5naW5lZXJpbmc=",
    "employee_id": "VTEwMDEy"
  }
}
```
> Metadata value 为 Base64 编码，使用时需 `atob()` / `base64.StdEncoding.DecodeString()` 解码。

---

## Token 校验

服务端接收到 Bearer token 后，**不要**仅凭格式判断有效性，必须执行以下校验步骤：

### 验签流程

```
1. 从 JWKS 端点拉取公钥（建议缓存，TTL 1小时）
   GET https://auth.lurus.cn/oauth/v2/keys

2. 用匹配 kid 的公钥验证 JWT 签名

3. 校验标准 claims：
   - iss == "https://auth.lurus.cn"
   - aud 包含本应用的 client_id 或 project_id
   - exp > now()（token 未过期）
   - nbf <= now()（token 已生效，如有）

4. 按需校验业务 claims（如角色、组织 ID）
```

### 推荐库

| 语言 | 库 | 安装 |
|------|----|------|
| TypeScript / Node.js | [`oidc-client-ts`](https://github.com/authts/oidc-client-ts) | `bun add oidc-client-ts` |
| TypeScript / Node.js | [`jose`](https://github.com/panva/jose)（轻量验签） | `bun add jose` |
| Go | [`go-oidc`](https://github.com/coreos/go-oidc) | `go get github.com/coreos/go-oidc/v3` |
| Python | [`python-jose`](https://github.com/mpdavis/python-jose) | `pip install python-jose` |
| Elixir / Phoenix | `lurus-phoenix`（本平台内部库） | 见 `2l-bs-admin` |

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

// VerifyAccessToken validates and returns parsed claims.
func VerifyAccessToken(ctx context.Context, rawToken, clientID string) (*oidc.IDToken, error) {
    verifier := provider.Verifier(&oidc.Config{ClientID: clientID})
    token, err := verifier.Verify(ctx, rawToken)
    if err != nil {
        return nil, fmt.Errorf("token verification failed: %w", err)
    }
    return token, nil
}
```

### 使用 Introspection（不透明 token）

当 access token 为不透明格式（非 JWT）时，使用 Introspection 端点验证：

```bash
curl -X POST https://auth.lurus.cn/oauth/v2/introspect \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "token=ACCESS_TOKEN_TO_CHECK"

# 响应：
# { "active": true, "sub": "...", "exp": 1234567890, ... }
# 或
# { "active": false }
```

---

## Device Authorization Flow

适用于无浏览器输入的设备，如 CLI 工具、TV 应用、IoT 终端。Lurus 的 CLI 产品（Lumen、kova-cli）均使用此流程。

### 时序

```
设备                          Zitadel                        用户（手机/PC 浏览器）
 │                               │                                    │
 │── POST /device_authorization ─►│                                    │
 │◄─ device_code, user_code ──────│                                    │
 │   verification_uri             │                                    │
 │                               │                                    │
 │   展示 user_code 和 URL 给用户  │                                    │
 │                               │                 打开 verification_uri│
 │                               │◄──────────────── 输入 user_code ───│
 │                               │◄──────────────── 登录 & 授权 ──────│
 │                               │                                    │
 │── POST /token (polling) ──────►│                                    │
 │   (每 interval 秒轮询一次)     │                                    │
 │◄─ access_token + id_token ─────│（用户授权后下一次轮询成功）          │
```

### Step 1: 请求 Device Code

```bash
curl -s -X POST https://auth.lurus.cn/oauth/v2/device_authorization \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "scope=openid profile email"
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

```
请访问以下 URL 并输入验证码：
  https://auth.lurus.cn/device
  验证码：GQWC-FWFK

或直接扫码：[QR Code for verification_uri_complete]

等待授权中...（超时时间：5 分钟）
```

### Step 3: 轮询 Token 端点

```bash
# 每隔 interval 秒轮询一次，直到成功或超时
while true; do
  RESPONSE=$(curl -s -X POST https://auth.lurus.cn/oauth/v2/token \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=urn:ietf:params:oauth:grant-type:device_code" \
    -d "device_code=Ag_EE...zo9OA" \
    -d "client_id=YOUR_CLIENT_ID")

  ERROR=$(echo "$RESPONSE" | jq -r '.error // empty')

  if [ -z "$ERROR" ]; then
    echo "授权成功！"
    echo "$RESPONSE" | jq .
    break
  elif [ "$ERROR" = "authorization_pending" ]; then
    sleep 5   # 用户还未授权，继续等待
  elif [ "$ERROR" = "slow_down" ]; then
    sleep 10  # 轮询过快，放慢频率
  else
    echo "授权失败：$ERROR"
    break
  fi
done
```

### TypeScript 完整实现

```typescript
const BASE = "https://auth.lurus.cn";

interface DeviceAuthResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete: string;
  expires_in: number;
  interval: number;
}

async function startDeviceFlow(clientId: string, scope: string) {
  const resp = await fetch(`${BASE}/oauth/v2/device_authorization`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, scope }),
  });

  if (!resp.ok) throw new Error(`Device auth failed: ${await resp.text()}`);
  return resp.json() as Promise<DeviceAuthResponse>;
}

async function pollToken(
  clientId: string,
  deviceCode: string,
  intervalSec: number
): Promise<{ access_token: string; id_token: string }> {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (true) {
    await delay(intervalSec * 1000);

    const resp = await fetch(`${BASE}/oauth/v2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        device_code: deviceCode,
        client_id: clientId,
      }),
    });

    const data = await resp.json();

    if (resp.ok) return data;
    if (data.error === "authorization_pending") continue;
    if (data.error === "slow_down") {
      intervalSec += 5;
      continue;
    }
    throw new Error(`Authorization failed: ${data.error} — ${data.error_description}`);
  }
}

// Usage
const auth = await startDeviceFlow("YOUR_CLIENT_ID", "openid profile email");
console.log(`请访问: ${auth.verification_uri}`);
console.log(`验证码: ${auth.user_code}`);
const tokens = await pollToken("YOUR_CLIENT_ID", auth.device_code, auth.interval);
console.log("Access Token:", tokens.access_token);
```

---

## 常见问题

::: tip audience 错误（`aud` claim 不匹配）
**现象**：服务端验签时报 `token audience mismatch` 或 `invalid audience`。

**原因**：access token 的 `aud` 字段默认只包含 `client_id`，服务端期望的 audience 不在其中。

**解决**：在 scope 中加入 `urn:zitadel:iam:org:project:id:{projectid}:aud`，将你的 project ID 显式写入 `aud`。
:::

::: tip `roles` claim 为空或缺失
**现象**：token 中没有 `urn:zitadel:iam:org:project:roles` 字段。

**原因**：用户在该 Project 下没有 User Grant（角色授权），或未请求角色相关 scope。

**检查项**：
1. 在 Zitadel 控制台 → Project → Authorizations，确认用户有对应角色的 Grant。
2. 确认 scope 中包含 `urn:zitadel:iam:org:projects:roles`。
3. 确认 Project 设置中开启了「Assert Roles on Authentication」。
:::

::: tip `id_token` 中没有 `email` 字段
**现象**：解析 id_token 后找不到 `email` claim。

**原因**：授权请求的 scope 中遗漏了 `email`。

**解决**：在 scope 参数中加入 `email`，例如 `openid profile email`。
:::

::: tip Refresh token 失效，需要重新登录
**现象**：调用 token 端点续期时返回 `invalid_grant`。

**可能原因**：
- 初次授权时 scope 未包含 `offline_access`，未颁发 refresh token。
- Refresh token 已过 Zitadel 设定的有效期（默认因配置而异）。
- 用户在 Zitadel 控制台手动撤销了会话。

**解决**：重新发起 Authorization Code 流程；若应用需要长期静默续期，确保 scope 包含 `offline_access` 且应用类型配置为「Web」或「Native」。
:::

::: tip PKCE `code_verifier` 不匹配
**现象**：`/token` 端点返回 `invalid_grant: code verifier mismatch`。

**原因**：code_verifier 在授权和兑换步骤之间发生变化，或 Base64URL 编码不一致（含 `=` padding 或使用了 `+/` 而非 `-_`）。

**解决**：确保 code_verifier 使用 `base64url`（无 padding，`-_` 替代 `+/`）编码；在 SPA 中用 `sessionStorage` 跨页面保持 verifier。
:::

---

## 相关链接

- [Zitadel 官方文档 — Endpoints](https://zitadel.com/docs/apis/openidoauth/endpoints)
- [Zitadel 官方文档 — Scopes](https://zitadel.com/docs/apis/openidoauth/scopes)
- [Zitadel 官方文档 — Claims](https://zitadel.com/docs/apis/openidoauth/claims)
- [RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636)
- [RFC 8628 — Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628)
- Lurus Auth 控制台：[https://auth.lurus.cn](https://auth.lurus.cn)
- Discovery URL：[https://auth.lurus.cn/.well-known/openid-configuration](https://auth.lurus.cn/.well-known/openid-configuration)
