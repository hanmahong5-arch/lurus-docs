<script setup lang="ts">
import { products, byStatus, totalRisks, busFactorWarnings } from '../../data/products'
import { servers } from '../../data/servers'
import KPITile from './KPITile.vue'
import ProductStatusGrid from './ProductStatusGrid.vue'
import ServerTopology from './ServerTopology.vue'
import DependencyGraph from './DependencyGraph.vue'

const statusBreakdown = byStatus()
const totalProducts = products.length
const liveCount = statusBreakdown.live
const wipCount = statusBreakdown.beta + statusBreakdown.dev
const planningCount = statusBreakdown.planning
const riskCount = totalRisks()
const busFactorIssues = busFactorWarnings()
const serverCount = servers.length
const prodLoad = servers.find((s) => s.id === 'r1')?.memPct ?? null

function tone(metric: 'risk' | 'bus' | 'load'): 'good' | 'warn' | 'bad' {
  if (metric === 'risk') return riskCount === 0 ? 'good' : riskCount < 8 ? 'warn' : 'bad'
  if (metric === 'bus') return busFactorIssues === 0 ? 'good' : busFactorIssues < 5 ? 'warn' : 'bad'
  if (metric === 'load') return (prodLoad ?? 0) < 60 ? 'good' : (prodLoad ?? 0) < 85 ? 'warn' : 'bad'
  return 'good'
}
</script>

<template>
  <div class="internal-dashboard">
    <div class="internal-banner">
      <strong>⚠ Lurus 员工内部知识库</strong>
      <span>包含未公开运维细节与决策档案。请勿外传，不要截图发到公开聊天群。</span>
    </div>

    <h2 class="internal-dashboard__section">⚡ KPI 一屏</h2>
    <div class="lurus-grid lurus-grid--kpi">
      <KPITile label="产品总数" :value="totalProducts" hint="14 条产品线" />
      <KPITile label="生产线上" :value="liveCount" hint="status=live" tone="good" />
      <KPITile label="建设中" :value="wipCount" hint="beta + dev" tone="warn" />
      <KPITile label="规划阶段" :value="planningCount" hint="planning" />
      <KPITile label="服务器" :value="serverCount" hint="R1+R6+agents+edge" />
      <KPITile
        label="风险信号"
        :value="riskCount"
        hint="全产品累计 riskFlags"
        :tone="tone('risk')"
      />
      <KPITile
        label="Bus Factor=1"
        :value="busFactorIssues"
        hint="单点故障产品数"
        :tone="tone('bus')"
      />
      <KPITile
        label="R1 内存"
        :value="(prodLoad ?? '—') + '%'"
        hint="生产主节点"
        :tone="tone('load')"
      />
    </div>

    <h2 class="internal-dashboard__section">🗺️ 产品状态阵</h2>
    <ProductStatusGrid />

    <h2 class="internal-dashboard__section">🌐 服务器拓扑 + 容量</h2>
    <ServerTopology />

    <h2 class="internal-dashboard__section">🔗 产品依赖图谱</h2>
    <DependencyGraph />

    <h2 class="internal-dashboard__section">📚 快速通道</h2>
    <div class="quick-links">
      <a href="/ops/" class="quick-link">运维 SOP</a>
      <a href="/adr/" class="quick-link">ADR 决策档案</a>
      <a href="/postmortems/" class="quick-link">事故复盘</a>
      <a href="/onboarding/" class="quick-link">入职指引</a>
      <a href="/org/" class="quick-link">组织 / Bus Factor</a>
      <a href="/roadmap/" class="quick-link">路线图（with confidence）</a>
    </div>
  </div>
</template>

<style scoped>
.internal-dashboard__section {
  margin-top: 36px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 8px;
}
.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}
.quick-link {
  display: block;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  background: var(--vp-c-bg-soft);
  font-weight: 500;
  transition: transform 200ms ease, border-color 200ms ease;
}
.quick-link:hover {
  transform: translateY(-2px);
  border-color: #C67B5C;
}
</style>
