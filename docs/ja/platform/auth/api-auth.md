---
title: API 認証 | Casdoor ID 認証
description: Service User、Personal Access Token、JWT Profile、Client Credentials の完全な解説。Lurus のすべてのマシン間（M2M）認証シナリオを網羅します。
---

<div class="auth-api-page">

# API 認証（マシン間 / M2M） <StatusBadge status="live" />

M2M 認証向け：ブラウザの OIDC フローとは異なり、M2M では Casdoor の **Service Account**（サービスアカウント）を使い、人手を介さずに access token を取得します。Casdoor インスタンスは `https://identity.lurus.cn` で、以下のエンドポイントはすべてこれを基準とします。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">認証方式</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">RS256</span><span class="lurus-stat__label">JWT Profile 署名</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">≤5 分</span><span class="lurus-stat__label">assertion 有効期間</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">≈12 時間</span><span class="lurus-stat__label">access token 有効期間</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="layers" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">まずはブラウザでのログインを確認しますか？</p>
    <div class="lurus-callout__body">人間ユーザーのログインには <a href="/ja/platform/auth/oidc">OIDC / OAuth2 連携</a> を使います。本ページでは<strong>マシン間（M2M）</strong>——スクリプト、バックグラウンドジョブ、サービス間呼び出しのみを扱います。</div>
  </div>
</div>

## 3 つの認証方式の比較

最もシンプルな（PAT）から最も安全な（JWT Profile）まで、セキュリティと運用コストのバランスで選びます。

| 方式 | 適用シナリオ | 権限モデル | Token 有効期間 |
|------|---------|---------|------------|
| **Personal Access Token (PAT)** | 個人ユーザーのスクリプト、開発デバッグ、CI の一時的な呼び出し | 所属する Service Account の全権限を継承 | 長期（有効期限をカスタマイズ可能、デフォルトは無期限） |
| **Service Account + Client Credentials** | バックグラウンドの定期ジョブ、サービス間 REST 呼び出し、シンプルなマシンアカウント | User Grant で個別に Project Role の割り当てが必要 | access token は約 1 時間、自動更新が必要 |
| **Service Account + JWT Profile** | 高セキュリティのシナリオ、本番サービス、K8s ワークロード | User Grant で個別に Project Role の割り当てが必要 | assertion JWT は最長 5 分、access token は約 12 時間 |

::: tip 選定の指針
- **デバッグ / 一時的なスクリプト**：PAT が最もシンプルで、header に貼り付けるだけで使えます。
- **本番マシンアカウント**：JWT Profile を優先。秘密鍵のローテーションが secret の配布に依存しません。
- **シンプルな内部サービス**：Client Credentials は JWT Profile の簡易な代替手段です。
:::

---

## 一、Personal Access Token (PAT) <Badge text="即利用可" type="tip" />

PAT は**即利用可能な token** で、access token に交換せずに、そのまま Bearer token として `Authorization` header に入れます。

### 1.1 PAT の作成

<ol class="lurus-steps">
<li><a href="https://identity.lurus.cn">identity.lurus.cn</a> コンソールにログインします。</li>
<li><strong>Users → Service Accounts</strong> に進みます（アカウントが特定の Organization に属する場合は、そのコンテキスト内で操作します）。</li>
<li><strong>New</strong> でサービスアカウントを作成し、ユーザー名（命名規則は<a href="#三service-account-服务账号">第三節</a>を参照）と表示名を入力します。</li>
<li>アカウント詳細 → <strong>Personal Access Tokens</strong> → <strong>New</strong> で、必要に応じて有効期限を設定します（空欄なら無期限）。</li>
<li>token をコピーします——<strong>一度しか表示されず、ダイアログを閉じると再確認できません</strong>。</li>
</ol>

### 1.2 PAT の使用

標準の Bearer token として各リクエストの header に付与します。その Service Account に認可されているすべての Casdoor API にアクセスでき、追加の audience scope は不要です。

```bash
# 查询当前账号所在组织
curl -X GET https://identity.lurus.cn/management/v1/orgs/me \
  -H 'Authorization: Bearer <PAT>'
# 调用 v2 API
curl -X GET https://identity.lurus.cn/v2/users/me \
  -H 'Authorization: Bearer <PAT>'
```

### 1.3 適用される Lurus のシナリオ

- 運用スクリプト：Management API でユーザーを一括照会または変更
- `2l-svc-casdoor-mcp` MCP Server による Casdoor Management API へのアクセス
- CI/CD パイプラインでの一時的な管理操作；ローカル開発での Casdoor API の簡易テスト

