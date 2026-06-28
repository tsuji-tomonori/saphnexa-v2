/* eslint-disable -- OpenAPI JSONを動的に走査する生成CLI */
import { generatedHeader } from './generation-io.js'
import type { generateOpenApi } from './generate-openapi.js'
import { operationRegistry } from './registry.js'

type OpenApiDocument =
  ReturnType<typeof generateOpenApi> extends string ? Record<string, any> : never

type MessageEntry = {
  catalogId: string
  messageId: string
  level: 'WARNING' | 'ERROR'
  status: string
  summary: string
  when: string
  operatorAction: string
  contextModel: string
}

const levelForStatus = (status: string): MessageEntry['level'] => {
  const code = Number(status)
  return code >= 500 ? 'ERROR' : 'WARNING'
}

const suffixForStatus = (status: string) => {
  const code = Number(status)
  if (code === 400) return 'validation_failed'
  if (code === 401) return 'authentication_required'
  if (code === 403) return 'permission_denied'
  if (code === 404) return 'resource_not_found'
  if (code === 409) return 'business_conflict'
  if (code === 422) return 'unprocessable_entity'
  if (code >= 500) return 'unexpected_error'
  return `http_${status}`
}

const contextForLevel = (level: MessageEntry['level']) =>
  level === 'ERROR'
    ? 'traceId, operationId, api.method, api.path, api.statusCode, error.code, error.message'
    : 'traceId, operationId, api.method, api.path, api.statusCode, error.code'

const actionForStatus = (status: string) => {
  const code = Number(status)
  if (code === 400 || code === 422) return 'リクエスト内容、schema、入力値を確認する。'
  if (code === 401 || code === 403) return '認証状態、権限、呼び出し元principalを確認する。'
  if (code === 404) return '対象リソースIDと存在状態を確認する。'
  if (code === 409) return '対象リソースの現在状態と競合条件を確認する。'
  if (code >= 500) return '同一traceIdのログ、直近deploy、依存サービス状態を確認する。'
  return 'HTTP statusとレスポンス内容を確認する。'
}

const messagesForOperation = (
  document: OpenApiDocument,
  entry: (typeof operationRegistry)[number],
) => {
  const operation = document['paths']?.[entry.path]?.[entry.method]
  const responses = Object.entries(operation?.responses ?? {})
    .filter(([status]) => /^\d+$/.test(status) && Number(status) >= 400)
    .sort(([a], [b]) => Number(a) - Number(b))

  return responses.map(([status, response], index): MessageEntry => {
    const level = levelForStatus(status)
    const description = String((response as { description?: unknown }).description ?? '')
    return {
      catalogId: `M${String(index + 1).padStart(3, '0')}`,
      messageId: `${entry.contract.operationId}.${suffixForStatus(status)}`,
      level,
      status,
      summary: description || `${status} responseを返す。`,
      when: `${entry.method.toUpperCase()} ${entry.path} が ${status} responseを返す場合。`,
      operatorAction: actionForStatus(status),
      contextModel: contextForLevel(level),
    }
  })
}

const renderMessageRows = (messages: readonly MessageEntry[]) => [
  '| id | message_id | level | status | ログ概要 |',
  '| --- | --- | --- | --- | --- |',
  ...messages.map(
    (message) =>
      `| \`${message.catalogId}\` | \`${message.messageId}\` | \`${message.level}\` | ${message.status} | ${message.summary} |`,
  ),
]

export const generateMessageCatalogs = (document: OpenApiDocument) =>
  operationRegistry.map((entry) => {
    const operation = document['paths']?.[entry.path]?.[entry.method]
    const messages = messagesForOperation(document, entry)
    const levelCounts = messages.reduce<Record<string, number>>((counts, message) => {
      counts[message.level] = (counts[message.level] ?? 0) + 1
      return counts
    }, {})
    const levelSummary = Object.entries(levelCounts)
      .map(([level, count]) => `${level}:${count}`)
      .join(', ')
    const detailSections = messages
      .map(
        (message) =>
          `### \`${message.catalogId}\` \`${message.messageId}\`\n\n| 項目 | 内容 |\n| --- | --- |\n| id | \`${message.catalogId}\` |\n| message_id | \`${message.messageId}\` |\n| level | \`${message.level}\` |\n| status | ${message.status} |\n| ログ概要 | ${message.summary} |\n| 説明 | ${message.when} |\n| 対応すべきこと | ${message.operatorAction} |\n| context | ${message.contextModel} |\n`,
      )
      .join('\n')

    const content = `${generatedHeader}# Message catalog: \`${entry.contract.markdownSlug}\`\n\n## API\n\n| 項目 | 値 |\n| --- | --- |\n| operationId | \`${entry.contract.operationId}\` |\n| method/path | ${entry.method.toUpperCase()} \`${entry.path}\` |\n| summary | ${operation?.summary ?? entry.contract.businessSummary} |\n| messages | ${messages.length} |\n| levels | ${levelSummary || 'なし'} |\n\n## 生成・検証方針\n\n- Message catalogはOpenAPI responsesの4xx/5xx statusを一次情報にする。\n- 4xxはWARNING、5xxはERRORとして分類する。\n- \`message_id\` は \`<operationId>.<status分類>\` の形式で安定生成する。\n- レスポンス定義を変更した場合は \`npm run docs:generate --workspace @saphnexa/api\` で更新する。\n\n## メッセージ一覧\n\n${renderMessageRows(messages).join('\n')}\n\n## ログ詳細\n\n${detailSections || '対象メッセージなし。\n'}\n## strict検証で要求する項目\n\n| Level | 必須項目 |\n| --- | --- |\n| \`WARNING\` | why_production |\n| \`ERROR\` | check_procedure, context_model, runbook |\n| \`CRITICAL\` | remediation_procedure, context_model, runbook, escalation |\n`
    return {
      path: `../../docs/spec/40.apis/${entry.contract.markdownSlug}/messages_gen.md`,
      content,
    }
  })

export const generateMessageIndex = (document: OpenApiDocument) => {
  const rows = [
    '| API | id | message_id | level | status | ログ概要 |',
    '| --- | --- | --- | --- | --- | --- |',
  ]
  for (const entry of operationRegistry) {
    for (const message of messagesForOperation(document, entry)) {
      rows.push(
        `| \`${entry.contract.markdownSlug}\` | \`${message.catalogId}\` | \`${message.messageId}\` | \`${message.level}\` | ${message.status} | ${message.summary} |`,
      )
    }
  }
  return `${generatedHeader}# API Message catalog index\n\n${rows.join('\n')}\n`
}
