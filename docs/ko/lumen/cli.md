---
title: Lumen CLI Manual
description: Real lumen subcommands — replay, cost, traces, dashboard, export, demo, pull, kova, tour.
---

<div class="lumen-page">

# Lumen CLI Manual <StatusBadge status="alpha" />

The `lumen` binary is a Rust CLI + local web dashboard. It reads trace JSON from disk (and optionally pulls from Kova). It is **not** an agent runtime: there is no `lumen run`, `lumen init`, `lumen deploy`, or `lumen doctor`.

## Installation

Do **not** `cargo install lumen-cli` — that crates.io name is an unrelated third-party package.

```bash
curl -fsSL https://raw.githubusercontent.com/hanmahong5-arch/lumen/main/docs/install-cli.sh | bash
export PATH="$HOME/.local/bin:$PATH"
lumen --version
```

Windows: `irm https://raw.githubusercontent.com/hanmahong5-arch/lumen/main/docs/install-cli.ps1 | iex`

Pin a release: `LUMEN_VERSION=lumen-cli-v0.3.2 bash docs/install-cli.sh`

## Commands

```
lumen <command> [options]
```

| Command | Purpose |
|------|------|
| `demo` | Offline sample lifecycle HTML (no Kova / API key). `--live` needs Kova + LLM key |
| `replay <trace-id>` | Zero-LLM replay from trace JSON. `--from-step N` starts mid-run |
| `cost` | Spend report + per-run outliers (`--last 24h`, `--format text\|json\|md`) |
| `traces` | List agent runs in `--trace-dir` (default `./traces`) |
| `export <run>` | One run → self-contained lifecycle `.html` |
| `dashboard` | Local web UI; Connected tabs need `--kova-url` / `--netdata-url` |
| `metrics` | Headless Netdata metrics + ML anomaly snapshot |
| `pull` | Fetch traces from Kova (`--watch` = live sync) |
| `kova "<verb>"` | One-shot whitelisted Kova control verb (not a shell) |
| `tour` | Assemble a multi-run index HTML |

## Examples

```bash
lumen demo
lumen traces --trace-dir ./traces
lumen cost --last 24h --format md
lumen replay abc123 --from-step 3
lumen export abc123
lumen dashboard --kova-url http://127.0.0.1:3010 --api-key "$LUMEN_KOVA_API_KEY"
lumen pull --kova-url http://127.0.0.1:3010 --watch
lumen kova "agents"
lumen kova "agent foo delete" --yes   # destructive verbs need --yes
```

## Connected notes

- API keys stay server-side (`LUMEN_KOVA_API_KEY` / `KOVA_API_KEY`); never sent to the browser.
- Prefer `127.0.0.1` over `localhost` on Windows (IPv6 `::1` surprises).
- Background sync default interval is 5s (`--sync-interval`, `--no-sync`).

## Exit behavior

Unknown subcommands fail at clap parse time. Transport / missing-trace errors print to stderr and exit non-zero. There is no special `doctor` exit-code table.

## Next steps

<NextSteps :steps="[
  { text: 'Overview', link: '/en/lumen/', primary: true },
  { text: 'Quick start', link: '/en/lumen/quickstart' },
  { text: 'Integrations', link: '/en/lumen/integration' },
]" />

</div>
