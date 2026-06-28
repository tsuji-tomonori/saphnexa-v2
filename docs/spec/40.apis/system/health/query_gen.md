<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# getHealth query

## 概要

APIプロセスの稼働状態を返す

## 基本情報

- Method: `GET`
- Path: `/health`
- Operation ID: `getHealth`

## リクエストパラメータ

| 場所               | 項目               | 型                  | required | 説明                         |
| ------------------ | ------------------ | ------------------- | -------- | ---------------------------- |
| <code>query</code> | <code>fail</code>  | <code>string</code> | no       | 業務エラー確認用のテスト入力 |
| <code>query</code> | <code>throw</code> | <code>string</code> | no       | 想定外例外確認用のテスト入力 |
