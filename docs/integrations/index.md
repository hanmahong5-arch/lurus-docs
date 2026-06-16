---
title: 集成与 MCP 目录
description: Lurus 全产品的 MCP 服务器、Switch 内置工具、AI 客户端与 SDK/协议兼容一览，按类别浏览即可接入。
---

<script setup>
import { data } from '../.vitepress/data/integrations.data'
</script>

<div class="integrations-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="puzzle" :size="14" /> 集成目录</span>
  <h1 class="lurus-section-head__title">集成与 MCP 目录</h1>
  <p class="lurus-section-head__lede">按类别浏览：Lurus 产品 <Term t="MCP">MCP</Term>、Switch 内置服务器、AI 客户端、SDK 与协议兼容。每张卡片直达接入文档。</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="plug-zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">本页由数据驱动</p>
    <div class="lurus-callout__body">目录来自 <code>docs/.vitepress/data/integrations.data.ts</code>，编辑后重建即同步；所有条目均对应真实已交付能力。</div>
  </div>
</div>

<div v-for="cat in data.categories" :key="cat.id" class="integrations-cat">
  <div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon :name="cat.icon" :size="14" /> 集成分类</span><h2 class="lurus-section-head__title">{{ cat.title }}</h2><p class="lurus-section-head__lede">{{ cat.lede }}</p></div>
  <div class="lurus-cards lurus-cards--compact"><a v-for="i in cat.items" :key="cat.id + '-' + i.name" class="lurus-card lurus-card--api" :href="i.link"><span class="lurus-card__icon"><Icon :name="i.icon" :size="22" /></span><div class="lurus-card__title">{{ i.name }} <span v-if="i.tag" class="lurus-tag">{{ i.tag }}</span></div><p class="lurus-card__body">{{ i.desc }}</p></a></div>
</div>

<NextSteps
  title="下一步"
  :steps="[
    { text: 'Switch — 统一管理 MCP', link: '/switch/mcp-servers', primary: true },
    { text: '数据结构 / Schema', link: '/api/schemas' },
    { text: '快速开始', link: '/guide/quickstart' },
    { text: '客户端集成', link: '/guide/clients/cherry-studio' },
  ]"
/>

</div>
