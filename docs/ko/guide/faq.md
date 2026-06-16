---
title: Lurus API 자주 묻는 질문
description: 과금, 호환성, 문제 해결을 포함한 Lurus API 사용 중 자주 묻는 질문과 답변.
---

<div class="faq-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> 자주 묻는 질문</span>
  <h1 class="lurus-section-head__title">자주 묻는 질문</h1>
  <p class="lurus-section-head__lede">계정, 모델, 과금, 문제 해결 —— 주제별로 펼쳐 보세요.</p>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> 계정 및 인증</span>
  <h2 class="lurus-section-head__title">계정 및 인증</h2>
</div>

<details class="lurus-faq-item">
<summary>어떻게 가입하나요?</summary>

[api.lurus.cn](https://api.lurus.cn)에서 이메일과 비밀번호를 입력(또는 GitHub/Google 로그인)하면 자동으로 5 鹿贝 + 무료 할당량이 지급되며, 모든 제품이 동일한 계정을 공유합니다.

</details>

<details class="lurus-faq-item">
<summary>API Key를 분실했어요?</summary>

한 번만 표시되며 다시 찾을 수 없으니, 콘솔에서 기존 Key를 삭제하고 새로 생성하세요. 비밀번호 관리자/환경 변수에 저장하고 코드에 직접 작성하지 마세요. 계정마다 여러 개의 Key를 생성할 수 있으며, 프로젝트별로 별도의 Key를 할당하면 더 안전합니다.

</details>

<details class="lurus-faq-item">
<summary>Key가 무효일 때 어떻게 점검하나요?</summary>

- Key가 완전한지(`sk-`로 시작하며 누락된 문자가 없음)
- 상태가 「활성화」인지(콘솔 → 토큰 관리)
- 요청 헤더 `Authorization: Bearer sk-xxxx`(Bearer 뒤에 공백 하나)
- 불필요한 공백/줄바꿈이 없는지(다시 복사)
- 환경 변수 이름의 철자가 정확하고 이미 로드되었는지

여전히 `401`이 발생하나요? 점검 목록을 항목별로 살펴보려면 [문제 해결 · invalid_api_key](/ko/guide/troubleshooting#invalid-api-key)를 참조하세요.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 모델 및 호출</span>
  <h2 class="lurus-section-head__title">모델 및 호출</h2>
</div>

<details class="lurus-faq-item">
<summary>어떤 모델을 지원하나요?</summary>

OpenAI, Claude, Gemini, DeepSeek 등이며, [모델 목록](/guide/models)을 참조하세요.

</details>

<details class="lurus-faq-item">
<summary><code>"no available server"</code> 반환</summary>

모델 이름을 확인하고, Key에 해당 모델 권한이 있는지 확인하세요. 해당 모델에 현재 사용 가능한 채널이 없을 수 있으니 관리자에게 문의하세요.

</details>

<details class="lurus-faq-item">
<summary>모델을 어떻게 전환하나요?</summary>

`model` 파라미터만 변경하고 나머지는 그대로 둡니다.

</details>

<details class="lurus-faq-item">
<summary>스트리밍 응답은 어떻게 켜나요?</summary>

`"stream": true`로 설정하면 응답이 SSE를 통해 청크 단위로 반환됩니다.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> 과금 및 할당량</span>
  <h2 class="lurus-section-head__title">과금 및 할당량</h2>
</div>

<details class="lurus-faq-item">
<summary>사용량은 어떻게 확인하나요?</summary>

콘솔의 「데이터 대시보드」 또는 「사용 로그」에서 확인합니다.

</details>

<details class="lurus-faq-item">
<summary>할당량을 다 썼어요?</summary>

관리자에게 문의하여 충전하거나 요금제를 업그레이드하세요.

</details>

<details class="lurus-faq-item">
<summary>모델 가격은 어디서 보나요?</summary>

[모델 목록](/guide/models)의 가격을 참조하세요.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="alert-circle" :size="14" /> 기술 문제</span>
  <h2 class="lurus-section-head__title">기술 문제</h2>
</div>

<details class="lurus-faq-item">
<summary>요청이 타임아웃되면 어떻게 하나요?</summary>

1. 네트워크 확인(`curl https://api.lurus.cn/v1/models`)
2. `max_tokens` 줄이기
3. 추론 모델(`deepseek-reasoner`)은 사고 시간이 길어도 정상입니다
4. SDK 기본 타임아웃은 약 60초이며, `timeout`을 더 크게 조정할 수 있습니다
5. 지속적인 타임아웃은 업스트림 장애일 수 있으니 모델을 바꿔 보세요

</details>

<details class="lurus-faq-item">
<summary>429 오류(<Term t="Rate Limit">Rate Limit</Term> 초과)</summary>

빈도를 낮추고 지수 백오프로 재시도하세요(자세한 내용은 [오류 처리](/ko/api/errors) 참조). Free는 기본 60 RPM이며, Pro/Team으로 업그레이드하면 한도가 높아집니다. 유료에서도 자주 발생하면 support@lurus.cn으로 문의하세요.

</details>

<details class="lurus-faq-item">
<summary>컨텍스트 초과(예: <code>deepseek-chat</code> 64K, <code>gemini-3-pro-preview</code> 1M)</summary>

- 입력을 줄이고 히스토리 삭제
- 슬라이딩 윈도우(system + 최근 N 턴 유지)
- 더 긴 컨텍스트 모델로 전환
- 초장문 문서는 먼저 요약한 뒤 전달

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 기타 문제</span>
  <h2 class="lurus-section-head__title">기타 문제</h2>
</div>

<details class="lurus-faq-item">
<summary>데이터는 안전한가요?</summary>

전 과정 HTTPS를 사용하며, 대화 내용은 저장하지 않고, 과금을 위해 호출 메타데이터만 기록합니다.

</details>

<details class="lurus-faq-item">
<summary>SLA 보장이 있나요?</summary>

기업 고객은 SLA를 체결할 수 있으니 영업팀에 문의하세요.

</details>

<details class="lurus-faq-item">
<summary>기술 지원 채널은?</summary>

support@lurus.cn / GitHub Issues.

</details>

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">답을 찾지 못하셨나요?</p>
    <p class="lurus-cta__text">질문을 보내 주시면 영업일 기준으로 답변드립니다.</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="mailto:support@lurus.cn">문의하기 →</a>
  </div>
</div>

</div>
