---
title: Kova — AI 에이전트 지속 실행 엔진
description: Rust로 구축한 WAL-First 아키텍처, 크래시 자동 복구, 마이크로초 단위 스케줄링, 외부 의존성 제로.
---

<div class="kova-page">

<ProductHero product-id="kova" />

<MetricStats :items="[
  { label: 'FIFO 스케줄링', value: '3.17μs', hint: 'Criterion 전체 파이프라인' },
  { label: '처리량', value: '315K ops/s' },
  { label: '코드 규모', value: '178K LOC', hint: '21개 crate 워크스페이스' },
  { label: '외부 의존성', value: '제로', hint: 'Redis / Postgres 불필요' },
]" />

## Kova란?

**Kova**는 Lurus 핵심 AI 에이전트 인프라로, Rust로 구축한 고성능 지속 실행 엔진이며 **에이전트가 어떻게 안정적으로 장시간 실행되고, 크래시 후 상태를 복구하며, 복잡한 워크플로를 협업하는지**를 해결합니다. 전통적인 프레임워크(LangChain, CrewAI)는 메모리에서 실행되어 프로세스가 종료되면 상태를 잃습니다. Kova는 <Term t="WAL">WAL（Write-Ahead Log）</Term> 우선 아키텍처를 채택하여 매 단계 실행을 지속적으로 기록하므로, 크래시가 발생해도 중단 지점으로 정확히 복구할 수 있습니다——LLM을 재호출하지 않고, 진행 상황을 잃지 않으며, 추가 비용도 발생하지 않습니다.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">핵심 지표</p>
    <div class="lurus-callout__body"><Term t="FIFO">FIFO</Term> 전체 파이프라인 지연 <strong>3.17μs</strong>（Criterion 벤치마크, <code>docs/benchmark-report.md</code> 참고）, 처리량 <strong>315K ops/s</strong>, <strong>외부 서비스 의존성 제로</strong>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> 핵심 역량</span>
  <h2 class="lurus-section-head__title">왜 Kova를 선택하는가</h2>
  <p class="lurus-section-head__lede">WAL-First 지속성, 마이크로초 단위 스케줄링, 의존성 제로 배포, 네 가지 접속 방식.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-kova)"
  :items="[
    { title: 'WAL 크래시 복구', body: '매 단계 실행 전 로그 기록 + CRC32 검증, 크래시 후 중단 지점부터 재생, LLM 재호출 없음', icon: 'database-backup' },
    { title: '3μs 스케줄링 지연', body: 'FIFO 전체 파이프라인 Criterion 벤치마크 3.17μs, 315K ops/s 처리량', icon: 'gauge' },
    { title: '외부 의존성 제로', body: 'Redis / Postgres 불필요, 로컬 WAL 파일만으로 실행 가능', icon: 'package' },
    { title: '네 가지 접속 방식', body: 'Rust SDK / gRPC / REST / MCP, 21개 워크스페이스 crate 모듈화', icon: 'puzzle' },
  ]"
/>

### WAL-First 지속성

모든 상태 변경은 실행 전 먼저 WAL에 기록되며, 크래시 시 WAL에서 재생합니다:

<ol class="lurus-steps">
<li>

**에이전트 결정** — 엔진이 다음 단계 동작을 확정

</li>
<li>

**WAL 기록（CRC32）** — 지속 기록 + 체크섬으로 손상 방지

</li>
<li>

**실행** — 실제로 도구 / LLM 호출

</li>
<li>

**완료 확인** — 해당 단계가 반영되었음을 표시; 크래시 시 미확인 단계는 자동 재생

</li>
</ol>

CRC32 검증으로 손상을 방지하고, Power-of-2 링 버퍼로 저장 공간을 효율적으로 활용하며, 락 순서 **Buffer → Queue → Txn**을 엄격히 보장하여 교착 상태를 완전히 차단합니다.

### 에이전트 오케스트레이션

| 모드 | 설명 | 적용 시나리오 |
|------|------|---------|
| **단일 에이전트** | 독립적으로 작업 실행 | 단순 자동화 |
| **워크플로** | 여러 단계의 순차 실행 | 데이터 파이프라인, 승인 프로세스 |
| **집단 지능 (Swarm)** | 다중 에이전트 자율 협업 | 복잡한 연구, 다중 역할 시뮬레이션 |

### 도구 생태계와 멀티 모델

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span>
    <div class="lurus-card__title">도구 생태계</div>
    <p class="lurus-card__body">내장 도구（파일 / HTTP / 데이터베이스 / Shell）, <Term t="MCP">MCP</Term>（MCP 호환 도구 서비스에 연결, <a href="/integrations/">통합 디렉터리</a> 참고）, <Term t="A2A">A2A</Term>（에이전트 간 직접 통신 및 작업 위임）, 커스텀 도구（Rust 또는 REST API 확장）.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">멀티 모델 지원</div>
    <p class="lurus-card__body"><a href="/ko/guide/introduction">Lurus API</a>를 통해 모든 주요 LLM에 접속（DeepSeek 일상 / GPT-4o 추론 / Claude 장문 / Gemini 멀티모달）, 런타임에 작업에 따라 동적으로 전환.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> 아키텍처</span>
  <h2 class="lurus-section-head__title">아키텍처 개요</h2>
  <p class="lurus-section-head__lede">REST/SDK/gRPC/MCP 접속 · Kova Core 스케줄링 · WAL 지속화 복구.</p>
