---
title: "Manual de uso de Creator"
description: "Guía de uso y descripción de funciones de la fábrica de contenido de escritorio Creator."
---

<div class="creator-page">

# Manual de uso

## Prueba rápida

<ol class="lurus-steps">
<li>En la interfaz principal, haz clic en «<strong>Nueva tarea</strong>».</li>
<li>Pega la URL del vídeo (YouTube / Bilibili, etc.).</li>
<li>Elige la operación objetivo: solo descargar / descargar+transcribir / descargar+transcribir+reescribir / canalización completa (incluida la publicación).</li>
<li>Haz clic en «<strong>Iniciar</strong>»; Creator ejecuta cada etapa en orden y puedes ver el progreso en tiempo real en el panel de tareas.</li>
</ol>

---

## Detalle de la canalización de contenido

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="video" :size="14" /> Etapa 1</span>
  <h2 class="lurus-section-head__title">Descarga de vídeo</h2>
  <p class="lurus-section-head__lede">Compatible con más de 1000 plataformas de vídeo (lista completa en los sitios admitidos por yt-dlp).</p>
</div>

Consulta la lista completa en [los sitios admitidos por yt-dlp](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md).

**Fuentes habituales**:

| Plataforma | Formato de URL |
|------|---------|
| YouTube | `https://www.youtube.com/watch?v=xxx` |
| Bilibili | `https://www.bilibili.com/video/BVxxx` |
| Douyin | `https://www.douyin.com/video/xxx` |
| Twitter/X | `https://x.com/user/status/xxx` |

**Opciones de descarga**:

| Opción | Descripción | Valor predeterminado |
|------|------|--------|
| Calidad de vídeo | Máxima / 1080p / 720p / solo audio | Máxima |
| Subtítulos | Descargar automáticamente los subtítulos disponibles | Activado |
| Proxy | Proxy HTTP/SOCKS5 (para acceder a plataformas extranjeras) | Ninguno |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> Etapa 2</span>
  <h2 class="lurus-section-head__title">Transcripción de audio</h2>
  <p class="lurus-section-head__lede">Usa el modelo OpenAI Whisper para convertir el audio en texto.</p>
</div>

| Modelo | Tamaño | Velocidad | Precisión | Caso de uso |
|------|------|------|--------|---------|
| `tiny` | 75 MB | Muy rápida | Regular | Vista previa rápida |
| `base` | 142 MB | Rápida | Buena | Uso diario (predeterminado) |
| `small` | 466 MB | Media | Excelente | Cuando se requiere mayor precisión |
| `medium` | 1.5 GB | Lenta | Óptima | Contenido profesional, multilingüe |

**Idiomas admitidos**: detecta el idioma automáticamente, o puedes especificarlo manualmente (admite 99 idiomas, incluidos chino, inglés, japonés, etc.).

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Etapa 3</span>
  <h2 class="lurus-section-head__title">Reescritura con IA</h2>
  <p class="lurus-section-head__lede">Procesa el texto transcrito invocando modelos de IA a través de la Lurus API.</p>
</div>

Procesa el texto transcrito invocando modelos de IA a través de la [Lurus API](/es/guide/introduction).

**Modos de reescritura**:

| Modo | Descripción | Ideal para |
|------|------|------|
| **Traducción** | Traduce contenido en otro idioma al chino | Localización de vídeos extranjeros |
| **Pulido** | Corrige la gramática y optimiza la redacción | Mejorar la calidad del texto |
| **Resumen** | Extrae las ideas principales y reduce la extensión | Vídeo largo → texto breve |
| **Ampliación** | Añade detalles y contexto | Contenido breve → artículo extenso |
| **Cambio de estilo** | Ajusta el tono (formal↔informal) | Adaptar a distintas plataformas |
| **Optimización SEO** | Genera títulos, etiquetas y resúmenes | Mejorar el posicionamiento en buscadores |

**Selección de modelo**:

| Modelo recomendado | Ideal para | Coste |
|---------|------|------|
| `deepseek-chat` | Reescritura y traducción al chino | Bajo |
| `gpt-4o` | Contenido en inglés, reescritura compleja | Alto |
| `claude-3-5-sonnet` | Escritura creativa, textos largos | Medio |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="share-2" :size="14" /> Etapa 4</span>
  <h2 class="lurus-section-head__title">Publicación automática</h2>
  <p class="lurus-section-head__lede">Publicación automática mediante el navegador sin interfaz chromedp.</p>
</div>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Solo 3 plataformas admiten la publicación automática</p>
    <div class="lurus-callout__body">Actualmente solo se admite la publicación automática en <strong>WeChat Official Accounts / Douyin / Xiaohongshu</strong>. En otras plataformas (YouTube Shorts / TikTok / Instagram Reels, etc.) se puede generar el texto, pero la publicación debe hacerse manualmente.</div>
  </div>
