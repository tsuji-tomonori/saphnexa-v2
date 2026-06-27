<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# RAGチャットに質問する

## 概要

単一ナレッジベースに対する質問を受け付け、回答と引用元をSSEで返す

## 基本情報

- Method: `POST`
- Path: `/api/chat`
- Operation ID: `postChat`
- Tag: `chat`
- 認証方式: `bearer`
- 必要権限: `chat:write`

## レスポンス

| Status | Description               |
| ------ | ------------------------- |
| 200    | SSE形式のチャットイベント |
| 400    | 入力検証エラー            |
| 401    | 認証エラー                |
| 403    | 認可エラー                |
| 500    | 想定外エラー              |

## レスポンス例

```json
{
  "type": "done",
  "messageId": "sample-message-id"
}
```

## curl例

```bash
curl -s http://localhost:8787/api/chat
```
