---
title: Concepts fondamentaux de Kova
description: Les composants architecturaux fondamentaux de Kova — WAL, Agent Loop, Checkpoint — et sa philosophie de conception.
---

<div class="kova-concepts">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> Concepts fondamentaux</span>
  <h1 class="lurus-section-head__title">Concepts fondamentaux de Kova</h1>
  <p class="lurus-section-head__lede">D’Agent, Workflow et Swarm jusqu’à la persistance WAL — comprendre les composants architecturaux fondamentaux de Kova et sa philosophie de conception.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3μs</span><span class="lurus-stat__label">Latence d’ordonnancement</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">315K</span><span class="lurus-stat__label">ops/s de débit</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">21</span><span class="lurus-stat__label">crates du workspace</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">&lt;10MB</span><span class="lurus-stat__label">Binaire unique</span></div>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--kova" href="#agent"><span class="lurus-card__icon"><Icon name="bot" :size="22" /></span><div class="lurus-card__title">Agent</div><p class="lurus-card__body">Unité d’exécution de base : Prompt + Model + Tools + Memory</p></a>
  <a class="lurus-card lurus-card--kova" href="#workflow"><span class="lurus-card__icon"><Icon name="workflow" :size="22" /></span><div class="lurus-card__title">Workflow</div><p class="lurus-card__body">Orchestre plusieurs Agents en un pipeline d’exécution ordonné</p></a>
  <a class="lurus-card lurus-card--kova" href="#swarm-intelligence-collective"><span class="lurus-card__icon"><Icon name="network" :size="22" /></span><div class="lurus-card__title">Swarm</div><p class="lurus-card__body">Collaboration autonome de plusieurs Agents, communication directe via le protocole A2A</p></a>
  <a class="lurus-card lurus-card--kova" href="#wal-write-ahead-log"><span class="lurus-card__icon"><Icon name="database-backup" :size="22" /></span><div class="lurus-card__title">WAL</div><p class="lurus-card__body">Journal d’écriture anticipée + contrôle CRC32, récupération automatique après crash</p></a>
</div>

---

## Agent

L’Agent est l’unité d’exécution de base, composée des éléments suivants :

| Élément | Description |
|------|------|
| **<Term t="System Prompt">System Prompt</Term>** | Définit le rôle de l’Agent, les limites de ses capacités et ses règles de comportement |
| **Model** | Le modèle LLM utilisé (commutable à l’exécution) |
| **Tools** | L’ensemble d’outils que l’Agent peut appeler |
| **Memory** | L’historique de conversation et l’état persistant de l’Agent |

### Cycle de vie de l’Agent

<ArchitectureDiagram title="Machine à états de l’Agent" chart="graph LR
  Created --> Idle
  Idle --> Running
  Running --> Completed
  Running --> Paused
  Running --> Failed
  Running --> Recovering
  Paused -.reprise.-> Running
  Recovering -.rejouer WAL.-> Running" />

| État | Signification |
|------|------|
| **Idle** | Agent créé, en attente d’une tâche |
| **Running** | Exécution d’une tâche en cours |
| **Paused** | Mis en pause manuellement, reprise possible |
| **Completed** | Tâche terminée |
| **Failed** | Échec de l’exécution (nombre de tentatives dépassé) |
| **Recovering** | Enregistrement WAL incomplet détecté, récupération automatique |

### Boucle de décision de l’Agent

<ArchitectureDiagram title="Boucle de décision" chart="graph LR
  A[Réception de la tâche / résultat de l’étape précédente] --> B[Raisonnement LLM<br/>analyse + planification]
  B --> C{Un outil est-il nécessaire ?}
  C -->|Yes| D[Appel de l’outil] --> E[Résultat de l’outil] --> B
  C -->|No| F[Génération de la réponse finale] --> G[Renvoi du résultat]" />

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Chaque tour est écrit sur disque</p>
    <div class="lurus-callout__body">Chaque tour de décision est écrit dans le WAL, garantissant qu’après un crash, l’exécution peut reprendre depuis le point d’arrêt sans avoir à rappeler le LLM.</div>
  </div>
