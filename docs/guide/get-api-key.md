---
title: 获取 API Key
description: 注册 Lurus 账号并获取 API Key 的完整步骤。
---

<div class="getkey-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> 获取 API Key</span>
  <h1 class="lurus-section-head__title">注册账号，创建你的第一个 Key</h1>
  <p class="lurus-section-head__lede">3 分钟拿到可用的 API Key。</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">OIDC / OAuth 接入</p>
    <div class="lurus-callout__body">让终端用户以 Lurus 账号登录自有应用，或后端以 Service User + JWT Profile 调用，可改用统一身份认证：<a href="/platform/auth/oidc">OIDC / OAuth2 集成</a> · <a href="/platform/auth/api-auth">API 认证（PAT/JWT）</a>。API Key 与 OIDC Token 共存，两种均有效。</div>
  </div>
</div>

## 注册与创建 Key

<ol class="lurus-steps">
<li>

访问 [Lurus 控制台](https://api.lurus.cn) →「注册」→ 填邮箱密码 → 完成邮箱验证。

</li>
<li>

登录 → 左侧「令牌管理」→「创建新令牌」→ 填令牌名称（便于识别）→ 确认。

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">只显示一次</p>
    <div class="lurus-callout__body">创建后请立即复制保存 API Key，<strong>只显示一次</strong>！</div>
  </div>
</div>

## API Key 格式

以 `sk-` 开头，48 位随机字符：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`。

## 管理 API Key

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="bar-chart-3" :size="22" /></span>
    <div class="lurus-card__title">查看用量</div>
    <p class="lurus-card__body">「令牌管理」页面显示每个 Key 的已用额度、剩余额度、最近调用时间。</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="lock" :size="22" /></span>
    <div class="lurus-card__title">禁用 / 删除</div>
    <p class="lurus-card__body">禁用 = 暂停使用权限（可恢复）；删除 = 永久删除（不可恢复）。</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="filter" :size="22" /></span>
    <div class="lurus-card__title">设置模型权限</div>
    <p class="lurus-card__body">点 Key 旁「编辑」→「可用模型」选允许的模型 → 保存。</p>
  </div>
</div>

## 安全建议

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">把 Key 当密码管</p>
    <div class="lurus-callout__body">不泄露（不提交公开仓库）；每 90 天轮换一次 Key；最小权限（只授予必需模型）；定期检查调用日志发现异常及时处理。</div>
  </div>
</div>

## 常见问题

<details class="lurus-faq-item">
<summary>忘记了 Key 怎么办？</summary>

无法找回，创建新 Key。

</details>

<details class="lurus-faq-item">
<summary>Key 被盗用了？</summary>

立即禁用或删除该 Key 并创建新 Key。

</details>

<details class="lurus-faq-item">
<summary>额度用完了？</summary>

自助充值或升级套餐——先在 [计费详解](/platform/billing) 看档位（Free / Basic / Pro），再到 [控制台](https://api.lurus.cn) 充值或升级。

</details>

<NextSteps
  title="下一步"
  :steps="[
    { text: '快速开始', link: '/guide/quickstart', primary: true },
    { text: '支持的模型', link: '/guide/models' },
    { text: '计费详解', link: '/platform/billing' },
  ]"
/>

</div>
