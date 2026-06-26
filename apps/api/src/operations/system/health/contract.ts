import type { ApiContract } from '../../types.js'

export const contract = {
  operationId: 'getHealth',
  markdownSlug: 'system/health',
  authMode: 'none',
  businessSummary: 'APIプロセスの稼働状態を返す',
  permissions: [],
} as const satisfies ApiContract
