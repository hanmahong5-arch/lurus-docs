---
title: Intégration OIDC / OAuth2 | Authentification d’identité Casdoor
description: Guide complet pour connecter votre propre application au SSO Lurus — endpoints, Scopes, Claims, PKCE, Device Flow.
---

<div class="auth-oidc-page">

# Intégration OIDC / OAuth2 <StatusBadge status="live" />

L’authentification d’identité unifiée de Lurus repose sur [Casdoor](https://casdoor.com) et expose des interfaces OIDC / OAuth2 standard. Toute application prenant en charge OIDC standard peut se connecter directement au SSO Lurus, sans modifier sa logique d’authentification centrale.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">1</span><span class="lurus-stat__label">URL de Discovery à découverte automatique</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">9</span><span class="lurus-stat__label">Endpoints standard</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">5</span><span class="lurus-stat__label">Grant Type / Flow</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">S256</span><span class="lurus-stat__label">Méthode PKCE imposée</span></div>
</div>

## Démarrage rapide

La grande majorité des SDK OIDC prennent en charge le **Discovery** : une seule URL suffit pour récupérer automatiquement tous les endpoints, algorithmes et capacités.

```
Discovery URL: https://auth.lurus.cn/.well-known/openid-configuration
```

Initialisez le SDK en pointant directement vers cette URL (plutôt que de coder les endpoints en dur) : en cas de rotation des clés serveur ou de modification des endpoints, l’application n’a pas besoin d’être modifiée.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Configuration minimale</p>
    <div class="lurus-callout__body"><code>client_id</code> + <code>redirect_uri</code> + URL de Discovery — ces trois éléments suffisent pour lancer le flux de code d’autorisation.</div>
  </div>
</div>

---

## Endpoints standard

Tous les endpoints utilisent `https://auth.lurus.cn` comme Base URL.

| Nom de l’endpoint | Chemin | Méthode HTTP | Usage |
|----------|------|-----------|------|
| **Discovery** | `/.well-known/openid-configuration` | GET | Métadonnées du service ; le SDK lit automatiquement tous les endpoints et algorithmes |
| **Authorization** | `/oauth/v2/authorize` | GET / POST | Démarre le flux d’autorisation, redirige vers la page de connexion |
| **Token** | `/oauth/v2/token` | POST | Échange contre `access_token` / `id_token` / `refresh_token` |
| **UserInfo** | `/oidc/v1/userinfo` | GET | Lit les claims de l’utilisateur courant à l’aide de l’access token |
| **JWKS** | `/oauth/v2/keys` | GET | Récupère l’ensemble de clés publiques JWK pour vérifier la signature des JWT en local |
| **Introspection** | `/oauth/v2/introspect` | POST | Interroge la validité et les métadonnées d’un token (usage côté serveur) |
| **Revocation** | `/oauth/v2/revoke` | POST | Révoque un access / refresh token |
| **End Session** | `/oidc/v1/end_session` | GET / POST | Déconnexion : termine la session Casdoor |
| **Device Authorization** | `/oauth/v2/device_authorization` | POST | Endpoint initial du Device Code Flow |

### Paramètres de l’endpoint Authorization

| Paramètre | Obligatoire | Description |
|------|------|------|
| `client_id` | ✓ | Obtenu après la création de l’application dans la console |
| `redirect_uri` | ✓ | Doit correspondre exactement à l’URI enregistré dans la console |
| `response_type` | ✓ | Fixé à `code` pour le flux de code d’autorisation |
| `scope` | ✓ | Doit contenir au moins `openid` ; séparez plusieurs valeurs par des espaces |
| `state` | Recommandé | Protection contre le CSRF, retourné tel quel lors du callback |
| `nonce` | Recommandé | Protection contre le rejeu, inscrit dans l'`id_token` |
| `code_challenge` | Obligatoire avec PKCE | Base64URL(SHA-256(code_verifier)) |
| `code_challenge_method` | Obligatoire avec PKCE | Fixé à `S256` |
| `prompt` | Optionnel | `login` force une nouvelle connexion ; `consent` force l’affichage de la page de consentement |
| `login_hint` | Optionnel | Pré-remplit le nom d’utilisateur pour accélérer la connexion |

---

## Grant Type / Flow pris en charge

Choisissez le flux d’autorisation selon le type de client ; pour SPA / Native / Web, privilégiez Authorization Code + PKCE.

| Flow | Cas d’usage | Recommandé |
|------|----------|---------|
| **Authorization Code + PKCE** | SPA, Native App, Web App | ✓ Choix privilégié |
| **Client Credentials** | M2M, services back-end | ✓ Scénario M2M |
| **Device Code** | CLI, TV, IoT, appareils sans navigateur | ✓ Appareils particuliers |
| **Refresh Token** | Sessions longue durée, renouvellement silencieux | Combiner avec le scope `offline_access` |
| **JWT Bearer (Service User)** | Comptes de service, JWT signé échangé contre un token | Scénario de compte de service |

**Authorization Code + PKCE** en six étapes :

<ol class="lurus-steps">
<li>Le client génère un <code>code_verifier</code> (43 à 128 caractères aléatoires).</li>
<li>Calcul de <code>code_challenge = Base64URL(SHA-256(verifier))</code>.</li>
<li>Redirection vers <code>/oauth/v2/authorize</code> (avec le challenge).</li>
<li>L’utilisateur se connecte et autorise, le callback renvoie un <code>code</code>.</li>
<li>POST <code>/oauth/v2/token</code> (avec <code>code</code> + <code>code_verifier</code>).</li>
<li>Obtention des access / id / refresh token.</li>
</ol>

**Client Credentials** : POST `/oauth/v2/token` with `grant_type=client_credentials` + `client_id` + `client_secret` + `scope=openid urn:casdoor:iam:org:project:id:{projectid}:aud` → obtention d’un access_token (sans id_token, sans identité utilisateur).

**Refresh Token** : la première autorisation contient le scope `offline_access` → stockez le refresh_token de manière sécurisée → à l’expiration de l’access_token, POST `grant_type=refresh_token` + `refresh_token=<token>` → obtention de nouveaux tokens (le refresh_token peut être renouvelé).

---

## Exemple complet Authorization Code + PKCE

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

## Liste des Scopes

Les scopes OIDC standard déterminent quels claims sont retournés ; les scopes propres à Casdoor contrôlent l’audience, les rôles et les contraintes d’organisation.

### Scopes standard

| Scope | Description | Token concerné |
|-------|------|-------------|
| `openid` | **Obligatoire**, déclare une requête OIDC, retourne l'`id_token` | id_token |
| `profile` | Récupère `name`, `given_name`, `family_name`, `preferred_username`, `locale` | id_token, userinfo |
| `email` | Récupère `email`, `email_verified` | id_token, userinfo |
| `phone` | Récupère `phone_number`, `phone_number_verified` | id_token, userinfo |
| `address` | Récupère les informations d’adresse de l’utilisateur | id_token, userinfo |
| `offline_access` | Demande un `refresh_token` (valide uniquement dans le flux Authorization Code) | — |

### Scopes propres à Casdoor

| Scope | Description | Token concerné |
|-------|------|-------------|
| `urn:casdoor:iam:org:project:id:{projectid}:aud` | Ajoute l’ID de projet spécifié à l'`aud` de l’access token ; la vérification de signature côté serveur doit correspondre | access_token |
| `urn:casdoor:iam:org:project:id:casdoor:aud` | Ajoute l’ID de projet propre à Casdoor à l'`aud` (pour accéder à l’API Casdoor) | access_token |
| `urn:casdoor:iam:org:projects:roles` | Inclut dans le token la liste des rôles de tous les projets autorisés | id_token, access_token, userinfo |
| `urn:casdoor:iam:org:project:role:{rolekey}` | Demande uniquement un claim de rôle spécifique, ex. `...:role:admin` | id_token, access_token |
| `urn:casdoor:iam:org:id:{orgid}` | Restreint l’utilisateur à l’appartenance à cette organisation ; isolation forcée lors de connexions inter-organisations | Pour la validation |
| `urn:casdoor:iam:org:domain:primary:{domain}` | Restreint au domaine principal de l’organisation de l’utilisateur, ex. `...:primary:lurus.cn` | Pour la validation |
| `urn:casdoor:iam:user:metadata` | Inclut dans le token les métadonnées personnalisées de l’utilisateur (paires clé-valeur en Base64) | id_token, access_token, userinfo |
| `urn:casdoor:iam:user:resourceowner` | Récupère l’ID, le nom et le domaine principal de l’organisation de l’utilisateur | id_token, access_token, userinfo |
| `urn:casdoor:iam:org:idp:id:{idp_id}` | Redirige directement vers l’IdP spécifié (WeChat Entreprise, Feishu), en contournant la page de sélection d’IDP | Contrôle de comportement |

> **Combinaison courante** (Web App) : `openid profile email offline_access urn:casdoor:iam:org:projects:roles urn:casdoor:iam:org:project:id:{projectid}:aud`

---

## Liste des Claims

Le tableau ci-dessous indique dans quel type de token apparaît chaque claim, ainsi que le scope dont il dépend.

### Claims standard

| Claim | Description | id_token | access_token | userinfo | Scope requis |
|-------|------|:--------:|:------------:|:--------:|-----------|
| `sub` | ID unique de l’utilisateur (ID interne Casdoor) | ✓ | ✓ (JWT) | ✓ | Toujours |
| `iss` | Issuer, fixé à `https://auth.lurus.cn` | ✓ | ✓ | — | Toujours |
| `aud` | Audience, client_id de l’application | ✓ | ✓ | — | Toujours |
| `exp` / `iat` | Date d’expiration / d’émission (Unix) | ✓ | ✓ | — | Toujours |
| `auth_time` | Heure de connexion effective de l’utilisateur | ✓ | — | — | Toujours |
| `nonce` | Valeur aléatoire anti-rejeu | ✓ | — | — | Toujours (si présent) |
| `amr` | Méthode d’authentification, ex. `["pwd"]`, `["mfa"]` | ✓ | — | — | Toujours |
| `name` / `given_name` / `family_name` | Nom complet / prénom / nom de famille | ✓* | — | ✓ | `profile` |
| `preferred_username` | Nom de connexion (`username@primarydomain`) | ✓ | — | ✓ | `profile` |
| `locale` / `updated_at` | Préférence de langue (ex. `zh`) / date de mise à jour des informations | ✓* | — | ✓ | `profile` |
| `email` / `email_verified` | E-mail / vérifié ou non (Boolean) | ✓* | — | ✓ | `email` |

> `✓*` = retourné uniquement lorsque le response_type contient `id_token` ou sur demande explicite.

### Claims propres à Casdoor

| Claim | Description | id_token | access_token | userinfo |
|-------|------|:--------:|:------------:|:--------:|
| `urn:casdoor:iam:org:project:roles` | Rôles de projet de l’utilisateur, structure `{ "roleName": { "orgId": "domain" } }` | ✓ | ✓ (JWT) | ✓ |
| `urn:casdoor:iam:org:domain:primary` | Domaine principal de l’organisation de l’utilisateur | ✓ | ✓ (JWT) | ✓ |
| `urn:casdoor:iam:user:metadata` | Métadonnées personnalisées de l’utilisateur, `{ "key": "base64value" }` | ✓ | ✓ (JWT) | ✓ |
| `urn:casdoor:iam:user:resourceowner:id` / `:name` / `:primary_domain` | ID / nom / domaine principal de l’organisation de l’utilisateur | ✓ | ✓ (JWT) | ✓ |

**Exemple de claim de rôle** :
```json
{ "urn:casdoor:iam:org:project:roles": { "admin": { "178204173316174381": "lurus.cn" }, "viewer": { "178204173316174381": "lurus.cn" } } }
```
**Exemple de claim Metadata** (la valeur est en Base64 ; à l’usage il faut la décoder avec `atob()` / `base64.StdEncoding.DecodeString()`) :
```json
{ "urn:casdoor:iam:user:metadata": { "department": "ZW5naW5lZXJpbmc=", "employee_id": "VTEwMDEy" } }
```

---

## Vérification du token

Après réception d’un Bearer token, le serveur **ne doit pas** se contenter de juger de sa validité d’après son format. Il doit impérativement :

```
1. 从 JWKS 拉公钥（建议缓存 TTL 1小时）: GET https://auth.lurus.cn/oauth/v2/keys
2. 用匹配 kid 的公钥验证 JWT 签名
3. 校验标准 claims：iss == "https://auth.lurus.cn"；aud 含本应用 client_id 或 project_id；
   exp > now()；nbf <= now()（如有）
4. 按需校验业务 claims（角色、组织 ID）
```

### Bibliothèques recommandées

| Langage | Bibliothèque | Installation |
|------|----|------|
| TS / Node.js | [`oidc-client-ts`](https://github.com/authts/oidc-client-ts) | `bun add oidc-client-ts` |
| TS / Node.js | [`jose`](https://github.com/panva/jose) (vérification de signature légère) | `bun add jose` |
| Go | [`go-oidc`](https://github.com/coreos/go-oidc) | `go get github.com/coreos/go-oidc/v3` |
| Python | [`python-jose`](https://github.com/mpdavis/python-jose) | `pip install python-jose` |
| Elixir / Phoenix | `lurus-phoenix` (bibliothèque interne de la plateforme) | voir `2l-bs-admin` |

### Exemple de vérification de signature en Go

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

### Introspection (token opaque)

Lorsque l’access token est dans un format opaque (non-JWT), utilisez l’Introspection pour le vérifier :

```bash
curl -X POST https://auth.lurus.cn/oauth/v2/introspect \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "token=ACCESS_TOKEN_TO_CHECK"
# 响应：{ "active": true, "sub": "...", "exp": 1234567890, ... } 或 { "active": false }
```

---

## Device Authorization Flow

Adapté aux appareils sans saisie navigateur (CLI, TV, IoT). Les produits CLI de Lurus (Lumen, kova-cli) utilisent tous ce flux.

**Séquence :**

<ol class="lurus-steps">
<li>L’appareil envoie POST <code>/device_authorization</code>.</li>
<li>Réception de <code>device_code</code> + <code>user_code</code> + <code>verification_uri</code>.</li>
<li>Affichage du <code>user_code</code> et de l’URL à l’utilisateur.</li>
<li>L’utilisateur ouvre <code>verification_uri</code> dans un navigateur, saisit le <code>user_code</code>, se connecte et autorise.</li>
<li>L’appareil interroge <code>/token</code> toutes les <code>interval</code> secondes.</li>
<li>Une fois l’utilisateur ayant autorisé, l’interrogation suivante retourne les access / id token.</li>
</ol>

### Step 1 : Demander le Device Code

```bash
curl -s -X POST https://auth.lurus.cn/oauth/v2/device_authorization \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" -d "scope=openid profile email"
```
Réponse :
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

### Step 2 : Afficher à l’utilisateur

Affichez `verification_uri` (`https://auth.lurus.cn/device`) + `user_code`, ou scannez `verification_uri_complete`. Délai d’expiration : 5 minutes.

### Step 3 : Interroger l’endpoint Token

Interrogez toutes les `interval` secondes, jusqu’au succès ou à l’expiration. Gestion des erreurs : `authorization_pending` → continuer d’attendre ; `slow_down` → ralentir la fréquence ; autre → échec et sortie.

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

L’implémentation TypeScript est isomorphe : un POST `fetch` vers `/device_authorization` démarre le flux, puis une interrogation de `/token` via `setTimeout(interval*1000)` ; en cas de `authorization_pending` continuer, en cas de `slow_down` augmenter l’interval, et `resp.ok` retourne les tokens.

---

## Questions fréquentes

Les erreurs d’intégration les plus courantes et leur correction directe.

<details class="lurus-faq-item">
<summary>Erreur d’audience (le claim <code>aud</code> ne correspond pas)</summary>

**Symptôme** : la vérification de signature signale `token audience mismatch` / `invalid audience`. **Cause** : par défaut, l'`aud` de l’access token ne contient que le `client_id`. **Solution** : ajoutez au scope `urn:casdoor:iam:org:project:id:{projectid}:aud` pour inscrire explicitement l’ID de projet dans l'`aud`.

</details>

<details class="lurus-faq-item">
<summary>Le claim <code>roles</code> est vide ou absent</summary>

**Cause** : l’utilisateur n’a pas de User Grant sur ce Project, ou le scope de rôles n’a pas été demandé. **À vérifier** : ① dans la console, Project → Authorizations, confirmez la présence d’un Grant de rôle ② le scope contient `urn:casdoor:iam:org:projects:roles` ③ dans les paramètres du Project, activez « Assert Roles on Authentication ».

</details>

<details class="lurus-faq-item">
<summary>L'<code>id_token</code> ne contient pas d'<code>email</code></summary>

**Cause** : le scope `email` a été omis. **Solution** : ajoutez `email` au scope (ex. `openid profile email`).

</details>

<details class="lurus-faq-item">
<summary>Le refresh token expire et exige une nouvelle connexion</summary>

Le renouvellement retourne `invalid_grant`. Causes possibles : la première autorisation ne contenait pas le scope `offline_access` ; le refresh token a expiré ; l’utilisateur a révoqué la session dans la console. **Solution** : relancez le flux Authorization Code ; pour un renouvellement de longue durée, assurez-vous que le scope contient `offline_access` et que le type d’application est « Web » ou « Native ».

</details>

<details class="lurus-faq-item">
<summary>Le <code>code_verifier</code> PKCE ne correspond pas</summary>

`/token` retourne `invalid_grant: code verifier mismatch`. **Cause** : le verifier a changé entre les deux étapes, ou l’encodage Base64URL est incohérent (présence de padding `=` ou utilisation de `+/`). **Solution** : utilisez `base64url` (sans padding, avec `-_` à la place de `+/`) ; dans une SPA, utilisez `sessionStorage` pour conserver le verifier entre les pages.

</details>

---

<NextSteps
  :steps="[
    { text: 'Authentification API (machine à machine)', link: '/fr/platform/auth/api-auth', primary: true },
    { text: 'Vue d\'ensemble de l\'authentification et points d\'entrée', link: '/fr/platform/auth/' },
    { text: 'Console d\'authentification', link: 'https://auth.lurus.cn', external: true },
  ]"
  title="Étapes suivantes"
/>

<RelatedProducts product-id="auth" />

## Liens connexes

- Officiel Casdoor : [Endpoints](https://casdoor.com/docs/apis/openidoauth/endpoints) · [Scopes](https://casdoor.com/docs/apis/openidoauth/scopes) · [Claims](https://casdoor.com/docs/apis/openidoauth/claims)
- [RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636) · [RFC 8628 — Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628)
- Console Auth [auth.lurus.cn](https://auth.lurus.cn) · Discovery [/.well-known/openid-configuration](https://auth.lurus.cn/.well-known/openid-configuration)

</div>

<style scoped>
.auth-oidc-page .lurus-stat-strip { margin: 1.5rem 0 0.5rem; }
</style>
