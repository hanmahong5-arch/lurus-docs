---
title: Configuration OpenCat
description: Configurer l’API Lurus dans le client OpenCat iOS/macOS.
---

<div class="opencat-page">

# Configuration OpenCat

[OpenCat](https://opencat.app) est une application de chat IA native iOS / macOS, à l’interface épurée, qui prend en charge les API personnalisées. Cette page propose deux méthodes : la configuration en un clic via URL Scheme et la configuration manuelle.

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">Avant de commencer</p>
<div class="lurus-callout__body">Préparez une <Term t="API Key">clé API</Term> Lurus (au format <code>sk-xxxxxxxxxxxxxxxx</code>). Vous n’en avez pas encore ? Rendez-vous sur <a href="/fr/guide/get-api-key">Obtenir une clé API</a>.</div>
</div>
</div>

## Configuration rapide (URL Scheme)

Cliquez sur le lien suivant dans un navigateur ou une note pour basculer en un clic vers OpenCat et remplir automatiquement la configuration :

```
opencat://team/join?domain=https://api.lurus.cn&token=YOUR_API_KEY
```

Remplacez `YOUR_API_KEY` par votre clé (`sk-xxxxxxxxxxxxxxxx`), puis ouvrez le lien dans Safari.

<div class="lurus-callout lurus-callout--tip">
<span class="lurus-callout__icon"><Icon name="smartphone" :size="18" /></span>
<div>
<p class="lurus-callout__title">Raccourci iOS (recommandé)</p>
<div class="lurus-callout__body">Dans l’app Raccourcis d’iOS, créez une action « Ouvrir l’URL », collez l’adresse ci-dessus et saisissez votre clé, puis enregistrez-la sur l’écran d’accueil. La prochaine fois que vous changerez d’appareil, vous pourrez tout configurer en un clic.</div>
</div>
</div>

---

## Configuration manuelle

Si l’URL Scheme ne fonctionne pas (les anciennes versions d’OpenCat ne le prennent pas en charge), configurez manuellement :

<ol class="lurus-steps">
<li>

Ouvrez OpenCat → **Réglages** (avatar en haut à droite) → **Réglages API**.

</li>
<li>

Sélectionnez « **API personnalisée** » et saisissez :

- **API Host** : `https://api.lurus.cn`
- **API Key** : votre clé (`sk-xxxxxxxxxxxxxxxx`)

</li>
<li>

Cliquez sur « **Vérifier la connexion** », puis enregistrez une fois le succès indiqué.

</li>
</ol>

---

## Choisir un modèle

OpenCat ne récupère pas automatiquement la liste des modèles ; vous devez saisir manuellement le nom du modèle. Modèles courants :

| Nom du modèle | Caractéristiques |
|---------|------|
| `deepseek-chat` | Excellent rapport qualité-prix, le meilleur en chinois |
| `deepseek-reasoner` | Raisonnement mathématique et de code |
| `gpt-4o` | Les capacités globales les plus performantes |
| `claude-3-5-sonnet` | Textes longs, écriture créative |
| `gemini-3-pro-preview` | Multimodal, contexte de 1M |

Liste complète sur [Modèles pris en charge](/guide/models).

---

## Questions fréquentes

<details class="lurus-faq-item">
<summary>Le test de connexion échoue avec le message « clé invalide »</summary>

- Vérifiez que l’API Host **ne se termine pas par une barre oblique** (`https://api.lurus.cn`, et non `https://api.lurus.cn/`)
- Vérifiez que le format de la clé API est correct (commence par `sk-`)
- Dans la [console Lurus](https://api.lurus.cn), vérifiez que l’état de la clé est « activée »

</details>

<details class="lurus-faq-item">
<summary>Aucune réponse après la saisie du nom du modèle</summary>

- Vérifiez l’orthographe du nom du modèle (sensible à la casse, par exemple `gpt-4o` et non `GPT-4o`)
- Vérifiez que votre clé dispose des droits d’accès à ce modèle

</details>

<details class="lurus-faq-item">
<summary>Où se trouve la configuration de la version macOS ?</summary>

Accès dans la version macOS : barre de menus **OpenCat** → **Preferences** (<span class="lurus-kbd">⌘,</span>) → onglet **API** ; les paramètres de configuration sont identiques à ceux de la version iOS.

</details>

<NextSteps title="Étapes suivantes" :steps="[
  { text: 'Parcourir les modèles pris en charge', link: '/guide/models' },
  { text: 'Obtenir une clé API', link: '/fr/guide/get-api-key' },
  { text: 'Consulter le démarrage rapide de l\'API', link: '/fr/guide/quickstart' }
]" />

</div>

<style scoped>
.opencat-page .lurus-steps { margin-top: 1rem; }
</style>
