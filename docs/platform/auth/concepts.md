---
title: 核心概念 | Zitadel 身份认证
description: Instance / Organization / Project / Application / User / Grant / Administrator 等 Zitadel 对象模型详解，结合 Lurus 实际部署说明。
---

# 核心概念

Lurus 使用 [Zitadel](https://zitadel.com) 作为统一 OIDC 身份提供方（IdP），公网入口为 `auth.lurus.cn`。本页梳理 Zitadel 的对象模型层级，帮助开发者和运维人员理解各概念间的关系。

---

## 对象模型一览

```
Instance (lurus-prod)
└─ Organization (lurus.cn)
   ├─ User (员工 / 客户 / Service Account)
   ├─ Project (lurus-api / lucrum / switch / lutu / admin / forge …)
   │  ├─ Application (Web / SPA / Native / API / SAML)
   │  └─ Role (项目内角色定义，如 lucrum:admin)
   └─ Grant (将本组织的 Project 授权给其他 Organization)
```

对象之间的包含关系是**严格单向**的：Instance 包含 Organization，Organization 包含 Project，Project 包含 Application 和 Role。User 归属于 Organization，通过 User Grant 绑定到 Project Role。

---

## Instance 实例

Instance 是 Zitadel 数据层级的**最高抽象**，等同于一个独立的身份颁发方（issuer）。所有 token 的 `iss` 字段均指向该 Instance 的域名。

| 属性 | 说明 |
|------|------|
| 作用 | 系统级默认配置容器（Branding、Login Policy、Password Policy 等） |
| 多租户 | 一个 Zitadel 实例可承载多个 Organization，实现租户隔离 |
| 管理员 | Instance 管理员可跨所有 Organization 查看资源，权限最高 |
| 虚拟实例 | 通过 System API 可创建多个虚拟实例，适合 SaaS 多租户分发 |

::: tip Lurus 语境
Lurus 生产环境只有一个实例：**`lurus-prod`**，域名为 `auth.lurus.cn`。无需创建虚拟实例，所有产品线共享同一 issuer。
:::

---

## Organization 组织

Organization 是 Zitadel 的**租户单位**，类似于目录服务中的 OU（Organizational Unit）。一个 Instance 内可以有多个 Organization，它们之间的用户数据相互隔离。

| Organization 所有物 | 说明 |
|---------------------|------|
| User & Service Account | 该组织专属的用户池 |
| Project | 逻辑产品分组及其应用、角色 |
| Domain | 一个或多个域名，其中一个为主域 |
| Policy | 可覆盖实例默认的安全策略（Login Policy、Password Policy 等） |

Organization 支持**权限委托**：可以将自身 Project 的管理权授予另一个 Organization，实现 B2B 场景下的自助 IAM。

::: tip Lurus 语境
当前主组织为 **`lurus.cn`**，承载所有内部员工账号和各产品的 Project。未来若接入企业客户，可为每个企业创建独立的辅助 Organization，通过 Project Grant 向其开放特定产品权限。
:::

---

## Project 项目

Project 是 Zitadel 的**逻辑产品分组**，一个组织内可创建多个 Project，每个 Project 对应一个独立的软件产品或服务边界。同一 Project 下的所有 Application 共享相同的 Role 定义。

| Project 组成 | 说明 |
|-------------|------|
| Application | 具体的登录客户端（见下节） |
| Role | 项目内定义的角色字符串，如 `admin`、`viewer` |
| User Grant | 将角色授予特定 User |
| Granted Organization | 将整个 Project 授权给其他 Organization |

Project 级别的设置还包括：是否要求 OIDC 登录时携带角色声明（`urn:zitadel:iam:org:project:roles`）、是否允许外部身份提供方登录等。

::: tip Lurus 语境
每个产品线对应一个独立的 Project，详细命名参见 `lurus.yaml` 的 `capabilities:` 注册表。Project 内的角色约定由各产品团队定义。
:::

---

## Application 应用

Application 是**具体的登录客户端**，代表真正发起认证请求的程序实体。每个 Application 拥有独立的 `client_id`，以及视认证方式而定的 `client_secret` 或 PKCE 配置。

### 应用类型

| 类型 | 典型场景 | 认证方式 |
|------|---------|---------|
| **Web** | 服务端渲染应用（Spring、Phoenix、Django） | Authorization Code + PKCE 或 Client Secret |
| **SPA** | 纯前端单页应用（React、Vue） | Authorization Code + **PKCE**（必选） |
| **Native** | 桌面 / 移动客户端（Switch、路途 APP） | Authorization Code + PKCE + Custom Scheme |
| **API** | 纯后端 / 机器对机器（M2M）服务 | Client Credentials（JWT 或 Basic Auth）/ Private Key JWT |
| **SAML** | 兼容 SAML 2.0 的企业应用 | SAML 2.0 断言 |

::: warning 关于 PKCE
对于任何涉及用户交互的应用（Web / SPA / Native），ZITADEL 推荐且默认使用 **PKCE**（Proof Key for Code Exchange）。禁止在前端应用中使用 Implicit Flow。
:::

### 关键配置项

- **`client_id`**：所有应用类型均有，用于标识应用身份。
- **`client_secret`**：仅服务端可安全保存密钥的应用使用；SPA 和 Native 应用应使用 PKCE 替代。
- **Redirect URI**：Zitadel 对回调 URL 做严格校验，必须完全匹配（开发模式下可放宽）。
- **开发模式**：允许非 HTTPS 协议和通配符 URI，仅供本地开发使用，生产环境须关闭。

---

## User 用户

Zitadel 将用户分为两类：真实人员的 **Human User** 和自动化系统的 **Machine User**。

### Human User（人类用户）

代表实际登录者，支持多种认证方式：

| 认证方式 | 说明 |
|---------|------|
| Password | 传统用户名 + 密码 |
| MFA | TOTP（Google Authenticator 等）或 SMS |
| Passkey | FIDO2 / WebAuthn 无密码登录 |
| 外部 IdP | Google、GitHub 等第三方身份联邦 |

用户字段包括：用户名（login name）、姓名、邮箱、电话、语言偏好、以及自定义 Metadata（键值对存储）。

### Machine User / Service Account（机器账号）

用于后端服务、CI/CD、定时任务等非交互场景：

| 认证方式 | 说明 |
|---------|------|
| **PAT**（Personal Access Token） | 长期有效的不记名 token，简单直接 |
| **JWT Profile** | 使用私钥签名 JWT 换取 access token，安全性更高 |

### 用户状态

| 状态 | 含义 |
|------|------|
| `active` | 正常，可登录 |
| `inactive` | 已停用，无法登录 |
| `locked` | 因登录失败次数超限被锁定 |
| `deleted` | 已删除（软删除，审计日志保留） |

::: tip 重要约束
每个 User 严格归属于**唯一一个 Organization**。跨组织使用同一用户需通过 Organization Grant 机制实现，不可直接跨组织共享账号。
:::

---

## Grant 与 Role

Zitadel 的权限模型基于 RBAC，核心概念为 Project Role、User Grant 和 Project Grant。

### Project Role（项目角色）

在 Project 内定义的角色字符串，由三个字段组成：

| 字段 | 说明 | 示例 |
|------|------|------|
| Key | 角色唯一标识（代码中使用） | `admin` |
| Display Name | 可读名称（控制台展示） | 管理员 |
| Group | 可选分组，用于控制台归类管理 | `management` |

同一 Project 下所有 Application 共享这套角色定义。

### User Grant（用户授权）

将 Project Role 授予特定 User，是 RBAC 的核心绑定操作。登录成功后，access token 的 `urn:zitadel:iam:org:project:roles` claim 将携带该用户在目标 Project 中被授予的所有角色。

```
User Grant = User + Project + Role[]
```

后端服务通过解析此 claim 进行鉴权，无需额外调用 Zitadel API。

### Project Grant（项目授权）

将整个 Project 的管理权授予**另一个 Organization**，使其能为自己的用户分配该 Project 的角色。

```
Project Grant = Project (来源 Org) → Organization (目标 Org)
```

这是 B2B 多租户场景的核心机制：Lurus 无需为企业客户的员工创建账号，由企业客户自行在其 Organization 内管理用户并分配权限。

---

## Administrator 管理员

Zitadel 的管理员权限分为四个层级，遵循**最小权限原则**：

| 层级 | 作用域 | 典型角色 |
|------|--------|---------|
| **IAM / Instance** | 整个实例（跨所有 Organization） | `IAM_OWNER` |
| **Organization** | 单一组织内所有资源 | `ORG_OWNER`、`ORG_USER_MANAGER` |
| **Project** | 单一 Project 内的应用、角色、授权 | `PROJECT_OWNER` |
| **Project Grant** | 被授权 Project 的用户角色管理 | `PROJECT_GRANT_OWNER` |

### 常见角色字符串

| 角色 | 权限范围 |
|------|---------|
| `IAM_OWNER` | 实例级最高权限，可管理所有组织、策略、虚拟实例 |
| `ORG_OWNER` | 管理组织内用户、Project、域名、策略 |
| `ORG_USER_MANAGER` | 仅管理用户和角色分配，不可修改 Project 结构 |
| `ORG_USER_PERMISSION_EDITOR` | 仅可编辑用户授权（User Grant），不可管理用户资料 |
| `PROJECT_OWNER` | 管理 Project 内的 Application、Role、Grant |
| `PROJECT_GRANT_OWNER` | 管理被授权 Project 内本组织用户的角色 |

::: warning 跨组织可见性
只有 `IAM_OWNER` 可以跨 Organization 查看和管理资源。`ORG_OWNER` 严格限制在本组织范围内，无法访问其他组织的数据。
:::

---

## Policy 策略

策略在 Instance 层定义默认值，Organization 层可按需覆盖，实现差异化的安全配置。

| 策略类型 | 说明 |
|---------|------|
| **Login Policy** | 允许哪些认证方式（Password / Passkey / 外部 IdP / 注册开关） |
| **Password Policy** | 密码复杂度、最小长度、是否禁止历史密码 |
| **Lockout Policy** | 登录失败次数阈值、锁定时长 |
| **MFA Policy** | 是否强制 MFA、允许哪些 MFA 方式 |
| **Privacy Policy** | 隐私声明 URL、ToS URL |
| **Branding** | 登录页 Logo、配色、自定义 CSS（Organization 级可独立定制） |

Lurus 主组织 `lurus.cn` 的具体策略配置由平台运维团队在 Zitadel Console 管理，此处不做硬编码。

---

::: tip 对齐 Lurus 实际部署

- **Project 命名**：每个 Lurus 产品对应一个 Project（如 `lurus-api`、`lucrum`、`switch`、`lutu`、`admin`、`forge`），具体以 Zitadel Console 为准。
- **角色约定**：各产品的角色字符串由服务级 CLAUDE.md 或 `lurus.yaml` 的 `capabilities:` 注册表定义，不在此文档硬编码。
- **Machine User 使用场景**：后端服务间调用（M2M）统一使用 Machine User + JWT Profile 认证，避免使用共享人类账号。
- **PAT 使用场景**：CI/CD 流水线和脚本自动化可使用 PAT，但须设置最短有效期并定期轮换。
- **完整配置参考**：`lurus.yaml` `capabilities:` 段落为架构变更的唯一入口。

:::
