---
title: Lurus API 常见问题
description: Lurus API 使用中的常见问题与解答，包括计费、兼容性和故障排查。
---

<div class="faq-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> 常见问题</span>
  <h1 class="lurus-section-head__title">常见问题</h1>
  <p class="lurus-section-head__lede">账号、模型、计费、故障排查 —— 按主题展开。</p>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> 账号与认证</span>
  <h2 class="lurus-section-head__title">账号与认证</h2>
</div>

<details class="lurus-faq-item">
<summary>如何注册？</summary>

[api.lurus.cn](https://api.lurus.cn) 填邮箱密码（或 GitHub/Google 登录），自动得 5 鹿贝 + 免费配额，所有产品共享同一账号。

</details>

<details class="lurus-faq-item">
<summary>API Key 丢失了？</summary>

只显示一次无法找回，控制台删旧建新。存密码管理器/环境变量勿写代码；每账号可建多个 Key，按项目分配独立 Key 更安全。

</details>

<details class="lurus-faq-item">
<summary>Key 无效怎么排查？</summary>

- Key 完整（`sk-` 开头无漏字符）
- 状态「启用」（控制台 → 令牌管理）
- 请求头 `Authorization: Bearer sk-xxxx`（Bearer 后一空格）
- 无多余空格/换行（重新复制）
- 环境变量名拼写正确且已加载

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 模型与调用</span>
  <h2 class="lurus-section-head__title">模型与调用</h2>
</div>

<details class="lurus-faq-item">
<summary>支持哪些模型？</summary>

OpenAI、Claude、Gemini、DeepSeek 等，见 [模型列表](/guide/models)。

</details>

<details class="lurus-faq-item">
<summary>返回 <code>"no available server"</code></summary>

检查模型名；确认 Key 有该模型权限；该模型可能暂无可用渠道，联系管理员。

</details>

<details class="lurus-faq-item">
<summary>如何切换模型？</summary>

只改 `model` 参数，其他不变。

</details>

<details class="lurus-faq-item">
<summary>怎么开启流式响应？</summary>

设 `"stream": true`，响应经 SSE 逐块返回。

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> 计费与配额</span>
  <h2 class="lurus-section-head__title">计费与配额</h2>
</div>

<details class="lurus-faq-item">
<summary>怎么查用量？</summary>

控制台「数据看板」或「使用日志」。

</details>

<details class="lurus-faq-item">
<summary>配额用完了？</summary>

联系管理员充值或升级套餐。

</details>

<details class="lurus-faq-item">
<summary>模型价格在哪看？</summary>

见 [模型列表](/guide/models) 定价。

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="alert-circle" :size="14" /> 技术问题</span>
  <h2 class="lurus-section-head__title">技术问题</h2>
</div>

<details class="lurus-faq-item">
<summary>请求超时怎么办？</summary>

1. 检查网络（`curl https://api.lurus.cn/v1/models`）
2. 减小 `max_tokens`
3. 推理模型（`deepseek-reasoner`）思考时间长属正常
4. SDK 默认超时约 60 秒，可调大 `timeout`
5. 持续超时可能上游故障，换模型

</details>

<details class="lurus-faq-item">
<summary>429 错误（<Term t="Rate Limit">Rate Limit</Term> 超限）</summary>

降低频率 + 指数退避重试（见 [错误处理](/api/errors)）；Free 默认 60 RPM，升级 Pro/Team 提高限额；付费仍频繁触发联系 support@lurus.cn。

</details>

<details class="lurus-faq-item">
<summary>上下文超限（如 <code>deepseek-chat</code> 64K、<code>gemini-3-pro-preview</code> 1M）</summary>

- 减少输入删历史
- 滑动窗口（保留 system + 最近 N 轮）
- 切更长上下文模型
- 超长文档先摘要再传入

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 其他问题</span>
  <h2 class="lurus-section-head__title">其他问题</h2>
</div>

<details class="lurus-faq-item">
<summary>数据安全吗？</summary>

全程 HTTPS；不存对话内容；仅记调用元数据用于计费。

</details>

<details class="lurus-faq-item">
<summary>有 SLA 保证吗？</summary>

企业客户可签 SLA，联系商务。

</details>

<details class="lurus-faq-item">
<summary>技术支持渠道？</summary>

support@lurus.cn / GitHub Issues。

</details>

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">没有找到答案？</p>
    <p class="lurus-cta__text">把你的问题发给我们，工作日内回复。</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="mailto:support@lurus.cn">联系我们 →</a>
  </div>
</div>

</div>
