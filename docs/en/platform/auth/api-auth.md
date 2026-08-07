---
title: API Authentication | Casdoor Identity Authentication
description: Complete guide to Service Users, Personal Access Tokens, JWT Profile, and Client Credentials, covering all machine-to-machine authentication scenarios in Lurus.
---

<div class="auth-api-page">

# API Authentication (Machine-to-Machine) <StatusBadge status="live" />

For M2M authentication: unlike the browser OIDC flow, M2M uses a Casdoor **Service Account**, obtaining an access token without human intervention. The Casdoor instance is `https://auth.lurus.cn`, and all endpoints below are relative to it.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">authentication methods</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">RS256</span><span class="lurus-stat__label">JWT Profile signature</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">≤5 minutes</span><span class="lurus-stat__label">assertion lifetime</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">≈12 hours</span><span class="lurus-stat__label">access token lifetime</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="layers" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Looking for browser login first?</p>
    <div class="lurus-callout__body">For human user login, use <a href="/en/platform/auth/oidc">OIDC / OAuth2 Integration</a>; this page covers only <strong>machine-to-machine</strong>—scripts, background jobs, and service-to-service calls.</div>
  </div>
</div>

## Comparison of the Three Authentication Methods

From the simplest (PAT) to the most secure (JWT Profile), weigh the trade-offs between security and operational cost.

| Method | Use case | Permission model | Token lifetime |
|------|---------|---------|------------|
| **Personal Access Token (PAT)** | Personal scripts, development debugging, temporary CI calls | Inherits all permissions of the owning Service Account | Long-lived (customizable expiry, no expiry by default) |
| **Service Account + Client Credentials** | Scheduled background jobs, service-to-service REST calls, simple machine accounts | Must be assigned a Project Role separately via User Grant | access token ~1 hour, needs automatic refresh |
| **Service Account + JWT Profile** | High-security scenarios, production services, K8s workloads | Must be assigned a Project Role separately via User Grant | assertion JWT up to 5 minutes, access token ~12 hours |

::: tip Recommendation
- **Debugging / temporary scripts**: PAT is the simplest—paste it into the header and go.
- **Production machine accounts**: Prefer JWT Profile; private-key rotation does not depend on secret distribution.
- **Simple internal services**: Client Credentials is a simplified alternative to JWT Profile.
:::

---

## 1. Personal Access Token (PAT) <Badge text="Ready to Use" type="tip" />

A PAT is a **ready-to-use token** that you place directly into the `Authorization` header as a Bearer token, with no need to exchange it for an access token first.

### 1.1 Create a PAT

<ol class="lurus-steps">
<li>Log in to the <a href="https://auth.lurus.cn">auth.lurus.cn</a> console.</li>
<li>Go to <strong>Users → Service Accounts</strong> (when the account belongs to an Organization, operate within that context).</li>
<li>Click <strong>New</strong> to create a service account, entering a username (see the naming convention in <a href="#3-service-account">Section 3</a>) and a display name.</li>
<li>In the account details → <strong>Personal Access Tokens</strong> → <strong>New</strong>, set an expiration time as needed (leave blank for no expiry).</li>
<li>Copy the token—<strong>it is shown only once and cannot be viewed again after closing the dialog</strong>.</li>
</ol>

### 1.2 Use a PAT

Attach it to every request header as a standard Bearer token; it can access all Casdoor APIs that the Service Account is authorized for, with no extra audience scope required.

```bash
# Query the organization the current account belongs to
curl -X GET https://auth.lurus.cn/management/v1/orgs/me \
  -H 'Authorization: Bearer <PAT>'
# Call the v2 API
curl -X GET https://auth.lurus.cn/v2/users/me \
  -H 'Authorization: Bearer <PAT>'
```

### 1.3 Applicable Lurus Scenarios

- Ops scripts: bulk-query or modify users via the Management API
- `2l-svc-casdoor-mcp` MCP Server accessing the Casdoor Management API
- Temporary management operations in CI/CD pipelines; quick local testing of the Casdoor API during development

### 1.4 Security Considerations

