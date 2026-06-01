---
title: API 认证
description: Lurus API 身份认证方式，包括 API Key 格式和请求头配置。
---

# 认证

所有 Lurus API 请求都需认证。支持**两套互补模式**：

1. **API Key**（本页）— 最快上手，适合脚本和个人项目。
2. **OIDC / OAuth2 Token** — 基于统一身份体系，适合需用户登录的应用、企业 SSO、M2M。详见 [OIDC 集成](/platform/auth/oidc) 与 [API 认证 (PAT/JWT)](/platform/auth/api-auth)。

## 认证方式

用 <Term t="Bearer Token">Bearer Token</Term>，在 HTTP Header 携带 <Term t="API Key">API Key</Term>：

```http
Authorization: Bearer sk-your-api-key
```

## 请求示例

```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek-chat", "messages": [{"role": "user", "content": "Hi"}]}'
```

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key="sk-your-api-key",  # 建议改为 os.environ.get("LURUS_API_KEY")
)
```

```javascript [Node.js]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: 'sk-your-api-key',  // 建议改为 process.env.LURUS_API_KEY
});
```

:::

完整 SDK 列表见 [API 概述 — SDK 支持](/api/overview#sdk-支持)。

## 环境变量

推荐用环境变量存储 API Key，避免硬编码：

```bash
# .env
LURUS_API_KEY=sk-your-api-key
```

```python
import os
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ.get("LURUS_API_KEY"))
```

## 认证错误

- **401 Unauthorized**（`code: invalid_api_key`, `type: authentication_error`）：Key 格式错误 / 已禁用或删除 / Authorization Header 格式不正确。
- **403 Forbidden**（`code: access_denied`, `type: authorization_error`）：Key 无该模型权限 / 账户已暂停 / 配额已用尽。

错误响应 JSON 结构与重试策略见 [错误处理](/api/errors)。

## 安全最佳实践

1. **用环境变量**，不在代码硬编码 API Key。
2. **不公开**，不提交到 Git 仓库。
3. **限制权限**，只给 Key 必需的最小权限。
4. **定期轮换** API Key。
5. **监控日志**，定期检查 API 调用日志。

---

## 下一步

- [Chat Completions API](/api/chat-completions) · [错误处理](/api/errors) · [API 概述](/api/overview)
