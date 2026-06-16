---
title: Mercado de Estrategias de Lucrum
description: El ecosistema abierto de estrategias de Lucrum conecta a desarrolladores de estrategias con traders.
---

<div class="lucrum-page">

# Mercado de Estrategias

El Mercado de Estrategias de Lucrum es un ecosistema abierto de estrategias cuantitativas que conecta a desarrolladores de estrategias con traders.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">70%</span><span class="lurus-stat__label">Reparto para el autor</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6</span><span class="lurus-stat__label">Paquetes de estrategias integrados</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2 años+</span><span class="lurus-stat__label">Datos de backtest requeridos</span></div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Para usuarios de estrategias</span>
  <h2 class="lurus-section-head__title">Explora, evalúa y despliega con un clic</h2>
</div>

### Explorar y filtrar

En el Mercado de Estrategias puedes filtrar las estrategias por múltiples dimensiones:

| Criterio de filtrado | Descripción |
|---------|------|
| Mercado | Acciones A (mercados de Shanghái y Shenzhen); acciones de Hong Kong, EE. UU. y cripto en planificación |
| Tipo de estrategia | Seguimiento de tendencia, reversión a la media, arbitraje, multifactor |
| Nivel de riesgo | Conservador, moderado, agresivo |
| Capital mínimo | Capital mínimo de inversión que requiere la estrategia |
| Ordenar | Rentabilidad, ratio de Sharpe, máxima caída, número de suscripciones |

### Métricas de evaluación de estrategias

Cada estrategia publicada muestra métricas cuantitativas verificadas:

| Métrica | Estándar de excelencia | Descripción |
|------|---------|------|
| **Rentabilidad anualizada** | &gt; 15% | Tasa de rentabilidad compuesta anualizada |
| **Máxima caída** | &lt; 20% | Mayor pérdida histórica (diferencia entre pico y valle) |
| **Ratio de Sharpe** | &gt; 1.5 | Rentabilidad excedente por unidad de riesgo |
| **Ratio de Calmar** | &gt; 1.0 | Rentabilidad anualizada / máxima caída |
| **Tasa de aciertos** | &gt; 50% | Proporción de operaciones rentables |
| **Ratio ganancia/pérdida** | &gt; 1.5 | Ganancia media / pérdida media |
| **Días en ejecución** | &gt; 90 días | Tiempo de ejecución real de la estrategia |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">¿Cómo elegir una estrategia?</p>
    <div class="lurus-callout__body">No mires solo la rentabilidad. Una estrategia con un ratio de Sharpe de 2.0 y una máxima caída del 10% suele ser más adecuada para la mayoría de las personas que una con un 50% anualizado pero una caída del 40%.</div>
  </div>
</div>

### Suscripción y despliegue

<ol class="lurus-steps">
<li>

Elige una estrategia → página de detalles (con el **informe de backtest completo**).

</li>
<li>

«**Suscribirse**» y confirma el costo.

</li>
<li>

En «**Mis estrategias**» elige la cuenta de trading y configura la asignación de capital.

</li>
<li>

«**Iniciar**» para ejecutar automáticamente.

</li>
</ol>

