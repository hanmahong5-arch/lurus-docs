# i18n translation pipeline

Turns the one-time multilingual translation effort into a **maintainable asset**:
when the Chinese (zh) source changes, you find out which translations now lag —
instead of them silently rotting.

## Model

- **zh is the source of truth.** It lives at the site root (`docs/**`). The five
  translations (`en`/`ja`/`ko`/`es`/`fr`) live under `docs/<locale>/**`.
- Translated **data overlays** (`docs/.vitepress/data/i18n-data.ts`,
  `i18n-pages-data.ts`) are generated artifacts derived from the zh data
  source-of-truth: `products.ts` + `glossary.ts` → `i18n-data.ts`;
  `glossary.ts` + `models.yaml` + `integrations.ts` → `i18n-pages-data.ts`.
- **`docs/.vitepress/data/i18n-manifest.json`** records the git blob SHA of every
  zh source at the moment its translations were last re-baselined. git already
  content-addresses every file, so this is exact and reproducible — no custom
  hashing.

## Commands

```bash
bun run i18n:check      # report stale / orphaned / untranslated pages (exit 0)
bun run i18n:check --strict   # same, but exit 1 if any page is stale (gate)
bun run i18n:manifest   # re-baseline: snapshot current HEAD zh SHAs into the manifest
```

## Workflow when zh content changes

1. Edit the zh source (`docs/**/*.md`, or `products.ts` / `glossary.ts` / …).
2. Re-translate the affected locale files / regenerate the overlays.
   *Translation itself is an LLM fan-out — not a committed script. Extract the zh
   strings, translate, write the locale `.md` / regenerate the `.ts` overlays.*
3. Run `bun run i18n:manifest` to re-baseline, then commit translations **and** the
   updated manifest together. The manifest diff is an auditable record of what
   was re-synced.

`bun run i18n:check` runs in CI (`.github/workflows/i18n-check.yml`) on every PR
that touches `docs/**` and prints the report into the checks UI. It is
non-blocking by default; flip it to `--strict` once the team wants stale
translations to fail a PR.

## Not tracked on purpose

`docs/admin/**` (internal SPA) and `docs/updates/**` (changelog feed) are excluded
from coverage gaps — they are intentionally zh-only.
