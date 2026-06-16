---
title: Configuration de Lobe Chat
description: Configurer l’API Lurus comme fournisseur de modèles dans Lobe Chat.
---

<div class="lobe-page">

# Configuration de Lobe Chat

[Lobe Chat](https://lobehub.com) est une application de chat IA open source moderne. Cette page présente deux méthodes : la configuration en ligne en un clic et la configuration manuelle.

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">Avant de commencer</p>
<div class="lurus-callout__body">Préparez une <Term t="API Key">clé API</Term> Lurus. Vous n’en avez pas encore ? Rendez-vous sur <a href="/fr/guide/get-api-key">Obtenir une clé API</a>.</div>
</div>
</div>

## Configuration en ligne

Cliquez sur le lien suivant pour configurer directement :

```
https://chat-preview.lobehub.com/?settings={"keyVaults":{"openai":{"apiKey":"YOUR_API_KEY","baseURL":"https://api.lurus.cn/v1"}}}
```

Remplacez `YOUR_API_KEY` par votre clé API.

## Configuration manuelle

<ol class="lurus-steps">
<li>

Ouvrez les **paramètres** de Lobe Chat.

</li>
<li>

Sélectionnez « **Modèles de langage** ».

</li>
<li>

Dans la configuration OpenAI, renseignez :

- **API Key** : saisissez votre clé API Lurus
- **API Proxy** : `https://api.lurus.cn/v1`

</li>
<li>

**Enregistrez** les paramètres.

</li>
</ol>

## Conseils d’utilisation

<div class="lurus-callout lurus-callout--tip">
<span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
<div>
<p class="lurus-callout__title">Astuce</p>
<div class="lurus-callout__body"><ul><li>Lobe Chat utilise par défaut les noms de modèles OpenAI ; vous devez basculer manuellement pendant la conversation</li><li>Nous recommandons <code>deepseek-chat</code> pour le meilleur rapport qualité-prix</li></ul></div>
</div>
</div>

<NextSteps title="Étapes suivantes" :steps="[
  { text: 'Parcourir les modèles pris en charge', link: '/guide/models' },
  { text: 'Obtenir une clé API', link: '/fr/guide/get-api-key' },
  { text: 'Consulter le guide de démarrage rapide de l\'API', link: '/fr/guide/quickstart' }
]" />

</div>

<style scoped>
.lobe-page .lurus-steps { margin-top: 1rem; }
</style>
