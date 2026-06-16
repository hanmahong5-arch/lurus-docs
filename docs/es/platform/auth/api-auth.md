---
title: Autenticación de API | Autenticación de identidad con Zitadel
description: Explicación completa de Service User, Personal Access Token, JWT Profile y Client Credentials, que cubre todos los escenarios de autenticación máquina a máquina de Lurus.
---

<div class="auth-api-page">

# Autenticación de API (máquina a máquina) <StatusBadge status="live" />

Orientada a la autenticación M2M: a diferencia del flujo OIDC del navegador, M2M usa la **Service Account** (cuenta de servicio) de Zitadel, obteniendo un access token sin intervención humana. Instancia de Zitadel `https://auth.lurus.cn`; los endpoints siguientes se basan todos en ella.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">métodos de autenticación</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">RS256</span><span class="lurus-stat__label">firma de JWT Profile</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">≤5 minutos</span><span class="lurus-stat__label">validez de la assertion</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">≈12 horas</span><span class="lurus-stat__label">validez del access token</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="layers" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">¿Buscas iniciar sesión con el navegador?</p>
    <div class="lurus-callout__body">El inicio de sesión de usuarios humanos usa la <a href="/es/platform/auth/oidc">integración OIDC / OAuth2</a>; esta página trata solo de <strong>máquina a máquina</strong>: scripts, tareas en segundo plano, llamadas entre servicios.</div>
  </div>
</div>

## Comparación de los tres métodos de autenticación

Del más simple (PAT) al más seguro (JWT Profile), equilibrando seguridad y coste operativo.

| Método | Escenario de uso | Modelo de permisos | Validez del token |
|------|---------|---------|------------|
| **Personal Access Token (PAT)** | Scripts de usuarios individuales, depuración de desarrollo, llamadas temporales de CI | Hereda todos los permisos de la Service Account a la que pertenece | A largo plazo (expiración personalizable, indefinida por defecto) |
| **Service Account + Client Credentials** | Tareas programadas en segundo plano, llamadas REST entre servicios, cuentas de máquina simples | Requiere asignar el Project Role por separado mediante User Grant | access token de aproximadamente 1 hora, requiere refresco automático |
| **Service Account + JWT Profile** | Escenarios de alta seguridad, servicios de producción, cargas de trabajo de K8s | Requiere asignar el Project Role por separado mediante User Grant | assertion JWT de 5 minutos como máximo, access token de aproximadamente 12 horas |

::: tip Recomendaciones de elección
- **Depuración / scripts temporales**: el PAT es lo más simple, basta con pegarlo en el header y usarlo.
- **Cuentas de máquina de producción**: preferir JWT Profile, la rotación de la clave privada no depende de la distribución de secrets.
- **Servicios internos simples**: Client Credentials es la alternativa simplificada a JWT Profile.
:::

---

## I. Personal Access Token (PAT) <Badge text="Listo para usar" type="tip" />

El PAT es un **token listo para usar**, se coloca directamente como Bearer token en el header `Authorization`, sin necesidad de cambiarlo primero por un access token.

### 1.1 Crear un PAT

<ol class="lurus-steps">
<li>Inicia sesión en la consola de <a href="https://auth.lurus.cn">auth.lurus.cn</a>.</li>
<li>Ve a <strong>Users → Service Accounts</strong> (si la cuenta pertenece a una Organization, opera dentro de ese contexto).</li>
<li><strong>New</strong> para crear una cuenta de servicio, rellena el nombre de usuario (las convenciones de nomenclatura están en la <a href="#iii-service-account-cuenta-de-servicio">sección tres</a>) y el nombre visible.</li>
<li>Detalles de la cuenta → <strong>Personal Access Tokens</strong> → <strong>New</strong>, configura la fecha de expiración según necesites (en blanco significa que nunca expira).</li>
<li>Copia el token: <strong>solo se muestra una vez, no se puede volver a ver después de cerrar el cuadro de diálogo</strong>.</li>
</ol>

### 1.2 Usar el PAT

Adjúntalo como Bearer token estándar en el header de cada petición; puede acceder a todas las API de Zitadel que esa Service Account tenga autorizadas, sin necesidad de un audience scope adicional.

```bash
# 查询当前账号所在组织
curl -X GET https://auth.lurus.cn/management/v1/orgs/me \
  -H 'Authorization: Bearer <PAT>'
# 调用 v2 API
curl -X GET https://auth.lurus.cn/v2/users/me \
  -H 'Authorization: Bearer <PAT>'
```

