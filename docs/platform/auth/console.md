---
title: 控制台管理 | Zitadel 身份认证
description: 使用 auth.lurus.cn 控制台管理组织、用户、项目、应用、身份策略的完整操作手册。
---

# 控制台管理

Lurus 使用 [Zitadel](https://zitadel.com) 作为统一身份认证平台，控制台入口为 [auth.lurus.cn](https://auth.lurus.cn)。本文面向**组织管理员 / IT 运维**，覆盖日常操作的完整流程。

---

## 1. 控制台导航

登录后进入 Management Console，界面分为三个区域：

### 顶部 Breadcrumb（Instance / Organization 切换）

- 左上角显示当前所在层级：**Instance 级**（全局管理）或 **Organization 级**（单租户管理）
- 点击组织名称下拉，可切换到其他已有 Organization，或点击 **"New organization"** 新建
- Instance 级操作需要 Instance Manager 权限，普通 Org Owner 仅能看到自己的 Organization

### 左侧菜单

| 菜单项 | 功能 |
|--------|------|
| **Users** | Human User / Service User 管理 |
| **Projects** | 项目、应用、Role 管理 |
| **Actions** | 自定义事件触发脚本 |
| **Settings** | Login Policy / Password Policy / Branding 等策略 |
| **IDP** | 外部身份提供方（Google / GitHub / SAML 等） |

### 右侧面板

点击列表中的资源（用户 / 项目 / 应用）后，右侧展开详情面板，支持直接编辑字段后保存。

---

## 2. 组织管理（Organization）

### 2.1 创建与切换组织

**创建步骤：**

1. 顶部下拉菜单 → 点击 **"New organization"**
2. 输入组织名称
3. 选择初始管理员身份：
   - **Current User**：将当前登录账号设为该 Organization 的 Org Owner
   - **New Account**：为该 Organization 单独创建一个管理账号
4. 确认创建

**切换组织：** 顶部 Breadcrumb 下拉 → 点击目标组织名称即可切换上下文。

**自助注册入口（B2B 场景）：** 客户可访问 `https://auth.lurus.cn/ui/login/register/org` 自行注册组织，填写组织名称和联系信息。

### 2.2 设置默认 Organization

1. 左侧菜单 → **Organizations**（Instance 级）
2. 找到目标组织行，点击右侧 **"..."（省略号）**
3. 选择 **"Set as default organization"**
4. 已设置的默认组织行上会显示 **Default** 标签

> 用户登录时若未携带组织上下文（未传 `urn:zitadel:iam:org:id:{id}` scope），则落入默认 Organization 的策略和品牌配置。

### 2.3 域名验证

将公司邮箱域名绑定到 Organization，可启用按域名路由登录和单点直达。

**步骤：**

1. 进入目标 Organization → **Settings → Organization Domains**
2. 点击 **"Add Domain"**，输入域名（如 `lurus.cn`）
3. 选择验证方式：
   - **DNS Challenge**：在域名 DNS 添加 TXT 记录，值由 Zitadel 生成
   - **HTTP Challenge**：在 Web 服务器指定路径放置验证文件
4. 记录添加完成后点击 **"Verify"**
5. 验证通过后，可点击 **"Set as primary"** 设为主域名

::: warning
DNS TXT 记录验证后**不要删除**，Zitadel 会定期重新校验；删除记录会导致域名状态失效。
:::

### 2.4 成员管理（Organization Members）

**添加成员：**

1. Organization → **Members** → **"Add Member"**
2. 搜索用户（按 email 或用户名）
3. 分配角色：

| 角色 | 权限范围 |
|------|---------|
| **Org Owner** | 组织内所有权限，包括成员管理 |
| **Org User Manager** | 管理 Human User / Service User |
| **Org User Viewer** | 只读查看用户信息 |
| **Org Project Creator** | 创建新 Project |
| **Org Project Permission Editor** | 管理 Project Grant 和角色授权 |

4. 点击 **"Save"** 确认

**移除成员：** 在 Members 列表中点击对应行右侧的 **删除图标**。

### 2.5 元数据（Metadata）

Organization 支持存储任意 key-value 元数据，可通过 API 读取，用于业务扩展字段。

**操作：** Organization → **Metadata** → **"Add Metadata"** → 输入 Key / Value → 保存。

---

## 3. 用户管理（Users）

### 3.1 Human User：创建

1. 左侧菜单 → **Users** → **"New"**
2. 填写基本信息：
   - **First Name / Last Name**
   - **Email**（可勾选 **"Email verified"** 跳过邮件验证步骤）
   - **Username**（默认与 Email 相同，可自定义）
   - **Phone**（可选）
3. 选择初始密码策略：
   - **"Setup authentication later"**：用户首次登录时自行设置
   - **"Send an invitation E-Mail"**：发送邀请邮件，用户点击链接完成注册
   - **"Set an initial password"**：管理员直接设定初始密码
4. 点击 **"Create"**

### 3.2 Human User：日常操作

**重置密码：**
- 用户详情页 → **Security** → **"Send Password Reset Email"**
- 或点击 **"Set New Password"** 直接由管理员设定新密码

**锁定 / 解锁账号：**
- 用户详情页右上角 → **"Lock"** / **"Unlock"**
- 锁定后用户无法登录，已有 Session 下次鉴权时失效

**发送初始密码邮件（已有用户）：**
- 用户详情页 → **"Resend Initialization Email"**

**重置多因素认证（MFA Reset）：**
- 用户详情页 → **Security** → **Authenticators** 区域
- 找到需要移除的 MFA 设备（TOTP / Passkey / U2F）
- 点击对应行右侧 **删除图标** → 确认
- 用户下次登录时需重新注册 MFA 设备

### 3.3 用户状态流转

```
[Initial] → (完成初始化) → [Active]
[Active]  → (管理员 Lock / 策略触发) → [Locked]
[Locked]  → (管理员 Unlock) → [Active]
[Active]  → (管理员删除) → [Deleted]
[Active/Locked] → (管理员停用) → [Inactive]
```

| 状态 | 说明 |
|------|------|
| **Initial** | 创建后未完成初始密码设置或邮件验证 |
| **Active** | 正常可登录 |
| **Inactive** | 被管理员停用，无法登录 |
| **Locked** | 密码错误超限或管理员手动锁定 |
| **Deleted** | 已删除，数据保留用于审计 |

### 3.4 Service User：创建与配置

Service User 用于机器间通信（CI/CD、后端服务调用），不使用密码登录。

**创建步骤：**

1. 左侧菜单 → **Users** → 切换到 **"Service Users"** 标签页 → **"New"**
2. 填写 Username 和 Display Name（Description 可选）
3. 点击 **"Create"**

**生成 Personal Access Token（PAT）：**

1. Service User 详情页 → **Personal Access Tokens** → **"New Personal Access Token"**
2. 可选填写过期时间（留空则永不过期）
3. 创建后**立即复制 Token**（仅显示一次）
4. 在调用方服务中设为环境变量，请求时携带 `Authorization: Bearer <token>`

**上传 JWT 公钥（Key File 认证）：**

1. Service User 详情页 → **Keys** → **"Add Key"**
2. 选择类型 **"JSON"**，设置过期时间
3. 点击 **"Add"** → 下载生成的 JSON Key 文件（包含私钥，仅显示一次）
4. 服务端用私钥签发 JWT，向 Zitadel token endpoint 换取 Access Token

### 3.5 审计与登录历史

**查看用户登录历史：**
- 用户详情页 → **Login History** 标签页
- 显示每次登录的时间、IP、User Agent、成功 / 失败状态

**查看资源变更历史：**
- 任意资源详情页底部 → **Changes** 区域
- 记录谁（Which User）在何时（Timestamp）做了什么变更（Field / Old Value / New Value）

---

## 4. 项目管理（Projects）

### 4.1 创建项目

1. 左侧菜单 → **Projects** → **"Create New Project"**
2. 输入项目名称（如 `lurus-api`、`lucrum`、`switch`）
3. 点击 **"Continue"**

### 4.2 项目设置

进入项目详情页 → **Settings** 标签：

| 设置项 | 说明 |
|--------|------|
| **Assert Roles on Authentication** | 登录时将用户 Roles 注入到 Token 和 Userinfo；推荐开启 |
| **Check Role Assignment on Authentication** | 要求用户在该 Project 至少有一个 Role Grant，否则拒绝登录 |
| **Check for Project on Authentication** | 验证用户所在 Organization 是否已获得该 Project 的 Grant |

**Branding 策略：**
- **Unspecified**：使用系统默认品牌
- **Enforce project's policy**：全程使用该项目所在 Organization 的品牌
- **Allow login user policy**：初始使用项目品牌，识别用户后切换到用户自身 Organization 的品牌

### 4.3 角色定义（Project Roles）

项目内的角色仅是字符串标识，语义由业务侧定义。

**新增角色：**

1. 项目详情页 → **Roles** 标签 → **"New Role"**
2. 填写字段：
   - **Key**：代码侧使用的标识符（如 `admin`、`viewer`、`trader`），**Project 内唯一**
   - **Display Name**：控制台显示名称（如 `管理员`、`只读用户`）
   - **Group**（可选）：用于控制台分组展示
3. 点击 **"Save"**

### 4.4 User Grant（授予用户角色）

将角色分配给具体用户：

1. 项目详情页 → **Authorizations** 标签 → **"New"**
2. 搜索目标用户（Human 或 Service User）
3. 勾选要授予的 Role（可多选）
4. 点击 **"Save"**

### 4.5 Project Grant（跨组织授权，B2B 场景）

将整个项目授权给另一个 Organization，使其可以管理本组织用户在该项目中的角色。

**步骤：**

1. 项目详情页 → **Project Grants** → **"New"**
2. 输入合作 Organization 的域名，搜索并选择
3. 勾选允许该 Organization 使用的 Role（可限制子集）
4. 点击 **"Save"**

> 被授权的 Organization 管理员进入控制台后，可在 **Granted Projects** 下看到该项目，并为自己组织的用户分配 Role。

---

## 5. 应用管理（Applications）

### 5.1 应用类型选择

在项目详情页 → **Applications** → **"New Application"**，选择类型：

| 类型 | 适用场景 | 认证流程 |
|------|---------|---------|
| **Web** | 服务端渲染（Spring / PHP / Django） | Authorization Code（推荐 PKCE）+ Client Secret |
| **SPA（User Agent）** | 前端单页应用（React / Vue） | Authorization Code + PKCE（不支持 Client Secret） |
| **Native** | 桌面 / 移动 App（Electron / iOS） | Authorization Code + PKCE |
| **API** | 机器间通信（微服务 / 脚本） | Client Credentials / JWT Profile |
| **SAML** | 企业集成（不支持 OIDC 的系统） | SAML 2.0，上传 Metadata XML 或填写 Metadata URL |

### 5.2 Redirect URI 配置

**规则：**
- Zitadel 对 Redirect URI 做**精确匹配**，大小写敏感
- 可添加多条（生产 / 预发 / 本地开发分别配置）
- Native App 支持自定义协议（如 `myapp://callback`）
- IPv6 地址需转义方括号：`http://\[::1\]:8080/callback`

**示例（一个 Web 应用的典型配置）：**

```
https://app.lurus.cn/auth/callback
https://staging.lurus.cn/auth/callback
http://localhost:3000/auth/callback       # 需开启 Development Mode
```

**Post-Logout Redirect URI：** 登出后的跳转地址，同样需精确匹配，可配置多条。

### 5.3 Token 设置

应用详情页 → **Token Settings**：

| 字段 | 说明 | 推荐值 |
|------|------|--------|
| **Token Type** | `JWT`（客户端可验签）或 `Opaque`（需回调 Userinfo） | JWT |
| **Access Token Lifetime** | Access Token 有效期 | 15 min |
| **Refresh Token Lifetime** | Refresh Token 最大有效期 | 7 days |
| **Refresh Token Idle Lifetime** | Refresh Token 无活动过期时间 | 24 h |
| **ID Token Lifetime** | ID Token 有效期 | 1 h |
| **Add User Roles to Token** | 将 Project Roles 写入 Token claims | 按需开启 |
| **Add User Info to ID Token** | 将用户信息合并进 ID Token（减少 Userinfo 请求） | 可选 |
| **Clock Skew** | 允许的服务器时钟偏差容忍值 | 通常留默认 |

### 5.4 Development Mode

::: warning
Development Mode 仅用于本地开发，**禁止在生产环境开启**。
:::

- 开启后：允许 `http://` Redirect URI、支持 Glob 模式匹配（`*`、`/**`、`?`）
- 路径：应用详情页 → **Redirect Settings** → 勾选 **"Development Mode"**

### 5.5 Client Secret

Web 应用创建后，Zitadel 自动生成 Client Secret：

- 创建时会弹窗展示一次，**立即复制**，关闭后无法再次查看
- 如需重新生成：应用详情页 → **"Generate New Client Secret"**（旧 Secret 立即失效）

---

## 6. 身份提供方（Identity Providers, IdP）

### 6.1 内置 IdP 类型

进入 Organization → **Settings → IDP** → **"Add IDP"**，可选类型：

| 类型 | 说明 |
|------|------|
| **Google** | OAuth2，需要 Google Cloud Console Client ID/Secret |
| **GitHub** | OAuth2，需要 GitHub OAuth App 凭证 |
| **GitLab** | OAuth2，支持 GitLab.com 或自托管实例 |
| **Microsoft** | Azure AD / Entra ID，支持单租户 / 多租户 |
| **Apple** | Sign in with Apple，需要 Apple Developer 账号 |
| **Generic OIDC** | 任意标准 OIDC Provider，填写 Discovery URL |
| **Generic SAML** | 任意 SAML 2.0 IdP，上传 Metadata |
| **LDAP** | 企业 AD / OpenLDAP 目录集成 |
| **JWT IDP** | 自定义 JWT 令牌颁发方 |

### 6.2 添加 Generic OIDC IdP（示例）

1. **"Add IDP"** → 选择 **"Generic OIDC"**
2. 填写必填字段：
   - **Name**：显示名称（登录页按钮文字）
   - **Client ID / Client Secret**：在 IdP 方注册的凭证
   - **Issuer / Discovery URL**：如 `https://accounts.google.com`
3. 配置字段映射（Attribute Mapping）：
   - **ID Attribute**：IdP 侧表示用户唯一 ID 的字段（通常为 `sub`）
   - **First Name / Last Name / Email / Display Name**：映射 IdP 返回的 claims
4. 设置 **Auto Linking**（自动账号关联）：
   - **None**：不自动关联，每次创建新用户
   - **By Email**：若 Zitadel 中已有相同邮箱用户，自动合并
   - **By Username**：按用户名合并
5. 点击 **"Save"**
6. 激活后，登录页会显示对应的 IdP 登录按钮

### 6.3 在 Login Policy 中启用 IdP

添加 IdP 后，还需在登录策略中启用：

1. **Settings → Login Behavior and Security**
2. 找到 **"External IDPs"** 区域
3. 勾选刚添加的 IdP
4. 保存

---

## 7. 策略管理（Policies）

Organization 可覆盖 Instance 的默认策略。进入 Organization → **Settings**，各策略位于对应子菜单。

### 7.1 Login Policy（登录行为策略）

**Settings → Login Behavior and Security**

| 开关 | 说明 |
|------|------|
| **Username / Password** | 允许用户名密码登录 |
| **Registration** | 允许用户自助注册 |
| **External IDP** | 允许第三方 IdP 登录 |
| **Hide Password Reset** | 隐藏登录页的"忘记密码"链接 |
| **Email as Login Name** | 允许用邮箱地址作为用户名 |
| **Phone as Login Name** | 允许用手机号登录 |
| **Domain Discovery** | 根据邮箱域名自动路由到对应 Organization |
| **Passkey / WebAuthn** | 启用无密码登录 |
| **Force MFA** | 强制所有用户启用 MFA |

**会话时长设置（Lifetime）：**

- **Password Check Lifetime**：密码有效检验周期（超时需重新输入密码）
- **External IDP Check Lifetime**：外部 IdP 认证有效周期
- **MFA Init Skip Lifetime**：用户可跳过 MFA 设置的宽限期
- **Second Factor Check Lifetime**：MFA 验证有效周期

### 7.2 Password Complexity Policy（密码复杂度）

**Settings → Password Complexity**

可配置：
- 最小长度（Min Length）
- 是否要求大写字母
- 是否要求小写字母
- 是否要求数字
- 是否要求特殊符号（非字母数字字符）

### 7.3 Lockout Policy（锁定策略）

**Settings → Lockout**

| 字段 | 说明 |
|------|------|
| **Max Password Attempts** | 密码错误超过此次数后锁定账号（0 表示不限） |
| **Max OTP / TOTP Attempts** | MFA 验证失败超过此次数后锁定（0 表示不限） |

锁定后必须由管理员手动解锁（用户详情页 → **"Unlock"**）。

### 7.4 Password Age Policy（密码过期）

**Settings → Password Age**

| 字段 | 说明 |
|------|------|
| **Max Age in Days** | 密码最长有效天数，过期后登录强制重置 |
| **Expiry Warning in Days** | 提前 N 天在登录页展示过期警告 |

### 7.5 Branding（品牌定制）

**Settings → Branding**

| 配置项 | 说明 |
|--------|------|
| Logo / Icon | 上传亮色 / 暗色主题各一套 |
| Primary Color | 主色调（按钮 / 链接颜色） |
| Background Color | 登录页背景色 |
| Warning Color | 警告色 |
| Font | 上传自定义字体文件 |
| **Hide Watermark** | 隐藏 "Powered by ZITADEL" 标识 |
| **Login Name Suffix** | 控制登录名后缀是否显示 |

### 7.6 Privacy Policy（隐私与合规链接）

**Settings → Privacy Policy**

可配置以下 URL，将显示在注册页和登录页的合规链接区域：
- **Terms of Service**：服务条款链接
- **Privacy Policy**：隐私政策链接
- **Help**：帮助文档链接
- **Support Email**：支持邮箱（支持 <code v-pre>{{.Lang}}</code> 语言变量）

### 7.7 Domain Policy（域名策略）

**Settings → Domain Policy**

| 开关 | 说明 |
|------|------|
| **Username must contain org domain** | 启用后用户名格式变为 `{user}@{org}.{instance-domain}` |
| **Validate Organization Domains** | 要求通过 DNS/HTTP 验证才能使用域名 |
| **SMTP sender address must match domain** | 通知邮件发件人域名需与组织域名一致 |
| **Email as username** | 允许直接使用 Email 地址作为登录用户名 |

### 7.8 Notification（通知配置）

**Settings → Notifications**

触发通知的事件包括：
- 域名认领（Domain Claim）
- 用户初始化（邀请邮件 / 初始密码）
- Passkey 注册确认
- 密码重置
- Email 验证
- 密码修改成功告知

通知渠道通过 **SMTP** 和 **Twilio SMS** 配置，进入 **Settings → SMTP** / **SMS Providers** 填写凭证。

---

## 8. Actions（自定义代码扩展）

::: info
Actions 允许在登录 / 注册 / 用户创建等关键事件触发点运行 **JavaScript** 代码，实现业务扩展。代码运行于 Zitadel 服务端沙箱，执行结果可影响流程继续或中断。
:::

**配置位置：** 左侧菜单 → **Actions** → **"New Action"**

**常见用途：**

- **同步用户到外部系统**：用户注册时调用业务侧 Webhook，在 CRM / 数仓同步用户记录
- **注入自定义 Claim**：在 Token 中写入业务侧的额外字段（如 `tenant_id`、`plan_tier`）
- **校验业务规则**：注册时校验邮箱域名是否在白名单，不满足则拒绝

**配置流程：**

1. 进入 **Actions** → **"New Action"**
2. 填写 Action 名称、选择触发流程（Flow）和触发点（Trigger Type）
3. 编写 JavaScript 处理函数
4. 激活 Action 并绑定到对应 Flow

**Flow 类型（常用）：**

| Flow | 触发场景 |
|------|---------|
| **Complement Token** | Access / ID Token 生成时，注入额外 claims |
| **Internal Authentication** | 密码 / Passkey 认证成功后 |
| **External Authentication** | 外部 IdP 认证成功后 |
| **Save success login** | 登录成功记录时 |
| **User Creation** | 新用户创建完成后 |

---

## 9. 审计与日志

### 9.1 Events 流

**查看路径：**
- Instance 级：顶部菜单 → **Events**
- Organization 级：进入 Organization → **Events**

Events 以时间线方式列出所有变更操作，包含：
- 事件类型（Event Type）
- 操作对象（Aggregate）
- 操作者（Editor）
- 时间戳

### 9.2 资源级变更历史

每个资源（用户 / 应用 / 项目）详情页底部均有 **Changes** 区域，记录该资源的字段级修改历史：
- 修改者（Who）
- 修改时间（When）
- 变更内容（Field + Old Value → New Value）

### 9.3 接入 SIEM

Zitadel 提供 **Events API**（`/v2/events`），可按事件类型、时间范围、资源 ID 过滤，将 Events 推送到自有日志平台（Elasticsearch / Loki / Splunk 等）做安全合规审计。

---

## 10. Lurus 常见操作场景

::: tip 快速参考

**新员工入职**

1. 左侧菜单 → **Users → Human Users → "New"**，填写姓名和工作邮箱，选择 **"Send Invitation Email"**
2. 进入 `lurus-api` 项目 → **Authorizations → "New"** → 搜索该用户 → 分配对应角色
3. 重复步骤 2，为 `lucrum`、`switch` 等项目分配 Grant（按岗位按需授权）
4. 通知员工查收初始化邮件，完成密码设置和 MFA 注册

---

**CI / 机器账号**

1. **Users → Service Users → "New"**，Username 建议使用 `ci-<service-name>` 命名
2. 进入 Service User 详情 → **Personal Access Tokens → "New"**，设置过期时间 → 复制 Token
3. 或使用 JWT Key：**Keys → "Add Key"** → 下载 JSON Key 文件，在 CI 环境配置私钥
4. 在对应 Project → **Authorizations** 为该 Service User 分配所需 Role

---

**员工离职**

1. 用户详情页右上角 → **"Lock"**（立即阻止登录，保留账号和审计记录）
2. 进入每个关联 Project → **Authorizations** → 找到该用户 → 点击 **删除图标** 撤销所有 Grant
3. 如确认不再需要审计数据（通常不建议），可进一步点击 **"Delete User"**

---

**企业客户接入（B2B）**

1. 进入 Instance 级 → **Organizations → "New Organization"**，名称使用客户公司名
2. 为新 Organization 添加 Org Owner（客户的 IT 管理员账号）
3. Organization → **Settings → Organization Domains** → 验证客户公司域名
4. 若客户有自己的 IdP（如 Azure AD）：Organization → **Settings → IDP** → 添加 SAML / OIDC IdP
5. 进入 `lurus-api` 项目 → **Project Grants → "New"** → 选择该客户 Organization → 分配允许的 Role
6. 客户侧 Org Owner 登录控制台后，在 **Granted Projects** 下为其员工分配角色

:::

---

*本文档基于 Zitadel 自托管实例（`auth.lurus.cn`），界面细节以实际版本为准。如有策略变更，请同步更新本文档。*
