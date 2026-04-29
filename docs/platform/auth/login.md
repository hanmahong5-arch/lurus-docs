---
title: 登录与多因素认证 | Zitadel 身份认证
description: Lurus 支持的登录方式（密码、Passkey、社交登录、企业 SSO）与多因素认证策略。
---

# 登录与多因素认证

Lurus 所有产品共用同一套身份认证基础设施，由 **Zitadel** 提供支持，对外地址为 `auth.lurus.cn`。无论你使用 Lurus API、Switch 桌面工具、Lucrum 量化平台还是 Forge 工作台，登录都经过同一个入口，一次登录，全线贯通。

---

## 1. 登录流程概览

用户访问任意 Lurus 产品时，若尚未持有有效会话，应用会将浏览器重定向到 `auth.lurus.cn` 完成身份验证，然后带着授权码跳回产品页面。整个过程采用 **OIDC Authorization Code Flow + PKCE**，无需在客户端存储任何密钥。

```
用户浏览器                Lurus 产品                auth.lurus.cn
     │                      │                            │
     │─── 访问产品页面 ──────►│                            │
     │                      │                            │
     │◄── 302 重定向 ────────│                            │
     │                                                    │
     │─── GET /authorize?client_id=&response_type=code ──►│
     │         &code_challenge=<sha256>&scope=openid      │
     │                                                    │
     │            ┌──────────────────────────────────┐   │
     │            │  登录页面（Zitadel hosted UI）     │   │
     │            │  邮箱/Passkey/SSO 等              │   │
     │            └──────────────────────────────────┘   │
     │                                                    │
     │◄── 302 redirect_uri?code=<auth_code>&state=... ───│
     │                      │                            │
     │─── 授权码 ────────────►│                            │
     │                      │─── POST /token ────────────►│
     │                      │    code + code_verifier     │
     │                      │◄── access_token / id_token ─│
     │                      │                            │
     │◄── 登录成功，进入产品 ─│                            │
```

**PKCE 安全机制说明**：客户端在发起授权请求前生成一个随机字符串（`code_verifier`），计算其 SHA-256 哈希（`code_challenge`）随请求发出；取回授权码后，凭原始 `code_verifier` 换取令牌，服务器验证两者一致才颁发 token。这样即使授权码被截获，攻击者也无法换取令牌。

::: info 会话有效期
默认 Access Token 有效期为 12 小时，Refresh Token 可在用户不感知的情况下静默续期。具体时长由组织策略决定，管理员可在控制台调整。
:::

---

## 2. 支持的登录方式

| 登录方式 | 说明 | 适用场景 |
|---------|------|---------|
| **邮箱 + 密码** | 标准注册方式，密码满足复杂度策略 | 所有用户 |
| **手机号 + 验证码** | 短信 OTP 登录（需管理员启用） | 视组织配置而定 |
| **Passkey（WebAuthn）** | 无密码，使用设备生物特征或硬件密钥 | 推荐主流用户 |
| **GitHub** | 社交登录，OAuth 2.0 | 视组织配置而定 |
| **Google** | 社交登录，OIDC | 视组织配置而定 |
| **Microsoft / Azure AD** | 社交或企业登录 | 视组织配置而定 |
| **Apple** | 社交登录，Sign in with Apple | 视组织配置而定 |
| **企业 SSO（OIDC/SAML 2.0）** | B2B 客户对接自有 IdP（Okta、飞书、企业微信等） | 企业客户 |
| **LDAP** | 企业目录服务直连 | 私有化部署客户 |

::: tip 推荐优先级
Passkey > 社交登录 > 邮箱密码。Passkey 无需记忆密码、抗钓鱼，安全性最高。
:::

---

## 3. Passkey / WebAuthn

### 原理

Passkey 基于 **WebAuthn / FIDO2** 标准，使用非对称加密替代传统密码：

