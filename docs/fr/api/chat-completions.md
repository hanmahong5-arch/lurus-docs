---
title: API Chat Completions
description: Référence de l’API Lurus Chat Completions, entièrement compatible avec le format de l’interface OpenAI.
---

<div class="api-chat-page">

# API Chat Completions

L’API de conversation la plus utilisée, entièrement compatible avec l’interface OpenAI Chat Completions.

<ApiEndpoint method="POST" path="/v1/chat/completions" description="Créer une conversation de chat" />

```
POST https://api.lurus.cn/v1/chat/completions
```

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="#réponse-en-flux">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Réponse en flux</div>
    <p class="lurus-card__body">Retour token par token en SSE</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#function-calling">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Function Calling</div>
    <p class="lurus-card__body">Laissez le modèle appeler vos fonctions</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#entrée-multimodale-vision">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Vision multimodale</div>
    <p class="lurus-card__body">Mélangez texte et images en entrée</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#bonnes-pratiques">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">Bonnes pratiques</div>
    <p class="lurus-card__body">Température / System Prompt / multi-tours</p>
  </a>
</div>

---

## Paramètres de la requête

### Obligatoires

| Paramètre | Type | Description |
|------|------|------|
| `model` | string | Nom du modèle, par ex. `deepseek-chat`, `gpt-4o` |
| `messages` | array | Tableau des messages de la conversation, voir le format ci-dessous |

### Paramètres optionnels courants

| Paramètre | Type | Valeur par défaut | Description |
|------|------|--------|------|
| `temperature` | number | 1.0 | Aléa (0–2). Utilisez 0.1 pour le code/les maths, 0.9 pour l’écriture créative |
| `max_tokens` | integer | — | Nombre maximal de tokens générés. Si non défini, c’est le modèle qui décide |
| `stream` | boolean | false | <Term t="Streaming">Sortie en flux</Term> (SSE), voir [Réponse en flux](#réponse-en-flux) |
| `top_p` | number | 1.0 | Échantillonnage par noyau (nucleus sampling), généralement à ajuster en alternative à temperature |
| `stop` | string/array | — | Arrête la génération lorsque cette chaîne est rencontrée |
| `n` | integer | 1 | Nombre de réponses candidates générées simultanément |
| `user` | string | — | Identifiant de l’utilisateur, utilisé pour les journaux d’audit |

### Format des Messages

```json
[
  {"role": "system",    "content": "你是一位专业的技术顾问。"},
  {"role": "user",      "content": "什么是 RESTful API？"},
  {"role": "assistant", "content": "RESTful API 是…"},
  {"role": "user",      "content": "能举个例子吗？"}
]
```

| Rôle | Usage |
|------|------|
| `system` | Définit le comportement, le ton et les limites de l’IA. À placer en premier dans le tableau |
| `user` | L’entrée de l’utilisateur |
| `assistant` | La réponse de l’IA. Dans une conversation multi-tours, il faut y inclure les réponses précédentes |

Les définitions complètes des champs du corps de requête (`ChatCompletionRequest`) et des messages (`Message`) figurent dans la [référence des structures de données](/fr/api/schemas).

---

## Exemple de base

:::tabs
== Python
```python
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-key")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
        {"role": "user",   "content": "什么是 RESTful API？"}
    ],
    temperature=0.3,
    max_tokens=200
)

print(response.choices[0].message.content)
print(f"Token 用量：{response.usage.total_tokens}")  # usage.total_tokens
```

== cURL
```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "system", "content": "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
      {"role": "user",   "content": "什么是 RESTful API？"}
    ],
    "temperature": 0.3
  }'
```

== Node.js
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: process.env.LURUS_API_KEY
});

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: '你是一位专业的技术顾问，回复简洁，不超过 100 字。' },
    { role: 'user',   content: '什么是 RESTful API？' }
  ],
  temperature: 0.3,
  max_tokens: 200
});

console.log(response.choices[0].message.content);
console.log(`Token 用量：${response.usage.total_tokens}`);
```

== Go
```go
package main

import (
    "context"
    "fmt"
    "os"
    openai "github.com/sashabaranov/go-openai"
)

func main() {
    cfg := openai.DefaultConfig(os.Getenv("LURUS_API_KEY"))
    cfg.BaseURL = "https://api.lurus.cn/v1"
    client := openai.NewClientWithConfig(cfg)

    resp, _ := client.CreateChatCompletion(context.Background(),
        openai.ChatCompletionRequest{
            Model:       "deepseek-chat",
            Temperature: 0.3,
            Messages: []openai.ChatCompletionMessage{
                {Role: "system", Content: "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
                {Role: "user", Content: "什么是 RESTful API？"},
            },
        },
    )
    fmt.Println(resp.Choices[0].Message.Content)
    fmt.Printf("Token 用量：%d\n", resp.Usage.TotalTokens)
}
```
:::

---

## Réponse en flux

En définissant `stream: true`, la réponse est renvoyée token par token via des Server-Sent Events, ce qui convient aux applications de type chat.

:::tabs
== Python
```python
stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "写一首关于秋天的四行诗"}],
    stream=True
)

for chunk in stream:
    delta = chunk.choices[0].delta
    if delta.content:
        print(delta.content, end="", flush=True)
