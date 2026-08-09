---
layout: page
title: LurusTech Docs — Infrastructure et plateforme produits IA
description: Documentation de la plateforme LurusTech — Référence API · Démarrage rapide · Guide d’intégration
---

<div class="vp-doc lurus-home">

<Hero />

<nav class="persona-jump" aria-label="按角色快速跳转">
  <a href="#newbie" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="rocket" :size="14" /></span>
    <span class="persona-jump__label">Débutant</span>
    <span class="persona-jump__hint">Prise en main en 3 min</span>
  </a>
  <a href="#player" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="gamepad-2" :size="14" /></span>
    <span class="persona-jump__label">Utilisateur</span>
    <span class="persona-jump__hint">Outils prêts à l’emploi</span>
  </a>
  <a href="#decider" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="briefcase" :size="14" /></span>
    <span class="persona-jump__label">Décideur</span>
    <span class="persona-jump__hint">Évaluation entreprise</span>
  </a>
  <a href="#dev" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="code" :size="14" /></span>
    <span class="persona-jump__label">Développeur</span>
    <span class="persona-jump__hint">Construire des systèmes</span>
  </a>
</nav>

<div class="topic-grid-head"><Icon name="compass" :size="16" /> <strong>Parcourir par thème</strong> —— Vous savez ce que vous cherchez ? Accédez directement au thème correspondant.</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/fr/guide/introduction"><span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span><div class="lurus-card__title">Accès passerelle</div><p class="lurus-card__body">Une seule clé pour 50+ modèles, compatible SDK OpenAI.</p></a>
  <a class="lurus-card lurus-card--kova" href="/fr/kova/"><span class="lurus-card__icon"><Icon name="bot" :size="20" /></span><div class="lurus-card__title">Exécution d’agents</div><p class="lurus-card__body">Moteur WAL-First de Kova, récupération automatique après crash.</p></a>
  <a class="lurus-card lurus-card--memx" href="/fr/memx/"><span class="lurus-card__icon"><Icon name="brain" :size="20" /></span><div class="lurus-card__title">Mémoire intelligente</div><p class="lurus-card__body">Mémoire adaptative de MemX, distillation sans coût LLM.</p></a>
  <a class="lurus-card lurus-card--lumen" href="/fr/lumen/"><span class="lurus-card__icon"><Icon name="zap" :size="20" /></span><div class="lurus-card__title">Observabilité</div><p class="lurus-card__body">Lumen Replay + récupération après crash + suivi des coûts.</p></a>
  <a class="lurus-card lurus-card--lucrum" href="/fr/lucrum/"><span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span><div class="lurus-card__title">Trading quantitatif</div><p class="lurus-card__body">Lucrum génère des stratégies vnpy en langage naturel et les backteste.</p></a>
  <a class="lurus-card lurus-card--switch" href="/fr/switch/"><span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span><div class="lurus-card__title">Outil de bureau</div><p class="lurus-card__body">Switch gère de façon unifiée plusieurs CLI IA, MCP et coûts.</p></a>
  <a class="lurus-card lurus-card--api" href="/integrations/"><span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span><div class="lurus-card__title">Intégrations et MCP</div><p class="lurus-card__body">MCP produits, serveurs intégrés à Switch, catalogue de clients.</p></a>
  <a class="lurus-card lurus-card--api" href="/fr/guide/troubleshooting"><span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span><div class="lurus-card__title">Dépannage</div><p class="lurus-card__body">401 / quota / délais et autres problèmes fréquents résolus sur une seule page.</p></a>
</div>

## <Icon name="rocket" :size="22" /> Je suis débutant — réussir mon premier appel en 3 minutes {#newbie}

Choisir le mauvais modèle coûte 10 fois plus cher que de mal coder. Faites d’abord un essai via notre passerelle, puis décidez si vous migrez ou non.

<div class="action-grid">
  <ActionCard
    product-id="lurus-api"
    :actions="[
      { label: 'Démarrage rapide', href: '/fr/guide/quickstart', primary: true },
      { label: 'Obtenir une clé API', href: '/fr/guide/get-api-key' },
      { label: 'Modèles pris en charge', href: '/guide/models' },
      { label: 'Console', href: 'https://api.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="platform"
    :actions="[
      { label: 'Présentation de la plateforme', href: '/fr/platform/', primary: true },
      { label: 'Détails de la facturation', href: '/fr/platform/billing' },
      { label: 'Questions fréquentes', href: '/fr/platform/faq' },
    ]"
  />
