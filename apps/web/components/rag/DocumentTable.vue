<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { DocumentSummary } from '~/composables/useDocuments'

defineProps<{ documents: DocumentSummary[]; loading: boolean }>()
const emit = defineEmits<{ delete: [document: DocumentSummary] }>()

const columns: TableColumn<DocumentSummary>[] = [
  { accessorKey: 'fileName', header: 'ドキュメント' },
  { accessorKey: 'status', header: 'ステータス' },
  { accessorKey: 'createdAt', header: '更新日' },
  { id: 'actions', header: '' },
]
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
      <template #fileName-cell="{ row }">
        <div class="flex min-w-0 items-center gap-3">
          <FileTypeBadge :file-name="row.original.fileName" :size="30" />
          <span class="truncate font-medium text-ink-900">
            {{ row.original.fileName }}
          </span>
        </div>
      </template>
      <template #status-cell="{ row }">
        <DocStatusBadge :status="row.original.status" />
        <p v-if="row.original.errorMessage" class="mt-1 text-xs text-error">
          {{ row.original.errorMessage }}
        </p>
      </template>
      <template #createdAt-cell="{ row }">
        <span class="font-mono text-xs text-ink-600">
          {{ new Date(row.original.createdAt).toLocaleString('ja-JP') }}
        </span>
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
