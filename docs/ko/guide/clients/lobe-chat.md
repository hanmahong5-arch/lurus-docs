---
title: Lobe Chat 설정
description: Lobe Chat에서 Lurus API를 모델 제공자로 설정합니다.
---

<div class="lobe-page">

# Lobe Chat 설정

[Lobe Chat](https://lobehub.com)은 현대적인 오픈소스 AI 채팅 애플리케이션입니다. 이 페이지에서는 온라인 원클릭 설정과 수동 설정 두 가지 방법을 소개합니다.

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">시작하기 전에</p>
<div class="lurus-callout__body">Lurus <Term t="API Key">API Key</Term>를 준비하세요. 아직 없으신가요? <a href="/ko/guide/get-api-key">API Key 발급받기</a>로 이동하세요.</div>
</div>
</div>

## 온라인 설정

아래 링크를 클릭하면 바로 설정됩니다:

```
https://chat-preview.lobehub.com/?settings={"keyVaults":{"openai":{"apiKey":"YOUR_API_KEY","baseURL":"https://api.lurus.cn/v1"}}}
```

`YOUR_API_KEY`를 당신의 API Key로 교체하세요.

## 수동 설정

<ol class="lurus-steps">
<li>

Lobe Chat **설정**을 엽니다.

</li>
<li>

「**언어 모델**」을 선택합니다.

</li>
<li>

OpenAI 설정에 다음을 입력합니다:

- **API Key**: 당신의 Lurus API Key를 입력
- **API Proxy**: `https://api.lurus.cn/v1`

</li>
<li>

설정을 **저장**합니다.

</li>
</ol>

## 사용 팁

<div class="lurus-callout lurus-callout--tip">
<span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
<div>
<p class="lurus-callout__title">팁</p>
<div class="lurus-callout__body"><ul><li>Lobe Chat은 기본적으로 OpenAI 모델명을 사용하므로, 대화 중에 수동으로 전환해야 합니다</li><li>최고의 가성비를 위해 <code>deepseek-chat</code> 사용을 권장합니다</li></ul></div>
</div>
</div>

<NextSteps title="다음 단계" :steps="[
  { text: '지원되는 모델 둘러보기', link: '/guide/models' },
  { text: 'API Key 발급받기', link: '/ko/guide/get-api-key' },
  { text: 'API 빠른 시작 보기', link: '/ko/guide/quickstart' }
]" />

</div>

<style scoped>
.lobe-page .lurus-steps { margin-top: 1rem; }
</style>
