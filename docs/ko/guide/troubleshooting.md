---
title: 문제 해결
description: Lurus 전 제품의 빈발 문제를 한 페이지에서 진단 —— 401 / 모델 채널 없음 / 429 / 할당량 부족 / 컨텍스트 초과 / 타임아웃, 에러 코드와 해결 경로 포함.
---

<div class="troubleshooting-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> 문제 해결</span>
  <h1 class="lurus-section-head__title">문제가 발생했나요? 여기서 시작하세요</h1>
  <p class="lurus-section-head__lede">먼저 증상에 따라 어디로 갈지 찾고, 아래 빈발 문제 대조표로 자세히 점검하세요. 내용을 중복하지 않고, 권위 있는 페이지로 안내합니다.</p>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/ko/api/errors">
    <span class="lurus-card__icon"><Icon name="alert-circle" :size="22" /></span>
    <div class="lurus-card__title">API 에러(4xx / 5xx)</div>
    <p class="lurus-card__body">전체 에러 코드, 응답 구조와 재시도 전략 —— 401 / 402 / 404 / 429 / 5xx 한눈에.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/ko/guide/faq">
    <span class="lurus-card__icon"><Icon name="key-round" :size="22" /></span>
    <div class="lurus-card__title">계정, Key 및 인증</div>
    <p class="lurus-card__body">가입, API Key 분실, Key 무효 진단, 모델과 스트리밍 호출의 흔한 문제.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/ko/platform/billing">
    <span class="lurus-card__icon"><Icon name="wallet" :size="22" /></span>
    <div class="lurus-card__title">과금과 할당량</div>
    <p class="lurus-card__body">무료 한도, 구독 플랜, 鹿贝 차감 규칙, 그리고 할당량 소진 후 처리.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/ko/guide/clients/others">
    <span class="lurus-card__icon"><Icon name="plug" :size="22" /></span>
    <div class="lurus-card__title">클라이언트 연결 안 됨</div>
    <p class="lurus-card__body">Cherry Studio / Lobe Chat / OpenCat 등 서드파티 클라이언트의 연동 및 문제 해결.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/ko/platform/faq">
    <span class="lurus-card__icon"><Icon name="layers" :size="22" /></span>
    <div class="lurus-card__title">제품별 전용 문제</div>
    <p class="lurus-card__body">플랫폼, MemX, Lucrum 등 각 제품은 독립적인 FAQ가 있으니, 먼저 해당 제품 문서의 자주 묻는 질문 페이지를 확인하세요.</p>
  </a>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> 빈발 증상</span>
  <h2 class="lurus-section-head__title">에러별 대조 진단</h2>
  <p class="lurus-section-head__lede">겪고 있는 에러를 펼쳐 체크리스트대로 점검하세요. 상세 에러 코드는 <a href="/ko/api/errors">에러 처리</a>를 참고하세요.</p>
</div>

<details class="lurus-faq-item" id="invalid-api-key">
<summary><code>401 Unauthorized</code> / <code>invalid_api_key</code> 반환</summary>

```json
{ "error": { "code": "invalid_api_key", "type": "authentication_error" } }
```

`authentication_error`는 Key가 무효이거나 누락되었음을 의미합니다. 항목별로 점검하세요.

- Key가 완전하고 `sk-`로 시작하며 불필요한 공백이나 줄바꿈이 없는지(다시 한 번 복사)
- 요청 헤더 형식 `Authorization: Bearer sk-xxxx`(`Bearer` 뒤에 공백 하나)
- Key 상태가 「활성화」인지(콘솔 → 토큰 관리)
- 환경 변수명 철자가 정확하고 이미 로드되었는지

401은 **재시도하지 말고** Key를 바로 수정한 뒤 다시 보내세요. 자세한 내용은 [인증](/ko/api/authentication)과 [자주 묻는 질문: Key 무효는 어떻게 진단하나요](/ko/guide/faq)를 참고하세요.

</details>

<details class="lurus-faq-item">
<summary><code>"no available server"</code> / <code>model_not_found</code>(HTTP 404) 반환</summary>

```json
{ "error": { "code": "model_not_found", "message": "模型 xxx 无可用渠道", "type": "new_api_error" } }
```

- `model` 이름 철자를 점검(대소문자 구분)
- 해당 Key가 이 모델에 접근할 권한이 있는지 확인
- 해당 모델에 가용 채널이 일시적으로 없을 수 있음
- 방금 Key를 생성했다면 약 10초 기다린 뒤 다시 시도

사용 가능한 모델 목록은 [지원 모델](/guide/models)을 참고하세요.

</details>

<details class="lurus-faq-item">
<summary><code>429 Too Many Requests</code> / <code>rate_limit_exceeded</code> 반환</summary>

```json
{ "error": { "code": "rate_limit_exceeded", "type": "rate_limit_error" } }
```

속도 제한을 초과했습니다. 처리 방법:

- 요청 빈도를 낮추고, `2 ** attempt` 초로 **지수 백오프**한 뒤 재시도
- Free는 기본 60 RPM, Pro / Team으로 업그레이드하면 한도 상향
- 유료 전환 후에도 자주 발생하면 <a href="mailto:support@lurus.cn">support@lurus.cn</a>로 문의

재시도 코드 예시는 [에러 처리 · 모범 사례](/ko/api/errors#错误处理最佳实践)를 참고하세요.

</details>

<details class="lurus-faq-item" id="insufficient-quota">
<summary><code>402</code> / <code>insufficient_quota</code>(할당량 / 잔액 부족) 반환</summary>

```json
{ "error": { "code": "insufficient_quota", "type": "billing_error" } }
```

- 먼저 당일 무료 할당량을 모두 소진했는지 확인(Free 플랜 100회/일)
- 鹿贝 잔액 확인: [identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)
- 셀프 충전 또는 플랜 업그레이드, 규칙은 [과금 설명](/ko/platform/billing)을 참고

</details>

<details class="lurus-faq-item">
<summary><code>context_length_exceeded</code>(컨텍스트 초과)</summary>

```json
{ "error": { "code": "context_length_exceeded", "type": "invalid_request_error" } }
```

`deepseek-chat` 64K, `gemini-3-pro-preview` 1M처럼 모델 상한을 초과할 때:

- 입력을 줄이고 이전 메시지를 삭제
- 슬라이딩 윈도우 사용(system + 최근 N턴 유지)
- 더 긴 컨텍스트의 모델로 전환

</details>

<details class="lurus-faq-item">
<summary>요청 타임아웃 / 장시간 무응답</summary>

1. 네트워크 연결 점검: `curl https://api.lurus.cn/v1/models`
2. `max_tokens` 축소
3. 추론 모델(`deepseek-reasoner`)은 사고 시간이 긴 것이 정상
4. SDK 기본 타임아웃은 약 60초이며 `timeout`을 늘릴 수 있음
5. 지속적인 타임아웃은 업스트림 장애일 수 있으니 다른 모델로 다시 시도

</details>

---

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">못 찾으셨나요? support@lurus.cn으로 문의하세요</p>
    <div class="lurus-callout__body">다음을 첨부하세요: 에러 메시지 전체 내용, 요청 ID(응답 헤더 <code>X-Request-ID</code>), 발생 시각, 재현 단계 —— 빠른 진단에 도움이 됩니다.</div>
  </div>
</div>

<NextSteps
  title="관련 문서"
  :steps="[
    { text: '에러 처리(전체 에러 코드)', link: '/ko/api/errors', primary: true },
    { text: '자주 묻는 질문', link: '/ko/guide/faq' },
    { text: '과금 설명', link: '/ko/platform/billing' },
  ]"
/>

</div>
