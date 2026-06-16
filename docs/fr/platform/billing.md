---
title: Facturation en détail
description: Présentation détaillée des forfaits d’abonnement Lurus, de la gestion des quotas et du système économique 鹿贝.
---

<div class="billing-page">

# Facturation en détail <StatusBadge status="live" />

Forfaits d’abonnement, gestion des quotas et système économique 鹿贝.

<MetricStats
  :items="[
    { label: 'Forfaits d\'abonnement', value: '4 niveaux', hint: 'Free → Enterprise' },
    { label: 'Moyens de paiement', value: '3 types', hint: 'Stripe / Creem / Epay' },
    { label: 'Bonus de recharge', value: 'jusqu\'à 5 %', hint: '6 premiers renouvellements' },
    { label: 'Fenêtre de remboursement', value: '7 jours', hint: 'Remboursement intégral du premier abonnement' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> Abonnement</span>
  <h2 class="lurus-section-head__title">Comparaison des forfaits d’abonnement</h2>
  <p class="lurus-section-head__lede">De l’essai gratuit au SLA entreprise, choisissez selon votre volume d’utilisation.</p>
</div>

| Forfait | Appels API | Modèles disponibles | Lucrum | Support / Autres |
|------|---------|---------|--------|------------|
| **Free** | 100 fois/jour | De base (deepseek-chat, gpt-3.5-turbo) | Assistant IA : 10 conversations/jour | Support communautaire |
| **Basic** | Abonnement mensuel d’entrée de gamme, tarification selon la console | — | — | Pour développeurs individuels souhaitant essayer |
| **Pro** (paiement mensuel/annuel, réduction sur le paiement annuel) | 10 000 fois/mois | Tous | Assistant IA illimité ; jusqu’à 3 déploiements de stratégie | Tickets par e-mail (réponse sous 24 h) |
| **Enterprise** (sur mesure) | À la demande | Tous + déploiement privé | Membres d’équipe illimités | SLA 99,9 % ; chargé de clientèle dédié + réponse instantanée ; centre de données au choix |

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="briefcase" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Offre entreprise</p>
    <div class="lurus-callout__body">Besoin d’un déploiement privé, d’un centre de données dédié ou d’un SLA 99,9 % ? Contactez <a href="mailto:business@lurus.cn">business@lurus.cn</a>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Quota</span>
  <h2 class="lurus-section-head__title">Gestion des quotas</h2>
  <p class="lurus-section-head__lede">Chaque appel décompte du quota selon le modèle et la consommation de tokens ; en cas de dépassement, le décompte bascule automatiquement sur les 鹿贝.</p>
</div>

### Calcul du quota

Le quota consommé par chaque appel API dépend du modèle et de la consommation de tokens :

| Type de modèle | Règle de consommation de quota |
|---------|-------------|
| Modèles de base (deepseek-chat, etc.) | 1 appel = 1 quota |
| Modèles avancés (gpt-4o, etc.) | 1 appel = 3 quotas |
| Génération d’image/vidéo | Selon la complexité de la tâche = 5 à 20 quotas |

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
    <div class="lurus-callout__body">Lorsque le solde est insuffisant, une alerte préalable est envoyée par e-mail + message interne ; le service ne sera jamais interrompu à votre insu.</div>
  </div>
</div>

### Alertes de quota

| Seuil d’alerte | Mode de notification |
|---------|---------|
| 30 % restants | Message interne |
| 10 % restants | Message interne + e-mail |
| Quota épuisé | Message interne + e-mail + notification WebSocket |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿贝</span>
  <h2 class="lurus-section-head__title">Économie 鹿贝</h2>
  <p class="lurus-section-head__lede">Monnaie de points unifiée, convertible proportionnellement en tokens et en nombre d’appels.</p>
</div>

### Valeur des 鹿贝

Valeur de référence de 1 鹿贝 (LB) :

| Ressource | Convertible avec 1 LB |
|------|------------|
| Tokens (modèles de base) | environ 10 000 tokens |
| Tokens (modèles avancés) | environ 3 000 tokens |
| Appels API | environ 5 à 10 fois (selon le modèle) |

### Taux de recharge

| Montant rechargé (CNY) | 鹿贝 obtenus | Prix unitaire |
|----------------|---------|------|
| ¥10 | 10 LB | ¥1,00/LB |
| ¥50 | 55 LB | ¥0,91/LB |
| ¥100 | 115 LB | ¥0,87/LB |
| ¥500 | 600 LB | ¥0,83/LB |

Plus vous rechargez, plus le prix unitaire est bas.

### Cumul des remises VIP

La remise VIP s’applique automatiquement lors de la consommation des 鹿贝.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="crown" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Exemple : carte Gold, remise de 10 %</p>
    <div class="lurus-callout__body">Pour un utilisateur titulaire d’une carte Gold appelant gpt-4o (3 LB/appel), le décompte réel = <code>3 × 0.9 = 2.7 LB/次</code>.</div>
  </div>
</div>

### Durée de validité des 鹿贝

Les 鹿贝 achetés sont valables à vie ; les 鹿贝 offerts lors d’opérations promotionnelles dépendent des conditions de l’opération ; les remboursements ne portent que sur la partie payée en espèces, les 鹿贝 offerts ne sont pas remboursables.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Facture</span>
  <h2 class="lurus-section-head__title">Factures et reçus</h2>
</div>

- **Consulter les factures** ([identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)) : récapitulatif mensuel de la consommation, détail des transactions, mouvements de 鹿贝, statistiques d’utilisation des quotas.
- **Émettre une facture** (factures TVA ordinaires/spéciales prises en charge) : « Factures » → « Demander une facture » → renseigner les informations de facturation (préremplies automatiquement après le premier enregistrement) → choisir le montant et le mois. La facture électronique est généralement envoyée par e-mail sous 1 jour ouvré.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="repeat" :size="14" /> Remboursement</span>
  <h2 class="lurus-section-head__title">Politique de remboursement</h2>
</div>

| Type | Politique |
|------|------|
| Remboursement d’abonnement | Remboursement intégral possible dans les 7 jours suivant le premier abonnement |
| Remboursement de recharge de 鹿贝 | Les 鹿贝 non utilisés peuvent faire l’objet d’une demande de remboursement (déduction faite de la partie offerte) |
| Partie déjà consommée | Non remboursable |

Pour un remboursement, contactez [support@lurus.cn](mailto:support@lurus.cn).

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Présentation de la plateforme', link: '/fr/platform/', primary: true },
    { text: 'Questions fréquentes', link: '/fr/platform/faq' },
    { text: 'Obtenir une clé API', link: '/fr/guide/get-api-key' },
  ]"
/>

</div>
