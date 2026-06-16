---
title: Preguntas frecuentes de MemX
description: Preguntas frecuentes y respuestas sobre el motor de memoria de IA MemX.
---

<div class="memx-faq">

# Preguntas frecuentes

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> Fundamentos</span>
  <h2 class="lurus-section-head__title">Preguntas básicas</h2>
</div>

<details class="lurus-faq-item"><summary>¿Qué relación hay entre MemX y mem0?</summary>

MemX es la versión mejorada (superconjunto) de [mem0](https://github.com/mem0ai/mem0), que añade la capa de gestión inteligente de memoria ACE. Con `ace_enabled=False`, su comportamiento es idéntico al de mem0 y sin sobrecarga.

</details>

<details class="lurus-faq-item"><summary>¿Se necesita GPU?</summary>

No. El modelo de embeddings local all-MiniLM-L6-v2 se ejecuta en la CPU mediante ONNX Runtime (&lt; 5ms/entrada); el prefiltrado por reglas del Reflector no depende de la GPU, y el refinamiento con LLM del modo hybrid se realiza a través de una API remota.

</details>

<details class="lurus-faq-item"><summary>¿Genera un consumo adicional de tokens de LLM?</summary>

El modo `hybrid` predeterminado solo invoca al LLM para los candidatos con valor, lo que reduce las llamadas en más del 90 % respecto al uso total de mem0; cuando el LLM no está disponible, degrada automáticamente a reglas puras, con coste cero. Para desactivarlo explícitamente, configura `reflector.mode="rules"`.

</details>

<details class="lurus-faq-item"><summary>¿Qué bases de datos vectoriales son compatibles?</summary>

Hereda todas las de mem0 (Qdrant, Chroma, Pinecone, Weaviate, Milvus, etc.); el almacenamiento en memoria predeterminado es adecuado para desarrollo y pruebas.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Uso</span>
  <h2 class="lurus-section-head__title">Preguntas de uso</h2>
</div>

<details class="lurus-faq-item"><summary>¿Cómo migrar desde mem0?</summary>

<ol class="lurus-steps">
<li>

`pip install git+https://github.com/UU114/memx.git`

</li>
<li>

Cambia `from mem0 import Memory` por `from memx import Memory`

</li>
<li>

El código existente no requiere modificaciones (ACE está desactivado por defecto).

</li>
<li>

Cuando estés listo, añade `config={"ace_enabled": True}` para habilitar las funciones inteligentes.

</li>
</ol>

</details>

<details class="lurus-faq-item"><summary>¿Dónde se almacenan los datos?</summary>

Depende del backend de base de datos vectorial configurado; por defecto se usa la memoria (se pierde al reiniciar). Para producción se recomienda la persistencia con Qdrant/Chroma. El modelo de embeddings local se almacena en caché en `~/.memx/models/`.

</details>

<details class="lurus-faq-item"><summary>¿Cómo se controla la velocidad de decaimiento?</summary>

| Parámetro | Efecto |
|------|------|
| `decay.half_life_days` | Aumentar → decaimiento más lento (predeterminado: 30 días) |
| `decay.boost_factor` | Aumentar → refuerzo de recuperación más marcado (predeterminado: 0,1) |
| `decay.permanent_threshold` | Reducir → más fácil convertirse en memoria permanente (predeterminado: 15 veces) |

</details>

<details class="lurus-faq-item"><summary>¿Cómo se gestiona el conocimiento mal identificado?</summary>

<ol class="lurus-steps">
<li>

`memx list --scope project:my-app` — consultar

</li>
<li>

`memx forget <memory-id>` — eliminar

</li>
<li>

`memx learn "correct knowledge"` — añadir manualmente

</li>
</ol>

</details>

<details class="lurus-faq-item"><summary>¿Cómo compartir memoria entre varias personas o varios agentes?</summary>

Habilita el modo demonio; varios agentes comparten la misma base de conocimiento a través de un socket IPC (complementos de IDE, colaboración en equipo), y se usa `scope` para distinguir proyectos/espacios de trabajo.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Privacidad</span>
  <h2 class="lurus-section-head__title">Preguntas de privacidad</h2>
</div>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">El filtrado no se puede desactivar</p>
    <div class="lurus-callout__body"><p>Las 12 reglas integradas de filtrado de información sensible son una línea de seguridad que no se puede desactivar; solo es posible añadir reglas adicionales mediante <code>privacy_custom_patterns</code>.</p></div>
  </div>
</div>

<details class="lurus-faq-item"><summary>¿Qué tipos de información sensible se filtran?</summary>

| Tipo | Ejemplo |
|---------|------|
| Clave privada PEM | `-----BEGIN RSA PRIVATE KEY-----` |
| Token Bearer / JWT | `Bearer eyJhbG...` |
| Clave de API de Anthropic | `sk-ant-api03-*` |
| Clave de API de OpenAI | `sk-proj-*` |
| Token de GitHub | `ghp_*`, `github_pat_*` |
| Clave de acceso de AWS | `AKIA*` |
| Clave secreta de AWS | base64 de 40 caracteres |
| Cadena de conexión de base de datos | `postgres://user:pass@host/db` |
| Ruta del sistema operativo | `/home/user/.ssh/id_rsa` |
| Regla personalizada | Se añade mediante `privacy_custom_patterns` |

::: info
Estas 12 reglas se centran en información sensible del tipo **claves y rutas locales** (secrets + user paths), y no en la PII en el sentido tradicional (correo electrónico / teléfono / documento de identidad, etc.). Si necesitas filtrar PII, amplíalo por tu cuenta mediante `privacy_custom_patterns`.
:::

</details>

<details class="lurus-faq-item"><summary>¿Adónde van los valores originales tras el filtrado?</summary>

Se reemplazan por un marcador de posición (como `[REDACTED:api_key]`), y el valor original no se almacena en ningún lugar. El filtrado se ejecuta al inicio del flujo de escritura.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Rendimiento</span>
  <h2 class="lurus-section-head__title">Preguntas de rendimiento</h2>
</div>

<details class="lurus-faq-item"><summary>¿Cuántas memorias se pueden almacenar?</summary>

Depende de la capacidad del backend de base de datos vectorial; MemX en sí no tiene un límite rígido. El motor de decaimiento archiva automáticamente para mantener un tamaño activo razonable.

</details>

<details class="lurus-faq-item"><summary>¿RecallReinforcer afecta al rendimiento de búsqueda?</summary>

No. Es un hilo en segundo plano asíncrono que solo actualiza `recall_count` después de devolver los resultados, sin bloquear la búsqueda.

</details>

<details class="lurus-faq-item"><summary>¿Cuál es la latencia de recuperación? (&lt; 10.000 memorias)</summary>

| Operación | Latencia |
|------|------|
| Búsqueda híbrida de cuatro capas | 10-50ms |
| Búsqueda por palabras clave pura (degradación L4) | 5-20ms |
| Cálculo de embeddings local | &lt; 5ms |
| Escritura (incluye Reflector + Curator) | 20-100ms |

</details>

## Próximos pasos

<NextSteps
  :steps="[
    { text: 'Inicio rápido — Prueba las funciones principales en 5 minutos', link: '/es/memx/quickstart', primary: true },
    { text: 'Conceptos clave — Profundiza en el motor ACE', link: '/es/memx/concepts' },
    { text: 'Diseño de la arquitectura — Arquitectura completa del sistema', link: '/es/memx/architecture' },
  ]"
/>

</div>
