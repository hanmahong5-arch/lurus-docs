---
title: MemX — AI 적응형 메모리 엔진
description: ACE v2.0 기반으로 구축된 AI 메모리 엔진. 지능형 증류, 생체 모방 망각, 전 구간 프라이버시 보호.
---

<div class="memx-page">

<ProductHero product-id="memx" />

## MemX란?

**MemX**는 Lurus가 선보이는 AI 적응형 메모리 엔진으로, **<Term t="ACE">ACE（Adaptive Context Engine）</Term>v2.0** 기반으로 구축되었습니다. AI Agent에게 완전한 지식 생명주기 관리를 제공합니다: **<Term t="Knowledge Distillation">지능형 증류</Term> → <Term t="Semantic Dedup">의미 기반 중복 제거</Term> → 감쇠 망각 → 하이브리드 검색**. 이로써 AI가 인간처럼 진정한 "기억력"을 갖추도록 합니다.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="brain" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">세 가지 핵심 강점</p>
    <div class="lurus-callout__body"><ul><li><strong>기본 하이브리드 모드 + 자동 다운그레이드</strong> — LLM을 사용할 수 없을 때 순수 규칙으로 전환하여 호출 제로, 비용 제로.</li><li><strong>생체 모방 망각 곡선</strong> — Ebbinghaus 지수 감쇠, 반감기 기본 30일, 강하게 회상되는 항목은 영구 기억으로 승격.</li><li><strong>전 구간 프라이버시 보호</strong> — 민감 정보는 절대 벡터 데이터베이스에 들어가지 않음.</li></ul></div>
  </div>
</div>

<MetricStats :items="[
  { label: 'PII 필터링 규칙', value: '12개', hint: '우회 불가' },
  { label: '하이브리드 검색', value: '4계층', hint: 'L1→L4 가중 융합' },
  { label: '감쇠 반감기', value: '30일', hint: '기본값 구성 가능' },
  { label: '제공 형태', value: 'Python · REST · MCP' },
]" />

## 핵심 기능

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> 4대 모듈</span>
  <h2 class="lurus-section-head__title">대화에서 검색 가능한 기억으로</h2>
  <p class="lurus-section-head__lede">규칙/공식/파라미터 상세는 <a href="/ko/memx/concepts">핵심 개념</a> 및 <a href="/ko/memx/architecture">아키텍처 설계</a>를 참고하세요.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: '지능형 지식 증류（Reflector）', body: 'hybrid 모드（규칙 사전 필터링 + LLM 정제）로 5가지 지식 패턴을 식별: 오류 수정 / 재시도 성공 / 구성 변경 / 새 도구 사용 / 반복 작업. 각 항목을 0-100 점수로 평가하여 저점수 노이즈를 걸러냅니다.', icon: 'filter' },
    { title: '의미 기반 중복 제거 및 충돌 감지（Curator）', body: '코사인 유사도 ≥0.8이면 자동 병합, 0.5-0.8이면 잠재 충돌로 표시, 0.5 미만이면 독립 지식으로 간주.', icon: 'git-merge' },
    { title: '생체 모방 기억 감쇠', body: '7일 보호 기간 + 지수 감쇠 + 회상 강화; 15회 이상 검색되면 영구 기억으로 승격되어 더 이상 감쇠하지 않음.', icon: 'timer' },
    { title: '4계층 하이브리드 검색', body: 'L1 정확 → L2 퍼지 → L3 메타데이터 → L4 벡터, ScoreMerger 가중 융합 후 DecayWeight × RecencyBoost × ScopeBoost를 곱함. 벡터 계층을 사용할 수 없으면 자동 다운그레이드.', icon: 'search' },
    { title: '프라이버시 우선 설계', body: '12개 내장 민감 정보 필터링 규칙（키 / Token / 데이터베이스 연결 문자열 / 로컬 경로 / 사용자 정의 정규식）, 기록 전 자동 차단.', icon: 'shield-check' },
  ]"
/>

## 아키텍처 개요

