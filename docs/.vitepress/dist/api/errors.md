---
url: /api/errors.md
---
# 错误处理

本文档介绍 Lurus API 的错误响应格式和常见错误的处理方法。

## 错误响应格式

所有错误响应都遵循统一格式：

```json
{
  "error": {
    "code": "error_code",
    "message": "Human readable error message",
    "type": "error_type",
    "param": "optional_parameter_name"
  }
}
```

## HTTP 状态码

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | 成功 | 请求成功处理 |
| 400 | 请求错误 | 请求参数错误或格式不正确 |
| 401 | 未认证 | API Key 无效或缺失 |
| 403 | 禁止访问 | 无权限访问该资源 |
| 404 | 未找到 | 请求的资源不存在 |
| 429 | 请求过多 | 超出速率限制 |
| 500 | 服务器错误 | 服务器内部错误 |
| 502 | 网关错误 | 上游服务不可用 |
| 503 | 服务不可用 | 服务暂时不可用 |

## 常见错误

### invalid\_api\_key

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid API key provided",
    "type": "authentication_error"
  }
}
```

**解决方案**:

* 检查 API Key 是否正确复制
* 确认 Key 以 `sk-` 开头
* 检查是否有多余空格

### model\_not\_found

```json
{
  "error": {
    "code": "model_not_found",
    "message": "模型 xxx 无可用渠道",
    "type": "new_api_error"
  }
}
```

**解决方案**:

* 检查模型名称是否正确
* 确认该模型已配置渠道
* 联系管理员开通权限

### insufficient\_quota

```json
{
  "error": {
    "code": "insufficient_quota",
    "message": "Insufficient quota for this request",
    "type": "billing_error"
  }
}
```

**解决方案**:

* 检查账户余额
* 联系管理员充值

### rate\_limit\_exceeded

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Please slow down.",
    "type": "rate_limit_error"
  }
}
```

**解决方案**:

* 降低请求频率
* 实现指数退避重试
* 申请提高速率限制

### context\_length\_exceeded

```json
{
  "error": {
    "code": "context_length_exceeded",
    "message": "This model's maximum context length is 8192 tokens",
    "type": "invalid_request_error"
  }
}
```

**解决方案**:

* 减少输入内容长度
* 切换到支持更长上下文的模型
* 使用滑动窗口截断历史消息

## 错误处理最佳实践

### Python 示例

```python
from openai import OpenAI, APIError, RateLimitError, AuthenticationError
import time

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key="sk-your-api-key"
)

def chat_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=messages
            )
            return response
        
        except AuthenticationError as e:
            # API Key 问题，不需要重试
            print(f"Authentication failed: {e}")
            raise
        
        except RateLimitError as e:
            # 速率限制，等待后重试
            wait_time = 2 ** attempt
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)
        
        except APIError as e:
            # 其他 API 错误
            if attempt == max_retries - 1:
                raise
            print(f"API error: {e}. Retrying...")
            time.sleep(1)
    
    raise Exception("Max retries exceeded")
```

### Node.js 示例

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: 'sk-your-api-key'
});

async function chatWithRetry(messages, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: 'deepseek-chat',
        messages
      });
      return response;
    } catch (error) {
      if (error.status === 401) {
        // 认证错误，不重试
        throw error;
      }
      
      if (error.status === 429) {
        // 速率限制，等待后重试
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited. Waiting ${waitTime}ms...`);
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }
      
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      console.log(`Error: ${error.message}. Retrying...`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}
```

## 联系支持

如果问题持续存在，请联系技术支持：

* **邮箱**: support@lurus.cn
* **提供信息**:
  * 错误信息完整内容
  * 请求 ID (response header 中的 X-Request-ID)
  * 发生时间
  * 复现步骤
