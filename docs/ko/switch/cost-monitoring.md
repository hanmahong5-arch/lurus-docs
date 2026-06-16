---
title: Switch — 비용 모니터링
description: 5종 CLI의 비용 집계, 임계값 알림, 귀인 분석, Lumen 연동.
---

<div class="switch-page">

# 비용 모니터링 <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> 비용 대시보드</span>
  <h2 class="lurus-section-head__title">5종 CLI의 토큰 소비를 한곳에 집계</h2>
  <p class="lurus-section-head__lede">Switch는 Claude Code / Codex / Gemini / PicoClaw / NullClaw 등 도구의 토큰 소비를 통합 집계하고, 예산을 초과하기 전에 알림을 보냅니다.</p>
</div>

## 비용 집계

Switch 백그라운드 프로세스를 시작한 뒤에는, Switch가 실행한 모든 CLI 프로세스의 요청이 로컬 프록시(기본값 `127.0.0.1:41234`)를 거쳐 로컬 SQLite에 기록됩니다:

```
~/.lurus-switch/costs.db
```

집계 차원:

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="terminal" :size="20" /></span>
    <div class="lurus-card__title">도구</div>
    <p class="lurus-card__body">claude-code / codex / gemini / picoclaw / nullclaw</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">모델</div>
    <p class="lurus-card__body">claude-sonnet-4 / gpt-5 / gemini-3-pro 등</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">프로젝트</div>
    <p class="lurus-card__body">CWD가 속한 git 저장소 root 기준</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="timer" :size="20" /></span>
    <div class="lurus-card__title">시간</div>
    <p class="lurus-card__body">일 / 주 / 월</p>
  </div>
</div>

## 임계값 알림

Switch 설정 페이지에서 구성합니다:

| 알림 유형 | 예시 |
|---------|------|
| 일일 예산 | ¥50/일 초과 시 시스템 알림 |
| 단일 호출 | ¥2/회 초과 시 빨간색 표시 |
| 모델 비중 | Claude Opus > 60% 일 때 등급 변경 권고 |

알림 채널: <span class="lurus-tag">시스템 알림</span> <span class="lurus-tag">이메일</span> <span class="lurus-tag">Webhook</span>

## 귀인 분석

> "오늘 왜 갑자기 이렇게 많이 썼지?"

Switch는 **플레임 그래프식** 귀인을 제공하여, 단계별로 구체적인 원인까지 파고듭니다:

```
총 소비 ¥38.2 (↑ 250% vs 昨日)
├─ claude-code   ¥28.4 (74%)  ← 主因
│   └─ 项目: 2l-bs-docs       ¥21.3  ← 具体元凶
│       └─ 模型: claude-opus  ¥19.8
├─ codex         ¥6.5
└─ gemini        ¥3.3
```

## Lumen 연동

Lumen SDK를 사용하는 Agent 프로젝트의 경우, Switch는 Lumen의 세분화된 Trace 데이터를 병합할 수 있습니다:

```
Switch 粗粒度: 项目 / 工具 / 模型
     +
Lumen 细粒度: Graph / Node / LLM Call
     =
完整成本拓扑
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="git-merge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Lumen 통합 활성화</p>
    <div class="lurus-callout__body">Switch 설정에서 「Lumen 통합」을 활성화하고 <code>http://localhost:7070</code> 을 가리키도록 설정하면, Switch의 거시 단위 비용과 Lumen의 Graph / Node / LLM Call 수준 Trace를 완전한 비용 토폴로지로 병합할 수 있습니다.</div>
  </div>
</div>

## 내보내기

UI 조작:

```
우클릭 → CSV / JSON 으로 내보내기
```

또는 명령줄:

```bash
lurus-switch export --format csv --since 30d > costs.csv
```

## 다음 단계

<NextSteps :steps="[
  { text: 'MCP 서버 관리', link: '/ko/switch/mcp-servers', primary: true },
  { text: '팀 동기화', link: '/ko/switch/team-config' },
  { text: 'Lumen 비용 추적', link: '/ko/lumen/python-sdk' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
