---
title: Présentation de l’API
description: Informations de base sur l’API Lurus, incluant l’URL de base, le format des requêtes et la liste des endpoints.
---

<div class="api-overview-page">

<ProductHero product-id="api-ref" />

L’API Lurus est entièrement compatible avec le format de l’API OpenAI : vous pouvez utiliser n’importe quel SDK ou outil prenant en charge OpenAI pour l’appeler directement.

<CapabilityGrid
  accent="var(--lurus-color-api-ref)"
  title="Pourquoi utiliser l’API Lurus"
  :items="[
    { title: 'Compatible OpenAI', body: 'Tous les chemins et la sémantique des endpoints sont alignés sur OpenAI ; remplacez simplement base_url sans modifier votre SDK', icon: 'shuffle' },
    { title: 'Codes d\'erreur complets', body: 'Chaque erreur comporte un code + un message + une action recommandée, facilitant le traitement automatisé', icon: 'alert-circle' },
    { title: 'Authentification multiple', body: 'Bearer Token / PAT / JWT, du script au SSO d\'entreprise', icon: 'key' },
    { title: 'Routage et nouvelles tentatives', body: 'Routage automatique vers le canal amont selon le nom du modèle, bascule automatique en cas d\'échec', icon: 'shuffle' },
  ]"
/>

## Intégration en trois étapes {#quickstart}

<ol class="lurus-steps">
<li>

Pointez l’URL de base vers `https://api.lurus.cn/v1`.

</li>
<li>

Incluez `Authorization: Bearer sk-your-api-key` dans les en-têtes de requête ([obtenir une clé API](/fr/guide/get-api-key)).

</li>
<li>

Lancez une requête avec n’importe quel SDK OpenAI, sans modifier votre code métier. Voir [Prise en charge des SDK](#prise-en-charge-des-sdk) ci-dessous.

</li>
</ol>

## URL de base

```
https://api.lurus.cn/v1
```

## Méthode d’authentification

Toutes les requêtes API doivent inclure la clé API dans l’en-tête :

```http
Authorization: Bearer sk-your-api-key
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">L’authentification ne se limite pas à la clé API</p>
    <div class="lurus-callout__body">Outre le Bearer Token, OIDC / OAuth2, PAT et JWT sont également pris en charge. Voir <a href="/fr/api/authentication">Détails de l’authentification</a>.</div>
  </div>
</div>

## Endpoints disponibles

<!-- sync:endpoints:start -->
**Obtenir la liste des modèles**

<ApiEndpoint method="GET" path="/v1/models" description="获取模型列表" />
<ApiEndpoint method="GET" path="/v1beta/models" description="Gemini 格式获取" />

**OpenAI格式(Chat)**

<ApiEndpoint method="POST" path="/v1/chat/completions" description="创建聊天对话" />

**OpenAI格式(Responses)**

<ApiEndpoint method="POST" path="/v1/responses" description="创建响应 (OpenAI Responses API)" />
<ApiEndpoint method="POST" path="/v1/responses/compact" description="压缩对话 (OpenAI Responses API)" />

**图片生成**

<ApiEndpoint method="POST" path="/v1/images/generations" description="生成图像(qwen-image)" />
<ApiEndpoint method="POST" path="/v1/images/edits" description="编辑图像(qwen-image-edit)" />

**视频生成**

<ApiEndpoint method="POST" path="/v1/videos" description="创建视频 " />
<ApiEndpoint method="GET" path="/v1/videos/{task_id}" description="获取视频任务状态 " />
<ApiEndpoint method="GET" path="/v1/videos/{task_id}/content" description="获取视频内容" />
<ApiEndpoint method="POST" path="/kling/v1/videos/text2video" description="Kling 文生视频" />
<ApiEndpoint method="GET" path="/kling/v1/videos/text2video/{task_id}" description="获取 Kling 文生视频任务状态" />
<ApiEndpoint method="POST" path="/kling/v1/videos/image2video" description="Kling 图生视频" />
<ApiEndpoint method="GET" path="/kling/v1/videos/image2video/{task_id}" description="获取 Kling 图生视频任务状态" />
<ApiEndpoint method="POST" path="/jimeng/" description="即梦视频生成" />
<ApiEndpoint method="POST" path="/v1/video/generations" description="创建视频生成任务" />
<ApiEndpoint method="GET" path="/v1/video/generations/{task_id}" description="获取视频生成任务状态" />

**Claude格式(Messages)**

<ApiEndpoint method="POST" path="/v1/messages" description="Claude 聊天" />

**Gemini格式**

<ApiEndpoint method="POST" path="/v1beta/models/{model}:generateContent" description="Gemini 图片(Nano Banana)" />
<ApiEndpoint method="POST" path="/v1/engines/{model}/embeddings" description="Gemini 嵌入(Embeddings)" />

**OpenAI格式(Embeddings)**

<ApiEndpoint method="POST" path="/v1/embeddings" description="创建文本嵌入" />

**文本补全(Completions)**

<ApiEndpoint method="POST" path="/v1/completions" description="创建文本补全" />

**OpenAI音频(Audio)**

<ApiEndpoint method="POST" path="/v1/audio/transcriptions" description="音频转录" />
<ApiEndpoint method="POST" path="/v1/audio/translations" description="音频翻译" />
<ApiEndpoint method="POST" path="/v1/audio/speech" description="文本转语音" />

**重排序(Rerank)**

<ApiEndpoint method="POST" path="/v1/rerank" description="文档重排序" />

**Moderations**

<ApiEndpoint method="POST" path="/v1/moderations" description="内容审核" />

**Realtime**

<ApiEndpoint method="GET" path="/v1/realtime" description="实时 WebSocket 连接" />
<!-- sync:endpoints:end -->

## Format des requêtes

Toutes les requêtes utilisent le format JSON :

```http
POST /v1/chat/completions HTTP/1.1
Host: api.lurus.cn
Content-Type: application/json
Authorization: Bearer sk-your-api-key

{
  "model": "deepseek-chat",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ]
}
```

## Format des réponses

Le type de chaque champ et son caractère obligatoire sont détaillés dans la [Référence des structures de données / Schema](/fr/api/schemas) (synchronisée automatiquement depuis la spécification OpenAPI, cohérente avec l’implémentation de la passerelle).

### Réponse réussie

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "deepseek-chat",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 12,
    "total_tokens": 22
  }
}
```

