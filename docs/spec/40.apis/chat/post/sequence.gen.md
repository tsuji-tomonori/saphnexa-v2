<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# post sequence

```mermaid
sequenceDiagram
  autonumber
  participant User as User
  participant API as API
  User->>API: POST /api/chat
  alt 入力検証エラー の場合。
  API-->>User: HTTP 400 Bad Request
  Note over User,API: 入力検証エラー
  end
  alt 認証エラー の場合。
  API-->>User: HTTP 401 Unauthorized
  Note over User,API: 認証エラー
  end
  API->>API: createChatEvents を実行する
  alt createChatEvents が ApiError(500) を送出した場合。
  API-->>User: HTTP 500 Internal Server Error
  Note over User,API: RAG回答生成に失敗しました
  end
  alt createChatEvents が ApiError(500) を送出した場合。
  API-->>User: HTTP 500 Internal Server Error
  Note over User,API: RAGストリームを解析できません
  end
  API-->>User: HTTP 200 OK
```
