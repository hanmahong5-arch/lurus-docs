---
title: API 认证 | Zitadel 身份认证
description: Service User、Personal Access Token、JWT Profile 与 Client Credentials 的完整说明，涵盖 Lurus 所有机器对机器认证场景。
---

# API 认证（机器对机器）

本页面面向需要进行**机器对机器（M2M）认证**的开发者和 DevOps 工程师。与终端用户通过浏览器登录的 OIDC 流程不同，M2M 认证使用 Zitadel 的 **Service Account**（服务账号），无需人工干预即可获取 access token。

Lurus 的 Zitadel 实例部署于 `https://auth.lurus.cn`，以下所有端点均以此为基础。

---

## 三种认证方式对比

| 方式 | 适用场景 | 权限模型 | Token 有效期 |
|------|---------|---------|------------|
| **Personal Access Token (PAT)** | 个人用户的脚本、开发调试、CI 临时调用 | 继承所属 Service Account 的全部权限 | 长期（可自定义过期，默认无限期） |
| **Service Account + Client Credentials** | 后台定时任务、服务间 REST 调用、简单机器账号 | 需要单独通过 User Grant 分配 Project Role | access token 约 1 小时，需自动刷新 |
| **Service Account + JWT Profile** | 高安全场景、生产服务、K8s 工作负载 | 需要单独通过 User Grant 分配 Project Role | assertion JWT 最长 5 分钟，access token 约 12 小时 |

::: tip 选型建议
- **调试 / 临时脚本**：PAT 最简单，直接粘贴 header 即用。
- **生产机器账号**：优先 JWT Profile，私钥轮换不依赖 secret 分发。
- **简单内部服务**：Client Credentials 是 JWT Profile 的简化替代。
:::

---

## 一、Personal Access Token (PAT)

PAT 是一种**即用型 token**，可直接作为 Bearer token 放入 `Authorization` header，无需先换取 access token。

### 1.1 创建 PAT

