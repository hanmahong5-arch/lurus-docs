---
title: Switch Installation Guide
description: Download and installation steps for the Lurus Switch desktop app.
---

<div class="switch-page">

# Switch Installation Guide

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prerequisites · ~3 minutes</p>
    <div class="lurus-callout__body">Windows 10+ / macOS 12+ / Ubuntu 20.04+ (64-bit) · A Lurus <Term t="API Key">API Key</Term> (<a href="/en/guide/get-api-key">how to get one</a>) or another Provider Key.</div>
  </div>
</div>

## Download {#download}

Visit [GitHub Releases](https://github.com/hanmahong5-arch/lurus-switch/releases/latest) to download the installer for your platform.

| Platform | File | Notes |
|------|------|------|
| Windows | `LurusSwitch-windows-amd64.exe` | 64-bit installer |
| macOS (Apple Silicon) | `LurusSwitch-darwin-arm64.dmg` | M1/M2/M3 chips |
| macOS (Intel) | `LurusSwitch-darwin-amd64.dmg` | Intel chips |
| Linux | `LurusSwitch-linux-amd64.AppImage` | AppImage format |

---

## Install {#install}

After downloading, choose the installation method for your operating system.

:::tabs
== Windows

1. Download `LurusSwitch-windows-amd64.exe` and double-click to run it.
2. If "Windows protected your PC" appears, click "**More info**" → "**Run anyway**".
3. Complete the setup wizard and launch "Lurus Switch" from the Start menu.
4. On the first launch, select "**Allow**" (private networks) in the firewall prompt.

> **Start on boot**: Settings → General → check "Start automatically on boot".

== macOS

1. Download the `.dmg` for your chip (M-series uses `darwin-arm64`, Intel uses `darwin-amd64`) and double-click to mount it.
2. Drag **Lurus Switch** into "Applications".
3. If the first launch shows "cannot verify developer": System Settings → Privacy & Security → "Lurus Switch" was blocked → "**Open Anyway**".
4. The app appears in the menu bar.

> **Start on boot**: System Settings → General → Login Items → `+` to add.

== Linux

**AppImage method**

```bash
# 下载并赋予执行权限
wget https://github.com/hanmahong5-arch/lurus-switch/releases/latest/download/LurusSwitch-linux-amd64.AppImage
chmod +x LurusSwitch-linux-amd64.AppImage
./LurusSwitch-linux-amd64.AppImage
```

**Integrate into the desktop + start on boot**

```bash
# 移动到 /opt 并创建桌面快捷方式
sudo mv LurusSwitch-linux-amd64.AppImage /opt/lurus-switch
cat > ~/.local/share/applications/lurus-switch.desktop << EOF
[Desktop Entry]
Name=Lurus Switch
Exec=/opt/lurus-switch
Icon=lurus-switch
Type=Application
Categories=Utility;Network;
EOF

# systemd 用户服务（开机自启）
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
systemctl --user enable --now lurus-switch
```
:::

---

## Verify the Installation

After launching, Switch starts a local proxy service (default port 19090). Run the following command; if it returns a JSON model list, it succeeded:

```bash
curl http://localhost:19090/v1/models
```

```json
{ "object": "list", "data": [ { "id": "deepseek-chat" }, { "id": "gpt-4o" } ] }
```

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">No result returned?</p>
    <div class="lurus-callout__body">Make sure Switch has started and the proxy service is running; if the port is already in use, you can change the listening port in the <a href="/en/switch/configuration#代理端口配置">configuration guide</a>.</div>
  </div>
</div>

---

## Uninstall

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Windows</div>
    <p class="lurus-card__body">Control Panel → Programs → Uninstall a program → "Lurus Switch" → Uninstall.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">macOS</div>
    <p class="lurus-card__body">Drag "Lurus Switch" from the Applications folder to the Trash; configuration files are in <code>~/Library/Application Support/LurusSwitch/</code>.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Linux</div>
    <p class="lurus-card__body">Remove the binary, the desktop shortcut, and the systemd service (see the commands below).</p>
  </div>
</div>

```bash
rm /opt/lurus-switch
rm ~/.local/share/applications/lurus-switch.desktop
systemctl --user disable lurus-switch
rm ~/.config/systemd/user/lurus-switch.service
# 配置文件在 ~/.config/LurusSwitch/
```

---

## Next Steps

<NextSteps :steps="[
  { text: 'Configuration Guide', link: '/en/switch/configuration', primary: true },
  { text: 'User Manual', link: '/en/switch/usage' },
  { text: 'Get an API Key', link: '/en/guide/get-api-key' },
]" title="" />

</div>

<style>
.switch-page .lurus-steps { margin: 16px 0; }
</style>
