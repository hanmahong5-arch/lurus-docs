---
title: Lobe Chat の設定
description: Lobe Chat で Lurus API をモデルプロバイダーとして設定します。
---

<div class="lobe-page">

# Lobe Chat の設定

[Lobe Chat](https://lobehub.com) は、モダンなオープンソースの AI チャットアプリケーションです。本ページでは、オンラインのワンクリック設定と手動設定の 2 つの方法を紹介します。

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">始める前に</p>
<div class="lurus-callout__body">Lurus の <Term t="API Key">API Key</Term> を用意してください。まだお持ちでない場合は、<a href="/ja/guide/get-api-key">API Key を取得</a>してください。</div>
</div>
</div>

## オンライン設定

以下のリンクをクリックすると、そのまま設定できます。

```
https://chat-preview.lobehub.com/?settings={"keyVaults":{"openai":{"apiKey":"YOUR_API_KEY","baseURL":"https://api.lurus.cn/v1"}}}
```

`YOUR_API_KEY` をご自身の API Key に置き換えてください。

## 手動設定

<ol class="lurus-steps">
<li>

Lobe Chat の**設定**を開きます。

</li>
<li>

「**言語モデル**」を選択します。

</li>
<li>

OpenAI の設定で次の項目を入力します。

- **API Key**：ご自身の Lurus API Key を入力
- **API Proxy**：`https://api.lurus.cn/v1`

</li>
<li>

設定を**保存**します。

</li>
</ol>

## 利用のヒント

<div class="lurus-callout lurus-callout--tip">
<span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
<div>
<p class="lurus-callout__title">ヒント</p>
<div class="lurus-callout__body"><ul><li>Lobe Chat はデフォルトで OpenAI のモデル名を使用するため、対話中に手動で切り替える必要があります</li><li>最高のコストパフォーマンスを得るには <code>deepseek-chat</code> の利用をおすすめします</li></ul></div>
</div>
</div>

<NextSteps title="次のステップ" :steps="[
  { text: 'サポートされているモデルを見る', link: '/guide/models' },
  { text: 'API Key を取得', link: '/ja/guide/get-api-key' },
  { text: 'API クイックスタートを見る', link: '/ja/guide/quickstart' }
]" />

</div>

<style scoped>
.lobe-page .lurus-steps { margin-top: 1rem; }
</style>
