---
title: "Solution de plateforme AI d'entreprise"
description: "Boucle fermée à cinq couches — Auth · API · MemX · Kova · Lumen, pour bâtir votre propre plateforme AI d'entreprise."
---

<div class="midware-page">

# Solution de plateforme AI d'entreprise

<MetricStats :items="[
  { label: 'Couches de capacités', value: '5 couches', hint: 'Utilisables seules · boucle fermée combinée' },
  { label: 'Modèles de la passerelle', value: '50+' },
  { label: 'Reprise Kova', value: 'Microseconde', hint: 'Reprise au point d’arrêt via WAL' },
  { label: 'Trajectoire de déploiement', value: '10 semaines', hint: 'Référence' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Architecture</span>
  <h2 class="lurus-section-head__title">Boucle fermée à cinq couches</h2>
  <p class="lurus-section-head__lede">De haut en bas — chaque couche est utilisable seule, leur combinaison ferme la boucle et augmente la valeur.</p>
</div>

<ArchitectureDiagram title="Boucle fermée à cinq couches de la plateforme AI" chart="graph TB; App[Couche applicative métier<br/>Support client · base de connaissances · reporting · outils développeur] --> Lumen[Observabilité Lumen<br/>Trace / Replay / Cost]; Lumen --> Kova[Moteur d'exécution d'agents Kova<br/>WAL / Checkpoint]; Kova --> MemX[Mémoire intelligente MemX<br/>Distillation / déduplication / décroissance / récupération]; MemX --> API[Passerelle unifiée Lurus API<br/>50+ modèles / facturation / limitation de débit]; API --> Auth[Identité unifiée Lurus Auth<br/>SSO · MFA · OIDC · fédération]" />

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen — Observabilité</div>
    <p class="lurus-card__body">Trace / Replay / Cost.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova — Moteur d'exécution d'agents</div>
    <p class="lurus-card__body">WAL / Checkpoint, reprise au point d'arrêt après un crash.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">MemX — Mémoire intelligente</div>
    <p class="lurus-card__body">Distillation / déduplication / décroissance / récupération.</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Lurus API — Passerelle LLM unifiée</div>
    <p class="lurus-card__body">50+ modèles / facturation / limitation de débit.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Lurus Auth — Identité unifiée</div>
    <p class="lurus-card__body">SSO · MFA · OIDC · fédération.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> Comparaison de valeur</span>
  <h2 class="lurus-section-head__title">Utilisation autonome vs synergie des cinq couches</h2>
</div>

| Dimension | Utilisation autonome | Synergie des cinq couches |
|------|---------|---------|
| Identité | Implémentée par chacun | **SSO en une fois** |
| Suivi des coûts | À votre charge | **Corrélation automatique Lumen + API** |
| Reprise après crash | Ajout manuel | **Filet de sécurité Kova WAL** |
| Capitalisation des connaissances | Dispersée | **Distillation unifiée par MemX** |
| Conformité | Évaluée au cas par cas | **Couverture par un socle de conformité unique** |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package" :size="14" /> Livraison</span>
  <h2 class="lurus-section-head__title">Modes de livraison typiques</h2>
</div>

| Mode | Description | Délai |
|------|------|------|
| SaaS | Utilisable immédiatement | 0 |
| Déploiement privé | Déploiement d'images sur le K8s de l'entreprise | 2-4 semaines |
| Exploitation gérée | Astreinte assurée par Lurus, réseau interne de l'entreprise | À convenir |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Feuille de route</span>
  <h2 class="lurus-section-head__title">Trajectoire de déploiement de référence</h2>
  <p class="lurus-section-head__lede">Intégration par phases sur 10 semaines, une couche livrée toutes les deux semaines, vérifiable indépendamment.</p>
</div>

<ol class="lurus-steps">
  <li><strong>S1-2</strong> : intégrer <a href="/fr/guide/introduction">Lurus API</a> pour remplacer vos appels LLM existants</li>
  <li><strong>S3-4</strong> : intégrer <a href="/fr/platform/auth/">Auth</a> pour mettre en place le SSO</li>
  <li><strong>S5-6</strong> : capitaliser les connaissances métier avec <a href="/fr/memx/">MemX</a></li>
  <li><strong>S7-8</strong> : migrer les agents principaux vers <a href="/fr/kova/">Kova</a></li>
  <li><strong>S9-10</strong> : intégrer l'observabilité <a href="/fr/lumen/">Lumen</a> sur toute la chaîne</li>
</ol>

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Pourquoi choisir Lurus', link: '/fr/solutions/why-lurus', primary: true },
  { text: 'Modes de déploiement en entreprise', link: '/fr/solutions/enterprise-deploy' },
  { text: 'Contacter le service commercial', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
