import { z } from '@hono/zod-openapi'

export const RootResponseSchema = z
  .object({
    name: z.literal('saphnexa-api').openapi({ description: 'API名' }),
    status: z.literal('ok').openapi({ description: 'APIの簡易ステータス' }),
  })
  .openapi('RootResponse')