</div>

---

## Workflow

Le Workflow orchestre plusieurs Agents ou étapes en un pipeline d’exécution ordonné.

### Types d’étapes

| Type | Description |
|------|------|
| **Étape Agent** | Déléguée à un Agent désigné pour exécution |
| **Branche conditionnelle** | Choisit un chemin différent selon le résultat de l’étape précédente |
| **Étape parallèle** | Plusieurs étapes s’exécutent simultanément |
| **Étape d’attente** | Attend un événement externe ou une approbation manuelle |
| **Étape en boucle** | Répète l’exécution jusqu’à ce qu’une condition soit satisfaite |

### Transmission des données

Les données sont transmises entre les étapes via des variables de modèle :

```
{{input.topic}}              → 工作流输入参数
{{steps.research.output}}    → "research" 步骤的输出
{{steps.research.metadata}}  → "research" 步骤的元数据
```

### Gestion des erreurs

Chaque étape peut configurer une stratégie d’erreur indépendante :

| Stratégie | Comportement |
|------|------|
| `retry` | Réessaie N fois (3 par défaut, backoff exponentiel) |
| `skip` | Ignore l’étape en échec et continue l’exécution |
| `abort` | Termine l’ensemble du workflow |
| `fallback` | Bascule vers une étape de secours |

---

## <Term t="Swarm">Swarm</Term> (intelligence collective)

Le mode Swarm permet à plusieurs Agents de collaborer de façon autonome, sans flux fixe prédéfini.

### Fonctionnement

<ArchitectureDiagram title="Flux de collaboration Swarm" chart="graph LR
  U[Tâche utilisateur] --> C[Agent coordinateur]
  C --> S[Décomposition en sous-tâches]
  S --> R[Agent de recherche]
  S --> D[Agent de codage]
  S --> T[Agent de test]
  R --> M[Collecte des résultats]
  D --> M
  T --> M
  M --> O[Sortie synthétisée]" />

Les Agents communiquent directement entre eux via le protocole <Term t="A2A">A2A (Agent-to-Agent)</Term> :

```json
{
  "from": "coordinator",
  "to": "researcher",
  "type": "task_delegate",
  "payload": {
    "task": "调研 WebAssembly 在服务端的性能基准",
    "constraints": {
      "max_tokens": 2000,
      "deadline": "5min"
    }
  }
}
```

---

## <Term t="WAL">WAL</Term> (Write-Ahead Log)

Le WAL est le mécanisme central de persistance de Kova, inspiré de la conception des systèmes de bases de données.

### Processus d’écriture

<ArchitectureDiagram title="Processus d’écriture WAL" chart="graph LR
  A[Changement d’état de l’Agent] --> B[Sérialisation + CRC32<br/>calcul de la somme de contrôle]
  B --> C[Écriture dans le fichier WAL<br/>journal d’abord]
  C --> D[Exécution de l’opération réelle]
  D --> E[Marquage WAL terminé<br/>confirmation du commit]" />

### Processus de récupération

Au démarrage, le WAL est automatiquement scanné pour récupérer les opérations incomplètes :

<ol class="lurus-steps">
<li>Enregistrements terminés —— <strong>ignorés</strong>.</li>
<li>Échec du contrôle CRC32 —— <strong>marqués comme corrompus et ignorés</strong>.</li>
<li>Enregistrements incomplets —— <strong>réexécutés</strong>.</li>
</ol>

### <Term t="Ring Buffer">Tampon circulaire</Term>

Le WAL utilise un tampon circulaire dont la taille est une puissance de 2 :

- Le pointeur d’écriture revient au début lorsqu’il atteint la fin
- Les anciens enregistrements confirmés sont écrasés par les nouveaux
- Une compaction est déclenchée lorsque le tampon est plein

