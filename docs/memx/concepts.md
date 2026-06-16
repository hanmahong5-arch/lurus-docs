---
title: MemX 核心概念
description: MemX ACE 引擎的四大核心模块：智能蒸馏、语义去重、衰退遗忘和混合检索。
---

<div class="memx-page">

# 核心概念

MemX 的 ACE（Adaptive Context Engine）引擎由四大核心模块组成，独立运作、协同配合，实现知识的完整生命周期管理。

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> ACE 引擎</span>
  <h2 class="lurus-section-head__title">四大核心模块</h2>
  <p class="lurus-section-head__lede">蒸馏 → 去重 → 衰减 → 检索，覆盖知识的完整生命周期。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: 'Reflector · 知识蒸馏', body: 'hybrid 模式规则预筛 + LLM 精炼，5 种检测规则，相比全量 LLM 减少 90%+ 调用。', icon: 'filter' },
    { title: 'Curator · 语义去重', body: '余弦相似度三级去重：≥0.8 合并、0.5~0.8 标记冲突、低于 0.5 独立写入。', icon: 'database-backup' },
    { title: 'Decay · 时间衰减', body: 'Ebbinghaus 遗忘曲线，半衰期 30 天，召回增强 + 永久记忆三层保护。', icon: 'timer' },
    { title: 'Generator · 混合检索', body: '四层搜索 L1~L4，关键词 0.6 + 语义 0.4 融合，再乘衰减/新近/作用域加成。', icon: 'search' },
  ]"
/>

## <Term t="Reflector">Reflector</Term> — 知识蒸馏引擎

Reflector 是 MemX 最核心的创新：**极低成本**的智能知识提取。传统 AI 记忆系统每次靠 LLM 从对话提取知识，消耗 2-5K tokens。Reflector 默认 **hybrid** 模式：规则预筛选 + 仅对有价值候选项调 LLM 精炼，相比全量 LLM 减少 90%+ 调用开销。

### 三种运行模式

| 模式 | 说明 | LLM 开销 |
|------|------|---------|
| `rules` | 纯规则引擎，完全基于模式匹配 | 零 LLM 调用 |
| `hybrid`（默认） | 规则预筛选 + LLM 精炼，取平均分数 | 仅对候选项调用，减少 90%+ |
| `llm` | 完全依赖 LLM 提取知识 | 每次 2-5K tokens |

**hybrid 工作流程**：原始对话 → PatternDetector（规则检测）→ 候选知识项 → LLM 评估+蒸馏（仅候选项）→ 取规则分数与 LLM 分数的平均值 → KnowledgeScorer（评分分类）→ PrivacySanitizer（隐私脱敏）→ BulletDistiller（压缩精炼）。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">默认混合模式 + 自动降级</p>
    <div class="lurus-callout__body"><p>LLM 不可用时自动切换纯规则模式，零调用零成本。</p></div>
  </div>
</div>

### 五种检测规则

| 规则 | 检测逻辑 | 置信度 | 典型场景 |
|------|---------|--------|---------|
| ErrorFixRule | 识别「报错 → 解决方案」结构 | 0.8 | "TypeError: ... → 原来要加类型断言" |
| RetrySuccessRule | 检测多次尝试后的成功路径 | 0.7 | "试了 A、B 都不行，最后 C 方案解决" |
| ConfigChangeRule | 匹配配置/环境变量修改 | 0.6 | "把 MAX_POOL_SIZE 从 10 改到 50" |
| NewToolRule | 识别首次使用的工具/库 | 0.65 | "第一次用 pnpm，比 npm 快多了" |
| RepetitiveOpRule | 统计重复操作（≥3 次触发） | 0.5+ | "每次部署都要手动清理缓存" |

### 知识分类体系

每条知识自动归入 **Section**（主题）和 **KnowledgeType**（类型）两维度：

- **8 种 Section**：`COMMANDS` · `DEBUGGING` · `ARCHITECTURE` · `WORKFLOW` · `TOOLS` · `PATTERNS` · `PREFERENCES` · `GENERAL`
- **5 种 KnowledgeType**：`METHOD`（方法论）· `TRICK`（技巧）· `PITFALL`（踩坑）· `PREFERENCE`（偏好）· `KNOWLEDGE`（事实）

### Instructivity Score

每条知识获 0-100 **教学价值评分**，由模式匹配置信度 + 具体性/可操作性 + 是否含明确因果关系综合计算。低于 `min_score`（默认 30）的候选项被丢弃。

## <Term t="Curator">Curator</Term> — 语义去重引擎

Curator 在每次写入时自动处理重复和矛盾。

### 三级去重策略

新知识写入 → 计算与现有知识的余弦相似度：**≥ 0.8** 自动合并（keep_best 或 merge_content）；**0.5~0.8** 标记潜在冲突等待确认；**< 0.5** 视为独立知识正常写入。

**合并策略**：`keep_best`（默认，保留 instructivity_score 更高的版本）/ `merge_content`（合并两条内容，生成更完整版本）。

### 冲突检测

主动扫描矛盾记忆（例：相似度 0.72 但结论相反 — "Redis 连接池设 10 即可" vs "至少 50 才稳定"，建议确认最佳实践删过时版本）。CLI 随时检测：`memx conflicts`。

