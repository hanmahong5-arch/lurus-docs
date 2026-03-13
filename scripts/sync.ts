#!/usr/bin/env bun
/**
 * sync.ts - Sync documentation from machine-readable sources.
 *
 * Sources:
 *   ../lurus-api/docs/openapi/relay.json  →  docs/api/overview.md       (endpoint region)
 *
 * Usage: bun scripts/sync.ts
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const ROOT = resolve(import.meta.dir, '..')
const DOCS = resolve(ROOT, 'docs')

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Read a file as UTF-8, stripping BOM if present. */
function readText(filePath: string): string {
  const raw = readFileSync(filePath, 'utf8')
  return raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw
}

/**
 * Replace content between a pair of sync marker HTML comments.
 * Returns the updated document string, or null if content is unchanged.
 */
function replaceBetweenMarkers(
  doc: string,
  marker: string,
  replacement: string,
): string | null {
  const startTag = `<!-- sync:${marker}:start -->`
  const endTag = `<!-- sync:${marker}:end -->`
  const startIdx = doc.indexOf(startTag)
  const endIdx = doc.indexOf(endTag)

  if (startIdx === -1 || endIdx === -1) {
    console.warn(`[sync] Warning: markers for '${marker}' not found, skipping`)
    return null
  }

  const before = doc.slice(0, startIdx + startTag.length)
  const after = doc.slice(endIdx)
  const newDoc = `${before}\n${replacement}\n${after}`

  // Return null when there is no actual change to avoid needless writes.
  return newDoc === doc ? null : newDoc
}

// ── Endpoint sync ─────────────────────────────────────────────────────────────
// relay.json → docs/api/overview.md

interface OpenAPIOperation {
  summary: string
  tags: string[]
  deprecated?: boolean
}

interface OpenAPISpec {
  paths: Record<string, Record<string, OpenAPIOperation>>
}

function syncEndpoints(): boolean {
  const specPath = resolve(ROOT, '..', 'lurus-api', 'docs', 'openapi', 'relay.json')
  const docPath = resolve(DOCS, 'api', 'overview.md')

  let spec: OpenAPISpec
  try {
    spec = JSON.parse(readText(specPath))
  } catch (e) {
    console.warn(`[sync] Cannot read relay.json (${specPath}): ${(e as Error).message}`)
    return false
  }

  // Group implemented endpoints by their top-level tag.
  const groups = new Map<string, { method: string; path: string; summary: string }[]>()

  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [httpMethod, op] of Object.entries(methods)) {
      const tags: string[] = op.tags ?? []

      // Skip endpoints whose tags start with "未实现".
      if (tags.some(t => t.startsWith('未实现'))) continue

      // Use the first tag; take only the top-level group (before '/').
      const rawTag = tags[0] ?? '其他'
      const group = rawTag.split('/')[0]

      if (!groups.has(group)) groups.set(group, [])
      groups.get(group)!.push({
        method: httpMethod.toUpperCase(),
        path,
        summary: op.summary ?? '',
      })
    }
  }

  // Build markdown block with ApiEndpoint components.
  const lines: string[] = []
  for (const [group, endpoints] of groups) {
    lines.push(`**${group}**\n`)
    for (const ep of endpoints) {
      lines.push(
        `<ApiEndpoint method="${ep.method}" path="${ep.path}" description="${ep.summary}" />`,
      )
    }
    lines.push('')
  }

  const replacement = lines.join('\n').trimEnd()
  const doc = readText(docPath)
  const updated = replaceBetweenMarkers(doc, 'endpoints', replacement)
  if (updated === null) return false

  writeFileSync(docPath, updated, 'utf8')
  console.log('[sync] docs/api/overview.md updated (endpoints)')
  return true
}

// ── Main ──────────────────────────────────────────────────────────────────────

const changed = [syncEndpoints()].some(Boolean)
if (!changed) {
  console.log('[sync] All sources up-to-date, no changes written.')
} else {
  console.log('[sync] Sync complete.')
}
