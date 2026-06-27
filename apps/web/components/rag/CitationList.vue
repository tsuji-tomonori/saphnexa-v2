<script setup lang="ts">
import type { Citation } from '~/composables/useRagChat'

defineProps<{ citations: readonly Citation[] }>()
const emit = defineEmits<{ preview: [citation: Citation] }>()
</script>

<template>
  <div v-if="citations.length" class="flex flex-wrap gap-2 pt-3">
    <UButton
      v-for="citation in citations"
      :key="citation.id"
      color="neutral"
      variant="soft"
      size="xs"
      icon="i-lucide-file-search"
      @click="emit('preview', citation)"
    >
      {{ citation.title }}<span v-if="citation.page"> p.{{ citation.page }}</span>
    </UButton>
  </div>
</template>
