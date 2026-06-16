---
title: API 인증 | Zitadel 신원 인증
description: Service User, Personal Access Token, JWT Profile, Client Credentials에 대한 완전한 설명으로 Lurus의 모든 머신 대 머신 인증 시나리오를 다룹니다.
---

<div class="auth-api-page">

# API 인증(머신 대 머신) <StatusBadge status="live" />

M2M 인증을 대상으로 합니다. 브라우저 OIDC 흐름과 달리 M2M는 Zitadel **Service Account**(서비스 계정)를 사용하며, 사람의 개입 없이 access token을 획득합니다. Zitadel 인스턴스는 `https://auth.lurus.cn`이며, 아래 엔드포인트는 모두 이를 기반으로 합니다.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">인증 방식</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">RS256</span><span class="lurus-stat__label">JWT Profile 서명</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">≤5분</span><span class="lurus-stat__label">assertion 유효 기간</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">≈12시간</span><span class="lurus-stat__label">access token 유효 기간</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="layers" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">브라우저 로그인을 먼저 보시겠어요?</p>
    <div class="lurus-callout__body">사람 사용자의 로그인은 <a href="/ko/platform/auth/oidc">OIDC / OAuth2 통합</a>을 사용합니다. 이 페이지는 <strong>머신 대 머신</strong>(스크립트, 백그라운드 작업, 서비스 간 호출)만 다룹니다.</div>
  </div>
</div>

## 세 가지 인증 방식 비교

가장 간단한 방식(PAT)부터 가장 안전한 방식(JWT Profile)까지, 보안성과 운영 비용을 기준으로 선택합니다.

| 방식 | 적용 시나리오 | 권한 모델 | Token 유효 기간 |
|------|---------|---------|------------|
| **Personal Access Token (PAT)** | 개인 사용자의 스크립트, 개발 디버깅, CI 임시 호출 | 소속 Service Account의 모든 권한을 상속 | 장기(만료를 직접 설정 가능, 기본값은 무기한) |
| **Service Account + Client Credentials** | 백그라운드 정기 작업, 서비스 간 REST 호출, 단순 머신 계정 | User Grant를 통해 Project Role을 별도로 할당해야 함 | access token 약 1시간, 자동 갱신 필요 |
| **Service Account + JWT Profile** | 고보안 시나리오, 프로덕션 서비스, K8s 워크로드 | User Grant를 통해 Project Role을 별도로 할당해야 함 | assertion JWT 최대 5분, access token 약 12시간 |

::: tip 선택 가이드
- **디버깅 / 임시 스크립트**: PAT가 가장 간단하며, header에 바로 붙여 사용합니다.
- **프로덕션 머신 계정**: JWT Profile을 우선하며, 개인 키 교체가 secret 배포에 의존하지 않습니다.
- **단순 내부 서비스**: Client Credentials는 JWT Profile의 간소화된 대안입니다.
:::

---

## 1. Personal Access Token (PAT) <Badge text="즉시 사용형" type="tip" />

PAT는 **즉시 사용형 token**으로, access token으로 교환할 필요 없이 Bearer token으로 바로 `Authorization` header에 넣습니다.

### 1.1 PAT 생성

<ol class="lurus-steps">
<li><a href="https://auth.lurus.cn">auth.lurus.cn</a> 콘솔에 로그인합니다.</li>
<li><strong>Users → Service Accounts</strong>로 이동합니다(계정이 특정 Organization에 속한 경우 해당 컨텍스트 내에서 작업).</li>
<li><strong>New</strong>로 서비스 계정을 생성하고, 사용자 이름(명명 규칙은 <a href="#3-service-account-서비스-계정">3절</a> 참조)과 표시 이름을 입력합니다.</li>
<li>계정 상세 → <strong>Personal Access Tokens</strong> → <strong>New</strong>에서 필요에 따라 만료 시간을 설정합니다(비워 두면 영구 만료 없음).</li>
<li>token을 복사합니다 — <strong>한 번만 표시되며, 팝업을 닫으면 다시 볼 수 없습니다</strong>.</li>
</ol>

### 1.2 PAT 사용

표준 Bearer token으로 모든 요청 header에 첨부합니다. 해당 Service Account가 인가받은 모든 Zitadel API에 접근할 수 있으며, 별도의 audience scope가 필요 없습니다.

```bash
# 查询当前账号所在组织
curl -X GET https://auth.lurus.cn/management/v1/orgs/me \
  -H 'Authorization: Bearer <PAT>'
# 调用 v2 API
curl -X GET https://auth.lurus.cn/v2/users/me \
  -H 'Authorization: Bearer <PAT>'
```

