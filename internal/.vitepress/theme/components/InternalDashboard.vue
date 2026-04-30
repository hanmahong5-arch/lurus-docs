<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { products, byStatus, totalRisks, busFactorWarnings, staleProductCount } from '../../data/products'
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

// Re-evaluate "now" client-side so SSR doesn't bake a stale date into HTML.
const now = ref(new Date())
const staleCount = ref(staleProductCount(30))

interface BuildMeta { buildTime: string; gitSha: string; gitBranch: string }
const buildMeta = ref<BuildMeta | null>(null)

const buildAge = computed<string>(() => {
  if (!buildMeta.value) return '—'
  const ms = now.value.getTime() - Date.parse(buildMeta.value.buildTime)
  if (Number.isNaN(ms) || ms < 0) return '—'
  const min = Math.floor(ms / 60_000)
  if (min < 1) return '刚刚'
  if (min < 60) return `${min} 分钟前`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} 小时前`
  return `${Math.floor(hr / 24)} 天前`
})

const buildShortSha = computed<string>(() => buildMeta.value?.gitSha ?? '—')

onMounted(async () => {
  now.value = new Date()
  staleCount.value = staleProductCount(30, now.value)
  try {
    const res = await fetch('/build-meta.json', { cache: 'no-store' })
    if (res.ok) buildMeta.value = await res.json()
  } catch {
    // build-meta.json missing in dev — leave as null so KPI shows "—"
  }
})

function tone(metric: 'risk' | 'bus' | 'load' | 'stale'): 'good' | 'warn' | 'bad' {
  if (metric === 'risk') return riskCount === 0 ? 'good' : riskCount < 8 ? 'warn' : 'bad'
  if (metric === 'bus') return busFactorIssues === 0 ? 'good' : busFactorIssues < 5 ? 'warn' : 'bad'
  if (metric === 'load') return (prodLoad ?? 0) < 60 ? 'good' : (prodLoad ?? 0) < 85 ? 'warn' : 'bad'
  if (metric === 'stale') return staleCount.value === 0 ? 'good' : staleCount.value < 5 ? 'warn' : 'bad'
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
      <KPITile
        label="复审超期"
        :value="staleCount"
        hint=">30 天未复审产品"
        :tone="tone('stale')"
      />
      <KPITile
        label="最新部署"
        :value="buildAge"
        :hint="`sha ${buildShortSha}`"
      />
    </div>

    <h2 class="internal-dashboard__section">🗺️ 产品状态阵</h2>
    <ProductStatusGrid />

    <h2 class="internal-dashboard__section">🌐 服务器拓扑 + 容量</h2>
    <ServerTopology />

    <h2 class="internal-dashboard__section">🔗 产品依赖图谱</h2>
    <DependencyGraph />

    <h2 class="internal-dashboard__section">🧭 横向视角（跨产品）</h2>
    <div class="quick-links">
      <a href="/cross/" class="quick-link quick-link--cross">索引 · 14 产品全图</a>
      <a href="/cross/capability-matrix" class="quick-link quick-link--cross">能力矩阵</a>
      <a href="/cross/user-journeys" class="quick-link quick-link--cross">用户旅程（4 类用户）</a>
      <a href="/cross/integration-recipes" class="quick-link quick-link--cross">集成配方（8 个）</a>
      <a href="/cross/decision-router" class="quick-link quick-link--cross">决策路由</a>
    </div>

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
.quick-link--cross {
  border-left: 3px solid #82A0BC;
}
.quick-link--cross:hover {
  border-color: #82A0BC;
}
</style>