</div>

**Configuración inicial**:

<ol class="lurus-steps">
<li>Ajustes → «<strong>Plataformas de publicación</strong>» → selecciona la plataforma objetivo.</li>
<li>Haz clic en «<strong>Iniciar sesión</strong>» para abrir la ventana del navegador.</li>
<li>Inicia sesión manualmente mediante código QR o contraseña; Creator guarda el estado de la sesión.</li>
</ol>

**Ajustes de publicación** (configurados de forma independiente por plataforma):

| Ajuste | Descripción |
|--------|------|
| Plantilla de título | Admite variables: `{{title}}`, `{{date}}`, `{{source}}` |
| Etiquetas | Generación automática o definición manual |
| Portada | Captura automática del vídeo o subida manual |
| Hora de publicación | Publicación inmediata o programada |

---

## Procesamiento por lotes

<ol class="lurus-steps">
<li>Crea un archivo de texto con una URL de vídeo por línea.</li>
<li>En Creator, haz clic en «<strong>Importación por lotes</strong>» y selecciona el archivo.</li>
<li>Elige una configuración de procesamiento unificada.</li>
<li>Haz clic en «<strong>Iniciar todo</strong>».</li>
</ol>

### Estado de las tareas

Cada tarea se rastrea de forma independiente:

| Estado | Descripción |
|------|------|
| `queued` | Esperando procesamiento |
| `downloading` | Descargando el vídeo |
| `transcribing` | Transcribiendo el audio |
| `rewriting` | La IA está reescribiendo |
| `publishing` | Publicando automáticamente |
| `completed` | Todo completado |
| `failed` | Fallo en alguna etapa (se puede reintentar) |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Reanudación tras interrupción</p>
    <div class="lurus-callout__body">Las tareas fallidas pueden reanudarse desde la etapa que falló, sin necesidad de procesar todo desde el principio.</div>
  </div>
</div>

---

## Control de presupuesto

Para evitar un consumo excesivo de Token en la etapa de reescritura con IA:

| Ajuste | Descripción | Valor predeterminado |
|------|------|--------|
| Límite de Token por tarea | Número máximo de Token que usa cada tarea | 10,000 |
| Límite diario total | Número máximo de Token consumidos al día | 100,000 |
| Comportamiento al superar el límite | Pausar / omitir la reescritura / avisar | Pausar |

Configúralo en Ajustes → «**Presupuesto de Token**».

---

## Atajos de teclado

| Atajo | Función |
|--------|------|
| <span class="lurus-kbd">Ctrl+N</span> / <span class="lurus-kbd">Cmd+N</span> | Nueva tarea |
| <span class="lurus-kbd">Ctrl+V</span> / <span class="lurus-kbd">Cmd+V</span> | Pegar URL y crear tarea |
| <span class="lurus-kbd">Ctrl+Shift+S</span> / <span class="lurus-kbd">Cmd+Shift+S</span> | Abrir ajustes |
| <span class="lurus-kbd">Space</span> | Pausar/reanudar la tarea actual |
| <span class="lurus-kbd">Delete</span> | Eliminar la tarea seleccionada |

---

## Resolución de problemas

<details class="lurus-faq-item">
<summary>¿Falla la descarga del vídeo?</summary>

Comprueba la red (los vídeos extranjeros pueden requerir proxy); algunas plataformas tienen medidas anti-scraping, actualiza Creator a la última versión; verifica el formato de la URL.

</details>

<details class="lurus-faq-item">
<summary>¿La transcripción no es precisa?</summary>

Usa un modelo Whisper más grande (Ajustes → modelo Whisper); especifica manualmente el idioma del audio; el ruido de fondo intenso reduce la precisión.

</details>

<details class="lurus-faq-item">
<summary>¿Tiempo de espera agotado en la reescritura con IA?</summary>

Comprueba el saldo de la API Key; divide los textos demasiado largos en fragmentos; cambia a un modelo más rápido (como `deepseek-chat`).

</details>

<details class="lurus-faq-item">
<summary>¿Falla la publicación?</summary>

La sesión de la plataforma puede haber caducado, vuelve a escanear el código QR; comprueba si el contenido infringe las reglas de la plataforma (título/imágenes/palabras sensibles); los cambios en la API de la plataforma requieren esperar a que Creator actualice la compatibilidad.

</details>

---

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Casos de uso', link: '/es/creator/use-cases', primary: true },
  { text: 'Volver a la introducción', link: '/es/creator/' },
  { text: 'Guía de instalación', link: '/es/creator/install' },
]" />

</div>
