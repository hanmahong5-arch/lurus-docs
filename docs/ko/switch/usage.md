---
title: Switch 사용 설명서
description: 빠른 연동과 고급 기능을 포함한 Switch 데스크톱 앱의 일상 사용 가이드입니다.
---

<div class="switch-page">

# Switch 사용 설명서 <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> 시작하기</span>
  <h2 class="lurus-section-head__title">임의의 OpenAI 클라이언트를 Switch에 연결하기</h2>
  <p class="lurus-section-head__lede">Switch는 실행 후 로컬에 OpenAI API 호환 엔드포인트를 노출하며, <code>base_url</code> 한 줄만 바꾸면 모든 요청이 자동으로 Switch를 통해 라우팅됩니다.</p>
</div>

## 빠른 연동

Switch는 실행 후 로컬에 OpenAI API 호환 엔드포인트 `http://localhost:19090/v1`을 노출합니다(Switch gateway 기본 포트 19090). 애플리케이션/SDK의 `base_url`을 이 주소로 변경하면 모든 요청이 자동으로 Switch를 통해 라우팅됩니다. `api_key`에는 임의의 값(예: `switch`)을 넣으면 되며, Switch는 설정에 있는 provider key를 사용합니다.

<ol class="lurus-steps">

<li>

클라이언트의 `base_url`을 로컬 Switch 엔드포인트로 지정하고, `api_key`에는 임의의 값(예: `switch`)을 넣은 뒤 평소처럼 요청을 보냅니다:

::: code-group

```bash [cURL]
curl http://localhost:19090/v1/chat/completions \
  -H "Content-Type: application/json" -H "Authorization: Bearer switch" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}]}'
```

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:19090/v1",
    api_key="switch",
)
resp = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)
print(resp.choices[0].message.content)
```

```javascript [Node.js]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:19090/v1",
  apiKey: "switch",
});
const resp = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }],
});
console.log(resp.choices[0].message.content);
```

:::

</li>

<li>

OpenAI SDK(Python / Node.js)는 `base_url`/`baseURL`과 `api_key`만 바꾸면 나머지 호출은 평소대로 사용합니다 — Switch가 설정에 있는 provider key로 실제 라우팅을 수행하므로, 클라이언트는 하위 제공자를 인식할 필요가 없습니다.

</li>

</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">api_key에 임의의 값을 넣어도 되는 이유</p>
    <div class="lurus-callout__body">Switch는 로컬 프록시로서 설정에 저장된 실제 provider key를 사용해 하위 제공자를 호출합니다. 클라이언트 측의 <code>api_key</code>는 자리표시자로만 쓰이므로 <code>switch</code>를 넣으면 됩니다.</div>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> 통합</span>
  <h2 class="lurus-section-head__title">AI 코딩 도구에서 사용하기</h2>
  <p class="lurus-section-head__lede">모든 도구의 API Base / 인터페이스 주소에는 <code>http://localhost:19090/v1</code>을, API Key에는 <code>switch</code>를 입력합니다.</p>
</div>

## AI 코딩 도구에서 사용하기

모든 도구의 API Base / 인터페이스 주소에는 `http://localhost:19090/v1`을, API Key에는 `switch`를 입력합니다:

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="code" :size="22" /></span>
    <div class="lurus-card__title">Cursor</div>
    <p class="lurus-card__body">설정(<code>Ctrl+,</code>) → 「AI」 검색 → 「OpenAI API Base」를 이 주소로 변경 → 저장하면, 자동 완성과 대화가 자동으로 Switch를 거칩니다.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="terminal" :size="22" /></span>
    <div class="lurus-card__title">Continue（VS Code）</div>
    <p class="lurus-card__body"><code>~/.continue/config.json</code>을 편집하여 각 model 항목에 <code>"provider": "openai"</code>, <code>"apiBase": "http://localhost:19090/v1"</code>, <code>"apiKey": "switch"</code>를 설정하고, <code>"model"</code>에는 <code>deepseek-chat</code> / <code>gpt-4o</code> 등을 입력합니다.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="22" /></span>
    <div class="lurus-card__title">Cherry Studio</div>
    <p class="lurus-card__body">설정 → API 설정 → 「사용자 정의 OpenAI 호환」 선택 → 주소와 Key 입력 → 「연결 테스트」.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="bot" :size="22" /></span>
    <div class="lurus-card__title">Lobe Chat</div>
    <p class="lurus-card__body">설정 → 언어 모델 → OpenAI → API Key와 인터페이스 주소 입력.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> 런타임</span>
  <h2 class="lurus-section-head__title">모니터링, 전환 및 스트리밍</h2>
