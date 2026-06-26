import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'

import { ApiError, createErrorResponse } from './errors.js'

const traceId = (request: Request) => request.headers.get('x-request-id') ?? crypto.randomUUID()

export const apiErrorHandler: ErrorHandler = (err, c) => {
  const id = traceId(c.req.raw)

  if (err instanceof ApiError) {
    return c.json(
      createErrorResponse({
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
        traceId: id,
        details: err.details,
      }),
      err.statusCode,
    )
  }

  if (err instanceof HTTPException) {
    return c.json(
      createErrorResponse({
        code: 'HTTP_ERROR',
        message: err.message,
        statusCode: err.status,
        traceId: id,
      }),
      err.status,
    )
  }

  console.error(err)
  return c.json(
    createErrorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: '予期しないエラーが発生しました',
      statusCode: 500,
      traceId: id,
    }),
    500,
  )
}
