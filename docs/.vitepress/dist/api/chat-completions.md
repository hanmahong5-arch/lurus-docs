---
url: /api/chat-completions.md
---
# Chat Completions API

最常用的 API，用于与 AI 模型进行对话。完全兼容 OpenAI Chat Completions 接口。

```
POST https://api.lurus.cn/v1/chat/completions
```

***

## 请求参数

### 必填

| 参数 | 类型 | 说明 |
|------|------|------|
| `model` | string | 模型名称，如 `deepseek-chat`、`gpt-4o` |
| `messages` | array | 对话消息数组，见下方格式 |

### 常用可选参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `temperature` | number | 1.0 | 随机性（0–2）。代码/数学用 0.1，创意写作用 0.9 |
| `max_tokens` | integer | — | 最大生成 Token 数。不设置则由模型决定 |
| `stream` | boolean | false | 流式输出（SSE），见[流式响应](#流式响应) |
| `top_p` | number | 1.0 | 核采样，与 temperature 通常二选一调整 |
| `stop` | string/array | — | 遇到此字符串时停止生成 |
| `n` | integer | 1 | 同时生成几个候选回复 |
| `user` | string | — | 用户标识符，用于审计日志 |

### Messages 格式

```json
[
  {"role": "system",    "content": "你是一位专业的技术顾问。"},
  {"role": "user",      "content": "什么是 RESTful API？"},
  {"role": "assistant", "content": "RESTful API 是…"},
  {"role": "user",      "content": "能举个例子吗？"}
]
```

| 角色 | 用途 |
|------|------|
| `system` | 设定 AI 的行为、语气和限制。放在数组第一个 |
| `user` | 用户的输入 |
| `assistant` | AI 的回复。多轮对话时需要把历史回复包含在内 |

***

## 基础示例

:::tabs
\== Python

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
# 消耗情况
print(f"Token 用量：{response.usage.total_tokens}")
```

**预期输出：**

```
RESTful API 是基于 HTTP 协议、遵循 REST 架构风格设计的 Web 接口。
它用 URL 表示资源、用 HTTP 方法（GET/POST/PUT/DELETE）表示操作，
返回 JSON 或 XML 数据，无状态、统一接口，广泛用于前后端分离架构。

Token 用量：87
```

\== cURL

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

:::

***

## 流式响应

设置 `stream: true`，响应通过 Server-Sent Events 逐 Token 返回，适合聊天类应用。

:::tabs
\== Python

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

**预期输出（逐字打印）：**

```
落叶铺满石板路，
西风卷起金色衣。
雁阵南飞云影淡，
丰收气息满山谷。
```

\== Node.js

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

### 流式数据格式

```
data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"落"},"index":0}]}
data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"叶"},"index":0}]}
...
data: [DONE]
```

::: tip
最后一个 `data: [DONE]` 表示流结束，此时 `delta.content` 为空。
:::

***

## Function Calling

让 AI 决定何时调用你提供的函数，并返回结构化参数。适用于搜索、查询数据库、调用外部 API 等场景。

### 工作流程

```
你的请求（含 tools 定义）
       ↓
AI 决定调用哪个函数，返回 finish_reason: "tool_calls"
       ↓
你执行该函数，把结果以 role: "tool" 传回
       ↓
AI 结合结果生成最终回答
```

### 完整示例：查询天气

:::tabs
\== Python

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

::: warning 模型支持
Function Calling 需要模型支持。推荐使用 `gpt-4o`、`gpt-4o-mini`、`claude-3-5-sonnet`。
DeepSeek 系列也支持，但参数格式有细微差异，测试时注意验证。
:::

***

## 多模态输入（Vision）

部分模型可以理解图片内容，在 `content` 中混合传入文字和图片。

:::tabs
\== URL 图片

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

\== Base64 图片

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

::: info 支持 Vision 的模型
`gpt-4o`、`gpt-4o-mini`、`gemini-3-pro-preview`、`gemini-3-pro-image-preview`

图片大小限制：URL 图片需公网可访问；Base64 建议单张不超过 5 MB。
:::

***

## 最佳实践

### System Prompt 写法

```json
{
  "role": "system",
  "content": "你是一位专业客服。请用友好简洁的语气回答，每条回复不超过 150 字。如遇无法回答的问题，引导用户联系 support@lurus.cn。"
}
```

**好的 System Prompt 包含：角色定义 + 语气要求 + 长度限制 + 边界处理。**

### 温度设置参考

| 场景 | temperature | 说明 |
|------|-------------|------|
| 代码生成、数学计算 | 0.0–0.2 | 确定性高，减少随机 |
| 问答、摘要、分类 | 0.3–0.6 | 准确但有一定灵活性 |
| 创意写作、头脑风暴 | 0.7–1.0 | 多样性强 |
| 随机故事、角色扮演 | 1.0–1.5 | 高创意，可能不稳定 |

### 多轮对话管理

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

::: tip 上下文窗口管理
每个模型的上下文长度有限（如 `deepseek-chat` 是 64K tokens）。对话过长时，可以：

1. 截断最旧的消息（保留 system + 最近 N 轮）
2. 定期总结历史对话，压缩 Token 用量
   :::

***

## 错误处理

| HTTP 状态码 | 原因 | 处理方式 |
|-------------|------|---------|
| `400` | 请求格式错误 | 检查 JSON 结构和必填参数 |
| `401` | API Key 无效或过期 | 检查 Key 格式和状态 |
| `403` | 无权访问此模型 | 联系管理员开通权限 |
| `429` | 超出速率限制 | 指数退避重试，或降低请求频率 |
| `500/502` | 上游模型服务异常 | 等待后重试，或切换备用模型 |

详细错误码和重试策略见 [错误处理](/api/errors)。
