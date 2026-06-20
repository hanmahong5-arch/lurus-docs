---
title: "Centre de tutoriels inter-produits"
description: "Tutoriels de bout en bout qui combinent plusieurs produits Lurus, regroupés par rôle."
---

<div class="tut-hub">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="graduation-cap" :size="14" /> Tutoriels inter-produits</span>
  <h1 class="lurus-section-head__title">Centre de tutoriels inter-produits</h1>
  <p class="lurus-section-head__lede">Le démarrage rapide de chaque produit se trouve dans sa propre documentation. Ici, ce sont des <strong>cas combinant plusieurs produits</strong> — assembler MemX + Kova + API, Lumen + LangGraph, etc. pour résoudre de vrais problèmes d'ingénierie.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">4</span><span class="lurus-stat__label">tutoriels de bout en bout</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">5+</span><span class="lurus-stat__label">produits combinés</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2</span><span class="lurus-stat__label">parcours par rôle</span></div>
</div>

## <Icon name="users" :size="20" /> Par rôle

<div class="action-grid">
  <ActionCard
    name="Développeur d'agents"
    tagline="Ajouter de la mémoire à un agent · reprise après crash · débogage par Replay"
    icon="bot"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'Agent à mémoire', href: '/fr/tutorials/memory-agent', primary: true },
      { label: 'Lumen × LangGraph × Kova', href: '/fr/tutorials/lumen-kova-langgraph' },
    ]"
  />
  <ActionCard
    name="Trading quantitatif"
    tagline="Le cycle complet, de la stratégie en langage naturel à sa mise en ligne sur la place de marché"
    icon="trending-up"
    color="var(--lurus-color-lucrum)"
    :actions="[
      { label: 'Flux complet de stratégie Lucrum', href: '/fr/tutorials/lucrum-strategy-workflow', primary: true },
    ]"
  />
</div>

## <Icon name="layers" :size="20" /> Par thème

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--memx" href="/fr/tutorials/memory-agent">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">Mémoire + Agent</div>
    <p class="lurus-card__body">Mémoire à long terme MemX + reprise après crash Kova + appels à l'API Lurus, pour construire un service client qui se souvient de l'utilisateur.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="/fr/tutorials/lumen-kova-langgraph">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Observabilité</div>
    <p class="lurus-card__body">Remplacer le Checkpointer par défaut de LangGraph par Lumen, déployer sur Kova et comparer les résultats de reprise après crash.</p>
  </a>
  <a class="lurus-card lurus-card--lucrum" href="/fr/tutorials/lucrum-strategy-workflow">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title">Boucle quantitative</div>
    <p class="lurus-card__body">Décrire la stratégie en langage naturel → l'IA génère le code vnpy → backtest → optimisation → mise en ligne sur la place de marché.</p>
  </a>
  <a class="lurus-card lurus-card--switch" href="/fr/tutorials/switch-mcp-team">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Unification des outils d'équipe</div>
    <p class="lurus-card__body">Switch regroupe la configuration MCP, les clés de modèles et le tableau de bord des coûts des CLI IA de l'équipe en une configuration centrale unique.</p>
  </a>
</div>

## <Icon name="workflow" :size="20" /> Parcours recommandé

<ol class="lurus-steps">
<li>

Commencez par le démarrage rapide de chaque produit (en partant de l'[API Lurus](/fr/guide/quickstart))

</li>
<li>

Puis consultez un tutoriel inter-produits de cette section, proche de votre métier

</li>
<li>

Enfin, suivez le [guide de migration](/fr/migrations/) pour remplacer votre stack actuelle

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Combiner, c'est composer</p>
    <div class="lurus-callout__body"><p>Chaque tutoriel ne s'appuie que sur des capacités déjà présentes dans la documentation de chaque produit. Faites d'abord fonctionner chaque produit isolément, puis reliez-les selon le tutoriel — comptes, facturation et modèles sont dans le même pool, aucune réintégration n'est nécessaire.</p></div>
  </div>
</div>

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Agent à mémoire', link: '/fr/tutorials/memory-agent', primary: true },
  { text: 'Guide de migration', link: '/fr/migrations/' },
  { text: 'Solutions entreprise', link: '/fr/solutions/' },
]" />

</div>