- 注册时，设备生成一对密钥：**私钥留在设备**（受生物特征或 PIN 保护），公钥上传到 `auth.lurus.cn`
- 登录时，服务器发出挑战（challenge），设备用私钥签名后返回，服务器用公钥验证
- 全程**零密码传输**，即使服务器数据库泄露，攻击者得到的也只是公钥，无法冒充用户

### 注册 Passkey（用户操作步骤）

1. 登录 `auth.lurus.cn`，进入 **账户设置 → 安全**
2. 点击 **添加 Passkey**，为其命名（如"MacBook Touch ID"）
3. 浏览器弹出系统验证对话框，完成生物识别（指纹 / 面容 / PIN）
4. 注册完成，下次登录时选择 Passkey 选项即可免密登录

::: tip 建议注册多个 Passkey
在你的主力设备（手机 + 笔记本）各注册一个 Passkey，防止单一设备丢失时无法登录。
:::

### 多设备同步

现代操作系统和密码管理器均支持 Passkey 云同步：

| 平台 | 同步方式 |
|------|---------|
| iOS / macOS | **Apple Keychain**（iCloud Keychain），跨 Apple 设备自动同步 |
| Android / Chrome OS | **Google Password Manager**，跨 Android 和 Chrome 同步 |
| 跨平台 | **1Password**、**Dashlane** 等支持 Passkey 的密码管理器 |
| 硬件密钥 | YubiKey、SoloKey 等 FIDO2 硬件令牌（跨平台，无同步需求） |

### 浏览器兼容性

| 浏览器 | 最低版本 | 备注 |
|-------|---------|------|
| Chrome / Chromium | 108+ | 完整 Passkey 同步支持（Google Password Manager） |
| Safari | 16+ (macOS Ventura / iOS 16) | Apple Keychain 同步 |
| Edge | 108+ | 同 Chrome，支持 Windows Hello |
| Firefox | 119+ | 支持 WebAuthn，暂不支持云同步 Passkey |

::: warning 企业设备策略注意
部分企业通过 GPO / MDM 禁用了平台生物认证或 WebAuthn。如遇到"无法创建 Passkey"，请联系 IT 管理员确认策略，或改用硬件密钥（YubiKey）作为 WebAuthn 验证器。
:::

---

## 4. 多因素认证 (MFA)

### 可用第二因素

| 因素类型 | 说明 | 推荐工具 |
|---------|------|---------|
| **TOTP** | 基于时间的一次性密码（30 秒刷新） | Google Authenticator、1Password、Authy、Microsoft Authenticator |
| **U2F / WebAuthn 硬件密钥** | YubiKey、SoloKey 等 FIDO2 设备，物理按压确认 | YubiKey 5 系列 |
| **WebAuthn 平台验证器** | 设备内置生物特征（Face ID、Windows Hello、指纹传感器） | 内置，无需额外工具 |
| **Email OTP** | 验证码发送至注册邮箱 | 收件箱 |
| **SMS OTP** | 验证码发送至绑定手机号（需管理员启用） | 手机短信 |

::: tip TOTP 最佳实践
使用支持云备份的 TOTP 应用（如 1Password、Authy），避免手机丢失后失去访问权限。Google Authenticator 在旧版本不支持账户迁移，迁移前务必导出。
:::

### MFA 策略

管理员可在 Zitadel 控制台的 **安全策略** 中配置：

| 策略选项 | 说明 |
|---------|------|
| **不强制** | MFA 可选，用户自主绑定 |
| **强制（所有用户）** | 所有用户首次登录后必须注册至少一个第二因素 |
| **仅本地用户强制** | 通过外部 IdP（SSO）登录的用户豁免，本地账号必须绑 MFA |

常见强制场景：

- **高权限账户**（管理员、财务）：应始终强制 MFA
- **B2B 客户组织**：可由客户管理员在其组织内单独设置强制策略
- **风险登录触发**：异地 IP 或新设备登录时可触发步进验证（Step-up Auth）

### 恢复码 (Recovery Codes)

绑定 MFA 后，系统会生成一组一次性恢复码：

