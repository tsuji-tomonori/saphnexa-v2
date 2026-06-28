<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# 文書削除を受け付ける 詳細設計

## 目的

文書と関連する保存データの削除を受け付ける

## API契約

- Method: `DELETE`
- Path: `/api/documents/{documentId}`
- Operation ID: `deleteDocument`
- Tag: `documents`
- 認証方式: `bearer`
- 必要権限: `documents:write`

## 入力

### パラメータ

| In   | Name         | Required | Description |
| ---- | ------------ | -------- | ----------- |
| path | `documentId` | yes      | 文書ID      |

### リクエストボディ

なし

## 処理フロー

1. `apps/api/src/operations/documents/delete/schemas.ts` のZod schemaで入力を検証する。
2. `apps/api/src/operations/documents/delete/route.ts` のroute handlerで検証済み入力を受け取り、use caseへ渡す。
3. `apps/api/src/operations/documents/delete/use-case.ts` で業務処理を実行する。
4. 成功時は `apps/api/src/operations/documents/delete/samples.ts` と同じ形のレスポンスを返す。
5. エラー時は共通HTTPエラーハンドリングでAPIエラーレスポンスへ変換する。

## 出力・エラー

| Status | Description      |
| ------ | ---------------- |
| 202    | 削除を受け付けた |
| 400    | 入力検証エラー   |
| 401    | 認証エラー       |
| 403    | 認可エラー       |
| 404    | 文書が存在しない |
| 500    | 想定外エラー     |

## 主要ソース

- 契約: `apps/api/src/operations/documents/delete/contract.ts`
- schema: `apps/api/src/operations/documents/delete/schemas.ts`
- route: `apps/api/src/operations/documents/delete/route.ts`
- use case: `apps/api/src/operations/documents/delete/use-case.ts`
- sample: `apps/api/src/operations/documents/delete/samples.ts`
- test: `apps/api/src/operations/documents/delete/route.test.ts`

## レスポンス例

```json
null
```
