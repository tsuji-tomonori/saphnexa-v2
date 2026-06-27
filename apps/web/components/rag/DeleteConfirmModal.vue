<script setup lang="ts">
import type { DocumentSummary } from '~/composables/useDocuments'

defineProps<{ document: DocumentSummary | undefined; deleting: boolean }>()
const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ confirm: [] }>()
</script>

<template>
  <UModal
    v-model:open="open"
    title="文書を削除しますか"
    description="S3オブジェクト、ベクトルインデックス、文書メタデータの削除を開始します。"
  >
    <template #body>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        {{ document?.fileName }} を削除キューに入れます。この操作は取り消せません。
      </p>
    </template>
    <template #footer>
      <UButton color="neutral" variant="ghost" @click="open = false">キャンセル</UButton>
      <UButton color="error" :loading="deleting" @click="emit('confirm')">削除する</UButton>
    </template>
  </UModal>
</template>
