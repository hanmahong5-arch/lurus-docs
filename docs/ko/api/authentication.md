---
title: API 인증
description: API Key 형식과 요청 헤더 설정을 포함한 Lurus API 인증 방식.
---

<div class="api-auth-page">

# 인증

모든 Lurus API 요청에는 인증이 필요합니다. **상호 보완적인 두 가지 모드**를 지원하며, 상황에 따라 하나를 선택합니다.

<div class="lurus-cards lurus-cards--2">
  <a class="lurus-card lurus-card--auth" href="#인증-방식">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">API Key <span class="lurus-tag">가장 빠른 시작</span></div>
    <p class="lurus-card__body">Bearer Token으로, 스크립트와 개인 프로젝트에 적합합니다. 본 페이지에서 주로 다룹니다.</p>
  </a>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">OIDC / OAuth2 Token</div>
    <p class="lurus-card__body">통합 신원 체계 기반으로, 사용자 로그인이 필요한 애플리케이션, 기업 SSO, M2M에 적합합니다. <a href="/platform/auth/oidc">OIDC 통합</a> 및 <a href="/platform/auth/api-auth">PAT / JWT</a>를 참고하세요.</p>
  </div>
</div>

## 인증 방식

<Term t="Bearer Token">Bearer Token</Term>을 사용하여 HTTP Header에 <Term t="API Key">API Key</Term>를 담습니다.

```http
Authorization: Bearer sk-your-api-key
```

## 요청 예시

```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek-chat", "messages": [{"role": "user", "content": "Hi"}]}'
```

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key="sk-your-api-key",  # 建议改为 os.environ.get("LURUS_API_KEY")
)
```

```javascript [Node.js]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: 'sk-your-api-key',  // 建议改为 process.env.LURUS_API_KEY
});
```

:::

전체 SDK 목록은 [API 개요 — SDK 지원](/ko/api/overview#sdk-支持)을 참고하세요.

## 환경 변수

API Key는 하드코딩을 피하기 위해 환경 변수에 저장하는 것을 권장합니다.

```bash
# .env
LURUS_API_KEY=sk-your-api-key
```

```python
import os
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ.get("LURUS_API_KEY"))
```

## 인증 오류

| 상태 코드 | `code` | `type` | 흔한 원인 |
|--------|--------|--------|---------|
| **401** Unauthorized | `invalid_api_key` | `authentication_error` | Key 형식 오류 / 비활성화 또는 삭제됨 / Authorization Header 형식이 올바르지 않음 |
| **403** Forbidden | `access_denied` | `authorization_error` | Key에 해당 모델 권한 없음 / 계정이 정지됨 / 할당량 소진 |

오류 응답 JSON 구조와 재시도 전략은 [오류 처리](/ko/api/errors)를 참고하세요.

## 보안 모범 사례

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="server" :size="20" /></span>
    <div class="lurus-card__title">환경 변수 사용</div>
    <p class="lurus-card__body">코드에 API Key를 하드코딩하지 않기</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">비공개 유지</div>
    <p class="lurus-card__body">Git 저장소에 커밋하지 않기</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="filter" :size="20" /></span>
    <div class="lurus-card__title">권한 제한</div>
    <p class="lurus-card__body">Key에 필요한 최소 권한만 부여하기</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="repeat" :size="20" /></span>
    <div class="lurus-card__title">정기 교체</div>
    <p class="lurus-card__body">주기적으로 API Key 교체하기</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">로그 모니터링</div>
    <p class="lurus-card__body">API 호출 로그를 정기적으로 점검하기</p>
  </div>
</div>

---

<NextSteps
  title="다음 단계"
  :steps="[
    { text: 'Chat Completions API', link: '/ko/api/chat-completions', primary: true },
    { text: '오류 처리', link: '/ko/api/errors' },
    { text: 'API 개요', link: '/ko/api/overview' },
    { text: 'OIDC 통합', link: '/platform/auth/oidc' },
  ]"
/>

</div>
