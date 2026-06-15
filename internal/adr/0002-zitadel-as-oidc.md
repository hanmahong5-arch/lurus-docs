---
adr: 0002
title: Zitadel 作为统一 OIDC Provider
status: accepted
date: 2025-09
---

# ADR-0002: Zitadel 作为统一 OIDC Provider

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">决定 · accepted 2025-09 · live</p>
    <div class="lurus-callout__body">部署 <strong>Zitadel</strong> 到 R1 K3s，域 <code>auth.lurus.cn</code>。所有需要登录的产品（admin / forge / login UI / switch / lutu / docs internal）统一走 Zitadel OIDC。</div>
  </div>
</div>

## 背景

公司起步阶段，账户体系散落在每个产品里 — switch 自管用户表、lucrum 自有登录、admin 用 Phoenix.guardian。  
跨产品免登录 / 单点登出 / 联邦登录都不可能。

## 备选方案

| 方案 | 拒绝原因 |
|---|---|
| 自研 OIDC | 安全 hard，认证不是核心业务 |
| Auth0 / Clerk SaaS | 数据出境合规风险；月费随用户增长爆炸 |
| Keycloak | Java 重；UI 老旧；维护负担大 |
| **Zitadel**（接受） | Go 实现轻量；多租户原生支持；自托管；UI 现代；OIDC + SAML + SCIM 全栈 |

## 决定

部署 Zitadel 到 R1 K3s，域 `auth.lurus.cn`。所有需要登录的产品（admin / forge / login UI / switch / lutu / docs internal）都走 Zitadel OIDC。

## 后果

正面：
- 单点登录跨产品工作
- 用户离职 → 一处禁用即全公司失效
- SCIM 接入企业客户身份系统不需重写

负面：
- Zitadel 是关键依赖，挂了 = 所有需登录服务挂
- Zitadel 升级要测兼容（OIDC discovery / claim 格式）
- bus factor 1 + Zitadel = 单人需深度理解 Zitadel 内部

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">单点风险</p>
    <div class="lurus-callout__body">Zitadel 是<strong>关键依赖</strong>——挂了等于所有需登录服务挂。叠加 <strong>bus factor 1</strong>，运维深度全压在单人身上。监控状态见 <a href="/ops/observability">可观测性手册</a>。</div>
  </div>
</div>

## 参考

- `lurus.yaml` `auth:` + `capabilities.auth`
- [ops/key-rotation.md](../ops/key-rotation) Zitadel SA 轮换
