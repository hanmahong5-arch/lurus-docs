---
title: Lurus Platform — 账号与计费
description: Lurus 统一账号体系、订阅计划、鹿贝钱包和计费系统说明。
---

# Lurus Platform — 账号与计费 <StatusBadge status="live" />

## 概述

**Lurus Platform** 是所有 Lurus 产品共享的统一账号和计费基础设施。无论你使用 Lurus API、Lucrum、Switch 还是其他产品，都通过同一个 Lurus 账号登录，共享同一个钱包余额和订阅计划。

---

## 统一账号

### 注册与登录

访问任意 Lurus 产品（如 [api.lurus.cn](https://api.lurus.cn)、[lucrum.lurus.cn](https://lucrum.lurus.cn)），即可注册或登录 Lurus 账号。

**支持的登录方式**:

| 方式 | 说明 |
|------|------|
| 邮箱 + 密码 | 标准注册方式 |
| GitHub | OAuth 第三方登录 |
| Google | OAuth 第三方登录 |

注册成功后，你会获得：
- 统一的用户身份（跨所有 Lurus 产品）
- 初始鹿贝奖励（5 鹿贝）
- 免费配额（可立即试用 Lurus API）
- 注册即自动开通 `username@lurus.cn` 邮箱（基于 Stalwart）

### 账号管理

在 [admin.lurus.cn](https://admin.lurus.cn) 管理你的账号：

- 修改个人信息
- 查看登录历史
- 管理第三方登录绑定
- 安全设置（密码修改、两步验证）

### 一次登录，全站通行

Lurus 的统一身份体系基于 OIDC 标准协议构建，登录任意产品即在所有产品间建立会话。支持 Passkey / WebAuthn 无密码登录、TOTP / 硬件密钥多因素认证、GitHub / Google 社交登录，企业客户可对接自家 Azure AD / 飞书 / Okta 等 SSO。

- **终端用户**：一份账号通吃 API、Lucrum、Switch、Creator、Lutu 等全部产品
- **开发者**：用 OIDC SDK 一键接入自有应用；后端服务使用 Service User + JWT Profile 安全调用
- **企业管理员**：在 admin 控制台批量管理成员、分配项目权限、查看审计日志

→ 详细文档：[统一身份认证](/platform/auth/) · [OIDC / OAuth2 集成](/platform/auth/oidc) · [API 认证](/platform/auth/api-auth)

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

具体定价以 [admin.lurus.cn](https://admin.lurus.cn) 控制台为准。

### 按量计费

超出订阅包含额度后，自动从鹿贝钱包扣费。不同模型的单价不同，以控制台显示为准。

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

鹿贝可用于：
- 支付超出订阅配额的 API 调用费
- 订阅 Lucrum 付费策略
- 购买高级功能或扩展包

### VIP 等级

累计消费鹿贝解锁多级 VIP 优惠（Standard / Silver / Gold / Platinum / Diamond），折扣自动应用于所有鹿贝消费场景。

具体等级阈值与折扣详见 [admin.lurus.cn](https://admin.lurus.cn) 控制台 VIP 页。

---

## 支付方式

| 方式 | 支持的场景 | 说明 |
|------|----------|------|
| **Stripe** | 订阅 + 充值 | 信用卡/借记卡（Visa、Mastercard） |
| **Creem** | 充值 | 加密货币支付 |
| **Epay** | 充值 | 支付宝/微信支付（通过第三方） |

所有支付通过安全的 Webhook 异步确认，确保不会因网络波动导致重复扣费。

---

## 推荐计划

邀请好友使用 Lurus 产品，双方都能获得奖励。

### 如何邀请

1. 登录 [admin.lurus.cn](https://admin.lurus.cn) → 「推荐」
2. 复制你的专属推荐链接（含推荐码）
3. 分享给好友

### 奖励规则

- 好友通过你的链接注册后，双方各获得鹿贝奖励
- 好友首次付费订阅时，你额外获得订阅金额一定比例的返利
- 无邀请上限

---

## 通知服务

Lurus Platform 内置多渠道通知系统：

| 渠道 | 通知类型 |
|------|---------|
| **站内消息** | 账号变更、安全警告、系统公告 |
| **邮件** | 付款确认、配额告警、订阅到期 |
| **WebSocket** | 实时推送（API 调用异常、余额不足） |

在账号设置中可以自定义通知偏好——选择每种通知通过哪些渠道接收。

---

## 数据安全

| 措施 | 说明 |
|------|------|
| **身份认证** | 基于 <Term t="OIDC">OIDC</Term> 标准的企业级认证系统 |
| **传输加密** | 全站 HTTPS（TLS 1.3） |
| **密码安全** | bcrypt 加密存储，不存储明文 |
| **支付安全** | PCI DSS 合规的第三方支付网关 |
| **数据隔离** | 用户数据严格隔离，不共享 |

---

## 下一步

- [身份认证 (Zitadel)](/platform/auth/) — OIDC 端点、Passkey / MFA、API 认证与控制台管理
- [计费详解](/platform/billing) — 深入了解订阅、配额和鹿贝经济
- [常见问题](/platform/faq) — 账号和计费常见问题
- [获取 API Key](/guide/get-api-key) — 创建你的第一个 API Key

<!-- lurus:related-block -->

---

## 相关产品与下一步

<RelatedProducts product-id="platform" />

