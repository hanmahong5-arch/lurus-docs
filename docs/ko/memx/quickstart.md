---
title: MemX 빠른 시작
description: 5분 안에 MemX AI 적응형 메모리 엔진의 핵심 기능을 체험합니다.
---

<div class="memx-qs">

# 빠른 시작

5분 만에 MemX 핵심 기능 체험: 설치 → 초기화 → 쓰기 → 검색 → 상태 확인.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">사전 준비</p>
    <div class="lurus-callout__body"><p>Python 3.9+ · pip · Lurus <Term t="API Key">API Key</Term>(<a href="/ko/guide/get-api-key">발급 방법</a>, hybrid 모드에서 LLM 정제에 사용). 예상 소요 5분.</p></div>
  </div>
</div>

## 접속 방식 선택

MemX는 **Python SDK / REST / MCP** 세 가지 접속 형태를 제공합니다. 아래에서는 「쓰기 + 검색」으로 시연하니, 익숙한 방식을 선택하세요(세 가지의 파라미터는 서로 정렬되어 있습니다):

:::tabs
== Python SDK

```python
from memx import Memory

m = Memory(config={"ace_enabled": True})

# 从一段对话中学习
m.add([
    {"role": "user", "content": "pytest 超时怎么办？"},
    {"role": "assistant", "content": "用 pytest -x --timeout=30 逐个排查"},
], user_id="dev1", scope="project:backend")

# 检索
results = m.search("pytest 调试", user_id="dev1")
```

== REST

```bash
# 写入（POST /v1/memories）
curl -X POST https://memx.lurus.cn/v1/memories \
  -H "Authorization: Bearer $MEMX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"pytest 超时怎么办？"}],"user_id":"dev1"}'

# 检索（GET /v1/memories/search）
curl "https://memx.lurus.cn/v1/memories/search?query=pytest+调试&user_id=dev1&limit=5" \
  -H "Authorization: Bearer $MEMX_KEY"
```

== MCP

MemX는 MCP server 형태로 메모리 작업을 agent 도구로 노출하여 Claude / Codex 등 MCP 클라이언트가 호출할 수 있도록 합니다(파라미터는 REST와 정렬됨):

- `memory_add` — 지식 쓰기(`content`, `user_id`)
- `memory_search` — 시맨틱 검색(`query`, `limit`, `user_id`)
- `memory_delete` — 항목 삭제(`memory_id`)
:::

아래 단계별 튜토리얼은 Python SDK를 예로 들며, REST / MCP도 동일한 방식입니다.

<ol class="lurus-steps">

<li>

**설치**

```bash
pip install git+https://github.com/UU114/memx.git
# 完整安装：pip install "git+https://github.com/UU114/memx.git#egg=memx[all]"
```

Python 3.9+ 필요. 최초 실행 시 로컬 임베딩 모델(약 90MB)을 `~/.memx/models/`로 자동 다운로드합니다.

</li>

<li>

**초기화**

```python
from memx import Memory
m = Memory(config={"ace_enabled": True})   # 开启 ACE 引擎（核心功能）
```

ACE를 켜면 모든 쓰기와 검색이 지능형 파이프라인을 거쳐 처리되며, 기본 설정만으로 대부분의 시나리오를 충족할 수 있습니다.

</li>

<li>

**지식 쓰기**

대화에서 자동으로 지식을 추출하고 학습합니다:

```python
# 从一段对话中学习
result = m.add(
    [
        {"role": "user", "content": "pytest 总是超时怎么办？"},
        {"role": "assistant", "content": "试试 pytest -x --timeout=30，逐个测试跑可以定位慢的用例"}
    ],
    user_id="developer_1",
    scope="project:my-backend"
)

print(result)
# {
#   "ace_ingest": {
#     "bullets_added": 1,
#     "bullets_merged": 0,
#     "bullets_skipped": 0,
#     "privacy_filtered": 0
#   }
# }
```

수동으로 지식을 주입할 수도 있습니다:

```python
# 手动添加一条经验
m.add(
    "部署前必须运行 go test -race ./... 检查竞态条件",
    user_id="developer_1",
    scope="project:my-backend",
    metadata={"knowledge_type": "method", "section": "workflow"}
)
```

</li>

<li>

**지식 검색**

```python
results = m.search(
    "pytest 调试技巧",
    user_id="developer_1",
    scope="project:my-backend"
)

for item in results["results"]:
    print(f"[{item['score']:.2f}] {item['memory']}")
# [0.87] pytest 超时问题：使用 -x --timeout=30 逐个运行定位慢用例
```

검색은 4계층 검색 결과(정확 + 퍼지 + 메타데이터 + 시맨틱)를 자동으로 융합하며, 시간 감쇠와 스코프 매칭을 고려합니다.

</li>

<li>

**지식 베이스 상태 확인**

```python
status = m.status(user_id="developer_1")
print(status)
# {
#   "total_memories": 42,
#   "by_section": {"debugging": 12, "workflow": 8, "tools": 6, ...},
#   "avg_decay_weight": 0.73,
#   "permanent_count": 5,
#   "archive_candidates": 2
# }
```

</li>

</ol>

## CLI 빠른 체험

```bash
memx status                              # 知识库统计
memx search "pytest 调试"                # 搜索
memx learn "always use -v flag ..."      # 手动添加
memx list --scope project:my-backend     # 列出指定作用域
memx forget <memory-id>                  # 删除
memx sweep                               # 手动触发衰减计算
memx conflicts                           # 检测矛盾知识
memx export --format json > knowledge.json   # 导出
memx import knowledge.json                   # 导入
```

## 순수 mem0 호환 모드

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="git-merge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">mem0에서 매끄럽게 마이그레이션 가능</p>
    <div class="lurus-callout__body"><p>기본 메모리 기능만 필요할 때는 ACE를 끄면 동작이 mem0와 100% 동일합니다(ACE를 끄면 오버헤드 없이 패스스루되므로, 먼저 마이그레이션한 뒤 점진적으로 켤 수 있습니다).</p></div>
  </div>
</div>

```python
m = Memory()  # ace_enabled 默认 False
m.add("some knowledge", user_id="user1")
results = m.search("query", user_id="user1")
```

## 다음 단계

<NextSteps
  :steps="[
    { text: '핵심 개념 — ACE 엔진의 4대 핵심 모듈 심층 이해', link: '/ko/memx/concepts', primary: true },
    { text: '아키텍처 설계 — 완전한 파이프라인 아키텍처와 데이터 흐름', link: '/ko/memx/architecture' },
    { text: '자주 묻는 질문 — 사용 중 문제가 발생했나요?', link: '/ko/memx/faq' },
  ]"
/>

</div>