### 1.3 적용되는 Lurus 시나리오

- 운영 스크립트: Management API를 통해 사용자를 일괄 조회하거나 수정
- `2l-svc-zitadel-mcp` MCP Server가 Zitadel Management API에 접근
- CI/CD Pipeline의 임시 관리 작업; 로컬 개발에서 Zitadel API 빠른 테스트

### 1.4 보안 유의 사항

::: warning PAT 보안 규칙
- 한 번만 표시되므로, 생성 후 즉시 키 관리 도구(K8s Secret, Vault)에 저장합니다.
- **절대 Git 저장소에 커밋하지 마세요**. 용도마다 독립된 PAT를 사용하고 공유하지 않습니다.
- 더 이상 사용하지 않는 PAT는 정기적으로 감사하고 삭제합니다. 유출되면 즉시 콘솔에서 삭제합니다(공격자는 PAT가 만료되거나 삭제될 때까지 사용할 수 있음).
:::

---

## 2. Service Account(서비스 계정)

**비인간 엔터티**를 나타내는 계정 유형으로, M2M 전용으로 설계되었습니다. Human User와의 차이점:

| 속성 | Human User | Service Account |
|------|-----------|----------------|
| 로그인 방식 | 비밀번호 / Passkey / MFA | 대화형 로그인 없음; PAT 또는 token 교환만 |
| 다중 인증 | 지원 | 해당 없음 |
| OIDC session에 표시 | 예 | 아니오 |
| 권한 할당 | Grant 또는 Organization Role | User Grant를 통해 Project Role에 연결 |

### 2.1 Service Account 생성

콘솔에서 대상 Organization → **Users → Service Accounts → New**으로 이동하여 사용자 이름과 표시 이름을 입력 → **Create**.

**명명 규칙** `svc-<service>-<purpose>`, 예시:
- `svc-lurus-api-platform-client` — lurus-api가 platform 내부 인터페이스를 호출
- `svc-ci-deploy` — CI/CD 배포 전용
- `svc-zitadel-mcp-admin` — Zitadel MCP Server 관리용

### 2.2 권한 할당

생성 후에는 기본적으로 권한이 없습니다. 해당 **Project → User Grants → New** → 대상 Service Account 선택 → Project Role(`admin`, `viewer` 등) 할당으로 이동합니다.

::: tip 최소 권한 원칙
작업 수행에 필요한 최소 권한만 부여하며, 읽기 전용 작업에는 `admin`을 주지 않습니다.
:::

---

## 3. Client Credentials(가장 간단한 머신 계정 호출 방식) <Badge text="표준 OAuth2" type="info" />

OAuth 2.0 표준 권한 부여 유형으로, 강력한 보안이 필요하지 않은 머신 계정 시나리오에 적합합니다.

### 3.1 Client Credentials 생성

Service Account 상세 → **Actions → Generate Client Secret** → `Client ID`와 `Client Secret`을 기록합니다(**Secret은 한 번만 표시됨**).

### 3.2 access token 교환

token 엔드포인트로 `client_credentials` grant 요청을 보냅니다:

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

> Go 구현은 TypeScript와 동형입니다: `http.NewRequest` POST로 위 body + `req.SetBasicAuth(clientID, clientSecret)`, 그리고 `access_token`을 파싱합니다.

### 3.3 응답 형식

```json
{ "access_token": "MtjHodGy4zxKylDOhg6kW90WeEQs2q...", "token_type": "Bearer", "expires_in": 43199 }
```

- `expires_in` 단위는 초이며, 약 12시간입니다. token 캐싱과 자동 갱신을 직접 구현하세요(만료 5분 전 갱신 권장).

### 3.4 API 호출

