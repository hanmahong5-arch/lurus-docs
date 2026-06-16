---
title: Visión general de la API
description: Información básica de la API de Lurus, incluyendo la Base URL, el formato de las solicitudes y la lista de endpoints.
---

<div class="api-overview-page">

<ProductHero product-id="api-ref" />

La API de Lurus es totalmente compatible con el formato de la API de OpenAI, por lo que puedes usar cualquier SDK o herramienta compatible con OpenAI para invocarla directamente.

<CapabilityGrid
  accent="var(--lurus-color-api-ref)"
  title="Por qué usar la API de Lurus"
  :items="[
    { title: 'Compatible con OpenAI', body: 'Todas las rutas y la semántica de los endpoints están alineadas con OpenAI; reemplaza el base_url sin modificar el SDK', icon: 'shuffle' },
    { title: 'Códigos de error completos', body: 'Cada error incluye code + message + acción sugerida, lo que facilita el manejo automatizado', icon: 'alert-circle' },
    { title: 'Múltiples autenticaciones', body: 'Bearer Token / PAT / JWT, cobertura completa desde scripts hasta SSO empresarial', icon: 'key' },
    { title: 'Enrutamiento de modelos y reintentos', body: 'Enruta automáticamente al canal upstream según el nombre del modelo y cambia al canal de respaldo en caso de fallo', icon: 'shuffle' },
  ]"
/>

## Integración en tres pasos {#quickstart}

<ol class="lurus-steps">
<li>

Apunta la base URL a `https://api.lurus.cn/v1`.

</li>
<li>

Incluye `Authorization: Bearer sk-your-api-key` en la cabecera de la solicitud ([obtener API Key](/es/guide/get-api-key)).

</li>
<li>

Realiza la solicitud con cualquier SDK de OpenAI, sin necesidad de modificar el código de tu negocio. Consulta [Compatibilidad con SDK](#compatibilidad-con-sdk) más abajo.

</li>
</ol>

## Base URL

```
https://api.lurus.cn/v1
```

## Métodos de autenticación

Todas las solicitudes a la API deben incluir la API Key en la cabecera (Header):

```http
Authorization: Bearer sk-your-api-key
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">La autenticación no se limita a la API Key</p>
    <div class="lurus-callout__body">Además del Bearer Token, también se admiten OIDC / OAuth2, PAT y JWT. Consulta los <a href="/es/api/authentication">detalles de autenticación</a>.</div>
  </div>
</div>

## Endpoints disponibles

<!-- sync:endpoints:start -->
**Obtener la lista de modelos**

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

## Formato de la solicitud

Todas las solicitudes usan el formato JSON:

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

## Formato de la respuesta

El tipo de cada campo y si es obligatorio se detallan en [Referencia de estructuras de datos / Schema](/es/api/schemas) (sincronizada automáticamente desde la especificación OpenAPI, consistente con la implementación del gateway).

### Respuesta exitosa

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

### Respuesta de error

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid API key provided",
    "type": "authentication_error"
  }
}
```

## Límites de tasa

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">60</span><span class="lurus-stat__label">RPM solicitudes/minuto</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">100,000</span><span class="lurus-stat__label">TPM Token/minuto</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">10</span><span class="lurus-stat__label">Máximo de solicitudes concurrentes</span></div>
</div>

| Tipo de límite | Valor predeterminado | Descripción |
|---------|--------|------|
| RPM (solicitudes/minuto) | 60 | Número máximo de solicitudes por minuto |
| TPM (Token/minuto) | 100,000 | Número máximo de Token por minuto |
| Solicitudes concurrentes | 10 | Máximo de solicitudes en curso simultáneamente |

Al superar el límite se devuelve el error `429 Too Many Requests`; consulta cómo gestionarlo en [Manejo de errores](/es/api/errors).

## Compatibilidad con SDK

### Python (SDK oficial de OpenAI)

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

## Funciones especiales

<CapabilityGrid
  accent="var(--lurus-color-api-ref)"
  title="Capacidades mejoradas del gateway"
  :items="[
    { title: 'Respuesta en streaming', body: 'Establece stream: true para habilitar Server-Sent Events y recibir Token a Token', icon: 'zap' },
    { title: 'Enrutamiento de modelos', body: 'Enruta automáticamente al canal upstream correspondiente según el nombre del modelo, sin preocuparte por la configuración subyacente', icon: 'shuffle' },
    { title: 'Reintento automático', body: 'Cambia automáticamente a un canal de respaldo cuando una solicitud falla (si se han configurado varios)', icon: 'repeat' },
  ]"
/>

### Respuesta en streaming

Establece `stream: true` para habilitar la respuesta en streaming mediante Server-Sent Events:

```json
{
  "model": "deepseek-chat",
  "messages": [...],
  "stream": true
}
```

El formato completo de los datos en streaming y el procesamiento Token a Token se detallan en [Chat Completions — Respuesta en streaming](/es/api/chat-completions#流式响应).

### Enrutamiento de modelos

Enruta automáticamente al canal upstream correspondiente según el nombre del modelo, sin preocuparte por la configuración subyacente.

### Reintento automático

Cambia automáticamente a un canal de respaldo cuando una solicitud falla (si se han configurado varios).

---

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Detalles de autenticación', link: '/es/api/authentication', primary: true },
    { text: 'Chat Completions', link: '/es/api/chat-completions' },
    { text: 'Estructuras de datos / Schema', link: '/es/api/schemas' },
    { text: 'Manejo de errores', link: '/es/api/errors' },
    { text: 'Obtener API Key', link: '/es/guide/get-api-key' },
  ]"
/>

<RelatedProducts product-id="api-ref" />

</div>

<style>
.api-overview-page .lurus-stat-strip {
  margin: 1.5rem 0;
}
</style>
