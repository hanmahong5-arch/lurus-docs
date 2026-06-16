---
title: Authentification de l’API
description: Méthodes d’authentification de l’API Lurus, y compris le format de la clé API et la configuration des en-têtes de requête.
---

<div class="api-auth-page">

# Authentification

Toutes les requêtes à l’API Lurus nécessitent une authentification. **Deux modes complémentaires** sont pris en charge ; choisissez-en un selon le contexte :

<div class="lurus-cards lurus-cards--2">
  <a class="lurus-card lurus-card--auth" href="#methode-dauthentification">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">API Key <span class="lurus-tag">prise en main la plus rapide</span></div>
    <p class="lurus-card__body">Bearer Token, idéal pour les scripts et les projets personnels. Sujet principal de cette page.</p>
  </a>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Token OIDC / OAuth2</div>
    <p class="lurus-card__body">Basé sur le système d’identité unifié, adapté aux applications nécessitant une connexion utilisateur, au SSO d’entreprise et au M2M. Voir <a href="/fr/platform/auth/oidc">Intégration OIDC</a> et <a href="/fr/platform/auth/api-auth">PAT / JWT</a>.</p>
  </div>
</div>

## Méthode d’authentification

Utilisez un <Term t="Bearer Token">Bearer Token</Term>, en transmettant la <Term t="API Key">API Key</Term> dans l’en-tête HTTP :

```http
Authorization: Bearer sk-your-api-key
```

## Exemple de requête

```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek-chat", "messages": [{"role": "user", "content": "Hi"}]}'
```

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key="sk-your-api-key",  # 建议改为 os.environ.get("LURUS_API_KEY")
)
```

```javascript [Node.js]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: 'sk-your-api-key',  // 建议改为 process.env.LURUS_API_KEY
});
```

:::

Pour la liste complète des SDK, voir [Aperçu de l’API — Prise en charge des SDK](/fr/api/overview#sdk-支持).

## Variables d’environnement

Il est recommandé de stocker la clé API dans une variable d’environnement afin d’éviter le codage en dur :

```bash
# .env
LURUS_API_KEY=sk-your-api-key
```

```python
import os
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ.get("LURUS_API_KEY"))
```

## Erreurs d’authentification

| Code de statut | `code` | `type` | Causes fréquentes |
|--------|--------|--------|---------|
| **401** Unauthorized | `invalid_api_key` | `authentication_error` | Format de clé incorrect / clé désactivée ou supprimée / format de l’en-tête Authorization incorrect |
| **403** Forbidden | `access_denied` | `authorization_error` | La clé n’a pas l’autorisation pour ce modèle / compte suspendu / quota épuisé |

Pour la structure JSON des réponses d’erreur et la stratégie de relance, voir [Gestion des erreurs](/fr/api/errors).

## Bonnes pratiques de sécurité

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="server" :size="20" /></span>
    <div class="lurus-card__title">Utiliser des variables d’environnement</div>
    <p class="lurus-card__body">Ne pas coder en dur la clé API dans le code</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Ne pas divulguer</div>
    <p class="lurus-card__body">Ne pas valider dans un dépôt Git</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="filter" :size="20" /></span>
    <div class="lurus-card__title">Restreindre les autorisations</div>
    <p class="lurus-card__body">N’accorder à la clé que les autorisations minimales nécessaires</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="repeat" :size="20" /></span>
    <div class="lurus-card__title">Rotation régulière</div>
    <p class="lurus-card__body">Renouveler périodiquement la clé API</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">Surveiller les journaux</div>
    <p class="lurus-card__body">Vérifier régulièrement les journaux d’appels à l’API</p>
  </div>
</div>

---

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'API Chat Completions', link: '/api/chat-completions', primary: true },
    { text: 'Gestion des erreurs', link: '/api/errors' },
    { text: 'Aperçu de l\'API', link: '/api/overview' },
    { text: 'Intégration OIDC', link: '/platform/auth/oidc' },
  ]"
/>

</div>