```bash
curl -X GET https://auth.lurus.cn/v2/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## 4. JWT Profile(가장 안전한 머신 인증 방식) <Badge text="프로덕션 권장" type="tip" />

비대칭 키를 사용합니다: Service Account가 **개인 키**를 보유하고, Zitadel이 대응하는 **공개 키**를 저장합니다. 클라이언트는 개인 키로 짧은 수명의 JWT를 서명하여 `client_assertion`으로 사용하며, Zitadel이 서명을 검증한 후 access token을 발급합니다. **개인 키는 네트워크로 전송되지 않으므로** 가장 안전한 M2M 방식입니다.

### 4.1 키 쌍 생성

**방식 A(권장)**: Service Account 상세 → **Keys** → **New**(만료 시간 선택 가능) → **Download**로 JSON 키 파일을 저장합니다(**한 번만 다운로드 가능**).

**방식 B**: 외부에서 생성한 후 공개 키를 업로드:

```bash
openssl genrsa -out privatekey.pem 2048
openssl rsa -in privatekey.pem -pubout -out publickey.pem
```

그런 다음 Zitadel User Service API를 통해 `publickey.pem`을 업로드합니다.

### 4.2 JSON 키 파일 형식

```json
{
  "type": "serviceaccount",
  "keyId": "100509901696068329",
  "key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n",
  "userId": "100507859606888466"
}
```

| 필드 | 의미 |
|------|------|
| `keyId` | JWT header의 `kid`(Key ID)에 대응 |
| `key` | RSA 개인 키(PEM), assertion JWT 서명에 사용 |
| `userId` | Service Account 사용자 ID, `iss`와 `sub`에 사용 |

### 4.3 JWT Assertion 구성

**Header**: `{ "alg": "RS256", "kid": "<keyId>" }`

**Payload**:

```json
{ "iss": "<userId>", "sub": "<userId>", "aud": "https://auth.lurus.cn", "iat": 1714000000, "exp": 1714000300 }
```

| Claim | 설명 |
|-------|------|
| `iss` | JSON 파일의 `userId` |
| `sub` | `iss`와 동일(요청자, 즉 애플리케이션 자신을 나타냄) |
| `aud` | Zitadel 인스턴스 도메인: `https://auth.lurus.cn` |
| `iat` | 현재 UTC Unix 타임스탬프 |
| `exp` | 만료, `iat + 300`(5분) 권장; **최대 1시간 초과 불가** |

::: warning 시계 동기화
`iat`는 Zitadel 서버 시간보다 1시간 이상 빠르면 안 되며, 그렇지 않으면 token 요청이 거부됩니다. 머신의 NTP 동기화가 정상인지 확인하세요.
:::

### 4.4 access token 교환

curl 흐름: 먼저 코드 라이브러리로 assertion을 서명한 후, POST로 token을 교환합니다. Go / Node.js / Python 등은 각자의 JWT 라이브러리(`golang-jwt`, `jsonwebtoken`, `PyJWT`)로 4.3의 header/payload를 `RS256`으로 서명하고 `assertion`을 제출합니다.

::: code-group

```bash [curl]
# 1. 先用代码库签名 JWT（示意）
ASSERTION="<base64url-header>.<base64url-payload>.<base64url-signature>"
# 2. 请求 token
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

### 4.5 응답 형식

3.3과 동일합니다(access token 약 12시간). 만료 전에 능동적으로 갱신합니다(assertion 재서명 → token 재요청).

---

## 5. 올바른 Audience 요청

Zitadel은 access token의 **audience(aud)** 필드를 검증합니다. 대상 API가 다를 경우, scope에 해당 audience를 선언합니다.

**Zitadel 자체 API 접근**(Management / Admin / Auth): `scope=openid profile urn:zitadel:iam:org:project:id:zitadel:aud`. 이 예약 scope는 Zitadel 프로젝트를 token의 audience에 추가하며, Management API 등은 이 audience를 포함하지 않은 token을 거부합니다.

```bash
curl -X POST https://auth.lurus.cn/oauth/v2/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --user "$CLIENT_ID:$CLIENT_SECRET" \
  --data 'grant_type=client_credentials' \
  --data 'scope=openid profile urn:zitadel:iam:org:project:id:zitadel:aud'
```

**커스텀 Project의 리소스 서비스 접근**: `scope=openid profile urn:zitadel:iam:org:project:id:<your_project_id>:aud`(`<your_project_id>`는 콘솔의 Project 상세 페이지에서 확인).

### 자주 발생하는 오류

| 현상 | 원인 | 해결 |
|------|------|------|
| `403 Forbidden` | token audience에 대상 API가 없음 | token 교환 시 해당 `urn:zitadel:iam:...` scope를 추가 |
| `401 Unauthorized` | token 만료 또는 서명 무효 | 시계 동기화 확인, token 재획득 |
| `invalid_grant` | assertion 만료(>5분) 또는 `aud` 부정확 | assertion의 `exp`와 `aud` 확인 |

---

## 6. Token 관리: 폐기 / 교체 / 만료

- **PAT**: 자동 만료 없음(생성 시 만료일을 설정한 경우 제외). 콘솔 **Personal Access Tokens** 목록에서 수동 삭제하면 폐기됩니다. 분기마다 감사하여 미사용 또는 퇴사자의 PAT를 삭제하길 권장합니다.
- **Client Credentials**: Secret은 만료가 없으며, 교환한 access token은 약 12시간 후 만료됩니다. Secret 교체: 콘솔에서 **Generate Client Secret**를 다시 실행합니다(기존 secret은 즉시 무효화). 비즈니스 코드에서 `expires_in`을 기록하고, 만료 전에 능동적으로 재요청합니다.
- **JWT Profile 개인 키**: JSON 키가 유출되면 공격자가 assertion을 서명하여 token을 교환할 수 있습니다. 교체: **Keys** 탭에서 Key를 추가 → 서비스가 읽는 keyfile을 갱신 → 새 key가 적용된 것을 확인한 후 기존 Key를 삭제합니다. keyfile은 K8s Secret으로 마운트하고 이미지에 포함하지 않길 권장합니다:

```yaml
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

