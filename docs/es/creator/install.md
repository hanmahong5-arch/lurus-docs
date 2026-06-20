---
title: "Guía de instalación de Creator"
description: "Pasos de descarga e instalación de la fábrica de contenido de escritorio Creator."
---

<div class="creator-page">

# Guía de instalación

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Requisitos previos · Aprox. 3 minutos</p>
    <div class="lurus-callout__body">Windows 10+ / macOS 12+ / Linux (64 bits) · Lurus <Term t="API Key">API Key</Term> (<a href="/es/guide/get-api-key">cómo obtenerla</a>, para la reescritura con IA) · 4 GB+ de memoria (se recomiendan 8 GB+).</div>
  </div>
</div>

## Descarga

Visita [GitHub Releases](https://github.com/hanmahong5-arch/lurus-creator/releases/latest) para descargar el instalador correspondiente a tu plataforma.

| Plataforma | Archivo | Descripción |
|------|------|------|
| Windows | `LurusCreator-windows-amd64.exe` | Instalador de 64 bits |
| macOS (Apple Silicon) | `LurusCreator-darwin-arm64.dmg` | Chips M1/M2/M3 |
| macOS (Intel) | `LurusCreator-darwin-amd64.dmg` | Chip Intel |
| Linux | `LurusCreator-linux-amd64.AppImage` | Formato AppImage |

---

## Instalación por plataforma

Tras la descarga, elige el método de instalación según tu sistema operativo.

:::tabs
== Windows

1. Descarga `LurusCreator-windows-amd64.exe` y haz doble clic para ejecutarlo.
2. Si aparece «Windows protegió tu PC», haz clic en «Más información» → «Ejecutar de todos modos».
3. Completa el asistente de instalación e inicia desde el acceso directo del escritorio.
4. **Configuración inicial**: obtén tu Key en [api.lurus.cn](https://api.lurus.cn) y pégala en los ajustes de Creator (para la reescritura con IA).
5. Selecciona el directorio de trabajo (ubicación de almacenamiento de vídeos/textos).

== macOS

1. Descarga el `.dmg` correspondiente a tu chip y haz doble clic para montarlo.
2. Arrastra **Lurus Creator** a «Aplicaciones».
3. Si al abrirlo por primera vez aparece «No se puede verificar al desarrollador», ve a «Configuración del Sistema → Privacidad y seguridad → Abrir de todos modos».

== Linux

```bash
# 下载、赋予执行权限、运行
wget https://github.com/hanmahong5-arch/lurus-creator/releases/latest/download/LurusCreator-linux-amd64.AppImage
chmod +x LurusCreator-linux-amd64.AppImage
./LurusCreator-linux-amd64.AppImage
```
:::

---

## Dependencias integradas

Creator incluye todas las herramientas necesarias, sin instalación adicional:

| Herramienta | Uso | ¿Integrada? |
|------|------|---------|
| yt-dlp | Descarga de vídeos | Integrada |
| ffmpeg | Procesamiento de audio y vídeo | Integrada |
| Whisper | Conversión de voz a texto | Integrada (modelos tiny/base) |
| chromedp | Publicación automática | Integrada |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Modelos de Whisper</p>
    <div class="lurus-callout__body">Por defecto incluye los modelos <code>tiny</code> y <code>base</code>. Si la calidad de la transcripción no es suficiente, puedes descargar modelos más grandes en los ajustes (<code>small</code> / <code>medium</code>), con mayor precisión pero más consumo de memoria.</div>
  </div>
</div>

---

## Requisitos del sistema

| Elemento | Requisito mínimo | Recomendado |
|------|---------|------|
| Memoria | 4 GB | 8 GB+ |
| Espacio en disco | 500 MB (instalación) | 10 GB+ (con caché de vídeos) |
| Red | Conexión de banda ancha | La descarga de vídeos requiere una red estable |
| GPU | No es necesaria | Con GPU se acelera la transcripción de Whisper |

---

## Verificar la instalación

<ol class="lurus-steps">
<li>Abre la página de ajustes y confirma que el estado de la API Key muestra «Conectada».</li>
<li>Haz clic en «Comprobar dependencias» y confirma que todas las herramientas muestran una marca verde.</li>
<li>Introduce una URL de vídeo para probar la descarga.</li>
</ol>

---

## Desinstalación

| Plataforma | Acción | Ubicación de configuración/caché |
|------|------|--------------|
| **Windows** | Panel de control → Desinstalar un programa → «Lurus Creator» | `%APPDATA%\LurusCreator\` |
| **macOS** | Arrastra la aplicación «Lurus Creator» a la papelera | `~/Library/Application Support/LurusCreator/` |
| **Linux** | `rm /opt/lurus-creator` (o la ubicación del AppImage) | `rm -rf ~/.config/LurusCreator/` |

---

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Manual de uso', link: '/es/creator/usage', primary: true },
  { text: 'Casos de uso', link: '/es/creator/use-cases' },
  { text: 'Obtener API Key', link: '/es/guide/get-api-key' },
]" />

</div>
