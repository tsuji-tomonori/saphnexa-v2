<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# 稼働状態を取得する

## 概要

APIプロセスの稼働状態を返す

## 基本情報

- Method: `GET`
- Path: `/health`
- Operation ID: `getHealth`
- Tag: `system`
- 認証方式: `none`
- 必要権限: なし

## レスポンス

| Status | Description        |
| ------ | ------------------ |
| 200    | 正常に稼働している |
| 400    | 入力検証エラー     |
| 409    | 業務エラー         |
| 500    | 想定外エラー       |

## レスポンス例

```json
{
  "status": "ok"
}
```

## curl例

```bash
curl -s http://localhost:8787/health
```
