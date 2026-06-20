---
title: "Solution pour le secteur des outils de développement"
description: "Kova + Switch + Lumen — destiné aux éditeurs d'outils de développement et aux équipes d'infrastructure."
---

<div class="devtools-page">

# Solution pour le secteur des outils de développement

<MetricStats :items="[
  { label: 'CLI gérés de façon unifiée', value: '5', hint: 'Switch' },
  { label: 'Modèles passerelle', value: '50+' },
  { label: 'Reprise des agents', value: 'microseconde', hint: 'Reprise sur point d’arrêt WAL' },
  { label: 'Composants intégrés', value: '4', hint: 'Kova · MemX · API · Lumen' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Public concerné</span>
  <h2 class="lurus-section-head__title">Qui l'utilise</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Éditeurs d'outils de programmation IA</div>
    <p class="lurus-card__body">Construire son propre produit de programmation IA.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
    <div class="lurus-card__title">Équipes Platform / DevX</div>
    <p class="lurus-card__body">Expérience développeur en interne.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="terminal" :size="20" /></span>
    <div class="lurus-card__title">Développeurs indépendants / petits studios</div>
    <p class="lurus-card__body">Démarrage léger, montée en charge à la demande.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="graduation-cap" :size="20" /></span>
    <div class="lurus-card__title">Institutions de recherche</div>
    <p class="lurus-card__body">Flux de travail d'agents expérimentaux.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Composants clés</span>
  <h2 class="lurus-section-head__title">Combinaison de produits</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="kova"   :actions="[{label:'Kova',   href:'/fr/kova/',   primary:true}]" />
  <ActionCard product-id="switch" :actions="[{label:'Switch', href:'/fr/switch/', primary:true}]" />
  <ActionCard product-id="lumen"  :actions="[{label:'Lumen',  href:'/fr/lumen/',  primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="puzzle" :size="14" /> Combinaisons types</span>
  <h2 class="lurus-section-head__title">Deux combinaisons de mise en œuvre</h2>
</div>

### Scénario A : construire son propre outil de programmation IA

<ArchitectureDiagram title="Construire son propre outil de programmation IA" chart="graph TB; Kova[Kova<br/>持久执行 · 崩溃恢复] --> MemX[MemX<br/>记住用户偏好 / 项目规范]; MemX --> API[Lurus API<br/>50+ 模型即插即用]; API --> Lumen[Lumen<br/>发布后观测 + Replay 调试]; Lumen --> Auth[Auth<br/>全员 SSO + Passkey]" />

### Scénario B : optimiser le ROI des développeurs internes

<ArchitectureDiagram title="Optimiser le ROI des développeurs internes" chart="graph TB; Switch[Switch<br/>统一管理团队 5 款 CLI] --> Lumen[Lumen<br/>每人每天 Token 消费一图说清]; Lumen --> ArgoCD[ArgoCD<br/>配置 Git 同步]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="trending-up" :size="14" /> Bénéfices</span>
  <h2 class="lurus-section-head__title">Bénéfices types</h2>
</div>

| Indicateur | Avant | Après |
|------|--------|-------|
| Configuration des outils IA dispersée | 5 fichiers JSON | **1 fichier yaml** |
| Coût mensuel des tokens | invisible | **tableau de bord + alertes** |
| Reprise après crash d'agent | redémarrage à zéro | **reprise sur point d'arrêt à la microseconde** |
| Cycle de mise en production | à la semaine | **à la journée** |

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Démarrage rapide Kova', link: '/fr/kova/quickstart', primary: true },
  { text: 'Configuration de Switch', link: '/fr/switch/configuration' },
  { text: 'Démarrage rapide Lumen', link: '/fr/lumen/quickstart' },
]" />

</div>
