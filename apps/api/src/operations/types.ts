export type ApiSequenceStep =
  | {
      type: 'call'
      summary: string
    }
  | {
      type: 'error'
      condition: string
      status: number
      detail?: string
    }

export type ApiContract = {
  operationId: string
  markdownSlug: `${string}/${string}`
  authMode: 'none' | 'public' | 'bearer'
  businessSummary: string
  permissions: readonly string[]
  successStatus: number
  sequence: readonly ApiSequenceStep[]
}

export type OperationRegistryEntry = {
  contract: ApiContract
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  path: string
  tag: string
  successSample: unknown
}
