---
title: Lurus Platform — Compte et facturation
description: Présentation du système de comptes unifiés, des plans d’abonnement, du portefeuille du compte et de la facturation de Lurus.
---

<div class="platform-page">

<ProductHero product-id="platform" />

## Aperçu

**Lurus Platform** est l’infrastructure unifiée de comptes et de facturation partagée par tous les produits Lurus. Que vous utilisiez Lurus API, Lucrum, Switch ou un autre produit, vous vous connectez avec le même compte Lurus et partagez le même solde de portefeuille et le même plan d’abonnement.

<CapabilityGrid
  accent="var(--lurus-color-platform)"
  title="Capacités de base de la plateforme"
  :items="[
    { title: 'Compte unifié', body: 'Une seule identité, un seul solde et un seul abonnement partagés par tous les produits Lurus', icon: 'user-check' },
    { title: 'Portefeuille du compte', body: 'Enregistre le solde et le détail des transactions, utilisé pour le débit à l\'usage', icon: 'coins' },
    { title: 'Plans d\'abonnement', body: 'Abonnement individuel ou contrat entreprise', icon: 'package-2' },
  ]"
/>

---

## Compte unifié

Rendez-vous sur n’importe quel produit Lurus ([hub.lurus.cn](https://hub.lurus.cn), [lucrum.lurus.cn](https://lucrum.lurus.cn), etc.) pour vous inscrire / vous connecter. **Méthodes de connexion** : e-mail + mot de passe, GitHub (OAuth), Google (OAuth).

À l’inscription, vous obtenez :

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">Identité utilisateur unifiée</div>
    <p class="lurus-card__body">Un seul compte commun à tous les produits</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">Adresse e-mail @lurus.cn</div>
    <p class="lurus-card__body">Activation automatique de <code>username@lurus.cn</code> (basé sur Stalwart)</p>
  </div>
</div>

**Gestion du compte** (connectez-vous sur [identity.lurus.cn](https://identity.lurus.cn) → paramètres du compte) : informations personnelles, historique de connexion, liaisons tierces, paramètres de sécurité (changement de mot de passe, double authentification).

**Une seule connexion, accès à tout le site** : basé sur le standard OIDC, se connecter à n’importe quel produit établit une session entre tous les produits ; prise en charge de Passkey/WebAuthn sans mot de passe, du MFA par TOTP/clé matérielle, de la connexion sociale GitHub/Google, et les entreprises peuvent intégrer le SSO Azure AD/Feishu/Okta. Les utilisateurs finaux disposent d’un seul compte pour API/Lucrum/Switch/Creator/Lutu ; les développeurs intègrent leurs propres applications via le SDK OIDC, et côté backend via Service User + JWT Profile ; la gestion organisationnelle d’entreprise (membres/permissions/audit) se fait via [identity.lurus.cn](https://identity.lurus.cn) (console Casdoor) ou en contactant le service commercial.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Approfondir l’authentification d’identité</p>
    <div class="lurus-callout__body"><a href="/fr/platform/auth/">Authentification d’identité unifiée</a> · <a href="/fr/platform/auth/oidc">Intégration OIDC / OAuth2</a> · <a href="/fr/platform/auth/api-auth">Authentification API</a></div>
  </div>
</div>

---

## Système de facturation

Lurus adopte un modèle de facturation double « abonnement + à l’usage », adaptable avec souplesse à différents volumes d’utilisation.

### Plans d’abonnement

| Plan | Positionnement | Idéal pour |
|------|------|------|
| **Free** | Quota de base, utilisation gratuite | Essai personnel |
| **Basic** | Abonnement mensuel d’entrée de gamme | Développeurs individuels |
| **Pro** | Abonnement mensuel avancé + modèles prioritaires | Utilisateurs intensifs |
| **Pro annuel** | Réduction sur l’abonnement Pro annuel | Utilisateurs réguliers |
| **Enterprise** | Personnalisation entreprise + SLA | Équipes / entreprises |

Les tarifs précis font foi sur la console [identity.lurus.cn](https://identity.lurus.cn) (page de gestion des abonnements).

### Facturation à l’usage

Une fois le quota inclus dans l’abonnement dépassé, le débit s’effectue depuis le solde du portefeuille du compte. Les tarifs unitaires varient selon les modèles ; ceux affichés sur la console font foi.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Mode de facturation et remboursements</p>
    <div class="lurus-callout__body"><a href="/fr/platform/billing">Facturation en détail</a> explique le mode de facturation actuel, la gestion d’un solde insuffisant, les factures et les remboursements.</div>
  </div>
</div>

---

## Portefeuille du compte {#wallet}

Le portefeuille du compte enregistre le solde et le détail des transactions ; il sert à régler l’usage qui dépasse le quota de l’abonnement. Le solde, l’historique des transactions et la recharge se trouvent dans le centre de compte [identity.lurus.cn](https://identity.lurus.cn). Les tarifs, bonus et remises font foi sur la console ; cette documentation ne donne pas de valeurs chiffrées.

---

## Moyens de paiement

Tous les paiements sont confirmés de manière asynchrone via un Webhook, ce qui évite les doubles débits dus aux fluctuations du réseau. Les moyens de paiement disponibles sont ceux affichés sur la page de paiement ; les clients entreprise peuvent passer par un contrat et un virement bancaire.

---

## Service de notifications

Notifications multicanal (les paramètres du compte permettent de personnaliser le canal de réception de chaque type de notification) :

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">Messages internes</div>
    <p class="lurus-card__body">Modification du compte / alertes de sécurité / annonces système</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">E-mail</div>
    <p class="lurus-card__body">Confirmation de paiement / alerte de quota / expiration d’abonnement</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">WebSocket</div>
    <p class="lurus-card__body">Notification en temps réel des anomalies API / solde insuffisant</p>
  </div>
</div>

---

## Sécurité des données

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Authentification d’identité de niveau entreprise</div>
    <p class="lurus-card__body">Système basé sur le standard <Term t="OIDC">OIDC</Term></p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">HTTPS sur tout le site</div>
    <p class="lurus-card__body">Chiffrement TLS 1.3 de bout en bout du transport</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">Mots de passe jamais stockés en clair</div>
    <p class="lurus-card__body">Stockage chiffré avec bcrypt</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="receipt" :size="20" /></span>
    <div class="lurus-card__title">Passerelle de paiement conforme</div>
    <p class="lurus-card__body">Les paiements passent par un tiers conforme PCI DSS</p>
  </div>
</div>

Les données des utilisateurs sont strictement isolées et ne sont jamais partagées.

---

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Authentification d\'identité (Casdoor)', link: '/fr/platform/auth/', primary: true },
    { text: 'Facturation en détail', link: '/fr/platform/billing' },
    { text: 'Questions fréquentes', link: '/fr/platform/faq' },
    { text: 'Obtenir une clé API', link: '/fr/guide/get-api-key' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="platform" />

</div>

<style>
.platform-page .lurus-card code {
  font-size: 0.85em;
}
</style>
