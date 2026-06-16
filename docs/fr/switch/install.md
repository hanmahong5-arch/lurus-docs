---
title: Guide d’installation de Switch
description: Étapes de téléchargement et d’installation de l’application de bureau Lurus Switch.
---

<div class="switch-page">

# Guide d’installation de Switch

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prérequis · environ 3 minutes</p>
    <div class="lurus-callout__body">Windows 10+ / macOS 12+ / Ubuntu 20.04+ (64 bits) · Lurus <Term t="API Key">API Key</Term> (<a href="/fr/guide/get-api-key">comment l’obtenir</a>) ou une autre clé de fournisseur.</div>
  </div>
</div>

## Téléchargement {#download}

Rendez-vous sur [GitHub Releases](https://github.com/hanmahong5-arch/lurus-switch/releases/latest) pour télécharger le paquet d’installation correspondant à votre plateforme.

| Plateforme | Fichier | Description |
|------|------|------|
| Windows | `LurusSwitch-windows-amd64.exe` | Programme d’installation 64 bits |
| macOS (Apple Silicon) | `LurusSwitch-darwin-arm64.dmg` | Puces M1/M2/M3 |
| macOS (Intel) | `LurusSwitch-darwin-amd64.dmg` | Puces Intel |
| Linux | `LurusSwitch-linux-amd64.AppImage` | Format AppImage |

---

## Installation {#install}

Après le téléchargement, choisissez la méthode d’installation selon votre système d’exploitation.

:::tabs
== Windows

1. Téléchargez `LurusSwitch-windows-amd64.exe` puis double-cliquez pour l’exécuter.
2. Si la fenêtre « Windows a protégé votre ordinateur » apparaît, cliquez sur « **Informations complémentaires** » → « **Exécuter quand même** ».
3. Suivez l’assistant d’installation, puis lancez « Lurus Switch » depuis le menu Démarrer.
4. Lors de la fenêtre du pare-feu au premier démarrage, choisissez « **Autoriser** » (réseau privé).

> **Démarrage automatique** : Paramètres → Général → cochez « Lancer automatiquement au démarrage ».

== macOS

1. Téléchargez le `.dmg` correspondant à votre puce (puces série M : `darwin-arm64`, Intel : `darwin-amd64`) puis double-cliquez pour le monter.
2. Glissez **Lurus Switch** dans « Applications ».
3. Si, au premier lancement, le message « Impossible de vérifier le développeur » s’affiche : Réglages Système → Confidentialité et sécurité → l’utilisation de « Lurus Switch » a été bloquée → « **Ouvrir quand même** ».
4. L’application apparaît dans la barre de menus.

> **Démarrage automatique** : Réglages Système → Général → Ouverture → `+` pour ajouter.

== Linux

**Méthode AppImage**

```bash
# 下载并赋予执行权限
wget https://github.com/hanmahong5-arch/lurus-switch/releases/latest/download/LurusSwitch-linux-amd64.AppImage
chmod +x LurusSwitch-linux-amd64.AppImage
./LurusSwitch-linux-amd64.AppImage
```

**Intégration au bureau + démarrage automatique**

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

## Vérifier l’installation

Une fois démarré, Switch lance un service de proxy local (port 19090 par défaut). Exécutez la commande suivante ; si elle renvoie une liste de modèles au format JSON, l’installation est réussie :

```bash
curl http://localhost:19090/v1/models
```

```json
{ "object": "list", "data": [ { "id": "deepseek-chat" }, { "id": "gpt-4o" } ] }
```

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Aucun résultat renvoyé ?</p>
    <div class="lurus-callout__body">Vérifiez que Switch est bien démarré et que le service de proxy est en cours d’exécution ; si le port est occupé, vous pouvez changer le port d’écoute dans la <a href="/fr/switch/configuration#代理端口配置">documentation de configuration</a>.</div>
  </div>
</div>

---

## Désinstallation

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Windows</div>
    <p class="lurus-card__body">Panneau de configuration → Programmes → Désinstaller un programme → « Lurus Switch » → Désinstaller.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">macOS</div>
    <p class="lurus-card__body">Glissez « Lurus Switch » du dossier Applications vers la corbeille ; les fichiers de configuration se trouvent dans <code>~/Library/Application Support/LurusSwitch/</code>.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Linux</div>
    <p class="lurus-card__body">Supprimez le binaire, le raccourci du bureau et le service systemd (voir les commandes ci-dessous).</p>
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

## Étape suivante

<NextSteps :steps="[
  { text: 'Documentation de configuration', link: '/fr/switch/configuration', primary: true },
  { text: 'Manuel d\'utilisation', link: '/fr/switch/usage' },
  { text: 'Obtenir une API Key', link: '/fr/guide/get-api-key' },
]" title="" />

</div>

<style>
.switch-page .lurus-steps { margin: 16px 0; }
</style>
