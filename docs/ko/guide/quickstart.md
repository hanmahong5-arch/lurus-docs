---
title: 빠른 시작
description: 5분 안에 첫 Lurus API 호출을 완료하세요. Python, Node.js, Go, cURL을 지원합니다.
---

<div class="qs-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> 빠른 시작</span>
  <h1 class="lurus-section-head__title">5분 만에 첫 호출 완료하기</h1>
  <p class="lurus-section-head__lede">Key 발급 → 요청 전송 → 모델 전환, 세 단계로 끝.</p>
</div>

::: info 사전 조건
Lurus 계정 하나(가입하면 바로 무료 할당량 제공, 첫 단계에서 생성 안내) · Python 3.8+ / Node.js 18+ / Go 1.21+ / cURL(택일) · 기본 터미널 지식. 예상 소요 시간 5분.
:::

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> 1단계</span>
  <h2 class="lurus-section-head__title">계정 가입 —— 무료로 시작</h2>
  <p class="lurus-section-head__lede">가입하면 바로 무료 할당량을 받으며, 충전 없이도 이 튜토리얼을 완주할 수 있습니다.</p>
</div>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="coins" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">가입 즉시 사용, 결제 불필요</p>
    <div class="lurus-callout__body"><p>신규 계정은 자동으로 <strong>5 鹿贝 + 무료 할당량</strong>(Free 플랜 <strong>일 100회</strong>, <code>deepseek-chat</code>、<code>gpt-3.5-turbo</code> 포함)을 받으며, 이 튜토리얼을 완주하기에 충분합니다. 할당량과 업그레이드 상세는 <a href="/ko/guide/faq">자주 묻는 질문</a>과 <a href="/ko/platform/billing">요금 안내</a>를 참고하세요.</p></div>
  </div>
</div>

이어서 API Key를 하나 생성합니다.

<ol class="lurus-steps">
<li>

[api.lurus.cn](https://api.lurus.cn)에 접속하여 로그인 또는 가입

</li>
<li>

「**토큰 관리**」→「**새 토큰 생성**」으로 이동

</li>
<li>

생성된 Key를 복사(형식: `sk-xxxxxxxxxxxxxxxx`)

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">보안 안내</p>
    <div class="lurus-callout__body"><p>API Key는 비밀번호와 같습니다. Git에 커밋하지 <strong>마세요</strong>, 프런트엔드 코드에 작성하지 <strong>마세요</strong>. 환경 변수로 전달하는 것을 권장합니다:</p><pre><code>export LURUS_API_KEY="sk-your-key-here"</code></pre></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> 2단계</span>
  <h2 class="lurus-section-head__title">첫 요청 보내기</h2>
  <p class="lurus-section-head__lede">사용하는 언어를 골라 복사하면 바로 실행됩니다.</p>
</div>

:::tabs
== Python
```bash
pip install openai
```
```python
from openai import OpenAI
import os

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ["LURUS_API_KEY"])

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手。"},
        {"role": "user", "content": "用一句话介绍什么是人工智能。"}
    ]
)
print(response.choices[0].message.content)
# → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
```

== cURL
```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -d '{ "model": "deepseek-chat", "messages": [
      {"role": "system", "content": "你是一个有帮助的助手。"},
      {"role": "user",   "content": "用一句话介绍什么是人工智能。"} ] }'
# 响应：{ "id":"chatcmpl-abc123", "choices":[{ "message":{"role":"assistant","content":"..."}, "finish_reason":"stop" }],
#        "usage":{ "prompt_tokens":32, "completion_tokens":22, "total_tokens":54 } }
```

== Node.js
```bash
npm install openai
```
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: process.env.LURUS_API_KEY
});

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: '你是一个有帮助的助手。' },
    { role: 'user', content: '用一句话介绍什么是人工智能。' }
  ]
});

console.log(response.choices[0].message.content);
// → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
```

== Go
```bash
go get github.com/sashabaranov/go-openai
```
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
            Model: "deepseek-chat",
            Messages: []openai.ChatCompletionMessage{
                {Role: "system", Content: "你是一个有帮助的助手。"},
                {Role: "user", Content: "用一句话介绍什么是人工智能。"},
            },
        },
    )
    fmt.Println(resp.Choices[0].Message.Content)
    // → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
}
```
:::

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">모델 응답이 보이나요? 첫 호출에 성공했습니다 🎉</p>
    <div class="lurus-callout__body"><p>이번 요청은 가입 시 제공된 무료 할당량으로 처리되었으며, 한 푼도 들지 않았습니다. 다음 단계로 다른 모델을 시도해 보세요 —— 코드는 거의 손댈 필요가 없습니다.</p></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> 3단계</span>
  <h2 class="lurus-section-head__title">모델 전환</h2>
  <p class="lurus-section-head__lede"><code>model</code> 파라미터만 바꾸면 되고, 다른 코드는 전혀 수정할 필요가 없습니다. 모델을 하나 고르면 아래 스니펫이 즉시 갱신되어 복사 후 바로 실행됩니다.</p>
</div>

<ModelPicker />

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">무엇을 골라야 할지 모르겠다면?</p>
    <div class="lurus-callout__body"><p><strong>일상적 사용</strong> → <code>deepseek-chat</code>(비용 최저, 중국어 최고)<br><strong>복잡한 추론</strong> → <code>deepseek-reasoner</code><br><strong>긴 문서 처리</strong> → <code>gemini-3-pro-preview</code></p><p>전체 비교는 <a href="/guide/models">지원 모델</a>을 참고하세요.</p></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> 자주 묻는 질문</span>
  <h2 class="lurus-section-head__title">잘 안 되나요? 먼저 여기를 확인하세요</h2>
</div>

<details class="lurus-faq-item">
<summary><code>401 Unauthorized</code> 반환</summary>

```
{"error": {"code": "invalid_api_key", "type": "authentication_error"}}
```

확인 사항:

- Key가 `sk-`로 시작하는지
- 요청 헤더 형식: `Authorization: Bearer sk-xxxx`(Bearer 뒤에 공백이 있음에 유의)
- Key가 「활성화」 상태인지(콘솔에서 확인)

</details>

<details class="lurus-faq-item">
<summary><code>"no available server"</code> 반환</summary>

- `model` 이름 철자 확인(대소문자 구분)
- 해당 Key가 이 모델에 접근할 권한이 있는지 확인
- Key를 방금 생성했다면 약 10초 후 다시 시도

</details>

<details class="lurus-faq-item">
<summary>스트리밍 응답은 어떻게 켜나요?</summary>

요청 본문에 `"stream": true`를 추가하세요. 자세한 내용은 [<Term t="Streaming">스트리밍 응답</Term>](/ko/api/chat-completions#流式响应)을 참고하세요.

</details>

<NextSteps
  title="다음 단계"
  :steps="[
    { text: 'Chat Completions 전체 문서', link: '/ko/api/chat-completions', primary: true },
    { text: '지원 모델', link: '/guide/models' },
    { text: 'AI 클라이언트 설정', link: '/ko/guide/clients/cherry-studio' },
  ]"
/>

</div>
