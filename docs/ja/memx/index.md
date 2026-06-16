---
title: MemX — AI 適応型メモリエンジン
description: ACE v2.0 をベースに構築された AI メモリエンジン。インテリジェントな蒸留、バイオミメティックな忘却、全経路プライバシー保護。
---

<div class="memx-page">

<ProductHero product-id="memx" />

## MemX とは？

**MemX** は Lurus が提供する AI 適応型メモリエンジンで、**<Term t="ACE">ACE（Adaptive Context Engine）</Term>v2.0** をベースに構築されています。AI Agent に完全な知識ライフサイクル管理を提供します：**<Term t="Knowledge Distillation">インテリジェント蒸留</Term> → <Term t="Semantic Dedup">セマンティック重複排除</Term> → 減衰による忘却 → ハイブリッド検索**。これにより、AI は本当に人間のような「記憶力」を持つようになります。

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="brain" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">3 つのコアの強み</p>
    <div class="lurus-callout__body"><ul><li><strong>デフォルトでハイブリッドモード + 自動フォールバック</strong> — LLM が利用できない場合は純粋なルールベースに切り替わり、呼び出しゼロ・コストゼロ。</li><li><strong>バイオミメティックな忘却曲線</strong> — Ebbinghaus 指数減衰、半減期はデフォルト 30 日、強く想起される項目は永続メモリに昇格。</li><li><strong>全経路プライバシー保護</strong> — 機微情報はベクトルデータベースに決して入りません。</li></ul></div>
  </div>
</div>

<MetricStats :items="[
  { label: 'PII フィルタルール', value: '12 条', hint: '回避不可' },
  { label: 'ハイブリッド検索', value: '4 層', hint: 'L1→L4 加重融合' },
  { label: '減衰半減期', value: '30 日', hint: 'デフォルト・設定可' },
  { label: '提供形態', value: 'Python · REST · MCP' },
]" />

## コア機能

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> 4 大モジュール</span>
  <h2 class="lurus-section-head__title">対話から検索可能なメモリへ</h2>
  <p class="lurus-section-head__lede">ルール／数式／パラメータの詳細は <a href="/ja/memx/concepts">コア概念</a> と <a href="/ja/memx/architecture">アーキテクチャ設計</a> を参照してください。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: 'インテリジェント知識蒸留（Reflector）', body: 'hybrid モード（ルール事前フィルタ + LLM 精緻化）が 5 種類の知識パターンを識別します：エラー修正 / リトライ成功 / 設定変更 / 新規ツール使用 / 反復操作。各項目を 0-100 でスコアリングし、低スコアのノイズを除去します。', icon: 'filter' },
    { title: 'セマンティック重複排除と競合検出（Curator）', body: 'コサイン類似度 ≥0.8 で自動マージ、0.5-0.8 で潜在的な競合としてマーク、0.5 未満は独立した知識とみなします。', icon: 'git-merge' },
    { title: 'バイオミメティックなメモリ減衰', body: '7 日間の保護期間 + 指数減衰 + 想起強化；15 回以上検索された項目は永続メモリに昇格し、以降は減衰しません。', icon: 'timer' },
    { title: '4 層ハイブリッド検索', body: 'L1 完全一致 → L2 あいまい → L3 メタデータ → L4 ベクトル。ScoreMerger による加重融合後、DecayWeight × RecencyBoost × ScopeBoost を乗算し、ベクトル層が利用できない場合は自動フォールバック。', icon: 'search' },
    { title: 'プライバシーファースト設計', body: '12 条の組み込み機微情報フィルタルール（シークレット / Token / データベース接続文字列 / ローカルパス / カスタム正規表現）が、書き込み前に自動的にブロックします。', icon: 'shield-check' },
  ]"
/>

## アーキテクチャ概要

知識は対話から流入し、蒸留、プライバシーフィルタ、重複排除を順に経て、ベクトルストアとメタデータストアに格納されます。検索リクエストは 4 層のハイブリッドパイプラインを通り、減衰エンジンがバックグラウンドでメモリの活性度を継続的に維持します。