</div>

## 요청 모니터링

「**로그**」 탭에서 실시간 요청 로그를 확인할 수 있으며, 필드는 다음과 같습니다: 시간(타임스탬프), 모델, 제공자(실제 라우팅 대상), 소요 시간(ms), Token(prompt/completion), 상태(200 / 4xx-5xx). 「CSV 내보내기」로 최근 7일 기록을 내보내 비용 통계에 활용할 수 있습니다.

## 제공자 원클릭 전환

메뉴 막대 아이콘(macOS) / 시스템 트레이(Windows)를 클릭하면 다음을 할 수 있습니다: 「현재 활성 제공자」 전환, 특정 제공자 임시 비활성화(디버깅), 오늘 사용량 개요 확인.

## 스트리밍 응답

SSE 스트리밍 응답을 완전히 지원하며 하위로 그대로 전달합니다: `chat.completions.create(..., stream=True)` 이후 `chunk.choices[0].delta.content`를 반복 처리하면 됩니다.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> 고급</span>
  <h2 class="lurus-section-head__title">로드 밸런싱</h2>
  <p class="lurus-section-head__lede">동일 모델에 여러 제공자를 구성하면 라운드 로빈 또는 가중치 기반으로 분배할 수 있습니다.</p>
</div>

## 고급: 로드 밸런싱

동일 모델에 여러 제공자를 구성하면 라운드 로빈 또는 가중치 기반으로 분배할 수 있습니다:

```json
{
  "routing": {
    "rules": [
      {
        "pattern": "deepseek-chat",
        "providers": [
          { "name": "Lurus API", "weight": 70 },
          { "name": "DeepSeek Official", "weight": 30 }
        ],
        "strategy": "weighted_random"
      }
    ]
  }
}
```

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> 문제 해결</span>
  <h2 class="lurus-section-head__title">문제 해결</h2>
  <p class="lurus-section-head__lede">해당 증상을 펼쳐 처리 단계를 확인하세요.</p>
</div>

## 문제 해결

<details class="lurus-faq-item">
<summary>"connection refused" — 연결이 거부됨</summary>

Switch가 실행되지 않았거나 포트가 잘못되었습니다. 프로세스와 포트를 확인하세요:

- 프로세스: Windows `tasklist | findstr LurusSwitch` / macOS·Linux `ps aux | grep lurus-switch`
- 포트: `curl http://localhost:19090/v1/models`

</details>

<details class="lurus-faq-item">
<summary>401 / 403 — 인증 실패</summary>

제공자 API Key 설정이 잘못되었습니다. 설정 화면에서 다시 입력하고 「테스트」를 클릭해 연결 상태를 확인하세요.

</details>

<details class="lurus-faq-item">
<summary>지연 시간이 비정상적으로 높음</summary>

1. 로그에서 라우팅이 올바른 제공자에 적중했는지 확인하세요.
2. 해외 제공자(OpenAI / Anthropic)의 높은 지연은 정상입니다(300-1500ms).
3. Lurus API 국내 노드로 변경하세요(일반적으로 &lt; 200ms).

</details>

<details class="lurus-faq-item">
<summary>macOS 앱 응답 없음</summary>

메뉴 막대에서 우클릭 후 「종료」하고 다시 시작하거나, 터미널에서 실행하세요:

```bash
pkill -f LurusSwitch && open -a "Lurus Switch"
```

</details>

## 다음 단계

<NextSteps :steps="[
  { text: 'MCP 서버 관리', link: '/ko/switch/mcp-servers', primary: true },
  { text: '비용 모니터링', link: '/ko/switch/cost-monitoring' },
  { text: '팀 설정 동기화', link: '/ko/switch/team-config' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
