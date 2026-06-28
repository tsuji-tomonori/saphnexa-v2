<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# 文書一覧を取得する 詳細設計

## 目的

登録済み文書と取込状態の一覧を返す

## API契約

- Method: `GET`
- Path: `/api/documents`
- Operation ID: `listDocuments`
- Tag: `documents`
- 認証方式: `bearer`
- 必要権限: `documents:read`

## 入力

### パラメータ

なし

### リクエストボディ

なし

## 処理フロー

1. `apps/api/src/operations/documents/list/schemas.ts` のZod schemaで入力を検証する。
2. `apps/api/src/operations/documents/list/route.ts` のroute handlerで検証済み入力を受け取り、use caseへ渡す。
3. `apps/api/src/operations/documents/list/use-case.ts` で業務処理を実行する。
4. 成功時は `apps/api/src/operations/documents/list/samples.ts` と同じ形のレスポンスを返す。
5. エラー時は共通HTTPエラーハンドリングでAPIエラーレスポンスへ変換する。

## 出力・エラー

| Status | Description  |
| ------ | ------------ |
| 200    | 文書一覧     |
| 401    | 認証エラー   |
| 403    | 認可エラー   |
| 500    | 想定外エラー |

## 主要ソース

- 契約: `apps/api/src/operations/documents/list/contract.ts`
- schema: `apps/api/src/operations/documents/list/schemas.ts`
- route: `apps/api/src/operations/documents/list/route.ts`
- use case: `apps/api/src/operations/documents/list/use-case.ts`
- sample: `apps/api/src/operations/documents/list/samples.ts`
- test: `apps/api/src/operations/documents/list/route.test.ts`

## レスポンス例

```json
{
  "documents": []
}
```
