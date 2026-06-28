import { ApiError } from '../../../shared/http/errors.js'
import { deleteDocumentMetadata, markDocumentDeleting, restoreDocument } from '../../../shared/storage/documents.js'
import { deleteDocumentObject } from '../../../shared/storage/s3.js'

export const deleteDocument = async (documentId: string): Promise<void> => {
  const transition = markDocumentDeleting(documentId)
  if (!transition) throw new ApiError(404, 'DOCUMENT_NOT_FOUND', '文書が見つかりません')

  try {
    await deleteDocumentObject(transition.deleting.objectKey)
    deleteDocumentMetadata(documentId)
  } catch (error) {
    restoreDocument({
      ...transition.previous,
      status: 'failed',
      errorMessage: '文書削除に失敗しました',
    })
    throw error
  }
}
