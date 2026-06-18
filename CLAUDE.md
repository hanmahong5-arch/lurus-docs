# lurus-docs (2l-bs-docs)

平台统一文档站（覆盖 Lurus API / Switch 等产品线）。Lurus 内部基建。VitePress 1.6 + Bun + nginx:alpine。domain `docs.lurus.cn`，ns/port `lurus-docs`/80。Deploy: push main → GHA sync+build → GHCR → ArgoCD。

## Commands

```bash
bun install
bun run dev         # :5173
bun run sync        # ../2b-svc-newapi/docs/openapi/relay.json → docs/api/overview.md
bun run build       # → docs/.vitepress/dist/
bun run preview
bun run deploy      # sync + build (Docker push by CI)
```

> 真源/细节: 模型目录 `data/models.yaml`(改后 `bun run sync` rebuild) · API endpoints 由 `scripts/sync.ts` 从 newapi `relay.json` 生成(`<!-- sync:endpoints -->` 标记区会被覆盖；`未实现` tag 跳过) · CI 触发: push main / Mon 02:00 UTC / workflow_dispatch。
