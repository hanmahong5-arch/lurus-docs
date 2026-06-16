---
title: Switch インストールガイド
description: Lurus Switch デスクトップアプリのダウンロードとインストール手順。
---

<div class="switch-page">

# Switch インストールガイド

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前提条件 · 所要時間 約3分</p>
    <div class="lurus-callout__body">Windows 10+ / macOS 12+ / Ubuntu 20.04+（64 ビット）· Lurus <Term t="API Key">API Key</Term>（<a href="/ja/guide/get-api-key">取得方法</a>）またはその他の Provider Key。</div>
  </div>
</div>

## ダウンロード {#download}

[GitHub Releases](https://github.com/hanmahong5-arch/lurus-switch/releases/latest) にアクセスして、対応プラットフォームのインストーラーをダウンロードします。

| プラットフォーム | ファイル | 説明 |
|------|------|------|
| Windows | `LurusSwitch-windows-amd64.exe` | 64 ビットインストーラー |
| macOS (Apple Silicon) | `LurusSwitch-darwin-arm64.dmg` | M1/M2/M3 チップ |
| macOS (Intel) | `LurusSwitch-darwin-amd64.dmg` | Intel チップ |
| Linux | `LurusSwitch-linux-amd64.AppImage` | AppImage 形式 |

---

## インストール {#install}

ダウンロード後、お使いの OS に応じてインストール方法を選択してください。

:::tabs
== Windows

1. `LurusSwitch-windows-amd64.exe` をダウンロードし、ダブルクリックして実行します。
2. 「Windows によって PC が保護されました」と表示された場合は、「**詳細情報**」→「**実行**」をクリックします。
3. インストールウィザードを完了し、スタートメニューから「Lurus Switch」を起動します。
4. 初回起動時のファイアウォールのポップアップでは「**許可**」（プライベートネットワーク）を選択します。

> **自動起動**：設定 → 一般 →「起動時に自動的に開始する」にチェックを入れます。

== macOS

1. お使いのチップに対応する `.dmg`（M シリーズは `darwin-arm64`、Intel は `darwin-amd64`）をダウンロードし、ダブルクリックしてマウントします。
2. **Lurus Switch** を「アプリケーション」にドラッグします。
3. 初回起動時に「開発元を検証できません」と表示された場合：システム設定 → プライバシーとセキュリティ →「Lurus Switch」の使用がブロックされました →「**このまま開く**」。
4. アプリがメニューバーに表示されます。

> **自動起動**：システム設定 → 一般 → ログイン項目 → `+` で追加します。

== Linux

**AppImage 方式**

```bash
# 下载并赋予执行权限
wget https://github.com/hanmahong5-arch/lurus-switch/releases/latest/download/LurusSwitch-linux-amd64.AppImage
chmod +x LurusSwitch-linux-amd64.AppImage
./LurusSwitch-linux-amd64.AppImage
```

**デスクトップへの統合 + 自動起動**

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

## インストールの確認

起動すると、Switch はローカルでプロキシサービスを立ち上げます（デフォルトポート 19090）。以下のコマンドを実行し、JSON のモデル一覧が返ってくれば成功です：

```bash
curl http://localhost:19090/v1/models
```

```json
{ "object": "list", "data": [ { "id": "deepseek-chat" }, { "id": "gpt-4o" } ] }
```

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">結果が返ってこない場合は？</p>
    <div class="lurus-callout__body">Switch が起動済みで、プロキシサービスが実行中であることを確認してください。ポートが使用中の場合は、<a href="/ja/switch/configuration#代理端口配置">設定説明</a>でリッスンポートを変更できます。</div>
  </div>
</div>

---

## アンインストール

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Windows</div>
    <p class="lurus-card__body">コントロールパネル → プログラム → プログラムのアンインストール →「Lurus Switch」→ アンインストール。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">macOS</div>
    <p class="lurus-card__body">アプリケーションフォルダの「Lurus Switch」をゴミ箱にドラッグします。設定ファイルは <code>~/Library/Application Support/LurusSwitch/</code> にあります。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Linux</div>
    <p class="lurus-card__body">バイナリ、デスクトップショートカット、systemd サービスを削除します（下記のコマンド参照）。</p>
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

## 次のステップ

<NextSteps :steps="[
  { text: '設定説明', link: '/ja/switch/configuration', primary: true },
  { text: '使用マニュアル', link: '/ja/switch/usage' },
  { text: 'API Key を取得する', link: '/ja/guide/get-api-key' },
]" title="" />

</div>

<style>
.switch-page .lurus-steps { margin: 16px 0; }
</style>
