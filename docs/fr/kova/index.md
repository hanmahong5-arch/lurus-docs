---
title: Kova — Moteur d’exécution persistante pour agents IA
description: Moteur d’exécution persistante WAL-First construit en Rust, qui reprend depuis le journal après une interruption du processus. Stade actuel : pilote précoce.
---

<div class="kova-page">

<ProductHero product-id="kova" />

## Qu’est-ce que Kova ?

**Kova** est l’infrastructure d’agents IA de Lurus : un moteur d’exécution persistante construit en Rust, qui résout la question de **savoir comment un agent peut s’exécuter de manière fiable sur de longues durées, restaurer son état après un crash et coordonner des workflows complexes**. Un agent qui ne s’exécute qu’en mémoire perd son état dès que le processus se termine ; Kova adopte une architecture orientée <Term t="WAL">WAL (Write-Ahead Log)</Term>, où chaque étape d’exécution est enregistrée de façon persistante, ce qui permet, même après un crash, de reprendre précisément au point d’interruption — sans rappeler le LLM, sans perdre la progression et sans générer de coûts supplémentaires.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Stade actuel</p>
    <div class="lurus-callout__body">Pilote précoce. Dans la configuration par défaut, Kova fonctionne avec un fichier WAL local, sans service externe tel que Redis / Postgres.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Capacités clés</span>
  <h2 class="lurus-section-head__title">Pourquoi choisir Kova</h2>
  <p class="lurus-section-head__lede">Persistance WAL-First, fonctionnement sur simple fichier local, quatre modes d’intégration.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-kova)"
  :items="[
    { title: 'Reprise après crash via WAL', body: 'Journal en écriture anticipée à chaque étape + vérification CRC32 ; rejeu depuis le point d’interruption après un crash, sans rappeler le LLM', icon: 'database-backup' },
    { title: 'Zéro dépendance externe', body: 'Aucun besoin de Redis / Postgres ; un simple fichier WAL local suffit à fonctionner', icon: 'package' },
    { title: 'Quatre modes d’intégration', body: 'Rust SDK / gRPC / REST / MCP, modularité par crates du workspace', icon: 'puzzle' },
  ]"
/>

### Persistance WAL-First

Toute modification d’état écrit d’abord dans le WAL avant exécution ; en cas de crash, le rejeu s’effectue depuis le WAL :

<ol class="lurus-steps">
<li>

**Décision de l’agent** — le moteur détermine l’action suivante

</li>
<li>

**Écriture WAL (CRC32)** — enregistrement persistant + somme de contrôle contre la corruption

</li>
<li>

**Exécution** — appel réel de l’outil / du LLM

</li>
<li>

**Confirmation de l’achèvement** — l’étape est marquée comme aboutie ; en cas de crash, les étapes non confirmées sont automatiquement rejouées

</li>
</ol>

La vérification CRC32 protège contre la corruption ; un tampon circulaire en puissance de 2 (Power-of-2) exploite efficacement le stockage ; l’ordre de verrouillage **Buffer → Queue → Txn** est strictement garanti pour éliminer tout interblocage.

### Orchestration d’agents

| Mode | Description | Cas d’usage |
|------|------|---------|
| **Agent unique** | Exécution autonome d’une tâche | Automatisation simple |
| **Workflow** | Exécution ordonnée en plusieurs étapes | Pipelines de données, processus d’approbation |
| **Intelligence collective (Swarm)** | Collaboration autonome entre plusieurs agents | Recherche complexe, simulation multi-rôles |

### Écosystème d’outils et multi-modèle

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span>
    <div class="lurus-card__title">Écosystème d’outils</div>
    <p class="lurus-card__body">Outils intégrés (fichiers / HTTP / base de données / Shell), <Term t="MCP">MCP</Term> (connexion à n’importe quel service d’outils compatible MCP, voir le <a href="/integrations/">catalogue d’intégrations</a>), <Term t="A2A">A2A</Term> (communication directe et délégation de tâches entre agents), outils personnalisés (extensions en Rust ou via API REST).</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">Prise en charge multi-modèle</div>
    <p class="lurus-card__body">Accès à plusieurs fournisseurs de modèles via une passerelle compatible OpenAI telle que <a href="/hub/">Lurus Hub</a>, avec basculement selon la tâche à l’exécution.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> Architecture</span>
  <h2 class="lurus-section-head__title">Aperçu de l’architecture</h2>
  <p class="lurus-section-head__lede">Intégration REST/SDK/gRPC/MCP · ordonnancement par Kova Core · persistance et reprise via WAL.</p>
</div>

<ArchitectureDiagram
  title="Architecture d’exécution de Kova"
  chart="graph LR
  A[Client SDK / gRPC / REST] --> B[Kova Core]
  B --> C[WAL Writer<br/>CRC32]
  B --> D[Scheduler<br/>FIFO]
  B --> E[Tool Runtime<br/>MCP]
  C -.recover.-> B
  D --> F[LLM Provider<br/>via Lurus API]"
/>

```
Kova REST API (Axum, WebSocket)
 → Kova Core: Agent Engine(单/多 Agent) + Workflow(有序编排)
              → WAL + Ring Buffer(持久化状态管理 CRC32)
              子 crate: kova-llm / kova-tools / kova-mcp
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> Cas d’usage</span>
  <h2 class="lurus-section-head__title">Cas d’usage adaptés</h2>
</div>

| Cas d’usage | Atout de Kova |
|------|-----------|
| **Agents s’exécutant sur de longues durées** | Persistance WAL, reprise automatique après crash |
| **Workflows complexes** | Orchestration multi-étapes, branches conditionnelles, exécution parallèle |
| **Collaboration multi-agents** | Mode Swarm, communication directe entre agents |
| **Déploiement auto-hébergé** | Binaire unique ou conteneur, WAL local, sans base de données externe |
| **Intégration d’outils MCP** | Prise en charge native du Model Context Protocol |
| **Contextes sensibles à la sécurité** | Chiffrement optionnel (SM4/AES), vérification d’intégrité HMAC du WAL |

<UserScenarios
  title="Prise en main par rôle"
  :scenarios="[
    { role: 'Développeur', title: 'Démarrer un agent persistant en 5 minutes', summary: 'cargo add kova + 3 lignes de code', link: '/fr/kova/quickstart' },
    { role: 'Architecte', title: 'Remplacer le Checkpointer de LangGraph', summary: 'Utiliser Kova pour stocker les checkpoints dans un projet LangGraph', link: '/tutorials/lumen-kova-langgraph' },
  ]"
/>

---

## Étapes suivantes

<NextSteps
  :steps="[
    { text: 'Démarrage rapide — lancez votre premier agent Kova', link: '/fr/kova/quickstart', primary: true },
    { text: 'Concepts clés — comprendre en profondeur le WAL, les agents et les workflows', link: '/fr/kova/concepts' },
    { text: 'Référence API — documentation complète de l’API REST', link: '/fr/kova/api' },
    { text: 'Catalogue des intégrations et MCP', link: '/integrations/' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="kova" />

</div>

<style>
.kova-page .lurus-card--kova .lurus-card__body a {
  color: var(--lurus-color-kova);
  font-weight: 600;
}
</style>
