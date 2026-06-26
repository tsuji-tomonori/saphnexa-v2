import { z } from '@hono/zod-openapi'

export const ErrorDetailSchema = z
  .object({
    field: z.string().optional().openapi({ description: 'エラー対象のフィールド' }),
    reason: z.string().openapi({ description: 'エラー理由' }),
    statusCode: z.number().int().openapi({ description: 'HTTPステータスコード' }),
    retryable: z.boolean().openapi({ description: '再試行可能か' }),
    resource: z.string().optional().openapi({ description: '関連リソース' }),
  })
  .openapi('ErrorDetail')

export const ErrorResponseSchema = z
  .object({
    error: z.object({
      code: z.string().openapi({ description: '機械判定用エラーコード' }),
      message: z.string().openapi({ description: '利用者向けメッセージ' }),
      details: z.array(ErrorDetailSchema).openapi({ description: 'エラー詳細' }),
      traceId: z.string().openapi({ description: 'トレースID' }),
    }),
  })
  .openapi('ErrorResponse')

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

export class ApiError extends Error {
  constructor(
    public readonly statusCode: 400 | 401 | 403 | 404 | 409 | 422 | 500,
    public readonly code: string,
    message: string,
    public readonly details: ErrorResponse['error']['details'] = [],
  ) {
    super(message)
  }
}

export const createErrorResponse = ({
  code,
  message,
  statusCode,
  traceId,
  details = [],
}: {
  code: string
  message: string
  statusCode: number
  traceId: string
  details?: ErrorResponse['error']['details']
}): ErrorResponse => ({
  error: {
    code,
    message,
    details:
      details.length > 0
        ? details
        : [{ reason: message, statusCode, retryable: statusCode >= 500 }],
    traceId,
  },
})

export const errorResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: ErrorResponseSchema,
    },
  },
})
