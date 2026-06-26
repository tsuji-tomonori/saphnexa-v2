/* eslint-disable -- OpenAPI JSONを動的に走査する生成CLI */
import { generatedHeader } from './generation-io.js'
import { operationRegistry } from './registry.js'

type ParameterObject = {
  name?: string
  in?: string
  required?: boolean
  description?: string
  schema?: unknown
}

type OperationObject = {
  parameters?: ParameterObject[]
}

const code = (value: string) => `<code>${value.replaceAll('|', '&#124;')}</code>`
const text = (value: string) => value.replaceAll('|', '&#124;').replaceAll('\n', ' ')

const schemaType = (schema: unknown): string => {
  if (!schema || typeof schema !== 'object') return 'Any'
  const record = schema as Record<string, unknown>
  if (typeof record['type'] === 'string') return record['type']
  if (Array.isArray(record['type'])) return record['type'].join(' | ')
  if (typeof record['$ref'] === 'string') return record['$ref'].split('/').at(-1) ?? record['$ref']
  if (Array.isArray(record['enum'])) return record['enum'].map(String).join(' | ')
  return 'Any'
}

const rows = (parameters: ParameterObject[]) => {
  if (parameters.length === 0) return '_なし_'
  return [
    '| 場所 | 項目 | 型 | required | 説明 |',
    '| --- | --- | --- | --- | --- |',
    ...parameters.map(
      (parameter) =>
        `| ${code(parameter.in ?? '-')} | ${code(parameter.name ?? '-')} | ${code(schemaType(parameter.schema))} | ${parameter.required ? 'yes' : 'no'} | ${text(parameter.description ?? '-')} |`,
    ),
  ].join('\n')
}

export const generateQuerySpecs = (document: Record<string, any>) =>
  operationRegistry.map((entry) => {
    const operation = document['paths']?.[entry.path]?.[entry.method] as OperationObject | undefined
    const parameters = operation?.parameters ?? []
    const content = `${generatedHeader}# ${entry.contract.operationId} query

## 概要

${entry.contract.businessSummary}

## 基本情報

- Method: \`${entry.method.toUpperCase()}\`
- Path: \`${entry.path}\`
- Operation ID: \`${entry.contract.operationId}\`

## リクエストパラメータ

${rows(parameters)}
`
    return { path: `../../docs/spec/40.apis/${entry.contract.markdownSlug}/query_gen.md`, content }
  })
