---
title: Cherry Studio 設定
description: Cherry Studio で Lurus API を設定し、50 以上の AI モデルにワンクリックで接続します。
---

<div class="cherry-page">

# Cherry Studio 設定

[Cherry Studio](https://cherry-ai.com) は、複数のモデルプロバイダーに対応した優れたクロスプラットフォーム AI クライアントです。このページでは、数分で Lurus API に接続する方法を説明します。

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">始める前に</p>
<div class="lurus-callout__body">Lurus の <Term t="API Key">API Key</Term>（形式 <code>sk-xxx</code>）を用意してください。まだお持ちでないですか？<a href="/ja/guide/get-api-key">API Key を取得</a>してください。</div>
</div>
</div>

## 設定手順

<ol class="lurus-steps">
<li>

Cherry Studio の**設定**を開きます。

</li>
<li>

「**API プロバイダー**」を選択します。

</li>
<li>

「**カスタムプロバイダーを追加**」をクリックします。

</li>
<li>

以下の情報を入力します：

| フィールド | 値 |
|------|-----|
| 名称 | Lurus API |
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | あなたの API Key (`sk-xxx`) |

</li>
<li>

設定を**保存**します。

</li>
</ol>

## クイック設定リンク

以下のリンクをクリックすると、設定をすばやくインポートできます：

```
cherrystudio://providers/api-keys?v=1&data={cherryConfig}
```

`{cherryConfig}` をあなたの設定情報に置き換えてください。

## モデルの選択

設定が完了したら、Cherry Studio で **Lurus API** をプロバイダーとして選択すると、サポートされているすべてのモデルを利用できます。完全な一覧は[サポートされているモデル](/guide/models)を参照してください。

## よくある質問

<details class="lurus-faq-item">
<summary>接続に失敗しますか？</summary>

- API Key が正しいか確認してください
- ネットワーク接続が正常か確認してください
- Base URL が正しいか確認してください（`https://api.lurus.cn/v1`）

</details>

<details class="lurus-faq-item">
<summary>モデル一覧が空ですか？</summary>

設定でモデル一覧を手動で更新するか、`deepseek-chat` のようにモデル名を手動で入力してみてください。

</details>

<NextSteps title="次のステップ" :steps="[
  { text: 'サポートされているモデルを見る', link: '/guide/models' },
  { text: 'API Key を取得', link: '/ja/guide/get-api-key' },
  { text: 'API クイックスタートを見る', link: '/ja/guide/quickstart' }
]" />

</div>

<style scoped>
.cherry-page .lurus-steps { margin-top: 1rem; }
</style>
