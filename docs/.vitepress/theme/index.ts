import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Badge from './components/Badge.vue'
import ApiEndpoint from './components/ApiEndpoint.vue'
import ProductCard from './components/ProductCard.vue'
import ModelTable from './components/ModelTable.vue'
import ActionCard from './components/ActionCard.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Badge', Badge)
    app.component('ApiEndpoint', ApiEndpoint)
    app.component('ProductCard', ProductCard)
    app.component('ModelTable', ModelTable)
    app.component('ActionCard', ActionCard)
  }
} satisfies Theme
