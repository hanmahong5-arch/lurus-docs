#!/usr/bin/env bun
/**
 * gen-feed.ts — generate docs/public/feed.xml (RSS 2.0) from the changelog.
 *
 * Source: docs/.vitepress/data/changelog.ts (single source of truth).
 * Usage: bun scripts/gen-feed.ts   (also runs via `bun run deploy`).
 *
 * lastBuildDate is pinned to the newest entry's date (not "now") so the feed
 * is byte-stable across rebuilds — no spurious diffs.
 */
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { changelog } from '../docs/.vitepress/data/changelog'

const SITE = 'https://docs.lurus.cn'
const ROOT = resolve(import.meta.dir, '..')
const PUBLIC_DIR = resolve(ROOT, 'docs', 'public')
const OUT = resolve(PUBLIC_DIR, 'feed.xml')

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString()
}

/** Wrap text in CDATA, splitting any literal `]]>` so it can't close the section early. */
function cdata(s: string): string {
  return `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

const sorted = [...changelog].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
const lastBuild = sorted.length ? rfc822(sorted[0].publishedAt) : rfc822('2026-01-01')

const items = sorted
  .map(
    e => `    <item>
      <title>${xmlEscape(`${e.productName} — ${e.title}`)}</title>
      <link>${SITE}/updates/#${e.id}</link>
      <guid isPermaLink="false">${e.id}</guid>
      <pubDate>${rfc822(e.publishedAt)}</pubDate>
      <description>${cdata(e.content)}</description>
    </item>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Lurus 产品动态</title>
    <link>${SITE}/updates/</link>
    <description>Lurus 全产品线最新变更、功能发布与技术里程碑</description>
    <language>zh-CN</language>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>
`

mkdirSync(PUBLIC_DIR, { recursive: true })
writeFileSync(OUT, xml, 'utf8')
console.log(`[gen-feed] wrote ${changelog.length} items → docs/public/feed.xml`)
