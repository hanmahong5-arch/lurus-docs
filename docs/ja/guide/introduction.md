---
title: Lurus API 概要
description: 1 つの API Key で 50 以上の主要 AI モデルに接続。OpenAI SDK と完全互換で、2 行の変更だけで導入できます。
---

<div class="lurus-api-intro">

<ProductHero product-id="lurus-api" />

<MetricStats :items="[
  { label: '接続モデル', value: '50+' },
  { label: '無料枠', value: '100 回/日' },
  { label: '互換性', value: 'OpenAI SDK' },
]" />

**1 つの <Term t="API Key">API Key</Term> で、50 以上の主要 AI モデルに接続。** OpenAI <Term t="SDK">SDK</Term> と完全互換で、既存のコードはわずか 2 行の変更だけで済み、書き直す必要はありません。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> パスを選ぶ</span>
  <h2 class="lurus-section-head__title">あなたはどのタイプのユーザーですか？</h2>
  <p class="lurus-section-head__lede">3 つの入口から、あなたの背景に合わせて 1 つ選んですぐに始めましょう。</p>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/ja/guide/clients/cherry-studio">
    <span class="lurus-card__icon"><Icon name="rocket" :size="22" /></span>
    <div class="lurus-card__title">すぐ試したい、技術的な知識はない</div>
    <p class="lurus-card__body">まず AI クライアント（Cherry Studio / Lobe Chat）を設定し、API Key を入力すれば対話できます。最後までコードを書く必要はありません。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/ja/guide/quickstart">
    <span class="lurus-card__icon"><Icon name="code" :size="22" /></span>
    <div class="lurus-card__title">開発者で、AI 機能を導入したい</div>
    <p class="lurus-card__body">5 分で初回の API 呼び出しを完了。Python / Node.js / Go / cURL に対応。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/migrations/from-openai">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="22" /></span>
    <div class="lurus-card__title">すでに OpenAI を使っていて、切り替え / コスト削減したい</div>
    <p class="lurus-card__body">2 行のコードを置き換えるだけで移行でき、すべての OpenAI SDK 機能と完全互換です。</p>
  </a>
</div>

::: info すでに OpenAI を使っていて、切り替え / コスト削減したい
2 行のコードを置き換えるだけで移行でき、すべての OpenAI SDK 機能と完全互換です：
```python
# この 2 行を変えるだけ、ほかのコードはそのまま
base_url="https://api.lurus.cn/v1"
api_key="sk-your-lurus-key"
```
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> 中核機能</span>
  <h2 class="lurus-section-head__title">1 つのゲートウェイ、4 つの仕事</h2>
  <p class="lurus-section-head__lede">統一接続、インテリジェントルーティング、コスト管理、エンタープライズ級のアクセス管理。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-lurus-api)"
  :items="[
    { title: '統一 API', body: '1 つのインターフェースですべてのモデルをカバー。model 名を変えるだけで、各プロバイダーごとにアダプターを書く必要はありません。', icon: 'plug-zap' },
    { title: 'インテリジェントルーティングと自動フェイルオーバー', body: 'マルチチャネル冗長（メインチャネルが失敗すると自動で切り替え）、重み付き負荷分散（比率に応じて振り分けコストと速度をバランス）、優先度ポリシー（まず低コストチャネルを使い、上限を超えたら高コストの予備に切り替え）。', icon: 'shuffle' },
    { title: 'きめ細かなコスト管理', body: '各 API Key に Token クォータを設定し超過時に遮断；日次/月次で呼び出し回数、Token、費用の明細を確認；クォータ残量が 20% を下回るとアラート。', icon: 'wallet' },
    { title: 'エンタープライズ級アクセス管理', body: '複数 Key をプロジェクト別に割り当て、モデルホワイトリスト、IP ホワイトリスト、完全な監査ログ。各リクエストのモデル/Token/レイテンシをすべて記録。', icon: 'shield-check' },
  ]"
