---
title: MemX 快速开始
description: 5 分钟内体验 MemX AI 自适应记忆引擎的核心功能。
---

# 快速开始

5 分钟体验 MemX 核心功能。

::: info 前置条件
Python 3.9+ · pip · Lurus <Term t="API Key">API Key</Term>（[获取方式](/guide/get-api-key)，hybrid 模式下用于 LLM 精炼）。预计 5 分钟。
:::

## 安装

```bash
pip install git+https://github.com/UU114/memx.git
# 完整安装：pip install "git+https://github.com/UU114/memx.git#egg=memx[all]"
```

需 Python 3.9+。首次运行自动下载本地嵌入模型（约 90MB）到 `~/.memx/models/`。

## 第一步：初始化

```python
from memx import Memory
m = Memory(config={"ace_enabled": True})   # 开启 ACE 引擎（核心功能）
```

ACE 开启后所有写入和检索都经智能管道处理；默认配置即可满足大多数场景。

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

## 纯 mem0 兼容模式

只需基础记忆功能时关闭 ACE，行为与 mem0 100% 一致（ACE 关闭时零开销透传，可从 mem0 无缝迁移再逐步开启）：

```python
m = Memory()  # ace_enabled 默认 False
m.add("some knowledge", user_id="user1")
results = m.search("query", user_id="user1")
```

## 下一步

- [核心概念](/memx/concepts) — 深入了解 ACE 引擎的四大核心模块
- [架构设计](/memx/architecture) — 完整的管道架构和数据流
- [常见问题](/memx/faq) — 使用中遇到问题？