지식은 대화에서 유입되어 차례로 증류, 프라이버시 필터링, 중복 제거를 거쳐 벡터 및 메타데이터 저장소로 들어갑니다; 검색 요청은 4계층 하이브리드 파이프라인을 통과하며, 감쇠 엔진은 백그라운드에서 기억 활성도를 지속적으로 유지합니다.

<ArchitectureDiagram
  title="ACE 엔진 데이터 흐름"
  chart="graph TB
  Input[대화 흐름] --> Reflector[Reflector 지식 증류]
  Reflector --> PII[PII 필터링 12개 규칙]
  PII --> Curator[Curator 의미 기반 중복 제거]
  Curator --> Store[(벡터 + 메타데이터)]
  Store --> Decay[Decay Engine Ebbinghaus]
  Query[검색 요청] --> Hybrid[4계층 하이브리드 검색]
  Hybrid --> Store"
/>

## 적용 시나리오

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
    <div class="lurus-card__title">프로그래밍 어시스턴트</div>
    <p class="lurus-card__body">당신의 코딩 습관, 겪었던 함정, 프로젝트 규약을 기억합니다.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span>
    <div class="lurus-card__title">고객 지원 시스템</div>
    <p class="lurus-card__body">고객의 과거 상호작용 지식을 축적하여 개인화된 서비스를 제공합니다.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="book-open" :size="20" /></span>
    <div class="lurus-card__title">개인 지식 베이스</div>
    <p class="lurus-card__body">일상 대화에서 자동으로 지식을 추출하고 정리합니다.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">팀 협업</div>
    <p class="lurus-card__body">팀 단위 기억을 공유하여 새 구성원이 빠르게 컨텍스트를 확보합니다.</p>
  </div>
</div>

## 기존 메모리 시스템과의 비교

<ComparisonTable
  self-label="MemX (ACE)"
  :competitors="['기존 방식 (mem0)']"
  title="왜 또 하나의 벡터 DB가 아닌가"
  :rows="[
    { dimension: '지식 추출', self: 'hybrid 하이브리드 엔진（규칙 사전 필터링 + LLM 정제, 호출 90%+ 절감）', alt: { '기존 방식 (mem0)': 'LLM（매번 2-5K tokens）' } },
    { dimension: '중복 제거', self: '코사인 유사도 자동 병합', alt: { '기존 방식 (mem0)': 'LLM 항목별 판단' } },
    { dimension: '망각', self: '지수 감쇠 + 회상 강화', alt: { '기존 방식 (mem0)': '영구 저장, 도태 불가' } },
    { dimension: '검색', self: '4계층 하이브리드 검색', alt: { '기존 방식 (mem0)': '벡터 검색만' } },
    { dimension: '프라이버시', self: '12개 내장 민감 정보 필터링 규칙', alt: { '기존 방식 (mem0)': '내장 보호 없음' } },
    { dimension: '범위', self: '계층화（global / project / workspace）', alt: { '기존 방식 (mem0)': '평면（user / agent）' } },
    { dimension: 'Token 관리', self: '내장 예산 트리밍（CJK 인식）', alt: { '기존 방식 (mem0)': '호출자가 직접 관리' } },
    { dimension: '로컬 임베딩', self: 'ONNX 로컬 추론, 완전 오프라인', alt: { '기존 방식 (mem0)': 'API 필요' } },
  ]"
/>

## 다음 단계

<NextSteps
  :steps="[
    { text: '빠른 시작 — 5분 만에 핵심 기능 체험', link: '/ko/memx/quickstart', primary: true },
    { text: '핵심 개념 — ACE 엔진 설계 원리 심층 이해', link: '/ko/memx/concepts' },
    { text: '아키텍처 설계 — 전체 시스템 아키텍처', link: '/ko/memx/architecture' },
    { text: '통합 및 MCP 디렉터리', link: '/integrations/' },
    { text: '자주 묻는 질문', link: '/ko/memx/faq' },
  ]"
/>

<!-- lurus:related-block -->

## 관련 제품 및 다음 단계

<RelatedProducts product-id="memx" />

</div>

<style>
.memx-page .lurus-callout {
  margin: 20px 0;
}
.memx-page .lurus-section-head {
  margin-top: 8px;
}
</style>
