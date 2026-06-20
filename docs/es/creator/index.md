---
title: "Creator — Fábrica de contenidos de escritorio impulsada por IA"
description: "Herramienta de producción de contenidos de escritorio basada en Wails, con creación asistida por IA y salida multiformato."
---

<div class="creator-page">

<ProductHero product-id="creator" />

## ¿Qué es Creator?

**Lurus Creator** es una herramienta de creación de contenidos con IA para escritorio que integra la descarga de vídeo, la transcripción de audio, la reescritura con IA y la publicación multiplataforma en una única canalización automatizada. Un único ejecutable sin dependencias, listo para usar al abrirlo.

Pega un enlace de vídeo y la IA genera automáticamente 6 conjuntos de textos personalizados para cada plataforma: WeChat Official Account (artículos en profundidad), Douyin (guiones para narración), Xiaohongshu (notas de recomendación), YouTube Shorts, TikTok e Instagram Reels. De ellas, 3 plataformas —WeChat Official Account, Douyin y Xiaohongshu— admiten la publicación con un solo clic mediante automatización del navegador con chromedp; las demás requieren publicación manual. Las fuentes de vídeo admiten YouTube, Bilibili y más de 1000 sitios (impulsado por yt-dlp).

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">1000+</span><span class="lurus-stat__label">sitios fuente de vídeo</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6</span><span class="lurus-stat__label">textos personalizados por plataforma</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">plataformas con publicación de un clic</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">99</span><span class="lurus-stat__label">idiomas de transcripción</span></div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Capacidades clave</span>
  <h2 class="lurus-section-head__title">De un enlace a la publicación multiplataforma</h2>
  <p class="lurus-section-head__lede">Descarga, transcripción, reescritura y publicación encadenadas en una sola canalización, automatizada de principio a fin.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-creator)"
  :items="[
    { title: 'Canalización de contenidos de un clic', body: 'Fuente de vídeo → descarga con yt-dlp → transcodificación con ffmpeg → transcripción con Whisper → reescritura con LLM → publicación con chromedp, todo automatizado', icon: 'workflow' },
    { title: 'Reescritura inteligente', body: 'Traducción (conservando la terminología), reescritura (tono y extensión), extracción de ideas clave, optimización SEO de títulos, etiquetas y resúmenes', icon: 'sparkles' },
    { title: 'Generación de contenido multiplataforma', body: 'Genera de una sola vez plantillas para 6 plataformas: Official Account / Douyin / Xiaohongshu / YouTube Shorts / TikTok / Reels', icon: 'share-2' },
    { title: 'DevFactory por lotes', body: 'Seguimiento tarea a tarea con máquina de estados SQLite, cola por lotes, control de presupuesto de Token y reanudación tras interrupción', icon: 'package' },
  ]"
/>

### Canalización de contenidos de un clic

<ArchitectureDiagram
  title="Canalización de contenidos: fuente de vídeo → publicación"
  chart="graph LR
    SRC[视频来源<br/>YouTube / Bilibili / 本地] --> DL[yt-dlp 下载]
    DL --> TC[ffmpeg 转码]
    TC --> TR[Whisper 转写]
    TR --> RW[LLM 改写 / 翻译]
    RW --> PUB[chromedp 发布<br/>公众号 / 抖音 / 小红书]"
/>

| Etapa | Herramienta | Descripción |
|------|------|------|
| **Descarga** | yt-dlp | YouTube, Bilibili y más de 1000 plataformas de vídeo |
| **Transcodificación** | ffmpeg | Conversión de formato, recorte, eliminación de marcas de agua |
| **Transcripción** | Whisper | Voz a texto, 99 idiomas |
| **Reescritura** | LLM (Lurus API) | Pulido, traducción y ajuste de formato con IA |
| **Publicación** | chromedp | Inicio de sesión, carga y publicación automáticos en navegador sin interfaz |

### Generación de contenido multiplataforma + publicación de un clic en algunas plataformas

La generación de contenido cubre plantillas para 6 plataformas: WeChat Official Account, Douyin, Xiaohongshu, YouTube Shorts, TikTok e Instagram Reels. Actualmente, la publicación automática mediante la tecnología de navegador sin interfaz chromedp solo está disponible en 3 plataformas:

| Plataforma | Tipos de contenido admitidos | Publicación automática |
|------|--------------|---------|
| **WeChat Official Account** | Artículos con texto e imagen | ✅ |
| **Douyin** | Vídeo corto + texto | ✅ |
| **Xiaohongshu** | Notas con texto e imagen | ✅ |
| YouTube Shorts | Guion de vídeo corto | ❌ Requiere publicación manual |
| TikTok | Guion de vídeo corto | ❌ Requiere publicación manual |
| Instagram Reels | Guion de vídeo corto | ❌ Requiere publicación manual |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Primer inicio de sesión</p>
    <div class="lurus-callout__body">La primera vez que uses la función de cada plataforma de publicación, deberás iniciar sesión manualmente escaneando un código QR una vez. Después, Creator guardará el estado de la sesión.</div>
  </div>
</div>

---

## Arquitectura técnica

`Creator Desktop (Wails v2 = Go + TypeScript)`: frontend en TypeScript (panel de tareas / editor / ajustes) + backend en Go (orquestación de yt-dlp / ffmpeg / Whisper / chromedp + máquina de estados SQLite) → [Lurus API](/es/guide/introduction) (LLM, DeepSeek/GPT, etc.). Se compila en un único ejecutable.

<ArchitectureDiagram
  title="Arquitectura técnica de Creator Desktop"
  chart="graph TD
    UI[前端 TypeScript<br/>任务面板 / 编辑器 / 设置] --> GO[Go 后端<br/>调度 + SQLite 状态机]
    GO --> TOOLS[yt-dlp / ffmpeg / Whisper / chromedp]
    GO --> API[Lurus API<br/>LLM · DeepSeek / GPT 等]"
/>

---

## Casos de uso

<UserScenarios
  title="Quién usa Creator"
  :scenarios="[
    { role: 'Medios', title: 'Gestión de medios propios', summary: 'Localiza contenido extranjero de calidad y produce versiones en chino por lotes', link: '/es/creator/use-cases' },
    { role: 'Conocimiento', title: 'Difusión de conocimiento', summary: 'Extrae transcripciones de vídeos de charlas técnicas y publícalas como tutoriales con texto e imagen', link: '/es/creator/use-cases' },
    { role: 'Matriz', title: 'Matriz de contenidos', summary: 'Adapta automáticamente un mismo contenido al formato y estilo de varias plataformas', link: '/es/creator/use-cases' },
    { role: 'Equipo', title: 'Colaboración en equipo', summary: 'Procesa listas de vídeos por lotes con el progreso de las tareas a la vista', link: '/es/creator/usage' },
  ]"
/>

---

## Plataformas admitidas

| Sistema operativo | Requisitos de versión |
|---------|---------|
| Windows | Windows 10 64-bit y superior |
| macOS | macOS 12 (Monterey) y superior |
| Linux | Ubuntu 20.04+ / Debian 11+ |

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">Listo para usar al descargar, arranque sin configuración</p>
    <p class="lurus-cta__text">Un único ejecutable empaqueta yt-dlp / ffmpeg / Whisper / chromedp; ejecuta tu primera tarea en 3 minutos.</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="/es/creator/install">Guía de instalación →</a>
  </div>
</div>

<!-- lurus:related-block -->

---

## Productos relacionados y próximos pasos

<RelatedProducts product-id="creator" />

</div>
