---
title: Guía de instalación de Switch
description: Pasos de descarga e instalación de la aplicación de escritorio Lurus Switch.
---

<div class="switch-page">

# Guía de instalación de Switch

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Requisitos previos · aprox. 3 minutos</p>
    <div class="lurus-callout__body">Windows 10+ / macOS 12+ / Ubuntu 20.04+ (64 bits) · Lurus <Term t="API Key">API Key</Term> (<a href="/es/guide/get-api-key">cómo obtenerla</a>) u otra Provider Key.</div>
  </div>
</div>

## Descarga {#download}

Visita [GitHub Releases](https://github.com/hanmahong5-arch/lurus-switch/releases/latest) para descargar el instalador correspondiente a tu plataforma.

| Plataforma | Archivo | Descripción |
|------|------|------|
| Windows | `LurusSwitch-windows-amd64.exe` | Instalador de 64 bits |
| macOS (Apple Silicon) | `LurusSwitch-darwin-arm64.dmg` | Chips M1/M2/M3 |
| macOS (Intel) | `LurusSwitch-darwin-amd64.dmg` | Chip Intel |
| Linux | `LurusSwitch-linux-amd64.AppImage` | Formato AppImage |

---

## Instalación {#install}

Tras la descarga, elige el método de instalación según tu sistema operativo.

:::tabs
== Windows

1. Descarga `LurusSwitch-windows-amd64.exe` y haz doble clic para ejecutarlo.
2. Si aparece «Windows protegió tu PC», haz clic en «**Más información**» → «**Ejecutar de todas formas**».
3. Completa el asistente de instalación e inicia «Lurus Switch» desde el menú Inicio.
4. En el primer arranque, en la ventana emergente del firewall selecciona «**Permitir**» (red privada).

> **Inicio automático**: Ajustes → General → marca «Iniciar automáticamente al arrancar».

== macOS

1. Descarga el `.dmg` correspondiente a tu chip (serie M usa `darwin-arm64`, Intel usa `darwin-amd64`) y haz doble clic para montarlo.
2. Arrastra **Lurus Switch** a «Aplicaciones».
3. Cuando al abrir por primera vez aparezca «No se puede verificar el desarrollador»: Ajustes del Sistema → Privacidad y seguridad → Se bloqueó el uso de «Lurus Switch» → «**Abrir de todas formas**».
4. La aplicación aparece en la barra de menús.

> **Inicio automático**: Ajustes del Sistema → General → Ítems de inicio → `+` para agregar.

== Linux

**Método AppImage**

```bash
# 下载并赋予执行权限
wget https://github.com/hanmahong5-arch/lurus-switch/releases/latest/download/LurusSwitch-linux-amd64.AppImage
chmod +x LurusSwitch-linux-amd64.AppImage
./LurusSwitch-linux-amd64.AppImage
```

**Integración con el escritorio + inicio automático**

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

## Verificar la instalación

Tras iniciarse, Switch levanta un servicio de proxy local (puerto 19090 por defecto). Ejecuta el siguiente comando; si devuelve una lista JSON de modelos, la instalación fue exitosa:

```bash
curl http://localhost:19090/v1/models
```

```json
{ "object": "list", "data": [ { "id": "deepseek-chat" }, { "id": "gpt-4o" } ] }
```

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">¿No devuelve resultados?</p>
    <div class="lurus-callout__body">Confirma que Switch está iniciado y que el servicio de proxy está en ejecución; si el puerto está ocupado, puedes cambiar el puerto de escucha en las <a href="/es/switch/configuration#代理端口配置">instrucciones de configuración</a>.</div>
  </div>
</div>

---

## Desinstalación

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Windows</div>
    <p class="lurus-card__body">Panel de control → Programas → Desinstalar un programa → «Lurus Switch» → Desinstalar.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">macOS</div>
    <p class="lurus-card__body">Arrastra «Lurus Switch» de la carpeta Aplicaciones a la Papelera; los archivos de configuración están en <code>~/Library/Application Support/LurusSwitch/</code>.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Linux</div>
    <p class="lurus-card__body">Elimina el binario, el acceso directo del escritorio y el servicio de systemd (ver los comandos abajo).</p>
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

## Siguiente paso

<NextSteps :steps="[
  { text: 'Instrucciones de configuración', link: '/es/switch/configuration', primary: true },
  { text: 'Manual de uso', link: '/es/switch/usage' },
  { text: 'Obtener API Key', link: '/es/guide/get-api-key' },
]" title="" />

</div>

<style>
.switch-page .lurus-steps { margin: 16px 0; }
</style>
