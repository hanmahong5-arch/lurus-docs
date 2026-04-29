---
title: 迁移中心
description: 从 OpenAI / LangGraph / 自建 OIDC 迁到 Lurus 的零痛点指南。
---

# 迁移中心

从你已有的技术栈无感切换到 Lurus，时间线、回滚方式、注意事项一次讲清。

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

## 通用迁移原则

1. **零破坏**：保留原端点灰度，Lurus 能走多久走多久
2. **可回滚**：每份变更都有明确的 revert 步骤
3. **可观测**：迁移期间并行跑，用 Lumen 对比新旧链路
4. **分批**：按流量比例 5% → 20% → 100% 推进

## 下一步

<NextSteps :steps="[
  { text: '从 OpenAI 迁移', link: '/migrations/from-openai', primary: true },
  { text: '企业部署形态', link: '/solutions/enterprise-deploy' },
]" />
