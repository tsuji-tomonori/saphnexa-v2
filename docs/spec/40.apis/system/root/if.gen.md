<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# API情報を取得する

## 概要

API名と簡易ステータスを返す

## 基本情報

- Method: `GET`
- Path: `/`
- Operation ID: `getRoot`
- Tag: `system`
- 認証方式: `none`
- 必要権限: なし

## レスポンス

| Status | Description    |
| ------ | -------------- |
| 200    | API情報        |
| 400    | 入力検証エラー |
| 500    | 想定外エラー   |

## レスポンス例

```json
{
  "name": "saphnexa-api",
  "status": "ok"
}
```

## curl例

```bash
curl -s http://localhost:8787/
```
