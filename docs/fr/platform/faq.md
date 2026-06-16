---
title: FAQ de la plateforme
description: Questions fréquentes et réponses concernant les comptes, la facturation et les services de la plateforme Lurus.
---

<div class="faq-page">

# Questions fréquentes

Les questions les plus fréquentes sur les comptes de la plateforme, la facturation des abonnements, les 鹿贝 et la sécurité, regroupées par thème.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Compte</span>
  <h2 class="lurus-section-head__title">Compte</h2>
</div>

<details class="lurus-faq-item">
<summary>Un seul compte fonctionne-t-il pour tous les produits ?</summary>

Oui. Système de compte unifié : une seule inscription pour se connecter à tous les produits (API, Lucrum, Switch, Creator, etc.), avec un solde de portefeuille et un plan d’abonnement partagés.

</details>

<details class="lurus-faq-item">
<summary>Comment changer mon mot de passe ?</summary>

Connectez-vous sur [identity.lurus.cn](https://identity.lurus.cn) → Paramètres du compte → Sécurité → Modifier le mot de passe.

</details>

<details class="lurus-faq-item">
<summary>Que faire si j’ai oublié mon mot de passe ?</summary>

Sur la page de connexion, cliquez sur « Mot de passe oublié », un lien de réinitialisation sera envoyé à l’adresse e-mail d’inscription.

</details>

<details class="lurus-faq-item">
<summary>Comment supprimer mon compte ?</summary>

Contactez [support@lurus.cn](mailto:support@lurus.cn) pour la résiliation ; toutes les données (clé API / 鹿贝 / historique des transactions) seront définitivement supprimées et irrécupérables.

</details>

<details class="lurus-faq-item">
<summary>Quelles connexions tierces sont prises en charge ?</summary>

GitHub, Google OAuth ; à associer / dissocier dans les paramètres du compte.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> Abonnement et facturation</span>
  <h2 class="lurus-section-head__title">Abonnement et facturation</h2>
</div>

<details class="lurus-faq-item">
<summary>Comment passer à un forfait supérieur / inférieur ?</summary>

Connectez-vous sur [identity.lurus.cn](https://identity.lurus.cn) → Gestion des abonnements → « Changer de forfait » : la montée en gamme prend effet immédiatement avec un ajustement de prix au prorata ; la rétrogradation prend effet au prochain cycle de facturation.

</details>

<details class="lurus-faq-item">
<summary>Que se passe-t-il à l’expiration de l’abonnement ?</summary>

Rétrogradation automatique vers Free ; la clé API reste valide mais soumise au quota Free, les données sont conservées et récupérables à tout moment par un renouvellement.

</details>

<details class="lurus-faq-item">
<summary>Quelle est la différence entre le paiement annuel et mensuel ?</summary>

Paiement annuel à -20 % (≈ 2,4 mois gratuits) ; pendant la période annuelle, la rétrogradation est impossible mais la montée en gamme reste possible.

</details>

<details class="lurus-faq-item">
<summary>Comment ajouter des membres à l’équipe sur la version Entreprise ?</summary>

Console d’administration → Équipe → Inviter un membre → Saisir l’e-mail et envoyer l’invitation → Le membre accepte et rejoint → Possibilité d’attribuer à chaque membre une clé API et un quota dédiés.

</details>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Vous souhaitez consulter les règles complètes de quota et de tarification ?</p>
    <div class="lurus-callout__body">Voir le <a href="/fr/platform/billing">guide de facturation</a>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿贝</span>
  <h2 class="lurus-section-head__title">鹿贝</h2>
</div>

<details class="lurus-faq-item">
<summary>À quoi servent les 鹿贝 ?</summary>

À payer les appels API dépassant le quota d’abonnement, à souscrire aux stratégies payantes de Lucrum et à bénéficier de remises VIP.

</details>

<details class="lurus-faq-item">
<summary>Les 鹿贝 expirent-ils ?</summary>

Ceux achetés sont valables à vie ; ceux offerts lors de promotions peuvent avoir une date d’expiration, selon les règles de la promotion.

</details>

<details class="lurus-faq-item">
<summary>Peut-on retirer ses 鹿贝 ?</summary>

Les 鹿贝 achetés par recharge et non utilisés sont remboursables ; les 鹿贝 issus du règlement des revenus de stratégies Lucrum peuvent être retirés vers une carte bancaire.

</details>

<details class="lurus-faq-item">
<summary>Comment consulter le solde et l’historique des opérations ?</summary>

Connectez-vous sur [identity.lurus.cn](https://identity.lurus.cn) → Portefeuille, pour consulter le solde actuel, le détail des entrées (recharge / récompenses / revenus de stratégies) et le détail des sorties (consommation API / abonnement aux stratégies).

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> Paiement</span>
  <h2 class="lurus-section-head__title">Paiement</h2>
</div>

Modes de paiement :

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="receipt" :size="20" /></span>
    <div class="lurus-card__title">Stripe</div>
    <p class="lurus-card__body">Carte de crédit / débit, international</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">Creem</div>
    <p class="lurus-card__body">Cryptomonnaie</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="wallet" :size="20" /></span>
    <div class="lurus-card__title">Epay</div>
    <p class="lurus-card__body">Alipay / WeChat, Chine continentale</p>
  </div>
</div>

<details class="lurus-faq-item">
<summary>Que faire si un paiement n’est pas crédité ?</summary>

La confirmation intervient généralement en moins d’une minute ; si rien n’est crédité au bout de 5 minutes, vérifiez si la plateforme de paiement a bien débité, consultez l’e-mail de confirmation dans votre boîte de réception, puis contactez [support@lurus.cn](mailto:support@lurus.cn) en fournissant le numéro de commande de paiement.

</details>

<details class="lurus-faq-item">
<summary>Comment demander une facture ?</summary>

Console d’administration → Facturation → Demander une facture (TVA ordinaire / spéciale) ; envoyée par e-mail généralement sous 1 jour ouvré.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Sécurité</span>
  <h2 class="lurus-section-head__title">Sécurité</h2>
</div>

<details class="lurus-faq-item">
<summary>Mes données sont-elles en sécurité ?</summary>

HTTPS de bout en bout (TLS 1.3) ; mots de passe stockés chiffrés avec bcrypt ; paiements traités par un tiers conforme PCI DSS ; le contenu des appels API n’est pas stocké (seules les métadonnées sont enregistrées à des fins de facturation).

</details>

<details class="lurus-faq-item">
<summary>Que faire en cas de vol de ma clé API ?</summary>

Désactivez immédiatement la clé dans la console → Créez une nouvelle clé → Vérifiez les journaux d’appels pour confirmer toute consommation anormale → Contactez le support pour traiter les débits anormaux.

</details>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Vous n’avez pas trouvé de réponse ?</p>
    <div class="lurus-callout__body">Veuillez contacter <a href="mailto:support@lurus.cn">support@lurus.cn</a>.</div>
  </div>
</div>

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Présentation de la plateforme', link: '/fr/platform/', primary: true },
    { text: 'Guide de facturation', link: '/fr/platform/billing' },
    { text: 'Obtenir une clé API', link: '/fr/guide/get-api-key' },
  ]"
/>

</div>
