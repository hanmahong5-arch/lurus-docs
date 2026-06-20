---
title: "Forge — Banco de trabajo para el desarrollo de productos de IA"
description: "Plataforma web de desarrollo colaborativo de productos de IA, con soporte para que los equipos construyan aplicaciones de IA en conjunto."
---

<div class="forge-page">

<ProductHero product-id="forge" />

::: warning Plataforma interna de I+D (no es un SaaS comercial)
Forge se posiciona actualmente como una herramienta interna de **I+D** de Lurus (gestión de requisitos impulsada por ontología + demo de API Gateway), **no es un producto comercial a la venta**. Solo en beta cerrada por invitación, y la API aún está en evolución. Para más información o colaboración, contacte con [business@lurus.cn](mailto:business@lurus.cn).
:::

## ¿Qué es Forge?

**Lurus Forge** es un banco de trabajo orientado a los equipos de productos de IA, cuya filosofía central es "**todo es conversación**": los requisitos de producto se discuten mediante conversaciones en Session, las funciones se implementan a través de Agents de IA (PM/Architect/Code) y el conocimiento se visualiza mediante la ontología del producto (Ontology).

En la capa inferior, mediante el [motor Kova](/es/kova/) se logra la persistencia WAL de las tareas del Agent, de modo que la ejecución pueda reanudarse sin interrupciones incluso si se detiene a mitad de proceso.

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="network" :size="22" /></span>
    <div class="lurus-card__title">Ontología (Ontology)</div>
    <p class="lurus-card__body">Gestiona en una estructura de árbol las historias de usuario, la arquitectura, el stack tecnológico y las normas de diseño del producto: conocimiento estructurado y estático.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="22" /></span>
    <div class="lurus-card__title">Desarrollo impulsado por Session</div>
    <p class="lurus-card__body">Cada discusión de producto se encapsula en una Session: una línea de tiempo dinámica que recoge conversaciones, decisiones y resultados del Agent.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Capacidades principales</span>
  <h2 class="lurus-section-head__title">Del requisito al PR, todo en una única estructura visual</h2>
  <p class="lurus-section-head__lede">Las capacidades ya disponibles y las planificadas se muestran en paralelo, con etiquetas de estado fieles a la realidad.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-forge)"
  :items="[
    { title: 'Ontología del producto (Ontology)', body: 'Gestiona en árbol las historias de usuario / arquitectura / stack tecnológico / normas de diseño, visualizando todas las dimensiones en paralelo; las decisiones tomadas en la conversación se actualizan automáticamente en la Ontology.', icon: 'network' },
    { title: 'Desarrollo impulsado por conversación', body: 'Pregunte “¿cuál es la historia de usuario de esta función?” → el PM Agent la analiza y la genera. Cada decisión queda asociada al contexto de la conversación, lo que permite rastrear por qué se decidió así.', icon: 'messages-square' },
    { title: 'Trazabilidad de decisiones con WAL', body: 'Basado en el WAL del motor Kova, cada paso de la conversación y cada decisión se persisten, lo que permite rastrear, localizar y reproducir (Replay) para su revisión.', icon: 'history' },
  ]"
/>

### Capacidades planificadas / en desarrollo

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Dependency Guardian <Badge text="Planificado" type="warning" /></div>
    <p class="lurus-card__body">Una gestión de dependencias en tres niveles que supera a Renovate/Dependabot: los Patch se fusionan automáticamente (cero intervención manual); los Minor se deciden con un clic mediante tarjetas de aprobación; los Major se revisan de forma conversacional (la IA analiza el impacto semántico de los breaking changes en el negocio).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="workflow" :size="20" /></span>
    <div class="lurus-card__title">Construcción visual de Agents <Badge text="En desarrollo" type="tip" /></div>
    <p class="lurus-card__body">Construcción en tres tramos mediante arrastrar y soltar: condición de disparo Trigger (Webhook / programado / petición API) → procesamiento con IA Process (llamada a LLM / recuperación RAG / llamada a herramientas) → acción de salida Action (callback de API / notificación por correo / escritura en base de datos).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="database-backup" :size="20" /></span>
    <div class="lurus-card__title">Gestión de la base de conocimiento <Badge text="En desarrollo" type="tip" /></div>
    <p class="lurus-card__body">Base de conocimiento RAG: importación de documentos (PDF/Word/Markdown/páginas web), fragmentación automática (manteniendo la integridad semántica), indexación vectorial (embedding automático con soporte de búsqueda semántica) y sincronización de actualizaciones (reindexación automática al actualizar un documento).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">Monitorización y análisis <Badge text="En desarrollo" type="tip" /></div>
    <p class="lurus-card__body">Estadísticas de llamadas (volumen / latencia / Token), puntuación de calidad (feedback de usuario + evaluación automática), análisis de costes (por función / por tiempo) y alertas (notificación automática ante volúmenes de llamadas anómalos o caídas de calidad).</p>
  </div>
