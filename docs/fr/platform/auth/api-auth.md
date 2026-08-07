---
title: Authentification API | Authentification d’identité Casdoor
description: Explication complète de Service User, Personal Access Token, JWT Profile et Client Credentials, couvrant tous les scénarios d’authentification machine à machine de Lurus.
---

<div class="auth-api-page">

# Authentification API (machine à machine) <StatusBadge status="live" />

Destinée à l’authentification M2M : contrairement au flux OIDC du navigateur, le M2M utilise le **Service Account** (compte de service) de Casdoor, et obtient un access token sans intervention humaine. Instance Casdoor `https://auth.lurus.cn`, les points de terminaison ci-dessous s’appuient tous sur celle-ci.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">méthodes d’authentification</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">RS256</span><span class="lurus-stat__label">signature JWT Profile</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">≤5 minutes</span><span class="lurus-stat__label">validité de l’assertion</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">≈12 heures</span><span class="lurus-stat__label">validité de l’access token</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="layers" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Vous cherchez plutôt la connexion par navigateur ?</p>
    <div class="lurus-callout__body">La connexion des utilisateurs humains passe par l'<a href="/fr/platform/auth/oidc">intégration OIDC / OAuth2</a> ; cette page ne traite que du <strong>machine à machine</strong> — scripts, tâches en arrière-plan, appels inter-services.</div>
  </div>
</div>

## Comparaison des trois méthodes d’authentification

De la plus simple (PAT) à la plus sécurisée (JWT Profile), à arbitrer selon la sécurité et le coût d’exploitation.

| Méthode | Cas d’usage | Modèle de permissions | Validité du Token |
|------|---------|---------|------------|
| **Personal Access Token (PAT)** | Scripts d’utilisateurs individuels, débogage en développement, appels ponctuels en CI | Hérite de toutes les permissions du Service Account auquel il appartient | Longue durée (expiration personnalisable, illimitée par défaut) |
| **Service Account + Client Credentials** | Tâches planifiées en arrière-plan, appels REST inter-services, comptes machine simples | Doivent être attribuées séparément via User Grant à un Project Role | access token d’environ 1 heure, à rafraîchir automatiquement |
| **Service Account + JWT Profile** | Scénarios à haute sécurité, services en production, charges de travail K8s | Doivent être attribuées séparément via User Grant à un Project Role | JWT d’assertion : 5 minutes max, access token d’environ 12 heures |

::: tip Conseils de choix
- **Débogage / scripts ponctuels** : le PAT est le plus simple, à coller directement dans le header.
- **Comptes machine en production** : privilégier JWT Profile, la rotation de la clé privée ne dépend pas de la distribution d’un secret.
- **Services internes simples** : Client Credentials est une alternative simplifiée à JWT Profile.
:::

---

## I. Personal Access Token (PAT) <Badge text="prêt à l’emploi" type="tip" />

Le PAT est un **token prêt à l’emploi**, à placer directement comme Bearer token dans le header `Authorization`, sans devoir d’abord obtenir un access token.

### 1.1 Créer un PAT

<ol class="lurus-steps">
<li>Connectez-vous à la console <a href="https://auth.lurus.cn">auth.lurus.cn</a>.</li>
<li>Accédez à <strong>Users → Service Accounts</strong> (lorsque le compte appartient à une Organization, opérez dans ce contexte).</li>
<li><strong>New</strong> pour créer un compte de service, renseignez le nom d’utilisateur (conventions de nommage à la <a href="#iii-service-account-compte-de-service">section trois</a>) et le nom d’affichage.</li>
<li>Détails du compte → <strong>Personal Access Tokens</strong> → <strong>New</strong>, définissez une date d’expiration selon les besoins (laissé vide = n’expire jamais).</li>
<li>Copiez le token — <strong>il ne s’affiche qu’une seule fois, impossible de le consulter à nouveau après fermeture de la fenêtre</strong>.</li>
</ol>

### 1.2 Utiliser un PAT

À ajouter comme Bearer token standard dans le header de chaque requête ; il peut accéder à toutes les API Casdoor auxquelles ce Service Account est autorisé, sans audience scope supplémentaire.

```bash
# 查询当前账号所在组织
curl -X GET https://auth.lurus.cn/management/v1/orgs/me \
  -H 'Authorization: Bearer <PAT>'
# 调用 v2 API
curl -X GET https://auth.lurus.cn/v2/users/me \
  -H 'Authorization: Bearer <PAT>'
```

