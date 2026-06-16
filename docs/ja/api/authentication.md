---
title: API 認証
description: Lurus API の認証方式。API Key の形式とリクエストヘッダーの設定を含みます。
---

<div class="api-auth-page">

# 認証

すべての Lurus API リクエストには認証が必要です。**2 つの相補的なモード**をサポートしており、用途に応じて選択します。

<div class="lurus-cards lurus-cards--2">
  <a class="lurus-card lurus-card--auth" href="#認証方式">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">API Key <span class="lurus-tag">最速で始める</span></div>
    <p class="lurus-card__body">Bearer Token。スクリプトや個人プロジェクトに最適。本ページで主に解説します。</p>
  </a>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">OIDC / OAuth2 Token</div>
    <p class="lurus-card__body">統一 ID 基盤に基づき、ユーザーログインが必要なアプリ、企業 SSO、M2M に最適。<a href="/ja/platform/auth/oidc">OIDC 連携</a>と <a href="/ja/platform/auth/api-auth">PAT / JWT</a> を参照。</p>
  </div>
</div>

## 認証方式

<Term t="Bearer Token">Bearer Token</Term> を使い、HTTP ヘッダーに <Term t="API Key">API Key</Term> を付与します。

```http
Authorization: Bearer sk-your-api-key
```

## リクエスト例

```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek-chat", "messages": [{"role": "user", "content": "Hi"}]}'
```

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key="sk-your-api-key",  # 建议改为 os.environ.get("LURUS_API_KEY")
)
```

```javascript [Node.js]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: 'sk-your-api-key',  // 建议改为 process.env.LURUS_API_KEY
});
```

:::

SDK の一覧は [API 概要 — SDK サポート](/ja/api/overview#sdk-支持) を参照してください。

## 環境変数

API Key は環境変数に保存し、ハードコーディングを避けることを推奨します。

```bash
# .env
LURUS_API_KEY=sk-your-api-key
```

```python
import os
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ.get("LURUS_API_KEY"))
```

## 認証エラー

| ステータスコード | `code` | `type` | よくある原因 |
|--------|--------|--------|---------|
| **401** Unauthorized | `invalid_api_key` | `authentication_error` | Key の形式が不正 / 無効化または削除済み / Authorization ヘッダーの形式が不正 |
| **403** Forbidden | `access_denied` | `authorization_error` | Key に当該モデルの権限がない / アカウントが停止中 / クォータを使い切った |

エラーレスポンスの JSON 構造とリトライ戦略は [エラー処理](/ja/api/errors) を参照してください。

## セキュリティのベストプラクティス

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="server" :size="20" /></span>
    <div class="lurus-card__title">環境変数を使う</div>
    <p class="lurus-card__body">コード内に API Key をハードコーディングしない</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">公開しない</div>
    <p class="lurus-card__body">Git リポジトリにコミットしない</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="filter" :size="20" /></span>
    <div class="lurus-card__title">権限を制限する</div>
    <p class="lurus-card__body">Key には必要最小限の権限のみ付与する</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="repeat" :size="20" /></span>
    <div class="lurus-card__title">定期的にローテーションする</div>
    <p class="lurus-card__body">API Key を周期的に更新する</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">ログを監視する</div>
    <p class="lurus-card__body">API 呼び出しログを定期的に確認する</p>
  </div>
</div>

---

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'Chat Completions API', link: '/api/chat-completions', primary: true },
    { text: 'エラー処理', link: '/api/errors' },
    { text: 'API 概要', link: '/api/overview' },
    { text: 'OIDC 連携', link: '/platform/auth/oidc' },
  ]"
/>

</div>
