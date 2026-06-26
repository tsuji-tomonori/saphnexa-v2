import type { ApiContract } from '../../types.js'

export const contract = {
  operationId: 'getRoot',
  markdownSlug: 'system/root',
  authMode: 'none',
  businessSummary: 'API名と簡易ステータスを返す',
  permissions: [],
  successStatus: 200,
  sequence: [{ type: 'call', summary: 'API名と簡易ステータスを取得する。' }],
} as const satisfies ApiContract
