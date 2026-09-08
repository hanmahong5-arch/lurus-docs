[English](./README.md)

# Lurus Docs (2l-bs-docs)

Lurus 平台的文档站与内部知识库，服务对象是接入 Lurus 各产品线的外部开发者，以及运维这套站点的工程师。

Lurus Docs 是一个 VitePress 静态站（对外，`docs.lurus.cn`），覆盖 Lurus 全部产品线——API、Kova、MemX、Lucrum、Switch、Creator、Lumen、Forge、Platform（`docs/`）——并配了一个 Bun + Hono 运行时服务端，负责托管构建产物，另外暴露一套自建更新日志的 JSON API。仓内还有第二个、完全独立的 VitePress 构建（`internal/`），是仅供内部使用的知识库（ADR、各服务器运维手册、产品状态看板），**不在**对外站的构建流程里，需要单独构建和验证。

成熟度：已在生产环境实跑（R1 Kubernetes，命名空间 `lurus-system`，见 `deploy/k8s.yaml`），且每次 CI 部署都会给自己的更新日志写一条记录。内部站的 OIDC 登录方案（`deploy/internal-oidc/`）设计已完整，但**从未上线**——生产环境目前仍是纯 HTTP Basic Auth（细节见该目录自己的 README）。本仓没有自动化测试套件（见下方「快速开始」）。

## 核心能力

- **多语言产品文档** —— 站点根路径是 `zh-CN`，`en`/`ja`/`ko`/`es`/`fr` 译文放在 `docs/<locale>/` 下；用一份路由白名单控制，只有真正译完的页面才会出现在语言切换器里（`docs/.vitepress/config.ts:11-43`）。
- **从真源同步的 API 参考** —— `bun run sync` 会从相邻仓库的 OpenAPI spec 重新生成 `docs/api/overview.md` / `docs/api/schemas.md` 里的端点列表和字段表，并从 `data/models.yaml` 重新生成模型目录（`scripts/sync.ts`）。
- **自建更新日志 / 动态 feed** —— 用 `bun:sqlite` 存产品与更新记录，配一套 admin CRUD API、一套公开只读 API 和一个 RSS feed 生成器（`server/db.ts`、`server/routes/{public,admin}.ts`、`scripts/gen-feed.ts`）。
- **CI 自报送** —— 每次生产部署都会给自己的更新日志签名并回调一条记录（`.github/workflows/deploy.yml:108-121`、`server/routes/webhook.ts`）。
- **独立的内部知识库** —— ADR、逐服务器运维手册、实时看板，有自己的构建命令，构建前会跑一遍密钥扫描（`internal/`、`scripts/secrets-guard.ts`）。
- **译文过期检测** —— 一个不阻断构建的 CI 检查，标出落后于中文原文的译文页面（`scripts/i18n/check-stale.ts`、`.github/workflows/i18n-check.yml`）。

## 快速开始

```bash
bun install

# 对外站
bun run dev             # VitePress 开发服务器，http://localhost:5173
bun run sync             # 从源数据重新生成 docs/api/overview.md、schemas.md、model-catalog.ts
bun run build             # → docs/.vitepress/dist/
bun run preview

# 内部知识库（独立站点、独立构建）
bun run dev:internal       # http://localhost:5174
bun run build:internal      # 密钥扫描 → 注入构建元信息 → vitepress build

# 服务端（托管构建产物 + JSON API）
bun run dev:server         # bun --watch server/index.ts，http://localhost:3000
bun run start                # 生产入口

# i18n
bun run i18n:check           # 报告过期译文（不阻断）
bun run i18n:manifest         # 重建翻译清单
```

`package.json` 里没有 `test` 脚本 —— CI 用的是译文过期报告和工作区密钥扫描代替测试（`.github/workflows/i18n-check.yml`、`.github/workflows/secret-scan.yaml`）。

### Docker

```bash
docker build -t lurus-docs .                # 多阶段构建：bun build → oven/bun:1-alpine 运行时
docker run -p 3000:3000 \
  -e ADMIN_API_KEY=... -e WEBHOOK_SECRET=... -e INTERNAL_API_KEY=... \
  -v "$(pwd)/data:/data" lurus-docs
```

## 架构

```
2l-bs-docs/
├── docs/                     # 对外站(VitePress) — docs.lurus.cn
│   ├── <product>/            # kova/ memx/ lucrum/ switch/ creator/ lumen/ forge/ platform/ hub/ tally/ api/ ...
│   ├── {en,ja,ko,es,fr}/     # 译文目录，结构镜像 docs/
│   ├── .vitepress/
│   │   ├── config.ts         # nav / sidebar / i18n locale 接线
│   │   ├── data/              # *.data.ts loader + 自动生成的 model-catalog.ts
│   │   └── theme/               # Vue 组件(Hero、ApiEndpoint、ModelPicker、AdminEditor…)
│   └── public/                 # favicon、feed.xml、静态资源
├── internal/                   # 第二个 VitePress 站：ADR、运维手册、驾驶舱看板
├── server/                     # Hono + Bun 运行时：静态托管 + JSON API
│   ├── index.ts                 # 入口，/api/health，静态文件 + SPA fallback
│   ├── db.ts                     # bun:sqlite schema + 查询(products, updates)
│   └── routes/{public,admin,internal,webhook}.ts
├── scripts/                    # sync.ts、gen-feed.ts、i18n/*、secrets-guard.ts、inject-build-meta.ts
├── data/models.yaml             # 模型目录页面的唯一真源
├── deploy/                      # k8s.yaml(R1 生产)、docker-compose.{internal,staging}.yml、internal-oidc/(已设计未上线)
└── Dockerfile、Dockerfile.internal、Dockerfile.staging、Dockerfile.local
```

