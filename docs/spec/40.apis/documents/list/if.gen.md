<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# 文書一覧を取得する

## 概要

登録済み文書と取込状態の一覧を返す

## 基本情報

- Method: `GET`
- Path: `/api/documents`
- Operation ID: `listDocuments`
- Tag: `documents`
- 認証方式: `bearer`
- 必要権限: `documents:read`

## レスポンス

| Status | Description  |
| ------ | ------------ |
| 200    | 文書一覧     |
| 401    | 認証エラー   |
| 403    | 認可エラー   |
| 500    | 想定外エラー |

## レスポンス例

```json
{
  "documents": []
}
```

## curl例

```bash
curl -s http://localhost:8787/api/documents
```
