/* eslint-disable -- OpenAPI JSONを動的に走査する生成CLI */
import { operationRegistry } from './registry.js'

export const checkContracts = (document: Record<string, any>) => {
  const seen = new Set<string>()
  const errors: string[] = []
  for (const entry of operationRegistry) {
    const { operationId } = entry.contract
    if (seen.has(operationId)) errors.push(`operationId が重複しています: ${operationId}`)
    seen.add(operationId)
    const operation = document['paths']?.[entry.path]?.[entry.method]
    if (!operation)
      errors.push(`OpenAPI にルートがありません: ${entry.method.toUpperCase()} ${entry.path}`)
    if (operation && operation.operationId !== operationId)
      errors.push(`operationId 不一致: ${entry.path}`)
    for (const field of ['tags', 'summary', 'description', 'responses']) {
      if (!operation?.[field]) errors.push(`${operationId} に ${field} がありません`)
    }
  }
  return errors
}
