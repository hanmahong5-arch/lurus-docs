---
title: "Forge — AI プロダクト開発ワークベンチ"
description: "Web 版 AI プロダクト協業開発プラットフォーム。チームでの AI アプリ共同構築をサポートします。"
---

<div class="forge-page">

<ProductHero product-id="forge" />

::: warning 社内研究開発プラットフォーム（商用 SaaS ではありません）
Forge は現在、Lurus の**社内 R&D ツール**（ontology 駆動の要件管理 + API Gateway デモ）として位置づけられており、**外部に販売する商用プロダクトではありません**。招待制のクローズドベータのみで、API も進化途上にあります。詳細やコラボレーションについては [business@lurus.cn](mailto:business@lurus.cn) までご連絡ください。
:::

## Forge とは？

**Lurus Forge** は AI プロダクトチーム向けの開発ワークベンチで、中核となる哲学は「**すべては対話である**」ことです。プロダクト要件は Session の対話で議論し、機能は AI Agent（PM / Architect / Code）で実装し、知識はプロダクトオントロジー（Ontology）で可視化します。

基盤では [Kova エンジン](/ja/kova/) によって Agent タスクの WAL 永続化を実現しており、実行が中断しても途切れなく復旧できます。

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="network" :size="22" /></span>
    <div class="lurus-card__title">Ontology オントロジー</div>
    <p class="lurus-card__body">ツリー構造でプロダクトのユーザーストーリー、アーキテクチャ、技術スタック、デザイン規約を管理します。静的で構造化された知識です。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="22" /></span>
    <div class="lurus-card__title">Session 対話駆動</div>
    <p class="lurus-card__body">プロダクトに関する議論を一つの Session にまとめます。対話・意思決定・Agent の成果物を載せる動的なタイムラインです。</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> 中核機能</span>
  <h2 class="lurus-section-head__title">要件から PR まで、すべてを一つの可視構造に</h2>
  <p class="lurus-section-head__lede">提供済みの機能と計画中の機能を並べて表示し、ステータスラベルを正確に明示します。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-forge)"
  :items="[
    { title: 'プロダクトオントロジー (Ontology)', body: 'ユーザーストーリー / アーキテクチャ / 技術スタック / デザイン規約をツリー管理し、すべての次元を並べて可視化します。対話の中での意思決定は自動的に Ontology へ反映されます。', icon: 'network' },
    { title: '対話駆動開発', body: '「この機能のユーザーストーリーは何ですか？」と尋ねる → PM Agent が分析して生成します。各意思決定は対話コンテキストと紐づき、当初なぜそう決めたのかを遡れます。', icon: 'messages-square' },
    { title: 'WAL 意思決定の遡及', body: 'Kova エンジンの WAL に基づき、すべての対話と意思決定を永続化します。遡及・特定・Replay による振り返りが可能です。', icon: 'history' },
  ]"
/>

### 計画中 / 開発中の機能

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Dependency Guardian <Badge text="計画中" type="warning" /></div>
    <p class="lurus-card__body">Renovate / Dependabot を超える 3 層の依存管理: Patch は自動マージ（人手ゼロ）、Minor は承認カードでワンクリック判断、Major は対話形式のレビュー（AI が breaking change の業務への意味的影響を分析）。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="workflow" :size="20" /></span>
    <div class="lurus-card__title">Agent ビジュアル構築 <Badge text="開発中" type="tip" /></div>
    <p class="lurus-card__body">ドラッグ&ドロップによる 3 段階構築: トリガー条件 Trigger（Webhook / スケジュール / API リクエスト）→ AI 処理 Process（LLM 呼び出し / RAG 検索 / ツール呼び出し）→ 出力アクション Action（API コールバック / メール通知 / データベース書き込み）。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="database-backup" :size="20" /></span>
    <div class="lurus-card__title">ナレッジベース管理 <Badge text="開発中" type="tip" /></div>
    <p class="lurus-card__body">RAG ナレッジベース: ドキュメント取り込み（PDF/Word/Markdown/Web ページ）、自動チャンク分割（意味のまとまりを保持）、ベクトルインデックス（自動エンベッディングで意味検索に対応）、更新同期（ドキュメント更新時に自動で再インデックス）。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">監視と分析 <Badge text="開発中" type="tip" /></div>
    <p class="lurus-card__body">呼び出し統計（回数 / レイテンシ / Token）、品質スコア（ユーザーフィードバック + 自動評価）、コスト分析（機能別 / 時間別）、アラート（異常な呼び出し量や品質低下を自動通知）。</p>
  </div>
