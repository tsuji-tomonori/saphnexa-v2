export type DocumentSummary = {
  id: string
  fileName: string
  status: 'uploading' | 'processing' | 'ready' | 'failed' | 'deleting'
  createdAt: string
  errorMessage?: string
}

type DocumentListResponse = { documents: DocumentSummary[] }
type UploadUrlResponse = { documentId: string; uploadUrl: string; expiresAt: string }

export function useDocuments() {
  const config = useRuntimeConfig()
  const documents = ref<DocumentSummary[]>([])
  const pending = ref(false)
  const errorMessage = ref<string>()

  async function refresh() {
    pending.value = true
    errorMessage.value = undefined
    try {
      const response = await $fetch<DocumentListResponse>(`${config.public.apiBase}/api/documents`)
      documents.value = response.documents
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '文書一覧の取得に失敗しました。'
    } finally {
      pending.value = false
    }
  }

  async function upload(file: File) {
    const upload = await $fetch<UploadUrlResponse>(
      `${config.public.apiBase}/api/documents/upload-url`,
      {
        method: 'POST',
        body: {
          fileName: file.name,
          contentType: file.type || 'application/octet-stream',
          fileSize: file.size,
        },
      },
    )
    await $fetch(upload.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
    })
    await refresh()
  }

  async function remove(documentId: string) {
    await $fetch(`${config.public.apiBase}/api/documents/${documentId}`, { method: 'DELETE' })
    await refresh()
  }

  return { documents, pending, errorMessage, refresh, upload, remove }
}
