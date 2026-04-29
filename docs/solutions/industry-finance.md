---
title: 金融行业方案
description: Lucrum + Auth + 合规审计 — 面向券商、资管、金融科技的组合方案。
---

# 金融行业方案

## 适用对象

- 券商自营 / 客户 A 股量化
- 资管公司策略研究
- 金融科技公司 AI 投顾
- 家办 / 专业投资者

## 核心组件

<div class="action-grid">
  <ActionCard product-id="lucrum" :actions="[{label:'了解 Lucrum', href:'/lucrum/', primary:true}]" />
  <ActionCard product-id="auth" :actions="[{label:'统一身份', href:'/platform/auth/', primary:true}]" />
</div>

## 典型架构

```
      ┌──────────────┐
      │ 分析师 / PM  │
      └──────┬───────┘
             │ 自然语言描述策略
             ▼
       ┌───────────┐
       │  Lucrum   │  ← 11 个 AI 投资顾问
       └─────┬─────┘
             │ vnpy 代码 + 回测
             ▼
       ┌───────────┐
       │ 策略市场  │
       └─────┬─────┘
             │ 订阅/分成
             ▼
       ┌───────────┐
       │ 实盘交易  │
       └───────────┘
```

## 合规亮点

- **数据不出境**：私有化部署，交易数据本地落盘
- **金融级精度**：Decimal.js 全链路，3,157 Vitest 用例验证
- **审计**：每笔策略变更、回测、交易均留痕
- **身份合规**：MFA 强制，PAT 定期轮换，SSO 联邦可接司内 IdP

## TCO 参考

| 项目 | 自建 | Lucrum 方案 |
|------|------|-----------|
| 研究员人数 | 3-5 人 | 1-2 人 + AI 顾问 |
| 策略上线周期 | 2-4 周 | **1-3 天** |
| 回测基础设施 | 自建 | 内置 |

## 下一步

<NextSteps :steps="[
  { text: 'Lucrum 快速开始', link: '/lucrum/quickstart', primary: true },
  { text: '策略完整流', link: '/tutorials/lucrum-strategy-workflow' },
  { text: '联系商务', link: 'mailto:business@lurus.cn', external: true },
]" />