</div>

---

## <Icon name="gamepad-2" :size="22" /> Je suis utilisateur — je veux des outils IA prêts à l’emploi {#player}

Le code est déjà écrit pour vous. Téléchargez et lancez, sans écrire une seule ligne de configuration.

<div class="action-grid">
  <ActionCard
    product-id="lucrum"
    :actions="[
      { label: 'Démarrage rapide', href: '/fr/lucrum/quickstart', primary: true },
      { label: 'Marché des stratégies', href: '/fr/lucrum/strategies' },
      { label: 'Plateforme de trading', href: 'https://lucrum.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="switch"
    :actions="[
      { label: 'Guide d\'installation', href: '/fr/switch/install', primary: true },
      { label: 'Notice de configuration', href: '/fr/switch/configuration' },
    ]"
  />
  <ActionCard
    product-id="creator"
    :actions="[
      { label: 'Guide d\'installation', href: '/creator/install', primary: true },
      { label: 'Cas d\'usage', href: '/creator/use-cases' },
    ]"
  />
  <ActionCard
    name="Lutu — Client mobile"
    tagline="Application Lutu · Assistant IA et comptabilité sur mobile"
    icon="smartphone"
    color="var(--lurus-color-creator)"
    status="beta"
    :actions="[
      { label: 'Télécharger Lutu', href: 'https://www.lurus.cn/download#lutu', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="briefcase" :size="22" /> Je suis décideur — évaluer un achat entreprise {#decider}

Ce n’est pas l’achat d’un outil, c’est un remplacement d’infrastructure. Regardez d’abord le TCO et les limites de conformité, puis les fonctionnalités.

<div class="action-grid">
  <ActionCard
    name="Pourquoi choisir Lurus"
    tagline="Quatre capacités clés vs solution maison — TCO, performance, conformité en un tableau"
    icon="award"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: 'Solutions entreprise', href: '/solutions/', primary: true },
      { label: 'Why Lurus', href: '/solutions/why-lurus' },
    ]"
  />
  <ActionCard
    name="Modèles de déploiement entreprise"
    tagline="SaaS · Privé · Cloud hybride · Limites de conformité expliquées en une fois"
    icon="server"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: 'Matrice de déploiement', href: '/solutions/enterprise-deploy', primary: true },
    ]"
  />
  <ActionCard
    product-id="auth"
    :actions="[
      { label: 'Présentation et points d\'accès', href: '/fr/platform/auth/', primary: true },
      { label: 'Fédération SSO entreprise', href: '/fr/platform/auth/oidc' },
      { label: 'Console d\'authentification', href: 'https://identity.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    name="Contacter le service commercial"
    tagline="Déploiement privé · Licences · Personnalisation · Conseil partenariat"
    icon="mail"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'business@lurus.cn', href: 'mailto:business@lurus.cn', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="code" :size="22" /> Je suis développeur — construire des systèmes IA {#dev}

Les quatre composants fondamentaux d’une application LLM : exécution · mémoire · passerelle · CLI. Utilisables séparément, plus puissants combinés.

<div class="action-grid">
  <ActionCard
    product-id="kova"
    :actions="[
      { label: 'Démarrage rapide', href: '/fr/kova/quickstart', primary: true },
      { label: 'Concepts clés', href: '/fr/kova/concepts' },
      { label: 'Référence API', href: '/fr/kova/api' },
    ]"
  />
  <ActionCard
    product-id="memx"
    :actions="[
      { label: 'Démarrage rapide', href: '/fr/memx/quickstart', primary: true },
      { label: 'Concepts clés', href: '/fr/memx/concepts' },
      { label: 'Conception de l\'architecture', href: '/fr/memx/architecture' },
    ]"
  />
  <ActionCard
    product-id="lumen"
    :actions="[
      { label: 'Démarrage rapide', href: '/fr/lumen/quickstart', primary: true },
      { label: 'Python SDK', href: '/fr/lumen/python-sdk' },
      { label: 'Manuel CLI', href: '/fr/lumen/cli' },
    ]"
  />
  <ActionCard
    product-id="api-ref"
    :actions="[
      { label: 'Présentation de l\'API', href: '/fr/api/overview', primary: true },
      { label: 'Authentification', href: '/fr/api/authentication' },
      { label: 'Chat Completions', href: '/fr/api/chat-completions' },
    ]"
  />
  <ActionCard
    product-id="arch"
    :actions="[
      { label: 'Voir l\'architecture', href: '/developer/architecture', primary: true },
    ]"
  />
  <ActionCard
    product-id="forge"
    :actions="[
      { label: 'Philosophie produit', href: '/forge/', primary: true },
      { label: 'Ontology', href: '/forge/ontology' },
    ]"
  />
