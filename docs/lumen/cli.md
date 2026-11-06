---
title: Lumen CLI 手册
description: 真实子命令 — replay / cost / traces / dashboard / export / demo / pull / kova / tour。
---

<div class="lumen-page">

# Lumen CLI 手册 <StatusBadge status="alpha" />

`lumen` 是 Rust CLI + 本地 Web 面板，读磁盘上的 trace JSON（可选从 Kova pull）。**不是** Agent 运行时：没有 `lumen run` / `init` / `deploy` / `doctor`。

## 安装

禁止 `cargo install lumen-cli`（crates.io 无关包）。

```bash
curl -fsSL https://raw.githubusercontent.com/hanmahong5-arch/lumen/main/docs/install-cli.sh | bash
export PATH="$HOME/.local/bin:$PATH"
lumen --version
```

Windows：`irm https://raw.githubusercontent.com/hanmahong5-arch/lumen/main/docs/install-cli.ps1 | iex`

## 命令

| 命令 | 用途 |
|------|------|
| `demo` | 离线样例 lifecycle HTML；`--live` 需 Kova + LLM key |
| `replay <trace-id>` | 零 LLM 重放；`--from-step N` |
| `cost` | 花费报告 + outlier（`--format text\|json\|md`） |
| `traces` | 列出 `--trace-dir` 中的运行 |
| `export <run>` | 导出自包含 lifecycle HTML |
| `dashboard` | 本地 UI；Connected 需 `--kova-url` / `--netdata-url` |
| `metrics` | 无头 Netdata 指标 + ML anomaly |
| `pull` | 从 Kova 拉 trace（`--watch`） |
| `kova "<verb>"` | 白名单 Kova 控制动词（不是 shell） |
| `tour` | 多 run 索引 HTML |

```bash
lumen demo
lumen cost --last 24h --format md
lumen export abc123
lumen dashboard --kova-url http://127.0.0.1:3010 --api-key "$LUMEN_KOVA_API_KEY"
```

## 下一步

<NextSteps :steps="[
  { text: '总览', link: '/lumen/', primary: true },
  { text: '快速开始', link: '/lumen/quickstart' },
  { text: '集成', link: '/lumen/integration' },
]" />

</div>
