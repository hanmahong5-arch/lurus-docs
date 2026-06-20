---
title: "金融業界向けソリューション"
description: "Lucrum + Auth + コンプライアンス監査 — 証券・資産運用・フィンテック向けの組み合わせソリューション。"
---

<div class="finance-page">

# 金融業界向けソリューション

<MetricStats :items="[
  { label: 'AI 投資アドバイザー', value: '11 種', hint: 'マルチ視点' },
  { label: 'バックテスト指標', value: '30+' },
  { label: 'テストケース', value: '3157+', hint: 'Vitest' },
  { label: '戦略の本番投入', value: '1〜3 日' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 対象</span>
  <h2 class="lurus-section-head__title">どんな方が使っているか</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title">証券会社の自己勘定取引</div>
    <p class="lurus-card__body">自己勘定 / 顧客向けの A 株クオンツ運用。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="briefcase" :size="20" /></span>
    <div class="lurus-card__title">資産運用会社</div>
    <p class="lurus-card__body">戦略研究とポートフォリオ管理。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">フィンテック</div>
    <p class="lurus-card__body">AI 投資アドバイザー製品。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">ファミリーオフィス / プロ投資家</div>
    <p class="lurus-card__body">個人向けの戦略研究とバックテスト。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> コアコンポーネント</span>
  <h2 class="lurus-section-head__title">製品の組み合わせ</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="lucrum" :actions="[{label:'Lucrum を見る', href:'/ja/lucrum/', primary:true}]" />
  <ActionCard product-id="auth" :actions="[{label:'統合 ID 認証', href:'/ja/platform/auth/', primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> データフロー</span>
  <h2 class="lurus-section-head__title">典型的なアーキテクチャ</h2>
  <p class="lurus-section-head__lede">自然言語による戦略から実取引まで——アナリストは構想を記述するだけで、AI がコードに落とし込みます。</p>
</div>

<ArchitectureDiagram title="金融クオンツのデータフロー" chart="graph TB; A[アナリスト / PM] -->|自然言語で戦略を記述| B[Lucrum<br/>11 種の AI 投資アドバイザー]; B -->|vnpy コード + バックテスト| C[戦略マーケット]; C -->|サブスクリプション / 収益分配| D[実取引]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> コンプライアンス</span>
  <h2 class="lurus-section-head__title">コンプライアンスのハイライト</h2>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">データの国外流出なし</div>
    <p class="lurus-card__body">オンプレミス展開で、取引データはローカルに保存されます。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="calculator" :size="20" /></span>
    <div class="lurus-card__title">金融グレードの精度</div>
    <p class="lurus-card__body">Decimal.js を全工程に採用し、3,157 件の Vitest ケースで検証。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">全工程の監査</div>
    <p class="lurus-card__body">戦略の変更、バックテスト、取引のすべてに証跡が残ります。</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">ID 認証コンプライアンス</div>
    <p class="lurus-card__body">MFA を強制し、PAT を定期的にローテーション。SSO フェデレーションで社内 IdP に接続可能です。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> コスト</span>
  <h2 class="lurus-section-head__title">TCO の目安</h2>
</div>

| 項目 | 自社構築 | Lucrum ソリューション |
|------|------|-----------|
| リサーチャー人数 | 3〜5 名 | 1〜2 名 + AI アドバイザー |
| 戦略の本番投入サイクル | 2〜4 週間 | **1〜3 日** |
| バックテスト基盤 | 自社構築 | 標準搭載 |

## 次のステップ

<NextSteps :steps="[
  { text: 'Lucrum クイックスタート', link: '/ja/lucrum/quickstart', primary: true },
  { text: '戦略の完全フロー', link: '/ja/tutorials/lucrum-strategy-workflow' },
  { text: '営業に問い合わせる', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
