<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  products,
  byStatus,
  totalRisks,
  busFactorWarnings,
  staleProductCount,
  riskLabels,
  groupColors,
  statusColors,
  daysSince,
  type InternalProduct,
} from '../../data/products'
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

const nowLabel = computed<string>(() =>
  now.value.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
)

// Aggregate health: worst of (risk / bus / load / stale)
const healthState = computed<'good' | 'warn' | 'bad'>(() => {
  const tones = [tone('risk'), tone('bus'), tone('load'), tone('stale')]
  if (tones.includes('bad')) return 'bad'
  if (tones.includes('warn')) return 'warn'
  return 'good'
})

const healthLabel = computed<string>(() => ({
  good: '运行正常',
  warn: '需关注',
  bad: '需立即处理',
}[healthState.value]))

// Today's focus — surface top risk products: bus=1 AND riskFlags>=2, ranked by priority then risk count.
const focusProducts = computed<InternalProduct[]>(() => {
  const priorityRank: Record<string, number> = { P0: 0, P1: 1, P2: 2 }
  return [...products]
    .filter((p) => p.busFactor < 2 && p.riskFlags.length >= 1)
    .sort((a, b) => {
      const dp = priorityRank[a.priority] - priorityRank[b.priority]
      if (dp !== 0) return dp
      return b.riskFlags.length - a.riskFlags.length
    })
    .slice(0, 6)
})

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

function reviewedHint(iso: string): string {
  const d = daysSince(iso, now.value)
  if (d < 0) return '日期未知'
  if (d === 0) return '今日复审'
  return `${d} 天前复审`
}
</script>

