// Changelog — single source of truth for the 产品动态 page AND the RSS feed.
// Plain TS (imported directly by updates/index.md and scripts/gen-feed.ts).
// Dates are month-granularity from the original markdown changelog; keep newest first.
//
// `content` is a short HTML fragment (rendered via UpdateCard's sanitized v-html).
// Only add entries backed by real, shipped/announced changes.

export interface ChangelogEntry {
  id: string
  title: string
  /** feature | improvement | bugfix | security | deprecation | launch | sunset */
  type: string
  productName: string
  /** CSS color token, e.g. var(--lurus-color-platform). */
  productColor: string
  version?: string | null
  /** ISO date (YYYY-MM-DD), month-granularity. */
  publishedAt: string
  isMajor: boolean
  content: string
}

export const changelog: ChangelogEntry[] = [
  {
    id: 'identity-console-live',
    title: 'identity.lurus.cn 账号控制台全量上线',
    type: 'launch',
    productName: 'Platform',
    productColor: 'var(--lurus-color-platform)',
    publishedAt: '2026-05-28',
    isMajor: true,
    content: '<p>统一账号控制台在 <code>identity.lurus.cn</code> 全量上线（R1 生产）。自助页面：账户与安全、鹿贝钱包、订阅计划、充值、兑换码。</p>',
  },
  {
    id: 'account-entry-consolidation',
    title: '账号入口统一收敛到 identity.lurus.cn',
    type: 'deprecation',
    productName: 'Platform',
    productColor: 'var(--lurus-color-platform)',
    publishedAt: '2026-05-28',
    isMajor: false,
    content: '<p>账号 / 计费 / 订阅自助操作统一收敛到 <code>identity.lurus.cn</code>；<strong>原 admin.lurus.cn 入口已退役</strong>。企业组织成员 / 权限 / 审计经 auth.lurus.cn（Casdoor）管理。</p>',
  },
  {
    id: 'lucrum-pricing',
    title: 'Lucrum 定价页上线',
    type: 'feature',
    productName: 'Lucrum',
    productColor: 'var(--lurus-color-lucrum)',
    publishedAt: '2026-05-20',
    isMajor: false,
    content: '<p>Lucrum 定价页 <a href="https://lucrum.lurus.cn/pricing">lucrum.lurus.cn/pricing</a> 上线，订阅层级与配额一目了然（产品当前公测 / beta）。</p>',
  },
  {
    id: 'gateway-multitenant-hub',
    title: 'LLM 网关向多租户 Hub 演进',
    type: 'improvement',
    productName: 'Lurus API',
    productColor: 'var(--lurus-color-lurus-api)',
    publishedAt: '2026-05-12',
    isMajor: false,
    content: '<p>LLM 网关正从 newapi.lurus.cn 向多租户 Hub（hub.lurus.cn）演进，强化统一计费与租户隔离。<strong>当前调用方式与地址不变</strong>。</p>',
  },
  {
    id: 'docs-accuracy-audit',
    title: '全站文档准确性审计',
    type: 'improvement',
    productName: 'Docs',
    productColor: 'var(--lurus-color-lurus-api)',
    publishedAt: '2026-04-18',
    isMajor: false,
    content: '<p>对齐所有产品线真实现状（代码基准 vs 文案）：Kova LoC 17.8 万（21 crate）、协议修正为 SDK/gRPC/REST/MCP；Lucrum 测试口径校正；Forge 标注内测。</p>',
  },
  {
    id: 'kova-recovery-sprint',
    title: 'Kova 崩溃恢复可靠性冲刺',
    type: 'improvement',
    productName: 'Kova',
    productColor: 'var(--lurus-color-kova)',
    publishedAt: '2026-03-22',
    isMajor: false,
    content: '<p>WAL 支持 assistant_content 序列化，崩溃后不重调 LLM；增量 checkpoint hash 校验自动回退；新增 7 个 UAT 崩溃恢复测试全通过；kova-memory crate 桥接 MemX。</p>',
  },
  {
    id: 'api-contract-first',
    title: 'Lurus API 契约优先架构升级',
    type: 'feature',
    productName: 'Lurus API',
    productColor: 'var(--lurus-color-lurus-api)',
    publishedAt: '2026-03-15',
    isMajor: false,
    content: '<p>lurus.yaml 新增 capabilities 注册表（7 大能力）；lurus-proto-go 独立为 standalone module；Platform OpenAPI（50+ endpoints）与 MemX OpenAPI 发布。</p>',
  },
  {
    id: 'lucrum-epics-complete',
    title: 'Lucrum 7 个 Epic 全部完成',
    type: 'launch',
    productName: 'Lucrum',
    productColor: 'var(--lurus-color-lucrum)',
    publishedAt: '2026-03-10',
    isMajor: true,
    content: '<p>自然语言 → vnpy 策略代码；回测引擎 Decimal.js 全精度重写（3000+ Vitest 用例）；11 个 AI 投资顾问上线；批量并行回测 + PDF 报告；WCAG 2.1 AA 通过。</p>',
  },
  {
    id: 'platform-observability',
    title: 'Platform 全栈可观测性上线',
    type: 'feature',
    productName: 'Platform',
    productColor: 'var(--lurus-color-platform)',
    publishedAt: '2026-03-05',
    isMajor: false,
    content: '<p>OTel Collector 4 节点部署，traces→Jaeger + metrics→Prometheus + logs→Loki；SLO 仪表盘上线；CI 集成 Trivy 容器安全扫描。</p>',
  },
  {
    id: 'switch-bmad-planning',
    title: 'Switch 完整规划与开发完成',
    type: 'improvement',
    productName: 'Switch',
    productColor: 'var(--lurus-color-switch)',
    publishedAt: '2026-02-20',
    isMajor: false,
    content: '<p>PRD / Epics / Architecture 完成；32 个 Go 后端模块 + 20+ 前端页面；支持 Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw 5 种工具配置管理。</p>',
  },
  {
    id: 'creator-merge-rewrite',
    title: 'Creator 合并重写完成',
    type: 'improvement',
    productName: 'Creator',
    productColor: 'var(--lurus-color-creator)',
    publishedAt: '2026-02-15',
    isMajor: false,
    content: '<p>三个项目合并为一；Content Pipeline（yt-dlp → Whisper → LLM）完成；Publisher 用 chromedp 重写；多平台视频 URL 正则校验。</p>',
  },
  {
    id: 'lutu-flutter-client',
    title: 'Lutu Flutter 客户端代码完成',
    type: 'feature',
    productName: 'Lutu',
    productColor: 'var(--lurus-color-lurus-api)',
    publishedAt: '2026-02-10',
    isMajor: false,
    content: '<p>12 Model + 10 Provider + 14 Screen；ProxyProvider 链式状态管理；双拦截器 Dio 架构；flutter analyze 零 issue，debug APK 构建通过。</p>',
  },
]
