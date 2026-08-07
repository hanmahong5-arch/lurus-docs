---
title: Lucrum 常见问题
description: Lucrum AI 量化交易平台的常见问题与解答。
---

<div class="lucrum-page">

# 常见问题

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> 账号与入门</span>
  <h2 class="lurus-section-head__title">注册、付费与市场覆盖</h2>
</div>

<<<<<<< HEAD
<details class="lurus-faq-item">
<summary>如何注册？</summary>

[lucrum.lurus.cn](https://lucrum.lurus.cn) 用 Lurus 统一账号登录（所有产品共享同一账号）。

</details>

<details class="lurus-faq-item">
<summary>需要付费吗？</summary>

免费 / 付费两种，超免费额度从 [鹿贝钱包](/platform/billing#wallet) 扣费。
=======
- **如何注册**：[lucrum.lurus.cn](https://lucrum.lurus.cn) 用 Lurus 统一账号登录（所有产品共享同一账号）。
- **需要付费吗**：免费/付费两种，超免费额度从 [鹿贝钱包](/platform/billing#wallet) 扣费。
>>>>>>> origin/main

| 功能 | 免费 | 付费 |
|------|------|------|
| AI 交易助手 | 每日有限对话 | 无限制 |
| 策略市场浏览 / 免费策略 | 全部可见 / 可用 | 全部可见 / 可用 |
| 付费策略订阅 | 不可用 | 可订阅 |
| 策略开发 | 基础回测 | 完整功能 |

<<<<<<< HEAD
</details>

<details class="lurus-faq-item">
<summary>支持哪些市场？</summary>

当前 A 股（沪深两市），港股 / 美股 / 加密接入中。

</details>
=======
- **支持哪些市场**：当前 A 股（沪深两市），港股/美股/加密接入中。

## AI 助手

- **分析准确吗**：基于 LLM + 技术分析提供参考，**不构成投资建议**。擅长解读技术指标/K 线、梳理市场逻辑、辅助策略构思与代码；不擅长预测短期涨跌——作决策参考非依据。
- **会记住对话吗**：会。集成 [MemX 记忆引擎](/memx/)，记住偏好/关注板块/历史对话，按用户隔离不泄露。
- **可用 AI 写策略代码吗**：可以。描述思路 AI 生成 Python 代码框架，可直接在策略工作台回测验证。

## 策略相关

- **回测数据可信吗**：用真实历史行情，但不考虑冲击成本和滑点（大资金有差异）、过度优化易过拟合、过去不保证未来。建议回测后先用模拟盘验证。
- **如何提现策略收入**：收入以鹿贝进钱包 → 登录 [identity.lurus.cn](https://identity.lurus.cn) →「钱包」→「提现」→ 输金额和银行卡 → 通常 1-3 个工作日到账。
- **策略代码会泄露吗**：不会。服务端加密存储，使用者只见描述/指标/回测报告，无法查看源码。

## 技术问题

- **API 返回 429**：超请求频率限制（按套餐不同），降低频率或升级套餐。
- **策略执行延迟高**：检查网络稳定性；策略复杂计算建议预计算缓存；避开开盘/收盘高并发时段。
- **支持哪些语言写策略**：当前 Python，策略 SDK 提供技术指标库和交易执行接口。
>>>>>>> origin/main

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> AI 助手</span>
  <h2 class="lurus-section-head__title">准确性、记忆与代码生成</h2>
</div>

<details class="lurus-faq-item">
<summary>分析准确吗？</summary>

基于 LLM + 技术分析提供参考，**不构成投资建议**。擅长解读技术指标 / K 线、梳理市场逻辑、辅助策略构思与代码；不擅长预测短期涨跌——作决策参考非依据。

</details>

<details class="lurus-faq-item">
<summary>会记住对话吗？</summary>

会。集成 [MemX 记忆引擎](/memx/)，记住偏好 / 关注板块 / 历史对话，按用户隔离不泄露。

</details>

<details class="lurus-faq-item">
<summary>可用 AI 写策略代码吗？</summary>

可以。描述思路 AI 生成 Python 代码框架，可直接在策略工作台回测验证。

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> 策略相关</span>
  <h2 class="lurus-section-head__title">回测可信度、提现与代码保护</h2>
</div>

<details class="lurus-faq-item">
<summary>回测数据可信吗？</summary>

用真实历史行情，但不考虑冲击成本和滑点（大资金有差异）、过度优化易过拟合、过去不保证未来。建议回测后先用模拟盘验证。

</details>

<details class="lurus-faq-item">
<summary>如何提现策略收入？</summary>

收入以鹿贝进钱包 → 登录 [identity.lurus.cn](https://identity.lurus.cn) →「钱包」→「提现」→ 输金额和银行卡 → 通常 1-3 个工作日到账。

</details>

<details class="lurus-faq-item">
<summary>策略代码会泄露吗？</summary>

不会。服务端加密存储，使用者只见描述 / 指标 / 回测报告，无法查看源码。

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> 技术问题</span>
  <h2 class="lurus-section-head__title">限流、延迟与策略语言</h2>
</div>

<details class="lurus-faq-item">
<summary>API 返回 429？</summary>

超请求频率限制（按套餐不同），降低频率或升级套餐。

</details>

<details class="lurus-faq-item">
<summary>策略执行延迟高？</summary>

检查网络稳定性；策略复杂计算建议预计算缓存；避开开盘 / 收盘高并发时段。

</details>

<details class="lurus-faq-item">
<summary>支持哪些语言写策略？</summary>

当前 Python，策略 SDK 提供技术指标库和交易执行接口。

</details>

---

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="mail" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">没有找到答案？</p>
    <div class="lurus-callout__body">请联系 <a href="mailto:support@lurus.cn">support@lurus.cn</a>。</div>
  </div>
</div>

<NextSteps
  :steps="[
    { text: '快速开始', link: '/lucrum/quickstart', primary: true },
    { text: '策略市场', link: '/lucrum/strategies' },
    { text: '产品概览', link: '/lucrum/' },
  ]"
  title="下一步"
/>

</div>
