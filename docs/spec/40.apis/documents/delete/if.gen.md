<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# 文書削除を受け付ける

## 概要

文書と関連する保存データの削除を受け付ける

## 基本情報

- Method: `DELETE`
- Path: `/api/documents/{documentId}`
- Operation ID: `deleteDocument`
- Tag: `documents`
- 認証方式: `bearer`
- 必要権限: `documents:write`

## レスポンス

| Status | Description      |
| ------ | ---------------- |
| 202    | 削除を受け付けた |
| 400    | 入力検証エラー   |
| 401    | 認証エラー       |
| 403    | 認可エラー       |
| 404    | 文書が存在しない |
| 500    | 想定外エラー     |

## レスポンス例

```json
null
```

## curl例

```bash
curl -s http://localhost:8787/api/documents/{documentId}
```
