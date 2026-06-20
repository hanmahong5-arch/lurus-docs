---
title: "システムアーキテクチャ"
description: "Lurus ハイブリッドクラウドアーキテクチャの全体像。Kubernetes + GitOps による統一サービスデプロイとガバナンス体系。"
---

<ProductHero product-id="arch" />

<div class="arch-page">

Lurus はハイブリッドクラウドアーキテクチャを採用し、Kubernetes + GitOps を基盤に統一されたサービスデプロイとガバナンス体系を構築しています。12 個のプロダクトが同一のアカウント・課金・メモリ・LLM ゲートウェイ・可観測性基盤を共有します。独立したサービスの寄せ集めではなく、一度に説明しきれる一枚の図です。

<MetricStats :items="[
  { label: 'プロダクトライン', value: '12', hint: '同一基盤を共有' },
  { label: 'LLM チャネル', value: '50+', hint: 'per-channel サーキットブレーカー' },
  { label: 'デプロイ', value: 'GitOps', hint: 'GHA → GHCR → ArgoCD' },
]" />

## アーキテクチャ全景

<p class="arch-lede"><span class="lurus-tag"><Icon name="layers" :size="13" /> レイヤービュー</span> C 端プロダクトから運用基盤まで、5 つのレイヤーが上から下へ。下層は上層に能力を提供し、上層は下層の実装を意識しません。</p>

<ArchitectureDiagram title="レイヤーアーキテクチャ" chart="graph TB
  subgraph C[C 端プロダクト層]
    Lucrum[Lucrum 量化]
    Switch[Switch デスクトップ]
    Creator[Creator コンテンツ]
    Lutu[Lutu モバイル]
  end
  subgraph B[B 端プロダクト層]
    API[Lurus API LLM ゲートウェイ]
    Forge[Forge ワークベンチ]
    Lumen[Lumen 開発者ツール]
  end
  subgraph E[コアエンジン層]
    Kova[Kova 永続実行 Rust]
    MemX[MemX インテリジェントメモリ Python]
  end
  subgraph I[インフラ層]
    Platform[Platform アカウント課金]
    Auth[Auth OIDC]
    Notify[Notification マルチチャネル通知]
  end
  subgraph O[運用層]
    Ops[K8s Traefik ArgoCD Prometheus Grafana Jaeger Loki]
  end
  C --> B
  B --> E
  E --> I
  I --> O" />

::: details テキスト版レイヤー図（アクセシビリティ / コピー用）
```
┌─────────────────────────────────────────────────────────────────┐
│                      C 端产品层                                  │
│  Lucrum (量化) · Switch (桌面) · Creator (内容) · Lutu (移动)    │
├─────────────────────────────────────────────────────────────────┤
│                      B 端产品层                                  │
│  Lurus API (LLM 网关) · Forge (工作台) · Lumen (开发者工具)     │
├─────────────────────────────────────────────────────────────────┤
│                      核心引擎层                                  │
│  Kova (持久执行, Rust) · MemX (智能记忆, Python)                │
├─────────────────────────────────────────────────────────────────┤
│                      基础设施层                                  │
│  Platform (账号/计费) · Auth (OIDC) · Notification (多渠道通知)  │
├─────────────────────────────────────────────────────────────────┤
│                      运维层                                      │
│  K8s · Traefik · ArgoCD · Prometheus · Grafana · Jaeger · Loki  │
└─────────────────────────────────────────────────────────────────┘
```
:::

## 設計原則

<p class="arch-lede"><span class="lurus-tag"><Icon name="sparkles" :size="13" /> 5 つの原則</span> エントリ統一、モデル統一、デプロイ自動化、可観測性一体化、障害の自己修復。</p>

<CapabilityGrid
  accent="var(--lurus-color-arch)"
  title="コア設計"
  :items="[
    { title: '統一ゲートウェイ', body: 'Traefik エントリ、TLS 終端、ワイルドカード証明書の自動管理', icon: 'network' },
    { title: 'マルチモデル AI ゲートウェイ', body: '50+ の LLM チャネルを統一接続（OpenAI / Claude / Gemini / Deepseek / Qwen / Moonshot など）、per-channel サーキットブレーカー保護', icon: 'layers' },
    { title: 'GitOps デプロイ', body: 'GitHub Actions → GHCR コンテナイメージ → ArgoCD 自動同期', icon: 'git-merge' },
    { title: 'フルスタック可観測性', body: 'Prometheus メトリクス + Grafana ダッシュボード + Loki ログ + Jaeger 分散トレーシング', icon: 'activity' },
    { title: '高可用性設計', body: 'チャネル障害の自動フェイルオーバー、優先度 + 重みルーティング、PodDisruptionBudget 保護', icon: 'shield-check' },
  ]"
/>

## リクエスト処理フロー

<p class="arch-lede"><span class="lurus-tag"><Icon name="workflow" :size="13" /> データフロー</span> 1 回の LLM リクエストがエントリから上流へ、認証・レート制限・サーキットブレーカー・課金・ログの 5 つの関門を通過します。</p>

<ArchitectureDiagram title="リクエスト経路" chart="graph LR
  Client[Client] --> Traefik[Traefik TLS]
  Traefik --> GW[API Gateway]
  GW --> Route[インテリジェントルーティング]
  Route --> Up[上流 AI 50+ プロバイダー]
  Up --> Resp[レスポンス]
  GW -.-> Mid[認証 / レート制限 / サーキットブレーカー / 課金 / ログ]" />

