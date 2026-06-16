---
title: Présentation de l’API Lurus
description: Une seule API Key pour accéder à plus de 50 modèles d’IA majeurs, entièrement compatible avec le SDK OpenAI, intégrable en deux lignes de modifications.
---

<div class="lurus-api-intro">

<ProductHero product-id="lurus-api" />

<MetricStats :items="[
  { label: 'Modèles disponibles', value: '50+' },
  { label: 'Quota gratuit', value: '100 requêtes/jour' },
  { label: 'Compatibilité', value: 'OpenAI SDK' },
]" />

**Une seule <Term t="API Key">API Key</Term> pour accéder à plus de 50 modèles d’IA majeurs.** Entièrement compatible avec le <Term t="SDK">SDK</Term> OpenAI, votre code existant ne nécessite que deux lignes de modifications, sans réécriture.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Choisir un parcours</span>
  <h2 class="lurus-section-head__title">Quel type d’utilisateur êtes-vous ?</h2>
  <p class="lurus-section-head__lede">Trois points d’entrée : choisissez celui qui correspond à votre profil et commencez directement.</p>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/fr/guide/clients/cherry-studio">
    <span class="lurus-card__icon"><Icon name="rocket" :size="22" /></span>
    <div class="lurus-card__title">Vous voulez tester rapidement, sans bagage technique</div>
    <p class="lurus-card__body">Configurez d’abord un client d’IA (Cherry Studio / Lobe Chat), saisissez votre API Key et vous pouvez discuter, le tout sans écrire une seule ligne de code.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/fr/guide/quickstart">
    <span class="lurus-card__icon"><Icon name="code" :size="22" /></span>
    <div class="lurus-card__title">Vous êtes développeur et souhaitez intégrer des capacités d’IA</div>
    <p class="lurus-card__body">Réalisez votre premier appel API en 5 minutes, avec prise en charge de Python / Node.js / Go / cURL.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/migrations/from-openai">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="22" /></span>
    <div class="lurus-card__title">Vous utilisez déjà OpenAI et voulez migrer / réduire les coûts</div>
    <p class="lurus-card__body">Remplacez deux lignes de code pour migrer, toutes les fonctionnalités du SDK OpenAI restent entièrement compatibles.</p>
  </a>
</div>

::: info J’utilise déjà OpenAI, je veux migrer / réduire les coûts
Remplacez deux lignes de code pour migrer, toutes les fonctionnalités du SDK OpenAI restent entièrement compatibles :
```python
# 改这两行，其余代码不动
base_url="https://api.lurus.cn/v1"
api_key="sk-your-lurus-key"
```
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Capacités clés</span>
  <h2 class="lurus-section-head__title">Une passerelle, quatre missions</h2>
  <p class="lurus-section-head__lede">Accès unifié, routage intelligent, contrôle des coûts et gestion des accès de niveau entreprise.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-lurus-api)"
  :items="[
    { title: 'API unifiée', body: 'Une seule interface couvre tous les modèles, il suffit de changer le nom du model, sans avoir à écrire un adaptateur pour chaque fournisseur.', icon: 'plug-zap' },
    { title: 'Routage intelligent et basculement automatique', body: 'Redondance multi-canaux (bascule automatique en cas d’échec du canal principal), équilibrage de charge pondéré (répartition proportionnelle pour équilibrer coût et vitesse), stratégie de priorité (privilégier les canaux à faible coût, puis basculer vers une solution de secours plus coûteuse en cas de dépassement).', icon: 'shuffle' },
    { title: 'Contrôle des coûts granulaire', body: 'Quota de Token par API Key avec blocage en cas de dépassement ; consultation par jour/mois du nombre d’appels, des Token et du détail des coûts ; alerte lorsque le quota restant est inférieur à 20 %.', icon: 'wallet' },
    { title: 'Gestion des accès de niveau entreprise', body: 'Attribution multi-clés par projet, liste blanche de modèles, liste blanche d’IP, journaux d’audit complets, avec enregistrement du modèle/des Token/de la latence pour chaque requête.', icon: 'shield-check' },
  ]"
