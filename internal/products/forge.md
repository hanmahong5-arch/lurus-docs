---
title: Forge
id: forge
group: kova
priority: P1
status: beta
owner: team (+ AI assist)
lastReviewed: 2026-05-28
sourcePath: 2b-bs-forge
---

# Forge 内部手册

> 仅限内部员工查阅。包含运维细节、决策档案、未公开问题。

## 一句话定位

Forge 是 Lurus 团队自用的 AI 产品开发工作台（Route C 内部工具），同时作为 `api.lurus.cn` API Gateway LLM 路由能力的活体 Demo。核心哲学：**一切皆对话**——用户在 Session 中自然对话，PM Agent 自动提炼产品需求并写入 Ontology，形成可视化的产品知识图谱；Canvas 模块则提供拖拽式 Agent 编排，底层消费 Kova 执行引擎。对外**不开放注册**，申请制准入，当前 <5 人内测。

## 速查

| 项 | 值 |
|---|---|
| 仓库 | github.com/hanmahong5-arch/lurus-forge (private) |
| 镜像 (web) | ghcr.io/hanmahong5-arch/forge-web:main-\<sha7\> |
| 镜像 (backend) | ghcr.io/hanmahong5-arch/forge-backend:main-\<sha7\> |
| 域名 | forge.lurus.cn |
| 端口 | web :3000 / canvas :3001 / backend :8000 / kova-rest :3002 |
| 命名空间 | lurus-forge |
| 数据存储 | PG schema `forge`（共享集群 lurus-pg-rw:5432）；无 Redis / NATS / MinIO |
| 关键依赖 | api.lurus.cn (LLM Gateway) / Kova (kova-rest, 可选) / Zitadel SSO (可选 flag) |
| 部署目标 | R1（已通过 ArgoCD 管理，K8s manifest 在 deploy/k8s/） |
| 入口控制器 | Traefik IngressRoute，TLS via letsencrypt |

## 一、架构图

```mermaid
flowchart LR
  subgraph Client["浏览器"]
    Web["forge-web\nNext.js 16\n:3000"]
    Canvas["forge-canvas\nReact Flow + Zustand\n:3001"]
  end

  subgraph K8s["lurus-forge namespace"]
    Backend["forge-backend\nFastAPI + Socket.io\n:8000"]
    DB[(PostgreSQL\nschema: forge)]
  end

  subgraph External["外部服务"]
    Gateway["api.lurus.cn\nLLM Gateway"]
    Kova["kova-rest (Rust)\n:3002\n可选"]
    Zitadel["auth.lurus.cn\nZitadel SSO\n可选 flag"]
  end

  Web -->|"/api/** proxy"| Backend
  Canvas -->|"/api/** proxy"| Backend
  Backend -->|SQLAlchemy asyncpg| DB
  Backend -->|GatewayClient httpx| Gateway
  Backend -->|KovaClient httpx| Kova
  Backend -->|JWKS RS256| Zitadel
  Web <-->|"Socket.io /ws"| Backend
```

**Traefik 路由规则**（`deploy/k8s/ingress.yaml`）：
- `forge.lurus.cn` + path `/api/**` 或 `/ws/**` → forge-backend:8000
- `forge.lurus.cn` 其余路径 → forge-web:3000

## 二、核心数据流

```mermaid
sequenceDiagram
  participant U as 用户
  participant W as forge-web
  participant B as forge-backend
  participant LLM as api.lurus.cn
  participant DB as PostgreSQL

  U->>W: 在 Session 中发送消息
  W->>B: POST /api/sessions/{id}/messages
  B->>DB: 写入 SessionMessage (sender_type=user)
  B-->>W: 200 消息已存储

  U->>W: 点击「PM Analyze」
  W->>B: POST /api/agents/pm/analyze
  B->>DB: 读取近 N 条 SessionMessage
  B->>DB: 读取已有 ProductNode 列表
  B->>LLM: Messages API (claude-sonnet-4-*)\n{transcript + existing_nodes}
  LLM-->>B: JSON {ops:[...], reply:"..."}
  B->>DB: apply_ontology_ops:\n  CREATE_NODE → product_nodes\n  UPDATE_NODE → product_nodes\n  CREATE_CONFLICT → product_conflicts
  B-->>W: {ops_applied, reply}
  W-->>U: OntologyPanel 实时刷新节点树
```

**Canvas 执行流**（`components/executor.py`）：
1. 前端保存 React Flow `graph_data` → `POST /api/flows`
2. `POST /api/flows/{id}/execute` → 后台任务
3. `FlowExecutor` Kahn 拓扑排序，顺序调用各节点 `Component.execute(kova_client, **kwargs)`
4. 输出沿边传递到下游节点输入
5. 执行状态写入 `flow_executions` 表（pending → running → completed/failed）
6. 启动时清理上次崩溃留下的 stale 执行（超 30 分钟 pending/running 标 failed）

