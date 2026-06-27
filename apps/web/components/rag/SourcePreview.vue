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
          <div class="space-y-1">
            <p class="font-semibold">{{ citation.title }}</p>
            <p class="text-sm text-gray-500">
              文書ID: {{ citation.documentId
              }}<span v-if="citation.page"> / p.{{ citation.page }}</span>
            </p>
          </div>
        </template>
        <blockquote
          class="border-l-4 border-primary-400 pl-4 text-sm leading-7 text-gray-700 dark:text-gray-200"
        >
          {{ citation.excerpt }}
        </blockquote>
      </UCard>
    </template>
  </USlideover>
</template>
