<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# アップロードURLを発行する 詳細設計

## 目的

文書アップロード用のS3 Presigned URLを発行する

## API契約

- Method: `POST`
- Path: `/api/documents/upload-url`
- Operation ID: `createDocumentUploadUrl`
- Tag: `documents`
- 認証方式: `bearer`
- 必要権限: `documents:write`

## 入力

### パラメータ

なし

### リクエストボディ

- Required: yes
- Content-Type: `application/json`

## 処理フロー

1. `apps/api/src/operations/documents/upload-url/schemas.ts` のZod schemaで入力を検証する。
2. `apps/api/src/operations/documents/upload-url/route.ts` のroute handlerで検証済み入力を受け取り、use caseへ渡す。
3. `apps/api/src/operations/documents/upload-url/use-case.ts` で業務処理を実行する。
4. 成功時は `apps/api/src/operations/documents/upload-url/samples.ts` と同じ形のレスポンスを返す。
5. エラー時は共通HTTPエラーハンドリングでAPIエラーレスポンスへ変換する。

## 出力・エラー

| Status | Description     |
| ------ | --------------- |
| 200    | アップロードURL |
| 400    | 入力検証エラー  |
| 401    | 認証エラー      |
| 403    | 認可エラー      |
| 500    | 想定外エラー    |

## 主要ソース

- 契約: `apps/api/src/operations/documents/upload-url/contract.ts`
- schema: `apps/api/src/operations/documents/upload-url/schemas.ts`
- route: `apps/api/src/operations/documents/upload-url/route.ts`
- use case: `apps/api/src/operations/documents/upload-url/use-case.ts`
- sample: `apps/api/src/operations/documents/upload-url/samples.ts`
- test: `apps/api/src/operations/documents/upload-url/route.test.ts`

## レスポンス例

```json
{
  "documentId": "00000000-0000-4000-8000-000000000000",
  "uploadUrl": "https://example.com/upload",
  "expiresAt": "2026-01-01T00:15:00.000Z"
}
```
