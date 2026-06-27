<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# API一覧

| Method | Path                          | Operation ID              | Summary                   | Auth   |
| ------ | ----------------------------- | ------------------------- | ------------------------- | ------ |
| GET    | `/`                           | `getRoot`                 | API情報を取得する         | none   |
| GET    | `/health`                     | `getHealth`               | 稼働状態を取得する        | none   |
| POST   | `/api/chat`                   | `postChat`                | RAGチャットに質問する     | bearer |
| POST   | `/api/documents/upload-url`   | `createDocumentUploadUrl` | アップロードURLを発行する | bearer |
| GET    | `/api/documents`              | `listDocuments`           | 文書一覧を取得する        | bearer |
| DELETE | `/api/documents/{documentId}` | `deleteDocument`          | 文書削除を受け付ける      | bearer |
