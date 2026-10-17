---
title: Lurus Platform — 账号与计费
description: Lurus 统一账号体系、订阅计划、鹿贝钱包和计费系统说明。
---

<div class="platform-page">

<ProductHero product-id="platform" />

## 概述

**Lurus Platform** 是所有 Lurus 产品共享的统一账号和计费基础设施。无论你使用 Lurus API、Lucrum、Switch 还是其他产品，都通过同一个 Lurus 账号登录，共享同一个钱包余额和订阅计划。

<CapabilityGrid
  accent="var(--lurus-color-platform)"
  title="平台四大支柱"
  :items="[
    { title: '统一账号', body: '跨所有 Lurus 产品共享同一身份、余额、订阅', icon: 'user-check' },
    { title: '鹿贝钱包', body: '统一计费单位，按量扣费，实时余额查询', icon: 'coins' },
    { title: '订阅计划', body: '免费额度 + 按需付费 + 企业套餐', icon: 'package-2' },
    { title: 'VIP 体系', body: '按累计充值升级，订阅享折扣', icon: 'crown' },
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
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">鹿贝钱包</div>
    <p class="lurus-card__body">注册即开通，1 元 = 1 鹿贝，所有产品共用</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <div class="lurus-card__title">免费配额</div>
    <p class="lurus-card__body">注册后可立即试用 Lurus API</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">@lurus.cn 邮箱</div>
    <p class="lurus-card__body">自动开通 <code>username@lurus.cn</code>（基于 Stalwart）</p>
  </div>
</div>

**账号管理**（登录 [identity.lurus.cn](https://identity.lurus.cn) → 账号设置）：个人信息、登录历史、第三方绑定、安全设置（改密码、两步验证）。

**一次登录，全站通行**：基于 OIDC 标准，登录任意产品即在所有产品间建立会话；支持 Passkey/WebAuthn 无密码、TOTP/硬件密钥 MFA、GitHub/Google 社交登录，企业可对接 Azure AD/飞书/Okta SSO。终端用户一份账号通吃 API/Lucrum/Switch/Creator/Lutu；开发者用 OIDC SDK 接入自有应用，后端用 Service User + JWT Profile；企业组织管理（成员/权限/审计）经 [identity.lurus.cn](https://identity.lurus.cn)（Zitadel 控制台）或联系商务开通。

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

另有面向 Claude Code 的独立套餐。具体价格以 [identity.lurus.cn](https://identity.lurus.cn) 控制台（订阅管理页）为准。

### 按量计费

超出订阅包含额度后，自动从鹿贝钱包扣费。不同模型的单价不同，以控制台显示为准。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">想看完整定价、配额规则与充值比例？</p>
    <div class="lurus-callout__body"><a href="/platform/billing">计费详解</a> 拆解了订阅计划对比、配额计算、鹿贝充值规则与退款政策。</div>
  </div>
</div>

---

## 鹿贝钱包 {#wallet}

**鹿贝（LB）** 是 Lurus 平台钱包的记账单位，1 鹿贝 = 1 元人民币，用于支付所有产品的按量费用。

### 获取鹿贝

| 途径 | 奖励 | 说明 |
|------|------|------|
| **充值购买** | 1 元 = 1 鹿贝 | 充值多少到账多少；如有充值优惠，以充值页显示为准 |
| **每日签到** | 每天 0.1 鹿贝 | 连续签到每满 7 天奖励 ×1.5，单日最多 1 鹿贝 |
| **推荐好友** | 5 鹿贝 / 人 | 好友通过你的推荐链接注册，你获得 5 鹿贝；无邀请上限 |

### 使用鹿贝

可用于：支付超出订阅额度的 API 调用等所有产品的按量费用，以及购买订阅。

### VIP 等级

按累计充值金额（或年付订阅）评定 VIP 等级。VIP 折扣在购买和续费订阅时自动生效；充值和按量扣费不打折。默认门槛为累计充值 ¥500 / ¥2,000 / ¥10,000 / ¥50,000，对应 98 / 95 / 92 / 90 折，以控制台为准。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">Standard</span><span class="lurus-stat__label">入门</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Silver</span><span class="lurus-stat__label">白银</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Gold</span><span class="lurus-stat__label">黄金</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Platinum</span><span class="lurus-stat__label">铂金</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Diamond</span><span class="lurus-stat__label">钻石</span></div>
</div>

阈值与折扣详见 [identity.lurus.cn](https://identity.lurus.cn) 账号中心 VIP 页。

---

## 支付方式

所有渠道注册进同一个收款中心：回调逐笔验签并核对商户、金额与订单号，漏掉的回调由主动查单兜底，退款幂等、原路返回，渠道日对账单自动比对。

| 方式 | 场景 | 说明 |
|------|------|------|
| **支付宝直连** | 充值 / 订阅 | 电脑端扫码、手机网站、电脑网站支付，按设备自动选择 |
| **微信支付直连** | 充值 / 订阅 | 扫码、公众号 / 小程序、APP 支付 |
| **Stripe** | 订阅 + 充值 | 国际信用卡 / 借记卡 |
| **对公转账** | 企业充值 | 按附言码自动核销，网银流水导入查重 |
| **Creem / 易支付** | 充值 | 备用渠道，按部署开启 |

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">现状</p>
    <div class="lurus-callout__body">支付宝、微信支付直连的代码已就绪并有测试覆盖，但还没有用真实商户号跑通过；某个渠道是否已开通，以充值页实际显示为准。</div>
  </div>
</div>

---

## 推荐计划

[identity.lurus.cn](https://identity.lurus.cn) 复制专属推荐链接（含推荐码）分享好友。奖励：好友经你的链接注册，你获得 5 鹿贝；无邀请上限。

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
    { text: '身份认证 (Zitadel)', link: '/platform/auth/', primary: true },
    { text: '私有化部署', link: '/platform/self-host' },
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
