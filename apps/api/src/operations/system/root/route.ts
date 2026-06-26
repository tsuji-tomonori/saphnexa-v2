import { OpenAPIHono, createRoute } from '@hono/zod-openapi'

import { errorResponse } from '../../../shared/http/errors.js'

import { contract } from './contract.js'
import { RootResponseSchema } from './schemas.js'
import { getRoot } from './use-case.js'

const route = createRoute({
  method: 'get',
  path: '/',
  operationId: contract.operationId,
  tags: ['system'],
  summary: 'API情報を取得する',
  description: contract.businessSummary,
  responses: {
    200: {
      description: 'API情報',
      content: { 'application/json': { schema: RootResponseSchema } },
    },
    400: errorResponse('入力検証エラー'),
    500: errorResponse('想定外エラー'),
  },
})

export const rootRoutes = new OpenAPIHono().openapi(route, (c) => c.json(getRoot(), 200))
