---
layout: page
title: Documentación de LurusTech
description: "Sistemas de IA en el entorno propio del cliente: estado verificable, datos recuperables, cambios registrados. Punto de entrada a la documentación de Witness, Kova, MemX, el gateway y la base de la plataforma."
---

<div class="vp-doc lurus-home">

<Hero />

<section class="home-block" aria-labelledby="home-parts">

## Documentación por componente {#home-parts}

<ul class="home-parts">
  <li>
    <a class="home-parts__name" href="/witness/">Lurus Witness</a><Badge type="warning" text="Piloto temprano" />
    <p>Recolección de solo lectura, sondeo externo, un simulacro real de restauración cada mes y un informe mensual de evidencia; cada lectura indica la fuerza de su evidencia. Documentación en chino.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/es/kova/">Kova</a><Badge type="warning" text="Piloto temprano" />
    <p>Motor embebido de ejecución duradera: recuperación ante fallos con registro de escritura anticipada, registro de ejecución y reproducción.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/es/memx/">MemX</a><Badge type="warning" text="Piloto temprano" />
    <p>Motor de memoria para IA: extracción, deduplicación, decaimiento y recuperación híbrida; CLI / REST / MCP.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/es/guide/quickstart">Gateway y API</a><Badge type="tip" text="En uso en producción interna" />
    <p>Gateway LLM multiinquilino de despliegue privado, basado en el proyecto de código abierto New API (AGPLv3). Los detalles de la interfaz están en la <a href="/es/api/overview">referencia de la API</a>.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/es/platform/">Base de la plataforma</a><Badge type="tip" text="En uso en producción interna" />
    <p>Cuentas e inicio de sesión compartidos por todos los componentes. Es una capa base; no se ofrece por separado.</p>
  </li>
</ul>

</section>

<section class="home-block" aria-labelledby="home-start">

## Por dónde empezar {#home-start}

<dl class="home-start">
  <dt>Operadores que despliegan Witness</dt>
  <dd>Lea <a href="/witness/deploy">Despliegue (en chino)</a> y luego <a href="/witness/evidence">Conceptos clave (en chino)</a> para entender de dónde sale cada lectura y qué tan segura es.</dd>
  <dt>Desarrolladores que integran el gateway</dt>
  <dd>Haga una primera solicitud con el <a href="/es/guide/quickstart">inicio rápido</a>; consulte campos y códigos de error en la <a href="/es/api/overview">referencia de la API</a>.</dd>
  <dt>Responsables que evalúan</dt>
  <dd>Lea «Lo que no es» y «Dónde está hoy» en el <a href="/witness/">resumen de Witness (en chino)</a> y después <a href="/witness/drills">Simulacros de restauración e informes mensuales (en chino)</a>.</dd>
</dl>

</section>

<section class="home-block" aria-labelledby="home-bounds">

## Límites {#home-bounds}

<p class="home-bounds">No revendemos espacio de centro de datos ni capacidad de cómputo, y no prometemos cifras que no podamos demostrar. La madurez usa solo cuatro etiquetas (piloto temprano, en uso en producción interna, código abierto, en diseño) y, ante la duda, elegimos la más conservadora.</p>

</section>

</div>

<style>
.lurus-home { max-width: 1152px; margin: 0 auto; padding: 24px; }
.lurus-home .home-block { max-width: 44rem; margin: 40px 0 0; }
.lurus-home .home-block h2 {
  font-size: var(--lurus-fs-lg);
  font-weight: 600;
  margin: 0 0 12px;
  padding: 0 0 8px;
  border-top: none;
  border-bottom: 1px solid var(--vp-c-divider);
}
.home-parts { list-style: none; padding: 0 !important; margin: 0; }
.home-parts li {
  margin: 0 !important;
  padding: 14px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.home-parts__name { font-weight: 600; text-decoration: none !important; }
.home-parts p { margin: 4px 0 0 !important; color: var(--vp-c-text-2); line-height: 1.6; }
.home-start { margin: 0; }
.home-start dt { font-weight: 600; margin-top: 14px; }
.home-start dd { margin: 4px 0 0; color: var(--vp-c-text-2); line-height: 1.6; }
.home-bounds { color: var(--vp-c-text-2); line-height: 1.7; }
@media (max-width: 640px) {
  .lurus-home { padding: 16px; }
}
</style>
