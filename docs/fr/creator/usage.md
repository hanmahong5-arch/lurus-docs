---
title: "Manuel d'utilisation de Creator"
description: "Guide d'utilisation et présentation des fonctionnalités de l'usine de contenu de bureau Creator."
---

<div class="creator-page">

# Manuel d'utilisation

## Prise en main rapide

<ol class="lurus-steps">
<li>Depuis l'interface principale, cliquez sur «&nbsp;<strong>Nouvelle tâche</strong>&nbsp;».</li>
<li>Collez l'URL de la vidéo (YouTube / Bilibili, etc.).</li>
<li>Choisissez l'opération cible : téléchargement seul / téléchargement + transcription / téléchargement + transcription + réécriture / pipeline complet (avec publication).</li>
<li>Cliquez sur «&nbsp;<strong>Démarrer</strong>&nbsp;» : Creator exécute chaque étape dans l'ordre, et le panneau des tâches affiche la progression en temps réel.</li>
</ol>

---

## Détail du pipeline de contenu

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="video" :size="14" /> Étape 1</span>
  <h2 class="lurus-section-head__title">Téléchargement de la vidéo</h2>
  <p class="lurus-section-head__lede">Prise en charge de plus de 1000 plateformes vidéo (liste complète : voir les sites pris en charge par yt-dlp).</p>
</div>

Liste complète : voir [les sites pris en charge par yt-dlp](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md).

**Sources courantes** :

| Plateforme | Format d'URL |
|------|---------|
| YouTube | `https://www.youtube.com/watch?v=xxx` |
| Bilibili | `https://www.bilibili.com/video/BVxxx` |
| Douyin | `https://www.douyin.com/video/xxx` |
| Twitter/X | `https://x.com/user/status/xxx` |

**Options de téléchargement** :

| Option | Description | Valeur par défaut |
|------|------|--------|
| Qualité vidéo | Maximale / 1080p / 720p / audio uniquement | Maximale |
| Sous-titres | Téléchargement automatique des sous-titres disponibles | Activé |
| Proxy | Proxy HTTP/SOCKS5 (accès aux plateformes étrangères) | Aucun |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> Étape 2</span>
  <h2 class="lurus-section-head__title">Transcription audio</h2>
  <p class="lurus-section-head__lede">Conversion de l'audio en texte à l'aide du modèle OpenAI Whisper.</p>
</div>

| Modèle | Taille | Vitesse | Précision | Cas d'usage |
|------|------|------|--------|---------|
| `tiny` | 75 MB | Très rapide | Moyenne | Aperçu rapide |
| `base` | 142 MB | Rapide | Bonne | Usage quotidien (par défaut) |
| `small` | 466 MB | Moyenne | Excellente | Précision élevée requise |
| `medium` | 1.5 GB | Lente | Remarquable | Contenu professionnel, multilingue |

**Prise en charge des langues** : détection automatique de la langue, ou spécification manuelle (99 langues prises en charge : chinois, anglais, japonais, etc.).

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Étape 3</span>
  <h2 class="lurus-section-head__title">Réécriture par IA</h2>
  <p class="lurus-section-head__lede">Traitement du texte transcrit en appelant des modèles d'IA via l'API Lurus.</p>
</div>

Traitement du texte transcrit en appelant des modèles d'IA via l'[API Lurus](/fr/guide/introduction).

**Modes de réécriture** :

| Mode | Description | Idéal pour |
|------|------|------|
| **Traduction** | Traduire le contenu en langue étrangère vers le chinois | Localisation de vidéos étrangères |
| **Polissage** | Corriger la grammaire, optimiser la formulation | Améliorer la qualité rédactionnelle |
| **Résumé** | Extraire les idées clés, condenser le texte | Vidéo longue → texte court |
| **Développement** | Ajouter des détails et du contexte | Contenu court → article long |
| **Changement de style** | Ajuster le ton (formel ↔ détendu) | Adaptation aux différentes plateformes |
| **Optimisation SEO** | Générer titres, balises et résumés | Améliorer le classement dans les recherches |

**Choix du modèle** :

| Modèle recommandé | Idéal pour | Coût |
|---------|------|------|
| `deepseek-chat` | Réécriture et traduction en chinois | Faible |
| `gpt-4o` | Contenu en anglais, réécriture complexe | Élevé |
| `claude-3-5-sonnet` | Écriture créative, textes longs | Moyen |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="share-2" :size="14" /> Étape 4</span>
  <h2 class="lurus-section-head__title">Publication automatique</h2>
  <p class="lurus-section-head__lede">Publication automatique via le navigateur sans interface chromedp.</p>
</div>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Seules 3 plateformes prennent en charge la publication automatique</p>
    <div class="lurus-callout__body">Actuellement, seules <strong>WeChat Official Account / Douyin / Xiaohongshu</strong> prennent en charge la publication automatique. Pour les autres plateformes (YouTube Shorts / TikTok / Instagram Reels, etc.), le texte peut être généré mais la publication doit être faite manuellement.</div>
  </div>