### 1.3 Escenarios aplicables en Lurus

- Scripts de operaciones: consultar o modificar usuarios en lote mediante la Management API
- El MCP Server `2l-svc-zitadel-mcp` accede a la Management API de Zitadel
- Operaciones de gestión temporales en el Pipeline de CI/CD; pruebas rápidas de la API de Zitadel en desarrollo local

### 1.4 Consideraciones de seguridad

::: warning Normas de seguridad del PAT
- Solo se muestra una vez; guárdalo de inmediato en una herramienta de gestión de secretos (K8s Secret, Vault) tras crearlo.
- **Nunca lo subas a un repositorio Git**. Usa un PAT independiente para cada propósito, no lo compartas.
- Audita y elimina periódicamente los PAT que ya no se usan; tras una fuga, elimínalo de inmediato en la consola (el atacante puede usarlo hasta que el PAT expire o se elimine).
:::

---

## II. Service Account (cuenta de servicio)

Tipo de cuenta que representa una **entidad no humana**, diseñada específicamente para M2M. Diferencias con un Human User:

| Atributo | Human User | Service Account |
|------|-----------|----------------|
| Forma de inicio de sesión | Contraseña / Passkey / MFA | Sin inicio de sesión interactivo; solo PAT o intercambio de token |
| Autenticación multifactor | Compatible | No aplica |
| Aparece en la sesión OIDC | Sí | No |
| Asignación de permisos | Grant o Organization Role | Vinculada a un Project Role mediante User Grant |

### 2.1 Crear una Service Account

En la consola, ve a la Organization objetivo → **Users → Service Accounts → New**, rellena el nombre de usuario y el nombre visible → **Create**.

**Convención de nomenclatura** `svc-<service>-<purpose>`, ejemplos:
- `svc-lurus-api-platform-client` — lurus-api llama a las interfaces internas de platform
- `svc-ci-deploy` — dedicada al despliegue de CI/CD
- `svc-zitadel-mcp-admin` — para la gestión del Zitadel MCP Server

### 2.2 Asignar permisos

Tras crearla, no tiene permisos por defecto. Ve al **Project → User Grants → New** correspondiente → selecciona la Service Account objetivo → asigna el Project Role (como `admin`, `viewer`).

::: tip Principio de privilegio mínimo
Otorga solo los permisos mínimos necesarios para completar la tarea; no des `admin` para tareas de solo lectura.
:::

---

## III. Client Credentials (la forma más simple de llamada para cuentas de máquina) <Badge text="OAuth2 estándar" type="info" />

Tipo de concesión estándar de OAuth 2.0, adecuado para escenarios de cuentas de máquina que no requieren alta seguridad.

### 3.1 Generar Client Credentials

Detalles de la Service Account → **Actions → Generate Client Secret** → anota el `Client ID` y el `Client Secret` (**el Secret solo se muestra una vez**).

### 3.2 Obtener un access token

Envía una petición de concesión `client_credentials` al endpoint de token:

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

> La implementación en Go es isomorfa a la de TypeScript: `http.NewRequest` POST con el body anterior + `req.SetBasicAuth(clientID, clientSecret)`, y parsea `access_token`.

### 3.3 Formato de respuesta

```json
{ "access_token": "MtjHodGy4zxKylDOhg6kW90WeEQs2q...", "token_type": "Bearer", "expires_in": 43199 }
```

- `expires_in` está en segundos, aproximadamente 12 horas. Implementa por tu cuenta el cacheo del token y el refresco automático (se recomienda refrescar 5 minutos antes de expirar).

### 3.4 Llamar a la API

