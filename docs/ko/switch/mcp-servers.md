---
title: Switch — MCP 서버 관리
description: MCP 서버를 시각적으로 구성하고 디버깅하며, 여러 AI CLI 간에 동기화합니다.
---

<div class="switch-page">

# MCP 서버 관리 <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug" :size="14" /> 통합 관리</span>
  <h2 class="lurus-section-head__title">하나의 중앙 구성으로 여러 CLI 간 동기화</h2>
  <p class="lurus-section-head__lede">Switch는 Claude Code / Codex / Gemini 각각의 <code>mcp_servers.json</code>에 흩어져 있던 구성을 통합 관리하고, 시각적 디버깅 기능을 제공합니다.</p>
</div>

## MCP 관리자

Switch 열기 → 왼쪽 "MCP 서버"에서 다음을 확인할 수 있습니다:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">등록 상태</div>
    <p class="lurus-card__body">현재 등록된 모든 MCP Server, 상태 포함 <span class="lurus-tag">running</span> <span class="lurus-tag">stopped</span> <span class="lurus-tag">errored</span></p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="share-2" :size="20" /></span>
    <div class="lurus-card__title">참조 관계</div>
    <p class="lurus-card__body">각 Server가 어떤 CLI에서 참조되는지</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">호출 기록</div>
    <p class="lurus-card__body">최근 N회의 도구 호출 기록</p>
  </div>
</div>

## 구성 형식

Switch는 하나의 중앙 `~/.lurus-switch/mcp.yaml`을 사용합니다:

```yaml
servers:
  github:
    command: npx
    args: [-y, '@modelcontextprotocol/server-github']
    env:
      GITHUB_TOKEN: ${GITHUB_TOKEN}
    visible_to: [claude-code, codex]

  postgres:
    command: docker
    args: [run, -i, --rm, mcp/postgres, 'postgres://localhost/dev']
    visible_to: [claude-code]

  kova:
    url: http://localhost:3333
    type: http
    visible_to: [claude-code, codex, gemini]
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shuffle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">visible_to 기반 온디맨드 배포</p>
    <div class="lurus-callout__body">CLI를 전환할 때마다 Switch는 <code>visible_to</code>에 따라 해당 CLI의 <code>mcp_servers.json</code>을 동적으로 생성하며, 각 도구는 자신에게 할당된 Server만 보게 됩니다.</div>
  </div>
</div>

## 디버깅

Server 하나를 선택하면 오른쪽 디버그 패널에서:

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span>
    <div class="lurus-card__title">Tools 목록</div>
    <p class="lurus-card__body">Server가 노출하는 모든 도구, 입력 매개변수 schema 포함</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">수동 호출</div>
    <p class="lurus-card__body">매개변수를 입력해 직접 테스트</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">Request Log</div>
    <p class="lurus-card__body">최근 request/response의 전체 JSON</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="rewind" :size="20" /></span>
    <div class="lurus-card__title">재시작</div>
    <p class="lurus-card__body">프로세스 레벨 재시작</p>
  </div>
</div>

## 자주 쓰는 Server 빠른 연동

Switch에는 원클릭 설치 버튼이 내장되어 있어 구성을 직접 작성할 필요가 없습니다:

| Server | 용도 |
|--------|------|
| `github` | issues / PR / file 읽기·쓰기 |
| `postgres` | 데이터베이스 쿼리 |
| `filesystem` | 로컬 파일 읽기·쓰기 |
| `slack` | 메시지 전송 / 채널 읽기 |
| `kova` | Kova Agent를 도구로 사용 |
| `lumen` | Lumen Trace / Replay |

## 팀에 동기화

[팀 동기화](/ko/switch/team-config)를 참조하세요.

## 다음 단계

<NextSteps :steps="[
  { text: '비용 모니터링', link: '/ko/switch/cost-monitoring', primary: true },
  { text: '팀 동기화', link: '/ko/switch/team-config' },
  { text: '사용 설명서로 돌아가기', link: '/ko/switch/usage' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