</div>

**Première configuration** :

<ol class="lurus-steps">
<li>Réglages → «&nbsp;<strong>Plateformes de publication</strong>&nbsp;» → sélectionnez la plateforme cible.</li>
<li>Cliquez sur «&nbsp;<strong>Connexion</strong>&nbsp;» : une fenêtre de navigateur s'ouvre.</li>
<li>Connectez-vous manuellement par scan de QR code ou par mot de passe ; Creator enregistre l'état de connexion.</li>
</ol>

**Paramètres de publication** (configurés indépendamment par plateforme) :

| Paramètre | Description |
|--------|------|
| Modèle de titre | Variables prises en charge : `{{title}}`, `{{date}}`, `{{source}}` |
| Balises | Générées automatiquement ou définies manuellement |
| Vignette | Capturée automatiquement depuis la vidéo ou importée manuellement |
| Heure de publication | Publication immédiate ou programmée |

---

## Traitement par lots

<ol class="lurus-steps">
<li>Créez un fichier texte avec une URL de vidéo par ligne.</li>
<li>Dans Creator, cliquez sur «&nbsp;<strong>Import par lots</strong>&nbsp;» et sélectionnez le fichier.</li>
<li>Choisissez une configuration de traitement unifiée.</li>
<li>Cliquez sur «&nbsp;<strong>Tout démarrer</strong>&nbsp;».</li>
</ol>

### État des tâches

Chaque tâche est suivie indépendamment :

| État | Description |
|------|------|
| `queued` | En attente de traitement |
| `downloading` | Téléchargement de la vidéo en cours |
| `transcribing` | Transcription vocale en cours |
| `rewriting` | Réécriture par IA en cours |
| `publishing` | Publication automatique en cours |
| `completed` | Entièrement terminé |
| `failed` | Échec d'une étape (réessayable) |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Reprise après interruption</p>
    <div class="lurus-callout__body">Une tâche en échec peut reprendre depuis l'étape qui a échoué, sans tout retraiter depuis le début.</div>
  </div>
</div>

---

## Contrôle du budget

Pour éviter une consommation excessive de tokens lors de l'étape de réécriture par IA :

| Paramètre | Description | Valeur par défaut |
|------|------|--------|
| Plafond de tokens par tâche | Nombre maximal de tokens utilisables par tâche | 10,000 |
| Plafond journalier total | Nombre maximal de tokens consommables par jour | 100,000 |
| Comportement en cas de dépassement | Suspendre / ignorer la réécriture / alerter | Suspendre |

Configurable dans Réglages → «&nbsp;**Budget de tokens**&nbsp;».

---

## Raccourcis clavier

| Raccourci | Fonction |
|--------|------|
| <span class="lurus-kbd">Ctrl+N</span> / <span class="lurus-kbd">Cmd+N</span> | Nouvelle tâche |
| <span class="lurus-kbd">Ctrl+V</span> / <span class="lurus-kbd">Cmd+V</span> | Coller l'URL et créer une tâche |
| <span class="lurus-kbd">Ctrl+Shift+S</span> / <span class="lurus-kbd">Cmd+Shift+S</span> | Ouvrir les réglages |
| <span class="lurus-kbd">Space</span> | Suspendre/reprendre la tâche en cours |
| <span class="lurus-kbd">Delete</span> | Supprimer la tâche sélectionnée |

---

## Dépannage

<details class="lurus-faq-item">
<summary>Le téléchargement de la vidéo échoue ?</summary>

Vérifiez le réseau (les vidéos étrangères peuvent nécessiter un proxy) ; certaines plateformes ont des protections anti-scraping, mettez Creator à jour vers la dernière version ; vérifiez le format de l'URL.

</details>

<details class="lurus-faq-item">
<summary>La transcription est imprécise ?</summary>

Utilisez un modèle Whisper plus grand (Réglages → Modèle Whisper) ; spécifiez manuellement la langue de l'audio ; un fort bruit de fond réduit la précision.

</details>

<details class="lurus-faq-item">
<summary>La réécriture par IA dépasse le délai ?</summary>

Vérifiez le solde de votre API Key ; découpez les textes trop longs en segments ; passez à un modèle plus rapide (par ex. `deepseek-chat`).

</details>

<details class="lurus-faq-item">
<summary>La publication échoue ?</summary>

La connexion à la plateforme peut avoir expiré : reconnectez-vous par scan de QR code ; vérifiez que le contenu ne viole pas les règles de la plateforme (titre/image/mots sensibles) ; une modification de l'API de la plateforme peut nécessiter une mise à jour d'adaptation de Creator.

</details>

---

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Cas d’usage', link: '/fr/creator/use-cases', primary: true },
  { text: 'Retour à l’introduction', link: '/fr/creator/' },
  { text: 'Guide d’installation', link: '/fr/creator/install' },
]" />

</div>
