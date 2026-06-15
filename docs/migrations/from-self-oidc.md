---
title: 从自建 Keycloak / Auth0 迁移到 Lurus Auth
description: SCIM 用户迁移、SSO 联邦、灰度切换的完整路径。
---

<div class="mig-oidc-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 从自建 OIDC 迁移</span>
  <h1 class="lurus-section-head__title">从自建 OIDC 迁移到 Lurus Auth</h1>
  <p class="lurus-section-head__lede">企业已有 IdP（Keycloak / Auth0 / Okta / Azure AD），希望员工继续用公司账号登录，同时把身份层外包给 Lurus。</p>
</div>

## <Icon name="git-branch" :size="20" /> 两种策略

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">策略 A：Lurus Auth 作为二级 IdP（推荐）</div>
    <p class="lurus-card__body">你只管企业 IdP 的用户生命周期，Lurus 产品通过 OIDC 联邦读取身份。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="import" :size="20" /></span>
    <div class="lurus-card__title">策略 B：彻底搬家</div>
    <p class="lurus-card__body">原 Keycloak/Auth0 经 SCIM 导出到 Lurus Auth（Zitadel），成为唯一真相源。</p>
  </div>
</div>

### 策略 A — 联邦拓扑

<ArchitectureDiagram title="策略 A：联邦" chart="graph LR
  IDP[企业 IdP 既有] -->|OIDC 联邦| LA[Lurus Auth]
  LA --> P[所有 Lurus 产品]" />

### 策略 B — 搬家拓扑

<ArchitectureDiagram title="策略 B：搬家" chart="graph LR
  KC[原 Keycloak/Auth0] -->|SCIM 导出| LA[Lurus Auth · Zitadel]
  LA --> D[所有下游]" />

## <Icon name="building-2" :size="20" /> 策略 A 步骤（推荐）

<ol class="lurus-steps">
<li>

**在 Lurus 控制台创建联邦连接** — 访问 `auth.lurus.cn` → 企业设置 → 身份提供商 → 新建 → 选 OIDC。填入企业 IdP 的：

- Issuer URL
- Client ID
- Client Secret
- 回调 URL（Lurus 给出）

</li>
<li>

**Claim 映射** — 把企业 IdP 的属性映射到 Lurus 用户。

```yaml
# 将企业 IdP 的属性映射到 Lurus 用户
email:       email
display:     name
department:  department   # custom claim
```

</li>
<li>

**灰度** — 在企业 IdP 里先允许 5% 员工使用 Lurus 登录按钮。验证 1 周 → 放开至全员。

</li>
</ol>

## <Icon name="import" :size="20" /> 策略 B 步骤

<ol class="lurus-steps">
<li>

**导出 SCIM** — 从 Keycloak 导出用户为 JSON：

```bash
./kcadm.sh get users -r myrealm --fields username,email,firstName,lastName -f json > users.json
```

</li>
<li>

**批量导入 Lurus**

<ApiEndpoint method="POST" path="/admin/v1/scim/users:batchImport" description="批量导入用户（auth.lurus.cn）" />

```bash
curl -X POST https://auth.lurus.cn/admin/v1/scim/users:batchImport \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d @users.json
```

</li>
<li>

**密码策略** — Lurus 默认不迁密码（哈希不兼容），首次登录强制走"忘记密码"流程。如用 SSO 联邦则无需迁密码。

</li>
</ol>

## <Icon name="shield-check" :size="20" /> SSO 联邦的优势

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">企业合规</div>
    <p class="lurus-card__body">账号生命周期完全在企业。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">离职秒封</div>
    <p class="lurus-card__body">企业 IdP 停用 → Lurus 立即不可登录。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">审计统一</div>
    <p class="lurus-card__body">登录日志在企业 IdP。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">MFA 复用</div>
    <p class="lurus-card__body">企业已有 MFA 策略生效。</p>
  </div>
</div>

## <Icon name="life-buoy" :size="20" /> 常见问题

<details class="lurus-faq-item">
<summary>会话会冲突吗？</summary>

Lurus 使用独立的 session cookie，不影响原系统。

</details>

<details class="lurus-faq-item">
<summary>PAT / JWT 能保留吗？</summary>

能，API 级 Token 不受 SSO 迁移影响。

</details>

<details class="lurus-faq-item">
<summary>审计日志怎么导出？</summary>

所有身份事件可通过下面的端点批量导出：

<ApiEndpoint method="POST" path="/admin/v1/audit:export" description="批量导出身份事件" />

</details>

## 下一步

<NextSteps :steps="[
  { text: 'Lurus Auth 总览', link: '/platform/auth/', primary: true },
  { text: 'OIDC / OAuth2', link: '/platform/auth/oidc' },
  { text: '企业部署形态', link: '/solutions/enterprise-deploy' },
]" />

</div>
