---
title: "Tutorial — Estrategia de Lucrum, de local a publicación"
description: "El ciclo completo: lenguaje natural → código vnpy → backtest → optimización → publicación en el mercado de estrategias."
---

<div class="lucrum-tut-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="trending-up" :size="14" /> Ciclo cuantitativo de Lucrum</span>
  <h1 class="lurus-section-head__title">Flujo completo de una estrategia de Lucrum</h1>
  <p class="lurus-section-head__lede"><strong>Objetivo</strong>: llevar la idea de "doble media móvil + filtro RSI", desde la descripción en lenguaje natural hasta su publicación en el mercado de estrategias.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 pasos</span><span class="lurus-stat__label">De la descripción a la publicación</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">S/A/B/C/D</span><span class="lurus-stat__label">Calificación de cinco niveles</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">vnpy</span><span class="lurus-stat__label">Stack de código generado</span></div>
</div>

## <Icon name="network" :size="20" /> Arquitectura

Desde el lenguaje natural hasta la publicación, la calificación es la compuerta de derivación: una calificación ≥ A se publica directamente; por debajo de A pasa por la optimización con IA y vuelve a backtest.

<ArchitectureDiagram title="Ciclo de estrategia de Lucrum" chart="graph TB
  NL[Lenguaje natural] --> GEN[Generación de estrategia con IA]
  GEN --> CODE[Código vnpy]
  CODE --> BT[Backtest con datos históricos]
  BT --> SCORE{Calificación}
  SCORE -->|No alcanza A| OPT[Sugerencias de optimización con IA]
  OPT --> BT
  SCORE -->|Alcanza nivel A| MKT[Publicación en el mercado de estrategias]" />

## <Icon name="workflow" :size="20" /> Flujo completo

<ol class="lurus-steps">
<li>

**Descripción en lenguaje natural** — entra en [lucrum.lurus.cn](https://lucrum.lurus.cn) → Crear estrategia → pega la descripción:

> Estrategia de cruce de doble media móvil: comprar cuando la media de 5 días cruza al alza la de 20 días y vender cuando la cruza a la baja. Añadir un filtro RSI(14): no comprar cuando RSI > 70. Stop-loss del 5 %, toma de ganancias del 15 %.

</li>
<li>

**Generación del código vnpy con IA**

```python
from vnpy.app.cta_strategy import CtaTemplate
import talib

class MA_RSI_Strategy(CtaTemplate):
    fast_window = 5
    slow_window = 20
    rsi_window = 14
    rsi_upper = 70
    stop_loss_pct = 0.05
    take_profit_pct = 0.15

    def on_bar(self, bar):
        self.am.update_bar(bar)
        if not self.am.inited:
            return
        fast_ma = talib.SMA(self.am.close_array, self.fast_window)[-1]
        slow_ma = talib.SMA(self.am.close_array, self.slow_window)[-1]
        rsi = talib.RSI(self.am.close_array, self.rsi_window)[-1]

        if self.pos == 0 and fast_ma > slow_ma and rsi < self.rsi_upper:
            self.buy(bar.close_price, 1)
        elif self.pos > 0 and (fast_ma < slow_ma):
            self.sell(bar.close_price, self.pos)
```

</li>
<li>

**Backtest** — selecciona el intervalo del backtest (por defecto, los últimos 2 años) y haz clic en ejecutar:

```
回测期间: 2024-01-01 ~ 2025-12-31
夏普比率: 1.15
最大回撤: 11.3%
胜率: 56%
年化收益: 18.4%
评级: B (收益良好，风控合格)
```

</li>
<li>

**Optimización con IA** — Lucrum ofrece sugerencias de mejora:

> El umbral actual del filtro RSI (70) es demasiado laxo: en el backtest hubo 8 falsas rupturas. Recomendaciones:
> 1. Ajustar el umbral RSI a 65
> 2. Añadir un filtro con la media móvil de volumen de 5 días
> 3. Ampliar el stop-loss del 5 % al 7 % (para evitar que el ruido te saque de la posición)
>
> Sharpe estimado → 1.42, drawdown → 9.2 %

Acepta las sugerencias y vuelve a ejecutar el backtest:

```
夏普比率: 1.44
最大回撤: 9.1%
胜率: 62%
评级: A (收益优秀，风控良好)
```

</li>
<li>

**Publicación en el mercado de estrategias** — entra en los detalles de la estrategia → botón de publicar → completa el precio:

| Campo | Ejemplo |
|------|------|
| Nombre de la estrategia | MA_RSI_A股趋势 v2 |
| Reparto de ingresos | Autor 70 % / Plataforma 30 % |
| Periodo de prueba | 7 días |
| Precio de suscripción recomendado | 99 lubei/mes |

Tras superar la revisión de cumplimiento, podrás publicarla en el [mercado de estrategias](/es/lucrum/strategies).

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">La mejora de B → A proviene de la ronda de optimización</p>
    <div class="lurus-callout__body"><p>El primer backtest obtuvo la calificación B (Sharpe 1.15). Tras aceptar las sugerencias de optimización con IA y volver a ejecutar el backtest, el Sharpe subió a 1.44 y el drawdown bajó a 9.1 %, alcanzando el nivel A; entonces pasa por la compuerta de publicación.</p></div>
  </div>
</div>

## <Icon name="book-open" :size="20" /> Conceptos clave

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="Sharpe Ratio">Ratio de Sharpe</Term></div>
    <p class="lurus-card__body">Rendimiento en exceso por unidad de riesgo.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="Max Drawdown">Drawdown máximo</Term></div>
    <p class="lurus-card__body">Caída desde el máximo histórico hasta el mínimo.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="CtaTemplate">CtaTemplate</Term></div>
    <p class="lurus-card__body">Clase base de estrategias de vnpy.</p>
  </div>
</div>

## Próximos pasos

<NextSteps :steps="[
  { text: 'Conocer Lucrum', link: '/es/lucrum/', primary: true },
  { text: 'Mercado de estrategias', link: '/es/lucrum/strategies' },
  { text: 'FAQ', link: '/es/lucrum/faq' },
]" />

</div>