print()  # 换行
```

== Node.js
```javascript
const stream = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: '写一首关于秋天的四行诗' }],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}
```
:::

### Format des données en flux

```
data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"落"},"index":0}]}
data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"叶"},"index":0}]}
...
data: [DONE]
```

::: tip
Le dernier `data: [DONE]` indique la fin du flux ; à ce moment-là, `delta.content` est vide.
:::

---

## Function Calling

Laissez l’IA décider quand appeler les fonctions que vous fournissez et renvoyer des paramètres structurés (<Term t="Tool Call">Tool Call</Term>). Cela convient aux scénarios de recherche, d’interrogation de base de données, d’appel d’API externes, etc.

### Déroulement

<ArchitectureDiagram
  title="Déroulement d’un appel Function Calling"
  chart="graph LR; A[Votre requête<br/>avec définition des tools] --> B[Le modèle renvoie<br/>finish_reason: tool_calls]; B --> C[Vous exécutez la fonction<br/>résultat renvoyé avec role: tool]; C --> D[Le modèle combine le résultat<br/>et génère la réponse finale]"
/>

### Exemple complet : interroger la météo

:::tabs
== Python
```python
import json
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-key")

# 定义可调用的函数
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的当前天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称，如"北京"、"上海""
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "温度单位"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

# 第一轮：AI 决定调用哪个函数
messages = [{"role": "user", "content": "北京今天天气怎么样？"}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

msg = response.choices[0].message

# AI 返回了 tool_calls，说明它想调用函数
if msg.tool_calls:
    tool_call = msg.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    print(f"AI 想调用：{tool_call.function.name}({args})")
    # → AI 想调用：get_weather({'city': '北京', 'unit': 'celsius'})

    # 执行你自己的函数（这里模拟返回数据）
    weather_result = {"city": "北京", "temperature": 8, "condition": "晴，有北风"}

    # 第二轮：把函数结果传回给 AI
    messages.append(msg)  # 保留 AI 的 tool_calls 消息
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(weather_result, ensure_ascii=False)
    })

    final = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        tools=tools
    )
    print(final.choices[0].message.content)
    # → 北京今天天气晴，气温 8°C，有北风，出门建议穿厚外套。
```
:::

::: warning Prise en charge par le modèle
Le Function Calling nécessite que le modèle le prenne en charge. Nous recommandons d’utiliser `gpt-4o`, `gpt-4o-mini`, `claude-3-5-sonnet`.
La série DeepSeek le prend aussi en charge, mais le format des paramètres présente de légères différences ; pensez à le vérifier lors de vos tests.
:::

---

## Entrée multimodale (Vision)

Certains modèles peuvent comprendre le contenu des images : il suffit de mélanger texte et images dans `content`.

:::tabs
== Image par URL
```json
{
  "model": "gpt-4o",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "这张图里有什么？"},
      {"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}}
    ]
  }]
}
```

== Image en Base64
```json
{
  "model": "gpt-4o",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "识别图中的文字"},
      {"type": "image_url", "image_url": {
        "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      }}
    ]
  }]
}
```
:::

::: info Modèles prenant en charge la Vision
`gpt-4o`, `gpt-4o-mini`, `gemini-3-pro-preview`, `gemini-3-pro-image-preview`

Limites de taille des images : les images par URL doivent être accessibles publiquement ; pour le Base64, il est recommandé de ne pas dépasser 5 Mo par image.
:::

---

## Bonnes pratiques

### Rédaction du System Prompt

```json
{
  "role": "system",
  "content": "你是一位专业客服。请用友好简洁的语气回答，每条回复不超过 150 字。如遇无法回答的问题，引导用户联系 support@lurus.cn。"
}
```

**Un bon System Prompt comprend : la définition du rôle + les exigences de ton + la limite de longueur + la gestion des cas limites.**

### Repères de réglage de la température

| Scénario | temperature | Description |
|------|-------------|------|
| Génération de code, calculs mathématiques | 0.0–0.2 | Forte déterminité, moins d’aléa |
| Questions-réponses, résumé, classification | 0.3–0.6 | Précis tout en gardant une certaine souplesse |
| Écriture créative, brainstorming | 0.7–1.0 | Grande diversité |
| Histoires aléatoires, jeu de rôle | 1.0–1.5 | Très créatif, peut être instable |

### Gestion des conversations multi-tours

```python
conversation = [
    {"role": "system", "content": "你是一位历史老师。"}
]

def chat(user_input: str) -> str:
    conversation.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=conversation,
        max_tokens=500
    )
    reply = response.choices[0].message.content
    conversation.append({"role": "assistant", "content": reply})
    return reply

print(chat("秦始皇是谁？"))
print(chat("他有哪些重要成就？"))  # 模型能记住上文的"秦始皇"
```

::: tip Gestion de la fenêtre de contexte
La longueur de contexte de chaque modèle est limitée (par ex. `deepseek-chat` accepte 64K tokens). Lorsqu’une conversation devient trop longue, vous pouvez :
1. Tronquer les messages les plus anciens (conserver le system + les N derniers tours)
2. Résumer régulièrement l’historique de la conversation pour réduire la consommation de tokens
:::

---

## Gestion des erreurs

Codes de statut courants : `400` format de requête incorrect → vérifiez la structure JSON et les paramètres obligatoires ; `401` clé invalide/expirée ; `403` pas d’accès à ce modèle → contactez l’administrateur ; `429` limite de débit dépassée → réessayez avec un backoff exponentiel ; `500/502` anomalie du modèle en amont → réessayez ou basculez vers un modèle de secours. Les codes d’erreur complets et la stratégie de réessai figurent dans [Gestion des erreurs](/fr/api/errors).

---

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Gestion des erreurs', link: '/fr/api/errors', primary: true },
    { text: 'Structures de données / Schema', link: '/fr/api/schemas' },
    { text: 'Authentification', link: '/fr/api/authentication' },
    { text: 'Aperçu de l\'API', link: '/fr/api/overview' },
    { text: 'Modèles pris en charge', link: '/guide/models' },
  ]"
/>

</div>

<style>
.api-chat-page .lurus-card__body code {
  font-size: 0.85em;
}
</style>
