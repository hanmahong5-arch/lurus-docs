---
title: Chat Completions API
description: Lurus Chat Completions API 레퍼런스, OpenAI 인터페이스 형식과 완전히 호환됩니다.
---

<div class="api-chat-page">

# Chat Completions API

가장 많이 사용되는 대화 API로, OpenAI Chat Completions 인터페이스와 완전히 호환됩니다.

<ApiEndpoint method="POST" path="/v1/chat/completions" description="채팅 대화 생성" />

```
POST https://api.lurus.cn/v1/chat/completions
```

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="#스트리밍-응답">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">스트리밍 응답</div>
    <p class="lurus-card__body">SSE로 토큰 단위 반환</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#function-calling">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Function Calling</div>
    <p class="lurus-card__body">모델이 당신의 함수를 호출하도록</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#멀티모달-입력-vision">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">멀티모달 Vision</div>
    <p class="lurus-card__body">텍스트와 이미지를 혼합 입력</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#모범-사례">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">모범 사례</div>
    <p class="lurus-card__body">Temperature / System Prompt / 멀티턴</p>
  </a>
</div>

---

## 요청 파라미터

### 필수

| 파라미터 | 타입 | 설명 |
|------|------|------|
| `model` | string | 모델 이름, 예: `deepseek-chat`, `gpt-4o` |
| `messages` | array | 대화 메시지 배열, 아래 형식 참고 |

### 자주 쓰는 선택 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `temperature` | number | 1.0 | 무작위성(0–2). 코드/수학은 0.1, 창의적 글쓰기는 0.9 |
| `max_tokens` | integer | — | 최대 생성 토큰 수. 설정하지 않으면 모델이 결정 |
| `stream` | boolean | false | <Term t="Streaming">스트리밍 출력</Term>(SSE), [스트리밍 응답](#스트리밍-응답) 참고 |
| `top_p` | number | 1.0 | 뉴클리어스 샘플링, 일반적으로 temperature와 둘 중 하나만 조정 |
| `stop` | string/array | — | 이 문자열을 만나면 생성 중단 |
| `n` | integer | 1 | 동시에 생성할 후보 응답 개수 |
| `user` | string | — | 사용자 식별자, 감사 로그에 사용 |

### Messages 형식

```json
[
  {"role": "system",    "content": "你是一位专业的技术顾问。"},
  {"role": "user",      "content": "什么是 RESTful API？"},
  {"role": "assistant", "content": "RESTful API 是…"},
  {"role": "user",      "content": "能举个例子吗？"}
]
```

| 역할 | 용도 |
|------|------|
| `system` | AI의 행동, 어조, 제약을 설정. 배열의 첫 번째에 둠 |
| `user` | 사용자의 입력 |
| `assistant` | AI의 응답. 멀티턴 대화 시 이전 응답을 포함해야 함 |

요청 본문(`ChatCompletionRequest`)과 메시지(`Message`)의 전체 필드 정의는 [데이터 구조 레퍼런스](/ko/api/schemas)를 참고하세요.

---

## 기본 예제

:::tabs
== Python
```python
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-key")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
        {"role": "user",   "content": "什么是 RESTful API？"}
    ],
    temperature=0.3,
    max_tokens=200
)

print(response.choices[0].message.content)
print(f"Token 用量：{response.usage.total_tokens}")  # usage.total_tokens
```

== cURL
```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "system", "content": "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
      {"role": "user",   "content": "什么是 RESTful API？"}
    ],
    "temperature": 0.3
  }'
```

== Node.js
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: process.env.LURUS_API_KEY
});

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: '你是一位专业的技术顾问，回复简洁，不超过 100 字。' },
    { role: 'user',   content: '什么是 RESTful API？' }
  ],
  temperature: 0.3,
  max_tokens: 200
});

console.log(response.choices[0].message.content);
console.log(`Token 用量：${response.usage.total_tokens}`);
```

== Go
```go
package main

import (
    "context"
    "fmt"
    "os"
    openai "github.com/sashabaranov/go-openai"
)

func main() {
    cfg := openai.DefaultConfig(os.Getenv("LURUS_API_KEY"))
    cfg.BaseURL = "https://api.lurus.cn/v1"
    client := openai.NewClientWithConfig(cfg)

    resp, _ := client.CreateChatCompletion(context.Background(),
        openai.ChatCompletionRequest{
            Model:       "deepseek-chat",
            Temperature: 0.3,
            Messages: []openai.ChatCompletionMessage{
                {Role: "system", Content: "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
                {Role: "user", Content: "什么是 RESTful API？"},
            },
        },
    )
    fmt.Println(resp.Choices[0].Message.Content)
    fmt.Printf("Token 用量：%d\n", resp.Usage.TotalTokens)
}
```
:::

---

## 스트리밍 응답

`stream: true`로 설정하면 응답이 Server-Sent Events를 통해 토큰 단위로 반환되어 채팅류 애플리케이션에 적합합니다.

:::tabs
== Python
```python
stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "写一首关于秋天的四行诗"}],
    stream=True
)

for chunk in stream:
    delta = chunk.choices[0].delta
    if delta.content:
        print(delta.content, end="", flush=True)