</div>

---

## Tutoriels inter-produits · Guides de migration

<div class="action-grid action-grid--compact">
  <ActionCard
    name="Centre de tutoriels"
    tagline="MemX + Kova · Lumen + LangGraph · Lucrum de bout en bout"
    icon="graduation-cap"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'Tutoriels inter-produits', href: '/tutorials/', primary: true },
    ]"
  />
  <ActionCard
    name="Guide de migration"
    tagline="OpenAI · LangGraph · OIDC maison → déménagement en 5 minutes"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: 'Centre de migration', href: '/migrations/', primary: true },
    ]"
  />
  <ActionCard
    name="Glossaire"
    tagline="47+ termes techniques regroupés par thème, recherche rapide inter-produits"
    icon="book-a"
    color="var(--lurus-color-memx)"
    :actions="[
      { label: 'Glossaire complet', href: '/guide/glossary', primary: true },
    ]"
  />
</div>

---

## Pourquoi choisir Lurus ?

Quatre points de décision — ce n’est pas un outil de plus, c’est un remplacement d’infrastructure.

<div class="diff-grid">
  <article class="diff-card diff-card--brand">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="layers" :size="20" /></span>
      <h3 class="diff-card__title">Entièrement développé en interne</h3>
    </header>
    <p class="diff-card__lede">Du moteur d’exécution Rust au client mobile Flutter, tout est développé en interne. Compte / facturation / mémoire / passerelle sont mutualisés.</p>
    <ul class="diff-card__points">
      <li>En cas de problème, plus besoin d’attendre que trois fournisseurs se renvoient la balle</li>
      <li>Plus on l’utilise, plus c’est rentable — mémoire, facturation et modèles composent dans un même pool</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-kova">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="zap" :size="20" /></span>
      <h3 class="diff-card__title">Performance de niveau moteur</h3>
    </header>
    <p class="diff-card__lede">Ordonnancement Kova en <strong>3μs</strong> (benchmark Criterion) · débit de 315K ops/s.</p>
    <ul class="diff-card__points">
      <li>Nous avons écrit le moteur d’exécution, pas une nième surcouche de Temporal</li>
      <li>MemX distille sans appeler de LLM · Lucrum en pleine précision, sans dérive de virgule flottante</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-platform">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="shield-check" :size="20" /></span>
      <h3 class="diff-card__title">Souveraineté des données</h3>
    </header>
    <p class="diff-card__lede">Un seul déploiement, sans payer de tribut à aucun fournisseur cloud. Chiffrement de bout en bout SM4-GCM (cryptographie nationale chinoise).</p>
    <ul class="diff-card__points">
      <li>Un seul SSO / Passkey / MFA, branché sur votre IdP existant</li>
      <li>Compatible SDK OpenAI · partez avec vos données quand vous voulez</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-memx">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="receipt" :size="20" /></span>
      <h3 class="diff-card__title">TCO transparent</h3>
    </header>
    <p class="diff-card__lede">Facturation unifiée en unités Lubei — 50+ modèles, une seule facture.</p>
    <ul class="diff-card__points">
      <li>Le temps de rapprochement passe d’une journée à 5 minutes</li>
      <li>Migrez quand vous voulez, sans coût de sortie</li>
    </ul>
  </article>
</div>

<details class="diff-table">
  <summary>Déplier le tableau comparatif complet (8 dimensions × comparaison avec solution maison)</summary>

