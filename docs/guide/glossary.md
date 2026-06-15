---
title: 术语表
description: Lurus 产品文档中出现的关键术语按主题分组的完整解释。
---

<script setup>
import { glossary } from '../.vitepress/data/glossary'
import { computed } from 'vue'

const GROUPS = [
  { tag: 'general',  title: '通用',          desc: '跨产品、API 与基础设施共通概念' },
  { tag: 'auth',     title: '身份认证',      desc: '登录、Token、SSO、合规相关' },
  { tag: 'kova',     title: 'Kova 执行引擎', desc: 'Agent、WAL、MCP 与调度' },
  { tag: 'memx',     title: 'MemX 记忆',     desc: '蒸馏、去重、衰退、检索' },
  { tag: 'lucrum',   title: 'Lucrum 量化',   desc: '回测、风控指标、交易规则' },
  { tag: 'switch',   title: 'Switch 管理',   desc: 'CLI、Provider、MCP 协同' },
  { tag: 'lumen',    title: 'Lumen 可观测',  desc: 'Replay、Checkpoint、成本' },
]

const groups = computed(() =>
  GROUPS.map(g => ({
    ...g,
    entries: Object.entries(glossary)
      .filter(([, v]) => (v.tags || []).includes(g.tag))
      .sort(([a], [b]) => a.localeCompare(b, 'zh')),
  })).filter(g => g.entries.length > 0)
)

const total = computed(() => Object.keys(glossary).length)
</script>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-a" :size="14" /> 术语表</span>
  <h1 class="lurus-section-head__title">术语表</h1>
  <p class="lurus-section-head__lede">Lurus 产品文档中出现的关键术语，共 <strong>{{ total }}</strong> 条，按主题分组。支持 <kbd>Ctrl</kbd> + <kbd>F</kbd> 快速定位。</p>
</div>

<nav class="glossary-nav" aria-label="按主题跳转">
  <a v-for="g in groups" :key="g.tag" :href="`#${g.tag}`" class="glossary-nav__chip">
    {{ g.title }}<span class="glossary-nav__count">{{ g.entries.length }}</span>
  </a>
</nav>

<div v-for="g in groups" :key="g.tag" class="glossary-group">
  <h2 :id="g.tag">{{ g.title }}</h2>
  <p class="glossary-group__desc">{{ g.desc }}</p>
  <dl class="glossary-list">
    <template v-for="[term, entry] in g.entries" :key="term">
      <dt :id="`term-${term.replace(/\s+/g, '-').toLowerCase()}`">
        {{ term }}
        <span v-if="entry.en" class="glossary-en">{{ entry.en }}</span>
      </dt>
      <dd>
        {{ entry.zh }}
        <a v-if="entry.see" :href="entry.see" class="glossary-see">阅读详情 →</a>
      </dd>
    </template>
  </dl>
</div>

::: tip 缺少术语？
请在 [GitHub Issues](https://github.com/hanmahong5-arch/lurus-docs/issues) 中提出。
:::

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
