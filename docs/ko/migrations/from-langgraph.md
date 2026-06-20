---
title: "LangGraph에서 Lumen + Kova로 마이그레이션"
description: "SqliteSaver → LumenCheckpointer + LumenTracer, Agent를 Kova 클러스터에 배포합니다."
---

<div class="mig-lg-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-branch" :size="14" /> LangGraph에서 마이그레이션</span>
  <h1 class="lurus-section-head__title">LangGraph에서 Lumen + Kova로 마이그레이션</h1>
  <p class="lurus-section-head__lede"><code>SqliteSaver</code> → <code>LumenCheckpointer + LumenTracer</code>, Agent를 Kova 클러스터에 배포합니다——비즈니스 코드는 그대로입니다.</p>
</div>

## <Icon name="sparkles" :size="20" /> 얻게 되는 것

| Before（순수 LangGraph） | After |
|---------------------|-------|
| SqliteSaver 단일 머신 영속화 | **LumenCheckpointer + Kova** 마이크로초급 WAL 복구 |
| Trace 없음 | **LumenTracer** 자동 수집 |
| Cost 통계 없음 | **CostTracker** Node 단위 집계 |
| 수동 Replay | **Replay.from_run_id()** 한 줄 |

## <Icon name="workflow" :size="20" /> 마이그레이션 단계

<ol class="lurus-steps">
<li>

**Checkpointer 교체** — `LumenCheckpointer`는 `BaseCheckpointSaver`를 100% 구현하므로 비즈니스 코드를 전혀 수정할 필요가 없습니다.

```diff
- from langgraph.checkpoint.sqlite import SqliteSaver
+ from lumen_ai import LumenCheckpointer

- graph = wf.compile(
-     checkpointer=SqliteSaver.from_conn_string("./state.db")
- )
+ graph = wf.compile(
+     checkpointer=LumenCheckpointer()
+ )
```

</li>
<li>

**Tracer 추가** — 로컬에서 기동한 후 `http://localhost:7070`에 접속하면 Trace 타임라인을 확인할 수 있습니다.

```diff
+ from lumen_ai import LumenTracer

  graph = wf.compile(
      checkpointer=LumenCheckpointer(),
+     callbacks=[LumenTracer()],
  )
```

</li>
<li>

**Kova에 배포**

```yaml
# agent.yaml
name: research-agent
entry: python my_agent.py
checkpointer: lumen
replicas: 3
```

```bash
lumen deploy --target kova://prod-cluster
```

</li>
</ol>

## <Icon name="terminal" :size="20" /> 로컬 검증

```bash
python my_agent.py           # 정상 실행
kill -9 $(pgrep -f my_agent) # 크래시 시뮬레이션
python my_agent.py           # 중단 지점부터 이어서 실행, LLM 재호출 없음
```

## <Icon name="gauge" :size="20" /> 성능 비교

| 지표 | Before | After |
|------|--------|-------|
| 복구 지연 | 8ms | **마이크로초급** |
| 다중 프로세스 | 락 필요 | **네이티브** |
| 멀티 데이터센터 | 수동 | **비동기 복제** |
| LLM 재호출 | 가끔 | **절대 없음** |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">롤백</p>
    <div class="lurus-callout__body"><p>기존 SqliteSaver 코드를 주석으로 남겨 두면 언제든 diff를 되돌려 원상태로 복귀할 수 있습니다. 데이터는 서로 호환되지 않지만 병렬로 실행할 수 있습니다.</p></div>
  </div>
</div>

## 다음 단계

<NextSteps :steps="[
  { text: 'Lumen Python SDK', link: '/ko/lumen/python-sdk', primary: true },
  { text: 'Kova 배포', link: '/ko/kova/quickstart' },
  { text: '전체 튜토리얼', link: '/ko/tutorials/lumen-kova-langgraph' },
]" />

</div>
