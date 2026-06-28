<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# API Message catalog index

| API                    | id     | message_id                                        | level     | status | ログ概要         |
| ---------------------- | ------ | ------------------------------------------------- | --------- | ------ | ---------------- |
| `system/root`          | `M001` | `getRoot.validation_failed`                       | `WARNING` | 400    | 入力検証エラー   |
| `system/root`          | `M002` | `getRoot.unexpected_error`                        | `ERROR`   | 500    | 想定外エラー     |
| `system/health`        | `M001` | `getHealth.validation_failed`                     | `WARNING` | 400    | 入力検証エラー   |
| `system/health`        | `M002` | `getHealth.business_conflict`                     | `WARNING` | 409    | 業務エラー       |
| `system/health`        | `M003` | `getHealth.unexpected_error`                      | `ERROR`   | 500    | 想定外エラー     |
| `chat/post`            | `M001` | `postChat.validation_failed`                      | `WARNING` | 400    | 入力検証エラー   |
| `chat/post`            | `M002` | `postChat.authentication_required`                | `WARNING` | 401    | 認証エラー       |
| `chat/post`            | `M003` | `postChat.permission_denied`                      | `WARNING` | 403    | 認可エラー       |
| `chat/post`            | `M004` | `postChat.unexpected_error`                       | `ERROR`   | 500    | 想定外エラー     |
| `documents/upload-url` | `M001` | `createDocumentUploadUrl.validation_failed`       | `WARNING` | 400    | 入力検証エラー   |
| `documents/upload-url` | `M002` | `createDocumentUploadUrl.authentication_required` | `WARNING` | 401    | 認証エラー       |
| `documents/upload-url` | `M003` | `createDocumentUploadUrl.permission_denied`       | `WARNING` | 403    | 認可エラー       |
| `documents/upload-url` | `M004` | `createDocumentUploadUrl.unexpected_error`        | `ERROR`   | 500    | 想定外エラー     |
| `documents/list`       | `M001` | `listDocuments.authentication_required`           | `WARNING` | 401    | 認証エラー       |
| `documents/list`       | `M002` | `listDocuments.permission_denied`                 | `WARNING` | 403    | 認可エラー       |
| `documents/list`       | `M003` | `listDocuments.unexpected_error`                  | `ERROR`   | 500    | 想定外エラー     |
| `documents/delete`     | `M001` | `deleteDocument.validation_failed`                | `WARNING` | 400    | 入力検証エラー   |
| `documents/delete`     | `M002` | `deleteDocument.authentication_required`          | `WARNING` | 401    | 認証エラー       |
| `documents/delete`     | `M003` | `deleteDocument.permission_denied`                | `WARNING` | 403    | 認可エラー       |
| `documents/delete`     | `M004` | `deleteDocument.resource_not_found`               | `WARNING` | 404    | 文書が存在しない |
| `documents/delete`     | `M005` | `deleteDocument.unexpected_error`                 | `ERROR`   | 500    | 想定外エラー     |