### Modes de synchronisation

| Mode | Description | Performance | Durabilité |
|------|------|------|--------|
| `normal` | Le système d’exploitation décide quand effectuer le fsync | Élevée | Quelques secondes de données peuvent être perdues |
| `full` | fsync à chaque écriture | Faible | Aucune perte de données |

### Options de chiffrement

Dans les scénarios sensibles, le chiffrement du WAL peut être activé :

| Algorithme | Description |
|------|------|
| `aes-256-gcm` | Chiffrement AES-256 standard |
| `sm4` | Algorithme national chinois SM4 |

Un contrôle d’intégrité HMAC peut également être activé pour empêcher toute altération du fichier WAL.

---

## Ordre de verrouillage

Kova utilise en interne un ordre strict d’acquisition des verrous, éliminant fondamentalement les interblocages :

<ArchitectureDiagram title="Ordre d’acquisition des verrous" chart="graph LR
  A[Buffer Lock] --> B[Queue Lock] --> C[Transaction Lock]" />

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prévention des interblocages à la compilation</p>
    <div class="lurus-callout__body">Tous les chemins de code doivent respecter cet ordre. Toute tentative d’acquisition de verrous en violant l’ordre déclenche une vérification à la compilation (garantie par le système de types de Rust).</div>
  </div>
</div>

---

## Système d’outils

### Outils intégrés

| Outil | Fonction |
|------|------|
| `web_search` | Recherche sur Internet |
| `file_read` | Lecture de fichiers |
| `file_write` | Écriture de fichiers |
| `http_request` | Envoi de requêtes HTTP |
| `shell_exec` | Exécution de commandes Shell (environnement sandbox) |
| `db_query` | Requêtes de base de données |

### Outils MCP

Connectez des services d’outils externes via le [Model Context Protocol](https://modelcontextprotocol.io/) :

```toml
# kova.toml
[[mcp.servers]]
name = "github"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
env = { GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_xxx" }

[[mcp.servers]]
name = "postgres"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-postgres"]
env = { DATABASE_URL = "postgres://..." }
```

L’Agent peut appeler les outils MCP comme s’il s’agissait d’outils intégrés.

### Protocole A2A

Protocole de communication Agent-to-Agent, qui prend en charge :

- **Délégation de tâches** : un Agent confie une sous-tâche à un autre
- **Requête d’informations** : les Agents échangent directement des informations
- **Notification de résultat** : notification de l’initiateur une fois la tâche terminée
- **Découverte de capacités** : interroger ce que les autres Agents peuvent faire

---

## Niveaux de fonctionnalités

Kova contrôle la portée de la compilation à l’aide des feature flags de Rust. Une compilation minimale ne nécessite que `pure-rust`, à laquelle s’ajoutent selon les besoins : `serde` (sérialisation), `workflow` (orchestration de workflows) → `agent` (moteur d’Agent) → `swarm` (intelligence collective), `encrypt` (chiffrement) → `sm4` (cryptographie nationale chinoise) / `wal-hmac` (contrôle d’intégrité), etc.

---

## Étapes suivantes

<NextSteps title="Étapes suivantes" :steps="[
  { text: 'Démarrage rapide — lancez votre premier Agent en 5 minutes', link: '/fr/kova/quickstart', primary: true },
  { text: 'Référence API — documentation complète des endpoints REST', link: '/fr/kova/api' },
  { text: 'Moteur de mémoire MemX — ajoutez une mémoire persistante à vos Agents', link: '/fr/memx/' },
]" />

<RelatedProducts product-id="kova" />

</div>

<style scoped>
.kova-concepts .lurus-stat-strip {
  margin: 1.5rem 0 2rem;
}
.kova-concepts .lurus-cards--compact {
  margin-bottom: 0.5rem;
}
</style>
