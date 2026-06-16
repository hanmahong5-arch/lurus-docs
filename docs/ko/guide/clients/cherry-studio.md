---
title: Cherry Studio 설정
description: Cherry Studio에서 Lurus API를 설정하여 50개 이상의 AI 모델을 한 번에 연동합니다.
---

<div class="cherry-page">

# Cherry Studio 설정

[Cherry Studio](https://cherry-ai.com)는 다양한 모델 공급자를 지원하는 우수한 크로스 플랫폼 AI 클라이언트입니다. 이 페이지에서는 몇 분 만에 Lurus API를 연동하는 방법을 안내합니다.

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">시작하기 전에</p>
<div class="lurus-callout__body">Lurus <Term t="API Key">API Key</Term>(형식 <code>sk-xxx</code>) 하나를 준비하세요. 아직 없으신가요? <a href="/ko/guide/get-api-key">API Key 발급받기</a>로 이동하세요.</div>
</div>
</div>

## 설정 단계

<ol class="lurus-steps">
<li>

Cherry Studio **설정**을 엽니다.

</li>
<li>

「**API 공급자**」를 선택합니다.

</li>
<li>

「**사용자 지정 공급자 추가**」를 클릭합니다.

</li>
<li>

다음 정보를 입력합니다:

| 필드 | 값 |
|------|-----|
| 이름 | Lurus API |
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | 본인의 API Key (`sk-xxx`) |

</li>
<li>

설정을 **저장**합니다.

</li>
</ol>

## 빠른 설정 링크

아래 링크를 클릭하면 설정을 빠르게 가져올 수 있습니다:

```
cherrystudio://providers/api-keys?v=1&data={cherryConfig}
```

`{cherryConfig}`를 본인의 설정 정보로 교체하세요.

## 모델 선택

설정이 완료되면 Cherry Studio에서 공급자로 **Lurus API**를 선택하여 지원되는 모든 모델을 사용할 수 있습니다. 전체 목록은 [지원 모델](/guide/models)을 참고하세요.

## 자주 묻는 질문

<details class="lurus-faq-item">
<summary>연결에 실패하나요?</summary>

- API Key가 올바른지 확인하세요
- 네트워크 연결이 정상인지 확인하세요
- Base URL이 올바른지 확인하세요(`https://api.lurus.cn/v1`)

</details>

<details class="lurus-faq-item">
<summary>모델 목록이 비어 있나요?</summary>

설정에서 모델 목록을 수동으로 새로 고치거나, `deepseek-chat`처럼 모델 이름을 직접 입력해 보세요.

</details>

<NextSteps title="다음 단계" :steps="[
  { text: '지원 모델 둘러보기', link: '/guide/models' },
  { text: 'API Key 발급받기', link: '/ko/guide/get-api-key' },
  { text: 'API 빠른 시작 보기', link: '/ko/guide/quickstart' }
]" />

</div>

<style scoped>
.cherry-page .lurus-steps { margin-top: 1rem; }
</style>
