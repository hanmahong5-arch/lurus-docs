---
title: 오류 처리
description: Lurus API 오류 응답 형식, HTTP 상태 코드 및 일반적인 오류의 처리 방법.
---

<div class="api-errors-page">

# 오류 처리

모든 오류 응답은 통일된 구조를 따르며, 각 오류 코드에는 `code` + `message` + 권장 조치가 함께 제공되어 자동화 처리가 용이합니다.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="repeat" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">재시도 황금 법칙</p>
    <p class="lurus-callout__body">인증 오류(401)는 <strong>재시도하지 않고</strong> 그대로 상위로 전달하며, 속도 제한(429)은 <code>2 ** attempt</code>초의 <strong>지수 백오프</strong> 후 재시도하고, 그 외 API 오류는 <code>max_retries</code> 한도까지 재시도합니다.</p>
  </div>
</div>

## 오류 응답 형식

모든 오류 응답은 통일된 형식을 따릅니다:

```json
{ "error": { "code": "error_code", "message": "Human readable error message", "type": "error_type", "param": "optional_parameter_name" } }
```

## HTTP 상태 코드

| 상태 코드 | 의미 | 설명 |
|--------|------|------|
| 200 | 성공 | 요청이 성공적으로 처리됨 |
| 400 | 요청 오류 | 매개변수 오류 또는 형식이 올바르지 않음 |
| 401 | 인증 안 됨 | API Key가 유효하지 않거나 누락됨 |
| 403 | 접근 금지 | 해당 리소스에 접근할 권한이 없음 |
| 404 | 찾을 수 없음 | 요청한 리소스가 존재하지 않음 |
| 429 | 요청 과다 | 속도 제한을 초과함 |
| 500 | 서버 오류 | 서버 내부 오류 |
| 502 | 게이트웨이 오류 | 업스트림 서비스를 사용할 수 없음 |
| 503 | 서비스 사용 불가 | 서비스를 일시적으로 사용할 수 없음 |

## 일반적인 오류

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">증상별 빠른 진단</p>
    <div class="lurus-callout__body">"어떤 오류가 발생했는가"에서 출발하여 항목별 체크리스트를 보려면 <a href="/ko/guide/troubleshooting">문제 해결</a>을 참고하세요. 이 페이지는 전체 오류 코드와 재시도 전략에 대한 권위 있는 참고 자료입니다.</div>
  </div>
</div>

| `code` | `type` | message(예시) | 해결 방법 |
|--------|--------|------|---------|
| `invalid_api_key` | `authentication_error` | Invalid API key provided | Key가 올바르게 복사되었는지, `sk-`로 시작하는지, 불필요한 공백이 없는지 확인하세요 |
| `model_not_found` | `new_api_error` | 모델 xxx 사용 가능한 채널 없음 | 모델 이름을 확인하고, 해당 모델에 채널이 구성되어 있는지 확인하며, 관리자에게 권한 활성화를 요청하세요 |
| `insufficient_quota` | `billing_error` | Insufficient quota for this request | 계정 잔액을 확인하고 관리자에게 충전을 요청하세요 |
| `rate_limit_exceeded` | `rate_limit_error` | Rate limit exceeded. Please slow down. | 요청 빈도를 줄이고, 지수 백오프로 재시도하며, 속도 제한 상향을 신청하세요 |
| `context_length_exceeded` | `invalid_request_error` | This model’s maximum context length is 8192 tokens | 입력 길이를 줄이고, 더 긴 컨텍스트 모델로 전환하며, 슬라이딩 윈도우로 히스토리를 자르세요 |

**model_not_found** 응답 본문(HTTP 404, `type: new_api_error`):

```json
{
  "error": {
    "code": "model_not_found",
    "message": "模型 gpt-5 无可用渠道",
    "type": "new_api_error"
  }
}
```

**insufficient_quota** 응답 본문(HTTP 402, `type: billing_error`):

```json
{
  "error": {
    "code": "insufficient_quota",
    "message": "Insufficient quota for this request",
    "type": "billing_error"
  }
}
```

## 오류 처리 모범 사례

핵심: 인증 오류(401)는 재시도하지 않고 그대로 상위로 전달하고, 속도 제한(429)은 지수 백오프(`2 ** attempt`초) 후 재시도하며, 그 외 API 오류는 `max_retries` 한도까지 재시도합니다.

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

## 지원 문의

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">문제가 계속되나요? support@lurus.cn으로 문의하세요</p>
    <div class="lurus-callout__body">빠른 진단을 위해 다음 정보를 제공해 주세요:<ul><li>오류 메시지 전체 내용</li><li>요청 ID(response header <code>X-Request-ID</code>)</li><li>발생 시각</li><li>재현 단계</li></ul></div>
  </div>
</div>

---

<NextSteps
  title="다음 단계"
  :steps="[
    { text: 'Chat Completions API', link: '/ko/api/chat-completions', primary: true },
    { text: '인증', link: '/ko/api/authentication' },
    { text: 'API 개요', link: '/ko/api/overview' },
  ]"
/>

</div>
