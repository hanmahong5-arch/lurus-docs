---
title: MemX 快速开始
description: 5 分钟内体验 MemX AI 自适应记忆引擎的核心功能。
---

# 快速开始

本指南带你在 5 分钟内体验 MemX 的核心功能。

::: info 前置条件
- Python 3.9+（`python --version` 确认）
- pip 包管理器
- 一个 Lurus <Term t="API Key">API Key</Term>（[获取方式](/guide/get-api-key)），hybrid 模式下用于 LLM 精炼
- 预计时间: 5 分钟
:::

## 安装

:::tabs
== GitHub
```bash
pip install git+https://github.com/UU114/memx.git
```
== GitHub (完整安装)
```bash
pip install "git+https://github.com/UU114/memx.git#egg=memx[all]"
```
:::

::: tip
MemX 需要 Python 3.9+。首次运行时会自动下载本地嵌入模型（约 90MB），存放在 `~/.memx/models/`。
:::

## 第一步：初始化

```python
from memx import Memory

# 开启 ACE 引擎（核心功能）
m = Memory(config={"ace_enabled": True})
```

默认配置即可满足大多数场景。ACE 开启后，所有写入和检索都经过智能管道处理。

## 第二步：写入知识

从对话中自动提取和学习知识：

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

也可以手动注入知识：

```python
# 手动添加一条经验
m.add(
    "部署前必须运行 go test -race ./... 检查竞态条件",
    user_id="developer_1",
    scope="project:my-backend",
    metadata={"knowledge_type": "method", "section": "workflow"}
)
```

## 第三步：检索知识

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

检索自动融合四层搜索结果（精确 + 模糊 + 元数据 + 语义），并考虑时间衰减和作用域匹配。

## 第四步：查看知识库状态

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

## CLI 快速体验

MemX 提供完整的命令行工具：

```bash
# 查看知识库统计
memx status

# 搜索知识
memx search "pytest 调试"

# 手动添加知识
memx learn "always use -v flag for verbose output"

# 列出指定作用域的知识
memx list --scope project:my-backend

# 删除指定知识
memx forget <memory-id>

# 手动触发衰减计算
memx sweep

# 检测矛盾知识
memx conflicts

# 导出/导入知识库
memx export --format json > knowledge.json
memx import knowledge.json
```

## 纯 mem0 兼容模式

如果只需要基础记忆功能，可以关闭 ACE 引擎，此时行为与 mem0 完全一致：

```python
m = Memory()  # ace_enabled 默认为 False

# 与 mem0 API 100% 兼容
m.add("some knowledge", user_id="user1")
results = m.search("query", user_id="user1")
```

::: info
ACE 关闭时零开销透传，可以从 mem0 无缝迁移，逐步开启 ACE 功能。
:::

## 下一步

- [核心概念](/memx/concepts) — 深入了解 ACE 引擎的四大核心模块
- [架构设计](/memx/architecture) — 完整的管道架构和数据流
- [常见问题](/memx/faq) — 使用中遇到问题？
