---
title: "Creator Use Cases"
description: "Complete pipelines for three typical scenarios — Bilibili video commentary, long-form WeChat articles, and Xiaohongshu notes."
---

<div class="creator-page">

# Creator Use Cases <StatusBadge status="dev" />

Three real-world pipeline cases, spanning video, long-form articles, and short social content.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="video" :size="14" /> Case 1</span>
  <h2 class="lurus-section-head__title">Bilibili Video Commentary</h2>
  <p class="lurus-section-head__lede">A single Bilibili video link → voiceover script + cover copy.</p>
</div>

| Stage | Tool | Output |
|------|------|------|
| Input | Paste video link | Original video URL |
| Download | yt-dlp | mp4 file |
| Transcribe | Whisper large-v3 | Chinese subtitles with timestamps |
| Refine | LLM (DeepSeek-Chat) | Segmented summary + highlights |
| Rewrite | LLM (Claude Sonnet) | 3 voiceover scripts (serious / playful / suspenseful) |
| Cover | LLM | 3 candidate cover titles |
| Output | Creator editor | Ready to paste into the Bilibili dashboard |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="gauge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Typical Time</p>
    <div class="lurus-callout__body">10-minute video → full pipeline in 90 seconds.</div>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-open" :size="14" /> Case 2</span>
  <h2 class="lurus-section-head__title">Long-Form WeChat Article</h2>
  <p class="lurus-section-head__lede">A single topic → a 2,000-word in-depth WeChat article.</p>
</div>

<ArchitectureDiagram
  title="Topic → Long-Form WeChat Article"
  chart='graph TD
    TOPIC["Topic input: A retrospective on applying WAL to AI Agent persistence"] --> SEARCH[Source retrieval<br/>Lurus API + web_search Tool]
    SEARCH --> OUTLINE[Outline generation<br/>LLM drafts 5 H2 headings]
    OUTLINE --> WRITE[Section-by-section writing<br/>Generated in chunks per the outline]
    WRITE --> FIG[Figure suggestions<br/>LLM proposes 3 diagram placements]
    FIG --> MD[Markdown output to the Creator editor]'
/>

**Adaptations**:

- WeChat does not support H4, so it is automatically downgraded
- Automatically generates "recommended reading" cross-links (based on keyword matching)
- Supports switching between three style tiers: "conversational / academic / commercial"

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="share-2" :size="14" /> Case 3</span>
  <h2 class="lurus-section-head__title">Xiaohongshu Note</h2>
  <p class="lurus-section-head__lede">One image + one quip → a complete recommendation note.</p>
</div>

**Input**: Product photo + "the battery life is unreal"

**Output**:

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

Automatically generates 6–10 hashtags while avoiding banned words.

---

## Shared Pipeline Comparison

| Scenario | Video Commentary | Long-Form WeChat Article | Xiaohongshu |
|------|---------|-----------|--------|
| Input form | URL | Topic keyword | Image + short caption |
| Core model | Whisper + LLM | LLM | LLM |
| Output length | 300–500-word script | 2,000 words | 80–150 words |
| Publishing support | Copy & export | Auto-publish via chromedp | Auto-publish via chromedp |
| Typical time | 90 seconds | 2 minutes | 30 seconds |

## Next Steps

<NextSteps :steps="[
  { text: 'Back to Overview', link: '/en/creator/', primary: true },
  { text: 'Installation Guide', link: '/en/creator/install' },
  { text: 'User Manual', link: '/en/creator/usage' },
]" />

</div>
