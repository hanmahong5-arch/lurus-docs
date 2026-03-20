---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments:
  - docs/index.md
  - docs/.vitepress/config.ts
  - docs/.vitepress/theme/style.css
  - docs/.vitepress/theme/index.ts
  - docs/.vitepress/theme/components/ActionCard.vue
---

# UX Design Specification — Lurus Docs

**Author:** Anita
**Date:** 2026-03-20
**Methodology:** BMAD v6.0.4 UX Design Workflow (14-step)

---

## 1. Discovery — 用户画像与核心挑战

### 双重用户画像

| 维度 | 投资人 (Investor) | 开发者 (Developer) |
|------|-------------------|-------------------|
| 目标 | 快速理解技术实力和商业价值 | 高效找到 API 文档和集成指南 |
| 行为 | 浏览首页 → 产品概览 → 架构 → 离开 | 搜索 → 特定 API → 代码示例 → 复制 |
| 停留 | 2-5 分钟，扫描式阅读 | 10-30 分钟，深度阅读 |
| 痛点 | 信息过载，找不到"亮点数字" | 产品太多，不知从何入手 |
| 信任信号 | 代码规模、性能指标、架构图 | 完整的 API 文档、可运行的示例 |

### 核心 UX 挑战

1. **12 个产品的认知负荷** — 用户被产品数量淹没
2. **双受众的信息架构矛盾** — 投资人要"震撼"，开发者要"精准"
3. **静态文档缺少生命力** — 纯文本无法传达技术实力
4. **移动端体验退化** — 响应式基础但未针对移动优化

---

## 2. Core Experience — 核心体验原则

### 核心行为

| 行为 | 设计要求 |
|------|---------|
| **首页扫描** | 5 秒内传达"这家公司做什么、做得多好" |
| **产品发现** | 3 次点击内到达任意产品的快速开始 |
| **代码复制** | 一键复制，视觉反馈明确 |
| **跨产品导航** | 任意页面可快速切换到其他产品 |

### 无缝交互

- 页面间切换零白屏（VitePress SPA 已满足）
- 搜索即时响应（本地搜索已满足）
- 暗色/亮色模式切换平滑过渡

---

## 3. Emotional Response — 情感设计

### 情感旅程

```
发现 → "哇，他们做了这么多" (震撼)
探索 → "文档写得很清楚" (信任)
使用 → "3 行代码就接入了" (愉悦)
深入 → "底层技术真扎实" (尊重)
```

### 情感 → 设计决策映射

| 情感 | 设计手段 |
|------|---------|
| 震撼感 | 首页数字统计动画、渐变色产品矩阵 |
| 信任感 | 状态徽章(已上线/内测中)、实际性能数据 |
| 愉悦感 | 微动效(卡片悬停、按钮点击)、代码块一键复制 |
| 专业感 | 一致的排版层次、精确的间距系统 |

---

## 4. Visual Foundation — 视觉基础

### 已有品牌系统 (保持)

- Primary: Ochre/Copper `#C67B5C` (暖色调，区别于科技蓝)
- Background: Warm cream `#F8F4F0` / Dark `#1C1815`
- Text: Ink tones `#3D3530`
- 暗色模式完整支持

### 增强方向

| 维度 | 当前 | 改进 |
|------|------|------|
| 排版层次 | 默认 VitePress | 增强 h1/h2 对比度，hero 标题渐变 |
| 间距节奏 | 均匀 | 引入 section 间的呼吸间距 |
| 视觉重心 | 文字驱动 | 数字+图标+颜色编码驱动 |
| 动效 | 卡片 hover lift | 增加滚动渐入、数字计数、按钮涟漪 |
| 产品识别 | 颜色区分 | 颜色+图标+状态徽章三重识别 |

---

## 5. Component Strategy — 组件策略

### 现有组件 (保持)

ActionCard, ProductCard, ApiEndpoint, ModelTable, Badge,
UpdatesFeed/Card/Filters, AdminLayout/Updates/Products/Editor,
InternalLayout/Content/Section

### 新增/增强组件

| 组件 | 优先级 | 用途 |
|------|--------|------|
| **StatusBadge** | P0 | 产品状态标识 (已上线/内测中/开发中) |
| **ScrollReveal (CSS-only)** | P0 | 滚动渐入动画，无 JS 依赖 |
| **StatCounter** | P0 | 首页数字统计，带数字动画 |
| **QuickNav** | P1 | 页面底部"下一步"导航面包屑 |
| **PersonaSwitch** | P2 | "我是投资人/我是开发者"切换视图 |

---

## 6. UX Patterns — 交互模式

### 导航模式
- **顶部**: 产品分组下拉（AI 服务 / 桌面&移动 / 平台）
- **侧边**: 当前产品的文档树
- **页内**: 右侧 TOC（已有）+ 底部前后导航
- **全局**: Cmd+K 搜索（已有）

### 反馈模式
- 代码复制: 图标变化 + "已复制" 提示
- 外部链接: ↗ 图标标识（ActionCard 已有）
- 加载状态: 不需要（VitePress 静态站）

### 产品状态标识模式
- `已上线` — 绿色实心点
- `内测中` — 橙色脉冲点
- `开发中` — 蓝色虚线点
- `规划中` — 灰色空心点

---

## 7. Responsive & Accessibility — 响应式与无障碍

### 断点策略

| 断点 | 行为 |
|------|------|
| >= 1200px | 三列网格，完整侧边栏 |
| 768-1199px | 两列网格，折叠侧边栏 |
| < 768px | 单列，底部导航，大触摸目标 |

### WCAG 2.1 AA 要求
- 颜色对比度 >= 4.5:1（当前暖色调需验证）
- 所有交互元素 >= 44px 触摸目标
- 键盘可达所有功能
- 动画 `prefers-reduced-motion` 降级

---

## 8. Implementation Priority — 实施优先级

### P0 — 立即实施 (CSS-only, 零风险)

1. 滚动渐入动画 (`@keyframes` + `animation-timeline`)
2. 首页统计数字视觉增强
3. 产品状态徽章 CSS
4. Section 间呼吸间距
5. 排版层次增强
6. 暗色模式过渡动画
7. 移动端触摸目标优化

### P1 — 短期 (Vue 组件)

1. StatusBadge 组件
2. 页面底部前后导航增强
3. 代码块复制按钮增强

### P2 — 中期 (需设计)

1. PersonaSwitch 投资人/开发者视图切换
2. 交互式 API Playground
3. 产品关系图可视化
