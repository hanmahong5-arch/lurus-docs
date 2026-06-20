---
title: "Aperçu des solutions entreprise"
description: "Classer les capacités entreprise de Lurus par secteur et par point d’entrée selon le rôle."
---

<div class="solutions-hub">

# Solutions entreprise

Des points d’entrée conçus pour les décideurs, les achats, la revue d’architecture et la préparation à la conformité.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">50+</span><span class="lurus-stat__label">Modèles intégrés</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">Modes de déploiement</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">SM4-GCM</span><span class="lurus-stat__label">Chiffrement SM national</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1 seule</span><span class="lurus-stat__label">Facture unifiée</span></div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Par rôle</span>
  <h2 class="lurus-section-head__title">Trouvez le point d’entrée qui vous correspond</h2>
  <p class="lurus-section-head__lede">Le CTO regarde l’architecture et le TCO, le CISO les limites de conformité, le PMO la facturation et les licences.</p>
</div>

<div class="action-grid">
  <ActionCard
    name="CTO / Revue d’architecture"
    tagline="Why Lurus · Modes de déploiement · TCO · Benchmarks de performance"
    icon="compass"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: 'Pourquoi choisir Lurus', href: '/fr/solutions/why-lurus', primary: true },
      { label: 'Modes de déploiement entreprise', href: '/fr/solutions/enterprise-deploy' },
    ]"
  />
  <ActionCard
    name="CISO / Conformité"
    tagline="Fédération SSO · SM4-GCM national · Journaux d’audit · Souveraineté des données"
    icon="shield-check"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'Identité et conformité', href: '/fr/platform/auth/', primary: true },
      { label: 'Matrice des modes de déploiement', href: '/fr/solutions/enterprise-deploy' },
    ]"
  />
  <ActionCard
    name="PMO / Achats"
    tagline="Facturation à l’unité Lubei · Une seule facture · Licence on-premise"
    icon="receipt"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: 'Détails de la facturation', href: '/fr/platform/billing', primary: true },
      { label: 'Contacter le service commercial', href: 'mailto:business@lurus.cn', external: true },
    ]"
  />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> Par secteur</span>
  <h2 class="lurus-section-head__title">Solutions combinées par secteur</h2>
  <p class="lurus-section-head__lede">Pour chaque secteur, une combinaison de produits éprouvée, prête à déployer.</p>
</div>

<div class="action-grid">
  <ActionCard
    name="Finance"
    tagline="Lucrum + Auth + Audit de conformité"
    icon="landmark"
    color="var(--lurus-color-lucrum)"
    :actions="[
      { label: 'Solution pour la finance', href: '/fr/solutions/industry-finance', primary: true },
    ]"
  />
  <ActionCard
    name="Contenu"
    tagline="Creator + API + Production de contenu en masse"
    icon="pen-tool"
    color="var(--lurus-color-creator)"
    :actions="[
      { label: 'Solution pour le contenu', href: '/fr/solutions/industry-content', primary: true },
    ]"
  />
  <ActionCard
    name="Outils de développement"
    tagline="Boucle développeur Kova + Switch + Lumen"
    icon="terminal"
    color="var(--lurus-color-switch)"
    :actions="[
      { label: 'Solution outils de développement', href: '/fr/solutions/industry-devtools', primary: true },
    ]"
  />
  <ActionCard
    name="Plateforme AI d’entreprise"
    tagline="Boucle à cinq couches Auth + API + MemX + Kova + Lumen"
    icon="layers"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'Solution plateforme AI', href: '/fr/solutions/ai-midware', primary: true },
    ]"
  />
</div>

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Pourquoi choisir Lurus', link: '/fr/solutions/why-lurus', primary: true },
  { text: 'Contacter le service commercial', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>

<style scoped>
.solutions-hub .lurus-stat-strip { margin: 20px 0 8px; }
</style>
