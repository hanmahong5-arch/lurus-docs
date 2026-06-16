---
title: MemX 핵심 개념
description: MemX ACE 엔진의 4대 핵심 모듈 — 지능형 증류, 의미 중복 제거, 감쇠 망각, 하이브리드 검색.
---

<div class="memx-page">

# 핵심 개념

MemX의 ACE(Adaptive Context Engine) 엔진은 4대 핵심 모듈로 구성되어 있으며, 각각 독립적으로 작동하면서 서로 협력해 지식의 완전한 생명주기 관리를 실현합니다.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> ACE 엔진</span>
  <h2 class="lurus-section-head__title">4대 핵심 모듈</h2>
  <p class="lurus-section-head__lede">증류 → 중복 제거 → 감쇠 → 검색, 지식의 완전한 생명주기를 포괄합니다.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: 'Reflector · 지식 증류', body: 'hybrid 모드 규칙 사전 선별 + LLM 정제, 5종 탐지 규칙, 전량 LLM 대비 호출 90%+ 절감.', icon: 'filter' },
    { title: 'Curator · 의미 중복 제거', body: '코사인 유사도 3단계 중복 제거: ≥0.8 병합, 0.5~0.8 충돌 표시, 0.5 미만 독립 기록.', icon: 'database-backup' },
    { title: 'Decay · 시간 감쇠', body: 'Ebbinghaus 망각 곡선, 반감기 30일, 회상 강화 + 영구 기억 3계층 보호.', icon: 'timer' },
    { title: 'Generator · 하이브리드 검색', body: '4계층 검색 L1~L4, 키워드 0.6 + 의미 0.4 융합, 다시 감쇠/최신성/스코프 가산.', icon: 'search' },
  ]"
/>

## <Term t="Reflector">Reflector</Term> — 지식 증류 엔진

Reflector는 MemX의 가장 핵심적인 혁신입니다: **극도로 낮은 비용**의 지능형 지식 추출. 기존 AI 기억 시스템은 매번 LLM에 의존해 대화에서 지식을 추출하며 2-5K tokens를 소비합니다. Reflector는 기본적으로 **hybrid** 모드를 사용합니다: 규칙 사전 선별 + 가치 있는 후보 항목에 대해서만 LLM 정제를 호출하여, 전량 LLM 대비 호출 비용을 90%+ 절감합니다.

### 세 가지 실행 모드

| 모드 | 설명 | LLM 비용 |
|------|------|---------|
| `rules` | 순수 규칙 엔진, 전적으로 패턴 매칭 기반 | LLM 호출 없음 |
| `hybrid`（기본） | 규칙 사전 선별 + LLM 정제, 평균 점수 산출 | 후보 항목에만 호출, 90%+ 절감 |
| `llm` | 전적으로 LLM에 의존해 지식 추출 | 매번 2-5K tokens |

**hybrid 워크플로**: 원본 대화 → PatternDetector(규칙 탐지) → 후보 지식 항목 → LLM 평가+증류(후보 항목만) → 규칙 점수와 LLM 점수의 평균값 산출 → KnowledgeScorer(점수 분류) → PrivacySanitizer(프라이버시 비식별화) → BulletDistiller(압축 정제).

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">기본 하이브리드 모드 + 자동 다운그레이드</p>
    <div class="lurus-callout__body"><p>LLM을 사용할 수 없을 때 자동으로 순수 규칙 모드로 전환하여, 호출 없이 비용 제로로 동작합니다.</p></div>
  </div>
</div>

### 다섯 가지 탐지 규칙

| 규칙 | 탐지 로직 | 신뢰도 | 대표 시나리오 |
|------|---------|--------|---------|
| ErrorFixRule | 「오류 → 해결책」 구조 식별 | 0.8 | "TypeError: ... → 알고 보니 타입 단언을 추가해야 했음" |
| RetrySuccessRule | 여러 번 시도 후의 성공 경로 탐지 | 0.7 | "A, B 다 안 됐고, 마지막에 C 방안으로 해결" |
| ConfigChangeRule | 설정/환경 변수 수정 매칭 | 0.6 | "MAX_POOL_SIZE를 10에서 50으로 변경" |
| NewToolRule | 처음 사용한 도구/라이브러리 식별 | 0.65 | "pnpm을 처음 써봤는데 npm보다 훨씬 빠름" |
| RepetitiveOpRule | 반복 작업 집계(≥3회 시 트리거) | 0.5+ | "배포할 때마다 캐시를 수동으로 정리해야 함" |

