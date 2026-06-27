import { OpenAPIHono, createRoute } from '@hono/zod-openapi'

import { requireBearerAuth } from '../../../shared/auth/bearer.js'
import { requirePermission } from '../../../shared/auth/permissions.js'
import type { AuthEnv } from '../../../shared/auth/types.js'
import { errorResponse } from '../../../shared/http/errors.js'
import { listDocumentsContract as contract } from '../contract.js'
import { DocumentListResponseSchema } from '../schemas.js'
import { getDocumentList } from './use-case.js'

const route = createRoute({
  method: 'get',
  path: '/',
  middleware: [requireBearerAuth, requirePermission(contract.permissions)] as const,
  operationId: contract.operationId,
  tags: ['documents'],
  summary: '文書一覧を取得する',
  description: contract.businessSummary,
  responses: {
    200: { description: '文書一覧', content: { 'application/json': { schema: DocumentListResponseSchema } } },
    401: errorResponse('認証エラー'),
    403: errorResponse('認可エラー'),
    500: errorResponse('想定外エラー'),
  },
})

export const documentListRoutes = new OpenAPIHono<AuthEnv>().openapi(route, (c) => {
  return c.json(getDocumentList(), 200)
})
