<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPreview = ref(false)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div class="admin-editor">
    <div class="editor-toolbar">
      <button
        class="toolbar-btn"
        :class="{ active: !showPreview }"
        @click="showPreview = false"
      >
        Edit
      </button>
      <button
        class="toolbar-btn"
        :class="{ active: showPreview }"
        @click="showPreview = true"
      >
        Preview
      </button>
    </div>

    <textarea
      v-if="!showPreview"
      class="editor-textarea"
      :value="modelValue"
      @input="onInput"
      placeholder="Write content (supports HTML)..."
      rows="8"
    />

    <div v-else class="editor-preview" v-html="modelValue || '<em>No content</em>'" />
  </div>
</template>

<style scoped>
.admin-editor {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-mute);
}

.toolbar-btn {
  padding: 6px 16px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.toolbar-btn.active {
  color: var(--vp-c-brand-1);
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.editor-textarea {
  width: 100%;
  min-height: 200px;
  padding: 12px;
  border: none;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
}

.editor-preview {
  min-height: 200px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}
</style>
