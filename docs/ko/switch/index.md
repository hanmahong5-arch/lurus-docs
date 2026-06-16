---
title: Switch — AI 코딩 CLI 통합 관리 센터
description: 데스크톱 애플리케이션, 하나의 화면에서 5종 주요 AI 코딩 CLI의 설정, MCP 서버, 비용을 관리합니다.
---

<div class="switch-page">

<ProductHero product-id="switch" />

<MetricStats :items="[
  { label: '관리 CLI', value: '5종', hint: 'Claude Code / Codex / Gemini / PicoClaw / NullClaw' },
  { label: '패키지 크기', value: '<15MB', hint: '단일 exe, 의존성 없음' },
  { label: '실행', value: '<2s', hint: 'Wails + Go 1.25 + React 18' },
]" />

## Lurus Switch란?

**Lurus Switch**는 데스크톱 애플리케이션(단일 exe, 의존성 없음, &lt; 15MB)으로, 하나의 화면에서 **5종 주요 AI 코딩 CLI: Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw**의 설정, MCP 서버, 비용을 관리할 수 있게 해 줍니다. **Wails**(Go 1.25 + React 18) 기반으로 구축되어 실행 시간 &lt; 2초이며, Windows / macOS / Linux 전 플랫폼을 지원합니다.

오늘날 개발자는 Claude Code, Codex, Gemini CLI 등 여러 AI CLI를 동시에 사용하지만, 설정은 곳곳에 흩어져 있고 비용도 제각각 관리됩니다. Switch는 이 모든 것을 한곳에서 통합 관리합니다.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">하나의 화면으로, 여기저기 설정 찾는 일과 작별</p>
    <div class="lurus-callout__body">설정 시각화 편집, MCP 도구 간 동기화, 비용을 도구/모델별로 집계 — 더 이상 각 CLI의 dotfile을 일일이 열 필요가 없습니다.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> 핵심 기능</span>
  <h2 class="lurus-section-head__title">모든 AI CLI를 한곳에서 관리</h2>
  <p class="lurus-section-head__lede">설정, MCP, 비용, 키, 프록시 — 자주 쓰는 운영 작업을 모두 하나의 창에서 처리합니다.</p>
</div>

<CapabilityGrid accent="var(--lurus-color-switch)" :items="[
  { title: '멀티 CLI 설정 관리', body: 'Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw 설정을 시각적으로 편집, Monaco Editor 실시간 미리보기.', icon: 'layers' },
  { title: 'CLAUDE.md 스마트 도우미', body: '프로젝트를 스캔해 CLAUDE.md를 자동 생성, 품질 점수 산정, 최적화 제안 제공.', icon: 'sparkles' },
  { title: 'MCP 서버 시각화', body: '수동 JSON 작성과 작별, MCP 서버를 시각적으로 설정하고 도구 간 동기화.', icon: 'plug' },
  { title: '비용 모니터링 대시보드', body: '실시간 토큰 소비 추이, 도구/모델별 분류, 예산 경고.', icon: 'bar-chart-3' },
  { title: 'API Key 통합 관리', body: '도구 간 통합 저장 및 사용, 안전한 암호화.', icon: 'key' },
  { title: '프록시 및 네트워크', body: '시스템 프록시 자동 감지, Clash / V2Ray 원클릭 설정, API Endpoint 커스터마이징.', icon: 'shuffle' },
  { title: '설정 스냅샷', body: '저장 / 복원 / diff 비교, 시행착오 비용 제로.', icon: 'history' },
  { title: '프롬프트 템플릿 라이브러리', body: '고품질 템플릿 내장 + 사용자 정의 관리 + 가져오기/내보내기.', icon: 'package' },
  { title: '프로세스 관리', body: 'CLI 프로세스 모니터링: 목록 / 종료 / 실행 / 출력 확인.', icon: 'monitor' },
  { title: '자동 업데이트', body: 'GitHub Releases 자동 업데이트 + 도구 버전 확인.', icon: 'package-plus' },
]" title="" />

