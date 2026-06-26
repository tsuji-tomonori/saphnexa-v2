/* eslint-disable @typescript-eslint/no-explicit-any -- @hono/zod-openapi の defaultHook 型引数はアプリEnv/Pathに依存するため境界で固定する */
import type { Hook } from '@hono/zod-openapi'

import { createErrorResponse } from './errors.js'

export const validationHook: Hook<any, any, any, any> = (result, c) => {
  if (result.success) return

  const details = result.error.issues.map((issue) => ({
    field: issue.path.join('.'),
    reason: issue.message,
    statusCode: 400,
    retryable: false,
  }))

  return c.json(
    createErrorResponse({
      code: 'VALIDATION_ERROR',
      message: 'リクエストの検証に失敗しました',
      statusCode: 400,
      traceId: crypto.randomUUID(),
      details,
    }),
    400,
  )
}
