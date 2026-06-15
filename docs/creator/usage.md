---
title: Creator 使用手册
description: Creator 桌面内容工厂的使用指南和功能说明。
---

<div class="creator-page">

# 使用手册

## 快速体验

<ol class="lurus-steps">
<li>主界面点「<strong>新建任务</strong>」。</li>
<li>粘贴视频 URL（YouTube / Bilibili 等）。</li>
<li>选目标操作：仅下载 / 下载+转写 / 下载+转写+改写 / 完整流水线（含发布）。</li>
<li>点「<strong>开始</strong>」，Creator 按顺序执行各阶段，任务面板查看实时进度。</li>
</ol>

---

## 内容流水线详解

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="video" :size="14" /> 阶段 1</span>
  <h2 class="lurus-section-head__title">视频下载</h2>
  <p class="lurus-section-head__lede">支持 1000+ 视频平台（完整列表见 yt-dlp 支持的网站）。</p>
</div>

完整列表见 [yt-dlp 支持的网站](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)。

**常用来源**：

| 平台 | URL 格式 |
|------|---------|
| YouTube | `https://www.youtube.com/watch?v=xxx` |
| Bilibili | `https://www.bilibili.com/video/BVxxx` |
| 抖音 | `https://www.douyin.com/video/xxx` |
| Twitter/X | `https://x.com/user/status/xxx` |

**下载选项**：

| 选项 | 说明 | 默认值 |
|------|------|--------|
| 视频质量 | 最高 / 1080p / 720p / 仅音频 | 最高 |
| 字幕 | 自动下载可用字幕 | 开启 |
| 代理 | HTTP/SOCKS5 代理（访问海外平台） | 无 |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> 阶段 2</span>
  <h2 class="lurus-section-head__title">音频转写</h2>
  <p class="lurus-section-head__lede">使用 OpenAI Whisper 模型将音频转为文字。</p>
</div>

| 模型 | 大小 | 速度 | 准确率 | 适用场景 |
|------|------|------|--------|---------|
| `tiny` | 75 MB | 极快 | 一般 | 快速预览 |
| `base` | 142 MB | 快 | 良好 | 日常使用（默认） |
| `small` | 466 MB | 中 | 优秀 | 需要较高准确率 |
| `medium` | 1.5 GB | 慢 | 极佳 | 专业内容、多语言 |

**语言支持**：自动检测语言，也可手动指定（支持中文、英文、日文等 99 种语言）。

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> 阶段 3</span>
  <h2 class="lurus-section-head__title">AI 改写</h2>
  <p class="lurus-section-head__lede">通过 Lurus API 调用 AI 模型对转写文本进行加工。</p>
</div>

通过 [Lurus API](/guide/introduction) 调用 AI 模型对转写文本进行加工。

**改写模式**：

| 模式 | 说明 | 适合 |
|------|------|------|
| **翻译** | 将外语内容翻译为中文 | 海外视频本地化 |
| **润色** | 修正语法、优化表达 | 提升文案质量 |
| **缩写** | 提取核心观点，压缩篇幅 | 长视频 → 短文案 |
| **扩写** | 补充细节和背景 | 短内容 → 长文章 |
| **风格转换** | 调整语气（正式↔轻松） | 适配不同平台 |
| **SEO 优化** | 生成标题、标签、摘要 | 提升搜索排名 |

**模型选择**：

| 推荐模型 | 适合 | 成本 |
|---------|------|------|
| `deepseek-chat` | 中文改写、翻译 | 低 |
| `gpt-4o` | 英文内容、复杂改写 | 高 |
| `claude-3-5-sonnet` | 创意写作、长文本 | 中 |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="share-2" :size="14" /> 阶段 4</span>
  <h2 class="lurus-section-head__title">自动发布</h2>
  <p class="lurus-section-head__lede">通过 chromedp 无头浏览器自动发布。</p>
