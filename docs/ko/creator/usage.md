---
title: "Creator 사용 설명서"
description: "Creator 데스크톱 콘텐츠 공장의 사용 가이드 및 기능 설명입니다."
---

<div class="creator-page">

# 사용 설명서

## 빠른 체험

<ol class="lurus-steps">
<li>메인 화면에서 「<strong>새 작업</strong>」을 클릭합니다.</li>
<li>동영상 URL을 붙여넣습니다(YouTube / Bilibili 등).</li>
<li>목표 작업을 선택합니다: 다운로드만 / 다운로드+전사 / 다운로드+전사+재작성 / 전체 파이프라인(게시 포함).</li>
<li>「<strong>시작</strong>」을 클릭하면 Creator가 각 단계를 순서대로 실행하며, 작업 패널에서 실시간 진행 상황을 확인할 수 있습니다.</li>
</ol>

---

## 콘텐츠 파이프라인 상세

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="video" :size="14" /> 단계 1</span>
  <h2 class="lurus-section-head__title">동영상 다운로드</h2>
  <p class="lurus-section-head__lede">1000개 이상의 동영상 플랫폼을 지원합니다(전체 목록은 yt-dlp 지원 사이트 참고).</p>
</div>

전체 목록은 [yt-dlp 지원 사이트](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)를 참고하세요.

**자주 쓰는 소스**:

| 플랫폼 | URL 형식 |
|------|---------|
| YouTube | `https://www.youtube.com/watch?v=xxx` |
| Bilibili | `https://www.bilibili.com/video/BVxxx` |
| 더우인(抖音) | `https://www.douyin.com/video/xxx` |
| Twitter/X | `https://x.com/user/status/xxx` |

**다운로드 옵션**:

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| 동영상 화질 | 최고 / 1080p / 720p / 오디오만 | 최고 |
| 자막 | 사용 가능한 자막 자동 다운로드 | 켜짐 |
| 프록시 | HTTP/SOCKS5 프록시(해외 플랫폼 접근용) | 없음 |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> 단계 2</span>
  <h2 class="lurus-section-head__title">오디오 전사</h2>
  <p class="lurus-section-head__lede">OpenAI Whisper 모델을 사용해 오디오를 텍스트로 변환합니다.</p>
</div>

| 모델 | 크기 | 속도 | 정확도 | 적용 시나리오 |
|------|------|------|--------|---------|
| `tiny` | 75 MB | 매우 빠름 | 보통 | 빠른 미리보기 |
| `base` | 142 MB | 빠름 | 양호 | 일상 사용(기본값) |
| `small` | 466 MB | 중간 | 우수 | 높은 정확도가 필요할 때 |
| `medium` | 1.5 GB | 느림 | 매우 우수 | 전문 콘텐츠, 다국어 |

**언어 지원**: 언어를 자동으로 감지하며, 수동 지정도 가능합니다(중국어, 영어, 일본어 등 99개 언어 지원).

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> 단계 3</span>
  <h2 class="lurus-section-head__title">AI 재작성</h2>
  <p class="lurus-section-head__lede">Lurus API를 통해 AI 모델을 호출하여 전사 텍스트를 가공합니다.</p>
</div>

[Lurus API](/ko/guide/introduction)를 통해 AI 모델을 호출하여 전사 텍스트를 가공합니다.

**재작성 모드**:

| 모드 | 설명 | 적합한 경우 |
|------|------|------|
| **번역** | 외국어 콘텐츠를 중국어로 번역 | 해외 동영상 현지화 |
| **윤문** | 문법 수정, 표현 최적화 | 카피 품질 향상 |
| **요약** | 핵심 관점 추출, 분량 압축 | 긴 동영상 → 짧은 카피 |
| **확장** | 세부 사항과 배경 보충 | 짧은 콘텐츠 → 긴 글 |
| **스타일 변환** | 어조 조정(격식↔편안함) | 다양한 플랫폼에 맞춤 |
| **SEO 최적화** | 제목, 태그, 요약 생성 | 검색 순위 향상 |

**모델 선택**:

| 추천 모델 | 적합한 경우 | 비용 |
|---------|------|------|
| `deepseek-chat` | 중국어 재작성, 번역 | 낮음 |
| `gpt-4o` | 영어 콘텐츠, 복잡한 재작성 | 높음 |
| `claude-3-5-sonnet` | 창작 글쓰기, 장문 | 중간 |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="share-2" :size="14" /> 단계 4</span>
  <h2 class="lurus-section-head__title">자동 게시</h2>
  <p class="lurus-section-head__lede">chromedp 헤드리스 브라우저를 통해 자동으로 게시합니다.</p>
</div>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">자동 게시는 3개 플랫폼만 지원</p>
    <div class="lurus-callout__body">현재 <strong>위챗 공식 계정 / 더우인 / 샤오훙수</strong>의 자동 게시만 지원합니다. 그 외 플랫폼(YouTube Shorts / TikTok / Instagram Reels 등)은 카피는 생성할 수 있으나 수동으로 게시해야 합니다.</div>
  </div>
