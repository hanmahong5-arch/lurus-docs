---
title: "Creator — AI 기반 데스크톱 콘텐츠 공장"
description: "Wails 기반으로 구축된 데스크톱 콘텐츠 제작 도구, AI 보조 창작 및 다중 포맷 출력."
---

<div class="creator-page">

<ProductHero product-id="creator" />

## Creator란?

**Lurus Creator** 는 데스크톱 AI 콘텐츠 제작 도구로, 영상 다운로드, 오디오 전사, AI 재작성, 다중 플랫폼 게시를 하나의 자동화 파이프라인으로 통합합니다. 단일 exe로 의존성이 없으며, 열자마자 바로 사용할 수 있습니다.

영상 링크 하나를 붙여넣으면 AI가 6종의 플랫폼 맞춤형 콘텐츠를 자동 생성합니다: 위챗 공식 계정(심층 기사), 더우인(구술 스크립트), 샤오훙수(추천 노트), YouTube Shorts, TikTok, Instagram Reels. 그중 위챗 공식 계정 / 더우인 / 샤오훙수 3개 플랫폼은 chromedp 브라우저 자동화로 원클릭 게시를 지원하며, 나머지 플랫폼은 수동 게시가 필요합니다. 영상 소스는 YouTube, Bilibili 등 1000개 이상의 사이트를 지원합니다(yt-dlp 기반).

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">1000+</span><span class="lurus-stat__label">영상 소스 사이트</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6</span><span class="lurus-stat__label">플랫폼 맞춤 콘텐츠</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">플랫폼 원클릭 게시</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">99</span><span class="lurus-stat__label">전사 언어</span></div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 핵심 기능</span>
  <h2 class="lurus-section-head__title">하나의 링크에서 다중 플랫폼 게시까지</h2>
  <p class="lurus-section-head__lede">다운로드, 전사, 재작성, 게시를 하나의 파이프라인으로 연결하여 전 과정을 자동화합니다.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-creator)"
  :items="[
    { title: '원클릭 콘텐츠 파이프라인', body: '영상 소스 → yt-dlp 다운로드 → ffmpeg 트랜스코딩 → Whisper 전사 → LLM 재작성 → chromedp 게시, 전 과정 자동화', icon: 'workflow' },
    { title: '지능형 재작성', body: '번역(용어 보존), 재작성(어조·길이 조정), 핵심 관점 추출, SEO 최적화 제목·태그·요약', icon: 'sparkles' },
    { title: '다중 플랫폼 콘텐츠 생성', body: '한 번에 6개 플랫폼 템플릿 생성: 공식 계정 / 더우인 / 샤오훙수 / YouTube Shorts / TikTok / Reels', icon: 'share-2' },
    { title: 'DevFactory 일괄 처리', body: 'SQLite 상태 머신 작업별 추적, 일괄 대기열, Token 예산 관리, 이어받기 재개', icon: 'package' },
  ]"
/>

### 원클릭 콘텐츠 파이프라인

<ArchitectureDiagram
  title="콘텐츠 파이프라인: 영상 소스 → 게시"
  chart="graph LR
    SRC[영상 소스<br/>YouTube / Bilibili / 로컬] --> DL[yt-dlp 다운로드]
    DL --> TC[ffmpeg 트랜스코딩]
    TC --> TR[Whisper 전사]
    TR --> RW[LLM 재작성 / 번역]
    RW --> PUB[chromedp 게시<br/>공식 계정 / 더우인 / 샤오훙수]"
/>

| 단계 | 도구 | 설명 |
|------|------|------|
| **다운로드** | yt-dlp | YouTube, Bilibili 등 1000개 이상의 영상 플랫폼 |
| **트랜스코딩** | ffmpeg | 포맷 변환, 자르기, 워터마크 제거 |
| **전사** | Whisper | 음성을 텍스트로 변환, 99개 언어 |
| **재작성** | LLM (Lurus API) | AI 윤문, 번역, 포맷 조정 |
| **게시** | chromedp | 헤드리스 브라우저 자동 로그인, 업로드, 게시 |

