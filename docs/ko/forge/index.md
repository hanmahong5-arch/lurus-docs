---
title: "Forge — AI 제품 개발 워크벤치"
description: "웹 기반 AI 제품 협업 개발 플랫폼으로, 팀이 함께 AI 애플리케이션을 구축하도록 지원합니다."
---

<div class="forge-page">

<ProductHero product-id="forge" />

::: warning 내부 R&D 플랫폼(상용 SaaS 아님)
Forge는 현재 Lurus의 **내부 R&D 도구**(ontology 기반 요구사항 관리 + API Gateway 데모)로 자리매김하고 있으며, **외부에 판매하는 상용 제품이 아닙니다**. 초대 기반 비공개 테스트만 진행하며, API는 여전히 발전 중입니다. 문의나 협업이 필요하시면 [business@lurus.cn](mailto:business@lurus.cn)으로 연락해 주세요.
:::

## Forge란?

**Lurus Forge**는 AI 제품 팀을 위한 개발 워크벤치이며, 핵심 철학은 "**모든 것은 대화다**"입니다. 제품 요구사항은 Session 대화를 통해 논의하고, 기능은 AI Agent(PM/Architect/Code)로 구현하며, 지식은 제품 온톨로지(Ontology)로 시각화합니다.

내부적으로는 [Kova 엔진](/ko/kova/)을 통해 Agent 작업의 WAL 영속화를 구현하므로, 실행이 중단되더라도 매끄럽게 복구할 수 있습니다.

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="network" :size="22" /></span>
    <div class="lurus-card__title">Ontology 온톨로지</div>
    <p class="lurus-card__body">트리 구조로 제품의 사용자 스토리, 아키텍처, 기술 스택, 디자인 규격을 관리합니다 — 정적인 구조화 지식입니다.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="22" /></span>
    <div class="lurus-card__title">Session 대화 기반</div>
    <p class="lurus-card__body">제품 논의를 매번 하나의 Session에 담습니다 — 대화, 결정, Agent 산출물을 담은 동적인 타임라인입니다.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> 핵심 역량</span>
  <h2 class="lurus-section-head__title">요구사항부터 PR까지, 모두 하나의 시각적 구조 안에</h2>
  <p class="lurus-section-head__lede">이미 출시된 역량과 계획 중인 역량을 나란히 보여 주며, 상태 라벨을 사실대로 표기합니다.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-forge)"
  :items="[
    { title: '제품 온톨로지 (Ontology)', body: '사용자 스토리 / 아키텍처 / 기술 스택 / 디자인 규격을 트리 구조로 관리하고, 모든 차원을 나란히 시각화합니다. 대화 중의 결정은 자동으로 Ontology에 반영됩니다.', icon: 'network' },
    { title: '대화 기반 개발', body: '“이 기능의 사용자 스토리는 무엇인가요?”라고 물으면 → PM Agent가 분석해 생성합니다. 모든 결정은 대화 컨텍스트와 연결되어, 당초 왜 그렇게 정했는지 추적할 수 있습니다.', icon: 'messages-square' },
    { title: 'WAL 결정 추적', body: 'Kova 엔진의 WAL을 기반으로 모든 대화와 결정을 영속화하여, 추적·위치 파악·Replay 복기가 가능합니다.', icon: 'history' },
  ]"
/>

### 계획 중 / 개발 중 역량

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Dependency Guardian <Badge text="계획 중" type="warning" /></div>
    <p class="lurus-card__body">Renovate/Dependabot을 뛰어넘는 3계층 의존성 관리: Patch는 자동 병합(수작업 제로), Minor는 승인 카드로 원클릭 결정, Major는 대화형 리뷰(AI가 breaking change가 비즈니스에 미치는 의미적 영향을 분석).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="workflow" :size="20" /></span>
    <div class="lurus-card__title">Agent 시각적 구축 <Badge text="개발 중" type="tip" /></div>
    <p class="lurus-card__body">드래그 앤 드롭 3단계 구축: 트리거 조건 Trigger(Webhook / 스케줄 / API 요청) → AI 처리 Process(LLM 호출 / RAG 검색 / 도구 호출) → 출력 동작 Action(API 콜백 / 이메일 알림 / 데이터베이스 쓰기).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="database-backup" :size="20" /></span>
    <div class="lurus-card__title">지식 베이스 관리 <Badge text="개발 중" type="tip" /></div>
    <p class="lurus-card__body">RAG 지식 베이스: 문서 가져오기(PDF/Word/Markdown/웹페이지), 자동 청킹(의미 완전성 유지), 벡터 인덱스(자동 임베딩으로 의미 검색 지원), 업데이트 동기화(문서 업데이트 시 자동 재인덱싱).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">모니터링 및 분석 <Badge text="개발 중" type="tip" /></div>
    <p class="lurus-card__body">호출 통계(횟수 / 지연 / Token), 품질 점수(사용자 피드백 + 자동 평가), 비용 분석(기능별 / 시간별), 알림(비정상 호출량 또는 품질 저하 시 자동 통지).</p>
  </div>
