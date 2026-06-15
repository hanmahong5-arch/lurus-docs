---
title: API 认证
description: Lurus API 身份认证方式，包括 API Key 格式和请求头配置。
---

<div class="api-auth-page">

# 认证

所有 Lurus API 请求都需认证。支持**两套互补模式**，按场景择一：

<div class="lurus-cards lurus-cards--2">
  <a class="lurus-card lurus-card--auth" href="#认证方式">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">API Key <span class="lurus-tag">最快上手</span></div>
    <p class="lurus-card__body">Bearer Token，适合脚本和个人项目。本页主讲。</p>
  </a>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">OIDC / OAuth2 Token</div>
    <p class="lurus-card__body">基于统一身份体系，适合需用户登录的应用、企业 SSO、M2M。见 <a href="/platform/auth/oidc">OIDC 集成</a> 与 <a href="/platform/auth/api-auth">PAT / JWT</a>。</p>
  </div>
</div>

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

| 状态码 | `code` | `type` | 常见原因 |
|--------|--------|--------|---------|
| **401** Unauthorized | `invalid_api_key` | `authentication_error` | Key 格式错误 / 已禁用或删除 / Authorization Header 格式不正确 |
| **403** Forbidden | `access_denied` | `authorization_error` | Key 无该模型权限 / 账户已暂停 / 配额已用尽 |

错误响应 JSON 结构与重试策略见 [错误处理](/api/errors)。

## 安全最佳实践

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="server" :size="20" /></span>
    <div class="lurus-card__title">用环境变量</div>
    <p class="lurus-card__body">不在代码中硬编码 API Key</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">不公开</div>
    <p class="lurus-card__body">不提交到 Git 仓库</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="filter" :size="20" /></span>
    <div class="lurus-card__title">限制权限</div>
    <p class="lurus-card__body">只给 Key 必需的最小权限</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="repeat" :size="20" /></span>
    <div class="lurus-card__title">定期轮换</div>
    <p class="lurus-card__body">周期性更换 API Key</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">监控日志</div>
    <p class="lurus-card__body">定期检查 API 调用日志</p>
  </div>
</div>

---

<NextSteps
  title="下一步"
  :steps="[
    { text: 'Chat Completions API', link: '/api/chat-completions', primary: true },
    { text: '错误处理', link: '/api/errors' },
    { text: 'API 概述', link: '/api/overview' },
    { text: 'OIDC 集成', link: '/platform/auth/oidc' },
  ]"
/>

</div>
