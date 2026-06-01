---
title: Creator — AI 驱动的桌面内容工厂
description: 基于 Wails 构建的桌面内容生产工具，AI 辅助创作、多格式输出。
---

# Creator — AI 驱动的桌面内容工厂 <StatusBadge status="dev" />

## 什么是 Creator？

**Lurus Creator** 是一个桌面端 AI 内容创作工具，将视频下载、音频转写、AI 改写、多平台发布整合为一条自动化流水线。单 exe 零依赖，打开即用。

粘贴一个视频链接，AI 自动生成 6 套平台定制文案：微信公众号（深度文章）、抖音（口播脚本）、小红书（种草笔记）、YouTube Shorts、TikTok、Instagram Reels。其中微信公众号 / 抖音 / 小红书 3 个平台支持 chromedp 浏览器自动化一键发布，其余平台需手动发布。视频源支持 YouTube、Bilibili 等 1000+ 站点（由 yt-dlp 驱动）。

---

## 核心能力

### 一键内容流水线

`视频来源(YouTube/Bilibili/本地) → yt-dlp 下载 → ffmpeg 转码 → Whisper 转写 → LLM 改写/翻译 → 发布(微信公众号/抖音/小红书)`，全程自动化：

| 阶段 | 工具 | 说明 |
|------|------|------|
| **下载** | yt-dlp | YouTube、Bilibili 等 1000+ 视频平台 |
| **转码** | ffmpeg | 格式转换、裁剪、水印去除 |
| **转写** | Whisper | 语音转文字，99 种语言 |
| **改写** | LLM (Lurus API) | AI 润色、翻译、格式调整 |
| **发布** | chromedp | 无头浏览器自动登录、上传、发布 |

### 智能改写

AI 深度加工：翻译（英文→中文，保留术语）、改写（语气风格 严肃↔轻松、长↔短）、提取（长视频→关键观点短文案）、SEO 优化（生成标题/标签/摘要）。

### 多平台内容生成 + 部分平台一键发布

内容生成覆盖 6 个平台模板：微信公众号、抖音、小红书、YouTube Shorts、TikTok、Instagram Reels。

当前通过 chromedp 无头浏览器技术实现自动发布的仅 3 个平台：

| 平台 | 支持的内容类型 | 自动发布 |
|------|--------------|---------|
| **微信公众号** | 图文文章 | ✅ |
| **抖音** | 短视频 + 文案 | ✅ |
| **小红书** | 图文笔记 | ✅ |
| YouTube Shorts | 短视频脚本 | ❌ 需手动发布 |
| TikTok | 短视频脚本 | ❌ 需手动发布 |
| Instagram Reels | 短视频脚本 | ❌ 需手动发布 |

::: tip
首次使用各发布平台功能时，需要手动扫码登录一次。之后 Creator 会保存登录状态。
:::

### DevFactory 模式

内置任务管理引擎支持批量生产：SQLite 状态机（每任务独立追踪 下载→转写→改写→发布）、批量处理（导入 URL 列表自动排队）、预算控制（LLM Token 上限避免超支）、断点续传（中断后从上次完成阶段继续）。

---

## 技术架构

`Creator Desktop (Wails v2 = Go + TypeScript)`：前端 TypeScript（任务面板/编辑器/设置）+ Go 后端（调度 yt-dlp / ffmpeg / Whisper / chromedp + SQLite 状态机）→ [Lurus API](/guide/introduction)（LLM，DeepSeek/GPT 等）。编译为单可执行文件。

---

## 适用场景

| 场景 | 说明 |
|------|------|
| **自媒体运营** | 海外优质内容本地化，批量生产中文版 |
| **知识传播** | 技术讲座视频提取文字稿，发布为图文教程 |
| **内容矩阵** | 一份内容自动适配多个平台格式和风格 |
| **团队协作** | 批量处理视频列表，任务进度一目了然 |

---

## 支持的平台

| 操作系统 | 版本要求 |
|---------|---------|
| Windows | Windows 10 64-bit 及以上 |
| macOS | macOS 12 (Monterey) 及以上 |
| Linux | Ubuntu 20.04+ / Debian 11+ |

---

## 下一步

- [安装指南](/creator/install) — 下载并安装 Creator
- [使用手册](/creator/usage) — 从第一个任务开始

<!-- lurus:related-block -->

---

## 相关产品与下一步

<RelatedProducts product-id="creator" />

