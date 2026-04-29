/**
 * Internal product registry — single source of truth for the dashboard.
 *
 * Synthesized from lurus.yaml + per-product CLAUDE.md. Updates here ripple
 * to ProductStatusGrid, DependencyGraph, OwnershipMatrix, RiskBadge counts.
 *
 * Refresh cadence: re-survey every 30 days; mark `lastReviewed` per row.
 */

export type Group = 'platform' | 'kova' | 'lucrum' | 'desktop' | 'web' | 'tooling'
export type Priority = 'P0' | 'P1' | 'P2'
export type Status = 'live' | 'beta' | 'dev' | 'planning'
export type DeployTarget = 'R1' | 'R6' | 'desktop' | 'mobile' | 'aliyun'

export interface InternalProduct {
  id: string
  name: string
  group: Group
  priority: Priority
  status: Status
  manualPath: string
  domain?: string
  deployTarget: DeployTarget
  /** capabilities consumed (from lurus.yaml capabilities section) */
  deps: string[]
  /** product ids that depend on this product */
  consumers: string[]
  /** 1 = single human owner; raise toward 2-3 once backups are real */
  busFactor: number
  owner: string
  /** machine-readable risk flags surfaced in dashboard */
  riskFlags: Array<'stale-docs' | 'no-monitor' | 'planning' | 'manual-deploy' | 'no-tests' | 'wip'>
  lastReviewed: string
}

