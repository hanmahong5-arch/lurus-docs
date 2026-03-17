<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  products: { id: string; name: string; color: string }[]
  selectedProduct: string
  selectedType: string
}>()

const emit = defineEmits<{
  'update:selectedProduct': [value: string]
  'update:selectedType': [value: string]
}>()

const UPDATE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'feature', label: 'New Feature' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'bugfix', label: 'Bug Fix' },
  { value: 'security', label: 'Security' },
  { value: 'deprecation', label: 'Deprecation' },
  { value: 'launch', label: 'Launch' },
  { value: 'sunset', label: 'Sunset' },
]

const productOptions = computed(() => [
  { value: '', label: 'All Products' },
  ...props.products.map(p => ({ value: p.id, label: p.name })),
])
</script>

<template>
  <div class="update-filters">
    <select
      class="filter-select"
      :value="selectedProduct"
      @change="emit('update:selectedProduct', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in productOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <select
      class="filter-select"
      :value="selectedType"
      @change="emit('update:selectedType', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in UPDATE_TYPES" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.update-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}
.filter-select:focus {
  border-color: var(--vp-c-brand-1);
}
</style>
