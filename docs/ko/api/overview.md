---
title: API 개요
description: Base URL, 요청 형식, 엔드포인트 목록을 포함한 Lurus API 기본 정보.
---

<div class="api-overview-page">

<ProductHero product-id="api-ref" />

Lurus API는 OpenAI API 형식과 완전히 호환되므로, OpenAI를 지원하는 모든 SDK나 도구로 직접 호출할 수 있습니다.

<CapabilityGrid
  accent="var(--lurus-color-api-ref)"
  title="왜 Lurus API인가"
  :items="[
    { title: 'OpenAI 호환', body: '모든 엔드포인트 경로와 의미가 OpenAI와 일치하며, SDK는 base_url만 교체하면 변경 없이 그대로 사용 가능', icon: 'shuffle' },
    { title: '완전한 오류 코드', body: '모든 오류에 code + message + 권장 조치가 포함되어 자동화 처리에 용이', icon: 'alert-circle' },
    { title: '다양한 인증', body: 'Bearer Token / PAT / JWT, 스크립트부터 기업 SSO까지 전부 지원', icon: 'key' },
    { title: '모델 라우팅과 재시도', body: '모델명에 따라 업스트림 채널로 자동 라우팅하고, 실패 시 백업으로 자동 전환', icon: 'shuffle' },
  ]"
/>

## 3단계 연동 {#quickstart}

<ol class="lurus-steps">
<li>

base URL을 `https://api.lurus.cn/v1`로 지정합니다.

</li>
<li>

요청 헤더에 `Authorization: Bearer sk-your-api-key`를 담습니다([API Key 발급](/ko/guide/get-api-key)).

</li>
<li>

원하는 OpenAI SDK로 요청을 보내면 되며, 비즈니스 코드는 변경할 필요가 없습니다. 아래 [SDK 지원](#sdk-지원)을 참고하세요.

</li>
</ol>

## Base URL

```
https://api.lurus.cn/v1
```

## 인증 방식

모든 API 요청은 Header에 API Key를 담아야 합니다:

```http
Authorization: Bearer sk-your-api-key
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">인증은 API Key뿐만이 아닙니다</p>
    <div class="lurus-callout__body">Bearer Token 외에도 OIDC / OAuth2, PAT, JWT를 지원합니다. 자세한 내용은 <a href="/ko/api/authentication">인증 상세</a>를 참고하세요.</div>
  </div>
</div>

## 사용 가능한 엔드포인트

<!-- sync:endpoints:start -->
**모델 목록 조회**

<ApiEndpoint method="GET" path="/v1/models" description="모델 목록 조회" />
<ApiEndpoint method="GET" path="/v1beta/models" description="Gemini 형식 조회" />

**OpenAI 형식 (Chat)**

<ApiEndpoint method="POST" path="/v1/chat/completions" description="채팅 대화 생성" />

**OpenAI 형식 (Responses)**

<ApiEndpoint method="POST" path="/v1/responses" description="응답 생성 (OpenAI Responses API)" />
<ApiEndpoint method="POST" path="/v1/responses/compact" description="대화 압축 (OpenAI Responses API)" />

**이미지 생성**

<ApiEndpoint method="POST" path="/v1/images/generations" description="이미지 생성 (qwen-image)" />
<ApiEndpoint method="POST" path="/v1/images/edits" description="이미지 편집 (qwen-image-edit)" />

**비디오 생성**

<ApiEndpoint method="POST" path="/v1/videos" description="비디오 생성 " />
<ApiEndpoint method="GET" path="/v1/videos/{task_id}" description="비디오 작업 상태 조회 " />
<ApiEndpoint method="GET" path="/v1/videos/{task_id}/content" description="비디오 콘텐츠 조회" />
<ApiEndpoint method="POST" path="/kling/v1/videos/text2video" description="Kling 텍스트-비디오" />
<ApiEndpoint method="GET" path="/kling/v1/videos/text2video/{task_id}" description="Kling 텍스트-비디오 작업 상태 조회" />
<ApiEndpoint method="POST" path="/kling/v1/videos/image2video" description="Kling 이미지-비디오" />
<ApiEndpoint method="GET" path="/kling/v1/videos/image2video/{task_id}" description="Kling 이미지-비디오 작업 상태 조회" />
<ApiEndpoint method="POST" path="/jimeng/" description="Jimeng 비디오 생성" />
<ApiEndpoint method="POST" path="/v1/video/generations" description="비디오 생성 작업 생성" />
<ApiEndpoint method="GET" path="/v1/video/generations/{task_id}" description="비디오 생성 작업 상태 조회" />

**Claude 형식 (Messages)**

<ApiEndpoint method="POST" path="/v1/messages" description="Claude 채팅" />

**Gemini 형식**

<ApiEndpoint method="POST" path="/v1beta/models/{model}:generateContent" description="Gemini 이미지 (Nano Banana)" />
<ApiEndpoint method="POST" path="/v1/engines/{model}/embeddings" description="Gemini 임베딩 (Embeddings)" />

**OpenAI 형식 (Embeddings)**

<ApiEndpoint method="POST" path="/v1/embeddings" description="텍스트 임베딩 생성" />

**텍스트 보완 (Completions)**

<ApiEndpoint method="POST" path="/v1/completions" description="텍스트 보완 생성" />

**OpenAI 오디오 (Audio)**

<ApiEndpoint method="POST" path="/v1/audio/transcriptions" description="오디오 전사" />
<ApiEndpoint method="POST" path="/v1/audio/translations" description="오디오 번역" />
<ApiEndpoint method="POST" path="/v1/audio/speech" description="텍스트 음성 변환" />

**재정렬 (Rerank)**

<ApiEndpoint method="POST" path="/v1/rerank" description="문서 재정렬" />

**Moderations**

<ApiEndpoint method="POST" path="/v1/moderations" description="콘텐츠 검수" />

**Realtime**

<ApiEndpoint method="GET" path="/v1/realtime" description="실시간 WebSocket 연결" />
<!-- sync:endpoints:end -->

## 요청 형식

모든 요청은 JSON 형식을 사용합니다:

```http
POST /v1/chat/completions HTTP/1.1
Host: api.lurus.cn
Content-Type: application/json
Authorization: Bearer sk-your-api-key

{
  "model": "deepseek-chat",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ]
}
```

## 응답 형식

각 필드의 타입과 필수 여부는 [데이터 구조 참조 / Schema](/ko/api/schemas)를 참고하세요(OpenAPI 사양에서 자동 동기화되며, 게이트웨이 구현과 일치합니다).

### 성공 응답

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "deepseek-chat",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 12,
    "total_tokens": 22
  }
}
```

