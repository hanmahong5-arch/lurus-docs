---
title: Connexion et authentification multifacteur | Authentification d’identité Casdoor
description: Méthodes de connexion prises en charge par Lurus (mot de passe, Passkey, connexion sociale, SSO d’entreprise) et politiques d’authentification multifacteur.
---

<div class="auth-login">

# Connexion et authentification multifacteur

Tous les produits Lurus partagent la même infrastructure d’authentification d’identité (**Casdoor**, exposée sur `identity.lurus.cn`). Que vous utilisiez l’API Lurus, Switch, Lucrum ou Forge, la connexion passe par le même point d’entrée : une seule connexion vous donne accès à toute la chaîne.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> Flux</span>
  <h2 class="lurus-section-head__title">1. Vue d’ensemble du flux de connexion</h2>
  <p class="lurus-section-head__lede">OIDC Authorization Code Flow + PKCE ; le client ne stocke aucune clé secrète.</p>
</div>

Lorsqu’un utilisateur accède à un produit quelconque sans session valide, l’application redirige le navigateur vers `identity.lurus.cn` ; après vérification, il est renvoyé avec un code d’autorisation.

<ArchitectureDiagram
  title="Flux Authorization Code + PKCE"
  chart="sequenceDiagram; participant B as Navigateur utilisateur; participant P as Produit Lurus; participant A as identity.lurus.cn; B->>P: Accès à la page du produit; P-->>B: 302 Redirection; B->>A: GET /authorize (client_id, code_challenge, scope); A-->>B: Page de connexion e-mail/Passkey/SSO; A-->>B: 302 redirect_uri?code; B->>P: Code d’autorisation; P->>A: POST /token (code + code_verifier); A-->>P: access_token / id_token; P-->>B: Connexion réussie, entrée dans le produit"
/>

**PKCE** : avant d’envoyer la requête d’autorisation, le client génère un `code_verifier` aléatoire et envoie son hachage SHA-256 `code_challenge` avec la requête ; une fois le code d’autorisation récupéré, il échange le token à l’aide du verifier d’origine, et le serveur ne délivre le token que si les deux concordent. Même si le code d’autorisation est intercepté, il ne permet pas d’obtenir un token.

::: info Durée de validité de la session
Par défaut, l’Access Token est valide 12 heures et le Refresh Token permet un renouvellement silencieux. Les durées exactes dépendent de la politique de l’organisation ; les administrateurs peuvent les ajuster dans la console.
:::

---

## 2. Méthodes de connexion prises en charge

| Méthode de connexion | Description | Cas d’usage |
|---------|------|---------|
| **E-mail + mot de passe** | Inscription standard, mot de passe conforme à la politique de complexité | Tous les utilisateurs |
| **Numéro de téléphone + code de vérification** | OTP par SMS (doit être activé par un administrateur) | Selon la configuration de l’organisation |
| **Passkey (WebAuthn)** | Sans mot de passe, biométrie de l’appareil ou clé matérielle | Recommandé pour la plupart des utilisateurs |
| **GitHub / Google / Microsoft·Azure AD / Apple** | Connexion sociale (OAuth2 / OIDC) | Selon la configuration de l’organisation |
| **SSO d’entreprise (OIDC/SAML 2.0)** | Clients B2B s’interconnectant à leur propre IdP (Okta, Feishu, WeCom) | Clients entreprise |
| **LDAP** | Connexion directe au service d’annuaire d’entreprise | Clients en déploiement privé |

::: tip Ordre de priorité recommandé
Passkey > connexion sociale > e-mail et mot de passe. Le Passkey ne nécessite aucune mémorisation de mot de passe, résiste au hameçonnage et offre la sécurité la plus élevée.
:::

---

## 3. Passkey / WebAuthn

**Principe** : basé sur **WebAuthn / FIDO2**, le chiffrement asymétrique remplace le mot de passe. Lors de l’enregistrement, l’appareil génère une paire de clés ; **la clé privée reste sur l’appareil** (protégée par la biométrie/PIN), la clé publique étant transmise à `identity.lurus.cn`. À la connexion, le serveur envoie un défi, l’appareil le signe avec la clé privée et le serveur le vérifie avec la clé publique. L’ensemble du processus se fait **sans aucune transmission de mot de passe** ; une fuite de la base de données ne révèle que la clé publique.

