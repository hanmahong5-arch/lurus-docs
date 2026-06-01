---
title: 登录与多因素认证 | Zitadel 身份认证
description: Lurus 支持的登录方式（密码、Passkey、社交登录、企业 SSO）与多因素认证策略。
---

# 登录与多因素认证

Lurus 所有产品共用同一套身份认证基础设施（**Zitadel**，对外 `auth.lurus.cn`）。无论用 Lurus API、Switch、Lucrum 还是 Forge，登录都经同一入口，一次登录全线贯通。

---

## 1. 登录流程概览

用户访问任意产品时若无有效会话，应用将浏览器重定向到 `auth.lurus.cn` 验证后带授权码跳回。采用 **OIDC Authorization Code Flow + PKCE**，客户端不存储任何密钥。

```
用户浏览器                Lurus 产品                auth.lurus.cn
   │── 访问产品页面 ─────►│                            │
   │◄── 302 重定向 ───────│                            │
   │── GET /authorize?client_id=&response_type=code&code_challenge=<sha256>&scope=openid ──►│
   │            ┌── 登录页（Zitadel hosted UI）：邮箱/Passkey/SSO ──┐   │
   │◄── 302 redirect_uri?code=<auth_code>&state=... ─────────────────│
   │── 授权码 ───────────►│── POST /token (code + code_verifier) ──►│
   │                      │◄── access_token / id_token ─────────────│
   │◄── 登录成功，进入产品 │                            │
```

**PKCE**：客户端发授权请求前生成随机 `code_verifier`，将其 SHA-256 哈希 `code_challenge` 随请求发出；取回授权码后凭原始 verifier 换 token，服务器验两者一致才颁发。即使授权码被截获也无法换 token。

::: info 会话有效期
默认 Access Token 12 小时，Refresh Token 可静默续期。具体时长由组织策略决定，管理员可在控制台调整。
:::

---

## 2. 支持的登录方式

| 登录方式 | 说明 | 适用场景 |
|---------|------|---------|
| **邮箱 + 密码** | 标准注册，密码满足复杂度策略 | 所有用户 |
| **手机号 + 验证码** | 短信 OTP（需管理员启用） | 视组织配置 |
| **Passkey（WebAuthn）** | 无密码，设备生物特征或硬件密钥 | 推荐主流用户 |
| **GitHub / Google / Microsoft·Azure AD / Apple** | 社交登录（OAuth2 / OIDC） | 视组织配置 |
| **企业 SSO（OIDC/SAML 2.0）** | B2B 客户对接自有 IdP（Okta、飞书、企业微信） | 企业客户 |
| **LDAP** | 企业目录服务直连 | 私有化部署客户 |

::: tip 推荐优先级
Passkey > 社交登录 > 邮箱密码。Passkey 无需记忆密码、抗钓鱼，安全性最高。
:::

---

## 3. Passkey / WebAuthn

**原理**：基于 **WebAuthn / FIDO2**，非对称加密替代密码。注册时设备生成密钥对，**私钥留设备**（受生物特征/PIN 保护），公钥上传 `auth.lurus.cn`；登录时服务器发挑战，设备私钥签名后服务器用公钥验证。全程**零密码传输**，数据库泄露也只得到公钥。

**注册（用户操作）**：登录 `auth.lurus.cn` → **账户设置 → 安全 → 添加 Passkey** → 命名（如"MacBook Touch ID"）→ 完成生物识别 → 下次登录选 Passkey 免密登录。

::: tip 建议注册多个 Passkey
在主力手机 + 笔记本各注册一个，防单设备丢失无法登录。
:::

**多设备同步**：

| 平台 | 同步方式 |
|------|---------|
| iOS / macOS | Apple Keychain（iCloud Keychain），跨 Apple 设备 |
| Android / Chrome OS | Google Password Manager，跨 Android 和 Chrome |
| 跨平台 | 1Password、Dashlane 等支持 Passkey 的密码管理器 |
| 硬件密钥 | YubiKey、SoloKey 等 FIDO2 令牌（无同步需求） |

**浏览器兼容**：Chrome/Chromium 108+（含同步）、Safari 16+（macOS Ventura / iOS 16，Apple Keychain）、Edge 108+（同 Chrome，支持 Windows Hello）、Firefox 119+（支持 WebAuthn，暂不支持云同步 Passkey）。

::: warning 企业设备策略
部分企业通过 GPO / MDM 禁用平台生物认证或 WebAuthn。如遇"无法创建 Passkey"，联系 IT 管理员，或改用硬件密钥（YubiKey）。
:::

---

## 4. 多因素认证 (MFA)

**可用第二因素**：

| 因素 | 说明 | 推荐工具 |
|------|------|---------|
| **TOTP** | 时间一次性密码（30 秒刷新） | Google Authenticator、1Password、Authy、Microsoft Authenticator |
| **U2F / WebAuthn 硬件密钥** | YubiKey、SoloKey 等 FIDO2，物理按压 | YubiKey 5 系列 |
| **WebAuthn 平台验证器** | 设备内置生物特征（Face ID、Windows Hello、指纹） | 内置 |
| **Email OTP / SMS OTP** | 验证码发邮箱 / 绑定手机号（SMS 需管理员启用） | 收件箱 / 手机短信 |

::: tip TOTP 最佳实践
用支持云备份的 TOTP 应用（1Password、Authy），避免手机丢失失去访问。Google Authenticator 旧版不支持迁移，迁移前务必导出。
:::

