---
title: "Migrer de OpenAI vers Lurus API"
description: "Basculez vos appels OpenAI vers Lurus API en 5 minutes, sans toucher à votre usage du SDK."
---

<div class="mig-openai-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="import" :size="14" /> Migrer de OpenAI</span>
  <h1 class="lurus-section-head__title">Migrer de OpenAI vers Lurus API</h1>
  <p class="lurus-section-head__lede">Changez une seule ligne de <code>base_url</code> et tous vos appels du SDK OpenAI existants fonctionnent — sans réécrire votre logique métier.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 minutes</span><span class="lurus-stat__label">Durée estimée</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1 endroit</span><span class="lurus-stat__label">Modification de code</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">0 fois</span><span class="lurus-stat__label">Redémarrage</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prérequis</p>
    <div class="lurus-callout__body"><p>Disposer d’une <Term t="API Key">API Key</Term> Lurus (<a href="/fr/guide/get-api-key">comment l’obtenir</a>).</p></div>
  </div>
</div>

## <Icon name="repeat" :size="20" /> Une seule modification

```diff
- from openai import OpenAI
-
- client = OpenAI(api_key="sk-openai-...")
+ from openai import OpenAI
+
+ client = OpenAI(
+     api_key="sk-lurus-...",
+     base_url="https://api.lurus.cn/v1",
+ )
```

C’est tout. Tous les appels `client.chat.completions.create(...)` restent inchangés.

## <Icon name="layers" :size="20" /> Correspondance des noms de modèles

| Modèle OpenAI | Équivalent recommandé Lurus |
|-------------|----------------|
| gpt-5 | `gpt-5` (direct) ou `deepseek-chat` / `claude-sonnet-4` |
| gpt-4o-mini | `deepseek-chat` / `qwen-turbo` |
| gpt-4o | `claude-sonnet-4` / `gemini-3-pro` |
| o1 | `deepseek-reasoner` |
| text-embedding-3-small | `bge-m3` (local) / `text-embedding-3-small` |

Liste complète sur [Modèles pris en charge](/fr/guide/models).

## <Icon name="workflow" :size="20" /> Étapes de mise en production

<ol class="lurus-steps">
<li>

**Vérifier la connectivité** — exécutez une fois ; recevoir une réponse confirme le succès.

```python
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)
```

</li>
<li>

**Bascule progressive** — basculez le trafic de OpenAI vers Lurus par paliers, de `0.1` → `0.5` → `1.0`.

```python
import os, random

def get_client():
    if random.random() < float(os.getenv("LURUS_TRAFFIC", "0.1")):
        return OpenAI(api_key=os.getenv("LURUS_API_KEY"),
                      base_url="https://api.lurus.cn/v1")
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

</li>
<li>

**Rollback** — supprimez `base_url` pour revenir aux appels OpenAI. **Aucun redémarrage requis** (effet par requête).

</li>
</ol>

## <Icon name="life-buoy" :size="20" /> Questions fréquentes

<details class="lurus-faq-item">
<summary>Nom de modèle introuvable ?</summary>

Cherchez dans le [catalogue de modèles](/fr/guide/models), ou ouvrez une Issue.

</details>

<details class="lurus-faq-item">
<summary>Le function calling / le mode JSON sont-ils pris en charge ?</summary>

Lurus est entièrement compatible avec le function calling / JSON Schema de OpenAI.

</details>

<details class="lurus-faq-item">
<summary>Un ID d’organisation est-il nécessaire ?</summary>

Lurus ne requiert pas de champ `organization` ; sa présence superflue ne provoque aucune erreur.

</details>

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Catalogue de modèles', link: '/fr/guide/models', primary: true },
  { text: 'Référence API', link: '/fr/api/overview' },
  { text: 'Facturation Lubei', link: '/fr/platform/billing' },
]" />

</div>
