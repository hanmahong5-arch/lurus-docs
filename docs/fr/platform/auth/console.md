---
title: Gestion de la console | Authentification d’identité Zitadel
description: Manuel d’utilisation complet pour gérer les organisations, utilisateurs, projets, applications et politiques d’identité via la console auth.lurus.cn.
---

<div class="console-page">

# Gestion de la console

Lurus utilise [Zitadel](https://zitadel.com) comme plateforme unifiée d’authentification d’identité, avec la console accessible à [auth.lurus.cn](https://auth.lurus.cn). Cet article s’adresse aux **administrateurs d’organisation / équipes IT et exploitation** et couvre l’intégralité des flux d’opérations quotidiennes.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">À qui s’adresse cet article</p>
    <div class="lurus-callout__body">Aux <strong>Org Owner / équipes IT et exploitation</strong> qui doivent gérer les organisations, utilisateurs, projets, applications et politiques d’identité. Les développeurs qui veulent simplement intégrer la connexion consulteront <a href="/fr/platform/auth/oidc">OIDC / OAuth2</a> et <a href="/fr/platform/auth/api-auth">l’authentification API</a>.</div>
  </div>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--auth" href="#_2-组织管理-organization">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">Gestion des organisations</div>
    <p class="lurus-card__body">Création / bascule, vérification de domaine, rôles des membres, métadonnées</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_3-用户管理-users">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">Gestion des utilisateurs</div>
    <p class="lurus-card__body">Human / Service User, PAT, transitions d’état, audit</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_4-项目管理-projects">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">Projets et applications</div>
    <p class="lurus-card__body">Roles, Grant, Redirect URI, paramètres de Token</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_7-策略管理-policies">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Politiques d’identité</div>
    <p class="lurus-card__body">Politiques de connexion / mot de passe / verrouillage / image de marque / notification</p>
  </a>
</div>

---

## 1. Navigation dans la console

Après connexion, vous accédez à la Management Console, divisée en trois zones :

- **Breadcrumb (fil d’Ariane) en haut** : affiche le niveau hiérarchique courant (**niveau Instance** global / **niveau Organization** mono-locataire). Cliquez sur le menu déroulant du nom de l’organisation pour basculer ou en créer une nouvelle (**New organization**). Les opérations de niveau Instance requièrent les droits Instance Manager ; un Org Owner ordinaire ne voit que sa propre Organization.
- **Menu de gauche** :

| Élément de menu | Fonction |
|--------|------|
| **Users** | Gestion des Human User / Service User |
| **Projects** | Gestion des projets, applications et Role |
| **Actions** | Scripts déclenchés par des événements personnalisés |
| **Settings** | Politiques Login / Password Policy / Branding, etc. |
| **IDP** | Fournisseurs d’identité externes (Google / GitHub / SAML, etc.) |

- **Panneau de droite** : en cliquant sur une ressource de la liste, un panneau de détails se déploie et permet d’éditer directement les champs avant d’enregistrer.

---

## 2. Gestion des organisations (Organization)

### 2.1 Créer et basculer entre les organisations

**Créer** : menu déroulant en haut → **New organization** → saisir un nom → choisir l’identité de l’administrateur initial (**Current User** définit le compte courant comme Org Owner / **New Account** crée un compte d’administration distinct) → confirmer.

**Basculer** : menu déroulant du Breadcrumb en haut → cliquer sur le nom de l’organisation cible.

**Point d’entrée d’inscription en libre-service (B2B)** : les clients accèdent à `https://auth.lurus.cn/ui/login/register/org` pour enregistrer eux-mêmes leur organisation.

### 2.2 Définir l’Organization par défaut

Menu gauche **Organizations** (niveau Instance) → ligne de l’organisation cible **« ... »** → **Set as default organization** (l’étiquette **Default** s’affiche sur la ligne).

> Si un utilisateur se connecte sans contexte d’organisation (aucun scope `urn:zitadel:iam:org:id:{id}`), il relève des politiques et de la configuration d’image de marque de l’Organization par défaut.

### 2.3 Vérification de domaine

Lier un domaine d’e-mail d’entreprise à une Organization permet d’activer le routage de connexion par domaine et l’accès direct en authentification unique.

Organization cible → **Settings → Organization Domains → Add Domain** → saisir le domaine (par ex. `lurus.cn`) → choisir la méthode de vérification (**DNS Challenge** : ajouter un enregistrement TXT au DNS, dont la valeur est générée par Zitadel / **HTTP Challenge** : placer un fichier de vérification à un chemin précis du site web) → **Verify** → une fois validé, vous pouvez **Set as primary** pour définir le domaine principal.

::: warning
Après vérification, **ne supprimez pas** l’enregistrement DNS TXT : Zitadel le revérifie périodiquement ; sa suppression invalide l’état du domaine.
:::

### 2.4 Gestion des membres (Organization Members)

**Ajouter** : Organization → **Members → Add Member** → rechercher l’utilisateur (e-mail / nom d’utilisateur) → attribuer un rôle → **Save**. **Retirer** : icône de suppression à droite de la ligne correspondante dans la liste Members.

| Rôle | Périmètre de droits |
|------|---------|
| **Org Owner** | Tous les droits dans l’organisation, y compris la gestion des membres |
| **Org User Manager** | Gestion des Human / Service User |
| **Org User Viewer** | Consultation des utilisateurs en lecture seule |
| **Org Project Creator** | Création de nouveaux Project |
| **Org Project Permission Editor** | Gestion des Project Grant et des attributions de rôles |

### 2.5 Métadonnées (Metadata)

Organization → **Metadata → Add Metadata** → saisir Key / Value → enregistrer. N’importe quelle paire clé-valeur, lisible via l’API pour des champs d’extension métier.

---

## 3. Gestion des utilisateurs (Users)

### 3.1 Human User : création

**Users → New** → renseigner First/Last Name, Email (cocher **Email verified** pour sauter la vérification), Username (par défaut identique à l’Email), Phone (optionnel) → choisir la politique de mot de passe initial (**Setup authentication later** : l’utilisateur définit lui-même à la première connexion / **Send an invitation E-Mail** : envoyer un e-mail d’invitation / **Set an initial password** : l’administrateur le définit directement) → **Create**.

### 3.2 Human User : opérations quotidiennes

- **Réinitialiser le mot de passe** : détails de l’utilisateur → **Security → Send Password Reset Email**, ou **Set New Password** pour le définir directement.
- **Verrouiller / déverrouiller** : en haut à droite de la page de détails, **Lock** / **Unlock** (une fois verrouillé, la connexion est impossible ; les sessions existantes deviennent invalides à la prochaine authentification).
- **Envoyer l’e-mail de mot de passe initial** : page de détails → **Resend Initialization Email**.
- **Réinitialiser le MFA** : détails → **Security → Authenticators** → supprimer le périphérique MFA cible (TOTP / Passkey / U2F) → l’utilisateur devra le réenregistrer à sa prochaine connexion.

### 3.3 Transitions d’état des utilisateurs

<ArchitectureDiagram title="Machine à états des utilisateurs" chart="stateDiagram-v2
  [*] --> Initial: Création
  Initial --> Active: Initialisation terminée
  Active --> Locked: Lock / déclenché par politique
  Locked --> Active: Unlock
  Active --> Inactive: Désactivation
  Active --> Deleted: Suppression
  Deleted --> [*]" />

::: details Version texte du diagramme d’état
```
[Initial] →(完成初始化)→ [Active]
[Active]  →(Lock / 策略触发)→ [Locked] →(Unlock)→ [Active]
[Active]  →(停用)→ [Inactive]    [Active]→(删除)→[Deleted]
```
:::

| État | Description |
|------|------|
| **Initial** | Créé mais le mot de passe initial n’est pas défini ou l’e-mail n’est pas vérifié |
| **Active** | Normal, peut se connecter |
| **Inactive** | Désactivé par un administrateur, connexion impossible |
| **Locked** | Trop d’erreurs de mot de passe ou verrouillage manuel |
| **Deleted** | Supprimé, les données sont conservées à des fins d’audit |

### 3.4 Service User : création et configuration

Pour la communication de machine à machine (CI/CD, appels back-end), sans connexion par mot de passe.

- **Créer** : **Users → Service Users → New** → renseigner Username et Display Name (Description optionnelle) → **Create**.
- **Générer un PAT** : détails → **Personal Access Tokens → New** → date d’expiration optionnelle → après la création, **copiez immédiatement** (une seule fois) → l’appelant définit la variable d’environnement `Authorization: Bearer <token>`.
- **Téléverser une clé publique JWT (Key File)** : détails → **Keys → Add Key** → type **JSON** + date d’expiration → **Add** → télécharger le fichier JSON Key (contient la clé privée, une seule fois) → côté serveur, utilisez la clé privée pour signer un JWT et l’échanger contre un Access Token au token endpoint.

### 3.5 Audit et historique de connexion

- **Historique de connexion** : détails → **Login History** (heure, IP, User Agent, succès/échec).
- **Historique des modifications de ressources** : en bas de la page de détails de toute ressource, **Changes** (Which User / Timestamp / Field / Old → New Value).

---

## 4. Gestion des projets (Projects)

### 4.1 Créer un projet

**Projects → Create New Project** → saisir un nom (par ex. `lurus-api`, `lucrum`, `switch`) → **Continue**.

### 4.2 Paramètres du projet (onglet Settings)

| Paramètre | Description |
|--------|------|
| **Assert Roles on Authentication** | Injecte les Roles dans le Token et le Userinfo lors de la connexion ; activation recommandée |
| **Check Role Assignment on Authentication** | Exige que l’utilisateur ait au moins un Role Grant dans ce Project, sinon la connexion est refusée |
| **Check for Project on Authentication** | Vérifie que l’Organization de l’utilisateur a bien obtenu un Grant pour ce Project |

**Politique de Branding** : **Unspecified** (valeur par défaut du système) / **Enforce project’s policy** (utilise toujours l’image de marque de l’Org propriétaire du projet) / **Allow login user policy** (image de marque initiale du projet, puis bascule vers l’image de marque de l’Org propre de l’utilisateur une fois celui-ci identifié).

### 4.3 Définition des rôles (Project Roles)

Un rôle n’est qu’un identifiant sous forme de chaîne ; sa sémantique est définie par le métier. Détails → **Roles → New Role** → renseigner **Key** (identifiant de code, unique au sein du Project, par ex. `admin`/`viewer`/`trader`), **Display Name** (nom affiché dans la console), **Group** (optionnel, affichage par groupe) → **Save**.

### 4.4 User Grant (attribuer un rôle à un utilisateur)

Détails → **Authorizations → New** → rechercher l’utilisateur cible (Human / Service) → cocher les Role (choix multiple possible) → **Save**.

### 4.5 Project Grant (autorisation inter-organisations, B2B)

Autoriser tout un Project à une autre Organization afin qu’elle puisse gérer les rôles de ses propres utilisateurs au sein de ce projet. Détails → **Project Grants → New** → saisir le domaine de l’Organization partenaire pour la rechercher et la sélectionner → cocher les Role autorisés (possibilité de restreindre à un sous-ensemble) → **Save**.

> L’administrateur de l’Organization bénéficiaire voit ce projet sous **Granted Projects** et peut y attribuer des Role aux utilisateurs de sa propre organisation.

---

## 5. Gestion des applications (Applications)

### 5.1 Choix du type d’application

Détails → **Applications → New Application** → choisir le type :

| Type | Cas d’usage | Flux d’authentification |
|------|---------|---------|
| **Web** | Rendu côté serveur (Spring / PHP / Django) | Authorization Code (PKCE recommandé) + Client Secret |
| **SPA (User Agent)** | Single-page front-end (React / Vue) | Authorization Code + PKCE (sans Client Secret) |
| **Native** | Bureau / mobile (Electron / iOS) | Authorization Code + PKCE |
| **API** | Communication de machine à machine (microservices/scripts) | Client Credentials / JWT Profile |
| **SAML** | Intégration d’entreprise (systèmes ne supportant pas OIDC) | SAML 2.0, téléverser le Metadata XML ou saisir une URL |

### 5.2 Configuration des Redirect URI

- **Correspondance exacte**, sensible à la casse ; plusieurs entrées possibles (production / préproduction / local configurés séparément).
- Les Native App supportent les protocoles personnalisés (`myapp://callback`) ; en IPv6, les crochets doivent être échappés `http://\[::1\]:8080/callback`.
- Configuration Web typique : `https://app.lurus.cn/auth/callback`, `https://staging.lurus.cn/auth/callback`, `http://localhost:3000/auth/callback` (nécessite l’activation du Development Mode).
- **Post-Logout Redirect URI** : adresse de redirection après déconnexion, également en correspondance exacte, plusieurs entrées possibles.

### 5.3 Paramètres de Token (Token Settings)

| Champ | Description | Valeur recommandée |
|------|------|--------|
| **Token Type** | `JWT` (vérification de signature côté client) ou `Opaque` (nécessite un rappel Userinfo) | JWT |
| **Access Token Lifetime** | Durée de validité de l’Access Token | 15 min |
| **Refresh Token Lifetime** | Durée de validité maximale du Refresh Token | 7 days |
| **Refresh Token Idle Lifetime** | Expiration du Refresh Token en cas d’inactivité | 24 h |
| **ID Token Lifetime** | Durée de validité de l’ID Token | 1 h |
| **Add User Roles to Token** | Écrire les Project Roles dans les claims du Token | Selon les besoins |
| **Add User Info to ID Token** | Fusionner les informations utilisateur dans l’ID Token (réduit les requêtes Userinfo) | Optionnel |
| **Clock Skew** | Tolérance de décalage d’horloge serveur autorisé | Par défaut |

### 5.4 Development Mode

Détails → **Redirect Settings** → cocher **Development Mode** : autorise les Redirect URI en `http://` et la correspondance par motif Glob (`*`, `/**`, `?`).

::: warning
Réservé au développement local, **à ne jamais activer en environnement de production**.
:::

### 5.5 Client Secret

Généré automatiquement après la création d’une application Web : affiché une seule fois dans une fenêtre pop-up à la création, **copiez-le immédiatement**. Régénération : détails → **Generate New Client Secret** (l’ancien Secret devient immédiatement invalide).

---

## 6. Fournisseurs d’identité (Identity Providers, IdP)

### 6.1 Types d’IdP intégrés

Organization → **Settings → IDP → Add IDP** :

| Type | Description |
|------|------|
| **Google** | OAuth2, nécessite un Client ID/Secret de Google Cloud Console |
| **GitHub** | OAuth2, nécessite les identifiants d’une GitHub OAuth App |
| **GitLab** | OAuth2, prend en charge GitLab.com ou l’auto-hébergement |
| **Microsoft** | Azure AD / Entra ID, mono/multi-locataire |
| **Apple** | Sign in with Apple, nécessite un compte Apple Developer |
| **Generic OIDC** | N’importe quel Provider OIDC standard, saisir la Discovery URL |
| **Generic SAML** | N’importe quel IdP SAML 2.0, téléverser le Metadata |
| **LDAP** | AD d’entreprise / OpenLDAP |
| **JWT IDP** | Émetteur de jetons JWT personnalisé |

### 6.2 Ajouter un IdP Generic OIDC (exemple)

**Add IDP → Generic OIDC** → renseigner **Name** (texte du bouton sur la page de connexion), **Client ID / Secret** (enregistrés côté IdP), **Issuer / Discovery URL** (par ex. `https://accounts.google.com`) → configurer le mappage des champs (**ID Attribute** généralement `sub` ; First/Last Name / Email / Display Name mappés sur les claims de l’IdP) → définir l'**Auto Linking** (**None** : pas d’association, création à chaque fois / **By Email** : fusion par e-mail identique / **By Username** : fusion par nom d’utilisateur) → **Save**. Une fois activé, le bouton correspondant apparaît sur la page de connexion.

### 6.3 Activer l’IdP dans la Login Policy

**Settings → Login Behavior and Security → External IDPs** → cocher l’IdP que vous venez d’ajouter → enregistrer.

---

## 7. Gestion des politiques (Policies)

Une Organization peut surcharger les politiques par défaut de l’Instance (Organization → **Settings** dans chaque sous-menu).

### 7.1 Login Policy (**Login Behavior and Security**)

| Option | Description |
|------|------|
| **Username / Password** | Autoriser la connexion par nom d’utilisateur et mot de passe |
| **Registration** | Autoriser l’inscription en libre-service |
| **External IDP** | Autoriser la connexion via un IdP tiers |
| **Hide Password Reset** | Masquer le lien « Mot de passe oublié » |
| **Email / Phone as Login Name** | Autoriser l’e-mail/le numéro de téléphone comme nom d’utilisateur |
| **Domain Discovery** | Router automatiquement vers l’Organization correspondante selon le domaine de l’e-mail |
| **Passkey / WebAuthn** | Activer la connexion sans mot de passe |
| **Force MFA** | Imposer l’activation du MFA à tous les utilisateurs |

**Durées de session** : Password Check Lifetime (période de revérification du mot de passe) / External IDP Check Lifetime / MFA Init Skip Lifetime (délai de grâce durant lequel la configuration du MFA peut être ignorée) / Second Factor Check Lifetime.

### 7.2 Password Complexity (**Password Complexity**)

Configurable : longueur minimale (Min Length), exigence ou non de majuscules/minuscules/chiffres/caractères spéciaux.

### 7.3 Lockout (**Lockout**)

**Max Password Attempts** / **Max OTP / TOTP Attempts** (0 signifie illimité). Après verrouillage, un administrateur doit déverrouiller manuellement (détails → **Unlock**).

### 7.4 Password Age (**Password Age**)

**Max Age in Days** (réinitialisation forcée à la connexion après expiration) / **Expiry Warning in Days** (avertissement sur la page de connexion N jours à l’avance).

### 7.5 Branding (**Branding**)

Logo/Icon (un jeu pour le mode clair, un pour le mode sombre), Primary Color, Background Color, Warning Color, Font, **Hide Watermark** (masquer « Powered by ZITADEL »), **Login Name Suffix** (afficher ou non le suffixe du nom de connexion).

### 7.6 Privacy Policy (**Privacy Policy**)

Configurer les URL affichées dans la zone des liens de conformité de la page d’inscription/connexion : Terms of Service, Privacy Policy, Help, Support Email (prend en charge la variable de langue <code v-pre>{{.Lang}}</code>).

### 7.7 Domain Policy (**Domain Policy**)

| Option | Description |
|------|------|
| **Username must contain org domain** | Le nom d’utilisateur devient `{user}@{org}.{instance-domain}` |
| **Validate Organization Domains** | Exige une vérification DNS/HTTP avant de pouvoir utiliser le domaine |
| **SMTP sender address must match domain** | Le domaine de l’expéditeur des e-mails de notification doit correspondre au domaine de l’organisation |
| **Email as username** | Autoriser l’utilisation directe de l’Email comme nom d’utilisateur de connexion |

### 7.8 Notification (**Notifications**)

Événements déclencheurs : revendication de domaine, initialisation d’utilisateur (invitation/mot de passe initial), confirmation d’enregistrement Passkey, réinitialisation de mot de passe, vérification d’Email, modification de mot de passe réussie. Les canaux sont configurés via **Settings → SMTP** / **SMS Providers** (Twilio) avec les identifiants correspondants.

---

## 8. Actions (extensions de code personnalisées)

::: info
Les Actions exécutent du **JavaScript** (bac à sable côté serveur Zitadel) aux points de déclenchement d’événements clés tels que la connexion, l’inscription ou la création d’utilisateur ; leur résultat peut influencer la poursuite ou l’interruption du flux.
:::

Menu gauche **Actions → New Action** → renseigner un nom, choisir le Flow déclencheur et le Trigger Type → écrire la fonction de traitement JS → activer et lier au Flow.

**Usages courants** : appeler un Webhook métier lors de l’inscription d’un utilisateur pour synchroniser vers un CRM/entrepôt de données ; injecter des Claim personnalisés dans le Token (`tenant_id`, `plan_tier`) ; valider une liste blanche de domaines d’e-mail à l’inscription.

**Types de Flow (courants)** :

| Flow | Cas de déclenchement |
|------|---------|
| **Complement Token** | Lors de la génération de l’Access/ID Token, injecter des claims supplémentaires |
| **Internal Authentication** | Après une authentification réussie par mot de passe/Passkey |
| **External Authentication** | Après une authentification réussie via un IdP externe |
| **Save success login** | Lors de l’enregistrement d’une connexion réussie |
| **User Creation** | Après la création complète d’un nouvel utilisateur |

---

## 9. Audit et journaux

- **Flux Events** : niveau Instance via **Events** en haut / niveau Organization via **Events** après être entré. La chronologie liste tous les changements (Event Type / Aggregate / Editor / horodatage).
- **Historique des modifications au niveau ressource** : en bas de la page de détails de chaque ressource, **Changes** (Who / When / Field + Old → New Value).
- **Intégration SIEM** : **Events API** (`/v2/events`) avec filtrage par type d’événement / heure / ID de ressource, pour pousser vers Elasticsearch / Loki / Splunk à des fins d’audit de conformité.

---

## 10. Scénarios d’opérations courants chez Lurus

<p class="console-scenario-lede"><span class="lurus-tag"><Icon name="life-buoy" :size="13" /> Référence rapide</span> Quatre playbooks d’exploitation à haute fréquence — il suffit de les déplier pour les appliquer.</p>

<details class="lurus-faq-item">
<summary><Icon name="user-check" :size="16" /> Arrivée d’un nouvel employé</summary>

<ol class="lurus-steps">
<li><strong>Users → Human Users → New</strong>, renseigner le nom et l’e-mail professionnel, choisir <strong>Send Invitation Email</strong>.</li>
<li>Projet <code>lurus-api</code> → <strong>Authorizations → New</strong> → rechercher cet utilisateur → attribuer un rôle.</li>
<li>Répéter pour attribuer les Grant aux projets <code>lucrum</code>, <code>switch</code>, etc. (selon le poste).</li>
<li>Informer l’employé de relever son e-mail d’initialisation pour définir son mot de passe et enregistrer son MFA.</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="bot" :size="16" /> CI / compte machine</summary>

<ol class="lurus-steps">
<li><strong>Users → Service Users → New</strong>, Username recommandé <code>ci-&lt;service-name&gt;</code>.</li>
<li>Détails → <strong>Personal Access Tokens → New</strong> définir une date d’expiration et copier le Token ; ou <strong>Keys → Add Key</strong> télécharger le fichier JSON Key et configurer la clé privée dans la CI.</li>
<li>Projet correspondant → <strong>Authorizations</strong> attribuer les Role nécessaires.</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="lock" :size="16" /> Départ d’un employé</summary>

<ol class="lurus-steps">
<li>En haut à droite de la page de détails, <strong>Lock</strong> (bloque immédiatement la connexion, conserve le compte et l’audit).</li>
<li>Pour chaque Project associé → <strong>Authorizations</strong> → trouver cet utilisateur → icône de suppression pour révoquer tous les Grant.</li>
<li>Une fois certain que les données d’audit ne sont plus nécessaires (généralement déconseillé), vous pouvez aller plus loin avec <strong>Delete User</strong>.</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="building-2" :size="16" /> Intégration d’un client entreprise (B2B)</summary>

<ol class="lurus-steps">
<li>Niveau Instance → <strong>Organizations → New Organization</strong>, utiliser le nom de la société cliente comme nom.</li>
<li>Ajouter un Org Owner (compte de l’administrateur IT du client).</li>
<li>Organization → <strong>Settings → Organization Domains</strong> vérifier le domaine du client.</li>
<li>Si le client dispose de son propre IdP (Azure AD) : Organization → <strong>Settings → IDP</strong> ajouter un IdP SAML/OIDC.</li>
<li>Projet <code>lurus-api</code> → <strong>Project Grants → New</strong> → choisir l’Organization de ce client → attribuer les Role autorisés.</li>
<li>Une fois connecté, l’Org Owner du client attribue les rôles à ses employés sous <strong>Granted Projects</strong>.</li>
</ol>

</details>

---

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="link" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Documentation associée</p>
    <div class="lurus-callout__body"><a href="/fr/platform/auth/">Vue d’ensemble de l’authentification et points d’entrée</a> · <a href="/fr/platform/auth/oidc">OIDC / OAuth2</a> · <a href="/fr/platform/auth/api-auth">Authentification API</a> · <a href="https://auth.lurus.cn">Console d’authentification ↗</a></div>
  </div>
</div>

*Basé sur une instance Zitadel auto-hébergée (`auth.lurus.cn`) ; les détails de l’interface dépendent de la version réelle. Veuillez synchroniser ce document en cas de changement de politique.*

</div>

<style>
.console-page .lurus-cards { margin: 1.1rem 0 1.4rem; }
.console-page .console-scenario-lede {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}
.console-page .console-scenario-lede .lurus-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.console-page .lurus-faq-item { margin: 0.6rem 0; }
.console-page .lurus-faq-item summary {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
