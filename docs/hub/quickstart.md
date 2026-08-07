---
title: Hub 快速开始
description: 登录 Lurus Hub 控制台、创建 API 令牌、发出第一个模型请求，以及用兑换码充值额度。
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

::: tip 还没有租户？
Hub 是多租户网关，**账号需要归属到某个租户**。企业客户的租户由 Lurus 侧开通；如果你登录后提示租户不存在，请联系对接人开通，或改用 [Lurus API](/guide/quickstart) 的标准接入方式。
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

想确认当前令牌能用哪些模型，先调 `GET /v1/models`——它返回的就是这个令牌的可用集合，比翻文档更准。

Claude 格式请求发到 `POST /v1/messages`，Gemini 原生格式发到 `/v1beta/*`；Hub 会在格式之间自动转换，所以同一个令牌可以同时服务这三种客户端。

---

## 4. 充值额度

两种方式：

- **兑换码**——在控制台输入兑换码即可入账，对应接口 `POST /api/v2/{tenant_slug}/redeem`。经销商发放的激活码走的就是这条路径。
- **统一钱包**——租户用量结算到 Lurus Platform 的统一钱包，充值与账单见 [账号与计费](/platform/)。

具体开放了哪些充值渠道随部署配置而定，以控制台显示为准。

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
