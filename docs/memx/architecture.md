---
title: MemX 架构设计
description: MemX 的组成、写入与检索数据流、存储与嵌入默认值、部署形态。
---

<div class="memx-page">

# 架构设计

MemX 是一个 Rust 工作区：一套核心引擎，对外提供命令行、REST 接口、MCP 服务，以及 Python / Node.js / C FFI 绑定。成熟度：早期试点。

<ArchitectureDiagram title="MemX 组成" chart="graph TB
  Surfaces[命令行 memorus-r · 语言绑定]
  Server[memorus-server<br/>REST · MCP · daemon]
  Surfaces --> Core[Memory API]
  Server --> Core
  Core --> Ingest[写入：脱敏 → 抽取 → 去重]
  Core --> Search[检索：四层打分 → 核验 → 召回回升]
  Ingest --> Store[(存储<br/>默认 SQLite)]
  Search --> Store" />

## 组成

| 模块 | 作用 |
|------|------|
| `memorus-core` | 记忆引擎：配置、存储接口、租户、变更历史 |
| `memorus-ace` | Reflector / Curator / Decay / Generator 与脱敏 |
| `memorus-providers` | 向量库、嵌入、模型、重排序等后端适配 |
| `memorus-server` | REST 接口、MCP 服务、daemon（二进制 `memorus-server`） |
| `memorus-cli` | 本地管理命令行（二进制 `memorus-r`） |
| `memorus-bindings-*`、`memorus-ffi` | Python / Node.js / WASM 绑定与 C FFI；WASM 绑定是另一套独立实现 |

## 写入

ACE 开启时（默认），一次写入依次经过：

1. **脱敏** — 13 层内置规则 + 配置中的自定义正则。这一步失败时整条写入不落库。
2. **抽取（Reflector）** — 识别 → 评分 → 候选脱敏 → 提炼。
3. **去重（Curator）** — 新增、合并或跳过；标记冲突；同一事实出现新值时取代旧记忆。
4. **持久化** — 写入存储；新增、修改、删除都记入变更历史，可按条查询（REST：`GET /api/v1/memories/{id}/history`）。

写入时显式带了源文件锚点的记忆不走抽取，但仍先经过同一套脱敏。ACE 关闭时写入不经脱敏。

## 检索

1. 从存储取回一批候选。
2. **四层打分** — 精确关键词、词干模糊、元数据、语义相似度，融合后乘以衰减、时效、作用域因子（见 [核心概念](/memx/concepts)）。
3. **核验** — 带锚点的记忆重新核对源文件，附上核验状态；陈旧记忆默认只标注。
4. **召回回升** — 命中记忆的召回次数加一，影响后续衰减。

## 存储与嵌入的默认值

- 服务端默认构建只链接 SQLite 存储；未设路径时为内存态。其他向量库后端需在构建时显式开启。
- 零配置默认使用确定性的哈希向量，不携带语义；此时语义层实际不起作用，检索主要靠关键词层。要做语义检索，需要配置嵌入服务，或以 `onnx-embedding` 构建选项开启本地嵌入。
- 配置文件位于 `~/.memorus-r/config.toml`，各项归到 `[memory]` / `[ace]` 等表下。

## 服务端

`memorus-server` 有三个子命令：

| 子命令 | 说明 |
|------|------|
| `serve` | REST 接口（`/api/v1/*`、`/health`），同时在 `POST /mcp` 提供 HTTP 形式的 MCP 端点（仅单租户部署可用） |
| `mcp` | 本地 stdio 形式的 MCP 服务 |
| `daemon` | 后台进程 |

鉴权与租户：

- `serve` 在非本机地址上启动时必须配置 API 密钥（`--api-key` 或 `MEMORUS_API_KEY`），否则拒绝启动。请求头用 `Authorization: Bearer <key>` 或 `X-API-Key: <key>`。
- 可选按密钥区分租户（默认关闭）；提供按用户擦除数据的接口 `POST /api/v1/users/{user_id}/erase`。

## 部署形态

有面向客户环境的 Docker Compose 部署包：一个应用容器加一个一次性初始化容器，内置 SQLite 存储，不依赖我们这边的任何基础设施。镜像可随交付以离线包提供，并附 SHA256 校验和；没有离线包时从源码构建。

## 配置示例

```toml
[ace]
enabled = true

[ace.reflector]
mode = "rules"        # rules（默认）| hybrid | llm
min_score = 30.0

[ace.curator]
dedup_threshold = 0.9

[ace.decay]
half_life = 30.0
boost_factor = 0.1
protection_days = 7.0
permanent_threshold = 15

[ace.retrieval]
token_budget = 4096
scope_boost = 1.5

[ace.verification]
policy = "flag"       # flag（默认）| demote | drop

[privacy]
redaction_patterns = ['INTERNAL_KEY_\w+']
```

---

<NextSteps
  title="下一步"
  :steps="[
    { text: '核心概念 — 各阶段的规则与默认值', link: '/memx/concepts', primary: true },
    { text: '快速开始', link: '/memx/quickstart' },
    { text: '常见问题', link: '/memx/faq' },
  ]"
/>

</div>
