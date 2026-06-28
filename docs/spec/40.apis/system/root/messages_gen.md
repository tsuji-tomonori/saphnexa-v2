<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# Message catalog: `system/root`

## API

| 項目        | 値                 |
| ----------- | ------------------ |
| operationId | `getRoot`          |
| method/path | GET `/`            |
| summary     | API情報を取得する  |
| messages    | 2                  |
| levels      | WARNING:1, ERROR:1 |

## 生成・検証方針

- Message catalogはOpenAPI responsesの4xx/5xx statusを一次情報にする。
- 4xxはWARNING、5xxはERRORとして分類する。
- `message_id` は `<operationId>.<status分類>` の形式で安定生成する。
- レスポンス定義を変更した場合は `npm run docs:generate --workspace @saphnexa/api` で更新する。

## メッセージ一覧

| id     | message_id                  | level     | status | ログ概要       |
| ------ | --------------------------- | --------- | ------ | -------------- |
| `M001` | `getRoot.validation_failed` | `WARNING` | 400    | 入力検証エラー |
| `M002` | `getRoot.unexpected_error`  | `ERROR`   | 500    | 想定外エラー   |

## ログ詳細

### `M001` `getRoot.validation_failed`

| 項目           | 内容                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| id             | `M001`                                                                 |
| message_id     | `getRoot.validation_failed`                                            |
| level          | `WARNING`                                                              |
| status         | 400                                                                    |
| ログ概要       | 入力検証エラー                                                         |
| 説明           | GET / が 400 responseを返す場合。                                      |
| 対応すべきこと | リクエスト内容、schema、入力値を確認する。                             |
| context        | traceId, operationId, api.method, api.path, api.statusCode, error.code |

### `M002` `getRoot.unexpected_error`

| 項目           | 内容                                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| id             | `M002`                                                                                |
| message_id     | `getRoot.unexpected_error`                                                            |
| level          | `ERROR`                                                                               |
| status         | 500                                                                                   |
| ログ概要       | 想定外エラー                                                                          |
| 説明           | GET / が 500 responseを返す場合。                                                     |
| 対応すべきこと | 同一traceIdのログ、直近deploy、依存サービス状態を確認する。                           |
| context        | traceId, operationId, api.method, api.path, api.statusCode, error.code, error.message |

## strict検証で要求する項目

| Level      | 必須項目                                                  |
| ---------- | --------------------------------------------------------- |
| `WARNING`  | why_production                                            |
| `ERROR`    | check_procedure, context_model, runbook                   |
| `CRITICAL` | remediation_procedure, context_model, runbook, escalation |
