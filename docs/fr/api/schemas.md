---
title: Structures de données / Référence des schémas
description: Structures de données des requêtes et réponses de l’API Lurus, générées automatiquement à partir de la spécification OpenAPI (relay.json), toujours en cohérence avec l’implémentation de la passerelle.
---

<div class="api-schemas-page">

# Référence des structures de données

Les structures de données de requête / réponse ci-dessous sont **générées automatiquement** à partir de la spécification <Term t="OpenAPI">OpenAPI</Term> de newapi (`relay.json`) et restent toujours cohérentes avec l’implémentation de la passerelle. La liste complète des points de terminaison figure dans l'[aperçu de l’API](/fr/api/overview), et des exemples d’appels dans [Chat Completions](/fr/api/chat-completions).

::: info Comment mettre à jour
La zone marquée `<!-- sync:schemas -->` de cette page est régénérée par `bun run sync` à partir de `2b-svc-newapi/docs/openapi/relay.json` ; merci de ne pas modifier cette zone manuellement.
:::

<!-- sync:schemas:start -->
_35 structures de données au total (générées automatiquement à partir de la spécification OpenAPI)._

<details class="lurus-faq-item">
<summary><code>AudioTranscriptionResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `text` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ChatCompletionRequest</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `model` | string | oui | ID du modèle |
| `messages` | array&lt;Message&gt; | oui | Liste des messages de la conversation |
| `temperature` | number | — | Température d’échantillonnage |
| `top_p` | number | — | Paramètre d’échantillonnage par noyau (nucleus sampling) |
| `n` | integer | — | Nombre de générations |
| `stream` | boolean | — | Réponse en flux (streaming) ou non |
| `stream_options` | object | — |  |
| `stop` | string \| array&lt;string&gt; | — | Séquences d’arrêt |
| `max_tokens` | integer | — | Nombre maximal de tokens générés |
| `max_completion_tokens` | integer | — | Nombre maximal de tokens de complétion |
| `presence_penalty` | number | — |  |
| `frequency_penalty` | number | — |  |
| `logit_bias` | object | — |  |
| `user` | string | — |  |
| `tools` | array&lt;Tool&gt; | — |  |
| `tool_choice` | string (`none` / `auto` / `required`) \| object | — |  |
| `response_format` | ResponseFormat | — |  |
| `seed` | integer | — |  |
| `reasoning_effort` | string (`low` / `medium` / `high`) | — | Intensité de raisonnement (pour les modèles prenant en charge le raisonnement) |
| `modalities` | array&lt;string (`text` / `audio`)&gt; | — |  |
| `audio` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ChatCompletionResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created` | integer | — |  |
| `model` | string | — |  |
| `choices` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |
| `system_fingerprint` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeMessage</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `role` | string (`user` / `assistant`) | oui |  |
| `content` | string \| array&lt;object&gt; | oui |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeRequest</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `model` | string | oui |  |
| `messages` | array&lt;ClaudeMessage&gt; | oui |  |
| `system` | string \| array&lt;object&gt; | — |  |
| `cache_control` | object | — |  |
| `inference_geo` | string | — |  |
| `max_tokens` | integer | oui |  |
| `temperature` | number | — |  |
| `top_p` | number | — |  |
| `top_k` | integer | — |  |
| `stream` | boolean | — |  |
| `stop_sequences` | array&lt;string&gt; | — |  |
| `tools` | array&lt;object&gt; | — |  |
| `tool_choice` | object | — |  |
| `thinking` | object | — |  |
| `context_management` | object | — |  |
| `output_config` | object | — |  |
| `output_format` | object | — |  |
| `container` | string \| object | — |  |
| `mcp_servers` | array&lt;object&gt; | — |  |
| `metadata` | object | — |  |
| `speed` | string (`standard` / `fast`) | — |  |
| `service_tier` | string (`auto` / `standard_only`) | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `id` | string | — |  |
| `type` | string | — |  |
| `role` | string | — |  |
| `content` | array&lt;object&gt; | — |  |
| `model` | string | — |  |
| `stop_reason` | string (`end_turn` / `max_tokens` / `stop_sequence` / `tool_use`) | — |  |
| `usage` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>CompletionRequest</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `model` | string | oui |  |
| `prompt` | string \| array&lt;string&gt; | oui |  |
| `max_tokens` | integer | — |  |
| `temperature` | number | — |  |
| `top_p` | number | — |  |
| `n` | integer | — |  |
| `stream` | boolean | — |  |
| `stop` | string \| array&lt;string&gt; | — |  |
| `suffix` | string | — |  |
| `echo` | boolean | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>CompletionResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created` | integer | — |  |
| `model` | string | — |  |
| `choices` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>EmbeddingRequest</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `model` | string | oui |  |
| `input` | string \| array&lt;string&gt; | oui | Texte à plonger (embedding) |
| `encoding_format` | string (`float` / `base64`) | — |  |
| `dimensions` | integer | — | Dimension du vecteur de sortie |

