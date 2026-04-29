import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import NotFound from './components/NotFound.vue'
import Badge from './components/Badge.vue'
import ApiEndpoint from './components/ApiEndpoint.vue'
import ProductCard from './components/ProductCard.vue'
import ModelTable from './components/ModelTable.vue'
import ActionCard from './components/ActionCard.vue'
import UpdatesFeed from './components/UpdatesFeed.vue'
import UpdateCard from './components/UpdateCard.vue'
import UpdateFilters from './components/UpdateFilters.vue'
import AdminLayout from './components/AdminLayout.vue'
import AdminUpdates from './components/AdminUpdates.vue'
import AdminProducts from './components/AdminProducts.vue'
import AdminEditor from './components/AdminEditor.vue'
import InternalLayout from './components/InternalLayout.vue'
import InternalContent from './components/InternalContent.vue'
import InternalSection from './components/InternalSection.vue'
import StatusBadge from './components/StatusBadge.vue'
import Term from './components/Term.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import Icon from './components/Icon.vue'
import CopyButton from './components/CopyButton.vue'
import Hero from './components/Hero.vue'
import ProductLanding from './components/landing/ProductLanding.vue'
import ProductHero from './components/landing/ProductHero.vue'
import CapabilityGrid from './components/landing/CapabilityGrid.vue'
import ArchitectureDiagram from './components/landing/ArchitectureDiagram.vue'
import CodeShowcase from './components/landing/CodeShowcase.vue'
import UserScenarios from './components/landing/UserScenarios.vue'
import ComparisonTable from './components/landing/ComparisonTable.vue'
import RelatedProducts from './components/landing/RelatedProducts.vue'
import NextSteps from './components/landing/NextSteps.vue'
import MetricStats from './components/landing/MetricStats.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound),
      'doc-before': () => h(Breadcrumb),
    })
  },
  enhanceApp({ app }) {
    app.component('Badge', Badge)
    app.component('ApiEndpoint', ApiEndpoint)
    app.component('ProductCard', ProductCard)
    app.component('ModelTable', ModelTable)
    app.component('ActionCard', ActionCard)
    app.component('UpdatesFeed', UpdatesFeed)
    app.component('UpdateCard', UpdateCard)
    app.component('UpdateFilters', UpdateFilters)
    app.component('AdminLayout', AdminLayout)
    app.component('AdminUpdates', AdminUpdates)
    app.component('AdminProducts', AdminProducts)
    app.component('AdminEditor', AdminEditor)
    app.component('InternalLayout', InternalLayout)
    app.component('InternalContent', InternalContent)
    app.component('InternalSection', InternalSection)
    app.component('StatusBadge', StatusBadge)
    app.component('Term', Term)
    app.component('Icon', Icon)
    app.component('CopyButton', CopyButton)
    app.component('Hero', Hero)
    app.component('ProductLanding', ProductLanding)
    app.component('ProductHero', ProductHero)
    app.component('CapabilityGrid', CapabilityGrid)
    app.component('ArchitectureDiagram', ArchitectureDiagram)
    app.component('CodeShowcase', CodeShowcase)
    app.component('UserScenarios', UserScenarios)
    app.component('ComparisonTable', ComparisonTable)
    app.component('RelatedProducts', RelatedProducts)
    app.component('NextSteps', NextSteps)
    app.component('MetricStats', MetricStats)
  }
} satisfies Theme
