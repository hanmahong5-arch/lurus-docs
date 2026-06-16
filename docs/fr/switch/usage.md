---
title: Manuel d’utilisation de Switch
description: Guide d’utilisation quotidienne de l’application de bureau Switch, incluant l’intégration rapide et les fonctionnalités avancées.
---

<div class="switch-page">

# Manuel d’utilisation de Switch <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> Démarrage</span>
  <h2 class="lurus-section-head__title">Connecter n’importe quel client OpenAI à Switch</h2>
  <p class="lurus-section-head__lede">Une fois lancé, Switch expose localement un point de terminaison compatible avec l’API OpenAI ; il suffit de modifier une ligne <code>base_url</code> pour que toutes les requêtes soient automatiquement routées par Switch.</p>
</div>

## Intégration rapide

Une fois lancé, Switch expose localement un point de terminaison compatible avec l’API OpenAI `http://localhost:19090/v1` (le port par défaut de la passerelle Switch est 19090). Modifiez le `base_url` de votre application/SDK vers cette adresse, et toutes les requêtes seront automatiquement routées par Switch. Renseignez n’importe quelle valeur pour `api_key` (par exemple `switch`) ; Switch utilise la clé de provider définie dans la configuration.

<ol class="lurus-steps">

<li>

Pointez le `base_url` du client vers le point de terminaison Switch local, renseignez n’importe quelle valeur pour `api_key` (par exemple `switch`), puis envoyez vos requêtes comme d’habitude :

::: code-group

```bash [cURL]
curl http://localhost:19090/v1/chat/completions \
  -H "Content-Type: application/json" -H "Authorization: Bearer switch" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}]}'
```

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:19090/v1",
    api_key="switch",
)
resp = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)
print(resp.choices[0].message.content)
```

```javascript [Node.js]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:19090/v1",
  apiKey: "switch",
});
const resp = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }],
});
console.log(resp.choices[0].message.content);
```

:::

</li>

<li>

Avec le SDK OpenAI (Python / Node.js), il suffit de modifier `base_url`/`baseURL` et `api_key` ; les autres appels restent inchangés — Switch effectue le routage réel à l’aide de la clé de provider définie dans la configuration, et le client n’a pas besoin de connaître le fournisseur en aval.

</li>

</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Pourquoi api_key peut prendre n’importe quelle valeur</p>
    <div class="lurus-callout__body">En tant que proxy local, Switch utilise la véritable clé de provider enregistrée dans la configuration pour appeler le service en aval. Côté client, <code>api_key</code> ne sert que de valeur de remplacement ; il suffit de renseigner <code>switch</code>.</div>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> Intégration</span>
  <h2 class="lurus-section-head__title">Utilisation dans les outils de programmation IA</h2>
  <p class="lurus-section-head__lede">Pour tous les outils, renseignez <code>http://localhost:19090/v1</code> comme API Base / adresse de l’interface, et <code>switch</code> comme API Key.</p>
</div>

## Utilisation dans les outils de programmation IA

Pour tous les outils, renseignez `http://localhost:19090/v1` comme API Base / adresse de l’interface, et `switch` comme API Key :

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="code" :size="22" /></span>
    <div class="lurus-card__title">Cursor</div>
    <p class="lurus-card__body">Paramètres (<code>Ctrl+,</code>) → rechercher « AI » → modifier « OpenAI API Base » vers cette adresse → enregistrer ; la complétion et les conversations passent automatiquement par Switch.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="terminal" :size="22" /></span>
    <div class="lurus-card__title">Continue (VS Code)</div>
    <p class="lurus-card__body">Éditez <code>~/.continue/config.json</code> ; pour chaque entrée de modèle, définissez <code>"provider": "openai"</code>, <code>"apiBase": "http://localhost:19090/v1"</code>, <code>"apiKey": "switch"</code>, et renseignez <code>"model"</code> avec <code>deepseek-chat</code> / <code>gpt-4o</code>, etc.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="22" /></span>
    <div class="lurus-card__title">Cherry Studio</div>
    <p class="lurus-card__body">Paramètres → Configuration de l’API → choisir « OpenAI compatible personnalisé » → renseigner l’adresse et la clé → « Tester la connexion ».</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="bot" :size="22" /></span>
    <div class="lurus-card__title">Lobe Chat</div>
    <p class="lurus-card__body">Paramètres → Modèles de langage → OpenAI → renseigner l’API Key et l’adresse de l’interface.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Runtime</span>
  <h2 class="lurus-section-head__title">Surveillance, bascule et streaming</h2>
