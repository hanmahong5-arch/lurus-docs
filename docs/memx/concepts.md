# 核心概念

MemX 的 ACE（Adaptive Context Engine）引擎由四大核心模块组成，每个模块独立运作、协同配合，实现知识的完整生命周期管理。

## Reflector — 知识蒸馏引擎

Reflector 是 MemX 最核心的创新：**极低成本**的智能知识提取。

传统 AI 记忆系统依赖 LLM 调用来从对话中提取知识点，每次消耗 2-5K tokens。Reflector 支持三种运行模式，默认使用 **hybrid** 混合模式，通过规则预筛选大幅减少 LLM 调用，仅对有价值的候选项调用 LLM 精炼，相比全量 LLM 方案减少 90%+ 的调用开销。

### 三种运行模式

| 模式 | 说明 | LLM 开销 |
|------|------|---------|
| `rules` | 纯规则引擎，完全基于模式匹配 | 零 LLM 调用 |
| `hybrid`（默认） | 规则预筛选 + LLM 精炼，取平均分数 | 仅对候选项调用，减少 90%+ |
| `llm` | 完全依赖 LLM 提取知识 | 每次 2-5K tokens |

**hybrid 工作流程**：

```
原始对话 → PatternDetector (规则检测) → 候选知识项
                                           ↓
                              LLM 评估 + 蒸馏 (仅对候选项)
                                           ↓
                              取规则分数与 LLM 分数的平均值
                                           ↓
                        KnowledgeScorer → PrivacySanitizer → BulletDistiller
                            评分分类          隐私脱敏           压缩精炼
```

::: tip
当 LLM 不可用时（API 故障、网络问题），hybrid 模式自动降级到 rules 模式，确保服务不中断。
:::

### 五种检测规则

| 规则 | 检测逻辑 | 置信度 | 典型场景 |
|------|---------|--------|---------|
| ErrorFixRule | 识别「报错 → 解决方案」结构 | 0.8 | "TypeError: ... → 原来要加类型断言" |
| RetrySuccessRule | 检测多次尝试后的成功路径 | 0.7 | "试了 A、B 都不行，最后 C 方案解决" |
| ConfigChangeRule | 匹配配置/环境变量修改 | 0.6 | "把 MAX_POOL_SIZE 从 10 改到 50" |
| NewToolRule | 识别首次使用的工具/库 | 0.65 | "第一次用 pnpm，比 npm 快多了" |
| RepetitiveOpRule | 统计重复操作（≥3 次触发） | 0.5+ | "每次部署都要手动清理缓存" |

### 知识分类体系

每条被提取的知识自动归入 **Section**（主题）和 **KnowledgeType**（类型）两个维度：

**8 种 Section**:
`COMMANDS` · `DEBUGGING` · `ARCHITECTURE` · `WORKFLOW` · `TOOLS` · `PATTERNS` · `PREFERENCES` · `GENERAL`

**5 种 KnowledgeType**:
`METHOD`（方法论） · `TRICK`（技巧） · `PITFALL`（踩坑） · `PREFERENCE`（偏好） · `KNOWLEDGE`（事实）

### Instructivity Score

每条知识获得 0-100 的**教学价值评分**。分数由以下因素综合计算：

- 模式匹配的置信度
- 知识的具体性和可操作性
- 是否包含明确的因果关系

低于 `min_score`（默认 30）的候选项被丢弃，避免噪音污染知识库。

## Curator — 语义去重引擎

随着知识积累，不可避免会出现重复和矛盾。Curator 在每次写入时自动处理：

### 三级去重策略

```
新知识写入
    │
    ▼
计算与现有知识的余弦相似度
    │
    ├── ≥ 0.8  → 自动合并（keep_best 或 merge_content）
    │
    ├── 0.5~0.8 → 标记潜在冲突，等待确认
    │
    └── < 0.5  → 视为独立知识，正常写入
```

**合并策略**:
- `keep_best`（默认）: 保留 instructivity_score 更高的版本
- `merge_content`: 合并两条知识的内容，生成更完整的版本

### 冲突检测

主动扫描知识库中的矛盾记忆，例如：

```
冲突: "Redis 连接池设置 10 即可" vs "Redis 连接池至少 50 才稳定"
原因: 相似度 0.72，但结论相反
建议: 确认当前最佳实践，删除过时版本
```

通过 CLI 可以随时检测：`memx conflicts`

## Decay — 时间衰减引擎

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

### 三层保护机制

```
recall_count ≥ 15  →  永久记忆（weight 固定为 1.0）
age ≤ 7 天          →  保护期（weight 固定为 1.0）
weight < 0.02       →  归档候选（可清理）
```

**直觉理解**: 就像人的记忆一样——

- 刚学到的东西（7 天内）记得很清楚
- 经常回忆的知识越来越牢固
- 被反复使用 15 次以上的知识成为"肌肉记忆"
- 长时间不用的知识逐渐模糊，最终遗忘

### 检索时的衰减影响

衰减权重直接参与检索排序的最终评分：

```
Final Score = Blended Search Score × DecayWeight × RecencyBoost × ScopeBoost
```

- `RecencyBoost`: 7 天内创建的知识获得 1.2x 加成
- `ScopeBoost`: 匹配当前作用域的知识获得 1.3x 加成

## Generator — 混合检索引擎

突破纯向量搜索的局限，四层搜索覆盖从精确匹配到语义理解的完整频谱。

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

### 优雅降级

当 L4 向量搜索不可用时（如嵌入模型加载失败），自动降级为纯关键词模式：

```
keyword_weight = 1.0, semantic_weight = 0.0
```

系统在任何单一搜索层故障时都不会中断服务。

## Token 预算管理

检索结果受双重约束：

- `max_results`: 最大返回条数（默认 5）
- `token_budget`: 最大 Token 预算（默认 2000）

### CJK 感知

MemX 对中日韩文字使用更精确的 Token 估算：

| 字符类型 | 估算比例 |
|---------|---------|
| CJK 字符 | 1.5 字符 / token |
| 拉丁字符 | 4.0 字符 / token |

这确保中文内容不会因为错误的 Token 估算而被过度裁剪。

## 层级作用域

知识按层级组织，实现精准的访问控制：

```
global                    ← 所有项目可见
├── project:my-backend    ← 仅该项目可见
│   └── workspace:feat-auth  ← 仅该工作区可见
└── project:my-frontend
```

- 检索时，匹配当前 scope 的知识获得 1.3x 评分加成
- 上层 scope 的知识对下层可见（global 对所有项目可见）
- 下层 scope 的知识对上层不可见