print()  # 换行
```

== Node.js
```javascript
const stream = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: '写一首关于秋天的四行诗' }],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}
```
:::

### 스트리밍 데이터 형식

```
data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"落"},"index":0}]}
data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"叶"},"index":0}]}
...
data: [DONE]
```

::: tip
마지막 `data: [DONE]`은 스트림의 종료를 의미하며, 이때 `delta.content`는 비어 있습니다.
:::

---

## Function Calling

AI가 당신이 제공한 함수를 언제 호출할지 결정하도록 하고, 구조화된 파라미터(<Term t="Tool Call">Tool Call</Term>)를 반환합니다. 검색, 데이터베이스 조회, 외부 API 호출 등의 시나리오에 적합합니다.

### 작동 흐름

<ArchitectureDiagram
  title="Function Calling 호출 흐름"
  chart="graph LR; A[당신의 요청<br/>tools 정의 포함] --> B[모델 반환<br/>finish_reason: tool_calls]; B --> C[당신이 함수 실행<br/>결과를 role: tool로 전달]; C --> D[모델이 결과를 종합하여<br/>최종 답변 생성]"
/>

### 전체 예제: 날씨 조회

:::tabs
== Python
```python
import json
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-key")

# 定义可调用的函数
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的当前天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称，如"北京"、"上海""
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "温度单位"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

# 第一轮：AI 决定调用哪个函数
messages = [{"role": "user", "content": "北京今天天气怎么样？"}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

msg = response.choices[0].message

# AI 返回了 tool_calls，说明它想调用函数
if msg.tool_calls:
    tool_call = msg.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    print(f"AI 想调用：{tool_call.function.name}({args})")
    # → AI 想调用：get_weather({'city': '北京', 'unit': 'celsius'})

    # 执行你自己的函数（这里模拟返回数据）
    weather_result = {"city": "北京", "temperature": 8, "condition": "晴，有北风"}

    # 第二轮：把函数结果传回给 AI
    messages.append(msg)  # 保留 AI 的 tool_calls 消息
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(weather_result, ensure_ascii=False)
    })

    final = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        tools=tools
    )
    print(final.choices[0].message.content)
    # → 北京今天天气晴，气温 8°C，有北风，出门建议穿厚外套。
```
:::

::: warning 모델 지원
Function Calling은 모델의 지원이 필요합니다. `gpt-4o`, `gpt-4o-mini`, `claude-3-5-sonnet` 사용을 권장합니다.
DeepSeek 계열도 지원하지만 파라미터 형식에 미세한 차이가 있으므로 테스트 시 검증에 주의하세요.
:::

---

## 멀티모달 입력(Vision)

일부 모델은 이미지 내용을 이해할 수 있으며, `content`에 텍스트와 이미지를 혼합하여 입력합니다.

:::tabs
== URL 이미지
```json
{
  "model": "gpt-4o",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "这张图里有什么？"},
      {"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}}
    ]
  }]
}
```

== Base64 이미지
```json
{
  "model": "gpt-4o",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "识别图中的文字"},
      {"type": "image_url", "image_url": {
        "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      }}
    ]
  }]
}
```
:::

::: info Vision을 지원하는 모델
`gpt-4o`, `gpt-4o-mini`, `gemini-3-pro-preview`, `gemini-3-pro-image-preview`

이미지 크기 제한: URL 이미지는 공인망에서 접근 가능해야 함; Base64는 장당 5 MB를 넘지 않을 것을 권장.
:::

---

## 모범 사례

### System Prompt 작성법

```json
{
  "role": "system",
  "content": "你是一位专业客服。请用友好简洁的语气回答，每条回复不超过 150 字。如遇无法回答的问题，引导用户联系 support@lurus.cn。"
}
```

**좋은 System Prompt에는: 역할 정의 + 어조 요구 + 길이 제한 + 경계 처리가 포함됩니다.**

### Temperature 설정 참고

| 시나리오 | temperature | 설명 |
|------|-------------|------|
| 코드 생성, 수학 계산 | 0.0–0.2 | 결정성이 높고 무작위성 감소 |
| 질의응답, 요약, 분류 | 0.3–0.6 | 정확하면서도 어느 정도 유연성 있음 |
| 창의적 글쓰기, 브레인스토밍 | 0.7–1.0 | 다양성이 강함 |
| 무작위 스토리, 롤플레잉 | 1.0–1.5 | 높은 창의성, 불안정할 수 있음 |

### 멀티턴 대화 관리

```python
conversation = [
    {"role": "system", "content": "你是一位历史老师。"}
]

def chat(user_input: str) -> str:
    conversation.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=conversation,
        max_tokens=500
    )
    reply = response.choices[0].message.content
    conversation.append({"role": "assistant", "content": reply})
    return reply

print(chat("秦始皇是谁？"))
print(chat("他有哪些重要成就？"))  # 模型能记住上文的"秦始皇"
```

::: tip 컨텍스트 윈도우 관리
각 모델의 컨텍스트 길이는 제한적입니다(예: `deepseek-chat`은 64K tokens). 대화가 너무 길어지면 다음을 할 수 있습니다:
1. 가장 오래된 메시지를 잘라냄(system + 최근 N턴 유지)
2. 정기적으로 이전 대화를 요약하여 토큰 사용량 압축
:::

---

## 오류 처리

자주 발생하는 상태 코드: `400` 요청 형식 오류 → JSON 구조와 필수 파라미터 확인; `401` Key 무효/만료; `403` 이 모델에 접근 권한 없음 → 관리자에게 문의; `429` 속도 제한 초과 → 지수 백오프 재시도; `500/502` 업스트림 모델 이상 → 재시도하거나 대체 모델로 전환. 전체 오류 코드와 재시도 전략은 [오류 처리](/ko/api/errors)를 참고하세요.

---

<NextSteps
  title="다음 단계"
  :steps="[
    { text: '오류 처리', link: '/ko/api/errors', primary: true },
    { text: '데이터 구조 / Schema', link: '/ko/api/schemas' },
    { text: '인증', link: '/ko/api/authentication' },
    { text: 'API 개요', link: '/ko/api/overview' },
    { text: '지원하는 모델', link: '/guide/models' },
  ]"
/>

</div>

<style>
.api-chat-page .lurus-card__body code {
  font-size: 0.85em;
}
</style>
