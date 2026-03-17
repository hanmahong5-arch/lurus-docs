<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useProducts, useUpdates } from '../composables/useApi'
import UpdateCard from './UpdateCard.vue'
import UpdateFilters from './UpdateFilters.vue'

const { products, fetch: fetchProducts } = useProducts()
const { updates, loading, hasMore, total, fetch: fetchUpdates } = useUpdates()

const selectedProduct = ref('')
const selectedType = ref('')
const page = ref(1)
const LIMIT = 20

function productMap(): Map<string, { name: string; color: string }> {
  const m = new Map()
  for (const p of products.value) {
    m.set(p.id, { name: p.name, color: p.color })
  }
  return m
}

async function loadUpdates() {
  await fetchUpdates({
    product: selectedProduct.value || undefined,
    type: selectedType.value || undefined,
    page: page.value,
    limit: LIMIT,
  })
}

function loadMore() {
  page.value++
  loadUpdates()
}

watch([selectedProduct, selectedType], () => {
  page.value = 1
  loadUpdates()
})

onMounted(async () => {
  await fetchProducts('active')
  await loadUpdates()
})
</script>

<template>
  <div class="updates-feed">
    <UpdateFilters
      :products="products"
      v-model:selectedProduct="selectedProduct"
      v-model:selectedType="selectedType"
    />

    <div v-if="loading && updates.length === 0" class="updates-loading">
      Loading...
    </div>

    <div v-else-if="updates.length === 0" class="updates-empty">
      No updates found.
    </div>

    <template v-else>
      <UpdateCard
        v-for="u in updates"
        :key="u.id"
        :title="u.title"
        :type="u.type"
        :product-name="productMap().get(u.product_id)?.name || u.product_id"
        :product-color="productMap().get(u.product_id)?.color || '#C67B5C'"
        :version="u.version"
        :content="u.content"
        :published-at="u.published_at"
        :is-major="!!u.is_major"
      />

      <div v-if="hasMore" class="updates-load-more">
        <button class="load-more-btn" :disabled="loading" @click="loadMore">
          {{ loading ? 'Loading...' : 'Load More' }}
        </button>
      </div>

      <div class="updates-total">
        {{ total }} updates total
      </div>
    </template>
  </div>
</template>

<style scoped>
.updates-feed {
  max-width: 720px;
}

.updates-loading,
.updates-empty {
  text-align: center;
  padding: 48px 0;
  color: var(--vp-c-text-3);
  font-size: 15px;
}

.updates-load-more {
  text-align: center;
  padding: 16px 0;
}

.load-more-btn {
  padding: 8px 24px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.load-more-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-soft);
}
.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.updates-total {
  text-align: center;
  padding: 8px 0 24px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}
</style>
