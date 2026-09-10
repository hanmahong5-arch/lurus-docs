<!--
  手写图（不由 `bun run diagrams` 生成）—— 平台级分层。

  🔴 图上每个产品的成熟度标记（LIVE / BETA / DEV）**不是我另起的一套说法**，
  取自本站自己的 docs/.vitepress/data/products.ts 的 `status` 字段 ——
  也就是各产品页顶部 StatusBadge 显示的同一个值。改产品状态改那一处，
  这张图要跟着改；两处不一致就是 bug，不是"图比较旧"。

  运维层刻意只画能力类别（容器编排 / 入口网关 / 持续交付 / 可观测），
  不点名具体工具：站上没有为这些工具承诺过可用性，画成具名实线等于凭空承诺。
-->
<template>
  <svg viewBox="0 0 960 556" xmlns="http://www.w3.org/2000/svg" role="img"
       aria-labelledby="platformlayers-title platformlayers-desc">
  <title id="platformlayers-title">Lurus 平台分层</title>
  <desc id="platformlayers-desc">五层自上而下：C 端产品层、B 端产品层、核心引擎层、基础设施层、运维底座。上层依赖下层，下层不感知上层。基础设施层是全平台共用的账号、计费、身份与通知底座，图中以强调色标出。每个产品方块标注了本站发布的成熟度：实线为已上线，虚线为开发中或内测。</desc>

  <defs>
    <marker id="platformlayers-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-muted)"/>
    </marker>
  </defs>

  <rect width="960" height="556" fill="var(--lurus-dg-paper)"/>

  <text x="48" y="40" fill="var(--lurus-dg-soft)" font-size="8" font-weight="500"
        letter-spacing="1.6" font-family="var(--vp-font-family-mono)">PLATFORM LAYERS</text>

  <!-- 左侧方向指示 -->
  <path d="M88,96 V468" fill="none" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)"
        stroke-width="1" stroke-dasharray="4,4" marker-end="url(#platformlayers-arrow)"/>
  <text transform="rotate(-90 60 284)" x="60" y="284" fill="var(--lurus-dg-soft)" font-size="9"
        letter-spacing="0.5" font-family="var(--vp-font-family-mono)" text-anchor="middle">依赖方向 ↓</text>

  <!-- ============ L1 C 端产品层 ============ -->
  <rect x="112" y="88" width="768" height="72" rx="6"
        fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1"/>
  <rect x="128" y="100" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="142" y="112" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">L1</text>
  <text x="168" y="114" fill="var(--lurus-dg-ink)" font-size="14" font-weight="600" font-family="var(--vp-font-family-base)">C 端产品层</text>
  <text x="168" y="130" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)">面向个人用户的成品应用</text>
  <!-- chips -->
  <rect x="424" y="106" width="104" height="36" rx="6" fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="1"/>
  <text x="476" y="122" fill="var(--lurus-dg-ink)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Lucrum</text>
  <text x="476" y="134" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">LIVE</text>
  <rect x="536" y="106" width="104" height="36" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="588" y="122" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Switch</text>
  <text x="588" y="134" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">DEV</text>
  <rect x="648" y="106" width="104" height="36" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="700" y="122" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Creator</text>
  <text x="700" y="134" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">DEV</text>
  <rect x="760" y="106" width="104" height="36" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="812" y="122" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Lutu</text>
  <text x="812" y="134" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">BETA</text>

  <!-- ============ L2 B 端产品层 ============ -->
  <rect x="112" y="168" width="768" height="72" rx="6"
        fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1"/>
  <rect x="128" y="180" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="142" y="192" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">L2</text>
  <text x="168" y="194" fill="var(--lurus-dg-ink)" font-size="14" font-weight="600" font-family="var(--vp-font-family-base)">B 端产品层</text>
  <text x="168" y="210" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)">面向企业与开发者的服务</text>
  <rect x="424" y="186" width="104" height="36" rx="6" fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="1"/>
  <text x="476" y="202" fill="var(--lurus-dg-ink)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Lurus Hub</text>
  <text x="476" y="214" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">LIVE</text>
  <rect x="536" y="186" width="104" height="36" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="588" y="202" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Forge</text>
  <text x="588" y="214" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">BETA</text>
  <rect x="648" y="186" width="104" height="36" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="700" y="202" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Lumen</text>
  <text x="700" y="214" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">DEV</text>
  <rect x="760" y="186" width="104" height="36" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="812" y="202" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Tally</text>
  <text x="812" y="214" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">BETA</text>

  <!-- ============ L3 核心引擎层 ============ -->
  <rect x="112" y="248" width="768" height="72" rx="6"
        fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1"/>
  <rect x="128" y="260" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="142" y="272" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">L3</text>
  <text x="168" y="274" fill="var(--lurus-dg-ink)" font-size="14" font-weight="600" font-family="var(--vp-font-family-base)">核心引擎层</text>
  <text x="168" y="290" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)">可脱离上层单独使用</text>
  <rect x="648" y="266" width="104" height="36" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="700" y="282" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">Kova</text>
  <text x="700" y="294" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">DEV · 持久执行</text>
  <rect x="760" y="266" width="104" height="36" rx="6" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="812" y="282" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">MemX</text>
  <text x="812" y="294" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">DEV · 智能记忆</text>

  <!-- ============ L4 基础设施层（焦点） ============ -->
  <rect x="112" y="328" width="768" height="72" rx="6"
        fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)"
        stroke="var(--lurus-dg-accent)" stroke-width="1.2"/>
  <rect x="128" y="340" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-accent) 14%, transparent)"/>
  <text x="142" y="352" fill="var(--lurus-dg-accent)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">L4</text>
  <text x="168" y="354" fill="var(--lurus-dg-ink)" font-size="14" font-weight="600" font-family="var(--vp-font-family-base)">基础设施层</text>
  <text x="168" y="370" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)">上面每一个产品都共用这一层</text>
  <rect x="536" y="346" width="104" height="36" rx="6" fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="1"/>
  <text x="588" y="362" fill="var(--lurus-dg-ink)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">账号与计费</text>
  <text x="588" y="374" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">LIVE</text>
  <rect x="648" y="346" width="104" height="36" rx="6" fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="1"/>
  <text x="700" y="362" fill="var(--lurus-dg-ink)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">统一身份</text>
  <text x="700" y="374" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">LIVE · OIDC</text>
  <rect x="760" y="346" width="104" height="36" rx="6" fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="1"/>
  <text x="812" y="362" fill="var(--lurus-dg-ink)" font-size="11" font-weight="600" font-family="var(--vp-font-family-base)" text-anchor="middle">通知</text>
  <text x="812" y="374" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.6" font-family="var(--vp-font-family-mono)" text-anchor="middle">platform 内置</text>

  <!-- ============ L5 运维底座 ============ -->
  <rect x="112" y="408" width="768" height="72" rx="6"
        fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"
        stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1"/>
  <rect x="128" y="420" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="142" y="432" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">L5</text>
  <text x="168" y="434" fill="var(--lurus-dg-ink)" font-size="14" font-weight="600" font-family="var(--vp-font-family-base)">运维底座</text>
  <text x="168" y="450" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)">产品不感知的能力，非对外承诺项</text>
  <rect x="424" y="426" width="104" height="36" rx="6" fill="none" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="0.8"/>
  <text x="476" y="449" fill="var(--lurus-dg-soft)" font-size="11" font-family="var(--vp-font-family-base)" text-anchor="middle">容器编排</text>
  <rect x="536" y="426" width="104" height="36" rx="6" fill="none" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="0.8"/>
  <text x="588" y="449" fill="var(--lurus-dg-soft)" font-size="11" font-family="var(--vp-font-family-base)" text-anchor="middle">入口网关</text>
  <rect x="648" y="426" width="104" height="36" rx="6" fill="none" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="0.8"/>
  <text x="700" y="449" fill="var(--lurus-dg-soft)" font-size="11" font-family="var(--vp-font-family-base)" text-anchor="middle">持续交付</text>
  <rect x="760" y="426" width="104" height="36" rx="6" fill="none" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="0.8"/>
  <text x="812" y="449" fill="var(--lurus-dg-soft)" font-size="11" font-family="var(--vp-font-family-base)" text-anchor="middle">可观测</text>

  <!-- ============ 图例 ============ -->
  <path d="M112,504 H880" fill="none" stroke="color-mix(in srgb, var(--lurus-dg-ink) 12%, transparent)" stroke-width="1"/>
  <text x="112" y="524" fill="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)"
        font-size="8" font-weight="500" letter-spacing="1.6"
        font-family="var(--vp-font-family-mono)">LEGEND</text>
  <rect x="192" y="516" width="14" height="10" rx="2" fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="1"/>
  <text x="214" y="525" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)">已上线</text>
  <rect x="288" y="516" width="14" height="10" rx="2" fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="310" y="525" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)">开发中 / 内测</text>
  <rect x="424" y="516" width="14" height="10" rx="2" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
  <text x="446" y="525" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)">全平台共用底座</text>
  <text x="592" y="525" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)">成熟度取自各产品页顶部的状态标</text>
  </svg>
</template>
