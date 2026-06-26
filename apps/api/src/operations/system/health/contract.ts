import type { ApiContract } from '../../types.js'

export const contract = {
  operationId: 'getHealth',
  markdownSlug: 'system/health',
  authMode: 'none',
  businessSummary: 'APIプロセスの稼働状態を返す',
  permissions: [],
  successStatus: 200,
  sequence: [
    {
      type: 'error',
      condition: 'Query が型または制約に一致しない場合。',
      status: 400,
      detail: '入力検証エラー',
    },
    { type: 'call', summary: 'APIプロセスの稼働状態を取得する。' },
    {
      type: 'error',
      condition: '業務上の異常状態を検出した場合。',
      status: 409,
      detail: '業務エラー',
    },
    {
      type: 'error',
      condition: 'Router で捕捉されない想定外例外が発生した場合。',
      status: 500,
      detail: '想定外エラー',
    },
  ],
} as const satisfies ApiContract