| Dimension | L’avantage Lurus | Comparé à une solution maison |
|------|-------------|---------|
| **Entièrement développé en interne** | Du moteur d’exécution Rust au client mobile Flutter, technologies cœur entièrement maîtrisées en interne | Assemblage multi-fournisseurs, risque de verrouillage de versions |
| **Performance de niveau moteur** | Latence d’ordonnancement Kova de 3μs, 315K ops/s (benchmark Criterion), zéro dépendance externe | Temporal/LangGraph maison sensiblement plus lents |
| **Souveraineté des données** | Déploiement privé, les données ne quittent pas le périmètre de l’entreprise, prise en charge du SM4-GCM (cryptographie nationale chinoise) | Conformité et audit difficiles sur cloud public |
| **Identité unifiée** | Tous les produits partagent SSO, Passkey, MFA, fédération avec l’IdP de l’entreprise | Keycloak / Auth0 à exploiter soi-même |
| **Synergie de l’écosystème** | 12 produits partagent compte/facturation/mémoire/passerelle LLM, plus on l’utilise plus c’est rentable | Stack d’outils fragmentée |
| **Économique et efficace** | MemX distille sans coût LLM ; Lucrum en pleine précision avec Decimal.js, zéro erreur | Problèmes de mémoire / précision nécessitant des investissements supplémentaires |
| **TCO transparent** | Facturation unifiée en unités Lubei, à l’usage + quota gratuit | Rapprochement complexe de factures de plusieurs fournisseurs |
| **Ouvert et migrable** | Compatible SDK OpenAI, authentification standard PAT/JWT, export sans verrouillage | Verrouillage fournisseur avec coût de sortie élevé |

</details>

---

## Prêt à vous lancer ?

<div class="finalcta">
  <div class="finalcta__text">
    <h3>Changez de passerelle en 5 lignes de code, compatible SDK OpenAI</h3>
    <p>Modifiez une seule base_url et tous vos appels existants sont connectés. Une seule clé pour 50+ modèles, quota gratuit offert à l’inscription.</p>
  </div>
  <div class="finalcta__actions">
    <a href="/fr/guide/quickstart" class="finalcta__btn finalcta__btn--primary">Prise en main en 3 min →</a>
    <a href="https://api.lurus.cn" target="_blank" rel="noopener noreferrer" class="finalcta__btn finalcta__btn--alt">Aller à la console ↗</a>
    <a href="mailto:business@lurus.cn" class="finalcta__btn finalcta__btn--ghost">Conseil entreprise</a>
  </div>
</div>

## Contactez-nous

<div class="contact-grid">
  <a href="mailto:support@lurus.cn" class="contact-card">
    <span class="contact-card__icon"><Icon name="life-buoy" :size="22" /></span>
    <span class="contact-card__name">Support technique</span>
    <span class="contact-card__addr">support@lurus.cn</span>
  </a>
  <a href="mailto:business@lurus.cn" class="contact-card contact-card--accent">
    <span class="contact-card__icon"><Icon name="briefcase" :size="22" /></span>
    <span class="contact-card__name">Partenariat commercial</span>
    <span class="contact-card__addr">business@lurus.cn</span>
  </a>
  <a href="https://github.com/hanmahong5-arch" target="_blank" rel="noopener noreferrer" class="contact-card">
    <span class="contact-card__icon"><Icon name="github" :size="22" /></span>
    <span class="contact-card__name">GitHub</span>
    <span class="contact-card__addr">hanmahong5-arch ↗</span>
  </a>
</div>

</div>

<style>
.lurus-home { max-width: 1152px; margin: 0 auto; padding: 24px; }
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0 28px;
}
.action-grid--compact {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.lurus-home h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--lurus-fs-xl);
  font-weight: 700;
  margin-top: 44px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  background:
    linear-gradient(to right,
      var(--vp-c-brand-1),
      color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent) 60%,
      transparent 100%)
    bottom left / 36% 1px no-repeat;
  scroll-margin-top: 88px;
}
.lurus-home h2 .lurus-icon { color: var(--vp-c-brand-1); }
.lurus-home hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-brand-soft), transparent);
  margin: 40px 0;
}
@media (max-width: 640px) {
  .lurus-home { padding: 16px; }
}

/* ============================================================
 * Persona jump chips — sits under Hero, anchors into 4 personas
 * ============================================================ */
.persona-jump {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: -8px 0 4px;
  padding: 6px 4px;
  background: transparent;
  border: none;
  align-items: center;
  justify-content: center;
}
.persona-jump__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--lurus-radius-pill);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2) !important;
  text-decoration: none !important;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  transition: transform var(--lurus-dur-fast) var(--lurus-ease-out),
              border-color var(--lurus-dur-fast),
              color var(--lurus-dur-fast);
}
.persona-jump__chip:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.persona-jump__icon {
  display: inline-flex;
  color: var(--vp-c-brand-1);
}
.persona-jump__hint {
  color: var(--vp-c-text-3);
  font-weight: 400;
  font-size: 0.74rem;
}
.persona-jump__chip:hover .persona-jump__hint { color: inherit; opacity: 0.85; }
@media (max-width: 640px) {
  .persona-jump__hint { display: none; }
}

