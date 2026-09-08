[中文](./README.zh-CN.md)

# Lurus Docs (2l-bs-docs)

Documentation site and internal knowledge base for the Lurus AI platform, for integrators and the engineers who operate it.

Lurus Docs is a VitePress static site (public, `docs.lurus.cn`) covering every Lurus product line — API, Kova, MemX, Lucrum, Switch, Creator, Lumen, Forge, Platform (`docs/`) — plus a Bun + Hono runtime server that serves the built bundle and a small JSON API for a self-hosted changelog. A second, separate VitePress build (`internal/`) is an internal-only knowledge base (ADRs, ops runbooks, a product-status dashboard) that is **not** part of the public build pipeline and must be built and verified independently.

Maturity: actively deployed to production (R1 Kubernetes, namespace `lurus-system`, `deploy/k8s.yaml`) and self-reports its own changelog on every CI deploy. The internal site's OIDC login (`deploy/internal-oidc/`) is fully designed but **never deployed** — production still runs plain HTTP Basic Auth (see that directory's own README). There is no automated test suite (see "Quick start" below).

## Core capabilities

- **Multi-locale product docs** — `zh-CN` at the site root, `en`/`ja`/`ko`/`es`/`fr` under `docs/<locale>/`, wired through a per-route allowlist so only pages that are actually translated get a locale-switcher entry (`docs/.vitepress/config.ts:11-43`).
- **Source-synced API reference** — `bun run sync` regenerates the endpoint list and schema tables in `docs/api/overview.md` / `docs/api/schemas.md` from a sibling repo's OpenAPI spec, and regenerates the model catalog from `data/models.yaml` (`scripts/sync.ts`).
- **Self-hosted changelog / updates feed** — a `bun:sqlite`-backed products/updates store with an admin CRUD API, a public read API, and an RSS feed generator (`server/db.ts`, `server/routes/{public,admin}.ts`, `scripts/gen-feed.ts`).
- **CI self-reporting** — every production deploy HMAC-signs and posts its own changelog entry back to itself via the webhook route (`.github/workflows/deploy.yml:108-121`, `server/routes/webhook.ts`).
- **Separate internal knowledge base** — ADRs, per-server ops runbooks, and a live dashboard, built with its own command and gated by a pre-build secret scanner (`internal/`, `scripts/secrets-guard.ts`).
- **i18n staleness detection** — a non-blocking CI check flags translated pages that have fallen behind the Chinese source (`scripts/i18n/check-stale.ts`, `.github/workflows/i18n-check.yml`).

## Quick start

```bash
bun install

# Public site
bun run dev             # VitePress dev server, http://localhost:5173
bun run sync             # regenerate docs/api/overview.md, schemas.md, model-catalog.ts from source data
bun run build             # → docs/.vitepress/dist/
bun run preview

# Internal knowledge base (separate site, separate build)
bun run dev:internal       # http://localhost:5174
bun run build:internal      # secrets-guard scan → build-meta injection → vitepress build

# Server (serves the built static site + JSON API)
bun run dev:server         # bun --watch server/index.ts, http://localhost:3000
bun run start                # production entrypoint

# i18n
bun run i18n:check           # report stale translations (non-blocking)
bun run i18n:manifest         # rebuild the translation manifest
```

`package.json` has no `test` script — CI instead runs an i18n-staleness report and a working-tree secret scan (`.github/workflows/i18n-check.yml`, `.github/workflows/secret-scan.yaml`).

### Docker

```bash
docker build -t lurus-docs .                # multi-stage: bun build → oven/bun:1-alpine runtime
docker run -p 3000:3000 \
  -e ADMIN_API_KEY=... -e WEBHOOK_SECRET=... -e INTERNAL_API_KEY=... \
  -v "$(pwd)/data:/data" lurus-docs
```

## Architecture

```
2l-bs-docs/
├── docs/                     # Public site (VitePress) — docs.lurus.cn
│   ├── <product>/            # kova/ memx/ lucrum/ switch/ creator/ lumen/ forge/ platform/ hub/ tally/ api/ ...
│   ├── {en,ja,ko,es,fr}/     # Translated trees, mirror the docs/ structure
│   ├── .vitepress/
│   │   ├── config.ts         # nav, sidebar, i18n locale wiring
│   │   ├── data/              # *.data.ts loaders + generated model-catalog.ts
│   │   └── theme/               # Vue components (Hero, ApiEndpoint, ModelPicker, AdminEditor, ...)
│   └── public/                 # favicon, feed.xml, static assets
├── internal/                   # Second VitePress site: ADRs, ops runbooks, cockpit dashboard
├── server/                     # Hono + Bun runtime: static serving + JSON API
│   ├── index.ts                 # entrypoint, /api/health, static + SPA fallback
│   ├── db.ts                     # bun:sqlite schema + queries (products, updates)
│   └── routes/{public,admin,internal,webhook}.ts
├── scripts/                    # sync.ts, gen-feed.ts, i18n/*, secrets-guard.ts, inject-build-meta.ts
├── data/models.yaml             # source of truth for the model catalog page
├── deploy/                      # k8s.yaml (R1 prod), docker-compose.{internal,staging}.yml, internal-oidc/ (designed, not live)
└── Dockerfile, Dockerfile.internal, Dockerfile.staging, Dockerfile.local
```