/>

**Exemple d’API unifiée** — il suffit de changer le nom du `model` pour changer de fournisseur :

```python
from openai import OpenAI
client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-api-key")
# model 可填 deepseek-chat / gpt-4o / claude-3-5-sonnet / gemini-3-pro-preview
response = client.chat.completions.create(model="deepseek-chat", messages=[{"role": "user", "content": "你好"}])
```

### <Icon name="shield-check" :size="20" /> Gestion des accès de niveau entreprise

| Fonctionnalité | Description |
|------|------|
| Gestion multi-clés | Attribuer une clé indépendante à chaque projet/équipe |
| Liste blanche de modèles | Restreindre une clé à des modèles précis |
| Liste blanche d’IP | N’autoriser les appels que depuis des plages d’IP précises |
| Journaux d’audit complets | Le modèle, les Token et la latence sont enregistrés pour chaque requête |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> Cas d’usage</span>
  <h2 class="lurus-section-head__title">Qui utilise l’API Lurus</h2>
</div>

| Cas d’usage | Ce que vous pouvez faire |
|------|-----------|
| **Développement d’applications d’IA** | Accéder à tous les fournisseurs avec le même code, et effectuer rapidement des tests A/B sur différents modèles |
| **Optimisation des coûts** | Confier les tâches courantes à DeepSeek (faible coût), et les tâches complexes à GPT-4o (haute qualité) |
| **Stabilité du service** | Redondance multi-canaux : la panne d’un fournisseur n’affecte pas votre service |
| **Gestion d’équipe** | Attribuer des clés et des quotas, consulter de manière centralisée l’usage et les coûts d’IA de toute l’équipe |
| **Clients d’IA** | Fournir un backend unifié à des outils comme Cherry Studio, Lobe Chat, OpenCat |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> Vue d’ensemble de l’architecture</span>
  <h2 class="lurus-section-head__title">Comment circule une requête</h2>
</div>

<ArchitectureDiagram
  title="Flux de données de la passerelle API Lurus"
  chart="graph LR; A[Votre application / client d’IA] --> B[Lurus API Gateway]; B --> C[Authentification]; C --> D[Routage]; D --> E[Limitation de débit]; E --> F[Facturation]; F --> G[Journalisation]; D --> H[OpenAI]; D --> I[Claude]; D --> J[Gemini]; D --> K[DeepSeek]"
/>

La passerelle route selon la priorité des canaux configurée ; lorsqu’un fournisseur renvoie une erreur, elle réessaie automatiquement avec le suivant, sans que le code ne perçoive le basculement.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="graduation-cap" :size="14" /> Parcours d’apprentissage recommandé</span>
  <h2 class="lurus-section-head__title">Maîtriser tout le flux en 20 minutes</h2>
  <p class="lurus-section-head__lede">Première utilisation ? Suivez l’ordre.</p>
</div>

<ol class="lurus-steps">
<li>

[Obtenir une API Key](/fr/guide/get-api-key) — inscrivez-vous et créez votre première clé (3 minutes)

</li>
<li>

[Démarrage rapide](/fr/guide/quickstart) — envoyez votre première requête API (5 minutes)

</li>
<li>

[Modèles pris en charge](/guide/models) — découvrez les modèles disponibles et comment les choisir

</li>
<li>

[API Chat Completions](/fr/api/chat-completions) — maîtrisez l’interface la plus utilisée

</li>
</ol>

::: details Utilisateurs avancés, allez directement à…
- [Function Calling](/fr/api/chat-completions#function-calling) — laissez l’IA appeler vos fonctions
- [Réponses en streaming](/fr/api/chat-completions#流式响应) — sortie mot à mot pour une meilleure expérience
- [Vue d’ensemble de la référence API](/fr/api/overview) — liste complète des endpoints
:::

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Démarrage rapide', link: '/fr/guide/quickstart', primary: true },
    { text: 'Modèles pris en charge', link: '/guide/models' },
    { text: 'Console', link: 'https://api.lurus.cn', external: true },
  ]"
/>

<RelatedProducts product-id="lurus-api" />

</div>
