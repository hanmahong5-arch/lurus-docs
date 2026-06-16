---
title: Manuel CLI Lumen
description: Toutes les sous-commandes, options, codes de sortie et l’échafaudage de workflows de lumen-cli.
---

<div class="lumen-page">

# Manuel CLI Lumen <StatusBadge status="dev" />

`lumen-cli` est la CLI optionnelle de Lumen (compilée en Rust), offrant des capacités de workflow en ligne de commande sans dépendre du SDK Python.

## Installation

```bash
cargo install lumen-cli
# 或
curl -fsSL https://lumen.lurus.cn/install.sh | sh
```

## Vue d’ensemble

```
lumen <command> [options]
```

| Commande | Usage |
|------|------|
| `doctor` | Auto-diagnostic de l’environnement : Token, réseau, disque, dépendances Python |
| `init` | Génère un modèle de configuration `lumen.yaml` à la racine du projet |
| `agent` | Opérations au niveau Agent : liste / trace / replay / export |
| `mcp` | Couche de compatibilité MCP : expose les capacités de Lumen à Claude/Codex |
| `workflow` | Exécuteur de workflows basé sur `lumen.yaml` |
| `deploy` | Pousse les définitions d’Agent vers le Kova Cluster |
| `config` | Consulte/modifie la configuration locale de la CLI |

## Détail des commandes

```bash
# doctor — 环境自检（退出码 0 全通过 / 1 至少一项失败）
lumen doctor
#   ✓ LURUS_API_KEY present  ✓ python3.11 detected  ✓ /var/lumen writable (5.2 GB free)
#   ✗ port 7070 occupied — close the process or set LUMEN_PORT

# init — 项目根生成 lumen.yaml（templates: langgraph / bare / multi-agent）
lumen init --template langgraph

# agent
lumen agent list                  # 列出本地/远端 Agent
lumen agent trace <run-id>        # 打印 trace 树
lumen agent replay <run-id>       # 不消耗 Token 重放
lumen agent export <run-id>       # 导出 JSON / HAR / OTel

# mcp — 启动 MCP 服务端，暴露 Trace/Replay/Cost 为工具
lumen mcp serve --port 3333       # 或 --manifest ./my-tools.yaml
# Claude Code / Codex 的 mcp_servers 指向 http://127.0.0.1:3333 即可调用

# workflow — 按 lumen.yaml 执行多 Agent 编排
lumen workflow run                # 默认 pipeline；-e prod 指定环境；--dry-run 不实际调 LLM

# deploy — 推送 Agent 定义到 Kova Cluster
lumen deploy --target kova://my-cluster

# config
lumen config get api_key
lumen config set api_key sk-xxxx
lumen config unset telemetry.endpoint
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">replay et dry-run ne coûtent rien</p>
    <div class="lurus-callout__body"><code>lumen agent replay &lt;run-id&gt;</code> rejoue à partir de l’historique, <strong>sans consommer de Token</strong> ; <code>lumen workflow run --dry-run</code> parcourt tout le processus d’orchestration mais <strong>n’appelle pas réellement le LLM</strong>, idéal pour valider la configuration <code>lumen.yaml</code>.</div>
  </div>
</div>

## Codes de sortie

| Code | Signification |
|------|------|
| `0` | Succès |
| `1` | Erreur générale |
| `2` | Erreur de paramètre |
| `3` | Configuration manquante |
| `4` | Erreur réseau |
| `5` | Le service distant a retourné une erreur |

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Retour à l\'introduction', link: '/fr/lumen/', primary: true },
  { text: 'SDK Python', link: '/fr/lumen/python-sdk' },
  { text: 'Intégration à l\'écosystème', link: '/fr/lumen/integration' },
]" />

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 18px 0; }
</style>
