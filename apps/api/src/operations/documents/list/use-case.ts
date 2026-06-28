import { listDocuments } from '../../../shared/storage/documents.js'
import type { z } from 'zod'
import type { DocumentListResponseSchema } from '../schemas.js'

type DocumentListResponse = z.infer<typeof DocumentListResponseSchema>

export const getDocumentList = (): DocumentListResponse => ({
  documents: listDocuments().map(({ objectKey: _objectKey, contentType: _contentType, fileSize: _fileSize, ...document }) => document),
})
