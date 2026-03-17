import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
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
import './style.css'

export default {
  extends: DefaultTheme,
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
  }
} satisfies Theme
