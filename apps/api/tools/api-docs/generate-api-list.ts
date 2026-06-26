/* eslint-disable -- OpenAPI JSONを動的に走査する生成CLI */
import { generatedHeader } from './generation-io.js'
import type { generateOpenApi } from './generate-openapi.js'
import { operationRegistry } from './registry.js'

type OpenApiDocument =
  ReturnType<typeof generateOpenApi> extends string ? Record<string, any> : never

export const generateApiList = (document: OpenApiDocument) => {
  const rows = [
    '| Method | Path | Operation ID | Summary | Auth |',
    '| --- | --- | --- | --- | --- |',
  ]
  for (const entry of operationRegistry) {
    const operation = document['paths']?.[entry.path]?.[entry.method]
    rows.push(
      `| ${entry.method.toUpperCase()} | \`${entry.path}\` | \`${entry.contract.operationId}\` | ${operation?.summary ?? ''} | ${entry.contract.authMode} |`,
    )
  }
  return `${generatedHeader}# API一覧\n\n${rows.join('\n')}\n`
}
