import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { streamSSE } from 'hono/streaming'

import { requireBearerAuth } from '../../../shared/auth/bearer.js'
import { requirePermission } from '../../../shared/auth/permissions.js'
import type { AuthEnv } from '../../../shared/auth/types.js'
import { errorResponse } from '../../../shared/http/errors.js'
import { validationHook } from '../../../shared/http/validation-hook.js'
import { contract } from '../contract.js'
import { ChatRequestSchema, ChatEventSchema } from '../schemas.js'
import { createChatEvents } from './use-case.js'

const route = createRoute({
  method: 'post',
  path: '/',
  middleware: [requireBearerAuth, requirePermission(contract.permissions)] as const,
  operationId: contract.operationId,
  tags: ['chat'],
  summary: 'RAGチャットに質問する',
  description: contract.businessSummary,
  request: { body: { required: true, content: { 'application/json': { schema: ChatRequestSchema } } } },
  responses: {
    200: { description: 'SSE形式のチャットイベント', content: { 'text/event-stream': { schema: ChatEventSchema } } },
    400: errorResponse('入力検証エラー'),
    401: errorResponse('認証エラー'),
    403: errorResponse('認可エラー'),
    500: errorResponse('想定外エラー'),
  },
})

const streamContext = (context: unknown) => context as Parameters<typeof streamSSE>[0]

export const chatRoutes = new OpenAPIHono<AuthEnv>().openapi(
  route,
  (c) => {
    const { message } = ChatRequestSchema.parse(c.req.valid('json'))
    return streamSSE(streamContext(c), async (stream) => {
      try {
        for await (const event of createChatEvents(message)) {
          await stream.writeSSE({ event: event.type, data: JSON.stringify(event) })
        }
      } catch {
        await stream.writeSSE({
          event: 'error',
          data: JSON.stringify({ type: 'error', code: 'CHAT_STREAM_ERROR', message: '回答ストリームの処理に失敗しました' }),
        })
      }
    })
  },
  validationHook,
)
