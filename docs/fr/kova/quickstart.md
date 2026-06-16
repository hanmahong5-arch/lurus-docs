---
title: Démarrage rapide Kova
description: Lancez votre premier agent Kova en 5 minutes, un guide complet de l’installation à l’exécution.
---

<div class="kova-qs-page">

# Démarrage rapide <StatusBadge status="dev" />

Lancez votre premier agent Kova en 5 minutes.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 minutes</span><span class="lurus-stat__label">Durée estimée</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 méthodes</span><span class="lurus-stat__label">Modes d’installation</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Zéro</span><span class="lurus-stat__label">Dépendance externe</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prérequis</p>
    <div class="lurus-callout__body">Docker ou Rust 1.93+ (au choix) · Lurus <Term t="API Key">API Key</Term> (<a href="/fr/guide/get-api-key">comment l’obtenir</a>) · 8 Go+ de mémoire (recommandé) · connaissances de base du terminal. Durée estimée : 5 minutes.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package" :size="14" /> Installation</span>
  <h2 class="lurus-section-head__title">Installer Kova</h2>
  <p class="lurus-section-head__lede">Docker (recommandé), binaire précompilé ou compilation depuis les sources, au choix.</p>
</div>

<CodeShowcase
  title="Choisissez une méthode d’installation"
  :tabs="[
    { lang: 'bash', label: 'Docker (recommandé)', code: 'docker run -d \\\n  --name kova \\\n  -p 8080:8080 \\\n  -v kova-data:/data \\\n  -e LURUS_API_KEY=sk-your-key \\\n  ghcr.io/hanmahong5-arch/kova:latest' },
    { lang: 'bash', label: 'Binaire précompilé', code: '# Linux / macOS\nchmod +x kova-linux-amd64\n./kova-linux-amd64 serve --port 8080' },
    { lang: 'bash', label: 'Compilation depuis les sources', code: 'git clone https://github.com/hanmahong5-arch/agentdrq.git\ncd agentdrq\n\n# 使用 pure-rust 特性（无系统依赖）\ncargo build --workspace --no-default-features --features pure-rust --release' },
  ]"
/>

