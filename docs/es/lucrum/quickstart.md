---
title: Primeros pasos con Lucrum
description: Comienza a usar el asistente de trading cuantitativo con IA Lucrum en 5 minutos.
---

<div class="lucrum-page">

# Primeros pasos

Comienza a usar el asistente de trading con IA Lucrum en 5 minutos: desde el registro hasta tu primer backtest.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5</span><span class="lurus-stat__label">minutos para empezar</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">11</span><span class="lurus-stat__label">asesores de inversión</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Acciones A</span><span class="lurus-stat__label">mercados de Shanghái y Shenzhen</span></div>
</div>

<ol class="lurus-steps">
<li>

### Registro e inicio de sesión

Visita [lucrum.lurus.cn](https://lucrum.lurus.cn) → «Registrarse» con tu cuenta unificada de Lurus (correo / GitHub / Google) → entra al panel de trading. Si ya tienes una cuenta en cualquier producto de Lurus, puedes iniciar sesión directamente (comparten el mismo sistema de cuentas).

</li>
<li>

### Prueba el asistente de trading con IA

Tras iniciar sesión, encontrarás el acceso al asistente de IA en la esquina inferior derecha; entiende lenguaje natural y puedes hacerle cualquier pregunta relacionada con el trading. Ejemplos de preguntas:

- **Análisis de mercado** — "¿Por qué cayó hoy el índice de Shanghái?"
- **Recomendaciones de estrategia** — "Recomienda una estrategia conservadora con 100.000 de capital"
- **Indicadores técnicos** — "Calcula las bandas de Bollinger de CATL"
- **Evaluación de riesgo** — "¿Es muy arriesgado invertir todo en BYD?"

</li>
<li>

### Explora el mercado de estrategias

En la parte superior «**Mercado de estrategias**» → filtra por rentabilidad / drawdown / tipo → la tarjeta de estrategia muestra la rentabilidad anualizada, el drawdown máximo, el ratio de Sharpe (&gt; 1 es excelente) y el tiempo en funcionamiento (la explicación detallada de los indicadores está en [Mercado de estrategias](/es/lucrum/strategies)) → «Suscribirse» para desplegarla en tu cuenta.

</li>
<li>

### Configura la cuenta de trading

El trading en real requiere vincular un bróker: «**Ajustes**» → «**Cuenta de trading**» → elige el bróker → autoriza siguiendo las indicaciones.

</li>
<li>

### Crea tu primera estrategia (desarrolladores)

Entra en el «**Banco de trabajo de estrategias**» para programar y haz clic en «**Backtest**» para ver el rendimiento histórico:

```python
# 示例：简单的双均线策略
from lucrum import Strategy, Signal

class DualMA(Strategy):
    """双均线交叉策略"""

    fast_period = 5    # 快线周期
    slow_period = 20   # 慢线周期

    def on_bar(self, bar):
        fast_ma = self.sma(bar.close, self.fast_period)
        slow_ma = self.sma(bar.close, self.slow_period)

        if fast_ma > slow_ma and self.position <= 0:
            return Signal.BUY
        elif fast_ma < slow_ma and self.position >= 0:
            return Signal.SELL

        return Signal.HOLD
```

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Aviso de riesgo</p>
    <div class="lurus-callout__body">El trading cuantitativo conlleva riesgo de pérdidas. Valida primero a fondo con una cuenta de simulación antes de operar en real. Lucrum no ofrece ninguna recomendación de inversión ni garantía de rentabilidad.</div>
  </div>
</div>

---

## Integración de la API

La API REST completa se puede integrar en tu propio sistema de trading:

<ApiEndpoint method="POST" path="/api/v1/advisor/chat" description="Obtener análisis de la IA" />

```bash
curl https://lucrum.lurus.cn/api/v1/advisor/chat \
  -H "Authorization: Bearer $LURUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "分析上证指数趋势"}'
```

<ApiEndpoint method="GET" path="/api/v1/strategies" description="Obtener la lista de estrategias" />

```bash
curl https://lucrum.lurus.cn/api/v1/strategies \
  -H "Authorization: Bearer $LURUS_TOKEN"
```

---

<NextSteps
  :steps="[
    { text: 'Mercado de estrategias', link: '/es/lucrum/strategies', primary: true },
    { text: 'Preguntas frecuentes', link: '/es/lucrum/faq' },
    { text: 'Lurus API', link: '/es/guide/introduction' },
    { text: 'Motor de memoria MemX', link: '/es/memx/' },
  ]"
  title="Siguientes pasos"
/>

</div>
