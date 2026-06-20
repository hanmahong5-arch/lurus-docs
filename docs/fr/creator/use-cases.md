---
title: "Cas d'usage Creator"
description: "Le pipeline complet pour trois scénarios types — commentaire vidéo Bilibili, article long de compte officiel et note Xiaohongshu."
---

<div class="creator-page">

# Cas d'usage Creator <StatusBadge status="dev" />

Trois cas de pipeline réels, couvrant la vidéo, l'article long et le contenu social court.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="video" :size="14" /> Cas 1</span>
  <h2 class="lurus-section-head__title">Commentaire vidéo Bilibili</h2>
  <p class="lurus-section-head__lede">Un lien vidéo Bilibili → script de voix off + accroche de vignette.</p>
</div>

| Étape | Outil | Production |
|------|------|------|
| Entrée | Coller le lien vidéo | URL de la vidéo source |
| Téléchargement | yt-dlp | Fichier mp4 |
| Transcription | Whisper large-v3 | Sous-titres en chinois horodatés |
| Synthèse | LLM (DeepSeek-Chat) | Résumé par segment + temps forts |
| Réécriture | LLM (Claude Sonnet) | 3 versions de script de voix off (sérieux / décalé / suspense) |
| Vignette | LLM | 3 propositions de titre de vignette |
| Sortie | Éditeur Creator | Prêt à coller directement dans le back-office Bilibili |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="gauge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Durée typique</p>
    <div class="lurus-callout__body">Vidéo de 10 minutes → 90 secondes pour tout le pipeline.</div>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-open" :size="14" /> Cas 2</span>
  <h2 class="lurus-section-head__title">Article long de compte officiel</h2>
  <p class="lurus-section-head__lede">Un sujet → un article de fond de 2000 mots pour compte officiel.</p>
</div>

<ArchitectureDiagram
  title="Sujet → article long de compte officiel"
  chart='graph TD
    TOPIC["Saisie du sujet : retour d’expérience sur l’application du WAL à la persistance des AI Agents"] --> SEARCH[Recherche documentaire<br/>Lurus API + web_search Tool]
    SEARCH --> OUTLINE[Génération du plan<br/>le LLM liste 5 H2]
    OUTLINE --> WRITE[Rédaction paragraphe par paragraphe<br/>génération par blocs selon le plan]
    WRITE --> FIG[Suggestions d’illustrations<br/>le LLM propose 3 emplacements de schémas]
    FIG --> MD[Sortie Markdown vers l’éditeur Creator]'
/>

**Points d'adaptation** :

- Les comptes officiels ne supportent pas le H4 : rétrogradation automatique
- Génération automatique de liens internes « À lire aussi » (basée sur la correspondance de mots-clés)
- Bascule entre trois registres de style : « familier / académique / commercial »

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="share-2" :size="14" /> Cas 3</span>
  <h2 class="lurus-section-head__title">Note Xiaohongshu</h2>
  <p class="lurus-section-head__lede">Une image + une phrase d'accroche → note de recommandation complète.</p>
</div>

**Entrée** : photo du produit + « l'autonomie est vraiment au top »

**Sortie** :

```
┌─────────────────────────────┐
│ 🌙 终于找到通勤救星！       │
│                              │
│ 用了一周真的爱上了...（100 字）│
│                              │
│ ✅ 续航 28 小时              │
│ ✅ 重量只有 180 克           │
│ ✅ 降噪 -35dB                │
│                              │
│ #数码好物 #通勤 #降噪耳机   │
└─────────────────────────────┘
```

Génération automatique de 6 à 10 hashtags, en évitant les termes interdits.

---

## Comparatif des pipelines partagés

| Scénario | Commentaire vidéo | Article long compte officiel | Xiaohongshu |
|------|---------|-----------|--------|
| Forme d'entrée | URL | Mot-clé du sujet | Image + phrase courte |
| Modèle central | Whisper + LLM | LLM | LLM |
| Longueur produite | Script de 300-500 mots | 2000 mots | 80-150 mots |
| Support de publication | Export par copie | Publication automatique chromedp | Publication automatique chromedp |
| Durée typique | 90 secondes | 2 minutes | 30 secondes |

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Retour à l’introduction', link: '/fr/creator/', primary: true },
  { text: 'Guide d’installation', link: '/fr/creator/install' },
  { text: 'Manuel d’utilisation', link: '/fr/creator/usage' },
]" />

</div>
