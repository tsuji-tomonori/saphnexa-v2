<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# API情報を取得する 詳細設計

## 目的

API名と簡易ステータスを返す

## API契約

- Method: `GET`
- Path: `/`
- Operation ID: `getRoot`
- Tag: `system`
- 認証方式: `none`
- 必要権限: なし

## 入力

### パラメータ

なし

### リクエストボディ

なし

## 処理フロー

1. `apps/api/src/operations/system/root/schemas.ts` のZod schemaで入力を検証する。
2. `apps/api/src/operations/system/root/route.ts` のroute handlerで検証済み入力を受け取り、use caseへ渡す。
3. `apps/api/src/operations/system/root/use-case.ts` で業務処理を実行する。
4. 成功時は `apps/api/src/operations/system/root/samples.ts` と同じ形のレスポンスを返す。
5. エラー時は共通HTTPエラーハンドリングでAPIエラーレスポンスへ変換する。

## 出力・エラー

| Status | Description    |
| ------ | -------------- |
| 200    | API情報        |
| 400    | 入力検証エラー |
| 500    | 想定外エラー   |

## 主要ソース

- 契約: `apps/api/src/operations/system/root/contract.ts`
- schema: `apps/api/src/operations/system/root/schemas.ts`
- route: `apps/api/src/operations/system/root/route.ts`
- use case: `apps/api/src/operations/system/root/use-case.ts`
- sample: `apps/api/src/operations/system/root/samples.ts`
- test: `apps/api/src/operations/system/root/route.test.ts`

## レスポンス例

```json
{
  "name": "saphnexa-api",
  "status": "ok"
}
```
