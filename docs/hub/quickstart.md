---
title: Hub 快速开始
description: 登录 Lurus Hub 控制台、创建 API 令牌、发出第一个模型请求，以及给账户钱包充值。
---

# Hub 快速开始

本页用四步把你从零带到第一个成功的模型调用。控制台地址：[hub.lurus.cn](https://hub.lurus.cn)。

---

## 1. 登录

打开 [hub.lurus.cn](https://hub.lurus.cn)，点击登录。Hub **不设独立的用户名口令**——身份统一交给 Lurus 的统一身份服务（IdP）处理，走标准 OIDC 授权码流程：

```
浏览器 → GET /api/v2/{tenant_slug}/auth/login   # 跳转到统一身份服务
       → 在 IdP 完成登录（含多因素验证，如已启用）
       → GET /api/v2/oauth/callback              # 带授权码回跳，建立会话
```

其中 `{tenant_slug}` 是你所属租户的标识。你通常不需要手工拼这个地址——从控制台入口点进去即可，登录态由 Hub 维护并支持刷新与登出。

关于统一身份体系本身（账号如何创建、多因素、企业目录对接），见 [统一身份认证](/platform/auth/)。

::: tip 第一次登录
用 Lurus 账号第一次登录时，Hub 会自动为你开通账户，不用另外申请。企业客户的独立租户由 Lurus 侧开通。
:::

---

## 2. 创建 API 令牌

登录后在控制台的**令牌**页面新建一个令牌。创建时可以限定：

- **额度上限**——该令牌最多能消耗多少
- **可用模型**——限制这个令牌能调用哪些模型
- **过期时间**与 **IP 白名单**

令牌只在创建时完整显示一次，请立刻保存。

对应的接口是 `POST /api/v2/{tenant_slug}/tokens`（多租户面）或 `POST /api/token/`（V1 兼容面），两者都需要已登录的会话，不能用模型调用令牌自己创建令牌。

---

## 3. 发出第一个请求

Relay 面与 OpenAI 兼容，把 base URL 换成 `https://hub.lurus.cn/v1`，把 API Key 换成上一步的令牌即可：

```bash
curl https://hub.lurus.cn/v1/chat/completions \
  -H "Authorization: Bearer $LURUS_HUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "用一句话解释什么是向量数据库"}]
  }'
```

用官方 SDK 时只改两处配置：

```python
from openai import OpenAI

client = OpenAI(
    api_key="<你的 Hub 令牌>",
    base_url="https://hub.lurus.cn/v1",
)

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)
```

想看有哪些模型、各自什么价格，打开 [hub.lurus.cn/api/v1/models](https://hub.lurus.cn/api/v1/models)：公开、不用令牌，OpenRouter 同款格式，`lurus` 字段里是人民币价格。想确认**当前令牌**能用哪些，调 `GET /v1/models`（要带令牌）。

每次调用的返回里，`usage.cost` 就是这次调用实际扣你的钱（美元额度计）。

Claude 格式请求发到 `POST /v1/messages`，Gemini 原生格式发到 `/v1beta/*`；Hub 会在格式之间自动转换，所以同一个令牌可以同时服务这三种客户端。

---

## 4. 充值额度

用量从你的 Lurus 账户钱包里扣，充值就是给钱包充值：打开 [identity.lurus.cn/topup](https://identity.lurus.cn/topup) 选金额付款，到账后 Hub 立刻可用。同一个钱包也用于 Lurus 的其他产品，账单见 [账号与计费](/platform/)。

**兑换码**（经销商发放的激活码）在控制台兑换，接口是 `POST /api/v2/{tenant_slug}/redeem`。账户已经接入统一钱包时，兑换会被拒绝并返回 `WALLET_IS_LEDGER`，请改用钱包充值。

---

## 排查

| 现象 | 先查什么 |
| --- | --- |
| `401` | 令牌是否写对、是否过期或已被删除；`Authorization` 头是否是 `Bearer <token>` |
| `403` / 模型不可用 | 该令牌的模型白名单，以及租户是否开通了这个模型 |
| 额度相关报错 | 令牌额度上限与租户余额，两者都会拦截请求 |
| 想确认服务本身是否正常 | `GET https://hub.lurus.cn/api/health` |

更细的错误码含义见 [错误处理](/api/errors)，通用问题见 [故障排查](/guide/troubleshooting)。

---

## 下一步

- [Hub 概览](/hub/) —— 多租户模型、API 两个面、与其他产品的关系
- [Switch](/switch/) —— 桌面端接入 Hub 的三种模式
- [API 参考](/api/overview) —— 完整字段与错误码