::: warning PAT Security Rules
- Shown only once—store it in a secret-management tool (K8s Secret, Vault) immediately after creation.
- **Never commit it to a Git repository.** Use a separate PAT for each purpose; do not share.
- Periodically audit and delete PATs that are no longer in use; delete them in the console immediately after a leak (an attacker can use them until the PAT expires or is deleted).
:::

---

## 2. Service Account

A Service Account is an account type representing a **non-human entity**, designed specifically for M2M. Differences from a Human User:

| Attribute | Human User | Service Account |
|------|-----------|----------------|
| Login method | Password / Passkey / MFA | No interactive login; only via PAT or token exchange |
| Multi-factor authentication | Supported | Not applicable |
| Appears in OIDC session | Yes | No |
| Permission assignment | Grant or Organization Role | Linked to a Project Role via User Grant |

### 2.1 Create a Service Account

In the console, go to the target Organization → **Users → Service Accounts → New**, enter a username and display name → **Create**.

**Naming convention** `svc-<service>-<purpose>`, for example:
- `svc-lurus-api-platform-client` — lurus-api calling platform internal interfaces
- `svc-ci-deploy` — dedicated to CI/CD deployment
- `svc-casdoor-mcp-admin` — for Casdoor MCP Server management

### 2.2 Assign Permissions

By default a newly created account has no permissions. Go to the corresponding **Project → User Grants → New** → select the target Service Account → assign a Project Role (such as `admin`, `viewer`).

::: tip Principle of Least Privilege
Grant only the minimum permissions needed to complete the task; do not give `admin` for read-only tasks.
:::

---

## 3. Client Credentials (Simplest Machine-Account Call Method) <Badge text="Standard OAuth2" type="info" /> {#3-service-account}

A standard OAuth 2.0 grant type, suitable for machine-account scenarios that do not require strong security.

### 3.1 Generate Client Credentials

Service Account details → **Actions → Generate Client Secret** → record the `Client ID` and `Client Secret` (**the Secret is shown only once**).

### 3.2 Exchange for an Access Token

Send a `client_credentials` grant request to the token endpoint:

::: code-group

```bash [curl]
curl -X POST https://auth.lurus.cn/oauth/v2/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --user "$CLIENT_ID:$CLIENT_SECRET" \
  --data 'grant_type=client_credentials' \
  --data 'scope=openid profile'
```

```typescript [TypeScript]
const params = new URLSearchParams({
  grant_type: 'client_credentials',
  scope: 'openid profile',
})
const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
const response = await fetch('https://auth.lurus.cn/oauth/v2/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: params.toString(),
})
const { access_token, expires_in } = await response.json()
```

:::

> The Go implementation is isomorphic to the TypeScript one: `http.NewRequest` POST with the body above + `req.SetBasicAuth(clientID, clientSecret)`, then parse `access_token`.

### 3.3 Response Format

```json
{ "access_token": "MtjHodGy4zxKylDOhg6kW90WeEQs2q...", "token_type": "Bearer", "expires_in": 43199 }
```

- `expires_in` is in seconds, about 12 hours. Implement your own token caching and automatic refresh (refresh 5 minutes before expiry is recommended).

### 3.4 Call the API