## 7. Lurus 내부 서비스의 인증 시나리오

| 서비스 | 인증 시나리오 | 권장 방식 |
|------|---------|---------|
| **2l-svc-zitadel-mcp** | Zitadel Management API를 호출하여 사용자/권한 관리 | PAT(운영) 또는 Service Account + JWT Profile |
| **2b-svc-api (Hub)** | 백엔드가 프론트엔드 OIDC token 검증; platform 내부 인터페이스 호출 | 프론트엔드 사용자는 OIDC token; 플랫폼 호출은 `INTERNAL_API_KEY`(bearer_internal_key 모드) 사용 |
| **2l-svc-platform** | 내부 API(`/internal/v1/...`) 제공, Hub 등이 소비 | `bearer_internal_key`(Zitadel 아님, 플랫폼 내부 약정) |
| **CI/CD Pipeline** | 배포 시 클러스터 리소스 조회/갱신 | 독립 Service Account + PAT, 프로세스마다 독립 계정 |
| **정기 백그라운드 작업** | 독립 Job, 사용자 컨텍스트 없음 | Service Account + Client Credentials 또는 JWT Profile |

::: info `bearer_internal_key`에 대하여
`lurus-platform` 내부 API(service: `platform-core.lurus-platform.svc:18104`)는 Zitadel token이 아닌 독립된 `INTERNAL_API_KEY`를 사용하며, 이 key는 K8s Secret을 통해 소비 측에 배포됩니다. 자세한 내용은 `lurus.yaml`의 `capabilities` 부분을 참조하세요.
:::

---

## 8. 보안 모범 사례

::: warning 프로덕션 환경 필수 요구 사항
1. **PAT, Client Secret, 개인 키 파일을 절대 Git에 커밋하지 마세요**(비공개 저장소라도).
2. **프로덕션에서는 JWT Profile을 우선**: 개인 키 교체 시 모든 소비 측의 secret 갱신을 조율할 필요가 없으며, 보안 경계가 더 명확합니다.
3. **각 CI 작업/서비스마다 독립된 Service Account 사용**: 정밀한 감사와 신속한 폐기에 유리합니다.
4. **정기 감사**: 분기마다 모든 Service Account와 PAT를 점검하고, 더 이상 사용하지 않는 것을 삭제합니다.
5. **최소 권한**: 최소한의 Project Role만 부여하고, 조직 수준 Owner는 부여하지 않습니다(확실히 필요한 경우 제외).
6. **assertion JWT 유효 기간**: 5분 권장, 최대 1시간 초과 불가.
7. **token을 로그에 기록하지 마세요**: 애플리케이션 로그가 access token 원문을 출력하지 않도록 합니다.
:::

---

<NextSteps
  :steps="[
    { text: 'OIDC / OAuth2 통합(브라우저 로그인)', link: '/ko/platform/auth/oidc', primary: true },
    { text: '신원 인증 개요 및 접속점', link: '/ko/platform/auth/' },
    { text: '인증 콘솔', link: 'https://auth.lurus.cn', external: true },
  ]"
  title="다음 단계"
/>

<RelatedProducts product-id="auth" />

## 참고 링크

- [Zitadel: Service Account 인증 개요](https://zitadel.com/docs/guides/integrate/service-accounts/authenticate-service-accounts) · [PAT](https://zitadel.com/docs/guides/integrate/service-accounts/personal-access-token) · [Client Credentials](https://zitadel.com/docs/guides/integrate/service-accounts/client-credentials) · [Private Key JWT](https://zitadel.com/docs/guides/integrate/service-accounts/private-key-jwt) · [Zitadel API 접근](https://zitadel.com/docs/guides/integrate/zitadel-apis/access-zitadel-apis)
- [RFC 7523: JWT Bearer Token Grant](https://datatracker.ietf.org/doc/html/rfc7523)

</div>

<style scoped>
.auth-api-page .lurus-stat-strip { margin: 1.5rem 0 0.5rem; }
</style>
