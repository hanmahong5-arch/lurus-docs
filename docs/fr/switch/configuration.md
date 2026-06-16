---
title: Configuration de Switch
description: Configuration des outils IA de Switch, gestion des serveurs MCP et paramètres de surveillance des coûts.
---

<div class="switch-page">

# Configuration de Switch

## Ouvrir l’interface de configuration

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Icône de la barre de menus</div>
    <p class="lurus-card__body">macOS / Linux : cliquez sur l’icône de la barre de menus → « Configuration ».</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Zone de notification système</div>
    <p class="lurus-card__body">Windows : clic droit sur l’icône de la zone de notification → « Ouvrir la configuration ».</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Raccourci clavier</div>
    <p class="lurus-card__body"><span class="lurus-kbd">Ctrl+Shift+S</span> (Win/Linux) / <span class="lurus-kbd">Cmd+Shift+S</span> (macOS).</p>
  </div>
</div>

---

## Ajouter un fournisseur de modèles

Onglet « **<Term t="Provider">Fournisseur</Term>** » → « **Ajouter un fournisseur** », renseignez le nom du fournisseur + l’API Base URL + l’API Key :

| Fournisseur | API Base URL | API Key |
|------|------|------|
| **Lurus API** <span class="lurus-tag">recommandé</span> | `https://api.lurus.cn/v1` | Lurus Key (commençant par `sk-`) ; pour les modèles, cliquez sur « Détection automatique » |
| **OpenAI** | `https://api.openai.com/v1` | `sk-...` (officiel) |
| **Anthropic** | `https://api.anthropic.com/v1` | `sk-ant-...` |
| **Ollama** (local) | `http://localhost:11434/v1` | (laisser vide) |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> Routage</span>
  <h2 class="lurus-section-head__title">Configurer les règles de routage</h2>
  <p class="lurus-section-head__lede">Définissez quelle requête est dirigée vers quel fournisseur ; les requêtes non correspondantes sont dirigées vers le fournisseur par défaut (par défaut → Lurus API).</p>
</div>

**Routage par nom de modèle** : `gpt-*` → OpenAI ; `claude-*` → Anthropic ; `deepseek-*` / `*` (autres) → Lurus API ; `llama*` → Ollama. JSON :

```json
{ "rules": [
    { "pattern": "gpt-*", "provider": "OpenAI" },
    { "pattern": "claude-*", "provider": "Anthropic" },
    { "pattern": "llama*", "provider": "Ollama" },
    { "pattern": "*", "provider": "Lurus API" }
  ] }
```

**Routage par application (avancé)** : définissez des routages différents pour différentes applications locales :

```json
{
  "app_rules": [
    {
      "app": "cursor",
      "default_provider": "Lurus API",
      "model_override": "deepseek-reasoner"
    },
    {
      "app": "continue",
      "default_provider": "Ollama"
    }
  ]
}
```

---

## Configuration du port du proxy

« **Général** » → « **Port d’écoute** », par défaut `11434`. En cas de conflit de port (par exemple avec Ollama), changez-le pour un autre port (par exemple `11435`), et modifiez en conséquence côté application `base_url=http://localhost:11435/v1` (`api_key` peut être renseigné librement, Switch utilise la provider key configurée).

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Conflit de port</p>
    <div class="lurus-callout__body">Le port par défaut <code>11434</code> est identique au port par défaut d’Ollama. Lorsque les deux s’exécutent sur la même machine, changez Switch pour un autre port (par exemple <code>11435</code>) et mettez à jour en conséquence le <code>base_url</code> côté application.</div>
  </div>
</div>

---

## Fichier de configuration complet

La configuration de Switch est enregistrée dans :

| Plateforme | Chemin |
|------|------|
| Windows | `%APPDATA%\LurusSwitch\config.json` |
| macOS | `~/Library/Application Support/LurusSwitch/config.json` |
| Linux | `~/.config/LurusSwitch/config.json` |

Exemple complet de `config.json` :

```json
{
  "listen_port": 11434,
  "log_requests": true,
  "start_on_login": true,
  "providers": [
    {
      "name": "Lurus API",
      "base_url": "https://api.lurus.cn/v1",
      "api_key": "sk-your-lurus-key",
      "enabled": true
    },
    {
      "name": "Ollama",
      "base_url": "http://localhost:11434/v1",
      "api_key": "",
      "enabled": true
    }
  ],
  "routing": {
    "default_provider": "Lurus API",
    "rules": [
      { "pattern": "llama*",  "provider": "Ollama" },
      { "pattern": "qwen*",   "provider": "Ollama" },
      { "pattern": "*",       "provider": "Lurus API" }
    ]
  }
}
```

---

## Vérifier la configuration

L’onglet « **État** » affiche : l’état de connexion de chaque fournisseur (vert = normal, rouge = échec), les règles de routage actuellement actives, les journaux des requêtes récentes. Vérification en ligne de commande (un JSON normal renvoyé indique un succès) :

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"ping"}]}'
```

---

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Surveillance des coûts', link: '/fr/switch/cost-monitoring', primary: true },
  { text: 'Serveurs MCP', link: '/fr/switch/mcp-servers' },
  { text: 'Configuration d\'équipe', link: '/fr/switch/team-config' },
]" title="" />

</div>

<style>
.switch-page .lurus-section-head { margin-top: 8px; }
</style>
