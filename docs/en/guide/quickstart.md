---
title: Quickstart
description: Make your first Lurus API call in under 5 minutes — Python, Node.js, Go, and cURL supported.
---

<div class="qs-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> Quickstart</span>
  <h1 class="lurus-section-head__title">Make your first call in 5 minutes</h1>
  <p class="lurus-section-head__lede">Get a key → send a request → switch models, done in three steps.</p>
</div>

::: info Prerequisites
A Lurus account (sign up to get a free quota — step one walks you through creating one) · Python 3.8+ / Node.js 18+ / Go 1.21+ / cURL (pick any) · basic terminal knowledge. Estimated 5 minutes.
:::

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Step 1</span>
  <h2 class="lurus-section-head__title">Sign up — start for free</h2>
  <p class="lurus-section-head__lede">Sign up to get a free quota; you can run this tutorial without topping up.</p>
</div>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="coins" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Ready to use on sign-up, no payment required</p>
    <div class="lurus-callout__body"><p>New accounts automatically receive <strong>5 Lubei + a free quota</strong> (Free plan, <strong>100 calls/day</strong>, including <code>deepseek-chat</code> and <code>gpt-3.5-turbo</code>) — more than enough to run this tutorial. For quota and upgrade details, see the <a href="/en/guide/faq">FAQ</a> and <a href="/en/platform/billing">Billing</a>.</p></div>
  </div>
</div>

Next, create an API Key:

<ol class="lurus-steps">
<li>

Visit [api.lurus.cn](https://api.lurus.cn) and log in or sign up

</li>
<li>

Go to **Token Management** → **Create New Token**

</li>
<li>

Copy the generated Key (format: `sk-xxxxxxxxxxxxxxxx`)

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Security note</p>
    <div class="lurus-callout__body"><p>An API Key is equivalent to a password. <strong>Do not</strong> commit it to Git, and <strong>do not</strong> embed it in front-end code. We recommend passing it in via an environment variable:</p><pre><code>export LURUS_API_KEY="sk-your-key-here"</code></pre></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Step 2</span>
  <h2 class="lurus-section-head__title">Send your first request</h2>
  <p class="lurus-section-head__lede">Pick your language, copy, and run.</p>
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

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">See a model reply? Your first call worked 🎉</p>
    <div class="lurus-callout__body"><p>This request ran on the free quota that came with sign-up — it didn't cost a cent. Next, try a different model — you'll barely need to touch the code.</p></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> Step 3</span>
  <h2 class="lurus-section-head__title">Switch models</h2>
  <p class="lurus-section-head__lede">Just change the <code>model</code> parameter — no other code changes needed. Pick a model and the snippet below updates instantly, ready to copy and run.</p>
</div>

<ModelPicker />

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Not sure which to pick?</p>
    <div class="lurus-callout__body"><p><strong>Everyday use</strong> → <code>deepseek-chat</code> (lowest cost, best for Chinese)<br><strong>Complex reasoning</strong> → <code>deepseek-reasoner</code><br><strong>Long document processing</strong> → <code>gemini-3-pro-preview</code></p><p>For a full comparison, see <a href="/guide/models">Supported Models</a>.</p></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> FAQ</span>
  <h2 class="lurus-section-head__title">Not working? Start here</h2>
</div>

<details class="lurus-faq-item">
<summary>Returns <code>401 Unauthorized</code></summary>

```
{"error": {"code": "invalid_api_key", "type": "authentication_error"}}
```

Check:

- Whether the Key starts with `sk-`
- The request header format: `Authorization: Bearer sk-xxxx` (note the space after Bearer)
- Whether the Key is in the "Enabled" state (confirm in the console)

</details>

<details class="lurus-faq-item">
<summary>Returns <code>"no available server"</code></summary>

- Check the spelling of the `model` name (case-sensitive)
- Confirm the Key has permission to access this model
- If you just created the Key, wait about 10 seconds and try again

</details>

<details class="lurus-faq-item">
<summary>How do I enable streaming responses?</summary>

Add `"stream": true` to the request body. See [<Term t="Streaming">Streaming responses</Term>](/en/api/chat-completions#流式响应) for details.

</details>

<NextSteps
  title="Next steps"
  :steps="[
    { text: 'Full Chat Completions docs', link: '/en/api/chat-completions', primary: true },
    { text: 'Supported Models', link: '/guide/models' },
    { text: 'Configure an AI client', link: '/en/guide/clients/cherry-studio' },
  ]"
/>

</div>