</div>

## Surveillance des requêtes

L’onglet « **Journaux** » permet de consulter les journaux de requêtes en temps réel, avec les champs : heure (horodatage), modèle, fournisseur (cible de routage réelle), durée (ms), Token (prompt/completion), statut (200 / 4xx-5xx). « Exporter en CSV » permet d’exporter les enregistrements des 7 derniers jours pour les statistiques de coûts.

## Bascule de fournisseur en un clic

Un clic sur l’icône de la barre de menus (macOS) / la zone de notification système (Windows) permet de : changer de « fournisseur actif courant », désactiver temporairement un fournisseur (débogage) et consulter l’aperçu de la consommation du jour.

## Réponses en streaming

Les réponses en streaming SSE sont entièrement prises en charge et relayées en aval : après `chat.completions.create(..., stream=True)`, itérez sur `chunk.choices[0].delta.content`.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> Avancé</span>
  <h2 class="lurus-section-head__title">Répartition de charge</h2>
  <p class="lurus-section-head__lede">Lorsqu’un même modèle est configuré avec plusieurs fournisseurs, la répartition peut se faire par round-robin ou selon des pondérations.</p>
</div>

## Avancé : répartition de charge

Lorsqu’un même modèle est configuré avec plusieurs fournisseurs, la répartition peut se faire par round-robin ou selon des pondérations :

```json
{
  "routing": {
    "rules": [
      {
        "pattern": "deepseek-chat",
        "providers": [
          { "name": "Lurus API", "weight": 70 },
          { "name": "DeepSeek Official", "weight": 30 }
        ],
        "strategy": "weighted_random"
      }
    ]
  }
}
```

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Dépannage</span>
  <h2 class="lurus-section-head__title">Dépannage</h2>
  <p class="lurus-section-head__lede">Dépliez le symptôme correspondant pour voir les étapes de résolution.</p>
</div>

## Dépannage

<details class="lurus-faq-item">
<summary>« connection refused » — connexion refusée</summary>

Switch n’est pas lancé ou le port est incorrect. Vérifiez le processus et le port :

- Processus : Windows `tasklist | findstr LurusSwitch` / macOS·Linux `ps aux | grep lurus-switch`
- Port : `curl http://localhost:19090/v1/models`

</details>

<details class="lurus-faq-item">
<summary>401 / 403 — échec d’authentification</summary>

La clé d’API du fournisseur est mal configurée. Saisissez-la de nouveau dans l’interface de configuration et cliquez sur « Tester » pour vérifier la connectivité.

</details>

<details class="lurus-faq-item">
<summary>Latence anormalement élevée</summary>

1. Vérifiez dans les journaux que le routage atteint bien le bon fournisseur.
2. Une latence élevée pour les fournisseurs étrangers (OpenAI / Anthropic) est normale (300-1500 ms).
3. Basculez sur les nœuds nationaux de Lurus API (généralement &lt; 200 ms).

</details>

<details class="lurus-faq-item">
<summary>Application macOS qui ne répond plus</summary>

Faites un clic droit sur l’icône de la barre de menus puis « Quitter », et relancez ; ou exécutez dans le terminal :

```bash
pkill -f LurusSwitch && open -a "Lurus Switch"
```

</details>

## Prochaines étapes

<NextSteps :steps="[
  { text: 'Gestion des serveurs MCP', link: '/fr/switch/mcp-servers', primary: true },
  { text: 'Surveillance des coûts', link: '/fr/switch/cost-monitoring' },
  { text: 'Synchronisation de la configuration d\'équipe', link: '/fr/switch/team-config' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