export const products: InternalProduct[] = [
  {
    id: 'platform',
    name: 'Lurus Platform',
    group: 'platform',
    priority: 'P0',
    status: 'live',
    manualPath: '/products/platform',
    domain: 'identity.lurus.cn',
    deployTarget: 'R1',
    deps: ['auth'],
    consumers: ['lucrum', 'switch', 'lutu', 'creator', 'tally', 'newapi', 'admin'],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['no-monitor'],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'newapi',
    name: 'Newapi (LLM 网关)',
    group: 'platform',
    priority: 'P0',
    status: 'live',
    manualPath: '/products/newapi',
    domain: 'newapi.lurus.cn',
    deployTarget: 'R1',
    deps: ['identity', 'billing'],
    consumers: ['switch', 'lucrum', 'lutu', 'forge', 'creator'],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['no-monitor'],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'memx',
    name: 'MemX / Memorus',
    group: 'platform',
    priority: 'P0',
    status: 'live',
    manualPath: '/products/memx',
    deployTarget: 'R1',
    deps: [],
    consumers: ['lucrum', 'creator', 'switch'],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['no-monitor'],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'tally',
    name: 'Tally (智能进销存)',
    group: 'platform',
    priority: 'P0',
    status: 'planning',
    manualPath: '/products/tally',
    domain: 'tally.lurus.cn',
    deployTarget: 'R6',
    deps: ['identity', 'billing', 'llm-inference', 'memory', 'agent-execution', 'notification', 'auth'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['planning', 'wip'],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'lutu',
    name: '路途 Lutu',
    group: 'platform',
    priority: 'P2',
    status: 'dev',
    manualPath: '/products/lutu',
    deployTarget: 'mobile',
    deps: ['identity', 'billing', 'llm-inference', 'notification', 'auth'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['wip', 'no-tests'],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'admin',
    name: 'Admin (运营后台)',
    group: 'platform',
    priority: 'P1',
    status: 'live',
    manualPath: '/products/admin',
    domain: 'admin.lurus.cn',
    deployTarget: 'R1',
    deps: ['identity', 'billing', 'auth'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['no-monitor'],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'kova',
    name: 'Kova (Agent 引擎)',
    group: 'kova',
    priority: 'P1',
    status: 'beta',
    manualPath: '/products/kova',
    deployTarget: 'desktop',
    deps: [],
    consumers: ['forge'],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['wip'],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'forge',
    name: 'Forge (Workbench)',
    group: 'kova',
    priority: 'P1',
    status: 'beta',
    manualPath: '/products/forge',
    domain: 'forge.lurus.cn',
    deployTarget: 'R1',
    deps: ['agent-execution', 'identity', 'auth'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['wip', 'no-monitor'],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'lumen',
    name: 'Lumen (Observability CLI)',
    group: 'kova',
    priority: 'P1',
    status: 'beta',
    manualPath: '/products/lumen',
    deployTarget: 'desktop',
    deps: ['agent-execution'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['wip'],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'lucrum',
    name: 'Lucrum (AI 量化)',
    group: 'lucrum',
    priority: 'P1',
    status: 'live',
    manualPath: '/products/lucrum',
    domain: 'lucrum.lurus.cn',
    deployTarget: 'R1',
    deps: ['identity', 'billing', 'llm-inference', 'memory', 'notification', 'auth'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['no-monitor'],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'switch',
    name: 'Switch (桌面网关)',
    group: 'desktop',
    priority: 'P2',
    status: 'live',
    manualPath: '/products/switch',
    deployTarget: 'desktop',
    deps: ['identity', 'billing', 'llm-inference', 'memory'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['manual-deploy'],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'creator',
    name: 'Creator (内容工厂)',
    group: 'desktop',
    priority: 'P2',
    status: 'beta',
    manualPath: '/products/creator',
    deployTarget: 'desktop',
    deps: ['llm-inference', 'memory'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['manual-deploy', 'wip'],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'web',
    name: 'WWW + Webgame',
    group: 'web',
    priority: 'P2',
    status: 'live',
    manualPath: '/products/web',
    domain: 'www.lurus.cn',
    deployTarget: 'aliyun',
    deps: [],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: [],
    lastReviewed: '2026-04-28',
  },
  {
    id: 'mcp',
    name: 'MCP Servers (×3)',
    group: 'tooling',
    priority: 'P2',
    status: 'live',
    manualPath: '/products/mcp',
    deployTarget: 'desktop',
    deps: ['identity'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: [],
    lastReviewed: '2026-04-28',
  },
]

export const groupColors: Record<Group, string> = {
  platform: '#C67B5C',
  kova: '#7C9885',
  lucrum: '#D4A373',
  desktop: '#9C8AA5',
  web: '#82A0BC',
  tooling: '#B0A18F',
}

export const statusColors: Record<Status, string> = {
  live: '#22c55e',
  beta: '#f59e0b',
  dev: '#3b82f6',
  planning: '#a3a3a3',
}

export const riskLabels: Record<string, string> = {
  'stale-docs': '文档过期',
  'no-monitor': '无监控',
  'planning': '规划阶段',
  'manual-deploy': '手动部署',
  'no-tests': '缺测试',
  'wip': '建设中',
}

export function byGroup(): Record<Group, InternalProduct[]> {
  const out = { platform: [], kova: [], lucrum: [], desktop: [], web: [], tooling: [] } as Record<Group, InternalProduct[]>
  for (const p of products) out[p.group].push(p)
  return out
}

export function byStatus(): Record<Status, number> {
  const out = { live: 0, beta: 0, dev: 0, planning: 0 } as Record<Status, number>
  for (const p of products) out[p.status]++
  return out
}

export function totalRisks(): number {
  return products.reduce((sum, p) => sum + p.riskFlags.length, 0)
}

export function busFactorWarnings(): number {
  return products.filter((p) => p.busFactor < 2).length
}

export function buildDependencyMermaid(): string {
  const lines = ['graph LR']
  const cap2providers: Record<string, string[]> = {
    'identity': ['platform'],
    'billing': ['platform'],
    'auth': ['platform'],
    'notification': ['platform'],
    'llm-inference': ['newapi'],
    'memory': ['memx'],
    'agent-execution': ['kova'],
  }
  for (const p of products) {
    lines.push(`  ${p.id}["${p.name}"]:::${p.group}`)
  }
  for (const p of products) {
    for (const dep of p.deps) {
      const providers = cap2providers[dep] || []
      for (const pr of providers) {
        if (pr !== p.id) lines.push(`  ${p.id} --> ${pr}`)
      }
    }
  }
  lines.push('  classDef platform fill:#fef0e8,stroke:#C67B5C')
  lines.push('  classDef kova fill:#eef3ec,stroke:#7C9885')
  lines.push('  classDef lucrum fill:#fbf3e8,stroke:#D4A373')
  lines.push('  classDef desktop fill:#f3eff5,stroke:#9C8AA5')
  lines.push('  classDef web fill:#eef3f7,stroke:#82A0BC')
  lines.push('  classDef tooling fill:#f1ede8,stroke:#B0A18F')
  return lines.join('\n')
}
