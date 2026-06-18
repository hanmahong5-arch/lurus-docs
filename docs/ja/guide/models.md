---
title: 対応モデル
description: Lurus API が対応するすべての AI モデルの一覧。価格、コンテキストウィンドウ、能力の比較を掲載しています。
---

<script setup>
import { data } from '../../.vitepress/data/models.data'
</script>

<div class="models-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> モデルカタログ</span>
  <h1 class="lurus-section-head__title">対応モデル</h1>
  <p class="lurus-section-head__lede">主要 AI ベンダーの各種モデルを、<code>model</code> 名で統一的に利用できます。本ページは <code>data/models.yaml</code> から自動レンダリングされ、一覧は常にデータファイルと同期します。</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="filter" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">モデルの追加方法</p>
    <div class="lurus-callout__body">新しいモデルの追加は <code>lurus-docs/data/models.yaml</code> を編集するだけです。プッシュ後、CI が自動でビルドして更新します。</div>
  </div>
</div>

## モデル一覧

<ModelTable
  v-for="v in data.vendors"
  :key="v.name"
  :vendor="v.name"
  :tagline="v.tagline"
  :models="v.models"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> 選定ガイド</span>
  <h2 class="lurus-section-head__title">モデルの選び方</h2>
  <p class="lurus-section-head__lede">タスクの種類と予算の 2 つの観点から素早く絞り込めます。</p>
</div>

### タスクで選ぶ

| シーン | 推奨モデル |
|------|---------|
| 日常会話 | `deepseek-chat`（コストパフォーマンス最良） |
| コード生成 | `deepseek-reasoner` / `gpt-4o` |
| 数学的推論 | `deepseek-reasoner` / `claude-3-opus` |
| 長文ドキュメント分析 | `gemini-3-pro-preview`（1M コンテキスト） |
| クリエイティブライティング | `claude-3-5-sonnet` |
| 英語タスク | `gpt-4o` / `claude-3-5-sonnet` |
| 中国語タスク | `deepseek-chat` |
| 画像理解 | `gemini-3-pro-image-preview` / `gpt-4o` |
| 画像生成 | `dall-e-3` / `midjourney` |

### 予算で選ぶ

| 予算帯 | 推奨モデル |
|---------|---------|
| 低（&lt; ¥5/M tokens） | `deepseek-chat`、`gpt-3.5-turbo`、`gemini-3-flash-preview` |
| 中（¥5–20/M tokens） | `claude-3-sonnet`、`gemini-3-pro-preview`、`gpt-4o-mini` |
| 高（&gt; ¥20/M tokens） | `gpt-4o`、`claude-3-opus` |

## モデルの切り替え

すべてのモデルは同じ API フォーマットを共有しているため、`model` フィールドを差し替えるだけで済みます（その他のコードは変更不要）：`client.chat.completions.create(model="deepseek-chat", ...)` → `model="gemini-3-pro-preview"`。

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">注意事項</p>
    <div class="lurus-callout__body"><ul><li><strong>モデルの可用性</strong>：<code>Beta</code> ステータスはプレビュー版であり、インターフェースが変更される可能性があります。</li><li><strong>クォータ制限</strong>：API Key ごとにアクセスできるモデルの権限が異なる場合があります。</li><li><strong>価格変動</strong>：料金はベンダーの調整に応じて変動します。コンソールの表示を基準としてください。</li><li><strong>コンテキスト制限</strong>：コンテキスト長を超えたリクエストは切り捨てられるか、エラーが返されます。</li></ul></div>
  </div>
</div>

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'クイックスタート', link: '/ja/guide/quickstart', primary: true },
    { text: 'Chat Completions API', link: '/ja/api/chat-completions' },
    { text: 'よくある質問', link: '/ja/guide/faq' },
  ]"
/>

</div>