```bash
curl -X GET https://auth.lurus.cn/v2/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## 4. JWT Profile (The Most Secure Machine Authentication Method) <Badge text="Recommended for Production" type="tip" />

Uses an asymmetric key pair: the Service Account holds the **private key**, and Casdoor stores the corresponding **public key**. The client signs a short-lived JWT with the private key as a `client_assertion`; Casdoor verifies the signature and issues an access token. **The private key is never transmitted over the network**, making this the most secure M2M method.

### 4.1 Generate a Key Pair

**Option A (recommended)**: Service Account details → **Keys** → **New** (optional expiry) → **Download** to save the JSON key file (**downloadable only once**).

**Option B**: Generate externally and upload the public key:

```bash
openssl genrsa -out privatekey.pem 2048
openssl rsa -in privatekey.pem -pubout -out publickey.pem
```

Then upload `publickey.pem` via the Casdoor User Service API.

### 4.2 JSON Key File Format

```json
{
  "type": "serviceaccount",
  "keyId": "100509901696068329",
  "key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n",
  "userId": "100507859606888466"
}
```

| Field | Meaning |
|------|------|
| `keyId` | Corresponds to `kid` (Key ID) in the JWT header |
| `key` | RSA private key (PEM), used to sign the assertion JWT |
| `userId` | Service Account user ID, used for `iss` and `sub` |

### 4.3 Construct the JWT Assertion

**Header**: `{ "alg": "RS256", "kid": "<keyId>" }`

**Payload**:

```json
{ "iss": "<userId>", "sub": "<userId>", "aud": "https://auth.lurus.cn", "iat": 1714000000, "exp": 1714000300 }
```

| Claim | Description |
|-------|------|
| `iss` | The `userId` from the JSON file |
| `sub` | Same as `iss` (represents the requester, i.e., the application itself) |
| `aud` | The Casdoor instance domain: `https://auth.lurus.cn` |
| `iat` | The current UTC Unix timestamp |
| `exp` | Expiry; `iat + 300` (5 minutes) is recommended; **must not exceed 1 hour** |

::: warning Clock Synchronization
`iat` must not be more than 1 hour earlier than the Casdoor server time, otherwise the token request is rejected. Make sure the machine’s NTP synchronization is working correctly.
:::

### 4.4 Exchange for an Access Token

The curl flow: first sign out an assertion using a library, then POST to exchange for a token. Go / Node.js / Python and others use their respective JWT libraries (`golang-jwt`, `jsonwebtoken`, `PyJWT`) to sign with `RS256` per the header/payload in 4.3, then submit the `assertion`.

::: code-group

```bash [curl]
# 1. First sign the JWT with a library (illustrative)
ASSERTION="<base64url-header>.<base64url-payload>.<base64url-signature>"
# 2. Request the token
curl -X POST https://auth.lurus.cn/oauth/v2/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer' \
  --data 'scope=openid profile' \
  --data "assertion=$ASSERTION"
```

```go [Go]
import (
    "crypto/rsa"; "crypto/x509"; "encoding/json"; "encoding/pem"
    "fmt"; "net/http"; "net/url"; "os"; "strings"; "time"
    "github.com/golang-jwt/jwt/v5"
)

type keyFile struct {
    KeyID  string `json:"keyId"`
    Key    string `json:"key"`
    UserID string `json:"userId"`
}

func loadPrivateKey(pemStr string) (*rsa.PrivateKey, error) {
    block, _ := pem.Decode([]byte(pemStr))
    if block == nil {
        return nil, fmt.Errorf("failed to decode PEM block")
    }
    return x509.ParsePKCS1PrivateKey(block.Bytes)
}

func GetToken(keyFilePath string) (string, error) {
    data, err := os.ReadFile(keyFilePath)
    if err != nil {
        return "", fmt.Errorf("read key file: %w", err)
    }
    var kf keyFile
    if err := json.Unmarshal(data, &kf); err != nil {
        return "", fmt.Errorf("parse key file: %w", err)
    }
    privateKey, err := loadPrivateKey(kf.Key)
    if err != nil {
        return "", fmt.Errorf("load private key: %w", err)
    }
    now := time.Now()
    claims := jwt.MapClaims{
        "iss": kf.UserID,
        "sub": kf.UserID,
        "aud": jwt.ClaimStrings{"https://auth.lurus.cn"},
        "iat": now.Unix(),
        "exp": now.Add(5 * time.Minute).Unix(),
    }
    token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
    token.Header["kid"] = kf.KeyID
    assertion, err := token.SignedString(privateKey)
    if err != nil {
        return "", fmt.Errorf("sign jwt: %w", err)
    }
    params := url.Values{
        "grant_type": {"urn:ietf:params:oauth:grant-type:jwt-bearer"},
        "scope":      {"openid profile"},
        "assertion":  {assertion},
    }
    req, _ := http.NewRequest("POST",
        "https://auth.lurus.cn/oauth/v2/token",
        strings.NewReader(params.Encode()),
    )
    req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", fmt.Errorf("token request: %w", err)
    }
    defer resp.Body.Close()
    var result struct {
        AccessToken string `json:"access_token"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return "", fmt.Errorf("decode response: %w", err)
    }
    return result.AccessToken, nil
}
```

```python [Python]
import json, time, jwt          # pip install PyJWT
import requests

