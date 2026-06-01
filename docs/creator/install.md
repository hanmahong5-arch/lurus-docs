---
title: Creator 安装指南
description: Creator 桌面内容工厂的下载和安装步骤。
---

# 安装指南

::: info 前置条件
Windows 10+ / macOS 12+ / Linux（64 位）· Lurus <Term t="API Key">API Key</Term>（[获取方式](/guide/get-api-key)，用于 AI 改写）· 4 GB+ 内存（推荐 8 GB+）。预计 3 分钟。
:::

## 下载

访问 [GitHub Releases](https://github.com/hanmahong5-arch/lurus-creator/releases/latest) 下载对应平台安装包。

| 平台 | 文件 | 说明 |
|------|------|------|
| Windows | `LurusCreator-windows-amd64.exe` | 64 位安装程序 |
| macOS (Apple Silicon) | `LurusCreator-darwin-arm64.dmg` | M1/M2/M3 芯片 |
| macOS (Intel) | `LurusCreator-darwin-amd64.dmg` | Intel 芯片 |
| Linux | `LurusCreator-linux-amd64.AppImage` | AppImage 格式 |

---

## Windows 安装

下载 `LurusCreator-windows-amd64.exe` → 双击运行 →（弹「Windows 已保护你的电脑」则「更多信息」→「仍要运行」）→ 完成向导 → 桌面快捷方式启动。**首次配置**：在 [api.lurus.cn](https://api.lurus.cn) 获取 Key 粘贴到 Creator 设置（用于 AI 改写）→ 选工作目录（视频/文案存储位置）。

---

## macOS 安装

下载对应芯片 `.dmg` → 双击挂载 → 拖 **Lurus Creator** 到「应用程序」→ 首次打开提示「无法验证开发者」则「系统设置 → 隐私与安全性 → 仍要打开」。

---

## Linux 安装

```bash
# 下载
wget https://github.com/hanmahong5-arch/lurus-creator/releases/latest/download/LurusCreator-linux-amd64.AppImage

# 添加执行权限
chmod +x LurusCreator-linux-amd64.AppImage

# 运行
./LurusCreator-linux-amd64.AppImage
```

---

## 内置依赖

Creator 打包了所有必需的工具，无需额外安装：

| 工具 | 用途 | 是否内置 |
|------|------|---------|
| yt-dlp | 视频下载 | 内置 |
| ffmpeg | 音视频处理 | 内置 |
| Whisper | 语音转文字 | 内置（tiny/base 模型） |
| chromedp | 自动发布 | 内置 |

::: tip Whisper 模型
默认内置 `tiny` 和 `base` 模型。如果转写质量不够好，可以在设置中下载更大的模型（`small` / `medium`），准确率更高但需要更多内存。
:::

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

设置页面：确认 API Key 状态「已连接」→「检查依赖」所有工具显示绿色对勾 → 输入视频 URL 测试下载。

---

## 卸载

- **Windows**：控制面板 → 卸载程序 →「Lurus Creator」；配置/缓存在 `%APPDATA%\LurusCreator\`。
- **macOS**：应用程序「Lurus Creator」拖入废纸篓；配置/缓存在 `~/Library/Application Support/LurusCreator/`。
- **Linux**：`rm /opt/lurus-creator`（或 AppImage 位置）+ `rm -rf ~/.config/LurusCreator/`。