### 1.3 Scénarios Lurus applicables

- Scripts d’exploitation : interroger ou modifier des utilisateurs en masse via la Management API
- Le MCP Server `2l-svc-casdoor-mcp` accède à la Casdoor Management API
- Opérations de gestion ponctuelles dans un pipeline CI/CD ; tests rapides de l’API Casdoor en développement local

### 1.4 Précautions de sécurité

::: warning Règles de sécurité du PAT
- Ne s’affiche qu’une seule fois, stockez-le immédiatement après création dans un outil de gestion de secrets (K8s Secret, Vault).
- **Ne jamais le committer dans un dépôt Git**. Utilisez un PAT distinct par usage, sans le partager.
- Auditez régulièrement et supprimez les PAT qui ne sont plus utilisés ; en cas de fuite, supprimez-le immédiatement dans la console (un attaquant peut l’utiliser jusqu’à son expiration ou sa suppression).
:::

---

## II. Service Account (compte de service)

Type de compte représentant une **entité non humaine**, conçu spécifiquement pour le M2M. Différences avec un Human User :

| Propriété | Human User | Service Account |
|------|-----------|----------------|
| Mode de connexion | Mot de passe / Passkey / MFA | Pas de connexion interactive ; uniquement PAT ou échange de token |
| Authentification multifacteur | Pris en charge | Non applicable |
| Apparaît dans une session OIDC | Oui | Non |
| Attribution des permissions | Grant ou Organization Role | Associé à un Project Role via User Grant |

### 2.1 Créer un Service Account

Dans la console, accédez à l’Organization cible → **Users → Service Accounts → New**, renseignez le nom d’utilisateur et le nom d’affichage → **Create**.

**Convention de nommage** `svc-<service>-<purpose>`, exemples :
- `svc-lurus-api-platform-client` — lurus-api appelle les interfaces internes de platform
- `svc-ci-deploy` — dédié au déploiement CI/CD
- `svc-casdoor-mcp-admin` — pour l’administration du Casdoor MCP Server

### 2.2 Attribuer des permissions

Après création, aucune permission par défaut. Accédez au **Project → User Grants → New** correspondant → sélectionnez le Service Account cible → attribuez un Project Role (par ex. `admin`, `viewer`).

::: tip Principe du moindre privilège
N’accordez que les permissions minimales nécessaires à la tâche ; ne donnez pas `admin` pour des tâches en lecture seule.
:::

---

## III. Client Credentials (méthode d’appel la plus simple pour un compte machine) <Badge text="OAuth2 standard" type="info" />

Type d’autorisation standard OAuth 2.0, adapté aux scénarios de comptes machine ne nécessitant pas une sécurité forte.

### 3.1 Générer des Client Credentials

Détails du Service Account → **Actions → Generate Client Secret** → notez le `Client ID` et le `Client Secret` (**le Secret ne s’affiche qu’une seule fois**).

### 3.2 Obtenir un access token

Envoyez une requête de type grant `client_credentials` au point de terminaison token :

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

> L’implémentation en Go est isomorphe à celle en TypeScript : `http.NewRequest` POST avec le body ci-dessus + `req.SetBasicAuth(clientID, clientSecret)`, puis parsez `access_token`.

### 3.3 Format de la réponse

```json
{ "access_token": "MtjHodGy4zxKylDOhg6kW90WeEQs2q...", "token_type": "Bearer", "expires_in": 43199 }
```

- `expires_in` est en secondes, environ 12 heures. Implémentez vous-même la mise en cache et le rafraîchissement automatique du token (rafraîchissement recommandé 5 minutes avant l’expiration).

### 3.4 Appeler l’API

