---
title: "OpenAI에서 Lurus API로 마이그레이션"
description: "5분 만에 OpenAI 호출을 무감각하게 Lurus API로 전환하고, SDK 사용 방식은 그대로 유지합니다."
---

<div class="mig-openai-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="import" :size="14" /> OpenAI에서 마이그레이션</span>
  <h1 class="lurus-section-head__title">OpenAI에서 Lurus API로 마이그레이션</h1>
  <p class="lurus-section-head__lede"><code>base_url</code> 한 줄만 바꾸면 기존 OpenAI SDK 호출이 모두 연결됩니다——비즈니스 로직을 다시 작성할 필요가 없습니다.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5분</span><span class="lurus-stat__label">예상 소요 시간</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1곳</span><span class="lurus-stat__label">코드 변경</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">0회</span><span class="lurus-stat__label">재시작</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">사전 조건</p>
    <div class="lurus-callout__body"><p>이미 Lurus <Term t="API Key">API Key</Term>가 있어야 합니다（<a href="/ko/guide/get-api-key">발급 방법</a>）.</p></div>
  </div>
</div>

## <Icon name="repeat" :size="20" /> 한 곳만 수정

```diff
- from openai import OpenAI
-
- client = OpenAI(api_key="sk-openai-...")
+ from openai import OpenAI
+
+ client = OpenAI(
+     api_key="sk-lurus-...",
+     base_url="https://api.lurus.cn/v1",
+ )
```

이것이 전부입니다. 모든 `client.chat.completions.create(...)` 호출은 수정할 필요가 없습니다.

## <Icon name="layers" :size="20" /> 모델명 매핑

| OpenAI 모델 | Lurus 권장 대체 |
|-------------|----------------|
| gpt-5 | `gpt-5` (직통) 또는 `deepseek-chat` / `claude-sonnet-4` |
| gpt-4o-mini | `deepseek-chat` / `qwen-turbo` |
| gpt-4o | `claude-sonnet-4` / `gemini-3-pro` |
| o1 | `deepseek-reasoner` |
| text-embedding-3-small | `bge-m3` (로컬) / `text-embedding-3-small` |

전체 목록은 [지원 모델](/ko/guide/models)을 참고하십시오.

## <Icon name="workflow" :size="20" /> 배포 단계

<ol class="lurus-steps">
<li>

**연결 확인** — 한 번 실행하여 한국어 응답을 받을 수 있으면 성공입니다.

```python
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)
```

</li>
<li>

**점진적 트래픽 전환** — 비율에 따라 트래픽을 OpenAI에서 Lurus로 전환하며, `0.1` → `0.5` → `1.0` 순으로 점차 늘립니다.

```python
import os, random

def get_client():
    if random.random() < float(os.getenv("LURUS_TRAFFIC", "0.1")):
        return OpenAI(api_key=os.getenv("LURUS_API_KEY"),
                      base_url="https://api.lurus.cn/v1")
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

</li>
<li>

**롤백** — `base_url`을 삭제하면 OpenAI 호출로 되돌아갑니다. **재시작이 필요 없습니다**（요청 단위로 적용）.

</li>
</ol>

## <Icon name="life-buoy" :size="20" /> 자주 묻는 질문

<details class="lurus-faq-item">
<summary>모델명을 찾을 수 없나요?</summary>

[모델 카탈로그](/ko/guide/models)에서 검색하거나 Issue를 등록하십시오.

</details>

<details class="lurus-faq-item">
<summary>함수 호출 / JSON 모드를 지원하나요?</summary>

Lurus는 OpenAI 함수 호출 / JSON Schema를 전부 호환합니다.

</details>

<details class="lurus-faq-item">
<summary>조직 ID가 필요한가요?</summary>

Lurus는 `organization` 필드가 필요하지 않으며, 추가로 넣어도 오류가 나지 않습니다.

</details>

## 다음 단계

<NextSteps :steps="[
  { text: '모델 카탈로그', link: '/ko/guide/models', primary: true },
  { text: 'API 참조', link: '/ko/api/overview' },
  { text: 'Lubei 과금', link: '/ko/platform/billing' },
]" />

</div>
