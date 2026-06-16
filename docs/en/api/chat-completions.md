---
title: Chat Completions API
description: Lurus Chat Completions API reference, fully compatible with the OpenAI interface format.
---

<div class="api-chat-page">

# Chat Completions API

The most commonly used conversation API, fully compatible with the OpenAI Chat Completions interface.

<ApiEndpoint method="POST" path="/v1/chat/completions" description="创建聊天对话" />

```
POST https://api.lurus.cn/v1/chat/completions
```

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="#streaming-responses">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Streaming Responses</div>
    <p class="lurus-card__body">Token-by-token via SSE</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#function-calling">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Function Calling</div>
    <p class="lurus-card__body">Let the model call your functions</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#multimodal-input-vision">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Multimodal Vision</div>
    <p class="lurus-card__body">Mix text and images in one input</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#best-practices">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">Best Practices</div>
    <p class="lurus-card__body">Temperature / System Prompt / Multi-turn</p>
  </a>
</div>

---

## Request Parameters

### Required

| Parameter | Type | Description |
|------|------|------|
| `model` | string | Model name, such as `deepseek-chat` or `gpt-4o` |
| `messages` | array | Array of conversation messages, see the format below |

### Common Optional Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `temperature` | number | 1.0 | Randomness (0–2). Use 0.1 for code/math, 0.9 for creative writing |
| `max_tokens` | integer | — | Maximum number of tokens to generate. If unset, the model decides |
| `stream` | boolean | false | <Term t="Streaming">Streaming output</Term> (SSE), see [Streaming Responses](#streaming-responses) |
| `top_p` | number | 1.0 | Nucleus sampling; usually adjust either this or temperature, not both |
| `stop` | string/array | — | Stop generating when this string is encountered |
| `n` | integer | 1 | Number of candidate replies to generate at once |
| `user` | string | — | User identifier, used for audit logs |

### Messages Format

```json
[
  {"role": "system",    "content": "你是一位专业的技术顾问。"},
  {"role": "user",      "content": "什么是 RESTful API？"},
  {"role": "assistant", "content": "RESTful API 是…"},
  {"role": "user",      "content": "能举个例子吗？"}
]
```

| Role | Purpose |
|------|------|
| `system` | Defines the AI's behavior, tone, and constraints. Place it first in the array |
| `user` | The user's input |
| `assistant` | The AI's reply. In multi-turn conversations you need to include past replies |

For the full field definitions of the request body (`ChatCompletionRequest`) and messages (`Message`), see the [Schema Reference](/en/api/schemas).

---

## Basic Example

:::tabs
== Python
```python
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-key")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
        {"role": "user",   "content": "什么是 RESTful API？"}
    ],
    temperature=0.3,
    max_tokens=200
)

print(response.choices[0].message.content)
print(f"Token 用量：{response.usage.total_tokens}")  # usage.total_tokens
```

== cURL
```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "system", "content": "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
      {"role": "user",   "content": "什么是 RESTful API？"}
    ],
    "temperature": 0.3
  }'
```

== Node.js
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: process.env.LURUS_API_KEY
});

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: '你是一位专业的技术顾问，回复简洁，不超过 100 字。' },
    { role: 'user',   content: '什么是 RESTful API？' }
  ],
  temperature: 0.3,
  max_tokens: 200
});

console.log(response.choices[0].message.content);
console.log(`Token 用量：${response.usage.total_tokens}`);
```

== Go
```go
package main

import (
    "context"
    "fmt"
    "os"
    openai "github.com/sashabaranov/go-openai"
)

func main() {
    cfg := openai.DefaultConfig(os.Getenv("LURUS_API_KEY"))
    cfg.BaseURL = "https://api.lurus.cn/v1"
    client := openai.NewClientWithConfig(cfg)

    resp, _ := client.CreateChatCompletion(context.Background(),
        openai.ChatCompletionRequest{
            Model:       "deepseek-chat",
            Temperature: 0.3,
            Messages: []openai.ChatCompletionMessage{
                {Role: "system", Content: "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
                {Role: "user", Content: "什么是 RESTful API？"},
            },
        },
    )
    fmt.Println(resp.Choices[0].Message.Content)
    fmt.Printf("Token 用量：%d\n", resp.Usage.TotalTokens)
}
```
:::

---

## Streaming Responses

Set `stream: true` and the response is returned token by token via Server-Sent Events, which is ideal for chat-style applications.

:::tabs
== Python
```python
stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "写一首关于秋天的四行诗"}],
    stream=True
)

for chunk in stream:
    delta = chunk.choices[0].delta
    if delta.content:
        print(delta.content, end="", flush=True)
