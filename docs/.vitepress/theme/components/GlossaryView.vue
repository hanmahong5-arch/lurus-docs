<script setup lang="ts">
/**
 * Full glossary page, locale-aware. Definitions come from glossary.ts (zh) +
 * the glossaryDefs overlay; group labels and page UI come from the glossaryPage
 * overlay. Falls back to the zh source when on the default locale or on a gap.
 * Rendered by docs/{locale}/guide/glossary.md (thin wrappers).
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import Icon from './Icon.vue'
import { glossary } from '../../data/glossary'
import { glossaryDef, glossaryPage, toLocale } from '../../data/i18n'

const { lang } = useData()
const loc = computed(() => toLocale(lang.value))
const page = computed(() => glossaryPage(lang.value))

// zh base group labels + canonical display order.
const GROUPS_ZH: Record<string, { title: string; desc: string }> = {
  general: { title: '通用', desc: '跨产品、API 与基础设施共通概念' },
  auth: { title: '身份认证', desc: '登录、Token、SSO、合规相关' },
  kova: { title: 'Kova 执行引擎', desc: 'Agent、WAL、MCP 与调度' },
  memx: { title: 'MemX 记忆', desc: '蒸馏、去重、衰退、检索' },
  lucrum: { title: 'Lucrum 量化', desc: '回测、风控指标、交易规则' },
  switch: { title: 'Switch 管理', desc: 'CLI、Provider、MCP 协同' },
  lumen: { title: 'Lumen 可观测', desc: 'Replay、Checkpoint、成本' },
}
const ORDER = ['general', 'auth', 'kova', 'memx', 'lucrum', 'switch', 'lumen']

const groups = computed(() =>
  ORDER.map((tag) => {
    const label = page.value?.groups[tag] ?? GROUPS_ZH[tag]
    return {
      tag,
      title: label.title,
      desc: label.desc,
      entries: Object.entries(glossary)
        .filter(([, v]) => (v.tags || []).includes(tag as any))
        .sort(([a], [b]) => a.localeCompare(b, 'zh'))
        .map(([term, entry]) => ({
          term,
          def: glossaryDef(term, entry.zh, lang.value),
          en: entry.en,
          see: entry.see,
        })),
    }
  }).filter((g) => g.entries.length > 0),
)

const total = computed(() => Object.keys(glossary).length)

const ui = computed(
  () =>
    page.value?.ui ?? {
      eyebrow: '术语表',
      title: '术语表',
      ledePrefix: 'Lurus 产品文档中出现的关键术语，共 ',
      ledeSuffix: ' 条，按主题分组。支持 Ctrl + F 快速定位。',
      navAria: '按主题跳转',
      see: '阅读详情 →',
      tipTitle: '缺少术语？',
      tipBody: '缺失或需要补充的术语，欢迎提交 Issue。',
      tipLink: 'GitHub Issues ↗',
    },
)
</script>

<template>
  <div class="lurus-section-head">
    <span class="lurus-section-head__eyebrow"><Icon name="book-a" :size="14" /> {{ ui.eyebrow }}</span>
    <h1 class="lurus-section-head__title">{{ ui.title }}</h1>
    <p class="lurus-section-head__lede">{{ ui.ledePrefix }}<strong>{{ total }}</strong>{{ ui.ledeSuffix }}</p>
  </div>

  <nav class="glossary-nav" :aria-label="ui.navAria">
    <a v-for="g in groups" :key="g.tag" :href="`#${g.tag}`" class="glossary-nav__chip">
      {{ g.title }}<span class="glossary-nav__count">{{ g.entries.length }}</span>
    </a>
  </nav>

  <div v-for="g in groups" :key="g.tag" class="glossary-group">
    <h2 :id="g.tag">{{ g.title }}</h2>
    <p class="glossary-group__desc">{{ g.desc }}</p>
    <dl class="glossary-list">
      <template v-for="e in g.entries" :key="e.term">
        <dt :id="`term-${e.term.replace(/\s+/g, '-').toLowerCase()}`">
          {{ e.term }}
          <span v-if="loc === null && e.en" class="glossary-en">{{ e.en }}</span>
        </dt>
        <dd>
          {{ e.def }}
          <a v-if="e.see" :href="e.see" class="glossary-see">{{ ui.see }}</a>
        </dd>
      </template>
    </dl>
  </div>

  <div class="lurus-callout lurus-callout--tip glossary-tip">
    <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
    <div>
      <p class="lurus-callout__title">{{ ui.tipTitle }}</p>
      <div class="lurus-callout__body">
        {{ ui.tipBody }}
        <a href="https://github.com/hanmahong5-arch/lurus-docs/issues">{{ ui.tipLink }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glossary-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 4px 0 8px;
}
.glossary-nav__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: var(--lurus-radius-pill);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2) !important;
  text-decoration: none !important;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: border-color var(--lurus-dur-fast), color var(--lurus-dur-fast);
}
.glossary-nav__chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.glossary-nav__count {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  border-radius: var(--lurus-radius-pill);
  padding: 0 7px;
  line-height: 1.5;
}
.glossary-group {
  margin-top: 2.25rem;
}
.glossary-group__desc {
  color: var(--vp-c-text-3);
  margin: -0.5rem 0 1rem;
  font-size: 0.92rem;
}
.glossary-list {
  display: grid;
  grid-template-columns: minmax(160px, auto) 1fr;
  gap: 12px 24px;
  margin: 0;
  padding: 0;
}
.glossary-list dt {
  font-weight: 700;
  color: var(--vp-c-brand-1);
  scroll-margin-top: 80px;
}
.glossary-en {
  display: block;
  font-weight: 400;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  font-style: italic;
  margin-top: 2px;
}
.glossary-list dd {
  margin: 0;
  color: var(--vp-c-text-1);
  line-height: 1.55;
}
.glossary-see {
  display: inline-block;
  margin-left: 8px;
  color: var(--vp-c-brand-1);
  font-size: 0.85rem;
  text-decoration: none;
}
.glossary-see:hover {
  text-decoration: underline;
}
.glossary-tip {
  margin-top: 2.5rem;
}
@media (max-width: 640px) {
  .glossary-list {
    grid-template-columns: 1fr;
    gap: 4px 0;
  }
  .glossary-list dt {
    margin-top: 12px;
  }
}
</style>
