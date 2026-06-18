---
title: 지원 모델
description: Lurus API가 지원하는 모든 AI 모델 목록 - 가격, 컨텍스트 윈도우 및 기능 비교 포함.
---

<script setup>
import { data } from '../../.vitepress/data/models.data'
</script>

<div class="models-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 모델 카탈로그</span>
  <h1 class="lurus-section-head__title">지원 모델</h1>
  <p class="lurus-section-head__lede">주요 AI 공급사의 다양한 모델을 <code>model</code> 이름으로 통합 연동합니다. 이 페이지는 <code>data/models.yaml</code>로부터 자동 렌더링되며, 목록은 항상 데이터 파일과 동기화됩니다.</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="filter" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">모델 추가 방법</p>
    <div class="lurus-callout__body">새 모델을 추가하려면 <code>lurus-docs/data/models.yaml</code>을 편집하기만 하면 됩니다. 푸시 후 CI가 자동으로 빌드하여 업데이트합니다.</div>
  </div>
</div>

## 모델 목록

<ModelTable
  v-for="v in data.vendors"
  :key="v.name"
  :vendor="v.name"
  :tagline="v.tagline"
  :models="v.models"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> 선택 가이드</span>
  <h2 class="lurus-section-head__title">모델 선택 방법</h2>
  <p class="lurus-section-head__lede">작업 유형과 예산 두 가지 관점에서 빠르게 찾아보세요.</p>
</div>

### 작업별 선택

| 시나리오 | 추천 모델 |
|------|---------|
| 일상 대화 | `deepseek-chat`(가성비 최고) |
| 코드 생성 | `deepseek-reasoner` / `gpt-4o` |
| 수학 추론 | `deepseek-reasoner` / `claude-3-opus` |
| 장문서 분석 | `gemini-3-pro-preview`(1M 컨텍스트) |
| 창작 글쓰기 | `claude-3-5-sonnet` |
| 영어 작업 | `gpt-4o` / `claude-3-5-sonnet` |
| 한국어/중국어 작업 | `deepseek-chat` |
| 이미지 이해 | `gemini-3-pro-image-preview` / `gpt-4o` |
| 이미지 생성 | `dall-e-3` / `midjourney` |

### 예산별 선택

| 예산 구간 | 추천 모델 |
|---------|---------|
| 낮음(&lt; ¥5/M tokens) | `deepseek-chat`、`gpt-3.5-turbo`、`gemini-3-flash-preview` |
| 중간(¥5–20/M tokens) | `claude-3-sonnet`、`gemini-3-pro-preview`、`gpt-4o-mini` |
| 높음(&gt; ¥20/M tokens) | `gpt-4o`、`claude-3-opus` |

## 모델 전환

모든 모델은 동일한 API 형식을 공유하므로 `model` 필드만 변경하면 됩니다(나머지 코드는 그대로): `client.chat.completions.create(model="deepseek-chat", ...)` → `model="gemini-3-pro-preview"`.

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">주의 사항</p>
    <div class="lurus-callout__body"><ul><li><strong>모델 가용성</strong>: <code>Beta</code> 상태는 프리뷰 버전이며 인터페이스가 변경될 수 있습니다.</li><li><strong>할당량 제한</strong>: API Key마다 접근 가능한 모델 권한이 다를 수 있습니다.</li><li><strong>가격 변동</strong>: 가격은 공급사 정책에 따라 조정되며 콘솔에 표시된 내용이 기준입니다.</li><li><strong>컨텍스트 제한</strong>: 컨텍스트 길이를 초과하는 요청은 잘리거나 오류를 반환합니다.</li></ul></div>
  </div>
</div>

<NextSteps
  title="다음 단계"
  :steps="[
    { text: '빠른 시작', link: '/ko/guide/quickstart', primary: true },
    { text: 'Chat Completions API', link: '/ko/api/chat-completions' },
    { text: '자주 묻는 질문', link: '/ko/guide/faq' },
  ]"
/>

</div>