---

## 동작 원리

Switch는 로컬에서 OpenAI API 호환 엔드포인트(기본값 `http://localhost:11434/v1`)를 노출합니다. 애플리케이션은 `base_url`을 이 로컬 주소로 변경하기만 하면 되며, 이후 라우팅은 전적으로 Switch가 담당합니다.

<ArchitectureDiagram
  title="로컬 프록시 + 멀티 프로바이더 라우팅"
  chart="graph TD
    App[당신의 애플리케이션<br/>OpenAI SDK] --> SW[Lurus Switch<br/>localhost:11434]
    SW --> L[Lurus API]
    SW --> O[OpenAI 직접 연결]
    SW --> OL[Ollama<br/>로컬 모델]"
/>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="plug-zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">무침투 연동</p>
    <div class="lurus-callout__body"><code>base_url</code> 한 곳만 변경하면 기존 OpenAI SDK 호출이 모두 연결됩니다. 라우팅 규칙은 Switch에서 일괄 관리되며, 애플리케이션 코드는 이를 인지할 필요가 없습니다.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 활용 시나리오</span>
  <h2 class="lurus-section-head__title">누가 Switch를 사용하나</h2>
</div>

<UserScenarios title="" :scenarios="[
  { role: '멀티 CLI 사용자', title: '멀티 CLI 관리', summary: 'Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw 중 여러 개를 동시에 사용하며 통합 설정 관리가 필요합니다.', link: '/ko/switch/configuration' },
  { role: '비용 담당자', title: '비용 관리', summary: '여러 CLI를 병행 사용하며 통합된 비용 뷰와 예산 통제가 필요합니다.', link: '/ko/switch/cost-monitoring' },
  { role: '기술 팀', title: '팀 표준화', summary: '설정을 통합 배포하여 팀원이 일관된 AI CLI 설정을 사용하도록 보장합니다.', link: '/ko/switch/team-config' },
  { role: '한국 개발자', title: '네트워크 환경', summary: '프록시 설정, 한국어 인터페이스, 국내 / 해외 모델 원클릭 전환이 필요합니다.', link: '/ko/switch/configuration' },
]" />

---

## 다른 솔루션과의 비교

<ComparisonTable
  self-label="Switch"
  :competitors="['Aider', 'Cursor', '수동 관리']"
  :rows="[
    { dimension: 'CLI 커버리지', self: '5종 통합', alt: { Aider: '1종', Cursor: 'IDE 내장', '수동 관리': 'N/A' } },
    { dimension: 'MCP 관리', self: '시각화 + 동기화', alt: { Aider: '없음', Cursor: '개별 설정', '수동 관리': '수동 JSON 작성' } },
    { dimension: '비용 모니터링', self: '집계 대시보드', alt: { Aider: '없음', Cursor: '없음', '수동 관리': '없음' } },
    { dimension: '팀 동기화', self: 'Git + Vault', alt: { Aider: '없음', Cursor: '없음', '수동 관리': '없음' } },
  ]"
  title=""
/>

---

## 지원 플랫폼

| 플랫폼 | 버전 요구 사항 |
|------|---------|
| Windows | Windows 10 64-bit 이상 |
| macOS | macOS 12 (Monterey) 이상 |
| Linux | Ubuntu 20.04 / Debian 11 이상 |

---

## 다음 단계

<NextSteps :steps="[
  { text: '설치 가이드', link: '/ko/switch/install', primary: true },
  { text: '설정 안내', link: '/ko/switch/configuration' },
  { text: '사용 설명서', link: '/ko/switch/usage' },
]" title="" />

<RelatedProducts product-id="switch" />

</div>

<style>
.switch-page .lurus-section-head { margin-top: 8px; }
.switch-page .cap-grid__heading { display: none; }
</style>
