/* eslint-disable -- OpenAPI JSONとoperation registryを動的に走査する生成CLI */
import { generatedHeader } from './generation-io.js'
import { operationRegistry } from './registry.js'

const formatPermissions = (permissions: readonly string[]) =>
  permissions.length ? permissions.map((permission) => `\`${permission}\``).join(', ') : 'なし'

const formatParameters = (operation: Record<string, any>) => {
  const parameters = operation['parameters'] as Array<Record<string, any>> | undefined
  if (!parameters?.length) return 'なし'
  return [
    '| In | Name | Required | Description |',
    '| --- | --- | --- | --- |',
    ...parameters.map(
      (parameter) =>
        `| ${parameter['in'] ?? ''} | \`${parameter['name'] ?? ''}\` | ${parameter['required'] ? 'yes' : 'no'} | ${parameter['description'] ?? ''} |`,
    ),
  ].join('\n')
}

const formatRequestBody = (operation: Record<string, any>) => {
  const requestBody = operation['requestBody'] as Record<string, any> | undefined
  if (!requestBody) return 'なし'
  const contentTypes = Object.keys(
    (requestBody['content'] as Record<string, unknown> | undefined) ?? {},
  )
  return `- Required: ${requestBody['required'] ? 'yes' : 'no'}\n- Content-Type: ${contentTypes.length ? contentTypes.map((type) => `\`${type}\``).join(', ') : '未定義'}`
}

const formatResponses = (operation: Record<string, any>) => {
  const responses = Object.entries(
    (operation['responses'] as Record<string, any> | undefined) ?? {},
  )
  if (!responses.length) return 'なし'
  return [
    '| Status | Description |',
    '| --- | --- |',
    ...responses.map(([status, response]) => `| ${status} | ${response.description ?? ''} |`),
  ].join('\n')
}

export const generateDetailDesignSpecs = (document: Record<string, any>) =>
  operationRegistry.map((entry) => {
    const operation = document['paths']?.[entry.path]?.[entry.method] ?? {}
    const baseSourcePath = `apps/api/src/operations/${entry.contract.markdownSlug}`
    const content = `${generatedHeader}# ${operation.summary ?? entry.contract.operationId} 詳細設計

## 目的

${entry.contract.businessSummary}

## API契約

- Method: \`${entry.method.toUpperCase()}\`
- Path: \`${entry.path}\`
- Operation ID: \`${entry.contract.operationId}\`
- Tag: \`${entry.tag}\`
- 認証方式: \`${entry.contract.authMode}\`
- 必要権限: ${formatPermissions(entry.contract.permissions)}

## 入力

### パラメータ

${formatParameters(operation)}

### リクエストボディ

${formatRequestBody(operation)}

## 処理フロー

1. \`${baseSourcePath}/schemas.ts\` のZod schemaで入力を検証する。
2. \`${baseSourcePath}/route.ts\` のroute handlerで検証済み入力を受け取り、use caseへ渡す。
3. \`${baseSourcePath}/use-case.ts\` で業務処理を実行する。
4. 成功時は \`${baseSourcePath}/samples.ts\` と同じ形のレスポンスを返す。
5. エラー時は共通HTTPエラーハンドリングでAPIエラーレスポンスへ変換する。

## 出力・エラー

${formatResponses(operation)}

## 主要ソース

- 契約: \`${baseSourcePath}/contract.ts\`
- schema: \`${baseSourcePath}/schemas.ts\`
- route: \`${baseSourcePath}/route.ts\`
- use case: \`${baseSourcePath}/use-case.ts\`
- sample: \`${baseSourcePath}/samples.ts\`
- test: \`${baseSourcePath}/route.test.ts\`

## レスポンス例

\`\`\`json
${JSON.stringify(entry.successSample, null, 2)}
\`\`\`
`
    return {
      path: `../../docs/spec/40.apis/${entry.contract.markdownSlug}/detail-design_gen.md`,
      content,
    }
  })