1. 进入 **账户设置 → 安全 → 恢复码**
2. 将恢复码打印或存入密码管理器（**不要截图存在云相册**）
3. 失去 MFA 设备时，使用任意一个恢复码完成登录，然后立即重新绑定 MFA

::: warning 恢复码仅一次有效
每个恢复码使用后即失效。用完后请立即在控制台重新生成一组新的恢复码。
:::

---

## 5. 密码策略 (Password Policy)

以下为 Lurus 平台的密码策略基准（由 Zitadel 实例配置，管理员可在控制台调整）：

### 复杂度要求

| 规则 | 默认值 |
|------|-------|
| 最小长度 | 8 个字符 |
| 大写字母 | 至少 1 个 |
| 小写字母 | 至少 1 个 |
| 数字 | 至少 1 个 |
| 特殊字符（`!@#$%^&*` 等） | 至少 1 个 |

::: info 具体策略以实例配置为准
上表为 Zitadel 默认值，Lurus 管理员可能已调整。实际要求会在注册或修改密码时实时提示。
:::

### 密码过期与历史

| 配置项 | 说明 |
|-------|------|
| **最长有效期** | 可配置密码有效天数（0 = 永不过期） |
| **到期预警** | 可配置提前 N 天提示用户修改（当前 Zitadel 版本不发送通知邮件，仅登录时页面提示） |
| **历史密码检查** | 防止重用最近使用过的密码（可配置 N 次历史） |

### 登录失败锁定 (Lockout Policy)

连续登录失败超过阈值后账户将被临时锁定，防止暴力破解：

| 配置项 | 说明 |
|-------|------|
| **密码最大失败次数** | 超出后锁定账户（设为 0 则禁用密码锁定） |
| **OTP 最大失败次数** | TOTP/Email OTP 验证失败超出后锁定（设为 0 则禁用 OTP 锁定） |
| **解锁方式** | 账户锁定后必须由**管理员在控制台手动解锁**，不会自动解锁 |

::: warning 账户锁定处理
若你因连续输错密码或 OTP 导致账户被锁，请联系所在组织的管理员或发送邮件至 **support@lurus.cn**，提供账号邮箱，管理员会在工作时间内处理解锁请求。
:::

---

## 6. 身份代理 / Identity Brokering

### 什么是身份代理

Identity Brokering 是指 Zitadel 作为中间身份提供方（IdP），对接一个或多个**上游外部 IdP**（如企业的 Azure AD、Okta，或社交平台的 GitHub、Google）。

用户视角：点击"使用 XXX 登录" → 跳转到上游 IdP 完成验证 → Zitadel 接收结果 → 颁发 Lurus 统一 token。

```
Lurus 产品 ──► auth.lurus.cn (Zitadel) ──► 上游 IdP (Azure AD / Okta / GitHub ...)
                   │                              │
                   │◄──── 用户身份断言（OIDC/SAML）─│
                   │
                   └──► 颁发 Lurus access_token / id_token
```

### 何时使用

| 场景 | 说明 |
|------|------|
| **企业客户 B2B SSO** | 客户希望员工使用自家 Azure AD / Okta 账号直接登录 Lurus，无需再注册 |
| **域名自动路由** | 用户输入企业邮箱后，自动识别域名并跳转到对应 IdP（Domain Discovery） |
| **账号关联** | 已有 Lurus 账号的用户，将 GitHub / Google 账号关联到现有账户，方便多种方式登录 |
| **Just-in-Time 创建** | 用户首次通过外部 IdP 登录时，Zitadel 自动在 Lurus 侧创建账号并分配默认角色 |

### 配置步骤（管理员）

1. 登录 Zitadel 控制台 → **实例设置** 或 **组织设置**
2. 进入 **身份提供商 (Identity Providers)** → **添加**
3. 选择模板（EntraID / Okta / GitHub / Google / SAML 通用模板 等）
4. 填入上游 IdP 的 Client ID、Client Secret（OIDC）或 EntityID / Metadata URL（SAML）
5. 在 **登录策略** 中启用该 IdP，设置是否允许自动创建账号
6. 测试登录流程，确认用户角色和权限映射正确