```bash
curl -X GET https://auth.lurus.cn/v2/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## IV. JWT Profile (la méthode d’authentification machine la plus sécurisée) <Badge text="recommandé en production" type="tip" />

Utilise une clé asymétrique : le Service Account détient la **clé privée**, Casdoor conserve la **clé publique** correspondante. Le client signe avec la clé privée un JWT à courte durée de vie comme `client_assertion`, et Casdoor délivre un access token après vérification de la signature. **La clé privée ne transite jamais sur le réseau**, ce qui en fait la méthode M2M la plus sécurisée.

### 4.1 Générer une paire de clés

**Méthode A (recommandée)** : Détails du Service Account → **Keys** → **New** (date d’expiration facultative) → **Download** pour enregistrer le fichier de clé JSON (**téléchargeable une seule fois**).

**Méthode B** : générer en externe puis téléverser la clé publique :

```bash
openssl genrsa -out privatekey.pem 2048
openssl rsa -in privatekey.pem -pubout -out publickey.pem
```

Puis téléversez `publickey.pem` via la Casdoor User Service API.

### 4.2 Format du fichier de clé JSON

```json
{
  "type": "serviceaccount",
  "keyId": "100509901696068329",
  "key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n",
  "userId": "100507859606888466"
}
```

| Champ | Signification |
|------|------|
| `keyId` | Correspond au `kid` (Key ID) dans le header JWT |
| `key` | Clé privée RSA (PEM), utilisée pour signer le JWT d’assertion |
| `userId` | ID utilisateur du Service Account, utilisé pour `iss` et `sub` |

### 4.3 Construire l’assertion JWT

**Header** : `{ "alg": "RS256", "kid": "<keyId>" }`

**Payload** :

```json
{ "iss": "<userId>", "sub": "<userId>", "aud": "https://auth.lurus.cn", "iat": 1714000000, "exp": 1714000300 }
```

| Claim | Description |
|-------|------|
| `iss` | Le `userId` du fichier JSON |
| `sub` | Identique à `iss` (représente le demandeur, c’est-à-dire l’application elle-même) |
| `aud` | Domaine de l’instance Casdoor : `https://auth.lurus.cn` |
| `iat` | Horodatage Unix UTC actuel |
| `exp` | Expiration, recommandée à `iat + 300` (5 minutes) ; **ne pas dépasser 1 heure** |

::: warning Synchronisation de l’horloge
`iat` ne doit pas précéder l’heure du serveur Casdoor de plus d’une heure, sinon la requête de token est rejetée. Assurez-vous que la synchronisation NTP de la machine fonctionne correctement.
:::

### 4.4 Obtenir un access token

Flux curl : signez d’abord l’assertion avec une bibliothèque, puis POST pour échanger le token. Go / Node.js / Python, etc. utilisent leur bibliothèque JWT respective (`golang-jwt`, `jsonwebtoken`, `PyJWT`) pour signer en `RS256` le header/payload de la section 4.3, puis soumettent l'`assertion`.

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

### 4.5 Format de la réponse

Identique à 3.3 (access token d’environ 12 heures). Rafraîchissez de manière proactive avant l’expiration (re-signez l’assertion → re-demandez un token).

---

## V. Demander la bonne Audience

Casdoor vérifie le champ **audience (aud)** de l’access token. Pour différentes API cibles, déclarez l’audience correspondante dans le scope.

**Accéder aux API de Casdoor lui-même** (Management / Admin / Auth) : `scope=openid profile urn:casdoor:iam:org:project:id:casdoor:aud`. Ce scope réservé ajoute le projet Casdoor à l’audience du token ; la Management API et autres rejetteront tout token ne contenant pas cette audience.

```bash
curl -X POST https://auth.lurus.cn/oauth/v2/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --user "$CLIENT_ID:$CLIENT_SECRET" \
  --data 'grant_type=client_credentials' \
  --data 'scope=openid profile urn:casdoor:iam:org:project:id:casdoor:aud'
```

**Accéder au service de ressources d’un Project personnalisé** : `scope=openid profile urn:casdoor:iam:org:project:id:<your_project_id>:aud` (`<your_project_id>` se consulte sur la page de détails du Project dans la console).

### Erreurs courantes

| Symptôme | Cause | Solution |
|------|------|------|
| `403 Forbidden` | L’audience du token ne contient pas l’API cible | Ajoutez le scope `urn:casdoor:iam:...` correspondant lors de l’échange de token |
| `401 Unauthorized` | Token expiré ou signature invalide | Vérifiez la synchronisation de l’horloge, obtenez un nouveau token |
| `invalid_grant` | Assertion expirée (>5 minutes) ou `aud` incorrect | Vérifiez l'`exp` et l'`aud` de l’assertion |

---

## VI. Gestion des tokens : révocation / rotation / expiration

