---
title: "Creator — AI-Powered Desktop Content Factory"
description: "A desktop content production tool built on Wails, with AI-assisted creation and multi-format output."
---

<div class="creator-page">

<ProductHero product-id="creator" />

## What Is Creator?

**Lurus Creator** is a desktop AI content creation tool that combines video download, audio transcription, AI rewriting, and multi-platform publishing into a single automated pipeline. A single dependency-free executable — open it and go.

Paste a video link, and the AI automatically generates 6 platform-tailored copies: WeChat Official Account (in-depth articles), Douyin (voiceover scripts), Xiaohongshu (recommendation notes), YouTube Shorts, TikTok, and Instagram Reels. Among them, WeChat Official Account / Douyin / Xiaohongshu support one-click publishing via chromedp browser automation; the other platforms require manual publishing. Video sources cover YouTube, Bilibili, and 1000+ other sites (powered by yt-dlp).

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">1000+</span><span class="lurus-stat__label">Video source sites</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6</span><span class="lurus-stat__label">Platform-tailored copies</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">One-click publish platforms</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">99</span><span class="lurus-stat__label">Transcription languages</span></div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Core Capabilities</span>
  <h2 class="lurus-section-head__title">From a Single Link to Multi-Platform Publishing</h2>
  <p class="lurus-section-head__lede">Download, transcribe, rewrite, and publish chained into a pipeline — automated end to end.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-creator)"
  :items="[
    { title: 'One-Click Content Pipeline', body: 'Video source → yt-dlp download → ffmpeg transcode → Whisper transcribe → LLM rewrite → chromedp publish, automated end to end', icon: 'workflow' },
    { title: 'Smart Rewriting', body: 'Translation (preserving terminology), rewriting (tone and length), key-point extraction, SEO-optimized titles, tags, and summaries', icon: 'sparkles' },
    { title: 'Multi-Platform Content Generation', body: 'Generate 6 platform templates at once: Official Account / Douyin / Xiaohongshu / YouTube Shorts / TikTok / Reels', icon: 'share-2' },
    { title: 'DevFactory Batch', body: 'Per-task tracking via SQLite state machine, batch queuing, token budget control, resume from checkpoint', icon: 'package' },
  ]"
/>

### One-Click Content Pipeline

<ArchitectureDiagram
  title="Content Pipeline: Video Source → Publish"
  chart="graph LR
    SRC[视频来源<br/>YouTube / Bilibili / 本地] --> DL[yt-dlp 下载]
    DL --> TC[ffmpeg 转码]
    TC --> TR[Whisper 转写]
    TR --> RW[LLM 改写 / 翻译]
    RW --> PUB[chromedp 发布<br/>公众号 / 抖音 / 小红书]"
/>

| Stage | Tool | Description |
|------|------|------|
| **Download** | yt-dlp | 1000+ video platforms such as YouTube and Bilibili |
| **Transcode** | ffmpeg | Format conversion, trimming, watermark removal |
| **Transcribe** | Whisper | Speech to text, 99 languages |
| **Rewrite** | LLM (Lurus API) | AI polishing, translation, formatting adjustments |
| **Publish** | chromedp | Headless browser auto-login, upload, and publish |

### Multi-Platform Content Generation + One-Click Publishing for Select Platforms

Content generation covers 6 platform templates: WeChat Official Account, Douyin, Xiaohongshu, YouTube Shorts, TikTok, and Instagram Reels. Currently, only 3 platforms support automated publishing via chromedp headless browser technology:

| Platform | Supported Content Types | Auto-Publish |
|------|--------------|---------|
| **WeChat Official Account** | Illustrated articles | ✅ |
| **Douyin** | Short videos + copy | ✅ |
| **Xiaohongshu** | Illustrated notes | ✅ |
| YouTube Shorts | Short-video scripts | ❌ Manual publish required |
| TikTok | Short-video scripts | ❌ Manual publish required |
| Instagram Reels | Short-video scripts | ❌ Manual publish required |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">First-Time Login</p>
    <div class="lurus-callout__body">The first time you use a publishing platform's features, you need to scan a QR code to log in once manually. After that, Creator saves the login state.</div>
  </div>
</div>

---

## Technical Architecture

`Creator Desktop (Wails v2 = Go + TypeScript)`: a TypeScript frontend (task panel / editor / settings) + Go backend (orchestrating yt-dlp / ffmpeg / Whisper / chromedp + a SQLite state machine) → [Lurus API](/en/guide/introduction) (LLM, e.g. DeepSeek/GPT). Compiled into a single executable.

<ArchitectureDiagram
  title="Creator Desktop Technical Architecture"
  chart="graph TD
    UI[前端 TypeScript<br/>任务面板 / 编辑器 / 设置] --> GO[Go 后端<br/>调度 + SQLite 状态机]
    GO --> TOOLS[yt-dlp / ffmpeg / Whisper / chromedp]
    GO --> API[Lurus API<br/>LLM · DeepSeek / GPT 等]"
/>

---

## Use Cases

<UserScenarios
  title="Who Uses Creator"
  :scenarios="[
    { role: 'Creators', title: 'Self-Media Operations', summary: 'Localize high-quality overseas content and mass-produce Chinese versions', link: '/en/creator/use-cases' },
    { role: 'Knowledge', title: 'Knowledge Sharing', summary: 'Extract transcripts from technical talk videos and publish as illustrated tutorials', link: '/en/creator/use-cases' },
    { role: 'Matrix', title: 'Content Matrix', summary: 'Automatically adapt one piece of content to multiple platform formats and styles', link: '/en/creator/use-cases' },
    { role: 'Teams', title: 'Team Collaboration', summary: 'Batch-process video lists with task progress at a glance', link: '/en/creator/usage' },
  ]"
/>

---

## Supported Platforms

| Operating System | Version Requirements |
|---------|---------|
| Windows | Windows 10 64-bit and above |
| macOS | macOS 12 (Monterey) and above |
| Linux | Ubuntu 20.04+ / Debian 11+ |

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">Download and Go, Zero-Config Startup</p>
    <p class="lurus-cta__text">A single exe bundling yt-dlp / ffmpeg / Whisper / chromedp — run your first task in 3 minutes.</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="/en/creator/install">Installation Guide →</a>
  </div>
</div>

<!-- lurus:related-block -->

---

## Related Products and Next Steps

<RelatedProducts product-id="creator" />

</div>