def get_token(key_file_path: str) -> str:
    with open(key_file_path) as f:
        key_data = json.load(f)
    now = int(time.time())
    assertion = jwt.encode(
        {
            "iss": key_data["userId"], "sub": key_data["userId"],
            "aud": "https://auth.lurus.cn", "iat": now, "exp": now + 300,
        },
        key_data["key"], algorithm="RS256",
        headers={"kid": key_data["keyId"]},
    )
    response = requests.post(
        "https://auth.lurus.cn/oauth/v2/token",
        data={
            "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
            "scope": "openid profile", "assertion": assertion,
        },
    )
    response.raise_for_status()
    return response.json()["access_token"]
```

```typescript [Node.js / TypeScript]
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken'; // npm install jsonwebtoken @types/jsonwebtoken

interface KeyFile {
  keyId: string;
  key: string;   // RSA private key PEM
  userId: string;
}

async function getToken(keyFilePath: string): Promise<string> {
  const keyData: KeyFile = JSON.parse(fs.readFileSync(keyFilePath, 'utf-8'));
  const now = Math.floor(Date.now() / 1000);

  const assertion = jwt.sign(
    { iss: keyData.userId, sub: keyData.userId, aud: 'https://auth.lurus.cn', iat: now, exp: now + 300 },
    keyData.key,
    { algorithm: 'RS256', keyid: keyData.keyId }
  );

  const params = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    scope: 'openid profile',
    assertion,
  });
  const resp = await fetch('https://auth.lurus.cn/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!resp.ok) throw new Error(`token request failed: ${resp.status}`);
  const { access_token } = await resp.json() as { access_token: string };
  return access_token;
}
```

:::

### 4.5 Response Format

Same as 3.3 (access token ~12 hours). Refresh proactively before expiry (re-sign the assertion → request a new token).

---

## 5. Requesting the Correct Audience

Casdoor validates the **audience (aud)** field of the access token. For different target APIs, declare the corresponding audience in the scope.

**To access Casdoor’s own APIs** (Management / Admin / Auth): `scope=openid profile urn:casdoor:iam:org:project:id:casdoor:aud`. This reserved scope adds the Casdoor project to the token’s audience; the Management API and others will reject any token that does not include this audience.

```bash
curl -X POST https://auth.lurus.cn/oauth/v2/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --user "$CLIENT_ID:$CLIENT_SECRET" \
  --data 'grant_type=client_credentials' \
  --data 'scope=openid profile urn:casdoor:iam:org:project:id:casdoor:aud'
```

**To access a resource service of a custom Project**: `scope=openid profile urn:casdoor:iam:org:project:id:<your_project_id>:aud` (find `<your_project_id>` on the Project details page in the console).

### Common Errors

| Symptom | Cause | Resolution |
|------|------|------|
| `403 Forbidden` | Token audience does not include the target API | Add the corresponding `urn:casdoor:iam:...` scope when exchanging for a token |
| `401 Unauthorized` | Token expired or signature invalid | Check clock synchronization and obtain a new token |
| `invalid_grant` | Assertion expired (>5 minutes) or `aud` incorrect | Check the assertion’s `exp` and `aud` |

---

## 6. Token Management: Revoke / Rotate / Expire

- **PAT**: No automatic expiry (unless an expiry date was set at creation). Manually delete it from the **Personal Access Tokens** list in the console to revoke it. Audit quarterly and delete unused PATs or those of departed employees.
- **Client Credentials**: The Secret does not expire, but the exchanged access token expires in about 12 hours. To rotate the Secret: re-run **Generate Client Secret** in the console (the old secret becomes invalid immediately). Have your application code record `expires_in` and request a new token proactively before expiry.
- **JWT Profile private key**: If the JSON key leaks, an attacker can sign assertions and exchange them for tokens. To rotate: add a new Key in the **Keys** tab → update the keyfile read by the service → delete the old Key after confirming the new one works. Mounting the keyfile as a K8s Secret rather than baking it into the image is recommended:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: idp-service-account-key
  namespace: lurus-system
type: Opaque
stringData:
  key.json: |
    {
      "type": "serviceaccount",
      "keyId": "...",
      "key": "-----BEGIN RSA PRIVATE KEY-----\n...",
      "userId": "..."
    }
```