</div>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">仅 3 个平台支持自动发布</p>
    <div class="lurus-callout__body">当前仅支持 <strong>微信公众号 / 抖音 / 小红书</strong> 自动发布。其他平台（YouTube Shorts / TikTok / Instagram Reels 等）文案可生成但需手动发布。</div>
  </div>
</div>

**首次配置**：

<ol class="lurus-steps">
<li>设置 →「<strong>发布平台</strong>」→ 选目标平台。</li>
<li>点「<strong>登录</strong>」弹出浏览器窗口。</li>
<li>手动扫码 / 密码登录，Creator 保存登录状态。</li>
</ol>

**发布设置**（每平台独立配置）：

| 设置项 | 说明 |
|--------|------|
| 标题模板 | 支持变量：`{{title}}`、`{{date}}`、`{{source}}` |
| 标签 | 自动生成或手动设定 |
| 封面 | 自动从视频截取或手动上传 |
| 发布时间 | 立即发布或定时发布 |

---

## 批量处理

<ol class="lurus-steps">
<li>创建文本文件，每行一个视频 URL。</li>
<li>Creator 点「<strong>批量导入</strong>」选文件。</li>
<li>选统一处理配置。</li>
<li>点「<strong>全部开始</strong>」。</li>
</ol>

### 任务状态

每个任务独立追踪：

| 状态 | 说明 |
|------|------|
| `queued` | 等待处理 |
| `downloading` | 正在下载视频 |
| `transcribing` | 正在语音转写 |
| `rewriting` | AI 正在改写 |
| `publishing` | 正在自动发布 |
| `completed` | 全部完成 |
| `failed` | 某阶段失败（可重试） |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">断点续传</p>
    <div class="lurus-callout__body">失败的任务可以从失败阶段重新开始，无需从头处理。</div>
  </div>
</div>

---

## 预算控制

避免 AI 改写阶段消耗过多 Token：

| 设置 | 说明 | 默认值 |
|------|------|--------|
| 单任务 Token 上限 | 每个任务最多使用的 Token 数 | 10,000 |
| 日总量上限 | 每天最多消耗的 Token 数 | 100,000 |
| 超限行为 | 暂停 / 跳过改写 / 提醒 | 暂停 |

在 设置 → 「**Token 预算**」中配置。

---

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| <span class="lurus-kbd">Ctrl+N</span> / <span class="lurus-kbd">Cmd+N</span> | 新建任务 |
| <span class="lurus-kbd">Ctrl+V</span> / <span class="lurus-kbd">Cmd+V</span> | 粘贴 URL 并创建任务 |
| <span class="lurus-kbd">Ctrl+Shift+S</span> / <span class="lurus-kbd">Cmd+Shift+S</span> | 打开设置 |
| <span class="lurus-kbd">Space</span> | 暂停/恢复当前任务 |
| <span class="lurus-kbd">Delete</span> | 删除选中任务 |

---

## 故障排查

<details class="lurus-faq-item">
<summary>视频下载失败？</summary>

检查网络（海外视频或需代理）；部分平台有反爬，更新 Creator 到最新版；确认 URL 格式。

</details>

<details class="lurus-faq-item">
<summary>转写不准确？</summary>

用更大的 Whisper 模型（设置 → Whisper 模型）；手动指定音频语言；背景噪音大会降低准确率。

</details>

<details class="lurus-faq-item">
<summary>AI 改写超时？</summary>

检查 API Key 余额；文本过长分段处理；切换更快的模型（如 `deepseek-chat`）。

</details>

<details class="lurus-faq-item">
<summary>发布失败？</summary>

平台登录可能过期，重新扫码；检查内容是否违反平台规则（标题/图片/敏感词）；平台 API 变更需等 Creator 更新适配。

</details>

---

## 下一步

<NextSteps :steps="[
  { text: '使用案例', link: '/creator/use-cases', primary: true },
  { text: '回到简介', link: '/creator/' },
  { text: '安装指南', link: '/creator/install' },
]" />

</div>
