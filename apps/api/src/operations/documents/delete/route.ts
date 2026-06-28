import { OpenAPIHono, createRoute } from '@hono/zod-openapi'

import { requireBearerAuth } from '../../../shared/auth/bearer.js'
import { requirePermission } from '../../../shared/auth/permissions.js'
import type { AuthEnv } from '../../../shared/auth/types.js'
import { errorResponse } from '../../../shared/http/errors.js'
import { deleteDocumentContract as contract } from '../contract.js'
import { DocumentIdParamSchema } from '../schemas.js'
import { deleteDocument } from './use-case.js'

const route = createRoute({
  method: 'delete',
  path: '/{documentId}',
  middleware: [requireBearerAuth, requirePermission(contract.permissions)] as const,
  operationId: contract.operationId,
  tags: ['documents'],
  summary: '文書削除を受け付ける',
  description: contract.businessSummary,
  request: { params: DocumentIdParamSchema },
  responses: {
    202: { description: '削除を受け付けた' },
    400: errorResponse('入力検証エラー'),
    401: errorResponse('認証エラー'),
    403: errorResponse('認可エラー'),
    404: errorResponse('文書が存在しない'),
    500: errorResponse('想定外エラー'),
  },
})

export const documentDeleteRoutes = new OpenAPIHono<AuthEnv>().openapi(route, async (c) => {
  const { documentId } = c.req.valid('param')
  await deleteDocument(documentId)
  return c.body(null, 202)
})