## 三、代码地图

### Monorepo 结构（pnpm + Turbo）

| 路径 | 职责 |
|---|---|
| `apps/web/` | Next.js 16 Session/Ontology UI，端口 :3000 |
| `apps/canvas/` | React Flow 可视化 Canvas，端口 :3001 |
| `services/backend/` | FastAPI + Socket.io，端口 :8000 |
| `packages/shared/` | 前端共享类型/工具 |
| `packages/eliza-*` | Agent 框架包（core/kova/schemas/prompts） |
| `infra/` | Dockerfile.{backend,web,canvas} |
| `deploy/k8s/` | K8s manifest（namespace/backend/web/ingress/secret） |

### 后端关键路径（`services/backend/src/forge/`）

| 路径 | 职责 |
|---|---|
| `main.py` | FastAPI app；lifespan 初始化 KovaClient；2MB 请求限制；CORS |
| `config.py` | Settings（pydantic-settings，env 前缀 `FORGE_`） |
| `api/router.py` | 聚合所有子路由，prefix `/api` |
| `api/sessions.py` | Session CRUD + 状态机（created→active→paused→summarizing→closed） |
| `api/ontology.py` | ProductNode / ProductConflict CRUD |
| `api/flows.py` | Flow CRUD + 执行触发 |
| `api/kova_proxy.py` | 透传 kova-rest 35+ endpoints |
| `api/copilot.py` | 自然语言生成 Canvas 操作（CopilotEngine） |
| `agents/pm.py` | PMAgent：对话→OntologyOp 提取→DB 写入 |
| `agents/base.py` | BaseAgent + LlmClient（GatewayClient / AnthropicClient） |
| `components/` | 11 个 Canvas 组件（5 Kova + LLM + 3 Text + Conditional） |
| `components/executor.py` | FlowExecutor：Kahn 拓扑排序执行引擎 |
| `kova/client.py` | KovaClient：httpx async，35+ 端点，版本协商 |
| `adapters/oidc_adapter.py` | ZitadelJWTDecoder：JWKS RS256，1h 缓存 |
| `sockets/` | Socket.io AsyncServer，挂载 /ws |
| `models/` | ORM 模型（product/session/message/ontology/flow/user） |
| `alembic/` | 数据库迁移（含 SSO migration c3d4e5f6） |

### Ontology 数据模型

| 表 | 关键字段 |
|---|---|
| `products` | id / owner_id / name / description / status(draft/active/archived) |
| `sessions` | id / product_id / title / status / focus_level(0-7) / summary(JSONB) |
| `session_messages` | id / session_id / sender_type / content / display_name |
| `product_nodes` | id / product_id / parent_id / name / level(0-7) / description / confidence(float) / tags(array) / data(JSONB) |
| `product_conflicts` | id / source_node_id / target_node_id / severity(low/medium/high/critical) / resolved |
| `flows` | id / user_id / name / graph_data(JSON) |
| `flow_executions` | id / flow_id / status / error / started_at / completed_at |

**Ontology Node Level 映射**：

| level | 含义 |
|---|---|
| 0 | Product Vision |
| 1 | Epic / Theme |
| 2 | Feature（PMAgent 默认） |
| 3 | Sub-feature |
| 4 | User Story |
| 5 | Acceptance Criteria |
| 6 | Technical Detail |
| 7 | Implementation Note |

## 四、Canvas 组件库

Canvas 采用轻量组件框架（`components/base.py`，约 100 行），每个组件声明 `InputSpec` / `OutputSpec`，`FlowExecutor` 按拓扑顺序调用 `Component.execute(kova_client, **kwargs)`。

| 组件类名 | Category | 功能 |
|---|---|---|
| `KovaDurableAgent` | kova | WAL-backed 持久 Agent，支持 crash 重启 |
| `KovaConversation` | kova | 多轮对话管理 |
| `KovaMemory` | kova | 记忆读写 |
| `KovaQueue` | kova | 消息队列 enqueue/dequeue |
| `KovaSwarm` | kova | 多 Agent 并发拓扑 |
| `LlmGateway` | llm | 直接调用 api.lurus.cn |
| `TextConcat` | text | 字符串拼接 |
| `TextTemplate` | text | Jinja 模板渲染 |
| `TextExtract` | text | 正则/JSON 提取 |
| `Conditional` | logic | if/else 条件分支 |

## 五、认证体系

Forge 支持双模式认证，由 `FORGE_ZITADEL_ENABLED` 开关控制：

```
FORGE_ZITADEL_ENABLED=false (默认，Route C 内测)
  → 本地 HS256 JWT，secret = FORGE_JWT_SECRET
  → POST /api/auth/login 换 token
  → 手动创建用户：POST /api/auth/register（无邮件验证）

FORGE_ZITADEL_ENABLED=true (未来 SSO 模式)
  → 接受 Zitadel RS256 token（JWKS 1h 缓存验证）
  → 本地 HS256 token 继续作为 fallback
  → 需迁移：alembic migration c3d4e5f6a7b8（users 表加 3 列）
```

