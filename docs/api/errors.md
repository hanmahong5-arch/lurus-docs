---
title: 错误处理
description: Lurus API 错误响应格式、HTTP 状态码和常见错误的处理方法。
---

<div class="api-errors-page">

# 错误处理

所有错误响应遵循统一结构，每个错误码都附带 `code` + `message` + 建议动作，便于自动化处理。

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="repeat" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">重试黄金法则</p>
    <p class="lurus-callout__body">认证错误（401）<strong>不重试</strong>直接上抛；速率限制（429）按 <code>2 ** attempt</code> 秒<strong>指数退避</strong>后重试；其余 API 错误重试到 <code>max_retries</code> 上限。</p>
  </div>
</div>

## 错误响应格式

所有错误响应遵循统一格式：

```json
{ "error": { "code": "error_code", "message": "Human readable error message", "type": "error_type", "param": "optional_parameter_name" } }
```

## HTTP 状态码

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | 成功 | 请求成功处理 |
| 400 | 请求错误 | 参数错误或格式不正确 |
| 401 | 未认证 | API Key 无效或缺失 |
| 403 | 禁止访问 | 无权限访问该资源 |
| 404 | 未找到 | 请求资源不存在 |
| 429 | 请求过多 | 超出速率限制 |
| 500 | 服务器错误 | 服务器内部错误 |
| 502 | 网关错误 | 上游服务不可用 |
| 503 | 服务不可用 | 服务暂时不可用 |

## 常见错误

| `code` | `type` | message（示例） | 解决方案 |
|--------|--------|------|---------|
| `invalid_api_key` | `authentication_error` | Invalid API key provided | 检查 Key 是否正确复制、以 `sk-` 开头、无多余空格 |
| `model_not_found` | `new_api_error` | 模型 xxx 无可用渠道 | 检查模型名；确认该模型已配置渠道；联系管理员开通权限 |
| `insufficient_quota` | `billing_error` | Insufficient quota for this request | 检查账户余额；联系管理员充值 |
| `rate_limit_exceeded` | `rate_limit_error` | Rate limit exceeded. Please slow down. | 降低请求频率；指数退避重试；申请提高速率限制 |
| `context_length_exceeded` | `invalid_request_error` | This model's maximum context length is 8192 tokens | 减少输入长度；切换更长上下文模型；滑动窗口截断历史 |

**model_not_found** 响应体（HTTP 404，`type: new_api_error`）：

```json
{
  "error": {
    "code": "model_not_found",
    "message": "模型 gpt-5 无可用渠道",
    "type": "new_api_error"
  }
}
```

**insufficient_quota** 响应体（HTTP 402，`type: billing_error`）：

```json
{
  "error": {
    "code": "insufficient_quota",
    "message": "Insufficient quota for this request",
    "type": "billing_error"
  }
}
```

## 错误处理最佳实践

要点：认证错误（401）不重试直接上抛；速率限制（429）指数退避（`2 ** attempt` 秒）后重试；其他 API 错误重试到 `max_retries` 上限。

```python
from openai import OpenAI, APIError, RateLimitError, AuthenticationError
import time

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-api-key")

def chat_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(model="deepseek-chat", messages=messages)
        except AuthenticationError as e:
            print(f"Authentication failed: {e}")  # Key 问题，不重试
            raise
        except RateLimitError:
            wait_time = 2 ** attempt
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)
        except APIError as e:
            if attempt == max_retries - 1:
                raise
            print(f"API error: {e}. Retrying...")
            time.sleep(1)
    raise Exception("Max retries exceeded")
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({ baseURL: 'https://api.lurus.cn/v1', apiKey: 'sk-your-api-key' });

async function chatWithRetry(messages, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.chat.completions.create({ model: 'deepseek-chat', messages });
    } catch (error) {
      if (error.status === 401) throw error;  // 认证错误，不重试
      if (error.status === 429) {
        const wait = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited. Waiting ${wait}ms...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (attempt === maxRetries - 1) throw error;
      console.log(`Error: ${error.message}. Retrying...`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}
```

## 联系支持

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">问题持续？联系 support@lurus.cn</p>
    <div class="lurus-callout__body">请提供以下信息，便于快速定位：<ul><li>错误信息完整内容</li><li>请求 ID（response header <code>X-Request-ID</code>）</li><li>发生时间</li><li>复现步骤</li></ul></div>
  </div>
</div>

---

<NextSteps
  title="下一步"
  :steps="[
    { text: 'Chat Completions API', link: '/api/chat-completions', primary: true },
    { text: '认证', link: '/api/authentication' },
    { text: 'API 概述', link: '/api/overview' },
  ]"
/>

</div>
