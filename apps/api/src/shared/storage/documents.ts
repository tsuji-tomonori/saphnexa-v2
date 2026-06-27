export type DocumentStatus = 'uploading' | 'processing' | 'ready' | 'failed' | 'deleting'

export type DocumentSummary = {
  id: string
  fileName: string
  status: DocumentStatus
  createdAt: string
  errorMessage?: string
  objectKey: string
  contentType: string
  fileSize: number
}

const documents = new Map<string, DocumentSummary>()

export const createPendingDocument = ({ fileName, contentType, fileSize }: { fileName: string; contentType: string; fileSize: number }) => {
  const id = crypto.randomUUID()
  const objectKey = `documents/${id}/${fileName}`
  const document: DocumentSummary = {
    id,
    fileName,
    status: 'uploading',
    createdAt: new Date().toISOString(),
    objectKey,
    contentType,
    fileSize,
  }
  documents.set(id, document)
  return document
}

export const listDocuments = () =>
  Array.from(documents.values())
    .filter((document) => document.status !== 'deleting')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

export const markDocumentDeleting = (documentId: string) => {
  const document = documents.get(documentId)
  if (!document) return undefined
  const deleting = { ...document, status: 'deleting' as const }
  documents.set(documentId, deleting)
  return deleting
}

export const deleteDocumentMetadata = (documentId: string) => documents.delete(documentId)

export const clearDocumentsForTest = () => documents.clear()
