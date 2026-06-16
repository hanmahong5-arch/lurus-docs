---
title: トラブルシューティング
description: Lurus 全製品でよく発生する問題を 1 ページで特定 —— 401 / モデルのチャネルなし / 429 / クォータ不足 / コンテキスト超過 / タイムアウト。エラーコードと解決手順付き。
---

<div class="troubleshooting-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> トラブルシューティング</span>
  <h1 class="lurus-section-head__title">問題が発生したら？ここから始めましょう</h1>
  <p class="lurus-section-head__lede">まず症状から行き先を特定し、次に下のよくある問題を展開して照合しながら調査します。内容は重複させず、権威あるページへ案内するだけです。</p>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/ja/api/errors">
    <span class="lurus-card__icon"><Icon name="alert-circle" :size="22" /></span>
    <div class="lurus-card__title">API エラー（4xx / 5xx）</div>
    <p class="lurus-card__body">完全なエラーコード、レスポンス構造、リトライ戦略 —— 401 / 402 / 404 / 429 / 5xx を一覧。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/ja/guide/faq">
    <span class="lurus-card__icon"><Icon name="key-round" :size="22" /></span>
    <div class="lurus-card__title">アカウント、Key と認証</div>
    <p class="lurus-card__body">登録、API Key の紛失、Key 無効の調査、モデルとストリーミング呼び出しのよくある問題。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/ja/platform/billing">
    <span class="lurus-card__icon"><Icon name="wallet" :size="22" /></span>
    <div class="lurus-card__title">課金とクォータ</div>
    <p class="lurus-card__body">無料枠、サブスクリプションプラン、鹿贝の課金ルール、そしてクォータを使い切った後の対処。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/ja/guide/clients/others">
    <span class="lurus-card__icon"><Icon name="plug" :size="22" /></span>
    <div class="lurus-card__title">クライアントが接続できない</div>
    <p class="lurus-card__body">Cherry Studio / Lobe Chat / OpenCat などサードパーティクライアントの接続とトラブルシューティング。</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/ja/platform/faq">
    <span class="lurus-card__icon"><Icon name="layers" :size="22" /></span>
    <div class="lurus-card__title">製品固有の問題</div>
    <p class="lurus-card__body">プラットフォーム、MemX、Lucrum など各製品には独立した FAQ があります。まず該当製品ドキュメントのよくある質問ページを確認してください。</p>
  </a>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> よくある症状</span>
  <h2 class="lurus-section-head__title">エラー別に照合して調査</h2>
  <p class="lurus-section-head__lede">遭遇したエラーを展開し、チェックリストに沿って確認してください。詳細なエラーコードは <a href="/ja/api/errors">エラー処理</a> を参照。</p>
</div>

<details class="lurus-faq-item" id="invalid-api-key">
<summary><code>401 Unauthorized</code> / <code>invalid_api_key</code> が返る</summary>

```json
{ "error": { "code": "invalid_api_key", "type": "authentication_error" } }
```

`authentication_error` は Key が無効または欠落していることを示します。以下を順に確認してください：

- Key が完全で、`sk-` で始まり、余分な空白や改行がないこと（もう一度コピーし直す）
- リクエストヘッダの形式が `Authorization: Bearer sk-xxxx`（`Bearer` の後に空白が 1 つ）
- Key の状態が「有効」であること（コンソール → トークン管理）
- 環境変数名のスペルが正しく、読み込まれていること

401 は **リトライせず**、Key を修正してから再送してください。詳細は [認証](/ja/api/authentication) と [よくある質問：Key 無効の調査方法](/ja/guide/faq) を参照。

</details>

<details class="lurus-faq-item">
<summary><code>"no available server"</code> / <code>model_not_found</code>（HTTP 404）が返る</summary>

```json
{ "error": { "code": "model_not_found", "message": "模型 xxx 无可用渠道", "type": "new_api_error" } }
```

- `model` 名のスペルを確認（大文字小文字を区別）
- その Key にこのモデルへのアクセス権限があるか確認
- そのモデルに利用可能なチャネルが一時的にない可能性
- Key を作成したばかりの場合は、約 10 秒待ってから再試行

利用可能なモデル一覧は [サポートされているモデル](/guide/models) を参照。

</details>

<details class="lurus-faq-item">
<summary><code>429 Too Many Requests</code> / <code>rate_limit_exceeded</code> が返る</summary>

```json
{ "error": { "code": "rate_limit_exceeded", "type": "rate_limit_error" } }
```

レート制限を超過しています。対処方法：

- リクエスト頻度を下げ、`2 ** attempt` 秒の **指数バックオフ** を行ってからリトライ
- Free はデフォルト 60 RPM、Pro / Team にアップグレードすると上限が上がる
- 有料化後も頻繁に発生する場合は <a href="mailto:support@lurus.cn">support@lurus.cn</a> まで連絡

リトライのコード例は [エラー処理 · ベストプラクティス](/ja/api/errors#エラー処理ベストプラクティス) を参照。

</details>

<details class="lurus-faq-item" id="insufficient-quota">
<summary><code>402</code> / <code>insufficient_quota</code>（クォータ / 残高不足）が返る</summary>

```json
{ "error": { "code": "insufficient_quota", "type": "billing_error" } }
```

- まず当日の無料クォータを使い切っていないか確認（Free プランは 100 回/日）
- 鹿贝残高を確認：[identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)
- セルフチャージまたはプランのアップグレードを。ルールは [課金説明](/ja/platform/billing) を参照

</details>

<details class="lurus-faq-item">
<summary><code>context_length_exceeded</code>（コンテキスト超過）</summary>

```json
{ "error": { "code": "context_length_exceeded", "type": "invalid_request_error" } }
```

`deepseek-chat` の 64K、`gemini-3-pro-preview` の 1M など、モデルの上限を超えた場合：

- 入力を減らす、履歴メッセージを削減する
- スライディングウィンドウを使う（system + 直近 N ラウンドを保持）
- より長いコンテキストのモデルに切り替える

</details>

<details class="lurus-faq-item">
<summary>リクエストのタイムアウト / 長時間応答なし</summary>

1. ネットワーク接続を確認：`curl https://api.lurus.cn/v1/models`
2. `max_tokens` を小さくする
3. 推論モデル（`deepseek-reasoner`）は思考時間が長いのが正常
4. SDK のデフォルトタイムアウトは約 60 秒、`timeout` を大きくできる
5. タイムアウトが続く場合は上流の障害の可能性、別のモデルに変えて再試行

</details>

---

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">見つからない場合は support@lurus.cn へ連絡</p>
    <div class="lurus-callout__body">次の情報を添えてください：エラーメッセージの完全な内容、リクエスト ID（レスポンスヘッダ <code>X-Request-ID</code>）、発生時刻、再現手順。迅速な特定に役立ちます。</div>
  </div>
</div>

<NextSteps
  title="関連ドキュメント"
  :steps="[
    { text: 'エラー処理（完全なエラーコード）', link: '/ja/api/errors', primary: true },
    { text: 'よくある質問', link: '/ja/guide/faq' },
    { text: '課金説明', link: '/ja/platform/billing' },
  ]"
/>

</div>
