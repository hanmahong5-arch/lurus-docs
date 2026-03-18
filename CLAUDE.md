# lurus-docs

平台统一文档站。VitePress 静态站点，托管于 `docs.lurus.cn`，覆盖 Lurus API、Switch、MemX 等产品线。

## Tech Stack

| 角色 | 选型 |
|------|------|
| 文档框架 | VitePress 1.6.x |
| 运行时 | Bun |
| 额外插件 | vitepress-plugin-llms（llms.txt 生成）、vitepress-plugin-tabs |
| 容器 | nginx:alpine，静态文件服务，port 80 |
| 部署 | GitOps: push main → GHA sync+build → GHCR → ArgoCD → `lurus-system` ns |
| 公网域名 | `docs.lurus.cn`（Traefik IngressRoute + wildcard TLS） |

## Directory Structure

```
lurus-docs/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts       # Nav, sidebar, plugins
│   │   └── theme/          # Custom theme components
│   ├── api/                # Lurus API reference (overview auto-synced)
│   ├── guide/              # Lurus API user guide + client integrations
│   ├── gushen/             # Lucrum quant platform docs
│   ├── switch/             # Switch desktop app docs
│   └── index.md            # Homepage
├── data/
│   └── models.yaml         # Model catalog (source of truth for guide/models)
├── scripts/
│   └── sync.ts             # Auto-sync: relay.json → api/overview.md
├── deploy/
│   ├── k8s.yaml            # Deployment + Service + IngressRoute
│   └── pdb.yaml            # PodDisruptionBudget (minAvailable: 1)
├── .github/workflows/
│   └── deploy.yml          # CI: sync → build → push GHCR → kubectl rollout restart
├── Dockerfile              # Production: nginx:alpine + bun build output
└── Dockerfile.local        # Local test image (fixed nginx version)
```

## Commands

```bash
# Install
bun install

# Local dev (hot-reload, http://localhost:5173)
bun run dev

# Sync auto-generated sections from sources
bun run sync
# Sources:
#   ../lurus-api/docs/openapi/relay.json → docs/api/overview.md  (<!-- sync:endpoints:start/end -->)

# Production build → docs/.vitepress/dist/
bun run build

# Preview production build locally
bun run preview

# Full deploy pipeline (sync + build; Docker push is done by CI only)
bun run deploy
```

## Content Editing Notes

- **模型目录**: 编辑 `data/models.yaml`，运行 `bun run sync` 后重新 build 生效。
- **API endpoint 列表**: 由 `scripts/sync.ts` 从 `lurus-api/docs/openapi/relay.json` 自动生成，标有 `未实现` tag 的 endpoint 会被跳过。手动修改 `docs/api/overview.md` 中的 sync 标记区域将在下次 sync 时被覆盖。

## CI/CD Triggers

| 触发条件 | 动作 |
|---------|------|
| push to main (docs/\*\*, scripts/\*\*, Dockerfile, deploy/\*\*) | sync → build → push GHCR → update manifest → ArgoCD auto-sync |
| 每周一 02:00 UTC (schedule) | 同上（保持 endpoint 列表最新） |
| workflow_dispatch | 同上（手动触发） |

## BMAD

| Resource | Path |
|----------|------|
| PRD | `./_bmad-output/planning-artifacts/prd.md` |
| Epics | `./_bmad-output/planning-artifacts/epics.md` |
| Architecture | `./_bmad-output/planning-artifacts/architecture.md` |
| Product Brief | `./_bmad-output/planning-artifacts/product-brief.md` |
| Project Context | `./_bmad-output/planning-artifacts/project-context.md` |
| Gap Analysis | `./_bmad-output/planning-artifacts/bmad-gap-analysis.md` |
| Sprint Status | `./_bmad-output/implementation-artifacts/sprint-status.yaml` |
| Dev Stories | `./_bmad-output/implementation-artifacts/<story-id>.md` |
