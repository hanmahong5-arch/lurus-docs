---
title: "エンタープライズ AI ミドルプラットフォーム構想"
description: "5 層クローズドループ — Auth · API · MemX · Kova · Lumen で、企業が自社の AI ミドルプラットフォームを構築。"
---

<div class="midware-page">

# エンタープライズ AI ミドルプラットフォーム構想

<MetricStats :items="[
  { label: '能力レイヤー', value: '5 層', hint: '単独利用可 · 組み合わせでクローズドループ' },
  { label: 'ゲートウェイモデル', value: '50+' },
  { label: 'Kova 復旧', value: 'マイクロ秒級', hint: 'WAL でブレークポイント再開' },
  { label: '導入パス', value: '10 週間', hint: '参考' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> アーキテクチャ</span>
  <h2 class="lurus-section-head__title">5 層クローズドループ</h2>
  <p class="lurus-section-head__lede">トップダウン——各層は単独で利用可能、組み合わせればクローズドループの価値がさらに高まります。</p>
</div>

<ArchitectureDiagram title="AI ミドルプラットフォーム 5 層クローズドループ" chart="graph TB; App[業務アプリケーション層<br/>カスタマーサポート · ナレッジベース · レポート · 開発者ツール] --> Lumen[Lumen 可観測性<br/>Trace / Replay / Cost]; Lumen --> Kova[Kova Agent 実行エンジン<br/>WAL / Checkpoint]; Kova --> MemX[MemX 知的メモリ<br/>蒸留 / 重複排除 / 減衰 / 検索]; MemX --> API[Lurus API 統一ゲートウェイ<br/>50+ モデル / 計量 / レート制限]; API --> Auth[Lurus Auth 統一 ID<br/>SSO · MFA · OIDC · フェデレーション]" />

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen — 可観測性</div>
    <p class="lurus-card__body">Trace / Replay / Cost。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova — Agent 実行エンジン</div>
    <p class="lurus-card__body">WAL / Checkpoint、クラッシュからブレークポイント再開。</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">MemX — 知的メモリ</div>
    <p class="lurus-card__body">蒸留 / 重複排除 / 減衰 / 検索。</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Lurus API — LLM 統一ゲートウェイ</div>
    <p class="lurus-card__body">50+ モデル / 計量 / レート制限。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Lurus Auth — 統一 ID</div>
    <p class="lurus-card__body">SSO · MFA · OIDC · フェデレーション。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> 価値の比較</span>
  <h2 class="lurus-section-head__title">単独導入 vs 5 層連携</h2>
</div>

| 観点 | 単独利用 | 5 層連携 |
|------|---------|---------|
| ID | 各自で実装 | **SSO 一度きり** |
| コスト集計 | 自前で対応 | **Lumen + API が自動で関連付け** |
| クラッシュ復旧 | 手動で追加 | **Kova WAL がバックアップ** |
| ナレッジ蓄積 | 分散 | **MemX が統一して蒸留** |
| コンプライアンス | 個別に評価 | **1 セットでコンプライアンス網羅** |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package" :size="14" /> デリバリー</span>
  <h2 class="lurus-section-head__title">代表的なデリバリー形態</h2>
</div>

| 形態 | 説明 | 期間 |
|------|------|------|
| SaaS | すぐに利用可能 | 0 |
| オンプレミス | イメージを企業の K8s にデプロイ | 2-4 週間 |
| マネージド運用 | Lurus が当番、企業の社内ネットワーク | 協議 |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> ロードマップ</span>
  <h2 class="lurus-section-head__title">参考導入パス</h2>
  <p class="lurus-section-head__lede">10 週間で段階的に接続、2 週間ごとに 1 層をデリバリーし、独立して検証できます。</p>
</div>

<ol class="lurus-steps">
  <li><strong>W1-2</strong>：<a href="/ja/guide/introduction">Lurus API</a> を接続して既存の LLM 呼び出しを置き換え</li>
  <li><strong>W3-4</strong>：<a href="/ja/platform/auth/">Auth</a> を接続して SSO を実現</li>
  <li><strong>W5-6</strong>：<a href="/ja/memx/">MemX</a> で業務ナレッジを蓄積</li>
  <li><strong>W7-8</strong>：コア Agent を <a href="/ja/kova/">Kova</a> へ移行</li>
  <li><strong>W9-10</strong>：全リンクに <a href="/ja/lumen/">Lumen</a> を接続して可観測化</li>
</ol>

## 次のステップ

<NextSteps :steps="[
  { text: 'なぜ Lurus を選ぶのか', link: '/ja/solutions/why-lurus', primary: true },
  { text: 'エンタープライズデプロイ形態', link: '/ja/solutions/enterprise-deploy' },
  { text: '営業に問い合わせ', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