前端用 `localStorage` 存 `forge_token`，Socket.io 连接时检测 token 变更重新认证。

**LLM Gateway 密钥**：
- `FORGE_ZITADEL_ENABLED=false`：使用共享 `FORGE_LLM_GATEWAY_KEY`
- `FORGE_ZITADEL_ENABLED=true`：每用户独立 gateway_token（`gateway_provisioner.py` → platform `/internal/user/provision`）

## 六、环境变量参考

| 变量 | 必填 | 说明 | 示例 |
|---|---|---|---|
| `FORGE_DATABASE_URL` | 是 | PostgreSQL asyncpg DSN | `postgresql+asyncpg://forge:xxx@lurus-pg-rw.database.svc:5432/forge` |
| `FORGE_JWT_SECRET` | 是 | HS256 签名密钥，≥32 字节 | `&lt;openssl rand -hex 32&gt;` |
| `FORGE_LLM_GATEWAY_URL` | 是 | LLM 路由网关地址 | `https://api.lurus.cn` |
| `FORGE_LLM_GATEWAY_KEY` | 是 | 网关 API key | `sk-xxx` |
| `FORGE_CORS_ORIGINS` | 否 | 逗号分隔允许来源 | `https://forge.lurus.cn` |
| `FORGE_KOVA_REST_URL` | 否 | kova-rest 地址；缺省则 Canvas 执行降级 | `http://localhost:3002` |
| `FORGE_KOVA_REST_API_KEY` | 否 | kova-rest bearer key | |
| `FORGE_ZITADEL_ENABLED` | 否 | 启用 SSO 模式（默认 false） | `true` |
| `FORGE_ZITADEL_ISSUER` | SSO 时必填 | Zitadel issuer | `https://auth.lurus.cn` |
| `FORGE_ZITADEL_JWKS_URI` | SSO 时必填 | JWKS 端点 | `https://auth.lurus.cn/oauth/v2/keys` |
| `FORGE_ZITADEL_CLIENT_ID` | SSO 时必填 | OIDC client/audience | |
| `FORGE_API_GATEWAY_URL` | SSO 时 | 用于 provision 用户 gateway token | `https://api.lurus.cn` |
| `FORGE_API_GATEWAY_INTERNAL_KEY` | SSO 时 | 内部 provision 调用鉴权 key | |

前端（Next.js）：
- `BACKEND_URL`：K8s 内 `http://forge-backend.lurus-forge.svc:8000`（server-side proxy 用，非 NEXT_PUBLIC）

## 七、部署

### 构建

```bash
# 后端（多阶段，uv，python:3.12-slim）
docker build -f infra/Dockerfile.backend -t ghcr.io/hanmahong5-arch/forge-backend:main-<sha7> .

# 前端（多阶段，pnpm + Next.js standalone output）
docker build -f infra/Dockerfile.web -t ghcr.io/hanmahong5-arch/forge-web:main-<sha7> .
```

### CI/CD

