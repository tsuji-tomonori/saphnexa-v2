import { z } from '@hono/zod-openapi'

export const HealthResponseSchema = z
  .object({
    status: z.literal('ok').openapi({ description: 'APIプロセスの稼働状態' }),
  })
  .openapi('HealthResponse')

export const HealthQuerySchema = z
  .object({
    fail: z.enum(['conflict']).optional().openapi({ description: '業務エラー確認用のテスト入力' }),
    throw: z
      .enum(['unexpected'])
      .optional()
      .openapi({ description: '想定外例外確認用のテスト入力' }),
  })
  .openapi('HealthQuery')
