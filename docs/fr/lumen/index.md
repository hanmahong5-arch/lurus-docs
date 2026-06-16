---
title: Lumen — Observabilité et fiabilité pour les agents
description: SDK Python d’abord + moteur Rust + CLI optionnelle, pour offrir aux développeurs d’agents observabilité, débogage et garanties de fiabilité.
---

<div class="lumen-page">

<ProductHero product-id="lumen" />

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prérequis</p>
    <div class="lurus-callout__body"><ul><li>Recommandé : Python 3.9+ (<code>pip install lumen-ai</code>)</li><li>CLI optionnelle : compilation de <code>lumen-cli</code> depuis les sources avec Rust 1.93+</li><li>Une <Term t="API Key">API Key</Term> Lurus (<a href="/fr/guide/get-api-key">comment l’obtenir</a>)</li></ul></div>
  </div>
</div>

## Qu’est-ce que Lumen ?

**Lumen** est un **outil de fiabilité trois-en-un** destiné aux développeurs d’agents IA — Replay (relecture à coût zéro) + Crash Recovery (<Term t="Checkpoint">récupération après crash</Term> à l’échelle de la microseconde) + Cost Tracking (suivi des coûts en temps réel). **Formes de livraison** : SDK Python d’abord (`pip install lumen-ai`, premier choix pour LangGraph/agents) + moteur Rust (`lumen-core`, socle de performance) + CLI optionnelle (`lumen-cli` v0.1.0). Philosophie : *Illuminate your AI agents. Never lose a run. Never burn tokens blindly.*

```python
pip install lumen-ai

from lumen_ai import LumenTracer, LumenCheckpointer, CostTracker

# 三行代码接入 — LangGraph 原生集成
graph = workflow.compile(
    checkpointer=LumenCheckpointer(),   # 崩溃恢复
    callbacks=[LumenTracer()]            # 执行追踪 + 成本追踪
)
```

Propulsé par le moteur Rust sous-jacent (lumen-core), le SDK Python offre une interface conviviale et relie le [moteur d’agents Kova](/fr/kova/) à l’écosystème Python.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3 lignes</span><span class="lurus-stat__label">d’intégration LangGraph</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">microseconde</span><span class="lurus-stat__label">récupération après crash</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">30+</span><span class="lurus-stat__label">tarifs de modèles</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">v0.1.0</span><span class="lurus-stat__label">lumen-cli</span></div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Capacités clés</span>
  <h2 class="lurus-section-head__title">Fiabilité trois-en-un</h2>
  <p class="lurus-section-head__lede">Replay, récupération, coûts — tout est prêt en une seule intégration.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-lumen)"
  :items="[
    { title: 'Replay — relecture déterministe à coût zéro', icon: 'rewind', body: 'Rejouez n\'importe quelle exécution depuis un trace JSON, sans appeler le LLM ni dépenser, et démarrez à une étape précise pour localiser le problème. lumen replay TRACE_ID (complet) / --from 5 (à partir de la 5e étape).' },
    { title: 'Crash Recovery — récupération après crash à l\'échelle de la microseconde', icon: 'life-buoy', body: 'Implémentation complète du CheckpointSaver de LangGraph, remplaçant direct du Checkpointer natif SQLite/Redis. Double couche mémoire+disque, écriture atomique, récupération par relecture du WAL au niveau du moteur, sans aucune dépendance à un service externe.' },
    { title: 'Cost Tracking — suivi des coûts en temps réel', icon: 'coins', body: 'Table de tarifs intégrée pour plus de 30 modèles (Claude / GPT-4o / Gemini / Llama / DeepSeek), estimation possible même quand le LLM ne renvoie pas le coût. Alerte automatique quand un appel dépasse 2x la moyenne. lumen cost --last 24h / lumen traces.' },
  ]"
/>

### Autres fonctionnalités

| Fonctionnalité | Description |
|------|------|
| **Gestion des agents** | Créer, démarrer, arrêter, supprimer des agents |
| **Débogage des workflows** | Exécuter les workflows en local, déboguer pas à pas |
| **Consultation des logs** | Consulter en temps réel les logs d’exécution de l’agent |
| **Déploiement** | Déployer l’agent vers une instance cloud Kova |
| **Gestion MCP** | Installer et configurer les services d’outils MCP |
| **REPL interactif** | Dialoguer directement avec l’agent dans le terminal |

