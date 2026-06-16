---
title: Error Handling
description: Lurus API error response format, HTTP status codes, and how to handle common errors.
---

<div class="api-errors-page">

# Error Handling

All error responses follow a unified structure. Every error code comes with a `code` + `message` + suggested action, making automated handling straightforward.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="repeat" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">The Golden Rule of Retries</p>
    <p class="lurus-callout__body">Authentication errors (401): <strong>do not retry</strong>, raise immediately; rate limits (429): retry with <strong>exponential backoff</strong> of <code>2 ** attempt</code> seconds; other API errors: retry up to the <code>max_retries</code> limit.</p>
  </div>
</div>

## Error Response Format

All error responses follow a unified format:

```json
{ "error": { "code": "error_code", "message": "Human readable error message", "type": "error_type", "param": "optional_parameter_name" } }
```

## HTTP Status Codes

| Status Code | Meaning | Description |
|--------|------|------|
| 200 | Success | Request processed successfully |
| 400 | Bad Request | Invalid parameters or malformed format |
| 401 | Unauthenticated | API Key invalid or missing |
| 403 | Forbidden | No permission to access this resource |
| 404 | Not Found | Requested resource does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |
| 502 | Bad Gateway | Upstream service unavailable |
| 503 | Service Unavailable | Service temporarily unavailable |

## Common Errors

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Quickly Locate by Symptom</p>
    <div class="lurus-callout__body">If you want to start from "what error did I hit," with an item-by-item checklist, see <a href="/en/guide/troubleshooting">Troubleshooting</a>. This page is the authoritative reference for the complete set of error codes and retry strategies.</div>
  </div>
</div>

| `code` | `type` | message (example) | Solution |
|--------|--------|------|---------|
| `invalid_api_key` | `authentication_error` | Invalid API key provided | Check that the Key was copied correctly, starts with `sk-`, and has no extra spaces |
| `model_not_found` | `new_api_error` | No available channel for model xxx | Check the model name; confirm a channel is configured for the model; contact the administrator to enable access |
| `insufficient_quota` | `billing_error` | Insufficient quota for this request | Check your account balance; contact the administrator to top up |
| `rate_limit_exceeded` | `rate_limit_error` | Rate limit exceeded. Please slow down. | Lower your request rate; retry with exponential backoff; request a higher rate limit |
| `context_length_exceeded` | `invalid_request_error` | This model’s maximum context length is 8192 tokens | Reduce input length; switch to a model with a longer context; truncate history with a sliding window |

**model_not_found** response body (HTTP 404, `type: new_api_error`):

```json
{
  "error": {
    "code": "model_not_found",
    "message": "模型 gpt-5 无可用渠道",
    "type": "new_api_error"
  }
}
```

**insufficient_quota** response body (HTTP 402, `type: billing_error`):

```json
{
  "error": {
    "code": "insufficient_quota",
    "message": "Insufficient quota for this request",
    "type": "billing_error"
  }
}
```

## Error Handling Best Practices

Key points: authentication errors (401) are not retried and are raised immediately; rate limits (429) are retried after exponential backoff (`2 ** attempt` seconds); other API errors are retried up to the `max_retries` limit.

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

## Contact Support

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Problem persists? Contact support@lurus.cn</p>
    <div class="lurus-callout__body">Please provide the following information so we can locate the issue quickly:<ul><li>The full error message</li><li>Request ID (response header <code>X-Request-ID</code>)</li><li>Time of occurrence</li><li>Steps to reproduce</li></ul></div>
  </div>
</div>

---

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Chat Completions API', link: '/en/api/chat-completions', primary: true },
    { text: 'Authentication', link: '/en/api/authentication' },
    { text: 'API Overview', link: '/en/api/overview' },
  ]"
/>

</div>
