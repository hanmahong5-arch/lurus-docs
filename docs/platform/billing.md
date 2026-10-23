---
title: 计费详解
description: Lurus 当前的计费方式、余额不足时的处理、发票与退款。
---

<div class="billing-page">

# 计费详解

本页只说明计费方式，不列具体价格。价格与额度以控制台和合同为准。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> 方式</span>
  <h2 class="lurus-section-head__title">计费方式</h2>
</div>

- **企业合同**：私有化部署与托管交付按合同约定的范围结算，对公转账并开具发票。需要私有部署或指定数据中心，联系 [business@lurus.cn](mailto:business@lurus.cn)。
- **个人订阅**：在 [identity.lurus.cn](https://identity.lurus.cn) 的订阅管理页查看可用套餐与价格；超出订阅额度的用量从[账号钱包](/platform/#wallet)余额扣费。
- **租户额度**：在 [Lurus Hub](/hub/) 中，租户管理员可以为组织、团队或下游客户分别管理额度并查看用量。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> 额度</span>
  <h2 class="lurus-section-head__title">额度或余额不足</h2>
</div>

每次调用按模型与 Token 用量折算消耗；额度和余额都不足时，请求会被拒绝并返回额度不足的错误。排查步骤见 [故障排查 · 配额 / 余额不足](/guide/troubleshooting#insufficient-quota)。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 账单</span>
  <h2 class="lurus-section-head__title">账单、发票与退款</h2>
</div>

- **查看账单**：登录 [identity.lurus.cn](https://identity.lurus.cn) 查看交易明细与用量统计。
- **发票**：企业合同按合同开具；其他情况联系 [support@lurus.cn](mailto:support@lurus.cn)。
- **退款**：联系 [support@lurus.cn](mailto:support@lurus.cn)，已消费部分不退。

<NextSteps
  title="下一步"
  :steps="[
    { text: '平台概述', link: '/platform/', primary: true },
    { text: '常见问题', link: '/platform/faq' },
    { text: '获取 API Key', link: '/guide/get-api-key' },
  ]"
/>

</div>