/* anchored personas: leave room for VitePress sticky nav (~64px) + breathing space */
#newbie, #player, #decider, #dev { scroll-margin-top: 88px; }

/* ============================================================
 * Differentiators — 4 cards replacing the 8-row why-Lurus table
 * ============================================================ */
.diff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin: 18px 0 14px;
}
.diff-card {
  --accent: var(--vp-c-brand-1);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-lg);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: transform var(--lurus-dur-base) var(--lurus-ease-out),
              border-color var(--lurus-dur-base),
              box-shadow var(--lurus-dur-base);
}
.diff-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
}
.diff-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--accent);
  box-shadow: var(--lurus-shadow-3);
}
.diff-card--brand            { --accent: var(--vp-c-brand-1); }
.diff-card--accent-kova      { --accent: var(--lurus-color-kova); }
.diff-card--accent-platform  { --accent: var(--lurus-color-platform); }
.diff-card--accent-memx      { --accent: var(--lurus-color-memx); }
.diff-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.diff-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent);
  flex-shrink: 0;
}
.diff-card__title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.diff-card__lede {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
.diff-card__lede strong {
  color: var(--accent);
  font-feature-settings: 'tnum';
}
.diff-card__points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.diff-card__points li {
  position: relative;
  padding-left: 16px;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.diff-card__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.65;
}

.diff-table {
  margin: 12px 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-md);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.diff-table > summary {
  cursor: pointer;
  padding: 12px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  user-select: none;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background var(--lurus-dur-fast);
}
.diff-table > summary::-webkit-details-marker { display: none; }
.diff-table > summary::before {
  content: '▸';
  display: inline-block;
  transition: transform var(--lurus-dur-fast);
  color: var(--vp-c-brand-1);
}
.diff-table[open] > summary::before { transform: rotate(90deg); }
.diff-table > summary:hover { background: var(--vp-c-bg-mute); }
.diff-table table { margin: 0 18px 18px; }

/* ============================================================
 * Final CTA — bottom strip "ready?"
 * ============================================================ */
.finalcta {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  align-items: center;
  margin: 24px 0 16px;
  padding: 28px 32px;
  border-radius: var(--lurus-radius-xl);
  background:
    radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent), transparent 60%),
    radial-gradient(120% 140% at 100% 100%, color-mix(in srgb, var(--lurus-color-kova) 12%, transparent), transparent 55%),
    var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
.finalcta__text h3 {
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.finalcta__text p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.finalcta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}
.finalcta__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: var(--lurus-radius-pill);
  text-decoration: none !important;
  transition: transform var(--lurus-dur-fast),
              filter var(--lurus-dur-fast),
              border-color var(--lurus-dur-fast),
              color var(--lurus-dur-fast);
}
.finalcta__btn:hover { transform: var(--lurus-hover-rise); }
.finalcta__btn--primary {
  background: var(--vp-c-brand-1);
  color: #fff !important;
}
.finalcta__btn--primary:hover { filter: brightness(1.08); }
.finalcta__btn--alt {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-divider);
}
.finalcta__btn--alt:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.finalcta__btn--ghost {
  color: var(--vp-c-text-2) !important;
}
.finalcta__btn--ghost:hover { color: var(--vp-c-brand-1) !important; }

@media (max-width: 720px) {
  .finalcta {
    grid-template-columns: 1fr;
    padding: 22px 20px;
  }
  .finalcta__actions { justify-content: flex-start; }
}

/* ============================================================
 * Contact card grid
 * ============================================================ */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0 8px;
}
.contact-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 18px 20px;
  border-radius: var(--lurus-radius-lg);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: transform var(--lurus-dur-base),
              border-color var(--lurus-dur-base),
              box-shadow var(--lurus-dur-base);
}
.contact-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--lurus-shadow-2);
}
.contact-card--accent { border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, var(--vp-c-divider)); }
.contact-card__icon {
  color: var(--vp-c-brand-1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}
.contact-card__name {
  font-weight: 700;
  font-size: 0.95rem;
}
.contact-card__addr {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  font-family: var(--lurus-font-mono);
}
</style>
