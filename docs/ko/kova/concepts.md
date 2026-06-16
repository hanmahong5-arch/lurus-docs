---
title: Kova 핵심 개념
description: Kova의 WAL, Agent Loop, Checkpoint 등 핵심 아키텍처 구성 요소와 설계 철학.
---

<div class="kova-concepts">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> 핵심 개념</span>
  <h1 class="lurus-section-head__title">Kova 핵심 개념</h1>
  <p class="lurus-section-head__lede">Agent, Workflow, Swarm부터 WAL 영속화까지 —— Kova의 핵심 아키텍처 구성 요소와 설계 철학을 이해합니다.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3μs</span><span class="lurus-stat__label">스케줄링 지연</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">315K</span><span class="lurus-stat__label">ops/s 처리량</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">21</span><span class="lurus-stat__label">workspace crate</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">&lt;10MB</span><span class="lurus-stat__label">단일 바이너리</span></div>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--kova" href="#agent"><span class="lurus-card__icon"><Icon name="bot" :size="22" /></span><div class="lurus-card__title">Agent</div><p class="lurus-card__body">기본 실행 단위: Prompt + Model + Tools + Memory</p></a>
  <a class="lurus-card lurus-card--kova" href="#workflow"><span class="lurus-card__icon"><Icon name="workflow" :size="22" /></span><div class="lurus-card__title">Workflow</div><p class="lurus-card__body">여러 Agent를 순차 실행 파이프라인으로 오케스트레이션</p></a>
  <a class="lurus-card lurus-card--kova" href="#swarm-군집-지능"><span class="lurus-card__icon"><Icon name="network" :size="22" /></span><div class="lurus-card__title">Swarm</div><p class="lurus-card__body">다중 Agent 자율 협업, A2A 프로토콜로 직접 통신</p></a>
  <a class="lurus-card lurus-card--kova" href="#wal-write-ahead-log"><span class="lurus-card__icon"><Icon name="database-backup" :size="22" /></span><div class="lurus-card__title">WAL</div><p class="lurus-card__body">선행 기록 로그 + CRC32 검증, 크래시 시 자동 복구</p></a>
</div>

---

## Agent

Agent는 기본 실행 단위이며, 다음 요소로 구성됩니다:

| 요소 | 설명 |
|------|------|
| **<Term t="System Prompt">System Prompt</Term>** | Agent의 역할, 능력 경계, 행동 규범을 정의 |
| **Model** | 사용하는 LLM 모델 (런타임에 전환 가능) |
| **Tools** | Agent가 호출할 수 있는 도구 집합 |
| **Memory** | Agent의 세션 이력과 영속화 상태 |

### Agent 라이프사이클

<ArchitectureDiagram title="Agent 상태 기계" chart="graph LR
  Created --> Idle
  Idle --> Running
  Running --> Completed
  Running --> Paused
  Running --> Failed
  Running --> Recovering
  Paused -.복구.-> Running
  Recovering -.WAL 재생.-> Running" />

| 상태 | 의미 |
|------|------|
| **Idle** | Agent 생성 완료, 작업 대기 중 |
| **Running** | 작업 실행 중 |
| **Paused** | 수동 일시 정지, 복구 가능 |
| **Completed** | 작업 완료 |
| **Failed** | 실행 실패 (재시도 횟수 초과) |
| **Recovering** | 미완료 WAL 레코드 감지, 자동 복구 |

### Agent 결정 루프

<ArchitectureDiagram title="결정 루프" chart="graph LR
  A[작업 / 이전 단계 결과 수신] --> B[LLM 추론<br/>분석 + 계획]
  B --> C{도구가 필요한가?}
  C -->|Yes| D[도구 호출] --> E[도구 결과] --> B
  C -->|No| F[최종 답변 생성] --> G[결과 반환]" />

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">매 라운드마다 디스크에 기록</p>
    <div class="lurus-callout__body">모든 결정 라운드는 WAL에 기록되어, 크래시 후 중단 지점부터 재생할 수 있으며 LLM을 다시 호출할 필요가 없습니다.</div>
  </div>
