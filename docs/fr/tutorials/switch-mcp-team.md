---
title: "Accès unifié des CLI IA pour l’équipe (Switch + MCP + passerelle)"
description: "Utilisez Switch pour gérer de façon unifiée les outils CLI IA, les serveurs MCP et les coûts des modèles de votre équipe — une configuration centrale, synchronisée entre Claude Code / Codex / Gemini."
---

<div class="tut-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="monitor" :size="14" /> Tutoriel multi-produits</span>
  <h1 class="lurus-section-head__title">Accès unifié des CLI IA pour l’équipe</h1>
  <p class="lurus-section-head__lede">Faites converger les configurations CLI IA, les serveurs MCP et les clés de modèles dispersés sur chaque machine d’ingénieur en <strong>une seule configuration centrale</strong> : Switch gère le MCP et la synchronisation, Lurus API gère les modèles et la facturation.</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Produits associés</p>
    <div class="lurus-callout__body">Switch (gestion des outils de bureau) · Lurus API (passerelle unifiée) · serveurs MCP (Kova / GitHub / PostgreSQL, etc.). Ce tutoriel ne référence que les capacités déjà présentes dans la documentation de chaque produit.</div>
  </div>
</div>

## <Icon name="package" :size="20" /> Ce que vous obtiendrez

| Avant (chacun pour soi) | Après (Switch unifié) |
|---|---|
| Chacun rédige son `mcp_servers.json`, versions d’outils hétérogènes | Un seul `mcp.yaml` central, diffusion à la demande via `visible_to` |
| Chaque CLI configure son propre jeu de clés Provider | Tout passe par Lurus API, une clé, une facture |
| Coûts des modèles invisibles | Tableau de bord des coûts Switch agrégé par outil / modèle |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> Étape 1</span>
  <h2 class="lurus-section-head__title">Installer Switch et le brancher sur la passerelle</h2>
</div>

<ol class="lurus-steps">
<li>

Installez Switch en suivant le [guide d’installation](/fr/switch/install) (macOS / Windows / Linux).

</li>
<li>

Dans les réglages, renseignez votre <Term t="API Key">API Key</Term> Lurus ([comment l’obtenir](/fr/guide/get-api-key)), pour que tous les CLI appellent les modèles de façon unifiée via `https://api.lurus.cn/v1` — une clé, une facture.

</li>
<li>

Vérifiez que le proxy local est démarré (port 19090 par défaut) :

```bash
curl http://localhost:19090/v1/models
```

</li>
</ol>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug" :size="14" /> Étape 2</span>
  <h2 class="lurus-section-head__title">Rédiger une configuration MCP centrale</h2>
  <p class="lurus-section-head__lede">Switch gère tous les serveurs MCP avec un unique <code>~/.lurus-switch/mcp.yaml</code> ; <code>visible_to</code> détermine ceux que voit chaque CLI.</p>
</div>

```yaml
servers:
  github:
    command: npx
    args: [-y, '@modelcontextprotocol/server-github']
    env:
      GITHUB_TOKEN: ${GITHUB_TOKEN}
    visible_to: [claude-code, codex]

  postgres:
    command: docker
    args: [run, -i, --rm, mcp/postgres, 'postgres://localhost/dev']
    visible_to: [claude-code]

  kova:                       # Kova Agent 作为工具暴露
    url: http://localhost:3333
    type: http
    visible_to: [claude-code, codex, gemini]
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shuffle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">visible_to pilote la diffusion à la demande</p>
    <div class="lurus-callout__body">Lors du basculement vers un CLI, Switch génère dynamiquement le <code>mcp_servers.json</code> de ce CLI selon <code>visible_to</code> ; chaque outil ne voit que les serveurs qui lui sont attribués. La liste des serveurs intégrables est dans le <a href="/fr/integrations/">catalogue d’intégrations</a>, les détails de gestion dans <a href="/fr/switch/mcp-servers">Serveurs MCP</a>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Étape 3</span>
  <h2 class="lurus-section-head__title">Visualiser les coûts, puis synchroniser avec l’équipe</h2>
</div>

<ol class="lurus-steps">
<li>

Ouvrez le <a href="/fr/switch/cost-monitoring">suivi des coûts</a> de Switch pour consulter la consommation de tokens par outil / modèle — comme tous les appels passent par la même clé Lurus API, la facturation est unifiée.

</li>
<li>

Une fois la configuration validée, utilisez la <a href="/fr/switch/team-config">synchronisation d’équipe</a> pour distribuer ce `mcp.yaml` à l’équipe : les nouveaux membres sont opérationnels immédiatement, avec des versions cohérentes.

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Que pouvez-vous ajouter ensuite</p>
    <div class="lurus-callout__body"><p>Connectez la <a href="/fr/memx/quickstart">mémoire MemX</a> à vos CLI (outils <code>memory_search</code> / <code>memory_add</code>) pour que l’Agent retienne les conventions du projet ; ou branchez <a href="/fr/lumen/">Lumen</a> pour le suivi des appels et les alertes de coûts.</p></div>
  </div>
</div>

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Serveurs MCP de Switch', link: '/fr/switch/mcp-servers', primary: true },
    { text: 'Intégrations et catalogue MCP', link: '/fr/integrations/' },
    { text: 'Tutoriel Agent à mémoire', link: '/fr/tutorials/memory-agent' },
  ]"
/>

</div>
