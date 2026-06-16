---
title: 故障排查
description: 一页定位 Lurus 全产品高频问题 —— 401 / 模型无渠道 / 429 / 配额不足 / 上下文超限 / 超时，附错误码与解决路径。
---

<div class="troubleshooting-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> 故障排查</span>
  <h1 class="lurus-section-head__title">遇到问题？从这里开始</h1>
  <p class="lurus-section-head__lede">先按症状定位去向，再展开下方高频问题对照排查。不重复内容，只把你导向权威页面。</p>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/api/errors">
    <span class="lurus-card__icon"><Icon name="alert-circle" :size="22" /></span>
    <div class="lurus-card__title">API 报错（4xx / 5xx）</div>
    <p class="lurus-card__body">完整错误码、响应结构与重试策略 —— 401 / 402 / 404 / 429 / 5xx 一览。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/guide/faq">
    <span class="lurus-card__icon"><Icon name="key-round" :size="22" /></span>
    <div class="lurus-card__title">账号、Key 与认证</div>
    <p class="lurus-card__body">注册、API Key 丢失、Key 无效排查、模型与流式调用常见问题。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/platform/billing">
    <span class="lurus-card__icon"><Icon name="wallet" :size="22" /></span>
    <div class="lurus-card__title">计费与配额</div>
    <p class="lurus-card__body">免费额度、订阅计划、鹿贝扣费规则，以及配额耗尽后的处理。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/guide/clients/others">
    <span class="lurus-card__icon"><Icon name="plug" :size="22" /></span>
    <div class="lurus-card__title">客户端连不上</div>
    <p class="lurus-card__body">Cherry Studio / Lobe Chat / OpenCat 等第三方客户端的接入与排错。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/platform/faq">
    <span class="lurus-card__icon"><Icon name="layers" :size="22" /></span>
    <div class="lurus-card__title">产品专属问题</div>
    <p class="lurus-card__body">平台、MemX、Lucrum 等各产品均有独立 FAQ，先看对应产品文档的常见问题页。</p>
  </a>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> 高频症状</span>
  <h2 class="lurus-section-head__title">按报错对照排查</h2>
  <p class="lurus-section-head__lede">展开你遇到的报错，照着检查清单走。详细错误码见 <a href="/api/errors">错误处理</a>。</p>
</div>

<details class="lurus-faq-item" id="invalid-api-key">
<summary>返回 <code>401 Unauthorized</code> / <code>invalid_api_key</code></summary>

```json
{ "error": { "code": "invalid_api_key", "type": "authentication_error" } }
```

`authentication_error` 表示 Key 无效或缺失。逐项检查：

- Key 完整、以 `sk-` 开头、无多余空格或换行（重新复制一次）
- 请求头格式 `Authorization: Bearer sk-xxxx`（`Bearer` 后有一个空格）
- Key 状态为「启用」（控制台 → 令牌管理）
- 环境变量名拼写正确且已加载

**不要重试** 401，直接修正 Key 后再发。详见 [认证](/api/authentication) 与 [常见问题：Key 无效怎么排查](/guide/faq)。

</details>

<details class="lurus-faq-item">
<summary>返回 <code>"no available server"</code> / <code>model_not_found</code>（HTTP 404）</summary>

```json
{ "error": { "code": "model_not_found", "message": "模型 xxx 无可用渠道", "type": "new_api_error" } }
```

- 检查 `model` 名称拼写（区分大小写）
- 确认该 Key 有权限访问此模型
- 该模型可能暂无可用渠道
- 如果刚创建 Key，等待约 10 秒后再试

可用模型清单见 [支持的模型](/guide/models)。

</details>

<details class="lurus-faq-item">
<summary>返回 <code>429 Too Many Requests</code> / <code>rate_limit_exceeded</code></summary>

```json
{ "error": { "code": "rate_limit_exceeded", "type": "rate_limit_error" } }
```

超出速率限制。处理方式：

- 降低请求频率，按 `2 ** attempt` 秒做**指数退避**后重试
- Free 默认 60 RPM，升级 Pro / Team 提高限额
- 付费后仍频繁触发，联系 <a href="mailto:support@lurus.cn">support@lurus.cn</a>

重试代码示例见 [错误处理 · 最佳实践](/api/errors#错误处理最佳实践)。

</details>

<details class="lurus-faq-item" id="insufficient-quota">
<summary>返回 <code>402</code> / <code>insufficient_quota</code>（配额 / 余额不足）</summary>

```json
{ "error": { "code": "insufficient_quota", "type": "billing_error" } }
```

- 先确认是否已用完当天免费配额（Free 套餐 100 次/天）
- 查看鹿贝余额：[identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)
- 自助充值或升级套餐，规则见 [计费说明](/platform/billing)

</details>

<details class="lurus-faq-item">
<summary><code>context_length_exceeded</code>（上下文超限）</summary>

```json
{ "error": { "code": "context_length_exceeded", "type": "invalid_request_error" } }
```

如 `deepseek-chat` 64K、`gemini-3-pro-preview` 1M，超出模型上限时：

- 减少输入、删减历史消息
- 用滑动窗口（保留 system + 最近 N 轮）
- 切换更长上下文的模型

</details>

<details class="lurus-faq-item">
<summary>请求超时 / 长时间无响应</summary>

1. 检查网络连通：`curl https://api.lurus.cn/v1/models`
2. 减小 `max_tokens`
3. 推理模型（`deepseek-reasoner`）思考时间长属正常
4. SDK 默认超时约 60 秒，可调大 `timeout`
5. 持续超时可能为上游故障，换一个模型再试

</details>

---

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">没找到？联系 support@lurus.cn</p>
    <div class="lurus-callout__body">请附上：错误信息完整内容、请求 ID（响应头 <code>X-Request-ID</code>）、发生时间、复现步骤，便于快速定位。</div>
  </div>
</div>

<NextSteps
  title="相关文档"
  :steps="[
    { text: '错误处理（完整错误码）', link: '/api/errors', primary: true },
    { text: '常见问题', link: '/guide/faq' },
    { text: '计费说明', link: '/platform/billing' },
  ]"
/>

</div>
