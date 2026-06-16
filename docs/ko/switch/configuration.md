---
title: Switch 구성 설명
description: Switch의 AI 도구 구성, MCP 서버 관리 및 비용 모니터링 설정.
---

<div class="switch-page">

# Switch 구성 설명

## 구성 화면 열기

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">메뉴 바 아이콘</div>
    <p class="lurus-card__body">macOS / Linux: 메뉴 바 아이콘 클릭 → "구성".</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">시스템 트레이</div>
    <p class="lurus-card__body">Windows: 트레이 아이콘 우클릭 → "구성 열기".</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">단축키</div>
    <p class="lurus-card__body"><span class="lurus-kbd">Ctrl+Shift+S</span>(Win/Linux) / <span class="lurus-kbd">Cmd+Shift+S</span>(macOS).</p>
  </div>
</div>

---

## 모델 제공자 추가

"**<Term t="Provider">제공자</Term>**" 탭 → "**제공자 추가**", 제공자 이름 + API Base URL + API Key 입력:

| 제공자 | API Base URL | API Key |
|------|------|------|
| **Lurus API** <span class="lurus-tag">권장</span> | `https://api.lurus.cn/v1` | Lurus Key(`sk-`로 시작); 모델은 "자동 감지" 클릭 |
| **OpenAI** | `https://api.openai.com/v1` | `sk-...`(공식) |
| **Anthropic** | `https://api.anthropic.com/v1` | `sk-ant-...` |
| **Ollama**(로컬) | `http://localhost:11434/v1` | (비워 둠) |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> 라우팅</span>
  <h2 class="lurus-section-head__title">라우팅 규칙 구성</h2>
  <p class="lurus-section-head__lede">어떤 요청이 어느 제공자로 가는지 정의하며, 매칭되지 않는 요청은 기본 제공자로 갑니다(기본값 → Lurus API).</p>
</div>

**모델 이름으로 라우팅**: `gpt-*` → OpenAI; `claude-*` → Anthropic; `deepseek-*` / `*`(기타) → Lurus API; `llama*` → Ollama. JSON:

```json
{ "rules": [
    { "pattern": "gpt-*", "provider": "OpenAI" },
    { "pattern": "claude-*", "provider": "Anthropic" },
    { "pattern": "llama*", "provider": "Ollama" },
    { "pattern": "*", "provider": "Lurus API" }
  ] }
```

**애플리케이션으로 라우팅(고급)**: 서로 다른 로컬 애플리케이션마다 다른 라우팅 설정:

```json
{
  "app_rules": [
    {
      "app": "cursor",
      "default_provider": "Lurus API",
      "model_override": "deepseek-reasoner"
    },
    {
      "app": "continue",
      "default_provider": "Ollama"
    }
  ]
}
```

---

## 프록시 포트 구성

"**일반**" → "**수신 포트**", 기본값 `11434`. 포트 충돌(예: Ollama와 충돌) 시 다른 포트(예: `11435`)로 변경하고, 애플리케이션 측에서 `base_url=http://localhost:11435/v1`을 그에 맞게 수정합니다(`api_key`는 아무 값이나 입력, Switch는 구성된 provider key를 사용).

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">포트 충돌</p>
    <div class="lurus-callout__body">기본 포트 <code>11434</code>는 Ollama의 기본 포트와 동일합니다. 둘을 같은 머신에서 실행할 때는 Switch를 다른 포트(예: <code>11435</code>)로 변경하고 애플리케이션 측의 <code>base_url</code>도 함께 업데이트하세요.</div>
  </div>
</div>

---

## 전체 구성 파일

Switch 구성은 다음 위치에 저장됩니다:

| 플랫폼 | 경로 |
|------|------|
| Windows | `%APPDATA%\LurusSwitch\config.json` |
| macOS | `~/Library/Application Support/LurusSwitch/config.json` |
| Linux | `~/.config/LurusSwitch/config.json` |

전체 `config.json` 예시:

```json
{
  "listen_port": 11434,
  "log_requests": true,
  "start_on_login": true,
  "providers": [
    {
      "name": "Lurus API",
      "base_url": "https://api.lurus.cn/v1",
      "api_key": "sk-your-lurus-key",
      "enabled": true
    },
    {
      "name": "Ollama",
      "base_url": "http://localhost:11434/v1",
      "api_key": "",
      "enabled": true
    }
  ],
  "routing": {
    "default_provider": "Lurus API",
    "rules": [
      { "pattern": "llama*",  "provider": "Ollama" },
      { "pattern": "qwen*",   "provider": "Ollama" },
      { "pattern": "*",       "provider": "Lurus API" }
    ]
  }
}
```

---

## 구성 검증

"**상태**" 탭에 표시되는 내용: 각 제공자의 연결 상태(녹색=정상, 빨간색=실패), 현재 활성화된 라우팅 규칙, 최근 요청 로그. 명령줄 검증(정상 JSON이 반환되면 성공):

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"ping"}]}'
```

---

## 다음 단계

<NextSteps :steps="[
  { text: '비용 모니터링', link: '/ko/switch/cost-monitoring', primary: true },
  { text: 'MCP 서버', link: '/ko/switch/mcp-servers' },
  { text: '팀 구성', link: '/ko/switch/team-config' },
]" title="" />

</div>

<style>
.switch-page .lurus-section-head { margin-top: 8px; }
</style>
