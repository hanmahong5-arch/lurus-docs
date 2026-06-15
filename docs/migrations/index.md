---
title: 迁移中心
description: 从 OpenAI / LangGraph / 自建 OIDC 迁到 Lurus 的零痛点指南。
---

<div class="mig-hub">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="import" :size="14" /> 迁移中心</span>
  <h1 class="lurus-section-head__title">迁移中心</h1>
  <p class="lurus-section-head__lede">从你已有的技术栈无感切换到 Lurus，时间线、回滚方式、注意事项一次讲清。</p>
</div>

<div class="action-grid">
  <ActionCard
    name="从 OpenAI"
    tagline="5 分钟：改 base_url + api_key 即可"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: '开始迁移', href: '/migrations/from-openai', primary: true },
    ]"
  />
  <ActionCard
    name="从 LangGraph"
    tagline="SqliteSaver → LumenCheckpointer + Kova"
    icon="git-branch"
    color="var(--lurus-color-lumen)"
    :actions="[
      { label: '开始迁移', href: '/migrations/from-langgraph', primary: true },
    ]"
  />
  <ActionCard
    name="从自建 OIDC"
    tagline="Keycloak / Auth0 → Lurus Auth + SSO 联邦"
    icon="shield-check"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: '开始迁移', href: '/migrations/from-self-oidc', primary: true },
    ]"
  />
</div>

## <Icon name="shield-check" :size="20" /> 通用迁移原则

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">零破坏</div>
    <p class="lurus-card__body">保留原端点灰度，Lurus 能走多久走多久。</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="rewind" :size="20" /></span>
    <div class="lurus-card__title">可回滚</div>
    <p class="lurus-card__body">每份变更都有明确的 revert 步骤。</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">可观测</div>
    <p class="lurus-card__body">迁移期间并行跑，用 Lumen 对比新旧链路。</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <div class="lurus-card__title">分批</div>
    <p class="lurus-card__body">按流量比例 5% → 20% → 100% 推进。</p>
  </div>
</div>

## 下一步

<NextSteps :steps="[
  { text: '从 OpenAI 迁移', link: '/migrations/from-openai', primary: true },
  { text: '企业部署形态', link: '/solutions/enterprise-deploy' },
]" />

</div>