## <Term t="Decay">Decay</Term> — 时间衰减引擎

模拟人类记忆的自然遗忘曲线，确保知识库始终保持"新鲜"。

### 衰减公式

```
base_weight = 2^(-age_days / half_life)
boosted     = base_weight × (1 + boost_factor × recall_count)
final       = clamp(boosted, 0.0, 1.0)
```

**核心参数**:

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `half_life` | 30 天 | 权重衰减到 50% 所需的天数 |
| `boost_factor` | 0.1 | 每次召回的权重加成系数 |

**数值示例**（half_life=30, boost_factor=0.1）:

| 场景 | age_days | recall_count | base_weight | final |
|------|----------|-------------|-------------|-------|
| 刚写入 | 0 | 0 | 1.0 | **1.0**（保护期）|
| 30 天未用 | 30 | 0 | 0.5 | **0.5** |
| 60 天未用 | 60 | 0 | 0.25 | **0.25** |
| 30 天，被检索 5 次 | 30 | 5 | 0.5 | **0.75** |
| 90 天，被检索 15 次 | 90 | 15 | 0.125 | **1.0**（recall>=15 触发永久记忆，跳过公式）|

### 三层保护机制

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">三层保护</p>
    <div class="lurus-callout__body"><ul><li><code>recall_count ≥ 15</code> → 永久记忆（weight 固定 1.0）</li><li><code>age ≤ 7 天</code> → 保护期（weight 固定 1.0）</li><li><code>weight &lt; 0.02</code> → 归档候选（可清理）</li></ul></div>
  </div>
</div>

直觉：刚学的（7 天内）记得清楚；常回忆的越来越牢；用 15 次以上成"肌肉记忆"；久不用逐渐遗忘。

### 检索时的衰减影响

衰减权重直接参与检索排序的最终评分：

```
Final Score = Blended Search Score × DecayWeight × RecencyBoost × ScopeBoost
```

- `RecencyBoost`: 7 天内创建的知识获得 1.2x 加成
- `ScopeBoost`: 匹配当前作用域的知识获得 1.3x 加成

## Generator — 混合检索引擎

突破纯<Term t="Vector Search">向量搜索</Term>局限，四层搜索覆盖精确匹配到语义理解的完整频谱。

### 四层搜索架构

| 层级 | 引擎 | 匹配方式 | 优势场景 |
|------|------|---------|---------|
| L1 | ExactMatcher | 精确词匹配 | "pytest -v"、API 名称 |
| L2 | FuzzyMatcher | 模糊 Token 匹配 | 拼写变体、形态变化 |
| L3 | MetadataMatcher | tools / entities / tags 的 Jaccard 相似度 | "关于 Redis 的知识" |
| L4 | VectorSearcher | 向量嵌入语义搜索 | "如何提升测试性能" |

### 分数融合公式

```
NormKeyword = (L1 + L2 + L3) / 35.0        # 归一化到 [0, 1]
Blended     = NormKeyword × 0.6 + Semantic × 0.4
Final       = Blended × DecayWeight × RecencyBoost × ScopeBoost
```

关键词搜索权重（0.6）高于语义搜索（0.4），确保精确匹配的结果优先展示。

**数值示例**: 查询 "pytest timeout"，某条记忆的得分计算：
- L1(精确)=8, L2(模糊)=5, L3(元数据)=3 → NormKeyword = (8+5+3)/35 = 0.457
- L4(语义) = 0.72
- Blended = 0.457×0.6 + 0.72×0.4 = 0.562
- DecayWeight=0.89, RecencyBoost=1.0, ScopeBoost=1.3
- **Final = 0.562 × 0.89 × 1.0 × 1.3 = 0.650**

### 优雅降级

L4 向量搜索不可用时（嵌入模型加载失败）自动降级纯关键词模式（`keyword_weight=1.0, semantic_weight=0.0`）。任何单一搜索层故障都不中断服务。

## Token 预算管理

检索结果双重约束：`max_results`（最大返回条数，默认 5）+ `token_budget`（最大 Token 预算，默认 2000）。

**CJK 感知**（确保中文不因错误 Token 估算被过度裁剪）：CJK 字符 1.5 字符/token；拉丁字符 4.0 字符/token。

## 层级作用域

知识按层级组织实现访问控制：`global`（所有项目可见）→ `project:my-backend`（仅该项目）→ `workspace:feat-auth`（仅该工作区）。匹配当前 scope 的知识获 1.3x 评分加成；上层 scope 对下层可见（global 对所有项目），下层对上层不可见。

---

<NextSteps
  title="下一步"
  :steps="[
    { text: '架构设计 — 完整的管道架构和数据流', link: '/memx/architecture', primary: true },
    { text: '快速开始 — 5 分钟体验 MemX 核心功能', link: '/memx/quickstart' },
    { text: '常见问题 — 使用中的常见问题解答', link: '/memx/faq' },
  ]"
/>

</div>

<style>
.memx-page .lurus-section-head {
  margin-top: 2.5rem;
}
.memx-page .cap-grid {
  margin: 1.5rem 0 2.25rem;
}
.memx-page .lurus-callout {
  margin: 1.25rem 0;
}
</style>
