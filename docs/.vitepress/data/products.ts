/**
 * Single source of truth for Lurus product metadata.
 *
 * Every consumer (homepage, sidebar, landing templates, llms.txt scanning)
 * reads from here. Update this file when a product's status/tagline/color
 * changes — do NOT duplicate into multiple markdown frontmatters.
 */

export type ProductStatus = 'live' | 'beta' | 'dev' | 'plan'
export type ProductCategory = 'ai-service' | 'desktop' | 'platform'
export type Audience = 'newbie' | 'player' | 'decider' | 'developer'

export interface HighlightItem {
  title: string
  body: string
  icon?: string
}

export interface MetricItem {
  label: string
  value: string
  hint?: string
}

export interface CodeExample {
  lang: string
  label: string
  code: string
}

export interface ScenarioItem {
  role: string
  title: string
  summary: string
  link: string
}

export interface ComparisonRow {
  dimension: string
  self: string
  alt: Record<string, string>
}

export interface ComparisonBlock {
  competitors: string[]
  rows: ComparisonRow[]
}

export interface NextStepItem {
  text: string
  link: string
  primary?: boolean
  external?: boolean
}

export interface Product {
  id: string
  name: string
  fullName: string
  tagline: string
  status: ProductStatus
  category: ProductCategory
  audiences: Audience[]
  colorToken: string      // CSS variable name, e.g. '--lurus-color-kova'
  icon: string            // lucide icon name
  home: string
  consoleUrl?: string
  highlights: HighlightItem[]
  metrics?: MetricItem[]
  codeExamples?: CodeExample[]
  scenarios?: ScenarioItem[]
  comparison?: ComparisonBlock
  architectureDiagram?: string  // mermaid source
  relatedProducts: string[]
  nextSteps: NextStepItem[]
}

