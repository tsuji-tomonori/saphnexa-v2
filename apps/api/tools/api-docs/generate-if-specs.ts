/* eslint-disable -- OpenAPI JSONを動的に走査する生成CLI */
import { generatedHeader } from './generation-io.js'
import { operationRegistry } from './registry.js'

export const generateIfSpecs = (document: Record<string, any>) =>
  operationRegistry.map((entry) => {
    const operation = document['paths']?.[entry.path]?.[entry.method]
    const responses = Object.entries(operation?.responses ?? {})
      .map(([status, response]: [string, any]) => `| ${status} | ${response.description ?? ''} |`)
      .join('\n')
    const content = `${generatedHeader}# ${operation?.summary ?? entry.contract.operationId}\n\n## 概要\n\n${entry.contract.businessSummary}\n\n## 基本情報\n\n- Method: \`${entry.method.toUpperCase()}\`\n- Path: \`${entry.path}\`\n- Operation ID: \`${entry.contract.operationId}\`\n- Tag: \`${entry.tag}\`\n- 認証方式: \`${entry.contract.authMode}\`\n- 必要権限: ${entry.contract.permissions.length ? entry.contract.permissions.map((p) => `\`${p}\``).join(', ') : 'なし'}\n\n## レスポンス\n\n| Status | Description |\n| --- | --- |\n${responses}\n\n## レスポンス例\n\n\`\`\`json\n${JSON.stringify(entry.successSample, null, 2)}\n\`\`\`\n\n## curl例\n\n\`\`\`bash\ncurl -s http://localhost:8787${entry.path}\n\`\`\`\n`
    return { path: `../../docs/spec/40.apis/${entry.contract.markdownSlug}/if.gen.md`, content }
  })