**MFA 策略**（控制台 **安全策略**）：**不强制**（用户自主绑定）/ **强制（所有用户）**（首次登录后必须注册至少一个第二因素）/ **仅本地用户强制**（外部 IdP/SSO 登录豁免，本地账号必绑）。常见强制场景：高权限账户（管理员、财务）始终强制；B2B 客户组织由客户管理员单独设置；风险登录（异地 IP/新设备）可触发步进验证（Step-up Auth）。

**恢复码**：绑 MFA 后生成一组一次性恢复码（**账户设置 → 安全 → 恢复码**）。打印或存密码管理器（**不要截图存云相册**）。失去 MFA 设备时用任意恢复码登录后立即重绑 MFA。每码用后即失效，用完立即重新生成一组。

---

## 5. 密码策略 (Password Policy)

以下为 Zitadel 实例默认基准，管理员可在控制台调整；实际要求会在注册/改密码时实时提示。

**复杂度**（默认值）：最小长度 8 字符；大写、小写、数字、特殊字符（`!@#$%^&*` 等）各至少 1 个。

**过期与历史**：最长有效期（0=永不过期）；到期预警（提前 N 天，当前版本不发邮件仅登录时页面提示）；历史密码检查（防重用最近 N 次）。

**登录失败锁定 (Lockout)**：密码最大失败次数 / OTP 最大失败次数（设 0 禁用对应锁定）。锁定后必须**管理员在控制台手动解锁**，不自动解锁。

::: warning 账户锁定处理
因连续输错密码或 OTP 被锁，联系所在组织管理员或邮件 **support@lurus.cn**（提供账号邮箱），工作时间内处理解锁。
:::

---

## 6. 身份代理 / Identity Brokering

Zitadel 作中间 IdP，对接一个或多个**上游外部 IdP**（企业 Azure AD/Okta，或社交 GitHub/Google）。用户点"使用 XXX 登录" → 跳上游 IdP 验证 → Zitadel 接收结果 → 颁发 Lurus 统一 token。

```
Lurus 产品 ─► auth.lurus.cn (Zitadel) ─► 上游 IdP (Azure AD / Okta / GitHub ...)
                  │◄── 用户身份断言（OIDC/SAML）──│
                  └─► 颁发 Lurus access_token / id_token
```

**何时使用**：企业客户 B2B SSO（员工用自家 Azure AD/Okta 直接登录，无需注册）；域名自动路由（输企业邮箱后按域名跳对应 IdP，Domain Discovery）；账号关联（已有 Lurus 账号关联 GitHub/Google）；Just-in-Time 创建（首次外部 IdP 登录自动建账号并分配默认角色）。

**配置步骤（管理员）**：控制台 → **实例设置 / 组织设置 → 身份提供商 → 添加** → 选模板（EntraID / Okta / GitHub / Google / SAML 通用等）→ 填上游 Client ID/Secret（OIDC）或 EntityID/Metadata URL（SAML）→ **登录策略** 中启用并设是否允许自动创建账号 → 测试登录，确认角色/权限映射。

::: info 支持的协议
**OIDC**：Google、GitHub、飞书、企业微信、Okta 等。**SAML 2.0**：Azure AD（EntraID）、ADFS、企业级 SSO。**LDAP**：企业内部 Active Directory 或 OpenLDAP。
:::

---

## 7. 登录界面定制 (Branding)

按**实例**或**组织**粒度定制：Logo（浅/深色，SVG/PNG）、主题色、字体、背景、自定义域名（`auth.yourcompany.com`，需 DNS）。Lurus 默认用主站统一配色。B2B 客户可在**组织设置 → 外观**配置，不影响其他组织。

::: tip 自定义域名与 Passkey
为 B2B 组织配自定义登录域名（`auth.client.com`）**必须在注册第一个 Passkey 之前完成**。Passkey 绑定注册时的域名（RP ID），事后更改会使已有 Passkey 失效。
:::

---

## 8. 常见问题与排查

::: warning 常见坑

**跨子域 Cookie 失效**：在 `app.lurus.cn` 登录后访问 `docs.lurus.cn` 仍要求重登。原因：OIDC 会话 Cookie 的 `Domain` 不正确或 CORS 限制跨子域。排查：确认所有子域同顶级域，Cookie 设 `Domain=.lurus.cn`；iframe 嵌入登录页需 `SameSite=None; Secure` 且 HTTPS。

**MFA 绑定设备丢失**：TOTP 无法生成验证码。处理：① MFA 验证界面点 **使用恢复码登录** ② 输任意恢复码 ③ 登录后立即 **账户设置 → 安全** 解绑旧 MFA 重绑新设备 ④ 恢复码也丢失则联系组织管理员强制重置 MFA。

**企业 SSO 登录后看不到资源**：SSO 成功但无权限或资源为空。原因：① User Grant 未配置（未将用户授权给对应 Project）② Project Role 缺失（已授权未分配 `viewer`/`editor`）③ JIT 创建账户未入组。排查：控制台 → **用户** → 该账户 → **授权 (Grants)** 标签，确认项目和角色。

**Passkey 在公司电脑无法使用**："无法创建凭据"。原因：企业 MDM/GPO 禁用平台验证器或 WebAuthn。解决：联系 IT 解除限制 / 用 YubiKey 等跨平台硬件密钥 / 回退 TOTP + 密码。

:::

---

## 相关文档

- [账单与订阅](../billing.md) · [平台常见问题](../faq.md) · [Lurus API 接入指南](/api/overview) · [Zitadel 官方文档](https://zitadel.com/docs)（英文）
