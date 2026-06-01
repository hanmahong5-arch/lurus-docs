---
title: 企业部署形态
description: SaaS / 私有化 / 混合云三种部署形态与合规边界对比。
---

# 企业部署形态

## 部署形态矩阵

| 能力 | SaaS | 私有化 | 混合云 |
|------|------|-------|--------|
| Lurus API 网关 | ✅ 开箱 | ✅ 镜像私有化 | ✅ |
| Kova 执行引擎 | ✅ | ✅ | ✅ |
| MemX 记忆引擎 | ✅ | ✅ | ✅ |
| Lucrum 量化 | ✅ | 🔜 2026 H2 | ✅ |
| Switch / Creator | ✅ 桌面 | ✅ 桌面 | ✅ |
| 身份与合规 | ✅ | ✅ | ✅ |
| 数据主权 | AWS / 阿里云 | **企业内部** | 混合 |
| 国密 SM4-GCM | — | ✅ | ✅ |
| 启动周期 | 立即 | 2-4 周 | 1-2 周 |

## 合规能力

- **数据不出境**：私有化部署，所有数据不经过 Lurus 公有云
- **审计日志**：所有 API 调用、身份事件、管理操作全部落盘
- **国密支持**：对称加密 SM4-GCM，非对称 SM2（路线图）
- **等保 / 行业资质**：请联系 business@lurus.cn 获取最新清单

## SSO 联邦

企业已有 IdP（Okta / Azure AD / 自建 Keycloak）员工用公司账号登录：`企业 IdP ──OIDC──► Lurus Zitadel ──► 所有 Lurus 产品`。支持协议：OIDC / OAuth 2.0 / SAML 2.0 / SCIM（用户生命周期）。

## SLA

| 形态 | 可用性 | 事件响应 |
|------|--------|---------|
| SaaS 标准 | 99.9% | 业务时间 |
| SaaS 企业 | 99.95% | 7×24 |
| 私有化 | 按合同约定 | 专属值班 |

## 下一步

<NextSteps :steps="[
  { text: '身份与合规', link: '/platform/auth/', primary: true },
  { text: '为什么选择 Lurus', link: '/solutions/why-lurus' },
  { text: '联系商务', link: 'mailto:business@lurus.cn', external: true },
]" />
