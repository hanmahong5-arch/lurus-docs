---
title: "튜토리얼 — Lumen × LangGraph × Kova"
description: "Lumen으로 LangGraph 기본 SqliteSaver를 교체하고 Kova Cluster에 배포하여 크래시 복구 효과를 비교합니다."
---

<div class="lkl-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Lumen × LangGraph × Kova</span>
  <h1 class="lurus-section-head__title">Lumen × LangGraph × Kova</h1>
  <p class="lurus-section-head__lede"><strong>목표</strong>: LangGraph Agent의 Checkpointer를 <code>SqliteSaver</code>에서 <code>LumenCheckpointer</code>로 교체하고, Kova에 배포하여 크래시 복구를 비교 관찰합니다.</p>
</div>

## <Icon name="git-branch" :size="20" /> Before / After

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">Before — 순수 LangGraph</div>
    <p class="lurus-card__body">단일 머신, 원격 백업 없음 · 프로세스 간 락 필요 · 비용 추적 없음.</p>
  </div>
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">After — Lumen + Kova</div>
    <p class="lurus-card__body">크래시 후 WAL 중단 지점에서 복구(Kova 엔진) · 네이티브 멀티프로세스 안전성 · 자동 Trace + Cost · 원격 영속화.</p>
  </div>
</div>

### Before

```python
from langgraph.checkpoint.sqlite import SqliteSaver

graph = wf.compile(checkpointer=SqliteSaver.from_conn_string("./state.db"))
```

### After

```python
from lumen_ai import LumenCheckpointer, LumenTracer
from kova import KovaClient

kova = KovaClient("kova://prod-cluster")

graph = wf.compile(
    checkpointer=LumenCheckpointer(kova_client=kova),
    callbacks=[LumenTracer()],
)
```

## <Icon name="terminal" :size="20" /> 로컬 검증

<ol class="lurus-steps">
<li>

**로컬 Kova 기동**

```bash
docker run -d --name kova -p 9999:9999 ghcr.io/hanmahong5-arch/kova:latest
```

</li>
<li>

**Agent 실행**

```bash
python my_agent.py
```

</li>
<li>

**크래시 시뮬레이션**

```bash
kill -9 $(pgrep -f my_agent)
```

</li>
<li>

**재시작 — 중단 지점에서 이어서 진행**

```bash
python my_agent.py
```

</li>
</ol>

## <Icon name="rocket" :size="20" /> Kova에 배포

```yaml
# agent.yaml
name: my-research-agent
entry: python my_agent.py
replicas: 3
checkpointer: lumen
wal:
  retention: 7d
```

```bash
lumen deploy --target kova://prod-cluster
```

## 다음 단계

<NextSteps :steps="[
  { text: 'LangGraph에서 마이그레이션', link: '/ko/migrations/from-langgraph', primary: true },
  { text: 'Lumen Python SDK', link: '/ko/lumen/python-sdk' },
  { text: 'Kova 개념', link: '/ko/kova/concepts' },
]" />

</div>