### 1.4 セキュリティ上の注意

::: warning PAT セキュリティ規約
- 一度しか表示されないため、作成後すぐに鍵管理ツール（K8s Secret、Vault）に保管します。
- **絶対に Git リポジトリにコミットしないでください**。用途ごとに独立した PAT を使い、共用しないでください。
- 使われなくなった PAT は定期的に監査して削除します。漏洩した場合は直ちにコンソールで削除します（攻撃者は PAT が失効または削除されるまで利用できます）。
:::

---

## 二、Service Account（サービスアカウント）

**非人間エンティティ**を表すアカウントタイプで、M2M 専用に設計されています。Human User との違い：

| 属性 | Human User | Service Account |
|------|-----------|----------------|
| ログイン方式 | パスワード / Passkey / MFA | 対話的ログインなし；PAT または token 交換のみ |
| 多要素認証 | サポート | 該当なし |
| OIDC session に出現 | する | しない |
| 権限割り当て | Grant または Organization Role | User Grant で Project Role に関連付け |

### 2.1 Service Account の作成

コンソールで対象の Organization に進み → **Users → Service Accounts → New** で、ユーザー名と表示名を入力 → **Create**。

**命名規約** `svc-<service>-<purpose>`、例：
- `svc-lurus-api-platform-client` — lurus-api が platform 内部インターフェースを呼び出す
- `svc-ci-deploy` — CI/CD デプロイ専用
- `svc-casdoor-mcp-admin` — Casdoor MCP Server の管理用

### 2.2 権限の割り当て

作成直後はデフォルトで権限がありません。対応する **Project → User Grants → New** に進み → 対象の Service Account を選択 → Project Role（`admin`、`viewer` など）を割り当てます。

::: tip 最小権限の原則
タスク遂行に必要な最低限の権限のみを付与します。読み取り専用のタスクに `admin` を与えないでください。
:::

---

## 三、Client Credentials（最もシンプルなマシンアカウント呼び出し方式） <Badge text="標準 OAuth2" type="info" />

OAuth 2.0 標準の認可タイプで、高度なセキュリティを必要としないマシンアカウントのシナリオに適しています。

### 3.1 Client Credentials の生成

Service Account 詳細 → **Actions → Generate Client Secret** で、`Client ID` と `Client Secret` を記録します（**Secret は一度しか表示されません**）。

### 3.2 access token への交換

token エンドポイントに `client_credentials` grant リクエストを送信します：

::: code-group

```bash [curl]
curl -X POST https://identity.lurus.cn/oauth/v2/token \
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
const response = await fetch('https://identity.lurus.cn/oauth/v2/token', {
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

> Go の実装は TypeScript と同形です：`http.NewRequest` で上記の body を POST し + `req.SetBasicAuth(clientID, clientSecret)`、`access_token` をパースします。

### 3.3 レスポンス形式

```json
{ "access_token": "MtjHodGy4zxKylDOhg6kW90WeEQs2q...", "token_type": "Bearer", "expires_in": 43199 }
```

- `expires_in` は秒単位で、約 12 時間です。token のキャッシュと自動更新は自前で実装してください（失効の 5 分前に更新することを推奨）。

### 3.4 API の呼び出し

```bash
curl -X GET https://identity.lurus.cn/v2/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## 四、JWT Profile（最も安全なマシン認証方式） <Badge text="本番推奨" type="tip" />

非対称鍵を使用します：Service Account が**秘密鍵**を保持し、Casdoor が対応する**公開鍵**を保存します。クライアントは秘密鍵で短命の JWT に署名して `client_assertion` とし、Casdoor が署名を検証したうえで access token を発行します。**秘密鍵はネットワーク経由で送信されない**ため、最も安全な M2M 方式です。

### 4.1 鍵ペアの生成

**方式 A（推奨）**：Service Account 詳細 → **Keys** → **New**（有効期限は任意）→ **Download** で JSON 鍵ファイルを保存します（**ダウンロードは一度きり**）。

**方式 B**：外部で生成した公開鍵をアップロードします：

```bash
openssl genrsa -out privatekey.pem 2048
openssl rsa -in privatekey.pem -pubout -out publickey.pem
```

その後、Casdoor User Service API で `publickey.pem` をアップロードします。

### 4.2 JSON 鍵ファイルの形式

```json
{
  "type": "serviceaccount",
  "keyId": "100509901696068329",
  "key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n",
  "userId": "100507859606888466"
}
```