</details>

<details class="lurus-faq-item">
<summary><code>EmbeddingResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `object` | string | — |  |
| `data` | array&lt;object&gt; | — |  |
| `model` | string | — |  |
| `usage` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>GeminiModelsResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `models` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>GeminiResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `candidates` | array&lt;object&gt; | — |  |
| `usageMetadata` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ImageResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `created` | integer | — |  |
| `data` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Message</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `role` | string (`system` / `user` / `assistant` / `tool` / `developer`) | oui | Rôle du message |
| `content` | string \| array&lt;MessageContent&gt; | oui | Contenu du message |
| `name` | string | — | Nom de l’expéditeur |
| `tool_calls` | array&lt;ToolCall&gt; | — |  |
| `tool_call_id` | string | — | ID de l’appel d’outil (pour les messages de rôle tool) |
| `reasoning_content` | string | — | Contenu de raisonnement |

</details>

<details class="lurus-faq-item">
<summary><code>MessageContent</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `type` | string (`text` / `image_url` / `input_audio` / `file` / `video_url`) | — |  |
| `text` | string | — |  |
| `image_url` | object | — |  |
| `input_audio` | object | — |  |
| `file` | object | — |  |
| `video_url` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Model</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `id` | string | — | ID du modèle |
| `object` | string | — | Type d’objet |
| `created` | integer | — | Horodatage de création |
| `owned_by` | string | — | Propriétaire du modèle |

</details>

<details class="lurus-faq-item">
<summary><code>ModelsResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `object` | string | — |  |
| `data` | array&lt;Model&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ModerationRequest</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `input` | string \| array&lt;string&gt; | oui |  |
| `model` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ModerationResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `id` | string | — |  |
| `model` | string | — |  |
| `results` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>RerankRequest</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `model` | string | oui |  |
| `query` | string | oui | Texte de la requête |
| `documents` | array&lt;string \| object&gt; | oui | Liste des documents à reclasser |
| `top_n` | integer | — | Renvoyer les N premiers résultats |
| `return_documents` | boolean | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>RerankResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `id` | string | — |  |
| `results` | array&lt;object&gt; | — |  |
| `meta` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponseFormat</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `type` | string (`text` / `json_object` / `json_schema`) | — |  |
| `json_schema` | object | — | Définition JSON Schema |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesCompactionRequest</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `model` | string | oui |  |
| `input` | string \| array&lt;object&gt; | — | Contenu d’entrée, qui peut être une chaîne ou un tableau de messages |
| `instructions` | string | — |  |
| `previous_response_id` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesCompactionResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created_at` | integer | — |  |
| `output` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |
| `error` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesRequest</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `model` | string | oui |  |
| `input` | string \| array&lt;object&gt; | — | Contenu d’entrée, qui peut être une chaîne ou un tableau de messages |
| `instructions` | string | — |  |
| `max_output_tokens` | integer | — |  |
| `temperature` | number | — |  |
| `top_p` | number | — |  |
| `stream` | boolean | — |  |
| `tools` | array&lt;object&gt; | — |  |
| `tool_choice` | string \| object | — |  |
| `reasoning` | object | — |  |
| `previous_response_id` | string | — |  |
| `truncation` | string (`auto` / `disabled`) | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesResponse</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created_at` | integer | — |  |
| `status` | string (`completed` / `failed` / `in_progress` / `incomplete`) | — |  |
| `model` | string | — |  |
| `output` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>SpeechRequest</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `model` | string | oui |  |
| `input` | string | oui | Texte à convertir |
| `voice` | string (`alloy` / `echo` / `fable` / `onyx` / `nova` / `shimmer`) | oui |  |
| `response_format` | string (`mp3` / `opus` / `aac` / `flac` / `wav` / `pcm`) | — |  |
| `speed` | number | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Tool</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `type` | string | — |  |
| `function` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ToolCall</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `id` | string | — |  |
| `type` | string | — |  |
| `function` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Usage</code></summary>

