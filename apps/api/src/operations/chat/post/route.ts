import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { requireBearerAuth } from '../../../shared/auth/bearer.js'
import { errorResponse } from '../../../shared/http/errors.js'
import { validationHook } from '../../../shared/http/validation-hook.js'
import { contract } from '../contract.js'
import { ChatRequestSchema, ChatEventSchema } from '../schemas.js'
import { createChatEvents } from './use-case.js'

const route = createRoute({
  method: 'post',
  path: '/api/chat',
  middleware: [requireBearerAuth] as const,
  operationId: contract.operationId,
  tags: ['chat'],
  summary: 'RAGチャットに質問する',
  description: contract.businessSummary,
  request: { body: { required: true, content: { 'application/json': { schema: ChatRequestSchema } } } },
  responses: {
    200: { description: 'SSE形式のチャットイベント', content: { 'text/event-stream': { schema: ChatEventSchema } } },
    400: errorResponse('入力検証エラー'),
    401: errorResponse('認証エラー'),
    500: errorResponse('想定外エラー'),
  },
})

export const chatRoutes = new OpenAPIHono().openapi(
  route,
  (c) => {
    const { message } = ChatRequestSchema.parse(c.req.valid('json'))
    const encoder = new TextEncoder()
    const body = new ReadableStream({
      async start(controller) {
        for await (const event of createChatEvents(message)) {
          controller.enqueue(encoder.encode(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`))
        }
        controller.close()
      },
    })
    return c.body(body, 200, {
      'cache-control': 'no-cache',
      'content-type': 'text/event-stream; charset=utf-8',
    })
  },
  validationHook,
)