```bash
curl -X GET https://auth.lurus.cn/v2/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## IV. JWT Profile (el método de autenticación de máquina más seguro) <Badge text="Recomendado para producción" type="tip" />

Usa claves asimétricas: la Service Account posee la **clave privada** y Zitadel guarda la **clave pública** correspondiente. El cliente firma un JWT de vida corta con la clave privada como `client_assertion`, y Zitadel emite un access token tras verificar la firma. **La clave privada no se transmite por la red**, siendo este el método M2M más seguro.

### 4.1 Generar el par de claves

**Opción A (recomendada)**: Detalles de la Service Account → **Keys** → **New** (fecha de expiración opcional) → **Download** para guardar el archivo de clave JSON (**solo se puede descargar una vez**).

**Opción B**: genera la clave externamente y sube la clave pública:

```bash
openssl genrsa -out privatekey.pem 2048
openssl rsa -in privatekey.pem -pubout -out publickey.pem
```

Luego sube `publickey.pem` mediante la User Service API de Zitadel.

### 4.2 Formato del archivo de clave JSON

```json
{
  "type": "serviceaccount",
  "keyId": "100509901696068329",
  "key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n",
  "userId": "100507859606888466"
}
```

| Campo | Significado |
|------|------|
| `keyId` | Corresponde al `kid` (Key ID) en el header del JWT |
| `key` | Clave privada RSA (PEM), usada para firmar el assertion JWT |
| `userId` | ID de usuario de la Service Account, usado para `iss` y `sub` |

### 4.3 Construir el JWT Assertion

**Header**: `{ "alg": "RS256", "kid": "<keyId>" }`

**Payload**:

```json
{ "iss": "<userId>", "sub": "<userId>", "aud": "https://auth.lurus.cn", "iat": 1714000000, "exp": 1714000300 }
```

| Claim | Descripción |
|-------|------|
| `iss` | El `userId` del archivo JSON |
| `sub` | Igual que `iss` (representa al solicitante, es decir, la propia aplicación) |
| `aud` | Dominio de la instancia de Zitadel: `https://auth.lurus.cn` |
| `iat` | Marca de tiempo Unix UTC actual |
| `exp` | Expiración, se recomienda `iat + 300` (5 minutos); **no más de 1 hora como máximo** |

::: warning Sincronización del reloj
`iat` no debe ser más de 1 hora anterior a la hora del servidor de Zitadel, de lo contrario la petición de token será rechazada. Asegúrate de que la sincronización NTP de la máquina funcione correctamente.
:::

### 4.4 Obtener un access token

Flujo con curl: primero firma el assertion con una biblioteca de código y luego haz un POST para cambiarlo por el token. Go / Node.js / Python, etc., usan sus respectivas bibliotecas JWT (`golang-jwt`, `jsonwebtoken`, `PyJWT`) para firmar el header/payload de la sección 4.3 con `RS256` y enviar el `assertion`.

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

### 4.5 Formato de respuesta

Igual que 3.3 (access token de aproximadamente 12 horas). Refréscalo de forma proactiva antes de que expire (vuelve a firmar el assertion → vuelve a solicitar el token).

---

## V. Solicitar el Audience correcto

Zitadel valida el campo **audience (aud)** del access token. Para distintas API objetivo, declara el audience correspondiente en el scope.

**Acceder a las propias API de Zitadel** (Management / Admin / Auth): `scope=openid profile urn:zitadel:iam:org:project:id:zitadel:aud`. Este scope reservado añade el proyecto de Zitadel al audience del token; la Management API y otras rechazarán los tokens que no contengan este audience.

```bash
curl -X POST https://auth.lurus.cn/oauth/v2/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --user "$CLIENT_ID:$CLIENT_SECRET" \
  --data 'grant_type=client_credentials' \
  --data 'scope=openid profile urn:zitadel:iam:org:project:id:zitadel:aud'
```

**Acceder al servicio de recursos de un Project personalizado**: `scope=openid profile urn:zitadel:iam:org:project:id:<your_project_id>:aud` (`<your_project_id>` se consulta en la página de detalles del Project en la consola).

### Errores comunes

| Síntoma | Causa | Solución |
|------|------|------|
| `403 Forbidden` | El audience del token no contiene la API objetivo | Añade el scope `urn:zitadel:iam:...` correspondiente al cambiar el token |
| `401 Unauthorized` | El token ha expirado o la firma es inválida | Verifica la sincronización del reloj y vuelve a obtener el token |
| `invalid_grant` | El assertion ha expirado (>5 minutos) o el `aud` es incorrecto | Verifica el `exp` y el `aud` del assertion |

---

## VI. Gestión de tokens: revocación / rotación / expiración