API Gateway はモデル名に応じて利用可能なチャネルを自動的にマッチングし、優先度ソートと重みによるランダム割り当てをサポートします。高優先度のチャネルが故障すると、per-channel サーキットブレーカーが故障チャネルを自動的に隔離し、トラフィックを代替チャネルに切り替えます。

## 技術スタック総覧

<p class="arch-lede"><span class="lurus-tag"><Icon name="package" :size="13" /> 技術選定</span> 多言語ハイブリッドスタック。ビジネスに応じて最適なランタイムをマッチングします。</p>

| レイヤー | 技術選定 |
|------|---------|
| バックエンドサービス | Go (Gin)、Rust、Python (FastAPI) |
| フロントエンド | React / Next.js / Vue 3 / Flutter |
| デスクトップアプリ | Wails (Go + Web)、単一 exe で依存ゼロ |
| データベース | PostgreSQL (CNPG)、サービスごとに schema 隔離 |
| キャッシュ | Redis、サービスごとに DB 隔離 |
| メッセージ | NATS JetStream (イベントブロードキャスト) |
| ワークフロー | Temporal (サブスクリプション更新/定時タスク) |
| アイデンティティ認証 | Casdoor (OIDC) |
| コンテナ | scratch/alpine 最小イメージ、マルチステージビルド |
| セキュリティ | Kyverno ポリシーエンジン + NetworkPolicy + Trivy コンテナスキャン |

## ハイブリッドクラウドデプロイ

<p class="arch-lede"><span class="lurus-tag"><Icon name="cloud" :size="13" /> デプロイ形態</span> 二重パブリックエントリ + 混在オーケストレーション。国内到達性と運用コストを両立します。</p>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="cloud" :size="20" /></span>
    <div class="lurus-card__title">ハイブリッドクラウドクラスタ</div>
    <p class="lurus-card__body">三丰云 + 阿里云の二重パブリックエントリ、K3s + Docker-Compose 混在、ビジネスごとにインフラを隔離。</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">GitOps デプロイ</div>
    <p class="lurus-card__body">GitHub Actions → GHCR → ArgoCD の全工程を自動化、イメージ tag は <code>main-&lt;sha7&gt;</code> に固定。</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">フルスタック可観測</div>
    <p class="lurus-card__body">Grafana + Prometheus + Jaeger + Loki の統一パネル、メトリクス / ログ / トレースを一体化。</p>
  </div>
</div>

## セキュリティ設計

<p class="arch-lede"><span class="lurus-tag"><Icon name="shield-check" :size="13" /> 多層防御</span> 伝送からコンテナランタイムまで、7 層の多層防御。</p>

| レイヤー | 措置 |
|------|------|
| **伝送** | 全サイト HTTPS (TLS 1.3)、ワイルドカード証明書の自動更新 |
| **ネットワーク** | VPN ネットワーキング、NetworkPolicy による名前空間隔離 |
| **認証** | [統一アイデンティティ認証](/ja/platform/auth/)：OIDC JWT + API Key の二重モード、WebAuthn Passkey、エンタープライズ SSO フェデレーション |
| **認可** | RBAC ロール権限制御、マルチテナント GORM 自動隔離 |
| **暗号化** | ChaCha20-Poly1305 + 国密 SM4-GCM（信創コンプライアンス） |
| **監査** | 構造化 JSON ログ + OpenTelemetry 分散トレーシング |
| **コンテナ** | readOnlyRootFilesystem, drop ALL capabilities, runAsUser:65534 |

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">データ主権</p>
    <div class="lurus-callout__body"><p>国密 SM4-GCM による全過程暗号化、オンプレミスデプロイ、データは企業境界を出ません。一式の SSO / Passkey / MFA で企業既存の IdP に接続でき、OpenAI SDK 互換、エクスポート時の退出コストゼロ。</p></div>
  </div>
</div>

## 詳細アーキテクチャドキュメント

<script setup>
import InternalContent from '../../.vitepress/theme/components/InternalContent.vue'
</script>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="git-branch" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">単一の真源</p>
    <div class="lurus-callout__body"><p>詳細アーキテクチャ図は governance repo にあります：<a href="https://github.com/hanmahong5-arch/lurus/blob/main/lurus.yaml">lurus.yaml</a> + <a href="https://github.com/hanmahong5-arch/lurus/blob/main/doc/architecture.md">doc/architecture.md</a>。本サイトは全体図を埋め込まず、真源の二重管理を避けています。</p></div>
  </div>
</div>

</div>

---

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'Lurus API — LLM 統一ゲートウェイ', link: '/ja/guide/introduction', primary: true },
    { text: 'Kova 実行エンジン', link: '/ja/kova/' },
    { text: 'MemX メモリエンジン', link: '/ja/memx/' },
    { text: 'Platform アカウント課金', link: '/ja/platform/' },
    { text: '統一アイデンティティ認証', link: '/ja/platform/auth/' },
  ]"
/>

<RelatedProducts product-id="arch" />

<style>
.arch-page .lurus-cards { margin: 1rem 0 1.4rem; }
.arch-page .arch-lede {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  margin: 0.4rem 0 1rem;
}
.arch-page .arch-lede .lurus-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
</style>
