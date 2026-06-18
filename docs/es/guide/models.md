---
title: Modelos compatibles
description: Lista de todos los modelos de IA compatibles con la API de Lurus, incluyendo precios, ventana de contexto y comparativa de capacidades.
---

<script setup>
import { data } from '../../.vitepress/data/models.data'
</script>

<div class="models-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Catálogo de modelos</span>
  <h1 class="lurus-section-head__title">Modelos compatibles</h1>
  <p class="lurus-section-head__lede">Distintos modelos de los principales proveedores de IA, integrados de forma unificada por nombre de <code>model</code>; esta página se renderiza automáticamente desde <code>data/models.yaml</code>, por lo que la lista siempre está sincronizada con el archivo de datos.</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="filter" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Cómo añadir un modelo</p>
    <div class="lurus-callout__body">Para añadir un nuevo modelo basta con editar <code>lurus-docs/data/models.yaml</code>; tras hacer push, CI compila y actualiza automáticamente.</div>
  </div>
</div>

## Lista de modelos

<ModelTable
  v-for="v in data.vendors"
  :key="v.name"
  :vendor="v.name"
  :tagline="v.tagline"
  :models="v.models"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> Guía de elección</span>
  <h2 class="lurus-section-head__title">Cómo elegir un modelo</h2>
  <p class="lurus-section-head__lede">Localízalo rápidamente según el tipo de tarea y el presupuesto.</p>
</div>

### Por tarea

| Escenario | Modelo recomendado |
|------|---------|
| Conversación diaria | `deepseek-chat` (mejor relación calidad-precio) |
| Generación de código | `deepseek-reasoner` / `gpt-4o` |
| Razonamiento matemático | `deepseek-reasoner` / `claude-3-opus` |
| Análisis de documentos largos | `gemini-3-pro-preview` (contexto de 1M) |
| Escritura creativa | `claude-3-5-sonnet` |
| Tareas en inglés | `gpt-4o` / `claude-3-5-sonnet` |
| Tareas en chino | `deepseek-chat` |
| Comprensión de imágenes | `gemini-3-pro-image-preview` / `gpt-4o` |
| Generación de imágenes | `dall-e-3` / `midjourney` |

### Por presupuesto

| Rango de presupuesto | Modelo recomendado |
|---------|---------|
| Bajo (&lt; ¥5/M tokens) | `deepseek-chat`, `gpt-3.5-turbo`, `gemini-3-flash-preview` |
| Medio (¥5–20/M tokens) | `claude-3-sonnet`, `gemini-3-pro-preview`, `gpt-4o-mini` |
| Alto (&gt; ¥20/M tokens) | `gpt-4o`, `claude-3-opus` |

## Cambiar de modelo

Todos los modelos comparten el mismo formato de API; solo hay que cambiar el campo `model` (el resto del código no varía): `client.chat.completions.create(model="deepseek-chat", ...)` → `model="gemini-3-pro-preview"`.

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Consideraciones</p>
    <div class="lurus-callout__body"><ul><li><strong>Disponibilidad del modelo</strong>: el estado <code>Beta</code> indica una versión preliminar cuya interfaz puede cambiar.</li><li><strong>Límites de cuota</strong>: distintas API Keys pueden tener distintos permisos de acceso a los modelos.</li><li><strong>Cambios de precio</strong>: los precios se ajustan según el proveedor; rige lo que muestre la consola.</li><li><strong>Límite de contexto</strong>: las solicitudes que superen la longitud de contexto se truncarán o devolverán un error.</li></ul></div>
  </div>
</div>

<NextSteps
  title="下一步"
  :steps="[
    { text: 'Inicio rápido', link: '/es/guide/quickstart', primary: true },
    { text: 'Chat Completions API', link: '/es/api/chat-completions' },
    { text: 'Preguntas frecuentes', link: '/es/guide/faq' },
  ]"
/>

</div>
