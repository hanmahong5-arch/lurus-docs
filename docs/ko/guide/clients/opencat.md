---
title: OpenCat 설정
description: OpenCat iOS/macOS 클라이언트에서 Lurus API를 설정합니다.
---

<div class="opencat-page">

# OpenCat 설정

[OpenCat](https://opencat.app)은 iOS / macOS 네이티브 AI 채팅 앱으로, 깔끔한 인터페이스와 사용자 지정 API를 지원합니다. 이 페이지에서는 URL Scheme 원클릭 설정과 수동 설정 두 가지 방법을 안내합니다.

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">시작하기 전에</p>
<div class="lurus-callout__body">Lurus <Term t="API Key">API Key</Term>(형식 <code>sk-xxxxxxxxxxxxxxxx</code>)를 준비하세요. 아직 없으신가요? <a href="/ko/guide/get-api-key">API Key 받기</a>로 이동하세요.</div>
</div>
</div>

## 빠른 설정 (URL Scheme)

브라우저나 메모 앱에서 아래 링크를 클릭하면 OpenCat으로 한 번에 이동하여 설정이 자동으로 입력됩니다:

```
opencat://team/join?domain=https://api.lurus.cn&token=YOUR_API_KEY
```

`YOUR_API_KEY`를 본인의 Key(`sk-xxxxxxxxxxxxxxxx`)로 바꾼 뒤 Safari에서 열면 됩니다.

<div class="lurus-callout lurus-callout--tip">
<span class="lurus-callout__icon"><Icon name="smartphone" :size="18" /></span>
<div>
<p class="lurus-callout__title">iOS 단축어 (권장)</p>
<div class="lurus-callout__body">iOS 단축어 앱에서 「URL 열기」 동작을 새로 만들고, 위 주소를 붙여넣어 본인의 Key를 입력한 뒤 홈 화면에 저장하세요. 다음에 기기를 바꿔도 한 번에 설정을 완료할 수 있습니다.</div>
</div>
</div>

---

## 수동 설정

URL Scheme이 동작하지 않는 경우(구버전 OpenCat은 미지원), 수동으로 설정하세요:

<ol class="lurus-steps">
<li>

OpenCat 열기 → **설정**(우측 상단 프로필) → **API 설정**.

</li>
<li>

「**사용자 지정 API**」를 선택하고 다음을 입력하세요:

- **API Host**：`https://api.lurus.cn`
- **API Key**：본인의 Key(`sk-xxxxxxxxxxxxxxxx`)

</li>
<li>

「**연결 확인**」을 클릭하고, 성공 안내가 표시되면 저장하세요.

</li>
</ol>

---

## 모델 선택

OpenCat은 모델 목록을 자동으로 가져오지 않으므로 모델 이름을 직접 입력해야 합니다. 자주 쓰는 모델:

| 모델 이름 | 특징 |
|---------|------|
| `deepseek-chat` | 가성비 우수, 중국어 최고 |
| `deepseek-reasoner` | 수학, 코드 추론 |
| `gpt-4o` | 종합 능력 최강 |
| `claude-3-5-sonnet` | 긴 텍스트, 창의적 글쓰기 |
| `gemini-3-pro-preview` | 멀티모달, 1M 컨텍스트 |

전체 목록은 [지원되는 모델](/guide/models)을 참고하세요.

---

## 자주 묻는 질문

<details class="lurus-faq-item">
<summary>연결 테스트 실패, "유효하지 않은 키" 표시</summary>

- API Host 끝에 **슬래시가 없는지** 확인하세요(`https://api.lurus.cn`이며, `https://api.lurus.cn/`가 아닙니다)
- API Key 형식이 올바른지 확인하세요(`sk-`로 시작)
- [Lurus 콘솔](https://api.lurus.cn)에서 Key 상태가 「활성화」인지 확인하세요

</details>

<details class="lurus-faq-item">
<summary>모델 이름 입력 후 응답 없음</summary>

- 모델 이름 철자를 확인하세요(대소문자 구분, 예: `gpt-4o`이며 `GPT-4o`가 아닙니다)
- 본인의 Key가 해당 모델에 대한 접근 권한이 있는지 확인하세요

</details>

<details class="lurus-faq-item">
<summary>macOS 버전 설정은 어디에 있나요?</summary>

macOS 버전 진입점: 메뉴 막대 **OpenCat** → **Preferences**(<span class="lurus-kbd">⌘,</span>) → **API** 탭이며, iOS 버전과 설정 매개변수가 동일합니다.

</details>

<NextSteps title="다음 단계" :steps="[
  { text: '지원되는 모델 둘러보기', link: '/guide/models' },
  { text: 'API Key 받기', link: '/ko/guide/get-api-key' },
  { text: 'API 빠른 시작 보기', link: '/ko/guide/quickstart' }
]" />

</div>

<style scoped>
.opencat-page .lurus-steps { margin-top: 1rem; }
</style>