`deploy/docker-compose.staging.yml` 与 `deploy/docker-compose.internal.yml` 在 R1 k8s 之外的另一台主机上分别跑预生产副本和仅 tailnet 可达的内部站副本。

部署提示：push 到 `main` 会自动构建 GHCR 镜像并改写 `deploy/k8s.yaml` 里的镜像 tag，但目标集群的 ArgoCD 自 2026-07-29 起已与 git 断连——合入的改动要真正上到生产，目前还需要手工执行 `kubectl -n lurus-system set image deploy/lurus-docs lurus-docs=ghcr.io/hanmahong5-arch/lurus-docs:main-<sha>`。

## 配置

`server/` 读取的环境变量：

| 变量 | 是否必填 | 默认值 | 说明 |
|---|---|---|---|
| `PORT` | 否 | `3000` | HTTP 监听端口（`server/index.ts:35`） |
| `DB_PATH` | 否 | `/data/updates.db` | products/updates 的 SQLite 文件路径（`server/db.ts:4`） |
| `ADMIN_API_KEY` | 要启用 `/api/admin/*` 才必填 | 未设置 → 该组路由一律 503 | Bearer token，常数时间比较（`server/routes/admin.ts:18,31-33`） |
| `WEBHOOK_SECRET` | 要启用 `/api/webhook/deploy` 才必填 | 未设置 → 503 | 校验 `X-Webhook-Signature` 的 HMAC-SHA256 密钥（`server/routes/webhook.ts:6,33`） |
| `INTERNAL_API_KEY` | 要启用 `/api/internal/*` 才必填 | 未设置 → 503 | 保护内部 markdown 内容 API 的 Bearer token（`server/routes/internal.ts:5,22`） |

CI（`.github/workflows/deploy.yml`）读取：`GITHUB_TOKEN`（推 GHCR + 自动提交）、`DOCS_WEBHOOK_SECRET`（给自报送 webhook 调用签名）。

## 接口概览

`server/index.ts:19-23` 挂载的 Hono 路由：

| 路径 | 鉴权 | 用途 |
|---|---|---|
| `GET /api/health` | 无 | 存活/就绪探针 |
| `GET /api/products`、`GET /api/updates`、`GET /api/updates/:id` | 无 | 更新日志的公开只读 API（`server/routes/public.ts`） |
| `/api/admin/*` | Bearer `ADMIN_API_KEY` | 产品与更新记录的 CRUD（`server/routes/admin.ts`） |
| `GET /api/internal/verify`、`GET /api/internal/content/:slug` | Bearer `INTERNAL_API_KEY` | 受保护的 markdown 内容读取，带路径穿越防护（`server/routes/internal.ts`） |
| `POST /api/webhook/deploy` | HMAC `X-Webhook-Signature` | 创建一条草稿态更新记录；CI 用它给自己的部署打卡（`server/routes/webhook.ts`） |

## 开发约定

来自本仓开发约定文档与 CI 接线的真实约定：

- 前端工具链只用 Bun（不用 npm/yarn/npx/node）——见 `bun.lock`。
- `docs/api/overview.md` / `docs/api/schemas.md` 里 `<!-- sync:*:start/end -->` 标记区由 `scripts/sync.ts` 生成，手改会在下次 sync 时被覆盖。
- `data/models.yaml` 是模型目录唯一真源；改完跑 `bun run sync` 重新生成 `docs/.vitepress/data/model-catalog.ts`。
- 新增一门语言：先在 `docs/<locale>/` 下补完核心页面，再把它加进 `docs/.vitepress/config.ts` 的 `ENABLED_LOCALES`——否则语言切换器链接会 404。
- CI 自己的提交（sync 结果、镜像 tag 更新）必须带 `[skip ci]`，否则会触发自我循环部署（`.github/workflows/deploy.yml:23,53,90`）。
- `internal/` 是独立站点，有自己的构建命令（`bun run build:internal`），**不**随 `bun run build` 一起验证——改动共享主题代码时两个站都要单独跑一遍（过去 `internal/` 站构建红过整整三个月没人发现，因为它只在 tailnet 可达、没有告警覆盖）。

## 相关项目

- `2b-svc-newapi` —— `scripts/sync.ts` 读取相邻仓库的 `../2b-svc-newapi/docs/openapi/relay.json`（真实的相对路径依赖）来重新生成 API 参考页面；CI 里这一步允许该相邻仓不存在（`continue-on-error: true`）。
- 与其他平台服务共用 R1 集群的 `lurus-system` 命名空间（`lurus.yaml:755-761`）。

---

`package.json` 声明 `"license": "MIT"`；仓库根目录未见 `LICENSE` 文件，条款未经独立核实。
