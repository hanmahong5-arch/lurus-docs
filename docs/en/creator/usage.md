---
title: "Creator User Guide"
description: "Usage guide and feature reference for the Creator desktop content factory."
---

<div class="creator-page">

# User Guide

## Quick Start

<ol class="lurus-steps">
<li>On the main screen, click "<strong>New Task</strong>".</li>
<li>Paste a video URL (YouTube / Bilibili, etc.).</li>
<li>Choose the target action: Download only / Download + Transcribe / Download + Transcribe + Rewrite / Full pipeline (including publishing).</li>
<li>Click "<strong>Start</strong>". Creator runs each stage in sequence; track real-time progress in the task panel.</li>
</ol>

---

## Content Pipeline in Detail

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="video" :size="14" /> Stage 1</span>
  <h2 class="lurus-section-head__title">Video Download</h2>
  <p class="lurus-section-head__lede">Supports 1000+ video platforms (see the full list of sites supported by yt-dlp).</p>
</div>

See the full list at [sites supported by yt-dlp](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md).

**Common sources**:

| Platform | URL Format |
|------|---------|
| YouTube | `https://www.youtube.com/watch?v=xxx` |
| Bilibili | `https://www.bilibili.com/video/BVxxx` |
| Douyin | `https://www.douyin.com/video/xxx` |
| Twitter/X | `https://x.com/user/status/xxx` |

**Download options**:

| Option | Description | Default |
|------|------|--------|
| Video quality | Best / 1080p / 720p / Audio only | Best |
| Subtitles | Automatically download available subtitles | On |
| Proxy | HTTP/SOCKS5 proxy (for accessing overseas platforms) | None |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> Stage 2</span>
  <h2 class="lurus-section-head__title">Audio Transcription</h2>
  <p class="lurus-section-head__lede">Converts audio to text using the OpenAI Whisper model.</p>
</div>

| Model | Size | Speed | Accuracy | Best for |
|------|------|------|--------|---------|
| `tiny` | 75 MB | Very fast | Fair | Quick preview |
| `base` | 142 MB | Fast | Good | Everyday use (default) |
| `small` | 466 MB | Medium | Excellent | When higher accuracy is needed |
| `medium` | 1.5 GB | Slow | Outstanding | Professional content, multilingual |

**Language support**: Detects the language automatically, or specify it manually (supports 99 languages including Chinese, English, and Japanese).

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Stage 3</span>
  <h2 class="lurus-section-head__title">AI Rewriting</h2>
  <p class="lurus-section-head__lede">Processes the transcribed text by calling AI models through the Lurus API.</p>
</div>

Process the transcribed text by calling AI models through the [Lurus API](/en/guide/introduction).

**Rewrite modes**:

| Mode | Description | Best for |
|------|------|------|
| **Translate** | Translate foreign-language content into Chinese | Localizing overseas videos |
| **Polish** | Fix grammar and refine wording | Improving copy quality |
| **Condense** | Extract core points and shorten the length | Long video → short copy |
| **Expand** | Add detail and background | Short content → long article |
| **Style transfer** | Adjust tone (formal ↔ casual) | Adapting to different platforms |
| **SEO optimization** | Generate titles, tags, and summaries | Improving search rankings |

**Model selection**:

| Recommended model | Best for | Cost |
|---------|------|------|
| `deepseek-chat` | Chinese rewriting, translation | Low |
| `gpt-4o` | English content, complex rewrites | High |
| `claude-3-5-sonnet` | Creative writing, long text | Medium |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="share-2" :size="14" /> Stage 4</span>
  <h2 class="lurus-section-head__title">Auto-Publish</h2>
  <p class="lurus-section-head__lede">Publishes automatically via a chromedp headless browser.</p>
</div>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Only 3 platforms support auto-publishing</p>
    <div class="lurus-callout__body">Currently only <strong>WeChat Official Account / Douyin / Xiaohongshu</strong> support auto-publishing. For other platforms (YouTube Shorts / TikTok / Instagram Reels, etc.), copy can be generated but must be published manually.</div>
  </div>
</div>

**First-time setup**:

<ol class="lurus-steps">
<li>Settings → "<strong>Publishing Platforms</strong>" → select the target platform.</li>
<li>Click "<strong>Log in</strong>" to open a browser window.</li>
<li>Log in manually via QR code / password; Creator saves the login state.</li>
</ol>

**Publishing settings** (configured independently per platform):

| Setting | Description |
|--------|------|
| Title template | Supports variables: `{{title}}`, `{{date}}`, `{{source}}` |
| Tags | Auto-generated or manually set |
| Cover | Auto-captured from the video or manually uploaded |
| Publish time | Publish immediately or schedule |

---

## Batch Processing

<ol class="lurus-steps">
<li>Create a text file with one video URL per line.</li>
<li>In Creator, click "<strong>Batch Import</strong>" and select the file.</li>
<li>Choose a unified processing configuration.</li>
<li>Click "<strong>Start All</strong>".</li>
</ol>

### Task Status

Each task is tracked independently:

| Status | Description |
|------|------|
| `queued` | Waiting to be processed |
| `downloading` | Downloading the video |
| `transcribing` | Transcribing speech |
| `rewriting` | AI is rewriting |
| `publishing` | Auto-publishing |
| `completed` | Fully complete |
| `failed` | A stage failed (can retry) |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Resume from checkpoint</p>
    <div class="lurus-callout__body">A failed task can restart from the failed stage—no need to reprocess from the beginning.</div>
  </div>
</div>

---

## Budget Control

Avoid consuming too many tokens during the AI rewriting stage:

| Setting | Description | Default |
|------|------|--------|
| Per-task token limit | Maximum tokens a single task may use | 10,000 |
| Daily total limit | Maximum tokens consumed per day | 100,000 |
| Over-limit behavior | Pause / Skip rewriting / Notify | Pause |

Configure under Settings → "**Token Budget**".

---

## Keyboard Shortcuts

| Shortcut | Function |
|--------|------|
| <span class="lurus-kbd">Ctrl+N</span> / <span class="lurus-kbd">Cmd+N</span> | New task |
| <span class="lurus-kbd">Ctrl+V</span> / <span class="lurus-kbd">Cmd+V</span> | Paste URL and create a task |
| <span class="lurus-kbd">Ctrl+Shift+S</span> / <span class="lurus-kbd">Cmd+Shift+S</span> | Open settings |
| <span class="lurus-kbd">Space</span> | Pause/resume the current task |
| <span class="lurus-kbd">Delete</span> | Delete the selected task |

---

## Troubleshooting

<details class="lurus-faq-item">
<summary>Video download fails?</summary>

Check your network (overseas videos may need a proxy); some platforms have anti-scraping measures—update Creator to the latest version; confirm the URL format.

</details>

<details class="lurus-faq-item">
<summary>Transcription is inaccurate?</summary>

Use a larger Whisper model (Settings → Whisper Model); manually specify the audio language; heavy background noise reduces accuracy.

</details>

<details class="lurus-faq-item">
<summary>AI rewriting times out?</summary>

Check your API Key balance; split overly long text into segments; switch to a faster model (such as `deepseek-chat`).

</details>

<details class="lurus-faq-item">
<summary>Publishing fails?</summary>

The platform login may have expired—scan the QR code again; check whether the content violates platform rules (title/images/sensitive words); platform API changes may require waiting for a Creator update.

</details>

---

## Next Steps

<NextSteps :steps="[
  { text: 'Use Cases', link: '/en/creator/use-cases', primary: true },
  { text: 'Back to Introduction', link: '/en/creator/' },
  { text: 'Installation Guide', link: '/en/creator/install' },
]" />

</div>