<template>
  <div class="internal-dashboard">
    <!-- ─── 红线警示横幅 ─────────────────────────────── -->
    <aside class="ops-banner" role="note">
      <div class="ops-banner__stripe" aria-hidden="true"></div>
      <div class="ops-banner__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>
      <div class="ops-banner__body">
        <strong class="ops-banner__title">Lurus 员工内部知识库</strong>
        <span class="ops-banner__copy">含未公开运维细节、决策档案、Bus Factor 数据。请勿外传，禁止截图发到公开聊天群。</span>
      </div>
      <div class="ops-banner__chip" :title="'打开时刻：' + nowLabel">
        <span class="ops-banner__dot" />
        <span>{{ nowLabel }}</span>
      </div>
    </aside>

    <!-- ─── 驾驶舱状态条 ─────────────────────────────── -->
    <div class="ops-bar" :data-tone="healthState">
      <div class="ops-bar__cell ops-bar__cell--health">
        <span class="ops-bar__beacon" :class="`ops-bar__beacon--${healthState}`" aria-hidden="true">
          <span class="ops-bar__beacon-pulse" />
        </span>
        <span class="ops-bar__cell-label">整体健康</span>
        <span class="ops-bar__cell-value">{{ healthLabel }}</span>
      </div>
      <div class="ops-bar__cell">
        <span class="ops-bar__cell-label">最新部署</span>
        <span class="ops-bar__cell-value">{{ buildAge }}</span>
        <span class="ops-bar__cell-hint">sha {{ buildShortSha }}</span>
      </div>
      <div class="ops-bar__cell">
        <span class="ops-bar__cell-label">风险信号</span>
        <span class="ops-bar__cell-value" :class="`ops-bar__value--${tone('risk')}`">
          {{ riskCount }}
        </span>
        <span class="ops-bar__cell-hint">全产品累计</span>
      </div>
      <div class="ops-bar__cell">
        <span class="ops-bar__cell-label">Bus=1</span>
        <span class="ops-bar__cell-value" :class="`ops-bar__value--${tone('bus')}`">
          {{ busFactorIssues }}
        </span>
        <span class="ops-bar__cell-hint">单点故障</span>
      </div>
      <div class="ops-bar__cell">
        <span class="ops-bar__cell-label">R1 内存</span>
        <span class="ops-bar__cell-value" :class="`ops-bar__value--${tone('load')}`">
          {{ prodLoad ?? '—' }}<small>%</small>
        </span>
        <span class="ops-bar__cell-hint">PROD master</span>
      </div>
      <div class="ops-bar__cell">
        <span class="ops-bar__cell-label">复审超期</span>
        <span class="ops-bar__cell-value" :class="`ops-bar__value--${tone('stale')}`">
          {{ staleCount }}
        </span>
        <span class="ops-bar__cell-hint">&gt; 30 天</span>
      </div>
    </div>

    <!-- ─── 今日焦点（surface 高风险产品） ──────────────── -->
    <section v-if="focusProducts.length" class="focus-block">
      <header class="section-header">
        <span class="section-header__eyebrow">FOCUS</span>
        <h2 class="section-header__title">今日焦点</h2>
        <span class="section-header__hint">Bus=1 且有风险信号的产品 · 优先 P0/P1</span>
      </header>
      <ul class="focus-list">
        <li v-for="p in focusProducts" :key="p.id" class="focus-item">
          <a :href="p.manualPath" class="focus-item__link"
             :style="{ '--accent': groupColors[p.group] }">
            <span class="focus-item__dot" :style="{ background: statusColors[p.status] }" />
            <span class="focus-item__name">{{ p.name }}</span>
            <span class="focus-item__priority">{{ p.priority }}</span>
            <span class="focus-item__owner">owner {{ p.owner }} · bus {{ p.busFactor }}</span>
            <span class="focus-item__flags">
              <span v-for="f in p.riskFlags" :key="f" class="focus-item__flag">
                {{ riskLabels[f] || f }}
              </span>
            </span>
            <span class="focus-item__reviewed">{{ reviewedHint(p.lastReviewed) }}</span>
          </a>
        </li>
      </ul>
    </section>

    <!-- ─── KPI 一屏 ──────────────────────────────── -->
    <header class="section-header">
      <span class="section-header__eyebrow">KPI</span>
      <h2 class="section-header__title">一屏概况</h2>
      <span class="section-header__hint">{{ totalProducts }} 条产品线 · {{ serverCount }} 节点</span>
    </header>
    <div class="lurus-grid lurus-grid--kpi">
      <KPITile label="产品总数" :value="totalProducts" hint="全产品线" />
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

    <!-- ─── 产品状态阵 ─────────────────────────────── -->
    <header class="section-header">
      <span class="section-header__eyebrow">PRODUCTS</span>
      <h2 class="section-header__title">产品状态阵</h2>
      <span class="section-header__hint">按产品组分组 · 颜色 = 部门 · 圆点 = 状态</span>
    </header>
    <ProductStatusGrid />

    <!-- ─── 服务器拓扑 ─────────────────────────────── -->
    <header class="section-header">
      <span class="section-header__eyebrow">INFRA</span>
      <h2 class="section-header__title">服务器拓扑 + 容量</h2>
      <span class="section-header__hint">PROD R1 · STAGE R6 · 边缘 + agents</span>
    </header>
    <ServerTopology />

    <!-- ─── 依赖图谱 ─────────────────────────────── -->
    <header class="section-header">
      <span class="section-header__eyebrow">DEPENDENCY</span>
      <h2 class="section-header__title">产品依赖图谱</h2>
      <span class="section-header__hint">Mermaid 自动生成 · capabilities 段为真源</span>
    </header>
    <DependencyGraph />

    <!-- ─── 横向视角（主） ─────────────────────────── -->
    <header class="section-header">
      <span class="section-header__eyebrow">CROSS</span>
      <h2 class="section-header__title">横向视角</h2>
      <span class="section-header__hint">站在用户/产品组之上的 4 类视角</span>
    </header>
    <div class="quick-grid">
      <a href="/cross/" class="quick-card quick-card--primary">
        <span class="quick-card__title">索引</span>
        <span class="quick-card__hint">14 产品全图</span>
      </a>
      <a href="/cross/capability-matrix" class="quick-card">
        <span class="quick-card__title">能力矩阵</span>
        <span class="quick-card__hint">谁提供了什么 capability</span>
      </a>
      <a href="/cross/user-journeys" class="quick-card">
        <span class="quick-card__title">用户旅程</span>
        <span class="quick-card__hint">4 类用户 × 跨产品路径</span>
      </a>
      <a href="/cross/integration-recipes" class="quick-card">
        <span class="quick-card__title">集成配方</span>
        <span class="quick-card__hint">8 个端到端示例</span>
      </a>
      <a href="/cross/decision-router" class="quick-card">
        <span class="quick-card__title">决策路由</span>
        <span class="quick-card__hint">遇到 X 该用谁</span>
      </a>
    </div>

    <!-- ─── 辅助参考（次） ─────────────────────────── -->
    <header class="section-header">
      <span class="section-header__eyebrow">REFERENCE</span>
      <h2 class="section-header__title">运维 · 决策 · 复盘</h2>
      <span class="section-header__hint">流程性文档 · 按需查阅</span>
    </header>
    <div class="quick-strip">
      <a href="/ops/" class="quick-strip__item">运维 SOP</a>
      <a href="/adr/" class="quick-strip__item">ADR 决策档案</a>
      <a href="/postmortems/" class="quick-strip__item">事故复盘</a>
      <a href="/onboarding/" class="quick-strip__item">入职指引</a>
      <a href="/org/" class="quick-strip__item">组织 · Bus Factor</a>
      <a href="/roadmap/" class="quick-strip__item">路线图</a>
    </div>
  </div>
