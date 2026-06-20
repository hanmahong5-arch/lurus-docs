---
title: "Modèles de déploiement en entreprise"
description: "Comparaison des trois modèles de déploiement — SaaS / sur site / cloud hybride — et de leurs frontières de conformité."
---

<div class="deploy-page">

# Modèles de déploiement en entreprise

<MetricStats :items="[
  { label: 'Modèles de déploiement', value: '3', hint: 'SaaS · sur site · cloud hybride' },
  { label: 'Démarrage sur site', value: '2-4 semaines' },
  { label: 'Disponibilité entreprise', value: '99.95%', hint: 'SaaS entreprise' },
  { label: 'Chiffrement national chinois', value: 'SM4-GCM' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="server" :size="14" /> Comparaison des modèles</span>
  <h2 class="lurus-section-head__title">Matrice des modèles de déploiement</h2>
  <p class="lurus-section-head__lede">Un même produit, trois modèles de mise en œuvre — à arbitrer selon la souveraineté des données et le délai de démarrage.</p>
</div>

| Capacité | SaaS | Sur site | Cloud hybride |
|------|------|-------|--------|
| Passerelle Lurus API | ✅ Clé en main | ✅ Image sur site | ✅ |
| Moteur d’exécution Kova | ✅ | ✅ | ✅ |
| Moteur de mémoire MemX | ✅ | ✅ | ✅ |
| Quantitatif Lucrum | ✅ | 🔜 2026 H2 | ✅ |
| Switch / Creator | ✅ Bureau | ✅ Bureau | ✅ |
| Identité et conformité | ✅ | ✅ | ✅ |
| Souveraineté des données | AWS / Alibaba Cloud | **Interne à l’entreprise** | Hybride |
| SM4-GCM (chiffrement national) | — | ✅ | ✅ |
| Délai de démarrage | Immédiat | 2-4 semaines | 1-2 semaines |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Conformité</span>
  <h2 class="lurus-section-head__title">Capacités de conformité</h2>
  <p class="lurus-section-head__lede">Souveraineté des données, traçabilité d’audit, chiffrement national — tout est clair pour la revue en un coup d’œil.</p>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">Données non transfrontalières</div>
    <p class="lurus-card__body">Déploiement sur site : aucune donnée ne transite par le cloud public Lurus.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">Journaux d’audit</div>
    <p class="lurus-card__body">Tous les appels API, événements d’identité et opérations d’administration sont consignés.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">Prise en charge du chiffrement national</div>
    <p class="lurus-card__body">Chiffrement symétrique SM4-GCM, asymétrique SM2 (feuille de route).</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="award" :size="20" /></span>
    <div class="lurus-card__title">MLPS / certifications sectorielles</div>
    <p class="lurus-card__body">Contactez <a href="mailto:business@lurus.cn">business@lurus.cn</a> pour obtenir la liste la plus récente.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> Fédération d’identité</span>
  <h2 class="lurus-section-head__title">Fédération SSO</h2>
  <p class="lurus-section-head__lede">Les employés se connectent à tous les produits Lurus avec leur compte d’entreprise, sans créer de nouvelle identité.</p>
</div>

Les employés utilisant l’IdP existant de l’entreprise (Okta / Azure AD / Keycloak auto-hébergé) se connectent avec leur compte d’entreprise :

<ArchitectureDiagram title="Connexion fédérée via l’IdP de l’entreprise" chart="graph LR; A[企业 IdP] -->|OIDC| B[Lurus Casdoor]; B --> C[所有 Lurus 产品]" />

Protocoles pris en charge : OIDC / OAuth 2.0 / SAML 2.0 / SCIM (cycle de vie des utilisateurs).

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="activity" :size="14" /> Niveau de service</span>
  <h2 class="lurus-section-head__title">SLA</h2>
</div>

| Modèle | Disponibilité | Réponse aux incidents |
|------|--------|---------|
| SaaS standard | 99.9% | Heures ouvrées |
| SaaS entreprise | 99.95% | 7×24 |
| Sur site | Selon contrat | Astreinte dédiée |

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Identité et conformité', link: '/fr/platform/auth/', primary: true },
  { text: 'Pourquoi choisir Lurus', link: '/fr/solutions/why-lurus' },
  { text: 'Contacter le service commercial', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
