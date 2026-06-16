---
title: MemX 아키텍처 설계
description: MemX 파이프라인 아키텍처 상세 설명. 쓰기 파이프라인, 검색 파이프라인 및 컴포넌트별 독립 다운그레이드 설계를 포함합니다.
---

<div class="memx-page">

# 아키텍처 설계

MemX는 파이프라인(Pipeline) 아키텍처를 채택하며, 쓰기와 검색을 각각 독립된 파이프라인이 오케스트레이션합니다. 모든 컴포넌트는 독립적인 실패와 우아한 다운그레이드를 지원합니다.

<MetricStats
  :items="[
    { label: 'Memory API', value: '5개 메서드', hint: 'add / search / status / detect_conflicts / export' },
    { label: '핵심 파이프라인', value: '2개', hint: 'Ingest 쓰기 + Retrieval 검색' },
    { label: '다운그레이드', value: '컴포넌트 단위', hint: '단일 컴포넌트 실패가 서비스를 중단시키지 않음' },
  ]"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> 토폴로지</span>
  <h2 class="lurus-section-head__title">시스템 개요</h2>
  <p class="lurus-section-head__lede">두 개의 독립 파이프라인이 Decay Engine과 벡터 저장소로 합류합니다.</p>
</div>

<ArchitectureDiagram title="MemX 파이프라인 아키텍처" chart="graph TB
  API[Memory API<br/>add / search / status / detect_conflicts / export]
  API --> Ingest[IngestPipeline 쓰기]
  API --> Retrieval[RetrievalPipeline 검색]
  Ingest --> I1[Privacy Sanitizer] --> I2[Reflector] --> I3[Curator] --> I4[mem0.add]
  Retrieval --> R1[Generator L1-L4] --> R2[ScoreMerger] --> R3[TokenBudgetTrimmer] --> R4[RecallReinforcer]
  I4 --> Decay[Decay Engine<br/>비동기 감쇠 계산]
  R4 --> Decay
  Decay --> Store[(Vector Store<br/>mem0 Backend)]" />

## 쓰기 파이프라인 — IngestPipeline

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">프라이버시 게이트웨이는 우회할 수 없음</p>
    <div class="lurus-callout__body"><p>Privacy Sanitizer는 파이프라인의 첫 단계이며 건너뛸 수 없습니다. 12개의 내장 민감 정보 규칙이 데이터가 벡터 저장소에 쓰이기 전에 차단을 완료하며, 새니타이저는 절대 예외를 던지지 않습니다.</p></div>
  </div>
</div>

`Raw Input`은 순서대로 다음을 거칩니다:

1. **Privacy Sanitizer**(우회 불가) — 12개의 내장 민감 정보 규칙 + 사용자 정의 정규식; 새니타이저는 절대 예외를 던지지 않습니다.
2. **Reflector** — hybrid 모드(규칙 사전 필터 + LLM 정제): PatternDetector(5가지 패턴 감지) → KnowledgeScorer(점수 매기기 + 분류) → PrivacySanitizer(후보 지식 비식별화) → BulletDistiller(정제된 항목으로 압축). 실패 시 원본 add로 폴백합니다.
3. **Curator** — 코사인 유사도 중복 제거: ≥0.8 병합(merge_content/keep_best), 0.5-0.8 잠재 충돌 표시, <0.5 독립 지식 통과. 실패 시 중복 제거를 건너뛰고 바로 씁니다.
4. **BulletFactory** — 메타데이터 포맷 변환 → `mem0.add()`로 벡터 데이터베이스에 영속화.

### 쓰기 파이프라인의 다운그레이드 경로

각 단계는 독립적인 오류 처리를 가집니다:

| 단계 | 실패 동작 | 데이터 영향 |
|------|---------|---------|
| Privacy Sanitizer | 절대 실패하지 않음(내부 try-catch) | 원본 데이터 통과 |
| Reflector | 원본 `mem0.add()`로 폴백 | 지식이 정제 없이 바로 저장됨 |
| Curator | 중복 제거 건너뜀 | 중복 항목이 생성될 수 있음 |
| mem0.add | 예외를 던짐 | 쓰기 실패 |

## 검색 파이프라인 — RetrievalPipeline

`Query`는 순서대로 다음을 거칩니다:

1. **Generator Engine** — L1 ExactMatcher(정확한 단어) / L2 FuzzyMatcher(퍼지 Token) / L3 MetadataMatcher(메타데이터 Jaccard) / L4 VectorSearcher(벡터 시맨틱). L4 실패 → 순수 키워드 모드.
2. **ScoreMerger**(가중 융합): `NormKW = (L1+L2+L3)/35`; `Blended = KW×0.6 + S×0.4`; `Final = Blended×Decay×Recency×Scope`.
3. **TokenBudgetTrimmer**(이중 제약): `max_results=5` + `token_budget=2000`, CJK 인식 Token 추정.
4. 호출자에게 결과를 반환하는 동시에, 비동기적으로 **RecallReinforcer**가 히트된 메모리의 `recall_count`를 증가시킵니다(검색 응답을 차단하지 않음).

