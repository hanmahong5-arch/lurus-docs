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
    { title: 'VIP 体系', body: '消费升级，解锁专属模型与客服', icon: 'crown' },
  ]"
/>

---

## 统一账号

访问任意 Lurus 产品（[api.lurus.cn](https://api.lurus.cn)、[lucrum.lurus.cn](https://lucrum.lurus.cn) 等）即可注册/登录。**登录方式**：邮箱+密码、GitHub（OAuth）、Google（OAuth）。

注册成功获得：

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">统一用户身份</div>
    <p class="lurus-card__body">一份账号跨所有产品通用</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">初始 5 鹿贝</div>
    <p class="lurus-card__body">首次注册即得，可立即试用</p>
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

**一次登录，全站通行**：基于 OIDC 标准，登录任意产品即在所有产品间建立会话；支持 Passkey/WebAuthn 无密码、TOTP/硬件密钥 MFA、GitHub/Google 社交登录，企业可对接 Azure AD/飞书/Okta SSO。终端用户一份账号通吃 API/Lucrum/Switch/Creator/Lutu；开发者用 OIDC SDK 接入自有应用，后端用 Service User + JWT Profile；企业组织管理（成员/权限/审计）经 [auth.lurus.cn](https://auth.lurus.cn)（Zitadel 控制台）或联系商务开通。

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

超出订阅包含额度后，自动从鹿贝钱包扣费。不同模型的单价不同，以控制台显示为准。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">想看完整定价、配额规则与充值比例？</p>
    <div class="lurus-callout__body"><a href="/platform/billing">计费详解</a> 拆解了订阅计划对比、配额计算、鹿贝兑换比例与退款政策。</div>
  </div>
</div>

---

## 鹿贝钱包 {#wallet}

**鹿贝（LB）** 是 Lurus 平台的通用积分货币，用于支付所有超量使用费用。

### 获取鹿贝

| 途径 | 奖励 | 说明 |
|------|------|------|
| **新用户注册** | 5 LB | 首次注册即得 |
| **首次充值** | 10 LB 额外奖励 | 首次充值额外赠送 |
| **首次订阅** | 30 LB 额外奖励 | 首次订阅任意付费计划 |
| **订阅续费** | 充值金额 x 5% | 前 6 次续费享受返利 |
| **每日签到** | 随机 LB | 每日签到领取 |
| **推荐好友** | 邀请奖励 | 好友注册后双方获奖 |
| **策略收入** | 分成结算 | Lucrum 策略订阅收入 |
| **充值购买** | 按比例兑换 | 直接购买鹿贝 |

### 使用鹿贝

可用于：支付超订阅配额的 API 调用费、订阅 Lucrum 付费策略、购买高级功能/扩展包。

### VIP 等级

累计消费鹿贝解锁多级 VIP，折扣自动应用于所有鹿贝消费。

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

所有支付经安全 Webhook 异步确认，避免网络波动重复扣费。

| 方式 | 场景 | 说明 |
|------|----------|------|
| **Stripe** | 订阅 + 充值 | 信用卡/借记卡（Visa、Mastercard） |
| **Creem** | 充值 | 加密货币支付 |
| **Epay** | 充值 | 支付宝/微信支付（第三方） |

---

## 推荐计划

[identity.lurus.cn](https://identity.lurus.cn) 复制专属推荐链接（含推荐码）分享好友。奖励：好友经链接注册双方各得鹿贝；好友首次付费订阅你额外得订阅金额一定比例返利；无邀请上限。

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

<NextSteps
  title="下一步"
  :steps="[
    { text: '身份认证 (Zitadel)', link: '/platform/auth/', primary: true },
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