| フィールド | 意味 |
|------|------|
| `keyId` | JWT header 内の `kid`（Key ID）に対応 |
| `key` | RSA 秘密鍵（PEM）、assertion JWT の署名に使用 |
| `userId` | Service Account のユーザー ID、`iss` と `sub` に使用 |

### 4.3 JWT Assertion の構築

**Header**：`{ "alg": "RS256", "kid": "<keyId>" }`

**Payload**：

```json
{ "iss": "<userId>", "sub": "<userId>", "aud": "https://identity.lurus.cn", "iat": 1714000000, "exp": 1714000300 }
```

| Claim | 説明 |
|-------|------|
| `iss` | JSON ファイル内の `userId` |
| `sub` | `iss` と同じ（リクエスト元、すなわちアプリケーション自身を表す） |
| `aud` | Casdoor インスタンスのドメイン：`https://identity.lurus.cn` |
| `iat` | 現在の UTC Unix タイムスタンプ |
| `exp` | 失効時刻。`iat + 300`（5 分）を推奨；**最長でも 1 時間を超えない** |

::: warning 時刻同期
`iat` は Casdoor サーバー時刻より 1 時間以上早くてはならず、そうでないと token リクエストが拒否されます。マシンの NTP 同期が正常であることを確認してください。
:::

### 4.4 access token への交換

curl のフロー：まずコードライブラリで assertion を署名し、次に POST で token に交換します。Go / Node.js / Python などはそれぞれの JWT ライブラリ（`golang-jwt`、`jsonwebtoken`、`PyJWT`）を使い、4.3 の header/payload を `RS256` で署名し、`assertion` を送信します。

::: code-group

```bash [curl]
# 1. 先用代码库签名 JWT（示意）
ASSERTION="<base64url-header>.<base64url-payload>.<base64url-signature>"
# 2. 请求 token
curl -X POST https://identity.lurus.cn/oauth/v2/token \
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
        "aud": jwt.ClaimStrings{"https://identity.lurus.cn"},
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
        "https://identity.lurus.cn/oauth/v2/token",
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
            "aud": "https://identity.lurus.cn", "iat": now, "exp": now + 300,
        },
        key_data["key"], algorithm="RS256",
        headers={"kid": key_data["keyId"]},
    )
    response = requests.post(
        "https://identity.lurus.cn/oauth/v2/token",
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
    { iss: keyData.userId, sub: keyData.userId, aud: 'https://identity.lurus.cn', iat: now, exp: now + 300 },
    keyData.key,
    { algorithm: 'RS256', keyid: keyData.keyId }
  );

  const params = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    scope: 'openid profile',
    assertion,
  });
  const resp = await fetch('https://identity.lurus.cn/oauth/v2/token', {
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

### 4.5 レスポンス形式

3.3 と同じ（access token は約 12 時間）。失効前に自前で更新します（assertion を再署名 → token を再リクエスト）。

---

## 五、正しい Audience をリクエストする

Casdoor は access token の **audience（aud）** フィールドを検証します。対象 API ごとに、scope で対応する audience を宣言します。

**Casdoor 自身の API にアクセスする場合**（Management / Admin / Auth）：`scope=openid profile urn:casdoor:iam:org:project:id:casdoor:aud`。この予約 scope は Casdoor プロジェクトを token の audience に加えます。Management API などは、この audience を含まない token を拒否します。

```bash
curl -X POST https://identity.lurus.cn/oauth/v2/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --user "$CLIENT_ID:$CLIENT_SECRET" \
  --data 'grant_type=client_credentials' \
  --data 'scope=openid profile urn:casdoor:iam:org:project:id:casdoor:aud'
