/* eslint-disable max-lines-per-function -- APIシナリオを1ファイル内で読みやすく並べるため */
import { afterEach, describe, expect, it } from 'vitest'

import { createApp } from '../../app.js'
import { clearDocumentsForTest } from '../../shared/storage/documents.js'
import { CreateUploadUrlResponseSchema, DocumentListResponseSchema } from './schemas.js'

describe('documents API', () => {
  afterEach(() => {
    clearDocumentsForTest()
    delete process.env['AUTH_DISABLED']
    delete process.env['AUTH_DISABLED_SCOPES']
    delete process.env['DOCUMENT_BUCKET_NAME']
    delete process.env['AWS_ACCESS_KEY_ID']
    delete process.env['AWS_SECRET_ACCESS_KEY']
    delete process.env['S3_DELETE_DISABLED']
  })

  it('Bearerトークンなしの文書一覧を401にする', async () => {
    const response = await createApp().request('/api/documents')
    expect(response.status).toBe(401)
  })

  it('必要な権限がない文書操作を403にする', async () => {
    process.env['AUTH_DISABLED'] = 'true'
    process.env['AUTH_DISABLED_SCOPES'] = 'documents:read'

    const response = await createApp().request('/api/documents/upload-url', {
      method: 'POST',
      headers: { authorization: 'Bearer test', 'content-type': 'application/json' },
      body: JSON.stringify({ fileName: 'guide.pdf', contentType: 'application/pdf', fileSize: 1024 }),
    })

    expect(response.status).toBe(403)
  })

  it('アップロードURL発行後に文書一覧へuploading状態を返す', async () => {
    process.env['AUTH_DISABLED'] = 'true'
    process.env['DOCUMENT_BUCKET_NAME'] = 'test-bucket'
    process.env['AWS_ACCESS_KEY_ID'] = 'test-access-key'
    process.env['AWS_SECRET_ACCESS_KEY'] = 'test-secret-key'

    const app = createApp()
    const uploadResponse = await app.request('/api/documents/upload-url', {
      method: 'POST',
      headers: { authorization: 'Bearer test', 'content-type': 'application/json' },
      body: JSON.stringify({ fileName: 'guide.pdf', contentType: 'application/pdf', fileSize: 1024 }),
    })
    expect(uploadResponse.status).toBe(200)
    const uploadBody = CreateUploadUrlResponseSchema.parse(await uploadResponse.json())
    expect(uploadBody.uploadUrl).toContain('test-bucket')

    const listResponse = await app.request('/api/documents', {
      headers: { authorization: 'Bearer test' },
    })
    expect(listResponse.status).toBe(200)
    const listBody = DocumentListResponseSchema.parse(await listResponse.json())
    expect(listBody.documents).toMatchObject([
      { id: uploadBody.documentId, fileName: 'guide.pdf', status: 'uploading' },
    ])
  })

  it('文書削除で202を返し一覧から除外する', async () => {
    process.env['AUTH_DISABLED'] = 'true'
    process.env['DOCUMENT_BUCKET_NAME'] = 'test-bucket'
    process.env['AWS_ACCESS_KEY_ID'] = 'test-access-key'
    process.env['AWS_SECRET_ACCESS_KEY'] = 'test-secret-key'
    process.env['S3_DELETE_DISABLED'] = 'true'

    const app = createApp()
    const uploadResponse = await app.request('/api/documents/upload-url', {
      method: 'POST',
      headers: { authorization: 'Bearer test', 'content-type': 'application/json' },
      body: JSON.stringify({ fileName: 'delete.pdf', contentType: 'application/pdf', fileSize: 1024 }),
    })
    const { documentId } = CreateUploadUrlResponseSchema.parse(await uploadResponse.json())

    const deleteResponse = await app.request(`/api/documents/${documentId}`, {
      method: 'DELETE',
      headers: { authorization: 'Bearer test' },
    })
    expect(deleteResponse.status).toBe(202)

    const listResponse = await app.request('/api/documents', { headers: { authorization: 'Bearer test' } })
    expect(DocumentListResponseSchema.parse(await listResponse.json()).documents).toEqual([])
  })

  it('S3削除失敗時は文書をfailed状態で一覧に戻す', async () => {
    process.env['AUTH_DISABLED'] = 'true'
    process.env['DOCUMENT_BUCKET_NAME'] = 'test-bucket'
    process.env['AWS_ACCESS_KEY_ID'] = 'test-access-key'
    process.env['AWS_SECRET_ACCESS_KEY'] = 'test-secret-key'

    const app = createApp()
    const uploadResponse = await app.request('/api/documents/upload-url', {
      method: 'POST',
      headers: { authorization: 'Bearer test', 'content-type': 'application/json' },
      body: JSON.stringify({ fileName: 'failed-delete.pdf', contentType: 'application/pdf', fileSize: 1024 }),
    })
    const { documentId } = CreateUploadUrlResponseSchema.parse(await uploadResponse.json())

    const deleteResponse = await app.request(`/api/documents/${documentId}`, {
      method: 'DELETE',
      headers: { authorization: 'Bearer test' },
    })
    expect(deleteResponse.status).toBe(500)

    const listResponse = await app.request('/api/documents', { headers: { authorization: 'Bearer test' } })
    expect(DocumentListResponseSchema.parse(await listResponse.json()).documents).toMatchObject([
      { id: documentId, fileName: 'failed-delete.pdf', status: 'failed', errorMessage: '文書削除に失敗しました' },
    ])
  })
})
