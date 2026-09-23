---
title: MemX — AI 系统的长期记忆
description: 为 AI 系统保存长期记忆：抽取、去重、衰减、混合检索。Rust 实现，提供命令行、REST 与 MCP 接入。早期试点。
---

<div class="memx-page">

# MemX

给 AI 系统的长期记忆：从对话里抽取值得留下的事实，去重，随时间衰减，按混合方式检索。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="compass" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">成熟度：早期试点</p>
    <div class="lurus-callout__body"><p>当前版本在预发与演示环境运行，未承载客户生产流量，尚未替换正在服务线上流量的上一代实现。MemX 是本站对该产品的称呼；引擎的工程名为 memorus，命令行（<code>memorus-r</code>）与服务（<code>memorus-server</code>）的二进制沿用工程名。</p></div>
  </div>
</div>

## 主张：记忆也需要可核查

一条记忆从哪条输入来、何时会衰减、检索时是否还成立，都应当查得到。记不住是一种问题；记错了而没人知道，是更大的问题。

## 它做什么

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: '抽取（Reflector）', body: '输入经四步处理：识别、评分、隐私脱敏、提炼成一条条记忆。默认 rules 模式完全本地，不调用任何外部模型；调用模型的模式需要显式开启。', icon: 'filter' },
    { title: '去重与冲突（Curator）', body: '新记忆与已有记忆比对相似度，决定新增、合并或跳过；语义相关但互相矛盾的记忆会被标记出来。', icon: 'git-merge' },
    { title: '衰减（Decay）', body: '按半衰期计算权重，新记忆有保护期；每被检索一次权重回升，被检索足够多次后不再衰减。参数可配置。', icon: 'timer' },
    { title: '检索（Generator）', body: '精确关键词、词干模糊、元数据、语义相似度四层信号融合成一个排序分，再乘以衰减权重与时效因子。', icon: 'search' },
    { title: '脱敏', body: '13 层内置规则（密钥、令牌、邮箱、电话、卡号、私钥、数据库连接串、本地路径等），可追加自定义正则；内置规则不能单独关闭。', icon: 'shield-check' },
    { title: '检索时核验', body: '记忆可以锚定到源文件里的一段文字；检索时重新核对，标为「已核验」「陈旧」或「无法核验」，随结果一起返回。', icon: 'check-circle' },
  ]"
/>

## 架构概览

<DiagramFigure
  caption="CLI、语言绑定、REST/MCP/daemon 服务端都调同一个 Memory API，后面接 ACE 的 reflect–curate–decay–generate 管道。图例只分两档：「默认接线」与「opt-in 或未接线」—— reranker 默认 enabled:false，graph-store 四个后端引擎里没有调用方，都归后者。子标签写的是「几个后端 · 其中几个真接上」，不是「支持几个后端」。"
  source="2b-svc-memorus · 与仓库 README 同一张图">
  <MemxArchitecture />
</DiagramFigure>

## 边界与现状

<details class="lurus-faq-item"><summary>还在早期，我们写清楚到哪一步</summary>

- 零配置默认使用确定性的哈希向量，不是真实的语义嵌入；要做语义检索，需要配置嵌入服务或开启本地嵌入的构建选项。
- 「混合检索优于纯向量检索」目前只有机制，没有可复现的基准数字支撑，所以这里不写数字。
- 检索结果返回总分与核验状态；各层的分项得分目前只在引擎内部计算，还没有通过接口返回。
- 数据模型带来源字段；目前经服务接口写入的记忆还没有来源记录。
- 服务端 MCP 端点目前仅支持单租户部署。

</details>

## 下一步

<NextSteps
  :steps="[
    { text: '快速开始 — 部署并写入第一条记忆', link: '/memx/quickstart', primary: true },
    { text: '核心概念 — 抽取、去重、衰减、检索', link: '/memx/concepts' },
    { text: '架构设计 — 写入与检索的数据流', link: '/memx/architecture' },
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
</style>