## 데이터 모델

각 메모리(Bullet)가 담고 있는 전체 메타데이터:

```python
{
    "id": "mem_a1b2c3d4",
    "content": "pytest 超时问题：使用 -x --timeout=30 逐个运行",
    "section": "DEBUGGING",
    "knowledge_type": "TRICK",
    "instructivity_score": 78,
    "source_type": "INTERACTION",

    # Decay tracking
    "recall_count": 3,
    "decay_weight": 0.89,
    "created_at": "2026-02-20T10:30:00Z",
    "last_recalled_at": "2026-02-27T15:00:00Z",

    # Taxonomy
    "related_tools": ["pytest"],
    "key_entities": ["timeout", "test-isolation"],
    "tags": ["python", "testing"],
    "scope": "project:my-backend"
}
```

## 로컬 임베딩

MemX는 ONNX Runtime을 사용하여 로컬에서 임베딩 모델을 실행하므로 외부 API가 필요 없고 완전히 오프라인이며 프라이버시 유출이 없습니다: 모델 all-MiniLM-L6-v2, 차원 384, 저장 위치 `~/.memx/models/`, 최초 다운로드 약 90MB, 추론 < 5ms/건.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">all-MiniLM-L6-v2</span><span class="lurus-stat__label">임베딩 모델</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">384</span><span class="lurus-stat__label">벡터 차원</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">~90MB</span><span class="lurus-stat__label">최초 다운로드</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">&lt;5ms</span><span class="lurus-stat__label">단건 추론</span></div>
</div>

## 데몬 프로세스 모드

선택적 백그라운드 데몬 프로세스로, 멀티 Agent/멀티 프로세스(Agent A/B/C)가 **MemX Daemon(IPC Socket)**을 통해 동일한 Vector Store를 공유합니다. IPC Socket 통신은 데이터베이스 연결 경합을 방지합니다; 유휴 타임아웃 시 자동 종료(기본 300초); IDE 플러그인, 멀티 윈도우 등에 적합합니다.

<ArchitectureDiagram title="데몬 프로세스 공유 토폴로지" chart="graph LR
  A[Agent A] --> D[MemX Daemon<br/>IPC Socket]
  B[Agent B] --> D
  C[Agent C] --> D
  D --> S[(공유 Vector Store)]" />

## 설정 참조

```python
from memx import Memory

m = Memory(config={
    # ACE Engine
    "ace_enabled": True,

    # Reflector — hybrid mode: rule pre-filter + LLM refinement
    "reflector": {
        "mode": "hybrid",       # "rules" | "hybrid"(default) | "llm"
        "min_score": 30.0,      # minimum knowledge score threshold
        "llm_model": "openai/gpt-4o-mini",
    },

    # Curator — semantic deduplication
    "curator": {
        "similarity_threshold": 0.8,    # auto-merge threshold
        "merge_strategy": "keep_best",  # "keep_best" or "merge_content"
    },

    # Decay — bionic forgetting curve
    "decay": {
        "half_life_days": 30.0,         # days to decay to 50%
        "boost_factor": 0.1,            # recall reinforcement coefficient
        "permanent_threshold": 15,      # min recalls for permanent memory
    },

    # Retrieval — hybrid 4-layer search
    "retrieval": {
        "keyword_weight": 0.6,
        "semantic_weight": 0.4,
        "max_results": 5,
        "token_budget": 2000,
    },

    # Privacy — sensitive data filtering (secrets / tokens / local paths)
    "privacy": {
        "custom_patterns": [
            r"INTERNAL_KEY_\w+"
        ],
    },
})
```

---

<NextSteps
  title="다음 단계"
  :steps="[
    { text: '핵심 개념 — ACE 엔진의 4대 핵심 모듈을 깊이 이해하기', link: '/ko/memx/concepts', primary: true },
    { text: '빠른 시작 — 5분 만에 MemX 핵심 기능 체험하기', link: '/ko/memx/quickstart' },
    { text: '자주 묻는 질문 — 사용 중 자주 발생하는 문제 해결', link: '/ko/memx/faq' },
  ]"
/>

</div>

<style>
.memx-page .lurus-section-head {
  margin-top: 2.5rem;
}
.memx-page .metric-stats,
.memx-page .lurus-stat-strip {
  margin: 1.5rem 0 2rem;
}
.memx-page .lurus-callout {
  margin: 1.25rem 0;
}
</style>