### 지식 분류 체계

각 지식은 자동으로 **Section**(주제)과 **KnowledgeType**(유형)의 두 차원으로 분류됩니다:

- **8종 Section**: `COMMANDS` · `DEBUGGING` · `ARCHITECTURE` · `WORKFLOW` · `TOOLS` · `PATTERNS` · `PREFERENCES` · `GENERAL`
- **5종 KnowledgeType**: `METHOD`(방법론) · `TRICK`(기법) · `PITFALL`(함정) · `PREFERENCE`(선호) · `KNOWLEDGE`(사실)

### Instructivity Score

각 지식은 0-100의 **교육적 가치 점수**를 받으며, 패턴 매칭 신뢰도 + 구체성/실행 가능성 + 명확한 인과관계 포함 여부를 종합적으로 계산합니다. `min_score`(기본 30) 미만인 후보 항목은 폐기됩니다.

## <Term t="Curator">Curator</Term> — 의미 중복 제거 엔진

Curator는 매 기록 시 중복과 모순을 자동으로 처리합니다.

### 3단계 중복 제거 전략

신규 지식 기록 → 기존 지식과의 코사인 유사도 계산: **≥ 0.8** 자동 병합(keep_best 또는 merge_content); **0.5~0.8** 잠재적 충돌로 표시하고 확인 대기; **< 0.5** 독립 지식으로 간주해 정상 기록.

**병합 전략**: `keep_best`(기본, instructivity_score가 더 높은 버전 유지) / `merge_content`(두 항목의 내용을 병합하여 더 완전한 버전 생성).

### 충돌 탐지

모순되는 기억을 능동적으로 스캔합니다(예: 유사도 0.72이지만 결론이 상반됨 — "Redis 연결 풀은 10이면 충분" vs "최소 50은 되어야 안정적", 베스트 프랙티스를 확인하고 구버전 삭제 권장). CLI로 언제든 탐지: `memx conflicts`.

## <Term t="Decay">Decay</Term> — 시간 감쇠 엔진

인간 기억의 자연스러운 망각 곡선을 모사하여, 지식 베이스가 항상 "신선함"을 유지하도록 보장합니다.

### 감쇠 공식

```
base_weight = 2^(-age_days / half_life)
boosted     = base_weight × (1 + boost_factor × recall_count)
final       = clamp(boosted, 0.0, 1.0)
```

**핵심 파라미터**:

| 파라미터 | 기본값 | 설명 |
|------|--------|------|
| `half_life` | 30일 | 가중치가 50%까지 감쇠하는 데 필요한 일수 |
| `boost_factor` | 0.1 | 회상 1회당 가중치 가산 계수 |

**수치 예시**(half_life=30, boost_factor=0.1):

| 시나리오 | age_days | recall_count | base_weight | final |
|------|----------|-------------|-------------|-------|
| 방금 기록 | 0 | 0 | 1.0 | **1.0**(보호 기간)|
| 30일 미사용 | 30 | 0 | 0.5 | **0.5** |
| 60일 미사용 | 60 | 0 | 0.25 | **0.25** |
| 30일, 5회 검색됨 | 30 | 5 | 0.5 | **0.75** |
| 90일, 15회 검색됨 | 90 | 15 | 0.125 | **1.0**(recall>=15 시 영구 기억 트리거, 공식 건너뜀)|

### 3계층 보호 메커니즘

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">3계층 보호</p>
    <div class="lurus-callout__body"><ul><li><code>recall_count ≥ 15</code> → 영구 기억(weight 1.0 고정)</li><li><code>age ≤ 7일</code> → 보호 기간(weight 1.0 고정)</li><li><code>weight &lt; 0.02</code> → 아카이브 후보(정리 가능)</li></ul></div>
  </div>
</div>

직관: 막 배운 것(7일 이내)은 또렷이 기억하고; 자주 회상하는 것은 점점 단단해지며; 15회 이상 사용하면 "근육 기억"이 되고; 오래 쓰지 않으면 점차 잊힙니다.

