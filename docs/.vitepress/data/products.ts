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
    fullName: 'Lurus API — LLM 统一网关',
    tagline: '一个 API Key 接入 50+ AI 模型，完全兼容 OpenAI SDK',
    status: 'live',
    category: 'ai-service',
    audiences: ['newbie', 'developer', 'decider'],
    colorToken: '--lurus-color-lurus-api',
    icon: 'plug-zap',
    home: '/guide/introduction',
    consoleUrl: 'https://api.lurus.cn',
    highlights: [
      { title: '50+ 模型一键切换', body: 'DeepSeek / 通义 / 智谱 / Claude / GPT 全覆盖，按 model 名称自动路由', icon: 'layers' },
      { title: 'OpenAI SDK 即插即用', body: '改一行 base_url 即可迁移存量代码，无需重写业务逻辑', icon: 'repeat' },
      { title: '智能路由与故障转移', body: '多渠道权重负载均衡、自动故障转移、per-channel 熔断保护', icon: 'zap' },
      { title: '透明计费', body: '鹿贝钱包 · 按量扣费 · 详细用量报表 · 免费额度', icon: 'wallet' },
    ],
    metrics: [
      { label: '接入模型', value: '50+' },
      { label: '免费额度', value: '100 次/天' },
      { label: '兼容性', value: 'OpenAI SDK' },
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'curl',
        code: `curl https://api.lurus.cn/v1/chat/completions \\
  -H "Authorization: Bearer $LURUS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"你好"}]}'`,
      },
      {
        lang: 'python',
        label: 'Python',
        code: `from openai import OpenAI

client = OpenAI(
    api_key="sk-...",
    base_url="https://api.lurus.cn/v1",
)

resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)`,
      },
      {
        lang: 'typescript',
        label: 'TypeScript',
        code: `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.LURUS_API_KEY,
  baseURL: 'https://api.lurus.cn/v1',
})

const res = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: '你好' }],
})`,
      },
    ],
    scenarios: [
      { role: '新手', title: '3 分钟发起第一次 AI 调用', summary: '注册 → 领 API Key → curl 跑通', link: '/guide/quickstart' },
      { role: '开发者', title: '从 OpenAI 无感迁移', summary: '只改一行 base_url，保留所有 SDK 调用', link: '/migrations/from-openai' },
      { role: '决策者', title: '统一采购 50+ 模型', summary: '一张发票、一套账号、统一监控', link: '/solutions/ai-midware' },
    ],
    relatedProducts: ['switch', 'kova', 'lumen', 'platform'],
    nextSteps: [
      { text: '快速开始', link: '/guide/quickstart', primary: true },
      { text: '支持的模型', link: '/guide/models' },
      { text: '控制台', link: 'https://api.lurus.cn', external: true },
    ],
  },

  'kova': {
    id: 'kova',
    name: 'Kova',
    fullName: 'Kova — AI Agent 持久执行引擎',
    tagline: 'Rust 构建的 WAL-First Agent 引擎，崩溃自动恢复，3μs 调度',
    status: 'dev',
    category: 'ai-service',
    audiences: ['developer', 'decider'],
    colorToken: '--lurus-color-kova',
    icon: 'bot',
    home: '/kova/',
    highlights: [
      { title: 'WAL 崩溃恢复', body: '每步执行预写日志 + CRC32 校验，崩溃后从断点重放，不重调 LLM', icon: 'database-backup' },
      { title: '3μs 调度延迟', body: 'FIFO 完整管道 Criterion 基准 3.17μs，315K ops/s 吞吐', icon: 'gauge' },
      { title: '零外部依赖', body: '单二进制 < 10MB，无需 Redis/Postgres，本地 WAL 文件即可运行', icon: 'package' },
      { title: '四种接入方式', body: 'Rust SDK / gRPC / REST / MCP，21 workspace crate 模块化', icon: 'puzzle' },
    ],
    metrics: [
      { label: '调度延迟', value: '3μs' },
      { label: '吞吐', value: '315K ops/s' },
      { label: '代码量', value: '178K LOC' },
      { label: 'Workspace', value: '21 crate' },
    ],
    codeExamples: [
      {
        lang: 'rust',
        label: 'Rust SDK',
        code: `use kova::prelude::*;

let engine = KovaBuilder::new()
    .wal_dir("./agent-state")
    .build()?;

let agent = engine.create_agent("researcher")
    .model("deepseek-chat")
    .tools(&["web_search", "file_read"])
    .build()?;

// Agent crashes → auto-resume from WAL, no LLM re-call
agent.run("帮我调研 WASM Component Model").await?;`,
      },
      {
        lang: 'bash',
        label: 'gRPC / REST',
        code: `# REST
curl http://localhost:8080/v1/agents/researcher/run \\
  -H "Content-Type: application/json" \\
  -d '{"input":"调研 WASM Component Model"}'

# MCP 作为 Tool 暴露给 Claude/Codex
kova mcp serve --port 3333`,
      },
    ],
    architectureDiagram: `graph LR
  A[Client SDK / gRPC / REST] --> B[Kova Core]
  B --> C[WAL Writer<br/>CRC32]
  B --> D[Scheduler<br/>FIFO]
  B --> E[Tool Runtime<br/>MCP]
  C -.recover.-> B
  D --> F[LLM Provider<br/>via Lurus API]`,
    scenarios: [
      { role: '开发者', title: '5 分钟起一个持久化 Agent', summary: 'cargo add kova + 3 行代码', link: '/kova/quickstart' },
      { role: '架构师', title: '替换 LangGraph Checkpointer', summary: '在 LangGraph 项目里用 Kova 存 checkpoint', link: '/tutorials/lumen-kova-langgraph' },
    ],
    comparison: {
      competitors: ['Temporal', 'LangGraph', 'CrewAI'],
      rows: [
        { dimension: '调度延迟', self: '3μs (Criterion)', alt: { Temporal: '1-10ms', LangGraph: 'N/A (内存)', CrewAI: 'N/A (内存)' } },
        { dimension: '崩溃恢复', self: 'WAL 自动重放', alt: { Temporal: 'Event Sourcing', LangGraph: 'SqliteSaver', CrewAI: '无' } },
        { dimension: '外部依赖', self: '零', alt: { Temporal: 'Cassandra/MySQL', LangGraph: 'SQLite 可选', CrewAI: '无' } },
        { dimension: '接入方式', self: 'SDK/gRPC/REST/MCP', alt: { Temporal: 'SDK', LangGraph: 'Python only', CrewAI: 'Python only' } },
        { dimension: '二进制大小', self: '< 10MB', alt: { Temporal: 'JVM 数百 MB', LangGraph: 'Python pkg', CrewAI: 'Python pkg' } },
      ],
    },
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
    tagline: '零 LLM 成本的 AI 记忆引擎 · 仿生遗忘曲线 · 12 种 PII 过滤',
    status: 'dev',
    category: 'ai-service',
    audiences: ['developer', 'decider'],
    colorToken: '--lurus-color-memx',
    icon: 'brain',
    home: '/memx/',
    highlights: [
      { title: 'ACE v2.0 知识蒸馏', body: '规则预筛 + LLM 精炼混合模式，LLM 不可用时自动降级', icon: 'filter' },
      { title: 'Ebbinghaus 衰退', body: '半衰期 30 天，高频召回条目永久保留，模拟人类遗忘', icon: 'timer' },
      { title: '四层混合检索', body: '向量 + BM25 + 规则 + 衰减加权，可配优先级', icon: 'search' },
      { title: '12 种 PII 过滤', body: 'API Key / 密码 / 私钥 / 手机号等敏感信息永不入向量库', icon: 'shield-check' },
    ],
    metrics: [
      { label: 'PII 规则', value: '12 种' },
      { label: '混合检索', value: '4 层' },
      { label: '交付形态', value: 'Python + REST + MCP' },
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Python',
        code: `from memx import Memory

m = Memory(config={"ace_enabled": True})

m.add([
    {"role": "user", "content": "pytest 超时怎么办？"},
    {"role": "assistant", "content": "用 pytest -x --timeout=30 逐个排查"},
], user_id="dev1", scope="project:backend")

results = m.search("pytest 调试", user_id="dev1")`,
      },
      {
        lang: 'bash',
        label: 'REST',
        code: `curl -X POST https://memx.lurus.cn/v1/memories \\
  -H "Authorization: Bearer $MEMX_KEY" \\
  -d '{"messages": [...], "user_id": "dev1"}'`,
      },
    ],
    architectureDiagram: `graph TB
  Input[对话流] --> Reflector[Reflector<br/>知识蒸馏]
  Reflector --> PII[PII 过滤 12 规则]
  PII --> Curator[Curator<br/>语义去重]
  Curator --> Store[(向量 + 元数据)]
  Store --> Decay[Decay Engine<br/>Ebbinghaus]
  Query[检索请求] --> Hybrid[四层混合检索]
  Hybrid --> Store`,
    comparison: {
      competitors: ['mem0', 'LangMem', 'LlamaIndex Memory'],
      rows: [
        { dimension: 'LLM 蒸馏成本', self: '零（规则降级）', alt: { mem0: '每次调用', LangMem: '每次调用', 'LlamaIndex Memory': '每次调用' } },
        { dimension: '衰退机制', self: 'Ebbinghaus 曲线', alt: { mem0: '无', LangMem: '时间窗口', 'LlamaIndex Memory': '无' } },
        { dimension: 'PII 过滤', self: '12 种不可绕过', alt: { mem0: '需自实现', LangMem: '需自实现', 'LlamaIndex Memory': '需自实现' } },
        { dimension: '检索维度', self: '向量+BM25+规则+衰减', alt: { mem0: '向量', LangMem: '向量', 'LlamaIndex Memory': '向量+BM25' } },
      ],
    },
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
    fullName: 'Lucrum — AI 量化交易平台',
    tagline: '自然语言描述策略，AI 生成 vnpy 代码并回测 · 11 个投资顾问',
    status: 'live',
    category: 'ai-service',
    audiences: ['player', 'developer'],
    colorToken: '--lurus-color-lucrum',
    icon: 'trending-up',
    home: '/lucrum/',
    consoleUrl: 'https://lucrum.lurus.cn',
    highlights: [
      { title: '自然语言 → 策略代码', body: '中文描述思路 → AI 生成 vnpy CtaTemplate → 回测 → 评分', icon: 'sparkles' },
      { title: '11 个投资顾问 Agent', body: '巴菲特 / 彼得林奇 / 利弗莫尔 / 西蒙斯 + 4 分析师 + 2 研究员 + 辩论主持', icon: 'users' },
      { title: '金融级精度', body: 'Decimal.js 全精度 + 3157 Vitest 用例，零浮点误差', icon: 'calculator' },
      { title: 'S/A/B/C/D 五级评分', body: '4 维加权：收益 30% + 风控 30% + 稳定性 25% + 效率 15%', icon: 'star' },
    ],
    metrics: [
      { label: '投资顾问', value: '11 个' },
      { label: '回测指标', value: '30+' },
      { label: '测试用例', value: '3157+' },
      { label: '精度', value: 'Decimal.js' },
    ],
    codeExamples: [
      {
        lang: 'text',
        label: '自然语言',
        code: `你: 双均线交叉策略，5 日线上穿 20 日线买入，下穿卖出，止损 5%

AI: 已生成 vnpy CtaTemplate 策略代码。
    回测结果 (2024-01 ~ 2025-12):
    夏普比率: 1.42 | 最大回撤: 8.3% | 胜率: 62%
    评级: A (收益优秀，风控良好)`,
      },
    ],
    comparison: {
      competitors: ['vnpy', '掘金', '米筐', '聚宽'],
      rows: [
        { dimension: '策略编写', self: '自然语言生成', alt: { vnpy: 'Python 手写', 掘金: 'Python 手写', 米筐: 'Python 手写', 聚宽: 'Python 手写' } },
        { dimension: 'AI 投资顾问', self: '11 个多视角', alt: { vnpy: '无', 掘金: '无', 米筐: '无', 聚宽: '无' } },
        { dimension: '精度', self: 'Decimal.js 全精度', alt: { vnpy: 'float', 掘金: 'float', 米筐: 'float', 聚宽: 'float' } },
        { dimension: '策略市场', self: '内置 + 评级', alt: { vnpy: '无', 掘金: '有', 米筐: '有', 聚宽: '有' } },
      ],
    },
    scenarios: [
      { role: '玩家', title: '从零开始跑第一个策略', summary: '写需求 → 回测 → 上架策略市场', link: '/tutorials/lucrum-strategy-workflow' },
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
    fullName: 'Switch — AI 工具管理中心',
    tagline: '桌面端统一管理 5 款 AI 编程 CLI 配置 · MCP · 成本',
    status: 'dev',
    category: 'desktop',
    audiences: ['player', 'developer'],
    colorToken: '--lurus-color-switch',
    icon: 'monitor',
    home: '/switch/',
    highlights: [
      { title: '5 款 CLI 一站管理', body: 'Claude Code / Codex / Gemini / PicoClaw / NullClaw 配置统一', icon: 'layers' },
      { title: 'MCP 可视化', body: '告别手写 JSON，MCP 服务器跨工具同步', icon: 'plug' },
      { title: '成本仪表盘', body: '按工具/模型聚合，阈值告警，与 Lumen 协同', icon: 'bar-chart-3' },
      { title: '单 exe 零依赖', body: 'Wails + Go 1.25 + React 18，< 15MB 启动 < 2s', icon: 'package' },
    ],
    metrics: [
      { label: '管理 CLI', value: '5 款' },
      { label: '包体积', value: '<15MB' },
      { label: '启动', value: '<2s' },
    ],
    comparison: {
      competitors: ['Aider', 'Cursor', '手动管理'],
      rows: [
        { dimension: 'CLI 覆盖', self: '5 款统一', alt: { Aider: '1 款', Cursor: '内置 IDE', 手动管理: 'N/A' } },
        { dimension: 'MCP 管理', self: '可视化 + 同步', alt: { Aider: '无', Cursor: '单独配', 手动管理: '手写 JSON' } },
        { dimension: '成本监控', self: '聚合仪表盘', alt: { Aider: '无', Cursor: '无', 手动管理: '无' } },
        { dimension: '团队同步', self: 'Git + Vault', alt: { Aider: '无', Cursor: '无', 手动管理: '无' } },
      ],
    },
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
    fullName: 'Creator — AI 内容工厂',
    tagline: '粘贴视频链接，AI 三平台改写 + 自动发布',
    status: 'dev',
    category: 'desktop',
    audiences: ['player'],
    colorToken: '--lurus-color-creator',
    icon: 'clapperboard',
    home: '/creator/',
    highlights: [
      { title: '一键流水线', body: 'yt-dlp 下载 → Whisper 转写 → LLM 改写 → chromedp 发布', icon: 'workflow' },
      { title: '6 平台定制文案', body: '公众号 / 抖音 / 小红书 / YouTube / TikTok / Reels 一次生成', icon: 'share-2' },
      { title: '视频源 1000+', body: 'yt-dlp 支持 YouTube / Bilibili 等全网站点', icon: 'video' },
      { title: '单 exe 零依赖', body: 'Wails 构建，打开即用', icon: 'package' },
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
    fullName: 'Lumen — Agent 可观测性与可靠性工具',
    tagline: 'Replay · Crash Recovery · Cost Tracking — Agent 三合一',
    status: 'dev',
    category: 'ai-service',
    audiences: ['developer'],
    colorToken: '--lurus-color-lumen',
    icon: 'zap',
    home: '/lumen/',
    highlights: [
      { title: 'Replay 零成本重放', body: '记录 LLM 调用序列，本地回放不消耗 Token', icon: 'rewind' },
      { title: 'Crash Recovery', body: 'LumenCheckpointer 替换 LangGraph SqliteSaver，微秒级 WAL 恢复', icon: 'life-buoy' },
      { title: 'Cost Tracking', body: '按 Agent/Graph/Node 聚合 Token 成本，实时告警', icon: 'coins' },
      { title: 'Python SDK 优先', body: 'pip install lumen-ai，三行接入 LangGraph', icon: 'package-plus' },
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Python',
        code: `pip install lumen-ai

from lumen_ai import LumenTracer, LumenCheckpointer

graph = workflow.compile(
    checkpointer=LumenCheckpointer(),   # 崩溃恢复
    callbacks=[LumenTracer()],           # 执行追踪 + 成本
)`,
      },
    ],
    comparison: {
      competitors: ['Temporal', 'LangGraph Checkpointer', 'Conductor'],
      rows: [
        { dimension: 'Replay', self: '零成本 LLM 重放', alt: { Temporal: 'Event replay', 'LangGraph Checkpointer': '部分', Conductor: 'Workflow replay' } },
        { dimension: '接入成本', self: '3 行代码', alt: { Temporal: 'Worker + SDK', 'LangGraph Checkpointer': '配置', Conductor: 'Worker' } },
        { dimension: 'Cost 追踪', self: '内置', alt: { Temporal: '无', 'LangGraph Checkpointer': '无', Conductor: '无' } },
      ],
    },
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
    fullName: 'Forge — AI 产品开发工作台',
    tagline: '"一切皆对话" · Ontology + Session 双核心（内部 R&D）',
    status: 'beta',
    category: 'ai-service',
    audiences: ['developer'],
    colorToken: '--lurus-color-forge',
    icon: 'hammer',
    home: '/forge/',
    highlights: [
      { title: 'Ontology 本体论', body: '树状结构管理产品用户故事、架构、技术栈、设计规范', icon: 'network' },
      { title: 'Session 对话驱动', body: 'PM / Architect / Code Agent 在 Session 中协作产出 PR', icon: 'messages-square' },
      { title: 'WAL 决策回溯', body: '基于 Kova 引擎，每个决策可回溯到对话上下文', icon: 'history' },
      { title: '内部 R&D 工具', body: '仅受邀内测，不对外商业化', icon: 'lock' },
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
    fullName: 'Lurus Platform — 账号与计费',
    tagline: '统一账号 · 订阅计划 · 鹿贝钱包 · VIP 体系',
    status: 'live',
    category: 'platform',
    audiences: ['newbie', 'decider'],
    colorToken: '--lurus-color-platform',
    icon: 'wallet',
    home: '/platform/',
    highlights: [
      { title: '统一账号', body: '跨所有 Lurus 产品共享同一身份、余额、订阅', icon: 'user-check' },
      { title: '鹿贝钱包', body: '统一计费单位，按量扣费，实时余额查询', icon: 'coins' },
      { title: '订阅计划', body: '免费额度 + 按需付费 + 企业套餐', icon: 'package-2' },
      { title: 'VIP 体系', body: '消费升级，解锁专属模型与客服', icon: 'crown' },
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
    fullName: 'Lurus Auth — 统一身份认证',
    tagline: '全产品 SSO · Passkey · MFA · OIDC/OAuth2 · 企业 SSO 联邦',
    status: 'live',
    category: 'platform',
    audiences: ['developer', 'decider'],
    colorToken: '--lurus-color-auth',
    icon: 'shield-check',
    home: '/platform/auth/',
    consoleUrl: 'https://identity.lurus.cn',
    highlights: [
      { title: '全产品 SSO', body: '一次登录，所有 Lurus 产品畅通', icon: 'key-round' },
      { title: 'Passkey + MFA', body: 'WebAuthn / TOTP / 备份码多因素组合', icon: 'shield' },
      { title: 'OIDC / OAuth2', body: '标准协议，Casdoor 实现，第三方接入无障碍', icon: 'link' },
      { title: '企业 SSO 联邦', body: '接入企业 IdP（Okta / Azure AD / 自建 Keycloak）', icon: 'building-2' },
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
    fullName: 'API 参考 — OpenAI 兼容端点手册',
    tagline: '完整端点文档 · 错误码 · 请求示例',
    status: 'live',
    category: 'platform',
    audiences: ['developer'],
    colorToken: '--lurus-color-api-ref',
    icon: 'book-open',
    home: '/api/overview',
    highlights: [
      { title: 'OpenAI 兼容', body: '所有端点路径与语义对齐 OpenAI，SDK 零改动', icon: 'shuffle' },
      { title: '完整错误码', body: '每个错误均有 code + message + 建议动作', icon: 'alert-circle' },
      { title: '多种认证', body: 'Bearer Token / PAT / JWT 多种方式', icon: 'key' },
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
    fullName: '系统架构 — 混合云 · GitOps · 可观测性',
    tagline: '12 产品共享基础设施，一张图讲清',
    status: 'live',
    category: 'platform',
    audiences: ['developer', 'decider'],
    colorToken: '--lurus-color-arch',
    icon: 'network',
    home: '/developer/architecture',
    highlights: [
      { title: '混合云集群', body: '三丰云 + 阿里云双公网入口，K3s + Docker-Compose 混部', icon: 'cloud' },
      { title: 'GitOps 部署', body: 'GitHub Actions → GHCR → ArgoCD 全流程自动化', icon: 'git-merge' },
      { title: '全栈可观测', body: 'Grafana + Prometheus + Jaeger + Loki 统一面板', icon: 'activity' },
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