print()  # 换行
```

== Node.js
```javascript
const stream = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: '写一首关于秋天的四行诗' }],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}
```
:::

### Streaming Data Format

```
data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"落"},"index":0}]}
data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"叶"},"index":0}]}
...
data: [DONE]
```

::: tip
The final `data: [DONE]` indicates the end of the stream, at which point `delta.content` is empty.
:::

---

## Function Calling

Let the AI decide when to call functions you provide, returning structured parameters (<Term t="Tool Call">Tool Call</Term>). This is useful for scenarios like search, database queries, and calling external APIs.

### Workflow

<ArchitectureDiagram
  title="Function Calling Workflow"
  chart="graph LR; A[Your request<br/>with tools definition] --> B[Model returns<br/>finish_reason: tool_calls]; B --> C[You run the function<br/>result returned as role: tool]; C --> D[Model combines the result<br/>to produce the final answer]"
/>

### Complete Example: Querying the Weather

:::tabs
== Python
```python
import json
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-key")

# 定义可调用的函数
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的当前天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称，如"北京"、"上海""
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "温度单位"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

# 第一轮：AI 决定调用哪个函数
messages = [{"role": "user", "content": "北京今天天气怎么样？"}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

msg = response.choices[0].message

# AI 返回了 tool_calls，说明它想调用函数
if msg.tool_calls:
    tool_call = msg.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    print(f"AI 想调用：{tool_call.function.name}({args})")
    # → AI 想调用：get_weather({'city': '北京', 'unit': 'celsius'})

    # 执行你自己的函数（这里模拟返回数据）
    weather_result = {"city": "北京", "temperature": 8, "condition": "晴，有北风"}

    # 第二轮：把函数结果传回给 AI
    messages.append(msg)  # 保留 AI 的 tool_calls 消息
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(weather_result, ensure_ascii=False)
    })

    final = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        tools=tools
    )
    print(final.choices[0].message.content)
    # → 北京今天天气晴，气温 8°C，有北风，出门建议穿厚外套。
```
:::

::: warning Model Support
Function Calling requires model support. We recommend using `gpt-4o`, `gpt-4o-mini`, or `claude-3-5-sonnet`.
The DeepSeek series is also supported, but the parameter format has subtle differences, so verify carefully when testing.
:::

---

## Multimodal Input (Vision)

Some models can understand image content; mix text and images together in `content`.

:::tabs
== URL Image
```json
{
  "model": "gpt-4o",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "这张图里有什么？"},
      {"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}}
    ]
  }]
}
```

== Base64 Image
```json
{
  "model": "gpt-4o",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "识别图中的文字"},
      {"type": "image_url", "image_url": {
        "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      }}
    ]
  }]
}
```
:::

::: info Models That Support Vision
`gpt-4o`, `gpt-4o-mini`, `gemini-3-pro-preview`, `gemini-3-pro-image-preview`

Image size limits: URL images must be publicly accessible; for Base64, we recommend no more than 5 MB per image.
:::

---

## Best Practices

### Writing a System Prompt

```json
{
  "role": "system",
  "content": "你是一位专业客服。请用友好简洁的语气回答，每条回复不超过 150 字。如遇无法回答的问题，引导用户联系 support@lurus.cn。"
}
```

**A good System Prompt includes: role definition + tone requirements + length limit + boundary handling.**

### Temperature Setting Reference

| Scenario | temperature | Description |
|------|-------------|------|
| Code generation, math computation | 0.0–0.2 | Highly deterministic, less randomness |
| Q&A, summarization, classification | 0.3–0.6 | Accurate but with some flexibility |
| Creative writing, brainstorming | 0.7–1.0 | High diversity |
| Random stories, role-play | 1.0–1.5 | Highly creative, may be unstable |

### Managing Multi-turn Conversations

```python
conversation = [
    {"role": "system", "content": "你是一位历史老师。"}
]

def chat(user_input: str) -> str:
    conversation.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=conversation,
        max_tokens=500
    )
    reply = response.choices[0].message.content
    conversation.append({"role": "assistant", "content": reply})
    return reply

print(chat("秦始皇是谁？"))
print(chat("他有哪些重要成就？"))  # 模型能记住上文的"秦始皇"
```

::: tip Context Window Management
Each model has a limited context length (for example, `deepseek-chat` is 64K tokens). When a conversation grows too long, you can:
1. Truncate the oldest messages (keep system + the most recent N turns)
2. Periodically summarize the conversation history to compress token usage
:::

---

## Error Handling

Common status codes: `400` malformed request → check the JSON structure and required parameters; `401` invalid/expired key; `403` no access to this model → contact your administrator; `429` rate limit exceeded → retry with exponential backoff; `500/502` upstream model error → retry or switch to a backup model. For the full list of error codes and retry strategies, see [Error Handling](/en/api/errors).

---

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Error Handling', link: '/en/api/errors', primary: true },
    { text: 'Schemas', link: '/en/api/schemas' },
    { text: 'Authentication', link: '/en/api/authentication' },
    { text: 'API Overview', link: '/en/api/overview' },
    { text: 'Supported Models', link: '/guide/models' },
  ]"
/>

</div>

<style>
.api-chat-page .lurus-card__body code {
  font-size: 0.85em;
}
</style>
