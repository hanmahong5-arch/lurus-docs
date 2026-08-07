---
title: 控制台管理 | Casdoor 身份认证
description: 使用 auth.lurus.cn 控制台管理组织、用户、项目、应用、身份策略的完整操作手册。
---

<div class="console-page">

# 控制台管理

Lurus 用 [Casdoor](https://casdoor.com) 作统一身份认证平台，控制台入口 [auth.lurus.cn](https://auth.lurus.cn)。本文面向**组织管理员 / IT 运维**，覆盖日常操作完整流程。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">谁该读这篇</p>
    <div class="lurus-callout__body">需要管理组织、用户、项目、应用与身份策略的 <strong>Org Owner / IT 运维</strong>。只想接入登录的开发者请看 <a href="/platform/auth/oidc">OIDC / OAuth2</a> 与 <a href="/platform/auth/api-auth">API 认证</a>。</div>
  </div>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--auth" href="#_2-组织管理-organization">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">组织管理</div>
    <p class="lurus-card__body">创建 / 切换、域名验证、成员角色、元数据</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_3-用户管理-users">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">用户管理</div>
    <p class="lurus-card__body">Human / Service User、PAT、状态流转、审计</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_4-项目管理-projects">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">项目与应用</div>
    <p class="lurus-card__body">Roles、Grant、Redirect URI、Token 设置</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_7-策略管理-policies">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">身份策略</div>
    <p class="lurus-card__body">登录 / 密码 / 锁定 / 品牌 / 通知策略</p>
  </a>
</div>

---

## 1. 控制台导航

登录后进入 Management Console，分三区：

- **顶部 Breadcrumb**：显示当前层级（**Instance 级**全局 / **Organization 级**单租户）。点组织名下拉可切换或新建（**New organization**）。Instance 级操作需 Instance Manager 权限，普通 Org Owner 仅见自己的 Organization。
- **左侧菜单**：

| 菜单项 | 功能 |
|--------|------|
| **Users** | Human User / Service User 管理 |
| **Projects** | 项目、应用、Role 管理 |
| **Actions** | 自定义事件触发脚本 |
| **Settings** | Login / Password Policy / Branding 等策略 |
| **IDP** | 外部身份提供方（Google / GitHub / SAML 等） |

- **右侧面板**：点列表资源后展开详情面板，支持直接编辑字段后保存。

---

## 2. 组织管理（Organization）

### 2.1 创建与切换组织

**创建**：顶部下拉 → **New organization** → 输入名称 → 选初始管理员身份（**Current User** 把当前账号设为 Org Owner / **New Account** 单独创建管理账号）→ 确认。

**切换**：顶部 Breadcrumb 下拉 → 点目标组织名。

**自助注册入口（B2B）**：客户访问 `https://auth.lurus.cn/ui/login/register/org` 自行注册组织。

### 2.2 设置默认 Organization

左侧 **Organizations**（Instance 级）→ 目标组织行 **"..."** → **Set as default organization**（行上显示 **Default** 标签）。

> 用户登录若未携带组织上下文（无 `urn:casdoor:iam:org:id:{id}` scope），落入默认 Organization 的策略和品牌配置。

### 2.3 域名验证

将公司邮箱域名绑定到 Organization，可启用按域名路由登录和单点直达。

目标 Organization → **Settings → Organization Domains → Add Domain** → 输域名（如 `lurus.cn`）→ 选验证方式（**DNS Challenge**：DNS 加 TXT 记录，值由 Casdoor 生成 / **HTTP Challenge**：Web 指定路径放验证文件）→ **Verify** → 通过后可 **Set as primary** 设主域名。

::: warning
DNS TXT 记录验证后**不要删除**，Casdoor 定期重新校验；删除会导致域名状态失效。
:::

### 2.4 成员管理（Organization Members）

**添加**：Organization → **Members → Add Member** → 搜索用户（email / 用户名）→ 分配角色 → **Save**。**移除**：Members 列表对应行右侧删除图标。

| 角色 | 权限范围 |
|------|---------|
| **Org Owner** | 组织内所有权限，含成员管理 |
| **Org User Manager** | 管理 Human / Service User |
| **Org User Viewer** | 只读查看用户 |
| **Org Project Creator** | 创建新 Project |
| **Org Project Permission Editor** | 管理 Project Grant 和角色授权 |

### 2.5 元数据（Metadata）

Organization → **Metadata → Add Metadata** → 输入 Key / Value → 保存。任意 key-value，可通过 API 读取用于业务扩展字段。

---

## 3. 用户管理（Users）

### 3.1 Human User：创建

**Users → New** → 填 First/Last Name、Email（可勾 **Email verified** 跳过验证）、Username（默认同 Email）、Phone（可选）→ 选初始密码策略（**Setup authentication later** 首次登录自设 / **Send an invitation E-Mail** 发邀请邮件 / **Set an initial password** 管理员直接设）→ **Create**。

### 3.2 Human User：日常操作

- **重置密码**：用户详情 → **Security → Send Password Reset Email**，或 **Set New Password** 直接设。
- **锁定/解锁**：详情页右上角 **Lock** / **Unlock**（锁定后无法登录，已有 Session 下次鉴权失效）。
- **发送初始密码邮件**：详情页 → **Resend Initialization Email**。
- **重置 MFA**：详情 → **Security → Authenticators** → 删除目标 MFA 设备（TOTP / Passkey / U2F）→ 用户下次登录需重新注册。

### 3.3 用户状态流转

<ArchitectureDiagram title="用户状态机" chart="stateDiagram-v2
  [*] --> Initial: 创建
  Initial --> Active: 完成初始化
  Active --> Locked: Lock / 策略触发
  Locked --> Active: Unlock
  Active --> Inactive: 停用
  Active --> Deleted: 删除
  Deleted --> [*]" />

::: details 文本版状态图
```
[Initial] →(完成初始化)→ [Active]
[Active]  →(Lock / 策略触发)→ [Locked] →(Unlock)→ [Active]
[Active]  →(停用)→ [Inactive]    [Active]→(删除)→[Deleted]
```
:::

| 状态 | 说明 |
|------|------|
| **Initial** | 创建后未完成初始密码设置或邮件验证 |
| **Active** | 正常可登录 |
| **Inactive** | 被管理员停用，无法登录 |
| **Locked** | 密码错误超限或手动锁定 |
| **Deleted** | 已删除，数据保留用于审计 |

### 3.4 Service User：创建与配置

用于机器间通信（CI/CD、后端调用），不用密码登录。

- **创建**：**Users → Service Users → New** → 填 Username 和 Display Name（Description 可选）→ **Create**。
- **生成 PAT**：详情 → **Personal Access Tokens → New** → 可选过期时间 → 创建后**立即复制**（仅一次）→ 调用方设环境变量 `Authorization: Bearer <token>`。
- **上传 JWT 公钥（Key File）**：详情 → **Keys → Add Key** → 类型 **JSON** + 过期时间 → **Add** → 下载 JSON Key 文件（含私钥，仅一次）→ 服务端用私钥签 JWT 向 token endpoint 换 Access Token。

### 3.5 审计与登录历史

- **登录历史**：详情 → **Login History**（时间、IP、User Agent、成功/失败）。
- **资源变更历史**：任意资源详情页底部 **Changes**（Which User / Timestamp / Field / Old → New Value）。

---

## 4. 项目管理（Projects）

### 4.1 创建项目

**Projects → Create New Project** → 输入名称（如 `lurus-api`、`lucrum`、`switch`）→ **Continue**。

### 4.2 项目设置（Settings 标签）

| 设置项 | 说明 |
|--------|------|
| **Assert Roles on Authentication** | 登录时将 Roles 注入 Token 和 Userinfo；推荐开启 |
| **Check Role Assignment on Authentication** | 要求用户在该 Project 至少一个 Role Grant，否则拒登 |
| **Check for Project on Authentication** | 验证用户所在 Organization 是否已获该 Project 的 Grant |

**Branding 策略**：**Unspecified**（系统默认）/ **Enforce project's policy**（全程用项目所在 Org 品牌）/ **Allow login user policy**（初始项目品牌，识别用户后切到用户自身 Org 品牌）。

### 4.3 角色定义（Project Roles）

角色仅是字符串标识，语义由业务定义。详情 → **Roles → New Role** → 填 **Key**（代码标识，Project 内唯一，如 `admin`/`viewer`/`trader`）、**Display Name**（控制台显示名）、**Group**（可选，分组展示）→ **Save**。

### 4.4 User Grant（授予用户角色）

详情 → **Authorizations → New** → 搜目标用户（Human / Service）→ 勾选 Role（可多选）→ **Save**。

### 4.5 Project Grant（跨组织授权，B2B）

将整个 Project 授权给另一 Organization，使其可管理本组织用户在该项目中的角色。详情 → **Project Grants → New** → 输合作 Organization 域名搜索选择 → 勾选允许的 Role（可限子集）→ **Save**。

> 被授权 Organization 管理员在 **Granted Projects** 下可见该项目，为自己组织用户分配 Role。

---

## 5. 应用管理（Applications）

### 5.1 应用类型选择

详情 → **Applications → New Application** → 选类型：

| 类型 | 适用场景 | 认证流程 |
|------|---------|---------|
| **Web** | 服务端渲染（Spring / PHP / Django） | Authorization Code（推荐 PKCE）+ Client Secret |
| **SPA（User Agent）** | 前端单页（React / Vue） | Authorization Code + PKCE（无 Client Secret） |
| **Native** | 桌面/移动（Electron / iOS） | Authorization Code + PKCE |
| **API** | 机器间通信（微服务/脚本） | Client Credentials / JWT Profile |
| **SAML** | 企业集成（不支持 OIDC 的系统） | SAML 2.0，上传 Metadata XML 或填 URL |

### 5.2 Redirect URI 配置

- **精确匹配**，大小写敏感；可加多条（生产/预发/本地分别配置）。
- Native App 支持自定义协议（`myapp://callback`）；IPv6 需转义方括号 `http://\[::1\]:8080/callback`。
- 典型 Web 配置：`https://app.lurus.cn/auth/callback`、`https://staging.lurus.cn/auth/callback`、`http://localhost:3000/auth/callback`（需开 Development Mode）。
- **Post-Logout Redirect URI**：登出跳转地址，同样精确匹配，可多条。

### 5.3 Token 设置（Token Settings）

| 字段 | 说明 | 推荐值 |
|------|------|--------|
| **Token Type** | `JWT`（客户端验签）或 `Opaque`（需回调 Userinfo） | JWT |
| **Access Token Lifetime** | Access Token 有效期 | 15 min |
| **Refresh Token Lifetime** | Refresh Token 最大有效期 | 7 days |
| **Refresh Token Idle Lifetime** | Refresh Token 无活动过期 | 24 h |
| **ID Token Lifetime** | ID Token 有效期 | 1 h |
| **Add User Roles to Token** | Project Roles 写入 Token claims | 按需 |
| **Add User Info to ID Token** | 用户信息合并进 ID Token（减少 Userinfo 请求） | 可选 |
| **Clock Skew** | 允许的服务器时钟偏差容忍值 | 默认 |

### 5.4 Development Mode

详情 → **Redirect Settings** → 勾 **Development Mode**：允许 `http://` Redirect URI、Glob 模式匹配（`*`、`/**`、`?`）。

::: warning
仅用于本地开发，**禁止在生产环境开启**。
:::

### 5.5 Client Secret

Web 应用创建后自动生成：创建时弹窗展示一次，**立即复制**。重新生成：详情 → **Generate New Client Secret**（旧 Secret 立即失效）。

---

## 6. 身份提供方（Identity Providers, IdP）

### 6.1 内置 IdP 类型

Organization → **Settings → IDP → Add IDP**：

| 类型 | 说明 |
|------|------|
| **Google** | OAuth2，需 Google Cloud Console Client ID/Secret |
| **GitHub** | OAuth2，需 GitHub OAuth App 凭证 |
| **GitLab** | OAuth2，支持 GitLab.com 或自托管 |
| **Microsoft** | Azure AD / Entra ID，单/多租户 |
| **Apple** | Sign in with Apple，需 Apple Developer 账号 |
| **Generic OIDC** | 任意标准 OIDC Provider，填 Discovery URL |
| **Generic SAML** | 任意 SAML 2.0 IdP，上传 Metadata |
| **LDAP** | 企业 AD / OpenLDAP |
| **JWT IDP** | 自定义 JWT 令牌颁发方 |

### 6.2 添加 Generic OIDC IdP（示例）

**Add IDP → Generic OIDC** → 填 **Name**（登录页按钮文字）、**Client ID / Secret**（IdP 方注册）、**Issuer / Discovery URL**（如 `https://accounts.google.com`）→ 配字段映射（**ID Attribute** 通常 `sub`；First/Last Name / Email / Display Name 映射 IdP claims）→ 设 **Auto Linking**（**None** 不关联每次新建 / **By Email** 同邮箱合并 / **By Username** 按用户名合并）→ **Save**。激活后登录页显示对应按钮。

### 6.3 在 Login Policy 中启用 IdP

**Settings → Login Behavior and Security → External IDPs** → 勾选刚添加的 IdP → 保存。

---

## 7. 策略管理（Policies）

Organization 可覆盖 Instance 默认策略（Organization → **Settings** 各子菜单）。

### 7.1 Login Policy（**Login Behavior and Security**）

| 开关 | 说明 |
|------|------|
| **Username / Password** | 允许用户名密码登录 |
| **Registration** | 允许自助注册 |
| **External IDP** | 允许第三方 IdP 登录 |
| **Hide Password Reset** | 隐藏「忘记密码」链接 |
| **Email / Phone as Login Name** | 允许用邮箱/手机号作为用户名 |
| **Domain Discovery** | 按邮箱域名自动路由到对应 Organization |
| **Passkey / WebAuthn** | 启用无密码登录 |
| **Force MFA** | 强制所有用户启用 MFA |

**会话时长**：Password Check Lifetime（密码检验周期）/ External IDP Check Lifetime / MFA Init Skip Lifetime（可跳过 MFA 设置的宽限期）/ Second Factor Check Lifetime。

### 7.2 Password Complexity（**Password Complexity**）

可配：最小长度（Min Length）、是否要求大写/小写/数字/特殊符号。

### 7.3 Lockout（**Lockout**）

**Max Password Attempts** / **Max OTP / TOTP Attempts**（0 表示不限）。锁定后必须管理员手动解锁（详情 → **Unlock**）。

### 7.4 Password Age（**Password Age**）

**Max Age in Days**（过期后登录强制重置）/ **Expiry Warning in Days**（提前 N 天登录页警告）。

### 7.5 Branding（**Branding**）

Logo/Icon（亮/暗各一套）、Primary Color、Background Color、Warning Color、Font、**Hide Watermark**（隐藏 "Powered by Casdoor"）、**Login Name Suffix**（登录名后缀是否显示）。

### 7.6 Privacy Policy（**Privacy Policy**）

配置显示在注册/登录页合规链接区的 URL：Terms of Service、Privacy Policy、Help、Support Email（支持 <code v-pre>{{.Lang}}</code> 语言变量）。

### 7.7 Domain Policy（**Domain Policy**）

| 开关 | 说明 |
|------|------|
| **Username must contain org domain** | 用户名变为 `{user}@{org}.{instance-domain}` |
| **Validate Organization Domains** | 要求通过 DNS/HTTP 验证才能用域名 |
| **SMTP sender address must match domain** | 通知邮件发件人域名需与组织域名一致 |
| **Email as username** | 允许直接用 Email 作登录用户名 |

### 7.8 Notification（**Notifications**）

触发事件：域名认领、用户初始化（邀请/初始密码）、Passkey 注册确认、密码重置、Email 验证、密码修改成功。通道通过 **Settings → SMTP** / **SMS Providers**（Twilio）配置凭证。

---

## 8. Actions（自定义代码扩展）

::: info
Actions 在登录/注册/用户创建等关键事件触发点运行 **JavaScript**（Casdoor 服务端沙箱），执行结果可影响流程继续或中断。
:::

左侧 **Actions → New Action** → 填名称、选触发 Flow 和 Trigger Type → 写 JS 处理函数 → 激活并绑定到 Flow。

**常见用途**：用户注册时调业务 Webhook 同步到 CRM/数仓；Token 中注入自定义 Claim（`tenant_id`、`plan_tier`）；注册时校验邮箱域名白名单。

**Flow 类型（常用）**：

| Flow | 触发场景 |
|------|---------|
| **Complement Token** | Access/ID Token 生成时注入额外 claims |
| **Internal Authentication** | 密码/Passkey 认证成功后 |
| **External Authentication** | 外部 IdP 认证成功后 |
| **Save success login** | 登录成功记录时 |
| **User Creation** | 新用户创建完成后 |

---

## 9. 审计与日志

- **Events 流**：Instance 级顶部 **Events** / Organization 级进入后 **Events**。时间线列出所有变更（Event Type / Aggregate / Editor / 时间戳）。
- **资源级变更历史**：每个资源详情页底部 **Changes**（Who / When / Field + Old → New Value）。
- **接入 SIEM**：**Events API**（`/v2/events`）按事件类型/时间/资源 ID 过滤，推送到 Elasticsearch / Loki / Splunk 做合规审计。

---

## 10. Lurus 常见操作场景

<p class="console-scenario-lede"><span class="lurus-tag"><Icon name="life-buoy" :size="13" /> 快速参考</span> 四个高频运维剧本 —— 展开即照做。</p>

<details class="lurus-faq-item">
<summary><Icon name="user-check" :size="16" /> 新员工入职</summary>

<ol class="lurus-steps">
<li><strong>Users → Human Users → New</strong>，填姓名和工作邮箱，选 <strong>Send Invitation Email</strong>。</li>
<li><code>lurus-api</code> 项目 → <strong>Authorizations → New</strong> → 搜该用户 → 分配角色。</li>
<li>重复为 <code>lucrum</code>、<code>switch</code> 等项目分配 Grant（按岗位）。</li>
<li>通知员工查收初始化邮件，完成密码设置和 MFA 注册。</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="bot" :size="16" /> CI / 机器账号</summary>

<ol class="lurus-steps">
<li><strong>Users → Service Users → New</strong>，Username 建议 <code>ci-&lt;service-name&gt;</code>。</li>
<li>详情 → <strong>Personal Access Tokens → New</strong> 设过期时间复制 Token；或 <strong>Keys → Add Key</strong> 下载 JSON Key 文件在 CI 配私钥。</li>
<li>对应 Project → <strong>Authorizations</strong> 分配所需 Role。</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="lock" :size="16" /> 员工离职</summary>

<ol class="lurus-steps">
<li>详情页右上角 <strong>Lock</strong>（立即阻止登录，保留账号和审计）。</li>
<li>每个关联 Project → <strong>Authorizations</strong> → 找到该用户 → 删除图标撤销所有 Grant。</li>
<li>确认不再需审计数据（通常不建议）可进一步 <strong>Delete User</strong>。</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="building-2" :size="16" /> 企业客户接入（B2B）</summary>

<ol class="lurus-steps">
<li>Instance 级 → <strong>Organizations → New Organization</strong>，名称用客户公司名。</li>
<li>添加 Org Owner（客户 IT 管理员账号）。</li>
<li>Organization → <strong>Settings → Organization Domains</strong> 验证客户域名。</li>
<li>客户有自家 IdP（Azure AD）：Organization → <strong>Settings → IDP</strong> 添加 SAML/OIDC IdP。</li>
<li><code>lurus-api</code> 项目 → <strong>Project Grants → New</strong> → 选该客户 Organization → 分配允许的 Role。</li>
<li>客户 Org Owner 登录后在 <strong>Granted Projects</strong> 下为员工分配角色。</li>
</ol>

</details>

---

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="link" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">相关文档</p>
    <div class="lurus-callout__body"><a href="/platform/auth/">认证概述与接入点</a> · <a href="/platform/auth/oidc">OIDC / OAuth2</a> · <a href="/platform/auth/api-auth">API 认证</a> · <a href="https://auth.lurus.cn">认证控制台 ↗</a></div>
  </div>
</div>

*基于 Casdoor 自托管实例（`auth.lurus.cn`），界面细节以实际版本为准。策略变更请同步本文档。*

</div>

<style>
.console-page .lurus-cards { margin: 1.1rem 0 1.4rem; }
.console-page .console-scenario-lede {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}
.console-page .console-scenario-lede .lurus-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.console-page .lurus-faq-item { margin: 0.6rem 0; }
.console-page .lurus-faq-item summary {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