### Réponse d’erreur

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid API key provided",
    "type": "authentication_error"
  }
}
```

## Limites de débit

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">60</span><span class="lurus-stat__label">RPM requêtes/minute</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">100,000</span><span class="lurus-stat__label">TPM Token/minute</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">10</span><span class="lurus-stat__label">Requêtes concurrentes maximum</span></div>
</div>

| Type de limite | Valeur par défaut | Description |
|---------|--------|------|
| RPM (requêtes/minute) | 60 | Nombre maximum de requêtes par minute |
| TPM (Token/minute) | 100,000 | Nombre maximum de Token par minute |
| Requêtes concurrentes | 10 | Nombre maximum de requêtes simultanées |

Le dépassement des limites renvoie une erreur `429 Too Many Requests` ; pour la gestion, voir [Gestion des erreurs](/fr/api/errors).

## Prise en charge des SDK

### Python (SDK OpenAI officiel)

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key="sk-your-api-key"
)
```

### Node.js

```bash
npm install openai
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: 'sk-your-api-key'
});
```

### Go

```go
import "github.com/sashabaranov/go-openai"

config := openai.DefaultConfig("sk-your-api-key")
config.BaseURL = "https://api.lurus.cn/v1"
client := openai.NewClientWithConfig(config)
```

### cURL

```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-api-key" \
  -d '{"model": "deepseek-chat", "messages": [{"role": "user", "content": "Hi"}]}'
```

## Fonctionnalités spéciales

<CapabilityGrid
  accent="var(--lurus-color-api-ref)"
  title="Capacités étendues de la passerelle"
  :items="[
    { title: 'Réponse en streaming', body: 'Définissez stream: true pour activer les Server-Sent Events et recevoir le résultat token par token', icon: 'zap' },
    { title: 'Routage de modèles', body: 'Routage automatique vers le canal amont correspondant selon le nom du modèle, sans vous soucier de la configuration sous-jacente', icon: 'shuffle' },
    { title: 'Nouvelle tentative automatique', body: 'Bascule automatique vers un canal de secours en cas d\'échec de la requête (si plusieurs sont configurés)', icon: 'repeat' },
  ]"
/>

### Réponse en streaming

Définissez `stream: true` pour activer la réponse en streaming via Server-Sent Events :

```json
{
  "model": "deepseek-chat",
  "messages": [...],
  "stream": true
}
```

Pour le format complet des données de streaming et le traitement token par token, voir [Chat Completions — Réponse en streaming](/fr/api/chat-completions#流式响应).

### Routage de modèles

Routage automatique vers le canal amont correspondant selon le nom du modèle, sans vous soucier de la configuration sous-jacente.

### Nouvelle tentative automatique

Bascule automatique vers un canal de secours en cas d’échec de la requête (si plusieurs sont configurés).

---

<NextSteps
  title="Étape suivante"
  :steps="[
    { text: 'Détails de l\'authentification', link: '/fr/api/authentication', primary: true },
    { text: 'Chat Completions', link: '/fr/api/chat-completions' },
    { text: 'Structures de données / Schema', link: '/fr/api/schemas' },
    { text: 'Gestion des erreurs', link: '/fr/api/errors' },
    { text: 'Obtenir une clé API', link: '/fr/guide/get-api-key' },
  ]"
/>

<RelatedProducts product-id="api-ref" />

</div>

<style>
.api-overview-page .lurus-stat-strip {
  margin: 1.5rem 0;
}
</style>
