---
title: 计费详解
description: Lurus 订阅计划、配额管理和鹿贝经济系统详细说明。
---

<div class="billing-page">

# 计费详解 <StatusBadge status="live" />

订阅计划、配额管理和鹿贝经济系统。

<MetricStats
  :items="[
    { label: '订阅计划', value: '4 档', hint: 'Free → Enterprise' },
    { label: '支付方式', value: '3 种', hint: 'Stripe / Creem / Epay' },
    { label: '充值返利', value: '最高 5%', hint: '前 6 次续费' },
    { label: '退款窗口', value: '7 天', hint: '首次订阅全额退' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> 订阅</span>
  <h2 class="lurus-section-head__title">订阅计划对比</h2>
  <p class="lurus-section-head__lede">从免费试用到企业 SLA，按使用量级选择。</p>
</div>

| 计划 | API 调用 | 可用模型 | Lucrum | 支持 / 其他 |
|------|---------|---------|--------|------------|
| **Free** | 100 次/天 | 基础（deepseek-chat、gpt-3.5-turbo） | AI 助手 10 次对话/天 | 社区支持 |
| **Basic** | 入门月订阅，定价以控制台为准 | — | — | 个人开发者尝鲜 |
| **Pro**（月/年付，年付享优惠） | 10,000 次/月 | 全部 | AI 助手无限；策略部署最多 3 个 | 邮件工单（24h 响应） |
| **Enterprise**（定制） | 按需 | 全部 + 私有部署 | 团队成员无限 | SLA 99.9%；专属客户经理 + 即时响应；可指定数据中心 |

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="briefcase" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">企业方案</p>
    <div class="lurus-callout__body">需要私有部署、指定数据中心或 SLA 99.9%？联系 <a href="mailto:business@lurus.cn">business@lurus.cn</a>。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> 配额</span>
  <h2 class="lurus-section-head__title">配额管理</h2>
  <p class="lurus-section-head__lede">每次调用按模型与 Token 用量折算配额，超限自动转鹿贝扣费。</p>
</div>

### 配额计算

每次 API 调用消耗的配额与模型和 Token 用量相关：

| 模型类型 | 配额消耗规则 |
|---------|-------------|
| 基础模型（deepseek-chat 等） | 1 次调用 = 1 配额 |
| 高级模型（gpt-4o 等） | 1 次调用 = 3 配额 |
| 图像/视频生成 | 根据任务复杂度 = 5-20 配额 |

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
    <div class="lurus-callout__body">余额不足时会通过邮件 + 站内消息提前预警，不会在你不知情时中断服务。</div>
  </div>
</div>

### 配额告警

| 告警阈值 | 通知方式 |
|---------|---------|
| 剩余 30% | 站内消息 |
| 剩余 10% | 站内消息 + 邮件 |
| 配额耗尽 | 站内消息 + 邮件 + WebSocket 推送 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿贝</span>
  <h2 class="lurus-section-head__title">鹿贝经济</h2>
  <p class="lurus-section-head__lede">统一积分货币，按比例兑换 Token 与调用次数。</p>
</div>

### 鹿贝价值

1 鹿贝（LB）的基准价值：

| 资源 | 1 LB 可兑换 |
|------|------------|
| Token（基础模型） | 约 10,000 tokens |
| Token（高级模型） | 约 3,000 tokens |
| API 调用 | 约 5-10 次（取决于模型） |

### 充值比例

| 充值金额（CNY） | 获得鹿贝 | 单价 |
|----------------|---------|------|
| ¥10 | 10 LB | ¥1.00/LB |
| ¥50 | 55 LB | ¥0.91/LB |
| ¥100 | 115 LB | ¥0.87/LB |
| ¥500 | 600 LB | ¥0.83/LB |

充值越多，单价越低。

### VIP 折扣叠加

VIP 折扣在鹿贝消费时自动生效。

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="crown" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">举例：金卡 9 折</p>
    <div class="lurus-callout__body">金卡用户调用 gpt-4o（3 LB/次）实际扣费 = <code>3 × 0.9 = 2.7 LB/次</code>。</div>
  </div>
</div>

### 鹿贝有效期

购买的鹿贝永久有效；活动赠送以活动说明为准；退款仅退现金支付部分，赠送鹿贝不退。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 账单</span>
  <h2 class="lurus-section-head__title">账单与发票</h2>
</div>

- **查看账单**（[identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)）：月度消费汇总、交易明细、鹿贝收支、配额使用统计。
- **开具发票**（支持增值税普通/专用发票）：「账单」→「申请发票」→ 填发票信息（首次保存后自动填充）→ 选金额和月份。电子发票通常 1 个工作日内发邮箱。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="repeat" :size="14" /> 退款</span>
  <h2 class="lurus-section-head__title">退款政策</h2>
</div>

| 类型 | 政策 |
|------|------|
| 订阅退款 | 首次订阅 7 天内可全额退款 |
| 鹿贝充值退款 | 未使用的鹿贝可申请退款（扣除赠送部分） |
| 已消费部分 | 不支持退款 |

退款请联系 [support@lurus.cn](mailto:support@lurus.cn)。

<NextSteps
  title="下一步"
  :steps="[
    { text: '平台概述', link: '/platform/', primary: true },
    { text: '常见问题', link: '/platform/faq' },
    { text: '获取 API Key', link: '/guide/get-api-key' },
  ]"
/>

</div>
