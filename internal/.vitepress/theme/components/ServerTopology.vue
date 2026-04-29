<script setup lang="ts">
import { servers, buildTopologyMermaid } from '../../data/servers'
import MermaidBlock from './MermaidBlock.vue'

const chart = buildTopologyMermaid()

function utilTone(pct?: number): 'good' | 'warn' | 'bad' | 'neutral' {
  if (pct == null) return 'neutral'
  if (pct < 60) return 'good'
  if (pct < 85) return 'warn'
  return 'bad'
}
</script>

<template>
  <div class="server-topo">
    <MermaidBlock :chart="chart" id="server-topology" />

    <h3 class="server-topo__util-title">资源利用率（手填，待接 Prometheus）</h3>
    <div class="server-topo__util">
      <div v-for="s in servers" :key="s.id" class="server-topo__row">
        <div class="server-topo__name">
          <strong>{{ s.name }}</strong>
          <span class="server-topo__role">{{ s.role }}</span>
        </div>
        <div class="server-topo__bars">
          <div class="bar">
            <span class="bar__label">CPU</span>
            <div class="bar__track"><div class="bar__fill" :class="`tone-${utilTone(s.cpuPct)}`" :style="{ width: (s.cpuPct ?? 0) + '%' }"></div></div>
            <span class="bar__value">{{ s.cpuPct ?? '?' }}%</span>
          </div>
          <div class="bar">
            <span class="bar__label">MEM</span>
            <div class="bar__track"><div class="bar__fill" :class="`tone-${utilTone(s.memPct)}`" :style="{ width: (s.memPct ?? 0) + '%' }"></div></div>
            <span class="bar__value">{{ s.memPct ?? '?' }}%</span>
          </div>
          <div class="bar">
            <span class="bar__label">DISK</span>
            <div class="bar__track"><div class="bar__fill" :class="`tone-${utilTone(s.diskPct)}`" :style="{ width: (s.diskPct ?? 0) + '%' }"></div></div>
            <span class="bar__value">{{ s.diskPct ?? '?' }}%</span>
          </div>
        </div>
        <div class="server-topo__notes" v-if="s.notes">{{ s.notes }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.server-topo__util-title { margin-top: 24px; font-size: 14px; color: var(--vp-c-text-2); }
.server-topo__util { display: flex; flex-direction: column; gap: 12px; }
.server-topo__row {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 14px;
  background: var(--vp-c-bg-soft);
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 12px;
  align-items: start;
}
.server-topo__name strong { display: block; font-size: 13px; }
.server-topo__role { font-size: 11px; color: var(--vp-c-text-3); }
.server-topo__bars { display: flex; flex-direction: column; gap: 4px; }
.server-topo__notes { grid-column: 1 / -1; font-size: 11px; color: var(--vp-c-text-3); border-top: 1px dashed var(--vp-c-divider); padding-top: 6px; }
.bar { display: grid; grid-template-columns: 40px 1fr 50px; gap: 8px; align-items: center; font-size: 11px; }
.bar__label { color: var(--vp-c-text-3); font-family: monospace; }
.bar__value { text-align: right; font-family: monospace; }
.bar__track { background: var(--vp-c-default-soft); border-radius: 999px; height: 6px; overflow: hidden; }
.bar__fill { height: 100%; border-radius: 999px; transition: width 400ms ease; }
.bar__fill.tone-good { background: #22c55e; }
.bar__fill.tone-warn { background: #f59e0b; }
.bar__fill.tone-bad  { background: #ef4444; }
.bar__fill.tone-neutral { background: #94a3b8; }

@media (max-width: 700px) {
  .server-topo__row { grid-template-columns: 1fr; }
}
</style>