</div>

### Banco de trabajo de ingeniería de Prompts

| Función | Descripción |
|------|------|
| **Editor de Prompts** | Resaltado de sintaxis, inserción de variables, gestión de versiones |
| **Pruebas A/B** | Compara la calidad de salida de distintos Prompts con la misma entrada |
| **Comparación de modelos** | Compara el rendimiento de un mismo Prompt en distintos modelos |
| **Pruebas por lotes** | Importa un conjunto de pruebas para evaluarlo por lotes |
| **Historial de versiones** | Guarda una versión automáticamente con cada modificación, con reversión en cualquier momento |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Casos de uso</span>
  <h2 class="lurus-section-head__title">Qué hacen los equipos en Forge</h2>
</div>

<UserScenarios
  :scenarios="[
    { role: 'Atención al cliente con IA', title: 'Construir visualmente un Agent de atención', summary: 'Gestionar la base de conocimiento, monitorizar la calidad del servicio', link: '/es/forge/sessions' },
    { role: 'Moderación de contenido', title: 'Montar un flujo de moderación con arrastrar y soltar', summary: 'Definir reglas, optimizar de forma continua', link: '/es/forge/sessions' },
    { role: 'Recomendación inteligente', title: 'Configurar un Agent de recomendación', summary: 'Pruebas A/B de distintas estrategias', link: '/es/forge/sessions' },
    { role: 'QA de documentos', title: 'Importar documentos para crear una base de conocimiento', summary: 'Desplegar un Agent de preguntas y respuestas', link: '/es/forge/ontology' },
  ]"
/>

---

## Stack tecnológico

| Capa | Tecnología |
|------|------|
| Frontend | TypeScript + React (monorepo Turbo) |
| Motor de IA | [Lurus API](/es/guide/introduction) (soporte multimodelo) |
| Ejecución de Agents | [Kova](/es/kova/) (ejecución persistente) |
| Almacenamiento vectorial | Qdrant / Chroma |
| Despliegue | Kubernetes (ArgoCD) |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="mail" :size="14" /> Solicitud de beta cerrada</span>
  <h2 class="lurus-section-head__title">En beta cerrada por invitación</h2>
</div>

Forge se encuentra actualmente en fase de beta cerrada por invitación. Es adecuado para los siguientes equipos:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <p class="lurus-card__body">Que estén integrando o planeen integrar funciones de IA en su producto</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="pen-tool" :size="20" /></span>
    <p class="lurus-card__body">Que necesiten herramientas visuales de gestión y prueba de Prompts</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <p class="lurus-card__body">Que deseen reducir los costes de desarrollo y operación de las funciones de IA</p>
  </div>
</div>

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">Solicitar acceso a la beta cerrada</p>
    <p class="lurus-cta__text">Contacte con business@lurus.cn, indicando el tamaño del equipo y los problemas que espera resolver.</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="mailto:business@lurus.cn">Enviar correo de solicitud →</a>
  </div>
</div>

## Más recursos

- [Lurus API](/es/guide/introduction) — conozca las capacidades de IA subyacentes
- [Kova](/es/kova/) — motor de ejecución persistente de Agents
- [MemX](/es/memx/) — gestión inteligente de la memoria de IA
- [Autenticación de identidad unificada](/es/platform/auth/) — el inicio de sesión de Forge, los permisos de equipo y la federación SSO se basan en esto

<!-- lurus:related-block -->

---

## Productos relacionados y próximos pasos

<RelatedProducts product-id="forge" />

</div>