export const products: Record<string, Product> = {
  'lurus-api': {
    id: 'lurus-api',
    name: 'Lurus API',
    fullName: 'Lurus API — 私有部署的多租户 LLM 网关',
    tagline: '部署在客户自有环境的多租户 LLM 网关 · 基于开源 New API，AGPLv3',
    status: 'live',
    category: 'ai-service',
    audiences: ['developer', 'decider'],
    colorToken: '--lurus-color-lurus-api',
    icon: 'plug-zap',
    home: '/guide/introduction',
    highlights: [
      { title: '接入与路由', body: '多家上游模型服务走同一套接口；上游通道按权重加健康评分选择', icon: 'layers' },
      { title: '租户与计量', body: '用量按租户、模型、通道分开记，按角色分级授权', icon: 'wallet' },
      { title: '日志与留痕', body: '调用日志按租户隔离可检索；管理类写操作进入审计记录，可逐行校验', icon: 'repeat' },
      { title: '许可与来源', body: '基于开源 New API（源自 One API），AGPLv3；条款以仓库 LICENSE 与 NOTICE 为准', icon: 'zap' },
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'curl',
        code: `# 网关地址与 Key 由你自己的部署提供
curl https://<your-gateway>/v1/chat/completions \\
  -H "Authorization: Bearer $GATEWAY_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"<model-name>","messages":[{"role":"user","content":"你好"}]}'`,
      },
      {
        lang: 'typescript',
        label: 'HTTP (fetch)',
        code: `const res = await fetch('https://<your-gateway>/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${process.env.GATEWAY_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: '<model-name>',
    messages: [{ role: 'user', content: '你好' }],
  }),
})
console.log(await res.json())`,
      },
    ],
    scenarios: [
      { role: '开发者', title: '发起第一次调用', summary: '拿到自有部署的网关地址与 Key → curl 跑通', link: '/guide/quickstart' },
    ],
    relatedProducts: ['switch', 'kova', 'lumen', 'platform'],
    nextSteps: [
      { text: '快速开始', link: '/guide/quickstart', primary: true },
      { text: '支持的模型', link: '/guide/models' },
    ],
  },

  'kova': {
    id: 'kova',
    name: 'Kova',
    fullName: 'Kova — 嵌入式持久执行引擎',
    tagline: '每一步先写进预写日志再算完成，进程中断后从日志继续 · 早期试点',
    status: 'dev',
    category: 'ai-service',
    audiences: ['developer', 'decider'],
    colorToken: '--lurus-color-kova',
    icon: 'bot',
    home: '/kova/',
    highlights: [
      { title: '预写日志恢复', body: '每条日志记录带 CRC32 校验；进程中断后从日志继续，不重做已落盘的步骤', icon: 'database-backup' },
      { title: '执行留痕、可离线回放', body: '可从预写日志离线重建某个任务的执行过程', icon: 'history' },
      { title: '多种接入方式', body: 'gRPC / REST / MCP（stdio）', icon: 'puzzle' },
      { title: '边界', body: '专有软件，按商业许可提供；未发布到公共包仓库；目前只在我们自己的环境里运行', icon: 'lock' },
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'CLI',
        code: `# 从预写日志离线重建任务 42 的执行过程
kova evidence reconstruct --task-id 42 --wal-dir ./wal`,
      },
    ],
    architectureDiagram: `graph LR
  A[gRPC / REST / MCP] --> B[Kova Core]
  B --> C[预写日志<br/>CRC32]
  C -.中断后继续.-> B
  C --> D[离线重建<br/>evidence reconstruct]
  B --> E[上游模型服务]`,
    relatedProducts: ['lumen', 'memx', 'lurus-api', 'forge'],
    nextSteps: [
      { text: '快速开始', link: '/kova/quickstart', primary: true },
      { text: '核心概念', link: '/kova/concepts' },
      { text: 'API 参考', link: '/kova/api' },
    ],
  },

  'memx': {
    id: 'memx',
    name: 'MemX',
    fullName: 'MemX — AI 自适应记忆引擎',
    tagline: 'AI 记忆引擎 · 抽取、去重、衰减、混合检索 · 早期试点',
    status: 'dev',
    category: 'ai-service',
    audiences: ['developer', 'decider'],
    colorToken: '--lurus-color-memx',
    icon: 'brain',
    home: '/memx/',
    highlights: [
      { title: '默认不调外部模型', body: '默认按本地规则抽取；需要时可切换模式', icon: 'filter' },
      { title: '随时间衰减', body: '久未被用到的记忆权重下降，检索命中会让权重回升', icon: 'timer' },
      { title: '四层混合检索', body: '多路打分后乘以衰减权重与时效因子', icon: 'search' },
      { title: '先脱敏再落库', body: '13 层内置脱敏规则不能单独关闭；脱敏失败整条不写入', icon: 'shield-check' },
    ],
    metrics: [
      { label: '内置脱敏', value: '13 层' },
      { label: '混合检索', value: '4 层' },
      { label: '接入', value: 'CLI + REST + MCP' },
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'REST',
        code: `# 写入
curl -X POST http://localhost:8880/api/v1/memories \
  -H "Authorization: Bearer $MEMORUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"content":"部署前必须运行 go test -race ./...","user_id":"dev1","scope":"project:backend"}'

# 检索
curl "http://localhost:8880/api/v1/memories/search?query=部署前检查&user_id=dev1&limit=5" \
  -H "Authorization: Bearer $MEMORUS_API_KEY"`,
      },
    ],
    architectureDiagram: `graph TB
  Input[写入请求] --> PII[脱敏 13 层]
  PII --> Reflector[抽取]
  Reflector --> Curator[语义去重]
  Curator --> Store[(存储 + 变更历史)]
  Store --> Decay[衰减]
  Query[检索请求] --> Hybrid[四层混合检索]
  Hybrid --> Store`,
    scenarios: [
      { role: '开发者', title: '给客服 Agent 加长期记忆', summary: 'MemX + Kova 搭可记忆 AI 客服', link: '/tutorials/memory-agent' },
    ],
    relatedProducts: ['kova', 'lurus-api', 'lumen'],
    nextSteps: [
      { text: '快速开始', link: '/memx/quickstart', primary: true },
      { text: '核心概念', link: '/memx/concepts' },
      { text: '架构设计', link: '/memx/architecture' },
    ],
  },

  'lucrum': {
    id: 'lucrum',
    name: 'Lucrum',
    fullName: 'Lucrum — 量化策略生成与回测',
    tagline: '自然语言描述思路，生成可回测的策略 · 当前不在主动开发中',
    status: 'live',
    category: 'ai-service',
    audiences: ['player', 'developer'],
    colorToken: '--lurus-color-lucrum',
    icon: 'trending-up',
    home: '/lucrum/',
    consoleUrl: 'https://lucrum.lurus.cn',
    highlights: [
      { title: '自然语言 → 策略代码', body: '用中文描述思路，生成可回测的策略代码', icon: 'sparkles' },
      { title: '定点数回测', body: '回测引擎全程使用 Decimal.js 定点数，避免浮点误差', icon: 'calculator' },
      { title: '多 Agent 投研问答', body: '从多个视角对策略给出分析意见', icon: 'users' },
      { title: '现状', body: '当前不在主动开发中，只做修复与运维；交易能力仅限模拟盘', icon: 'star' },
    ],
    scenarios: [
      { role: '玩家', title: '跑第一个策略', summary: '写需求 → 生成策略 → 回测', link: '/tutorials/lucrum-strategy-workflow' },
    ],
    relatedProducts: ['lurus-api', 'platform', 'auth'],
    nextSteps: [
      { text: '快速开始', link: '/lucrum/quickstart', primary: true },
      { text: '策略市场', link: '/lucrum/strategies' },
      { text: '交易平台', link: 'https://lucrum.lurus.cn', external: true },
    ],
  },

  'switch': {
    id: 'switch',
    name: 'Switch',
    fullName: 'Switch — 桌面端 AI 工具配置管理',
    tagline: '桌面端统一管理多款 AI 编程命令行工具的配置与 MCP · 当前不在主动开发中',
    status: 'dev',
    category: 'desktop',
    audiences: ['player', 'developer'],
    colorToken: '--lurus-color-switch',
    icon: 'monitor',
    home: '/switch/',
    highlights: [
      { title: '多款命令行工具一处管理', body: '把分散在各工具里的配置集中到一个桌面应用', icon: 'layers' },
      { title: 'MCP 预设', body: '常用 MCP 服务器配置以预设形式管理，不必手写 JSON', icon: 'plug' },
      { title: '本地计量代理', body: '经它转发的调用在本地记录用量', icon: 'bar-chart-3' },
      { title: '现状', body: '当前不在主动开发中', icon: 'package' },
    ],
    relatedProducts: ['lurus-api', 'lumen', 'creator'],
    nextSteps: [
      { text: '安装指南', link: '/switch/install', primary: true },
      { text: '配置说明', link: '/switch/configuration' },
      { text: '使用手册', link: '/switch/usage' },
    ],
  },

  'creator': {
    id: 'creator',
    name: 'Creator',
    fullName: 'Creator — 内容改写与发布工具',
    tagline: '视频链接 → 转写 → 多平台文案改写 → 发布 · 当前不在主动开发中',
    status: 'dev',
    category: 'desktop',
    audiences: ['player'],
    colorToken: '--lurus-color-creator',
    icon: 'clapperboard',
    home: '/creator/',
    highlights: [
      { title: '一条流水线', body: '下载 → 语音转写 → 文案改写 → 发布', icon: 'workflow' },
      { title: '多平台文案', body: '按不同内容平台的习惯分别生成文案', icon: 'share-2' },
      { title: '桌面应用', body: '单个可执行文件，打开即用', icon: 'package' },
      { title: '现状', body: '当前不在主动开发中', icon: 'video' },
    ],
    relatedProducts: ['lurus-api', 'switch'],
    nextSteps: [
      { text: '安装指南', link: '/creator/install', primary: true },
      { text: '使用手册', link: '/creator/usage' },
      { text: '使用案例', link: '/creator/use-cases' },
    ],
  },

  'lumen': {
    id: 'lumen',
    name: 'Lumen',
    fullName: 'Lumen — Agent 回放与成本审计工具',
    tagline: '回放任意一次 Agent 运行、核算用量成本、中断后从检查点继续 · 早期试点',
    status: 'dev',
    category: 'ai-service',
    audiences: ['developer'],
    colorToken: '--lurus-color-lumen',
    icon: 'zap',
    home: '/lumen/',
    highlights: [
      { title: '确定性回放', body: '从运行记录回放，不再调用模型；可从中间某一步开始', icon: 'rewind' },
      { title: '检查点恢复', body: '检查点落本地磁盘，不依赖外部服务；进程中断后从最近检查点继续', icon: 'life-buoy' },
      { title: '成本核算', body: '按 Agent、按模型汇总用量成本，标出异常的运行', icon: 'coins' },
      { title: '边界', body: '早期阶段；未发布到公共包仓库，目前只能从源码构建', icon: 'package-plus' },
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'CLI',
        code: `# 回放一次运行（不调用模型），可从第 N 步开始
lumen replay <trace-id> --from-step 3

# 最近 24 小时的成本报告
lumen cost --last 24h`,
      },
    ],
    relatedProducts: ['kova', 'lurus-api', 'memx'],
    nextSteps: [
      { text: '快速开始', link: '/lumen/quickstart', primary: true },
      { text: 'Python SDK', link: '/lumen/python-sdk' },
      { text: 'CLI 手册', link: '/lumen/cli' },
    ],
  },

  'forge': {
    id: 'forge',
    name: 'Forge',
    fullName: 'Forge — 内部工作流画布',
    tagline: '拖拽搭建并运行 Agent 工作流的可视化画布 · 内部工具，不对外商业化',
    status: 'beta',
    category: 'ai-service',
    audiences: ['developer'],
    colorToken: '--lurus-color-forge',
    icon: 'hammer',
    home: '/forge/',
    highlights: [
      { title: '可视化画布', body: '把组件拖到画布上连成流程并运行', icon: 'network' },
      { title: 'MCP 双向', body: '流程可以调用外部 MCP 工具，保存的流程也可作为 MCP 工具暴露', icon: 'messages-square' },
      { title: '持久执行', body: '少数需要持久化的组件（等待、重试、Agent 运行）交给 Kova 执行', icon: 'history' },
      { title: '内部工具', body: '目前作为内部工作流工具使用，多数高级能力默认关闭', icon: 'lock' },
    ],
    relatedProducts: ['kova', 'memx', 'lurus-api'],
    nextSteps: [
      { text: '产品哲学', link: '/forge/', primary: true },
      { text: 'Ontology', link: '/forge/ontology' },
      { text: 'Session 工作流', link: '/forge/sessions' },
    ],
  },

  'platform': {
    id: 'platform',
    name: '账号与计费',
    fullName: 'Lurus Platform — 内部账号与用量核算底座',
    tagline: '内部底座：统一账号与内部用量核算 · 不作为独立产品对外提供',
    status: 'live',
    category: 'platform',
    audiences: ['developer'],
    colorToken: '--lurus-color-platform',
    icon: 'wallet',
    home: '/platform/',
    highlights: [
      { title: '统一账号', body: '各 Lurus 服务共用同一套账号', icon: 'user-check' },
      { title: '内部用量核算', body: '各服务的用量在这里计量与记账', icon: 'coins' },
      { title: '内部底座', body: '供自家服务调用，不单独对外销售', icon: 'package-2' },
    ],
    relatedProducts: ['auth', 'lurus-api', 'lucrum'],
    nextSteps: [
      { text: '平台概述', link: '/platform/', primary: true },
      { text: '计费详解', link: '/platform/billing' },
      { text: '常见问题', link: '/platform/faq' },
    ],
  },

  'auth': {
    id: 'auth',
    name: '统一身份认证',
    fullName: 'Lurus Auth — 统一身份认证（内部底座）',
    tagline: '各 Lurus 服务共用的登录与身份 · 标准 OIDC / OAuth2 · 内部底座',
    status: 'live',
    category: 'platform',
    audiences: ['developer'],
    colorToken: '--lurus-color-auth',
    icon: 'shield-check',
    home: '/platform/auth/',
    consoleUrl: 'https://identity.lurus.cn',
    highlights: [
      { title: '单点登录', body: '一次登录，在各 Lurus 服务间通用', icon: 'key-round' },
      { title: 'OIDC / OAuth2', body: '标准协议，接入方按标准流程对接', icon: 'link' },
      { title: '内部底座', body: '供自家服务使用，不单独对外销售', icon: 'shield' },
    ],
    relatedProducts: ['platform', 'lurus-api', 'lucrum'],
    nextSteps: [
      { text: '概述与接入点', link: '/platform/auth/', primary: true },
      { text: 'OIDC / OAuth2', link: '/platform/auth/oidc' },
      { text: 'API 认证', link: '/platform/auth/api-auth' },
      { text: '认证控制台', link: 'https://identity.lurus.cn', external: true },
    ],
  },

  'api-ref': {
    id: 'api-ref',
    name: 'API 参考',
    fullName: 'API 参考 — 网关端点手册',
    tagline: '端点文档 · 错误码 · 请求示例',
    status: 'live',
    category: 'platform',
    audiences: ['developer'],
    colorToken: '--lurus-color-api-ref',
    icon: 'book-open',
    home: '/api/overview',
    highlights: [
      { title: '兼容主流 API 格式', body: '端点路径与请求格式沿用业界通行的对话接口格式', icon: 'shuffle' },
      { title: '错误码', body: '错误返回带 code 与 message', icon: 'alert-circle' },
      { title: '认证方式', body: 'Bearer Token 等方式', icon: 'key' },
    ],
    relatedProducts: ['lurus-api', 'auth'],
    nextSteps: [
      { text: 'API 概述', link: '/api/overview', primary: true },
      { text: '认证', link: '/api/authentication' },
      { text: 'Chat Completions', link: '/api/chat-completions' },
    ],
  },

  'arch': {
    id: 'arch',
    name: '系统架构',
    fullName: '系统架构 — 集群 · GitOps · 监控',
    tagline: '各服务共用的基础设施，一张图讲清',
    status: 'live',
    category: 'platform',
    audiences: ['developer', 'decider'],
    colorToken: '--lurus-color-arch',
    icon: 'network',
    home: '/developer/architecture',
    highlights: [
      { title: '集群', body: 'K3s 与 Docker Compose 混合部署', icon: 'cloud' },
      { title: 'GitOps 部署', body: '部署清单以 git 为准：CI 构建镜像 → 镜像仓库 → ArgoCD 同步', icon: 'git-merge' },
      { title: '监控', body: 'Netdata 采集主机与服务指标，业务服务侧不做改动', icon: 'activity' },
    ],
    relatedProducts: ['platform', 'auth'],
    nextSteps: [
      { text: '查看架构', link: '/developer/architecture', primary: true },
    ],
  },
}

export const productList: Product[] = Object.values(products)

export const byAudience = (a: Audience): Product[] =>
  productList.filter((p) => p.audiences.includes(a))

export const byCategory = (c: ProductCategory): Product[] =>
  productList.filter((p) => p.category === c)

/** Reverse lookup: who relates to product `id`? */
export const incomingLinks = (id: string): Product[] =>
  productList.filter((p) => p.relatedProducts.includes(id))

/** Forward lookup: products this one declares as related. */
export const outgoingLinks = (id: string): Product[] => {
  const p = products[id]
  if (!p) return []
  return p.relatedProducts
    .map((rid) => products[rid])
    .filter((x): x is Product => Boolean(x))
}
