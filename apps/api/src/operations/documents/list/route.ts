import { OpenAPIHono, createRoute } from '@hono/zod-openapi'

import { requireBearerAuth } from '../../../shared/auth/bearer.js'
import { errorResponse } from '../../../shared/http/errors.js'
import { listDocuments } from '../../../shared/storage/documents.js'
import { listDocumentsContract as contract } from '../contract.js'
import { DocumentListResponseSchema } from '../schemas.js'

const route = createRoute({
  method: 'get',
  path: '/api/documents',
  middleware: [requireBearerAuth] as const,
  operationId: contract.operationId,
  tags: ['documents'],
  summary: '文書一覧を取得する',
  description: contract.businessSummary,
  responses: {
    200: { description: '文書一覧', content: { 'application/json': { schema: DocumentListResponseSchema } } },
    401: errorResponse('認証エラー'),
    500: errorResponse('想定外エラー'),
  },
})

export const documentListRoutes = new OpenAPIHono().openapi(route, (c) => {
  return c.json({ documents: listDocuments().map(({ objectKey: _objectKey, contentType: _contentType, fileSize: _fileSize, ...document }) => document) }, 200)
})
