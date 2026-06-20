---
title: "なぜ Lurus を選ぶのか"
description: "ゲートウェイ・Agent・記憶・アイデンティティの 4 つのコア能力 vs 自前構築の TCO 比較。"
---

<div class="why-lurus-page">

# なぜ Lurus を選ぶのか

> 「自前構築 vs 購入」を評価中の方へ。このページでは 4 つの重要能力の TCO 比較をご紹介します。

<MetricStats :items="[
  { label: 'ゲートウェイ接続モデル', value: '50+', hint: '単一の Key' },
  { label: 'Kova スケジューリング', value: '3μs', hint: 'Criterion ベンチマーク' },
  { label: '統一アイデンティティ', value: 'SSO/MFA', hint: '企業 IdP に接続' },
  { label: 'MemX PII ルール', value: '12 種', hint: '回避不可' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="award" :size="14" /> コア比較</span>
  <h2 class="lurus-section-head__title">4 つのコア能力 vs 自前構築</h2>
  <p class="lurus-section-head__lede">ゲートウェイ・Agent 実行・記憶・アイデンティティ——各項目を自前構築の工数と対比します。</p>
</div>

<ComparisonTable
  title="LLM ゲートウェイ"
  self-label="Lurus API"
  :competitors="['自前構築 OneAPI', '自前構築 LiteLLM']"
  :rows="[
    { dimension: '接続モデル数', self: '50+（内蔵）', alt: { '自前構築 OneAPI': '個別に接続が必要', '自前構築 LiteLLM': '個別に接続が必要' } },
    { dimension: 'OpenAI SDK 互換', self: '即利用可', alt: { '自前構築 OneAPI': '一部', '自前構築 LiteLLM': '一部' } },
    { dimension: '課金 + レート制限', self: '内蔵', alt: { '自前構築 OneAPI': '自前構築が必要', '自前構築 LiteLLM': '自前構築が必要' } },
    { dimension: 'エンジニア工数（人月）', self: '0', alt: { '自前構築 OneAPI': '2-4 人月', '自前構築 LiteLLM': '2-3 人月' } },
  ]"
/>

<ComparisonTable
  title="Agent 実行エンジン"
  self-label="Kova"
  :competitors="['自前構築 Temporal', '自前構築 LangGraph + Redis']"
  :rows="[
    { dimension: 'スケジューリング遅延', self: '3μs', alt: { '自前構築 Temporal': '1-10ms', '自前構築 LangGraph + Redis': '5-20ms' } },
    { dimension: 'クラッシュ復旧', self: 'WAL 自動', alt: { '自前構築 Temporal': 'Event Sourcing', '自前構築 LangGraph + Redis': '半自動' } },
    { dimension: '外部依存', self: 'ゼロ', alt: { '自前構築 Temporal': 'Cassandra/MySQL', '自前構築 LangGraph + Redis': 'Redis/PG' } },
    { dimension: 'エンジニア工数（人月）', self: '0', alt: { '自前構築 Temporal': '3-6 人月', '自前構築 LangGraph + Redis': '2-4 人月' } },
  ]"
/>

<ComparisonTable
  title="AI 記憶"
  self-label="MemX"
  :competitors="['自前構築 mem0', '自前構築 Weaviate + ルール']"
  :rows="[
    { dimension: 'PII フィルタ', self: '12 ルール内蔵', alt: { '自前構築 mem0': '自前実装が必要', '自前構築 Weaviate + ルール': '自前実装が必要' } },
    { dimension: '減衰/忘却', self: 'エビングハウス曲線', alt: { '自前構築 mem0': 'なし', '自前構築 Weaviate + ルール': '自前実装が必要' } },
    { dimension: 'LLM 蒸留コスト', self: '0（ルールへフォールバック）', alt: { '自前構築 mem0': '毎回 LLM 費用', '自前構築 Weaviate + ルール': '毎回 LLM 費用' } },
    { dimension: 'エンジニア工数（人月）', self: '0', alt: { '自前構築 mem0': '1-2 人月', '自前構築 Weaviate + ルール': '3-5 人月' } },
  ]"
/>

<ComparisonTable
  title="アイデンティティとコンプライアンス"
  self-label="Lurus Auth"
  :competitors="['自前構築 Keycloak', 'Auth0 クラウドサービス']"
  :rows="[
    { dimension: 'SSO フェデレーション', self: '即利用可', alt: { '自前構築 Keycloak': '設定が必要', 'Auth0 クラウドサービス': '従量課金' } },
    { dimension: '国密 SM4-GCM', self: 'オプション', alt: { '自前構築 Keycloak': '非対応', 'Auth0 クラウドサービス': '非対応' } },
    { dimension: 'Passkey / MFA', self: '内蔵', alt: { '自前構築 Keycloak': '一部', 'Auth0 クラウドサービス': '内蔵' } },
    { dimension: 'エンジニア工数（人月）', self: '0', alt: { '自前構築 Keycloak': '2-4 人月', 'Auth0 クラウドサービス': '0、ただしデータが国外へ' } },
  ]"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 総合勘定</span>
  <h2 class="lurus-section-head__title">総合 TCO</h2>
  <p class="lurus-section-head__lede">4 点セットの隠れたコスト——人月、インフラ、当番、コンプライアンス——を一度にすべて計算します。</p>
</div>

| 項目 | 自前構築 4 点セット（年） | Lurus ソリューション（年） |
|------|----------------|------------------|
| エンジニア工数（人月） | **8-18 人月** | 0 |
| インフラ | ~¥15-30 万 | 従量課金、プライベート化も可能 |
| 保守当番 | 通年 24×7 | Lurus SLA |
| コンプライアンス監査 | 自社で負担 | 一式のコンプライアンスで全製品をカバー |

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="award" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">一式のコンプライアンスで全製品をカバー</p>
    <div class="lurus-callout__body">4 つの能力が同一のアイデンティティ・課金・監査レイヤーを共有します——各セットごとにコンプライアンス評価をやり直す必要がなく、エンジニア工数はそのままゼロになります。</div>
  </div>
</div>

## 関連リンク

<NextSteps :steps="[
  { text: 'エンタープライズ導入形態', link: '/ja/solutions/enterprise-deploy', primary: true },
  { text: 'エンタープライズ AI ミドルウェア', link: '/ja/solutions/ai-midware' },
  { text: '営業に問い合わせる', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
