# API 概述

Lurus API 完全兼容 OpenAI API 格式，你可以使用任何支持 OpenAI 的 SDK 或工具直接调用。

## Base URL

```
https://api.lurus.cn/v1
```

## 认证方式

所有 API 请求需要在 Header 中携带 API Key：

```http
Authorization: Bearer sk-your-api-key
```

## 可用端点

<!-- sync:endpoints:start -->
**获取模型列表**

<ApiEndpoint method="GET" path="/v1/models" description="获取模型列表" />
<ApiEndpoint method="GET" path="/v1beta/models" description="Gemini 格式获取" />

**OpenAI格式(Chat)**

<ApiEndpoint method="POST" path="/v1/chat/completions" description="创建聊天对话" />

**OpenAI格式(Responses)**

<ApiEndpoint method="POST" path="/v1/responses" description="创建响应 (OpenAI Responses API)" />

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

| 限制类型 | 默认值 | 说明 |
|---------|--------|------|
| RPM (请求/分钟) | 60 | 每分钟最大请求数 |
| TPM (Token/分钟) | 100,000 | 每分钟最大 Token 数 |
| 并发请求 | 10 | 最大同时进行的请求 |

超出限制会返回 `429 Too Many Requests` 错误。

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

### 流式响应

设置 `stream: true` 启用 Server-Sent Events 流式响应：

```json
{
  "model": "deepseek-chat",
  "messages": [...],
  "stream": true
}
```

### 模型路由

通过模型名称自动路由到对应的上游渠道，无需关心底层配置。

### 自动重试

请求失败时自动切换到备用渠道（如果配置了多个）。

## 下一步

- [认证详解](/api/authentication)
- [Chat Completions](/api/chat-completions)
- [错误处理](/api/errors)
