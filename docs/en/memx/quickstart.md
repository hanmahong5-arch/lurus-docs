---
title: MemX Quickstart
description: Experience the core capabilities of the MemX AI adaptive memory engine in 5 minutes.
---

<div class="memx-qs">

# Quickstart

Experience MemX core features in 5 minutes: install → initialize → write → retrieve → check status.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prerequisites</p>
    <div class="lurus-callout__body"><p>Python 3.9+ · pip · Lurus <Term t="API Key">API Key</Term> (<a href="/en/guide/get-api-key">how to obtain one</a>, used for LLM refinement in hybrid mode). Estimated 5 minutes.</p></div>
  </div>
</div>

## Choose an Integration Method

MemX offers three integration forms: **Python SDK / REST / MCP**. The following demonstrates "write + retrieve"; pick whichever you prefer (the parameters are aligned across all three):

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

MemX exposes memory operations as agent tools in MCP server form, callable by MCP clients such as Claude / Codex (parameters aligned with REST):

- `memory_add` — write knowledge (`content`, `user_id`)
- `memory_search` — semantic retrieval (`query`, `limit`, `user_id`)
- `memory_delete` — delete an entry (`memory_id`)
:::

The step-by-step tutorial below uses the Python SDK as an example; REST / MCP work the same way.

<ol class="lurus-steps">

<li>

**Install**

```bash
pip install git+https://github.com/UU114/memx.git
# 完整安装：pip install "git+https://github.com/UU114/memx.git#egg=memx[all]"
```

Requires Python 3.9+. On first run, the local embedding model (about 90MB) is automatically downloaded to `~/.memx/models/`.

</li>

<li>

**Initialize**

```python
from memx import Memory
m = Memory(config={"ace_enabled": True})   # 开启 ACE 引擎（核心功能）
```

Once ACE is enabled, all writes and retrievals go through the intelligent pipeline; the default configuration is sufficient for most scenarios.

</li>

<li>

**Write Knowledge**

Automatically extract and learn knowledge from a conversation:

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

You can also inject knowledge manually:

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

**Retrieve Knowledge**

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

Retrieval automatically fuses four layers of search results (exact + fuzzy + metadata + semantic), and accounts for time decay and scope matching.

</li>

<li>

**Check Knowledge Base Status**

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

## CLI Quick Tour

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

## Pure mem0 Compatibility Mode

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="git-merge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Seamless migration from mem0</p>
    <div class="lurus-callout__body"><p>When you only need basic memory features, disable ACE and the behavior is 100% consistent with mem0 (zero-overhead passthrough when ACE is off, so you can migrate first and enable features gradually).</p></div>
  </div>
</div>

```python
m = Memory()  # ace_enabled 默认 False
m.add("some knowledge", user_id="user1")
results = m.search("query", user_id="user1")
```

## Next Steps

<NextSteps
  :steps="[
    { text: 'Core Concepts — Dive into the four core modules of the ACE engine', link: '/en/memx/concepts', primary: true },
    { text: 'Architecture — The complete pipeline architecture and data flow', link: '/en/memx/architecture' },
    { text: 'FAQ — Running into issues?', link: '/en/memx/faq' },
  ]"
/>

</div>
