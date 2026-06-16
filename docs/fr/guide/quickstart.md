---
title: Démarrage rapide
description: Réalisez votre premier appel à l’API Lurus en moins de 5 minutes, en Python, Node.js, Go ou cURL.
---

<div class="qs-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> Démarrage rapide</span>
  <h1 class="lurus-section-head__title">Votre premier appel en 5 minutes</h1>
  <p class="lurus-section-head__lede">Obtenir une clé → Envoyer une requête → Changer de modèle : trois étapes suffisent.</p>
</div>

::: info Prérequis
Un compte Lurus (l’inscription offre un quota gratuit ; la première étape vous guide pour le créer) · Python 3.8+ / Node.js 18+ / Go 1.21+ / cURL (au choix) · des notions de base du terminal. Durée estimée : 5 minutes.
:::

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Étape 1</span>
  <h2 class="lurus-section-head__title">Créer un compte —— Démarrer gratuitement</h2>
  <p class="lurus-section-head__lede">L’inscription offre un quota gratuit : aucun rechargement n’est nécessaire pour suivre ce tutoriel.</p>
</div>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="coins" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Utilisable dès l’inscription, sans frais</p>
    <div class="lurus-callout__body"><p>Tout nouveau compte reçoit automatiquement <strong>5 鹿贝 + un quota gratuit</strong> (offre Free <strong>100 appels/jour</strong>, incluant <code>deepseek-chat</code> et <code>gpt-3.5-turbo</code>), largement suffisant pour suivre ce tutoriel. Pour les détails sur les quotas et la mise à niveau, voir la <a href="/fr/guide/faq">Foire aux questions</a> et les <a href="/fr/platform/billing">explications de facturation</a>.</p></div>
  </div>
</div>

Créez ensuite une clé d’API :

<ol class="lurus-steps">
<li>

Rendez-vous sur [api.lurus.cn](https://api.lurus.cn), connectez-vous ou inscrivez-vous

</li>
<li>

Allez dans « **Gestion des jetons** » → « **Créer un nouveau jeton** »

</li>
<li>

Copiez la clé générée (format : `sk-xxxxxxxxxxxxxxxx`)

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Conseil de sécurité</p>
    <div class="lurus-callout__body"><p>Une clé d’API équivaut à un mot de passe. <strong>Ne la commitez pas</strong> dans Git, <strong>ne l’écrivez pas</strong> dans du code front-end. Il est recommandé de la transmettre via une variable d’environnement :</p><pre><code>export LURUS_API_KEY="sk-your-key-here"</code></pre></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Étape 2</span>
  <h2 class="lurus-section-head__title">Envoyer votre première requête</h2>
  <p class="lurus-section-head__lede">Choisissez votre langage, copiez et exécutez.</p>
</div>

:::tabs
== Python
```bash
pip install openai
```
```python
from openai import OpenAI
import os

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ["LURUS_API_KEY"])

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手。"},
        {"role": "user", "content": "用一句话介绍什么是人工智能。"}
    ]
)
print(response.choices[0].message.content)
# → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
```

== cURL
```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -d '{ "model": "deepseek-chat", "messages": [
      {"role": "system", "content": "你是一个有帮助的助手。"},
      {"role": "user",   "content": "用一句话介绍什么是人工智能。"} ] }'
# 响应：{ "id":"chatcmpl-abc123", "choices":[{ "message":{"role":"assistant","content":"..."}, "finish_reason":"stop" }],
#        "usage":{ "prompt_tokens":32, "completion_tokens":22, "total_tokens":54 } }
```

== Node.js
```bash
npm install openai
```
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: process.env.LURUS_API_KEY
});

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: '你是一个有帮助的助手。' },
    { role: 'user', content: '用一句话介绍什么是人工智能。' }
  ]
});

console.log(response.choices[0].message.content);
// → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
```

== Go
```bash
go get github.com/sashabaranov/go-openai
```
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
            Model: "deepseek-chat",
            Messages: []openai.ChatCompletionMessage{
                {Role: "system", Content: "你是一个有帮助的助手。"},
                {Role: "user", Content: "用一句话介绍什么是人工智能。"},
            },
        },
    )
    fmt.Println(resp.Choices[0].Message.Content)
    // → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
}
```
:::

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Le modèle a répondu ? Votre premier appel est réussi 🎉</p>
    <div class="lurus-callout__body"><p>Cette requête a utilisé le quota gratuit offert à l’inscription, sans dépenser un centime. Étape suivante : essayez un autre modèle —— le code ne change presque pas.</p></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> Étape 3</span>
  <h2 class="lurus-section-head__title">Changer de modèle</h2>
  <p class="lurus-section-head__lede">Modifiez uniquement le paramètre <code>model</code>, sans toucher au reste du code. Choisissez un modèle : l’extrait ci-dessous se met à jour instantanément et est prêt à copier-coller.</p>
</div>

<ModelPicker />

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Vous ne savez pas lequel choisir ?</p>
    <div class="lurus-callout__body"><p><strong>Usage quotidien</strong> → <code>deepseek-chat</code> (coût le plus bas, meilleur en chinois)<br><strong>Raisonnement complexe</strong> → <code>deepseek-reasoner</code><br><strong>Traitement de longs documents</strong> → <code>gemini-3-pro-preview</code></p><p>Comparatif complet dans <a href="/guide/models">Modèles pris en charge</a>.</p></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Foire aux questions</span>
  <h2 class="lurus-section-head__title">Ça ne marche pas ? Commencez ici</h2>
</div>

<details class="lurus-faq-item">
<summary>Retourne <code>401 Unauthorized</code></summary>

```
{"error": {"code": "invalid_api_key", "type": "authentication_error"}}
```

Vérifiez :

- que la clé commence bien par `sk-`
- le format de l’en-tête : `Authorization: Bearer sk-xxxx` (notez l’espace après Bearer)
- que la clé est à l’état « activé » (à confirmer dans la console)

</details>

<details class="lurus-faq-item">
<summary>Retourne <code>"no available server"</code></summary>

- Vérifiez l’orthographe du nom du `model` (sensible à la casse)
- Confirmez que cette clé a le droit d’accéder à ce modèle
- Si la clé vient d’être créée, attendez environ 10 secondes puis réessayez

</details>

<details class="lurus-faq-item">
<summary>Comment activer la réponse en streaming ?</summary>

Ajoutez `"stream": true` dans le corps de la requête ; voir [<Term t="Streaming">réponse en streaming</Term>](/fr/api/chat-completions#流式响应).

</details>

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Documentation complète Chat Completions', link: '/fr/api/chat-completions', primary: true },
    { text: 'Modèles pris en charge', link: '/guide/models' },
    { text: 'Configurer un client IA', link: '/fr/guide/clients/cherry-studio' },
  ]"
/>

</div>