</div>

<ArchitectureDiagram
  title="Kova 실행 아키텍처"
  chart="graph LR
  A[Client SDK / gRPC / REST] --> B[Kova Core]
  B --> C[WAL Writer<br/>CRC32]
  B --> D[Scheduler<br/>FIFO]
  B --> E[Tool Runtime<br/>MCP]
  C -.recover.-> B
  D --> F[LLM Provider<br/>via Lurus API]"
/>

```
Kova REST API (Axum: 35+ endpoints, WebSocket)
 → Kova Core: Agent Engine(단/다 Agent) + Workflow(有序编排)
              → WAL + Ring Buffer(持久化状态管理 CRC32)
              子 crate: kova-llm / kova-tools / kova-mcp
```

Kova는 **21개 Rust crate**의 워크스페이스이며, **178,284 줄의 코드**, **1,565개 이상의 테스트**（loom 동시성 / proptest / chaos） + **4개 fuzz target**으로 구성됩니다. 현재 **v0.2.0 프리릴리스**（1.0.0-beta.1을 향해）이며, 엄격한 lint를 전면 활성화했습니다（`#[deny(clippy::unwrap_used, clippy::panic, missing_docs)]`）.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> 시나리오</span>
  <h2 class="lurus-section-head__title">적용 시나리오</h2>
</div>

| 시나리오 | Kova의 강점 |
|------|-----------|
| **장시간 실행되는 에이전트** | WAL 지속화, 크래시 후 자동 복구 |
| **복잡한 워크플로** | 여러 단계 오케스트레이션, 조건 분기, 병렬 실행 |
| **다중 에이전트 협업** | Swarm 모드, 에이전트 간 직접 통신 |
| **엔터프라이즈급 배포** | Rust 성능, 낮은 리소스 점유, GC 정지 없음 |
| **MCP 도구 통합** | Model Context Protocol 네이티브 지원 |
| **보안 민감 시나리오** | 선택적 암호화 (SM4/AES), WAL HMAC 무결성 검증 |

<UserScenarios
  title="역할별 시작하기"
  :scenarios="[
    { role: '개발자', title: '5분 만에 지속화 에이전트 띄우기', summary: 'cargo add kova + 3줄 코드', link: '/ko/kova/quickstart' },
    { role: '아키텍트', title: 'LangGraph Checkpointer 교체', summary: 'LangGraph 프로젝트에서 Kova로 checkpoint 저장', link: '/tutorials/lumen-kova-langgraph' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 벤치마크</span>
  <h2 class="lurus-section-head__title">다른 에이전트 프레임워크와의 비교</h2>
</div>

| 역량 | LangChain | CrewAI | AutoGen | **Kova** |
|------|-----------|--------|---------|----------|
| 언어 | Python | Python | Python | **Rust** |
| 상태 지속화 | 없음（외부 필요） | 없음 | 없음 | **WAL-First** |
| 크래시 복구 | 없음 | 없음 | 없음 | **자동 복구** |
| 성능 | 중 | 중 | 중 | **극히 높음** |
| 메모리 효율 | 낮음 | 낮음 | 낮음 | **극히 높음** |
| MCP 지원 | 서드파티 | 없음 | 없음 | **네이티브** |
| A2A 프로토콜 | 없음 | 없음 | 없음 | **네이티브** |
| 암호화 기능 | 없음 | 없음 | 없음 | **SM4-GCM / ChaCha20** |
| 멀티 프로토콜 | 없음 | 없음 | 없음 | **네 가지 접속 방식: Rust SDK / gRPC / REST / MCP** |
| 배포 형태 | Python 프로세스 | Python 프로세스 | Python 프로세스 | **단일 바이너리 / 컨테이너 / 임베디드 라이브러리** |

---

## 다음 단계

<NextSteps
  :steps="[
    { text: '빠른 시작 — 첫 번째 Kova 에이전트를 띄워보기', link: '/ko/kova/quickstart', primary: true },
    { text: '핵심 개념 — WAL, Agent, Workflow 깊이 이해하기', link: '/ko/kova/concepts' },
    { text: 'API 참조 — 완전한 REST API 문서', link: '/ko/kova/api' },
    { text: '통합 및 MCP 디렉터리', link: '/integrations/' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="kova" />

</div>

<style>
.kova-page .lurus-card--kova .lurus-card__body a {
  color: var(--lurus-color-kova);
  font-weight: 600;
}
</style>