**Enregistrement (actions de l’utilisateur)** :

<ol class="lurus-steps">
<li>Connectez-vous à <code>identity.lurus.cn</code>.</li>
<li>Accédez à <strong>Paramètres du compte → Sécurité → Ajouter un Passkey</strong>.</li>
<li>Nommez le Passkey (par ex. « MacBook Touch ID »).</li>
<li>Effectuez l’identification biométrique (Touch ID / Face ID / PIN / clé matérielle).</li>
<li>À la prochaine connexion, sélectionnez le Passkey pour vous connecter sans mot de passe.</li>
</ol>

::: tip Enregistrez plusieurs Passkeys
Enregistrez-en un sur votre téléphone principal et un sur votre ordinateur portable, afin d’éviter de ne plus pouvoir vous connecter en cas de perte d’un seul appareil.
:::

**Synchronisation multi-appareils** :

| Plateforme | Méthode de synchronisation |
|------|---------|
| iOS / macOS | Apple Keychain (iCloud Keychain), entre les appareils Apple |
| Android / Chrome OS | Google Password Manager, entre Android et Chrome |
| Multiplateforme | Gestionnaires de mots de passe prenant en charge les Passkeys, comme 1Password, Dashlane |
| Clé matérielle | Jetons FIDO2 comme YubiKey, SoloKey (aucune synchronisation nécessaire) |

**Compatibilité des navigateurs** : Chrome/Chromium 108+ (avec synchronisation), Safari 16+ (macOS Ventura / iOS 16, Apple Keychain), Edge 108+ (comme Chrome, prend en charge Windows Hello), Firefox 119+ (prend en charge WebAuthn, mais pas encore la synchronisation cloud des Passkeys).

::: warning Politiques d’entreprise concernant les appareils
Certaines entreprises désactivent l’authentification biométrique de plateforme ou WebAuthn via GPO / MDM. Si vous rencontrez « Impossible de créer un Passkey », contactez votre administrateur informatique ou utilisez une clé matérielle (YubiKey).
:::

---

## 4. Authentification multifacteur (MFA)

**Seconds facteurs disponibles** :

| Facteur | Description | Outils recommandés |
|------|------|---------|
| **TOTP** | Mot de passe à usage unique basé sur le temps (renouvelé toutes les 30 secondes) | Google Authenticator, 1Password, Authy, Microsoft Authenticator |
| **Clé matérielle U2F / WebAuthn** | FIDO2 comme YubiKey, SoloKey, avec pression physique | Série YubiKey 5 |
| **Authentificateur de plateforme WebAuthn** | Biométrie intégrée à l’appareil (Face ID, Windows Hello, empreinte digitale) | Intégré |
| **Email OTP / SMS OTP** | Code de vérification envoyé par e-mail / vers le numéro de téléphone associé (le SMS doit être activé par un administrateur) | Boîte de réception / SMS du téléphone |

::: tip Bonnes pratiques TOTP
Utilisez une application TOTP prenant en charge la sauvegarde cloud (1Password, Authy) pour éviter de perdre l’accès en cas de perte du téléphone. L’ancienne version de Google Authenticator ne prend pas en charge la migration ; exportez impérativement vos données avant toute migration.
:::

**Politiques MFA** (console **Politique de sécurité**) : **non obligatoire** (l’utilisateur l’associe de lui-même) / **obligatoire (tous les utilisateurs)** (au moins un second facteur doit être enregistré après la première connexion) / **obligatoire uniquement pour les utilisateurs locaux** (les connexions via IdP/SSO externe sont exemptées, les comptes locaux doivent obligatoirement en associer un). Cas d’application courants : les comptes à privilèges élevés (administrateurs, finance) sont toujours soumis à l’obligation ; pour les organisations clientes B2B, l’administrateur du client la configure séparément ; les connexions à risque (IP inhabituelle / nouvel appareil) peuvent déclencher une vérification renforcée (Step-up Auth).

