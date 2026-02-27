---
url: /api/overview.md
---
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

**获取模型列表**

**OpenAI格式(Chat)**

**OpenAI格式(Responses)**

**图片生成**

**视频生成**

**Claude格式(Messages)**

**Gemini格式**

**OpenAI格式(Embeddings)**

**文本补全(Completions)**

**OpenAI音频(Audio)**

**重排序(Rerank)**

**Moderations**

**Realtime**

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

* [认证详解](/api/authentication)
* [Chat Completions](/api/chat-completions)
* [错误处理](/api/errors)
