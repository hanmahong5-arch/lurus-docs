---
title: MemX 核心概念
description: MemX 的四个处理阶段：抽取、去重、衰减、检索，以及脱敏与检索时核验。
---

<div class="memx-page">

# 核心概念

MemX 的处理管线叫 ACE，由四个阶段组成：Reflector（抽取）→ Curator（去重）→ Decay（衰减）→ Generator（检索）。ACE 默认开启；关闭时写入不经抽取、去重，也不经脱敏。

本页的默认值均取自引擎源码的配置默认值，可在配置文件 `[ace.*]` 表下调整。

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: 'Reflector · 抽取', body: '识别 → 评分 → 隐私脱敏 → 提炼，四步把原始输入变成一条条记忆。', icon: 'filter' },
    { title: 'Curator · 去重', body: '按相似度决定新增、合并或跳过；标记语义相关但结论相反的记忆。', icon: 'database-backup' },
    { title: 'Decay · 衰减', body: '半衰期衰减 + 保护期 + 召回回升；召回足够多次后不再衰减。', icon: 'timer' },
    { title: 'Generator · 检索', body: '四层信号融合为一个排序分，再乘以衰减、时效与作用域因子。', icon: 'search' },
  ]"
/>

## <Term t="Reflector">Reflector</Term> — 抽取

### 三种模式

| 模式 | 说明 |
|------|------|
| `rules`（默认） | 纯规则模式匹配，完全本地，不调用任何外部模型 |
| `hybrid` | 规则预筛后再交给模型精炼，需显式开启并配置模型服务 |
| `llm` | 由模型抽取，需显式开启并配置模型服务 |

### 五条检测规则

`rules` 模式下由五条规则识别值得留下的内容：错误修复（ErrorFix）、多次重试后成功（RetrySuccess）、配置变更（ConfigChange）、首次使用新工具（NewTool）、重复操作（RepetitiveOp）。

### 评分与分类

每条候选获得 0–100 的教学价值评分（instructivity score），低于 `min_score`（默认 30）的候选被丢弃。留下的记忆按两个维度分类：

- **Section**（主题）：`commands` · `debugging` · `architecture` · `workflow` · `tools` · `patterns` · `preferences` · `general`
- **KnowledgeType**（性质）：`method` · `trick` · `pitfall` · `preference` · `knowledge`

## <Term t="Curator">Curator</Term> — 去重与冲突

新记忆写入时与已有记忆比对相似度（有嵌入时用余弦相似度，没有时退化为词集合的 Jaccard 相似度）：

- 相似度达到 `dedup_threshold`（默认 0.9）→ 合并，或在几乎相同时直接跳过；
- 相似度落在冲突区间（默认 0.5–0.8）→ 检查是否互相矛盾，矛盾的会被标记；
- 其余 → 作为新记忆写入。

同一件事出现了新值（例如阈值从 300ms 改成 500ms）时，旧记忆保留为历史、标记为已被取代并指向新记忆，检索时排在后面。命令行可随时查看冲突：`memorus-r conflicts`。

## <Term t="Decay">Decay</Term> — 衰减

```
weight = 2^(-age_days / half_life) × (1 + boost_factor × recall_count)，上限 1.0
```

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `half_life` | 30 天 | 无召回时权重减半所需天数 |
| `boost_factor` | 0.1 | 每次召回带来的回升系数 |
| `protection_days` | 7 天 | 保护期内权重固定为 1.0 |
| `permanent_threshold` | 15 次 | 召回次数达到后不再衰减 |
| `archive_threshold` | 0.02 | 权重低于此值的记忆在清理时移出活跃检索范围 |

衰减清理由命令行（`memorus-r sweep`）或 MCP 工具（`run_decay_sweep`）触发。

## Generator — 混合检索

| 层 | 匹配方式 |
|------|---------|
| L1 | 精确关键词：查询词是否原样出现在正文中 |
| L2 | 模糊：对查询与正文取词干后比较 |
| L3 | 元数据：查询词是否命中工具、实体、标签字段 |
| L4 | 语义：查询向量与记忆向量的余弦相似度 |

融合方式：

```
norm_keyword = min((L1 + L2 + L3) / 满分, 1.0)
blended      = norm_keyword × 0.6 + L4 × 0.4
final        = blended × 衰减权重 × 时效因子 × 作用域因子，截断到 [0, 1]
```

- 没有查询向量时（未配置嵌入）退化为纯关键词：权重变为 1.0 / 0.0。
- 时效因子：7 天内的新记忆最多加成 20%，随天数线性归零。
- 作用域因子：命中查询指定作用域的记忆乘以 1.5。
- 中文按字符二元组（bigram）切词，不是词典分词。

各层分项得分目前只在引擎内部计算，接口只返回总分。「混合检索优于纯向量检索」目前没有可复现的基准数字支撑。

## 作用域

每条记忆带一个作用域：全局（默认）、某个项目或某个团队。按项目检索时返回该项目与全局的并集；按团队检索同理。

## 检索时核验

记忆可以锚定到某个源文件里的一段文字。检索时重新核对这段文字是否还在，标为 `verified`（已核验）、`stale`（陈旧）或 `unverifiable`（无法核验）。对陈旧记忆默认只标注；也可以配置为降权（`demote`）或直接剔除（`drop`）。

---

<NextSteps
  title="下一步"
  :steps="[
    { text: '架构设计 — 写入与检索的数据流', link: '/memx/architecture', primary: true },
    { text: '快速开始', link: '/memx/quickstart' },
    { text: '常见问题', link: '/memx/faq' },
  ]"
/>

</div>

<style>
.memx-page .cap-grid {
  margin: 1.5rem 0 2.25rem;
}
</style>