- **PAT** : pas d’expiration automatique (sauf si une date d’expiration est définie à la création). Pour révoquer, supprimez-le manuellement dans la liste **Personal Access Tokens** de la console. Audit recommandé chaque trimestre, suppression des PAT inutilisés ou de personnes parties.
- **Client Credentials** : le Secret n’expire pas, l’access token obtenu expire après environ 12 heures. Pour faire tourner le Secret : **Generate Client Secret** à nouveau dans la console (l’ancien secret est immédiatement invalidé). Le code applicatif enregistre `expires_in` et re-demande de manière proactive avant l’expiration.
- **Clé privée JWT Profile** : en cas de fuite de la clé JSON, un attaquant peut signer une assertion pour obtenir un token. Pour faire tourner la clé : ajoutez une Key dans l’onglet **Keys** → mettez à jour le keyfile lu par le service → confirmez que la nouvelle clé est active, puis supprimez l’ancienne Key. Il est recommandé de monter le keyfile comme K8s Secret sans l’inclure dans l’image :

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

## VII. Scénarios d’authentification des services internes Lurus

| Service | Scénario d’authentification | Méthode recommandée |
|------|---------|---------|
| **2l-svc-casdoor-mcp** | Appeler la Casdoor Management API pour gérer utilisateurs/permissions | PAT (exploitation) ou Service Account + JWT Profile |
| **2b-svc-api (Hub)** | Le backend vérifie le token OIDC du frontend ; appelle les interfaces internes de platform | Token OIDC utilisateur côté frontend ; les appels plateforme utilisent `INTERNAL_API_KEY` (mode bearer_internal_key) |
| **2l-svc-platform** | Fournit des API internes (`/internal/v1/...`), consommées par Hub et autres | `bearer_internal_key` (non Casdoor, convention interne de la plateforme) |
| **CI/CD Pipeline** | Interroger/mettre à jour les ressources du cluster lors du déploiement | Service Account dédié + PAT, un compte distinct par flux |
| **Tâches planifiées en arrière-plan** | Job indépendant, sans contexte utilisateur | Service Account + Client Credentials ou JWT Profile |

::: info À propos de `bearer_internal_key`
Les API internes de `lurus-platform` (service : `platform-core.lurus-platform.svc:18104`) utilisent une `INTERNAL_API_KEY` dédiée plutôt qu’un token Casdoor ; cette clé est distribuée aux consommateurs via un K8s Secret. Voir la section `capabilities` de `lurus.yaml` pour plus de détails.
:::

---

## VIII. Bonnes pratiques de sécurité

::: warning Exigences obligatoires en production
1. **Ne jamais committer un PAT, un Client Secret ou un fichier de clé privée dans Git** (même un dépôt privé).
2. **Privilégier JWT Profile en production** : la rotation de la clé privée ne nécessite pas de coordonner la mise à jour du secret chez tous les consommateurs, et la frontière de sécurité est plus claire.
3. **Utiliser un Service Account distinct par tâche CI / service**, pour faciliter un audit précis et une révocation rapide.
4. **Audit régulier** : vérifiez chaque trimestre tous les Service Account et PAT, supprimez ceux qui ne sont plus utilisés.
5. **Moindre privilège** : n’accordez que le Project Role minimal, pas un Owner au niveau de l’organisation (sauf nécessité avérée).
6. **Validité du JWT d’assertion** : recommandée à 5 minutes, ne pas dépasser 1 heure.
7. **Ne pas journaliser les tokens** : assurez-vous que les logs de l’application n’affichent pas l’access token en clair.
:::

---

<NextSteps
  :steps="[
    { text: 'Intégration OIDC / OAuth2 (connexion par navigateur)', link: '/fr/platform/auth/oidc', primary: true },
    { text: 'Présentation de l\'authentification et points d\'accès', link: '/fr/platform/auth/' },
    { text: 'Console d\'authentification', link: 'https://auth.lurus.cn', external: true },
  ]"
  title="Étapes suivantes"
/>

<RelatedProducts product-id="auth" />

## Liens de référence

- [Casdoor : présentation de l’authentification Service Account](https://casdoor.com/docs/guides/integrate/service-accounts/authenticate-service-accounts) · [PAT](https://casdoor.com/docs/guides/integrate/service-accounts/personal-access-token) · [Client Credentials](https://casdoor.com/docs/guides/integrate/service-accounts/client-credentials) · [Private Key JWT](https://casdoor.com/docs/guides/integrate/service-accounts/private-key-jwt) · [Accéder aux API Casdoor](https://casdoor.com/docs/guides/integrate/casdoor-apis/access-casdoor-apis)
- [RFC 7523 : JWT Bearer Token Grant](https://datatracker.ietf.org/doc/html/rfc7523)

</div>

<style scoped>
.auth-api-page .lurus-stat-strip { margin: 1.5rem 0 0.5rem; }
</style>
