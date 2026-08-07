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
export type Status = 'live' | 'beta' | 'dev' | 'planning' | 'sunset'
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
    consumers: ['lucrum', 'switch', 'lutu', 'creator', 'tally', 'newapi', 'newhub'],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: ['no-monitor'],
    lastReviewed: '2026-05-28',
  },
  {
    id: 'newapi',
    name: 'Newapi (LLM 网关·退役中)',
    group: 'platform',
    priority: 'P0',
    // status='live' 对齐 lurus.yaml lifecycle 'prod'（仍在网）。ADR-0009 已宣布前瞻性降级（整合并入 newhub）；
    // 实际翻转至降级状态须等 lurus.yaml 侧同步，owner 决策 — 此处不静默翻转。
    status: 'live',
    manualPath: '/products/newapi',
    domain: 'newapi.lurus.cn',
    deployTarget: 'R1',
    deps: ['identity', 'billing'],
    consumers: ['switch', 'lucrum', 'lutu', 'forge', 'creator'],
    busFactor: 1,
    owner: 'marvin',
    // ADR D1 (2026-05-27): 退役中 → 整合并入 newhub，hub.lurus.cn 将成唯一 LLM 网关
    riskFlags: ['no-monitor', 'wip'],
    lastReviewed: '2026-05-28',
  },
  {
    id: 'newhub',
    name: 'Newhub (多租户 LLM 网关)',
    group: 'platform',
    priority: 'P0',
    status: 'beta',
    manualPath: '/products/newhub',
    domain: 'hub.lurus.cn',
    deployTarget: 'R6',
    deps: ['identity', 'billing'],
    consumers: ['switch'],
    busFactor: 1,
    owner: 'marvin',
    // stage on R6；DNS 待配（现 test-newhub.lurus.cn）；承接 newapi 退役整合 (ADR D1)
    riskFlags: ['wip', 'no-monitor'],
    lastReviewed: '2026-05-28',
  },
  {
    id: 'memx',
    name: 'MemX / Memorus',
    group: 'platform',
    priority: 'P0',
    status: 'beta',
    manualPath: '/products/memx',
    deployTarget: 'R1',
    deps: [],
    consumers: ['lucrum', 'creator', 'switch'],
    busFactor: 1,
    owner: 'marvin',
    // stage（同事在改，状态存疑，勿动）
    riskFlags: ['no-monitor', 'wip'],
    lastReviewed: '2026-05-28',
  },
  {
    id: 'tally',
    name: 'Tally (智能进销存)',
    group: 'platform',
    priority: 'P0',
    status: 'beta',
    manualPath: '/products/tally',
    domain: 'tally.lurus.cn',
    deployTarget: 'R6',
    deps: ['identity', 'billing', 'llm-inference', 'memory', 'agent-execution', 'notification', 'auth'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    // R6 stage，Epic 1 done，Billing 待 R6 部署（uptime 被低估）
    riskFlags: ['wip'],
    lastReviewed: '2026-05-28',
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
    lastReviewed: '2026-05-28',
  },
  {
    id: 'admin',
    name: 'Admin (运营后台·已下线)',
    group: 'platform',
    priority: 'P1',
    status: 'sunset',
    manualPath: '/products/admin',
    // SUNSET 2026-05-10：SPA 从未交付，admin.lurus.cn 实测 404；
    // 由 platform-core /admin/v1 REST + zita CLI/MCP 承接。deps 清空（退役无活跃消费）。
    deployTarget: 'R1',
    deps: [],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: [],
    lastReviewed: '2026-05-28',
  },
  {
    id: 'kova',
    name: 'Kova (Agent 引擎)',
    group: 'kova',
    priority: 'P1',
    status: 'dev',
    manualPath: '/products/kova',
    deployTarget: 'R6', // library crate (cargo add) + kova-rest service on R6 docker-compose
    deps: [],
    consumers: ['forge'],
    busFactor: 1,
    owner: 'marvin',
    // building：CI 红（GitHub Actions billing，非代码问题）；local 领先
    riskFlags: ['wip'],
    lastReviewed: '2026-05-28',
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
    lastReviewed: '2026-05-28',
  },
  {
    id: 'lumen',
    name: 'Lumen (Observability CLI)',
    group: 'kova',
    priority: 'P1',
    status: 'dev',
    manualPath: '/products/lumen',
    deployTarget: 'desktop',
    deps: ['agent-execution'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    // alpha 阶段（v0.1）
    riskFlags: ['wip'],
    lastReviewed: '2026-05-28',
  },
  {
    id: 'lucrum',
    name: 'Lucrum (AI 量化)',
    group: 'lucrum',
    priority: 'P1',
    status: 'beta',
    manualPath: '/products/lucrum',
    domain: 'lucrum.lurus.cn',
    deployTarget: 'R6',
    deps: ['identity', 'billing', 'llm-inference', 'memory', 'notification', 'auth'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    // 2026-04-30 从 prod 降级 stage（audit F7）；promotion blocker: web Secret + ai-qtrd quota（DNS 已修）
    riskFlags: ['no-monitor', 'wip'],
    lastReviewed: '2026-05-28',
  },
  {
    id: 'switch',
    name: 'Switch (桌面网关)',
    group: 'desktop',
    priority: 'P2',
    status: 'dev',
    manualPath: '/products/switch',
    deployTarget: 'desktop',
    deps: ['identity', 'billing', 'llm-inference', 'memory'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    // building：CI 自 2026-03-21 全红（30+ 天）；仓库仍活跃（13 commits）
    riskFlags: ['manual-deploy', 'wip'],
    lastReviewed: '2026-05-28',
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
    lastReviewed: '2026-05-28',
  },
  {
    id: 'www',
    name: 'WWW (官网)',
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
    lastReviewed: '2026-05-28',
  },
  {
    id: 'webgame',
    name: 'Webgame (已下线)',
    group: 'web',
    priority: 'P2',
    status: 'sunset',
    manualPath: '/products/web',
    // SUNSET 2026-05-28：auth 死 1 月 + 0 流量。原 webgame.lurus.cn (Phoenix LiveView)
    deployTarget: 'R1',
    deps: [],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: [],
    lastReviewed: '2026-05-28',
  },
  {
    id: 'mcp',
    name: 'MCP Servers (×4)',
    group: 'tooling',
    priority: 'P2',
    status: 'live',
    manualPath: '/products/mcp',
    deployTarget: 'desktop',
    deps: ['identity'],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    // casdoor-mcp / k8s-mcp / platform-mcp 三件 prod + tally-mcp（alpha，binary 待首发；决策见 lurus.yaml lifecycle_index tally-mcp 注 ADR-0011）
    riskFlags: [],
    lastReviewed: '2026-05-28',
  },
  {
    id: 'notification',
    name: 'Notification (通知)',
    group: 'platform',
    priority: 'P0',
    status: 'live',
    manualPath: '/products/platform',
    deployTarget: 'R1',
    deps: [],
    // 对齐 lurus.yaml capabilities.notification.consumers；manualPath 复用 /products/platform（子模块，无独立手册页 — 有意选择，不建 stub）
    consumers: ['platform', 'lutu'],
    busFactor: 1,
    owner: 'marvin',
    // platform 子模块（WS/Email/FCM），消费 IDENTITY/LUCRUM/LLM_EVENTS；随 platform 部署
    riskFlags: ['no-monitor'],
    lastReviewed: '2026-05-28',
  },
  {
    id: 'dsnb',
    name: 'DSNB (落地页)',
    group: 'web',
    priority: 'P2',
    status: 'live',
    // manualPath 直链公网站点（落地页无独立内部手册 — 有意选择，不建 stub 页）
    manualPath: 'https://dsnb.help',
    domain: 'dsnb.help',
    // R6 docker-compose + host nginx（ICP 拦截后曾迁 Vercel，详见 lurus.yaml lurus-dsnb）
    deployTarget: 'R6',
    deps: [],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: [],
    lastReviewed: '2026-05-28',
  },
  {
    id: 'docs',
    name: 'Docs (文档站)',
    group: 'web',
    priority: 'P2',
    status: 'live',
    // manualPath 直链公网文档站（本站自身即文档 — 有意选择，不建 stub 页）
    manualPath: 'https://docs.lurus.cn',
    domain: 'docs.lurus.cn',
    deployTarget: 'R1',
    deps: [],
    consumers: [],
    busFactor: 1,
    owner: 'marvin',
    riskFlags: [],
    lastReviewed: '2026-05-28',
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
  sunset: '#71717a',
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
  const out = { live: 0, beta: 0, dev: 0, planning: 0, sunset: 0 } as Record<Status, number>
  for (const p of products) out[p.status]++
  return out
}

export function totalRisks(): number {
  return products.reduce((sum, p) => sum + p.riskFlags.length, 0)
}

export function busFactorWarnings(): number {
  return products.filter((p) => p.busFactor < 2).length
}

/** Whole days between two ISO dates (positive when `from` is later than `iso`). */
export function daysSince(iso: string, from: Date = new Date()): number {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return -1
  return Math.floor((from.getTime() - t) / 86_400_000)
}

/** Number of products whose lastReviewed is older than `thresholdDays`. */
export function staleProductCount(thresholdDays = 30, from: Date = new Date()): number {
  return products.filter((p) => daysSince(p.lastReviewed, from) > thresholdDays).length
}

export function buildDependencyMermaid(): string {
  const lines = ['graph LR']
  const cap2providers: Record<string, string[]> = {
    'identity': ['platform'],
    'billing': ['platform'],
    'auth': ['platform'],
    'notification': ['platform'],
    // ADR-0009 cutover 期 newapi + newhub 并存 — 依赖图须同时指向两者，否则与 newhub 条目矛盾
    'llm-inference': ['newapi', 'newhub'],
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
