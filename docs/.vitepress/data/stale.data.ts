/**
 * stale.data.ts — Build-time staleness data for the reader-facing banner.
 *
 * A locale page is "stale" when its zh source's content hash no longer matches
 * the baseline recorded in i18n-manifest.json (i.e. the Chinese original changed
 * after the translation was last re-baselined). This loader recomputes that hash
 * at build time and exports the set of stale locale page paths; StaleBanner.vue
 * shows a notice on those pages.
 *
 * The hash is git's blob SHA-1 reproduced in pure JS (sha1("blob <len>\0" + body),
 * body LF-normalized to match `.gitattributes` eol=lf) — so it equals the SHAs
 * written by scripts/i18n/build-manifest.ts WITHOUT needing git at build time.
 * This keeps the production Docker build self-contained.
 */
import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineLoader } from 'vitepress'

const HERE = dirname(fileURLToPath(import.meta.url)) // docs/.vitepress/data
const ROOT = resolve(HERE, '../../..') // repo root
const MANIFEST = resolve(HERE, 'i18n-manifest.json')

/** git blob SHA-1 of file content, LF-normalized (matches `text=auto eol=lf`). */
function gitBlobSha(buf: Buffer): string {
  const lf = Buffer.from(buf.toString('latin1').replace(/\r\n/g, '\n'), 'latin1')
  const header = Buffer.from(`blob ${lf.length}\0`, 'latin1')
  return createHash('sha1').update(Buffer.concat([header, lf])).digest('hex')
}

export interface StaleData {
  /** Locale-relative page paths (e.g. "en/platform/auth/oidc.md") whose zh source drifted. */
  stale: string[]
}

declare const data: StaleData
export { data }

export default defineLoader({
  // Re-runs when the baseline changes. (zh files are read fresh on each build.)
  watch: ['./i18n-manifest.json'],
  load(): StaleData {
    if (!existsSync(MANIFEST)) return { stale: [] }
    const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')) as {
      pages: Record<string, { sha: string | null; locales: string[] }>
    }
    const stale: string[] = []
    for (const [zhPath, entry] of Object.entries(manifest.pages)) {
      const abs = resolve(ROOT, zhPath)
      if (entry.sha === null || !existsSync(abs)) continue
      if (gitBlobSha(readFileSync(abs)) === entry.sha) continue
      const rel = zhPath.replace(/^docs\//, '') // platform/auth/oidc.md
      for (const locale of entry.locales) stale.push(`${locale}/${rel}`)
    }
    return { stale }
  },
})