### 다중 플랫폼 콘텐츠 생성 + 일부 플랫폼 원클릭 게시

콘텐츠 생성은 6개 플랫폼 템플릿을 지원합니다: 위챗 공식 계정, 더우인, 샤오훙수, YouTube Shorts, TikTok, Instagram Reels. 현재 chromedp 헤드리스 브라우저 기술로 자동 게시가 구현된 플랫폼은 3개뿐입니다:

| 플랫폼 | 지원하는 콘텐츠 유형 | 자동 게시 |
|------|--------------|---------|
| **위챗 공식 계정** | 이미지·텍스트 기사 | ✅ |
| **더우인** | 짧은 영상 + 콘텐츠 | ✅ |
| **샤오훙수** | 이미지·텍스트 노트 | ✅ |
| YouTube Shorts | 짧은 영상 스크립트 | ❌ 수동 게시 필요 |
| TikTok | 짧은 영상 스크립트 | ❌ 수동 게시 필요 |
| Instagram Reels | 짧은 영상 스크립트 | ❌ 수동 게시 필요 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">최초 로그인</p>
    <div class="lurus-callout__body">각 게시 플랫폼 기능을 처음 사용할 때 QR 코드로 한 번 수동 로그인이 필요합니다. 이후 Creator가 로그인 상태를 저장합니다.</div>
  </div>
</div>

---

## 기술 아키텍처

`Creator Desktop (Wails v2 = Go + TypeScript)`: 프런트엔드 TypeScript(작업 패널/에디터/설정) + Go 백엔드(yt-dlp / ffmpeg / Whisper / chromedp 스케줄링 + SQLite 상태 머신) → [Lurus API](/ko/guide/introduction)(LLM, DeepSeek/GPT 등). 단일 실행 파일로 컴파일됩니다.

<ArchitectureDiagram
  title="Creator Desktop 기술 아키텍처"
  chart="graph TD
    UI[프런트엔드 TypeScript<br/>작업 패널 / 에디터 / 설정] --> GO[Go 백엔드<br/>스케줄링 + SQLite 상태 머신]
    GO --> TOOLS[yt-dlp / ffmpeg / Whisper / chromedp]
    GO --> API[Lurus API<br/>LLM · DeepSeek / GPT 등]"
/>

---

## 적용 시나리오

<UserScenarios
  title="누가 Creator를 사용하나요"
  :scenarios="[
    { role: '1인 미디어', title: '1인 미디어 운영', summary: '해외 우수 콘텐츠를 현지화하여 중국어 버전을 일괄 생산', link: '/ko/creator/use-cases' },
    { role: '지식', title: '지식 전파', summary: '기술 강연 영상에서 텍스트 원고를 추출하여 이미지·텍스트 튜토리얼로 게시', link: '/ko/creator/use-cases' },
    { role: '매트릭스', title: '콘텐츠 매트릭스', summary: '하나의 콘텐츠를 여러 플랫폼의 포맷과 스타일에 자동 맞춤', link: '/ko/creator/use-cases' },
    { role: '팀', title: '팀 협업', summary: '영상 목록을 일괄 처리하고 작업 진행 상황을 한눈에 파악', link: '/ko/creator/usage' },
  ]"
/>

---

## 지원 플랫폼

| 운영 체제 | 버전 요구 사항 |
|---------|---------|
| Windows | Windows 10 64-bit 이상 |
| macOS | macOS 12 (Monterey) 이상 |
| Linux | Ubuntu 20.04+ / Debian 11+ |

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">다운로드 후 바로 사용, 설정 불필요</p>
    <p class="lurus-cta__text">단일 exe에 yt-dlp / ffmpeg / Whisper / chromedp를 패키징하여 3분 만에 첫 작업을 실행합니다.</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="/ko/creator/install">설치 가이드 →</a>
  </div>
</div>

<!-- lurus:related-block -->

---

## 관련 제품 및 다음 단계

<RelatedProducts product-id="creator" />

</div>
