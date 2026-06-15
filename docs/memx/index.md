---
title: MemX — AI 自适应记忆引擎
description: 基于 ACE v2.0 构建的 AI 记忆引擎，智能蒸馏、仿生遗忘、全链路隐私保护。
---

<div class="memx-page">

<ProductHero product-id="memx" />

## 什么是 MemX？

**MemX** 是 Lurus 推出的 AI 自适应记忆引擎，基于 **<Term t="ACE">ACE（Adaptive Context Engine）</Term>v2.0** 构建。它为 AI Agent 提供完整的知识生命周期管理：**<Term t="Knowledge Distillation">智能蒸馏</Term> → <Term t="Semantic Dedup">语义去重</Term> → 衰退遗忘 → 混合检索**，让 AI 拥有真正像人类一样的"记忆力"。

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="brain" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">三个核心优势</p>
    <div class="lurus-callout__body"><ul><li><strong>默认混合模式 + 自动降级</strong> — LLM 不可用时切纯规则，零调用零成本。</li><li><strong>仿生遗忘曲线</strong> — Ebbinghaus 指数衰减，半衰期默认 30 天，强召回项升永久记忆。</li><li><strong>全链路隐私保护</strong> — 敏感信息永不进向量数据库。</li></ul></div>
  </div>
</div>

<MetricStats :items="[
  { label: 'PII 过滤规则', value: '12 条', hint: '不可绕过' },
  { label: '混合检索', value: '4 层', hint: 'L1→L4 加权融合' },
  { label: '衰减半衰期', value: '30 天', hint: '默认可配' },
  { label: '交付形态', value: 'Python · REST · MCP' },
]" />

## 核心特性

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> 四大模块</span>
  <h2 class="lurus-section-head__title">从对话到可检索的记忆</h2>
  <p class="lurus-section-head__lede">规则/公式/参数详解见 <a href="/memx/concepts">核心概念</a> 与 <a href="/memx/architecture">架构设计</a>。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: '智能知识蒸馏（Reflector）', body: 'hybrid 模式（规则预筛 + LLM 精炼）识别 5 种知识模式：错误修复 / 重试成功 / 配置变更 / 新工具使用 / 重复操作，每条 0-100 评分过滤低分噪音。', icon: 'filter' },
    { title: '语义去重与冲突检测（Curator）', body: '余弦相似度 ≥0.8 自动合并、0.5-0.8 标记潜在冲突、低于 0.5 视为独立知识。', icon: 'git-merge' },
    { title: '仿生记忆衰减', body: '7 天保护期 + 指数衰减 + 召回增强；被检索 15 次以上晋升永久记忆不再衰减。', icon: 'timer' },
    { title: '四层混合检索', body: 'L1 精确 → L2 模糊 → L3 元数据 → L4 向量，ScoreMerger 加权融合后乘以 DecayWeight × RecencyBoost × ScopeBoost，向量层不可用自动降级。', icon: 'search' },
    { title: '隐私优先设计', body: '12 条内置敏感信息过滤规则（密钥 / Token / 数据库连接串 / 本地路径 / 自定义正则），写入前自动拦截。', icon: 'shield-check' },
  ]"
/>

## 架构概览

知识从对话流入，依次经过蒸馏、隐私过滤、去重，落入向量与元数据存储；检索请求走四层混合管道，衰减引擎在后台持续维护记忆活跃度。

<ArchitectureDiagram
  title="ACE 引擎数据流"
  chart="graph TB
  Input[对话流] --> Reflector[Reflector 知识蒸馏]
  Reflector --> PII[PII 过滤 12 规则]
  PII --> Curator[Curator 语义去重]
  Curator --> Store[(向量 + 元数据)]
  Store --> Decay[Decay Engine Ebbinghaus]
  Query[检索请求] --> Hybrid[四层混合检索]
  Hybrid --> Store"
/>

## 适用场景

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
    <div class="lurus-card__title">编程助手</div>
    <p class="lurus-card__body">记住你的代码习惯、踩过的坑、项目约定。</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span>
    <div class="lurus-card__title">客服系统</div>
    <p class="lurus-card__body">积累客户历史交互知识，提供个性化服务。</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="book-open" :size="20" /></span>
    <div class="lurus-card__title">个人知识库</div>
    <p class="lurus-card__body">从日常对话中自动提炼和组织知识。</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">团队协作</div>
    <p class="lurus-card__body">共享团队级记忆，新成员快速获取上下文。</p>
  </div>
</div>

## 与传统记忆系统的对比

<ComparisonTable
  self-label="MemX (ACE)"
  :competitors="['传统方案 (mem0)']"
  title="为什么不是又一个向量库"
  :rows="[
    { dimension: '知识提取', self: 'hybrid 混合引擎（规则预筛 + LLM 精炼，减少 90%+ 调用）', alt: { '传统方案 (mem0)': 'LLM（每次 2-5K tokens）' } },
    { dimension: '去重', self: '余弦相似度自动合并', alt: { '传统方案 (mem0)': 'LLM 逐条判断' } },
    { dimension: '遗忘', self: '指数衰减 + 召回增强', alt: { '传统方案 (mem0)': '永久存储，无法淘汰' } },
    { dimension: '搜索', self: '四层混合搜索', alt: { '传统方案 (mem0)': '仅向量搜索' } },
    { dimension: '隐私', self: '12 条内置敏感信息过滤规则', alt: { '传统方案 (mem0)': '无内置保护' } },
    { dimension: '作用域', self: '层级化（global / project / workspace）', alt: { '传统方案 (mem0)': '扁平（user / agent）' } },
    { dimension: 'Token 管理', self: '内置预算裁剪（CJK 感知）', alt: { '传统方案 (mem0)': '调用方自行管理' } },
    { dimension: '本地嵌入', self: 'ONNX 本地推理，完全离线', alt: { '传统方案 (mem0)': '需要 API' } },
  ]"
/>

## 下一步

<NextSteps
  :steps="[
    { text: '快速开始 — 5 分钟体验核心功能', link: '/memx/quickstart', primary: true },
    { text: '核心概念 — 深入 ACE 引擎设计原理', link: '/memx/concepts' },
    { text: '架构设计 — 完整系统架构', link: '/memx/architecture' },
    { text: '常见问题', link: '/memx/faq' },
  ]"
/>

<!-- lurus:related-block -->

## 相关产品与下一步

<RelatedProducts product-id="memx" />

</div>

<style>
.memx-page .lurus-callout {
  margin: 20px 0;
}
.memx-page .lurus-section-head {
  margin-top: 8px;
}
</style>