- **PAT**: sin expiración automática (a menos que se establezca una fecha de expiración al crearlo). En la lista de **Personal Access Tokens** de la consola, eliminarlo manualmente equivale a revocarlo. Se recomienda auditar cada trimestre y eliminar los PAT no usados o de personas que han dejado la empresa.
- **Client Credentials**: el Secret no expira, y el access token obtenido expira tras aproximadamente 12 horas. Rotar el Secret: vuelve a usar **Generate Client Secret** en la consola (el secret antiguo deja de ser válido de inmediato). El código de negocio registra `expires_in` y vuelve a solicitar de forma proactiva antes de que expire.
- **Clave privada de JWT Profile**: si la clave JSON se filtra, el atacante puede firmar assertions para obtener tokens. Rotación: añade una Key nueva en la pestaña **Keys** → actualiza el keyfile que lee el servicio → confirma que la nueva key surte efecto y elimina la Key antigua. Se recomienda montar el keyfile como K8s Secret, sin incluirlo en la imagen:

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

## VII. Escenarios de autenticación de los servicios internos de Lurus

| Servicio | Escenario de autenticación | Método recomendado |
|------|---------|---------|
| **2l-svc-zitadel-mcp** | Llamar a la Management API de Zitadel para gestionar usuarios/permisos | PAT (operaciones) o Service Account + JWT Profile |
| **2b-svc-api (Hub)** | El backend valida el token OIDC del frontend; llama a las interfaces internas de platform | Token OIDC de usuario en el frontend; las llamadas de plataforma usan `INTERNAL_API_KEY` (modo bearer_internal_key) |
| **2l-svc-platform** | Proporciona API internas (`/internal/v1/...`), consumidas por Hub y otros | `bearer_internal_key` (no es de Zitadel, es una convención interna de la plataforma) |
| **Pipeline de CI/CD** | Consultar/actualizar recursos del clúster durante el despliegue | Service Account independiente + PAT, una cuenta independiente por cada flujo |
| **Tareas programadas en segundo plano** | Job independiente, sin contexto de usuario | Service Account + Client Credentials o JWT Profile |

::: info Acerca de `bearer_internal_key`
Las API internas de `lurus-platform` (service: `platform-core.lurus-platform.svc:18104`) usan una `INTERNAL_API_KEY` independiente en lugar de un token de Zitadel; esta key se distribuye a los consumidores mediante un K8s Secret. Consulta la sección `capabilities` de `lurus.yaml` para más detalles.
:::

---

## VIII. Buenas prácticas de seguridad

::: warning Requisitos obligatorios en entorno de producción
1. **Nunca subas a Git los PAT, Client Secrets ni archivos de clave privada** (incluso en repositorios privados).
2. **Prioriza JWT Profile en producción**: la rotación de la clave privada no requiere coordinar la actualización del secret en todos los consumidores, y el límite de seguridad es más claro.
3. **Usa una Service Account independiente por cada tarea de CI/servicio**, para facilitar una auditoría precisa y una revocación rápida.
4. **Audita periódicamente**: revisa cada trimestre todas las Service Accounts y PAT, y elimina los que ya no se usan.
5. **Privilegio mínimo**: otorga solo el Project Role mínimo, no des Owner a nivel de organización (a menos que sea estrictamente necesario).
6. **Validez del assertion JWT**: se recomiendan 5 minutos, sin superar 1 hora como máximo.
7. **No registres los tokens en logs**: asegúrate de que los logs de la aplicación no impriman el access token en texto plano.
:::

---

<NextSteps
  :steps="[
    { text: 'Integración OIDC / OAuth2 (inicio de sesión con navegador)', link: '/es/platform/auth/oidc', primary: true },
    { text: 'Resumen de autenticación de identidad y puntos de acceso', link: '/es/platform/auth/' },
    { text: 'Consola de autenticación', link: 'https://auth.lurus.cn', external: true },
  ]"
  title="Próximos pasos"
/>

<RelatedProducts product-id="auth" />

## Enlaces de referencia

- [Zitadel: Resumen de autenticación de Service Account](https://zitadel.com/docs/guides/integrate/service-accounts/authenticate-service-accounts) · [PAT](https://zitadel.com/docs/guides/integrate/service-accounts/personal-access-token) · [Client Credentials](https://zitadel.com/docs/guides/integrate/service-accounts/client-credentials) · [Private Key JWT](https://zitadel.com/docs/guides/integrate/service-accounts/private-key-jwt) · [Acceder a las API de Zitadel](https://zitadel.com/docs/guides/integrate/zitadel-apis/access-zitadel-apis)
- [RFC 7523: JWT Bearer Token Grant](https://datatracker.ietf.org/doc/html/rfc7523)

</div>

<style scoped>
.auth-api-page .lurus-stat-strip { margin: 1.5rem 0 0.5rem; }
</style>
