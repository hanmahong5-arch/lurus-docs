---
title: 데이터 구조 / Schema 참조
description: Lurus API 요청 및 응답의 데이터 구조로, OpenAPI 규격(relay.json)에서 자동 동기화되어 생성되며 항상 게이트웨이 구현과 일치합니다.
---

<div class="api-schemas-page">

# 데이터 구조 참조

다음 요청 / 응답 데이터 구조는 newapi의 <Term t="OpenAPI">OpenAPI</Term> 규격(`relay.json`)에서 **자동 동기화되어 생성**되며, 항상 게이트웨이 구현과 일치합니다. 전체 엔드포인트 목록은 [API 개요](/ko/api/overview)를 참조하고, 호출 예시는 [Chat Completions](/ko/api/chat-completions)를 참조하세요.

::: info 업데이트 방법
이 페이지의 `<!-- sync:schemas -->` 마커 영역은 `bun run sync`가 `2b-svc-newapi/docs/openapi/relay.json`에서 다시 생성합니다. 해당 영역을 수동으로 편집하지 마세요.
:::

<!-- sync:schemas:start -->
_총 35개의 데이터 구조(OpenAPI 규격에서 자동 생성)._

<details class="lurus-faq-item">
<summary><code>AudioTranscriptionResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `text` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ChatCompletionRequest</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `model` | string | 예 | 모델 ID |
| `messages` | array&lt;Message&gt; | 예 | 대화 메시지 목록 |
| `temperature` | number | — | 샘플링 온도 |
| `top_p` | number | — | 핵 샘플링 파라미터 |
| `n` | integer | — | 생성 개수 |
| `stream` | boolean | — | 스트리밍 응답 여부 |
| `stream_options` | object | — |  |
| `stop` | string \| array&lt;string&gt; | — | 중지 시퀀스 |
| `max_tokens` | integer | — | 최대 생성 Token 수 |
| `max_completion_tokens` | integer | — | 최대 보완 Token 수 |
| `presence_penalty` | number | — |  |
| `frequency_penalty` | number | — |  |
| `logit_bias` | object | — |  |
| `user` | string | — |  |
| `tools` | array&lt;Tool&gt; | — |  |
| `tool_choice` | string (`none` / `auto` / `required`) \| object | — |  |
| `response_format` | ResponseFormat | — |  |
| `seed` | integer | — |  |
| `reasoning_effort` | string (`low` / `medium` / `high`) | — | 추론 강도 (추론을 지원하는 모델에 사용) |
| `modalities` | array&lt;string (`text` / `audio`)&gt; | — |  |
| `audio` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ChatCompletionResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created` | integer | — |  |
| `model` | string | — |  |
| `choices` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |
| `system_fingerprint` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeMessage</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `role` | string (`user` / `assistant`) | 예 |  |
| `content` | string \| array&lt;object&gt; | 예 |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeRequest</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `model` | string | 예 |  |
| `messages` | array&lt;ClaudeMessage&gt; | 예 |  |
| `system` | string \| array&lt;object&gt; | — |  |
| `cache_control` | object | — |  |
| `inference_geo` | string | — |  |
| `max_tokens` | integer | 예 |  |
| `temperature` | number | — |  |
| `top_p` | number | — |  |
| `top_k` | integer | — |  |
| `stream` | boolean | — |  |
| `stop_sequences` | array&lt;string&gt; | — |  |
| `tools` | array&lt;object&gt; | — |  |
| `tool_choice` | object | — |  |
| `thinking` | object | — |  |
| `context_management` | object | — |  |
| `output_config` | object | — |  |
| `output_format` | object | — |  |
| `container` | string \| object | — |  |
| `mcp_servers` | array&lt;object&gt; | — |  |
| `metadata` | object | — |  |
| `speed` | string (`standard` / `fast`) | — |  |
| `service_tier` | string (`auto` / `standard_only`) | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | — |  |
| `type` | string | — |  |
| `role` | string | — |  |
| `content` | array&lt;object&gt; | — |  |
| `model` | string | — |  |
| `stop_reason` | string (`end_turn` / `max_tokens` / `stop_sequence` / `tool_use`) | — |  |
| `usage` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>CompletionRequest</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `model` | string | 예 |  |
| `prompt` | string \| array&lt;string&gt; | 예 |  |
| `max_tokens` | integer | — |  |
| `temperature` | number | — |  |
| `top_p` | number | — |  |
| `n` | integer | — |  |
| `stream` | boolean | — |  |
| `stop` | string \| array&lt;string&gt; | — |  |
| `suffix` | string | — |  |
| `echo` | boolean | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>CompletionResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created` | integer | — |  |
| `model` | string | — |  |
| `choices` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>EmbeddingRequest</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `model` | string | 예 |  |
| `input` | string \| array&lt;string&gt; | 예 | 임베딩할 텍스트 |
| `encoding_format` | string (`float` / `base64`) | — |  |
| `dimensions` | integer | — | 출력 벡터 차원 |

</details>

<details class="lurus-faq-item">
<summary><code>EmbeddingResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `object` | string | — |  |
| `data` | array&lt;object&gt; | — |  |
| `model` | string | — |  |
| `usage` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>GeminiModelsResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `models` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>GeminiResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `candidates` | array&lt;object&gt; | — |  |
| `usageMetadata` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ImageResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `created` | integer | — |  |
| `data` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Message</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `role` | string (`system` / `user` / `assistant` / `tool` / `developer`) | 예 | 메시지 역할 |
| `content` | string \| array&lt;MessageContent&gt; | 예 | 메시지 내용 |
| `name` | string | — | 발신자 이름 |
| `tool_calls` | array&lt;ToolCall&gt; | — |  |
| `tool_call_id` | string | — | 도구 호출 ID(tool 역할 메시지에 사용) |
| `reasoning_content` | string | — | 추론 내용 |

