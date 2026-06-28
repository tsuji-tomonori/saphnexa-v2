<script setup lang="ts">
import type { Citation } from '~/composables/useRagChat'

defineProps<{ citations: readonly Citation[] }>()
const emit = defineEmits<{ preview: [citation: Citation] }>()
</script>

<template>
  <div v-if="citations.length" class="mt-3 space-y-2">
    <p class="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-500">
      引用元 {{ citations.length }} 件
    </p>
    <button
      v-for="(citation, index) in citations"
      :key="citation.id"
      type="button"
      class="group flex w-full gap-3.5 rounded-xl border border-ink-200 bg-white p-4 text-left transition-colors hover:border-primary-200 hover:bg-iris-50/40 dark:border-ink-800 dark:bg-ink-900"
      @click="emit('preview', citation)"
    >
      <FileTypeBadge :file-name="citation.title" :size="34" />
      <div class="min-w-0 flex-1">
        <div class="mb-1.5 flex items-center gap-2">
          <span
            class="flex size-[18px] flex-none items-center justify-center rounded-[5px] bg-primary font-mono text-[10px] font-bold text-white"
          >
            {{ index + 1 }}
          </span>
          <span class="truncate text-sm font-bold text-ink-900 dark:text-ink-100">
            {{ citation.title }}
          </span>
        </div>
        <p
          class="mb-2 rounded-r-md border-l-2 border-iris-200 bg-ink-50 px-3 py-2 text-[13px] leading-relaxed text-ink-700 dark:bg-ink-800 dark:text-ink-300"
        >
          「{{ citation.excerpt }}」
        </p>
        <div class="flex items-center gap-3 font-mono text-[11px] font-medium text-ink-500">
          <span v-if="citation.page">p.{{ citation.page }}</span>
          <span class="ml-auto text-primary group-hover:underline">原典を開く →</span>
        </div>
      </div>
    </button>
  </div>
</template>
