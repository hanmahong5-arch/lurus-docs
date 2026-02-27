# 快速开始

5 分钟内完成首次 API 调用。

## 第一步：获取 API Key

1. 访问 [api.lurus.cn](https://api.lurus.cn)，登录或注册
2. 进入「**令牌管理**」→「**创建新令牌**」
3. 复制生成的 Key（格式：`sk-xxxxxxxxxxxxxxxx`）

::: warning 安全提示
API Key 等同于密码。**不要**提交到 Git，**不要**写在前端代码中。
推荐通过环境变量传入：
```bash
export LURUS_API_KEY="sk-your-key-here"
```
:::

---

## 第二步：发送第一个请求

:::tabs
== Python
**安装 SDK：**
```bash
pip install openai
```

**发起请求：**
```python
from openai import OpenAI
import os

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key=os.environ["LURUS_API_KEY"]
)

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手。"},
        {"role": "user", "content": "用一句话介绍什么是人工智能。"}
    ]
)

print(response.choices[0].message.content)
```

**预期输出：**
```
人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
```

== Node.js
**安装 SDK：**
```bash
npm install openai
```

**发起请求：**
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: process.env.LURUS_API_KEY
});

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: '你是一个有帮助的助手。' },
    { role: 'user', content: '用一句话介绍什么是人工智能。' }
  ]
});

console.log(response.choices[0].message.content);
```

**预期输出：**
```
人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
```

== cURL
```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "system", "content": "你是一个有帮助的助手。"},
      {"role": "user",   "content": "用一句话介绍什么是人工智能。"}
    ]
  }'
```

**预期输出：**
```json
{
  "id": "chatcmpl-abc123",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "人工智能是让计算机模拟人类智能行为的技术与科学领域。"
    },
    "finish_reason": "stop"
  }],
  "usage": { "prompt_tokens": 32, "completion_tokens": 22, "total_tokens": 54 }
}
```

== Go
**安装 SDK：**
```bash
go get github.com/sashabaranov/go-openai
```

**发起请求：**
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
            Model: "deepseek-chat",
            Messages: []openai.ChatCompletionMessage{
                {Role: "system", Content: "你是一个有帮助的助手。"},
                {Role: "user", Content: "用一句话介绍什么是人工智能。"},
            },
        },
    )
    fmt.Println(resp.Choices[0].Message.Content)
}
```
:::

---

## 第三步：切换模型

只改 `model` 参数，无需修改其他任何代码：

| 模型 | 特点 | 成本参考 |
|------|------|---------|
| `deepseek-chat` | 中文极强，高性价比 | ¥1/M tokens |
| `deepseek-reasoner` | 数学、代码、逻辑推理 | ¥2/M tokens |
| `gpt-4o` | 综合最强，多模态 | ¥30/M tokens |
| `claude-3-5-sonnet` | 长文本、创意写作 | ¥15/M tokens |
| `gemini-3-pro-preview` | 1M 超长上下文 | ¥5/M tokens |

::: tip 不知道选哪个？
**日常使用** → `deepseek-chat`（成本最低，中文最好）
**复杂推理** → `deepseek-reasoner`
**长文档处理** → `gemini-3-pro-preview`

完整对比见 [支持的模型](/guide/models)。
:::

---

## 常见问题

### 返回 `401 Unauthorized`

```
{"error": {"code": "invalid_api_key", "type": "authentication_error"}}
```

检查：
- Key 是否以 `sk-` 开头
- 请求头格式：`Authorization: Bearer sk-xxxx`（注意 Bearer 后有空格）
- Key 是否处于「启用」状态（控制台确认）

### 返回 `"no available server"`

- 检查 `model` 名称拼写（区分大小写）
- 确认该 Key 有权限访问此模型
- 如果刚创建 Key，等待约 10 秒后再试

### 流式响应怎么开启？

在请求体中加 `"stream": true`，详见 [流式响应](/api/chat-completions#流式响应)。

---

## 下一步

- [Chat Completions 完整文档](/api/chat-completions) — 参数详解、Function Calling、多模态
- [支持的模型](/guide/models) — 完整模型列表与选型建议
- [配置 AI 客户端](/guide/clients/cherry-studio) — 在 Cherry Studio、Lobe Chat 等工具中使用
