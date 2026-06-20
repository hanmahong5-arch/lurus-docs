---
title: "移行センター"
description: "OpenAI / LangGraph / 自社構築 OIDC から Lurus へ痛みなく移行するためのガイド。"
---

<div class="mig-hub">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="import" :size="14" /> 移行センター</span>
  <h1 class="lurus-section-head__title">移行センター</h1>
  <p class="lurus-section-head__lede">既存の技術スタックから Lurus へシームレスに切り替えます。タイムライン、ロールバック方法、注意事項を一度に説明します。</p>
</div>

<div class="action-grid">
  <ActionCard
    name="OpenAI から"
    tagline="5 分：base_url + api_key を変更するだけ"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: '移行を開始', href: '/ja/migrations/from-openai', primary: true },
    ]"
  />
  <ActionCard
    name="LangGraph から"
    tagline="SqliteSaver → LumenCheckpointer + Kova"
    icon="git-branch"
    color="var(--lurus-color-lumen)"
    :actions="[
      { label: '移行を開始', href: '/ja/migrations/from-langgraph', primary: true },
    ]"
  />
  <ActionCard
    name="自社構築 OIDC から"
    tagline="Keycloak / Auth0 → Lurus Auth + SSO フェデレーション"
    icon="shield-check"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: '移行を開始', href: '/ja/migrations/from-self-oidc', primary: true },
    ]"
  />
</div>

## <Icon name="shield-check" :size="20" /> 共通の移行原則

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">ゼロブレイク</div>
    <p class="lurus-card__body">既存エンドポイントをグレースケールで残し、Lurus を使えるところまで使います。</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="rewind" :size="20" /></span>
    <div class="lurus-card__title">ロールバック可能</div>
    <p class="lurus-card__body">すべての変更に明確な revert 手順があります。</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">可観測</div>
    <p class="lurus-card__body">移行期間中は並行稼働させ、Lumen で新旧のリンクを比較します。</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <div class="lurus-card__title">段階的</div>
    <p class="lurus-card__body">トラフィック比率に応じて 5% → 20% → 100% と進めます。</p>
  </div>
</div>

## 次のステップ

<NextSteps :steps="[
  { text: 'OpenAI から移行', link: '/ja/migrations/from-openai', primary: true },
  { text: 'エンタープライズ展開形態', link: '/ja/solutions/enterprise-deploy' },
]" />

</div>
