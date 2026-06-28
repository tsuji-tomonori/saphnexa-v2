<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# Message catalog: `documents/delete`

## API

| 項目        | 値                                   |
| ----------- | ------------------------------------ |
| operationId | `deleteDocument`                     |
| method/path | DELETE `/api/documents/{documentId}` |
| summary     | 文書削除を受け付ける                 |
| messages    | 5                                    |
| levels      | WARNING:4, ERROR:1                   |

## 生成・検証方針

- Message catalogはOpenAPI responsesの4xx/5xx statusを一次情報にする。
- 4xxはWARNING、5xxはERRORとして分類する。
- `message_id` は `<operationId>.<status分類>` の形式で安定生成する。
- レスポンス定義を変更した場合は `npm run docs:generate --workspace @saphnexa/api` で更新する。

## メッセージ一覧

| id     | message_id                               | level     | status | ログ概要         |
| ------ | ---------------------------------------- | --------- | ------ | ---------------- |
| `M001` | `deleteDocument.validation_failed`       | `WARNING` | 400    | 入力検証エラー   |
| `M002` | `deleteDocument.authentication_required` | `WARNING` | 401    | 認証エラー       |
| `M003` | `deleteDocument.permission_denied`       | `WARNING` | 403    | 認可エラー       |
| `M004` | `deleteDocument.resource_not_found`      | `WARNING` | 404    | 文書が存在しない |
| `M005` | `deleteDocument.unexpected_error`        | `ERROR`   | 500    | 想定外エラー     |

## ログ詳細

### `M001` `deleteDocument.validation_failed`

| 項目           | 内容                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| id             | `M001`                                                                 |
| message_id     | `deleteDocument.validation_failed`                                     |
| level          | `WARNING`                                                              |
| status         | 400                                                                    |
| ログ概要       | 入力検証エラー                                                         |
| 説明           | DELETE /api/documents/{documentId} が 400 responseを返す場合。         |
| 対応すべきこと | リクエスト内容、schema、入力値を確認する。                             |
| context        | traceId, operationId, api.method, api.path, api.statusCode, error.code |

### `M002` `deleteDocument.authentication_required`

| 項目           | 内容                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| id             | `M002`                                                                 |
| message_id     | `deleteDocument.authentication_required`                               |
| level          | `WARNING`                                                              |
| status         | 401                                                                    |
| ログ概要       | 認証エラー                                                             |
| 説明           | DELETE /api/documents/{documentId} が 401 responseを返す場合。         |
| 対応すべきこと | 認証状態、権限、呼び出し元principalを確認する。                        |
| context        | traceId, operationId, api.method, api.path, api.statusCode, error.code |

### `M003` `deleteDocument.permission_denied`

| 項目           | 内容                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| id             | `M003`                                                                 |
| message_id     | `deleteDocument.permission_denied`                                     |
| level          | `WARNING`                                                              |
| status         | 403                                                                    |
| ログ概要       | 認可エラー                                                             |
| 説明           | DELETE /api/documents/{documentId} が 403 responseを返す場合。         |
| 対応すべきこと | 認証状態、権限、呼び出し元principalを確認する。                        |
| context        | traceId, operationId, api.method, api.path, api.statusCode, error.code |

### `M004` `deleteDocument.resource_not_found`

| 項目           | 内容                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| id             | `M004`                                                                 |
| message_id     | `deleteDocument.resource_not_found`                                    |
| level          | `WARNING`                                                              |
| status         | 404                                                                    |
| ログ概要       | 文書が存在しない                                                       |
| 説明           | DELETE /api/documents/{documentId} が 404 responseを返す場合。         |
| 対応すべきこと | 対象リソースIDと存在状態を確認する。                                   |
| context        | traceId, operationId, api.method, api.path, api.statusCode, error.code |

### `M005` `deleteDocument.unexpected_error`

| 項目           | 内容                                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| id             | `M005`                                                                                |
| message_id     | `deleteDocument.unexpected_error`                                                     |
| level          | `ERROR`                                                                               |
| status         | 500                                                                                   |
| ログ概要       | 想定外エラー                                                                          |
| 説明           | DELETE /api/documents/{documentId} が 500 responseを返す場合。                        |
| 対応すべきこと | 同一traceIdのログ、直近deploy、依存サービス状態を確認する。                           |
| context        | traceId, operationId, api.method, api.path, api.statusCode, error.code, error.message |

## strict検証で要求する項目

| Level      | 必須項目                                                  |
| ---------- | --------------------------------------------------------- |
| `WARNING`  | why_production                                            |
| `ERROR`    | check_procedure, context_model, runbook                   |
| `CRITICAL` | remediation_procedure, context_model, runbook, escalation |
