---
title: 核心概念 | Casdoor 身份认证
description: Instance / Organization / Project / Application / User / Grant / Administrator 等 Casdoor 对象模型详解，结合 Lurus 实际部署说明。
---

<div class="auth-concepts">

# 核心概念

Lurus 用 [Casdoor](https://casdoor.com) 作统一 OIDC 身份提供方（IdP），公网入口 `identity.lurus.cn`。本页梳理对象模型层级。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 模型</span>
  <h2 class="lurus-section-head__title">对象模型一览</h2>
  <p class="lurus-section-head__lede">六类对象、单向包含——理解这张图，后面每节都是它的展开。</p>
</div>

<ArchitectureDiagram
  title="Casdoor 对象模型层级"
  chart="graph TD; Instance[Instance · lurus-prod] --> Org[Organization · lurus.cn]; Org --> User[User · 员工 / 客户 / Service Account]; Org --> Project[Project · lurus-api / lucrum / switch …]; Org --> OrgGrant[Grant · 授权 Project 给其他 Org]; Project --> App[Application · Web / SPA / Native / API / SAML]; Project --> Role[Role · 如 lucrum:admin]; User -. User Grant .-> Role"
/>

包含关系**严格单向**：Instance ⊃ Organization ⊃ Project ⊃ (Application, Role)。User 归属于 Organization，通过 User Grant 绑定到 Project Role。

---

## Instance 实例

数据层级**最高抽象**，等同独立身份颁发方（issuer）。所有 token 的 `iss` 指向该 Instance 域名。

| 属性 | 说明 |
|------|------|
| 作用 | 系统级默认配置容器（Branding、Login/Password Policy 等） |
| 多租户 | 一个实例承载多个 Organization，实现租户隔离 |
| 管理员 | Instance 管理员可跨所有 Organization，权限最高 |
| 虚拟实例 | 通过 System API 可创建多个虚拟实例，适合 SaaS 多租户分发 |

::: tip Lurus 语境
生产环境只有一个实例 **`lurus-prod`**（`identity.lurus.cn`）。无需虚拟实例，所有产品线共享同一 issuer。
:::

---

## Organization 组织

**租户单位**，类似目录服务中的 OU。一个 Instance 内可多个，用户数据相互隔离。所有物：User & Service Account（专属用户池）、Project（产品分组及应用、角色）、Domain（一个或多个，含一个主域）、Policy（可覆盖实例默认安全策略）。支持**权限委托**：将自身 Project 管理权授予另一 Organization，实现 B2B 自助 IAM。

::: tip Lurus 语境
当前主组织 **`lurus.cn`**，承载内部员工账号和各产品 Project。接入企业客户时可为每个企业建独立辅助 Organization，通过 Project Grant 开放特定产品权限。
:::

---

## Project 项目

**逻辑产品分组**，每个 Project 对应一个软件产品或服务边界。同 Project 下所有 Application 共享相同 Role 定义。组成：Application（登录客户端）、Role（角色字符串如 `admin`/`viewer`）、User Grant（角色授予 User）、Granted Organization（整个 Project 授权给其他 Org）。Project 级设置含：是否要求登录携带角色声明（`urn:casdoor:iam:org:project:roles`）、是否允许外部 IdP 登录等。

::: tip Lurus 语境
每个产品线对应一个独立 Project，命名见 `lurus.yaml` `capabilities:` 注册表。角色约定由各产品团队定义。
:::

---

## Application 应用

**具体登录客户端**，真正发起认证请求的程序实体。每个有独立 `client_id`，及视认证方式而定的 `client_secret` 或 PKCE 配置。

| 类型 | 典型场景 | 认证方式 |
|------|---------|---------|
| **Web** | 服务端渲染（Spring、Phoenix、Django） | Authorization Code + PKCE 或 Client Secret |
| **SPA** | 纯前端单页（React、Vue） | Authorization Code + **PKCE**（必选） |
| **Native** | 桌面/移动（Switch、路途 APP） | Authorization Code + PKCE + Custom Scheme |
| **API** | 纯后端 / M2M | Client Credentials（JWT 或 Basic Auth）/ Private Key JWT |
| **SAML** | 兼容 SAML 2.0 的企业应用 | SAML 2.0 断言 |

::: warning 关于 PKCE
涉及用户交互的应用（Web/SPA/Native）默认用 **PKCE**。禁止在前端应用使用 Implicit Flow。
:::

**关键配置**：`client_id`（所有类型，标识应用）；`client_secret`（仅服务端可安全保存密钥的应用，SPA/Native 用 PKCE 替代）；Redirect URI（严格校验完全匹配，开发模式可放宽）；开发模式（允许非 HTTPS 和通配符 URI，仅本地开发，生产须关闭）。

---

## User 用户

分真实人员的 **Human User** 和自动化系统的 **Machine User**。

- **Human User**：支持 Password、MFA（TOTP/SMS）、Passkey（FIDO2/WebAuthn）、外部 IdP（Google/GitHub 等）。字段含登录名、姓名、邮箱、电话、语言偏好、自定义 Metadata（键值对）。
- **Machine User / Service Account**：后端服务、CI/CD、定时任务。认证方式 **PAT**（长期不记名 token，简单）或 **JWT Profile**（私钥签名 JWT 换 token，更安全）。

**用户状态**：`active`（可登录）/ `inactive`（停用）/ `locked`（失败超限锁定）/ `deleted`（软删除，审计保留）。

::: tip 重要约束
每个 User 严格归属**唯一一个 Organization**。跨组织需通过 Organization Grant 机制，不可直接跨组织共享账号。
:::

---

## Grant 与 Role

基于 RBAC，核心为 Project Role、User Grant、Project Grant。

- **Project Role**：Project 内角色字符串，三字段 Key（代码标识，如 `admin`）、Display Name（控制台显示，如「管理员」）、Group（可选分组，如 `management`）。同 Project 下所有 Application 共享。
- **User Grant** = `User + Project + Role[]`：登录后 access token 的 `urn:casdoor:iam:org:project:roles` claim 携带用户在目标 Project 被授予的所有角色，后端解析此 claim 鉴权，无需额外调 API。
- **Project Grant** = `Project (来源 Org) → Organization (目标 Org)`：将整个 Project 管理权授予另一 Organization。B2B 多租户核心：Lurus 无需为客户员工建账号，由客户在其 Organization 内自管用户和权限。

---

## Administrator 管理员

四个层级，遵循最小权限：

| 层级 | 作用域 | 典型角色 |
|------|--------|---------|
| **IAM / Instance** | 整个实例（跨所有 Organization） | `IAM_OWNER` |
| **Organization** | 单一组织内所有资源 | `ORG_OWNER`、`ORG_USER_MANAGER` |
| **Project** | 单一 Project 内应用、角色、授权 | `PROJECT_OWNER` |
| **Project Grant** | 被授权 Project 的用户角色管理 | `PROJECT_GRANT_OWNER` |

**常见角色字符串**：`IAM_OWNER`（实例级最高，管所有组织/策略/虚拟实例）、`ORG_OWNER`（管组织内用户/Project/域名/策略）、`ORG_USER_MANAGER`（仅管用户和角色分配，不改 Project 结构）、`ORG_USER_PERMISSION_EDITOR`（仅编辑 User Grant）、`PROJECT_OWNER`（管 Project 内 Application/Role/Grant）、`PROJECT_GRANT_OWNER`（管被授权 Project 内本组织用户角色）。

::: warning 跨组织可见性
只有 `IAM_OWNER` 可跨 Organization 查看管理。`ORG_OWNER` 严格限本组织，无法访问其他组织数据。
:::

---

## Policy 策略

Instance 层定义默认值，Organization 层按需覆盖。

| 策略类型 | 说明 |
|---------|------|
| **Login Policy** | 允许哪些认证方式（Password/Passkey/外部 IdP/注册开关） |
| **Password Policy** | 密码复杂度、最小长度、是否禁历史密码 |
| **Lockout Policy** | 登录失败次数阈值、锁定时长 |
| **MFA Policy** | 是否强制 MFA、允许哪些方式 |
| **Privacy Policy** | 隐私声明 URL、ToS URL |
| **Branding** | 登录页 Logo、配色、自定义 CSS（Organization 级可独立定制） |

主组织 `lurus.cn` 的具体策略由平台运维在 Casdoor Console 管理，此处不硬编码。

---

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">对齐 Lurus 实际部署</p>
    <div class="lurus-callout__body"><ul><li><strong>Project 命名</strong>：每个产品对应一个 Project（<code>lurus-api</code>、<code>lucrum</code>、<code>switch</code>、<code>lutu</code>、<code>admin</code>、<code>forge</code>），以 Casdoor Console 为准。</li><li><strong>角色约定</strong>：角色字符串由服务级 CLAUDE.md 或 <code>lurus.yaml</code> <code>capabilities:</code> 注册表定义，不在此硬编码。</li><li><strong>Machine User 场景</strong>：M2M 调用统一用 Machine User + JWT Profile，避免共享人类账号。</li><li><strong>PAT 场景</strong>：CI/CD 和脚本可用 PAT，须设最短有效期并定期轮换。</li><li><strong>完整配置参考</strong>：<code>lurus.yaml</code> <code>capabilities:</code> 段为架构变更唯一入口。</li></ul></div>
  </div>
</div>

</div>

<style scoped>
.auth-concepts .lurus-section-head { margin-top: 8px; }
</style>
