import{_ as a,c as n,o as i,ag as p}from"./chunks/framework.dvv-DFtf.js";const c=JSON.parse('{"title":"架构设计","description":"","frontmatter":{},"headers":[],"relativePath":"memx/architecture.md","filePath":"memx/architecture.md","lastUpdated":1772252630000}'),t={name:"memx/architecture.md"};function l(e,s,h,k,r,d){return i(),n("div",null,[...s[0]||(s[0]=[p(`<div style="display:none;" hidden="true" aria-hidden="true">Are you an LLM? You can read better optimized documentation at /memx\\architecture.md for this page in Markdown format</div><h1 id="架构设计" tabindex="-1">架构设计 <a class="header-anchor" href="#架构设计" aria-label="Permalink to &quot;架构设计&quot;">​</a></h1><p>MemX 采用管道（Pipeline）架构，写入和检索分别由独立管道编排，所有组件支持独立失败和优雅降级。</p><h2 id="系统总览" tabindex="-1">系统总览 <a class="header-anchor" href="#系统总览" aria-label="Permalink to &quot;系统总览&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>┌─────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                       MemX Memory API                          │</span></span>
<span class="line"><span>│  add() / search() / status() / detect_conflicts() / export()  │</span></span>
<span class="line"><span>└────────────┬──────────────────────────────┬────────────────────┘</span></span>
<span class="line"><span>             │                              │</span></span>
<span class="line"><span>    ┌────────▼─────────┐          ┌────────▼──────────┐</span></span>
<span class="line"><span>    │  IngestPipeline  │          │ RetrievalPipeline  │</span></span>
<span class="line"><span>    │  (写入管道)       │          │  (检索管道)        │</span></span>
<span class="line"><span>    └────────┬─────────┘          └────────┬──────────┘</span></span>
<span class="line"><span>             │                              │</span></span>
<span class="line"><span>    ┌────────▼─────────┐          ┌────────▼──────────┐</span></span>
<span class="line"><span>    │ Privacy Sanitizer │          │ Generator (L1-L4) │</span></span>
<span class="line"><span>    │ Reflector         │          │ ScoreMerger       │</span></span>
<span class="line"><span>    │ Curator           │          │ TokenBudgetTrimmer│</span></span>
<span class="line"><span>    │ mem0.add()        │          │ RecallReinforcer  │</span></span>
<span class="line"><span>    └──────────────────┘          └───────────────────┘</span></span>
<span class="line"><span>             │                              │</span></span>
<span class="line"><span>             └──────────┬───────────────────┘</span></span>
<span class="line"><span>                        │</span></span>
<span class="line"><span>              ┌─────────▼────────┐</span></span>
<span class="line"><span>              │  Decay Engine    │</span></span>
<span class="line"><span>              │  (异步衰减计算)   │</span></span>
<span class="line"><span>              └─────────┬────────┘</span></span>
<span class="line"><span>                        │</span></span>
<span class="line"><span>              ┌─────────▼────────┐</span></span>
<span class="line"><span>              │  Vector Store    │</span></span>
<span class="line"><span>              │  (mem0 Backend)  │</span></span>
<span class="line"><span>              └──────────────────┘</span></span></code></pre></div><h2 id="写入管道-—-ingestpipeline" tabindex="-1">写入管道 — IngestPipeline <a class="header-anchor" href="#写入管道-—-ingestpipeline" aria-label="Permalink to &quot;写入管道 — IngestPipeline&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Raw Input</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span>┌─────────────────────┐</span></span>
<span class="line"><span>│  Privacy Sanitizer   │  ← 12 种内置 PII 规则 + 自定义正则</span></span>
<span class="line"><span>│  (不可绕过)           │     净化器永不抛异常</span></span>
<span class="line"><span>└─────────┬───────────┘</span></span>
<span class="line"><span>          ▼</span></span>
<span class="line"><span>┌─────────────────────┐</span></span>
<span class="line"><span>│  Reflector           │  ← hybrid 模式：规则预筛 + LLM 精炼</span></span>
<span class="line"><span>│  ├─ PatternDetector  │     5 种模式检测</span></span>
<span class="line"><span>│  ├─ KnowledgeScorer  │     评分 + 分类</span></span>
<span class="line"><span>│  ├─ PrivacySanitizer │     候选知识脱敏</span></span>
<span class="line"><span>│  └─ BulletDistiller  │     压缩为精炼知识条目</span></span>
<span class="line"><span>│                      │     失败时 → 回退到原始 add</span></span>
<span class="line"><span>└─────────┬───────────┘</span></span>
<span class="line"><span>          ▼</span></span>
<span class="line"><span>┌─────────────────────┐</span></span>
<span class="line"><span>│  Curator             │  ← 余弦相似度去重</span></span>
<span class="line"><span>│  ├─ ≥ 0.8: 合并     │     merge_content / keep_best</span></span>
<span class="line"><span>│  ├─ 0.5-0.8: 标记   │     潜在冲突</span></span>
<span class="line"><span>│  └─ &lt; 0.5: 通过     │     独立知识</span></span>
<span class="line"><span>│                      │     失败时 → 跳过去重，直接写入</span></span>
<span class="line"><span>└─────────┬───────────┘</span></span>
<span class="line"><span>          ▼</span></span>
<span class="line"><span>┌─────────────────────┐</span></span>
<span class="line"><span>│  BulletFactory       │  ← 元数据格式转换</span></span>
<span class="line"><span>│  mem0.add()          │     持久化到向量数据库</span></span>
<span class="line"><span>└─────────────────────┘</span></span></code></pre></div><h3 id="写入管道的降级路径" tabindex="-1">写入管道的降级路径 <a class="header-anchor" href="#写入管道的降级路径" aria-label="Permalink to &quot;写入管道的降级路径&quot;">​</a></h3><p>每个阶段都有独立的错误处理：</p><table tabindex="0"><thead><tr><th>阶段</th><th>失败行为</th><th>数据影响</th></tr></thead><tbody><tr><td>Privacy Sanitizer</td><td>永不失败（内部 try-catch）</td><td>原始数据通过</td></tr><tr><td>Reflector</td><td>回退到原始 <code>mem0.add()</code></td><td>知识不经提炼直接存储</td></tr><tr><td>Curator</td><td>跳过去重</td><td>可能产生重复条目</td></tr><tr><td>mem0.add</td><td>抛出异常</td><td>写入失败</td></tr></tbody></table><h2 id="检索管道-—-retrievalpipeline" tabindex="-1">检索管道 — RetrievalPipeline <a class="header-anchor" href="#检索管道-—-retrievalpipeline" aria-label="Permalink to &quot;检索管道 — RetrievalPipeline&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Query</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span>┌─────────────────────────┐</span></span>
<span class="line"><span>│  Generator Engine        │</span></span>
<span class="line"><span>│  ├─ L1: ExactMatcher     │  精确词匹配</span></span>
<span class="line"><span>│  ├─ L2: FuzzyMatcher     │  模糊 Token 匹配</span></span>
<span class="line"><span>│  ├─ L3: MetadataMatcher  │  元数据 Jaccard 相似度</span></span>
<span class="line"><span>│  └─ L4: VectorSearcher   │  向量语义搜索</span></span>
<span class="line"><span>│                          │  L4 失败 → 纯关键词模式</span></span>
<span class="line"><span>└─────────┬───────────────┘</span></span>
<span class="line"><span>          ▼</span></span>
<span class="line"><span>┌─────────────────────────┐</span></span>
<span class="line"><span>│  ScoreMerger             │  ← 加权融合</span></span>
<span class="line"><span>│  NormKW = (L1+L2+L3)/35 │</span></span>
<span class="line"><span>│  Blended = KW×0.6+S×0.4 │</span></span>
<span class="line"><span>│  Final = B×Decay×Recent  │</span></span>
<span class="line"><span>│          ×Scope          │</span></span>
<span class="line"><span>└─────────┬───────────────┘</span></span>
<span class="line"><span>          ▼</span></span>
<span class="line"><span>┌─────────────────────────┐</span></span>
<span class="line"><span>│  TokenBudgetTrimmer      │  ← 双重约束</span></span>
<span class="line"><span>│  max_results: 5          │     CJK 感知 Token 估算</span></span>
<span class="line"><span>│  token_budget: 2000      │</span></span>
<span class="line"><span>└─────────┬───────────────┘</span></span>
<span class="line"><span>          │</span></span>
<span class="line"><span>          ├──→ 返回结果给调用方</span></span>
<span class="line"><span>          │</span></span>
<span class="line"><span>          └──→ RecallReinforcer（异步）</span></span>
<span class="line"><span>               递增被命中记忆的 recall_count</span></span>
<span class="line"><span>               不阻塞搜索响应</span></span></code></pre></div><h2 id="数据模型" tabindex="-1">数据模型 <a class="header-anchor" href="#数据模型" aria-label="Permalink to &quot;数据模型&quot;">​</a></h2><p>每条记忆（Bullet）携带的完整元数据：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;id&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;mem_a1b2c3d4&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;content&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;pytest 超时问题：使用 -x --timeout=30 逐个运行&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;section&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;DEBUGGING&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;knowledge_type&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;TRICK&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;instructivity_score&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">78</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;source_type&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;INTERACTION&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Decay tracking</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;recall_count&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;decay_weight&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.89</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;created_at&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2026-02-20T10:30:00Z&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;last_recalled_at&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2026-02-27T15:00:00Z&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Taxonomy</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;related_tools&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;pytest&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;key_entities&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;timeout&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;test-isolation&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;tags&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;python&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;testing&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;scope&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;project:my-backend&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="本地嵌入" tabindex="-1">本地嵌入 <a class="header-anchor" href="#本地嵌入" aria-label="Permalink to &quot;本地嵌入&quot;">​</a></h2><p>MemX 使用 ONNX Runtime 在本地运行嵌入模型，无需外部 API：</p><table tabindex="0"><thead><tr><th>属性</th><th>值</th></tr></thead><tbody><tr><td>模型</td><td>all-MiniLM-L6-v2</td></tr><tr><td>维度</td><td>384</td></tr><tr><td>运行时</td><td>ONNX Runtime</td></tr><tr><td>存储位置</td><td><code>~/.memx/models/</code></td></tr><tr><td>首次下载</td><td>约 90MB</td></tr><tr><td>推理速度</td><td>&lt; 5ms / 条</td></tr></tbody></table><p>完全离线运行，无隐私泄露风险。</p><h2 id="守护进程模式" tabindex="-1">守护进程模式 <a class="header-anchor" href="#守护进程模式" aria-label="Permalink to &quot;守护进程模式&quot;">​</a></h2><p>可选的后台守护进程，支持多 Agent / 多进程共享同一个知识库：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Agent A ──→ ┐</span></span>
<span class="line"><span>             │</span></span>
<span class="line"><span>Agent B ──→ ├──→ MemX Daemon (IPC Socket) ──→ Vector Store</span></span>
<span class="line"><span>             │</span></span>
<span class="line"><span>Agent C ──→ ┘</span></span></code></pre></div><ul><li>通过 IPC Socket 通信，避免数据库连接竞争</li><li>空闲超时自动退出（默认 300 秒）</li><li>适用于 IDE 插件、多窗口等场景</li></ul><h2 id="配置参考" tabindex="-1">配置参考 <a class="header-anchor" href="#配置参考" aria-label="Permalink to &quot;配置参考&quot;">​</a></h2><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> memx </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Memory</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">m </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Memory(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">config</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # ACE Engine</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;ace_enabled&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">True</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Reflector — hybrid mode: rule pre-filter + LLM refinement</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;reflector&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;mode&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;hybrid&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,       </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># &quot;rules&quot; | &quot;hybrid&quot;(default) | &quot;llm&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;min_score&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">30.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,      </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># minimum knowledge score threshold</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;llm_model&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;openai/gpt-4o-mini&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Curator — semantic deduplication</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;curator&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;similarity_threshold&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,    </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># auto-merge threshold</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;merge_strategy&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;keep_best&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># &quot;keep_best&quot; or &quot;merge_content&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Decay — bionic forgetting curve</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;decay&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;half_life_days&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">30.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,         </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># days to decay to 50%</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;boost_factor&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,            </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># recall reinforcement coefficient</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;permanent_threshold&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">15</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,      </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># min recalls for permanent memory</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Retrieval — hybrid 4-layer search</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;retrieval&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;keyword_weight&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.6</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;semantic_weight&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;max_results&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;token_budget&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Privacy — PII filtering</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;privacy&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &quot;custom_patterns&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            r</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;">INTERNAL_KEY_</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\w</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div>`,25)])])}const o=a(t,[["render",l]]);export{c as __pageData,o as default};
