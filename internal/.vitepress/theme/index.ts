import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'
import './lurus-utilities.css'

import Icon from './components/Icon.vue'
import InternalDashboard from './components/InternalDashboard.vue'
import ProductStatusGrid from './components/ProductStatusGrid.vue'
import ServerTopology from './components/ServerTopology.vue'
import DependencyGraph from './components/DependencyGraph.vue'
import KPITile from './components/KPITile.vue'
import RiskBadge from './components/RiskBadge.vue'
import OwnershipMatrix from './components/OwnershipMatrix.vue'
import MermaidBlock from './components/MermaidBlock.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Icon', Icon)
    app.component('InternalDashboard', InternalDashboard)
    app.component('ProductStatusGrid', ProductStatusGrid)
    app.component('ServerTopology', ServerTopology)
    app.component('DependencyGraph', DependencyGraph)
    app.component('KPITile', KPITile)
    app.component('RiskBadge', RiskBadge)
    app.component('OwnershipMatrix', OwnershipMatrix)
    app.component('MermaidBlock', MermaidBlock)
  },
} satisfies Theme
