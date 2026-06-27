import { CreateUploadUrlResponseSchema, DocumentListResponseSchema } from './schemas.js'

export const createUploadUrlResponseSample = CreateUploadUrlResponseSchema.parse({
  documentId: '00000000-0000-4000-8000-000000000000',
  uploadUrl: 'https://example.com/upload',
  expiresAt: '2026-01-01T00:15:00.000Z',
})

export const documentListResponseSample = DocumentListResponseSchema.parse({ documents: [] })
