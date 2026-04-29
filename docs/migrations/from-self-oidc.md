---
title: 从自建 Keycloak / Auth0 迁移到 Lurus Auth
description: SCIM 用户迁移、SSO 联邦、灰度切换的完整路径。
---

# 从自建 OIDC 迁移到 Lurus Auth

**前置条件**：企业已有 IdP（Keycloak / Auth0 / Okta / Azure AD），希望员工继续用公司账号登录，同时把身份层外包给 Lurus。

## 两种策略

### 策略 A：Lurus Auth 作为二级 IdP

```
企业 IdP (既有)  ──OIDC联邦──►  Lurus Auth  ──►  所有 Lurus 产品
```

你只管企业 IdP 的用户生命周期，Lurus 产品通过联邦读取身份。

### 策略 B：彻底搬家

```
原 Keycloak/Auth0  ──SCIM导出──►  Lurus Auth (Zitadel)  ──►  所有下游
```

Lurus Auth 成为唯一真相源。

## 策略 A 步骤（推荐）

### 1. 在 Lurus 控制台创建联邦连接

访问 `auth.lurus.cn` → 企业设置 → 身份提供商 → 新建 → 选 OIDC。

填入企业 IdP 的：

- Issuer URL
- Client ID
- Client Secret
- 回调 URL（Lurus 给出）

### 2. Claim 映射

```yaml
# 将企业 IdP 的属性映射到 Lurus 用户
email:       email
display:     name
department:  department   # custom claim
```

### 3. 灰度

在企业 IdP 里先允许 5% 员工使用 Lurus 登录按钮。验证 1 周 → 放开至全员。

## 策略 B 步骤

### 1. 导出 SCIM

从 Keycloak：

```bash
./kcadm.sh get users -r myrealm --fields username,email,firstName,lastName -f json > users.json
```

### 2. 批量导入 Lurus

```bash
curl -X POST https://auth.lurus.cn/admin/v1/scim/users:batchImport \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d @users.json
```

### 3. 密码策略

Lurus 默认不迁密码（哈希不兼容），首次登录强制走"忘记密码"流程。
如用 SSO 联邦则无需迁密码。

## SSO 联邦的优势

- **企业合规**：账号生命周期完全在企业
- **离职秒封**：企业 IdP 停用 → Lurus 立即不可登录
- **审计统一**：登录日志在企业 IdP
- **MFA 复用**：企业已有 MFA 策略生效

## 常见问题

- **会话冲突？** → Lurus 使用独立的 session cookie，不影响原系统
- **PAT / JWT 保留？** → 是，API 级 Token 不受 SSO 迁移影响
- **审计日志导出？** → 所有身份事件可通过 `POST /admin/v1/audit:export` 批量导出

## 下一步

<NextSteps :steps="[
  { text: 'Lurus Auth 总览', link: '/platform/auth/', primary: true },
  { text: 'OIDC / OAuth2', link: '/platform/auth/oidc' },
  { text: '企业部署形态', link: '/solutions/enterprise-deploy' },
]" />
