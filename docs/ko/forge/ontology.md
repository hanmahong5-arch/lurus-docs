---
title: "Forge — Ontology 온톨로지"
description: "트리 구조로 제품의 사용자 스토리, 아키텍처, 기술 스택, 디자인 규격을 관리합니다."
---

<div class="forge-ont-page">

# Ontology 온톨로지 <StatusBadge status="beta" />

Ontology는 Forge의 첫 번째 핵심 데이터 모델로, 트리 구조로 제품의 모든 "지식"을 표현하여 AI Agent와 사람이 동일한 시각적 구조 위에서 협업하게 합니다. 흩어진 사용자 스토리(Jira/페이슈/채팅), 분리된 아키텍처와 구현, 기록되지 않은 기술 스택 조정, 제각각인 디자인 규격을 하나의 **추적 가능하고, 회귀 가능하며, Agent가 직접 쓸 수 있는** 지식 트리로 통합합니다.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="network" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">한 문장 정의</p>
    <div class="lurus-callout__body">Ontology는 <strong>정적</strong>인 구조화 지식이며, <a href="/ko/forge/sessions">Session</a>은 <strong>동적</strong>인 타임라인입니다. Session에서 내려진 결정이 Ontology 노드에 기록 / 수정됩니다.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 데이터 모델</span>
  <h2 class="lurus-section-head__title">노드 유형</h2>
  <p class="lurus-section-head__lede">여섯 가지 노드가 제품 지식의 서로 다른 차원을 나란히 기술합니다.</p>
</div>

| 유형 | 의미 | 대표 리프 |
|------|------|---------|
| `UserStory` | 사용자 스토리 | "X로서 나는 Z를 위해 Y를 원한다" |
| `Architecture` | 아키텍처 결정 | "이벤트 드리븐 채택, 이유는…" |
| `TechStack` | 기술 스택 | "백엔드 Go + Gin + PG" |
| `DesignSpec` | 디자인 규격 | "버튼 모서리 8px, 주색 #C67B5C" |
| `Decision` | 일회성 결정 | "Redis Streams 폐기, NATS로 전환" |
| `Risk` | 위험 항목 | "서드파티 API 429 레이트 리밋" |

## 트리 구조

```
产品: Lurus Forge
├─ UserStory
│  ├─ PM 创建需求
│  ├─ Architect 设计方案
│  └─ Dev 实现并提 PR
├─ Architecture
│  ├─ Ontology + Session 双核心
│  └─ WAL 决策回溯（依赖 Kova）
├─ TechStack
│  ├─ Elixir/Phoenix + LiveView
│  └─ PostgreSQL + ltree
└─ DesignSpec
   └─ Lurus 铜棕视觉系统
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> 협업 방식</span>
  <h2 class="lurus-section-head__title">Agent 자동 기록 · 시각화 · 내보내기</h2>
</div>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Agent 자동 기록</div>
    <p class="lurus-card__body">PM Agent가 <a href="/ko/forge/sessions">Session</a>에서 사용자 스토리를 생성하면 노드가 Ontology에 자동으로 등록되고, Architect Agent가 아키텍처 결정을 내리면 <code>Architecture</code> 하위 트리에 기록되어 대응하는 Story와 연결됩니다.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">시각화</div>
    <p class="lurus-card__body">웹 프런트엔드는 접을 수 있는 트리 + 노드 카드로 표시하며, 각 노드에는 생성자(사람 / Agent), 연결된 Session, 수정 이력, 상태(초안 / 검토 중 / 확정됨)가 함께 담깁니다.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="import" :size="20" /></span>
    <div class="lurus-card__title">내보내기</div>
    <p class="lurus-card__body">트리 전체를 JSON으로 내보내거나, GraphML로 yEd / Gephi에 가져와 그래프 분석을 수행합니다(아래 명령 참고).</p>
  </div>
</div>

### 내보내기 명령

```bash
forge export --ontology json     # 整棵树 → JSON
forge export --ontology graphml  # 可导入 yEd / Gephi
```

---

## 다음 단계

<NextSteps :steps="[
  { text: 'Session 워크플로', link: '/ko/forge/sessions', primary: true },
  { text: '로드맵', link: '/ko/forge/roadmap' },
  { text: 'Forge 소개로 돌아가기', link: '/ko/forge/' },
]" />

</div>
