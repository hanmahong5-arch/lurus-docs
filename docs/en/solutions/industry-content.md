---
title: "Content Industry Solution"
description: "Creator + Lurus API — bulk content production, multi-platform distribution, copyright and compliance."
---

<div class="content-page">

# Content Industry Solution

<MetricStats :items="[
  { label: 'Customizable platforms', value: '6', hint: 'one-shot generation' },
  { label: 'Video source sites', value: '1000+', hint: 'yt-dlp' },
  { label: '10-min video to script', value: '90 sec' },
  { label: 'Topic to long-form article', value: '2 min' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Who it's for</span>
  <h2 class="lurus-section-head__title">Who's using it</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="video" :size="20" /></span>
    <div class="lurus-card__title">MCN / Personal IP</div>
    <p class="lurus-card__body">Organizations and individual IP operations.</p>
  </div>
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="briefcase" :size="20" /></span>
    <div class="lurus-card__title">Enterprise new-media teams</div>
    <p class="lurus-card__body">Multi-account matrix operations.</p>
  </div>
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="share-2" :size="20" /></span>
    <div class="lurus-card__title">Cross-border e-commerce content teams</div>
    <p class="lurus-card__body">Multi-platform, multi-language distribution.</p>
  </div>
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="graduation-cap" :size="20" /></span>
    <div class="lurus-card__title">Education / Knowledge products</div>
    <p class="lurus-card__body">Bulk rewriting of course content.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Core components</span>
  <h2 class="lurus-section-head__title">Product combination</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="creator" :actions="[{label:'Explore Creator', href:'/en/creator/', primary:true}]" />
  <ActionCard product-id="lurus-api" :actions="[{label:'Model catalog', href:'/en/guide/models', primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Pipeline</span>
  <h2 class="lurus-section-head__title">From raw material to multi-platform distribution</h2>
  <p class="lurus-section-head__lede">Source material → LLM rewrite → multi-platform publishing, with WeChat Official Account / Douyin / Xiaohongshu auto-published via chromedp.</p>
</div>

<ArchitectureDiagram title="Content production pipeline" chart="graph LR; Src[Source material<br/>YouTube · Bilibili · local video · text and images] --> Rewrite[LLM rewrite<br/>WeChat long-form · Douyin script · Xiaohongshu note · Shorts · TikTok · Reels]; Rewrite --> Auto[Auto-publish<br/>WeChat Official Account / Douyin / Xiaohongshu chromedp]; Rewrite --> Manual[Manual export for the rest]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Highlights</span>
  <h2 class="lurus-section-head__title">Standout capabilities</h2>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="video" :size="20" /></span>
    <div class="lurus-card__title">Whisper transcription</div>
    <p class="lurus-card__body">Video sources from 1000+ sites are downloaded via yt-dlp and transcribed locally.</p>
  </div>
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">Style switching</div>
    <p class="lurus-card__body">The same material can generate three script versions: "serious / playful / suspenseful."</p>
  </div>
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Copyright rules</div>
    <p class="lurus-card__body">Automatically detects and flags potential copyright-risk terms.</p>
  </div>
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">Multi-account</div>
    <p class="lurus-card__body">Manage multiple WeChat Official Account / Douyin accounts from one device.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> Throughput</span>
  <h2 class="lurus-section-head__title">Case throughput</h2>
</div>

| Scenario | Manual time | Creator time |
|------|---------|--------------|
| 10-min video → Bilibili voiceover script | 1-2 hours | **90 sec** |
| Topic → 2000-word WeChat article | 3-4 hours | **2 min** |
| 1 image + talking points → Xiaohongshu | 20 min | **30 sec** |

## Next steps

<NextSteps :steps="[
  { text: 'Creator use cases', link: '/en/creator/use-cases', primary: true },
  { text: 'Lurus API model catalog', link: '/en/guide/models' },
  { text: 'Contact sales', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
