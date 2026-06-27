import { z } from '@hono/zod-openapi'

export const DocumentStatusSchema = z.enum(['uploading', 'processing', 'ready', 'failed', 'deleting'])

export const DocumentSummarySchema = z.object({
  id: z.uuid().openapi({ description: '文書ID' }),
  fileName: z.string().openapi({ description: 'ファイル名' }),
  status: DocumentStatusSchema.openapi({ description: '取込状態' }),
  createdAt: z.iso.datetime().openapi({ description: '登録日時' }),
  errorMessage: z.string().optional().openapi({ description: 'エラー内容' }),
}).openapi('DocumentSummary')

export const DocumentListResponseSchema = z.object({
  documents: z.array(DocumentSummarySchema),
}).openapi('DocumentListResponse')

export const CreateUploadUrlRequestSchema = z.object({
  fileName: z.string().min(1).max(255).regex(/^[^/\\]+$/).openapi({ description: 'ファイル名' }),
  contentType: z.string().min(1).max(255).openapi({ description: 'Content-Type' }),
  fileSize: z.number().int().positive().max(100 * 1024 * 1024).openapi({ description: 'ファイルサイズ' }),
}).openapi('CreateUploadUrlRequest')

export const CreateUploadUrlResponseSchema = z.object({
  documentId: z.uuid().openapi({ description: '文書ID' }),
  uploadUrl: z.url().openapi({ description: 'S3 PUT用Presigned URL' }),
  expiresAt: z.iso.datetime().openapi({ description: 'URL有効期限' }),
}).openapi('CreateUploadUrlResponse')

export const DocumentIdParamSchema = z.object({
  documentId: z.uuid().openapi({ description: '文書ID' }),
}).openapi('DocumentIdParam')
