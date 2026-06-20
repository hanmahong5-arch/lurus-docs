---
title: "Creator 활용 사례"
description: "B 站(빌리빌리) 영상 해설 / 위챗 공식 계정 장문 / 샤오훙수 노트 세 가지 대표 시나리오의 전체 파이프라인."
---

<div class="creator-page">

# Creator 활용 사례 <StatusBadge status="dev" />

영상, 장문에서 소셜 짧은 콘텐츠까지 아우르는 세 가지 실전 파이프라인 사례입니다.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="video" :size="14" /> 사례 1</span>
  <h2 class="lurus-section-head__title">B 站 영상 해설</h2>
  <p class="lurus-section-head__lede">B 站 영상 링크 하나 → 내레이션 스크립트 + 썸네일 문구.</p>
</div>

| 단계 | 도구 | 산출물 |
|------|------|------|
| 입력 | 영상 링크 붙여넣기 | 원본 영상 URL |
| 다운로드 | yt-dlp | mp4 파일 |
| 전사 | Whisper large-v3 | 타임스탬프가 포함된 중국어 자막 |
| 정제 | LLM（DeepSeek-Chat） | 구간별 요약 + 하이라이트 |
| 재작성 | LLM（Claude Sonnet） | 내레이션 스크립트 3종（진지함 / 가벼움 / 긴장감） |
| 썸네일 | LLM | 썸네일 제목 후보 3개 |
| 출력 | Creator 편집기 | B 站 관리자 페이지에 바로 붙여넣기 가능 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="gauge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">대표 소요 시간</p>
    <div class="lurus-callout__body">10 분 영상 → 전체 과정 90 초.</div>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-open" :size="14" /> 사례 2</span>
  <h2 class="lurus-section-head__title">위챗 공식 계정 장문</h2>
  <p class="lurus-section-head__lede">주제 하나 → 위챗 공식 계정 2000 자 심층 글.</p>
</div>

<ArchitectureDiagram
  title="주제 → 위챗 공식 계정 장문"
  chart='graph TD
    TOPIC["주제 입력: AI Agent 영속화에서 WAL의 활용 복기"] --> SEARCH[자료 검색<br/>Lurus API + web_search Tool]
    SEARCH --> OUTLINE[개요 생성<br/>LLM이 H2 5개 나열]
    OUTLINE --> WRITE[문단별 작성<br/>개요에 따라 블록 단위 생성]
    WRITE --> FIG[삽화 제안<br/>LLM이 도식 3장 위치 제안]
    FIG --> MD[Markdown을 Creator 편집기로 출력]'
/>

**맞춤 처리 포인트**:

- 위챗 공식 계정은 H4를 지원하지 않으므로 자동 강등
- "추천 읽기" 상호 링크 자동 생성（키워드 매칭 기반）
- "구어체 / 학술체 / 비즈니스체" 세 가지 스타일 전환 지원

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="share-2" :size="14" /> 사례 3</span>
  <h2 class="lurus-section-head__title">샤오훙수 노트</h2>
  <p class="lurus-section-head__lede">이미지 한 장 + 한 줄 포인트 → 완성된 추천 노트.</p>
</div>

**입력**: 제품 이미지 + "배터리 진짜 최고"

**출력**:

```
┌─────────────────────────────┐
│ 🌙 终于找到通勤救星！       │
│                              │
│ 用了一周真的爱上了...（100 字）│
│                              │
│ ✅ 续航 28 小时              │
│ ✅ 重量只有 180 克           │
│ ✅ 降噪 -35dB                │
│                              │
│ #数码好物 #通勤 #降噪耳机   │
└─────────────────────────────┘
```

금지어를 피해 6~10 개의 해시태그를 자동 생성합니다.

---

## 공용 파이프라인 비교

| 시나리오 | 영상 해설 | 공식 계정 장문 | 샤오훙수 |
|------|---------|-----------|--------|
| 입력 형태 | URL | 주제어 | 이미지+짧은 문장 |
| 핵심 모델 | Whisper + LLM | LLM | LLM |
| 산출물 길이 | 300~500 자 스크립트 | 2000 자 | 80~150 자 |
| 게시 지원 | 복사 내보내기 | chromedp 자동 게시 | chromedp 자동 게시 |
| 대표 소요 시간 | 90 초 | 2 분 | 30 초 |

## 다음 단계

<NextSteps :steps="[
  { text: '소개로 돌아가기', link: '/ko/creator/', primary: true },
  { text: '설치 가이드', link: '/ko/creator/install' },
  { text: '사용 설명서', link: '/ko/creator/usage' },
]" />

</div>