</details>

<details class="lurus-faq-item">
<summary><code>MessageContent</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | string (`text` / `image_url` / `input_audio` / `file` / `video_url`) | — |  |
| `text` | string | — |  |
| `image_url` | object | — |  |
| `input_audio` | object | — |  |
| `file` | object | — |  |
| `video_url` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Model</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | — | 모델 ID |
| `object` | string | — | 객체 타입 |
| `created` | integer | — | 생성 타임스탬프 |
| `owned_by` | string | — | 모델 소유자 |

</details>

<details class="lurus-faq-item">
<summary><code>ModelsResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `object` | string | — |  |
| `data` | array&lt;Model&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ModerationRequest</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `input` | string \| array&lt;string&gt; | 예 |  |
| `model` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ModerationResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | — |  |
| `model` | string | — |  |
| `results` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>RerankRequest</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `model` | string | 예 |  |
| `query` | string | 예 | 쿼리 텍스트 |
| `documents` | array&lt;string \| object&gt; | 예 | 재정렬할 문서 목록 |
| `top_n` | integer | — | 상위 N개 결과 반환 |
| `return_documents` | boolean | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>RerankResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | — |  |
| `results` | array&lt;object&gt; | — |  |
| `meta` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponseFormat</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | string (`text` / `json_object` / `json_schema`) | — |  |
| `json_schema` | object | — | JSON Schema 정의 |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesCompactionRequest</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `model` | string | 예 |  |
| `input` | string \| array&lt;object&gt; | — | 입력 내용, 문자열 또는 메시지 배열 가능 |
| `instructions` | string | — |  |
| `previous_response_id` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesCompactionResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created_at` | integer | — |  |
| `output` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |
| `error` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesRequest</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `model` | string | 예 |  |
| `input` | string \| array&lt;object&gt; | — | 입력 내용, 문자열 또는 메시지 배열 가능 |
| `instructions` | string | — |  |
| `max_output_tokens` | integer | — |  |
| `temperature` | number | — |  |
| `top_p` | number | — |  |
| `stream` | boolean | — |  |
| `tools` | array&lt;object&gt; | — |  |
| `tool_choice` | string \| object | — |  |
| `reasoning` | object | — |  |
| `previous_response_id` | string | — |  |
| `truncation` | string (`auto` / `disabled`) | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesResponse</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created_at` | integer | — |  |
| `status` | string (`completed` / `failed` / `in_progress` / `incomplete`) | — |  |
| `model` | string | — |  |
| `output` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>SpeechRequest</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `model` | string | 예 |  |
| `input` | string | 예 | 변환할 텍스트 |
| `voice` | string (`alloy` / `echo` / `fable` / `onyx` / `nova` / `shimmer`) | 예 |  |
| `response_format` | string (`mp3` / `opus` / `aac` / `flac` / `wav` / `pcm`) | — |  |
| `speed` | number | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Tool</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | string | — |  |
| `function` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ToolCall</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | — |  |
| `type` | string | — |  |
| `function` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Usage</code></summary>

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `prompt_tokens` | integer | — | 프롬프트 Token 수 |
| `completion_tokens` | integer | — | 보완 Token 수 |
| `total_tokens` | integer | — | 총 Token 수 |
| `prompt_tokens_details` | object | — |  |
| `completion_tokens_details` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>VideoRequest</code></summary>

비디오 생성 요청

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `model` | string | — | 모델/스타일 ID |
| `prompt` | string | — | 텍스트 설명 프롬프트 |
| `image` | string | — | 이미지 입력 (URL 또는 Base64) |
| `duration` | number | — | 비디오 길이(초) |
| `width` | integer | — | 비디오 너비 |
| `height` | integer | — | 비디오 높이 |
| `fps` | integer | — | 비디오 프레임률 |
| `seed` | integer | — | 랜덤 시드 |
| `n` | integer | — | 생성 비디오 개수 |
| `response_format` | string | — | 응답 형식 |
| `user` | string | — | 사용자 식별자 |
| `metadata` | object | — | 확장 파라미터 (예: negative_prompt, style, quality_level 등) |

</details>

<details class="lurus-faq-item">
<summary><code>VideoResponse</code></summary>

비디오 생성 작업 제출 응답

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `task_id` | string | — | 작업 ID |
| `status` | string | — | 작업 상태 |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskError</code></summary>

비디오 작업 오류 정보

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `code` | integer | — | 오류 코드 |
| `message` | string | — | 오류 정보 |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskMetadata</code></summary>

비디오 작업 메타데이터

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `duration` | number | — | 실제 생성된 비디오 길이 |
| `fps` | integer | — | 실제 프레임률 |
| `width` | integer | — | 실제 너비 |
| `height` | integer | — | 실제 높이 |
| `seed` | integer | — | 사용된 랜덤 시드 |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskResponse</code></summary>

비디오 작업 상태 조회 응답

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `task_id` | string | — | 작업 ID |
| `status` | string (`queued` / `in_progress` / `completed` / `failed`) | — | 작업 상태 |
| `url` | string | — | 비디오 리소스 URL(성공 시) |
| `format` | string | — | 비디오 형식 |
| `metadata` | VideoTaskMetadata | — |  |
| `error` | VideoTaskError | — |  |

</details>
<!-- sync:schemas:end -->

<NextSteps
  title="다음 단계"
  :steps="[
    { text: 'API 개요', link: '/ko/api/overview', primary: true },
    { text: 'Chat Completions', link: '/ko/api/chat-completions' },
    { text: '통합 및 MCP 디렉터리', link: '/integrations/' },
    { text: '오류 처리', link: '/ko/api/errors' },
  ]"
/>

</div>
