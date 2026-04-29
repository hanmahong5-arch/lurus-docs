/**
 * Organization & ownership — who's responsible for what.
 * Honest snapshot: bus factor 1 across the board until the team grows.
 */

export interface OrgRole {
  name: string
  email?: string
  responsibilities: string[]
}

export const people: OrgRole[] = [
  {
    name: 'marvin',
    email: 'marvin.uu@gmail.com',
    responsibilities: [
      'Founder / Engineer / 全栈',
      '所有产品的 primary owner',
      '所有运维 escalation point',
      '所有外部沟通（客户 / ICP / 三丰云 / 阿里云）',
    ],
  },
  {
    name: 'AI Assistant (Claude)',
    responsibilities: [
      '代码生成 / 文档撰写 / 跨服务协调',
      '部署脚本生成与审阅',
      '架构图生成 / ADR 起草',
      '不能做：物理操作（重启服务器）/ 财务决策 / 客户沟通',
    ],
  },
]

export interface OwnershipRow {
  productId: string
  primary: string
  backup: string | '⚠ 无'
  escalation: string
}

export const ownership: OwnershipRow[] = [
  { productId: 'platform',  primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'newapi',    primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'memx',      primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'tally',     primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'lutu',      primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'admin',     primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'kova',      primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'forge',     primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'lumen',     primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'lucrum',    primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'switch',    primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'creator',   primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'web',       primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
  { productId: 'mcp',       primary: 'marvin', backup: '⚠ 无', escalation: 'marvin' },
]
