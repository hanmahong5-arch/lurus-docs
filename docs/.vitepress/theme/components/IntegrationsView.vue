<script setup lang="ts">
/**
 * Integration / MCP catalog page, locale-aware. Category + item text comes from
 * the integrations overlay (positionally merged onto the zh base, which carries
 * icon/link); UI strings from the integrations overlay. Falls back to zh on the
 * default locale or a gap. Rendered by docs/{locale}/integrations/index.md.
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import Icon from './Icon.vue'
import NextSteps from './landing/NextSteps.vue'
import { integrationCategories } from '../../data/integrations'
import { integrationsPage, localizeIntegrations, toLocale } from '../../data/i18n'

const { lang } = useData()
const page = computed(() => integrationsPage(lang.value))
const categories = computed(() => localizeIntegrations(integrationCategories, lang.value))
const prefix = computed(() => {
  const l = toLocale(lang.value)
  return l ? `/${l}` : ''
})

const ui = computed(
  () =>
    page.value?.ui ?? {
      eyebrow: '集成目录',
      title: '集成与 MCP 目录',
      lede: '按类别浏览：Lurus 产品 MCP、Switch 内置服务器、AI 客户端、SDK 与协议兼容。每张卡片直达接入文档。',
      calloutTitle: '本页由数据驱动',
      calloutBody: '目录来自维护中的数据文件，编辑后重建即同步；所有条目均对应真实已交付能力。',
      catEyebrow: '集成分类',
      nextTitle: '下一步',
      next: ['Switch — 统一管理 MCP', '数据结构 / Schema', '快速开始', '客户端集成'],
    },
)

// In-set NextSteps targets (translated pages exist) → locale-prefixed.
const NEXT_LINKS = ['/switch/mcp-servers', '/api/schemas', '/guide/quickstart', '/guide/clients/cherry-studio']
const nextSteps = computed(() =>
  ui.value.next.map((text, i) => ({ text, link: prefix.value + NEXT_LINKS[i], primary: i === 0 })),
)
</script>

<template>
  <div class="lurus-section-head">
    <span class="lurus-section-head__eyebrow"><Icon name="puzzle" :size="14" /> {{ ui.eyebrow }}</span>
    <h1 class="lurus-section-head__title">{{ ui.title }}</h1>
    <p class="lurus-section-head__lede">{{ ui.lede }}</p>
  </div>

  <div class="lurus-callout lurus-callout--info">
    <span class="lurus-callout__icon"><Icon name="plug-zap" :size="18" /></span>
    <div>
      <p class="lurus-callout__title">{{ ui.calloutTitle }}</p>
      <div class="lurus-callout__body">{{ ui.calloutBody }}</div>
    </div>
  </div>

  <div v-for="cat in categories" :key="cat.id" class="integrations-cat">
    <div class="lurus-section-head">
      <span class="lurus-section-head__eyebrow"><Icon :name="cat.icon" :size="14" /> {{ ui.catEyebrow }}</span>
      <h2 class="lurus-section-head__title">{{ cat.title }}</h2>
      <p class="lurus-section-head__lede">{{ cat.lede }}</p>
    </div>
    <div class="lurus-cards lurus-cards--compact">
      <a
        v-for="i in cat.items"
        :key="cat.id + '-' + i.name"
        class="lurus-card lurus-card--api"
        :href="i.link"
      >
        <span class="lurus-card__icon"><Icon :name="i.icon" :size="22" /></span>
        <div class="lurus-card__title">{{ i.name }} <span v-if="i.tag" class="lurus-tag">{{ i.tag }}</span></div>
        <p class="lurus-card__body">{{ i.desc }}</p>
      </a>
    </div>
  </div>

  <NextSteps :title="ui.nextTitle" :steps="nextSteps" />
</template>
