export type ApiContract = {
  operationId: string
  markdownSlug: `${string}/${string}`
  authMode: 'none' | 'public' | 'bearer'
  businessSummary: string
  permissions: readonly string[]
}

export type OperationRegistryEntry = {
  contract: ApiContract
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  path: string
  tag: string
  successSample: unknown
}
