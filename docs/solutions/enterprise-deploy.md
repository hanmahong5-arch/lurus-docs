---
title: 企业部署形态
description: SaaS / 私有化 / 混合云三种部署形态与合规边界对比。
---

<div class="deploy-page">

# 企业部署形态

<MetricStats :items="[
  { label: '部署形态', value: '3 种', hint: 'SaaS · 私有化 · 混合云' },
  { label: '私有化启动', value: '2-4 周' },
  { label: '企业可用性', value: '99.95%', hint: 'SaaS 企业' },
  { label: '国密加密', value: 'SM4-GCM' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="server" :size="14" /> 形态对比</span>
  <h2 class="lurus-section-head__title">部署形态矩阵</h2>
  <p class="lurus-section-head__lede">同一套产品，三种落地形态——按数据主权与启动周期取舍。</p>
</div>

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

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 合规</span>
  <h2 class="lurus-section-head__title">合规能力</h2>
  <p class="lurus-section-head__lede">数据主权、审计留痕、国密加密——交给评审一次看清。</p>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">数据不出境</div>
    <p class="lurus-card__body">私有化部署，所有数据不经过 Lurus 公有云。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">审计日志</div>
    <p class="lurus-card__body">所有 API 调用、身份事件、管理操作全部落盘。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">国密支持</div>
    <p class="lurus-card__body">对称加密 SM4-GCM，非对称 SM2（路线图）。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="award" :size="20" /></span>
    <div class="lurus-card__title">等保 / 行业资质</div>
    <p class="lurus-card__body">请联系 <a href="mailto:business@lurus.cn">business@lurus.cn</a> 获取最新清单。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> 身份联邦</span>
  <h2 class="lurus-section-head__title">SSO 联邦</h2>
  <p class="lurus-section-head__lede">员工用公司账号登录所有 Lurus 产品，无需新建身份。</p>
</div>

企业已有 IdP（Okta / Azure AD / 自建 Keycloak）员工用公司账号登录：

<ArchitectureDiagram title="企业 IdP 联邦登录" chart="graph LR; A[企业 IdP] -->|OIDC| B[Lurus Casdoor]; B --> C[所有 Lurus 产品]" />

支持协议：OIDC / OAuth 2.0 / SAML 2.0 / SCIM（用户生命周期）。

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="activity" :size="14" /> 服务等级</span>
  <h2 class="lurus-section-head__title">SLA</h2>
</div>

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

</div>
