/**
 * One-off helper: append a "related products" block to each product index.md.
 * Kept in scripts/ so the intent is auditable — run with `bun scripts/append-related.ts`.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const pairs: Array<[string, string]> = [
  ['docs/kova/index.md',     'kova'],
  ['docs/memx/index.md',     'memx'],
  ['docs/lucrum/index.md',   'lucrum'],
  ['docs/lumen/index.md',    'lumen'],
  ['docs/switch/index.md',   'switch'],
  ['docs/creator/index.md',  'creator'],
  ['docs/forge/index.md',    'forge'],
  ['docs/platform/index.md', 'platform'],
]

const marker = '<!-- lurus:related-block -->'

for (const [file, pid] of pairs) {
  const path = join(process.cwd(), file)
  if (!existsSync(path)) {
    console.warn('skip (missing):', file)
    continue
  }
  let body = readFileSync(path, 'utf-8')
  if (body.includes(marker)) {
    console.log('skip (already injected):', file)
    continue
  }
  const block = [
    '',
    marker,
    '',
    '---',
    '',
    '## 相关产品与下一步',
    '',
    `<RelatedProducts product-id="${pid}" />`,
    '',
  ].join('\n')
  body = body.trimEnd() + '\n' + block + '\n'
  writeFileSync(path, body, 'utf-8')
  console.log('injected:', file)
}