**Codes de récupération** : après avoir associé la MFA, un jeu de codes de récupération à usage unique est généré (**Paramètres du compte → Sécurité → Codes de récupération**). Imprimez-les ou stockez-les dans un gestionnaire de mots de passe (**ne les enregistrez pas par capture d’écran dans un album photo cloud**). En cas de perte de l’appareil MFA, connectez-vous avec n’importe quel code de récupération puis réassociez immédiatement la MFA. Chaque code devient invalide après usage ; une fois tous utilisés, regénérez immédiatement un nouveau jeu.

---

## 5. Politique de mot de passe (Password Policy)

Les valeurs ci-dessous correspondent à la base par défaut de l’instance Casdoor ; les administrateurs peuvent les ajuster dans la console. Les exigences réelles s’affichent en temps réel lors de l’inscription ou du changement de mot de passe.

**Complexité** (valeurs par défaut) : longueur minimale de 8 caractères ; au moins une majuscule, une minuscule, un chiffre et un caractère spécial (`!@#$%^&*`, etc.).

**Expiration et historique** : durée de validité maximale (0 = jamais d’expiration) ; avertissement avant expiration (N jours à l’avance ; la version actuelle n’envoie pas d’e-mail, mais affiche un message sur la page lors de la connexion) ; vérification de l’historique des mots de passe (empêche la réutilisation des N derniers).

**Verrouillage après échec de connexion (Lockout)** : nombre maximal d’échecs de mot de passe / nombre maximal d’échecs OTP (réglez sur 0 pour désactiver le verrouillage correspondant). Une fois verrouillé, le compte doit être **déverrouillé manuellement par un administrateur dans la console** ; il ne se déverrouille pas automatiquement.

::: warning Gestion d’un compte verrouillé
Si votre compte est verrouillé en raison d’erreurs répétées de mot de passe ou d’OTP, contactez l’administrateur de votre organisation ou écrivez à **support@lurus.cn** (en indiquant l’e-mail du compte) ; le déverrouillage est traité pendant les heures ouvrées.
:::

---

## 6. Courtage d’identité / Identity Brokering

Casdoor agit comme IdP intermédiaire, en s’interconnectant à un ou plusieurs **IdP externes en amont** (Azure AD/Okta d’entreprise, ou GitHub/Google sociaux). L’utilisateur clique sur « Se connecter avec XXX » → il est redirigé vers l’IdP en amont pour vérification → Casdoor reçoit le résultat → un token Lurus unifié est délivré.

<ArchitectureDiagram
  title="Chaîne d’Identity Brokering"
  chart="graph LR; P[Produit Lurus] --> Z[identity.lurus.cn · Casdoor]; Z --> U[IdP en amont · Azure AD / Okta / GitHub …]; U -. Assertion d’identité utilisateur OIDC/SAML .-> Z; Z -. Délivrance access_token / id_token Lurus .-> P"
/>

**Quand l’utiliser** : SSO B2B pour clients entreprise (les employés se connectent directement avec leur propre Azure AD/Okta, sans inscription) ; routage automatique par domaine (après saisie d’un e-mail d’entreprise, redirection vers l’IdP correspondant selon le domaine, Domain Discovery) ; association de comptes (associer GitHub/Google à un compte Lurus existant) ; création Just-in-Time (la première connexion via un IdP externe crée automatiquement le compte et lui attribue un rôle par défaut).

**Étapes de configuration (administrateur)** : console → **Paramètres de l’instance / Paramètres de l’organisation → Fournisseurs d’identité → Ajouter** → choisir un modèle (EntraID / Okta / GitHub / Google / SAML générique, etc.) → renseigner le Client ID/Secret en amont (OIDC) ou l’EntityID/Metadata URL (SAML) → activer dans la **politique de connexion** et définir si la création automatique de compte est autorisée → tester la connexion et confirmer le mappage des rôles/permissions.

::: info Protocoles pris en charge
**OIDC** : Google, GitHub, Feishu, WeCom, Okta, etc. **SAML 2.0** : Azure AD (EntraID), ADFS, SSO de niveau entreprise. **LDAP** : Active Directory interne ou OpenLDAP de l’entreprise.
:::

---

