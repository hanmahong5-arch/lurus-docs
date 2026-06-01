---
title: MemX 架构设计
description: MemX 管道架构详解，包括写入管道、检索管道和组件独立降级设计。
---

# 架构设计

MemX 采用管道（Pipeline）架构，写入和检索分别由独立管道编排，所有组件支持独立失败和优雅降级。

## 系统总览

```
MemX Memory API: add() / search() / status() / detect_conflicts() / export()
 ├─ IngestPipeline(写入): Privacy Sanitizer → Reflector → Curator → mem0.add()
 └─ RetrievalPipeline(检索): Generator(L1-L4) → ScoreMerger → TokenBudgetTrimmer → RecallReinforcer
两管道 → Decay Engine(异步衰减计算) → Vector Store(mem0 Backend)
```

## 写入管道 — IngestPipeline

`Raw Input` 依次经过：

1. **Privacy Sanitizer**（不可绕过）— 12 条内置敏感信息规则 + 自定义正则；净化器永不抛异常。
2. **Reflector** — hybrid 模式（规则预筛 + LLM 精炼）：PatternDetector（5 种模式检测）→ KnowledgeScorer（评分+分类）→ PrivacySanitizer（候选知识脱敏）→ BulletDistiller（压缩为精炼条目）。失败时回退原始 add。
3. **Curator** — 余弦相似度去重：≥0.8 合并（merge_content/keep_best）、0.5-0.8 标记潜在冲突、<0.5 独立知识通过。失败时跳过去重直接写入。
4. **BulletFactory** — 元数据格式转换 → `mem0.add()` 持久化到向量数据库。

### 写入管道的降级路径

每个阶段都有独立的错误处理：

| 阶段 | 失败行为 | 数据影响 |
|------|---------|---------|
| Privacy Sanitizer | 永不失败（内部 try-catch） | 原始数据通过 |
| Reflector | 回退到原始 `mem0.add()` | 知识不经提炼直接存储 |
| Curator | 跳过去重 | 可能产生重复条目 |
| mem0.add | 抛出异常 | 写入失败 |

## 检索管道 — RetrievalPipeline

`Query` 依次经过：

1. **Generator Engine** — L1 ExactMatcher（精确词）/ L2 FuzzyMatcher（模糊 Token）/ L3 MetadataMatcher（元数据 Jaccard）/ L4 VectorSearcher（向量语义）。L4 失败 → 纯关键词模式。
2. **ScoreMerger**（加权融合）：`NormKW = (L1+L2+L3)/35`；`Blended = KW×0.6 + S×0.4`；`Final = Blended×Decay×Recency×Scope`。
3. **TokenBudgetTrimmer**（双重约束）：`max_results=5` + `token_budget=2000`，CJK 感知 Token 估算。
4. 返回结果给调用方，同时异步 **RecallReinforcer** 递增被命中记忆的 `recall_count`（不阻塞搜索响应）。

## 数据模型

每条记忆（Bullet）携带的完整元数据：

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

## 本地嵌入

MemX 用 ONNX Runtime 在本地运行嵌入模型，无需外部 API，完全离线无隐私泄露：模型 all-MiniLM-L6-v2、维度 384、存储 `~/.memx/models/`、首次下载约 90MB、推理 < 5ms/条。

## 守护进程模式

可选后台守护进程，多 Agent/多进程（Agent A/B/C）经 **MemX Daemon（IPC Socket）** 共享同一 Vector Store。IPC Socket 通信避免数据库连接竞争；空闲超时自动退出（默认 300 秒）；适用 IDE 插件、多窗口等。

## 配置参考

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

## 下一步

- [核心概念](/memx/concepts) — 深入理解 ACE 引擎的四大核心模块
- [快速开始](/memx/quickstart) — 5 分钟体验 MemX 核心功能
- [常见问题](/memx/faq) — 使用中的常见问题解答
