---
title: Gestion des erreurs
description: Format des réponses d’erreur de l’API Lurus, codes de statut HTTP et méthodes de traitement des erreurs courantes.
---

<div class="api-errors-page">

# Gestion des erreurs

Toutes les réponses d’erreur suivent une structure unifiée ; chaque code d’erreur est accompagné de `code` + `message` + action recommandée, ce qui facilite le traitement automatisé.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="repeat" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">La règle d’or des tentatives</p>
    <p class="lurus-callout__body">Les erreurs d’authentification (401) ne doivent <strong>pas être réessayées</strong> et sont propagées directement ; pour la limitation de débit (429), réessayez après un <strong>backoff exponentiel</strong> de <code>2 ** attempt</code> secondes ; les autres erreurs d’API sont réessayées jusqu’à la limite <code>max_retries</code>.</p>
  </div>
</div>

## Format des réponses d’erreur

Toutes les réponses d’erreur suivent un format unifié :

```json
{ "error": { "code": "error_code", "message": "Human readable error message", "type": "error_type", "param": "optional_parameter_name" } }
```

## Codes de statut HTTP

| Code de statut | Signification | Description |
|--------|------|------|
| 200 | Succès | La requête a été traitée avec succès |
| 400 | Requête incorrecte | Paramètre erroné ou format incorrect |
| 401 | Non authentifié | Clé API invalide ou manquante |
| 403 | Accès interdit | Pas d’autorisation pour accéder à cette ressource |
| 404 | Introuvable | La ressource demandée n’existe pas |
| 429 | Trop de requêtes | Limite de débit dépassée |
| 500 | Erreur serveur | Erreur interne du serveur |
| 502 | Erreur de passerelle | Service en amont indisponible |
| 503 | Service indisponible | Service temporairement indisponible |

## Erreurs courantes

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Localisation rapide par symptôme</p>
    <div class="lurus-callout__body">Pour partir de « quelle erreur ai-je rencontrée », avec une liste de vérification point par point, consultez <a href="/fr/guide/troubleshooting">Dépannage</a>. Cette page est la référence faisant autorité pour la liste complète des codes d’erreur et la stratégie de tentatives.</div>
  </div>
</div>

| `code` | `type` | message (exemple) | Solution |
|--------|--------|------|---------|
| `invalid_api_key` | `authentication_error` | Invalid API key provided | Vérifiez que la clé a été correctement copiée, qu’elle commence par `sk-` et qu’elle ne comporte pas d’espaces superflus |
| `model_not_found` | `new_api_error` | 模型 xxx 无可用渠道 | Vérifiez le nom du modèle ; confirmez qu’un canal est configuré pour ce modèle ; contactez l’administrateur pour activer l’autorisation |
| `insufficient_quota` | `billing_error` | Insufficient quota for this request | Vérifiez le solde du compte ; contactez l’administrateur pour recharger |
| `rate_limit_exceeded` | `rate_limit_error` | Rate limit exceeded. Please slow down. | Réduisez la fréquence des requêtes ; réessayez avec un backoff exponentiel ; demandez une augmentation de la limite de débit |
| `context_length_exceeded` | `invalid_request_error` | This model’s maximum context length is 8192 tokens | Réduisez la longueur de l’entrée ; passez à un modèle avec un contexte plus long ; tronquez l’historique par fenêtre glissante |

**model_not_found** corps de réponse (HTTP 404, `type: new_api_error`) :

```json
{
  "error": {
    "code": "model_not_found",
    "message": "模型 gpt-5 无可用渠道",
    "type": "new_api_error"
  }
}
```

**insufficient_quota** corps de réponse (HTTP 402, `type: billing_error`) :

```json
{
  "error": {
    "code": "insufficient_quota",
    "message": "Insufficient quota for this request",
    "type": "billing_error"
  }
}
```

## Bonnes pratiques de gestion des erreurs

Points clés : les erreurs d’authentification (401) ne sont pas réessayées et sont propagées directement ; pour la limitation de débit (429), réessayez après un backoff exponentiel (`2 ** attempt` secondes) ; les autres erreurs d’API sont réessayées jusqu’à la limite `max_retries`.

```python
from openai import OpenAI, APIError, RateLimitError, AuthenticationError
import time

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-api-key")

def chat_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(model="deepseek-chat", messages=messages)
        except AuthenticationError as e:
            print(f"Authentication failed: {e}")  # Key 问题，不重试
            raise
        except RateLimitError:
            wait_time = 2 ** attempt
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)
        except APIError as e:
            if attempt == max_retries - 1:
                raise
            print(f"API error: {e}. Retrying...")
            time.sleep(1)
    raise Exception("Max retries exceeded")
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({ baseURL: 'https://api.lurus.cn/v1', apiKey: 'sk-your-api-key' });

async function chatWithRetry(messages, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.chat.completions.create({ model: 'deepseek-chat', messages });
    } catch (error) {
      if (error.status === 401) throw error;  // 认证错误，不重试
      if (error.status === 429) {
        const wait = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited. Waiting ${wait}ms...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (attempt === maxRetries - 1) throw error;
      console.log(`Error: ${error.message}. Retrying...`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}
```

## Contacter le support

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Problème persistant ? Contactez support@lurus.cn</p>
    <div class="lurus-callout__body">Veuillez fournir les informations suivantes pour une localisation rapide :<ul><li>Le contenu complet du message d’erreur</li><li>L’ID de requête (en-tête de réponse <code>X-Request-ID</code>)</li><li>L’heure de l’incident</li><li>Les étapes de reproduction</li></ul></div>
  </div>
</div>

---

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Chat Completions API', link: '/fr/api/chat-completions', primary: true },
    { text: 'Authentification', link: '/fr/api/authentication' },
    { text: 'Aperçu de l’API', link: '/fr/api/overview' },
  ]"
/>

</div>
