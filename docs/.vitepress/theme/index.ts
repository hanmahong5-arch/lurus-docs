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
import GlossaryView from './components/GlossaryView.vue'
import IntegrationsView from './components/IntegrationsView.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import StaleBanner from './components/StaleBanner.vue'
import Icon from './components/Icon.vue'
import CopyButton from './components/CopyButton.vue'
import Hero from './components/Hero.vue'
import ProductLanding from './components/landing/ProductLanding.vue'
import ProductHero from './components/landing/ProductHero.vue'
import CapabilityGrid from './components/landing/CapabilityGrid.vue'
import ArchitectureDiagram from './components/landing/ArchitectureDiagram.vue'
import CodeShowcase from './components/landing/CodeShowcase.vue'
import ModelPicker from './components/landing/ModelPicker.vue'
import UserScenarios from './components/landing/UserScenarios.vue'
import ComparisonTable from './components/landing/ComparisonTable.vue'
import RelatedProducts from './components/landing/RelatedProducts.vue'
import NextSteps from './components/landing/NextSteps.vue'
import MetricStats from './components/landing/MetricStats.vue'
// 静态架构图：SVG 写在 template 里 → 首屏 HTML 就有图。
// 与 landing/ArchitectureDiagram.vue（客户端跑 mermaid）并存，新页面用这一套。
// diagrams/*Architecture.vue 由 `bun run diagrams` 从各产品仓的
// docs/diagrams/architecture.svg 生成（README 用的同一张图，只换肤不改图形）。
import DiagramFigure from './components/diagrams/DiagramFigure.vue'
import KovaArchitecture from './components/diagrams/KovaArchitecture.vue'
import MemxArchitecture from './components/diagrams/MemxArchitecture.vue'
import LumenArchitecture from './components/diagrams/LumenArchitecture.vue'
import ForgeArchitecture from './components/diagrams/ForgeArchitecture.vue'
import SwitchArchitecture from './components/diagrams/SwitchArchitecture.vue'
import HubArchitecture from './components/diagrams/HubArchitecture.vue'
import TallyArchitecture from './components/diagrams/TallyArchitecture.vue'
// 这两张是平台级手写图，没有对应的产品仓源 SVG，不受 `bun run diagrams` 管辖
import PlatformLayers from './components/diagrams/PlatformLayers.vue'
import RelayRequestPath from './components/diagrams/RelayRequestPath.vue'
import './style.css'
import './custom.css'
import './diagrams.css'
import './lurus-utilities.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound),
      'doc-before': () => [h(Breadcrumb), h(StaleBanner)],
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
    app.component('GlossaryView', GlossaryView)
    app.component('IntegrationsView', IntegrationsView)
    app.component('Icon', Icon)
    app.component('CopyButton', CopyButton)
    app.component('Hero', Hero)
    app.component('ProductLanding', ProductLanding)
    app.component('ProductHero', ProductHero)
    app.component('CapabilityGrid', CapabilityGrid)
    app.component('ArchitectureDiagram', ArchitectureDiagram)
    app.component('CodeShowcase', CodeShowcase)
    app.component('ModelPicker', ModelPicker)
    app.component('UserScenarios', UserScenarios)
    app.component('ComparisonTable', ComparisonTable)
    app.component('RelatedProducts', RelatedProducts)
    app.component('NextSteps', NextSteps)
    app.component('MetricStats', MetricStats)
    app.component('DiagramFigure', DiagramFigure)
    app.component('KovaArchitecture', KovaArchitecture)
    app.component('MemxArchitecture', MemxArchitecture)
    app.component('LumenArchitecture', LumenArchitecture)
    app.component('ForgeArchitecture', ForgeArchitecture)
    app.component('SwitchArchitecture', SwitchArchitecture)
    app.component('HubArchitecture', HubArchitecture)
    app.component('TallyArchitecture', TallyArchitecture)
    app.component('PlatformLayers', PlatformLayers)
    app.component('RelayRequestPath', RelayRequestPath)
  }
} satisfies Theme
