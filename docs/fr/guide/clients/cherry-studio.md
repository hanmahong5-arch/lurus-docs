---
title: Configuration de Cherry Studio
description: Configurez Lurus API dans Cherry Studio et accédez à plus de 50 modèles d’IA en un clic.
---

<div class="cherry-page">

# Configuration de Cherry Studio

[Cherry Studio](https://cherry-ai.com) est un excellent client d’IA multiplateforme qui prend en charge de nombreux fournisseurs de modèles. Cette page vous guide pour intégrer Lurus API en quelques minutes.

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">Avant de commencer</p>
<div class="lurus-callout__body">Préparez une <Term t="API Key">clé API</Term> Lurus (au format <code>sk-xxx</code>). Vous n’en avez pas encore ? Rendez-vous sur <a href="/fr/guide/get-api-key">Obtenir une clé API</a>.</div>
</div>
</div>

## Étapes de configuration

<ol class="lurus-steps">
<li>

Ouvrez les **paramètres** de Cherry Studio.

</li>
<li>

Sélectionnez « **Fournisseur d’API** ».

</li>
<li>

Cliquez sur « **Ajouter un fournisseur personnalisé** ».

</li>
<li>

Renseignez les informations suivantes :

| Champ | Valeur |
|------|-----|
| Nom | Lurus API |
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | Votre clé API (`sk-xxx`) |

</li>
<li>

**Enregistrez** la configuration.

</li>
</ol>

## Lien de configuration rapide

Cliquez sur le lien suivant pour importer rapidement la configuration :

```
cherrystudio://providers/api-keys?v=1&data={cherryConfig}
```

Remplacez `{cherryConfig}` par vos informations de configuration.

## Sélectionner un modèle

Une fois la configuration terminée, sélectionnez **Lurus API** comme fournisseur dans Cherry Studio pour utiliser tous les modèles pris en charge. Liste complète sur [Modèles pris en charge](/guide/models).

## Questions fréquentes

<details class="lurus-faq-item">
<summary>Échec de connexion ?</summary>

- Vérifiez que la clé API est correcte
- Assurez-vous que la connexion réseau fonctionne
- Vérifiez que la Base URL est correcte (`https://api.lurus.cn/v1`)

</details>

<details class="lurus-faq-item">
<summary>La liste des modèles est vide ?</summary>

Essayez d’actualiser manuellement la liste des modèles dans les paramètres, ou saisissez manuellement le nom d’un modèle comme `deepseek-chat`.

</details>

<NextSteps title="Étapes suivantes" :steps="[
  { text: 'Parcourir les modèles pris en charge', link: '/guide/models' },
  { text: 'Obtenir une clé API', link: '/fr/guide/get-api-key' },
  { text: 'Consulter le démarrage rapide de l’API', link: '/fr/guide/quickstart' }
]" />

</div>

<style scoped>
.cherry-page .lurus-steps { margin-top: 1rem; }
</style>
