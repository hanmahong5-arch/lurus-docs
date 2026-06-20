---
title: "Forge — 로드맵과 비공개 테스트 신청"
description: "현재 beta 기능, 계획 중인 Dependency Guardian / Agent 시각화 / 지식 베이스, 그리고 비공개 테스트 신청 방법."
---

<div class="forge-rm-page">

# Forge 로드맵 <StatusBadge status="beta" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="check-circle" :size="14" /> 출시됨</span>
  <h2 class="lurus-section-head__title">현재 Beta 기능</h2>
</div>

| 기능 | 상태 | 설명 |
|------|------|------|
| Ontology 시각화 트리 | <StatusBadge status="beta" /> | 접을 수 있는 트리 + 노드 카드 |
| PM/Architect/Code Session | <StatusBadge status="beta" /> | 세 종류 Agent 대화 협업 |
| WAL 의사결정 추적 | <StatusBadge status="beta" /> | Kova 엔진에 의존 |
| PR 자동화 | <StatusBadge status="dev" /> | Code Agent 가 직접 PR 생성 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="compass" :size="14" /> 계획 중</span>
  <h2 class="lurus-section-head__title">다음에 할 일</h2>
</div>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Dependency Guardian <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">Epic / Story 를 가로지르는 인터페이스 변경 감지: 하나의 API 계약이 수정될 때 영향을 받는 모든 Session 과 PR 을 자동으로 찾아냅니다.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="workflow" :size="20" /></span>
    <div class="lurus-card__title">Agent 시각화 <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">Session 내 Agent 의 사고 과정, 도구 호출, 중간 결과를 순수 텍스트 log 가 아닌 <strong>시각화 타임라인</strong>으로 표시합니다.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">지식 베이스 <StatusBadge status="plan" /></div>
    <p class="lurus-card__body"><a href="/ko/memx/">MemX</a> 를 Forge 에 연동하여, Agent 가 Session 에서 과거 의사결정 / 규범 / 시행착오 기록을 검색하는 장기 기억 계층으로 활용합니다.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="history" :size="14" /> 타임라인</span>
  <h2 class="lurus-section-head__title">최근 마일스톤</h2>
</div>

<ol class="lurus-steps">
<li>

**2026 Q2** — PR 자동화 GA

</li>
<li>

**2026 Q3** — Dependency Guardian beta

</li>
<li>

**2026 Q4** — Agent 시각화 beta

</li>
<li>

**2027 Q1** — 지식 베이스 beta（MemX 심층 통합）

</li>
</ol>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="mail" :size="14" /> 비공개 테스트 신청</span>
  <h2 class="lurus-section-head__title">초대제 비공개 테스트 채널</h2>
</div>

Forge 는 현재 Lurus **내부 R&D 도구**로 자리매김하고 있으며, **외부에 판매하는 상업용 제품이 아닙니다**.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="mail" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">신청 방법</p>
    <div class="lurus-callout__body"><code>business@lurus.cn</code> 으로 이메일을 보내(제목에 "Forge 비공개 테스트 신청"을 명시), 팀 규모, 현재 사용 중인 요구사항 관리 도구, 해결하고자 하는 어려움을 설명해 주세요.</div>
  </div>
</div>

---

## 관련 제품

<RelatedProducts product-id="forge" />

</div>
