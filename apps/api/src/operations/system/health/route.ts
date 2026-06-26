import { OpenAPIHono, createRoute } from '@hono/zod-openapi'

import { errorResponse } from '../../../shared/http/errors.js'
import { validationHook } from '../../../shared/http/validation-hook.js'

import { contract } from './contract.js'
import { HealthQuerySchema, HealthResponseSchema } from './schemas.js'
import { getHealth } from './use-case.js'

const route = createRoute({
  method: 'get',
  path: '/health',
  operationId: contract.operationId,
  tags: ['system'],
  summary: '稼働状態を取得する',
  description: contract.businessSummary,
  request: {
    query: HealthQuerySchema,
  },
  responses: {
    200: {
      description: '正常に稼働している',
      content: { 'application/json': { schema: HealthResponseSchema } },
    },
    400: errorResponse('入力検証エラー'),
    409: errorResponse('業務エラー'),
    500: errorResponse('想定外エラー'),
  },
})

export const healthRoutes = new OpenAPIHono().openapi(
  route,
  (c) => {
    const query = c.req.valid('query') as { fail?: 'conflict'; throw?: 'unexpected' }
    if (query.throw === 'unexpected') throw new Error('unexpected health failure')
    return c.json(getHealth({ fail: query.fail === 'conflict' }), 200)
  },
  validationHook,
)
