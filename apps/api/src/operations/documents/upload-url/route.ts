import { OpenAPIHono, createRoute } from '@hono/zod-openapi'

import { requireBearerAuth } from '../../../shared/auth/bearer.js'
import { requirePermission } from '../../../shared/auth/permissions.js'
import type { AuthEnv } from '../../../shared/auth/types.js'
import { errorResponse } from '../../../shared/http/errors.js'
import { uploadUrlContract as contract } from '../contract.js'
import { CreateUploadUrlRequestSchema, CreateUploadUrlResponseSchema } from '../schemas.js'
import { createDocumentUploadUrl } from './use-case.js'

const route = createRoute({
  method: 'post',
  path: '/upload-url',
  middleware: [requireBearerAuth, requirePermission(contract.permissions)] as const,
  operationId: contract.operationId,
  tags: ['documents'],
  summary: 'アップロードURLを発行する',
  description: contract.businessSummary,
  request: { body: { required: true, content: { 'application/json': { schema: CreateUploadUrlRequestSchema } } } },
  responses: {
    200: { description: 'アップロードURL', content: { 'application/json': { schema: CreateUploadUrlResponseSchema } } },
    400: errorResponse('入力検証エラー'),
    401: errorResponse('認証エラー'),
    403: errorResponse('認可エラー'),
    500: errorResponse('想定外エラー'),
  },
})

export const uploadUrlRoutes = new OpenAPIHono<AuthEnv>().openapi(route, async (c) => {
  const result = await createDocumentUploadUrl(c.req.valid('json'))
  return c.json(result, 200)
})
