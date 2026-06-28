<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# 稼働状態を取得する 詳細設計

## 目的

APIプロセスの稼働状態を返す

## API契約

- Method: `GET`
- Path: `/health`
- Operation ID: `getHealth`
- Tag: `system`
- 認証方式: `none`
- 必要権限: なし

## 入力

### パラメータ

| In    | Name    | Required | Description                  |
| ----- | ------- | -------- | ---------------------------- |
| query | `fail`  | no       | 業務エラー確認用のテスト入力 |
| query | `throw` | no       | 想定外例外確認用のテスト入力 |

### リクエストボディ

なし

## 処理フロー

1. `apps/api/src/operations/system/health/schemas.ts` のZod schemaで入力を検証する。
2. `apps/api/src/operations/system/health/route.ts` のroute handlerで検証済み入力を受け取り、use caseへ渡す。
3. `apps/api/src/operations/system/health/use-case.ts` で業務処理を実行する。
4. 成功時は `apps/api/src/operations/system/health/samples.ts` と同じ形のレスポンスを返す。
5. エラー時は共通HTTPエラーハンドリングでAPIエラーレスポンスへ変換する。

## 出力・エラー

| Status | Description        |
| ------ | ------------------ |
| 200    | 正常に稼働している |
| 400    | 入力検証エラー     |
| 409    | 業務エラー         |
| 500    | 想定外エラー       |

## 主要ソース

- 契約: `apps/api/src/operations/system/health/contract.ts`
- schema: `apps/api/src/operations/system/health/schemas.ts`
- route: `apps/api/src/operations/system/health/route.ts`
- use case: `apps/api/src/operations/system/health/use-case.ts`
- sample: `apps/api/src/operations/system/health/samples.ts`
- test: `apps/api/src/operations/system/health/route.test.ts`

## レスポンス例

```json
{
  "status": "ok"
}
```
