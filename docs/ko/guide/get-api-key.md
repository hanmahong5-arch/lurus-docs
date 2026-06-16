---
title: API Key 발급
description: Lurus 계정에 가입하고 API Key를 발급받는 전체 절차.
---

<div class="getkey-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> API Key 발급</span>
  <h1 class="lurus-section-head__title">계정에 가입하고 첫 번째 Key를 생성하세요</h1>
  <p class="lurus-section-head__lede">3분이면 사용 가능한 API Key를 받습니다.</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">OIDC / OAuth 연동</p>
    <div class="lurus-callout__body">최종 사용자가 Lurus 계정으로 자체 앱에 로그인하게 하거나, 백엔드가 Service User + JWT Profile로 호출하려면 통합 ID 인증으로 전환할 수 있습니다: <a href="/ko/platform/auth/oidc">OIDC / OAuth2 연동</a> · <a href="/ko/platform/auth/api-auth">API 인증(PAT/JWT)</a>. API Key와 OIDC Token은 공존하며 두 가지 모두 유효합니다.</div>
  </div>
</div>

## 가입과 Key 생성

<ol class="lurus-steps">
<li>

[Lurus 콘솔](https://api.lurus.cn) 접속 →「회원가입」→ 이메일·비밀번호 입력 → 이메일 인증 완료.

</li>
<li>

로그인 → 왼쪽「토큰 관리」→「새 토큰 생성」→ 토큰 이름 입력(식별하기 쉽게) → 확인.

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">한 번만 표시됨</p>
    <div class="lurus-callout__body">생성 후 즉시 API Key를 복사해 저장하세요. <strong>한 번만 표시됩니다</strong>!</div>
  </div>
</div>

## API Key 형식

`sk-`로 시작하며 48자리 랜덤 문자열입니다: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

## API Key 관리

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="bar-chart-3" :size="22" /></span>
    <div class="lurus-card__title">사용량 확인</div>
    <p class="lurus-card__body">「토큰 관리」페이지에서 각 Key의 사용된 한도, 남은 한도, 최근 호출 시각을 표시합니다.</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="lock" :size="22" /></span>
    <div class="lurus-card__title">비활성화 / 삭제</div>
    <p class="lurus-card__body">비활성화 = 사용 권한 일시 중지(복구 가능); 삭제 = 영구 삭제(복구 불가).</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="filter" :size="22" /></span>
    <div class="lurus-card__title">모델 권한 설정</div>
    <p class="lurus-card__body">Key 옆「편집」클릭 →「사용 가능 모델」에서 허용할 모델 선택 → 저장.</p>
  </div>
</div>

## 보안 권장 사항

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Key를 비밀번호처럼 관리하세요</p>
    <div class="lurus-callout__body">유출 금지(공개 저장소에 커밋하지 않기); 90일마다 Key 교체; 최소 권한(필요한 모델만 부여); 호출 로그를 정기적으로 점검해 이상을 발견하면 즉시 대응.</div>
  </div>
</div>

## 자주 묻는 질문

<details class="lurus-faq-item">
<summary>Key를 잊어버렸으면 어떻게 하나요?</summary>

복구할 수 없으며, 새 Key를 생성하세요.

</details>

<details class="lurus-faq-item">
<summary>Key가 도용되었나요?</summary>

해당 Key를 즉시 비활성화하거나 삭제하고 새 Key를 생성하세요.

</details>

<details class="lurus-faq-item">
<summary>한도를 다 썼나요?</summary>

셀프 충전하거나 요금제를 업그레이드하세요 — 먼저 [요금 안내](/ko/platform/billing)에서 등급(Free / Basic / Pro)을 확인한 뒤, [콘솔](https://api.lurus.cn)에서 충전하거나 업그레이드하세요.

</details>

<NextSteps
  title="다음 단계"
  :steps="[
    { text: '빠른 시작', link: '/ko/guide/quickstart', primary: true },
    { text: '지원 모델', link: '/guide/models' },
    { text: '요금 안내', link: '/ko/platform/billing' },
  ]"
/>

</div>
