---
title: Switch 安装指南
description: Lurus Switch 桌面应用的下载和安装步骤。
---

# Switch 安装指南

::: info 前置条件
Windows 10+ / macOS 12+ / Ubuntu 20.04+（64 位）· Lurus <Term t="API Key">API Key</Term>（[获取方式](/guide/get-api-key)）或其他 Provider Key。预计 3 分钟。
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

下载 `LurusSwitch-windows-amd64.exe` → 双击运行 →（弹「Windows 已保护你的电脑」则「更多信息」→「仍要运行」）→ 完成向导 → 开始菜单启动「Lurus Switch」。首次启动防火墙弹窗选「**允许**」（私有网络）。开机自启：设置 → 通用 → 勾「**开机时自动启动**」。

---

## macOS 安装 {#macos}

下载对应芯片 `.dmg`（M 系列用 `darwin-arm64`，Intel 用 `darwin-amd64`）→ 双击挂载 → 拖 **Lurus Switch** 到「应用程序」→ 首次打开提示「无法验证开发者」则「系统设置 → 隐私与安全性 → 已阻止使用"Lurus Switch" → 仍要打开」→ 应用出现在菜单栏。开机自启：系统设置 → 通用 → 登录项 → `+` 添加。

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

启动后 Switch 在本地起代理服务（默认端口 19090）。`curl http://localhost:19090/v1/models` 返回 JSON 模型列表（`{ "object":"list", "data":[{"id":"deepseek-chat",...},{"id":"gpt-4o",...}] }`）即成功。

---

## 卸载

- **Windows**：控制面板 → 程序 → 卸载程序 →「Lurus Switch」→ 卸载。
- **macOS**：应用程序文件夹「Lurus Switch」拖入废纸篓；配置文件在 `~/Library/Application Support/LurusSwitch/`。
- **Linux**：

```bash
rm /opt/lurus-switch
rm ~/.local/share/applications/lurus-switch.desktop
systemctl --user disable lurus-switch
rm ~/.config/systemd/user/lurus-switch.service
# 配置文件在 ~/.config/LurusSwitch/
```