Téléchargez les binaires précompilés depuis [GitHub Releases](https://github.com/hanmahong5-arch/agentdrq/releases) :

| Plateforme | Fichier |
|------|------|
| Linux x86_64 | `kova-linux-amd64` |
| macOS (Apple Silicon) | `kova-darwin-arm64` |
| macOS (Intel) | `kova-darwin-amd64` |
| Windows | `kova-windows-amd64.exe` |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Version de Rust requise</p>
    <div class="lurus-callout__body">Kova requiert Rust 1.93+ (Edition 2024). Il est recommandé d’utiliser rustup pour gérer la chaîne d’outils.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Configuration</span>
  <h2 class="lurus-section-head__title">Configuration</h2>
</div>

Créez le fichier de configuration `kova.toml` :

```toml
[server]
port = 8080
data_dir = "./data"

[llm]
# 通过 Lurus API 接入所有模型
provider = "openai-compatible"
base_url = "https://api.lurus.cn/v1"
api_key = "sk-your-lurus-key"
default_model = "deepseek-chat"

[wal]
# WAL 持久化配置
enabled = true
sync_mode = "normal"  # "normal" | "full" (每次写入 fsync)

[security]
# 可选：启用 WAL 加密
# encrypt = true
# encrypt_algorithm = "aes-256-gcm"
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> Prise en main</span>
  <h2 class="lurus-section-head__title">Lancez votre premier agent</h2>
  <p class="lurus-section-head__lede">REST / SDK Rust / CLI au choix : créez un agent, envoyez une tâche, suivez l’exécution en flux.</p>
</div>

Une fois démarré, choisissez le mode d’accès qui vous convient pour créer et exécuter votre premier agent (liste complète des points de terminaison dans la [référence API](/fr/kova/api)).

:::tabs
== REST API

1. **Créer un agent** — `POST /api/v1/agents`, la réponse contient `id="agt_a1b2c3d4"` et `status="idle"`

```bash
curl -X POST http://localhost:8080/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{ "name": "researcher", "system_prompt": "你是一个专业的技术研究员，深入分析主题并给出结构化研究报告。", "model": "deepseek-chat", "tools": ["web_search", "file_write"] }'
```

2. **Envoyer une tâche** — `POST /api/v1/agents/{id}/tasks`, la réponse contient `task_id="tsk_e5f6g7h8"` et `status="running"`

```bash
curl -X POST http://localhost:8080/api/v1/agents/agt_a1b2c3d4/tasks \
  -H "Content-Type: application/json" \
  -d '{ "message": "研究 Rust 在 AI 基础设施中的应用趋势，输出一份 500 字的报告" }'
```

3. **Consulter / suivre en flux** — `GET /api/v1/tasks/{id}` ou suivez l’exécution en temps réel via WebSocket

```bash
curl http://localhost:8080/api/v1/tasks/tsk_e5f6g7h8
wscat -c ws://localhost:8080/api/v1/tasks/tsk_e5f6g7h8/stream
```

== Rust SDK

Embarquez le moteur Kova directement dans le processus, avec récupération automatique depuis le WAL local après un plantage :

```rust
use kova::prelude::*;

let engine = KovaBuilder::new()
    .wal_dir("./agent-state")
    .build()?;

let agent = engine.create_agent("researcher")
    .model("deepseek-chat")
    .tools(&["web_search", "file_read"])
    .build()?;

// Agent 崩溃 → 从 WAL 自动恢复，不重调 LLM
agent.run("帮我调研 WASM Component Model").await?;
```

== CLI

Kova intègre une TUI (interface interactive en terminal) et une ligne de commande :

```bash
# 启动 TUI
kova tui

# 或直接用 CLI 命令
kova agent create --name researcher --model deepseek-chat
kova agent run researcher "分析 Rust 在 AI 领域的应用"
kova agent list
kova agent logs researcher --tail 50
```
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Workflow</span>
  <h2 class="lurus-section-head__title">Créer un workflow</h2>
</div>

Un workflow enchaîne plusieurs étapes en un pipeline d’exécution ordonné (les valeurs sont passées entre les étapes via des variables de modèle, exemple ci-dessous) :

```bash
curl -X POST http://localhost:8080/api/v1/workflows \
  -H "Content-Type: application/json" \
  -d '{ "name": "content-pipeline", "steps": [
    { "name": "research", "agent": "researcher", "prompt": "研究主题：{{input.topic}}" },
    { "name": "write", "agent": "writer", "prompt": "基于研究报告撰写博客：\n{{steps.research.output}}" },
    { "name": "review", "agent": "editor", "prompt": "审校并优化：\n{{steps.write.output}}" }
  ] }'

# 触发
curl -X POST http://localhost:8080/api/v1/workflows/content-pipeline/run \
  -H "Content-Type: application/json" -d '{"input": {"topic": "边缘计算与 AI 推理"}}'
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="database-backup" :size="14" /> Persistance</span>
  <h2 class="lurus-section-head__title">Vérifier la persistance</h2>
  <p class="lurus-section-head__lede">Tuez le processus : après redémarrage, la tâche reprend automatiquement depuis son point d’interruption dans le WAL.</p>
</div>

Testez la capacité de récupération après plantage de Kova :

<ol class="lurus-steps">
<li>

**Démarrer une tâche longue**

```bash
kova agent run researcher "写一份 5000 字的深度报告"
```

</li>
<li>

**Pendant l’exécution de la tâche, terminer le processus de force**

```bash
kill -9 $(pgrep kova)
```

</li>
<li>

**Redémarrer Kova**

```bash
./kova serve
```

</li>
<li>

**Consulter l’état de la tâche** — reprise automatique depuis le point d’interruption

```bash
kova task status
```

</li>
</ol>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Pourquoi la récupération est possible</p>
    <div class="lurus-callout__body">Avant chaque étape, le <Term t="WAL">WAL</Term> est écrit en premier (avec contrôle CRC32). En cas de plantage du processus, les étapes dont l’achèvement n’a pas été confirmé sont rejouées depuis leur point d’interruption après redémarrage — sans rappeler le LLM ni perdre de progression. Voir les <a href="/fr/kova/concepts">concepts clés</a>.</div>
  </div>
</div>

---

## Étapes suivantes

<NextSteps
  :steps="[
    { text: 'Concepts clés — comprendre en profondeur l\'architecture Agent, Workflow et WAL', link: '/fr/kova/concepts', primary: true },
    { text: 'Référence API — liste complète des points de terminaison de l\'API REST', link: '/fr/kova/api' },
    { text: 'Lurus API — découvrir la passerelle LLM sous-jacente', link: '/fr/guide/introduction' },
  ]"
/>

</div>
