---
title: 统一身份认证
description: Lurus 全产品线共享的身份体系：一次登录全站通行，支持 SSO、Passkey、多因素认证、API 认证与企业 SSO 联邦。
---

<div class="auth-page">

<ProductHero product-id="auth" />

**一次登录，全站通行。** Lurus API、Lucrum、Switch、Creator、Lutu、Admin、Forge 等所有产品共享同一身份体系——用户在任意产品登录，其余产品自动识别；权限与配额在账户维度统一结算；企业客户可对接自家 SSO 完成员工接入。

该体系由 `identity.lurus.cn` 提供服务，底层基于开源身份基础设施 [Casdoor](https://casdoor.com) 自建部署，完整实现 OIDC / OAuth2 / SAML 标准协议，用户数据全程保留在 Lurus 自有 K8s 集群内。

::: tip 快速入口
- 用户自助管理：[identity.lurus.cn](https://identity.lurus.cn) — 修改密码、管理 Passkey、绑定 MFA、查看登录历史
- 组织/项目管理：[identity.lurus.cn](https://identity.lurus.cn)（Casdoor 组织控制台）— 企业客户成员邀请、权限分配、审计；或联系商务开通企业组织管理
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug-zap" :size="14" /> 接入</span>
  <h2 class="lurus-section-head__title">接入点</h2>
  <p class="lurus-section-head__lede">五个标准端点覆盖发现、授权、换取令牌与读取用户信息。</p>
</div>

| 端点 | URL | 说明 |
|------|-----|------|
| 控制台 | `https://identity.lurus.cn` | 用户自助管理账号、安全设备、会话 |
| OIDC Discovery | `https://identity.lurus.cn/.well-known/openid-configuration` | SDK 自动发现，含所有端点与支持能力 |
| OAuth2 授权 | `https://identity.lurus.cn/oauth/v2/authorize` | 标准授权码 / PKCE 流程入口 |
| Token 端点 | `https://identity.lurus.cn/oauth/v2/token` | 换取 access token / refresh token |
| 用户信息 | `https://identity.lurus.cn/oidc/v1/userinfo` | 读取当前用户 claims |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 能力</span>
  <h2 class="lurus-section-head__title">核心能力</h2>
  <p class="lurus-section-head__lede">从单点登录到企业 SSO 联邦，一套体系覆盖个人与 B2B 全场景。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-auth)"
  :items="[
    { title: 'SSO 单点登录', body: '登录一次即可访问所有 Lurus 产品，无需重复输入凭证。基于标准 OIDC session，支持跨应用静默刷新。', icon: 'key-round' },
    { title: '多因素认证 / Passkey', body: '支持 TOTP（Authenticator App）、U2F 硬件密钥及 Passkey（WebAuthn 无密码登录）。MFA 策略可在组织或项目级别强制开启。', icon: 'shield' },
    { title: '社交登录', body: '可接入 GitHub、Google、微信等第三方身份提供商，用户通过外部账号完成绑定后与 Lurus 账号打通。', icon: 'users' },
    { title: 'RBAC 与组织分级', body: '角色-权限模型（Role-Based Access Control）。权限通过 Grant 授予具体用户或服务账号，可精确到项目和应用粒度。', icon: 'user-check' },
    { title: 'B2B 多租户', body: 'Instance 下可建立多个 Organization，天然支持企业客户隔离；每个组织可独立配置品牌、登录策略和 IdP 联邦。', icon: 'building-2' },
    { title: 'OIDC / OAuth2 / SAML', body: '完整实现三大标准协议，兼容市面主流 SDK 与框架，无缝集成 Go、Rust、TypeScript、Flutter 应用。', icon: 'link' },
    { title: '审计日志', body: '登录、MFA 变更、权限授予、密码重置等关键操作均记录可查询的不可变日志，满足合规要求。', icon: 'history' },
    { title: 'Actions 扩展', body: '在身份验证流程的关键节点注入自定义逻辑（如同步用户属性、限制登录条件），无需 fork Casdoor 本体。', icon: 'workflow' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 模型</span>
  <h2 class="lurus-section-head__title">关键概念速览</h2>
  <p class="lurus-section-head__lede">身份体系按以下层级组织，开发者和管理员需要了解这几层对象如何映射到 Lurus 产品。</p>
</div>

<ArchitectureDiagram
  title="对象模型层级"
  chart="graph TD; Instance[Instance · lurus-prod] --> Org[Organization · lurus.cn]; Org --> User[User · Human / Service]; Org --> Project[Project · 每产品一个]; Project --> App[Application · client_id]; Project --> Role[Role]; User -. User Grant .-> Role"
/>

| 概念 | 含义 | 在 Lurus 中的映射 |
|------|------|-----------------|
| **Instance** | 顶层部署单元，独立数据库与配置 | Lurus 运营单一 Instance，托管于 `identity.lurus.cn` |
| **Organization** | 租户隔离单元，独立用户库与登录策略 | 个人用户归属 `lurus.cn` 主组织；企业客户申请独立 Organization，可配自家域名和 IdP |
| **Project** | Organization 下的应用集合，统一管理 roles 和 grants | 每个产品线（Lurus API、Lucrum、Switch、Forge…）对应一个 Project |
| **Application** | Project 内的具体客户端，持有 `client_id` / `client_secret` | 每个前端、桌面端、服务端分别注册一个 Application |
| **User** | 可登录账号，分 Human（真人）与 Service User（机器） | 终端用户为 Human；后端服务间调用使用 Service User + JWT Profile |
| **Grant** | 将 Project Role 授予某 User 的绑定关系 | 控制用户在具体产品内的权限等级；以 [identity.lurus.cn](https://identity.lurus.cn)（Casdoor）组织设置为准 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-open" :size="14" /> 导航</span>
  <h2 class="lurus-section-head__title">本节目录</h2>
  <p class="lurus-section-head__lede">从概念到集成，按需深入每一层。</p>
</div>

<div class="lurus-cards lurus-cards--2">
  <a class="lurus-card lurus-card--auth" href="/platform/auth/concepts">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">核心概念</div>
    <p class="lurus-card__body">Instance / Organization / Project / User / Application / Grant 详解。</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/platform/auth/login">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">登录与多因素认证</div>
    <p class="lurus-card__body">密码登录、Passkey、社交登录、MFA 配置。</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/platform/auth/oidc">
    <span class="lurus-card__icon"><Icon name="link" :size="20" /></span>
    <div class="lurus-card__title">OIDC / OAuth2 集成</div>
    <p class="lurus-card__body">Discovery、scopes、claims、授权码流程、PKCE。</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/platform/auth/api-auth">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">API 认证</div>
    <p class="lurus-card__body">Personal Access Token、Service User、JWT Profile、token 校验。</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/platform/auth/console">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">控制台管理</div>
    <p class="lurus-card__body">组织 / 项目 / 应用 / 用户的日常管理操作。</p>
  </a>
</div>

---

## 与其他 Lurus 产品的协同

| 场景 | 路径 |
|------|------|
| 拿到 API Key 后想用 OAuth token 调 Lurus API | [OIDC 集成](/platform/auth/oidc) → [Chat Completions](/api/chat-completions) |
| 在 Switch 中登录以同步 Lurus 账号配置 | [登录与 MFA](/platform/auth/login) → [Switch 配置说明](/switch/configuration) |
| Forge 管理员配置团队权限 | [控制台管理](/platform/auth/console) → [Forge](/forge/) |
| 开发者写后端服务调 Platform 内部 API | [API 认证 (PAT/JWT)](/platform/auth/api-auth) |
| 企业客户想用自家 Azure AD / 飞书登录 | [登录与 MFA — Identity Brokering](/platform/auth/login) |

---

## 延伸阅读

底层基于开源身份基础设施 Casdoor 构建，如需深入底层机制或 SDK 细节，可参考上游文档：

- [Casdoor 文档主页](https://casdoor.com/docs) — 快速上手、部署模式、SDK 集成指南
- [核心概念](https://casdoor.com/docs/concepts) — Instance、Organization、Project、User、Grant 原理说明
- [API 参考](https://casdoor.com/docs/apis) — Management API、Auth API、Admin API 的 REST / gRPC 端点文档

<RelatedProducts product-id="auth" />

</div>

<style scoped>
.auth-page .lurus-section-head {
  margin-top: 8px;
}
</style>