</div>

### Prompt エンジニアリングワークベンチ

| 機能 | 説明 |
|------|------|
| **Prompt エディター** | シンタックスハイライト、変数挿入、バージョン管理 |
| **A/B テスト** | 同じ入力で異なる Prompt の出力品質を比較 |
| **モデル比較** | 同じ Prompt を異なるモデルで実行した効果を比較 |
| **バッチテスト** | テストセットを取り込んで一括評価 |
| **バージョン履歴** | 変更のたびにバージョンを自動保存し、いつでもロールバック |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 適用シーン</span>
  <h2 class="lurus-section-head__title">チームは Forge で何をするのか</h2>
</div>

<UserScenarios
  :scenarios="[
    { role: 'AI カスタマーサポート', title: 'カスタマーサポート Agent をビジュアル構築', summary: 'ナレッジベースを管理し、サービス品質を監視', link: '/ja/forge/sessions' },
    { role: 'コンテンツ審査', title: 'ドラッグ&ドロップで審査フローを構築', summary: 'ルールを設定し、継続的に最適化', link: '/ja/forge/sessions' },
    { role: 'レコメンド', title: 'レコメンド Agent を構成', summary: '異なる戦略を A/B テスト', link: '/ja/forge/sessions' },
    { role: 'ドキュメント QA', title: 'ドキュメントを取り込んでナレッジベースを構築', summary: '質問応答 Agent をデプロイ', link: '/ja/forge/ontology' },
  ]"
/>

---

## 技術スタック

| レイヤー | 技術 |
|------|------|
| フロントエンド | TypeScript + React (Turbo monorepo) |
| AI エンジン | [Lurus API](/ja/guide/introduction)（マルチモデル対応）|
| Agent 実行 | [Kova](/ja/kova/)（永続化実行）|
| ベクトルストア | Qdrant / Chroma |
| デプロイ | Kubernetes (ArgoCD) |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="mail" :size="14" /> クローズドベータ申請</span>
  <h2 class="lurus-section-head__title">招待制クローズドベータ実施中</h2>
</div>

Forge は現在、招待制のクローズドベータ段階にあります。以下のようなチームに適しています:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <p class="lurus-card__body">プロダクトに AI 機能を統合済み、または統合を計画している</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="pen-tool" :size="20" /></span>
    <p class="lurus-card__body">可視化された Prompt 管理・テストツールが必要</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <p class="lurus-card__body">AI 機能の開発・運用コストを下げたい</p>
  </div>
</div>

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">クローズドベータの参加を申請</p>
    <p class="lurus-cta__text">business@lurus.cn までご連絡のうえ、チーム規模と解決したい課題を明記してください。</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="mailto:business@lurus.cn">メールで申請 →</a>
  </div>
</div>

## その他のリソース

- [Lurus API](/ja/guide/introduction) — 基盤となる AI 能力を理解する
- [Kova](/ja/kova/) — Agent 永続化実行エンジン
- [MemX](/ja/memx/) — AI インテリジェントメモリ管理
- [統合 ID 認証](/ja/platform/auth/) — Forge のログイン / チーム権限 / SSO フェデレーションはすべてこれを基盤とします

<!-- lurus:related-block -->

---

## 関連プロダクトと次のステップ

<RelatedProducts product-id="forge" />

</div>