</template>

<style scoped>
/* ─── Warning banner ───────────────────────────── */
.ops-banner {
  position: relative;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 14px;
  margin: 16px 0 20px;
  padding: 14px 18px 14px 22px;
  background: linear-gradient(90deg,
    color-mix(in srgb, #b91c1c 8%, var(--vp-c-bg-soft)),
    var(--vp-c-bg-soft));
  border: 1px solid color-mix(in srgb, #b91c1c 25%, var(--vp-c-divider));
  border-radius: 10px;
  overflow: hidden;
}
.ops-banner__stripe {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: #b91c1c;
}
.dark .ops-banner {
  background: linear-gradient(90deg,
    color-mix(in srgb, #ef4444 18%, var(--vp-c-bg-soft)),
    var(--vp-c-bg-soft));
  border-color: color-mix(in srgb, #ef4444 35%, var(--vp-c-divider));
}
.dark .ops-banner__stripe { background: #ef4444; }
.ops-banner__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: color-mix(in srgb, #b91c1c 14%, transparent);
  color: #b91c1c;
  flex-shrink: 0;
}
.dark .ops-banner__icon {
  background: color-mix(in srgb, #ef4444 18%, transparent);
  color: #fca5a5;
}
.ops-banner__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.ops-banner__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: 0.01em;
}
.ops-banner__copy {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.ops-banner__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  white-space: nowrap;
}
.ops-banner__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px color-mix(in srgb, #22c55e 28%, transparent);
}
@media (max-width: 720px) {
  .ops-banner { grid-template-columns: auto 1fr; }
  .ops-banner__chip { grid-column: 1 / -1; justify-self: start; }
}

/* ─── Ops bar ──────────────────────────────────── */
.ops-bar {
  display: grid;
  grid-template-columns: 1.4fr repeat(5, 1fr);
  gap: 0;
  margin: 0 0 28px;
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid #22c55e;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.ops-bar[data-tone="warn"] { border-left-color: #f59e0b; }
.ops-bar[data-tone="bad"]  { border-left-color: #ef4444; }
.ops-bar__cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 16px;
  border-right: 1px solid var(--vp-c-divider);
  min-width: 0;
}
.ops-bar__cell:last-child { border-right: none; }
.ops-bar__cell--health {
  background: color-mix(in srgb, var(--vp-c-bg-soft) 70%, transparent);
}
.ops-bar__cell-label {
  font-size: 10px;
  letter-spacing: 0.08em;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}
.ops-bar__cell-value {
  font-size: 18px;
  font-weight: 700;
  font-feature-settings: 'tnum';
  color: var(--vp-c-text-1);
  line-height: 1.2;
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
}
.ops-bar__cell-value small { font-size: 11px; color: var(--vp-c-text-3); font-weight: 500; }
.ops-bar__value--good { color: #16a34a; }
.ops-bar__value--warn { color: #d97706; }
.ops-bar__value--bad  { color: #dc2626; }
.dark .ops-bar__value--good { color: #4ade80; }
.dark .ops-bar__value--warn { color: #fbbf24; }
.dark .ops-bar__value--bad  { color: #f87171; }
.ops-bar__cell-hint {
  font-size: 10px;
  color: var(--vp-c-text-3);
}
.ops-bar__beacon {
  position: relative;
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-bottom: 2px;
}
.ops-bar__beacon--good { background: #22c55e; box-shadow: 0 0 0 4px color-mix(in srgb, #22c55e 22%, transparent); }
.ops-bar__beacon--warn { background: #f59e0b; box-shadow: 0 0 0 4px color-mix(in srgb, #f59e0b 22%, transparent); }
.ops-bar__beacon--bad  { background: #ef4444; box-shadow: 0 0 0 4px color-mix(in srgb, #ef4444 25%, transparent); }
.ops-bar__beacon-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: inherit;
  opacity: 0.6;
  animation: opsPulse 2s ease-out infinite;
}
@keyframes opsPulse {
  0%   { transform: scale(1);   opacity: 0.6; }
  70%  { transform: scale(2.4); opacity: 0; }
  100% { transform: scale(2.4); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .ops-bar__beacon-pulse { animation: none; }
}
@media (max-width: 900px) {
  .ops-bar { grid-template-columns: 1fr 1fr 1fr; }
  .ops-bar__cell { border-right: none; border-bottom: 1px solid var(--vp-c-divider); }
  .ops-bar__cell:nth-last-child(-n+3) { border-bottom: none; }
}
@media (max-width: 540px) {
  .ops-bar { grid-template-columns: 1fr 1fr; }
  .ops-bar__cell { border-bottom: 1px solid var(--vp-c-divider); }
  .ops-bar__cell:nth-last-child(-n+2) { border-bottom: none; }
}

/* ─── Section header (eyebrow + title) ──────────── */
.section-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 32px 0 14px;
  padding: 0 0 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}
.section-header__eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #C67B5C;
  padding: 2px 8px;
  border: 1px solid color-mix(in srgb, #C67B5C 35%, transparent);
  border-radius: 4px;
  background: color-mix(in srgb, #C67B5C 8%, transparent);
}
.dark .section-header__eyebrow { color: #E8A87C; }
.section-header__title {
  font-size: 17px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
  border: none !important;
  padding: 0 !important;
}
.section-header__hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-left: auto;
}
@media (max-width: 540px) {
  .section-header__hint { margin-left: 0; flex-basis: 100%; }
}

/* ─── Today's focus block ──────────────────────── */
.focus-block { margin-bottom: 8px; }
.focus-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.focus-item__link {
  display: grid;
  grid-template-columns: auto 1.2fr auto auto 2fr auto;
  gap: 12px;
  align-items: center;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-left: 3px solid var(--accent, #C67B5C);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: transform 200ms ease, border-color 200ms ease;
}
.focus-item__link:hover {
  transform: translateX(2px);
  border-color: var(--accent);
}
.focus-item__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}
.focus-item__name {
  font-size: 14px;
  font-weight: 600;
}
.focus-item__priority {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}
.focus-item__owner {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  white-space: nowrap;
}
.focus-item__flags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.focus-item__flag {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 3px;
  background: color-mix(in srgb, #d97706 12%, transparent);
  color: #b45309;
  border: 1px solid color-mix(in srgb, #d97706 22%, transparent);
}
.dark .focus-item__flag {
  background: color-mix(in srgb, #fbbf24 14%, transparent);
  color: #fbbf24;
  border-color: color-mix(in srgb, #fbbf24 30%, transparent);
}
.focus-item__reviewed {
  font-size: 11px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}
@media (max-width: 900px) {
  .focus-item__link {
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    grid-row-gap: 4px;
  }
  .focus-item__owner,
  .focus-item__flags,
  .focus-item__reviewed {
    grid-column: 1 / -1;
  }
}

/* ─── Quick links — primary cards ──────────────── */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 8px;
}
.quick-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}
.quick-card:hover {
  transform: translateY(-2px);
  border-color: #82A0BC;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.quick-card--primary {
  border-left: 3px solid #82A0BC;
  background: color-mix(in srgb, #82A0BC 8%, var(--vp-c-bg-soft));
}
.quick-card__title { font-size: 14px; font-weight: 600; }
.quick-card__hint { font-size: 11px; color: var(--vp-c-text-3); }

/* ─── Quick links — secondary strip ────────────── */
.quick-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.quick-strip__item {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2) !important;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none !important;
  transition: border-color 180ms ease, color 180ms ease;
}
.quick-strip__item:hover {
  border-color: #C67B5C;
  color: #C67B5C !important;
}
</style>
