import { OpenAPIHono, createRoute } from '@hono/zod-openapi'

import { requireBearerAuth } from '../../../shared/auth/bearer.js'
import { errorResponse } from '../../../shared/http/errors.js'
import { createPendingDocument } from '../../../shared/storage/documents.js'
import { createUploadUrl } from '../../../shared/storage/s3.js'
import { uploadUrlContract as contract } from '../contract.js'
import { CreateUploadUrlRequestSchema, CreateUploadUrlResponseSchema } from '../schemas.js'

const route = createRoute({
  method: 'post',
  path: '/api/documents/upload-url',
  middleware: [requireBearerAuth] as const,
  operationId: contract.operationId,
  tags: ['documents'],
  summary: 'アップロードURLを発行する',
  description: contract.businessSummary,
  request: { body: { required: true, content: { 'application/json': { schema: CreateUploadUrlRequestSchema } } } },
  responses: {
    200: { description: 'アップロードURL', content: { 'application/json': { schema: CreateUploadUrlResponseSchema } } },
    400: errorResponse('入力検証エラー'),
    401: errorResponse('認証エラー'),
    500: errorResponse('想定外エラー'),
  },
})

export const uploadUrlRoutes = new OpenAPIHono().openapi(route, async (c) => {
  const body = c.req.valid('json')
  const document = createPendingDocument(body)
  const { uploadUrl, expiresAt } = await createUploadUrl({ key: document.objectKey, contentType: body.contentType, fileSize: body.fileSize })
  return c.json({ documentId: document.id, uploadUrl, expiresAt }, 200)
})
