<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# アップロードURLを発行する

## 概要

文書アップロード用のS3 Presigned URLを発行する

## 基本情報

- Method: `POST`
- Path: `/api/documents/upload-url`
- Operation ID: `createDocumentUploadUrl`
- Tag: `documents`
- 認証方式: `bearer`
- 必要権限: `documents:write`

## レスポンス

| Status | Description     |
| ------ | --------------- |
| 200    | アップロードURL |
| 400    | 入力検証エラー  |
| 401    | 認証エラー      |
| 500    | 想定外エラー    |

## レスポンス例

```json
{
  "documentId": "00000000-0000-4000-8000-000000000000",
  "uploadUrl": "https://example.com/upload",
  "expiresAt": "2026-01-01T00:15:00.000Z"
}
```

## curl例

```bash
curl -s http://localhost:8787/api/documents/upload-url
```
