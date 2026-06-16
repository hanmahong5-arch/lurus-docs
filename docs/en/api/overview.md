---
title: API Overview
description: Lurus API essentials, including the Base URL, request format, and endpoint list.
---

<div class="api-overview-page">

<ProductHero product-id="api-ref" />

The Lurus API is fully compatible with the OpenAI API format, so you can call it directly with any OpenAI-compatible SDK or tool.

<CapabilityGrid
  accent="var(--lurus-color-api-ref)"
  title="Why use the Lurus API"
  :items="[
    { title: 'OpenAI compatible', body: 'All endpoint paths and semantics match OpenAI; swap in the base_url with zero SDK changes', icon: 'shuffle' },
    { title: 'Complete error codes', body: 'Every error carries code + message + a suggested action, making automated handling easy', icon: 'alert-circle' },
    { title: 'Multiple auth methods', body: 'Bearer Token / PAT / JWT, covering everything from scripts to enterprise SSO', icon: 'key' },
    { title: 'Model routing and retries', body: 'Automatically routes to upstream channels by model name and fails over to backups', icon: 'shuffle' },
  ]"
/>

## Get started in three steps {#quickstart}

<ol class="lurus-steps">
<li>

Point the base URL at `https://api.lurus.cn/v1`.

</li>
<li>

Include `Authorization: Bearer sk-your-api-key` in the request header ([Get an API Key](/en/guide/get-api-key)).

</li>
<li>

Send requests with any OpenAI SDK — no changes to your business code needed. See [SDK support](#sdk-support) below.

</li>
</ol>

## Base URL

```
https://api.lurus.cn/v1
```

## Authentication

Every API request must include your API Key in the Header:

```http
Authorization: Bearer sk-your-api-key
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">More than just API Keys</p>
    <div class="lurus-callout__body">Beyond Bearer Token, OIDC / OAuth2, PAT, and JWT are also supported. See <a href="/en/api/authentication">Authentication in detail</a>.</div>
  </div>
</div>

## Available endpoints

<!-- sync:endpoints:start -->
**Get model list**

<ApiEndpoint method="GET" path="/v1/models" description="获取模型列表" />
<ApiEndpoint method="GET" path="/v1beta/models" description="Gemini 格式获取" />

**OpenAI format (Chat)**

<ApiEndpoint method="POST" path="/v1/chat/completions" description="创建聊天对话" />

**OpenAI format (Responses)**

<ApiEndpoint method="POST" path="/v1/responses" description="创建响应 (OpenAI Responses API)" />
<ApiEndpoint method="POST" path="/v1/responses/compact" description="压缩对话 (OpenAI Responses API)" />

**Image generation**

<ApiEndpoint method="POST" path="/v1/images/generations" description="生成图像(qwen-image)" />
<ApiEndpoint method="POST" path="/v1/images/edits" description="编辑图像(qwen-image-edit)" />

**Video generation**

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

**Claude format (Messages)**

<ApiEndpoint method="POST" path="/v1/messages" description="Claude 聊天" />

**Gemini format**

<ApiEndpoint method="POST" path="/v1beta/models/{model}:generateContent" description="Gemini 图片(Nano Banana)" />
<ApiEndpoint method="POST" path="/v1/engines/{model}/embeddings" description="Gemini 嵌入(Embeddings)" />

**OpenAI format (Embeddings)**

<ApiEndpoint method="POST" path="/v1/embeddings" description="创建文本嵌入" />

**Text completions (Completions)**

<ApiEndpoint method="POST" path="/v1/completions" description="创建文本补全" />

**OpenAI Audio**

<ApiEndpoint method="POST" path="/v1/audio/transcriptions" description="音频转录" />
<ApiEndpoint method="POST" path="/v1/audio/translations" description="音频翻译" />
<ApiEndpoint method="POST" path="/v1/audio/speech" description="文本转语音" />

**Rerank**

<ApiEndpoint method="POST" path="/v1/rerank" description="文档重排序" />

**Moderations**

<ApiEndpoint method="POST" path="/v1/moderations" description="内容审核" />

**Realtime**

<ApiEndpoint method="GET" path="/v1/realtime" description="实时 WebSocket 连接" />
<!-- sync:endpoints:end -->

## Request format

All requests use JSON:

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

## Response format

For the type of each field and whether it is required, see [Data structures / Schema](/en/api/schemas) (auto-synced from the OpenAPI spec and consistent with the gateway implementation).

### Successful response

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

### Error response

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid API key provided",
    "type": "authentication_error"
  }
}
```

## Rate limits

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">60</span><span class="lurus-stat__label">RPM (requests/minute)</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">100,000</span><span class="lurus-stat__label">TPM (tokens/minute)</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">10</span><span class="lurus-stat__label">Max concurrent requests</span></div>
</div>

| Limit type | Default | Description |
|---------|--------|------|
| RPM (requests/minute) | 60 | Maximum requests per minute |
| TPM (tokens/minute) | 100,000 | Maximum tokens per minute |
| Concurrent requests | 10 | Maximum requests in flight at once |

Exceeding a limit returns a `429 Too Many Requests` error; for how to handle it, see [Error handling](/en/api/errors).

## SDK support

### Python (official OpenAI SDK)

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

## Special features

<CapabilityGrid
  accent="var(--lurus-color-api-ref)"
  title="Gateway-enhanced capabilities"
  :items="[
    { title: 'Streaming responses', body: 'Set stream: true to enable Server-Sent Events and return tokens incrementally', icon: 'zap' },
    { title: 'Model routing', body: 'Automatically routes to the matching upstream channel by model name, with no need to worry about the underlying configuration', icon: 'shuffle' },
    { title: 'Automatic retries', body: 'On a failed request, automatically switches to a backup channel (if multiple are configured)', icon: 'repeat' },
  ]"
/>

### Streaming responses

Set `stream: true` to enable Server-Sent Events streaming responses:

```json
{
  "model": "deepseek-chat",
  "messages": [...],
  "stream": true
}
```

For the full streaming data format and token-by-token handling, see [Chat Completions — Streaming responses](/en/api/chat-completions#流式响应).

### Model routing

Automatically routes to the matching upstream channel by model name, with no need to worry about the underlying configuration.

### Automatic retries

On a failed request, automatically switches to a backup channel (if multiple are configured).

---

<NextSteps
  title="Next steps"
  :steps="[
    { text: 'Authentication in detail', link: '/en/api/authentication', primary: true },
    { text: 'Chat Completions', link: '/en/api/chat-completions' },
    { text: 'Data structures / Schema', link: '/en/api/schemas' },
    { text: 'Error handling', link: '/en/api/errors' },
    { text: 'Get an API Key', link: '/en/guide/get-api-key' },
  ]"
/>

<RelatedProducts product-id="api-ref" />

</div>

<style>
.api-overview-page .lurus-stat-strip {
  margin: 1.5rem 0;
}
</style>
