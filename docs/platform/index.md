---
title: Lurus Platform — 账号与计费
description: Lurus 统一账号体系、订阅计划、账号钱包和计费系统说明。
---

<div class="platform-page">

<ProductHero product-id="platform" />

## 概述

**Lurus Platform** 是所有 Lurus 产品共享的统一账号和计费基础设施。无论你使用 Lurus API、Lucrum、Switch 还是其他产品，都通过同一个 Lurus 账号登录，共享同一个钱包余额和订阅计划。

<CapabilityGrid
  accent="var(--lurus-color-platform)"
  title="平台基础能力"
  :items="[
    { title: '统一账号', body: '跨所有 Lurus 产品共享同一身份、余额、订阅', icon: 'user-check' },
    { title: '账号钱包', body: '记录余额与交易明细，用于按量扣费', icon: 'coins' },
    { title: '订阅计划', body: '个人订阅与企业合同两种方式', icon: 'package-2' },
  ]"
/>

---

## 统一账号

访问任意 Lurus 产品（[hub.lurus.cn](https://hub.lurus.cn)、[lucrum.lurus.cn](https://lucrum.lurus.cn) 等）即可注册/登录。**登录方式**：邮箱+密码、GitHub（OAuth）、Google（OAuth）。

注册成功获得：

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">统一用户身份</div>
    <p class="lurus-card__body">一份账号跨所有产品通用</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">@lurus.cn 邮箱</div>
    <p class="lurus-card__body">自动开通 <code>username@lurus.cn</code>（基于 Stalwart）</p>
  </div>
</div>

**账号管理**（登录 [identity.lurus.cn](https://identity.lurus.cn) → 账号设置）：个人信息、登录历史、第三方绑定、安全设置（改密码、两步验证）。

**一次登录，全站通行**：基于 OIDC 标准，登录任意产品即在所有产品间建立会话；支持 Passkey/WebAuthn 无密码、TOTP/硬件密钥 MFA、GitHub/Google 社交登录，企业可对接 Azure AD/飞书/Okta SSO。终端用户一份账号通吃 API/Lucrum/Switch/Creator/Lutu；开发者用 OIDC SDK 接入自有应用，后端用 Service User + JWT Profile；企业组织管理（成员/权限/审计）经 [identity.lurus.cn](https://identity.lurus.cn)（Casdoor 控制台）或联系商务开通。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">深入身份认证</p>
    <div class="lurus-callout__body"><a href="/platform/auth/">统一身份认证</a> · <a href="/platform/auth/oidc">OIDC / OAuth2 集成</a> · <a href="/platform/auth/api-auth">API 认证</a></div>
  </div>
</div>

---

## 计费体系

Lurus 采用「订阅 + 按量」双轨计费模型，灵活适配不同使用量级。

### 订阅计划

| 计划 | 定位 | 适合 |
|------|------|------|
| **Free** | 基础额度，免费使用 | 个人试用 |
| **Basic** | 入门月订阅 | 个人开发者 |
| **Pro** | 进阶月订阅 + 优先模型 | 深度用户 |
| **Pro 年付** | Pro 年付优惠 | 稳定用户 |
| **Enterprise** | 企业定制 + SLA | 团队 / 企业 |

具体定价以 [identity.lurus.cn](https://identity.lurus.cn) 控制台（订阅管理页）为准。

### 按量计费

超出订阅包含额度后，从账号钱包余额扣费。不同模型的单价不同，以控制台显示为准。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">计费方式与退款</p>
    <div class="lurus-callout__body"><a href="/platform/billing">计费详解</a> 说明了当前的计费方式、余额不足时的处理、发票与退款。</div>
  </div>
</div>

---

## 账号钱包 {#wallet}

账号钱包记录余额与交易明细，用于支付超出订阅额度的用量。余额、交易记录与充值入口见 [identity.lurus.cn](https://identity.lurus.cn) 账号中心。价格、赠送与折扣规则以控制台为准，本文档不列具体数值。

---

## 支付方式

所有支付经 Webhook 异步确认，避免网络波动造成重复扣费。可用的支付渠道以结算页显示为准；企业客户可走合同与对公转账。

---

## 通知服务

多渠道通知（账号设置可自定义每类通知的接收渠道）：

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">站内消息</div>
    <p class="lurus-card__body">账号变更 / 安全警告 / 系统公告</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">邮件</div>
    <p class="lurus-card__body">付款确认 / 配额告警 / 订阅到期</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">WebSocket</div>
    <p class="lurus-card__body">实时推送 API 异常 / 余额不足</p>
  </div>
</div>

---

## 数据安全

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">企业级身份认证</div>
    <p class="lurus-card__body">基于 <Term t="OIDC">OIDC</Term> 标准系统</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">全站 HTTPS</div>
    <p class="lurus-card__body">传输全程 TLS 1.3 加密</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">密码不存明文</div>
    <p class="lurus-card__body">bcrypt 加密存储</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="receipt" :size="20" /></span>
    <div class="lurus-card__title">合规支付网关</div>
    <p class="lurus-card__body">支付走 PCI DSS 合规第三方</p>
  </div>
</div>

用户数据严格隔离不共享。

---

## 交互式 API 参考

平台的账号、钱包、订阅与组织管理接口都有一份 **在线可调试的 API 浏览器**：

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="book-open" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">identity.lurus.cn/docs/api</p>
    <div class="lurus-callout__body">在浏览器里浏览全部端点、查看请求/响应结构并直接发起调用 → <a href="https://identity.lurus.cn/docs/api" target="_blank" rel="noreferrer">打开交互式 API 参考</a>。原始 OpenAPI 3.1 描述文件见 <a href="https://identity.lurus.cn/docs/openapi.yaml" target="_blank" rel="noreferrer">/docs/openapi.yaml</a>，可直接用于生成客户端 SDK。两者均无需登录。</div>
  </div>
</div>

机器对机器的取 token 方式（PAT / Service Account / JWT Profile）见 [API 认证](/platform/auth/api-auth)。

---

<NextSteps
  title="下一步"
  :steps="[
    { text: '身份认证 (Casdoor)', link: '/platform/auth/', primary: true },
    { text: '交互式 API 参考', link: 'https://identity.lurus.cn/docs/api', external: true },
    { text: '计费详解', link: '/platform/billing' },
    { text: '常见问题', link: '/platform/faq' },
    { text: '获取 API Key', link: '/guide/get-api-key' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="platform" />

</div>

<style>
.platform-page .lurus-card code {
  font-size: 0.85em;
}
</style>