1. 访问 [auth.lurus.cn](https://auth.lurus.cn) 控制台。
2. 进入 **Users → Service Accounts**（若账号归属于某 Organization，在该 Organization 上下文内操作）。
3. 点击 **New** 创建服务账号，填写用户名（建议命名规范见[第三节](#三service-account-服务账号)）和显示名称。
4. 进入账号详情，点击左侧菜单 **Personal Access Tokens**。
5. 点击 **New**，按需设置过期时间（留空则永不过期）。
6. 复制生成的 token——**此 token 只显示一次，关闭弹窗后无法再查看**。

### 1.2 使用 PAT

将 PAT 作为标准 Bearer token 附加在每个请求 header 中：

```bash
# 查询当前账号所在组织
curl --request GET \
  --url https://auth.lurus.cn/management/v1/orgs/me \
  --header 'Authorization: Bearer <PAT>'
```

```bash
# 调用 Zitadel v2 API 示例
curl --request GET \
  --url https://auth.lurus.cn/v2/users/me \
  --header 'Authorization: Bearer <PAT>'
```

PAT 可访问所有该 Service Account 被授权的 Zitadel API，无需额外请求 audience scope。

### 1.3 适用的 Lurus 场景

- 运维脚本：通过 Management API 批量查询或修改用户
- `2l-svc-zitadel-mcp` MCP Server 访问 Zitadel Management API
- CI/CD Pipeline 中的临时管理操作
- 本地开发时快速测试 Zitadel API

### 1.4 安全注意事项

::: warning PAT 安全规范
- PAT 只显示一次，创建后立即保存到安全的密钥管理工具（如 Kubernetes Secret、Vault）。
- **永远不要将 PAT 提交到 Git 仓库**。
- 为每个独立用途创建独立的 PAT；不要共用。
- 定期在控制台审计并删除不再使用的 PAT。
- PAT 泄漏后，攻击者可持续使用直至 PAT 过期或被手动删除——泄漏后立即在控制台删除对应 PAT。
:::

---

## 二、Service Account（服务账号）

Service Account 是 Zitadel 中代表**非人类实体**的账号类型，专为机器对机器通信设计。与 Human User 的主要区别：

| 属性 | Human User | Service Account |
|------|-----------|----------------|
| 登录方式 | 密码 / Passkey / MFA | 无交互登录；仅支持 PAT 或 token 换取 |
| 多因素认证 | 支持 | 不适用 |
| 出现在 OIDC session | 是 | 否 |
| 权限分配 | 通过 Grant 或 Organization Role | 通过 User Grant 关联到 Project Role |

### 2.1 创建 Service Account

1. 控制台进入目标 Organization。
2. 点击 **Users → Service Accounts → New**。
3. 填写用户名和显示名称，点击 **Create**。

**命名约定**（建议统一遵守）：

```
svc-<service>-<purpose>
```

示例：
- `svc-lurus-api-platform-client` — lurus-api 服务调用 platform 内部接口
- `svc-ci-deploy` — CI/CD 部署流程专用账号
- `svc-zitadel-mcp-admin` — Zitadel MCP Server 管理用账号

### 2.2 分配权限

Service Account 创建后默认无任何权限。通过以下步骤分配角色：

1. 进入对应的 **Project**。
2. 点击 **User Grants → New**。
3. 选择目标 Service Account 用户名。
4. 分配所需的 Project Role（如 `admin`、`viewer`）。

::: tip 最小权限原则
每个 Service Account 只授予完成其任务所需的最低权限。例如，只读任务不要授予 `admin` 角色。
:::

---

## 三、Client Credentials（最简机器账号调用方式）

Client Credentials 是 OAuth 2.0 标准的授权类型，适合不需要强安全性的机器账号场景。

### 3.1 生成 Client Credentials

1. 进入 Service Account 详情页。
2. 点击 **Actions → Generate Client Secret**。
3. 记录 `Client ID` 和 `Client Secret`——**Client Secret 只显示一次**。

### 3.2 换取 access token

向 token 端点发送 `client_credentials` grant 请求：

::: code-group

```bash [curl]
curl --request POST \
  --url https://auth.lurus.cn/oauth/v2/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
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

```go [Go]
import (
    "net/http"
    "net/url"
    "strings"
    "encoding/json"
)

func getToken(clientID, clientSecret string) (string, error) {
    params := url.Values{
        "grant_type": {"client_credentials"},
        "scope":      {"openid profile"},
    }

    req, _ := http.NewRequest("POST",
        "https://auth.lurus.cn/oauth/v2/token",
        strings.NewReader(params.Encode()),
    )
    req.SetBasicAuth(clientID, clientSecret)
    req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", fmt.Errorf("token request: %w", err)
    }
    defer resp.Body.Close()

    var result struct {
        AccessToken string `json:"access_token"`
        ExpiresIn   int    `json:"expires_in"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return "", fmt.Errorf("decode response: %w", err)
    }
    return result.AccessToken, nil
}
```

:::

### 3.3 响应格式

```json
{
  "access_token": "MtjHodGy4zxKylDOhg6kW90WeEQs2q...",
  "token_type": "Bearer",
  "expires_in": 43199
}
```

- `expires_in`：单位秒，约 12 小时。
- 请自行实现 token 缓存与自动刷新（建议在过期前 5 分钟刷新）。

### 3.4 调用 API

```bash
curl --request GET \
  --url https://auth.lurus.cn/v2/users/me \
  --header "Authorization: Bearer $ACCESS_TOKEN"
```

---

## 四、JWT Profile（最安全的机器认证方式）

JWT Profile 使用非对称密钥：Service Account 持有**私钥**，Zitadel 保存对应的**公钥**。客户端用私钥签名一个短生命周期 JWT 作为 `client_assertion`，Zitadel 验签后颁发 access token。**私钥本身不通过网络传输**，因此是最安全的 M2M 认证方式。

### 4.1 生成密钥对

**方式 A：由 Zitadel 生成（推荐）**

1. 进入 Service Account 详情 → **Keys** 标签。
2. 点击 **New**，可选填过期时间。
3. 点击 **Download** 保存 JSON 密钥文件，妥善存储——**此文件只能下载一次**。

**方式 B：外部生成后上传公钥**

```bash
# 生成 2048-bit RSA 密钥对
openssl genrsa -out privatekey.pem 2048
openssl rsa -in privatekey.pem -pubout -out publickey.pem
```

然后通过 Zitadel User Service API 上传 `publickey.pem`。

### 4.2 JSON 密钥文件格式

Zitadel 下载的 JSON 文件结构如下：

```json
{
  "type": "serviceaccount",
  "keyId": "100509901696068329",
  "key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n",
  "userId": "100507859606888466"
}
```

| 字段 | 含义 |
|------|------|
| `keyId` | 对应 JWT header 中的 `kid`（Key ID） |
| `key` | RSA 私钥（PEM 格式），用于签名 assertion JWT |
| `userId` | Service Account 的用户 ID，用于 `iss` 和 `sub` |

### 4.3 构造 JWT Assertion

**Header：**

```json
{
  "alg": "RS256",
  "kid": "<keyId>"
}
```

**Payload：**

```json
{
  "iss": "<userId>",
  "sub": "<userId>",
  "aud": "https://auth.lurus.cn",
  "iat": 1714000000,
  "exp": 1714000300
}
```

| Claim | 说明 |
|-------|------|
| `iss` | JSON 文件中的 `userId` |
| `sub` | 同 `iss`（代表请求方即应用本身） |
| `aud` | Zitadel 实例域名：`https://auth.lurus.cn` |
| `iat` | 当前 UTC Unix 时间戳 |
| `exp` | 过期时间，建议 `iat + 300`（5 分钟）；**最长不超过 1 小时** |

::: warning 时钟同步
`iat` 不得比 Zitadel 服务器时间早超过 1 小时，否则 token 请求会被拒绝。确保机器 NTP 同步正常。
:::

### 4.4 换取 access token

::: code-group

```bash [curl]
# 1. 先手动签名 JWT（此处为示意；实际用代码库完成）
ASSERTION="<base64url-header>.<base64url-payload>.<base64url-signature>"

# 2. 请求 token
curl --request POST \
  --url https://auth.lurus.cn/oauth/v2/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer' \
  --data 'scope=openid profile' \
  --data "assertion=$ASSERTION"
```

```typescript [Node.js]
import * as fs from 'fs'
import * as jwt from 'jsonwebtoken'

interface KeyFile {
  keyId: string
  key: string
  userId: string
}

async function getToken(keyFilePath: string): Promise<string> {
  const keyFile: KeyFile = JSON.parse(fs.readFileSync(keyFilePath, 'utf-8'))

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: keyFile.userId,
    sub: keyFile.userId,
    aud: 'https://auth.lurus.cn',
    iat: now,
    exp: now + 300, // 5 minutes
  }

  const assertion = jwt.sign(payload, keyFile.key, {
    algorithm: 'RS256',
    keyid: keyFile.keyId,
  })

  const params = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    scope: 'openid profile',
    assertion,
  })

  const response = await fetch('https://auth.lurus.cn/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  const data = await response.json()
  return data.access_token
}
```

```go [Go]
import (
    "crypto/rsa"
    "crypto/x509"
    "encoding/json"
    "encoding/pem"
    "fmt"
    "net/http"
    "net/url"
    "os"
    "strings"
    "time"

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
import json
import time
import jwt          # pip install PyJWT
import requests

def get_token(key_file_path: str) -> str:
    with open(key_file_path) as f:
        key_data = json.load(f)

    now = int(time.time())
    payload = {
        "iss": key_data["userId"],
        "sub": key_data["userId"],
        "aud": "https://auth.lurus.cn",
        "iat": now,
        "exp": now + 300,  # 5 minutes
    }

    assertion = jwt.encode(
        payload,
        key_data["key"],
        algorithm="RS256",
        headers={"kid": key_data["keyId"]},
    )

    response = requests.post(
        "https://auth.lurus.cn/oauth/v2/token",
        data={
            "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
            "scope": "openid profile",
            "assertion": assertion,
        },
    )
    response.raise_for_status()
    return response.json()["access_token"]
```

:::

### 4.5 响应格式

```json
{
  "access_token": "MtjHodGy4zxKylDOhg6kW90WeEQs2q...",
  "token_type": "Bearer",
  "expires_in": 43199
}
```

access token 约 12 小时有效，建议在过期前主动刷新（重新签名 assertion → 重新请求 token）。

---

## 五、请求正确的 Audience

Zitadel 会验证 access token 的 **audience（aud）** 字段。对不同目标 API，需要在 scope 中声明对应的 audience。

### 5.1 访问 Zitadel 自身 API（Management / Admin / Auth API）

```
scope=openid profile urn:zitadel:iam:org:project:id:zitadel:aud
```

这个保留 scope 会将 Zitadel 项目加入 token 的 audience，Management API 等会拒绝不含此 audience 的 token。

**示例（Client Credentials 换 token 时附加此 scope）：**

```bash
curl --request POST \
  --url https://auth.lurus.cn/oauth/v2/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --user "$CLIENT_ID:$CLIENT_SECRET" \
  --data 'grant_type=client_credentials' \
  --data 'scope=openid profile urn:zitadel:iam:org:project:id:zitadel:aud'
```

### 5.2 访问自定义 Project 的资源服务

```
scope=openid profile urn:zitadel:iam:org:project:id:<your_project_id>:aud
```

将 `<your_project_id>` 替换为目标 Project 的实际 ID（可在控制台 Project 详情页查看）。

### 5.3 常见错误

| 现象 | 原因 | 解决 |
|------|------|------|
| API 返回 `403 Forbidden` | token audience 不包含目标 API | 换 token 时加上对应 `urn:zitadel:iam:...` scope |
| API 返回 `401 Unauthorized` | token 过期或签名无效 | 检查时钟同步，重新获取 token |
| token 请求返回 `invalid_grant` | assertion 过期（超过 5 分钟）或 `aud` 不正确 | 检查 assertion 的 `exp` 和 `aud` 字段 |

---

## 六、Token 管理：撤销 / 轮换 / 过期

### 6.1 PAT

- PAT 没有自动过期机制（除非创建时设置了过期日期）。
- 在控制台 **Personal Access Tokens** 列表中手动删除即可撤销。
- 建议每季度审计一次：删除未使用或所属人已离职的 PAT。

### 6.2 Client Credentials

- Client Secret 本身无过期，但换取的 access token 约 12 小时后过期。
- 若需轮换 Client Secret：在控制台重新执行 **Generate Client Secret**，旧 secret 立即失效。
- 业务代码应实现 token 缓存：记录 `expires_in`，在过期前主动重新请求。

### 6.3 JWT Profile 私钥

- JSON 密钥文件一旦泄露，攻击者可用其签名 assertion 换取 token。
- 轮换方式：在控制台 **Keys** 标签新增一个 Key，更新服务读取的 keyfile，确认新 key 生效后删除旧 Key。
- 建议在 Kubernetes 中以 Secret 挂载 keyfile，而不是打入镜像：

```yaml
# 示例：将 Zitadel keyfile 作为 K8s Secret
apiVersion: v1
kind: Secret
metadata:
  name: zitadel-service-account-key
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
# Deployment 中挂载
volumes:
  - name: zitadel-key
    secret:
      secretName: zitadel-service-account-key
containers:
  - name: app
    volumeMounts:
      - name: zitadel-key
        mountPath: /secrets/zitadel
        readOnly: true
    env:
      - name: ZITADEL_KEY_FILE
        value: /secrets/zitadel/key.json
```

---

## 七、Lurus 内部服务的认证场景

以下说明 Lurus 各内部服务使用 M2M 认证的具体方式：

| 服务 | 认证场景 | 推荐方式 |
|------|---------|---------|
| **2l-svc-zitadel-mcp** | 调用 Zitadel Management API，管理用户和权限 | PAT（运维工具场景）或 Service Account + JWT Profile |
| **2b-svc-api (Hub)** | 后端服务验证前端 OIDC token；自身调用 platform 内部接口 | 前端用户 OIDC token；平台调用用 `INTERNAL_API_KEY`（bearer_internal_key 模式） |
| **2l-svc-platform** | 提供内部 API（`/internal/v1/...`），由 Hub 等消费方调用 | `bearer_internal_key`（非 Zitadel 认证，平台内部约定） |
| **CI/CD Pipeline** | 部署时查询或更新集群资源 | 独立 Service Account + PAT，每个流程独立账号 |
| **定时后台任务** | 独立 Job，无用户上下文 | Service Account + Client Credentials 或 JWT Profile |

::: info 关于 `bearer_internal_key`
`lurus-platform` 的内部 API（service: `platform-core.lurus-platform.svc:18104`）使用独立的 `INTERNAL_API_KEY` 机制而非 Zitadel token，该 key 通过 Kubernetes Secret 分发给消费方。详见 `lurus.yaml` 的 `capabilities` 部分。
:::

---

## 八、安全最佳实践

::: warning 生产环境强制要求
1. **永远不要将 PAT、Client Secret、私钥文件提交到 Git 仓库**——即使是私有仓库。
2. **生产环境优先使用 JWT Profile**：私钥轮换无需协调所有消费方更新 secret，安全边界更清晰。
3. **每个 CI 任务或服务使用独立 Service Account**，不同职责不共用凭证，便于精确审计和快速撤销。
4. **定期审计**：每季度检查控制台中所有 Service Account 和 PAT，删除不再使用的账号和 token。
5. **最小权限**：Service Account 只授予完成其职责所需的最低 Project Role，不授予组织级 Owner 权限（除非确实需要）。
6. **assertion JWT 有效期**：JWT Profile 的 assertion 建议设置 5 分钟，最长不超过 1 小时。
7. **token 不要记日志**：确保应用日志中不会输出 access token 原文。
:::

---

## 参考链接

- [Zitadel：Service Account 认证概述](https://zitadel.com/docs/guides/integrate/service-accounts/authenticate-service-accounts)
- [Zitadel：Personal Access Token](https://zitadel.com/docs/guides/integrate/service-accounts/personal-access-token)
- [Zitadel：Client Credentials](https://zitadel.com/docs/guides/integrate/service-accounts/client-credentials)
- [Zitadel：Private Key JWT](https://zitadel.com/docs/guides/integrate/service-accounts/private-key-jwt)
- [Zitadel：访问 Zitadel API](https://zitadel.com/docs/guides/integrate/zitadel-apis/access-zitadel-apis)
- [RFC 7523：JWT Bearer Token Grant](https://datatracker.ietf.org/doc/html/rfc7523)
