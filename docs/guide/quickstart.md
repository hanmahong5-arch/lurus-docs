---
title: 快速开始
description: 5 分钟内完成首次 Lurus API 调用，支持 Python、Node.js、Go 和 cURL。
---

<div class="qs-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> 快速开始</span>
  <h1 class="lurus-section-head__title">5 分钟跑通第一次调用</h1>
  <p class="lurus-section-head__lede">获取 Key → 发送请求 → 切换模型，三步搞定。</p>
</div>

::: info 前置条件
Lurus <Term t="API Key">API Key</Term>（[获取方式](/guide/get-api-key)）· Python 3.8+ / Node.js 18+ / Go 1.21+ / cURL（任选）· 基本终端知识。预计 5 分钟。
:::

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> 第一步</span>
  <h2 class="lurus-section-head__title">获取 API Key</h2>
</div>

<ol class="lurus-steps">
<li>

访问 [api.lurus.cn](https://api.lurus.cn)，登录或注册

</li>
<li>

进入「**令牌管理**」→「**创建新令牌**」

</li>
<li>

复制生成的 Key（格式：`sk-xxxxxxxxxxxxxxxx`）

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">安全提示</p>
    <div class="lurus-callout__body"><p>API Key 等同于密码。<strong>不要</strong>提交到 Git，<strong>不要</strong>写在前端代码中。推荐通过环境变量传入：</p><pre><code>export LURUS_API_KEY="sk-your-key-here"</code></pre></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> 第二步</span>
  <h2 class="lurus-section-head__title">发送第一个请求</h2>
  <p class="lurus-section-head__lede">选你的语言，复制即可运行。</p>
</div>

:::tabs
== Python
```bash
pip install openai
```
```python
from openai import OpenAI
import os

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ["LURUS_API_KEY"])

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手。"},
        {"role": "user", "content": "用一句话介绍什么是人工智能。"}
    ]
)
print(response.choices[0].message.content)
# → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
```

== cURL
```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -d '{ "model": "deepseek-chat", "messages": [
      {"role": "system", "content": "你是一个有帮助的助手。"},
      {"role": "user",   "content": "用一句话介绍什么是人工智能。"} ] }'
# 响应：{ "id":"chatcmpl-abc123", "choices":[{ "message":{"role":"assistant","content":"..."}, "finish_reason":"stop" }],
#        "usage":{ "prompt_tokens":32, "completion_tokens":22, "total_tokens":54 } }
```

== Node.js
```bash
npm install openai
```
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
// → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
```

== Go
```bash
go get github.com/sashabaranov/go-openai
```
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
    // → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
}
```
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> 第三步</span>
  <h2 class="lurus-section-head__title">切换模型</h2>
  <p class="lurus-section-head__lede">只改 <code>model</code> 参数，无需修改其他任何代码。</p>
</div>

| 模型 | 特点 | 成本参考 |
|------|------|---------|
| `deepseek-chat` | 中文极强，高性价比 | ¥1/M tokens |
| `deepseek-reasoner` | 数学、代码、逻辑推理 | ¥2/M tokens |
| `gpt-4o` | 综合最强，多模态 | ¥30/M tokens |
| `claude-3-5-sonnet` | 长文本、创意写作 | ¥15/M tokens |
| `gemini-3-pro-preview` | 1M 超长上下文 | ¥5/M tokens |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">不知道选哪个？</p>
    <div class="lurus-callout__body"><p><strong>日常使用</strong> → <code>deepseek-chat</code>（成本最低，中文最好）<br><strong>复杂推理</strong> → <code>deepseek-reasoner</code><br><strong>长文档处理</strong> → <code>gemini-3-pro-preview</code></p><p>完整对比见 <a href="/guide/models">支持的模型</a>。</p></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> 常见问题</span>
  <h2 class="lurus-section-head__title">跑不通？先看这里</h2>
</div>

<details class="lurus-faq-item">
<summary>返回 <code>401 Unauthorized</code></summary>

```
{"error": {"code": "invalid_api_key", "type": "authentication_error"}}
```

检查：

- Key 是否以 `sk-` 开头
- 请求头格式：`Authorization: Bearer sk-xxxx`（注意 Bearer 后有空格）
- Key 是否处于「启用」状态（控制台确认）

</details>

<details class="lurus-faq-item">
<summary>返回 <code>"no available server"</code></summary>

- 检查 `model` 名称拼写（区分大小写）
- 确认该 Key 有权限访问此模型
- 如果刚创建 Key，等待约 10 秒后再试

</details>

<details class="lurus-faq-item">
<summary>流式响应怎么开启？</summary>

在请求体中加 `"stream": true`，详见 [<Term t="Streaming">流式响应</Term>](/api/chat-completions#流式响应)。

</details>

<NextSteps
  title="下一步"
  :steps="[
    { text: 'Chat Completions 完整文档', link: '/api/chat-completions', primary: true },
    { text: '支持的模型', link: '/guide/models' },
    { text: '配置 AI 客户端', link: '/guide/clients/cherry-studio' },
  ]"
/>

</div>