</div>

### Prompt 엔지니어링 워크벤치

| 기능 | 설명 |
|------|------|
| **Prompt 에디터** | 구문 강조, 변수 삽입, 버전 관리 |
| **A/B 테스트** | 동일 입력으로 서로 다른 Prompt 출력 품질 비교 |
| **모델 비교** | 동일 Prompt를 서로 다른 모델에서 실행한 효과 비교 |
| **배치 테스트** | 테스트 세트를 가져와 일괄 평가 |
| **버전 히스토리** | 수정 시마다 자동으로 버전 저장, 언제든 롤백 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 적용 시나리오</span>
  <h2 class="lurus-section-head__title">팀은 Forge에서 무엇을 하나</h2>
</div>

<UserScenarios
  :scenarios="[
    { role: 'AI 고객 상담', title: '상담 Agent 시각적 구축', summary: '지식 베이스 관리, 서비스 품질 모니터링', link: '/ko/forge/sessions' },
    { role: '콘텐츠 심사', title: '드래그로 심사 프로세스 구성', summary: '규칙 설정, 지속적 최적화', link: '/ko/forge/sessions' },
    { role: '지능형 추천', title: '추천 Agent 구성', summary: '서로 다른 전략 A/B 테스트', link: '/ko/forge/sessions' },
    { role: '문서 QA', title: '문서를 가져와 지식 베이스 구축', summary: '질의응답 Agent 배포', link: '/ko/forge/ontology' },
  ]"
/>

---

## 기술 스택

| 계층 | 기술 |
|------|------|
| 프런트엔드 | TypeScript + React (Turbo monorepo) |
| AI 엔진 | [Lurus API](/ko/guide/introduction)(멀티 모델 지원) |
| Agent 실행 | [Kova](/ko/kova/)(영속화 실행) |
| 벡터 스토리지 | Qdrant / Chroma |
| 배포 | Kubernetes (ArgoCD) |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="mail" :size="14" /> 비공개 테스트 신청</span>
  <h2 class="lurus-section-head__title">초대 기반 비공개 테스트 진행 중</h2>
</div>

Forge는 현재 초대 기반 비공개 테스트 단계에 있습니다. 다음과 같은 팀에 적합합니다:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <p class="lurus-card__body">제품에 AI 기능을 통합하고 있거나 통합을 계획 중인 팀</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="pen-tool" :size="20" /></span>
    <p class="lurus-card__body">시각적인 Prompt 관리 및 테스트 도구가 필요한 팀</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <p class="lurus-card__body">AI 기능의 개발 및 운영 비용을 낮추고자 하는 팀</p>
  </div>
</div>

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">비공개 테스트 자격 신청</p>
    <p class="lurus-cta__text">business@lurus.cn으로 연락하시고, 팀 규모와 해결하고자 하는 페인 포인트를 함께 적어 주세요.</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="mailto:business@lurus.cn">이메일로 신청 →</a>
  </div>
</div>

## 더 많은 리소스

- [Lurus API](/ko/guide/introduction) — 기반 AI 역량 살펴보기
- [Kova](/ko/kova/) — Agent 영속화 실행 엔진
- [MemX](/ko/memx/) — AI 지능형 메모리 관리
- [통합 ID 인증](/ko/platform/auth/) — Forge 로그인 / 팀 권한 / SSO 페더레이션이 모두 이를 기반으로 합니다

<!-- lurus:related-block -->

---

## 관련 제품 및 다음 단계

<RelatedProducts product-id="forge" />

</div>
