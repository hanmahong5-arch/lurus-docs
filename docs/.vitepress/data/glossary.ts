/**
 * Glossary data for <Term> component.
 * Each entry: zh (Chinese definition), en (optional English), see (optional link).
 * Keep definitions <= 2 sentences, targeted at each product's audience level.
 */

export interface GlossaryEntry {
  zh: string
  en?: string
  see?: string
}

export const glossary: Record<string, GlossaryEntry> = {
  // ─── General (~10) ───────────────────────────────────────
  'API Key': {
    zh: '访问 API 的密钥凭证，类似于密码。每个 Key 可独立设置配额和权限。',
    see: '/guide/get-api-key',
  },
  'Bearer Token': {
    zh: '一种 HTTP 认证方式，在请求头中以 "Bearer sk-xxx" 格式携带凭证。',
    en: 'An HTTP auth scheme that sends credentials in the Authorization header.',
  },
  'Rate Limit': {
    zh: '速率限制，API 对单位时间内请求次数的上限控制，防止滥用和过载。',
  },
  'Streaming': {
    zh: '流式响应，AI 模型逐 Token 返回结果（而非等全部生成完），降低首字延迟。',
    en: 'Server-Sent Events streaming',
  },
  'Token': {
    zh: 'LLM 处理文本的最小单位。中文约 1.5 字符/token，英文约 4 字符/token。',
  },
  'Webhook': {
    zh: '服务端主动向你指定的 URL 推送事件通知，如支付成功、订阅到期等。',
    en: 'Webhook — server-to-server event notification',
  },
  'OIDC': {
    zh: 'OpenID Connect，基于 OAuth 2.0 的身份认证标准，Lurus 使用 Zitadel 实现。',
    en: 'OpenID Connect',
  },
  'SDK': {
    zh: '软件开发工具包，提供封装好的函数和类，简化 API 调用。Lurus 兼容 OpenAI SDK。',
    en: 'Software Development Kit',
  },
  'Endpoint': {
    zh: 'API 端点，一个可调用的 URL 路径，如 /v1/chat/completions。',
    en: 'API Endpoint',
  },
  'Base URL': {
    zh: 'API 的根地址。Lurus 的 Base URL 是 https://api.lurus.cn/v1。',
  },

  // ─── Kova (~12) ──────────────────────────────────────────
  'WAL': {
    zh: 'Write-Ahead Log，预写日志。所有状态变更先写日志再执行，确保崩溃后可从日志恢复。源自数据库领域的经典技术。',
    en: 'Write-Ahead Log',
    see: '/kova/concepts#wal-write-ahead-log',
  },
  'Checkpoint': {
    zh: '检查点，将内存中的完整状态快照写入磁盘。崩溃恢复时从最近的 Checkpoint 开始重放 WAL，而非从头开始。',
  },
  'Agent Loop': {
    zh: 'Agent 决策循环：接收输入 → LLM 推理 → 调用工具 → 获取结果 → 继续推理，直到生成最终回答。',
  },
  'Durable Execution': {
    zh: '持久化执行，任务状态持续写入 WAL，进程崩溃后自动从中断点恢复，不重复调用 LLM。',
    en: 'Durable Execution',
  },
  'MCP': {
    zh: 'Model Context Protocol，模型上下文协议。一种开放标准，让 AI Agent 以统一方式调用外部工具和数据源。',
    en: 'Model Context Protocol',
    see: '/kova/concepts#mcp-工具',
  },
  'A2A': {
    zh: 'Agent-to-Agent 协议，让多个 Agent 直接通信、委派任务和交换信息。',
    en: 'Agent-to-Agent Protocol',
  },
  'Swarm': {
    zh: '群体智能模式，多个 Agent 由协调者分配任务并自主协作，无需预定义固定流程。',
    see: '/kova/concepts#swarm-群体智能',
  },
  'Ring Buffer': {
    zh: '环形缓冲区，固定大小的循环存储结构。写指针到达末尾时回绕覆盖旧数据，WAL 使用 power-of-2 大小的环形缓冲。',
    en: 'Ring Buffer',
  },
  'CRC32': {
    zh: '循环冗余校验算法，用于检测数据传输或存储中的错误。Kova 的每条 WAL 记录都包含 CRC32 校验和。',
    en: 'Cyclic Redundancy Check (32-bit)',
  },
  'FIFO': {
    zh: 'First In, First Out，先进先出队列。Kova 的任务调度默认使用 FIFO 策略。',
    en: 'First In, First Out',
  },
  'System Prompt': {
    zh: '系统提示词，定义 AI 的角色、能力边界和行为规范。放在消息数组的第一条。',
  },
  'Tool Call': {
    zh: 'AI 模型在推理过程中决定调用外部工具（如搜索、数据库查询），并返回结构化的调用参数。',
  },

  // ─── MemX (~10) ──────────────────────────────────────────
  'ACE': {
    zh: 'Adaptive Context Engine，自适应上下文引擎。MemX 的核心智能层，包含知识蒸馏、去重、衰减和检索四大模块。',
    en: 'Adaptive Context Engine',
    see: '/memx/concepts',
  },
  'Embedding': {
    zh: '嵌入向量，将文本转换为高维数值向量，使语义相似的文本在向量空间中距离相近。MemX 使用本地 ONNX 模型生成。',
    en: 'Text Embedding',
  },
  'Vector Search': {
    zh: '向量搜索，通过计算查询文本与存储文本的嵌入向量距离，找到语义最相关的结果。',
    en: 'Vector Similarity Search',
  },
  'Semantic Dedup': {
    zh: '语义去重，通过余弦相似度自动识别和合并含义相同但表述不同的知识条目。',
    en: 'Semantic Deduplication',
  },
  'PII': {
    zh: '个人可识别信息，如 API Key、密码、私钥等敏感数据。MemX 内置 12 种不可绕过的 PII 过滤规则。',
    en: 'Personally Identifiable Information',
  },
  'Reflector': {
    zh: 'MemX 的知识蒸馏引擎，通过规则预筛 + LLM 精炼从对话中自动提取高价值知识。',
    see: '/memx/concepts#reflector-—-知识蒸馏引擎',
  },
  'Curator': {
    zh: 'MemX 的语义去重引擎，在每次写入时通过余弦相似度自动合并重复知识、检测矛盾。',
    see: '/memx/concepts#curator-—-语义去重引擎',
  },
  'Decay': {
    zh: '记忆衰减，模拟人类遗忘曲线。不被检索的知识逐步降低权重，经常被检索的知识越来越牢固。',
    see: '/memx/concepts#decay-—-时间衰减引擎',
  },
  'Cosine Similarity': {
    zh: '余弦相似度，衡量两个向量方向的相似程度，值域 [-1, 1]。MemX 用它判断知识是否重复（>=0.8 自动合并）。',
    en: 'Cosine Similarity',
  },
  'Knowledge Distillation': {
    zh: '知识蒸馏，从大量对话中提取精炼的、可复用的知识条目。MemX 的 Reflector 引擎自动完成此过程。',
    en: 'Knowledge Distillation',
  },

  // ─── Lucrum (~12) ────────────────────────────────────────
  'Backtest': {
    zh: '回测，使用历史行情数据模拟策略交易，评估策略在过去市场环境中的表现。',
    en: '回测 (Backtest)',
  },
  'Sharpe Ratio': {
    zh: '夏普比率，每承受一单位风险获得的超额收益。> 1.0 优秀，> 2.0 杰出。',
    en: '夏普比率 (Sharpe Ratio)',
  },
  'Max Drawdown': {
    zh: '最大回撤，从历史最高点到最低谷的最大跌幅百分比。< 20% 可接受，< 10% 优秀。',
    en: '最大回撤 (Max Drawdown)',
  },
  'Stop Loss': {
    zh: '止损，预设的亏损阈值，触及后自动平仓以控制损失。是风控的基本手段。',
    en: '止损 (Stop Loss)',
  },
  'Adjustment': {
    zh: '复权，对股票历史价格进行分红/送股调整，使不同时期的价格具有可比性。分为前复权和后复权。',
    en: '复权 (Price Adjustment)',
  },
  'Round Lot': {
    zh: '整手/手，A 股的最小交易单位，1 手 = 100 股。买入必须是整手的整数倍。',
    en: '手 (Round Lot)',
  },
  'Commission': {
    zh: '佣金，券商对每笔交易收取的手续费。A 股一般万分之三左右，有最低 5 元限制。',
    en: '佣金 (Commission)',
  },
  'Stamp Duty': {
    zh: '印花税，卖出股票时国家征收的税费。A 股当前税率为成交金额的万分之五。',
    en: '印花税 (Stamp Duty)',
  },
  'Slippage': {
    zh: '滑点，预期成交价与实际成交价的差异。大资金或流动性差的标的滑点更明显。',
    en: '滑点 (Slippage)',
  },
  'Win Rate': {
    zh: '胜率，盈利交易占总交易次数的比例。> 50% 基本，> 60% 良好。',
    en: '胜率 (Win Rate)',
  },
  'Sortino': {
    zh: 'Sortino 比率，类似夏普比率但只考虑下行波动（亏损风险），更能反映投资者真实体验。',
    en: 'Sortino Ratio',
  },
  'Calmar': {
    zh: 'Calmar 比率，年化收益率 / 最大回撤。> 1.0 表示收益能覆盖最大回撤。',
    en: 'Calmar Ratio',
  },

  // ─── Switch (~4) ─────────────────────────────────────────
  'MCP Server': {
    zh: '实现了 MCP 协议的工具服务进程，向 AI Agent 暴露可调用的工具能力（如 GitHub、数据库等）。',
    see: '/kova/concepts#mcp-工具',
  },
  'Provider': {
    zh: '模型提供商，如 Lurus API、OpenAI、Anthropic、Ollama。Switch 支持配置多个 Provider 并按规则路由。',
  },
  'CLAUDE.md': {
    zh: '放置在项目根目录的指令文件，AI 编程工具读取它来理解项目上下文、编码规范和工作流程。',
  },
  'Proxy': {
    zh: '代理，Switch 在本地启动的 OpenAI 兼容 API 端点，将请求按路由规则转发到不同 Provider。',
  },
}
