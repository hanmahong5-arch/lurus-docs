---
title: Modèles pris en charge
description: "Liste de tous les modèles d'IA pris en charge par l'API Lurus, avec tarifs, fenêtre de contexte et comparaison des capacités."
---

<script setup>
import { data } from '../../.vitepress/data/models.data'
</script>

<div class="models-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Catalogue de modèles</span>
  <h1 class="lurus-section-head__title">Modèles pris en charge</h1>
  <p class="lurus-section-head__lede">Différents modèles des principaux fournisseurs d'IA, accessibles uniformément via leur nom de <code>model</code> ; cette page est rendue automatiquement à partir de <code>data/models.yaml</code>, la liste reste donc toujours synchronisée avec le fichier de données.</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="filter" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Comment ajouter un modèle</p>
    <div class="lurus-callout__body">Pour ajouter un nouveau modèle, il suffit de modifier <code>lurus-docs/data/models.yaml</code> ; après le push, la CI reconstruit et met à jour automatiquement.</div>
  </div>
</div>

## Liste des modèles

<ModelTable
  v-for="v in data.vendors"
  :key="v.name"
  :vendor="v.name"
  :tagline="v.tagline"
  :models="v.models"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> Guide de sélection</span>
  <h2 class="lurus-section-head__title">Comment choisir un modèle</h2>
  <p class="lurus-section-head__lede">Repérez rapidement le bon modèle selon le type de tâche et le budget.</p>
</div>

### Choisir selon la tâche

| Cas d'usage | Modèle recommandé |
|------|---------|
| Conversation courante | `deepseek-chat` (meilleur rapport qualité-prix) |
| Génération de code | `deepseek-reasoner` / `gpt-4o` |
| Raisonnement mathématique | `deepseek-reasoner` / `claude-3-opus` |
| Analyse de longs documents | `gemini-3-pro-preview` (contexte 1M) |
| Écriture créative | `claude-3-5-sonnet` |
| Tâches en anglais | `gpt-4o` / `claude-3-5-sonnet` |
| Tâches en chinois | `deepseek-chat` |
| Compréhension d'images | `gemini-3-pro-image-preview` / `gpt-4o` |
| Génération d'images | `dall-e-3` / `midjourney` |

### Choisir selon le budget

| Fourchette de budget | Modèle recommandé |
|---------|---------|
| Bas (&lt; ¥5/M tokens) | `deepseek-chat`, `gpt-3.5-turbo`, `gemini-3-flash-preview` |
| Moyen (¥5–20/M tokens) | `claude-3-sonnet`, `gemini-3-pro-preview`, `gpt-4o-mini` |
| Élevé (&gt; ¥20/M tokens) | `gpt-4o`, `claude-3-opus` |

## Changer de modèle

Tous les modèles partagent le même format d'API ; il suffit de remplacer le champ `model` (le reste du code ne change pas) : `client.chat.completions.create(model="deepseek-chat", ...)` → `model="gemini-3-pro-preview"`.

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Points d'attention</p>
    <div class="lurus-callout__body"><ul><li><strong>Disponibilité des modèles</strong> : le statut <code>Beta</code> correspond à une version en préversion, dont l'interface peut évoluer.</li><li><strong>Limites de quota</strong> : différentes clés d'API peuvent avoir des droits d'accès aux modèles différents.</li><li><strong>Variations de prix</strong> : la tarification évolue selon les fournisseurs ; la console fait foi.</li><li><strong>Limite de contexte</strong> : les requêtes dépassant la longueur de contexte sont tronquées ou renvoient une erreur.</li></ul></div>
  </div>
</div>

<NextSteps
  title="下一步"
  :steps="[
    { text: 'Démarrage rapide', link: '/fr/guide/quickstart', primary: true },
    { text: 'API Chat Completions', link: '/fr/api/chat-completions' },
    { text: 'Questions fréquentes', link: '/fr/guide/faq' },
  ]"
/>

</div>