</div>

**최초 설정**:

<ol class="lurus-steps">
<li>설정 → 「<strong>게시 플랫폼</strong>」 → 목표 플랫폼 선택.</li>
<li>「<strong>로그인</strong>」을 클릭하면 브라우저 창이 나타납니다.</li>
<li>수동으로 QR 코드 / 비밀번호 로그인을 하면 Creator가 로그인 상태를 저장합니다.</li>
</ol>

**게시 설정**(플랫폼별 개별 설정):

| 설정 항목 | 설명 |
|--------|------|
| 제목 템플릿 | 변수 지원: `{{title}}`、`{{date}}`、`{{source}}` |
| 태그 | 자동 생성 또는 수동 지정 |
| 표지 | 동영상에서 자동 캡처 또는 수동 업로드 |
| 게시 시간 | 즉시 게시 또는 예약 게시 |

---

## 일괄 처리

<ol class="lurus-steps">
<li>텍스트 파일을 만들고 한 줄에 동영상 URL을 하나씩 입력합니다.</li>
<li>Creator에서 「<strong>일괄 가져오기</strong>」를 클릭해 파일을 선택합니다.</li>
<li>통일된 처리 설정을 선택합니다.</li>
<li>「<strong>전체 시작</strong>」을 클릭합니다.</li>
</ol>

### 작업 상태

각 작업은 독립적으로 추적됩니다:

| 상태 | 설명 |
|------|------|
| `queued` | 처리 대기 중 |
| `downloading` | 동영상 다운로드 중 |
| `transcribing` | 음성 전사 중 |
| `rewriting` | AI 재작성 중 |
| `publishing` | 자동 게시 중 |
| `completed` | 전체 완료 |
| `failed` | 특정 단계 실패(재시도 가능) |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">이어받기</p>
    <div class="lurus-callout__body">실패한 작업은 실패한 단계부터 다시 시작할 수 있으며, 처음부터 처리할 필요가 없습니다.</div>
  </div>
</div>

---

## 예산 관리

AI 재작성 단계에서 Token을 과도하게 소모하는 것을 방지합니다:

| 설정 | 설명 | 기본값 |
|------|------|--------|
| 작업당 Token 상한 | 각 작업이 최대로 사용하는 Token 수 | 10,000 |
| 일일 총량 상한 | 하루에 최대로 소모하는 Token 수 | 100,000 |
| 초과 시 동작 | 일시 중지 / 재작성 건너뛰기 / 알림 | 일시 중지 |

설정 → 「**Token 예산**」에서 구성합니다.

---

## 단축키

| 단축키 | 기능 |
|--------|------|
| <span class="lurus-kbd">Ctrl+N</span> / <span class="lurus-kbd">Cmd+N</span> | 새 작업 |
| <span class="lurus-kbd">Ctrl+V</span> / <span class="lurus-kbd">Cmd+V</span> | URL 붙여넣기 후 작업 생성 |
| <span class="lurus-kbd">Ctrl+Shift+S</span> / <span class="lurus-kbd">Cmd+Shift+S</span> | 설정 열기 |
| <span class="lurus-kbd">Space</span> | 현재 작업 일시 중지/재개 |
| <span class="lurus-kbd">Delete</span> | 선택한 작업 삭제 |

---

## 문제 해결

<details class="lurus-faq-item">
<summary>동영상 다운로드에 실패하나요?</summary>

네트워크를 확인하세요(해외 동영상은 프록시가 필요할 수 있음). 일부 플랫폼은 크롤링 방지가 있으니 Creator를 최신 버전으로 업데이트하세요. URL 형식을 확인하세요.

</details>

<details class="lurus-faq-item">
<summary>전사가 부정확한가요?</summary>

더 큰 Whisper 모델을 사용하세요(설정 → Whisper 모델). 오디오 언어를 수동으로 지정하세요. 배경 소음이 크면 정확도가 떨어집니다.

</details>

<details class="lurus-faq-item">
<summary>AI 재작성이 시간 초과되나요?</summary>

API Key 잔액을 확인하세요. 텍스트가 너무 길면 분할 처리하세요. 더 빠른 모델로 전환하세요(예: `deepseek-chat`).

</details>

<details class="lurus-faq-item">
<summary>게시에 실패하나요?</summary>

플랫폼 로그인이 만료되었을 수 있으니 QR 코드를 다시 스캔하세요. 콘텐츠가 플랫폼 규칙을 위반하는지 확인하세요(제목/이미지/민감 단어). 플랫폼 API 변경 시에는 Creator 업데이트 적용을 기다려야 합니다.

</details>

---

## 다음 단계

<NextSteps :steps="[
  { text: '사용 사례', link: '/ko/creator/use-cases', primary: true },
  { text: '소개로 돌아가기', link: '/ko/creator/' },
  { text: '설치 가이드', link: '/ko/creator/install' },
]" />

</div>
