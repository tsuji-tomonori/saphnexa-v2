<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# Message catalog: `documents/list`

## API

| 項目        | 値                   |
| ----------- | -------------------- |
| operationId | `listDocuments`      |
| method/path | GET `/api/documents` |
| summary     | 文書一覧を取得する   |
| messages    | 3                    |
| levels      | WARNING:2, ERROR:1   |

## 生成・検証方針

- Message catalogはOpenAPI responsesの4xx/5xx statusを一次情報にする。
- 4xxはWARNING、5xxはERRORとして分類する。
- `message_id` は `<operationId>.<status分類>` の形式で安定生成する。
- レスポンス定義を変更した場合は `npm run docs:generate --workspace @saphnexa/api` で更新する。

## メッセージ一覧

| id     | message_id                              | level     | status | ログ概要     |
| ------ | --------------------------------------- | --------- | ------ | ------------ |
| `M001` | `listDocuments.authentication_required` | `WARNING` | 401    | 認証エラー   |
| `M002` | `listDocuments.permission_denied`       | `WARNING` | 403    | 認可エラー   |
| `M003` | `listDocuments.unexpected_error`        | `ERROR`   | 500    | 想定外エラー |

## ログ詳細

### `M001` `listDocuments.authentication_required`

| 項目           | 内容                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| id             | `M001`                                                                 |
| message_id     | `listDocuments.authentication_required`                                |
| level          | `WARNING`                                                              |
| status         | 401                                                                    |
| ログ概要       | 認証エラー                                                             |
| 説明           | GET /api/documents が 401 responseを返す場合。                         |
| 対応すべきこと | 認証状態、権限、呼び出し元principalを確認する。                        |
| context        | traceId, operationId, api.method, api.path, api.statusCode, error.code |

### `M002` `listDocuments.permission_denied`

| 項目           | 内容                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| id             | `M002`                                                                 |
| message_id     | `listDocuments.permission_denied`                                      |
| level          | `WARNING`                                                              |
| status         | 403                                                                    |
| ログ概要       | 認可エラー                                                             |
| 説明           | GET /api/documents が 403 responseを返す場合。                         |
| 対応すべきこと | 認証状態、権限、呼び出し元principalを確認する。                        |
| context        | traceId, operationId, api.method, api.path, api.statusCode, error.code |

### `M003` `listDocuments.unexpected_error`

| 項目           | 内容                                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| id             | `M003`                                                                                |
| message_id     | `listDocuments.unexpected_error`                                                      |
| level          | `ERROR`                                                                               |
| status         | 500                                                                                   |
| ログ概要       | 想定外エラー                                                                          |
| 説明           | GET /api/documents が 500 responseを返す場合。                                        |
| 対応すべきこと | 同一traceIdのログ、直近deploy、依存サービス状態を確認する。                           |
| context        | traceId, operationId, api.method, api.path, api.statusCode, error.code, error.message |

## strict検証で要求する項目

| Level      | 必須項目                                                  |
| ---------- | --------------------------------------------------------- |
| `WARNING`  | why_production                                            |
| `ERROR`    | check_procedure, context_model, runbook                   |
| `CRITICAL` | remediation_procedure, context_model, runbook, escalation |
