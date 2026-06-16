---
title: Lurus API 소개
description: 하나의 API Key로 50개 이상의 주요 AI 모델에 연결하고, OpenAI SDK와 완전히 호환되며, 두 줄 수정만으로 연동할 수 있습니다.
---

<div class="lurus-api-intro">

<ProductHero product-id="lurus-api" />

<MetricStats :items="[
  { label: '연결 모델', value: '50+' },
  { label: '무료 한도', value: '100 회/일' },
  { label: '호환성', value: 'OpenAI SDK' },
]" />

**하나의 <Term t="API Key">API Key</Term>로 50개 이상의 주요 AI 모델에 연결하세요.** OpenAI <Term t="SDK">SDK</Term>와 완전히 호환되어, 기존 코드는 두 줄만 수정하면 되고 다시 작성할 필요가 없습니다.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 경로 선택</span>
  <h2 class="lurus-section-head__title">어떤 사용자이신가요?</h2>
  <p class="lurus-section-head__lede">세 가지 입구 중, 배경에 맞는 하나를 골라 바로 시작하세요.</p>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/ko/guide/clients/cherry-studio">
    <span class="lurus-card__icon"><Icon name="rocket" :size="22" /></span>
    <div class="lurus-card__title">기술 배경 없이 빠르게 사용해 보고 싶어요</div>
    <p class="lurus-card__body">먼저 AI 클라이언트(Cherry Studio / Lobe Chat)를 설정하고 API Key를 입력하면 바로 대화할 수 있으며, 코드 작성은 전혀 필요 없습니다.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/ko/guide/quickstart">
    <span class="lurus-card__icon"><Icon name="code" :size="22" /></span>
    <div class="lurus-card__title">개발자이고, AI 기능을 연동하고 싶어요</div>
    <p class="lurus-card__body">5분 만에 첫 API 호출을 완료하며, Python / Node.js / Go / cURL을 지원합니다.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/migrations/from-openai">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="22" /></span>
    <div class="lurus-card__title">이미 OpenAI를 사용 중이고, 전환 / 비용 절감을 원해요</div>
    <p class="lurus-card__body">두 줄의 코드만 교체하면 마이그레이션할 수 있으며, 모든 OpenAI SDK 기능이 완전히 호환됩니다.</p>
  </a>
</div>

::: info 이미 OpenAI를 사용 중이고, 전환 / 비용 절감을 원해요
두 줄의 코드만 교체하면 마이그레이션할 수 있으며, 모든 OpenAI SDK 기능이 완전히 호환됩니다:
```python
# 改这两行，其余代码不动
base_url="https://api.lurus.cn/v1"
api_key="sk-your-lurus-key"
```
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> 핵심 기능</span>
  <h2 class="lurus-section-head__title">하나의 게이트웨이, 네 가지 일</h2>
  <p class="lurus-section-head__lede">통합 연결, 지능형 라우팅, 비용 제어, 엔터프라이즈급 접근 관리.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-lurus-api)"
  :items="[
    { title: '통합 API', body: '하나의 인터페이스로 모든 모델을 커버하며, model 이름만 바꾸면 되고 공급사마다 어댑터를 작성할 필요가 없습니다.', icon: 'plug-zap' },
    { title: '지능형 라우팅과 자동 장애 전환', body: '다중 채널 백업(주 채널 실패 시 자동 전환), 가중치 부하 분산(비율에 따라 트래픽을 분배해 비용과 속도 균형), 우선순위 정책(저비용 채널 우선, 한도 초과 시 고비용 백업으로 전환).', icon: 'shuffle' },
    { title: '세밀한 비용 제어', body: '각 API Key에 Token 할당량을 설정해 초과 시 차단, 일/월 단위로 호출 횟수·Token·비용 내역 조회, 할당량 잔여가 20% 미만이면 알림.', icon: 'wallet' },
    { title: '엔터프라이즈급 접근 관리', body: '다중 Key를 프로젝트별로 배분, 모델 화이트리스트, IP 화이트리스트, 완전한 감사 로그로 매 요청의 모델/Token/지연이 모두 기록됩니다.', icon: 'shield-check' },
  ]"
/>

