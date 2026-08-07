/**
 * Glossary data loader — build-time data for <Term> tooltips and /guide/glossary.
 *
 * This file supersedes the old `glossary.ts`. Entries now carry `tags`
 * (for topical grouping on the full glossary page) and `aliases` (for
 * alternate lookups). Keep definitions <= 2 sentences.
 */

export type GlossaryTag = 'kova' | 'memx' | 'auth' | 'lucrum' | 'switch' | 'lumen' | 'general'

export interface GlossaryEntry {
  zh: string
  en?: string
  see?: string
  tags?: GlossaryTag[]
  aliases?: string[]
}

export const glossary: Record<string, GlossaryEntry> = {
  // ─── General ─────────────────────────────────────────────
  'API Key': {
    zh: '访问 API 的密钥凭证，类似于密码。每个 Key 可独立设置配额和权限。',
    see: '/guide/get-api-key',
    tags: ['general'],
  },
  'Bearer Token': {
    zh: '一种 HTTP 认证方式，在请求头中以 "Bearer sk-xxx" 格式携带凭证。',
    en: 'An HTTP auth scheme that sends credentials in the Authorization header.',
    tags: ['general', 'auth'],
  },
  'Rate Limit': {
    zh: '速率限制，API 对单位时间内请求次数的上限控制，防止滥用和过载。',
    tags: ['general'],
  },
  'Streaming': {
    zh: '流式响应，AI 模型逐 Token 返回结果（而非等全部生成完），降低首字延迟。',
    en: 'Server-Sent Events streaming',
    tags: ['general'],
  },
  'Token': {
    zh: 'LLM 处理文本的最小单位。中文约 1.5 字符/token，英文约 4 字符/token。',
    tags: ['general'],
  },
  'Webhook': {
    zh: '服务端主动向你指定的 URL 推送事件通知，如支付成功、订阅到期等。',
    en: 'Webhook — server-to-server event notification',
    tags: ['general'],
  },
  'SDK': {
    zh: '软件开发工具包，提供封装好的函数和类，简化 API 调用。Lurus 兼容 OpenAI SDK。',
    en: 'Software Development Kit',
    tags: ['general'],
  },
  'Endpoint': {
    zh: 'API 端点，一个可调用的 URL 路径，如 /v1/chat/completions。',
    en: 'API Endpoint',
    tags: ['general'],
  },
  'Base URL': {
    zh: 'API 的根地址。Lurus 的 Base URL 是 https://api.lurus.cn/v1。',
    tags: ['general'],
  },
  'GitOps': {
    zh: '以 Git 仓库作为部署真相源，通过自动化工具（如 ArgoCD）将期望状态同步到集群。',
    tags: ['general'],
  },
  'ArgoCD': {
    zh: 'Kubernetes 的 GitOps 持续交付工具，监听 Git 仓库变更并自动同步到集群。',
    en: 'Argo CD',
    tags: ['general'],
  },
  'OpenTelemetry': {
    zh: '可观测性领域的开源标准，统一 Trace / Metric / Log 三大信号的采集与传输。',
    en: 'OpenTelemetry (OTel)',
    tags: ['general'],
  },
  'OpenAPI': {
    zh: '描述 REST API 的开放规范（原 Swagger）。Lurus 的数据结构由网关 OpenAPI 规范自动同步生成。',
    en: 'OpenAPI Specification',
    see: '/api/schemas',
    tags: ['general'],
  },
  'Schema': {
    zh: '数据结构定义，规定请求 / 响应中每个字段的名称、类型与是否必填。',
    en: 'Schema',
    see: '/api/schemas',
    tags: ['general'],
  },

  // ─── Auth ────────────────────────────────────────────────
  'OIDC': {
    zh: 'OpenID Connect，基于 OAuth 2.0 的身份认证标准，Lurus 使用 Casdoor 实现。',
    en: 'OpenID Connect',
    tags: ['auth'],
  },
  'Passkey': {
    zh: '基于 WebAuthn 标准的无密码认证方式，由设备指纹 / Face ID / 安全密钥完成。',
    en: 'Passkey / WebAuthn',
    tags: ['auth'],
  },
  'MFA': {
    zh: '多因素认证，要求同时提供 2+ 种凭证（密码 + TOTP、密码 + Passkey 等）。',
    en: 'Multi-Factor Authentication',
    tags: ['auth'],
  },
  'PAT': {
    zh: 'Personal Access Token，用户生成的长期 API 访问令牌，替代密码用于自动化。',
    en: 'Personal Access Token',
    tags: ['auth', 'general'],
  },
  'JWT': {
    zh: 'JSON Web Token，自包含的签名令牌，服务端无需查库即可验证身份。',
    en: 'JSON Web Token',
    tags: ['auth', 'general'],
  },
  'Casdoor': {
    zh: 'Lurus 使用的开源身份平台，提供 OIDC / OAuth2 / SAML / SCIM / MFA 能力。',
    tags: ['auth'],
  },
  'SSO 联邦': {
    zh: '企业将自家 IdP（Okta / Azure AD 等）接入 Lurus Auth，员工用公司账号登录 Lurus 产品。',
    en: 'Federated SSO',
    tags: ['auth'],
  },

  // ─── Kova ────────────────────────────────────────────────
  'WAL': {
    zh: 'Write-Ahead Log，预写日志。所有状态变更先写日志再执行，确保崩溃后可从日志恢复。',
    en: 'Write-Ahead Log',
    see: '/kova/concepts#wal-write-ahead-log',
    tags: ['kova'],
  },
  'Checkpoint': {
    zh: '检查点，将内存中的完整状态快照写入磁盘。崩溃恢复时从最近的 Checkpoint 开始重放 WAL。',
    tags: ['kova', 'lumen'],
  },
  'CheckpointSaver': {
    zh: 'LangGraph 中负责持久化图状态的组件接口，可被 Kova/Lumen 提供的实现替换。',
    tags: ['kova', 'lumen'],
  },
  'Agent': {
    zh: '由 LLM 驱动的自主决策程序：感知输入 → 推理 → 调用工具 → 产出结果。',
    tags: ['kova', 'general'],
  },
  'Agent Loop': {
    zh: 'Agent 决策循环：接收输入 → LLM 推理 → 调用工具 → 获取结果 → 继续推理，直到生成最终回答。',
    tags: ['kova'],
  },
  'Durable Execution': {
    zh: '持久化执行，任务状态持续写入 WAL，进程崩溃后自动从中断点恢复，不重复调用 LLM。',
    en: 'Durable Execution',
    tags: ['kova'],
  },
  'MCP': {
    zh: 'Model Context Protocol，模型上下文协议。一种开放标准，让 AI Agent 以统一方式调用外部工具和数据源。',
    en: 'Model Context Protocol',
    see: '/kova/concepts#mcp-工具',
    tags: ['kova', 'switch'],
  },
  'A2A': {
    zh: 'Agent-to-Agent 协议，让多个 Agent 直接通信、委派任务和交换信息。',
    en: 'Agent-to-Agent Protocol',
    tags: ['kova'],
  },
  'Swarm': {
    zh: '群体智能模式，多个 Agent 由协调者分配任务并自主协作，无需预定义固定流程。',
    see: '/kova/concepts#swarm-群体智能',
    tags: ['kova'],
  },
  'Ring Buffer': {
    zh: '环形缓冲区，固定大小的循环存储结构。写指针到达末尾时回绕覆盖旧数据，WAL 使用 power-of-2 大小的环形缓冲。',
    en: 'Ring Buffer',
    tags: ['kova'],
  },
  'CRC32': {
    zh: '循环冗余校验算法，用于检测数据传输或存储中的错误。Kova 的每条 WAL 记录都包含 CRC32 校验和。',
    en: 'Cyclic Redundancy Check (32-bit)',
    tags: ['kova'],
  },
  'FIFO': {
    zh: 'First In, First Out，先进先出队列。Kova 的任务调度默认使用 FIFO 策略。',
    en: 'First In, First Out',
    tags: ['kova', 'general'],
  },
  'System Prompt': {
    zh: '系统提示词，定义 AI 的角色、能力边界和行为规范。放在消息数组的第一条。',
    tags: ['kova', 'general'],
  },
  'Tool Call': {
    zh: 'AI 模型在推理过程中决定调用外部工具（如搜索、数据库查询），并返回结构化的调用参数。',
    tags: ['kova', 'general'],
  },
  'Replay': {
    zh: '重放，使用已持久化的事件序列复现 Agent 执行过程，本地调试不消耗额外 LLM Token。',
    tags: ['kova', 'lumen'],
  },

  // ─── MemX ────────────────────────────────────────────────
  'ACE': {
    zh: 'Adaptive Context Engine，自适应上下文引擎。MemX 的核心智能层，包含知识蒸馏、去重、衰减和检索四大模块。',
    en: 'Adaptive Context Engine',
    see: '/memx/concepts',
    tags: ['memx'],
  },
  'Embedding': {
    zh: '嵌入向量，将文本转换为高维数值向量，使语义相似的文本在向量空间中距离相近。MemX 使用本地 ONNX 模型生成。',
    en: 'Text Embedding',
    tags: ['memx', 'general'],
  },
  'Vector Search': {
    zh: '向量搜索，通过计算查询文本与存储文本的嵌入向量距离，找到语义最相关的结果。',
    en: 'Vector Similarity Search',
    tags: ['memx'],
  },
  'Semantic Dedup': {
    zh: '语义去重，通过余弦相似度自动识别和合并含义相同但表述不同的知识条目。',
    en: 'Semantic Deduplication',
    tags: ['memx'],
  },
  'PII': {
    zh: '个人可识别信息，如 API Key、密码、私钥等敏感数据。MemX 内置 12 种不可绕过的 PII 过滤规则。',
    en: 'Personally Identifiable Information',
    tags: ['memx', 'general'],
  },
  'Reflector': {
    zh: 'MemX 的知识蒸馏引擎，通过规则预筛 + LLM 精炼从对话中自动提取高价值知识。',
    see: '/memx/concepts#reflector-—-知识蒸馏引擎',
    tags: ['memx'],
  },
  'Curator': {
    zh: 'MemX 的语义去重引擎，在每次写入时通过余弦相似度自动合并重复知识、检测矛盾。',
    see: '/memx/concepts#curator-—-语义去重引擎',
    tags: ['memx'],
  },
  'Decay': {
    zh: '记忆衰减，模拟人类遗忘曲线。不被检索的知识逐步降低权重，经常被检索的知识越来越牢固。',
    see: '/memx/concepts#decay-—-时间衰减引擎',
    tags: ['memx'],
  },
  'Ebbinghaus': {
    zh: '艾宾浩斯遗忘曲线，人类记忆随时间指数衰减的心理学规律。MemX 据此设计记忆半衰期。',
    en: 'Ebbinghaus Forgetting Curve',
    tags: ['memx'],
  },
  'Cosine Similarity': {
    zh: '余弦相似度，衡量两个向量方向的相似程度，值域 [-1, 1]。MemX 用它判断知识是否重复（>=0.8 自动合并）。',
    en: 'Cosine Similarity',
    tags: ['memx'],
  },
  'Knowledge Distillation': {
    zh: '知识蒸馏，从大量对话中提取精炼的、可复用的知识条目。MemX 的 Reflector 引擎自动完成此过程。',
    en: 'Knowledge Distillation',
    tags: ['memx'],
  },
  'Ontology': {
    zh: '本体论，用树状结构描述领域知识（用户故事 / 架构 / 技术栈 / 规范）。Forge 的核心数据模型。',
    en: 'Ontology',
    tags: ['memx', 'general'],
  },

  // ─── Lucrum ──────────────────────────────────────────────
  'Backtest': {
    zh: '回测，使用历史行情数据模拟策略交易，评估策略在过去市场环境中的表现。',
    en: '回测 (Backtest)',
    tags: ['lucrum'],
  },
  'Sharpe Ratio': {
    zh: '夏普比率，每承受一单位风险获得的超额收益。> 1.0 优秀，> 2.0 杰出。',
    en: '夏普比率 (Sharpe Ratio)',
    tags: ['lucrum'],
  },
  'Max Drawdown': {
    zh: '最大回撤，从历史最高点到最低谷的最大跌幅百分比。< 20% 可接受，< 10% 优秀。',
    en: '最大回撤 (Max Drawdown)',
    tags: ['lucrum'],
  },
  'Stop Loss': {
    zh: '止损，预设的亏损阈值，触及后自动平仓以控制损失。是风控的基本手段。',
    en: '止损 (Stop Loss)',
    tags: ['lucrum'],
  },
  'Adjustment': {
    zh: '复权，对股票历史价格进行分红/送股调整，使不同时期的价格具有可比性。分为前复权和后复权。',
    en: '复权 (Price Adjustment)',
    tags: ['lucrum'],
  },
  'Round Lot': {
    zh: '整手/手，A 股的最小交易单位，1 手 = 100 股。买入必须是整手的整数倍。',
    en: '手 (Round Lot)',
    tags: ['lucrum'],
  },
  'Commission': {
    zh: '佣金，券商对每笔交易收取的手续费。A 股一般万分之三左右，有最低 5 元限制。',
    en: '佣金 (Commission)',
    tags: ['lucrum'],
  },
  'Stamp Duty': {
    zh: '印花税，卖出股票时国家征收的税费。A 股当前税率为成交金额的万分之五。',
    en: '印花税 (Stamp Duty)',
    tags: ['lucrum'],
  },
  'Slippage': {
    zh: '滑点，预期成交价与实际成交价的差异。大资金或流动性差的标的滑点更明显。',
    en: '滑点 (Slippage)',
    tags: ['lucrum'],
  },
  'Win Rate': {
    zh: '胜率，盈利交易占总交易次数的比例。> 50% 基本，> 60% 良好。',
    en: '胜率 (Win Rate)',
    tags: ['lucrum'],
  },
  'Sortino': {
    zh: 'Sortino 比率，类似夏普比率但只考虑下行波动（亏损风险），更能反映投资者真实体验。',
    en: 'Sortino Ratio',
    tags: ['lucrum'],
  },
  'Calmar': {
    zh: 'Calmar 比率，年化收益率 / 最大回撤。> 1.0 表示收益能覆盖最大回撤。',
    en: 'Calmar Ratio',
    tags: ['lucrum'],
  },
  'Decimal.js': {
    zh: 'JavaScript 任意精度十进制运算库，Lucrum 用它消除金融计算中的浮点误差。',
    tags: ['lucrum'],
  },
  'CtaTemplate': {
    zh: 'vnpy 的策略模板基类，定义标准的 on_bar / on_tick / on_trade 等生命周期钩子。',
    tags: ['lucrum'],
  },
  'vnpy': {
    zh: 'Python 量化交易开源框架，Lucrum AI 生成的策略代码基于 vnpy CtaTemplate。',
    tags: ['lucrum'],
  },
  '鹿贝': {
    zh: 'Lurus 平台的统一计费单位（luboi）。所有产品消费以鹿贝扣费，1 鹿贝 = 1 美分等值。',
    tags: ['lucrum', 'general'],
  },

  // ─── Switch ──────────────────────────────────────────────
  'MCP Server': {
    zh: '实现了 MCP 协议的工具服务进程，向 AI Agent 暴露可调用的工具能力（如 GitHub、数据库等）。',
    see: '/kova/concepts#mcp-工具',
    tags: ['switch', 'kova'],
  },
  'Provider': {
    zh: '模型提供商，如 Lurus API、OpenAI、Anthropic、Ollama。Switch 支持配置多个 Provider 并按规则路由。',
    tags: ['switch'],
  },
  'CLAUDE.md': {
    zh: '放置在项目根目录的指令文件，AI 编程工具读取它来理解项目上下文、编码规范和工作流程。',
    tags: ['switch'],
  },
  'Proxy': {
    zh: '代理，Switch 在本地启动的 OpenAI 兼容 API 端点，将请求按路由规则转发到不同 Provider。',
    tags: ['switch'],
  },

  // ─── 加密 / 合规 ──────────────────────────────────────────
  'SM4-GCM': {
    zh: '国密 SM4 分组密码 + GCM 认证加密模式，国产密码合规场景下对称加密首选。',
    en: 'GM/T SM4-GCM',
    tags: ['auth', 'general'],
  },
  'TCO': {
    zh: '总拥有成本（Total Cost of Ownership），采购决策中涵盖授权 / 部署 / 运维 / 迁移 的全链路成本。',
    en: 'Total Cost of Ownership',
    tags: ['general'],
  },

  // ─── Lumen ───────────────────────────────────────────────
  'Whisper': {
    zh: 'OpenAI 开源的语音识别模型，Creator / Lumen 用它做音频转写。',
    tags: ['lumen', 'general'],
  },
  'Dependency Guardian': {
    zh: 'Forge 规划中的依赖关系哨兵，自动检测跨 Epic / Story 的接口破坏。',
    tags: ['lumen'],
  },
  'Session': {
    zh: 'Forge 中一次产品讨论的上下文容器，承载对话、决策、Agent 产出的完整时间线。',
    tags: ['lumen', 'memx'],
  },
}

// Default export for `.data.ts` loader pattern
export default {
  watch: ['./glossary.data.ts'],
  load() {
    return glossary
  },
}
