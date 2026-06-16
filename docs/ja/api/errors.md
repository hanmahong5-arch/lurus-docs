---
title: エラー処理
description: Lurus API のエラーレスポンス形式、HTTP ステータスコード、よくあるエラーの対処方法。
---

<div class="api-errors-page">

# エラー処理

すべてのエラーレスポンスは統一された構造に従い、各エラーコードには `code` + `message` + 推奨アクションが付属しているため、自動処理が容易です。

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="repeat" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">リトライの黄金ルール</p>
    <p class="lurus-callout__body">認証エラー（401）は<strong>リトライせず</strong>そのまま上位へ送出します。レート制限（429）は <code>2 ** attempt</code> 秒の<strong>指数バックオフ</strong>後にリトライします。その他の API エラーは <code>max_retries</code> の上限までリトライします。</p>
  </div>
</div>

## エラーレスポンス形式

すべてのエラーレスポンスは統一された形式に従います：

```json
{ "error": { "code": "error_code", "message": "Human readable error message", "type": "error_type", "param": "optional_parameter_name" } }
```

## HTTP ステータスコード

| ステータスコード | 意味 | 説明 |
|--------|------|------|
| 200 | 成功 | リクエストが正常に処理された |
| 400 | リクエストエラー | パラメータエラーまたは形式が不正 |
| 401 | 未認証 | API Key が無効または欠落 |
| 403 | アクセス禁止 | 当該リソースへのアクセス権限がない |
| 404 | 見つかりません | 要求されたリソースが存在しない |
| 429 | リクエスト過多 | レート制限を超過 |
| 500 | サーバーエラー | サーバー内部エラー |
| 502 | ゲートウェイエラー | 上流サービスが利用不可 |
| 503 | サービス利用不可 | サービスが一時的に利用不可 |

## よくあるエラー

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">症状から素早く特定する</p>
    <div class="lurus-callout__body">「どんなエラーに遭遇したか」から出発し、項目別チェックリスト付きで調べたい場合は、<a href="/ja/guide/troubleshooting">トラブルシューティング</a>を参照してください。本ページは完全なエラーコードとリトライ戦略の権威ある参考資料です。</div>
  </div>
</div>

| `code` | `type` | message（例） | 解決方法 |
|--------|--------|------|---------|
| `invalid_api_key` | `authentication_error` | Invalid API key provided | Key が正しくコピーされているか、`sk-` で始まっているか、余分な空白がないかを確認 |
| `model_not_found` | `new_api_error` | 模型 xxx 无可用渠道 | モデル名を確認し、当該モデルにチャネルが設定済みであることを確認、管理者に権限の開通を依頼 |
| `insufficient_quota` | `billing_error` | Insufficient quota for this request | アカウント残高を確認し、管理者にチャージを依頼 |
| `rate_limit_exceeded` | `rate_limit_error` | Rate limit exceeded. Please slow down. | リクエスト頻度を下げる、指数バックオフでリトライ、レート制限の引き上げを申請 |
| `context_length_exceeded` | `invalid_request_error` | This model’s maximum context length is 8192 tokens | 入力長を減らす、より長いコンテキストのモデルに切り替える、スライディングウィンドウで履歴を切り詰める |

**model_not_found** レスポンスボディ（HTTP 404、`type: new_api_error`）：

```json
{
  "error": {
    "code": "model_not_found",
    "message": "模型 gpt-5 无可用渠道",
    "type": "new_api_error"
  }
}
```

**insufficient_quota** レスポンスボディ（HTTP 402、`type: billing_error`）：

```json
{
  "error": {
    "code": "insufficient_quota",
    "message": "Insufficient quota for this request",
    "type": "billing_error"
  }
}
```

## エラー処理のベストプラクティス

要点：認証エラー（401）はリトライせずそのまま上位へ送出。レート制限（429）は指数バックオフ（`2 ** attempt` 秒）後にリトライ。その他の API エラーは `max_retries` の上限までリトライ。

```python
from openai import OpenAI, APIError, RateLimitError, AuthenticationError
import time

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-api-key")

def chat_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(model="deepseek-chat", messages=messages)
        except AuthenticationError as e:
            print(f"Authentication failed: {e}")  # Key 问题，不重试
            raise
        except RateLimitError:
            wait_time = 2 ** attempt
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)
        except APIError as e:
            if attempt == max_retries - 1:
                raise
            print(f"API error: {e}. Retrying...")
            time.sleep(1)
    raise Exception("Max retries exceeded")
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({ baseURL: 'https://api.lurus.cn/v1', apiKey: 'sk-your-api-key' });

async function chatWithRetry(messages, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.chat.completions.create({ model: 'deepseek-chat', messages });
    } catch (error) {
      if (error.status === 401) throw error;  // 认证错误，不重试
      if (error.status === 429) {
        const wait = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited. Waiting ${wait}ms...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (attempt === maxRetries - 1) throw error;
      console.log(`Error: ${error.message}. Retrying...`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}
```

## サポートへの問い合わせ

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">問題が解決しない場合は support@lurus.cn へ</p>
    <div class="lurus-callout__body">迅速な特定のため、以下の情報をご提供ください：<ul><li>エラーメッセージの完全な内容</li><li>リクエスト ID（response header <code>X-Request-ID</code>）</li><li>発生時刻</li><li>再現手順</li></ul></div>
  </div>
</div>

---

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'Chat Completions API', link: '/ja/api/chat-completions', primary: true },
    { text: '認証', link: '/ja/api/authentication' },
    { text: 'API 概要', link: '/ja/api/overview' },
  ]"
/>

</div>