```

**カスタム Project のリソースサービスにアクセスする場合**：`scope=openid profile urn:casdoor:iam:org:project:id:<your_project_id>:aud`（`<your_project_id>` はコンソールの Project 詳細ページで確認します）。

### よくあるエラー

| 現象 | 原因 | 解決 |
|------|------|------|
| `403 Forbidden` | token の audience に対象 API が含まれていない | token 交換時に対応する `urn:casdoor:iam:...` scope を追加する |
| `401 Unauthorized` | token が失効しているか署名が無効 | 時刻同期を確認し、token を再取得する |
| `invalid_grant` | assertion の失効（>5 分）または `aud` が不正 | assertion の `exp` と `aud` を確認する |

---

## 六、Token 管理：失効 / ローテーション / 期限切れ

- **PAT**：自動失効なし（作成時に有効期限を設定した場合を除く）。コンソールの **Personal Access Tokens** 一覧で手動削除すると失効します。四半期ごとに監査し、未使用または退職者の PAT を削除することを推奨します。
- **Client Credentials**：Secret に有効期限はなく、交換した access token は約 12 時間で失効します。Secret のローテーション：コンソールで再度 **Generate Client Secret** を行います（旧 secret は即座に無効化）。業務コードでは `expires_in` を記録し、失効前に自前で再リクエストします。
- **JWT Profile 秘密鍵**：JSON 鍵が漏洩すると、攻撃者が assertion に署名して token に交換できます。ローテーション：**Keys** タブで Key を新規追加 → サービスが読み取る keyfile を更新 → 新 key の有効化を確認してから旧 Key を削除します。keyfile は K8s Secret としてマウントし、イメージに焼き込まないことを推奨します：

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
# Deployment 中挂载
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

## 七、Lurus 内部サービスの認証シナリオ

| サービス | 認証シナリオ | 推奨方式 |
|------|---------|---------|
| **2l-svc-casdoor-mcp** | Casdoor Management API を呼び出してユーザー/権限を管理 | PAT（運用）または Service Account + JWT Profile |
| **2b-svc-api (Hub)** | フロントエンドの OIDC token をバックエンドで検証；platform 内部インターフェースを呼び出す | フロントエンドユーザーは OIDC token；プラットフォーム呼び出しは `INTERNAL_API_KEY`（bearer_internal_key モード） |
| **2l-svc-platform** | 内部 API（`/internal/v1/...`）を提供し、Hub などが消費する | `bearer_internal_key`（Casdoor ではなく、プラットフォーム内部の取り決め） |
| **CI/CD パイプライン** | デプロイ時にクラスタリソースを照会/更新 | 独立した Service Account + PAT、フローごとに独立したアカウント |
| **定期バックグラウンドジョブ** | 独立した Job、ユーザーコンテキストなし | Service Account + Client Credentials または JWT Profile |

::: info `bearer_internal_key` について
`lurus-platform` の内部 API（service: `platform-core.lurus-platform.svc:18104`）は Casdoor token ではなく独立した `INTERNAL_API_KEY` を使い、この key は K8s Secret を通じて消費側に配布されます。詳細は `lurus.yaml` の `capabilities` セクションを参照してください。
:::

---

## 八、セキュリティのベストプラクティス

::: warning 本番環境での必須要件
1. **PAT、Client Secret、秘密鍵ファイルを決して Git にコミットしない**（プライベートリポジトリであっても）。
2. **本番では JWT Profile を優先**：秘密鍵のローテーションがすべての消費側の secret 更新を調整する必要がなく、セキュリティ境界がより明確です。
3. **CI タスク/サービスごとに独立した Service Account を使う**：精密な監査と迅速な失効が容易になります。
4. **定期監査**：四半期ごとにすべての Service Account と PAT を点検し、使われていないものを削除します。
5. **最小権限**：最低限の Project Role のみを付与し、組織レベルの Owner を与えない（本当に必要な場合を除く）。
6. **assertion JWT の有効期間**：5 分を推奨、最長でも 1 時間を超えない。
7. **token をログに記録しない**：アプリケーションログに access token の原文が出力されないことを確認します。
:::

---

<NextSteps
  :steps="[
    { text: 'OIDC / OAuth2 連携（ブラウザログイン）', link: '/ja/platform/auth/oidc', primary: true },
    { text: 'ID 認証の概要と接続ポイント', link: '/ja/platform/auth/' },
    { text: '認証コンソール', link: 'https://identity.lurus.cn', external: true },
  ]"
  title="次のステップ"
/>

<RelatedProducts product-id="auth" />

## 参考リンク

- [Casdoor：Service Account 認証の概要](https://casdoor.com/docs/guides/integrate/service-accounts/authenticate-service-accounts) · [PAT](https://casdoor.com/docs/guides/integrate/service-accounts/personal-access-token) · [Client Credentials](https://casdoor.com/docs/guides/integrate/service-accounts/client-credentials) · [Private Key JWT](https://casdoor.com/docs/guides/integrate/service-accounts/private-key-jwt) · [Casdoor API へのアクセス](https://casdoor.com/docs/guides/integrate/casdoor-apis/access-casdoor-apis)
- [RFC 7523：JWT Bearer Token Grant](https://datatracker.ietf.org/doc/html/rfc7523)

</div>

<style scoped>
.auth-api-page .lurus-stat-strip { margin: 1.5rem 0 0.5rem; }
</style>
