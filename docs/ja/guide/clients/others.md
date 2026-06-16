---
title: その他のクライアント
description: OpenAI API 互換のその他のクライアントで Lurus API を設定します。
---

<div class="others-page">

# その他のクライアント

OpenAI API をサポートするクライアントであれば、いずれも Lurus API を利用できます。以下に共通の設定パラメータ、主要なクライアント一覧、そのままコピーできる設定例を示します。

## 共通設定

クライアントの OpenAI 互換設定に、次の 2 項目を入力するだけです。

| 設定項目 | 値 |
|--------|-----|
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | `sk-your-api-key` |

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">まだ Key をお持ちでない方へ</p>
<div class="lurus-callout__body"><a href="/ja/guide/get-api-key">API Key の取得</a> へお進みください。モデル名は <a href="/guide/models">サポートされているモデル</a> で確認できます。</div>
</div>
</div>

## サポートされているクライアント

<div class="lurus-h3">デスクトップアプリ</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/ja/guide/clients/cherry-studio">
<span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
<div class="lurus-card__title">Cherry Studio</div>
<p class="lurus-card__body">クロスプラットフォーム、多機能</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">ChatBox</div>
<p class="lurus-card__body">シンプルで使いやすい</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">BetterChatGPT</div>
<p class="lurus-card__body">オープンソースで無料</p>
</div>
</div>

<div class="lurus-h3">モバイルアプリ</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/ja/guide/clients/opencat">
<span class="lurus-card__icon"><Icon name="smartphone" :size="20" /></span>
<div class="lurus-card__title">OpenCat</div>
<p class="lurus-card__body">iOS / macOS</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="smartphone" :size="20" /></span>
<div class="lurus-card__title">ChatGPT Next Web</div>
<p class="lurus-card__body">PWA</p>
</div>
</div>

<div class="lurus-h3">Web アプリ</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/ja/guide/clients/lobe-chat">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">Lobe Chat</div>
<p class="lurus-card__body">モダンなオープンソースのチャット UI</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">ChatGPT Web</div>
<p class="lurus-card__body">ブラウザ向け</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="server" :size="20" /></span>
<div class="lurus-card__title">Open WebUI</div>
<p class="lurus-card__body">セルフホスト</p>
</div>
</div>

<div class="lurus-h3">IDE プラグイン</div>

<div class="lurus-cards lurus-cards--compact">
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Continue</div>
<p class="lurus-card__body">VS Code</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Codeium</div>
<p class="lurus-card__body">IDE 補完</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Cursor</div>
<p class="lurus-card__body">AI エディタ</p>
</div>
</div>

<div class="lurus-h3">コマンドラインツール</div>

<div class="lurus-cards lurus-cards--compact">
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">llm-cli</div>
<p class="lurus-card__body">ターミナルから呼び出し</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">aichat</div>
<p class="lurus-card__body">ターミナルから呼び出し</p>
</div>
</div>

## 設定例

### Cursor

<ol class="lurus-steps">
<li>

**設定 → OpenAI API** を開きます。

</li>
<li>

**API Key**：Lurus Key を入力します。

</li>
<li>

**Base URL**：`https://api.lurus.cn/v1`。

</li>
</ol>

### Continue (VS Code)

`~/.continue/config.json` を編集します。

```json
{
  "models": [
    {
      "title": "Lurus DeepSeek",
      "provider": "openai",
      "model": "deepseek-chat",
      "apiBase": "https://api.lurus.cn/v1",
      "apiKey": "sk-your-api-key"
    }
  ]
}
```

## サポートされていない機能

一部のクライアント固有の機能は完全には互換ではない場合があります。

<div class="lurus-callout lurus-callout--warn">
<span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
<div>
<p class="lurus-callout__title">互換性に関する注意</p>
<div class="lurus-callout__body"><ul><li>リアルタイム音声対話</li><li>画像編集</li><li>特定ベンダー固有の専用 API</li></ul><p>問題がある場合は、テクニカルサポートにお問い合わせください。</p></div>
</div>
</div>

<NextSteps title="次のステップ" :steps="[
  { text: 'サポートされているモデルを見る', link: '/guide/models' },
  { text: 'API Key を取得する', link: '/ja/guide/get-api-key' },
  { text: 'API クイックスタートを見る', link: '/ja/guide/quickstart' }
]" />

</div>

<style scoped>
.others-page .lurus-h3 { margin-top: 1.6rem; }
.others-page .lurus-steps { margin-top: 1rem; }
</style>
