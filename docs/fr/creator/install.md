---
title: "Guide d'installation de Creator"
description: "Étapes de téléchargement et d'installation de l'usine de contenu de bureau Creator."
---

<div class="creator-page">

# Guide d'installation

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prérequis · environ 3 minutes</p>
    <div class="lurus-callout__body">Windows 10+ / macOS 12+ / Linux (64 bits) · Lurus <Term t="API Key">API Key</Term> (<a href="/fr/guide/get-api-key">comment l'obtenir</a>, utilisée pour la réécriture par l'IA) · 4 Go+ de mémoire (8 Go+ recommandé).</div>
  </div>
</div>

## Téléchargement

Rendez-vous sur [GitHub Releases](https://github.com/hanmahong5-arch/lurus-creator/releases/latest) pour télécharger le paquet d'installation correspondant à votre plateforme.

| Plateforme | Fichier | Description |
|------|------|------|
| Windows | `LurusCreator-windows-amd64.exe` | Programme d'installation 64 bits |
| macOS (Apple Silicon) | `LurusCreator-darwin-arm64.dmg` | Puces M1/M2/M3 |
| macOS (Intel) | `LurusCreator-darwin-amd64.dmg` | Puces Intel |
| Linux | `LurusCreator-linux-amd64.AppImage` | Format AppImage |

---

## Installation par plateforme

Après le téléchargement, choisissez la méthode d'installation selon votre système d'exploitation.

:::tabs
== Windows

1. Téléchargez `LurusCreator-windows-amd64.exe` et double-cliquez pour l'exécuter.
2. Si « Windows a protégé votre ordinateur » s'affiche, cliquez sur « Informations complémentaires » → « Exécuter quand même ».
3. Terminez l'assistant d'installation, puis lancez l'application depuis le raccourci sur le bureau.
4. **Première configuration** : récupérez votre Key sur [api.lurus.cn](https://api.lurus.cn) et collez-la dans les réglages de Creator (utilisée pour la réécriture par l'IA).
5. Choisissez le répertoire de travail (emplacement de stockage des vidéos/textes).

== macOS

1. Téléchargez le `.dmg` correspondant à votre puce et double-cliquez pour le monter.
2. Glissez **Lurus Creator** dans « Applications ».
3. À la première ouverture, si le message « Impossible de vérifier le développeur » apparaît, allez dans « Réglages Système → Confidentialité et sécurité → Ouvrir quand même ».

== Linux

```bash
# 下载、赋予执行权限、运行
wget https://github.com/hanmahong5-arch/lurus-creator/releases/latest/download/LurusCreator-linux-amd64.AppImage
chmod +x LurusCreator-linux-amd64.AppImage
./LurusCreator-linux-amd64.AppImage
```
:::

---

## Dépendances intégrées

Creator embarque tous les outils nécessaires, aucune installation supplémentaire n'est requise :

| Outil | Usage | Intégré |
|------|------|---------|
| yt-dlp | Téléchargement de vidéos | Intégré |
| ffmpeg | Traitement audio/vidéo | Intégré |
| Whisper | Transcription voix-texte | Intégré (modèles tiny/base) |
| chromedp | Publication automatique | Intégré |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Modèles Whisper</p>
    <div class="lurus-callout__body">Les modèles <code>tiny</code> et <code>base</code> sont intégrés par défaut. Si la qualité de transcription n'est pas suffisante, vous pouvez télécharger des modèles plus volumineux dans les réglages (<code>small</code> / <code>medium</code>) : la précision est meilleure mais ils requièrent davantage de mémoire.</div>
  </div>
</div>

---

## Configuration requise

| Élément | Minimum | Recommandé |
|------|---------|------|
| Mémoire | 4 Go | 8 Go+ |
| Espace disque | 500 Mo (installation) | 10 Go+ (avec cache vidéo) |
| Réseau | Connexion haut débit | Une connexion stable est nécessaire pour télécharger des vidéos |
| GPU | Non requis | Un GPU peut accélérer la transcription Whisper |

---

## Vérifier l'installation

<ol class="lurus-steps">
<li>Ouvrez la page des réglages et vérifiez que l'état de l'API Key affiche « Connecté ».</li>
<li>Cliquez sur « Vérifier les dépendances » et confirmez que tous les outils affichent une coche verte.</li>
<li>Saisissez une URL de vidéo pour tester le téléchargement.</li>
</ol>

---

## Désinstallation

| Plateforme | Action | Emplacement config/cache |
|------|------|--------------|
| **Windows** | Panneau de configuration → Désinstaller un programme → « Lurus Creator » | `%APPDATA%\LurusCreator\` |
| **macOS** | Glissez l'application « Lurus Creator » dans la corbeille | `~/Library/Application Support/LurusCreator/` |
| **Linux** | `rm /opt/lurus-creator` (ou l'emplacement de l'AppImage) | `rm -rf ~/.config/LurusCreator/` |

---

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Manuel d’utilisation', link: '/fr/creator/usage', primary: true },
  { text: 'Cas d’usage', link: '/fr/creator/use-cases' },
  { text: 'Obtenir une API Key', link: '/fr/guide/get-api-key' },
]" />

</div>
