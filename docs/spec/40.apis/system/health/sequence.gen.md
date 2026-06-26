<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# health sequence

```mermaid
sequenceDiagram
  autonumber
  participant User as User
  participant API as API
  User->>API: GET /health
  alt Query が型または制約に一致しない場合。
  API-->>User: HTTP 400 Bad Request
  Note over User,API: 入力検証エラー
  end
  API->>API: APIプロセスの稼働状態を取得する。
  alt 業務上の異常状態を検出した場合。
  API-->>User: HTTP 409 Conflict
  Note over User,API: 業務エラー
  end
  alt Router で捕捉されない想定外例外が発生した場合。
  API-->>User: HTTP 500 Internal Server Error
  Note over User,API: 想定外エラー
  end
  API-->>User: HTTP 200 OK
```
