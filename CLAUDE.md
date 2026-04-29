# lurus-docs (2l-bs-docs)

平台统一文档站。VitePress 静态站，覆盖 Lurus API / Switch / MemX 等产品线。

- Tech: VitePress 1.6 + Bun + nginx:alpine (prod)
- Plugins: `vitepress-plugin-llms` (llms.txt), `vitepress-plugin-tabs`
- Namespace/Port: `lurus-docs` / `80` (nginx)
- Domain: `docs.lurus.cn`
- Deploy: push main → GHA sync+build → GHCR → ArgoCD auto-sync

## Directory

```
docs/
├── .vitepress/
│   ├── config.ts         # Nav, sidebar, plugins
│   └── theme/            # Custom theme components
├── api/                  # Lurus API reference (overview auto-synced)
├── guide/                # API user guide + client integrations
├── lucrum/               # Lucrum quant docs (legacy gushen/ kept for redirects)
├── switch/               # Switch desktop docs
└── index.md
data/models.yaml          # Model catalog (source of truth for guide/models)
scripts/sync.ts           # relay.json → api/overview.md auto-sync
deploy/
├── k8s.yaml              # Deployment + Service + IngressRoute
└── pdb.yaml              # minAvailable: 1
```

## Commands

```bash
bun install
bun run dev         # http://localhost:5173
bun run sync        # ../lurus-api/docs/openapi/relay.json → docs/api/overview.md
bun run build       # → docs/.vitepress/dist/
bun run preview
bun run deploy      # sync + build (Docker push by CI)
```

## Content Notes

- **模型目录**: 编辑 `data/models.yaml` → `bun run sync` → rebuild。
- **API endpoints**: 由 `scripts/sync.ts` 从 `lurus-api/docs/openapi/relay.json` 生成；
  `docs/api/overview.md` 中 `<!-- sync:endpoints:start/end -->` 标记区下次 sync 会覆盖。
  带 `未实现` tag 的 endpoint 被跳过。

## CI Triggers

| When | Action |
|---|---|
| push main (docs/**, scripts/**, Dockerfile, deploy/**) | sync → build → GHCR → ArgoCD |
| Mon 02:00 UTC | same (keep endpoint list fresh) |
| workflow_dispatch | same (manual) |

## BMAD

| Resource | Path |
|---|---|
| PRD | `./_bmad-output/planning-artifacts/prd.md` |
| Epics | `./_bmad-output/planning-artifacts/epics.md` |
| Architecture | `./_bmad-output/planning-artifacts/architecture.md` |
| Sprint Status | `./_bmad-output/implementation-artifacts/sprint-status.yaml` |
