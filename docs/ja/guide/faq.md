---
title: Lurus API よくある質問
description: Lurus API 利用時のよくある質問と回答。課金、互換性、トラブルシューティングを含みます。
---

<div class="faq-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> よくある質問</span>
  <h1 class="lurus-section-head__title">よくある質問</h1>
  <p class="lurus-section-head__lede">アカウント、モデル、課金、トラブルシューティング —— トピック別に展開します。</p>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> アカウントと認証</span>
  <h2 class="lurus-section-head__title">アカウントと認証</h2>
</div>

<details class="lurus-faq-item">
<summary>どうやって登録しますか？</summary>

[api.lurus.cn](https://api.lurus.cn) でメールアドレスとパスワードを入力（または GitHub/Google でログイン）すると、自動的に 5 鹿贝 + 無料枠が付与され、すべての製品で同一アカウントを共有します。

</details>

<details class="lurus-faq-item">
<summary>API Key を紛失しました</summary>

一度しか表示されず復元できません。コンソールで古いものを削除し、新しく作成してください。パスワードマネージャー／環境変数に保存し、コードに書き込まないでください。アカウントごとに複数の Key を作成でき、プロジェクトごとに独立した Key を割り当てるとより安全です。

</details>

<details class="lurus-faq-item">
<summary>Key が無効な場合の確認方法は？</summary>

- Key が完全であること（`sk-` で始まり文字の欠落がない）
- ステータスが「有効」であること（コンソール → トークン管理）
- リクエストヘッダーが `Authorization: Bearer sk-xxxx` であること（Bearer の後ろにスペース 1 つ）
- 余分なスペース／改行がないこと（コピーし直す）
- 環境変数名のスペルが正しく、読み込まれていること

それでも `401` が出る場合は、チェックリストに沿って項目ごとに確認してください。[トラブルシューティング · invalid_api_key](/ja/guide/troubleshooting#invalid-api-key) を参照。

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> モデルと呼び出し</span>
  <h2 class="lurus-section-head__title">モデルと呼び出し</h2>
</div>

<details class="lurus-faq-item">
<summary>どのモデルをサポートしていますか？</summary>

OpenAI、Claude、Gemini、DeepSeek など。[モデル一覧](/guide/models) を参照。

</details>

<details class="lurus-faq-item">
<summary><code>"no available server"</code> が返る</summary>

モデル名を確認してください。Key にそのモデルの権限があるか確認してください。そのモデルに一時的に利用可能なチャネルがない場合があります。管理者に連絡してください。

</details>

<details class="lurus-faq-item">
<summary>モデルを切り替えるには？</summary>

`model` パラメータだけを変更し、その他は変更不要です。

</details>

<details class="lurus-faq-item">
<summary>ストリーミング応答を有効にするには？</summary>

`"stream": true` を設定すると、応答が SSE 経由でチャンクごとに返されます。

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> 課金とクォータ</span>
  <h2 class="lurus-section-head__title">課金とクォータ</h2>
</div>

<details class="lurus-faq-item">
<summary>使用量はどこで確認しますか？</summary>

コンソールの「データダッシュボード」または「使用ログ」で確認できます。

</details>

<details class="lurus-faq-item">
<summary>クォータを使い切ったら？</summary>

管理者に連絡してチャージするか、プランをアップグレードしてください。

</details>

<details class="lurus-faq-item">
<summary>モデルの価格はどこで見られますか？</summary>

[モデル一覧](/guide/models) の料金を参照してください。

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="alert-circle" :size="14" /> 技術的な問題</span>
  <h2 class="lurus-section-head__title">技術的な問題</h2>
</div>

<details class="lurus-faq-item">
<summary>リクエストがタイムアウトする場合は？</summary>

1. ネットワークを確認する（`curl https://api.lurus.cn/v1/models`）
2. `max_tokens` を小さくする
3. 推論モデル（`deepseek-reasoner`）は思考時間が長く、正常です
4. SDK のデフォルトタイムアウトは約 60 秒。`timeout` を大きくできます
5. タイムアウトが続く場合は上流の障害の可能性があるため、モデルを切り替える

</details>

<details class="lurus-faq-item">
<summary>429 エラー（<Term t="Rate Limit">Rate Limit</Term> 超過）</summary>

頻度を下げ、指数バックオフでリトライしてください（[エラー処理](/ja/api/errors) を参照）。Free はデフォルト 60 RPM で、Pro/Team にアップグレードすると上限が引き上げられます。有料でも頻繁に発生する場合は support@lurus.cn に連絡してください。

</details>

<details class="lurus-faq-item">
<summary>コンテキスト超過（例: <code>deepseek-chat</code> 64K、<code>gemini-3-pro-preview</code> 1M）</summary>

- 入力を減らし履歴を削除する
- スライディングウィンドウ（system + 直近 N ターンを保持）
- より長いコンテキストのモデルに切り替える
- 超長文ドキュメントは先に要約してから渡す

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> その他の問題</span>
  <h2 class="lurus-section-head__title">その他の問題</h2>
</div>

<details class="lurus-faq-item">
<summary>データは安全ですか？</summary>

全行程 HTTPS。会話内容は保存しません。課金のために呼び出しのメタデータのみを記録します。

</details>

<details class="lurus-faq-item">
<summary>SLA 保証はありますか？</summary>

法人のお客様は SLA を締結できます。営業担当に連絡してください。

</details>

<details class="lurus-faq-item">
<summary>テクニカルサポートの窓口は？</summary>

support@lurus.cn / GitHub Issues。

</details>

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">答えが見つかりませんでしたか？</p>
    <p class="lurus-cta__text">ご質問をお送りください。営業日内に返信します。</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="mailto:support@lurus.cn">お問い合わせ →</a>
  </div>
</div>

</div>
