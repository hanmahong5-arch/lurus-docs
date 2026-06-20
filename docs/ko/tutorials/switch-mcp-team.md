---
title: "팀 AI CLI 통합 접속 (Switch + MCP + 게이트웨이)"
description: "Switch로 팀의 AI CLI 도구, MCP 서버, 모델 비용을 통합 관리합니다 —— 하나의 중앙 설정으로 Claude Code / Codex / Gemini 전반에 동기화합니다."
---

<div class="tut-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="monitor" :size="14" /> 제품 간 튜토리얼</span>
  <h1 class="lurus-section-head__title">팀 AI CLI 통합 접속</h1>
  <p class="lurus-section-head__lede">각 엔지니어의 기기에 흩어져 있는 AI CLI 설정, MCP 서버, 모델 Key를 <strong>하나의 중앙 설정</strong>으로 수렴합니다: Switch가 MCP와 동기화를 맡고, Lurus API가 모델과 과금을 맡습니다.</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">연동 제품</p>
    <div class="lurus-callout__body">Switch(데스크톱 도구 관리) · Lurus API(통합 게이트웨이) · MCP 서버(Kova / GitHub / PostgreSQL 등). 본 튜토리얼은 각 제품 문서에 이미 있는 기능만 참조합니다.</div>
  </div>
</div>

## <Icon name="package" :size="20" /> 얻게 되는 것

| Before(제각각) | After(Switch 통합) |
|---|---|
| 각자 `mcp_servers.json`을 직접 작성, 도구 버전 제각각 | 하나의 중앙 `mcp.yaml`, `visible_to`로 필요에 따라 배포 |
| CLI마다 따로 Provider Key 입력 | 통합 Lurus API 경유, Key 하나, 청구서 하나 |
| 모델 비용 비가시 | Switch 비용 대시보드가 도구 / 모델별로 집계 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> 1단계</span>
  <h2 class="lurus-section-head__title">Switch 설치 후 게이트웨이에 연결</h2>
</div>

<ol class="lurus-steps">
<li>

[설치 가이드](/ko/switch/install)에 따라 Switch(macOS / Windows / Linux)를 설치합니다.

</li>
<li>

설정에서 Lurus <Term t="API Key">API Key</Term>([발급 방법](/ko/guide/get-api-key))를 입력하면, 모든 CLI가 `https://api.lurus.cn/v1`을 통해 통합으로 모델을 호출합니다 —— Key 하나, 청구서 하나.

</li>
<li>

로컬 프록시가 기동되었는지 확인합니다(기본 포트 19090):

```bash
curl http://localhost:19090/v1/models
```

</li>
</ol>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug" :size="14" /> 2단계</span>
  <h2 class="lurus-section-head__title">중앙 MCP 설정 하나 작성하기</h2>
  <p class="lurus-section-head__lede">Switch는 하나의 <code>~/.lurus-switch/mcp.yaml</code>로 모든 MCP 서버를 관리하며, <code>visible_to</code>가 각 CLI가 어떤 것을 보는지 결정합니다.</p>
</div>

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

  kova:                       # Kova Agent 作为工具暴露
    url: http://localhost:3333
    type: http
    visible_to: [claude-code, codex, gemini]
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shuffle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">visible_to가 필요에 따른 배포를 구동</p>
    <div class="lurus-callout__body">어느 CLI로 전환하든 Switch는 <code>visible_to</code>에 따라 해당 CLI의 <code>mcp_servers.json</code>을 동적으로 생성하며, 각 도구는 자신에게 할당된 Server만 봅니다. 접속 가능한 서버 목록은 <a href="/ko/integrations/">통합 카탈로그</a>를, 관리 세부 사항은 <a href="/ko/switch/mcp-servers">MCP 서버</a>를 참조하세요.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 3단계</span>
  <h2 class="lurus-section-head__title">비용을 확인한 뒤 팀에 동기화</h2>
</div>

<ol class="lurus-steps">
<li>

Switch의 <a href="/ko/switch/cost-monitoring">비용 모니터링</a>을 열어 도구 / 모델별 Token 소비를 확인합니다 —— 모든 호출이 동일한 Lurus API Key를 경유하므로 청구서가 통합되어 있습니다.

</li>
<li>

설정에 문제가 없음을 확인한 뒤, <a href="/ko/switch/team-config">팀 동기화</a>로 이 `mcp.yaml`을 팀에 배포하면 신규 멤버는 즉시 사용할 수 있고 버전이 일관됩니다.

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">다음으로 추가할 수 있는 것</p>
    <div class="lurus-callout__body"><p>CLI에 <a href="/ko/memx/quickstart">MemX 메모리</a>(<code>memory_search</code> / <code>memory_add</code> 도구)를 연결해 Agent가 프로젝트 규약을 기억하게 하거나, <a href="/ko/lumen/">Lumen</a>을 연결해 호출 추적과 비용 경보를 구성하세요.</p></div>
  </div>
</div>

<NextSteps
  title="다음 단계"
  :steps="[
    { text: 'Switch MCP 서버', link: '/ko/switch/mcp-servers', primary: true },
    { text: '통합 및 MCP 카탈로그', link: '/ko/integrations/' },
    { text: '메모리 Agent 튜토리얼', link: '/ko/tutorials/memory-agent' },
  ]"
/>

</div>