### 검색 시의 감쇠 영향

감쇠 가중치는 검색 정렬의 최종 점수에 직접 관여합니다:

```
Final Score = Blended Search Score × DecayWeight × RecencyBoost × ScopeBoost
```

- `RecencyBoost`: 7일 이내에 생성된 지식은 1.2x 가산을 받습니다
- `ScopeBoost`: 현재 스코프와 매칭되는 지식은 1.3x 가산을 받습니다

## Generator — 하이브리드 검색 엔진

순수 <Term t="Vector Search">벡터 검색</Term>의 한계를 돌파하여, 4계층 검색으로 정확 매칭부터 의미 이해까지의 완전한 스펙트럼을 포괄합니다.

### 4계층 검색 아키텍처

| 계층 | 엔진 | 매칭 방식 | 강점 시나리오 |
|------|------|---------|---------|
| L1 | ExactMatcher | 정확 단어 매칭 | "pytest -v", API 이름 |
| L2 | FuzzyMatcher | 퍼지 Token 매칭 | 철자 변형, 형태 변화 |
| L3 | MetadataMatcher | tools / entities / tags의 Jaccard 유사도 | "Redis에 관한 지식" |
| L4 | VectorSearcher | 벡터 임베딩 의미 검색 | "테스트 성능을 어떻게 높일까" |

### 점수 융합 공식

```
NormKeyword = (L1 + L2 + L3) / 35.0        # 归一化到 [0, 1]
Blended     = NormKeyword × 0.6 + Semantic × 0.4
Final       = Blended × DecayWeight × RecencyBoost × ScopeBoost
```

키워드 검색 가중치(0.6)가 의미 검색(0.4)보다 높아, 정확 매칭 결과가 우선 노출되도록 보장합니다.

**수치 예시**: 쿼리 "pytest timeout"에 대한 특정 기억의 점수 계산:
- L1(정확)=8, L2(퍼지)=5, L3(메타데이터)=3 → NormKeyword = (8+5+3)/35 = 0.457
- L4(의미) = 0.72
- Blended = 0.457×0.6 + 0.72×0.4 = 0.562
- DecayWeight=0.89, RecencyBoost=1.0, ScopeBoost=1.3
- **Final = 0.562 × 0.89 × 1.0 × 1.3 = 0.650**

### 우아한 다운그레이드

L4 벡터 검색을 사용할 수 없을 때(임베딩 모델 로드 실패) 자동으로 순수 키워드 모드(`keyword_weight=1.0, semantic_weight=0.0`)로 다운그레이드합니다. 어떤 단일 검색 계층 장애도 서비스를 중단시키지 않습니다.

## Token 예산 관리

검색 결과의 이중 제약: `max_results`(최대 반환 건수, 기본 5) + `token_budget`(최대 Token 예산, 기본 2000).

**CJK 인식**(중국어가 잘못된 Token 추정으로 과도하게 잘리지 않도록 보장): CJK 문자 1.5 문자/token; 라틴 문자 4.0 문자/token.

## 계층 스코프

지식은 계층으로 조직되어 접근 제어를 실현합니다: `global`(모든 프로젝트에서 가시) → `project:my-backend`(해당 프로젝트만) → `workspace:feat-auth`(해당 워크스페이스만). 현재 scope와 매칭되는 지식은 1.3x 점수 가산을 받습니다; 상위 scope는 하위에 가시(global은 모든 프로젝트에), 하위는 상위에 비가시입니다.

---

<NextSteps
  title="다음 단계"
  :steps="[
    { text: '아키텍처 설계 — 완전한 파이프라인 아키텍처와 데이터 흐름', link: '/ko/memx/architecture', primary: true },
    { text: '빠른 시작 — 5분 만에 MemX 핵심 기능 체험', link: '/ko/memx/quickstart' },
    { text: '자주 묻는 질문 — 사용 중 흔한 질문에 대한 답변', link: '/ko/memx/faq' },
  ]"
/>

</div>

<style>
.memx-page .lurus-section-head {
  margin-top: 2.5rem;
}
.memx-page .cap-grid {
  margin: 1.5rem 0 2.25rem;
}
.memx-page .lurus-callout {
  margin: 1.25rem 0;
}
</style>
