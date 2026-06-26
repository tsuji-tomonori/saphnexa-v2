import type { ApiContract } from '../../types.js'

export const contract = {
  operationId: 'getRoot',
  markdownSlug: 'system/root',
  authMode: 'none',
  businessSummary: 'API名と簡易ステータスを返す',
  permissions: [],
} as const satisfies ApiContract
