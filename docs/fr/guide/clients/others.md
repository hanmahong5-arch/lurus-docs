---
title: Autres clients
description: Configurer l’API Lurus dans d’autres clients compatibles avec l’API OpenAI.
---

<div class="others-page">

# Autres clients

Tout client prenant en charge l’API OpenAI peut utiliser l’API Lurus. Vous trouverez ci-dessous les paramètres de configuration génériques, une liste des clients courants et des exemples de configuration prêts à copier.

## Configuration générique

Il suffit de renseigner ces deux champs dans les paramètres compatibles OpenAI du client :

| Paramètre | Valeur |
|--------|-----|
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | `sk-your-api-key` |

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">Pas encore de clé ?</p>
<div class="lurus-callout__body">Rendez-vous sur <a href="/fr/guide/get-api-key">Obtenir une clé API</a>. Le nom des modèles peut être consulté dans <a href="/guide/models">Modèles pris en charge</a>.</div>
</div>
</div>

## Clients pris en charge

<div class="lurus-h3">Applications de bureau</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/fr/guide/clients/cherry-studio">
<span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
<div class="lurus-card__title">Cherry Studio</div>
<p class="lurus-card__body">Multiplateforme, riche en fonctionnalités</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">ChatBox</div>
<p class="lurus-card__body">Simple et facile à utiliser</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">BetterChatGPT</div>
<p class="lurus-card__body">Open source et gratuit</p>
</div>
</div>

<div class="lurus-h3">Applications mobiles</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/fr/guide/clients/opencat">
<span class="lurus-card__icon"><Icon name="smartphone" :size="20" /></span>
<div class="lurus-card__title">OpenCat</div>
<p class="lurus-card__body">iOS / macOS</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="smartphone" :size="20" /></span>
<div class="lurus-card__title">ChatGPT Next Web</div>
<p class="lurus-card__body">PWA</p>
</div>
</div>

<div class="lurus-h3">Applications web</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/fr/guide/clients/lobe-chat">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">Lobe Chat</div>
<p class="lurus-card__body">Interface de chat open source moderne</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">ChatGPT Web</div>
<p class="lurus-card__body">Côté navigateur</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="server" :size="20" /></span>
<div class="lurus-card__title">Open WebUI</div>
<p class="lurus-card__body">Auto-hébergé</p>
</div>
</div>

<div class="lurus-h3">Extensions d’IDE</div>

<div class="lurus-cards lurus-cards--compact">
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Continue</div>
<p class="lurus-card__body">VS Code</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Codeium</div>
<p class="lurus-card__body">Complétion dans l’IDE</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Cursor</div>
<p class="lurus-card__body">Éditeur IA</p>
</div>
</div>

<div class="lurus-h3">Outils en ligne de commande</div>

<div class="lurus-cards lurus-cards--compact">
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">llm-cli</div>
<p class="lurus-card__body">Appel depuis le terminal</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">aichat</div>
<p class="lurus-card__body">Appel depuis le terminal</p>
</div>
</div>

## Exemples de configuration

### Cursor

<ol class="lurus-steps">
<li>

Ouvrez **Paramètres → OpenAI API**.

</li>
<li>

**API Key** : saisissez votre clé Lurus.

</li>
<li>

**Base URL** : `https://api.lurus.cn/v1`.

</li>
</ol>

### Continue (VS Code)

Modifiez `~/.continue/config.json` :

```json
{
  "models": [
    {
      "title": "Lurus DeepSeek",
      "provider": "openai",
      "model": "deepseek-chat",
      "apiBase": "https://api.lurus.cn/v1",
      "apiKey": "sk-your-api-key"
    }
  ]
}
```

## Fonctionnalités non prises en charge

Certaines fonctionnalités spécifiques à un client peuvent ne pas être totalement compatibles :

<div class="lurus-callout lurus-callout--warn">
<span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
<div>
<p class="lurus-callout__title">Avertissement de compatibilité</p>
<div class="lurus-callout__body"><ul><li>Conversation vocale en temps réel</li><li>Édition d’images</li><li>API propriétaires de certains fournisseurs</li></ul><p>En cas de problème, veuillez contacter le support technique.</p></div>
</div>
</div>

<NextSteps title="Étapes suivantes" :steps="[
  { text: 'Parcourir les modèles pris en charge', link: '/guide/models' },
  { text: 'Obtenir une clé API', link: '/fr/guide/get-api-key' },
  { text: 'Consulter le démarrage rapide de l\'API', link: '/fr/guide/quickstart' }
]" />

</div>

<style scoped>
.others-page .lurus-h3 { margin-top: 1.6rem; }
.others-page .lurus-steps { margin-top: 1rem; }
</style>
