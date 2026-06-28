import type { ApiContract } from '../types.js'

export const uploadUrlContract = {
  operationId: 'createDocumentUploadUrl',
  markdownSlug: 'documents/upload-url',
  authMode: 'bearer',
  businessSummary: '文書アップロード用のS3 Presigned URLを発行する',
  permissions: ['documents:write'],
} as const satisfies ApiContract

export const listDocumentsContract = {
  operationId: 'listDocuments',
  markdownSlug: 'documents/list',
  authMode: 'bearer',
  businessSummary: '登録済み文書と取込状態の一覧を返す',
  permissions: ['documents:read'],
} as const satisfies ApiContract

export const deleteDocumentContract = {
  operationId: 'deleteDocument',
  markdownSlug: 'documents/delete',
  authMode: 'bearer',
  businessSummary: '文書と関連する保存データの削除を受け付ける',
  permissions: ['documents:write'],
} as const satisfies ApiContract
