---
title: Lumen Python SDK
description: LumenTracer / LumenCheckpointer / CostTracker 세 가지 핵심 클래스의 전체 사용 설명.
---

<div class="lumen-page">

# Lumen Python SDK <StatusBadge status="dev" />

`pip install lumen-ai` 이후 SDK는 수집, 영속화, 비용 집계를 아우르는 세 가지 핵심 클래스를 제공합니다:

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--lumen" href="#lumentracer">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">LumenTracer</div>
    <p class="lurus-card__body">콜백 형태의 Trace + Cost 수집.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#lumencheckpointer">
    <span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span>
    <div class="lurus-card__title">LumenCheckpointer</div>
    <p class="lurus-card__body"><code>SqliteSaver</code>를 대체하는 영속화 계층.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="#costtracker">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">CostTracker</div>
    <p class="lurus-card__body">Agent 간 비용 집계 조회.</p>
  </a>
</div>

## LumenTracer

```python
from lumen_ai import LumenTracer

tracer = LumenTracer(
    project="my-agent",
    tags={"env": "prod", "team": "core"},
    redact=("api_key", "password"),   # 自动脱敏字段
)

graph = workflow.compile(callbacks=[tracer])
```

**주요 파라미터**:

| 파라미터 | 기본값 | 설명 |
|------|--------|------|
| `project` | `"default"` | 프로젝트 식별자, 데이터 귀속을 결정 |
| `tags` | `{}` | 각 Trace에 부가되는 키-값 태그 |
| `redact` | `()` | 자동 마스킹할 필드명 튜플 |
| `backend` | `"local"` | `local` / `lurus` / 사용자 정의 URL |

## LumenCheckpointer

LangGraph의 `SqliteSaver`를 대체합니다:

```python
from lumen_ai import LumenCheckpointer

graph = workflow.compile(checkpointer=LumenCheckpointer())
```

SqliteSaver와 비교하면:

| 항목 | SqliteSaver | LumenCheckpointer |
|------|-------------|-------------------|
| 복구 속도 | 밀리초 단위 | **마이크로초 단위**（Kova WAL 엔진 기반） |
| 멀티프로세스 | 락 필요 | **네이티브 지원** |
| 원격 영속화 | 직접 구현 필요 | **내장** |
| 비용 연동 | 없음 | **자동** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">직접 교체, API 호환</p>
    <div class="lurus-callout__body"><code>LumenCheckpointer</code>는 LangGraph의 <code>BaseCheckpointSaver</code> 인터페이스와 호환되어, 기존 <code>SqliteSaver</code>를 한 줄만 바꾸면 되며 그래프 구조를 수정할 필요가 없습니다. 자세한 내용은 <a href="/ko/lumen/integration">생태계 통합 · LangGraph</a>를 참고하세요.</div>
  </div>
</div>

## CostTracker

Agent 간 비용 집계 조회:

```python
from lumen_ai import CostTracker

# 过去 24h
CostTracker.summary(hours=24)

# 按 Agent 拆分
CostTracker.by_agent(hours=24)

# 按 Graph 节点拆分
CostTracker.by_node(graph_id="research-graph")

# 预算告警
CostTracker.set_budget(daily_rmb=50.0, on_exceed=my_handler)
```

## 사용자 정의 Backend

기본적으로 데이터는 `~/.lumen/`에 기록됩니다. 원격으로 전송하려면: `LumenTracer(backend="https://lumen.lurus.cn/ingest")`. 또는 직접 정의할 수 있습니다:

```python
from lumen_ai.backend import Backend
class MyBackend(Backend):
    def send(self, event): ...
LumenTracer(backend=MyBackend())
```

## Async 지원

SDK의 모든 I/O는 비동기 친화적입니다:

```python
import asyncio
from lumen_ai import LumenTracer

async def main():
    tracer = LumenTracer()
    async with tracer:
        await graph.ainvoke({"query": "hi"})

asyncio.run(main())
```

## 다음 단계

<NextSteps :steps="[
  { text: '소개로 돌아가기', link: '/ko/lumen/', primary: true },
  { text: 'CLI 매뉴얼', link: '/ko/lumen/cli' },
  { text: '생태계 통합', link: '/ko/lumen/integration' },
]" />

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-cards--compact { margin: 18px 0 8px; }
</style>