| Champ | Type | Requis | Description |
|------|------|------|------|
| `prompt_tokens` | integer | — | Nombre de tokens du prompt |
| `completion_tokens` | integer | — | Nombre de tokens de complétion |
| `total_tokens` | integer | — | Nombre total de tokens |
| `prompt_tokens_details` | object | — |  |
| `completion_tokens_details` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>VideoRequest</code></summary>

Requête de génération de vidéo

| Champ | Type | Requis | Description |
|------|------|------|------|
| `model` | string | — | ID du modèle / style |
| `prompt` | string | — | Prompt de description textuelle |
| `image` | string | — | Image en entrée (URL ou Base64) |
| `duration` | number | — | Durée de la vidéo (secondes) |
| `width` | integer | — | Largeur de la vidéo |
| `height` | integer | — | Hauteur de la vidéo |
| `fps` | integer | — | Fréquence d’images de la vidéo |
| `seed` | integer | — | Graine aléatoire |
| `n` | integer | — | Nombre de vidéos générées |
| `response_format` | string | — | Format de réponse |
| `user` | string | — | Identifiant de l’utilisateur |
| `metadata` | object | — | Paramètres étendus (par ex. negative_prompt, style, quality_level, etc.) |

</details>

<details class="lurus-faq-item">
<summary><code>VideoResponse</code></summary>

Réponse à la soumission d’une tâche de génération de vidéo

| Champ | Type | Requis | Description |
|------|------|------|------|
| `task_id` | string | — | ID de la tâche |
| `status` | string | — | État de la tâche |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskError</code></summary>

Informations d’erreur d’une tâche vidéo

| Champ | Type | Requis | Description |
|------|------|------|------|
| `code` | integer | — | Code d’erreur |
| `message` | string | — | Message d’erreur |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskMetadata</code></summary>

Métadonnées d’une tâche vidéo

| Champ | Type | Requis | Description |
|------|------|------|------|
| `duration` | number | — | Durée réelle de la vidéo générée |
| `fps` | integer | — | Fréquence d’images réelle |
| `width` | integer | — | Largeur réelle |
| `height` | integer | — | Hauteur réelle |
| `seed` | integer | — | Graine aléatoire utilisée |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskResponse</code></summary>

Réponse à la consultation de l’état d’une tâche vidéo

| Champ | Type | Requis | Description |
|------|------|------|------|
| `task_id` | string | — | ID de la tâche |
| `status` | string (`queued` / `in_progress` / `completed` / `failed`) | — | État de la tâche |
| `url` | string | — | URL de la ressource vidéo (en cas de succès) |
| `format` | string | — | Format de la vidéo |
| `metadata` | VideoTaskMetadata | — |  |
| `error` | VideoTaskError | — |  |

</details>
<!-- sync:schemas:end -->

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Aperçu de l\'API', link: '/fr/api/overview', primary: true },
    { text: 'Chat Completions', link: '/fr/api/chat-completions' },
    { text: 'Répertoire des intégrations et MCP', link: '/integrations/' },
    { text: 'Gestion des erreurs', link: '/fr/api/errors' },
  ]"
/>

</div>
