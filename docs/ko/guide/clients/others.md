---
title: 기타 클라이언트
description: OpenAI API와 호환되는 다른 클라이언트에서 Lurus API를 설정합니다.
---

<div class="others-page">

# 기타 클라이언트

OpenAI API를 지원하는 모든 클라이언트에서 Lurus API를 사용할 수 있습니다. 아래에서 공통 설정 파라미터, 자주 쓰는 클라이언트 목록, 바로 복사해 쓸 수 있는 설정 예시를 제공합니다.

## 공통 설정

다음 두 가지만 클라이언트의 OpenAI 호환 설정에 입력하면 됩니다.

| 설정 항목 | 값 |
|--------|-----|
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | `sk-your-api-key` |

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">아직 Key가 없으신가요?</p>
<div class="lurus-callout__body"><a href="/ko/guide/get-api-key">API Key 발급</a> 페이지로 이동하세요. 모델 이름은 <a href="/guide/models">지원 모델</a>에서 확인할 수 있습니다.</div>
</div>
</div>

## 지원 클라이언트

<div class="lurus-h3">데스크톱 앱</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/ko/guide/clients/cherry-studio">
<span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
<div class="lurus-card__title">Cherry Studio</div>
<p class="lurus-card__body">크로스 플랫폼, 풍부한 기능</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">ChatBox</div>
<p class="lurus-card__body">간결하고 사용하기 쉬움</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">BetterChatGPT</div>
<p class="lurus-card__body">오픈 소스, 무료</p>
</div>
</div>

<div class="lurus-h3">모바일 앱</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/ko/guide/clients/opencat">
<span class="lurus-card__icon"><Icon name="smartphone" :size="20" /></span>
<div class="lurus-card__title">OpenCat</div>
<p class="lurus-card__body">iOS / macOS</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="smartphone" :size="20" /></span>
<div class="lurus-card__title">ChatGPT Next Web</div>
<p class="lurus-card__body">PWA</p>
</div>
</div>

<div class="lurus-h3">웹 앱</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/ko/guide/clients/lobe-chat">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">Lobe Chat</div>
<p class="lurus-card__body">현대적인 오픈 소스 채팅 UI</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">ChatGPT Web</div>
<p class="lurus-card__body">브라우저 기반</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="server" :size="20" /></span>
<div class="lurus-card__title">Open WebUI</div>
<p class="lurus-card__body">셀프 호스팅</p>
</div>
</div>

<div class="lurus-h3">IDE 플러그인</div>

<div class="lurus-cards lurus-cards--compact">
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Continue</div>
<p class="lurus-card__body">VS Code</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Codeium</div>
<p class="lurus-card__body">IDE 자동 완성</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Cursor</div>
<p class="lurus-card__body">AI 에디터</p>
</div>
</div>

<div class="lurus-h3">커맨드라인 도구</div>

<div class="lurus-cards lurus-cards--compact">
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">llm-cli</div>
<p class="lurus-card__body">터미널 호출</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">aichat</div>
<p class="lurus-card__body">터미널 호출</p>
</div>
</div>

## 설정 예시

### Cursor

<ol class="lurus-steps">
<li>

**설정 → OpenAI API**를 엽니다.

</li>
<li>

**API Key**: Lurus Key를 입력합니다.

</li>
<li>

**Base URL**: `https://api.lurus.cn/v1`.

</li>
</ol>

### Continue (VS Code)

`~/.continue/config.json`을 편집합니다.

```json
{
  "models": [
    {
      "title": "Lurus DeepSeek",
      "provider": "openai",
      "model": "deepseek-chat",
      "apiBase": "https://api.lurus.cn/v1",
      "apiKey": "sk-your-api-key"
    }
  ]
}
```

## 지원하지 않는 기능

일부 클라이언트 고유 기능은 완전히 호환되지 않을 수 있습니다.

<div class="lurus-callout lurus-callout--warn">
<span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
<div>
<p class="lurus-callout__title">호환성 안내</p>
<div class="lurus-callout__body"><ul><li>실시간 음성 대화</li><li>이미지 편집</li><li>특정 공급사의 전용 API</li></ul><p>문제가 있으면 기술 지원에 문의하세요.</p></div>
</div>
</div>

<NextSteps title="다음 단계" :steps="[
  { text: '지원 모델 둘러보기', link: '/guide/models' },
  { text: 'API Key 발급', link: '/ko/guide/get-api-key' },
  { text: 'API 빠른 시작 보기', link: '/ko/guide/quickstart' }
]" />

</div>

<style scoped>
.others-page .lurus-h3 { margin-top: 1.6rem; }
.others-page .lurus-steps { margin-top: 1rem; }
</style>