</div>

---

## Workflow

Workflow는 여러 Agent 또는 단계를 순차 실행 파이프라인으로 오케스트레이션합니다.

### 단계 유형

| 유형 | 설명 |
|------|------|
| **Agent 단계** | 지정된 Agent에 위임하여 실행 |
| **조건 분기** | 이전 단계 결과에 따라 서로 다른 경로 선택 |
| **병렬 단계** | 여러 단계를 동시에 실행 |
| **대기 단계** | 외부 이벤트 또는 수동 승인 대기 |
| **루프 단계** | 조건을 만족할 때까지 반복 실행 |

### 데이터 전달

단계 간에는 템플릿 변수로 데이터를 전달합니다:

```
{{input.topic}}              → 워크플로 입력 파라미터
{{steps.research.output}}    → "research" 단계의 출력
{{steps.research.metadata}}  → "research" 단계의 메타데이터
```

### 오류 처리

각 단계는 독립적인 오류 정책을 설정할 수 있습니다:

| 정책 | 동작 |
|------|------|
| `retry` | N회 재시도 (기본 3회, 지수 백오프) |
| `skip` | 실패한 단계를 건너뛰고 계속 실행 |
| `abort` | 전체 워크플로 종료 |
| `fallback` | 대체 단계로 전환 |

---

## <Term t="Swarm">Swarm</Term>（군집 지능）

Swarm 모드는 여러 Agent가 사전 정의된 고정 프로세스 없이 자율적으로 협업하도록 합니다.

### 작동 방식

<ArchitectureDiagram title="Swarm 협업 흐름" chart="graph LR
  U[사용자 작업] --> C[조정자 Agent]
  C --> S[하위 작업 분해]
  S --> R[리서치 Agent]
  S --> D[코딩 Agent]
  S --> T[테스트 Agent]
  R --> M[결과 수집]
  D --> M
  T --> M
  M --> O[종합 출력]" />

Agent 간에는 <Term t="A2A">A2A（Agent-to-Agent）</Term> 프로토콜로 직접 통신합니다:

```json
{
  "from": "coordinator",
  "to": "researcher",
  "type": "task_delegate",
  "payload": {
    "task": "调研 WebAssembly 在服务端的性能基准",
    "constraints": {
      "max_tokens": 2000,
      "deadline": "5min"
    }
  }
}
```

---

## <Term t="WAL">WAL</Term>（Write-Ahead Log）

WAL은 Kova 영속화의 핵심 메커니즘이며, 데이터베이스 시스템 설계를 차용했습니다.

### 쓰기 흐름

<ArchitectureDiagram title="WAL 쓰기 흐름" chart="graph LR
  A[Agent 상태 변경] --> B[직렬화 + CRC32<br/>체크섬 계산]
  B --> C[WAL 파일에 기록<br/>로그 우선 기록]
  C --> D[실제 작업 수행]
  D --> E[WAL 완료 표시<br/>커밋 확인]" />

### 복구 흐름

시작 시 WAL을 자동으로 스캔하여 미완료 작업을 복구합니다:

<ol class="lurus-steps">
<li>완료된 레코드 —— <strong>건너뜀</strong>.</li>
<li>CRC32 검증 실패 —— <strong>손상으로 표시하고 건너뜀</strong>.</li>
<li>미완료 레코드 —— <strong>재실행</strong>.</li>
</ol>

### <Term t="Ring Buffer">링 버퍼</Term>

WAL은 2의 거듭제곱 크기의 링 버퍼를 사용합니다:

- 쓰기 포인터가 끝에 도달하면 자동으로 되감김
- 확인된 오래된 레코드는 새 레코드로 덮어쓰임
- 버퍼가 가득 차면 compaction 트리거

