// Plain-TS single source of truth for the integration / MCP catalog.
// Client components import { integrationCategories } directly (a .data.ts
// loader only reliably serves one consumer, so keep the data here and let
// integrations.data.ts wrap it for any build-time/markdown consumer).
//
// Every entry must map to a REAL, shipped capability — Lurus-product MCP
// servers, Switch one-click built-in servers, documented AI clients, or
// SDK/protocol compatibility we actually support. No aspirational entries.

export interface Integration {
  name: string
  desc: string
  link: string
  icon: string
  /** Optional short badge, e.g. "MCP" / "内置" / "SDK". */
  tag?: string
  /** External links open in a new tab. */
  external?: boolean
}

export interface IntegrationCategory {
  id: string
  title: string
  lede: string
  icon: string
  items: Integration[]
}

export interface IntegrationsData {
  categories: IntegrationCategory[]
}

export const integrationCategories: IntegrationCategory[] = [
  {
    id: 'product-mcp',
    title: 'Lurus 产品 MCP',
    lede: 'Lurus 自有产品以 MCP server 形态把能力暴露为 agent 工具，供 Claude / Codex 等 MCP 客户端调用。',
    icon: 'bot',
    items: [
      { name: 'Kova', desc: 'Agent 执行引擎作为 MCP 工具暴露（kova mcp serve），让 Claude/Codex 直接驱动持久化 Agent。', link: '/kova/quickstart', icon: 'bot', tag: 'MCP' },
      { name: 'MemX', desc: '记忆读写为 agent 工具：memory_add / memory_search / memory_delete，参数与 REST 对齐。', link: '/memx/quickstart', icon: 'brain', tag: 'MCP' },
      { name: 'Lumen', desc: 'Trace / Replay 暴露给 agent，调试与零成本重放可被 MCP 客户端调用。', link: '/lumen/integration', icon: 'zap', tag: 'MCP' },
    ],
  },
  {
    id: 'switch-builtin',
    title: 'Switch 内置 MCP 服务器',
    lede: 'Switch 桌面端提供一键安装的常用 MCP 服务器，并按 visible_to 跨 CLI 动态下发。',
    icon: 'plug',
    items: [
      { name: 'GitHub', desc: '读写 issues / PR / file。', link: '/switch/mcp-servers', icon: 'github', tag: '内置' },
      { name: 'PostgreSQL', desc: '查询数据库。', link: '/switch/mcp-servers', icon: 'database-backup', tag: '内置' },
      { name: 'Filesystem', desc: '读写本地文件。', link: '/switch/mcp-servers', icon: 'server', tag: '内置' },
      { name: 'Slack', desc: '发消息 / 读频道。', link: '/switch/mcp-servers', icon: 'messages-square', tag: '内置' },
    ],
  },
  {
    id: 'ai-clients',
    title: 'AI 客户端',
    lede: '填入 base_url 与 API Key 即可对话，无需写代码。完整步骤见各客户端接入指南。',
    icon: 'monitor',
    items: [
      { name: 'Cherry Studio', desc: '桌面多模型客户端，填 base_url + Key 即用。', link: '/guide/clients/cherry-studio', icon: 'monitor' },
      { name: 'Lobe Chat', desc: '开源 Web / 桌面对话 UI，自定义 OpenAI 兼容端点。', link: '/guide/clients/lobe-chat', icon: 'messages-square' },
      { name: 'OpenCat', desc: 'iOS / macOS 原生客户端，自定义 API 域名接入。', link: '/guide/clients/opencat', icon: 'smartphone' },
      { name: '其他客户端', desc: 'NextChat / ChatBox 等任何 OpenAI 兼容客户端的通用配置。', link: '/guide/clients/others', icon: 'layers' },
    ],
  },
  {
    id: 'sdk-protocol',
    title: 'SDK 与生态协议',
    lede: '兼容标准 SDK 与协议，现有代码改一行 base_url 即可迁移。',
    icon: 'code',
    items: [
      { name: 'OpenAI SDK', desc: 'Python / Node.js / Go 全兼容，只改 base_url 与 api_key。', link: '/migrations/from-openai', icon: 'code', tag: 'SDK' },
      { name: 'LangGraph', desc: 'LumenCheckpointer 直接替换 SqliteSaver，接 Kova 持久化。', link: '/migrations/from-langgraph', icon: 'share-2' },
      { name: 'OpenTelemetry', desc: 'Lumen 以 OTLP 导出 Trace 到 Grafana Tempo / Datadog APM。', link: '/lumen/integration', icon: 'activity' },
      { name: 'OIDC / OAuth2', desc: '统一身份联邦企业 IdP，标准 OIDC / OAuth2 集成。', link: '/platform/auth/oidc', icon: 'shield' },
    ],
  },
]
