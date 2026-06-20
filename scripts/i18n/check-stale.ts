#!/usr/bin/env bun
/**
 * check-stale.ts — Report translations that may lag the Chinese original.
 *
 * Compares each zh source file's CURRENT git blob SHA against the baseline
 * recorded in i18n-manifest.json. A mismatch means the zh source changed since
 * the translations were last re-baselined -> the locale copies are likely stale.
 *
 * Also reports:
 *   - data overlays whose zh source-of-truth files drifted (regenerate overlays);
 *   - orphaned locale pages (locale file exists, zh source gone);
 *   - zh pages with no translation coverage at all (never translated).
 *
 * Exit code: 0 always, UNLESS --strict is passed AND stale entries exist (for
 * use as a blocking gate once the team opts in). Writes a markdown summary to
 * $GITHUB_STEP_SUMMARY when set, so the report renders in the CI checks UI.
 *
 * Usage: bun scripts/i18n/check-stale.ts [--strict]
 */
import { readFileSync, existsSync, appendFileSync } from 'fs'
import { resolve } from 'path'
import { execFileSync } from 'child_process'

const ROOT = resolve(import.meta.dir, '../..')
const MANIFEST = resolve(ROOT, 'docs/.vitepress/data/i18n-manifest.json')
const STRICT = process.argv.includes('--strict')

/** zh pages that are intentionally NOT translated (excluded from coverage gaps). */
const UNTRANSLATED_OK = [/^docs\/admin\//, /^docs\/updates\//]

function git(args: string[], input?: string): string {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', input }).trim()
}

/** git blob SHA of each working-tree path (one spawn). Missing files map to null. */
function blobNow(paths: string[]): Map<string, string | null> {
  const result = new Map<string, string | null>(paths.map((p) => [p, null]))
  const present = paths.filter((p) => existsSync(resolve(ROOT, p)))
  if (present.length) {
    const out = git(['hash-object', '--stdin-paths'], present.join('\n')).split('\n')
    present.forEach((p, i) => result.set(p, out[i] ?? null))
  }
  return result
}

interface Manifest {
  locales: string[]
  pages: Record<string, { sha: string | null; locales: string[] }>
  dataSources: Record<string, string | null>
}

if (!existsSync(MANIFEST)) {
  console.error(`[i18n] no manifest at ${MANIFEST} — run \`bun run i18n:manifest\` first`)
  process.exit(STRICT ? 1 : 0)
}
const manifest: Manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))

// ── 1. Stale translated pages + orphans ────────────────────────────────────────
const pagePaths = Object.keys(manifest.pages)
const nowPages = blobNow(pagePaths)
const stale: { zh: string; locales: string[] }[] = []
const orphans: string[] = []
for (const zh of pagePaths) {
  const cur = nowPages.get(zh) ?? null
  if (cur === null) {
    orphans.push(zh)
    continue
  }
  if (cur !== manifest.pages[zh].sha) stale.push({ zh, locales: manifest.pages[zh].locales })
}

// ── 2. Drifted data sources (generated overlays may be stale) ───────────────────
const dataPaths = Object.keys(manifest.dataSources)
const nowData = blobNow(dataPaths)
const driftedData = dataPaths.filter((d) => (nowData.get(d) ?? null) !== manifest.dataSources[d])

// ── 3. Coverage gaps: zh pages never translated ─────────────────────────────────
const allZh = git(['ls-tree', '-r', '--name-only', 'HEAD', '--', 'docs'])
  .split('\n')
  .filter((f) => f.endsWith('.md') && !/^docs\/(en|ja|ko|es|fr)\//.test(f))
const untranslated = allZh.filter(
  (f) => !manifest.pages[f] && !UNTRANSLATED_OK.some((re) => re.test(f)),
)

// ── Report ──────────────────────────────────────────────────────────────────────
const lines: string[] = []
const md: string[] = ['## i18n staleness report', '']

lines.push(`[i18n] tracked: ${pagePaths.length} pages x ${manifest.locales.length} locales`)
md.push(`Tracking **${pagePaths.length}** translated pages across **${manifest.locales.join(', ')}**.`, '')

if (stale.length) {
  lines.push(`[i18n] STALE: ${stale.length} page(s) — zh source changed since last re-baseline:`)
  md.push(`### ⚠️ Stale — zh source changed since translations were baselined (${stale.length})`, '', '| zh source | locales |', '| --- | --- |')
  for (const s of stale) {
    lines.push(`  - ${s.zh}  [${s.locales.join(', ')}]`)
    md.push(`| \`${s.zh}\` | ${s.locales.join(', ')} |`)
  }
  md.push('')
} else {
  lines.push('[i18n] no stale pages — all translations match their zh baseline')
  md.push('### ✅ No stale pages', '')
}

if (driftedData.length) {
  lines.push(`[i18n] DATA DRIFT: regenerate overlays (i18n-data.ts / i18n-pages-data.ts):`)
  md.push(`### ⚠️ Data overlays may be stale — source-of-truth changed (${driftedData.length})`, '')
  for (const d of driftedData) {
    lines.push(`  - ${d}`)
    md.push(`- \`${d}\``)
  }
  md.push('')
}

if (orphans.length) {
  lines.push(`[i18n] ORPHANS: ${orphans.length} locale page(s) whose zh source is gone:`)
  for (const o of orphans) lines.push(`  - ${o}`)
  md.push(`### ℹ️ Orphaned locale pages (zh source removed) (${orphans.length})`, '', ...orphans.map((o) => `- \`${o}\``), '')
}

if (untranslated.length) {
  lines.push(`[i18n] COVERAGE: ${untranslated.length} zh page(s) with no translation:`)
  for (const u of untranslated) lines.push(`  - ${u}`)
  md.push(`### ℹ️ Untranslated zh pages (${untranslated.length})`, '', ...untranslated.map((u) => `- \`${u}\``), '')
}

console.log(lines.join('\n'))

const summaryFile = process.env.GITHUB_STEP_SUMMARY
if (summaryFile) appendFileSync(summaryFile, md.join('\n') + '\n')

if (STRICT && stale.length) {
  console.error(`[i18n] --strict: ${stale.length} stale page(s) — failing.`)
  process.exit(1)
}
