---
title: "開発ツール業界向けソリューション"
description: "Kova + Switch + Lumen — 開発者ツール企業とインフラチーム向け。"
---

<div class="devtools-page">

# 開発ツール業界向けソリューション

<MetricStats :items="[
  { label: '統合管理 CLI', value: '5 種', hint: 'Switch' },
  { label: 'ゲートウェイモデル', value: '50+' },
  { label: 'Agent 復旧', value: 'マイクロ秒級', hint: 'WAL チェックポイント再開' },
  { label: '連携コンポーネント', value: '4 個', hint: 'Kova · MemX · API · Lumen' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 対象者</span>
  <h2 class="lurus-section-head__title">利用しているのは</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">AI プログラミングツール企業</div>
    <p class="lurus-card__body">自社の AI プログラミング製品を構築。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
    <div class="lurus-card__title">Platform / DevX チーム</div>
    <p class="lurus-card__body">社内の開発者体験。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="terminal" :size="20" /></span>
    <div class="lurus-card__title">個人開発者 / 小規模スタジオ</div>
    <p class="lurus-card__body">軽量に始めて、必要に応じて拡張。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="graduation-cap" :size="20" /></span>
    <div class="lurus-card__title">研究機関</div>
    <p class="lurus-card__body">実験的な Agent ワークフロー。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> コアコンポーネント</span>
  <h2 class="lurus-section-head__title">製品の組み合わせ</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="kova"   :actions="[{label:'Kova',   href:'/ja/kova/',   primary:true}]" />
  <ActionCard product-id="switch" :actions="[{label:'Switch', href:'/ja/switch/', primary:true}]" />
  <ActionCard product-id="lumen"  :actions="[{label:'Lumen',  href:'/ja/lumen/',  primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="puzzle" :size="14" /> 代表的な組み合わせ</span>
  <h2 class="lurus-section-head__title">2 つの導入パターン</h2>
</div>

### シナリオ A：自社の AI プログラミングツールを構築

<ArchitectureDiagram title="自社の AI プログラミングツールを構築" chart="graph TB; Kova[Kova<br/>永続実行 · クラッシュ復旧] --> MemX[MemX<br/>ユーザー設定 / プロジェクト規約を記憶]; MemX --> API[Lurus API<br/>50+ モデルをプラグアンドプレイ]; API --> Lumen[Lumen<br/>リリース後の観測 + Replay デバッグ]; Lumen --> Auth[Auth<br/>全員 SSO + Passkey]" />

### シナリオ B：社内開発者の ROI を最適化

<ArchitectureDiagram title="社内開発者の ROI を最適化" chart="graph TB; Switch[Switch<br/>チームの 5 種 CLI を統合管理] --> Lumen[Lumen<br/>1 人あたり 1 日の Token 消費を 1 枚で可視化]; Lumen --> ArgoCD[ArgoCD<br/>設定を Git 同期]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="trending-up" :size="14" /> 効果</span>
  <h2 class="lurus-section-head__title">代表的な効果</h2>
</div>

| 指標 | Before | After |
|------|--------|-------|
| AI ツール設定の分散 | 5 つの JSON | **1 つの yaml** |
| 月間 Token コスト | 不可視 | **ダッシュボード + アラート** |
| Agent クラッシュ復旧 | 再起動で最初から | **マイクロ秒級チェックポイント再開** |
| リリースサイクル | 週単位 | **日単位** |

## 次のステップ

<NextSteps :steps="[
  { text: 'Kova クイックスタート', link: '/ja/kova/quickstart', primary: true },
  { text: 'Switch の設定', link: '/ja/switch/configuration' },
  { text: 'Lumen クイックスタート', link: '/ja/lumen/quickstart' },
]" />

</div>
