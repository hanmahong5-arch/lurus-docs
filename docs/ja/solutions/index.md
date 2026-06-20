---
title: "エンタープライズソリューション概要"
description: "業界と役割の入口別に Lurus のエンタープライズ機能を分類します。"
---

<div class="solutions-hub">

# エンタープライズソリューション

意思決定者 / 調達 / アーキテクチャレビュー / コンプライアンス準備のための入口です。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">50+</span><span class="lurus-stat__label">接続モデル</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">デプロイ形態</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">SM4-GCM</span><span class="lurus-stat__label">国密暗号</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1 枚</span><span class="lurus-stat__label">統合請求書</span></div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> 役割別</span>
  <h2 class="lurus-section-head__title">あなたに合った入口を見つける</h2>
  <p class="lurus-section-head__lede">CTO はアーキテクチャと TCO を、CISO はコンプライアンス境界を、PMO は課金と認可を確認します。</p>
</div>

<div class="action-grid">
  <ActionCard
    name="CTO / アーキテクチャレビュー"
    tagline="Why Lurus · デプロイ形態 · TCO · 性能ベンチマーク"
    icon="compass"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: 'なぜ Lurus を選ぶのか', href: '/ja/solutions/why-lurus', primary: true },
      { label: 'エンタープライズデプロイ形態', href: '/ja/solutions/enterprise-deploy' },
    ]"
  />
  <ActionCard
    name="CISO / コンプライアンス"
    tagline="SSO フェデレーション · 国密 SM4-GCM · 監査ログ · データ主権"
    icon="shield-check"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'アイデンティティとコンプライアンス', href: '/ja/platform/auth/', primary: true },
      { label: 'デプロイ形態マトリクス', href: '/ja/solutions/enterprise-deploy' },
    ]"
  />
  <ActionCard
    name="PMO / 調達"
    tagline="鹿貝ユニット課金 · 1 枚の請求書 · オンプレミスライセンス"
    icon="receipt"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: '課金の詳細', href: '/ja/platform/billing', primary: true },
      { label: '営業に問い合わせる', href: 'mailto:business@lurus.cn', external: true },
    ]"
  />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> 業界別</span>
  <h2 class="lurus-section-head__title">業界別の組み合わせソリューション</h2>
  <p class="lurus-section-head__lede">各業界ごとに検証済みの製品の組み合わせを用意し、すぐに導入できます。</p>
</div>

<div class="action-grid">
  <ActionCard
    name="金融"
    tagline="Lucrum + Auth + コンプライアンス監査"
    icon="landmark"
    color="var(--lurus-color-lucrum)"
    :actions="[
      { label: '金融業界ソリューション', href: '/ja/solutions/industry-finance', primary: true },
    ]"
  />
  <ActionCard
    name="コンテンツ"
    tagline="Creator + API + 大量コピー生成"
    icon="pen-tool"
    color="var(--lurus-color-creator)"
    :actions="[
      { label: 'コンテンツ業界ソリューション', href: '/ja/solutions/industry-content', primary: true },
    ]"
  />
  <ActionCard
    name="開発ツール"
    tagline="Kova + Switch + Lumen 開発者クローズドループ"
    icon="terminal"
    color="var(--lurus-color-switch)"
    :actions="[
      { label: '開発ツールソリューション', href: '/ja/solutions/industry-devtools', primary: true },
    ]"
  />
  <ActionCard
    name="エンタープライズ AI ミドルプラットフォーム"
    tagline="Auth + API + MemX + Kova + Lumen 5 層クローズドループ"
    icon="layers"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'AI ミドルプラットフォームソリューション', href: '/ja/solutions/ai-midware', primary: true },
    ]"
  />
</div>

## 次のステップ

<NextSteps :steps="[
  { text: 'なぜ Lurus を選ぶのか', link: '/ja/solutions/why-lurus', primary: true },
  { text: '営業に問い合わせる', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>

<style scoped>
.solutions-hub .lurus-stat-strip { margin: 20px 0 8px; }
</style>
