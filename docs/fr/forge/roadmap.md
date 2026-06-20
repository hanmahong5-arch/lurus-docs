---
title: "Forge — Feuille de route et demande d’accès bêta"
description: "Capacités bêta actuelles, Dependency Guardian / visualisation des agents / base de connaissances prévus, et modalités de demande d’accès bêta."
---

<div class="forge-rm-page">

# Feuille de route Forge <StatusBadge status="beta" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="check-circle" :size="14" /> Déjà disponible</span>
  <h2 class="lurus-section-head__title">Capacités bêta actuelles</h2>
</div>

| Capacité | Statut | Description |
|------|------|------|
| Arbre de visualisation Ontology | <StatusBadge status="beta" /> | Arbre repliable + cartes de nœuds |
| Session PM/Architect/Code | <StatusBadge status="beta" /> | Collaboration conversationnelle entre trois types d’agents |
| Traçabilité des décisions WAL | <StatusBadge status="beta" /> | Repose sur le moteur Kova |
| Automatisation des PR | <StatusBadge status="dev" /> | Le Code Agent ouvre directement les PR |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="compass" :size="14" /> En cours de planification</span>
  <h2 class="lurus-section-head__title">Les prochaines étapes</h2>
</div>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Dependency Guardian <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">Détection des changements d’interface entre Epics / Stories : lorsqu’un contrat d’API est modifié, toutes les Sessions et PR concernées sont automatiquement localisées.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="workflow" :size="20" /></span>
    <div class="lurus-card__title">Visualisation des agents <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">Dans une Session, le raisonnement de l’agent, ses appels d’outils et ses résultats intermédiaires sont présentés sous forme de <strong>chronologie visuelle</strong>, plutôt que de simples logs textuels.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">Base de connaissances <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">Intégration de <a href="/fr/memx/">MemX</a> à Forge, en tant que couche de mémoire à long terme permettant à l’agent de retrouver, au sein d’une Session, les décisions historiques / spécifications / écueils rencontrés.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="history" :size="14" /> Chronologie</span>
  <h2 class="lurus-section-head__title">Jalons récents</h2>
</div>

<ol class="lurus-steps">
<li>

**2026 Q2** — Automatisation des PR en GA

</li>
<li>

**2026 Q3** — Dependency Guardian en bêta

</li>
<li>

**2026 Q4** — Visualisation des agents en bêta

</li>
<li>

**2027 Q1** — Base de connaissances en bêta (intégration approfondie de MemX)

</li>
</ol>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="mail" :size="14" /> Demande d’accès bêta</span>
  <h2 class="lurus-section-head__title">Canal d’accès bêta sur invitation</h2>
</div>

Forge est actuellement positionné comme un **outil de R&D interne** de Lurus, et **non comme un produit commercial vendu à l’extérieur**.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="mail" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Comment faire une demande</p>
    <div class="lurus-callout__body">Envoyez un e-mail à <code>business@lurus.cn</code> (objet : « Demande d’accès bêta Forge »), en précisant la taille de votre équipe, votre outil de gestion des besoins actuel et les points de douleur que vous souhaitez résoudre.</div>
  </div>
</div>

---

## Produits associés

<RelatedProducts product-id="forge" />

</div>