```yaml
# Mount in the Deployment
volumes:
  - name: idp-key
    secret:
      secretName: idp-service-account-key
containers:
  - name: app
    volumeMounts:
      - name: idp-key
        mountPath: /secrets/casdoor
        readOnly: true
    env:
      - name: OIDC_KEY_FILE
        value: /secrets/casdoor/key.json
```

---

## 7. Authentication Scenarios for Lurus Internal Services

| Service | Authentication scenario | Recommended method |
|------|---------|---------|
| **2l-svc-casdoor-mcp** | Calling the Casdoor Management API to manage users/permissions | PAT (ops) or Service Account + JWT Profile |
| **2b-svc-api (Hub)** | Backend verifying frontend OIDC tokens; calling platform internal interfaces | Frontend users use OIDC tokens; platform calls use `INTERNAL_API_KEY` (bearer_internal_key mode) |
| **2l-svc-platform** | Providing internal APIs (`/internal/v1/...`), consumed by the Hub and others | `bearer_internal_key` (not Casdoor; a platform-internal convention) |
| **CI/CD Pipeline** | Querying/updating cluster resources during deployment | Dedicated Service Account + PAT, a separate account per pipeline |
| **Scheduled background jobs** | Standalone Jobs with no user context | Service Account + Client Credentials or JWT Profile |

::: info About `bearer_internal_key`
The `lurus-platform` internal API (service: `platform-core.lurus-platform.svc:18104`) uses a dedicated `INTERNAL_API_KEY` rather than a Casdoor token; this key is distributed to consumers via a K8s Secret. See the `capabilities` section of `lurus.yaml` for details.
:::

---

## 8. Security Best Practices

::: warning Mandatory Production Requirements
1. **Never commit a PAT, Client Secret, or private-key file to Git** (even a private repository).
2. **Prefer JWT Profile in production**: private-key rotation does not require coordinating secret updates across all consumers, and the security boundary is clearer.
3. **Use a dedicated Service Account per CI job/service**, enabling precise auditing and fast revocation.
4. **Audit regularly**: review all Service Accounts and PATs quarterly and delete those no longer in use.
5. **Least privilege**: grant only the minimum Project Role; do not give organization-level Owner (unless truly required).
6. **assertion JWT lifetime**: 5 minutes is recommended, and at most 1 hour.
7. **Do not log tokens**: ensure application logs do not output the raw access token.
:::

---

<NextSteps
  :steps="[
    { text: 'OIDC / OAuth2 Integration (Browser Login)', link: '/en/platform/auth/oidc', primary: true },
    { text: 'Identity Authentication Overview and Entry Points', link: '/en/platform/auth/' },
    { text: 'Authentication Console', link: 'https://auth.lurus.cn', external: true },
  ]"
  title="Next Steps"
/>

<RelatedProducts product-id="auth" />

## Reference Links

- [Casdoor: Service Account Authentication Overview](https://casdoor.com/docs/guides/integrate/service-accounts/authenticate-service-accounts) · [PAT](https://casdoor.com/docs/guides/integrate/service-accounts/personal-access-token) · [Client Credentials](https://casdoor.com/docs/guides/integrate/service-accounts/client-credentials) · [Private Key JWT](https://casdoor.com/docs/guides/integrate/service-accounts/private-key-jwt) · [Accessing Casdoor APIs](https://casdoor.com/docs/guides/integrate/casdoor-apis/access-casdoor-apis)
- [RFC 7523: JWT Bearer Token Grant](https://datatracker.ietf.org/doc/html/rfc7523)

</div>

<style scoped>
.auth-api-page .lurus-stat-strip { margin: 1.5rem 0 0.5rem; }
</style>