### 오류 응답

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid API key provided",
    "type": "authentication_error"
  }
}
```

## 속도 제한

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">60</span><span class="lurus-stat__label">RPM 요청/분</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">100,000</span><span class="lurus-stat__label">TPM Token/분</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">10</span><span class="lurus-stat__label">최대 동시 요청</span></div>
</div>

| 제한 유형 | 기본값 | 설명 |
|---------|--------|------|
| RPM (요청/분) | 60 | 분당 최대 요청 수 |
| TPM (Token/분) | 100,000 | 분당 최대 Token 수 |
| 동시 요청 | 10 | 최대 동시 진행 요청 수 |

제한을 초과하면 `429 Too Many Requests` 오류가 반환됩니다. 처리 방법은 [오류 처리](/ko/api/errors)를 참고하세요.

## SDK 지원

### Python (공식 OpenAI SDK)

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key="sk-your-api-key"
)
```

### Node.js

```bash
npm install openai
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: 'sk-your-api-key'
});
```

### Go

```go
import "github.com/sashabaranov/go-openai"

config := openai.DefaultConfig("sk-your-api-key")
config.BaseURL = "https://api.lurus.cn/v1"
client := openai.NewClientWithConfig(config)
```

### cURL

```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-api-key" \
  -d '{"model": "deepseek-chat", "messages": [{"role": "user", "content": "Hi"}]}'
```

## 특수 기능

<CapabilityGrid
  accent="var(--lurus-color-api-ref)"
  title="게이트웨이 강화 기능"
  :items="[
    { title: '스트리밍 응답', body: 'stream: true 설정으로 Server-Sent Events 활성화, Token 단위로 반환', icon: 'zap' },
    { title: '모델 라우팅', body: '모델명으로 해당 업스트림 채널에 자동 라우팅, 하위 구성을 신경 쓸 필요 없음', icon: 'shuffle' },
    { title: '자동 재시도', body: '요청 실패 시 백업 채널로 자동 전환(여러 개를 구성한 경우)', icon: 'repeat' },
  ]"
/>

### 스트리밍 응답

`stream: true`를 설정하여 Server-Sent Events 스트리밍 응답을 활성화합니다:

```json
{
  "model": "deepseek-chat",
  "messages": [...],
  "stream": true
}
```

완전한 스트리밍 데이터 형식과 Token 단위 처리는 [Chat Completions — 스트리밍 응답](/ko/api/chat-completions#流式响应)을 참고하세요.

### 모델 라우팅

모델명으로 해당 업스트림 채널에 자동 라우팅하므로, 하위 구성을 신경 쓸 필요가 없습니다.

### 자동 재시도

요청 실패 시 백업 채널로 자동 전환합니다(여러 개를 구성한 경우).

---

<NextSteps
  title="다음 단계"
  :steps="[
    { text: '인증 상세', link: '/ko/api/authentication', primary: true },
    { text: 'Chat Completions', link: '/ko/api/chat-completions' },
    { text: '데이터 구조 / Schema', link: '/ko/api/schemas' },
    { text: '오류 처리', link: '/ko/api/errors' },
    { text: 'API Key 발급', link: '/ko/guide/get-api-key' },
  ]"
/>

<RelatedProducts product-id="api-ref" />

</div>

<style>
.api-overview-page .lurus-stat-strip {
  margin: 1.5rem 0;
}
</style>
