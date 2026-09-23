---
title: MemX 快速开始
description: 部署 MemX 服务，写入并检索第一条记忆。
---

<div class="memx-qs">

# 快速开始

部署 → 写入 → 检索。MemX 目前处于早期试点，未发布到公共包仓库；部署包与源码随交付提供。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前置条件</p>
    <div class="lurus-callout__body"><p>Docker Engine 与 Docker Compose v2。使用随交付提供的离线镜像包时不需要外网，也不需要 Rust 工具链。</p></div>
  </div>
</div>

<ol class="lurus-steps">

<li>

**准备配置**

在交付的源码根目录执行：

```bash
cp deploy/customer/.env.customer.example deploy/customer/.env
openssl rand -hex 32   # 生成一个密钥，填入 .env 的 MEMORUS_API_KEY=
```

服务在非本机地址上启动时必须配置 API 密钥，否则拒绝启动。

</li>

<li>

**加载镜像并启动**

```bash
sha256sum -c SHA256SUMS                       # 校验离线镜像包
docker load -i memorus-image-<version>.tar    # 记下输出的镜像标签，填入 .env 的 MEMORUS_IMAGE=
docker compose -f deploy/customer/docker-compose.customer.yml \
  --env-file deploy/customer/.env up -d
curl -i http://localhost:8880/health
```

没有离线镜像包时，可以从源码构建，步骤见交付包内的 `deploy/customer/INSTALL.md`。

</li>

<li>

**写入与检索**

:::tabs
== REST

```bash
# 写入
curl -X POST http://localhost:8880/api/v1/memories \
  -H "Authorization: Bearer $MEMORUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"content":"部署前必须运行 go test -race ./...","user_id":"dev1","scope":"project:backend"}'

# 检索
curl "http://localhost:8880/api/v1/memories/search?query=部署前检查&user_id=dev1&limit=5" \
  -H "Authorization: Bearer $MEMORUS_API_KEY"
```

检索结果包含每条记忆的总分；带锚点的记忆还会附上核验状态。

== 命令行

```bash
memorus-r learn "部署前必须运行 go test -race ./..." --user-id dev1
memorus-r search "部署前检查" --limit 10 --threshold 0.3
```

== MCP

MemX 以 MCP 服务的形式把记忆操作暴露为工具，共 9 个：`search_memory`、`add_memory`、`list_memories`、`forget_memory`、`memory_status`、`detect_conflicts`、`run_decay_sweep`、`export_memories`、`import_memories`。

- 本地：`memorus-server mcp`（stdio）。
- 服务端：`serve` 启动后的 `POST /mcp` 端点，目前仅支持单租户部署。
:::

</li>

</ol>

## 命令行常用子命令

```bash
memorus-r status                      # 知识库统计
memorus-r search "查询"               # 检索
memorus-r learn "一条经验"            # 手动写入
memorus-r list --limit 20             # 列出记忆
memorus-r forget <memory-id>          # 删除
memorus-r sweep                       # 触发衰减清理
memorus-r conflicts                   # 查看互相矛盾的记忆
memorus-r verify --stale-only         # 核对带锚点的记忆
memorus-r export --format json -o knowledge.json
memorus-r import -i knowledge.json
```

## 注意

- 零配置默认使用确定性的哈希向量，不是真实的语义嵌入；要做语义检索，需要配置嵌入服务。
- 目前经服务接口写入的记忆还没有来源记录。

## 下一步

<NextSteps
  :steps="[
    { text: '核心概念 — 抽取、去重、衰减、检索', link: '/memx/concepts', primary: true },
    { text: '架构设计 — 写入与检索的数据流', link: '/memx/architecture' },
    { text: '常见问题', link: '/memx/faq' },
  ]"
/>

</div>
