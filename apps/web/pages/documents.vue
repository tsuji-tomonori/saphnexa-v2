<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useToast } from '#imports'
import { useDocuments } from '~/composables/useDocuments'

defineOptions({ name: 'DocumentsPage' })
import type { DocumentSummary } from '~/composables/useDocuments'

const toast = useToast()
const docs = useDocuments()
const uploading = ref(false)
const uploadProgress = ref(0)
const deleting = ref(false)
const deleteOpen = ref(false)
const targetDocument = ref<DocumentSummary>()

let intervalId: number | undefined
onMounted(() => {
  docs.refresh().catch(() => undefined)
  intervalId = window.setInterval(() => {
    docs.refresh().catch(() => undefined)
  }, 5000)
})
onBeforeUnmount(() => {
  if (intervalId) window.clearInterval(intervalId)
})

async function upload(file: File) {
  uploading.value = true
  uploadProgress.value = 20
  try {
    await docs.upload(file)
    uploadProgress.value = 100
    toast.add({
      title: 'アップロードしました',
      description: '取込処理を開始します。',
      color: 'success',
    })
  } catch (error) {
    toast.add({
      title: 'アップロードに失敗しました',
      description: error instanceof Error ? error.message : '原因不明のエラーです。',
      color: 'error',
    })
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}
function requestDelete(document: DocumentSummary) {
  targetDocument.value = document
  deleteOpen.value = true
}
async function confirmDelete() {
  if (!targetDocument.value) return
  deleting.value = true
  try {
    await docs.remove(targetDocument.value.id)
    toast.add({ title: '削除を開始しました', color: 'success' })
    deleteOpen.value = false
  } catch (error) {
    toast.add({
      title: '削除に失敗しました',
      description: error instanceof Error ? error.message : '原因不明のエラーです。',
      color: 'error',
    })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <AppShell>
    <UDashboardNavbar
      title="文書管理"
      description="ファイル登録、取込状態の確認、文書削除を行います。"
    />
    <main class="min-h-[calc(100vh-4rem)] space-y-6 bg-ink-50 p-4 md:p-6">
      <UAlert
        v-if="docs.errorMessage.value"
        color="error"
        variant="soft"
        icon="i-lucide-circle-alert"
        :description="docs.errorMessage.value"
      />
      <DocumentUploader :uploading="uploading" :progress="uploadProgress" @upload="upload" />
      <DocumentTable
        :documents="docs.documents.value"
        :loading="docs.pending.value"
        @delete="requestDelete"
      />
    </main>
    <DeleteConfirmModal
      v-model:open="deleteOpen"
      :document="targetDocument"
      :deleting="deleting"
      @confirm="confirmDelete"
    />
  </AppShell>
</template>
