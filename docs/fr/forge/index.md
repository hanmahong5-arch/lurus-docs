---
title: "Forge — Atelier de développement de produits IA"
description: "Plateforme web de développement collaboratif de produits IA, permettant aux équipes de concevoir ensemble des applications IA."
---

<div class="forge-page">

<ProductHero product-id="forge" />

::: warning Plateforme de R&D interne (pas un SaaS commercial)
Forge se positionne actuellement comme un **outil de R&D interne** de Lurus (gestion des besoins pilotée par ontologie + démo d’API Gateway), **ce n’est pas un produit commercial vendu à l’extérieur**. Accès uniquement sur invitation pour la bêta privée, l’API est encore en évolution. Pour en savoir plus ou pour un partenariat, contactez [business@lurus.cn](mailto:business@lurus.cn).
:::

## Qu’est-ce que Forge ?

**Lurus Forge** est un atelier de développement destiné aux équipes produit IA, dont la philosophie centrale est « **tout est conversation** » : les besoins produit sont discutés via des conversations Session, les fonctionnalités sont réalisées par des Agents IA (PM/Architect/Code), et la connaissance est visualisée par l’ontologie produit (Ontology).

En arrière-plan, le [moteur Kova](/fr/kova/) assure la persistance WAL des tâches des Agents : même en cas d’interruption en cours d’exécution, la reprise est transparente.

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="network" :size="22" /></span>
    <div class="lurus-card__title">Ontology (ontologie)</div>
    <p class="lurus-card__body">Gestion arborescente des user stories, de l’architecture, de la stack technique et des règles de conception du produit — une connaissance structurée et statique.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="22" /></span>
    <div class="lurus-card__title">Pilotage par conversation Session</div>
    <p class="lurus-card__body">Chaque discussion produit est rangée dans une Session — une chronologie dynamique qui porte les conversations, les décisions et les productions des Agents.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Capacités clés</span>
  <h2 class="lurus-section-head__title">Du besoin à la PR, tout dans une seule structure visuelle</h2>
  <p class="lurus-section-head__lede">Les capacités déjà disponibles et celles en projet sont présentées côte à côte, avec leur statut indiqué fidèlement.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-forge)"
  :items="[
    { title: 'Ontologie produit (Ontology)', body: 'Gestion arborescente des user stories / architecture / stack technique / règles de conception, toutes les dimensions visualisées côte à côte ; les décisions prises en conversation mettent automatiquement à jour l’Ontology.', icon: 'network' },
    { title: 'Développement piloté par la conversation', body: 'Demandez « Quelle est la user story de cette fonctionnalité ? » → l’Agent PM analyse et la génère. Chaque décision est liée au contexte de la conversation, permettant de retracer pourquoi elle a été prise.', icon: 'messages-square' },
    { title: 'Traçabilité des décisions par WAL', body: 'Basée sur le WAL du moteur Kova, chaque étape de conversation et de décision est persistée : traçable, localisable et rejouable (Replay) pour analyse.', icon: 'history' },
  ]"
/>

### Capacités en projet / en développement

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Dependency Guardian <Badge text="En projet" type="warning" /></div>
    <p class="lurus-card__body">Une gestion des dépendances à trois niveaux qui va au-delà de Renovate/Dependabot : Patch fusionné automatiquement (zéro intervention humaine) ; Minor décidé d’un clic via une carte d’approbation ; Major évalué par conversation (l’IA analyse l’impact sémantique des breaking changes sur le métier).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="workflow" :size="20" /></span>
    <div class="lurus-card__title">Construction visuelle d’Agents <Badge text="En développement" type="tip" /></div>
    <p class="lurus-card__body">Construction en trois étapes par glisser-déposer : déclencheur Trigger (Webhook / planifié / requête API) → traitement Process (appel LLM / récupération RAG / appel d’outils) → action de sortie Action (callback API / notification e-mail / écriture en base de données).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="database-backup" :size="20" /></span>
    <div class="lurus-card__title">Gestion de la base de connaissances <Badge text="En développement" type="tip" /></div>
    <p class="lurus-card__body">Base de connaissances RAG : import de documents (PDF/Word/Markdown/pages web), découpage automatique (préservation de l’intégrité sémantique), indexation vectorielle (embedding automatique avec recherche sémantique), synchronisation des mises à jour (réindexation automatique à chaque mise à jour de document).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">Supervision et analyse <Badge text="En développement" type="tip" /></div>
    <p class="lurus-card__body">Statistiques d’appels (volume / latence / Token), notation de qualité (retours utilisateurs + évaluation automatique), analyse des coûts (par fonctionnalité / par période), alertes (notification automatique en cas de volume d’appels anormal ou de baisse de qualité).</p>
  </div>