/>

**統一 API の例** —— `model` 名を変えるだけでプロバイダーを切り替え：

```python
from openai import OpenAI
client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-api-key")
# model 可填 deepseek-chat / gpt-4o / claude-3-5-sonnet / gemini-3-pro-preview
response = client.chat.completions.create(model="deepseek-chat", messages=[{"role": "user", "content": "你好"}])
```

### <Icon name="shield-check" :size="20" /> エンタープライズ級アクセス管理

| 機能 | 説明 |
|------|------|
| 複数 Key 管理 | プロジェクト/チームごとに独立した Key を割り当て |
| モデルホワイトリスト | Key が指定モデルのみにアクセスできるよう制限 |
| IP ホワイトリスト | 指定した IP 範囲からのみ呼び出しを許可 |
| 完全な監査ログ | 各リクエストのモデル、Token、レイテンシをすべて記録 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> 適用シーン</span>
  <h2 class="lurus-section-head__title">誰が Lurus API を使っているか</h2>
</div>

| シーン | できること |
|------|-----------|
| **AI アプリ開発** | 同じコードですべてのプロバイダーに接続し、異なるモデルを素早く A/B テスト |
| **コスト最適化** | 日常タスクは DeepSeek（低コスト）、複雑なタスクは GPT-4o（高品質）に振り分け |
| **サービス安定性** | マルチチャネル冗長で、単一プロバイダーの障害がサービスに影響しない |
| **チーム管理** | Key + クォータを割り当て、全員の AI 利用量と費用を一元的に確認 |
| **AI クライアント** | Cherry Studio、Lobe Chat、OpenCat などのツールに統一バックエンドを提供 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> アーキテクチャ概要</span>
  <h2 class="lurus-section-head__title">リクエストはどう流れるのか</h2>
</div>

<ArchitectureDiagram
  title="Lurus API ゲートウェイのデータフロー"
  chart="graph LR; A[あなたのアプリ / AI クライアント] --> B[Lurus API Gateway]; B --> C[認証]; C --> D[ルーティング]; D --> E[レート制限]; E --> F[課金]; F --> G[ログ]; D --> H[OpenAI]; D --> I[Claude]; D --> J[Gemini]; D --> K[DeepSeek]"
/>

ゲートウェイは設定されたチャネル優先度に従ってルーティングし、あるプロバイダーがエラーを返すと自動的に次へ再試行します。コードは切り替えを意識しません。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="graduation-cap" :size="14" /> 推奨学習パス</span>
  <h2 class="lurus-section-head__title">20 分で全体の流れを通す</h2>
  <p class="lurus-section-head__lede">初めて使いますか？順番に進めましょう。</p>
</div>

<ol class="lurus-steps">
<li>

[API Key を取得](/ja/guide/get-api-key) —— 登録して最初の Key を作成（3 分）

</li>
<li>

[クイックスタート](/ja/guide/quickstart) —— 最初の API リクエストを送る（5 分）

</li>
<li>

[対応モデル](/guide/models) —— 利用できるモデルと選び方を知る

</li>
<li>

[Chat Completions API](/ja/api/chat-completions) —— 最もよく使うインターフェースを習得

</li>
</ol>

::: details 上級者は直接ここへ…
- [Function Calling](/ja/api/chat-completions#function-calling) — AI にあなたの関数を呼び出させる
- [ストリーミングレスポンス](/ja/api/chat-completions#流式响应) — 1 文字ずつ出力して体験を向上
- [API リファレンス総覧](/ja/api/overview) — 完全なエンドポイント一覧
:::

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'クイックスタート', link: '/ja/guide/quickstart', primary: true },
    { text: '対応モデル', link: '/guide/models' },
    { text: 'コンソール', link: 'https://api.lurus.cn', external: true },
  ]"
/>

<RelatedProducts product-id="lurus-api" />

</div>
