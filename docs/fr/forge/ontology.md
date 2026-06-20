---
title: "Forge — Ontologie"
description: "Gérez les user stories, l'architecture, la stack technique et les spécifications de conception de votre produit dans une structure arborescente."
---

<div class="forge-ont-page">

# Ontologie <StatusBadge status="beta" />

L'Ontologie est le premier modèle de données central de Forge. Elle décrit l'ensemble des « connaissances » d'un produit sous forme d'arbre, permettant aux agents IA et aux humains de collaborer sur une même structure visuelle. Elle fusionne les user stories éparpillées (Jira/Feishu/chats), l'architecture et l'implémentation dissociées, les ajustements de stack technique non documentés et les spécifications de conception dispersées en un seul arbre de connaissances **traçable, réversible et accessible en écriture par les agents**.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="network" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">En une phrase</p>
    <div class="lurus-callout__body">L'Ontologie est la connaissance structurée <strong>statique</strong> ; la <a href="/fr/forge/sessions">Session</a> est la chronologie <strong>dynamique</strong>. Les décisions prises au sein d'une Session écrivent / modifient les nœuds de l'Ontologie.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Modèle de données</span>
  <h2 class="lurus-section-head__title">Types de nœuds</h2>
  <p class="lurus-section-head__lede">Six types de nœuds décrivent en parallèle les différentes dimensions de la connaissance d'un produit.</p>
</div>

| Type | Signification | Exemple de feuille |
|------|------|---------|
| `UserStory` | User story | « En tant que X je veux Y afin de Z » |
| `Architecture` | Décision d'architecture | « Adoption de l'event-driven, parce que… » |
| `TechStack` | Stack technique | « Backend Go + Gin + PG » |
| `DesignSpec` | Spécification de conception | « Boutons à coins arrondis 8px, couleur principale #C67B5C » |
| `Decision` | Décision ponctuelle | « Abandon de Redis Streams au profit de NATS » |
| `Risk` | Élément de risque | « API tierce limitée à 429 (rate limit) » |

## Structure arborescente

```
产品: Lurus Forge
├─ UserStory
│  ├─ PM 创建需求
│  ├─ Architect 设计方案
│  └─ Dev 实现并提 PR
├─ Architecture
│  ├─ Ontology + Session 双核心
│  └─ WAL 决策回溯（依赖 Kova）
├─ TechStack
│  ├─ Elixir/Phoenix + LiveView
│  └─ PostgreSQL + ltree
└─ DesignSpec
   └─ Lurus 铜棕视觉系统
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> Modes de collaboration</span>
  <h2 class="lurus-section-head__title">Écriture automatique par les agents · Visualisation · Export</h2>
</div>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Écriture automatique par les agents</div>
    <p class="lurus-card__body">Lorsque l'agent PM génère une user story dans une <a href="/fr/forge/sessions">Session</a>, le nœud est automatiquement créé dans l'Ontologie ; lorsque l'agent Architect prend une décision d'architecture, il écrit dans le sous-arbre <code>Architecture</code> et l'associe à la Story correspondante.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Visualisation</div>
    <p class="lurus-card__body">Le frontend web affiche un arbre repliable et des cartes de nœuds. Chaque nœud porte : son créateur (humain / agent), la Session associée, l'historique des révisions et son statut (brouillon / en revue / validé).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="import" :size="20" /></span>
    <div class="lurus-card__title">Export</div>
    <p class="lurus-card__body">Exportez l'arbre entier en JSON, ou en GraphML pour l'importer dans yEd / Gephi et réaliser une analyse de graphe (voir les commandes ci-dessous).</p>
  </div>
</div>

### Commandes d'export

```bash
forge export --ontology json     # 整棵树 → JSON
forge export --ontology graphml  # 可导入 yEd / Gephi
```

---

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Workflow Session', link: '/fr/forge/sessions', primary: true },
  { text: 'Feuille de route', link: '/fr/forge/roadmap' },
  { text: 'Retour à l’introduction de Forge', link: '/fr/forge/' },
]" />

</div>
