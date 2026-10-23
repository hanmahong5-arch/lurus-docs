---
title: 平台常见问题
description: Lurus 平台账号、计费和服务相关的常见问题与解答。
---

<div class="faq-page">

# 常见问题

平台账号、订阅计费、钱包与安全的高频问题，按主题分组。

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> 账号</span>
  <h2 class="lurus-section-head__title">账号</h2>
</div>

<details class="lurus-faq-item">
<summary>一个账号通用所有产品吗？</summary>

是。统一账号体系，注册一次登录所有产品（API、Lucrum、Switch、Creator 等），共享钱包余额和订阅计划。

</details>

<details class="lurus-faq-item">
<summary>怎么改密码？</summary>

登录 [identity.lurus.cn](https://identity.lurus.cn) → 账号设置 → 安全 → 修改密码。

</details>

<details class="lurus-faq-item">
<summary>忘记密码怎么办？</summary>

登录页点击「忘记密码」，注册邮箱收重置链接。

</details>

<details class="lurus-faq-item">
<summary>如何删除账号？</summary>

联系 [support@lurus.cn](mailto:support@lurus.cn) 注销，所有数据（API Key / 钱包余额 / 交易记录）永久删除不可恢复。

</details>

<details class="lurus-faq-item">
<summary>支持哪些第三方登录？</summary>

GitHub、Google OAuth，账号设置中绑定 / 解绑。

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> 订阅与计费</span>
  <h2 class="lurus-section-head__title">订阅与计费</h2>
</div>

<details class="lurus-faq-item">
<summary>如何升级 / 降级套餐？</summary>

登录 [identity.lurus.cn](https://identity.lurus.cn) → 订阅管理 →「变更套餐」：升级立即生效按比例补差价；降级下个计费周期生效。

</details>

<details class="lurus-faq-item">
<summary>订阅到期后会怎样？</summary>

自动降级 Free，API Key 仍有效但受 Free 配额限制，数据保留随时续费恢复。

</details>

<details class="lurus-faq-item">
<summary>企业版怎么给团队加成员？</summary>

管理后台 → 团队 → 邀请成员 → 输邮箱发邀请 → 成员接受加入 → 可为每成员分配独立 API Key 和配额。

</details>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">想看完整配额与定价规则？</p>
    <div class="lurus-callout__body">详见 <a href="/platform/billing">计费详解</a>。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 钱包</span>
  <h2 class="lurus-section-head__title">钱包</h2>
</div>

<details class="lurus-faq-item">
<summary>怎么查余额和收支记录？</summary>

登录 [identity.lurus.cn](https://identity.lurus.cn) → 钱包，查看当前余额与收支明细。

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> 支付</span>
  <h2 class="lurus-section-head__title">支付</h2>
</div>

可用的支付渠道以结算页显示为准；企业客户可走合同与对公转账。

<details class="lurus-faq-item">
<summary>付款未到账怎么办？</summary>

通常 1 分钟内确认；超 5 分钟未到账则检查支付平台是否扣款、查邮箱确认邮件、联系 [support@lurus.cn](mailto:support@lurus.cn) 提供支付订单号。

</details>

<details class="lurus-faq-item">
<summary>如何申请发票？</summary>

管理后台 → 账单 → 申请发票（增值税普通 / 专用），通常 1 个工作日内发邮箱。

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 安全</span>
  <h2 class="lurus-section-head__title">安全</h2>
</div>

<details class="lurus-faq-item">
<summary>我的数据安全吗？</summary>

全程 HTTPS（TLS 1.3）；密码 bcrypt 加密存储；支付走 PCI DSS 合规第三方；API 调用内容不存储（仅记元数据用于计费）。

</details>

<details class="lurus-faq-item">
<summary>API Key 被盗用怎么处理？</summary>

立即控制台禁用该 Key → 创建新 Key → 检查调用日志确认异常消费 → 联系客服处理异常扣费。

</details>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">没有找到答案？</p>
    <div class="lurus-callout__body">请联系 <a href="mailto:support@lurus.cn">support@lurus.cn</a>。</div>
  </div>
</div>

<NextSteps
  title="下一步"
  :steps="[
    { text: '平台概述', link: '/platform/', primary: true },
    { text: '计费详解', link: '/platform/billing' },
    { text: '获取 API Key', link: '/guide/get-api-key' },
  ]"
/>

</div>
