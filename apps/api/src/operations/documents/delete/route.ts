import { OpenAPIHono, createRoute } from '@hono/zod-openapi'

import { requireBearerAuth } from '../../../shared/auth/bearer.js'
import { ApiError, errorResponse } from '../../../shared/http/errors.js'
import { deleteDocumentMetadata, markDocumentDeleting } from '../../../shared/storage/documents.js'
import { deleteDocumentObject } from '../../../shared/storage/s3.js'
import { deleteDocumentContract as contract } from '../contract.js'
import { DocumentIdParamSchema } from '../schemas.js'

const route = createRoute({
  method: 'delete',
  path: '/api/documents/{documentId}',
  middleware: [requireBearerAuth] as const,
  operationId: contract.operationId,
  tags: ['documents'],
  summary: '文書削除を受け付ける',
  description: contract.businessSummary,
  request: { params: DocumentIdParamSchema },
  responses: {
    202: { description: '削除を受け付けた' },
    400: errorResponse('入力検証エラー'),
    401: errorResponse('認証エラー'),
    404: errorResponse('文書が存在しない'),
    500: errorResponse('想定外エラー'),
  },
})

export const documentDeleteRoutes = new OpenAPIHono().openapi(route, async (c) => {
  const { documentId } = c.req.valid('param')
  const document = markDocumentDeleting(documentId)
  if (!document) throw new ApiError(404, 'DOCUMENT_NOT_FOUND', '文書が見つかりません')
  await deleteDocumentObject(document.objectKey)
  deleteDocumentMetadata(documentId)
  return c.body(null, 202)
})
