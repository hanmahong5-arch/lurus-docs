<!--
  手写图（不由 `bun run diagrams` 生成）—— 平台级，不属于任何单一产品仓，
  所以没有对应的 README SVG 可换肤。颜色直接写 --lurus-dg-*。

  内容真源：2b-svc-newhub/internal/adapter/handler/router/relay-router.go:94-130
  每一档的**顺序及其理由**都是该文件里的代码与注释，不是推测：
    - StampRelayFormat 必须第一个（gin 在 Group()/Use() 时快照整条链）
    - PoolBalanceCheck 在 TokenAuth 之后（要 tenant_context）、CostSpikeLimit 之前
    - RelayConcurrencyLimit 默认关闭（不设 RELAY_MAX_CONCURRENT_* 就不生效）
    - BusinessModelRateLimit 必须在 Distribute 之后（模型名到那时才进上下文）
  改动 relay-router.go 的中间件顺序时，这张图要一起改。
-->
<template>
  <svg viewBox="0 0 960 648" xmlns="http://www.w3.org/2000/svg" role="img"
       aria-labelledby="relaypath-title relaypath-desc">
  <title id="relaypath-title">Lurus Hub relay 请求链路</title>
  <desc id="relaypath-desc">一次 OpenAI 兼容的模型调用进入 Lurus Hub 后，按注册顺序依次经过十道中间件：标记响应格式、令牌鉴权、租户额度池闸、费用尖峰保护、权限校验、按模型限流、业务限流、并发占用上限（默认关闭）、选渠道分发，以及分发后才能生效的按模型维度限流；随后打到上游厂商适配器，响应原路返回调用方。</desc>

  <defs>
    <marker id="relaypath-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-muted)"/>
    </marker>
    <marker id="relaypath-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-accent)"/>
    </marker>
  </defs>

  <rect width="960" height="648" fill="var(--lurus-dg-paper)"/>

  <!-- eyebrow -->
  <text x="48" y="40" fill="var(--lurus-dg-soft)" font-size="8" font-weight="500"
        letter-spacing="1.6" font-family="var(--vp-font-family-mono)">RELAY REQUEST PATH</text>

  <!-- ===== 调用方 ===== -->
  <rect x="48" y="84" width="160" height="56" rx="6"
        fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <rect x="56" y="92" width="36" height="14" rx="4"
        fill="none" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="0.8"/>
  <text x="74" y="102" fill="var(--lurus-dg-soft)" font-size="7" letter-spacing="0.8"
        font-family="var(--vp-font-family-mono)" text-anchor="middle">CALLER</text>
  <text x="128" y="122" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600"
        font-family="var(--vp-font-family-base)" text-anchor="middle">API 调用方</text>
  <text x="128" y="134" fill="var(--lurus-dg-soft)" font-size="9"
        font-family="var(--vp-font-family-mono)" text-anchor="middle">OpenAI-compatible SDK</text>

  <path d="M208,112 H240" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1"
        marker-end="url(#relaypath-arrow)"/>

  <!-- ===== 中间件链容器 ===== -->
  <rect x="248" y="64" width="592" height="440" rx="8" fill="none"
        stroke="color-mix(in srgb, var(--lurus-dg-ink) 12%, transparent)" stroke-width="1"/>
  <text x="264" y="84" fill="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)"
        font-size="8" font-weight="500" letter-spacing="1.6"
        font-family="var(--vp-font-family-mono)">MIDDLEWARE CHAIN · 按注册顺序</text>

  <!-- 01 StampRelayFormat -->
  <rect x="264" y="96" width="560" height="32" rx="6"
        fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1"/>
  <rect x="272" y="104" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="286" y="116" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">01</text>
  <text x="312" y="117" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)">标记响应格式</text>
  <text x="812" y="117" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">StampRelayFormat</text>
  <circle cx="856" cy="112" r="9" fill="none" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
  <text x="856" y="116" fill="var(--lurus-dg-accent)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">1</text>

  <!-- 02 TokenAuth -->
  <rect x="264" y="136" width="560" height="32" rx="6"
        fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1"/>
  <rect x="272" y="144" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="286" y="156" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">02</text>
  <text x="312" y="157" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)">令牌鉴权</text>
  <text x="812" y="157" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">TokenAuth</text>

  <!-- 03 PoolBalanceCheck -->
  <rect x="264" y="176" width="560" height="32" rx="6"
        fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1"/>
  <rect x="272" y="184" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="286" y="196" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">03</text>
  <text x="312" y="197" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)">租户额度池闸</text>
  <text x="812" y="197" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">PoolBalanceCheck</text>
  <circle cx="856" cy="192" r="9" fill="none" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
  <text x="856" y="196" fill="var(--lurus-dg-accent)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">2</text>

  <!-- 04 CostSpikeLimit -->
  <rect x="264" y="216" width="560" height="32" rx="6"
        fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1"/>
  <rect x="272" y="224" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="286" y="236" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">04</text>
  <text x="312" y="237" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)">费用尖峰保护</text>
  <text x="812" y="237" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">CostSpikeLimit</text>

  <!-- 05 EntitlementCheck -->
  <rect x="264" y="256" width="560" height="32" rx="6"
        fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1"/>
  <rect x="272" y="264" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="286" y="276" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">05</text>
  <text x="312" y="277" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)">权限与套餐校验</text>
  <text x="812" y="277" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">EntitlementCheck</text>

  <!-- 06 ModelRequestRateLimit -->
  <rect x="264" y="296" width="560" height="32" rx="6"
        fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1"/>
  <rect x="272" y="304" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="286" y="316" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">06</text>
  <text x="312" y="317" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)">请求速率限制</text>
  <text x="812" y="317" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">ModelRequestRateLimit</text>

  <!-- 07 BusinessRateLimit -->
  <rect x="264" y="336" width="560" height="32" rx="6"
        fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1"/>
  <rect x="272" y="344" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="286" y="356" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">07</text>
  <text x="312" y="357" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)">业务维度限流</text>
  <text x="812" y="357" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">BusinessRateLimit</text>

  <!-- 08 RelayConcurrencyLimit — 默认关闭，虚线 -->
  <rect x="264" y="376" width="560" height="32" rx="6"
        fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)"
        stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="4,3"/>
  <rect x="272" y="384" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="286" y="396" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">08</text>
  <text x="312" y="397" fill="color-mix(in srgb, var(--lurus-dg-ink) 80%, transparent)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)">并发占用上限</text>
  <text x="812" y="397" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">RelayConcurrencyLimit · off</text>
  <circle cx="856" cy="392" r="9" fill="none" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
  <text x="856" y="396" fill="var(--lurus-dg-accent)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">3</text>

  <!-- 09 Distribute — 焦点 -->
  <rect x="264" y="416" width="560" height="32" rx="6"
        fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)"
        stroke="var(--lurus-dg-accent)" stroke-width="1.2"/>
  <rect x="272" y="424" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-accent) 14%, transparent)"/>
  <text x="286" y="436" fill="var(--lurus-dg-accent)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">09</text>
  <text x="312" y="437" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)">选渠道分发</text>
  <text x="812" y="437" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">Distribute</text>
  <circle cx="856" cy="432" r="9" fill="none" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
  <text x="856" y="436" fill="var(--lurus-dg-accent)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="middle">4</text>

  <!-- 10 BusinessModelRateLimit -->
  <rect x="264" y="456" width="560" height="32" rx="6"
        fill="var(--lurus-dg-node)" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1"/>
  <rect x="272" y="464" width="28" height="16" rx="4" fill="color-mix(in srgb, var(--lurus-dg-ink) 5%, transparent)"/>
  <text x="286" y="476" fill="var(--lurus-dg-soft)" font-size="8" font-family="var(--vp-font-family-mono)" text-anchor="middle">10</text>
  <text x="312" y="477" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600" font-family="var(--vp-font-family-base)">按模型维度限流</text>
  <text x="812" y="477" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)" text-anchor="end">BusinessModelRateLimit</text>

  <!-- 链内流向：细竖线连接各档 -->
  <path d="M256,128 V488" fill="none" stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)"
        stroke-width="1" stroke-dasharray="2,4"/>

  <!-- ===== 上游 ===== -->
  <path d="M544,504 V528" fill="none" stroke="var(--lurus-dg-accent)" stroke-width="1.2"
        marker-end="url(#relaypath-arrow-accent)"/>
  <rect x="248" y="536" width="592" height="56" rx="6"
        fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <rect x="256" y="544" width="36" height="14" rx="4"
        fill="none" stroke="color-mix(in srgb, var(--lurus-dg-ink) 30%, transparent)" stroke-width="0.8"/>
  <text x="274" y="554" fill="var(--lurus-dg-soft)" font-size="7" letter-spacing="0.8"
        font-family="var(--vp-font-family-mono)" text-anchor="middle">UPSTM</text>
  <text x="544" y="570" fill="var(--lurus-dg-ink)" font-size="12" font-weight="600"
        font-family="var(--vp-font-family-base)" text-anchor="middle">上游厂商适配器</text>
  <text x="544" y="582" fill="var(--lurus-dg-soft)" font-size="9"
        font-family="var(--vp-font-family-mono)" text-anchor="middle">20+ vendors · 格式互转</text>

  <!-- 响应回程 -->
  <path d="M248,564 H128 V148" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1"
        stroke-dasharray="5,4" marker-end="url(#relaypath-arrow)"/>
  <rect x="72" y="316" width="48" height="16" rx="4" fill="var(--lurus-dg-paper)"/>
  <text x="96" y="328" fill="var(--lurus-dg-soft)" font-size="8" letter-spacing="0.5"
        font-family="var(--vp-font-family-mono)" text-anchor="middle">RESPONSE</text>

  <!-- ===== 图例 ===== -->
  <path d="M48,616 H912" fill="none" stroke="color-mix(in srgb, var(--lurus-dg-ink) 12%, transparent)" stroke-width="1"/>
  <text x="48" y="636" fill="color-mix(in srgb, var(--lurus-dg-ink) 40%, transparent)"
        font-size="8" font-weight="500" letter-spacing="1.6"
        font-family="var(--vp-font-family-mono)">LEGEND</text>
  <rect x="128" y="628" width="14" height="10" rx="2"
        fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
  <text x="150" y="637" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)">焦点 · 分发点</text>
  <rect x="272" y="628" width="14" height="10" rx="2"
        fill="color-mix(in srgb, var(--lurus-dg-ink) 2%, transparent)"
        stroke="color-mix(in srgb, var(--lurus-dg-ink) 20%, transparent)" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="294" y="637" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)">默认关闭 · 需显式配置</text>
  <circle cx="470" cy="633" r="7" fill="none" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
  <text x="484" y="637" fill="var(--lurus-dg-soft)" font-size="9" font-family="var(--vp-font-family-mono)">顺序有硬性约束 · 见下方说明</text>
  </svg>
</template>