---

## Installation

```bash
pip install lumen-ai                          # Python SDK（推荐）
curl -fsSL https://get.lurus.cn/lumen | sh    # CLI macOS/Linux
# Windows (PowerShell): irm https://get.lurus.cn/lumen.ps1 | iex
# 从源码（Rust 1.93+，首次编译约 2-3 分钟）：
git clone https://github.com/hanmahong5-arch/lumen.git && cd lumen && cargo build --release
# 二进制在 target/release/lumen
```

Vérification : `lumen --version` (→ `lumen 0.1.0`) ; `lumen doctor` (vérifie Lurus API connected / Kova optional).

---

## Prise en main rapide

```bash
# 初始化项目（结构: agent.toml / prompts/system.md / tools/search.yaml / workflows/main.yaml）
lumen init my-agent && cd my-agent

# 配置 API Key
lumen auth login                              # 浏览器登录授权自动配置
lumen config set api_key sk-your-lurus-key    # 或直接设置

# 本地运行 Agent
lumen run --interactive                       # 交互模式
lumen run "分析这段代码的性能问题" --file ./main.py
lumen run "翻译这段文本" --model gpt-4o        # 指定模型

# 工作流调试
lumen workflow run main --input topic="AI trends"
lumen workflow run main --step-by-step        # 逐步调试（每步暂停）
lumen workflow history main --last            # 上次运行结果
```

---

## Commandes courantes

```bash
# Agent 管理
lumen agent list / create researcher / info researcher / logs researcher / delete researcher
# MCP 工具
lumen mcp list / install github / test github / remove github
# 部署
lumen deploy --target kova        # 或 --target docker
lumen deploy status
# 配置
lumen config list / set api_key xxx / get api_key
```

---

## Fichier de configuration

`agent.toml` est la configuration centrale d’un projet d’agent :

```toml
[agent]
name = "my-researcher"
model = "deepseek-chat"
max_iterations = 20

[agent.llm]
base_url = "https://api.lurus.cn/v1"
temperature = 0.7
max_tokens = 4096

[tools]
builtin = ["web_search", "file_read", "file_write"]

[[tools.mcp]]
name = "github"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]

[deploy]
target = "kova"
```

---

## Relation avec Kova

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen</div>
    <p class="lurus-card__body">Outil en ligne de commande pour les développeurs — développement local, débogage, déploiement. Runtime léger <code>lumen run</code>, opérationnel immédiatement.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">Moteur de runtime d’agents — exécution persistante, WAL, gestion de cluster. Après <code>lumen deploy</code>, vous obtenez une persistance et des capacités de cluster complètes.</p>
  </div>
</div>

Pour le développement local, utilisez le runtime léger (`lumen run`) ; après déploiement vers Kova (`lumen deploy`), vous obtenez une persistance et des capacités de cluster complètes.

---

## Comparaison avec d’autres solutions

<ComparisonTable
  self-label="Lumen"
  :competitors="['Temporal', 'LangGraph Checkpointer', 'Conductor']"
  :rows="[
    { dimension: 'Replay', self: 'relecture LLM à coût zéro', alt: { Temporal: 'Event replay', 'LangGraph Checkpointer': 'partiel', Conductor: 'Workflow replay' } },
    { dimension: 'Coût d\'intégration', self: '3 lignes de code', alt: { Temporal: 'Worker + SDK', 'LangGraph Checkpointer': 'configuration', Conductor: 'Worker' } },
    { dimension: 'Suivi des coûts', self: 'intégré', alt: { Temporal: 'aucun', 'LangGraph Checkpointer': 'aucun', Conductor: 'aucun' } },
  ]"
  title="Comparatif"
/>

---

## Produits associés et étapes suivantes

<NextSteps
  :steps="[
    { text: 'Démarrage rapide', link: '/fr/lumen/quickstart', primary: true },
    { text: 'Python SDK', link: '/fr/lumen/python-sdk' },
    { text: 'Manuel CLI', link: '/fr/lumen/cli' },
    { text: 'Intégrations et catalogue MCP', link: '/integrations/' },
    { text: 'Documentation officielle du protocole MCP', link: 'https://modelcontextprotocol.io/', external: true },
  ]"
  title="Étapes suivantes"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 20px 0 8px; }
.lumen-page .lurus-stat-strip { margin: 18px 0 4px; }
</style>
