---
title: "Casos de uso de Creator"
description: "Flujo completo de tres escenarios típicos: comentario de vídeo en B站 / artículo extenso para cuenta oficial / nota de Xiaohongshu."
---

<div class="creator-page">

# Casos de uso de Creator <StatusBadge status="dev" />

Tres casos de flujo reales, que abarcan desde vídeo y artículos extensos hasta contenido social breve.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="video" :size="14" /> Caso uno</span>
  <h2 class="lurus-section-head__title">Comentario de vídeo en B站</h2>
  <p class="lurus-section-head__lede">Un enlace de vídeo de B站 → guion de locución + texto de portada.</p>
</div>

| Etapa | Herramienta | Resultado |
|------|------|------|
| Entrada | Pegar enlace del vídeo | URL del vídeo original |
| Descarga | yt-dlp | Archivo mp4 |
| Transcripción | Whisper large-v3 | Subtítulos en chino con marcas de tiempo |
| Refinamiento | LLM (DeepSeek-Chat) | Resumen por secciones + puntos destacados |
| Reescritura | LLM (Claude Sonnet) | 3 versiones de guion de locución (serio / desenfadado / intriga) |
| Portada | LLM | 3 títulos candidatos para la portada |
| Salida | Editor de Creator | Listo para pegar directamente en el panel de B站 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="gauge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Tiempo típico</p>
    <div class="lurus-callout__body">Vídeo de 10 minutos → flujo completo en 90 segundos.</div>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-open" :size="14" /> Caso dos</span>
  <h2 class="lurus-section-head__title">Artículo extenso para cuenta oficial</h2>
  <p class="lurus-section-head__lede">Un tema → artículo de fondo de 2000 palabras para cuenta oficial.</p>
</div>

<ArchitectureDiagram
  title="Tema → artículo extenso para cuenta oficial"
  chart='graph TD
    TOPIC["Entrada del tema: análisis de la aplicación de WAL en la persistencia de Agentes de IA"] --> SEARCH[Búsqueda de material<br/>Lurus API + web_search Tool]
    SEARCH --> OUTLINE[Generación del esquema<br/>el LLM enumera 5 H2]
    OUTLINE --> WRITE[Redacción por secciones<br/>generación por bloques según el esquema]
    WRITE --> FIG[Sugerencia de imágenes<br/>el LLM propone la ubicación de 3 esquemas]
    FIG --> MD[Salida en Markdown al editor de Creator]'
/>

**Puntos de adaptación**:

- La cuenta oficial no admite H4; se degrada automáticamente
- Genera automáticamente enlaces internos de "lectura recomendada" (basados en coincidencia de palabras clave)
- Admite el cambio entre tres estilos: "coloquial / académico / comercial"

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="share-2" :size="14" /> Caso tres</span>
  <h2 class="lurus-section-head__title">Nota de Xiaohongshu</h2>
  <p class="lurus-section-head__lede">Una imagen + una crítica → nota de recomendación completa.</p>
</div>

**Entrada**: imagen del producto + "la autonomía es realmente increíble"

**Salida**:

```
┌─────────────────────────────┐
│ 🌙 终于找到通勤救星！       │
│                              │
│ 用了一周真的爱上了...（100 字）│
│                              │
│ ✅ 续航 28 小时              │
│ ✅ 重量只有 180 克           │
│ ✅ 降噪 -35dB                │
│                              │
│ #数码好物 #通勤 #降噪耳机   │
└─────────────────────────────┘
```

Genera automáticamente entre 6 y 10 etiquetas de tema, evitando palabras prohibidas.

---

## Comparativa del flujo común

| Escenario | Comentario de vídeo | Artículo extenso | Xiaohongshu |
|------|---------|-----------|--------|
| Forma de entrada | URL | Palabra del tema | Imagen + frase breve |
| Modelo principal | Whisper + LLM | LLM | LLM |
| Longitud del resultado | Guion de 300-500 palabras | 2000 palabras | 80-150 palabras |
| Soporte de publicación | Exportar por copia | Publicación automática con chromedp | Publicación automática con chromedp |
| Tiempo típico | 90 segundos | 2 minutos | 30 segundos |

## Próximos pasos

<NextSteps :steps="[
  { text: 'Volver a la introducción', link: '/es/creator/', primary: true },
  { text: 'Guía de instalación', link: '/es/creator/install' },
  { text: 'Manual de uso', link: '/es/creator/usage' },
]" />

</div>
