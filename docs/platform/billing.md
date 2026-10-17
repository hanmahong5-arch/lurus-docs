---
title: 计费详解
description: Lurus 订阅计划、配额管理和鹿贝经济系统详细说明。
---

<div class="billing-page">

# 计费详解 <StatusBadge status="live" />

订阅计划、配额管理和鹿贝经济系统。

<MetricStats
  :items="[
    { label: '订阅计划', value: '5 档', hint: 'Free → Enterprise，另有 Claude Code 套餐' },
    { label: '支付方式', value: '5 类', hint: '支付宝 / 微信 / Stripe / 对公 / 备用' },
    { label: '鹿贝', value: '1 元 = 1 LB', hint: '充值多少到账多少' },
    { label: '退款窗口', value: '7 天', hint: '付款后 7 天内整笔申请' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> 订阅</span>
  <h2 class="lurus-section-head__title">订阅计划对比</h2>
  <p class="lurus-section-head__lede">从免费试用到企业 SLA，按使用量级选择。</p>
</div>

| 计划 | 定位 | 说明 |
|------|------|------|
| **Free** | 免费试用 | 每日有免费额度，可用模型较少 |
| **Basic** | 入门月订阅 | 个人开发者 |
| **Pro** | 进阶订阅，可月付或年付 | 年付总价低于 12 个月月付 |
| **Enterprise** | 团队 / 企业 | 私有部署、SLA 等按商务约定 |

每档的价格、每日额度与可用模型以 [identity.lurus.cn](https://identity.lurus.cn) 控制台（订阅管理页）为准，管理员调整后即时生效，本页不另抄一份数字。另有面向 Claude Code 的独立套餐，同样以控制台为准。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="briefcase" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">企业方案</p>
    <div class="lurus-callout__body">需要私有部署、指定数据中心或 SLA？联系 <a href="mailto:business@lurus.cn">business@lurus.cn</a>。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> 配额</span>
  <h2 class="lurus-section-head__title">配额管理</h2>
  <p class="lurus-section-head__lede">先用订阅额度，用完按模型单价从鹿贝钱包扣费。</p>
</div>

### 配额计算

每次调用按模型单价与 Token 用量计费：对话类模型输入、输出分开计价，图像等按次计价。各模型单价以控制台显示为准。

### 配额超限处理

<ol class="lurus-steps">
<li>请求进入，先检查订阅配额。</li>
<li>配额<strong>充足</strong> → 正常处理。</li>
<li>配额<strong>不足</strong> → 检查鹿贝余额：余额充足则自动扣费正常处理。</li>
<li>余额<strong>不足</strong> → 返回 <code>402</code> 错误。</li>
</ol>

收到 `402` / `insufficient_quota`？排查步骤见 [故障排查 · 配额 / 余额不足](/guide/troubleshooting#insufficient-quota)。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">不会悄悄失败</p>
    <div class="lurus-callout__body">钱包余额低于设定的阈值时会发出提醒；余额不足时请求直接返回 402，不会先欠费再催缴。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿贝</span>
  <h2 class="lurus-section-head__title">鹿贝经济</h2>
  <p class="lurus-section-head__lede">钱包的记账单位，1 鹿贝 = 1 元人民币。</p>
</div>

### 充值

充值 1 元到账 1 鹿贝，没有阶梯赠送。管理员如设置了充值优惠，以充值页显示的实付金额为准。

### VIP 折扣

按累计充值金额（或年付订阅）评定 VIP 等级，折扣在购买和续费订阅时自动生效；充值和按量扣费不打折。

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="crown" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">举例：金卡 95 折</p>
    <div class="lurus-callout__body">默认门槛下，累计充值满 ¥2,000 为金卡；续费 ¥99 的月订阅实付 <code>99 × 0.95 = ¥94.05</code>。门槛与折扣以控制台为准。</div>
  </div>
</div>

### 鹿贝有效期

充值得到的余额不过期；活动赠送的额度可能有有效期，以活动说明为准。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 账单</span>
  <h2 class="lurus-section-head__title">账单与发票</h2>
</div>

- **查看账单**（[identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)）：月度消费汇总、交易明细、鹿贝收支、配额使用统计。
- **开具发票**：每笔已付款订单可申请发票，填写抬头与税号，由人工开具后可在控制台下载。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="repeat" :size="14" /> 退款</span>
  <h2 class="lurus-section-head__title">退款政策</h2>
</div>

| 类型 | 政策 |
|------|------|
| 订阅 | 付款后 7 天内可在控制台申请，审核通过后整笔退回 |
| 充值 | 付款后 7 天内、这笔充值未动用时可整笔申请退款 |
| 已消费部分 | 不支持退款 |

支付宝、微信支付、Stripe 付款原路退回，其他方式退回钱包。

<NextSteps
  title="下一步"
  :steps="[
    { text: '平台概述', link: '/platform/', primary: true },
    { text: '常见问题', link: '/platform/faq' },
    { text: '获取 API Key', link: '/guide/get-api-key' },
  ]"
/>

</div>