## 7. Personnalisation de l’interface de connexion (Branding)

Personnalisation au niveau **instance** ou **organisation** : logo (clair/foncé, SVG/PNG), couleur du thème, police, arrière-plan, domaine personnalisé (`auth.yourcompany.com`, nécessite un DNS). Lurus utilise par défaut la palette unifiée du site principal. Les clients B2B peuvent configurer cela dans **Paramètres de l’organisation → Apparence**, sans impact sur les autres organisations.

::: tip Domaine personnalisé et Passkey
La configuration d’un domaine de connexion personnalisé pour une organisation B2B (`auth.client.com`) **doit impérativement être effectuée avant l’enregistrement du premier Passkey**. Un Passkey est lié au domaine utilisé lors de l’enregistrement (RP ID) ; toute modification ultérieure invalidera les Passkeys existants.
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Dépannage</span>
  <h2 class="lurus-section-head__title">8. Questions fréquentes et dépannage</h2>
  <p class="lurus-section-head__lede">Causes et étapes de résolution pour quatre catégories fréquentes de problèmes de connexion / d’autorisation.</p>
</div>

<details class="lurus-faq-item">
<summary>Cookie invalide entre sous-domaines — la connexion est encore exigée en accédant à un autre sous-domaine après s’être connecté ?</summary>

Après s’être connecté sur `app.lurus.cn`, l’accès à `docs.lurus.cn` exige une nouvelle connexion. **Cause** : le `Domain` du cookie de session OIDC est incorrect, ou une restriction CORS bloque les sous-domaines. **Dépannage** : vérifiez que tous les sous-domaines partagent le même domaine de premier niveau et que le cookie est défini avec `Domain=.lurus.cn` ; l’intégration de la page de connexion dans une iframe nécessite `SameSite=None; Secure` et HTTPS.

</details>

<details class="lurus-faq-item">
<summary>Perte de l’appareil associé à la MFA — TOTP ne peut plus générer de code de vérification ?</summary>

Étapes de résolution : ① sur l’écran de vérification MFA, cliquez sur **Se connecter avec un code de récupération** ② saisissez n’importe quel code de récupération ③ une fois connecté, allez immédiatement dans **Paramètres du compte → Sécurité** pour dissocier l’ancienne MFA et réassocier le nouvel appareil ④ si vous avez aussi perdu les codes de récupération, contactez l’administrateur de l’organisation pour forcer une réinitialisation de la MFA.

</details>

<details class="lurus-faq-item">
<summary>Aucune ressource visible après une connexion SSO d’entreprise — le SSO réussit mais sans permission ou sans ressource ?</summary>

**Cause** : ① User Grant non configuré (l’utilisateur n’est pas autorisé sur le Project correspondant) ② Project Role manquant (autorisé mais sans `viewer`/`editor` attribué) ③ le compte créé par JIT n’a pas été ajouté à un groupe. **Dépannage** : console → **Utilisateurs** → ce compte → onglet **Autorisations (Grants)**, et vérifiez le projet et le rôle.

</details>

<details class="lurus-faq-item">
<summary>Passkey inutilisable sur l’ordinateur de l’entreprise — message « Impossible de créer le justificatif » ?</summary>

**Cause** : le MDM/GPO de l’entreprise désactive l’authentificateur de plateforme ou WebAuthn. **Solution** : contactez le service informatique pour lever la restriction / utilisez une clé matérielle multiplateforme comme YubiKey / repliez-vous sur TOTP + mot de passe.

</details>

---

## Documents associés

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Intégration OIDC / OAuth2', link: '/fr/platform/auth/oidc', primary: true },
    { text: 'Authentification API (PAT / JWT)', link: '/fr/platform/auth/api-auth' },
    { text: 'Console d’authentification', link: 'https://identity.lurus.cn', external: true },
  ]"
/>

- [Facturation et abonnements](../billing.md) · [FAQ de la plateforme](../faq.md) · [Guide d’intégration de l’API Lurus](/fr/api/overview) · [Documentation officielle Casdoor](https://casdoor.com/docs) (en anglais)

</div>

<style scoped>
.auth-login .lurus-section-head { margin-top: 8px; }
</style>