**Costos**: algunas estrategias son gratuitas y otras tienen suscripción mensual; la cuota de suscripción se descuenta de la [billetera 鹿贝](/es/platform/billing#wallet); las comisiones de operación las cobra el bróker y no tienen relación con Lucrum.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> Para desarrolladores de estrategias</span>
  <h2 class="lurus-section-head__title">Desarrolla, supera la revisión y gana ingresos pasivos</h2>
</div>

### Proceso de publicación

<ol class="lurus-steps">
<li>

**Desarrollo local** de la lógica de la estrategia.

</li>
<li>

**Validación con backtest** (al menos 2 años de datos históricos).

</li>
<li>

**Envío a revisión** (descripción / nivel de riesgo / mercado aplicable).

</li>
<li>

**Revisión de la plataforma** sobre cumplimiento y control de riesgos (normalmente de 1 a 3 días hábiles).

</li>
<li>

**Publicación** visible para todos los usuarios.

</li>
<li>

**Obtención de ingresos**, liquidados en 鹿贝 a tu billetera.

</li>
</ol>

### Estándares de revisión

| Elemento | Requisito |
|------|------|
| Volumen de datos de backtest | Debe cubrir al menos 2 años de datos históricos |
| Máxima caída | No superior al 50% (si la supera, hay que advertir el riesgo de forma especial) |
| Medidas de control de riesgo | Debe incluir lógica de stop-loss |
| Calidad del código | Sin fugas de memoria ni riesgo de bucles infinitos |
| Descripción de la estrategia | Explicación completa de la lógica, el mercado aplicable y las advertencias de riesgo |

### Reparto de ingresos

Los ingresos por suscripción que genere una estrategia se distribuyen en las siguientes proporciones:

| Rol | Proporción del reparto |
|------|---------|
| Autor de la estrategia | **70%** |
| Plataforma | **30%** |

Los ingresos se liquidan en forma de 鹿贝 a tu billetera y se pueden retirar a una tarjeta bancaria.

### Paquetes de estrategias integrados

Lucrum incluye 6 grandes paquetes de estrategias integrados + soporte para extensiones personalizadas:

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title"><code>VALUE_BLUECHIP</code></div>
    <p class="lurus-card__body">Blue chips de valor (baja valoración, gran capitalización y solidez).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title"><code>GROWTH_MOMENTUM</code></div>
    <p class="lurus-card__body">Momentum de crecimiento (alto crecimiento + filtrado por momentum).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="star" :size="20" /></span>
    <div class="lurus-card__title"><code>SECTOR_LEADER</code></div>
    <p class="lurus-card__body">Líderes de sector (valores que lideran su industria).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title"><code>LOW_VOL_STABLE</code></div>
    <p class="lurus-card__body">Baja volatilidad y solidez (tipo defensivo de baja volatilidad).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="20" /></span>
    <div class="lurus-card__title"><code>MEAN_REVERSION</code></div>
    <p class="lurus-card__body">Reversión a la media (rebote tras sobreventa).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title"><code>EVENT_DRIVEN</code></div>
    <p class="lurus-card__body">Impulsado por eventos (catalizadores como anuncios, informes financieros, etc.).</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="filter" :size="14" /> Tipos de estrategia</span>
  <h2 class="lurus-section-head__title">Fundamento y casos de uso de cuatro tipos de estrategia comunes</h2>
</div>

| Tipo | Fundamento | Señales/factores típicos | Adecuado para |
|------|------|------|------|
| **Seguimiento de tendencia** | Ir a favor de la tendencia: entrar cuando se forma y salir cuando termina | Cruces de medias móviles, ruptura de canal, indicadores de momentum | Mercados direccionales (alcistas/bajistas); no apto para mercados laterales |
| **Reversión a la media** | El precio regresa tras desviarse de la media: comprar en sobreventa y vender en sobrecompra | RSI, bandas de Bollinger, Z-Score | Mercados laterales; no apto para tendencias direccionales |
| **Selección multifactor** | Puntuar las acciones combinando varios factores y comprar las de mayor puntuación | PE/PB (valoración), ROE (rentabilidad), momentum a 12 meses, volatilidad | Tenencia a medio y largo plazo, con baja frecuencia de rotación |
| **Trading de pares** | Cuando el diferencial de dos acciones muy correlacionadas se desvía de la media, vender en corto la que más sube y comprar la que más baja | — | Estrategia sólida, de baja caída y neutral al mercado |

---

<div class="lurus-callout lurus-callout--danger">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Invertir conlleva riesgos</p>
    <div class="lurus-callout__body"><ul><li>El rendimiento histórico en backtest no representa rentabilidades futuras</li><li>Las estrategias cuantitativas pueden dejar de funcionar en determinados entornos de mercado</li><li>Asigna tu capital de forma razonable según tu propia tolerancia al riesgo</li><li>Lucrum no ofrece ningún consejo de inversión ni garantía de rentabilidad</li></ul></div>
  </div>
</div>

---

<NextSteps
  :steps="[
    { text: 'Inicio rápido', link: '/es/lucrum/quickstart', primary: true },
    { text: 'Preguntas frecuentes', link: '/es/lucrum/faq' },
    { text: 'Resumen del producto', link: '/es/lucrum/' },
    { text: 'Plataforma de trading', link: 'https://lucrum.lurus.cn', external: true },
  ]"
  title="Siguientes pasos"
/>

</div>
