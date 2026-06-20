---
title: "Creator — Usine de contenu de bureau pilotée par l’IA"
description: "Outil de production de contenu de bureau basé sur Wails, création assistée par IA et sortie multi-format."
---

<div class="creator-page">

<ProductHero product-id="creator" />

## Qu’est-ce que Creator ?

**Lurus Creator** est un outil de création de contenu IA pour le bureau, qui intègre le téléchargement de vidéos, la transcription audio, la réécriture par IA et la publication multiplateforme en une seule chaîne automatisée. Un seul exe, aucune dépendance, prêt à l’emploi dès l’ouverture.

Collez un lien vidéo et l’IA génère automatiquement 6 jeux de textes adaptés à chaque plateforme : WeChat Official Account (articles approfondis), Douyin (scripts de voix off), Xiaohongshu (notes de recommandation), YouTube Shorts, TikTok, Instagram Reels. Parmi celles-ci, WeChat Official Account / Douyin / Xiaohongshu (3 plateformes) prennent en charge la publication en un clic via l’automatisation du navigateur chromedp ; les autres plateformes nécessitent une publication manuelle. Les sources vidéo couvrent YouTube, Bilibili et plus de 1000 sites (propulsés par yt-dlp).

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">1000+</span><span class="lurus-stat__label">sites sources vidéo</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6</span><span class="lurus-stat__label">textes adaptés aux plateformes</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">plateformes en publication un clic</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">99</span><span class="lurus-stat__label">langues de transcription</span></div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Capacités clés</span>
  <h2 class="lurus-section-head__title">D’un seul lien à la publication multiplateforme</h2>
  <p class="lurus-section-head__lede">Téléchargement, transcription, réécriture et publication enchaînés en une seule pipeline, entièrement automatisée.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-creator)"
  :items="[
    { title: 'Pipeline de contenu en un clic', body: 'Source vidéo → téléchargement yt-dlp → transcodage ffmpeg → transcription Whisper → réécriture LLM → publication chromedp, entièrement automatisé', icon: 'workflow' },
    { title: 'Réécriture intelligente', body: 'Traduction (préservation des termes), réécriture (ton et longueur), extraction des idées clés, optimisation SEO des titres, balises et résumés', icon: 'sparkles' },
    { title: 'Génération de contenu multiplateforme', body: 'Génère en une fois 6 modèles de plateformes : Official Account / Douyin / Xiaohongshu / YouTube Shorts / TikTok / Reels', icon: 'share-2' },
    { title: 'Traitement par lot DevFactory', body: 'Suivi tâche par tâche via machine à états SQLite, mise en file par lot, contrôle du budget de tokens, reprise sur interruption', icon: 'package' },
  ]"
/>

### Pipeline de contenu en un clic

<ArchitectureDiagram
  title="Pipeline de contenu : source vidéo → publication"
  chart="graph LR
    SRC[视频来源<br/>YouTube / Bilibili / 本地] --> DL[yt-dlp 下载]
    DL --> TC[ffmpeg 转码]
    TC --> TR[Whisper 转写]
    TR --> RW[LLM 改写 / 翻译]
    RW --> PUB[chromedp 发布<br/>公众号 / 抖音 / 小红书]"
/>

| Étape | Outil | Description |
|------|------|------|
| **Téléchargement** | yt-dlp | YouTube, Bilibili et plus de 1000 plateformes vidéo |
| **Transcodage** | ffmpeg | Conversion de format, découpage, suppression de filigrane |
| **Transcription** | Whisper | Parole en texte, 99 langues |
| **Réécriture** | LLM (Lurus API) | Polissage IA, traduction, ajustement de format |
| **Publication** | chromedp | Navigateur headless : connexion, téléversement et publication automatiques |

### Génération de contenu multiplateforme + publication un clic sur certaines plateformes

La génération de contenu couvre 6 modèles de plateformes : WeChat Official Account, Douyin, Xiaohongshu, YouTube Shorts, TikTok, Instagram Reels. À ce jour, seules 3 plateformes prennent en charge la publication automatique via la technologie de navigateur headless chromedp :

| Plateforme | Types de contenu pris en charge | Publication automatique |
|------|--------------|---------|
| **WeChat Official Account** | Articles illustrés | ✅ |
| **Douyin** | Vidéo courte + texte | ✅ |
| **Xiaohongshu** | Notes illustrées | ✅ |
| YouTube Shorts | Script de vidéo courte | ❌ Publication manuelle requise |
| TikTok | Script de vidéo courte | ❌ Publication manuelle requise |
| Instagram Reels | Script de vidéo courte | ❌ Publication manuelle requise |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Première connexion</p>
    <div class="lurus-callout__body">Lors de la première utilisation des fonctions de chaque plateforme de publication, il faut se connecter manuellement une fois en scannant un QR code. Ensuite, Creator conserve l’état de connexion.</div>
  </div>
</div>

---

## Architecture technique

`Creator Desktop (Wails v2 = Go + TypeScript)` : frontend TypeScript (panneau de tâches / éditeur / paramètres) + backend Go (orchestration de yt-dlp / ffmpeg / Whisper / chromedp + machine à états SQLite) → [Lurus API](/fr/guide/introduction) (LLM, DeepSeek/GPT, etc.). Compilé en un seul exécutable.

<ArchitectureDiagram
  title="Architecture technique de Creator Desktop"
  chart="graph TD
    UI[前端 TypeScript<br/>任务面板 / 编辑器 / 设置] --> GO[Go 后端<br/>调度 + SQLite 状态机]
    GO --> TOOLS[yt-dlp / ffmpeg / Whisper / chromedp]
    GO --> API[Lurus API<br/>LLM · DeepSeek / GPT 等]"
/>

---

## Cas d’usage

<UserScenarios
  title="Qui utilise Creator"
  :scenarios="[
    { role: 'Médias', title: 'Gestion de médias personnels', summary: 'Localiser du contenu étranger de qualité, produire en lot des versions chinoises', link: '/fr/creator/use-cases' },
    { role: 'Savoir', title: 'Diffusion de savoir', summary: 'Extraire le texte des vidéos de conférences techniques, le publier en tutoriels illustrés', link: '/fr/creator/use-cases' },
    { role: 'Matrice', title: 'Matrice de contenu', summary: 'Un même contenu adapté automatiquement aux formats et styles de plusieurs plateformes', link: '/fr/creator/use-cases' },
    { role: 'Équipe', title: 'Collaboration d’équipe', summary: 'Traiter par lot des listes de vidéos, avec une progression des tâches en un coup d’œil', link: '/fr/creator/usage' },
  ]"
/>

---

## Plateformes prises en charge

| Système d’exploitation | Version requise |
|---------|---------|
| Windows | Windows 10 64-bit ou supérieur |
| macOS | macOS 12 (Monterey) ou supérieur |
| Linux | Ubuntu 20.04+ / Debian 11+ |

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">Prêt à l’emploi, démarrage sans configuration</p>
    <p class="lurus-cta__text">Un seul exe embarquant yt-dlp / ffmpeg / Whisper / chromedp, première tâche bouclée en 3 minutes.</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="/fr/creator/install">Guide d’installation →</a>
  </div>
</div>

<!-- lurus:related-block -->

---

## Produits liés et étapes suivantes

<RelatedProducts product-id="creator" />

</div>
