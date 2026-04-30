#!/usr/bin/env bun
/**
 * secrets-guard.ts — pre-build scan for the internal docs site.
 *
 * Goal: refuse to build internal/ if anyone pasted real secrets into the
 * markdown. We do plain-text matching, not entropy analysis — false-positive
 * rate is biased toward over-flag (better to fail loud than ship a key).
 *
 * Run by `bun run build:internal` automatically.
 *
 * Bypass for legitimate examples: prefix with `EXAMPLE_` or `placeholder_` or
 * use the literal `<your-key-here>` form.
 */

import { readdirSync, readFileSync, statSync } from 'fs'
import { join, relative } from 'path'

const ROOT = join(import.meta.dir, '..', 'internal')

interface Hit {
  file: string
  line: number
  excerpt: string
  rule: string
}

const RULES: Array<{ name: string; pattern: RegExp; allow?: RegExp }> = [
  // High-entropy / structural keys (these only match concrete formats)
  { name: 'aws-access-key', pattern: /AKIA[0-9A-Z]{16}/ },
  { name: 'gcp-key', pattern: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'github-pat', pattern: /ghp_[A-Za-z0-9]{36,}/ },
  { name: 'github-fine-grained', pattern: /github_pat_[A-Za-z0-9_]{50,}/ },
  { name: 'slack-token', pattern: /xox[baprs]-[A-Za-z0-9-]{10,}/ },
  {
    name: 'openai-key',
    pattern: /sk-[A-Za-z0-9]{20,}/,
    allow: /(your[-_]?key|placeholder|example|<.*>|x{8,}|\*{4,}|change[-_]?me|EXAMPLE_|REPLACE_|REDACTED|sk-EXAMPLE)/i,
  },
  {
    name: 'anthropic-key',
    pattern: /sk-ant-(api|admin)\d{2}-[A-Za-z0-9_-]{20,}/,
    allow: /(your[-_]?key|placeholder|example|<.*>|x{8,}|\*{4,}|change[-_]?me|EXAMPLE_|REPLACE_|REDACTED)/i,
  },
  { name: 'jwt-token', pattern: /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/ },
  { name: 'bearer-long', pattern: /[Bb]earer\s+[A-Za-z0-9_-]{40,}/ },

  // PEM private key — need both header AND body chars to flag (not just docs mentioning the format)
  {
    name: 'private-key-pem',
    pattern: /-----BEGIN (RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----[\s\\n]*[A-Za-z0-9+/=]{40,}/,
    allow: /\\n\.\.\.|\.\.\.[\s]*-----END|placeholder|EXAMPLE|<your/i,
  },

  // Lurus-specific assignment patterns (require = with quoted/non-empty value, not just kubectl reference)
  {
    name: 'lurus-internal-api-key',
    pattern: /INTERNAL_API_KEY\s*[=:]\s*["'`]?([A-Za-z0-9_-]{20,})["'`]?/,
    allow: /(your[-_]?key|placeholder|example|<.*>|x{8,}|\*{4,}|change[-_]?me|EXAMPLE_|REPLACE_|REDACTED|\${|<INTERNAL_API_KEY>)/i,
  },
  {
    name: 'pg-password',
    pattern: /PG[A-Z_]*PASSWORD\s*[=:]\s*["'`]?([^\s"'`]{12,})["'`]?/,
    allow: /(your[-_]?password|placeholder|example|<.*>|x{8,}|\*{4,}|change[-_]?me|EXAMPLE_|\$\{)/i,
  },
  {
    name: 'redis-password',
    pattern: /REDIS_PASSWORD\s*[=:]\s*["'`]?([^\s"'`]{12,})["'`]?/,
    allow: /(your[-_]?password|placeholder|example|<.*>|x{8,}|\*{4,}|change[-_]?me|EXAMPLE_|\$\{)/i,
  },

  // Generic — strictly require `=` + quoted value with high-entropy-looking chars.
  // Excludes: kubectl/docker references to secret resources, env-var names (ALL_CAPS),
  // markdown tables ("| Secret | name |"), placeholders.
  {
    name: 'generic-secret-assignment',
    pattern: /(password|secret|api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*["'`]([A-Za-z0-9+/=_-]{20,})["'`]/i,
    allow: /(your[-_]?(password|secret|key|token)|placeholder|example|<.*?>|x{8,}|\*{4,}|change[-_]?me|TODO|EXAMPLE_|REPLACE_|REDACTED|\${)/i,
  },
]

// Skip lines that are clearly references to secret resources, not literal values.
const LINE_SKIPS: RegExp[] = [
  /^\s*\/\//,                                        // JS/TS comments
  /^\s*#\s/,                                          // shell/yaml comments
  /\bkubectl\s+(get|delete|create|patch|edit|describe|apply|cp)\s+secret\b/,
  /\bdocker\s+(exec|secret)\b/,
  /\bSecret:\s/,                                      // markdown table refs
  /\bkind:\s*Secret\b/,                              // K8s manifest refs
  /\bsecretRef\b|\bsecretKeyRef\b/,                  // K8s manifest refs
  /\bsecretName:\s/,                                 // K8s manifest refs
  /^\s*\|.+\|.+\|/,                                   // markdown tables (`| col | col |`)
]

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') && name !== '.vitepress') continue
    if (name === 'node_modules' || name === 'dist-internal') continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) yield* walk(p)
    else if (st.isFile() && /\.(md|mdx|vue|ts|tsx|js|jsx|css|html)$/i.test(name)) yield p
  }
}

function scan(): Hit[] {
  const hits: Hit[] = []
  for (const file of walk(ROOT)) {
    const text = readFileSync(file, 'utf8')
    const lines = text.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      // Pre-filter: skip lines that are clearly secret-resource references rather than values
      if (LINE_SKIPS.some((re) => re.test(line))) continue
      for (const rule of RULES) {
        const m = line.match(rule.pattern)
        if (!m) continue
        if (rule.allow && rule.allow.test(line)) continue
        hits.push({
          file: relative(process.cwd(), file),
          line: i + 1,
          excerpt: line.length > 140 ? line.slice(0, 140) + '…' : line,
          rule: rule.name,
        })
      }
    }
  }
  return hits
}

const start = Date.now()
const hits = scan()
const ms = Date.now() - start

if (hits.length === 0) {
  console.log(`✅ secrets-guard: 0 hits (${ms}ms)`)
  process.exit(0)
}

console.error(`\n❌ secrets-guard: ${hits.length} suspect line(s) — refusing to build internal site\n`)
for (const h of hits) {
  console.error(`  [${h.rule}] ${h.file}:${h.line}`)
  console.error(`    ${h.excerpt.trim()}`)
  console.error('')
}
console.error('修复方案：')
console.error('  - 真实密钥：删除并改写为占位符（your-key-here / EXAMPLE_KEY）')
console.error('  - 误报：在 line 中加 EXAMPLE_ / placeholder / <...> 标记，或调整 secrets-guard.ts 规则')
process.exit(1)