`deploy/docker-compose.staging.yml` and `deploy/docker-compose.internal.yml` run pre-production and tailnet-only copies of the site on a separate host, outside the R1 k8s deployment.

Deploy note: pushing to `main` builds a GHCR image and rewrites `deploy/k8s.yaml`'s image tag automatically, but the target cluster's ArgoCD has been disconnected from git since 2026-07-29 — a manual `kubectl -n lurus-system set image deploy/lurus-docs lurus-docs=ghcr.io/hanmahong5-arch/lurus-docs:main-<sha>` is currently required for a merged change to actually reach production.

## Configuration

Read by `server/`:

| Variable | Required | Default | Notes |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP listen port (`server/index.ts:35`) |
| `DB_PATH` | No | `/data/updates.db` | SQLite file for products/updates (`server/db.ts:4`) |
| `ADMIN_API_KEY` | To enable `/api/admin/*` | unset → routes return 503 | Bearer token, constant-time compare (`server/routes/admin.ts:18,31-33`) |
| `WEBHOOK_SECRET` | To enable `/api/webhook/deploy` | unset → 503 | HMAC-SHA256 secret verifying `X-Webhook-Signature` (`server/routes/webhook.ts:6,33`) |
| `INTERNAL_API_KEY` | To enable `/api/internal/*` | unset → 503 | Bearer token gating the internal markdown content API (`server/routes/internal.ts:5,22`) |

Read by CI (`.github/workflows/deploy.yml`): `GITHUB_TOKEN` (GHCR push + auto-commit), `DOCS_WEBHOOK_SECRET` (signs the self-report webhook call).

## API overview

Hono routes mounted in `server/index.ts:19-23`:

| Path | Auth | Purpose |
|---|---|---|
| `GET /api/health` | none | liveness/readiness probe |
| `GET /api/products`, `GET /api/updates`, `GET /api/updates/:id` | none | public read API for the changelog feed (`server/routes/public.ts`) |
| `/api/admin/*` | Bearer `ADMIN_API_KEY` | CRUD for products and updates (`server/routes/admin.ts`) |
| `GET /api/internal/verify`, `GET /api/internal/content/:slug` | Bearer `INTERNAL_API_KEY` | protected markdown content fetch, path-traversal guarded (`server/routes/internal.ts`) |
| `POST /api/webhook/deploy` | HMAC `X-Webhook-Signature` | creates a draft changelog entry; used by CI to self-report deploys (`server/routes/webhook.ts`) |

## Development conventions

From this repo's own developer-conventions doc and its CI wiring:

- Frontend tooling is Bun only (no npm/yarn/npx/node) — see `bun.lock`.
- The `<!-- sync:*:start/end -->` blocks in `docs/api/overview.md` / `docs/api/schemas.md` are generated by `scripts/sync.ts`; manual edits inside them are overwritten by the next sync.
- `data/models.yaml` is the single source of truth for the model catalog; edit it, then run `bun run sync` to regenerate `docs/.vitepress/data/model-catalog.ts`.
- To turn on a new locale, finish translating its core pages under `docs/<locale>/`, then add it to `ENABLED_LOCALES` in `docs/.vitepress/config.ts` — otherwise the switcher links 404.
- CI's own auto-commits (sync results, image-tag bumps) must include `[skip ci]` or they trigger a redeploy loop (`.github/workflows/deploy.yml:23,53,90`).
- `internal/` is a separate site with its own build (`bun run build:internal`) and is **not** exercised by `bun run build` — verify both when touching shared theme code (a past `internal/` build failure went undetected for months because it is tailnet-only and had no alert coverage).

## Related projects

- `2b-svc-newapi` — `scripts/sync.ts` reads `../2b-svc-newapi/docs/openapi/relay.json` (a relative sibling-repo path) to regenerate the API reference pages; the CI step tolerates a missing sibling (`continue-on-error: true`).
- Deploys into the shared `lurus-system` namespace on the R1 cluster alongside other platform services (`lurus.yaml:755-761`).

---

`package.json` declares `"license": "MIT"`; no `LICENSE` file is present in the repository root, so the terms have not been independently verified.