| 触发 | 动作 |
|---|---|
| push main (2b-bs-forge/**) | lint → build backend image → build web image → push GHCR → ArgoCD auto-sync |

镜像 tag 格式：`main-<sha7>`（当前 manifest 使用 `latest`，**待修正为 sha7 pinning**）

### 数据库初始化

```bash
# 在 backend 容器内或 init-container 执行
cd services/backend
uv run alembic upgrade head
```

首次部署需在共享 PostgreSQL 创建 forge 专属用户与数据库：

```sql
CREATE ROLE forge_user WITH LOGIN PASSWORD 'xxx';
CREATE DATABASE forge OWNER forge_user;
```

### K8s Manifest 结构

```
deploy/k8s/
├── namespace.yaml          # lurus-forge
├── backend.yaml            # Deployment(1 replica) + Service(:8000)
├── web.yaml                # Deployment(1 replica) + Service(:3000)
├── ingress.yaml            # Traefik IngressRoute，TLS letsencrypt
└── secret.yaml.template    # forge-secrets 模板（不 commit 实际值）
```

资源配额：backend 256Mi/512Mi mem，100m/500m cpu；web 128Mi/256Mi，50m/200m。

## 八、本地开发

```bash
# 依赖安装
cd 2b-bs-forge
pnpm install

# 启动全栈（postgres + backend + web + canvas + kova-rest）
docker compose up -d

# 单独启动前端
cd apps/web && pnpm dev          # :3000
cd apps/canvas && pnpm dev       # :3001

# 后端（热重载）
cd services/backend
uv run uvicorn forge.main:app --reload --port 8000

# 后端测试
uv run pytest tests/             # 234 tests
uv run ruff check src/           # lint

# 前端 typecheck
cd apps/web && npx tsc --noEmit
```

## 九、已知坑（内部专属）

### 双栈维护负担
Canvas（:3001）和 Web（:3000）共用同一套后端 API，但两者是独立 Next.js 应用，`forge_token` 通过 localStorage 共享。Traefik 仅将 `forge.lurus.cn` 下的流量路由到 web，Canvas 目前无独立域名，**K8s 下需要额外 ingress 规则才能在生产访问 canvas**。

### 前后端协议同步
PMAgent 提取的 `OntologyOp` 结构在 Python（`agents/pm.py`）和前端 TypeScript（`lib/types`）中各有一份定义，**没有共享 schema 生成**。字段变更后需手动同步两处，已多次出现字段名不一致导致前端渲染 undefined。

### 内测准入流程混乱
当前注册完全开放（`POST /api/auth/register` 无验证），依赖"没人知道 URL"作为访问控制。用户管理缺少 admin 后台，需直连数据库管理账户。

### Agent loop 死循环风险
`KovaDurableAgent` 组件的 `max_iterations` 默认为 25，但 `FlowExecutor` 没有全局超时。若 kova-rest 长时间不返回，执行会卡在 `running` 状态，且 Socket.io 连接会保持。清理机制（stale threshold 30min）在下次**重启**时才触发，不是实时的。

### Dockerfile.web 仍使用 npx
`infra/Dockerfile.web` builder 阶段调用 `npx next build`，与项目规范（Bun 优先）不符，且 K8s pull policy 为 `IfNotPresent`，当前 manifest 镜像 tag 用 `latest` 而非 `main-<sha7>`，ArgoCD **无法感知新镜像推送**，需改为 sha7 pinning。

### kova-rest 未在 K8s 部署
`FORGE_KOVA_REST_URL` 在生产环境未配置，Canvas 中所有 Kova 组件执行时返回 `[kova-rest unavailable]` 降级值，不会报错但无任何实际 agent 执行。

### SSO migration 未执行
`FORGE_ZITADEL_ENABLED=false` 时 alembic migration `c3d4e5f6a7b8_add_zitadel_sso_columns.py`（users 表 3 列）已存在于 migration 链中，`alembic upgrade head` 会执行它，但相关列在 flag=false 时无副作用——这是设计意图，无需担心。

## 十、决策档案

| 时间 | 决策 | 理由 |
|---|---|---|
| 2026-Q1 | Route C：Forge 定位内部工具而非产品 | 减少范围，聚焦 Session+Ontology 核心循环，作为 API Gateway demo |
| 2026-Q1 | 不集成 Kova 持久执行（Route C 范围外） | 内测 <5 人，local JWT 足够，Kova 集成推迟 |
| 2026-Q1 | 不集成 Memorus（Route C 范围外） | 同上，过度设计 |
| 2026-Q1 | 无 Redis / NATS / MinIO | 内部工具不需要，共享 PG 即可 |
| 2026-Q1 | 双栈 Next.js（web + canvas 分离） | canvas 需要 React Flow 全屏布局，与 session/ontology 的侧边栏 UI 不兼容，分离部署更灵活；代价是维护两个 Next.js 应用 |
| 2026-Q1 | FastAPI 而非 Go | 团队 Python 技能更强，AI/LLM 生态 Python 优先，内部工具性能要求低 |

## 十一、TODO / Roadmap

- [ ] **镜像 tag 改 sha7 pinning**（backend.yaml / web.yaml 改 `latest` → `main-<sha7>`）— 高优，当前 ArgoCD 无法自动感知更新
- [ ] **Canvas ingress 规则** — canvas 在 K8s 下无独立入口，需追加 Traefik 规则
- [ ] **注册鉴权** — `POST /api/auth/register` 加 invite code 或 admin 审批，堵住开放注册
- [ ] **WebSocket 穿 Traefik** — 当前 Socket.io 路由 `/ws` 已在 ingress 规则中，需验证 Traefik WebSocket sticky session（`loadBalancer.sticky`）
- [ ] **kova-rest 部署到 K8s** — 在 `lurus-forge` namespace 追加 kova-rest deployment，配置 `FORGE_KOVA_REST_URL`
- [ ] **OntologyOp 共享 schema** — 用 Protobuf 或 JSON Schema 生成 Python + TypeScript 类型，消除手动同步
- [ ] **前端 Bun 化** — `Dockerfile.web` 改用 Bun 替代 npx/pnpm（与全局规范对齐）
- [ ] **Flow 执行全局超时** — `FlowExecutor` 加 `asyncio.wait_for` 超时保护，避免 agent loop 卡死
- [ ] **实时执行状态推送** — 当前 Socket.io 仅用于 session 消息，flow 执行进度需轮询；改为 SSE 或 Socket.io event 推送

## 十二、应急 Runbook（10 分钟版）

### 前端 502 / 页面空白

```bash
# 查看 web pod 状态
ssh root@100.98.57.55 "kubectl get pods -n lurus-forge"
ssh root@100.98.57.55 "kubectl logs -n lurus-forge deploy/forge-web --tail=100"

# 检查 backend 是否健康（web 靠 /api proxy 到 backend）
ssh root@100.98.57.55 "kubectl exec -n lurus-forge deploy/forge-web -- \
  wget -qO- http://forge-backend.lurus-forge.svc:8000/api/health"

# 重启 web
ssh root@100.98.57.55 "kubectl rollout restart deployment/forge-web -n lurus-forge"
```

### FastAPI 后端挂（500 / Connection refused）

```bash
ssh root@100.98.57.55 "kubectl logs -n lurus-forge deploy/forge-backend --tail=200"
# 常见原因：DB 连接池耗尽、Alembic 未执行、SECRET 缺失

# 检查健康
ssh root@100.98.57.55 "kubectl describe pod -n lurus-forge -l app=forge-backend"

# 强制重启
ssh root@100.98.57.55 "kubectl rollout restart deployment/forge-backend -n lurus-forge"

# 若 Secret 变更，需重建 pod
ssh root@100.98.57.55 "kubectl delete pod -n lurus-forge -l app=forge-backend"
```

### Kova 不响应（Canvas 执行全部返回 unavailable）

kova-rest 当前未部署到 K8s，这是预期行为。若本地 docker-compose 环境 kova-rest 容器退出：

```bash
# 本地
docker compose ps
docker compose restart kova-rest
docker compose logs kova-rest --tail=50
```

检查版本协商日志（后端启动时输出）：`kova-rest version X.Y.Z — compatible` 或 `KovaVersionMismatchError`。
要求客户端兼容版本 `>=0.2.0`。

### 数据库连接失败 / 迁移问题

```bash
# 检查 PG 连通性
ssh root@100.98.57.55 "kubectl exec -n lurus-forge deploy/forge-backend -- \
  python -c \"import asyncio, asyncpg; asyncio.run(asyncpg.connect('...'))\""

# 手动执行迁移（exec 进 backend 容器）
ssh root@100.98.57.55 "kubectl exec -it -n lurus-forge deploy/forge-backend -- \
  alembic upgrade head"

# 查 migration 历史
ssh root@100.98.57.55 "kubectl exec -n lurus-forge deploy/forge-backend -- \
  alembic history --verbose"
```

### 数据恢复

- 备份位置：MinIO `pg-backups-v2`（平台统一备份，forge schema 包含在内）
- 恢复联系：marvin（DBA 权限）
- 紧急直连 PG：Tailscale `100.98.57.55:30543`，用 `forge_user` 凭证

### 回滚

```bash
# ArgoCD 回滚到上一个版本
ssh root@100.98.57.55 "argocd app rollback lurus-forge"

# 或手动改 manifest tag 后 push 触发 ArgoCD sync
# 1. 修改 deploy/k8s/backend.yaml 和 web.yaml 中的镜像 tag
# 2. git commit + push → ArgoCD 自动 sync
```

### 审计：谁发了什么请求

当前无专用审计日志，靠 uvicorn access log 排查：

```bash
ssh root@100.98.57.55 "kubectl logs -n lurus-forge deploy/forge-backend --tail=500 | grep 'POST /api'"
```

关键查询（直连 PG）：

```sql
-- 查某用户最近 session 消息
SELECT s.title, m.sender_type, m.content, m.created_at
FROM forge.sessions s
JOIN forge.session_messages m ON m.session_id = s.id
WHERE s.product_id = '<product-uuid>'
ORDER BY m.created_at DESC
LIMIT 50;

-- 查 Ontology 节点变更（无 updated_at diff，靠 created_at 推断）
SELECT name, level, confidence, created_at
FROM forge.product_nodes
WHERE product_id = '<product-uuid>'
ORDER BY created_at DESC;
```

---

## 多视角速览

**用户视角**
Forge 提供可视化拖拽式 agent 工作流编排界面（Canvas），无需写代码即可把 LLM 调用、条件分支、记忆读写、队列等能力组合成完整流程。Session 模块允许以自然语言对话来定义产品需求，PM Agent 自动提炼并写入 Ontology 知识图谱，非工程师可独立完成从"描述需求"到"运行 agent"的全链路。

**开发者视角**
仓库为 TypeScript + Python 的混合 monorepo（Turbo 编排，pnpm 管理），前端两个独立 Next.js 应用（web :3000 / canvas :3001），后端 FastAPI + Socket.io（:8000），Kova REST 客户端（:3002）。Ontology 数据存 PostgreSQL `forge` schema，节点层级 0–7 对应 Product Vision → Implementation Note。Canvas 执行引擎（`FlowExecutor`）使用 Kahn 拓扑排序驱动组件图，每个组件通过 `KovaClient` 与 kova-rest 通信完成实际 agent 执行。

**运维视角**
当前为内部 beta（<5 人内测），部署于 R6（STAGE，`43.226.38.244`），namespace `lurus-forge`。镜像 tag 目前为 `latest`（待修正为 `main-<sha7>` sha 钉），ArgoCD 管理，kova-rest **尚未部署到 K8s**（Canvas 中 Kova 组件降级返回占位值）。⚠ 未达商业交付标准，不上 R1。关键监控缺口：无专用审计日志、flow 执行无全局超时、Socket.io 状态推送尚未实现。

**决策者视角**
Forge 的核心价值是把 agent 开发民主化——让 PM、运营等非工程师角色也能通过可视化拖拽构建和迭代 AI 工作流，同时沉淀产品知识为结构化 Ontology，避免需求在对话中消散。短期定位是内部 R&D 活体 Demo（展示 `api.lurus.cn` LLM 路由能力），中期路线是向企业客户开放为低代码 agent 平台。当前阶段优先验证核心循环（Session → Ontology → Canvas → 执行），范围外的功能（Zitadel SSO 全量/Redis/NATS）刻意推迟。

---

## 决策树：什么场景用 Forge

```mermaid
graph TD
    A[有 agent 工作流需求] --> B{操作者是非工程师?}
    B -- 是 --> C{需要可视化编排?}
    B -- 否 --> D{需要快速原型验证?}
    D -- 是 --> C
    D -- 否 --> Z1[直接写 Kova workflow 代码]
    C -- 是 --> E{需要复用 Ontology 业务概念?}
    C -- 否 --> Z2[用 Session 自然语言定义需求后导出]
    E -- 是 --> F{需要 Session 历史回溯?}
    E -- 否 --> G[Canvas 单次 flow 编排]
    F -- 是 --> H[✓ 完整使用 Forge：Session + Ontology + Canvas]
    F -- 否 --> I{workflow 超过 20 个节点?}
    I -- 是 --> J[⚠ 拆 sub-agent / 多图分治，避免单图过大]
    I -- 否 --> K[Canvas flow + Ontology 节点引用]
    G --> L[适合一次性自动化任务]
    H --> M[适合 PM 驱动的持续演进产品]
```

---

## 典型时序图

```mermaid
sequenceDiagram
    participant PM as PM（非工程师）
    participant UI as Forge Canvas UI
    participant BE as forge-backend
    participant K as kova-rest
    participant DB as PostgreSQL
    participant ONT as Ontology Engine

    PM->>UI: 拖拽节点（LlmGateway / KovaDurableAgent / TextTemplate）
    UI->>UI: React Flow 构建 graph_data（节点 + 边 JSON）
    PM->>UI: 连线并配置各节点 prompt / 参数
    UI->>BE: POST /api/flows（保存 graph_data）
    BE->>DB: INSERT flows
    BE-->>UI: flow_id

    PM->>UI: 点击「执行」
    UI->>BE: POST /api/flows/{flow_id}/execute
    BE->>DB: INSERT flow_executions（status=pending）
    BE->>BE: FlowExecutor：Kahn 拓扑排序
    loop 按拓扑顺序执行每个节点
        BE->>K: POST /api/v1/agents/run（KovaDurableAgent）
        K-->>BE: 执行结果
        BE->>BE: 输出沿边传递到下游节点输入
    end
    BE->>DB: UPDATE flow_executions（status=completed）
    BE-->>UI: Socket.io event：execution_done

    UI-->>PM: 展示执行结果（节点着色 + 输出预览）
    PM->>UI: 触发「写入 Ontology」
    UI->>BE: POST /api/agents/pm/analyze（携带执行输出）
    BE->>ONT: apply_ontology_ops（CREATE_NODE / UPDATE_NODE）
    ONT->>DB: UPSERT product_nodes
    BE-->>UI: ops_applied
    UI-->>PM: OntologyPanel 实时刷新知识图谱
```

---

## 端到端完整例子

### 场景：PM 用 Forge 构建「客户反馈分析」workflow

**背景**：PM 小李需要每天把客服系统导出的反馈文本自动分类、提取关键痛点、写入产品 Ontology，以便下次 sprint 规划时直接引用结构化洞察。

**步骤一：Session 定义需求（约 5 分钟）**

小李在 Forge Session 页面新建 Session，标题"客户反馈自动分析"，输入：

> "我想把每天导出的 CSV 反馈，自动按 Bug / 需求 / 体验 分类，提取 top 5 痛点，结果写进产品节点。"

PM Agent 分析对话，提取 Ontology 操作，生成节点：
- level 1（Epic）：客户反馈自动化处理
- level 2（Feature）：CSV 解析、三类分类、痛点提取、Ontology 写入

**步骤二：Canvas 拖拽编排（约 15 分钟）**

切换到 Canvas，拖入以下节点并连线：

```
[TextTemplate: 加载 CSV 行]
       ↓
[LlmGateway: 分类（prompt: 按 Bug/需求/体验 分类，返回 JSON）]
       ↓
[Conditional: type == "Bug"?]
    ↓是                ↓否
[KovaDurableAgent:  [TextConcat: 合并非 Bug 条目]
 生成 Bug 痛点摘要]
       ↓
[TextExtract: 提取 top 5（regex JSON path）]
       ↓
[KovaMemory: 写入 MemX 知识库（产品 ID: lucrum）]
```

**节点配置 JSON 样例**（`graph_data` 片段）：

```json
{
  "nodes": [
    {
      "id": "n1",
      "type": "LlmGateway",
      "data": {
        "model": "claude-sonnet-4-5",
        "system": "你是产品分析助手，严格按 JSON schema 输出。",
        "user_template": "反馈内容：{{input.text}}\n请分类为 Bug / 需求 / 体验 之一，返回 {\"type\": \"...\", \"summary\": \"...\"}",
        "output_schema": {"type": "string", "summary": "string"}
      }
    },
    {
      "id": "n2",
      "type": "Conditional",
      "data": {
        "condition": "input.type == 'Bug'"
      }
    },
    {
      "id": "n3",
      "type": "KovaDurableAgent",
      "data": {
        "task": "从以下反馈列表中提取 top 5 用户痛点，按严重程度排序",
        "max_iterations": 10
      }
    },
    {
      "id": "n4",
      "type": "KovaMemory",
      "data": {
        "operation": "write",
        "namespace": "lucrum-feedback",
        "key_template": "pain-points-{{date}}"
      }
    }
  ],
  "edges": [
    {"source": "n1", "target": "n2"},
    {"source": "n2", "target": "n3", "label": "true"},
    {"source": "n3", "target": "n4"}
  ]
}
```

**步骤三：接入 MemX**

`KovaMemory` 节点配置 `FORGE_KOVA_REST_URL` 指向 kova-rest，kova-rest 内部调用 `2b-svc-memorus` 的 `/memory/add` 接口，命名空间 `lucrum-feedback`，后续 sprint 规划时 PM 可以直接问 MemX："上周 top 痛点是什么？"

**步骤四：上线（beta 阶段灰度）**

- 将该 flow 加入灰度名单（当前手动在 `flow_executions` 表设 `allowed_users` 字段），仅对小李和 1 名工程师审核者开放
- 验证输出 JSON schema 符合预期后，扩展到产品组 3 人
- 截图描述：Canvas 画布左侧节点面板展示 10 种组件类型（含 KovaDurableAgent 标 β），中央画布显示上述 5 节点连线图，右侧为选中 LlmGateway 节点的配置面板（model 下拉 + prompt 编辑器），底部执行状态栏显示"上次执行：completed，耗时 8.3s，节点 5/5 通过"

---

## 最佳实践 ✓/✗

| # | ✓ 推荐 | ✗ 反模式 |
|---|--------|----------|
| 1 | ✓ Ontology 节点抽象到业务概念（Epic / Feature / User Story），让非工程师也能读懂知识图谱 | ✗ 把实现细节（函数名、表名、变量）直接写进 level 0–2 节点，导致 Ontology 只有工程师能用 |
| 2 | ✓ Session 必须能回放：所有对话写入 `session_messages`，PM Agent 操作写入 `product_conflicts`，保留完整决策链 | ✗ 跑完 Session 就关闭或删除消息，下次规划无历史可查 |
| 3 | ✓ 复杂 workflow（>20 节点）拆为多个 sub-agent flow，通过 KovaQueue 或 KovaDurableAgent 串联 | ✗ 单图塞百节点，FlowExecutor 拓扑排序耗时增加，调试困难，单点失败影响全图 |
| 4 | ✓ Dependency Guardian 明确锁定外部 API 版本（kova-rest `>=0.2.0`，LLM model 固定 slug），并在 CI 中校验版本协商结果 | ✗ 直接拉 `latest` 镜像或不指定 model slug，kova 升级后组件行为静默变化 |
| 5 | ✓ 每个节点声明明确的 `output_schema`（JSON schema），下游节点校验输入，失败快速抛出 `ComponentError` | ✗ 节点输出自由文本，下游用正则硬解析，模型输出格式稍变即报错且难定位 |
| 6 | ✓ beta 阶段通过灰度名单（invite code / `allowed_users`）控制访问，逐步扩大验证 | ✗ 全员开放注册（当前 `POST /api/auth/register` 无验证），无法控制数据规模和反馈质量 |
| 7 | ✓ Flow 执行设全局超时（`asyncio.wait_for`），超时后将 `flow_executions.status` 标为 `timeout` 并推 Socket.io 事件 | ✗ 依赖 stale 清理机制（30 分钟重启才触发），导致执行卡死期间前端无反馈 |
| 8 | ✓ OntologyOp 结构通过共享 JSON Schema 生成 Python + TypeScript 类型（单一来源） | ✗ Python 和 TypeScript 各自维护一份类型定义，字段变更需手动同步两处 |

---

## 跨产品集成场景

### ① Forge + Kova：可视化编译 → 持久执行

Forge Canvas 是 Kova 的可视化前端。用户在 Canvas 拖拽编排的 `graph_data` 经过 `FlowExecutor` 解析后，将各节点调用转译为对 kova-rest 的 HTTP 请求序列（`POST /api/v1/agents/run`、`/memory/read`、`/queue/push` 等）。

关键链路：
- `forge-backend` 持有 `KovaClient`（`kova/client.py`），启动时与 kova-rest 进行版本协商（要求 `>=0.2.0`）
- `KovaDurableAgent` 组件对应 kova 的 WAL-backed 持久 agent，支持 crash 重启；Forge 侧记录 `flow_executions` 状态，kova 侧记录 agent WAL，两者通过 `execution_id` 关联
- 若 kova-rest 不可用，`KovaClient` 降级返回占位值（`[kova-rest unavailable]`），flow 可继续执行但 Kova 节点无实际效果——**生产上线前必须先将 kova-rest 部署到 `lurus-forge` namespace**

集成待办：kova-rest K8s deployment（`deploy/k8s/kova-rest.yaml`）+ `FORGE_KOVA_REST_URL` 注入 forge-backend secret。

### ② Forge + MemX：agent 知识库持久化

`KovaMemory` 节点通过 kova-rest 间接调用 `2b-svc-memorus`（MemX）的记忆 API（`/memory/add`、`/memory/search`），实现：
- **写入**：Flow 执行输出（痛点摘要、分析结论）持久化到 MemX，按命名空间隔离（如 `lucrum-feedback`、`tally-ops`）
- **读取**：后续 Session 中 PM Agent 可查询 MemX，让历史分析结论参与新一轮 Ontology 提炼，形成知识积累飞轮

⚠ 当前 MemX 集成状态：`2026-Q1` 决策将 Memorus 集成推迟（Route C 范围外）。`KovaMemory` 组件代码已就位，但 kova-rest 侧 MemX provider 需在 kova-rest 部署后验证端到端链路。

---

## 运维常见问题

```mermaid
flowchart TD
    START([运维告警 / 用户反馈]) --> Q1{问题类型?}

    Q1 --> A1[Canvas flow 编译/执行失败]
    Q1 --> A2[Session 消息 / Ontology 丢失]
    Q1 --> A3[Ontology 节点不一致]
    Q1 --> A4[Dependency Guardian 误报]
    Q1 --> A5[多用户协作冲突]
    Q1 --> A6[其他：502 / 500 / WS 断连]

    A1 --> B1{kova-rest 可达?}
    B1 -- 否 --> C1[检查 FORGE_KOVA_REST_URL\n本地 docker compose restart kova-rest\nK8s 环境部署 kova-rest deployment]
    B1 -- 是 --> C2{版本协商日志?}
    C2 -- KovaVersionMismatchError --> C3[升级 kova-rest 到 >=0.2.0\n或降级 KovaClient 兼容版本]
    C2 -- ComponentError --> C4[检查节点 output_schema\n确认上游输出格式符合下游输入约束]
    C2 -- flow 卡 running > 30min --> C5[重启 forge-backend\n触发 stale 清理\n或手动 UPDATE flow_executions SET status='failed']

    A2 --> B2{DB 可达?}
    B2 -- 否 --> D1[检查 FORGE_DATABASE_URL\nkubectl exec pg connectivity test\n联系 DBA 确认 lurus-pg-rw 状态]
    B2 -- 是 --> D2{alembic 版本正确?}
    D2 -- 否 --> D3[kubectl exec forge-backend\nalembic upgrade head]
    D2 -- 是 --> D4[查 session_messages / product_nodes\n确认写入时间戳\n排查 Socket.io 连接是否中断导致前端未刷新]

    A3 --> E1{是 OntologyOp 字段名问题?}
    E1 -- 是 --> E2[对齐 agents/pm.py 与前端 lib/types\n两处 OntologyOp 定义必须同步\n长期方案：JSON Schema 共享生成]
    E1 -- 否 --> E3{PMAgent LLM 输出 JSON 格式错误?}
    E3 -- 是 --> E4[检查 GatewayClient 返回\n确认 model slug 未漂移\n加 output_schema 强约束]

    A4 --> F1[检查 kova-rest 版本协商日志\n`kova-rest version X.Y.Z — compatible`\n若误报确认 FORGE_KOVA_REST_URL 指向正确实例\n排除网络抖动导致的临时 503]

    A5 --> G1[当前无乐观锁 / 协作锁\n多用户同时编辑同一 flow graph_data 最后写入覆盖前者\n临时方案：通知用户分时操作\n长期方案：flow 编辑加版本 CAS 校验]

    A6 --> H1[参见 十二 应急 Runbook\n502 → 查 web/backend pod\n500 → 查 backend 日志 + Secret 完整性\nWS 断连 → 确认 Traefik IngressRoute /ws 路由 + sticky session]
```