</div>

### Atelier d’ingénierie des Prompts

| Fonctionnalité | Description |
|------|------|
| **Éditeur de Prompts** | Coloration syntaxique, insertion de variables, gestion des versions |
| **Tests A/B** | Comparer la qualité de sortie de différents Prompts pour une même entrée |
| **Comparaison de modèles** | Comparer l’efficacité d’un même Prompt sur différents modèles |
| **Tests en lot** | Importer un jeu de tests pour une évaluation en masse |
| **Historique des versions** | Chaque modification enregistre automatiquement une version, restaurable à tout moment |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Cas d’usage</span>
  <h2 class="lurus-section-head__title">Ce que les équipes font sur Forge</h2>
</div>

<UserScenarios
  :scenarios="[
    { role: 'Service client IA', title: 'Construire visuellement un Agent de support', summary: 'Gérer la base de connaissances, superviser la qualité de service', link: '/fr/forge/sessions' },
    { role: 'Modération de contenu', title: 'Assembler un flux de modération par glisser-déposer', summary: 'Définir des règles, optimiser en continu', link: '/fr/forge/sessions' },
    { role: 'Recommandation intelligente', title: 'Configurer un Agent de recommandation', summary: 'Tester différentes stratégies en A/B', link: '/fr/forge/sessions' },
    { role: 'QA documentaire', title: 'Importer des documents pour bâtir une base de connaissances', summary: 'Déployer un Agent de questions-réponses', link: '/fr/forge/ontology' },
  ]"
/>

---

## Stack technique

| Niveau | Technologie |
|------|------|
| Frontend | TypeScript + React (monorepo Turbo) |
| Moteur IA | [Lurus API](/fr/guide/introduction) (support multi-modèles) |
| Exécution des Agents | [Kova](/fr/kova/) (exécution persistante) |
| Stockage vectoriel | Qdrant / Chroma |
| Déploiement | Kubernetes (ArgoCD) |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="mail" :size="14" /> Demande de bêta privée</span>
  <h2 class="lurus-section-head__title">Bêta privée sur invitation</h2>
</div>

Forge est actuellement en phase de bêta privée sur invitation. Il convient aux équipes suivantes :

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <p class="lurus-card__body">Qui intègrent ou prévoient d’intégrer des fonctionnalités IA dans leur produit</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="pen-tool" :size="20" /></span>
    <p class="lurus-card__body">Qui ont besoin d’outils visuels de gestion et de test de Prompts</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <p class="lurus-card__body">Qui souhaitent réduire les coûts de développement et d’exploitation des fonctionnalités IA</p>
  </div>
</div>

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">Demander l’accès à la bêta privée</p>
    <p class="lurus-cta__text">Contactez business@lurus.cn en précisant la taille de votre équipe et les difficultés que vous espérez résoudre.</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="mailto:business@lurus.cn">Envoyer un e-mail de demande →</a>
  </div>
</div>

## Ressources supplémentaires

- [Lurus API](/fr/guide/introduction) — Découvrir les capacités IA sous-jacentes
- [Kova](/fr/kova/) — Moteur d’exécution persistante des Agents
- [MemX](/fr/memx/) — Gestion intelligente de la mémoire IA
- [Authentification d’identité unifiée](/fr/platform/auth/) — La connexion à Forge, les permissions d’équipe et la fédération SSO reposent toutes là-dessus

<!-- lurus:related-block -->

---

## Produits associés et prochaines étapes

<RelatedProducts product-id="forge" />

</div>
