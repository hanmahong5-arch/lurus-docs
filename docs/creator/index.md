---
title: Creator — AI 驱动的桌面内容工厂
description: 基于 Wails 构建的桌面内容生产工具，AI 辅助创作、多格式输出。
---

<div class="creator-page">

<ProductHero product-id="creator" />

## 什么是 Creator？

**Lurus Creator** 是一个桌面端 AI 内容创作工具，将视频下载、音频转写、AI 改写、多平台发布整合为一条自动化流水线。单 exe 零依赖，打开即用。

粘贴一个视频链接，AI 自动生成 6 套平台定制文案：微信公众号（深度文章）、抖音（口播脚本）、小红书（种草笔记）、YouTube Shorts、TikTok、Instagram Reels。其中微信公众号 / 抖音 / 小红书 3 个平台支持 chromedp 浏览器自动化一键发布，其余平台需手动发布。视频源支持 YouTube、Bilibili 等 1000+ 站点（由 yt-dlp 驱动）。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">1000+</span><span class="lurus-stat__label">视频源站点</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6</span><span class="lurus-stat__label">平台定制文案</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">平台一键发布</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">99</span><span class="lurus-stat__label">转写语言</span></div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 核心能力</span>
  <h2 class="lurus-section-head__title">从一个链接到多平台发布</h2>
  <p class="lurus-section-head__lede">下载、转写、改写、发布串成一条流水线，全程自动化。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-creator)"
  :items="[
    { title: '一键内容流水线', body: '视频来源 → yt-dlp 下载 → ffmpeg 转码 → Whisper 转写 → LLM 改写 → chromedp 发布，全程自动化', icon: 'workflow' },
    { title: '智能改写', body: '翻译（保留术语）、改写（语气长短）、提取关键观点、SEO 优化标题标签摘要', icon: 'sparkles' },
    { title: '多平台内容生成', body: '一次生成 6 个平台模板：公众号 / 抖音 / 小红书 / YouTube Shorts / TikTok / Reels', icon: 'share-2' },
    { title: 'DevFactory 批量', body: 'SQLite 状态机逐任务追踪、批量排队、Token 预算控制、断点续传', icon: 'package' },
  ]"
/>

### 一键内容流水线

<ArchitectureDiagram
  title="内容流水线：视频源 → 发布"
  chart="graph LR
    SRC[视频来源<br/>YouTube / Bilibili / 本地] --> DL[yt-dlp 下载]
    DL --> TC[ffmpeg 转码]
    TC --> TR[Whisper 转写]
    TR --> RW[LLM 改写 / 翻译]
    RW --> PUB[chromedp 发布<br/>公众号 / 抖音 / 小红书]"
/>

| 阶段 | 工具 | 说明 |
|------|------|------|
| **下载** | yt-dlp | YouTube、Bilibili 等 1000+ 视频平台 |
| **转码** | ffmpeg | 格式转换、裁剪、水印去除 |
| **转写** | Whisper | 语音转文字，99 种语言 |
| **改写** | LLM (Lurus API) | AI 润色、翻译、格式调整 |
| **发布** | chromedp | 无头浏览器自动登录、上传、发布 |

### 多平台内容生成 + 部分平台一键发布

内容生成覆盖 6 个平台模板：微信公众号、抖音、小红书、YouTube Shorts、TikTok、Instagram Reels。当前通过 chromedp 无头浏览器技术实现自动发布的仅 3 个平台：

| 平台 | 支持的内容类型 | 自动发布 |
|------|--------------|---------|
| **微信公众号** | 图文文章 | ✅ |
| **抖音** | 短视频 + 文案 | ✅ |
| **小红书** | 图文笔记 | ✅ |
| YouTube Shorts | 短视频脚本 | ❌ 需手动发布 |
| TikTok | 短视频脚本 | ❌ 需手动发布 |
| Instagram Reels | 短视频脚本 | ❌ 需手动发布 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">首次登录</p>
    <div class="lurus-callout__body">首次使用各发布平台功能时，需要手动扫码登录一次。之后 Creator 会保存登录状态。</div>
  </div>
</div>

---

## 技术架构

`Creator Desktop (Wails v2 = Go + TypeScript)`：前端 TypeScript（任务面板/编辑器/设置）+ Go 后端（调度 yt-dlp / ffmpeg / Whisper / chromedp + SQLite 状态机）→ [Lurus API](/guide/introduction)（LLM，DeepSeek/GPT 等）。编译为单可执行文件。

<ArchitectureDiagram
  title="Creator Desktop 技术架构"
  chart="graph TD
    UI[前端 TypeScript<br/>任务面板 / 编辑器 / 设置] --> GO[Go 后端<br/>调度 + SQLite 状态机]
    GO --> TOOLS[yt-dlp / ffmpeg / Whisper / chromedp]
    GO --> API[Lurus API<br/>LLM · DeepSeek / GPT 等]"
/>

---

## 适用场景

<UserScenarios
  title="谁在用 Creator"
  :scenarios="[
    { role: '自媒体', title: '自媒体运营', summary: '海外优质内容本地化，批量生产中文版', link: '/creator/use-cases' },
    { role: '知识', title: '知识传播', summary: '技术讲座视频提取文字稿，发布为图文教程', link: '/creator/use-cases' },
    { role: '矩阵', title: '内容矩阵', summary: '一份内容自动适配多个平台格式和风格', link: '/creator/use-cases' },
    { role: '团队', title: '团队协作', summary: '批量处理视频列表，任务进度一目了然', link: '/creator/usage' },
  ]"
/>

---

## 支持的平台

| 操作系统 | 版本要求 |
|---------|---------|
| Windows | Windows 10 64-bit 及以上 |
| macOS | macOS 12 (Monterey) 及以上 |
| Linux | Ubuntu 20.04+ / Debian 11+ |

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">下载即用，零配置启动</p>
    <p class="lurus-cta__text">单 exe 打包 yt-dlp / ffmpeg / Whisper / chromedp，3 分钟跑通第一个任务。</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="/creator/install">安装指南 →</a>
  </div>
</div>

<!-- lurus:related-block -->

---

## 相关产品与下一步

<RelatedProducts product-id="creator" />

</div>
