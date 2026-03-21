---
title: Switch 安装指南
description: Lurus Switch 桌面应用的下载和安装步骤。
---

# Switch 安装指南

::: info 前置条件
- Windows 10+ / macOS 12+ / Ubuntu 20.04+（64 位）
- 一个 Lurus <Term t="API Key">API Key</Term>（[获取方式](/guide/get-api-key)），或其他 Provider 的 Key
- 预计时间: 3 分钟
:::

## 下载 {#download}

访问 [GitHub Releases](https://github.com/hanmahong5-arch/lurus-switch/releases/latest) 下载对应平台安装包。

| 平台 | 文件 | 说明 |
|------|------|------|
| Windows | `LurusSwitch-windows-amd64.exe` | 64 位安装程序 |
| macOS (Apple Silicon) | `LurusSwitch-darwin-arm64.dmg` | M1/M2/M3 芯片 |
| macOS (Intel) | `LurusSwitch-darwin-amd64.dmg` | Intel 芯片 |
| Linux | `LurusSwitch-linux-amd64.AppImage` | AppImage 格式 |

---

## Windows 安装 {#windows}

### 安装步骤

1. 下载 `LurusSwitch-windows-amd64.exe`
2. 双击运行安装程序
3. 如果弹出「Windows 已保护你的电脑」提示，点击「更多信息」→「仍要运行」
4. 按照安装向导完成安装
5. 从开始菜单或桌面快捷方式启动「Lurus Switch」

### 防火墙配置

首次启动时 Windows 防火墙可能弹窗询问是否允许访问网络，选择「**允许**」（私有网络即可）。

### 开机自启（可选）

设置 → 通用 → 勾选「**开机时自动启动**」

---

## macOS 安装 {#macos}

### 安装步骤

1. 下载对应芯片的 `.dmg` 文件
2. 双击挂载 DMG
3. 将 **Lurus Switch** 拖入「应用程序」文件夹
4. 首次打开时，系统提示「无法验证开发者」：
   - 打开「系统设置」→「隐私与安全性」
   - 找到「已阻止使用"Lurus Switch"」点击「仍要打开」
5. 应用出现在菜单栏（顶部状态栏）

::: tip Apple Silicon 注意
M 系列芯片请下载 `darwin-arm64` 版本，Intel Mac 下载 `darwin-amd64` 版本。
:::

### 开机自启（可选）

系统设置 → 通用 → 登录项 → 点击 `+` 添加 Lurus Switch。

---

## Linux 安装 {#linux}

### AppImage 方式

```bash
# 下载
wget https://github.com/hanmahong5-arch/lurus-switch/releases/latest/download/LurusSwitch-linux-amd64.AppImage

# 添加执行权限
chmod +x LurusSwitch-linux-amd64.AppImage

# 运行
./LurusSwitch-linux-amd64.AppImage
```

### 集成到桌面

```bash
# 移动到 /opt
sudo mv LurusSwitch-linux-amd64.AppImage /opt/lurus-switch

# 创建桌面快捷方式
cat > ~/.local/share/applications/lurus-switch.desktop << EOF
[Desktop Entry]
Name=Lurus Switch
Exec=/opt/lurus-switch
Icon=lurus-switch
Type=Application
Categories=Utility;Network;
EOF
```

### 开机自启

```bash
# 创建 systemd 用户服务
mkdir -p ~/.config/systemd/user

cat > ~/.config/systemd/user/lurus-switch.service << EOF
[Unit]
Description=Lurus Switch AI Gateway

[Service]
ExecStart=/opt/lurus-switch --headless
Restart=on-failure

[Install]
WantedBy=default.target
EOF

systemctl --user enable lurus-switch
systemctl --user start lurus-switch
```

---

## 验证安装

安装并启动后，Switch 会在本地启动代理服务。验证是否正常运行：

```bash
# 检查代理端口是否监听（默认 11434）
curl http://localhost:11434/v1/models
```

如果返回 JSON 格式的模型列表，说明 Switch 已成功运行。

```json
{
  "object": "list",
  "data": [
    {"id": "deepseek-chat", "object": "model"},
    {"id": "gpt-4o", "object": "model"}
  ]
}
```

---

## 卸载

### Windows
控制面板 → 程序 → 卸载程序 → 找到「Lurus Switch」→ 卸载

### macOS
将应用程序文件夹中的「Lurus Switch」拖入废纸篓，配置文件在：
```
~/Library/Application Support/LurusSwitch/
```

### Linux
```bash
rm /opt/lurus-switch
rm ~/.local/share/applications/lurus-switch.desktop
systemctl --user disable lurus-switch
rm ~/.config/systemd/user/lurus-switch.service
# 配置文件在 ~/.config/LurusSwitch/
```
