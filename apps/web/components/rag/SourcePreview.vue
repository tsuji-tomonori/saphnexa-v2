<script setup lang="ts">
import type { Citation } from '~/composables/useRagChat'

defineProps<{ citation: Citation | undefined }>()
const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <USlideover
    v-model:open="open"
    title="引用元プレビュー"
    description="回答根拠として返された文書抜粋を確認します。"
  >
    <template #body>
      <UCard v-if="citation" variant="subtle">
        <template #header>
          <div class="flex items-start gap-3">
            <FileTypeBadge :file-name="citation.title" :size="34" />
            <div class="min-w-0 space-y-1">
              <p class="truncate font-bold text-ink-900 dark:text-ink-100">
                {{ citation.title }}
              </p>
              <p class="font-mono text-xs text-ink-500">
                {{ citation.documentId }}<span v-if="citation.page"> · p.{{ citation.page }}</span>
              </p>
            </div>
          </div>
        </template>
        <blockquote
          class="rounded-r-md border-l-2 border-iris-200 bg-ink-50 px-4 py-3 text-sm leading-7 text-ink-700 dark:bg-ink-800 dark:text-ink-200"
        >
          「{{ citation.excerpt }}」
        </blockquote>
      </UCard>
    </template>
  </USlideover>
</template>