**통합 API 예시** —— `model` 이름만 바꾸면 공급사를 전환할 수 있습니다:

```python
from openai import OpenAI
client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-api-key")
# model 可填 deepseek-chat / gpt-4o / claude-3-5-sonnet / gemini-3-pro-preview
response = client.chat.completions.create(model="deepseek-chat", messages=[{"role": "user", "content": "你好"}])
```

### <Icon name="shield-check" :size="20" /> 엔터프라이즈급 접근 관리

| 기능 | 설명 |
|------|------|
| 다중 Key 관리 | 서로 다른 프로젝트/팀에 독립적인 Key 배분 |
| 모델 화이트리스트 | Key가 지정된 모델에만 접근하도록 제한 |
| IP 화이트리스트 | 지정된 IP 대역만 호출 허용 |
| 완전한 감사 로그 | 매 요청의 모델, Token, 지연이 모두 기록됨 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> 적용 시나리오</span>
  <h2 class="lurus-section-head__title">누가 Lurus API를 사용하나요</h2>
</div>

| 시나리오 | 무엇을 할 수 있나요 |
|------|-----------|
| **AI 애플리케이션 개발** | 동일한 코드로 모든 공급사에 연결하고, 여러 모델을 빠르게 A/B 테스트 |
| **비용 최적화** | 일상 작업은 DeepSeek(저비용), 복잡한 작업은 GPT-4o(고품질)로 처리 |
| **서비스 안정성** | 다중 채널 이중화로, 단일 공급사 장애가 서비스에 영향을 주지 않음 |
| **팀 관리** | Key + 할당량 배분, 전체 인원의 AI 사용량과 비용을 통합 조회 |
| **AI 클라이언트** | Cherry Studio, Lobe Chat, OpenCat 등 도구에 통합 백엔드 제공 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> 아키텍처 개요</span>
  <h2 class="lurus-section-head__title">요청은 어떻게 흐르나요</h2>
</div>

<ArchitectureDiagram
  title="Lurus API 게이트웨이 데이터 흐름"
  chart="graph LR; A[당신의 애플리케이션 / AI 클라이언트] --> B[Lurus API Gateway]; B --> C[인증]; C --> D[라우팅]; D --> E[속도 제한]; E --> F[과금]; F --> G[로그]; D --> H[OpenAI]; D --> I[Claude]; D --> J[Gemini]; D --> K[DeepSeek]"
/>

게이트웨이는 설정된 채널 우선순위에 따라 라우팅하며, 어떤 공급사가 오류를 반환하면 자동으로 다음 채널을 재시도하므로 코드는 전환을 인지하지 못합니다.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="graduation-cap" :size="14" /> 추천 학습 경로</span>
  <h2 class="lurus-section-head__title">20분 만에 전체 흐름 익히기</h2>
  <p class="lurus-section-head__lede">처음 사용하시나요? 순서대로 진행하세요.</p>
</div>

<ol class="lurus-steps">
<li>

[API Key 발급](/ko/guide/get-api-key) —— 가입하고 첫 Key를 생성하세요(3분)

</li>
<li>

[빠른 시작](/ko/guide/quickstart) —— 첫 API 요청을 보내세요(5분)

</li>
<li>

[지원 모델](/guide/models) —— 어떤 모델을 사용할 수 있고 어떻게 고르는지 알아보세요

</li>
<li>

[Chat Completions API](/ko/api/chat-completions) —— 가장 자주 쓰는 인터페이스를 익히세요

</li>
</ol>

::: details 고급 사용자는 바로 여기로…
- [Function Calling](/ko/api/chat-completions#function-calling) — AI가 당신의 함수를 호출하게 하기
- [스트리밍 응답](/ko/api/chat-completions#流式响应) — 글자 단위 출력으로 경험 향상
- [API 레퍼런스 개요](/ko/api/overview) — 전체 엔드포인트 목록
:::

<NextSteps
  title="다음 단계"
  :steps="[
    { text: '빠른 시작', link: '/ko/guide/quickstart', primary: true },
    { text: '지원 모델', link: '/guide/models' },
    { text: '콘솔', link: 'https://api.lurus.cn', external: true },
  ]"
/>

<RelatedProducts product-id="lurus-api" />

</div>