::: info 支持的协议
- **OIDC**：对接 Google、GitHub、飞书、企业微信、Okta 等
- **SAML 2.0**：对接 Azure AD（EntraID）、ADFS、企业级 SSO 系统
- **LDAP**：对接企业内部 Active Directory 或 OpenLDAP
:::

---

## 7. 登录界面定制 (Branding)

Zitadel 支持按**实例**或**组织**粒度定制登录界面外观：

| 可定制项 | 说明 |
|---------|------|
| Logo | 上传浅色 / 深色模式各一张，SVG 或 PNG |
| 主题色 | 按钮、链接的主色调 |
| 字体 | 可替换为品牌字体 |
| 背景 | 登录页背景图或颜色 |
| 自定义域名 | 将登录页托管在 `auth.yourcompany.com`（需 DNS 配置） |

Lurus 平台默认使用主站统一配色方案。B2B 客户如需为自己的组织定制登录界面，可在**组织设置 → 外观**中配置，不影响其他组织。

::: tip 自定义域名与 Passkey
如果你计划为 B2B 组织配置自定义登录域名（如 `auth.client.com`），**必须在注册第一个 Passkey 之前完成域名配置**。Passkey 绑定的是注册时的域名（RP ID），事后更改会导致已有 Passkey 失效。
:::

---

## 8. 常见问题与排查

::: warning 常见坑

**跨子域 Cookie 失效**

症状：在 `app.lurus.cn` 登录成功后，访问 `docs.lurus.cn` 仍然要求重新登录。

原因：OIDC 会话 Cookie 的 `Domain` 设置不正确，或 CORS 策略限制了跨子域请求。

排查：检查 Zitadel 实例配置中的 Cookie 域，确认所有 Lurus 子域均在同一个顶级域下，Cookie 设置为 `Domain=.lurus.cn`。如使用 iframe 嵌入登录页，需启用 `SameSite=None; Secure`，且必须通过 HTTPS 访问。

---

**MFA 绑定设备丢失**

症状：手机丢失或换机后，TOTP 应用无法生成验证码，无法完成登录。

处理步骤：
1. 在登录的 MFA 验证步骤界面，点击 **使用恢复码登录**
2. 输入注册 MFA 时保存的任意一个恢复码
3. 登录成功后，立即进入 **账户设置 → 安全** 解绑旧 MFA，重新绑定新设备
4. 如果恢复码也已丢失，联系所在组织管理员，管理员可在控制台强制重置 MFA

---

**企业 SSO 登录后在 Lurus 看不到资源**

症状：通过 Azure AD / Okta SSO 成功登录，但页面显示无权限或资源列表为空。

常见原因：
1. **User Grant 未配置**：管理员未在 Zitadel 控制台将该用户（或用户组）授权给对应的 Lurus 项目（Project）
2. **Project Role 缺失**：用户已授权，但未分配具体角色（如 `viewer`、`editor`）
3. **JIT 创建的账户未入组**：首次 SSO 登录自动创建的账户，未被自动加入预期的用户组

排查：登录 Zitadel 控制台 → **用户** → 找到该账户 → 检查 **授权 (Grants)** 标签页，确认项目和角色是否正确。

---

**Passkey 在公司电脑上无法使用**

症状：浏览器提示"无法创建凭据"或"不支持此操作"。

原因：企业 MDM / GPO 策略可能禁用了平台验证器（Platform Authenticator）或 WebAuthn。

解决方案：
- 联系 IT 管理员评估是否可以解除限制
- 或使用 YubiKey 等**跨平台硬件密钥**（Cross-Platform Authenticator），不受平台策略限制
- 或回退到 TOTP + 密码方式登录

:::

---

## 相关文档

- [账单与订阅](../billing.md)
- [平台常见问题](../faq.md)
- [Lurus API 接入指南](/api/overview)
- [Zitadel 官方文档](https://zitadel.com/docs)（英文）
