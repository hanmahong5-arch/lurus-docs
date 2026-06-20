---
title: "Creator Installation Guide"
description: "Download and installation steps for the Creator desktop content factory."
---

<div class="creator-page">

# Installation Guide

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prerequisites · ~3 minutes</p>
    <div class="lurus-callout__body">Windows 10+ / macOS 12+ / Linux (64-bit) · Lurus <Term t="API Key">API Key</Term> (<a href="/en/guide/get-api-key">how to get one</a>, used for AI rewriting) · 4 GB+ RAM (8 GB+ recommended).</div>
  </div>
</div>

## Download

Visit [GitHub Releases](https://github.com/hanmahong5-arch/lurus-creator/releases/latest) to download the installer for your platform.

| Platform | File | Notes |
|------|------|------|
| Windows | `LurusCreator-windows-amd64.exe` | 64-bit installer |
| macOS (Apple Silicon) | `LurusCreator-darwin-arm64.dmg` | M1/M2/M3 chips |
| macOS (Intel) | `LurusCreator-darwin-amd64.dmg` | Intel chips |
| Linux | `LurusCreator-linux-amd64.AppImage` | AppImage format |

---

## Per-Platform Installation

After downloading, follow the steps for your operating system.

:::tabs
== Windows

1. Download `LurusCreator-windows-amd64.exe` and double-click to run it.
2. If "Windows protected your PC" appears, click "More info" → "Run anyway".
3. Complete the setup wizard and launch from the desktop shortcut.
4. **First-time setup**: Get a Key at [api.lurus.cn](https://api.lurus.cn) and paste it into Creator's settings (used for AI rewriting).
5. Choose a working directory (where videos/copy are stored).

== macOS

1. Download the `.dmg` for your chip and double-click to mount it.
2. Drag **Lurus Creator** into "Applications".
3. If "cannot verify the developer" appears on first launch, go to "System Settings → Privacy & Security → Open Anyway".

== Linux

```bash
# 下载、赋予执行权限、运行
wget https://github.com/hanmahong5-arch/lurus-creator/releases/latest/download/LurusCreator-linux-amd64.AppImage
chmod +x LurusCreator-linux-amd64.AppImage
./LurusCreator-linux-amd64.AppImage
```
:::

---

## Bundled Dependencies

Creator bundles all required tools, so no extra installation is needed:

| Tool | Purpose | Bundled |
|------|------|---------|
| yt-dlp | Video download | Bundled |
| ffmpeg | Audio/video processing | Bundled |
| Whisper | Speech-to-text | Bundled (tiny/base models) |
| chromedp | Automated publishing | Bundled |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Whisper Models</p>
    <div class="lurus-callout__body">The <code>tiny</code> and <code>base</code> models are bundled by default. If transcription quality is not good enough, you can download larger models (<code>small</code> / <code>medium</code>) in the settings for higher accuracy, at the cost of more memory.</div>
  </div>
</div>

---

## System Requirements

| Item | Minimum | Recommended |
|------|---------|------|
| RAM | 4 GB | 8 GB+ |
| Disk space | 500 MB (installation) | 10 GB+ (including video cache) |
| Network | Broadband connection | A stable network is needed to download videos |
| GPU | Not required | A GPU can accelerate Whisper transcription |

---

## Verify the Installation

<ol class="lurus-steps">
<li>Open the settings page and confirm the API Key status shows "Connected".</li>
<li>Click "Check dependencies" and confirm all tools show a green checkmark.</li>
<li>Enter a video URL to test downloading.</li>
</ol>

---

## Uninstall

| Platform | Action | Config/cache location |
|------|------|--------------|
| **Windows** | Control Panel → Uninstall a program → "Lurus Creator" | `%APPDATA%\LurusCreator\` |
| **macOS** | Drag "Lurus Creator" from Applications to the Trash | `~/Library/Application Support/LurusCreator/` |
| **Linux** | `rm /opt/lurus-creator` (or the AppImage location) | `rm -rf ~/.config/LurusCreator/` |

---

## Next Steps

<NextSteps :steps="[
  { text: 'User Manual', link: '/en/creator/usage', primary: true },
  { text: 'Use Cases', link: '/en/creator/use-cases' },
  { text: 'Get an API Key', link: '/en/guide/get-api-key' },
]" />

</div>
