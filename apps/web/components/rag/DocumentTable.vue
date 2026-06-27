<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { DocumentSummary } from '~/composables/useDocuments'

defineProps<{ documents: DocumentSummary[]; loading: boolean }>()
const emit = defineEmits<{ delete: [document: DocumentSummary] }>()

const columns: TableColumn<DocumentSummary>[] = [
  { accessorKey: 'fileName', header: '文書名' },
  { accessorKey: 'status', header: '取込状態' },
  { accessorKey: 'createdAt', header: '登録日時' },
  { id: 'actions', header: '' },
]
const statusColor: Record<
  DocumentSummary['status'],
  'neutral' | 'info' | 'success' | 'error' | 'warning'
> = {
  uploading: 'info',
  processing: 'warning',
  ready: 'success',
  failed: 'error',
  deleting: 'neutral',
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <h2 class="font-semibold">取込状態一覧</h2>
        <UBadge color="neutral" variant="soft">{{ documents.length }} 件</UBadge>
      </div>
    </template>
    <USkeleton v-if="loading && documents.length === 0" class="h-56" />
    <UEmpty
      v-else-if="documents.length === 0"
      icon="i-lucide-folder-open"
      title="文書はまだありません"
      description="ファイルを登録すると取込状態が表示されます。"
    />
    <UTable v-else :data="documents" :columns="columns">
      <template #status-cell="{ row }">
        <UBadge
          :color="statusColor[row.original.status as DocumentSummary['status']]"
          variant="soft"
          >{{ row.original.status }}</UBadge
        >
        <p v-if="row.original.errorMessage" class="mt-1 text-xs text-red-600">
          {{ row.original.errorMessage }}
        </p>
      </template>
      <template #createdAt-cell="{ row }">
        {{ new Date(row.original.createdAt).toLocaleString('ja-JP') }}
      </template>
      <template #actions-cell="{ row }">
        <UDropdownMenu
          :items="[
            [
              {
                label: '削除',
                icon: 'i-lucide-trash-2',
                color: 'error',
                onSelect: () => emit('delete', row.original),
              },
            ],
          ]"
        >
          <UButton
            icon="i-lucide-more-horizontal"
            color="neutral"
            variant="ghost"
            aria-label="文書操作"
          />
        </UDropdownMenu>
      </template>
    </UTable>
  </UCard>
</template>
