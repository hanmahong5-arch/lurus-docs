---
title: Switch 安装指南
description: Lurus Switch 桌面应用的下载和安装步骤。
---

<div class="switch-page">

# Switch 安装指南

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前置条件 · 预计 3 分钟</p>
    <div class="lurus-callout__body">Windows 10+ / macOS 12+ / Ubuntu 20.04+（64 位）· Lurus <Term t="API Key">API Key</Term>（<a href="/guide/get-api-key">获取方式</a>）或其他 Provider Key。</div>
  </div>
</div>

## 下载 {#download}

访问 [GitHub Releases](https://github.com/hanmahong5-arch/lurus-switch/releases/latest) 下载对应平台安装包。

| 平台 | 文件 | 说明 |
|------|------|------|
| Windows | `LurusSwitch-windows-amd64.exe` | 64 位安装程序 |
| macOS (Apple Silicon) | `LurusSwitch-darwin-arm64.dmg` | M1/M2/M3 芯片 |
| macOS (Intel) | `LurusSwitch-darwin-amd64.dmg` | Intel 芯片 |
| Linux | `LurusSwitch-linux-amd64.AppImage` | AppImage 格式 |

---

## 安装 {#install}

下载后按你的操作系统选择安装方式。

:::tabs
== Windows

1. 下载 `LurusSwitch-windows-amd64.exe` 并双击运行。
2. 若弹出「Windows 已保护你的电脑」，点「**更多信息**」→「**仍要运行**」。
3. 完成安装向导，在开始菜单启动「Lurus Switch」。
4. 首次启动防火墙弹窗选「**允许**」（私有网络）。

> **开机自启**：设置 → 通用 → 勾选「开机时自动启动」。

== macOS

1. 下载对应芯片 `.dmg`（M 系列用 `darwin-arm64`，Intel 用 `darwin-amd64`）并双击挂载。
2. 拖 **Lurus Switch** 到「应用程序」。
3. 首次打开提示「无法验证开发者」时：系统设置 → 隐私与安全性 → 已阻止使用「Lurus Switch」→「**仍要打开**」。
4. 应用出现在菜单栏。

> **开机自启**：系统设置 → 通用 → 登录项 → `+` 添加。

== Linux

**AppImage 方式**

```bash
# 下载并赋予执行权限
wget https://github.com/hanmahong5-arch/lurus-switch/releases/latest/download/LurusSwitch-linux-amd64.AppImage
chmod +x LurusSwitch-linux-amd64.AppImage
./LurusSwitch-linux-amd64.AppImage
```

**集成到桌面 + 开机自启**

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

## 验证安装

启动后 Switch 在本地起代理服务（默认端口 19090）。运行以下命令，返回 JSON 模型列表即成功：

```bash
curl http://localhost:19090/v1/models
```

```json
{ "object": "list", "data": [ { "id": "deepseek-chat" }, { "id": "gpt-4o" } ] }
```

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">没返回结果？</p>
    <div class="lurus-callout__body">确认 Switch 已启动且代理服务在运行；若端口被占用，可在<a href="/switch/configuration#代理端口配置">配置说明</a>中改监听端口。</div>
  </div>
</div>

---

## 卸载

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Windows</div>
    <p class="lurus-card__body">控制面板 → 程序 → 卸载程序 →「Lurus Switch」→ 卸载。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">macOS</div>
    <p class="lurus-card__body">应用程序文件夹「Lurus Switch」拖入废纸篓；配置文件在 <code>~/Library/Application Support/LurusSwitch/</code>。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Linux</div>
    <p class="lurus-card__body">删除二进制、桌面快捷方式与 systemd 服务（见下方命令）。</p>
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

## 下一步

<NextSteps :steps="[
  { text: '配置说明', link: '/switch/configuration', primary: true },
  { text: '使用手册', link: '/switch/usage' },
  { text: '获取 API Key', link: '/guide/get-api-key' },
]" title="" />

</div>

<style>
.switch-page .lurus-steps { margin: 16px 0; }
</style>
