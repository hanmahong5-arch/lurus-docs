<script setup lang="ts">
/**
 * StaleBanner — reader-facing notice shown on a locale page when its Chinese
 * source has changed since the translation was last baselined (see
 * ../../data/stale.data.ts). Honest signal that the page may lag the original.
 */
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as staleData } from '../../data/stale.data'

const { page, lang } = useData()

const isStale = computed(() => staleData.stale.includes(page.value.relativePath))

interface Msg {
  text: string
  link: string
}
const MESSAGES: Record<string, Msg> = {
  en: {
    text: 'This page was translated from the Chinese original, which has changed since — it may be out of date. The Chinese version is authoritative.',
    link: 'View the Chinese original',
  },
  ja: {
    text: 'このページは中国語の原文から翻訳されましたが、その後原文が更新されているため、内容が古い可能性があります。正本は中国語版です。',
    link: '中国語の原文を見る',
  },
  ko: {
    text: '이 페이지는 중국어 원문에서 번역되었으나 이후 원문이 변경되어 내용이 오래되었을 수 있습니다. 중국어 버전이 정본입니다.',
    link: '중국어 원문 보기',
  },
  es: {
    text: 'Esta página se tradujo del original en chino, que ha cambiado desde entonces, por lo que puede estar desactualizada. La versión china es la autorizada.',
    link: 'Ver el original en chino',
  },
  fr: {
    text: "Cette page a été traduite de l'original chinois, qui a changé depuis ; elle peut donc être obsolète. La version chinoise fait foi.",
    link: "Voir l'original chinois",
  },
}
const msg = computed(() => MESSAGES[lang.value] ?? MESSAGES.en)

// zh original: strip the locale prefix, drop the .md / index.md suffix.
const zhHref = computed(() => {
  const rel = page.value.relativePath.replace(/^[a-z]{2}\//, '').replace(/(index)?\.md$/, '')
  return withBase('/' + rel)
})
</script>

<template>
  <div v-if="isStale" class="i18n-stale" role="note">
    <span class="i18n-stale__icon" aria-hidden="true">⚠</span>
    <span class="i18n-stale__text">
      {{ msg.text }}
      <a :href="zhHref" class="i18n-stale__link">{{ msg.link }} →</a>
    </span>
  </div>
</template>

<style scoped>
.i18n-stale {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: 16px 0 0;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-warning-1, #d97706);
  border-radius: 8px;
  background: var(--vp-c-warning-soft, rgba(234, 179, 8, 0.12));
  font-size: 14px;
  line-height: 1.5;
}
.i18n-stale__icon {
  flex-shrink: 0;
  color: var(--vp-c-warning-1, #d97706);
}
.i18n-stale__link {
  font-weight: 600;
  white-space: nowrap;
}
</style>
