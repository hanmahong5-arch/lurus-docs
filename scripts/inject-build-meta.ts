#!/usr/bin/env bun
/**
 * inject-build-meta.ts — write build timestamp + git sha to internal/public/build-meta.json.
 *
 * Run before `vitepress build internal` so the file lands in dist-internal/build-meta.json
 * and is fetchable at /build-meta.json by the dashboard.
 *
 * Cheap (~5ms). VitePress copies internal/public/* verbatim to outDir.
 */

import { mkdirSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { join } from 'path'

const PUBLIC_DIR = join(import.meta.dir, '..', 'internal', 'public')

let gitSha = 'unknown'
let gitBranch = 'unknown'
try {
  gitSha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
  gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
} catch {
  // running outside a git checkout (e.g. tarball) — leave defaults
}

const meta = {
  buildTime: new Date().toISOString(),
  gitSha,
  gitBranch,
}

mkdirSync(PUBLIC_DIR, { recursive: true })
writeFileSync(join(PUBLIC_DIR, 'build-meta.json'), JSON.stringify(meta, null, 2))
console.log(`✓ build-meta: ${meta.gitSha} @ ${meta.buildTime}`)
