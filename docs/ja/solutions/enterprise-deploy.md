---
title: "エンタープライズ展開形態"
description: "SaaS / オンプレミス / ハイブリッドクラウドの3つの展開形態とコンプライアンス境界の比較。"
---

<div class="deploy-page">

# エンタープライズ展開形態

<MetricStats :items="[
  { label: '展開形態', value: '3 種類', hint: 'SaaS · オンプレミス · ハイブリッドクラウド' },
  { label: 'オンプレミス立ち上げ', value: '2〜4 週間' },
  { label: 'エンタープライズ可用性', value: '99.95%', hint: 'SaaS エンタープライズ' },
  { label: '国密暗号化', value: 'SM4-GCM' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="server" :size="14" /> 形態比較</span>
  <h2 class="lurus-section-head__title">展開形態マトリクス</h2>
  <p class="lurus-section-head__lede">同一の製品を3つの形態で導入——データ主権と立ち上げ期間で選択します。</p>
</div>

| 機能 | SaaS | オンプレミス | ハイブリッドクラウド |
|------|------|-------|--------|
| Lurus API ゲートウェイ | ✅ すぐ利用可 | ✅ イメージのオンプレミス化 | ✅ |
| Kova 実行エンジン | ✅ | ✅ | ✅ |
| MemX 記憶エンジン | ✅ | ✅ | ✅ |
| Lucrum クオンツ | ✅ | 🔜 2026 H2 | ✅ |
| Switch / Creator | ✅ デスクトップ | ✅ デスクトップ | ✅ |
| 認証とコンプライアンス | ✅ | ✅ | ✅ |
| データ主権 | AWS / Alibaba Cloud | **企業内部** | ハイブリッド |
| 国密 SM4-GCM | — | ✅ | ✅ |
| 立ち上げ期間 | 即時 | 2〜4 週間 | 1〜2 週間 |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> コンプライアンス</span>
  <h2 class="lurus-section-head__title">コンプライアンス機能</h2>
  <p class="lurus-section-head__lede">データ主権、監査証跡、国密暗号化——審査担当者が一目で確認できます。</p>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">データの国外流出なし</div>
    <p class="lurus-card__body">オンプレミス展開により、すべてのデータが Lurus パブリッククラウドを経由しません。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">監査ログ</div>
    <p class="lurus-card__body">すべての API 呼び出し、認証イベント、管理操作をすべて記録します。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">国密対応</div>
    <p class="lurus-card__body">対称暗号 SM4-GCM、非対称暗号 SM2（ロードマップ）。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="award" :size="20" /></span>
    <div class="lurus-card__title">等級保護 / 業界認証</div>
    <p class="lurus-card__body">最新のリストについては <a href="mailto:business@lurus.cn">business@lurus.cn</a> までお問い合わせください。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> ID フェデレーション</span>
  <h2 class="lurus-section-head__title">SSO フェデレーション</h2>
  <p class="lurus-section-head__lede">従業員は会社アカウントですべての Lurus 製品にログインでき、新しい ID を作成する必要はありません。</p>
</div>

既存の企業 IdP（Okta / Azure AD / 自社構築の Keycloak）を利用し、従業員は会社アカウントでログインできます。

<ArchitectureDiagram title="企業 IdP フェデレーションログイン" chart="graph LR; A[企業 IdP] -->|OIDC| B[Lurus Casdoor]; B --> C[すべての Lurus 製品]" />

対応プロトコル：OIDC / OAuth 2.0 / SAML 2.0 / SCIM（ユーザーライフサイクル）。

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="activity" :size="14" /> サービスレベル</span>
  <h2 class="lurus-section-head__title">SLA</h2>
</div>

| 形態 | 可用性 | インシデント対応 |
|------|--------|---------|
| SaaS 標準 | 99.9% | 営業時間内 |
| SaaS エンタープライズ | 99.95% | 7×24 |
| オンプレミス | 契約に準拠 | 専任オンコール |

## 次のステップ

<NextSteps :steps="[
  { text: '認証とコンプライアンス', link: '/ja/platform/auth/', primary: true },
  { text: 'Lurus を選ぶ理由', link: '/ja/solutions/why-lurus' },
  { text: '営業に問い合わせ', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