<ArchitectureDiagram
  title="ACE エンジンのデータフロー"
  chart="graph TB
  Input[対話フロー] --> Reflector[Reflector 知識蒸留]
  Reflector --> PII[PII フィルタ 12 ルール]
  PII --> Curator[Curator セマンティック重複排除]
  Curator --> Store[(ベクトル + メタデータ)]
  Store --> Decay[Decay Engine Ebbinghaus]
  Query[検索リクエスト] --> Hybrid[4 層ハイブリッド検索]
  Hybrid --> Store"
/>

## 適用シーン

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
    <div class="lurus-card__title">プログラミングアシスタント</div>
    <p class="lurus-card__body">あなたのコーディング習慣、はまった落とし穴、プロジェクトの慣習を記憶します。</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span>
    <div class="lurus-card__title">カスタマーサポートシステム</div>
    <p class="lurus-card__body">顧客の過去のインタラクション知識を蓄積し、パーソナライズされたサービスを提供します。</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="book-open" :size="20" /></span>
    <div class="lurus-card__title">個人ナレッジベース</div>
    <p class="lurus-card__body">日常の対話から自動的に知識を抽出・整理します。</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">チームコラボレーション</div>
    <p class="lurus-card__body">チームレベルのメモリを共有し、新メンバーが素早くコンテキストを把握できます。</p>
  </div>
</div>

## 従来のメモリシステムとの比較

<ComparisonTable
  self-label="MemX (ACE)"
  :competitors="['従来方式 (mem0)']"
  title="なぜ「もう一つのベクトルデータベース」ではないのか"
  :rows="[
    { dimension: '知識抽出', self: 'hybrid ハイブリッドエンジン（ルール事前フィルタ + LLM 精緻化、呼び出しを 90%+ 削減）', alt: { '従来方式 (mem0)': 'LLM（毎回 2-5K tokens）' } },
    { dimension: '重複排除', self: 'コサイン類似度による自動マージ', alt: { '従来方式 (mem0)': 'LLM が一件ずつ判断' } },
    { dimension: '忘却', self: '指数減衰 + 想起強化', alt: { '従来方式 (mem0)': '永続保存、淘汰不可' } },
    { dimension: '検索', self: '4 層ハイブリッド検索', alt: { '従来方式 (mem0)': 'ベクトル検索のみ' } },
    { dimension: 'プライバシー', self: '12 条の組み込み機微情報フィルタルール', alt: { '従来方式 (mem0)': '組み込み保護なし' } },
    { dimension: 'スコープ', self: '階層化（global / project / workspace）', alt: { '従来方式 (mem0)': 'フラット（user / agent）' } },
    { dimension: 'Token 管理', self: '組み込み予算トリミング（CJK 対応）', alt: { '従来方式 (mem0)': '呼び出し側が自前で管理' } },
    { dimension: 'ローカル埋め込み', self: 'ONNX ローカル推論、完全オフライン', alt: { '従来方式 (mem0)': 'API が必要' } },
  ]"
/>

## 次のステップ

<NextSteps
  :steps="[
    { text: 'クイックスタート — 5 分でコア機能を体験', link: '/ja/memx/quickstart', primary: true },
    { text: 'コア概念 — ACE エンジンの設計原理を深掘り', link: '/ja/memx/concepts' },
    { text: 'アーキテクチャ設計 — 完全なシステムアーキテクチャ', link: '/ja/memx/architecture' },
    { text: '統合と MCP ディレクトリ', link: '/integrations/' },
    { text: 'よくある質問', link: '/ja/memx/faq' },
  ]"
/>

<!-- lurus:related-block -->

## 関連製品と次のステップ

<RelatedProducts product-id="memx" />

</div>

<style>
.memx-page .lurus-callout {
  margin: 20px 0;
}
.memx-page .lurus-section-head {
  margin-top: 8px;
}
</style>