### 동기화 모드

| 모드 | 설명 | 성능 | 내구성 |
|------|------|------|--------|
| `normal` | 운영체제가 fsync 시점을 결정 | 높음 | 수 초 분량의 데이터 손실 가능 |
| `full` | 매 쓰기마다 fsync | 낮음 | 데이터 손실 없음 |

### 암호화 옵션

민감한 시나리오에서는 WAL 암호화를 활성화할 수 있습니다:

| 알고리즘 | 설명 |
|------|------|
| `aes-256-gcm` | 표준 AES-256 암호화 |
| `sm4` | 중국 국가 표준 SM4 알고리즘 |

동시에 HMAC 무결성 검증을 활성화하여 WAL 파일의 변조를 방지할 수 있습니다.

---

## 잠금 순서

Kova는 내부적으로 엄격한 잠금 획득 순서를 사용하여 데드락을 근본적으로 차단합니다:

<ArchitectureDiagram title="잠금 획득 순서" chart="graph LR
  A[Buffer Lock] --> B[Queue Lock] --> C[Transaction Lock]" />

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">컴파일 타임 데드락 방지</p>
    <div class="lurus-callout__body">모든 코드 경로는 이 순서를 준수해야 합니다. 순서를 위반하여 잠금을 획득하려고 하면 컴파일 타임 검사가 트리거됩니다 (Rust 타입 시스템으로 보장).</div>
  </div>
</div>

---

## 도구 시스템

### 내장 도구

| 도구 | 기능 |
|------|------|
| `web_search` | 인터넷 검색 |
| `file_read` | 파일 읽기 |
| `file_write` | 파일 쓰기 |
| `http_request` | HTTP 요청 전송 |
| `shell_exec` | Shell 명령 실행 (샌드박스 환경) |
| `db_query` | 데이터베이스 쿼리 |

### MCP 도구

[Model Context Protocol](https://modelcontextprotocol.io/)을 통해 외부 도구 서비스에 연결합니다:

```toml
# kova.toml
[[mcp.servers]]
name = "github"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
env = { GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_xxx" }

[[mcp.servers]]
name = "postgres"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-postgres"]
env = { DATABASE_URL = "postgres://..." }
```

Agent는 내장 도구를 사용하듯이 MCP 도구를 호출할 수 있습니다.

### A2A 프로토콜

Agent-to-Agent 통신 프로토콜로, 다음을 지원합니다:

- **작업 위임**: 한 Agent가 하위 작업을 다른 Agent에 넘김
- **정보 조회**: Agent 간 직접 정보 교환
- **결과 통지**: 작업 완료 후 요청자에게 통지
- **능력 탐색**: 다른 Agent가 무엇을 할 수 있는지 조회

---

## 기능 계층

Kova는 Rust feature flags로 컴파일 범위를 제어합니다. 최소 컴파일에는 `pure-rust`만 필요하며, 필요에 따라 누적합니다: `serde`(직렬화), `workflow`(워크플로 오케스트레이션) → `agent`(Agent 엔진) → `swarm`(군집 지능), `encrypt`(암호화) → `sm4`(중국 국가 표준) / `wal-hmac`(무결성 검증) 등.

---

## 다음 단계

<NextSteps title="다음 단계" :steps="[
  { text: '빠른 시작 — 5분 만에 첫 Agent 시작하기', link: '/ko/kova/quickstart', primary: true },
  { text: 'API 참조 — 완전한 REST 엔드포인트 문서', link: '/ko/kova/api' },
  { text: 'MemX 메모리 엔진 — Agent에 영속 메모리 추가하기', link: '/ko/memx/' },
]" />

<RelatedProducts product-id="kova" />

</div>

<style scoped>
.kova-concepts .lurus-stat-strip {
  margin: 1.5rem 0 2rem;
}
.kova-concepts .lurus-cards--compact {
  margin-bottom: 0.5rem;
}
</style>
