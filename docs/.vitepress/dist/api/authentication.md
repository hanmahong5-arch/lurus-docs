---
url: /api/authentication.md
---
# 认证

所有 Lurus API 请求都需要进行身份认证。

## 认证方式

使用 Bearer Token 认证，在 HTTP Header 中携带 API Key：

```http
Authorization: Bearer sk-your-api-key
```

## 请求示例

### cURL

```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek-chat", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Python

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key="sk-your-api-key"  # 在这里设置 API Key
)
```

### Node.js

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: 'sk-your-api-key'
});
```

## 环境变量

推荐使用环境变量存储 API Key，避免硬编码：

```bash
# .env 文件
LURUS_API_KEY=sk-your-api-key
```

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key=os.environ.get("LURUS_API_KEY")
)
```

## 认证错误

### 401 Unauthorized

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid API key provided",
    "type": "authentication_error"
  }
}
```

**可能原因**:

* API Key 格式错误
* API Key 已被禁用或删除
* Authorization Header 格式不正确

### 403 Forbidden

```json
{
  "error": {
    "code": "access_denied",
    "message": "You don't have permission to access this model",
    "type": "authorization_error"
  }
}
```

**可能原因**:

* API Key 没有访问该模型的权限
* 账户已被暂停
* 配额已用尽

## 安全最佳实践

1. **使用环境变量**: 不要在代码中硬编码 API Key
2. **不要公开**: 不要将 Key 提交到 Git 仓库
3. **限制权限**: 只给 Key 必需的最小权限
4. **定期轮换**: 定期更换 API Key
5. **监控日志**: 定期检查 API 调用日志
