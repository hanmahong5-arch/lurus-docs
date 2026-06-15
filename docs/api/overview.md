---
title: API 概述
description: Lurus API 基础信息，包括 Base URL、请求格式和端点列表。
---

<div class="api-overview-page">

<ProductHero product-id="api-ref" />

Lurus API 完全兼容 OpenAI API 格式，你可以使用任何支持 OpenAI 的 SDK 或工具直接调用。

<CapabilityGrid
  accent="var(--lurus-color-api-ref)"
  title="为什么用 Lurus API"
  :items="[
    { title: 'OpenAI 兼容', body: '所有端点路径与语义对齐 OpenAI，SDK 零改动直接替换 base_url', icon: 'shuffle' },
    { title: '完整错误码', body: '每个错误均有 code + message + 建议动作，便于自动化处理', icon: 'alert-circle' },
    { title: '多种认证', body: 'Bearer Token / PAT / JWT，脚本到企业 SSO 全覆盖', icon: 'key' },
    { title: '模型路由与重试', body: '按模型名自动路由上游渠道，失败自动切换备用', icon: 'shuffle' },
  ]"
/>

## 接入三步 {#quickstart}

<ol class="lurus-steps">
<li>

把 base URL 指向 `https://api.lurus.cn/v1`。

</li>
<li>

在请求头携带 `Authorization: Bearer sk-your-api-key`（[获取 API Key](/guide/get-api-key)）。

</li>
<li>

用任意 OpenAI SDK 发起请求，无需改动业务代码。见下方 [SDK 支持](#sdk-支持)。

</li>
</ol>

## Base URL

```
https://api.lurus.cn/v1
```

## 认证方式

所有 API 请求需要在 Header 中携带 API Key：

```http
Authorization: Bearer sk-your-api-key
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">认证不止 API Key</p>
    <div class="lurus-callout__body">除 Bearer Token 外还支持 OIDC / OAuth2、PAT、JWT。详见 <a href="/api/authentication">认证详解</a>。</div>
  </div>
</div>

## 可用端点

<!-- sync:endpoints:start -->
**获取模型列表**

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

## 请求格式

所有请求使用 JSON 格式：

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

## 响应格式

### 成功响应

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

### 错误响应

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid API key provided",
    "type": "authentication_error"
  }
}
```

## 速率限制

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">60</span><span class="lurus-stat__label">RPM 请求/分钟</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">100,000</span><span class="lurus-stat__label">TPM Token/分钟</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">10</span><span class="lurus-stat__label">最大并发请求</span></div>
</div>

| 限制类型 | 默认值 | 说明 |
|---------|--------|------|
| RPM (请求/分钟) | 60 | 每分钟最大请求数 |
| TPM (Token/分钟) | 100,000 | 每分钟最大 Token 数 |
| 并发请求 | 10 | 最大同时进行的请求 |

超出限制会返回 `429 Too Many Requests` 错误，处理方式见 [错误处理](/api/errors)。

## SDK 支持

### Python (官方 OpenAI SDK)

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

## 特殊功能

<CapabilityGrid
  accent="var(--lurus-color-api-ref)"
  title="网关增强能力"
  :items="[
    { title: '流式响应', body: '设置 stream: true 启用 Server-Sent Events，逐 Token 返回', icon: 'zap' },
    { title: '模型路由', body: '通过模型名称自动路由到对应上游渠道，无需关心底层配置', icon: 'shuffle' },
    { title: '自动重试', body: '请求失败时自动切换到备用渠道（如果配置了多个）', icon: 'repeat' },
  ]"
/>

### 流式响应

设置 `stream: true` 启用 Server-Sent Events 流式响应：

```json
{
  "model": "deepseek-chat",
  "messages": [...],
  "stream": true
}
```

完整的流式数据格式与逐 Token 处理见 [Chat Completions — 流式响应](/api/chat-completions#流式响应)。

### 模型路由

通过模型名称自动路由到对应的上游渠道，无需关心底层配置。

### 自动重试

请求失败时自动切换到备用渠道（如果配置了多个）。

---

<NextSteps
  title="下一步"
  :steps="[
    { text: '认证详解', link: '/api/authentication', primary: true },
    { text: 'Chat Completions', link: '/api/chat-completions' },
    { text: '错误处理', link: '/api/errors' },
    { text: '获取 API Key', link: '/guide/get-api-key' },
  ]"
/>

<RelatedProducts product-id="api-ref" />

</div>

<style>
.api-overview-page .lurus-stat-strip {
  margin: 1.5rem 0;
}
</style>
