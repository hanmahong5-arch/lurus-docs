---
title: Facturation en détail
description: Le mode de facturation actuel de Lurus, la gestion d’un solde insuffisant, les factures et les remboursements.
---

<div class="billing-page">

# Facturation en détail

Cette page décrit uniquement le mode de facturation, sans lister de prix. Les prix et quotas font foi sur la console et dans le contrat.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> Modes</span>
  <h2 class="lurus-section-head__title">Modes de facturation</h2>
</div>

- **Contrat entreprise** : le déploiement privé et la livraison hébergée sont réglés selon le périmètre convenu au contrat, par virement bancaire avec émission de facture. Pour un déploiement privé ou un centre de données spécifique, contactez [business@lurus.cn](mailto:business@lurus.cn).
- **Abonnement individuel** : les forfaits et prix disponibles sont consultables sur la page de gestion des abonnements de [identity.lurus.cn](https://identity.lurus.cn) ; l’usage au-delà du quota de l’abonnement est débité du solde du [portefeuille du compte](/fr/platform/#wallet).
- **Quotas par locataire** : dans [Lurus Hub](/hub/), l’administrateur d’un locataire peut gérer séparément les quotas d’une organisation, d’une équipe ou d’un client en aval, et consulter leur usage.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Quota</span>
  <h2 class="lurus-section-head__title">Quota ou solde insuffisant</h2>
</div>

Chaque appel est converti en consommation selon le modèle et le nombre de tokens ; lorsque le quota et le solde sont tous deux insuffisants, la requête est refusée avec une erreur de quota insuffisant. Les étapes de diagnostic figurent dans [Dépannage · Quota / solde insuffisant](/fr/guide/troubleshooting#insufficient-quota).

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Factures</span>
  <h2 class="lurus-section-head__title">Relevés, factures et remboursements</h2>
</div>

- **Relevés** : connectez-vous sur [identity.lurus.cn](https://identity.lurus.cn) pour consulter le détail des transactions et les statistiques d’usage.
- **Factures** : pour un contrat entreprise, la facture est émise selon le contrat ; dans les autres cas, contactez [support@lurus.cn](mailto:support@lurus.cn).
- **Remboursements** : contactez [support@lurus.cn](mailto:support@lurus.cn) ; la partie déjà consommée n’est pas remboursable.

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Présentation de la plateforme', link: '/fr/platform/', primary: true },
    { text: 'Questions fréquentes', link: '/fr/platform/faq' },
    { text: 'Obtenir une clé API', link: '/fr/guide/get-api-key' },
  ]"
/>

</div>
