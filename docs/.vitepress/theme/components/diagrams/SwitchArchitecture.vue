<!--
  自动生成，请勿手改 —— 改图请改产品仓的 docs/diagrams/architecture.svg，
  再跑 `bun run diagrams` 重新生成。手改这里会在下次生成时被覆盖。

  颜色/字体已换成 theme/diagrams.css 的 --lurus-dg-* 与站点字体变量，
  所以这一份 SVG 明暗两色都能用；图形与文案与 README 版逐字一致。
-->
<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620" width="960" height="620" role="img" aria-labelledby="switch-mode-state-title switch-mode-state-desc">
  <title id="switch-mode-state-title">Lurus Switch mode state machine</title>
  <desc id="switch-mode-state-desc">State diagram of Lurus Switch's four launch modes -- Personal, Reseller, Enterprise, or a direct EndUser pick -- plus Reseller-minted white-label installers that boot straight into EndUser, and EndUser's redemption/heartbeat lifecycle moving between Unactivated, Active, and Revoked/Mismatch.</desc>
  <defs>
  <marker id="switch-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
  <polygon points="0 0, 8 3, 0 6" fill="var(--lurus-dg-muted)"/>
  </marker>
  </defs>

  <!-- background -->
  <rect width="960" height="620" fill="var(--lurus-dg-paper)"/>

  <!-- zone: EndUser state cluster -->
  <rect x="576" y="96" width="268" height="440" rx="8" fill="color-mix(in srgb, var(--lurus-dg-accent) 5%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-accent) 50%, transparent)" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="584" y="112" font-family="var(--vp-font-family-mono)" font-size="8" letter-spacing="0.14em" fill="var(--lurus-dg-muted)">ENDUSER</text>

  <!-- arrows (drawn before nodes) -->
  <!-- launch fork bar -->
  <rect x="58" y="196" width="6" height="80" rx="3" fill="var(--lurus-dg-ink)"/>

  <!-- PICK -> Personal -->
  <path d="M64,212 L64,164 Q64,156 72,156 L140,156" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>
  <!-- PICK -> Reseller -->
  <path d="M64,244 L64,308 Q64,316 72,316 L140,316" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>
  <!-- PICK -> Enterprise (offset to x=52 so it never overlaps the Reseller run) -->
  <path d="M64,260 L60,260 Q52,260 52,268 L52,468 Q52,476 60,476 L140,476" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>
  <!-- PICK -> EndUser Unactivated (direct wizard pick, hops over the SWITCH MODE crossing arrows) -->
  <path d="M64,228 L208,228 A8,8 0 0,1 224,228 L232,228 A8,8 0 0,1 248,228 L332,228 Q340,228 340,220 L340,100 Q340,92 348,92 L702,92 Q710,92 710,100 L710,120" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>

  <!-- SWITCH MODE: Personal <-> Reseller (any unlocked mode can reach any other) -->
  <path d="M216,192 L216,280" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>
  <path d="M240,280 L240,192" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>
  <!-- SWITCH MODE: Reseller <-> Enterprise -->
  <path d="M216,352 L216,440" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>
  <path d="M240,440 L240,352" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>

  <!-- MINT INSTALLER: Reseller -> Unactivated -->
  <path d="M316,316 L392,316 Q400,316 400,308 L400,148 Q400,140 408,140 L600,140" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>

  <!-- REDEEM CODE: Unactivated -> Active -->
  <path d="M710,192 L710,280" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>
  <!-- HEARTBEAT FAIL: Active -> Revoked/Mismatch -->
  <path d="M710,352 L710,440" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>
  <!-- RESET (manual, ClearActivation): Revoked/Mismatch -> Unactivated, routed inside the zone's left margin so it never crosses behind Active -->
  <path d="M600,476 L596,476 Q588,476 588,468 L588,180 Q588,172 596,172 L600,172" fill="none" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>

  <!-- arrow labels (masked) -->
  <rect x="84" y="134" width="36" height="16" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="102" y="146" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">PICK</text>

  <rect x="84" y="294" width="36" height="16" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="102" y="306" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">PICK</text>

  <rect x="84" y="454" width="36" height="16" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="102" y="466" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">PICK</text>

  <rect x="507" y="70" width="36" height="16" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="525" y="82" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">PICK</text>

  <rect x="248" y="254" width="100" height="16" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="298" y="266" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">SWITCH MODE</text>

  <rect x="248" y="414" width="100" height="16" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="298" y="426" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">SWITCH MODE</text>

  <rect x="466" y="118" width="76" height="16" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="504" y="130" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">MINT INSTALLER</text>

  <rect x="724" y="228" width="90" height="16" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="769" y="240" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">REDEEM CODE</text>

  <rect x="724" y="388" width="100" height="16" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="774" y="400" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">HEARTBEAT FAIL</text>

  <rect x="536" y="308" width="44" height="16" rx="2" fill="var(--lurus-dg-paper)"/>
  <text x="558" y="320" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">RESET</text>

  <!-- nodes -->
  <rect x="140" y="120" width="176" height="72" rx="8" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <text x="228" y="152" text-anchor="middle" font-family="var(--vp-font-family-base)" font-size="12" font-weight="600" fill="var(--lurus-dg-ink)">Personal</text>
  <text x="228" y="172" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="9" fill="var(--lurus-dg-soft)">solo dev · Lurus Hub</text>

  <rect x="140" y="280" width="176" height="72" rx="8" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1.2"/>
  <text x="228" y="312" text-anchor="middle" font-family="var(--vp-font-family-base)" font-size="12" font-weight="600" fill="var(--lurus-dg-ink)">Reseller</text>
  <text x="228" y="332" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="9" fill="var(--lurus-dg-soft)">runs hub · mints builds</text>

  <rect x="140" y="440" width="176" height="72" rx="8" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <text x="228" y="472" text-anchor="middle" font-family="var(--vp-font-family-base)" font-size="12" font-weight="600" fill="var(--lurus-dg-ink)">Enterprise</text>
  <text x="228" y="492" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="9" fill="var(--lurus-dg-soft)">SSO users · DLP gate</text>

  <rect x="600" y="120" width="220" height="72" rx="8" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <text x="710" y="152" text-anchor="middle" font-family="var(--vp-font-family-base)" font-size="12" font-weight="600" fill="var(--lurus-dg-ink)">Unactivated</text>
  <text x="710" y="172" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="9" fill="var(--lurus-dg-soft)">no token yet</text>

  <rect x="600" y="280" width="220" height="72" rx="8" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <text x="710" y="312" text-anchor="middle" font-family="var(--vp-font-family-base)" font-size="12" font-weight="600" fill="var(--lurus-dg-ink)">Active</text>
  <text x="710" y="332" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="9" fill="var(--lurus-dg-soft)">heartbeat running</text>

  <rect x="600" y="440" width="220" height="72" rx="8" fill="var(--lurus-dg-node)" stroke="var(--lurus-dg-ink)" stroke-width="1"/>
  <text x="710" y="472" text-anchor="middle" font-family="var(--vp-font-family-base)" font-size="12" font-weight="600" fill="var(--lurus-dg-ink)">Revoked / Mismatch</text>
  <text x="710" y="492" text-anchor="middle" font-family="var(--vp-font-family-mono)" font-size="9" fill="var(--lurus-dg-soft)">needs re-activation</text>

  <!-- fork label -->
  <text x="72" y="296" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-soft)">APP LAUNCH</text>

  <!-- header -->
  <text x="40" y="28" font-family="var(--vp-font-family-mono)" font-size="8" letter-spacing="0.16em" fill="var(--lurus-dg-soft)">LURUS SWITCH · 2C-GUI-SWITCH</text>
  <text x="40" y="56" font-family="var(--lurus-dg-serif)" font-size="20" font-weight="600" fill="var(--lurus-dg-ink)">Mode State Machine</text>

  <!-- legend -->
  <line x1="40" y1="568" x2="920" y2="568" stroke="color-mix(in srgb, var(--lurus-dg-ink) 12%, transparent)" stroke-width="0.8"/>
  <text x="40" y="584" font-family="var(--vp-font-family-mono)" font-size="8" letter-spacing="0.14em" fill="var(--lurus-dg-soft)">LEGEND</text>

  <line x1="140" y1="580" x2="164" y2="580" stroke="var(--lurus-dg-muted)" stroke-width="1.2" marker-end="url(#switch-arrow)"/>
  <text x="176" y="584" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">TRANSITION</text>

  <rect x="340" y="576" width="16" height="16" rx="2" fill="color-mix(in srgb, var(--lurus-dg-accent) 8%, transparent)" stroke="var(--lurus-dg-accent)" stroke-width="1"/>
  <text x="364" y="584" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">FOCAL MODE</text>

  <rect x="520" y="576" width="16" height="16" rx="2" fill="color-mix(in srgb, var(--lurus-dg-accent) 5%, transparent)" stroke="color-mix(in srgb, var(--lurus-dg-accent) 50%, transparent)" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="544" y="584" font-family="var(--vp-font-family-mono)" font-size="8" fill="var(--lurus-dg-muted)">ENDUSER STATES</text>

  <text x="40" y="604" font-family="var(--vp-font-family-mono)" font-size="7" fill="var(--lurus-dg-soft)">* SWITCH MODE = any unlocked mode can switch to any other via Settings · a MINT INSTALLER build is locked to EndUser until RESET</text>
  </svg>
</template>
