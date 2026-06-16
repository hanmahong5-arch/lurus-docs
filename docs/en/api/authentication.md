---
title: API Authentication
description: Lurus API authentication methods, including API Key format and request header configuration.
---

<div class="api-auth-page">

# Authentication

All Lurus API requests require authentication. Two **complementary modes** are supported; choose one based on your scenario:

<div class="lurus-cards lurus-cards--2">
  <a class="lurus-card lurus-card--auth" href="#authentication-methods">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">API Key <span class="lurus-tag">Quickest to start</span></div>
    <p class="lurus-card__body">Bearer Token, ideal for scripts and personal projects. Covered on this page.</p>
  </a>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">OIDC / OAuth2 Token</div>
    <p class="lurus-card__body">Built on the unified identity system, ideal for apps requiring user login, enterprise SSO, and M2M. See <a href="/en/platform/auth/oidc">OIDC Integration</a> and <a href="/en/platform/auth/api-auth">PAT / JWT</a>.</p>
  </div>
</div>

## Authentication Methods {#authentication-methods}

Use a <Term t="Bearer Token">Bearer Token</Term> to carry your <Term t="API Key">API Key</Term> in the HTTP header:

```http
Authorization: Bearer sk-your-api-key
```

## Request Example

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

For the full SDK list, see [API Overview — SDK Support](/en/api/overview#sdk-支持).

## Environment Variables

We recommend storing your API Key in an environment variable to avoid hardcoding it:

```bash
# .env
LURUS_API_KEY=sk-your-api-key
```

```python
import os
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ.get("LURUS_API_KEY"))
```

## Authentication Errors

| Status Code | `code` | `type` | Common Causes |
|--------|--------|--------|---------|
| **401** Unauthorized | `invalid_api_key` | `authentication_error` | Malformed key / disabled or deleted / incorrect Authorization header format |
| **403** Forbidden | `access_denied` | `authorization_error` | Key lacks permission for the model / account suspended / quota exhausted |

For the error response JSON structure and retry strategy, see [Error Handling](/en/api/errors).

## Security Best Practices

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="server" :size="20" /></span>
    <div class="lurus-card__title">Use environment variables</div>
    <p class="lurus-card__body">Do not hardcode the API Key in your code</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Keep it private</div>
    <p class="lurus-card__body">Do not commit it to a Git repository</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="filter" :size="20" /></span>
    <div class="lurus-card__title">Restrict permissions</div>
    <p class="lurus-card__body">Grant the key only the minimum permissions it needs</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="repeat" :size="20" /></span>
    <div class="lurus-card__title">Rotate regularly</div>
    <p class="lurus-card__body">Replace the API Key periodically</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">Monitor logs</div>
    <p class="lurus-card__body">Review API call logs regularly</p>
  </div>
</div>

---

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Chat Completions API', link: '/en/api/chat-completions', primary: true },
    { text: 'Error Handling', link: '/en/api/errors' },
    { text: 'API Overview', link: '/en/api/overview' },
    { text: 'OIDC Integration', link: '/en/platform/auth/oidc' },
  ]"
/>

</div>
