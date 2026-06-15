---
title: Creator 安装指南
description: Creator 桌面内容工厂的下载和安装步骤。
---

<div class="creator-page">

# 安装指南

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前置条件 · 预计 3 分钟</p>
    <div class="lurus-callout__body">Windows 10+ / macOS 12+ / Linux（64 位）· Lurus <Term t="API Key">API Key</Term>（<a href="/guide/get-api-key">获取方式</a>，用于 AI 改写）· 4 GB+ 内存（推荐 8 GB+）。</div>
  </div>
</div>

## 下载

访问 [GitHub Releases](https://github.com/hanmahong5-arch/lurus-creator/releases/latest) 下载对应平台安装包。

| 平台 | 文件 | 说明 |
|------|------|------|
| Windows | `LurusCreator-windows-amd64.exe` | 64 位安装程序 |
| macOS (Apple Silicon) | `LurusCreator-darwin-arm64.dmg` | M1/M2/M3 芯片 |
| macOS (Intel) | `LurusCreator-darwin-amd64.dmg` | Intel 芯片 |
| Linux | `LurusCreator-linux-amd64.AppImage` | AppImage 格式 |

---

## 分平台安装

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="monitor" :size="14" /> Windows</span>
  <h2 class="lurus-section-head__title">Windows 安装</h2>
</div>

<ol class="lurus-steps">
<li>下载 <code>LurusCreator-windows-amd64.exe</code> 并双击运行。</li>
<li>若弹出「Windows 已保护你的电脑」，点「更多信息」→「仍要运行」。</li>
<li>完成安装向导，从桌面快捷方式启动。</li>
<li><strong>首次配置</strong>：在 <a href="https://api.lurus.cn">api.lurus.cn</a> 获取 Key 粘贴到 Creator 设置（用于 AI 改写）。</li>
<li>选择工作目录（视频/文案存储位置）。</li>
</ol>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="monitor" :size="14" /> macOS</span>
  <h2 class="lurus-section-head__title">macOS 安装</h2>
</div>

<ol class="lurus-steps">
<li>下载对应芯片的 <code>.dmg</code>，双击挂载。</li>
<li>将 <strong>Lurus Creator</strong> 拖到「应用程序」。</li>
<li>首次打开若提示「无法验证开发者」，前往「系统设置 → 隐私与安全性 → 仍要打开」。</li>
</ol>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="terminal" :size="14" /> Linux</span>
  <h2 class="lurus-section-head__title">Linux 安装</h2>
</div>

<ol class="lurus-steps">
<li>

下载 AppImage：

```bash
wget https://github.com/hanmahong5-arch/lurus-creator/releases/latest/download/LurusCreator-linux-amd64.AppImage
```

</li>
<li>

添加执行权限：

```bash
chmod +x LurusCreator-linux-amd64.AppImage
```

</li>
<li>

运行：

```bash
./LurusCreator-linux-amd64.AppImage
```

</li>
</ol>

---

## 内置依赖

Creator 打包了所有必需的工具，无需额外安装：

| 工具 | 用途 | 是否内置 |
|------|------|---------|
| yt-dlp | 视频下载 | 内置 |
| ffmpeg | 音视频处理 | 内置 |
| Whisper | 语音转文字 | 内置（tiny/base 模型） |
| chromedp | 自动发布 | 内置 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Whisper 模型</p>
    <div class="lurus-callout__body">默认内置 <code>tiny</code> 和 <code>base</code> 模型。如果转写质量不够好，可以在设置中下载更大的模型（<code>small</code> / <code>medium</code>），准确率更高但需要更多内存。</div>
  </div>
</div>

---

## 系统要求

| 项目 | 最低要求 | 推荐 |
|------|---------|------|
| 内存 | 4 GB | 8 GB+ |
| 磁盘空间 | 500 MB（安装） | 10 GB+（含视频缓存） |
| 网络 | 宽带连接 | 下载视频需要稳定网络 |
| GPU | 不需要 | 有 GPU 可加速 Whisper 转写 |

---

## 验证安装

<ol class="lurus-steps">
<li>打开设置页面，确认 API Key 状态显示「已连接」。</li>
<li>点「检查依赖」，确认所有工具显示绿色对勾。</li>
<li>输入一个视频 URL 测试下载。</li>
</ol>

---

## 卸载

| 平台 | 操作 | 配置/缓存位置 |
|------|------|--------------|
| **Windows** | 控制面板 → 卸载程序 →「Lurus Creator」 | `%APPDATA%\LurusCreator\` |
| **macOS** | 应用程序「Lurus Creator」拖入废纸篓 | `~/Library/Application Support/LurusCreator/` |
| **Linux** | `rm /opt/lurus-creator`（或 AppImage 位置） | `rm -rf ~/.config/LurusCreator/` |

---

## 下一步

<NextSteps :steps="[
  { text: '使用手册', link: '/creator/usage', primary: true },
  { text: '使用案例', link: '/creator/use-cases' },
  { text: '获取 API Key', link: '/guide/get-api-key' },
]" />

</div>
