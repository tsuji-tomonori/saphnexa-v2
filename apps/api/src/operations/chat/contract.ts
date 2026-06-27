import type { ApiContract } from '../types.js'

export const contract = {
  operationId: 'postChat',
  markdownSlug: 'chat/post',
  authMode: 'bearer',
  businessSummary: '単一ナレッジベースに対する質問を受け付け、回答と引用元をSSEで返す',
  permissions: ['chat:write'],
} as const satisfies ApiContract
