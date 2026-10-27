---
title: Facturation en détail
description: Présentation détaillée des forfaits d’abonnement Lurus, de la gestion des quotas et du système économique 鹿贝.
---

<div class="billing-page">

# Facturation en détail <StatusBadge status="live" />

Forfaits d’abonnement, gestion des quotas et système économique 鹿贝.

<MetricStats
  :items="[
    { label: 'Forfaits d\'abonnement', value: '5 niveaux', hint: 'Free → Enterprise, plus un forfait Claude Code' },
    { label: 'Moyens de paiement', value: '3 types', hint: 'Stripe / Creem / Epay' },
    { label: '鹿贝', value: '1 CNY = 1 LB', hint: 'Vous recevez exactement le montant rechargé' },
    { label: 'Fenêtre de remboursement', value: '7 jours', hint: 'Commande entière, dans les 7 jours suivant le paiement' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> Abonnement</span>
  <h2 class="lurus-section-head__title">Comparaison des forfaits d’abonnement</h2>
  <p class="lurus-section-head__lede">De l’essai gratuit au SLA entreprise, choisissez selon votre volume d’utilisation.</p>
</div>

| Forfait | Positionnement | Description |
|------|------|------|
| **Free** | Essai gratuit | Quota gratuit quotidien, moins de modèles disponibles |
| **Basic** | Abonnement mensuel d’entrée de gamme | Développeurs individuels |
| **Pro** | Abonnement avancé, mensuel ou annuel | Le total annuel coûte moins que 12 mois en mensuel |
| **Enterprise** | Équipes / entreprises | Déploiement privé, SLA, etc. selon accord commercial |

Le prix, le quota quotidien et les modèles disponibles de chaque niveau font foi sur la console [identity.lurus.cn](https://identity.lurus.cn) (page de gestion des abonnements) ; les ajustements de l’administrateur s’appliquent immédiatement, c’est pourquoi cette page ne recopie pas les chiffres. Il existe aussi un forfait distinct dédié à Claude Code, pour lequel la console fait également foi.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="briefcase" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Offre entreprise</p>
    <div class="lurus-callout__body">Besoin d’un déploiement privé, d’un centre de données dédié ou d’un SLA ? Contactez <a href="mailto:business@lurus.cn">business@lurus.cn</a>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Quota</span>
  <h2 class="lurus-section-head__title">Gestion des quotas</h2>
  <p class="lurus-section-head__lede">Le quota d’abonnement est utilisé en premier ; une fois épuisé, le portefeuille 鹿贝 est débité au prix unitaire du modèle.</p>
</div>

### Calcul du quota

Chaque appel est facturé selon le prix unitaire du modèle et la consommation de tokens : les modèles de conversation facturent séparément l’entrée et la sortie, tandis que la génération d’images et les tâches similaires sont facturées à l’appel. Les prix unitaires affichés dans la console font foi.

### Traitement en cas de dépassement de quota

<ol class="lurus-steps">
<li>La requête arrive : le quota d’abonnement est d’abord vérifié.</li>
<li>Quota <strong>suffisant</strong> → traitement normal.</li>
<li>Quota <strong>insuffisant</strong> → vérification du solde de 鹿贝 : si le solde est suffisant, le décompte automatique permet un traitement normal.</li>
<li>Solde <strong>insuffisant</strong> → renvoie une erreur <code>402</code>.</li>
</ol>

Vous recevez une erreur `402` / `insufficient_quota` ? Consultez les étapes de diagnostic dans [Dépannage · Quota / solde insuffisant](/fr/guide/troubleshooting#insufficient-quota).

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Aucune défaillance silencieuse</p>
    <div class="lurus-callout__body">Vous recevez un rappel lorsque le solde du portefeuille passe sous le seuil que vous avez défini ; en cas de solde insuffisant, la requête renvoie directement une erreur 402 — pas de dette accumulée puis réclamée ensuite.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿贝</span>
  <h2 class="lurus-section-head__title">Économie 鹿贝</h2>
  <p class="lurus-section-head__lede">L’unité de compte du portefeuille : 1 鹿贝 = 1 CNY.</p>
</div>

### Recharge

Recharger 1 CNY crédite 1 鹿贝, sans bonus par paliers. Si l’administrateur a mis en place une offre de recharge, le montant à payer affiché sur la page de recharge fait foi.

### Remises VIP

Le niveau VIP est déterminé par le montant cumulé des recharges (ou par un abonnement annuel), et la remise s’applique automatiquement à l’achat et au renouvellement d’un abonnement ; les recharges et les débits à l’usage ne sont pas remisés.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="crown" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Exemple : carte Gold, remise de 5 %</p>
    <div class="lurus-callout__body">Avec les seuils par défaut, ¥2 000 de recharges cumulées donnent la carte Gold ; le renouvellement d’un abonnement mensuel à ¥99 coûte alors <code>99 × 0.95 = ¥94.05</code>. Les seuils et remises affichés dans la console font foi.</div>
  </div>
</div>

### Durée de validité des 鹿贝

Le solde obtenu par recharge n’expire pas ; les crédits offerts lors de promotions peuvent avoir une date d’expiration, selon les conditions de l’opération.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Facture</span>
  <h2 class="lurus-section-head__title">Factures et reçus</h2>
</div>

- **Consulter les factures** ([identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)) : récapitulatif mensuel de la consommation, détail des transactions, mouvements de 鹿贝, statistiques d’utilisation des quotas.
- **Émettre une facture** : chaque commande payée peut faire l’objet d’une demande de facture en indiquant la raison sociale et le numéro fiscal ; la facture est établie manuellement puis téléchargeable dans la console.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="repeat" :size="14" /> Remboursement</span>
  <h2 class="lurus-section-head__title">Politique de remboursement</h2>
</div>

| Type | Politique |
|------|------|
| Abonnement | Demande dans la console dans les 7 jours suivant le paiement ; après validation, la commande entière est remboursée |
| Recharge | Dans les 7 jours suivant le paiement, si cette recharge n’a pas été utilisée, la commande entière peut être remboursée |
| Partie déjà consommée | Non remboursable |

Les paiements par Alipay, WeChat Pay et Stripe sont remboursés sur le moyen de paiement d’origine ; les autres moyens sont remboursés sur le portefeuille.

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Présentation de la plateforme', link: '/fr/platform/', primary: true },
    { text: 'Questions fréquentes', link: '/fr/platform/faq' },
    { text: 'Obtenir une clé API', link: '/fr/guide/get-api-key' },
  ]"
/>

</div>
