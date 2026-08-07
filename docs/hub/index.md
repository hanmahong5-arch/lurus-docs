---
title: Lurus Hub — 多租户大模型网关
description: Lurus Hub（hub.lurus.cn）是 Lurus 的统一大模型网关与 AI 数据处理枢纽，提供多租户隔离、统一 API 接入、用量分析与计费打通。
---

# Lurus Hub

**Lurus Hub** 是 Lurus 的 **AI 数据处理枢纽 + 多租户大模型网关**。它对外提供一个与 OpenAI 兼容的统一入口，把请求路由到各家上游模型厂商，同时叠加租户隔离、用量分析、日志检索与计费打通。

- **控制台与 API 域名**：[hub.lurus.cn](https://hub.lurus.cn)
- **定位**：统一网关。原 newapi 已按 D1 决策并入 Hub，`hub.lurus.cn` 是唯一的大模型网关入口。

::: tip 与 Lurus API 文档的关系
如果你只想尽快用上模型接口，先看 [快速开始](/guide/quickstart) 与 [API 参考](/api/overview)。本节介绍的是 Hub 自身的**多租户能力**——当你需要为一个组织、团队或下游客户独立管理额度、渠道和日志时才会用到。
:::

---

## 核心能力

<CapabilityGrid
  accent="var(--lurus-brand-500)"
  title="Hub 四大能力"
  :items="[
    { title: '多租户隔离', body: '按 tenant_slug 划分租户，数据库层自动注入租户标识；控制台区分 admin / user / billing_manager 角色', icon: 'users' },
    { title: '统一网关', body: '一个 OpenAI 兼容入口接入 OpenAI / Claude / Gemini / DeepSeek / Qwen / GLM 等厂商，并在格式之间自动转换', icon: 'shuffle' },
    { title: '用量与日志', body: '调用日志全文检索（Meilisearch），按租户、令牌、模型维度统计用量', icon: 'search' },
    { title: '计费打通', body: '与 Lurus Platform 通过内部接口对接，用量直接结算到统一钱包', icon: 'coins' },
  ]"
/>

除此之外，Hub 还提供令牌配额与模型级权限、渠道加权负载均衡与自动重试、兑换码充值，以及 Prometheus / OpenTelemetry 可观测性。

---

## 两个 API 面

Hub 同时保留两套 HTTP 接口，用途不同：

| 接口面 | 路径前缀 | 用途 |
| --- | --- | --- |
| **Relay（模型调用）** | `/v1/*` | 实际的模型推理调用，OpenAI 兼容，用 API 令牌鉴权 |
| **V1 管理接口** | `/api/{token,channel,redemption,log,data,wallet,user}/*` | 单租户兼容面，保留给既有集成 |
| **V2 管理接口** | `/api/v2/:tenant_slug/*` | 多租户面：令牌、渠道、日志、定价、账单、兑换码等按租户管理 |

Relay 面的常用端点（均为 `POST`，除模型列表外）：

| 端点 | 说明 |
| --- | --- |
| `GET /v1/models` | 列出当前令牌可用的模型 |
| `POST /v1/chat/completions` | 对话补全（OpenAI 格式） |
| `POST /v1/messages` | 对话补全（Claude 格式） |
| `POST /v1/responses` | Responses 格式 |
| `POST /v1/embeddings` | 向量嵌入 |
| `POST /v1/images/generations` | 图像生成 |
| `POST /v1/audio/transcriptions` | 语音转文字 |
| `POST /v1/audio/speech` | 文字转语音 |

Gemini 原生格式走 `/v1beta/*`。完整的请求体字段与错误码，以 [API 参考](/api/overview) 为准。

---

## 谁在用 Hub

- **[Switch](/switch/)** —— 桌面端的三种模式（Personal / Reseller / EndUser）都以 Hub 作为远端后端：Personal 直接调用 Lurus 自营实例；Reseller 管理自己的渠道、令牌与兑换码；EndUser 用激活码兑换额度。
- **[Lurus Platform](/platform/)** —— 负责统一账号与钱包，Hub 把用量上报给它完成扣费。

---

## 下一步

- [Hub 快速开始](/hub/quickstart) —— 登录、建令牌、发出第一个请求
- [账号与计费](/platform/) —— 统一账号、钱包与订阅
- [API 参考](/api/overview) —— 请求/响应字段与错误码

::: warning 能力可用性
Hub 的部分能力（例如单点登录是否开启、可用的支付与充值渠道、某个租户开通了哪些模型）由所在部署的配置与租户开通情况决定。**以控制台内的实际显示为准**；本页描述的是产品能力面，不代表每个租户都已开通。
:::
