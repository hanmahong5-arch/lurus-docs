---
title: Questions fréquentes MemX
description: Questions fréquentes et réponses sur le moteur de mémoire IA MemX.
---

<div class="memx-faq">

# Questions fréquentes

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> Bases</span>
  <h2 class="lurus-section-head__title">Questions de base</h2>
</div>

<details class="lurus-faq-item"><summary>Quelle est la relation entre MemX et mem0 ?</summary>

MemX est la version améliorée (un surensemble) de [mem0](https://github.com/mem0ai/mem0), avec une nouvelle couche de gestion intelligente de la mémoire ACE. Lorsque `ace_enabled=False`, son comportement est strictement identique à celui de mem0, sans aucun surcoût.

</details>

<details class="lurus-faq-item"><summary>Un GPU est-il nécessaire ?</summary>

Non. Le modèle d’embedding local all-MiniLM-L6-v2 s’exécute sur le CPU via ONNX Runtime (&lt; 5 ms/entrée) ; le pré-filtrage par règles du Reflector ne dépend pas du GPU, et le raffinement LLM du mode hybrid passe par une API distante.

</details>

<details class="lurus-faq-item"><summary>Cela engendre-t-il une consommation supplémentaire de tokens LLM ?</summary>

Par défaut, le mode `hybrid` n’appelle le LLM que pour les candidats à valeur, réduisant les appels de plus de 90 % par rapport à l’appel systématique de mem0 ; lorsque le LLM est indisponible, il se rabat automatiquement sur des règles pures, sans coût. Pour le désactiver explicitement, définissez `reflector.mode="rules"`.

</details>

<details class="lurus-faq-item"><summary>Quelles bases de données vectorielles sont prises en charge ?</summary>

Toutes celles héritées de mem0 (Qdrant, Chroma, Pinecone, Weaviate, Milvus, etc.), le stockage en mémoire par défaut convenant au développement et aux tests.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Utilisation</span>
  <h2 class="lurus-section-head__title">Questions d’utilisation</h2>
</div>

<details class="lurus-faq-item"><summary>Comment migrer depuis mem0 ?</summary>

<ol class="lurus-steps">
<li>

`pip install git+https://github.com/UU114/memx.git`

</li>
<li>

Remplacez `from mem0 import Memory` par `from memx import Memory`

</li>
<li>

Le code existant n’a pas besoin d’être modifié (ACE est désactivé par défaut).

</li>
<li>

Une fois prêt, ajoutez `config={"ace_enabled": True}` pour activer les fonctionnalités intelligentes.

</li>
</ol>

</details>

<details class="lurus-faq-item"><summary>Où les données sont-elles stockées ?</summary>

Cela dépend du backend de base de données vectorielle configuré ; par défaut en mémoire (perdues au redémarrage), il est recommandé en production de persister avec Qdrant/Chroma. Le modèle d’embedding local est mis en cache dans `~/.memx/models/`.

</details>

<details class="lurus-faq-item"><summary>Comment contrôler la vitesse de décroissance ?</summary>

| Paramètre | Effet |
|------|------|
| `decay.half_life_days` | Augmenter → décroissance plus lente (30 jours par défaut) |
| `decay.boost_factor` | Augmenter → renforcement du rappel plus marqué (0,1 par défaut) |
| `decay.permanent_threshold` | Diminuer → devient plus facilement une mémoire permanente (15 fois par défaut) |

</details>

<details class="lurus-faq-item"><summary>Comment traiter une connaissance mal interprétée ?</summary>

<ol class="lurus-steps">
<li>

`memx list --scope project:my-app` — consulter

</li>
<li>

`memx forget <memory-id>` — supprimer

</li>
<li>

`memx learn "correct knowledge"` — ajouter manuellement

</li>
</ol>

</details>

<details class="lurus-faq-item"><summary>Comment partager la mémoire entre plusieurs personnes / plusieurs agents ?</summary>

Activez le mode démon : plusieurs agents partagent une même base de connaissances via une socket IPC (plugins d’IDE, collaboration d’équipe), et utilisez `scope` pour distinguer les projets/espaces de travail.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Confidentialité</span>
  <h2 class="lurus-section-head__title">Questions de confidentialité</h2>
</div>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Le filtrage ne peut pas être désactivé</p>
    <div class="lurus-callout__body"><p>Les 12 règles intégrées de filtrage des informations sensibles constituent une limite de sécurité indésactivable ; seul l’ajout de règles supplémentaires via <code>privacy_custom_patterns</code> est possible.</p></div>
  </div>
</div>

<details class="lurus-faq-item"><summary>Quels types d’informations sensibles sont filtrés ?</summary>

| Type | Exemple |
|---------|------|
| Clé privée PEM | `-----BEGIN RSA PRIVATE KEY-----` |
| Token Bearer / JWT | `Bearer eyJhbG...` |
| Clé API Anthropic | `sk-ant-api03-*` |
| Clé API OpenAI | `sk-proj-*` |
| Token GitHub | `ghp_*`, `github_pat_*` |
| Clé d’accès AWS | `AKIA*` |
| Clé secrète AWS | 40 caractères base64 |
| Chaîne de connexion à une base de données | `postgres://user:pass@host/db` |
| Chemin du système d’exploitation | `/home/user/.ssh/id_rsa` |
| Règle personnalisée | ajoutée via `privacy_custom_patterns` |

::: info
Ces 12 règles ciblent les informations sensibles de type **secrets et chemins locaux** (secrets + user paths), et non les PII au sens traditionnel (e-mail / téléphone / carte d’identité, etc.). Si vous avez besoin d’un filtrage des PII, étendez-le vous-même via `privacy_custom_patterns`.
:::

</details>

<details class="lurus-faq-item"><summary>Que deviennent les valeurs originales après filtrage ?</summary>

Elles sont remplacées par un espace réservé (par exemple `[REDACTED:api_key]`), et la valeur originale n’est stockée nulle part. Le filtrage est exécuté tout en amont du pipeline d’écriture.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Performance</span>
  <h2 class="lurus-section-head__title">Questions de performance</h2>
</div>

<details class="lurus-faq-item"><summary>Combien de mémoires peut-on stocker ?</summary>

Cela dépend de la capacité du backend de base de données vectorielle ; MemX lui-même n’impose aucune limite stricte ; le moteur de décroissance archive automatiquement afin de maintenir une taille active raisonnable.

</details>

<details class="lurus-faq-item"><summary>RecallReinforcer affecte-t-il les performances de recherche ?</summary>

Non. Il s’exécute dans un thread d’arrière-plan asynchrone et ne met à jour `recall_count` qu’après le renvoi des résultats, sans bloquer la recherche.

</details>

<details class="lurus-faq-item"><summary>Quelle est la latence de récupération ? (&lt; 10 000 mémoires)</summary>

| Opération | Latence |
|------|------|
| Recherche hybride à quatre couches | 10-50 ms |
| Recherche par mots-clés pure (repli L4) | 5-20 ms |
| Calcul d’embedding local | &lt; 5 ms |
| Écriture (avec Reflector + Curator) | 20-100 ms |

</details>

## Étapes suivantes

<NextSteps
  :steps="[
    { text: 'Démarrage rapide — découvrez les fonctionnalités essentielles en 5 minutes', link: '/fr/memx/quickstart', primary: true },
    { text: 'Concepts fondamentaux — au cœur du moteur ACE', link: '/fr/memx/concepts' },
    { text: 'Conception architecturale — architecture complète du système', link: '/fr/memx/architecture' },
  ]"
/>

</div>
