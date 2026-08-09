---
title: Integración OIDC / OAuth2 | Autenticación de identidad con Casdoor
description: Guía completa para integrar tu propia aplicación con Lurus SSO — endpoints, scopes, claims, PKCE, Device Flow.
---

<div class="auth-oidc-page">

# Integración OIDC / OAuth2 <StatusBadge status="live" />

La autenticación de identidad unificada de Lurus se basa en [Casdoor](https://casdoor.com) y expone interfaces estándar OIDC / OAuth2. Cualquier aplicación que admita OIDC estándar puede integrarse directamente con Lurus SSO, sin necesidad de modificar su lógica de autenticación principal.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">1</span><span class="lurus-stat__label">Descubrimiento automático con Discovery URL</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">9</span><span class="lurus-stat__label">Endpoints estándar</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">5</span><span class="lurus-stat__label">Grant Type / Flow</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">S256</span><span class="lurus-stat__label">Método PKCE obligatorio</span></div>
</div>

## Inicio rápido

La gran mayoría de los SDK de OIDC admiten **Discovery**: con una sola URL obtienen automáticamente todos los endpoints, algoritmos y capacidades.

```
Discovery URL: https://identity.lurus.cn/.well-known/openid-configuration
```

Inicializa el SDK apuntando directamente a esta URL (en lugar de codificar los endpoints), de modo que la aplicación no necesite cambios cuando el servidor rota claves o modifica endpoints.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Configuración mínima</p>
    <div class="lurus-callout__body"><code>client_id</code> + <code>redirect_uri</code> + Discovery URL — con estos tres elementos ya puedes iniciar el flujo de código de autorización.</div>
  </div>
</div>

---

## Endpoints estándar

Todos los endpoints usan `https://identity.lurus.cn` como Base URL.

| Nombre del endpoint | Ruta | Método HTTP | Uso |
|----------|------|-----------|------|
| **Discovery** | `/.well-known/openid-configuration` | GET | Metadatos del servicio; el SDK lee automáticamente todos los endpoints y algoritmos |
| **Authorization** | `/oauth/v2/authorize` | GET / POST | Inicia el flujo de autorización, redirige a la página de inicio de sesión |
| **Token** | `/oauth/v2/token` | POST | Intercambia por `access_token` / `id_token` / `refresh_token` |
| **UserInfo** | `/oidc/v1/userinfo` | GET | Lee los claims del usuario actual usando el access token |
| **JWKS** | `/oauth/v2/keys` | GET | Obtiene el conjunto de claves públicas JWK para verificar JWT localmente |
| **Introspection** | `/oauth/v2/introspect` | POST | Consulta la validez y metadatos de un token (uso del servidor) |
| **Revocation** | `/oauth/v2/revoke` | POST | Revoca un access / refresh token |
| **End Session** | `/oidc/v1/end_session` | GET / POST | Cierre de sesión: termina la sesión de Casdoor |
| **Device Authorization** | `/oauth/v2/device_authorization` | POST | Endpoint inicial del Device Code Flow |

### Parámetros del endpoint Authorization

| Parámetro | Obligatorio | Descripción |
|------|------|------|
| `client_id` | ✓ | Se obtiene tras crear la aplicación en la consola |
| `redirect_uri` | ✓ | Debe coincidir exactamente con la URI registrada en la consola |
| `response_type` | ✓ | En el flujo de código de autorización es fijo `code` |
| `scope` | ✓ | Debe incluir al menos `openid`; varios valores separados por espacios |
| `state` | Recomendado | Previene CSRF; se devuelve con el valor original en el callback |
| `nonce` | Recomendado | Previene reenvíos; se escribe en el `id_token` |
| `code_challenge` | Obligatorio con PKCE | Base64URL(SHA-256(code_verifier)) |
| `code_challenge_method` | Obligatorio con PKCE | Fijo `S256` |
| `prompt` | Opcional | `login` fuerza un nuevo inicio de sesión; `consent` fuerza mostrar la página de consentimiento |
| `login_hint` | Opcional | Rellena previamente el nombre de usuario para acelerar el inicio de sesión |

---

## Grant Type / Flow admitidos

Elige el flujo de autorización según el tipo de cliente; para SPA / Native / Web se prefiere Authorization Code + PKCE.

| Flow | Caso de uso | ¿Recomendado? |
|------|----------|---------|
| **Authorization Code + PKCE** | SPA, Native App, Web App | ✓ Preferido |
| **Client Credentials** | M2M, servicios backend | ✓ Escenarios M2M |
| **Device Code** | CLI, TV, IoT, dispositivos sin navegador | ✓ Dispositivos especiales |
| **Refresh Token** | Sesiones de larga duración, renovación silenciosa | Junto con el scope `offline_access` |
| **JWT Bearer (Service User)** | Cuentas de servicio, intercambio de JWT firmado por token | Escenarios de cuenta de servicio |

**Authorization Code + PKCE**, seis pasos:

<ol class="lurus-steps">
<li>El cliente genera un <code>code_verifier</code> (cadena aleatoria de 43-128 caracteres).</li>
<li>Calcula <code>code_challenge = Base64URL(SHA-256(verifier))</code>.</li>
<li>Redirige a <code>/oauth/v2/authorize</code> (con el challenge).</li>
<li>El usuario inicia sesión y autoriza; el callback incluye el <code>code</code>.</li>
<li>POST a <code>/oauth/v2/token</code> (con <code>code</code> + <code>code_verifier</code>).</li>
<li>Se obtienen los tokens access / id / refresh.</li>
</ol>

**Client Credentials**: POST `/oauth/v2/token` with `grant_type=client_credentials` + `client_id` + `client_secret` + `scope=openid urn:casdoor:iam:org:project:id:{projectid}:aud` → se obtiene un access_token (sin id_token, sin identidad de usuario).

**Refresh Token**: la primera autorización incluye el scope `offline_access` → almacena de forma segura el refresh_token → cuando el access_token expire, POST `grant_type=refresh_token` + `refresh_token=<token>` → se obtiene un nuevo token (el refresh_token puede rotarse).

---

## Ejemplo completo de Authorization Code + PKCE

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

## Lista de Scopes

Los scopes estándar de OIDC determinan qué claims se devuelven; los scopes específicos de Casdoor controlan el audience, los roles y las restricciones de organización.

### Scopes estándar

| Scope | Descripción | Token afectado |
|-------|------|-------------|
| `openid` | **Obligatorio**; declara una solicitud OIDC y devuelve `id_token` | id_token |
| `profile` | Obtiene `name`, `given_name`, `family_name`, `preferred_username`, `locale` | id_token, userinfo |
| `email` | Obtiene `email`, `email_verified` | id_token, userinfo |
| `phone` | Obtiene `phone_number`, `phone_number_verified` | id_token, userinfo |
| `address` | Obtiene la información de dirección del usuario | id_token, userinfo |
| `offline_access` | Solicita un `refresh_token` (solo válido en el flujo Authorization Code) | — |

### Scopes específicos de Casdoor

| Scope | Descripción | Token afectado |
|-------|------|-------------|
| `urn:casdoor:iam:org:project:id:{projectid}:aud` | Añade el project ID indicado al `aud` del access token; la verificación de firma del servidor debe coincidir | access_token |
| `urn:casdoor:iam:org:project:id:casdoor:aud` | Añade el propio project ID de Casdoor al `aud` (para acceder a la API de Casdoor) | access_token |
| `urn:casdoor:iam:org:projects:roles` | El token incluye la lista de roles de todos los proyectos autorizados | id_token, access_token, userinfo |
| `urn:casdoor:iam:org:project:role:{rolekey}` | Solicita solo el claim de un rol específico, p. ej. `...:role:admin` | id_token, access_token |
| `urn:casdoor:iam:org:id:{orgid}` | Restringe a que el usuario pertenezca a esa organización; fuerza el aislamiento en inicios de sesión entre organizaciones | Para validación |
| `urn:casdoor:iam:org:domain:primary:{domain}` | Restringe al dominio principal de la organización del usuario, p. ej. `...:primary:lurus.cn` | Para validación |
| `urn:casdoor:iam:user:metadata` | El token incluye los metadatos personalizados del usuario (pares clave-valor Base64) | id_token, access_token, userinfo |
| `urn:casdoor:iam:user:resourceowner` | Obtiene el ID, nombre y dominio principal de la organización a la que pertenece el usuario | id_token, access_token, userinfo |
| `urn:casdoor:iam:org:idp:id:{idp_id}` | Salta directamente al IdP indicado (WeCom, Feishu) y omite la página de selección de IDP | Control de comportamiento |

> **Combinación habitual** (Web App): `openid profile email offline_access urn:casdoor:iam:org:projects:roles urn:casdoor:iam:org:project:id:{projectid}:aud`

---

## Lista de Claims

La siguiente tabla indica en qué token aparece cada claim y de qué scope depende.

### Claims estándar

| Claim | Descripción | id_token | access_token | userinfo | Scope requerido |
|-------|------|:--------:|:------------:|:--------:|-----------|
| `sub` | ID único del usuario (ID interno de Casdoor) | ✓ | ✓ (JWT) | ✓ | Siempre |
| `iss` | Issuer, fijo `https://identity.lurus.cn` | ✓ | ✓ | — | Siempre |
| `aud` | Audience, el client_id de la aplicación | ✓ | ✓ | — | Siempre |
| `exp` / `iat` | Hora de expiración / emisión (Unix) | ✓ | ✓ | — | Siempre |
| `auth_time` | Hora real del inicio de sesión del usuario | ✓ | — | — | Siempre |
| `nonce` | Valor aleatorio anti-reenvío | ✓ | — | — | Siempre (si existe) |
| `amr` | Método de autenticación, p. ej. `["pwd"]`, `["mfa"]` | ✓ | — | — | Siempre |
| `name` / `given_name` / `family_name` | Nombre completo / nombre / apellido | ✓* | — | ✓ | `profile` |
| `preferred_username` | Nombre de inicio de sesión (`username@primarydomain`) | ✓ | — | ✓ | `profile` |
| `locale` / `updated_at` | Preferencia de idioma (p. ej. `zh`) / hora de actualización de la información | ✓* | — | ✓ | `profile` |
| `email` / `email_verified` | Correo / si está verificado (Boolean) | ✓* | — | ✓ | `email` |

> `✓*` = solo se devuelve si el response_type incluye `id_token` o se solicita explícitamente.

### Claims específicos de Casdoor

| Claim | Descripción | id_token | access_token | userinfo |
|-------|------|:--------:|:------------:|:--------:|
| `urn:casdoor:iam:org:project:roles` | Roles de proyecto del usuario, estructura `{ "roleName": { "orgId": "domain" } }` | ✓ | ✓ (JWT) | ✓ |
| `urn:casdoor:iam:org:domain:primary` | Dominio principal de la organización a la que pertenece el usuario | ✓ | ✓ (JWT) | ✓ |
| `urn:casdoor:iam:user:metadata` | Metadatos personalizados del usuario, `{ "key": "base64value" }` | ✓ | ✓ (JWT) | ✓ |
| `urn:casdoor:iam:user:resourceowner:id` / `:name` / `:primary_domain` | ID / nombre / dominio principal de la organización del usuario | ✓ | ✓ (JWT) | ✓ |

**Ejemplo de claim de roles**:
```json
{ "urn:casdoor:iam:org:project:roles": { "admin": { "178204173316174381": "lurus.cn" }, "viewer": { "178204173316174381": "lurus.cn" } } }
```
**Ejemplo de claim de metadata** (el value está en Base64; para usarlo hay que decodificarlo con `atob()` / `base64.StdEncoding.DecodeString()`):
```json
{ "urn:casdoor:iam:user:metadata": { "department": "ZW5naW5lZXJpbmc=", "employee_id": "VTEwMDEy" } }
```

---

## Verificación de tokens

Cuando el servidor recibe un Bearer token, **no** debe juzgar su validez solo por el formato; es obligatorio:

```
1. 从 JWKS 拉公钥（建议缓存 TTL 1小时）: GET https://identity.lurus.cn/oauth/v2/keys
2. 用匹配 kid 的公钥验证 JWT 签名
3. 校验标准 claims：iss == "https://identity.lurus.cn"；aud 含本应用 client_id 或 project_id；
   exp > now()；nbf <= now()（如有）
4. 按需校验业务 claims（角色、组织 ID）
```

### Bibliotecas recomendadas

| Lenguaje | Biblioteca | Instalación |
|------|----|------|
| TS / Node.js | [`oidc-client-ts`](https://github.com/authts/oidc-client-ts) | `bun add oidc-client-ts` |
| TS / Node.js | [`jose`](https://github.com/panva/jose) (verificación de firma ligera) | `bun add jose` |
| Go | [`go-oidc`](https://github.com/coreos/go-oidc) | `go get github.com/coreos/go-oidc/v3` |
| Python | [`python-jose`](https://github.com/mpdavis/python-jose) | `pip install python-jose` |
| Elixir / Phoenix | `lurus-phoenix` (biblioteca interna de la plataforma) | ver `2l-bs-admin` |

### Ejemplo de verificación de firma en Go

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

### Introspection (tokens opacos)

Cuando el access token tiene un formato opaco (no es un JWT), usa Introspection para verificarlo:

```bash
curl -X POST https://identity.lurus.cn/oauth/v2/introspect \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "token=ACCESS_TOKEN_TO_CHECK"
# 响应：{ "active": true, "sub": "...", "exp": 1234567890, ... } 或 { "active": false }
```

---

## Device Authorization Flow

Apto para dispositivos sin entrada de navegador (CLI, TV, IoT). Los productos CLI de Lurus (Lumen, kova-cli) usan todos este flujo.

**Secuencia:**

<ol class="lurus-steps">
<li>El dispositivo hace POST a <code>/device_authorization</code>.</li>
<li>Recibe <code>device_code</code> + <code>user_code</code> + <code>verification_uri</code>.</li>
<li>Muestra el <code>user_code</code> y la URL al usuario.</li>
<li>El usuario abre <code>verification_uri</code> en el navegador, introduce el <code>user_code</code> e inicia sesión para autorizar.</li>
<li>El dispositivo consulta <code>/token</code> cada <code>interval</code> segundos.</li>
<li>Una vez que el usuario autoriza, la siguiente consulta devuelve los tokens access / id.</li>
</ol>

### Step 1: Solicitar el Device Code

```bash
curl -s -X POST https://identity.lurus.cn/oauth/v2/device_authorization \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" -d "scope=openid profile email"
```
Respuesta:
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

### Step 2: Mostrar al usuario

Muestra el `verification_uri` (`https://identity.lurus.cn/device`) + `user_code`, o escanea el `verification_uri_complete`. Expira en 5 minutos.

### Step 3: Consultar el endpoint Token

Consulta cada `interval` segundos hasta que tenga éxito o expire. Manejo de errores: `authorization_pending` → sigue esperando; `slow_down` → reduce la frecuencia; otros → sale con fallo.

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

La implementación en TypeScript es isomórfica: `fetch` POST a `/device_authorization` para iniciar el flujo, y luego consulta `/token` con `setTimeout(interval*1000)`; ante `authorization_pending` continúa, ante `slow_down` aumenta el interval, y con `resp.ok` devuelve los tokens.

---

## Preguntas frecuentes

Los errores de integración más comunes y su solución directa.

<details class="lurus-faq-item">
<summary>Error de audience (el claim <code>aud</code> no coincide)</summary>

**Síntoma**: la verificación de firma reporta `token audience mismatch` / `invalid audience`. **Causa**: el `aud` del access token contiene por defecto solo el `client_id`. **Solución**: añade al scope `urn:casdoor:iam:org:project:id:{projectid}:aud` para escribir explícitamente el project ID en el `aud`.

</details>

<details class="lurus-faq-item">
<summary>El claim <code>roles</code> está vacío o ausente</summary>

**Causa**: el usuario no tiene un User Grant en ese Project, o no se solicitó el scope de roles. **Comprobación**: ① en la consola, Project → Authorizations, confirma que hay un Grant de rol; ② el scope incluye `urn:casdoor:iam:org:projects:roles`; ③ en la configuración del Project, activa «Assert Roles on Authentication».

</details>

<details class="lurus-faq-item">
<summary>El <code>id_token</code> no contiene <code>email</code></summary>

**Causa**: falta el scope `email`. **Solución**: añade `email` al scope (p. ej. `openid profile email`).

</details>

<details class="lurus-faq-item">
<summary>El refresh token deja de ser válido y obliga a iniciar sesión de nuevo</summary>

La renovación devuelve `invalid_grant`. Posibles causas: la primera autorización no incluyó el scope `offline_access`; el refresh token expiró; el usuario revocó la sesión en la consola. **Solución**: vuelve a iniciar el flujo Authorization Code; si necesitas renovación de larga duración, asegúrate de que el scope incluya `offline_access` y de que el tipo de aplicación sea «Web» o «Native».

</details>

<details class="lurus-faq-item">
<summary>El <code>code_verifier</code> de PKCE no coincide</summary>

`/token` devuelve `invalid_grant: code verifier mismatch`. **Causa**: el verifier cambió entre los dos pasos, o la codificación Base64URL es inconsistente (incluye padding `=` o usa `+/`). **Solución**: usa `base64url` (sin padding, con `-_` en lugar de `+/`); en una SPA usa `sessionStorage` para conservar el verifier entre páginas.

</details>

---

<NextSteps
  :steps="[
    { text: 'Autenticación de API (máquina a máquina)', link: '/es/platform/auth/api-auth', primary: true },
    { text: 'Visión general de la autenticación y puntos de integración', link: '/es/platform/auth/' },
    { text: 'Consola de autenticación', link: 'https://identity.lurus.cn', external: true },
  ]"
  title="Siguiente paso"
/>

<RelatedProducts product-id="auth" />

## Enlaces relacionados

- Oficial de Casdoor: [Endpoints](https://casdoor.com/docs/apis/openidoauth/endpoints) · [Scopes](https://casdoor.com/docs/apis/openidoauth/scopes) · [Claims](https://casdoor.com/docs/apis/openidoauth/claims)
- [RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636) · [RFC 8628 — Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628)
- Consola de Auth [identity.lurus.cn](https://identity.lurus.cn) · Discovery [/.well-known/openid-configuration](https://identity.lurus.cn/.well-known/openid-configuration)

</div>

<style scoped>
.auth-oidc-page .lurus-stat-strip { margin: 1.5rem 0 0.5rem; }
</style>
