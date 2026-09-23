---
layout: page
title: Documentation LurusTech
description: "Des systèmes d'IA dans l'environnement propre du client : état vérifiable, données restaurables, modifications tracées. Point d'entrée de la documentation de Witness, Kova, MemX, la passerelle et le socle de la plateforme."
---

<div class="vp-doc lurus-home">

<Hero />

<section class="home-block" aria-labelledby="home-parts">

## La documentation par composant {#home-parts}

<ul class="home-parts">
  <li>
    <a class="home-parts__name" href="/witness/">Lurus Witness</a><Badge type="warning" text="Pilote précoce" />
    <p>Collecte en lecture seule, sondes externes, un vrai exercice de restauration chaque mois et un rapport de preuves mensuel ; chaque relevé indique la force de sa preuve. Documentation en chinois.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/fr/kova/">Kova</a><Badge type="warning" text="Pilote précoce" />
    <p>Moteur d'exécution durable embarqué : reprise après crash par journal d'écriture anticipée, traces d'exécution, rejeu.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/fr/memx/">MemX</a><Badge type="warning" text="Pilote précoce" />
    <p>Moteur de mémoire pour l'IA : extraction, déduplication, oubli progressif, recherche hybride ; CLI / REST / MCP.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/fr/guide/quickstart">Passerelle et API</a><Badge type="tip" text="En production interne" />
    <p>Passerelle LLM multi-locataire déployée en privé, basée sur le projet open source New API (AGPLv3). Les détails de l'interface sont dans la <a href="/fr/api/overview">référence de l'API</a>.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/fr/platform/">Socle de la plateforme</a><Badge type="tip" text="En production interne" />
    <p>Comptes et connexion partagés par tous les composants. C'est un socle, il n'est pas proposé séparément.</p>
  </li>
</ul>

</section>

<section class="home-block" aria-labelledby="home-start">

## Par où commencer {#home-start}

<dl class="home-start">
  <dt>Exploitants qui déploient Witness</dt>
  <dd>Lisez <a href="/witness/deploy">Déploiement (en chinois)</a>, puis <a href="/witness/evidence">Concepts clés (en chinois)</a>, pour savoir d'où vient chaque relevé et à quel point il est sûr.</dd>
  <dt>Développeurs qui intègrent la passerelle</dt>
  <dd>Faites un premier appel avec le <a href="/fr/guide/quickstart">démarrage rapide</a> ; les champs et codes d'erreur sont dans la <a href="/fr/api/overview">référence de l'API</a>.</dd>
  <dt>Décideurs qui évaluent</dt>
  <dd>Lisez « Ce que ce n'est pas » et « Où en est-on » dans la <a href="/witness/">présentation de Witness (en chinois)</a>, puis <a href="/witness/drills">Exercices de restauration et rapports mensuels (en chinois)</a>.</dd>
</dl>

</section>

<section class="home-block" aria-labelledby="home-bounds">

## Limites {#home-bounds}

<p class="home-bounds">Nous ne revendons ni espace de centre de données ni puissance de calcul, et nous ne promettons pas de chiffres que nous ne pouvons pas prouver. La maturité n'utilise que quatre étiquettes (pilote précoce, en production interne, open source, en conception) et, en cas de doute, nous choisissons la plus prudente.</p>

</section>

</div>

<style>
.lurus-home { max-width: 1152px; margin: 0 auto; padding: 24px; }
.lurus-home .home-block { max-width: 44rem; margin: 40px 0 0; }
.lurus-home .home-block h2 {
  font-size: var(--lurus-fs-lg);
  font-weight: 600;
  margin: 0 0 12px;
  padding: 0 0 8px;
  border-top: none;
  border-bottom: 1px solid var(--vp-c-divider);
}
.home-parts { list-style: none; padding: 0 !important; margin: 0; }
.home-parts li {
  margin: 0 !important;
  padding: 14px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.home-parts__name { font-weight: 600; text-decoration: none !important; }
.home-parts p { margin: 4px 0 0 !important; color: var(--vp-c-text-2); line-height: 1.6; }
.home-start { margin: 0; }
.home-start dt { font-weight: 600; margin-top: 14px; }
.home-start dd { margin: 4px 0 0; color: var(--vp-c-text-2); line-height: 1.6; }
.home-bounds { color: var(--vp-c-text-2); line-height: 1.7; }
@media (max-width: 640px) {
  .lurus-home { padding: 16px; }
}
</style>
