import { createPendingDocument } from '../../../shared/storage/documents.js'
import { createUploadUrl } from '../../../shared/storage/s3.js'
import type { z } from 'zod'
import type { CreateUploadUrlRequestSchema, CreateUploadUrlResponseSchema } from '../schemas.js'

type CreateUploadUrlRequest = z.infer<typeof CreateUploadUrlRequestSchema>
type CreateUploadUrlResponse = z.infer<typeof CreateUploadUrlResponseSchema>

export const createDocumentUploadUrl = async (
  input: CreateUploadUrlRequest,
): Promise<CreateUploadUrlResponse> => {
  const document = createPendingDocument(input)
  const { uploadUrl, expiresAt } = await createUploadUrl({
    key: document.objectKey,
    contentType: input.contentType,
    fileSize: input.fileSize,
  })

  return { documentId: document.id, uploadUrl, expiresAt }
}
