<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# RAGチャットに質問する 詳細設計

## 目的

単一ナレッジベースに対する質問を受け付け、回答と引用元をSSEで返す

## API契約

- Method: `POST`
- Path: `/api/chat`
- Operation ID: `postChat`
- Tag: `chat`
- 認証方式: `bearer`
- 必要権限: `chat:write`

## 入力

### パラメータ

なし

### リクエストボディ

- Required: yes
- Content-Type: `application/json`

## 処理フロー

1. `apps/api/src/operations/chat/post/schemas.ts` のZod schemaで入力を検証する。
2. `apps/api/src/operations/chat/post/route.ts` のroute handlerで検証済み入力を受け取り、use caseへ渡す。
3. `apps/api/src/operations/chat/post/use-case.ts` で業務処理を実行する。
4. 成功時は `apps/api/src/operations/chat/post/samples.ts` と同じ形のレスポンスを返す。
5. エラー時は共通HTTPエラーハンドリングでAPIエラーレスポンスへ変換する。

## 出力・エラー

| Status | Description               |
| ------ | ------------------------- |
| 200    | SSE形式のチャットイベント |
| 400    | 入力検証エラー            |
| 401    | 認証エラー                |
| 403    | 認可エラー                |
| 500    | 想定外エラー              |

## 主要ソース

- 契約: `apps/api/src/operations/chat/post/contract.ts`
- schema: `apps/api/src/operations/chat/post/schemas.ts`
- route: `apps/api/src/operations/chat/post/route.ts`
- use case: `apps/api/src/operations/chat/post/use-case.ts`
- sample: `apps/api/src/operations/chat/post/samples.ts`
- test: `apps/api/src/operations/chat/post/route.test.ts`

## レスポンス例

```json
{
  "type": "done",
  "messageId": "sample-message-id"
}
```
